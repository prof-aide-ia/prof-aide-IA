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
        if (s && Number.isFinite(s.theta) && Number.isFinite(s.n)) brain.subjects[name] = { theta: s.theta, n: s.n };
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
    const s = brain.subjects[subject] || (brain.subjects[subject] = { theta: 0, n: 0 });
    const guess = q.guess || 0;
    const sig = sigmoid(s.theta - questionDifficulty(q.level, q.index, q.total, params));
    const p = guess + (1 - guess) * sig;
    const k = Math.max(params.kMin, params.k0 / (1 + s.n * params.kDecay));
    const gradient = ((correct ? 1 : 0) - p) * (1 - guess) * sig * (1 - sig) / Math.max(1e-6, p * (1 - p));
    s.theta = Math.max(-4, Math.min(4, s.theta + k * gradient));
    s.n++;
  }

  // Choisit le niveau dont la reussite prevue est la plus proche de l'objectif
  function chooseLevel(brain, subject, guess = 0) {
    const s = brain.subjects[subject];
    if (!s || s.n < MIN_ANSWERS) return 'normal';
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

  const MiniIA = { LEVELS, PARAMS, create, predict, record, chooseLevel, mastery, weakest, summary, questionDifficulty };
  if (typeof module !== 'undefined' && module.exports) module.exports = MiniIA;
  else root.MiniIA = MiniIA;
})(typeof window !== 'undefined' ? window : globalThis);
