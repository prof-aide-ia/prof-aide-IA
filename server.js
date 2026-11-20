require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY;
// Claude Haiku 5.5 : modele rapide et beaucoup moins cher, suffisant pour des reponses courtes
const MODEL = 'claude-haiku-5-5';
const ACCOUNTS_DIR = path.join(__dirname, 'accounts');

// Toto (public/mon-ia.js) fait le prof dans tout le site (prof, quiz, evaluations, fiches, videos) ;
// quand il ne sait pas, il demande a Claude. Pour revenir a Claude partout : MON_IA_PARTOUT=non dans .env.
const MON_IA_PARTOUT = !/^(non|no|0|false)$/i.test(String(process.env.MON_IA_PARTOUT || 'oui').trim());
// Les regles de Toto (le meme fichier sert au site et au serveur)
const REGLES_TOTO = require('./public/regles-toto.js');

if (!fs.existsSync(ACCOUNTS_DIR)) fs.mkdirSync(ACCOUNTS_DIR, { recursive: true });

app.use(express.json({ limit: '200kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Protege la cle et le credit : nombre limite de requetes IA par minute et par visiteur
const AI_LIMIT_PER_MIN = 30;
const AI_LIMIT_PER_DAY = Number(process.env.AI_LIMIT_PER_DAY) || 1500; // plafond global : le credit ne peut pas exploser
const aiHits = new Map();
let aiDayCount = 0;
let aiDayStart = Date.now();
app.set('trust proxy', 1); // derriere l'hebergeur, req.ip doit etre l'IP du visiteur et pas celle du proxy
// ============ Mon IA apprend de Claude ============
// Quand Mon IA ne connait pas la reponse, elle demande a Claude ("fais-le, je n'y arrive pas"),
// puis garde sa reponse dans savoir-appris.json : la prochaine fois, elle repond toute seule.
const APPRIS_FILE = path.join(__dirname, 'savoir-appris.json');
const APPRIS_MAX = 3000;
// Sur Render, les fichiers sont effaces a chaque redemarrage : le savoir appris est donc garde dans la
// meme base que les comptes (Supabase). Le fichier savoir-appris.json sert seulement de point de depart.
const APPRIS_KEY = '_savoir_appris';
let apprisCache = null;
async function readAppris() {
  if (apprisCache) return apprisCache;
  const stored = await readAccount(APPRIS_KEY);
  if (stored && Array.isArray(stored.list)) apprisCache = stored.list;
  else {
    try { apprisCache = JSON.parse(fs.readFileSync(APPRIS_FILE, 'utf8')); } catch { apprisCache = []; }
  }
  return apprisCache;
}
async function writeAppris(list) {
  apprisCache = list.slice(-APPRIS_MAX);
  await writeAccount({ key: APPRIS_KEY, list: apprisCache });
}
const stripAcc = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const GENERIC_WORDS = new Set(['cours', 'question', 'eleve', 'prof', 'reponse', 'exemple', 'faire', 'comment', 'pourquoi', 'quoi', 'chose', 'truc', 'etre', 'avoir', 'aide']);

// Le savoir appris, servi comme un fichier de savoir de plus (charge par index.html)
app.get('/savoir/appris.js', async (req, res) => {
  res.type('application/javascript');
  res.set('Cache-Control', 'no-store');
  res.send(`// Ce que Mon IA a appris du prof Claude (fichier savoir-appris.json)
(function (root) {
  const S = root.MON_IA_SAVOIR = root.MON_IA_SAVOIR || { notions: [], banks: {}, matieres: {} };
  S.notions.push(...${JSON.stringify(await readAppris()).replace(/</g, '\\u003c')});
})(typeof window !== 'undefined' ? window : globalThis);
`);
});

// Le site demande au demarrage qui fait le prof : Claude ou Mon IA
app.get('/api/config', (req, res) => {
  res.json({ monIAPartout: MON_IA_PARTOUT });
});

// Quand Mon IA remplace Claude, on n'appelle plus jamais Claude (le credit ne bouge plus)
app.use(['/api/chat', '/api/quiz', '/api/fiche'], (req, res, next) => {
  if (MON_IA_PARTOUT) return res.status(403).json({ error: 'Mon IA remplace Claude sur ce site.' });
  next();
});

app.use(['/api/chat', '/api/quiz', '/api/fiche', '/api/video-search', '/api/demande-claude'], (req, res, next) => {
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
      // Reponses courtes en JSON : pas besoin de reflexion, ca evite aussi qu'elle mange les tokens
      thinking: { type: 'disabled' },
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

// ============ Recherche internet sur des sites FIABLES seulement ============
// Seuls ces sites peuvent etre utilises (ecrits par des profs, des scientifiques ou des organismes
// officiels). Wikipedia, Vikidia, les forums (Reddit, Quora, Brainly...) ne sont PAS dans la liste,
// donc ils sont impossibles a utiliser : tout le monde peut y ecrire n'importe quoi.
// (63 sites max : c'est la limite de l'outil de recherche ; les sous-domaines sont inclus.)
const TRUSTED_SITES = [
  // Ecole et cours
  'education.gouv.fr', 'eduscol.education.fr', 'reseau-canope.fr', 'onisep.fr', 'alloprof.qc.ca',
  'schoolmouv.fr', 'kartable.fr', 'maxicours.com', 'assistancescolaire.com', 'lesbonsprofs.com', 'khanacademy.org',
  // Dictionnaires et encyclopedies redigees par des experts
  'larousse.fr', 'universalis.fr', 'britannica.com', 'cnrtl.fr', 'lerobert.com', 'academie-francaise.fr', 'bescherelle.com',
  'dictionary.cambridge.org', 'merriam-webster.com', 'rae.es', 'duden.de',
  // Sciences
  'cnrs.fr', 'cea.fr', 'inserm.fr', 'pasteur.fr', 'inrae.fr', 'ifremer.fr', 'mnhn.fr', 'cite-sciences.fr',
  'cnes.fr', 'esa.int', 'nasa.gov', 'meteofrance.com', 'ign.fr', 'futura-sciences.com', 
  'nationalgeographic.com',
  // Sante
  'ameli.fr', 'santepubliquefrance.fr', 'who.int',
  // Histoire, societe, institutions
  'vie-publique.fr', 'service-public.fr', 'insee.fr', 'assemblee-nationale.fr', 'senat.fr', 'elysee.fr',
  'conseil-constitutionnel.fr', 'europa.eu', 'un.org', 'unesco.org', 'bnf.fr', 'histoire-image.org', 'louvre.fr',
  'chateauversailles.fr',
];

// Comme callClaude, mais Claude peut chercher sur internet (uniquement les sites fiables ci-dessus).
// Renvoie { text, sources } ; sources = les pages fiables que Claude a lues.
async function callClaudeWeb(system, messages, maxTokens) {
  const convo = [...messages];
  const sources = [];
  let text = '';
  // "pause_turn" : la recherche a pris du temps, on relance pour que Claude termine (2 fois max)
  for (let i = 0; i < 3; i++) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        system,
        messages: convo,
        tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 2, allowed_domains: TRUSTED_SITES }],
      }),
    });
    if (!response.ok) {
      console.error('Erreur API Anthropic (recherche web):', response.status, await response.text());
      throw new Error('claude_error');
    }
    const data = await response.json();
    for (const block of data.content || []) {
      if (block.type === 'text') text += block.text;
      // Une erreur de recherche arrive comme un objet (pas une liste) : on l'ignore simplement
      if (block.type === 'web_search_tool_result' && Array.isArray(block.content)) {
        for (const r of block.content) if (r.url && !sources.some((s) => s.url === r.url)) sources.push({ url: r.url, title: r.title || '' });
      }
    }
    if (data.stop_reason !== 'pause_turn') break;
    convo.push({ role: 'assistant', content: data.content });
  }
  // Le JSON est parfois entoure de phrases : on garde ce qu'il y a entre la premiere { et la derniere }
  const start = text.indexOf('{'), end = text.lastIndexOf('}');
  return { text: start >= 0 && end > start ? text.slice(start, end + 1) : text.trim(), sources };
}

// Garde-fou : une source n'est acceptee que si elle vient vraiment d'un site de la liste
function isTrustedUrl(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return TRUSTED_SITES.some((d) => host === d || host.endsWith('.' + d));
  } catch { return false; }
}

function languageInstruction(language) {
  if (!language || language.toLowerCase() === 'français' || language.toLowerCase() === 'francais') return '';
  return `\n\nIMPORTANT : ecris absolument tout ton texte (les champs de reponse) en ${language}, pas en francais. Traduis aussi les notions/exemples dans cette langue.`;
}

// Ce que la mini-IA de progression (public/brain.js) a appris de l'eleve : Claude s'en sert
// pour adapter sa lecon a lui (simplifier, aller plus loin, passer par des videos ou des exercices)
function profileInstruction(profile) {
  if (!profile || typeof profile !== 'object') return '';
  const parts = [];
  if (Number.isInteger(profile.level) && profile.level >= 0 && profile.level <= 100) {
    const conseil = profile.level < 40
      ? 'explique tres simplement, en petites etapes, avec des exemples concrets'
      : profile.level > 75
        ? 'il est a l\'aise : tu peux aller plus loin et lui proposer des defis'
        : 'garde un niveau normal pour sa classe';
    parts.push(`son niveau estime dans cette matiere est de ${profile.level} % : ${conseil}`);
  }
  const styles = {
    video: 'il apprend surtout en regardant des videos : utilise des images mentales et propose la video quand c\'est utile',
    questions: 'il apprend surtout en posant des questions : avance avec lui pas a pas, par le dialogue',
    quiz: 'il apprend surtout en s\'entrainant : propose vite de petits exercices',
  };
  if (styles[profile.style]) parts.push(styles[profile.style]);
  if (typeof profile.weak === 'string' && profile.weak.trim()) {
    parts.push(`sa matiere la plus difficile en ce moment est « ${profile.weak.trim().slice(0, 60).replace(/["\r\n]/g, ' ')} »`);
  }
  return parts.length ? `\n\nProfil de l'eleve, appris par la mini-IA du site : ${parts.join(' ; ')}.` : '';
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

Si l'eleve veut parler de divertissement (jeux video, youtubeurs, streamers, series, celebrites...), ne joue pas le jeu : ramene-le gentiment vers ce qu'il doit apprendre.

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

// Mode "Le prof m'interroge" : c'est le prof qui pose les questions, l'eleve repond
const INTERRO_INSTRUCTION = `

MODE INTERROGATION ACTIVE : c'est TOI qui interroges l'eleve, comme une interrogation orale en classe.
- Pose UNE seule question a la fois sur la matiere, adaptee a son niveau, puis attends sa reponse.
- Commence par une question facile, puis augmente doucement la difficulte quand il reussit.
- Quand il repond : dis-lui d'abord si c'est juste ou pas.
  - Si c'est juste : felicite sa methode en une phrase, puis pose la question suivante dans le meme message.
  - Si c'est faux ou incomplet : ne donne pas la reponse, donne un indice ou une question plus simple pour l'aider a trouver, et laisse-le reessayer.
- S'il dit qu'il ne sait pas, donne un indice. S'il demande d'arreter, felicite-le et fais un petit bilan (ce qu'il sait bien, ce qu'il doit revoir).
- Ecris la question en cours au tableau (champ "tableau").
- Mets "suggestion" a null pendant l'interrogation.
- Choisis des exemples surprenants et varies dans tes questions.`;

app.post('/api/chat', async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: "Cle API manquante. Configure ANTHROPIC_API_KEY dans le fichier .env du serveur." });
  }

  const { messages, grade, subject, language, profile, interro } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages manquant ou invalide' });
  }

  try {
    const system = buildSystemPrompt(grade, subject, language) + profileInstruction(profile) + (interro ? INTERRO_INSTRUCTION : '');
    const rawText = await callClaude(system, messages, 700);

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

// Mon IA ne sait pas : Claude repond, sous forme de "notion" que Mon IA garde en memoire.
// (Autorise meme quand MON_IA_PARTOUT=oui : c'est l'aide de secours de Mon IA.)
app.post('/api/demande-claude', async (req, res) => {
  if (!API_KEY) return res.status(500).json({ error: 'Le prof Claude n\'est pas disponible (pas de cle API).' });
  const { question, grade, subject } = req.body;
  if (typeof question !== 'string' || !question.trim()) return res.status(400).json({ error: 'question manquante' });
  const q = question.trim().slice(0, 300);
  // Les regles de Toto s'appliquent aussi ici : une question interdite n'est jamais envoyee a Claude
  // (et les infos personnelles d'un eleve ne quittent jamais le site)
  const regle = REGLES_TOTO.verifier(q);
  if (regle) return res.json({ notion: { mots: [], texte: regle.reponse }, appris: false });

  const system = `Tu aides "Toto", la petite IA de prof d'un site d'aide aux devoirs. Elle ne connaissait pas la reponse a la question d'un eleve${grade ? ` de ${grade}` : ''} (matiere : ${subject || 'non precisee'}), alors c'est toi qui reponds. Ta reponse sera gardee par Toto pour qu'elle sache repondre toute seule la prochaine fois.

Explique la notion simplement, avec un ton chaleureux de prof (tutoiement, phrases courtes, mots adaptes a son age). Donne un exemple concret de la vie de tous les jours. Si la question est un exercice precis (un calcul, une question de devoir), NE donne PAS le resultat final : explique la methode a la place.

Pour etre sur de ne pas te tromper, fais d'abord une recherche internet (seuls des sites fiables sont autorises : sites scolaires, dictionnaires, organismes scientifiques et officiels). Appuie ton explication sur ce que tu y trouves.

Reponds UNIQUEMENT avec un objet JSON valide, sans texte autour, au format exact :
{"mots": ["3 a 6 mots-cles en minuscules sans accents, precis, que l'eleve pourrait utiliser pour reposer cette question"], "titre": "titre court de la notion", "texte": "explication en 1 a 3 phrases", "exemple": "un exemple concret de la vie de tous les jours", "astuce": "une astuce pour retenir", "tableau": "resume de 60 caracteres max", "source": "l'adresse de la page fiable la plus utile, ou null"}
Si la question n'a rien a voir avec l'ecole ou n'est pas correcte, reponds {"hors_sujet": true, "texte": "une phrase gentille pour ramener l'eleve vers ses devoirs"}.`;

  try {
    // D'abord avec la recherche sur les sites fiables ; si la recherche n'est pas disponible, sans elle
    let raw, sources = [];
    try {
      ({ text: raw, sources } = await callClaudeWeb(system, [{ role: 'user', content: q }], 1500));
    } catch {
      raw = await callClaude(system, [{ role: 'user', content: q }], 700);
    }
    let n;
    try { n = JSON.parse(raw); } catch { return res.status(502).json({ error: 'Reponse de Claude invalide.' }); }
    // La source affichee doit etre une page fiable que Claude a VRAIMENT lue pendant sa recherche
    // (jamais une adresse qu'il aurait juste ecrite de memoire)
    const read = sources.filter((s) => isTrustedUrl(s.url));
    const claimed = typeof n.source === 'string' ? read.find((s) => s.url === n.source || n.source.startsWith(s.url) || s.url.startsWith(n.source)) : null;
    const source = (claimed || read[0] || {}).url || null;
    if (!n || typeof n.texte !== 'string') return res.status(502).json({ error: 'Reponse de Claude invalide.' });
    if (n.hors_sujet) return res.json({ notion: { mots: [], texte: n.texte.slice(0, 400) }, appris: false });

    const mots = (Array.isArray(n.mots) ? n.mots : [])
      .map(stripAcc).filter((m) => m.length >= 3 && m.length <= 40 && !GENERIC_WORDS.has(m)).slice(0, 6);
    const clean = (s, max) => (typeof s === 'string' ? s.trim().slice(0, max) : undefined);
    const notion = {
      mots, titre: clean(n.titre, 60), texte: clean(n.texte, 600), exemple: clean(n.exemple, 400),
      astuce: clean(n.astuce, 300), tableau: clean(n.tableau, 70), quiz: [], source,
      appris: new Date().toISOString().slice(0, 10), question: q, sujet: clean(subject, 60),
    };
    // Toto ne garde jamais une reponse qui enfreint ses regles (gros mot, sujet interdit, Wikipedia...)
    const interdit = REGLES_TOTO.reponseInterdite([notion.texte, notion.exemple, notion.astuce, notion.tableau].join(' '));
    if (interdit) return res.json({ notion: { mots: [], texte: 'Je préfère ne pas répondre à ça. Pose-moi une autre question sur tes cours !' }, appris: false });
    // On garde la notion (sans doublon) pour que Toto s'en souvienne
    let appris = false;
    if (mots.length) {
      const list = [...(await readAppris())];
      if (!list.some((x) => x.mots && x.mots[0] === mots[0])) {
        list.push(notion);
        await writeAppris(list);
        appris = true;
      }
    }
    res.json({ notion, appris });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Le prof Claude n\'a pas pu repondre.' });
  }
});

app.post('/api/quiz', async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: "Cle API manquante. Configure ANTHROPIC_API_KEY dans le fichier .env du serveur." });
  }

  const { grade, subject, difficulty, language, mode, history, profile } = req.body;
  if (!(await isEducationalTopic(subject))) return res.status(400).json({ error: NOT_EDUCATIONAL_MESSAGE });
  const hasHistory = Array.isArray(history) && history.length > 0;

  try {
    const messages = hasHistory
      ? [...history, { role: 'user', content: 'Genere le quiz maintenant, en tenant compte de notre conversation.' }]
      : [{ role: 'user', content: 'Genere le quiz maintenant.' }];

    const rawText = await callClaude(
      buildQuizPrompt(grade, subject, difficulty, language, mode, hasHistory) + profileInstruction(profile),
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

  const { grade, subject, history, language, profile } = req.body;
  if (!(await isEducationalTopic(subject))) return res.status(400).json({ error: NOT_EDUCATIONAL_MESSAGE });
  const hasHistory = Array.isArray(history) && history.length > 0;

  try {
    const messages = hasHistory
      ? [...history, { role: 'user', content: 'Redige la fiche de cours maintenant, en tenant compte de notre conversation.' }]
      : [{ role: 'user', content: 'Redige la fiche de cours maintenant.' }];

    const rawText = await callClaude(buildFichePrompt(grade, subject, hasHistory, language) + profileInstruction(profile), messages, 1000);

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
// ============ Pas de divertissement ============
// Le site sert a apprendre : un theme sur un jeu video, un youtubeur, un streamer, une serie ou une
// celebrite est refuse. Claude Haiku juge chaque nouveau theme une seule fois (reponse gardee en memoire).
const NOT_EDUCATIONAL_MESSAGE = "Ce thème sert à se divertir, pas à apprendre. Choisis plutôt une matière ou une notion d'école.";
const topicVerdicts = new Map();
// Renvoie { educatif, sport } : le theme sert-il a apprendre, et est-ce un sport ?
async function classifyTopic(subject) {
  const topic = typeof subject === 'string' ? subject.trim().slice(0, 80) : '';
  if (!topic) return { educatif: true, sport: false };
  const key = topic.toLowerCase();
  if (topicVerdicts.has(key)) return topicVerdicts.get(key);
  const prompt = `Tu es le filtre d'un site d'aide aux devoirs pour enfants. Un eleve veut travailler sur un theme. Decide si ce theme sert a APPRENDRE (matiere scolaire, notion de cours, science, histoire, geographie, langue, art, musique, sport en tant que discipline, culture generale, metier...) ou s'il sert a se DIVERTIR, et si c'est un sport.

"educatif" est false pour : un jeu video ou un personnage de jeu video, un youtubeur, un streamer, un influenceur, une chaine YouTube ou TikTok, une celebrite, une serie, un film, un dessin anime ou un personnage de divertissement, et tout ce qui ne sert pas a apprendre quelque chose d'ecole. "educatif" est true pour une vraie notion a apprendre, meme formulee simplement.
"sport" est true si le theme est un sport ou une activite sportive (football, basket, natation, EPS...).

Reponds UNIQUEMENT par un objet JSON : {"educatif": true ou false, "sport": true ou false}`;
  let verdict = { educatif: true, sport: false };
  try {
    const raw = await callClaude(prompt, [{ role: 'user', content: `Theme : ${topic}` }], 60);
    const parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)[0]);
    verdict = { educatif: parsed.educatif !== false, sport: parsed.sport === true };
  } catch (err) {
    console.error('Erreur filtre de theme:', err);
    return verdict; // en cas de panne, on ne bloque pas l'eleve
  }
  if (topicVerdicts.size > 2000) topicVerdicts.clear();
  topicVerdicts.set(key, verdict);
  return verdict;
}

async function isEducationalTopic(subject) {
  return (await classifyTopic(subject)).educatif;
}

// Le site demande avant d'accepter un theme personnalise
app.post('/api/topic-check', async (req, res) => {
  const { subject } = req.body || {};
  const verdict = await classifyTopic(subject);
  res.json({ ok: verdict.educatif, sport: verdict.sport });
});

async function buildVideoSearchQuery(grade, subject, history, sport) {
  // Pour un sport : une video qui apprend (regles, technique), jamais des matchs ou des buts
  const fallback = sport ? `${subject || ''} regles technique expliquees enfants`.trim() : `${subject || ''} ${grade || ''} cours explication`.trim();
  if (!Array.isArray(history) || history.length === 0) return fallback;
  // Mon IA a la place de Claude : on cherche avec la derniere question de l'eleve, sans appeler Claude
  if (MON_IA_PARTOUT) {
    const last = [...history].reverse().find((m) => m.role === 'user' && typeof m.content === 'string');
    return last ? `${subject || ''} ${last.content.slice(0, 80)}`.trim() : fallback;
  }

  // La conversation se termine souvent par un message du professeur (assistant) : l'API Claude exige
  // que ca finisse par un message "user", donc on ajoute une derniere consigne explicite a la fin.
  const recent = [
    ...history.slice(-6),
    { role: 'user', content: 'Donne maintenant la requete de recherche YouTube demandee.' },
  ];
  const prompt = `Voici un extrait de conversation entre un eleve (niveau ${grade || 'non precise'}) et son professeur, sur le theme general "${subject || 'general'}".

A partir de cette conversation, donne UNIQUEMENT une courte requete de recherche YouTube (3 a 8 mots, en francais) pour trouver une video qui explique precisement la notion exacte sur laquelle l'eleve travaille en ce moment (pas juste le theme general). La video doit servir a apprendre une notion d'ecole : si l'eleve demande une video de divertissement (un youtubeur, un streamer, un jeu video, une serie, une celebrite...), reponds exactement NON_EDUCATIF.${sport ? ' Le theme est un sport : la video doit expliquer les regles, la technique ou l\'histoire de ce sport, jamais des matchs, des buts, des resumes ou des meilleurs moments.' : ''} Reponds uniquement avec la requete de recherche, sans guillemets, sans phrase autour, sans balises markdown.`;

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
    const verdict = await classifyTopic(subject);
    if (!verdict.educatif) return res.status(400).json({ error: NOT_EDUCATIONAL_MESSAGE });
    const query = await buildVideoSearchQuery(grade, subject, history, verdict.sport);
    if (/NON_EDUCATIF/i.test(query)) return res.status(400).json({ error: NOT_EDUCATIONAL_MESSAGE });
    const result = await youtubeSearch.GetListByKeyword(query, false, 8, [{ type: 'video' }]);
    const items = result.items || [];

    if (items.length === 0) {
      return res.status(404).json({ error: 'Aucune video trouvee pour ce theme.' });
    }

    // On privilegie une video de Lumni (chaine educative officielle) si elle apparait dans les resultats
    const lumniVideo = items.find(item => item.channelTitle && item.channelTitle.toLowerCase().includes('lumni'));
    const chosen = lumniVideo || items[0];

    res.json({ videoId: chosen.id, title: chosen.title || '', sport: verdict.sport });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'La recherche video a echoue.' });
  }
});

const crypto = require('crypto');
const GRADES = ['CP', 'CE1', 'CE2', 'CM1', 'CM2', '6ème', '5ème', '4ème', '3ème', 'Seconde', 'Première', 'Terminale', 'Université', 'Autre'];
const GENDERS = ['fille', 'garcon', 'secret'];

// "Léa", "lea" et " LEA " donnent le meme identifiant : un prenom ne peut exister qu'une fois
function nameKey(name) {
  return String(name || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 24);
}

function accountFilePath(key) {
  return path.join(ACCOUNTS_DIR, `${key}.json`);
}

// Les comptes sont ranges dans une base de donnees gratuite (Supabase ou Upstash) quand elle est
// configuree sur Render : contrairement aux fichiers, elle n'est pas effacee quand le serveur
// redemarre. Sans elle (par exemple sur l'ordinateur), on garde les fichiers du dossier accounts/.
// On ne garde que le debut de l'adresse (https://xxx.supabase.co), meme si /rest/v1 a ete copie avec
const SUPABASE_URL = (() => {
  try { return process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL.trim()).origin : ''; } catch { return ''; }
})();
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const DB_URL = process.env.UPSTASH_REDIS_REST_URL;
const DB_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const USE_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_KEY);
const USE_UPSTASH = !USE_SUPABASE && Boolean(DB_URL && DB_TOKEN);

// Derniere erreur de la base de donnees, pour le diagnostic (ne contient jamais la cle)
let lastDbError = null;

// Supabase : une table "comptes" avec une colonne key (le prenom simplifie) et data (le compte)
async function supabaseRequest(query, options = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/comptes${query}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      // Les anciennes cles (eyJ...) vont aussi dans Authorization ; les nouvelles (sb_secret_...) non
      ...(SUPABASE_KEY.startsWith('eyJ') ? { Authorization: `Bearer ${SUPABASE_KEY}` } : {}),
      'content-type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    lastDbError = `Supabase : erreur ${response.status} ${(await response.text()).slice(0, 300)}`;
    throw new Error(lastDbError);
  }
  return response;
}

async function dbCommand(command) {
  const response = await fetch(DB_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${DB_TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify(command),
  });
  if (!response.ok) throw new Error(`Base de donnees : erreur ${response.status}`);
  return (await response.json()).result;
}

async function readAccount(key) {
  if (!key) return null;
  try {
    if (USE_SUPABASE) {
      const rows = await (await supabaseRequest(`?key=eq.${encodeURIComponent(key)}&select=data`)).json();
      return rows.length ? rows[0].data : null;
    }
    if (USE_UPSTASH) {
      const raw = await dbCommand(['GET', `compte:${key}`]);
      return raw ? JSON.parse(raw) : null;
    }
    return JSON.parse(fs.readFileSync(accountFilePath(key), 'utf8'));
  } catch (err) {
    if (USE_SUPABASE || USE_UPSTASH) console.error(err);
    return null;
  }
}

async function writeAccount(account) {
  if (USE_SUPABASE) {
    await supabaseRequest('', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({ key: account.key, data: account }),
    });
    return;
  }
  if (USE_UPSTASH) {
    await dbCommand(['SET', `compte:${account.key}`, JSON.stringify(account)]);
    return;
  }
  fs.writeFileSync(accountFilePath(account.key), JSON.stringify(account));
}

function hashCode(code, salt) {
  return crypto.scryptSync(code, salt, 32).toString('hex');
}

function isStrongCode(code) {
  return typeof code === 'string' && code.length >= 6 && code.length <= 40 && /[a-zA-Z]/.test(code) && /[0-9]/.test(code);
}

// Si la base de donnees ne repond pas, on renvoie une erreur propre au lieu de bloquer la page
function safe(handler) {
  return (req, res, next) => handler(req, res, next).catch((err) => {
    console.error(err);
    res.status(500).json({ error: 'errServer' });
  });
}

// Verifie prenom + code ; renvoie le compte ou null
async function checkLogin(name, code) {
  const account = await readAccount(nameKey(name));
  if (!account || typeof code !== 'string' || !account.salt) return null;
  const hash = Buffer.from(hashCode(code, account.salt), 'hex');
  const expected = Buffer.from(account.hash, 'hex');
  return hash.length === expected.length && crypto.timingSafeEqual(hash, expected) ? account : null;
}

// Compte(s) administrateur : le proprietaire du site a des etoiles illimitees (ADMIN_NAMES pour en changer)
const ADMIN_KEYS = String(process.env.ADMIN_NAMES || 'admin').split(',').map((n) => nameKey(n)).filter(Boolean);
function isAdminAccount(a) {
  return Boolean(a && ADMIN_KEYS.includes(a.key));
}

function publicAccount(a) {
  return { name: a.name, stars: a.stars || 0, age: a.age, grade: a.grade, gender: a.gender, brain: a.brain || null, admin: isAdminAccount(a) };
}

// Limite les essais de connexion pour empecher de deviner un code
const loginTries = new Map();
function tooManyTries(ip) {
  const now = Date.now();
  const list = (loginTries.get(ip) || []).filter((t) => now - t < 60000);
  list.push(now);
  loginTries.set(ip, list);
  return list.length > 15;
}

app.post('/api/account/register', safe(async (req, res) => {
  const { name, code, codeConfirm, age, grade, gender } = req.body || {};
  const cleanName = typeof name === 'string' ? name.trim().replace(/\s+/g, ' ') : '';
  if (!/^[\p{L}][\p{L} '-]{1,15}$/u.test(cleanName)) return res.status(400).json({ error: 'errName' });
  if (!isStrongCode(code)) return res.status(400).json({ error: 'errCodeWeak' });
  if (code !== codeConfirm) return res.status(400).json({ error: 'errCodeMismatch' });
  const ageNum = Number(age);
  if (!Number.isInteger(ageNum) || ageNum < 4 || ageNum > 99) return res.status(400).json({ error: 'errAge' });
  if (!GRADES.includes(grade)) return res.status(400).json({ error: 'errGrade' });
  if (!GENDERS.includes(gender)) return res.status(400).json({ error: 'errGender' });
  const key = nameKey(cleanName);
  if (!key) return res.status(400).json({ error: 'errName' });
  if (await readAccount(key)) return res.status(409).json({ error: 'errNameTaken' });
  const salt = crypto.randomBytes(16).toString('hex');
  const account = { key, name: cleanName, salt, hash: hashCode(code, salt), age: ageNum, grade, gender, stars: 0, created: Date.now() };
  await writeAccount(account);
  res.json({ account: publicAccount(account) });
}));

// ============ Espace admin ============
// Seul le compte admin (verifie avec son prenom ET son code a chaque fois) peut voir la liste des
// comptes et donner un nouveau code a un joueur. Les codes ne sont jamais affiches : ils sont haches.
async function listAccounts() {
  if (USE_SUPABASE) {
    const rows = await (await supabaseRequest('?select=key,data')).json();
    return rows.filter((r) => !String(r.key).startsWith('_')).map((r) => r.data);
  }
  if (USE_UPSTASH) {
    const keys = (await dbCommand(['KEYS', 'compte:*'])) || [];
    const list = [];
    for (const k of keys) {
      if (k.startsWith('compte:_')) continue;
      const raw = await dbCommand(['GET', k]);
      if (raw) list.push(JSON.parse(raw));
    }
    return list;
  }
  return fs.readdirSync(ACCOUNTS_DIR)
    .filter((f) => f.endsWith('.json') && !f.startsWith('_'))
    .map((f) => { try { return JSON.parse(fs.readFileSync(path.join(ACCOUNTS_DIR, f), 'utf8')); } catch { return null; } })
    .filter(Boolean);
}

async function checkAdmin(req, res) {
  if (tooManyTries(req.ip)) { res.status(429).json({ error: 'errTooMany' }); return null; }
  const { name, code } = req.body || {};
  const account = await checkLogin(name, code);
  if (!account || !isAdminAccount(account)) { res.status(403).json({ error: 'Réservé au compte admin.' }); return null; }
  return account;
}

app.post('/api/admin/accounts', safe(async (req, res) => {
  if (!(await checkAdmin(req, res))) return;
  const accounts = (await listAccounts())
    .filter((a) => a && a.salt)
    .map((a) => ({ name: a.name, grade: a.grade, age: a.age, stars: a.stars || 0, created: a.created || null, admin: isAdminAccount(a) }))
    .sort((a, b) => (b.created || 0) - (a.created || 0));
  res.json({ accounts });
}));

app.post('/api/admin/reset-code', safe(async (req, res) => {
  if (!(await checkAdmin(req, res))) return;
  const { target, newCode } = req.body || {};
  if (!isStrongCode(newCode)) return res.status(400).json({ error: 'errCodeWeak' });
  const account = await readAccount(nameKey(target));
  if (!account || !account.salt) return res.status(404).json({ error: 'Compte introuvable.' });
  account.salt = crypto.randomBytes(16).toString('hex');
  account.hash = hashCode(newCode, account.salt);
  await writeAccount(account);
  res.json({ ok: true });
}));

app.post('/api/account/login', safe(async (req, res) => {
  const { name, code } = req.body || {};
  if (tooManyTries(req.ip)) return res.status(429).json({ error: 'errTooMany' });
  if (typeof name !== 'string' || !name.trim() || typeof code !== 'string' || !code) {
    return res.status(400).json({ error: 'errMissing' });
  }
  const account = await checkLogin(name, code);
  if (!account) return res.status(401).json({ error: 'errLogin' });
  res.json({ account: publicAccount(account) });
}));

app.post('/api/account/stars', safe(async (req, res) => {
  const { name, code, stars } = req.body || {};
  if (!Number.isFinite(stars)) return res.status(400).json({ error: 'Donnees invalides' });
  const account = await checkLogin(name, code);
  if (!account) return res.status(401).json({ error: 'Compte introuvable' });
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
  await writeAccount(account);
  res.json({ ok: true });
}));

// Ce que la mini-IA de progression a appris sur l'eleve (niveau estime par matiere)
function cleanBrain(brain) {
  if (!brain || typeof brain !== 'object' || !brain.subjects || typeof brain.subjects !== 'object') return null;
  const subjects = {};
  for (const [name, s] of Object.entries(brain.subjects).slice(0, 80)) {
    if (typeof name !== 'string' || name.length > 60 || !s) continue;
    if (!Number.isFinite(s.theta) || !Number.isFinite(s.n)) continue;
    const count = (v) => (Number.isFinite(v) ? Math.max(0, Math.min(100000, Math.round(v))) : 0);
    const recent = Array.isArray(s.recent) ? s.recent.filter((r) => Number.isFinite(r) && r >= 0 && r <= 1).slice(-3) : [];
    subjects[name] = { theta: Math.max(-4, Math.min(4, s.theta)), n: count(s.n), videos: count(s.videos), questions: count(s.questions), recent };
  }
  return { subjects };
}

app.post('/api/account/brain', safe(async (req, res) => {
  const { name, code, brain } = req.body || {};
  const account = await checkLogin(name, code);
  if (!account) return res.status(401).json({ error: 'Compte introuvable' });
  const clean = cleanBrain(brain);
  if (!clean) return res.status(400).json({ error: 'Donnees invalides' });
  account.brain = clean;
  await writeAccount(account);
  res.json({ ok: true });
}));

// Diagnostic : quelle base garde les comptes, et sa derniere erreur (aucun secret affiche)
app.get('/api/account/storage', (req, res) => {
  let host = null;
  try { host = SUPABASE_URL ? new URL(SUPABASE_URL).host : null; } catch { host = 'adresse invalide'; }
  res.json({
    storage: USE_SUPABASE ? 'supabase' : USE_UPSTASH ? 'upstash' : 'fichiers (effaces au redemarrage)',
    supabaseHost: host,
    keyType: SUPABASE_KEY ? (SUPABASE_KEY.startsWith('sb_secret_') ? 'secret' : SUPABASE_KEY.startsWith('sb_publishable_') ? 'publishable (mauvaise cle)' : SUPABASE_KEY.startsWith('eyJ') ? 'ancienne cle (eyJ)' : 'inconnue') : null,
    lastError: lastDbError,
  });
});

// ============ Memoire commune de la mini-IA ============
// Chaque mini-IA apprend sur son eleve ; ici, elles mettent en commun ce qu'elles savent, sans aucun
// nom : pour chaque classe et chaque matiere, le niveau moyen des eleves. Gardee dans la meme base
// que les comptes (un prenom simplifie ne peut jamais commencer par "_", donc pas de melange).
const COLLECTIVE_KEY = '_memoire_commune';
let collectiveCache = null;
async function getCollective() {
  if (!collectiveCache) collectiveCache = ((await readAccount(COLLECTIVE_KEY)) || {}).stats || {};
  return collectiveCache;
}
function collectiveGroup(grade, subject) {
  if (typeof subject !== 'string' || !subject.trim() || subject.length > 60) return null;
  return `${GRADES.includes(grade) ? grade : 'Autre'}|${subject.trim()}`;
}
const collectiveHits = new Map();

app.get('/api/brain/collective', safe(async (req, res) => {
  const group = collectiveGroup(req.query.grade, req.query.subject);
  if (!group) return res.status(400).json({ error: 'Donnees invalides' });
  const g = (await getCollective())[group];
  res.json(g ? { count: g.count, mean: g.mean } : { count: 0 });
}));

app.post('/api/brain/collective', safe(async (req, res) => {
  const { grade, subject, theta } = req.body || {};
  const group = collectiveGroup(grade, subject);
  if (!group || !Number.isFinite(theta)) return res.status(400).json({ error: 'Donnees invalides' });
  // Pas plus de 20 envois par minute et par ordinateur, pour qu'on ne puisse pas fausser la moyenne
  const now = Date.now();
  const hits = (collectiveHits.get(req.ip) || []).filter((t) => now - t < 60000);
  if (hits.length >= 20) return res.status(429).json({ error: 'Trop de requetes' });
  hits.push(now);
  collectiveHits.set(req.ip, hits);
  const stats = await getCollective();
  const g = stats[group] || (stats[group] = { count: 0, mean: 0 });
  // Moyenne qui suit les derniers eleves (au-dela de 500, les nouveaux comptent toujours un peu)
  g.count = Math.min(g.count + 1, 500);
  g.mean += (Math.max(-4, Math.min(4, theta)) - g.mean) / g.count;
  await writeAccount({ key: COLLECTIVE_KEY, stats });
  res.json({ ok: true, count: g.count });
}));

app.listen(PORT, () => {
  console.log(`Maitresse virtuelle disponible sur http://localhost:${PORT}`);
});
