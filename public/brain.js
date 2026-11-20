// ============ Mini-IA de progression ============
// Elle apprend le niveau de l'eleve dans chaque matiere a partir de ses reponses aux quiz
// (modele d'Elo, comme aux echecs : chaque bonne reponse a une question difficile fait
// monter le niveau, chaque erreur sur une question facile le fait baisser). Elle s'en sert
// pour choisir la difficulte du prochain quiz et pour conseiller quoi reviser.
// Tout reste dans le navigateur de l'eleve (et dans son compte s'il en a un).
(function (root) {
  const LEVELS = ['facile', 'normal', 'difficile'];
  const LEVEL_OFFSET = { facile: -1, normal: 0, difficile: 1 };
  // Taux de reussite vise : assez haut pour encourager, assez bas pour faire progresser
  const TARGET_SUCCESS = 0.7;
  // Reglages trouves par l'entrainement (voir train-brain.js) sur des eleves simules
  const PARAMS = { k0: 0.45, kMin: 0.03, kDecay: 0.2, spread: 1.5 };
  const MIN_ANSWERS = 3; // en dessous, la mini-IA ne sait pas encore assez de choses
  // Regarder une video en entier fait un peu progresser (comme dans l'entrainement : l'eleve
  // progresse en travaillant) ; une question au prof compte comme du travail sur la matiere
  const VIDEO_BOOST = 0.1;

  function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }

  // Les questions d'un quiz vont du plus facile au plus difficile
  function questionDifficulty(level, index, total, params) {
    const pos = total > 1 ? index / (total - 1) - 0.5 : 0;
    return (LEVEL_OFFSET[level] ?? 0) + params.spread * pos;
  }

  function create(saved) {
    const brain = { subjects: {} };
    if (saved && typeof saved === 'object' && saved.subjects && typeof saved.subjects === 'object') {
      for (const [name, s] of Object.entries(saved.subjects)) {
        if (s && Number.isFinite(s.theta) && Number.isFinite(s.n)) {
          const recent = Array.isArray(s.recent) ? s.recent.filter(Number.isFinite).slice(-3) : [];
          brain.subjects[name] = { theta: s.theta, n: s.n, videos: s.videos || 0, questions: s.questions || 0, recent };
        }
      }
    }
    return brain;
  }

  // q = { level, index, total, guess } ; guess = chance de trouver au hasard (1/4 en QCM, 0 a l'ecrit)
  function predict(brain, subject, q, params = PARAMS) {
    const s = brain.subjects[subject];
    const guess = q.guess || 0;
    return guess + (1 - guess) * sigmoid((s ? s.theta : 0) - questionDifficulty(q.level, q.index, q.total, params));
  }

  // Apprend d'une reponse : elle corrige son estimation selon a quel point elle s'est trompee
  // (une bonne reponse en QCM compte moins, car elle a pu etre trouvee au hasard)
  function record(brain, subject, q, correct, params = PARAMS) {
    const s = subjectState(brain, subject);
    const guess = q.guess || 0;
    const sig = sigmoid(s.theta - questionDifficulty(q.level, q.index, q.total, params));
    const p = guess + (1 - guess) * sig;
    const k = Math.max(params.kMin, params.k0 / (1 + s.n * params.kDecay));
    const gradient = ((correct ? 1 : 0) - p) * (1 - guess) * sig * (1 - sig) / Math.max(1e-6, p * (1 - p));
    s.theta = Math.max(-4, Math.min(4, s.theta + k * gradient));
    s.n++;
  }

  function subjectState(brain, subject) {
    return brain.subjects[subject] || (brain.subjects[subject] = { theta: 0, n: 0, videos: 0, questions: 0, recent: [] });
  }

  // Apprend aussi de ce que l'eleve fait en dehors des quiz : 'video' (regardee en entier) ou 'question' (au prof)
  function activity(brain, subject, kind) {
    const s = subjectState(brain, subject);
    if (kind === 'video') {
      s.videos = (s.videos || 0) + 1;
      s.theta = Math.min(4, s.theta + VIDEO_BOOST);
    } else if (kind === 'question') {
      s.questions = (s.questions || 0) + 1;
    }
  }

  function totals(brain) {
    let videos = 0, questions = 0;
    for (const s of Object.values(brain.subjects)) { videos += s.videos || 0; questions += s.questions || 0; }
    return { videos, questions };
  }

  // Profil de l'eleve pour que Claude adapte ses lecons : son niveau dans la matiere,
  // sa facon preferee d'apprendre (videos, questions au prof ou quiz) et sa matiere la plus difficile
  function profile(brain, subject) {
    const result = {};
    const level = mastery(brain, subject);
    if (level !== null) result.level = level;
    const { videos, questions } = totals(brain);
    let quizzes = 0;
    for (const s of Object.values(brain.subjects)) quizzes += Math.round((s.n || 0) / 10);
    const ways = { video: videos, questions, quiz: quizzes };
    const [bestWay, bestCount] = Object.entries(ways).sort((a, b) => b[1] - a[1])[0];
    if (bestCount >= 3) result.style = bestWay;
    const weak = weakest(brain);
    if (weak && weak !== subject && mastery(brain, weak) < 60) result.weak = weak;
    return result;
  }

  // Livre du bon prof, chapitre 6 : un eleve qui rate deux quiz de suite est decourage
  function isDiscouraged(s) {
    const recent = (s && s.recent) || [];
    return recent.length >= 2 && recent.slice(-2).every((r) => r < 0.3);
  }

  // Note le resultat d'un quiz termine (taux de bonnes reponses), pour reperer le decouragement
  function endQuiz(brain, subject, correct, total) {
    const s = subjectState(brain, subject);
    s.recent = [...(s.recent || []), total > 0 ? correct / total : 0].slice(-3);
  }

  // Livre du bon prof, chapitre 6 : feliciter l'effort, et rassurer quand ca n'a pas marche
  function encouragement(brain, subject) {
    const s = brain.subjects[subject];
    const last = s && s.recent && s.recent.length ? s.recent[s.recent.length - 1] : null;
    if (last === null) return null;
    if (isDiscouraged(s)) return 'brainCheerReset';
    if (last < 0.5) return 'brainCheerLow';
    if (last < 0.9) return 'brainCheerMid';
    return 'brainCheerHigh';
  }

  // Memoire commune : avant ses premieres reponses, l'eleve commence avec le niveau moyen des eleves
  // de sa classe dans cette matiere (au lieu de partir de zero)
  function setPrior(brain, subject, theta) {
    if (!Number.isFinite(theta)) return;
    const s = subjectState(brain, subject);
    if (s.n > 0) return;
    s.theta = Math.max(-4, Math.min(4, theta));
    s.prior = true;
  }

  // Choisit le niveau dont la reussite prevue est la plus proche de l'objectif
  function chooseLevel(brain, subject, guess = 0) {
    const s = brain.subjects[subject];
    if (!s || (s.n < MIN_ANSWERS && !s.prior)) return 'normal';
    // Decourage : on revient a une etape plus facile qu'il va reussir, pour lui redonner confiance
    if (isDiscouraged(s)) return 'facile';
    let best = 'normal';
    let bestGap = Infinity;
    for (const level of LEVELS) {
      const gap = Math.abs(guess + (1 - guess) * sigmoid(s.theta - LEVEL_OFFSET[level]) - TARGET_SUCCESS);
      if (gap < bestGap) { bestGap = gap; best = level; }
    }
    return best;
  }

  // Niveau en pourcentage : chance de reussir une question normale de cette matiere
  function mastery(brain, subject) {
    const s = brain.subjects[subject];
    if (!s || s.n < MIN_ANSWERS) return null;
    return Math.round(sigmoid(s.theta) * 100);
  }

  function weakest(brain) {
    let worst = null;
    for (const [name, s] of Object.entries(brain.subjects)) {
      if (s.n >= MIN_ANSWERS && (!worst || s.theta < brain.subjects[worst].theta)) worst = name;
    }
    return worst;
  }

  function summary(brain) {
    return Object.keys(brain.subjects)
      .map((name) => ({ name, mastery: mastery(brain, name) }))
      .filter((s) => s.mastery !== null)
      .sort((a, b) => b.mastery - a.mastery);
  }

  const MiniIA = { LEVELS, PARAMS, create, predict, record, activity, totals, profile, endQuiz, encouragement, setPrior, chooseLevel, mastery, weakest, summary, questionDifficulty };
  if (typeof module !== 'undefined' && module.exports) module.exports = MiniIA;
  else root.MiniIA = MiniIA;
})(typeof window !== 'undefined' ? window : globalThis);
