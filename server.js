require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = 'claude-sonnet-5';
const DEFAULT_ACCOUNT_CODE = 'defaut';
const ACCOUNTS_DIR = path.join(__dirname, 'accounts');

if (!fs.existsSync(ACCOUNTS_DIR)) fs.mkdirSync(ACCOUNTS_DIR, { recursive: true });

function sanitizeMapCode(code) {
  const clean = typeof code === 'string' ? code.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '') : '';
  return clean.slice(0, 24) || DEFAULT_ACCOUNT_CODE;
}

app.use(express.json({ limit: '200kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Protege la cle et le credit : nombre limite de requetes IA par minute et par visiteur
const AI_LIMIT_PER_MIN = 30;
const AI_LIMIT_PER_DAY = Number(process.env.AI_LIMIT_PER_DAY) || 1500; // plafond global : le credit ne peut pas exploser
const aiHits = new Map();
let aiDayCount = 0;
let aiDayStart = Date.now();
app.set('trust proxy', 1); // derriere l'hebergeur, req.ip doit etre l'IP du visiteur et pas celle du proxy
app.use(['/api/chat', '/api/quiz', '/api/fiche', '/api/video-search'], (req, res, next) => {
  const now = Date.now();
  if (now - aiDayStart > 86400000) { aiDayStart = now; aiDayCount = 0; }
  if (aiDayCount >= AI_LIMIT_PER_DAY) {
    return res.status(429).json({ error: "Le site a atteint sa limite d'utilisation pour aujourd'hui, reviens demain !" });
  }
  aiDayCount++;
  const hits = (aiHits.get(req.ip) || []).filter((t) => now - t < 60000);
  if (hits.length >= AI_LIMIT_PER_MIN) {
    return res.status(429).json({ error: 'Trop de demandes, attends une minute.' });
  }
  hits.push(now);
  aiHits.set(req.ip, hits);
  next();
});
setInterval(() => {
  const now = Date.now();
  for (const [ip, hits] of aiHits) {
    if (!hits.some((t) => now - t < 60000)) aiHits.delete(ip);
  }
}, 300000).unref();

async function callClaude(system, messages, maxTokens) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Erreur API Anthropic:', response.status, errText);
    throw new Error('claude_error');
  }

  const data = await response.json();
  const textBlock = data.content?.find(block => block.type === 'text');
  let rawText = textBlock?.text ?? '';
  rawText = rawText.replace(/^```json\s*|```\s*$/g, '').trim();
  return rawText;
}

function languageInstruction(language) {
  if (!language || language.toLowerCase() === 'français' || language.toLowerCase() === 'francais') return '';
  return `\n\nIMPORTANT : ecris absolument tout ton texte (les champs de reponse) en ${language}, pas en francais. Traduis aussi les notions/exemples dans cette langue.`;
}

function buildSystemPrompt(grade, subject, language) {
  const niveauInconnu = !grade;
  const contexteNiveau = niveauInconnu
    ? `L'eleve n'a pas precise son niveau scolaire. Tu dois le deviner toi-meme en observant comment il ecrit : ses fautes d'orthographe/grammaire, son vocabulaire, la complexite de ses phrases. S'il fait beaucoup de fautes ou utilise des mots simples, suppose un niveau plus jeune (primaire/college) et simplifie beaucoup. S'il ecrit avec aisance et un vocabulaire riche, suppose un niveau plus avance (lycee/superieur). Ajuste ton estimation au fil de la conversation si besoin, sans jamais demander explicitement "quel est ton niveau ?".`
    : `L'eleve est en ${grade}.`;

  return `Tu es un professeur virtuel patient et bienveillant qui aide un eleve a faire ses devoirs.

Contexte : ${contexteNiveau} Il travaille en ${subject || 'une matiere non precisee'}.

REGLE ABSOLUE : tu ne donnes JAMAIS la reponse finale ou la solution directement, meme si l'eleve insiste ou dit qu'il abandonne. A la place, tu guides avec la methode socratique : tu poses des questions, tu rappelles une notion, tu proposes un exemple plus simple, tu decoupes le probleme en petites etapes.

Style : phrases courtes, ton chaleureux et encourageant, vocabulaire et complexite adaptes au niveau de l'eleve (estime comme indique ci-dessus si besoin).

Apres chaque reponse, juge si l'eleve beneficierait de l'un de ces outils, en plus de ta reponse :
- "video" : s'il a besoin de voir une explication filmee sur la notion precise en cours (utile quand une explication visuelle/animee aiderait plus que du texte).
- "fiche" : s'il a besoin d'une fiche de cours ecrite et structuree sur la notion pour la reviser ou s'y referer.
- "quiz" : s'il semble avoir compris la notion et serait pret a s'entrainer avec des questions dessus.
Ne propose un outil que quand c'est vraiment pertinent pour ce qui vient d'etre dit, pas a chaque message. Si aucun n'est pertinent, mets null.

Tu dois repondre UNIQUEMENT avec un objet JSON valide, sans texte autour, sans balises markdown, au format exact :
{"reponse": "ce que tu dis a voix haute a l'eleve", "tableau": "texte court a ecrire au tableau (une notion, une formule, une etape - 80 caracteres max), ou null si rien a ecrire", "suggestion": "video" | "fiche" | "quiz" | null}${languageInstruction(language)}`;
}

function buildQuizPrompt(grade, subject, difficulty, language, mode, hasHistory) {
  const difficultyText = {
    facile: "L'eleve a eu du mal la derniere fois (0 ou 1 bonne reponse sur 5) : genere des questions plus simples et plus accessibles que d'habitude, pour le remettre en confiance.",
    difficile: "L'eleve a tout reussi la derniere fois (5/5) : genere des questions nettement plus difficiles et exigeantes que d'habitude pour le challenger.",
    normal: "Genere des questions de difficulte normale pour ce niveau.",
  }[difficulty] || "Genere des questions de difficulte normale pour ce niveau.";
  const historyText = hasHistory
    ? " Tiens compte de la conversation precedente avec l'eleve (les notions precises abordees, ses questions, ses difficultes) pour que les questions portent vraiment sur ce qu'il a travaille avec son professeur, adaptees a son niveau reel tel qu'il ressort de la conversation."
    : '';

  if (mode === 'ecrit') {
    return `Tu es un generateur de quiz pedagogique pour un eleve de ${grade || 'niveau non precise'} qui travaille sur le theme "${subject || 'general'}".

Genere exactement 5 questions a REPONSE ECRITE (pas de choix multiples) adaptees a ce niveau et ce theme, du plus facile au plus difficile. Les questions doivent etre plus elaborees et reflechies que de simples questions de calcul ou de vocabulaire brutes : demande d'expliquer un raisonnement, d'appliquer une notion a un exemple concret, de completer une phrase avec la bonne notion, etc., pour que l'eleve reflechisse vraiment avant de repondre. Malgre cela, la reponse attendue doit rester courte et precise a corriger (un mot, un nombre, ou une courte expression cle), jamais une phrase longue a rediger. ${difficultyText}${historyText}

Tu dois repondre UNIQUEMENT avec un tableau JSON valide, sans texte autour, sans balises markdown, au format exact :
[{"question": "...", "answer": "la reponse courte attendue", "explanation": "courte explication de la bonne reponse (1 phrase)"}, ...]

Le tableau doit contenir exactement 5 elements.${languageInstruction(language)}`;
  }

  if (mode === 'evaluation') {
    return `Tu es un professeur qui redige une VRAIE evaluation de classe, comme celles que les enseignants francais preparent reellement (dans le style des evaluations qu'on trouve sur des sites d'enseignants comme Bout de Gomme), pour un eleve de ${grade || 'niveau non precise'} qui travaille sur le theme "${subject || 'general'}".

Structure-la comme une vraie feuille d'evaluation :
- Un titre precis pour l'evaluation (ex: "Evaluation : Les fractions").
- Les questions sont regroupees en "exercices" (Exercice 1, Exercice 2, ...), chaque exercice portant sur une sous-partie precise de la notion, avec une consigne claire au-dessus (ex: "Calcule les operations suivantes.", "Complete les phrases avec le bon mot.", "Entoure la bonne reponse."), comme sur une vraie copie d'evaluation.
- Genere exactement 8 questions au total, reparties dans 2 a 4 exercices, du plus facile au plus difficile, couvrant bien l'ensemble de ce que l'eleve travaille sur ce theme. ${difficultyText}${historyText}
- Melange les deux formats : environ la moitie en questions a choix multiples (4 options), l'autre moitie en questions a reponse courte ecrite (l'eleve tape sa reponse : un mot, un nombre, ou une courte expression cle).

Tu dois repondre UNIQUEMENT avec un objet JSON valide, sans texte autour, sans balises markdown, au format exact :
{"titre": "titre de l'evaluation", "questions": [
  {"type": "qcm", "exercice": "Exercice 1 : ...", "consigne": "consigne de l'exercice", "question": "...", "options": ["...", "...", "...", "..."], "correctIndex": 0, "explanation": "..."},
  {"type": "ecrit", "exercice": "Exercice 2 : ...", "consigne": "consigne de l'exercice", "question": "...", "answer": "la reponse courte attendue", "explanation": "..."}, ...
]}

Le tableau "questions" doit contenir exactement 8 elements, avec un melange des deux "type". Pour "qcm", correctIndex est l'index (0 a 3) de la bonne reponse dans options. Les questions d'un meme exercice partagent le meme texte "exercice" et "consigne".${languageInstruction(language)}`;
  }

  return `Tu es un generateur de quiz pedagogique pour un eleve de ${grade || 'niveau non precise'} qui travaille sur le theme "${subject || 'general'}".

Genere exactement 10 questions a choix multiples (4 options chacune) adaptees a ce niveau et ce theme, du plus facile au plus difficile. ${difficultyText}${historyText}

Tu dois repondre UNIQUEMENT avec un tableau JSON valide, sans texte autour, sans balises markdown, au format exact :
[{"question": "...", "options": ["...", "...", "...", "..."], "correctIndex": 0, "explanation": "courte explication de la bonne reponse (1 phrase)"}, ...]

Le tableau doit contenir exactement 10 elements. correctIndex est l'index (0 a 3) de la bonne reponse dans le tableau options.${languageInstruction(language)}`;
}

function buildFichePrompt(grade, subject, hasHistory, language) {
  return `Tu es un professeur qui redige une fiche de cours personnalisee pour UN SEUL eleve de ${grade || 'niveau non precise'}, sur le theme "${subject || 'general'}".

${hasHistory ? "Tiens compte de la conversation precedente avec l'eleve (ses questions, ses difficultes) pour adapter le contenu a ce qu'il a du mal a comprendre." : ''}

Redige une fiche claire et pedagogique avec :
- un titre precis
- 3 a 5 sections, chacune avec un titre court et un contenu de 2 a 4 phrases (explications, exemples concrets adaptes au niveau)
- un resume final "a retenir" en 1 a 2 phrases

Tu dois repondre UNIQUEMENT avec un objet JSON valide, sans texte autour, sans balises markdown, au format exact :
{"titre": "...", "sections": [{"titre": "...", "contenu": "..."}, ...], "resume": "..."}${languageInstruction(language)}`;
}

app.post('/api/chat', async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: "Cle API manquante. Configure ANTHROPIC_API_KEY dans le fichier .env du serveur." });
  }

  const { messages, grade, subject, language } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages manquant ou invalide' });
  }

  try {
    const rawText = await callClaude(buildSystemPrompt(grade, subject, language), messages, 700);

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = { reponse: rawText, tableau: null };
    }

    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "L'IA n'a pas pu repondre pour le moment." });
  }
});

app.post('/api/quiz', async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: "Cle API manquante. Configure ANTHROPIC_API_KEY dans le fichier .env du serveur." });
  }

  const { grade, subject, difficulty, language, mode, history } = req.body;
  const hasHistory = Array.isArray(history) && history.length > 0;

  try {
    const messages = hasHistory
      ? [...history, { role: 'user', content: 'Genere le quiz maintenant, en tenant compte de notre conversation.' }]
      : [{ role: 'user', content: 'Genere le quiz maintenant.' }];

    const rawText = await callClaude(
      buildQuizPrompt(grade, subject, difficulty, language, mode, hasHistory),
      messages,
      mode === 'evaluation' ? 2000 : 1800
    );

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      return res.status(502).json({ error: "Le quiz genere etait invalide, reessaie." });
    }

    // En mode evaluation, la reponse est {titre, questions: [...]} ; sinon c'est directement le tableau
    if (mode === 'evaluation' && parsed && !Array.isArray(parsed)) {
      res.json({ titre: parsed.titre, questions: parsed.questions });
    } else {
      res.json({ questions: parsed });
    }
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Le quiz n'a pas pu etre genere pour le moment." });
  }
});

app.post('/api/fiche', async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: "Cle API manquante. Configure ANTHROPIC_API_KEY dans le fichier .env du serveur." });
  }

  const { grade, subject, history, language } = req.body;
  const hasHistory = Array.isArray(history) && history.length > 0;

  try {
    const messages = hasHistory
      ? [...history, { role: 'user', content: 'Redige la fiche de cours maintenant, en tenant compte de notre conversation.' }]
      : [{ role: 'user', content: 'Redige la fiche de cours maintenant.' }];

    const rawText = await callClaude(buildFichePrompt(grade, subject, hasHistory, language), messages, 1000);

    let fiche;
    try {
      fiche = JSON.parse(rawText);
    } catch {
      return res.status(502).json({ error: "La fiche generee etait invalide, reessaie." });
    }

    res.json(fiche);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "La fiche n'a pas pu etre generee pour le moment." });
  }
});

// Recherche video via youtube-search-api : pas de clef officielle necessaire (utilise l'API interne
// de YouTube, comme le site lui-meme). Non officiel donc hors conditions d'utilisation de YouTube,
// mais pour un volume perso/pedagogique tres faible le risque est negligeable. Si un jour ca casse
// suite a une mise a jour de YouTube, un `npm update youtube-search-api` regle generalement le probleme.
const youtubeSearch = require('youtube-search-api');

// Le sujet choisi a l'inscription (ex: "Conjugaison") est souvent trop large : si l'eleve travaille
// precisement sur le passe simple, il faut chercher une video sur le passe simple, pas juste sur la
// conjugaison en general. On utilise Claude pour extraire la notion precise depuis la conversation.
async function buildVideoSearchQuery(grade, subject, history) {
  const fallback = `${subject || ''} ${grade || ''} cours explication`.trim();
  if (!Array.isArray(history) || history.length === 0) return fallback;

  // La conversation se termine souvent par un message du professeur (assistant) : l'API Claude exige
  // que ca finisse par un message "user", donc on ajoute une derniere consigne explicite a la fin.
  const recent = [
    ...history.slice(-6),
    { role: 'user', content: 'Donne maintenant la requete de recherche YouTube demandee.' },
  ];
  const prompt = `Voici un extrait de conversation entre un eleve (niveau ${grade || 'non precise'}) et son professeur, sur le theme general "${subject || 'general'}".

A partir de cette conversation, donne UNIQUEMENT une courte requete de recherche YouTube (3 a 8 mots, en francais) pour trouver une video qui explique precisement la notion exacte sur laquelle l'eleve travaille en ce moment (pas juste le theme general). Reponds uniquement avec la requete de recherche, sans guillemets, sans phrase autour, sans balises markdown.`;

  try {
    const rawQuery = await callClaude(prompt, recent, 200);
    return rawQuery.trim() || fallback;
  } catch (err) {
    console.error('Erreur extraction requete video:', err);
    return fallback;
  }
}

app.post('/api/video-search', async (req, res) => {
  const { grade, subject, history } = req.body;

  try {
    const query = await buildVideoSearchQuery(grade, subject, history);
    const result = await youtubeSearch.GetListByKeyword(query, false, 8, [{ type: 'video' }]);
    const items = result.items || [];

    if (items.length === 0) {
      return res.status(404).json({ error: 'Aucune video trouvee pour ce theme.' });
    }

    // On privilegie une video de Lumni (chaine educative officielle) si elle apparait dans les resultats
    const lumniVideo = items.find(item => item.channelTitle && item.channelTitle.toLowerCase().includes('lumni'));
    const chosen = lumniVideo || items[0];

    res.json({ videoId: chosen.id, title: chosen.title || '' });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'La recherche video a echoue.' });
  }
});

// --- Comptes eleve : le code secret sert d'identifiant, les etoiles y restent attachees ---
function accountFilePath(code) {
  return path.join(ACCOUNTS_DIR, `${sanitizeMapCode(code)}.json`);
}

function readAccount(code) {
  try {
    return JSON.parse(fs.readFileSync(accountFilePath(code), 'utf8'));
  } catch {
    return null;
  }
}

function writeAccount(code, account) {
  fs.writeFileSync(accountFilePath(code), JSON.stringify(account));
}

app.post('/api/account/login', (req, res) => {
  const { name, code } = req.body;
  if (typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({ error: 'Code secret manquant' });
  }
  const cleanCode = sanitizeMapCode(code);

  let account = readAccount(cleanCode);
  if (!account) {
    account = {
      code: cleanCode,
      name: typeof name === 'string' && name.trim() ? name.trim().slice(0, 16) : 'Elève',
      stars: 0,
    };
    writeAccount(cleanCode, account);
  }

  res.json({ account });
});

app.post('/api/account/stars', (req, res) => {
  const { code, stars } = req.body;
  if (typeof code !== 'string' || !Number.isFinite(stars)) {
    return res.status(400).json({ error: 'Donnees invalides' });
  }
  const cleanCode = sanitizeMapCode(code);
  const account = readAccount(cleanCode);
  if (!account) {
    return res.status(404).json({ error: 'Compte introuvable' });
  }
  const newStars = Math.max(0, Math.round(stars));
  const gain = newStars - (account.stars || 0);
  if (gain > 0) {
    // Anti-triche : une recompense legitime est limitee, et le gain total par minute aussi
    const now = Date.now();
    const recent = (account.gains || []).filter((g) => now - g.t < 60000);
    const recentTotal = recent.reduce((sum, g) => sum + g.v, 0);
    if (gain > 1000 || recentTotal + gain > 2500) {
      return res.status(429).json({ error: 'Gain refuse', stars: account.stars });
    }
    recent.push({ t: now, v: gain });
    account.gains = recent;
  }
  account.stars = newStars;
  writeAccount(cleanCode, account);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Maitresse virtuelle disponible sur http://localhost:${PORT}`);
});
