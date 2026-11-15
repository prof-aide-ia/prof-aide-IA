// Entrainement de la mini-IA de progression (public/brain.js).
// On simule des eleves dont on connait le vrai niveau, ils font des quiz choisis par la mini-IA,
// et on cherche les reglages qui lui permettent de deviner le plus vite et le plus juste
// si l'eleve va reussir la prochaine question. Lancer : node train-brain.js
const MiniIA = require('./public/brain.js');

// Generateur aleatoire reproductible (memes eleves simules a chaque lancement)
function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
function gaussian(rand) {
  return Math.sqrt(-2 * Math.log(rand() + 1e-12)) * Math.cos(2 * Math.PI * rand());
}

const QUIZ_SIZE = 10;
const QUIZZES_PER_STUDENT = 8;

// Un eleve simule : vrai niveau inconnu de la mini-IA, il progresse un peu a chaque quiz,
// et peut repondre au hasard (1 chance sur 4 en QCM)
function simulate(params, students, seed) {
  const rand = rng(seed);
  let logLoss = 0, count = 0, inZone = 0, quizzes = 0;
  const curve = new Array(QUIZZES_PER_STUDENT).fill(0);
  for (let st = 0; st < students; st++) {
    const brain = MiniIA.create();
    let trueTheta = gaussian(rand) * 1.2;
    for (let qz = 0; qz < QUIZZES_PER_STUDENT; qz++) {
      const level = MiniIA.chooseLevel(brain, 'maths', 0.25);
      let correctCount = 0;
      for (let i = 0; i < QUIZ_SIZE; i++) {
        // L'IA qui ecrit les questions ne respecte pas parfaitement la difficulte demandee
        const realDifficulty = MiniIA.questionDifficulty(level, i, QUIZ_SIZE, { spread: 1.5 }) + gaussian(rand) * 0.5;
        const pTrue = 0.25 + 0.75 / (1 + Math.exp(-(trueTheta - realDifficulty)));
        const correct = rand() < pTrue;
        const p = Math.min(0.999, Math.max(0.001, MiniIA.predict(brain, 'maths', { level, index: i, total: QUIZ_SIZE, guess: 0.25 }, params)));
        const loss = -(correct ? Math.log(p) : Math.log(1 - p));
        logLoss += loss; count++;
        curve[qz] += loss;
        if (correct) correctCount++;
        MiniIA.record(brain, 'maths', { level, index: i, total: QUIZ_SIZE, guess: 0.25 }, correct, params);
      }
      const rate = correctCount / QUIZ_SIZE;
      if (rate >= 0.5 && rate <= 0.9) inZone++;
      quizzes++;
      trueTheta += 0.05; // il progresse en travaillant
    }
  }
  return {
    logLoss: logLoss / count,
    inZone: inZone / quizzes,
    curve: curve.map((c) => c / (students * QUIZ_SIZE)),
  };
}

const grid = [];
for (const k0 of [0.05, 0.1, 0.15, 0.2, 0.3, 0.45])
  for (const kMin of [0, 0.01, 0.02, 0.03, 0.05])
    for (const kDecay of [0.05, 0.1, 0.2, 0.4, 0.8])
      for (const spread of [1, 1.5, 2])
        grid.push({ k0, kMin, kDecay, spread });

console.log(`Entrainement : ${grid.length} reglages testes sur 2000 eleves simules chacun...`);
let best = null;
for (const params of grid) {
  const r = simulate(params, 2000, 42);
  if (!best || r.logLoss < best.r.logLoss) best = { params, r };
}

// Verification sur d'autres eleves, jamais vus pendant l'entrainement
const before = simulate(MiniIA.PARAMS, 3000, 7);
const after = simulate(best.params, 3000, 7);
const noBrain = { k0: 0, kMin: 0, kDecay: 0, spread: best.params.spread };
const blind = simulate(noBrain, 3000, 7);

console.log('\nMeilleurs reglages :', JSON.stringify(best.params));
console.log(`Erreur de prediction (plus bas = mieux) : sans apprendre ${blind.logLoss.toFixed(3)} | reglages actuels ${before.logLoss.toFixed(3)} | apres entrainement ${after.logLoss.toFixed(3)}`);
console.log(`Quiz dans la bonne zone (50 a 90 % de reussite) : sans apprendre ${(blind.inZone * 100).toFixed(0)} % | apres entrainement ${(after.inZone * 100).toFixed(0)} %`);
console.log('Erreur quiz apres quiz (elle apprend l\'eleve) :', after.curve.map((c) => c.toFixed(3)).join(' -> '));
