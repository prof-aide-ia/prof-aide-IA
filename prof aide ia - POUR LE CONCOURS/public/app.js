(function () {
// ============ Donnees : matieres organisees par section ============
const TOPIC_SECTIONS = [
  { section: 'Sciences', items: [
    { icon: '📐', label: 'Mathématiques' },
    { icon: '🔢', label: 'Algèbre' },
    { icon: '📏', label: 'Géométrie' },
    { icon: '🧮', label: 'Calcul mental' },
    { icon: '½', label: 'Fractions' },
    { icon: '📈', label: 'Statistiques' },
    { icon: '⚡', label: 'Physique-Chimie' },
    { icon: '🧪', label: 'Chimie' },
    { icon: '🔭', label: 'Physique' },
    { icon: '🌿', label: 'SVT' },
    { icon: '🧬', label: 'Biologie' },
    { icon: '🌌', label: 'Astronomie' },
    { icon: '♻️', label: 'Écologie' },
    { icon: '🪨', label: 'Géologie' },
    { icon: '🌤️', label: 'Météorologie' },
  ]},
  { section: 'Langues & Littérature', items: [
    { icon: '📚', label: 'Français' },
    { icon: '📖', label: 'Lecture' },
    { icon: '✍️', label: 'Orthographe' },
    { icon: '📝', label: 'Grammaire' },
    { icon: '🔄', label: 'Conjugaison' },
    { icon: '🎙️', label: 'Dictée' },
    { icon: '🇬🇧', label: 'Anglais' },
    { icon: '🇪🇸', label: 'Espagnol' },
    { icon: '🇩🇪', label: 'Allemand' },
    { icon: '🇮🇹', label: 'Italien' },
    { icon: '🇵🇹', label: 'Portugais' },
    { icon: '🌙', label: 'Arabe' },
    { icon: '🇨🇳', label: 'Chinois' },
    { icon: '🇯🇵', label: 'Japonais' },
    { icon: '🏛️', label: 'Latin' },
    { icon: '⚱️', label: 'Grec ancien' },
    { icon: '🇷🇺', label: 'Russe' },
  ]},
  { section: 'Histoire & Géographie', items: [
    { icon: '🏰', label: 'Histoire' },
    { icon: '🗺️', label: 'Géographie' },
    { icon: '🌍', label: 'Histoire-Géo' },
    { icon: '🏛️', label: 'Éducation civique' },
    { icon: '⚖️', label: 'EMC' },
    { icon: '🦕', label: 'Préhistoire' },
    { icon: '🏺', label: 'Antiquité' },
    { icon: '⚔️', label: 'Moyen Âge' },
    { icon: '🗽', label: 'Révolution française' },
    { icon: '✌️', label: '2nde Guerre mondiale' },
    { icon: '🌐', label: 'Géopolitique' },
  ]},
  { section: 'Tech & Numérique', items: [
    { icon: '💻', label: 'Informatique' },
    { icon: '🖥️', label: 'Programmation' },
    { icon: '🐱', label: 'Scratch' },
    { icon: '🐍', label: 'Python' },
    { icon: '⚙️', label: 'Technologie' },
    { icon: '🤖', label: 'Robotique' },
    { icon: '🧠', label: 'Intelligence artificielle' },
    { icon: '📡', label: 'Réseaux' },
  ]},
  { section: 'Arts & Création', items: [
    { icon: '🎨', label: 'Arts plastiques' },
    { icon: '✏️', label: 'Dessin' },
    { icon: '🎵', label: 'Musique' },
    { icon: '🎤', label: 'Chant' },
    { icon: '🎭', label: 'Théâtre' },
    { icon: '💃', label: 'Danse' },
    { icon: '🎬', label: 'Cinéma' },
    { icon: '📷', label: 'Photographie' },
    { icon: '🗿', label: 'Sculpture' },
    { icon: '🖼️', label: 'Histoire des arts' },
  ]},
  { section: 'Sport & Santé', items: [
    { icon: '⚽', label: 'EPS' },
    { icon: '🏊', label: 'Natation' },
    { icon: '🏃', label: 'Athlétisme' },
    { icon: '🤸', label: 'Gymnastique' },
    { icon: '🥗', label: 'Nutrition' },
    { icon: '🏥', label: 'Santé' },
    { icon: '🩹', label: 'Premiers secours' },
  ]},
  { section: 'Économie & Société', items: [
    { icon: '📊', label: 'Économie' },
    { icon: '💹', label: 'SES' },
    { icon: '🤔', label: 'Philosophie' },
    { icon: '👥', label: 'Sociologie' },
    { icon: '🧠', label: 'Psychologie' },
    { icon: '⚖️', label: 'Droit' },
    { icon: '💰', label: 'Finance' },
  ]},
  { section: 'Spécialités lycée', items: [
    { icon: '💾', label: 'NSI' },
    { icon: '∞', label: 'Maths expertes' },
    { icon: '🌏', label: 'LLCE' },
    { icon: '🎭', label: 'AMC' },
    { icon: '🌍', label: 'HGGSP' },
    { icon: '💭', label: 'HLPSI' },
    { icon: '🩺', label: 'ST2S' },
    { icon: '🔧', label: 'STI2D' },
    { icon: '🔬', label: 'STL' },
    { icon: '📋', label: 'STMG' },
    { icon: '📐', label: 'Terminale maths' },
  ]},
  { section: 'Activités & Pratiques', items: [
    { icon: '🍳', label: 'Cuisine' },
    { icon: '🌱', label: 'Jardinage' },
    { icon: '🧵', label: 'Couture' },
    { icon: '🔨', label: 'Bricolage' },
    { icon: '🦢', label: 'Origami' },
    { icon: '🖋️', label: 'Calligraphie' },
    { icon: '♟️', label: 'Échecs' },
    { icon: '🪄', label: 'Magie' },
    { icon: '🎲', label: 'Jeux de société' },
  ]},
  { section: 'Curiosités & Découvertes', items: [
    { icon: '⚡', label: 'Mythologie grecque' },
    { icon: '🐉', label: 'Mythologie nordique' },
    { icon: '🦖', label: 'Dinosaures' },
    { icon: '🐘', label: 'Animaux' },
    { icon: '🚀', label: 'Espace' },
    { icon: '🌊', label: 'Océans' },
    { icon: '🌋', label: 'Volcans' },
    { icon: '🦋', label: 'Insectes' },
    { icon: '🫀', label: 'Corps humain' },
    { icon: '🏗️', label: 'Architecture' },
    { icon: '🏆', label: 'Sport & Champions' },
    { icon: '💡', label: 'Inventions' },
    { icon: '🗺️', label: 'Pays du monde' },
    { icon: '🌮', label: 'Recettes du monde' },
  ]},
];

const ALL_TOPICS = [];
TOPIC_SECTIONS.forEach(section => {
  section.items.forEach(item => {
    ALL_TOPICS.push({ icon: item.icon, subject: section.section, label: item.label });
  });
});

// Traduction des 109 themes : anglais complet pour l'instant (les autres langues restent en francais,
// trop de contenu pour tout traduire d'un coup - voir avec l'utilisateur si besoin d'en ajouter d'autres).
const TOPIC_TRANSLATIONS = {
  'en-US': {
    sections: {
      'Sciences': 'Sciences', 'Langues & Littérature': 'Languages & Literature',
      'Histoire & Géographie': 'History & Geography', 'Tech & Numérique': 'Tech & Digital',
      'Arts & Création': 'Arts & Creativity', 'Sport & Santé': 'Sport & Health',
      'Économie & Société': 'Economics & Society', 'Spécialités lycée': 'High School Electives',
      'Activités & Pratiques': 'Activities & Hobbies', 'Curiosités & Découvertes': 'Curiosities & Discoveries',
    },
    labels: {
      'Mathématiques': 'Mathematics', 'Algèbre': 'Algebra', 'Géométrie': 'Geometry', 'Calcul mental': 'Mental Math',
      'Fractions': 'Fractions', 'Statistiques': 'Statistics', 'Physique-Chimie': 'Physics-Chemistry', 'Chimie': 'Chemistry',
      'Physique': 'Physics', 'SVT': 'Life & Earth Sciences', 'Biologie': 'Biology', 'Astronomie': 'Astronomy',
      'Écologie': 'Ecology', 'Géologie': 'Geology', 'Météorologie': 'Meteorology',
      'Français': 'French', 'Lecture': 'Reading', 'Orthographe': 'Spelling', 'Grammaire': 'Grammar',
      'Conjugaison': 'Verb Conjugation', 'Dictée': 'Dictation', 'Anglais': 'English', 'Espagnol': 'Spanish',
      'Allemand': 'German', 'Italien': 'Italian', 'Portugais': 'Portuguese', 'Arabe': 'Arabic', 'Chinois': 'Chinese',
      'Japonais': 'Japanese', 'Latin': 'Latin', 'Grec ancien': 'Ancient Greek', 'Russe': 'Russian',
      'Histoire': 'History', 'Géographie': 'Geography', 'Histoire-Géo': 'History-Geography',
      'Éducation civique': 'Civics', 'EMC': 'Moral & Civic Education', 'Préhistoire': 'Prehistory',
      'Antiquité': 'Antiquity', 'Moyen Âge': 'Middle Ages', 'Révolution française': 'French Revolution',
      '2nde Guerre mondiale': 'World War II', 'Géopolitique': 'Geopolitics',
      'Informatique': 'Computer Science', 'Programmation': 'Programming', 'Scratch': 'Scratch', 'Python': 'Python',
      'Technologie': 'Technology', 'Robotique': 'Robotics', 'Intelligence artificielle': 'Artificial Intelligence',
      'Réseaux': 'Networks',
      'Arts plastiques': 'Visual Arts', 'Dessin': 'Drawing', 'Musique': 'Music', 'Chant': 'Singing',
      'Théâtre': 'Theater', 'Danse': 'Dance', 'Cinéma': 'Cinema', 'Photographie': 'Photography',
      'Sculpture': 'Sculpture', 'Histoire des arts': 'Art History',
      'EPS': 'Physical Education', 'Natation': 'Swimming', 'Athlétisme': 'Athletics', 'Gymnastique': 'Gymnastics',
      'Nutrition': 'Nutrition', 'Santé': 'Health', 'Premiers secours': 'First Aid',
      'Économie': 'Economics', 'SES': 'Social & Economic Sciences', 'Philosophie': 'Philosophy',
      'Sociologie': 'Sociology', 'Psychologie': 'Psychology', 'Droit': 'Law', 'Finance': 'Finance',
      'NSI': 'Computer Science (NSI)', 'Maths expertes': 'Advanced Mathematics', 'LLCE': 'Foreign Language Lit. (LLCE)',
      'AMC': 'Cinema & Audiovisual Arts', 'HGGSP': 'History-Geo & Geopolitics (HGGSP)',
      'HLPSI': 'Humanities & Philosophy (HLP)', 'ST2S': 'Health & Social Sciences (ST2S)',
      'STI2D': 'Sustainable Industry & Dev. (STI2D)', 'STL': 'Lab Sciences & Technology (STL)',
      'STMG': 'Management Sciences (STMG)', 'Terminale maths': 'Senior Year Math',
      'Cuisine': 'Cooking', 'Jardinage': 'Gardening', 'Couture': 'Sewing', 'Bricolage': 'DIY',
      'Origami': 'Origami', 'Calligraphie': 'Calligraphy', 'Échecs': 'Chess', 'Magie': 'Magic',
      'Jeux de société': 'Board Games',
      'Mythologie grecque': 'Greek Mythology', 'Mythologie nordique': 'Norse Mythology', 'Dinosaures': 'Dinosaurs',
      'Animaux': 'Animals', 'Espace': 'Space', 'Océans': 'Oceans', 'Volcans': 'Volcanoes', 'Insectes': 'Insects',
      'Corps humain': 'Human Body', 'Architecture': 'Architecture', 'Sport & Champions': 'Sports & Champions',
      'Inventions': 'Inventions', 'Pays du monde': 'Countries of the World', 'Recettes du monde': 'World Recipes',
    },
  },
};

function translateTopic(topic) {
  const dict = TOPIC_TRANSLATIONS[profLanguage.code];
  if (!dict) return topic;
  return {
    icon: topic.icon,
    subject: dict.sections[topic.subject] || topic.subject,
    label: dict.labels[topic.label] || topic.label,
  };
}

// ============ Elements ============
const selectScreen = document.getElementById('selectScreen');
const gradeScreen = document.getElementById('gradeScreen');
const subjectScreen = document.getElementById('subjectScreen');
const mainApp = document.getElementById('mainApp');

const subjectSearchOnboarding = document.getElementById('subjectSearchOnboarding');
const subjectResultsOnboarding = document.getElementById('subjectResultsOnboarding');

const avatarEl = document.getElementById('avatar');
const avatarImgEl = document.getElementById('avatarImg');
const profTitleNameEl = document.getElementById('profTitleName');
const gradeSubtitleEl = document.getElementById('gradeSubtitle');

const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const bubbleText = document.getElementById('bubbleText');
const eleveLine = document.getElementById('eleveLine');
const errorBanner = document.getElementById('errorBanner');
const suggestionChip = document.getElementById('suggestionChip');

const changeSubjectBtn = document.getElementById('changeSubjectBtn');
const subjectPicker = document.getElementById('subjectPicker');
const subjectSearch = document.getElementById('subjectSearch');
const subjectResults = document.getElementById('subjectResults');
const subjectIcon = document.getElementById('subjectIcon');
const subjectLabel = document.getElementById('subjectLabel');

const micBtn = document.getElementById('micBtn');
const textInput = document.getElementById('textInput');
const sendTextBtn = document.getElementById('sendTextBtn');

const canvas = document.getElementById('tableau');
const ctx = canvas.getContext('2d');
const boardPlaceholder = document.getElementById('boardPlaceholder');

const launchQuizBtn = document.getElementById('launchQuizBtn');
const launchEvalBtn = document.getElementById('launchEvalBtn');
const launchEcritBtn = document.getElementById('launchEcritBtn');
const quizScreen = document.getElementById('quizScreen');
const quizCloseBtn = document.getElementById('quizCloseBtn');
const quizBadge = document.getElementById('quizBadge');
const quizScoreEl = document.getElementById('quizScore');
const quizTimerEl = document.getElementById('quizTimer');
const quizLoading = document.getElementById('quizLoading');
const quizBody = document.getElementById('quizBody');
const quizQNumber = document.getElementById('quizQNumber');
const quizQText = document.getElementById('quizQText');
const quizOptions = document.getElementById('quizOptions');
const quizOptionsEls = Array.from(document.querySelectorAll('.quiz-option'));
const quizWritten = document.getElementById('quizWritten');
const quizWrittenInput = document.getElementById('quizWrittenInput');
const quizWrittenValidateBtn = document.getElementById('quizWrittenValidateBtn');
const quizExplanation = document.getElementById('quizExplanation');
const quizNextBtn = document.getElementById('quizNextBtn');
const quizEvalBody = document.getElementById('quizEvalBody');
const quizEvalList = document.getElementById('quizEvalList');
const quizEvalValidateBtn = document.getElementById('quizEvalValidateBtn');
const quizResult = document.getElementById('quizResult');
const quizResultScore = document.getElementById('quizResultScore');
const quizRestartBtn = document.getElementById('quizRestartBtn');
const quizBackBtn = document.getElementById('quizBackBtn');

const openVideoBtn = document.getElementById('openVideoBtn');
const videoScreen = document.getElementById('videoScreen');
const videoScreenTitle = document.getElementById('videoScreenTitle');
const videoScreenBody = document.getElementById('videoScreenBody');
const videoCloseBtn = document.getElementById('videoCloseBtn');
const videoRewardBanner = document.getElementById('videoRewardBanner');

const openFicheBtn = document.getElementById('openFicheBtn');
const ficheScreen = document.getElementById('ficheScreen');
const ficheHeaderTitle = document.getElementById('ficheHeaderTitle');
const ficheCloseBtn = document.getElementById('ficheCloseBtn');
const ficheLoading = document.getElementById('ficheLoading');
const ficheContent = document.getElementById('ficheContent');
const ficheTitre = document.getElementById('ficheTitre');
const ficheMeta = document.getElementById('ficheMeta');
const ficheSectionsEl = document.getElementById('ficheSections');
const ficheResumeEl = document.getElementById('ficheResume');
const downloadFicheBtn = document.getElementById('downloadFicheBtn');

const openGamesBtn = document.getElementById('openGamesBtn');
const gamesScreen = document.getElementById('gamesScreen');
const gamesCloseBtn = document.getElementById('gamesCloseBtn');
const gamesStarsBadge = document.getElementById('gamesStarsBadge');
const gamesListEl = document.getElementById('gamesList');
const gamePlayScreen = document.getElementById('gamePlayScreen');
const gamePlayTitle = document.getElementById('gamePlayTitle');
const gamePlayTimer = document.getElementById('gamePlayTimer');
const gamePlayCloseBtn = document.getElementById('gamePlayCloseBtn');
const gameCanvas = document.getElementById('gameCanvas');
const gameCtx = gameCanvas.getContext('2d');
const gameEndOverlay = document.getElementById('gameEndOverlay');
const gameEndText = document.getElementById('gameEndText');
const gameEndCloseBtn = document.getElementById('gameEndCloseBtn');

const starsBadge = document.getElementById('starsBadge');

const accountOpenBtn = document.getElementById('accountOpenBtn');
const accountBtnLabel = document.getElementById('accountBtnLabel');
const accountScreen = document.getElementById('accountScreen');
const accountCloseBtn = document.getElementById('accountCloseBtn');
const accountLoggedOutView = document.getElementById('accountLoggedOutView');
const accountLoggedInView = document.getElementById('accountLoggedInView');
const accountNameInput = document.getElementById('accountNameInput');
const accountCodeInput = document.getElementById('accountCodeInput');
const accountError = document.getElementById('accountError');
const accountLoginBtn = document.getElementById('accountLoginBtn');
const accountLoggedName = document.getElementById('accountLoggedName');
const accountLoggedStars = document.getElementById('accountLoggedStars');
const accountLogoutBtn = document.getElementById('accountLogoutBtn');

const languageOpenBtn = document.getElementById('languageOpenBtn');
const languageBtnLabel = document.getElementById('languageBtnLabel');
const languageScreen = document.getElementById('languageScreen');
const languageCloseBtn = document.getElementById('languageCloseBtn');
const languageOptionsEl = document.getElementById('languageOptions');

// ============ Etat global ============
let gender = 'femme';
let grade = null;
let subject = { icon: '📐', label: 'Mathématiques' };
let history = [];
let listening = false;
let boardColor = '#1f2b45';
let erasing = false;

const NAMES = { femme: 'Prof. Léa', homme: 'Prof. Marc' };
const TITLES = { femme: 'MADAME VIRTUELLE', homme: 'MONSIEUR VIRTUEL' };
const IMAGES = { femme: 'images/madame.jpg', homme: 'images/monsieur.jpg' };

// ============ Portefeuille d'etoiles (persiste) ============
// Sans compte, les etoiles repartent a zero a chaque visite (pas de sauvegarde locale).
// Avec un compte, elles sont sauvegardees cote serveur, attachees au code secret.
let stars = 250;
let villeAccount = null; // { code, name, stars } une fois connecte

function updateStarsDisplay() {
  starsBadge.textContent = `⭐ ${stars}`;
  gamesStarsBadge.textContent = `⭐ ${stars}`;
  if (gamesScreen.style.display !== 'none') renderGamesList();
}

function syncAccountStars() {
  if (!villeAccount) return;
  fetch('/api/account/stars', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ code: villeAccount.code, stars }),
  })
    .then(async (res) => {
      if (res.status === 429) {
        const data = await res.json();
        if (Number.isFinite(data.stars)) {
          stars = data.stars;
          updateStarsDisplay();
        }
      }
    })
    .catch(() => {});
}

function addStars(amount) {
  stars += amount;
  updateStarsDisplay();
  syncAccountStars();
}

function spendStars(amount) {
  if (stars < amount) return false;
  stars -= amount;
  updateStarsDisplay();
  syncAccountStars();
  return true;
}

updateStarsDisplay();

// ============ Compte (nom + code secret), accessible depuis le bouton en haut a droite ============
function openAccountScreen() {
  stopProfSpeaking();
  accountError.style.display = 'none';
  if (villeAccount) {
    accountLoggedOutView.style.display = 'none';
    accountLoggedInView.style.display = 'block';
    accountLoggedName.textContent = villeAccount.name;
    accountLoggedStars.textContent = stars;
  } else {
    accountLoggedOutView.style.display = 'block';
    accountLoggedInView.style.display = 'none';
    accountNameInput.value = '';
    accountCodeInput.value = '';
  }
  accountScreen.style.display = 'flex';
}

function closeAccountScreen() {
  accountScreen.style.display = 'none';
}

async function loginAccount() {
  const name = accountNameInput.value.trim();
  const code = accountCodeInput.value.trim();
  if (!code) {
    accountError.textContent = 'Entre un code secret.';
    accountError.style.display = 'block';
    return;
  }
  try {
    const res = await fetch('/api/account/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, code }),
    });
    const data = await res.json();
    if (!res.ok) {
      accountError.textContent = data.error || 'Connexion impossible.';
      accountError.style.display = 'block';
      return;
    }
    villeAccount = data.account;
    stars = villeAccount.stars;
    updateStarsDisplay();
    accountBtnLabel.textContent = villeAccount.name;
    openAccountScreen();
  } catch {
    accountError.textContent = 'Connexion impossible, réessaie.';
    accountError.style.display = 'block';
  }
}

function logoutAccount() {
  villeAccount = null;
  stars = 0;
  updateStarsDisplay();
  accountBtnLabel.textContent = 'Se connecter à ton compte';
  openAccountScreen();
}

accountOpenBtn.addEventListener('click', openAccountScreen);
accountCloseBtn.addEventListener('click', closeAccountScreen);
accountLoginBtn.addEventListener('click', loginAccount);
accountLogoutBtn.addEventListener('click', logoutAccount);

// ============ Langue : le prof parle/ecrit dans la langue choisie (menus du site restent en francais) ============
const LANGUAGES = [
  { code: 'en-US', label: 'Anglais', native: 'English' },
  { code: 'zh-CN', label: 'Chinois', native: '中文（普通话）' },
  { code: 'hi-IN', label: 'Hindi', native: 'हिन्दी' },
  { code: 'es-ES', label: 'Espagnol', native: 'Español' },
  { code: 'fr-FR', label: 'Français', native: 'Français' },
  { code: 'ar-SA', label: 'Arabe', native: 'العربية' },
  { code: 'bn-BD', label: 'Bengali', native: 'বাংলা' },
  { code: 'pt-PT', label: 'Portugais', native: 'Português' },
  { code: 'ru-RU', label: 'Russe', native: 'Русский' },
  { code: 'ur-PK', label: 'Ourdou', native: 'اردو' },
  { code: 'id-ID', label: 'Indonésien', native: 'Bahasa Indonesia' },
  { code: 'de-DE', label: 'Allemand', native: 'Deutsch' },
  { code: 'ja-JP', label: 'Japonais', native: '日本語' },
  { code: 'ko-KR', label: 'Coréen', native: '한국어' },
  { code: 'it-IT', label: 'Italien', native: 'Italiano' },
];
const FRENCH_LANG = LANGUAGES.find(l => l.code === 'fr-FR');

// Toujours francais au demarrage, meme si une autre langue a ete choisie lors d'une visite precedente
let profLanguage = FRENCH_LANG;

function renderLanguageOptions() {
  languageOptionsEl.innerHTML = '';
  LANGUAGES.forEach(lang => {
    const btn = document.createElement('button');
    btn.className = 'language-option' + (lang.code === profLanguage.code ? ' active' : '');
    btn.innerHTML = `<span>${lang.label}</span><span class="language-option-native">${lang.native}</span>`;
    btn.addEventListener('click', () => selectLanguage(lang));
    languageOptionsEl.appendChild(btn);
  });
}

function selectLanguage(lang) {
  profLanguage = lang;
  languageBtnLabel.textContent = lang.label;
  renderLanguageOptions();
  applyTranslations();
  applyGradeTranslations();
}

languageOpenBtn.addEventListener('click', () => {
  renderLanguageOptions();
  languageScreen.style.display = 'flex';
});
languageCloseBtn.addEventListener('click', () => {
  languageScreen.style.display = 'none';
});

languageBtnLabel.textContent = profLanguage.label;

// ============ Traduction de l'interface (menus/boutons), 15 langues ============
// Note : les 109 sujets de la recherche et les pieces de "Mon ecole de reve" restent en francais
// (trop de contenu a traduire), seuls les menus/boutons/textes fixes sont couverts ici.
const I18N = {
  'fr-FR': {
    accountBtnDefault: "Se connecter à ton compte", appTitle: "Classe Virtuelle",
    appSubtitle: "Ton prof virtuel t'aide à comprendre sans donner la réponse !",
    chooseProf: "CHOISIS TON PROFESSEUR", madameName: "Madame", madameSub: "Virtuelle",
    monsieurName: "Monsieur", monsieurSub: "Virtuel", back: "‹ Retour",
    gradeQuestion: "Tu es en quelle classe ?", gradeSubtitle: "Ton prof virtuel va adapter ses explications pour toi.",
    groupPrimaire: "ÉCOLE PRIMAIRE", groupCollege: "COLLÈGE", groupLycee: "LYCÉE", groupSuperieur: "SUPÉRIEUR",
    groupAutre: "AUTRE", autre: "❓ Autre", subjectQuestion: "Sur quoi veux-tu travailler ?",
    subjectSubtitle: "Cherche une matière parmi plus de 100 sujets, organisés par catégorie.",
    searchPlaceholderLong: "Rechercher un thème (ex: fractions, conjugaison, Révolution française...)",
    searchPlaceholderShort: "Rechercher un thème (ex: fractions, conjugaison...)",
    statusWaiting: "En attente", changer: "Changer", modeVoix: "🎤 Voix", modeEcrire: "⌨️ Écrire",
    modeQuestions: "💡 Questions", micBtn: "🎤 Parler au professeur", writePlaceholder: "Écris ta question...",
    sendBtn: "Envoyer", quizLaunchBtn: "🎮 Lancer le quiz sur ce thème", videoBtn: "🎥 Vidéo", ficheBtn: "📄 Fiche",
    suggestVideo: "🎥 Regarder une vidéo sur ce sujet", suggestFiche: "📄 Voir la fiche de cours", suggestQuiz: "❓ Faire des questions là-dessus",
    ecoleBtn: "🏫 Mon école de rêve", tableauTitle: "🎓 Tableau", gommeTitle: "Gomme", effacerBtn: "🗑 Effacer",
    quizLaunchBtnQcm: "🎯 QCM comme avant (⭐ 25/bonne réponse)", quizLaunchBtnEval: "📋 Évaluation complète (⭐ 30/bonne réponse)",
    quizLaunchBtnEcrit: "✍️ Réponses écrites (⭐ 25-50/bonne réponse)", quizWrittenPlaceholder: "Écris ta réponse...",
    quizValidateBtn: "Valider", quizValidateAllBtn: "Valider mes réponses",
    videoWatchedReward: "🎉 Vidéo entièrement regardée ! +{n} étoiles",
    gamesBtn: "🎮 Jeux vidéo", gamesHeaderTitle: "🎮 Jeux vidéo", gamePriceLabel: "Prix d'entrée",
    gameSeconds: "secondes", gamePlayBtn: "Jouer", gameNeedStars: "Besoin de {n}", gameOverScore: "🎉 Score final : {n}",
    toutEffacerTitle: "Tout effacer", boardPlaceholder: "✏️ Dessine ici ou parle au prof pour qu'il écrive sur le tableau",
    quizLoading: "Préparation du quiz...", quizNextBtn: "Suivant →", quizResultTitle: "🎉 Quiz terminé !",
    quizRestartBtn: "🔁 Recommencer", ficheHeaderTitle: "📄 Fiche de cours", downloadFicheBtn: "⬇️ Télécharger",
    ficheLoading: "Génération de ta fiche de cours...", ficheResumeLabel: "📌 À retenir",
    ecoleProgressLabel: "PROGRESSION ÉCOLE", ecoleSettingsHeading: "⚙️ Paramètres",
    ecoleHint: "⌨️ Flèches pour te déplacer · 🖱️ Clique sur une case vide pour construire",
    ecoleSatisfactionLabel: "SATISFACTION ÉLÈVES", ecoleOpenSchool: "🔔 Ouvrir l'école", ecoleCloseSchool: "🔕 Fermer l'école",
    ecoleScheduleBtn: "📅 Emploi du temps", ecoleSafetyBtn: "🛡️ Sécurité",
    ecoleScheduleTitle: "📅 Emploi du temps", ecoleScheduleIntro: "Place une activité dans chaque créneau. Plus la journée est remplie, plus les élèves sont contents.",
    ecoleScheduleEmpty: "— Rien de prévu —", ecoleScheduleNoRooms: "Construis d'abord des pièces pour pouvoir remplir l'emploi du temps !",
    ecoleRoomConflict: "🚫 Cette salle est déjà prise par l'autre classe à ce créneau !",
    ecoleFloor2Btn: "🏗️ Étage 2 — ⭐ 400", ecoleNotEnoughStars: "⭐ Pas assez d'étoiles pour ça !",
    ecoleFloor2Unlocked: "🏗️ Étage 2 débloqué ! Encore plus de pièces à construire.",
    ecoleTeacherLabel: "👩‍🏫 Maître/Maîtresse (surveille et soigne)", ecoleHireTeacher: "Embaucher",
    ecoleTeacherHired: "👩‍🏫 Un nouveau maître a rejoint l'école !",
    ecoleInjuryNoKit: "🤕 Un élève s'est fait mal ! Pas de trousse de secours... -{n} étoiles.",
    ecoleInjuryHandled: "🩹 Un élève s'est fait mal, mais la trousse de secours a suffi !",
    ecoleFireHandled: "🔥 Un petit incendie s'est déclaré, mais ton équipement l'a vite maîtrisé !",
    ecoleFireDamage: "🔥 Incendie ! Sans assez d'équipement de sécurité, ça a fait des dégâts. -{n} étoiles.",
    ecoleFloor1Tab: "1️⃣ Étage 1", ecoleFloor2Tab: "2️⃣ Étage 2",
    ecolePlayerTookOver: "🧑 Tu prends la place du maître dans cette salle, il va en surveiller une autre !",
    ecoleStudentDroppedOut: "😭 Personne n'est arrivé à temps... cet élève ne revient plus à l'école.",
    ecoleFireEvacuation: "🔥 Tout le monde évacue l'école ! Pas beaucoup d'élèves reviendront demain...",
    ecoleSafetyTitle: "🛡️ Contrôle de sécurité", ecoleSafetyIntro: "Équipe ton école, puis passe le contrôle. Si tu réussis, tu gagnes des étoiles !",
    ecoleRunInspection: "🔍 Lancer le contrôle", ecoleSafetyOwned: "✔ Installé", ecoleSafetyBuy: "Acheter",
    ecoleNeedRooms: "Construis au moins une pièce avant d'ouvrir l'école !",
    ecoleNeedSafetyFirst: "🛡️ Équipe complètement la sécurité avant d'ouvrir l'école !",
    ecoleNeedTeachersFirst: "👩‍🏫 Il faut {n} maître(s) avant d'ouvrir (tu en as {have}) — une classe peut compter sur toi !",
    ecoleSchoolOpened: "🔔 L'école est ouverte ! Les élèves arrivent.", ecoleSchoolClosed: "🔕 L'école est fermée.",
    ecoleInspectionPass: "✅ Contrôle réussi ! Ton école est sûre.",
    ecoleInspectionFail: "❌ Contrôle raté ! Il manque des équipements de sécurité. Les élèves sont inquiets.",
    ecoleBuildTitle: "🧱 Construis cette pièce", cancel: "‹ Annuler", ecoleKeysIntro: "Touches pour se déplacer :",
    avancer: "Avancer", reculer: "Reculer", gauche: "Gauche", droite: "Droite", close: "‹ Fermer",
    accountHeading: "👤 Ton compte",
    accountIntro: "Crée un compte pour garder tes étoiles d'une visite à l'autre. Sans compte, tout repart à zéro à chaque visite.",
    accountNamePlaceholder: "Ton prénom", accountCodePlaceholder: "Code secret (ex: pomme123)",
    accountLoginBtn: "Se connecter / Créer mon compte", accountLoggedAs: "Connecté en tant que",
    accountStarsSaved: "étoiles sauvegardées", accountLogoutBtn: "Se déconnecter",
    languageHeading: "🌐 Choisis ta langue", languageIntro: "Le professeur te parlera et t'écrira dans cette langue.",
    statusThinking: "Elle réfléchit...", statusTalking: "Elle parle...", statusListening: "Je t'écoute...",
    videoComingSoon: "Bientôt disponible !", noResults: "Aucun thème trouvé.", customTopicLabel: "Thème personnalisé",
    noVideoFound: "Aucune vidéo trouvée.", serverError: "Impossible de contacter le serveur.",
    customTopicWorkOn: "✨ Travailler sur :", micNotSupported: "Micro non supporté (essaie Chrome)",
    micErrorPrefix: "Erreur micro :",
    greetingTemplate: "Bonjour ! Je suis {name}. On travaille en {subject} aujourd'hui. Appuie sur le micro et dis-moi ce que tu ne comprends pas !",
    quizResultTemplate: "Score final : {score} points ({correct}/{total} bonnes réponses). {note}",
    quizDifficultySame: "Le niveau du prochain quiz reste le même.",
    quizDifficultyEasier: "Le prochain quiz sera un peu plus facile.",
    quizDifficultyHarder: "Le prochain quiz sera un peu plus difficile !",
  },
  'en-US': {
    accountBtnDefault: "Log in to your account", appTitle: "Virtual Classroom",
    appSubtitle: "Your virtual teacher helps you understand without giving the answer!",
    chooseProf: "CHOOSE YOUR TEACHER", madameName: "Ms.", madameSub: "Virtual",
    monsieurName: "Mr.", monsieurSub: "Virtual", back: "‹ Back",
    gradeQuestion: "What grade are you in?", gradeSubtitle: "Your virtual teacher will adapt explanations for you.",
    groupPrimaire: "ELEMENTARY SCHOOL", groupCollege: "MIDDLE SCHOOL", groupLycee: "HIGH SCHOOL", groupSuperieur: "UNIVERSITY",
    groupAutre: "OTHER", autre: "❓ Other", subjectQuestion: "What do you want to work on?",
    subjectSubtitle: "Search among more than 100 subjects, organized by category.",
    searchPlaceholderLong: "Search a topic (e.g. fractions, verb tenses, French Revolution...)",
    searchPlaceholderShort: "Search a topic (e.g. fractions, verb tenses...)",
    statusWaiting: "Waiting", changer: "Change", modeVoix: "🎤 Voice", modeEcrire: "⌨️ Write",
    modeQuestions: "💡 Questions", micBtn: "🎤 Talk to the teacher", writePlaceholder: "Write your question...",
    sendBtn: "Send", quizLaunchBtn: "🎮 Start the quiz on this topic", videoBtn: "🎥 Video", ficheBtn: "📄 Summary sheet",
    suggestVideo: "🎥 Watch a video about this", suggestFiche: "📄 See the summary sheet", suggestQuiz: "❓ Try some questions on this",
    ecoleBtn: "🏫 My Dream School", tableauTitle: "🎓 Board", gommeTitle: "Eraser", effacerBtn: "🗑 Clear",
    quizLaunchBtnQcm: "🎯 Classic multiple choice (⭐ 25/correct answer)", quizLaunchBtnEval: "📋 Full evaluation (⭐ 30/correct answer)",
    quizLaunchBtnEcrit: "✍️ Written answers (⭐ 25-50/correct answer)", quizWrittenPlaceholder: "Write your answer...",
    quizValidateBtn: "Check", quizValidateAllBtn: "Check my answers",
    videoWatchedReward: "🎉 Video fully watched! +{n} stars",
    gamesBtn: "🎮 Video games", gamesHeaderTitle: "🎮 Video games", gamePriceLabel: "Entry price",
    gameSeconds: "seconds", gamePlayBtn: "Play", gameNeedStars: "Need {n}", gameOverScore: "🎉 Final score: {n}",
    toutEffacerTitle: "Clear everything", boardPlaceholder: "✏️ Draw here or ask the teacher to write on the board",
    quizLoading: "Preparing the quiz...", quizNextBtn: "Next →", quizResultTitle: "🎉 Quiz finished!",
    quizRestartBtn: "🔁 Restart", ficheHeaderTitle: "📄 Summary sheet", downloadFicheBtn: "⬇️ Download",
    ficheLoading: "Generating your summary sheet...", ficheResumeLabel: "📌 Key takeaway",
    ecoleProgressLabel: "SCHOOL PROGRESS", ecoleSettingsHeading: "⚙️ Settings",
    ecoleHint: "⌨️ Arrows to move · 🖱️ Click an empty plot to build",
    ecoleSatisfactionLabel: "STUDENT HAPPINESS", ecoleOpenSchool: "🔔 Open the school", ecoleCloseSchool: "🔕 Close the school",
    ecoleScheduleBtn: "📅 Timetable", ecoleSafetyBtn: "🛡️ Safety",
    ecoleScheduleTitle: "📅 Timetable", ecoleScheduleIntro: "Put an activity in each time slot. The fuller the day, the happier your students.",
    ecoleScheduleEmpty: "— Nothing planned —", ecoleScheduleNoRooms: "Build some rooms first so you can fill the timetable!",
    ecoleRoomConflict: "🚫 This room is already taken by the other class at this time slot!",
    ecoleFloor2Btn: "🏗️ Floor 2 — ⭐ 400", ecoleNotEnoughStars: "⭐ Not enough stars for that!",
    ecoleFloor2Unlocked: "🏗️ Floor 2 unlocked! Even more rooms to build.",
    ecoleTeacherLabel: "👩‍🏫 Teacher (supervises and treats)", ecoleHireTeacher: "Hire",
    ecoleTeacherHired: "👩‍🏫 A new teacher joined the school!",
    ecoleInjuryNoKit: "🤕 A student got hurt! No first aid kit... -{n} stars.",
    ecoleInjuryHandled: "🩹 A student got hurt, but the first aid kit was enough!",
    ecoleFireHandled: "🔥 A small fire broke out, but your equipment handled it fast!",
    ecoleFireDamage: "🔥 Fire! Without enough safety equipment, it caused damage. -{n} stars.",
    ecoleFloor1Tab: "1️⃣ Floor 1", ecoleFloor2Tab: "2️⃣ Floor 2",
    ecolePlayerTookOver: "🧑 You took the teacher's spot in this room, they'll go supervise another one!",
    ecoleStudentDroppedOut: "😭 Nobody arrived in time... this student won't come back to school.",
    ecoleFireEvacuation: "🔥 Everyone is evacuating the school! Not many students will come back tomorrow...",
    ecoleSafetyTitle: "🛡️ Safety inspection", ecoleSafetyIntro: "Equip your school, then run the inspection. Pass it and you earn stars!",
    ecoleRunInspection: "🔍 Run the inspection", ecoleSafetyOwned: "✔ Installed", ecoleSafetyBuy: "Buy",
    ecoleNeedRooms: "Build at least one room before opening the school!",
    ecoleNeedSafetyFirst: "🛡️ Fully equip safety before opening the school!",
    ecoleNeedTeachersFirst: "👩‍🏫 You need {n} teacher(s) before opening (you have {have}) — one class can rely on you!",
    ecoleSchoolOpened: "🔔 The school is open! Students are arriving.", ecoleSchoolClosed: "🔕 The school is closed.",
    ecoleInspectionPass: "✅ Inspection passed! Your school is safe.",
    ecoleInspectionFail: "❌ Inspection failed! Safety equipment is missing. Your students are worried.",
    ecoleBuildTitle: "🧱 Build this room", cancel: "‹ Cancel", ecoleKeysIntro: "Movement keys:",
    avancer: "Forward", reculer: "Backward", gauche: "Left", droite: "Right", close: "‹ Close",
    accountHeading: "👤 Your account",
    accountIntro: "Create an account to keep your stars from one visit to the next. Without an account, everything resets each visit.",
    accountNamePlaceholder: "Your first name", accountCodePlaceholder: "Secret code (e.g. apple123)",
    accountLoginBtn: "Log in / Create my account", accountLoggedAs: "Logged in as",
    accountStarsSaved: "stars saved", accountLogoutBtn: "Log out",
    languageHeading: "🌐 Choose your language", languageIntro: "The teacher will speak and write to you in this language.",
    statusThinking: "Thinking...", statusTalking: "Speaking...", statusListening: "Listening...",
    videoComingSoon: "Coming soon!", noResults: "No topic found.", customTopicLabel: "Custom topic",
    noVideoFound: "No video found.", serverError: "Could not reach the server.",
    customTopicWorkOn: "✨ Work on:", micNotSupported: "Microphone not supported (try Chrome)",
    micErrorPrefix: "Mic error:",
    greetingTemplate: "Hello! I'm {name}. Today we're working on {subject}. Press the microphone and tell me what you don't understand!",
    quizResultTemplate: "Final score: {score} points ({correct}/{total} correct answers). {note}",
    quizDifficultySame: "The next quiz level stays the same.",
    quizDifficultyEasier: "The next quiz will be a bit easier.",
    quizDifficultyHarder: "The next quiz will be a bit harder!",
  },
  'zh-CN': {
    accountBtnDefault: "登录你的账户", appTitle: "虚拟课堂", appSubtitle: "你的虚拟老师帮助你理解，而不是直接给答案！",
    chooseProf: "选择你的老师", madameName: "女老师", madameSub: "虚拟", monsieurName: "男老师", monsieurSub: "虚拟",
    back: "‹ 返回", gradeQuestion: "你在读几年级？", gradeSubtitle: "你的虚拟老师会为你调整讲解方式。",
    groupPrimaire: "小学", groupCollege: "初中", groupLycee: "高中", groupSuperieur: "大学", groupAutre: "其他",
    autre: "❓ 其他", subjectQuestion: "你想学习什么内容？", subjectSubtitle: "在100多个主题中搜索，按类别整理。",
    searchPlaceholderLong: "搜索主题（例如：分数、动词变位、法国大革命...）", searchPlaceholderShort: "搜索主题（例如：分数、动词变位...）",
    statusWaiting: "等待中", changer: "更改", modeVoix: "🎤 语音", modeEcrire: "⌨️ 输入", modeQuestions: "💡 问题",
    micBtn: "🎤 和老师说话", writePlaceholder: "输入你的问题...", sendBtn: "发送", quizLaunchBtn: "🎮 开始本主题的测验",
    videoBtn: "🎥 视频", ficheBtn: "📄 复习卡", ecoleBtn: "🏫 我的梦想学校", tableauTitle: "🎓 黑板", gommeTitle: "橡皮擦",
    suggestVideo: "🎥 看一个关于这个的视频", suggestFiche: "📄 查看复习卡", suggestQuiz: "❓ 做几道相关题目",
    effacerBtn: "🗑 清除", toutEffacerTitle: "清除全部", boardPlaceholder: "✏️ 在这里画画，或让老师在黑板上写字",
    quizLoading: "正在准备测验...", quizNextBtn: "下一题 →", quizResultTitle: "🎉 测验完成！", quizRestartBtn: "🔁 重新开始",
    ficheHeaderTitle: "📄 复习卡", downloadFicheBtn: "⬇️ 下载", ficheLoading: "正在生成你的复习卡...", ficheResumeLabel: "📌 要点",
    ecoleProgressLabel: "学校进度", ecoleSettingsHeading: "⚙️ 设置", ecoleHint: "⌨️ 方向键移动 · 🖱️ 点击空地建造",
    ecoleBuildTitle: "🧱 建造这个房间", cancel: "‹ 取消", ecoleKeysIntro: "移动按键：", avancer: "前进", reculer: "后退",
    gauche: "左", droite: "右", close: "‹ 关闭", accountHeading: "👤 你的账户",
    accountIntro: "创建账户以在每次访问间保留你的星星。没有账户，每次访问都会重置。",
    accountNamePlaceholder: "你的名字", accountCodePlaceholder: "密码（例如：apple123）", accountLoginBtn: "登录/创建账户",
    accountLoggedAs: "已登录为", accountStarsSaved: "颗星星已保存", accountLogoutBtn: "退出登录",
    languageHeading: "🌐 选择你的语言", languageIntro: "老师将用这种语言和你交流。", statusThinking: "思考中...",
    statusTalking: "说话中...", statusListening: "正在听...", videoComingSoon: "即将推出！", noResults: "未找到主题。",
    noVideoFound: "未找到视频。", serverError: "无法连接服务器。",
    customTopicLabel: "自定义主题", customTopicWorkOn: "✨ 学习：", micNotSupported: "不支持麦克风（请试试Chrome浏览器）",
    micErrorPrefix: "麦克风错误：",
    greetingTemplate: "你好！我是{name}。今天我们学习{subject}。按下麦克风，告诉我你不懂的地方！",
    quizResultTemplate: "最终得分：{score} 分（{correct}/{total} 题正确）。{note}",
    quizDifficultySame: "下次测验难度保持不变。", quizDifficultyEasier: "下次测验会稍微简单一些。",
    quizDifficultyHarder: "下次测验会更难一些！",
  },
  'hi-IN': {
    accountBtnDefault: "अपने खाते में लॉग इन करें", appTitle: "वर्चुअल क्लासरूम",
    appSubtitle: "तुम्हारा वर्चुअल शिक्षक बिना उत्तर दिए तुम्हें समझने में मदद करता है!",
    chooseProf: "अपना शिक्षक चुनो", madameName: "मैडम", madameSub: "वर्चुअल", monsieurName: "सर", monsieurSub: "वर्चुअल",
    back: "‹ वापस", gradeQuestion: "तुम किस कक्षा में हो?", gradeSubtitle: "तुम्हारा शिक्षक अपनी व्याख्या तुम्हारे अनुसार ढालेगा।",
    groupPrimaire: "प्राथमिक विद्यालय", groupCollege: "मिडिल स्कूल", groupLycee: "हाई स्कूल", groupSuperieur: "विश्वविद्यालय",
    groupAutre: "अन्य", autre: "❓ अन्य", subjectQuestion: "तुम किस विषय पर काम करना चाहते हो?",
    subjectSubtitle: "100 से अधिक विषयों में खोजें, श्रेणी अनुसार व्यवस्थित।",
    searchPlaceholderLong: "विषय खोजें (जैसे: भिन्न, क्रिया रूप...)", searchPlaceholderShort: "विषय खोजें (जैसे: भिन्न...)",
    statusWaiting: "प्रतीक्षा में", changer: "बदलें", modeVoix: "🎤 आवाज़", modeEcrire: "⌨️ लिखें", modeQuestions: "💡 प्रश्न",
    micBtn: "🎤 शिक्षक से बात करें", writePlaceholder: "अपना प्रश्न लिखें...", sendBtn: "भेजें",
    quizLaunchBtn: "🎮 इस विषय पर क्विज़ शुरू करें", videoBtn: "🎥 वीडियो", ficheBtn: "📄 सारांश शीट",
    suggestVideo: "🎥 इस बारे में एक वीडियो देखो", suggestFiche: "📄 सारांश शीट देखो", suggestQuiz: "❓ इस पर सवाल करो",
    ecoleBtn: "🏫 मेरा सपनों का स्कूल", tableauTitle: "🎓 बोर्ड", gommeTitle: "इरेज़र", effacerBtn: "🗑 मिटाएं",
    toutEffacerTitle: "सब मिटाएं", boardPlaceholder: "✏️ यहाँ चित्र बनाओ या शिक्षक को बोर्ड पर लिखने को कहो",
    quizLoading: "क्विज़ तैयार हो रहा है...", quizNextBtn: "अगला →", quizResultTitle: "🎉 क्विज़ समाप्त!",
    quizRestartBtn: "🔁 फिर से शुरू करें", ficheHeaderTitle: "📄 सारांश शीट", downloadFicheBtn: "⬇️ डाउनलोड करें",
    ficheLoading: "तुम्हारी सारांश शीट बन रही है...", ficheResumeLabel: "📌 याद रखें",
    ecoleProgressLabel: "स्कूल प्रगति", ecoleSettingsHeading: "⚙️ सेटिंग्स",
    ecoleHint: "⌨️ चलने के लिए तीर · 🖱️ खाली जगह पर क्लिक करके बनाएं",
    ecoleBuildTitle: "🧱 यह कमरा बनाओ", cancel: "‹ रद्द करें", ecoleKeysIntro: "चलने की कुंजियाँ:",
    avancer: "आगे", reculer: "पीछे", gauche: "बाएं", droite: "दाएं", close: "‹ बंद करें",
    accountHeading: "👤 तुम्हारा खाता",
    accountIntro: "हर मुलाकात में अपने सितारे रखने के लिए खाता बनाओ। बिना खाते के, हर बार सब शून्य हो जाता है।",
    accountNamePlaceholder: "तुम्हारा नाम", accountCodePlaceholder: "गुप्त कोड (जैसे: apple123)",
    accountLoginBtn: "लॉग इन करें / खाता बनाएं", accountLoggedAs: "इस रूप में लॉग इन",
    accountStarsSaved: "सितारे सहेजे गए", accountLogoutBtn: "लॉग आउट करें",
    languageHeading: "🌐 अपनी भाषा चुनो", languageIntro: "शिक्षक तुमसे इसी भाषा में बात करेगा और लिखेगा।",
    statusThinking: "सोच रही है...", statusTalking: "बोल रही है...", statusListening: "सुन रही है...",
    videoComingSoon: "जल्द आ रहा है!", noResults: "कोई विषय नहीं मिला।", customTopicLabel: "कस्टम विषय",
    noVideoFound: "कोई वीडियो नहीं मिला।", serverError: "सर्वर से संपर्क नहीं हो सका।",
    customTopicWorkOn: "✨ इस पर काम करें:", micNotSupported: "माइक्रोफ़ोन समर्थित नहीं (Chrome आज़माएं)",
    micErrorPrefix: "माइक्रोफ़ोन त्रुटि:",
    greetingTemplate: "नमस्ते! मैं {name} हूँ। आज हम {subject} पर काम करेंगे। माइक्रोफ़ोन दबाओ और बताओ तुम्हें क्या समझ नहीं आया!",
    quizResultTemplate: "अंतिम स्कोर: {score} अंक ({correct}/{total} सही उत्तर)। {note}",
    quizDifficultySame: "अगले क्विज़ का स्तर वही रहेगा।", quizDifficultyEasier: "अगला क्विज़ थोड़ा आसान होगा।",
    quizDifficultyHarder: "अगला क्विज़ थोड़ा कठिन होगा!",
  },
  'es-ES': {
    accountBtnDefault: "Inicia sesión en tu cuenta", appTitle: "Aula Virtual",
    appSubtitle: "¡Tu profesor virtual te ayuda a entender sin darte la respuesta!",
    chooseProf: "ELIGE A TU PROFESOR", madameName: "Señora", madameSub: "Virtual", monsieurName: "Señor", monsieurSub: "Virtual",
    back: "‹ Volver", gradeQuestion: "¿En qué curso estás?", gradeSubtitle: "Tu profesor virtual adaptará sus explicaciones para ti.",
    groupPrimaire: "PRIMARIA", groupCollege: "SECUNDARIA", groupLycee: "BACHILLERATO", groupSuperieur: "UNIVERSIDAD",
    groupAutre: "OTRO", autre: "❓ Otro", subjectQuestion: "¿En qué quieres trabajar?",
    subjectSubtitle: "Busca entre más de 100 temas, organizados por categoría.",
    searchPlaceholderLong: "Buscar un tema (ej: fracciones, conjugación, Revolución Francesa...)",
    searchPlaceholderShort: "Buscar un tema (ej: fracciones, conjugación...)",
    statusWaiting: "En espera", changer: "Cambiar", modeVoix: "🎤 Voz", modeEcrire: "⌨️ Escribir", modeQuestions: "💡 Preguntas",
    micBtn: "🎤 Habla con el profesor", writePlaceholder: "Escribe tu pregunta...", sendBtn: "Enviar",
    quizLaunchBtn: "🎮 Iniciar el quiz sobre este tema", videoBtn: "🎥 Vídeo", ficheBtn: "📄 Resumen",
    suggestVideo: "🎥 Ver un vídeo sobre esto", suggestFiche: "📄 Ver la ficha resumen", suggestQuiz: "❓ Hacer preguntas sobre esto",
    ecoleBtn: "🏫 Mi Escuela de Ensueño", tableauTitle: "🎓 Pizarra", gommeTitle: "Borrador", effacerBtn: "🗑 Borrar",
    toutEffacerTitle: "Borrar todo", boardPlaceholder: "✏️ Dibuja aquí o pide al profesor que escriba en la pizarra",
    quizLoading: "Preparando el quiz...", quizNextBtn: "Siguiente →", quizResultTitle: "🎉 ¡Quiz terminado!",
    quizRestartBtn: "🔁 Reiniciar", ficheHeaderTitle: "📄 Resumen", downloadFicheBtn: "⬇️ Descargar",
    ficheLoading: "Generando tu resumen...", ficheResumeLabel: "📌 Para recordar",
    ecoleProgressLabel: "PROGRESO ESCUELA", ecoleSettingsHeading: "⚙️ Ajustes",
    ecoleHint: "⌨️ Flechas para moverte · 🖱️ Haz clic en una parcela vacía para construir",
    ecoleBuildTitle: "🧱 Construye esta habitación", cancel: "‹ Cancelar", ecoleKeysIntro: "Teclas de movimiento:",
    avancer: "Adelante", reculer: "Atrás", gauche: "Izquierda", droite: "Derecha", close: "‹ Cerrar",
    accountHeading: "👤 Tu cuenta",
    accountIntro: "Crea una cuenta para conservar tus estrellas entre visitas. Sin cuenta, todo se reinicia cada vez.",
    accountNamePlaceholder: "Tu nombre", accountCodePlaceholder: "Código secreto (ej: manzana123)",
    accountLoginBtn: "Iniciar sesión / Crear mi cuenta", accountLoggedAs: "Conectado como",
    accountStarsSaved: "estrellas guardadas", accountLogoutBtn: "Cerrar sesión",
    languageHeading: "🌐 Elige tu idioma", languageIntro: "El profesor te hablará y escribirá en este idioma.",
    statusThinking: "Está pensando...", statusTalking: "Está hablando...", statusListening: "Te escucho...",
    videoComingSoon: "¡Próximamente!", noResults: "Ningún tema encontrado.", customTopicLabel: "Tema personalizado",
    noVideoFound: "Ningún vídeo encontrado.", serverError: "No se pudo contactar con el servidor.",
    customTopicWorkOn: "✨ Trabajar en:", micNotSupported: "Micrófono no compatible (prueba Chrome)",
    micErrorPrefix: "Error de micrófono:",
    greetingTemplate: "¡Hola! Soy {name}. Hoy trabajamos en {subject}. ¡Pulsa el micrófono y dime qué no entiendes!",
    quizResultTemplate: "Puntuación final: {score} puntos ({correct}/{total} respuestas correctas). {note}",
    quizDifficultySame: "El nivel del próximo quiz sigue igual.",
    quizDifficultyEasier: "El próximo quiz será un poco más fácil.",
    quizDifficultyHarder: "¡El próximo quiz será un poco más difícil!",
  },
  'ar-SA': {
    accountBtnDefault: "سجّل الدخول إلى حسابك", appTitle: "الفصل الافتراضي",
    appSubtitle: "معلمك الافتراضي يساعدك على الفهم دون إعطائك الإجابة!",
    chooseProf: "اختر معلمك", madameName: "المعلمة", madameSub: "الافتراضية", monsieurName: "المعلم", monsieurSub: "الافتراضي",
    back: "‹ رجوع", gradeQuestion: "في أي صف أنت؟", gradeSubtitle: "سيكيّف معلمك الافتراضي شرحه من أجلك.",
    groupPrimaire: "الابتدائية", groupCollege: "المتوسطة", groupLycee: "الثانوية", groupSuperieur: "الجامعة",
    groupAutre: "أخرى", autre: "❓ أخرى", subjectQuestion: "على ماذا تريد أن تعمل؟",
    subjectSubtitle: "ابحث بين أكثر من 100 موضوع، منظمة حسب الفئة.",
    searchPlaceholderLong: "ابحث عن موضوع (مثال: الكسور، تصريف الأفعال...)", searchPlaceholderShort: "ابحث عن موضوع (مثال: الكسور...)",
    statusWaiting: "في الانتظار", changer: "تغيير", modeVoix: "🎤 صوت", modeEcrire: "⌨️ كتابة", modeQuestions: "💡 أسئلة",
    micBtn: "🎤 تحدث إلى المعلم", writePlaceholder: "اكتب سؤالك...", sendBtn: "إرسال",
    quizLaunchBtn: "🎮 ابدأ الاختبار حول هذا الموضوع", videoBtn: "🎥 فيديو", ficheBtn: "📄 ملخص الدرس",
    suggestVideo: "🎥 مشاهدة فيديو عن هذا", suggestFiche: "📄 عرض ملخص الدرس", suggestQuiz: "❓ الإجابة عن أسئلة حول هذا",
    ecoleBtn: "🏫 مدرستي الحلم", tableauTitle: "🎓 السبورة", gommeTitle: "ممحاة", effacerBtn: "🗑 مسح",
    toutEffacerTitle: "مسح الكل", boardPlaceholder: "✏️ ارسم هنا أو اطلب من المعلم الكتابة على السبورة",
    quizLoading: "جارٍ تحضير الاختبار...", quizNextBtn: "التالي ←", quizResultTitle: "🎉 انتهى الاختبار!",
    quizRestartBtn: "🔁 إعادة", ficheHeaderTitle: "📄 ملخص الدرس", downloadFicheBtn: "⬇️ تحميل",
    ficheLoading: "جارٍ إنشاء ملخص الدرس...", ficheResumeLabel: "📌 للتذكر",
    ecoleProgressLabel: "تقدّم المدرسة", ecoleSettingsHeading: "⚙️ الإعدادات",
    ecoleHint: "⌨️ الأسهم للتحرك · 🖱️ انقر على مكان فارغ للبناء",
    ecoleBuildTitle: "🧱 ابنِ هذه الغرفة", cancel: "‹ إلغاء", ecoleKeysIntro: "مفاتيح الحركة:",
    avancer: "أمام", reculer: "خلف", gauche: "يسار", droite: "يمين", close: "‹ إغلاق",
    accountHeading: "👤 حسابك",
    accountIntro: "أنشئ حسابًا للاحتفاظ بنجومك من زيارة لأخرى. بدون حساب، يعاد كل شيء إلى الصفر في كل زيارة.",
    accountNamePlaceholder: "اسمك", accountCodePlaceholder: "رمز سري (مثال: تفاحة123)",
    accountLoginBtn: "تسجيل الدخول / إنشاء حسابي", accountLoggedAs: "متصل باسم",
    accountStarsSaved: "نجوم محفوظة", accountLogoutBtn: "تسجيل الخروج",
    languageHeading: "🌐 اختر لغتك", languageIntro: "سيتحدث معك المعلم ويكتب لك بهذه اللغة.",
    statusThinking: "تفكر...", statusTalking: "تتحدث...", statusListening: "أستمع إليك...",
    videoComingSoon: "قريبًا!", noResults: "لم يتم العثور على موضوع.", customTopicLabel: "موضوع مخصص",
    noVideoFound: "لم يتم العثور على فيديو.", serverError: "تعذر الاتصال بالخادم.",
    customTopicWorkOn: "✨ العمل على:", micNotSupported: "الميكروفون غير مدعوم (جرّب Chrome)",
    micErrorPrefix: "خطأ في الميكروفون:",
    greetingTemplate: "مرحبًا! أنا {name}. سنعمل اليوم على {subject}. اضغط على الميكروفون وأخبرني بما لا تفهمه!",
    quizResultTemplate: "النتيجة النهائية: {score} نقطة ({correct}/{total} إجابات صحيحة). {note}",
    quizDifficultySame: "مستوى الاختبار القادم يبقى كما هو.",
    quizDifficultyEasier: "سيكون الاختبار القادم أسهل قليلاً.",
    quizDifficultyHarder: "سيكون الاختبار القادم أصعب قليلاً!",
  },
  'bn-BD': {
    accountBtnDefault: "তোমার অ্যাকাউন্টে লগ ইন করো", appTitle: "ভার্চুয়াল ক্লাসরুম",
    appSubtitle: "তোমার ভার্চুয়াল শিক্ষক উত্তর না দিয়ে তোমাকে বুঝতে সাহায্য করে!",
    chooseProf: "তোমার শিক্ষক বেছে নাও", madameName: "ম্যাডাম", madameSub: "ভার্চুয়াল", monsieurName: "স্যার", monsieurSub: "ভার্চুয়াল",
    back: "‹ ফিরে যাও", gradeQuestion: "তুমি কোন শ্রেণিতে পড়ো?", gradeSubtitle: "তোমার শিক্ষক তোমার জন্য ব্যাখ্যা মানিয়ে নেবে।",
    groupPrimaire: "প্রাথমিক বিদ্যালয়", groupCollege: "মাধ্যমিক", groupLycee: "উচ্চ মাধ্যমিক", groupSuperieur: "বিশ্ববিদ্যালয়",
    groupAutre: "অন্যান্য", autre: "❓ অন্যান্য", subjectQuestion: "তুমি কী নিয়ে কাজ করতে চাও?",
    subjectSubtitle: "১০০টিরও বেশি বিষয়ের মধ্যে খুঁজুন, শ্রেণী অনুসারে সাজানো।",
    searchPlaceholderLong: "একটি বিষয় খুঁজুন (যেমন: ভগ্নাংশ, ক্রিয়ার রূপ...)", searchPlaceholderShort: "একটি বিষয় খুঁজুন (যেমন: ভগ্নাংশ...)",
    statusWaiting: "অপেক্ষায়", changer: "পরিবর্তন", modeVoix: "🎤 কণ্ঠস্বর", modeEcrire: "⌨️ লিখুন", modeQuestions: "💡 প্রশ্ন",
    micBtn: "🎤 শিক্ষকের সাথে কথা বলুন", writePlaceholder: "তোমার প্রশ্ন লেখো...", sendBtn: "পাঠান",
    quizLaunchBtn: "🎮 এই বিষয়ে কুইজ শুরু করুন", videoBtn: "🎥 ভিডিও", ficheBtn: "📄 সারসংক্ষেপ",
    suggestVideo: "🎥 এই বিষয়ে একটি ভিডিও দেখো", suggestFiche: "📄 সারসংক্ষেপ দেখো", suggestQuiz: "❓ এই বিষয়ে প্রশ্ন করো",
    ecoleBtn: "🏫 আমার স্বপ্নের স্কুল", tableauTitle: "🎓 বোর্ড", gommeTitle: "রাবার", effacerBtn: "🗑 মুছুন",
    toutEffacerTitle: "সব মুছুন", boardPlaceholder: "✏️ এখানে আঁকো অথবা শিক্ষককে বোর্ডে লিখতে বলো",
    quizLoading: "কুইজ প্রস্তুত হচ্ছে...", quizNextBtn: "পরবর্তী →", quizResultTitle: "🎉 কুইজ শেষ!",
    quizRestartBtn: "🔁 আবার শুরু করুন", ficheHeaderTitle: "📄 সারসংক্ষেপ", downloadFicheBtn: "⬇️ ডাউনলোড",
    ficheLoading: "তোমার সারসংক্ষেপ তৈরি হচ্ছে...", ficheResumeLabel: "📌 মনে রাখার বিষয়",
    ecoleProgressLabel: "স্কুল অগ্রগতি", ecoleSettingsHeading: "⚙️ সেটিংস",
    ecoleHint: "⌨️ চলাচলের জন্য তীরচিহ্ন · 🖱️ খালি জায়গায় ক্লিক করে তৈরি করুন",
    ecoleBuildTitle: "🧱 এই কক্ষটি তৈরি করো", cancel: "‹ বাতিল", ecoleKeysIntro: "চলাচলের কী:",
    avancer: "সামনে", reculer: "পেছনে", gauche: "বামে", droite: "ডানে", close: "‹ বন্ধ করুন",
    accountHeading: "👤 তোমার অ্যাকাউন্ট",
    accountIntro: "প্রতিবার তোমার তারা রাখতে একটি অ্যাকাউন্ট তৈরি করো। অ্যাকাউন্ট ছাড়া, প্রতিবার সব শূন্য হয়ে যায়।",
    accountNamePlaceholder: "তোমার নাম", accountCodePlaceholder: "গোপন কোড (যেমন: apple123)",
    accountLoginBtn: "লগ ইন / অ্যাকাউন্ট তৈরি করুন", accountLoggedAs: "লগ ইন করা আছে",
    accountStarsSaved: "তারা সংরক্ষিত", accountLogoutBtn: "লগ আউট",
    languageHeading: "🌐 তোমার ভাষা বেছে নাও", languageIntro: "শিক্ষক এই ভাষায় তোমার সাথে কথা বলবে ও লিখবে।",
    statusThinking: "ভাবছে...", statusTalking: "কথা বলছে...", statusListening: "শুনছে...",
    videoComingSoon: "শীঘ্রই আসছে!", noResults: "কোনো বিষয় পাওয়া যায়নি।", customTopicLabel: "কাস্টম বিষয়",
    noVideoFound: "কোনো ভিডিও পাওয়া যায়নি।", serverError: "সার্ভারের সাথে যোগাযোগ করা যায়নি।",
    customTopicWorkOn: "✨ কাজ করুন:", micNotSupported: "মাইক্রোফোন সমর্থিত নয় (Chrome চেষ্টা করুন)",
    micErrorPrefix: "মাইক্রোফোন ত্রুটি:",
    greetingTemplate: "হ্যালো! আমি {name}। আজ আমরা {subject} নিয়ে কাজ করব। মাইক্রোফোনে চাপ দাও এবং বলো তুমি কী বুঝছো না!",
    quizResultTemplate: "চূড়ান্ত স্কোর: {score} পয়েন্ট ({correct}/{total} সঠিক উত্তর)। {note}",
    quizDifficultySame: "পরবর্তী কুইজের স্তর একই থাকবে।", quizDifficultyEasier: "পরবর্তী কুইজ কিছুটা সহজ হবে।",
    quizDifficultyHarder: "পরবর্তী কুইজ কিছুটা কঠিন হবে!",
  },
  'pt-PT': {
    accountBtnDefault: "Inicia sessão na tua conta", appTitle: "Sala de Aula Virtual",
    appSubtitle: "O teu professor virtual ajuda-te a compreender sem te dar a resposta!",
    chooseProf: "ESCOLHE O TEU PROFESSOR", madameName: "Senhora", madameSub: "Virtual", monsieurName: "Senhor", monsieurSub: "Virtual",
    back: "‹ Voltar", gradeQuestion: "Em que ano estás?", gradeSubtitle: "O teu professor virtual vai adaptar as explicações para ti.",
    groupPrimaire: "ENSINO PRIMÁRIO", groupCollege: "ENSINO BÁSICO", groupLycee: "ENSINO SECUNDÁRIO", groupSuperieur: "UNIVERSIDADE",
    groupAutre: "OUTRO", autre: "❓ Outro", subjectQuestion: "Em que queres trabalhar?",
    subjectSubtitle: "Procura entre mais de 100 temas, organizados por categoria.",
    searchPlaceholderLong: "Procurar um tema (ex: frações, conjugação...)", searchPlaceholderShort: "Procurar um tema (ex: frações...)",
    statusWaiting: "À espera", changer: "Mudar", modeVoix: "🎤 Voz", modeEcrire: "⌨️ Escrever", modeQuestions: "💡 Perguntas",
    micBtn: "🎤 Fala com o professor", writePlaceholder: "Escreve a tua pergunta...", sendBtn: "Enviar",
    quizLaunchBtn: "🎮 Iniciar o quiz sobre este tema", videoBtn: "🎥 Vídeo", ficheBtn: "📄 Resumo",
    suggestVideo: "🎥 Ver um vídeo sobre isto", suggestFiche: "📄 Ver a ficha resumo", suggestQuiz: "❓ Fazer perguntas sobre isto",
    ecoleBtn: "🏫 A Minha Escola dos Sonhos", tableauTitle: "🎓 Quadro", gommeTitle: "Borracha", effacerBtn: "🗑 Apagar",
    toutEffacerTitle: "Apagar tudo", boardPlaceholder: "✏️ Desenha aqui ou pede ao professor para escrever no quadro",
    quizLoading: "A preparar o quiz...", quizNextBtn: "Seguinte →", quizResultTitle: "🎉 Quiz terminado!",
    quizRestartBtn: "🔁 Recomeçar", ficheHeaderTitle: "📄 Resumo", downloadFicheBtn: "⬇️ Descarregar",
    ficheLoading: "A gerar o teu resumo...", ficheResumeLabel: "📌 Para recordar",
    ecoleProgressLabel: "PROGRESSO DA ESCOLA", ecoleSettingsHeading: "⚙️ Definições",
    ecoleHint: "⌨️ Setas para mover · 🖱️ Clica numa parcela vazia para construir",
    ecoleBuildTitle: "🧱 Constrói esta divisão", cancel: "‹ Cancelar", ecoleKeysIntro: "Teclas de movimento:",
    avancer: "Frente", reculer: "Trás", gauche: "Esquerda", droite: "Direita", close: "‹ Fechar",
    accountHeading: "👤 A tua conta",
    accountIntro: "Cria uma conta para guardares as tuas estrelas entre visitas. Sem conta, tudo reinicia a cada visita.",
    accountNamePlaceholder: "O teu nome", accountCodePlaceholder: "Código secreto (ex: maçã123)",
    accountLoginBtn: "Iniciar sessão / Criar a minha conta", accountLoggedAs: "Sessão iniciada como",
    accountStarsSaved: "estrelas guardadas", accountLogoutBtn: "Terminar sessão",
    languageHeading: "🌐 Escolhe o teu idioma", languageIntro: "O professor vai falar e escrever-te neste idioma.",
    statusThinking: "A pensar...", statusTalking: "A falar...", statusListening: "A ouvir-te...",
    videoComingSoon: "Brevemente!", noResults: "Nenhum tema encontrado.", customTopicLabel: "Tema personalizado",
    noVideoFound: "Nenhum vídeo encontrado.", serverError: "Não foi possível contactar o servidor.",
    customTopicWorkOn: "✨ Trabalhar em:", micNotSupported: "Microfone não suportado (experimenta o Chrome)",
    micErrorPrefix: "Erro de microfone:",
    greetingTemplate: "Olá! Eu sou {name}. Hoje vamos trabalhar em {subject}. Carrega no microfone e diz-me o que não percebes!",
    quizResultTemplate: "Pontuação final: {score} pontos ({correct}/{total} respostas corretas). {note}",
    quizDifficultySame: "O nível do próximo quiz mantém-se igual.",
    quizDifficultyEasier: "O próximo quiz vai ser um pouco mais fácil.",
    quizDifficultyHarder: "O próximo quiz vai ser um pouco mais difícil!",
  },
  'ru-RU': {
    accountBtnDefault: "Войти в свой аккаунт", appTitle: "Виртуальный Класс",
    appSubtitle: "Твой виртуальный учитель помогает понять, не давая готовый ответ!",
    chooseProf: "ВЫБЕРИ СВОЕГО УЧИТЕЛЯ", madameName: "Мадам", madameSub: "Виртуальная", monsieurName: "Месье", monsieurSub: "Виртуальный",
    back: "‹ Назад", gradeQuestion: "В каком ты классе?", gradeSubtitle: "Твой виртуальный учитель адаптирует объяснения для тебя.",
    groupPrimaire: "НАЧАЛЬНАЯ ШКОЛА", groupCollege: "СРЕДНЯЯ ШКОЛА", groupLycee: "СТАРШАЯ ШКОЛА", groupSuperieur: "УНИВЕРСИТЕТ",
    groupAutre: "ДРУГОЕ", autre: "❓ Другое", subjectQuestion: "Над чем ты хочешь работать?",
    subjectSubtitle: "Найди среди более 100 тем, организованных по категориям.",
    searchPlaceholderLong: "Найти тему (напр.: дроби, спряжение глаголов...)", searchPlaceholderShort: "Найти тему (напр.: дроби...)",
    statusWaiting: "Ожидание", changer: "Изменить", modeVoix: "🎤 Голос", modeEcrire: "⌨️ Написать", modeQuestions: "💡 Вопросы",
    micBtn: "🎤 Говорить с учителем", writePlaceholder: "Напиши свой вопрос...", sendBtn: "Отправить",
    quizLaunchBtn: "🎮 Начать тест по этой теме", videoBtn: "🎥 Видео", ficheBtn: "📄 Конспект",
    suggestVideo: "🎥 Посмотреть видео об этом", suggestFiche: "📄 Посмотреть конспект", suggestQuiz: "❓ Ответить на вопросы по теме",
    ecoleBtn: "🏫 Моя школа мечты", tableauTitle: "🎓 Доска", gommeTitle: "Ластик", effacerBtn: "🗑 Стереть",
    toutEffacerTitle: "Стереть всё", boardPlaceholder: "✏️ Рисуй здесь или попроси учителя написать на доске",
    quizLoading: "Подготовка теста...", quizNextBtn: "Далее →", quizResultTitle: "🎉 Тест завершён!",
    quizRestartBtn: "🔁 Начать заново", ficheHeaderTitle: "📄 Конспект", downloadFicheBtn: "⬇️ Скачать",
    ficheLoading: "Создание твоего конспекта...", ficheResumeLabel: "📌 Запомнить",
    ecoleProgressLabel: "ПРОГРЕСС ШКОЛЫ", ecoleSettingsHeading: "⚙️ Настройки",
    ecoleHint: "⌨️ Стрелки для движения · 🖱️ Кликни на пустую клетку, чтобы строить",
    ecoleBuildTitle: "🧱 Построй эту комнату", cancel: "‹ Отмена", ecoleKeysIntro: "Клавиши движения:",
    avancer: "Вперёд", reculer: "Назад", gauche: "Влево", droite: "Вправо", close: "‹ Закрыть",
    accountHeading: "👤 Твой аккаунт",
    accountIntro: "Создай аккаунт, чтобы сохранять звёзды между визитами. Без аккаунта всё сбрасывается каждый раз.",
    accountNamePlaceholder: "Твоё имя", accountCodePlaceholder: "Секретный код (напр.: яблоко123)",
    accountLoginBtn: "Войти / Создать аккаунт", accountLoggedAs: "Вошёл как",
    accountStarsSaved: "звёзд сохранено", accountLogoutBtn: "Выйти",
    languageHeading: "🌐 Выбери свой язык", languageIntro: "Учитель будет говорить и писать тебе на этом языке.",
    statusThinking: "Думает...", statusTalking: "Говорит...", statusListening: "Слушает тебя...",
    videoComingSoon: "Скоро!", noResults: "Тема не найдена.", customTopicLabel: "Своя тема",
    noVideoFound: "Видео не найдено.", serverError: "Не удалось связаться с сервером.",
    customTopicWorkOn: "✨ Работать над:", micNotSupported: "Микрофон не поддерживается (попробуй Chrome)",
    micErrorPrefix: "Ошибка микрофона:",
    greetingTemplate: "Привет! Я {name}. Сегодня мы работаем над темой «{subject}». Нажми на микрофон и скажи, что тебе непонятно!",
    quizResultTemplate: "Итоговый результат: {score} очков ({correct}/{total} правильных ответов). {note}",
    quizDifficultySame: "Уровень следующего теста останется прежним.",
    quizDifficultyEasier: "Следующий тест будет немного легче.",
    quizDifficultyHarder: "Следующий тест будет немного сложнее!",
  },
  'ur-PK': {
    accountBtnDefault: "اپنے اکاؤنٹ میں لاگ ان کریں", appTitle: "ورچوئل کلاس روم",
    appSubtitle: "تمہارا ورچوئل استاد جواب دیے بغیر تمہیں سمجھنے میں مدد کرتا ہے!",
    chooseProf: "اپنا استاد چنیں", madameName: "میڈم", madameSub: "ورچوئل", monsieurName: "سر", monsieurSub: "ورچوئل",
    back: "‹ واپس", gradeQuestion: "تم کس جماعت میں ہو؟", gradeSubtitle: "تمہارا استاد اپنی وضاحت تمہارے لیے ڈھالے گا۔",
    groupPrimaire: "پرائمری اسکول", groupCollege: "مڈل اسکول", groupLycee: "ہائی اسکول", groupSuperieur: "یونیورسٹی",
    groupAutre: "دیگر", autre: "❓ دیگر", subjectQuestion: "تم کس موضوع پر کام کرنا چاہتے ہو؟",
    subjectSubtitle: "100 سے زیادہ موضوعات میں تلاش کریں، قسم کے مطابق ترتیب دیے گئے۔",
    searchPlaceholderLong: "موضوع تلاش کریں (مثلاً: کسر، فعل کی صرف...)", searchPlaceholderShort: "موضوع تلاش کریں (مثلاً: کسر...)",
    statusWaiting: "انتظار میں", changer: "تبدیل کریں", modeVoix: "🎤 آواز", modeEcrire: "⌨️ لکھیں", modeQuestions: "💡 سوالات",
    micBtn: "🎤 استاد سے بات کریں", writePlaceholder: "اپنا سوال لکھیں...", sendBtn: "بھیجیں",
    quizLaunchBtn: "🎮 اس موضوع پر کوئز شروع کریں", videoBtn: "🎥 ویڈیو", ficheBtn: "📄 خلاصہ",
    suggestVideo: "🎥 اس بارے میں ایک ویڈیو دیکھیں", suggestFiche: "📄 خلاصہ دیکھیں", suggestQuiz: "❓ اس پر سوالات کریں",
    ecoleBtn: "🏫 میرا خوابوں کا اسکول", tableauTitle: "🎓 بورڈ", gommeTitle: "ربڑ", effacerBtn: "🗑 مٹائیں",
    toutEffacerTitle: "سب مٹائیں", boardPlaceholder: "✏️ یہاں ڈرا کریں یا استاد سے بورڈ پر لکھنے کو کہیں",
    quizLoading: "کوئز تیار ہو رہا ہے...", quizNextBtn: "اگلا ←", quizResultTitle: "🎉 کوئز مکمل!",
    quizRestartBtn: "🔁 دوبارہ شروع کریں", ficheHeaderTitle: "📄 خلاصہ", downloadFicheBtn: "⬇️ ڈاؤن لوڈ",
    ficheLoading: "تمہارا خلاصہ بن رہا ہے...", ficheResumeLabel: "📌 یاد رکھیں",
    ecoleProgressLabel: "اسکول کی پیش رفت", ecoleSettingsHeading: "⚙️ ترتیبات",
    ecoleHint: "⌨️ حرکت کے لیے تیر · 🖱️ خالی جگہ پر کلک کر کے بنائیں",
    ecoleBuildTitle: "🧱 یہ کمرہ بنائیں", cancel: "‹ منسوخ کریں", ecoleKeysIntro: "حرکت کی کیز:",
    avancer: "آگے", reculer: "پیچھے", gauche: "بائیں", droite: "دائیں", close: "‹ بند کریں",
    accountHeading: "👤 آپ کا اکاؤنٹ",
    accountIntro: "ہر وزٹ میں اپنے ستارے رکھنے کے لیے اکاؤنٹ بنائیں۔ اکاؤنٹ کے بغیر، ہر بار سب کچھ صفر ہو جاتا ہے۔",
    accountNamePlaceholder: "آپ کا نام", accountCodePlaceholder: "خفیہ کوڈ (مثلاً: apple123)",
    accountLoginBtn: "لاگ ان / اکاؤنٹ بنائیں", accountLoggedAs: "بطور لاگ ان",
    accountStarsSaved: "ستارے محفوظ", accountLogoutBtn: "لاگ آؤٹ",
    languageHeading: "🌐 اپنی زبان چنیں", languageIntro: "استاد اسی زبان میں آپ سے بات کرے گا اور لکھے گا۔",
    statusThinking: "سوچ رہی ہے...", statusTalking: "بول رہی ہے...", statusListening: "سن رہی ہے...",
    videoComingSoon: "جلد آرہا ہے!", noResults: "کوئی موضوع نہیں ملا۔", customTopicLabel: "مخصوص موضوع",
    noVideoFound: "کوئی ویڈیو نہیں ملی۔", serverError: "سرور سے رابطہ نہیں ہو سکا۔",
    customTopicWorkOn: "✨ اس پر کام کریں:", micNotSupported: "مائیکروفون سپورٹ نہیں (Chrome آزمائیں)",
    micErrorPrefix: "مائیکروفون کی خرابی:",
    greetingTemplate: "ہیلو! میں {name} ہوں۔ آج ہم {subject} پر کام کریں گے۔ مائیکروفون دبائیں اور بتائیں آپ کو کیا سمجھ نہیں آیا!",
    quizResultTemplate: "حتمی اسکور: {score} پوائنٹس ({correct}/{total} درست جوابات)۔ {note}",
    quizDifficultySame: "اگلے کوئز کی سطح وہی رہے گی۔", quizDifficultyEasier: "اگلا کوئز تھوڑا آسان ہوگا۔",
    quizDifficultyHarder: "اگلا کوئز تھوڑا مشکل ہوگا!",
  },
  'de-DE': {
    accountBtnDefault: "In dein Konto einloggen", appTitle: "Virtuelles Klassenzimmer",
    appSubtitle: "Dein virtueller Lehrer hilft dir zu verstehen, ohne die Antwort zu verraten!",
    chooseProf: "WÄHLE DEINE LEHRKRAFT", madameName: "Frau", madameSub: "Virtuell",
    monsieurName: "Herr", monsieurSub: "Virtuell", back: "‹ Zurück",
    gradeQuestion: "In welcher Klasse bist du?", gradeSubtitle: "Dein virtueller Lehrer passt seine Erklärungen an dich an.",
    groupPrimaire: "GRUNDSCHULE", groupCollege: "MITTELSTUFE", groupLycee: "OBERSTUFE", groupSuperieur: "HOCHSCHULE",
    groupAutre: "SONSTIGES", autre: "❓ Sonstiges", subjectQuestion: "Woran möchtest du arbeiten?",
    subjectSubtitle: "Suche ein Fach unter über 100 Themen, nach Kategorien geordnet.",
    searchPlaceholderLong: "Ein Thema suchen (z. B. Brüche, Zeitformen, Französische Revolution...)",
    searchPlaceholderShort: "Ein Thema suchen (z. B. Brüche, Zeitformen...)",
    statusWaiting: "Wartet", changer: "Ändern", modeVoix: "🎤 Sprache", modeEcrire: "⌨️ Schreiben",
    modeQuestions: "💡 Fragen", micBtn: "🎤 Mit dem Lehrer sprechen", writePlaceholder: "Schreib deine Frage...",
    sendBtn: "Senden", quizLaunchBtn: "🎮 Quiz zu diesem Thema starten", videoBtn: "🎥 Video", ficheBtn: "📄 Lernzettel",
    suggestVideo: "🎥 Ein Video zu diesem Thema ansehen", suggestFiche: "📄 Den Lernzettel ansehen", suggestQuiz: "❓ Dazu ein paar Fragen beantworten",
    ecoleBtn: "🏫 Meine Traumschule", tableauTitle: "🎓 Tafel", gommeTitle: "Radiergummi", effacerBtn: "🗑 Löschen",
    quizLaunchBtnQcm: "🎯 Multiple-Choice wie bisher (⭐ 25/richtige Antwort)", quizLaunchBtnEval: "📋 Komplette Prüfung (⭐ 30/richtige Antwort)",
    quizLaunchBtnEcrit: "✍️ Schriftliche Antworten (⭐ 25-50/richtige Antwort)", quizWrittenPlaceholder: "Schreib deine Antwort...",
    quizValidateBtn: "Prüfen", quizValidateAllBtn: "Meine Antworten prüfen",
    videoWatchedReward: "🎉 Video komplett angesehen! +{n} Sterne",
    gamesBtn: "🎮 Videospiele", gamesHeaderTitle: "🎮 Videospiele", gamePriceLabel: "Eintrittspreis",
    gameSeconds: "Sekunden", gamePlayBtn: "Spielen", gameNeedStars: "Du brauchst {n}", gameOverScore: "🎉 Endpunktzahl: {n}",
    toutEffacerTitle: "Alles löschen", boardPlaceholder: "✏️ Zeichne hier oder bitte den Lehrer, etwas an die Tafel zu schreiben",
    quizLoading: "Das Quiz wird vorbereitet...", quizNextBtn: "Weiter →", quizResultTitle: "🎉 Quiz beendet!",
    quizRestartBtn: "🔁 Nochmal", ficheHeaderTitle: "📄 Lernzettel", downloadFicheBtn: "⬇️ Herunterladen",
    ficheLoading: "Dein Lernzettel wird erstellt...", ficheResumeLabel: "📌 Merke",
    ecoleProgressLabel: "SCHULFORTSCHRITT", ecoleSettingsHeading: "⚙️ Einstellungen",
    ecoleHint: "⌨️ Pfeiltasten zum Bewegen · 🖱️ Klicke auf ein leeres Feld, um zu bauen",
    ecoleSatisfactionLabel: "ZUFRIEDENHEIT DER SCHÜLER", ecoleOpenSchool: "🔔 Schule öffnen", ecoleCloseSchool: "🔕 Schule schließen",
    ecoleScheduleBtn: "📅 Stundenplan", ecoleSafetyBtn: "🛡️ Sicherheit",
    ecoleScheduleTitle: "📅 Stundenplan", ecoleScheduleIntro: "Plane in jede Zeitspanne eine Aktivität ein. Je voller der Tag, desto zufriedener die Schüler.",
    ecoleScheduleEmpty: "— Nichts geplant —", ecoleScheduleNoRooms: "Baue zuerst Räume, damit du den Stundenplan füllen kannst!",
    ecoleRoomConflict: "🚫 Dieser Raum ist zu dieser Zeit schon von der anderen Klasse belegt!",
    ecoleFloor2Btn: "🏗️ Stockwerk 2 — ⭐ 400", ecoleNotEnoughStars: "⭐ Dafür hast du nicht genug Sterne!",
    ecoleFloor2Unlocked: "🏗️ Stockwerk 2 freigeschaltet! Noch mehr Räume zum Bauen.",
    ecoleTeacherLabel: "👩‍🏫 Lehrkraft (beaufsichtigt und versorgt)", ecoleHireTeacher: "Einstellen",
    ecoleTeacherHired: "👩‍🏫 Eine neue Lehrkraft ist an die Schule gekommen!",
    ecoleInjuryNoKit: "🤕 Ein Schüler hat sich wehgetan! Kein Erste-Hilfe-Kasten... -{n} Sterne.",
    ecoleInjuryHandled: "🩹 Ein Schüler hat sich wehgetan, aber der Erste-Hilfe-Kasten hat gereicht!",
    ecoleFireHandled: "🔥 Ein kleines Feuer ist ausgebrochen, aber deine Ausrüstung hat es schnell gelöscht!",
    ecoleFireDamage: "🔥 Feuer! Ohne genug Sicherheitsausrüstung gab es Schäden. -{n} Sterne.",
    ecoleFloor1Tab: "1️⃣ Stockwerk 1", ecoleFloor2Tab: "2️⃣ Stockwerk 2",
    ecolePlayerTookOver: "🧑 Du übernimmst den Platz der Lehrkraft in diesem Raum, sie beaufsichtigt jetzt einen anderen!",
    ecoleStudentDroppedOut: "😭 Niemand war rechtzeitig da... dieser Schüler kommt nicht mehr in die Schule.",
    ecoleFireEvacuation: "🔥 Alle verlassen die Schule! Morgen werden nicht viele Schüler wiederkommen...",
    ecoleSafetyTitle: "🛡️ Sicherheitsprüfung", ecoleSafetyIntro: "Rüste deine Schule aus und mach dann die Prüfung. Wenn du bestehst, gewinnst du Sterne!",
    ecoleRunInspection: "🔍 Prüfung starten", ecoleSafetyOwned: "✔ Installiert", ecoleSafetyBuy: "Kaufen",
    ecoleNeedRooms: "Baue mindestens einen Raum, bevor du die Schule öffnest!",
    ecoleNeedSafetyFirst: "🛡️ Rüste die Sicherheit komplett aus, bevor du die Schule öffnest!",
    ecoleNeedTeachersFirst: "👩‍🏫 Du brauchst {n} Lehrkraft/Lehrkräfte, bevor du öffnest (du hast {have}) — eine Klasse kann auf dich zählen!",
    ecoleSchoolOpened: "🔔 Die Schule ist geöffnet! Die Schüler kommen.", ecoleSchoolClosed: "🔕 Die Schule ist geschlossen.",
    ecoleInspectionPass: "✅ Prüfung bestanden! Deine Schule ist sicher.",
    ecoleInspectionFail: "❌ Prüfung nicht bestanden! Es fehlt Sicherheitsausrüstung. Die Schüler machen sich Sorgen.",
    ecoleBuildTitle: "🧱 Diesen Raum bauen", cancel: "‹ Abbrechen", ecoleKeysIntro: "Tasten zum Bewegen:",
    avancer: "Vorwärts", reculer: "Rückwärts", gauche: "Links", droite: "Rechts", close: "‹ Schließen",
    accountHeading: "👤 Dein Konto",
    accountIntro: "Erstelle ein Konto, um deine Sterne von Besuch zu Besuch zu behalten. Ohne Konto fängt bei jedem Besuch alles wieder bei null an.",
    accountNamePlaceholder: "Dein Vorname", accountCodePlaceholder: "Geheimcode (z. B. apfel123)",
    accountLoginBtn: "Einloggen / Konto erstellen", accountLoggedAs: "Eingeloggt als",
    accountStarsSaved: "Sterne gespeichert", accountLogoutBtn: "Ausloggen",
    languageHeading: "🌐 Wähle deine Sprache", languageIntro: "Der Lehrer spricht und schreibt in dieser Sprache mit dir.",
    statusThinking: "Denkt nach...", statusTalking: "Spricht...", statusListening: "Ich höre dir zu...",
    videoComingSoon: "Bald verfügbar!", noResults: "Kein Thema gefunden.", customTopicLabel: "Eigenes Thema",
    noVideoFound: "Kein Video gefunden.", serverError: "Der Server ist nicht erreichbar.",
    customTopicWorkOn: "✨ Arbeiten an:", micNotSupported: "Mikrofon nicht unterstützt (probier Chrome)",
    micErrorPrefix: "Mikrofonfehler:",
    greetingTemplate: "Hallo! Ich bin {name}. Heute arbeiten wir an {subject}. Drück auf das Mikrofon und sag mir, was du nicht verstehst!",
    quizResultTemplate: "Endpunktzahl: {score} Punkte ({correct}/{total} richtige Antworten). {note}",
    quizDifficultySame: "Das Niveau des nächsten Quiz bleibt gleich.",
    quizDifficultyEasier: "Das nächste Quiz wird etwas leichter.",
    quizDifficultyHarder: "Das nächste Quiz wird etwas schwerer!",
  },
  'ja-JP': {
    accountBtnDefault: "アカウントにログイン", appTitle: "バーチャル教室",
    appSubtitle: "バーチャル先生は、答えを教えずに「わかった！」を手伝ってくれるよ！",
    chooseProf: "先生を選ぼう", madameName: "女の先生", madameSub: "バーチャル",
    monsieurName: "男の先生", monsieurSub: "バーチャル", back: "‹ 戻る",
    gradeQuestion: "何年生？", gradeSubtitle: "バーチャル先生があなたに合わせて説明を変えてくれるよ。",
    groupPrimaire: "小学校", groupCollege: "中学校", groupLycee: "高校", groupSuperieur: "大学",
    groupAutre: "その他", autre: "❓ その他", subjectQuestion: "何を勉強したい？",
    subjectSubtitle: "100以上のテーマから、カテゴリ別に探せるよ。",
    searchPlaceholderLong: "テーマを検索（例：分数、動詞の活用、フランス革命...）",
    searchPlaceholderShort: "テーマを検索（例：分数、動詞の活用...）",
    statusWaiting: "待機中", changer: "変更", modeVoix: "🎤 音声", modeEcrire: "⌨️ 入力",
    modeQuestions: "💡 質問", micBtn: "🎤 先生に話しかける", writePlaceholder: "質問を書いてね...",
    sendBtn: "送信", quizLaunchBtn: "🎮 このテーマのクイズを始める", videoBtn: "🎥 動画", ficheBtn: "📄 まとめプリント",
    suggestVideo: "🎥 このテーマの動画を見る", suggestFiche: "📄 まとめプリントを見る", suggestQuiz: "❓ これについて問題に挑戦する",
    ecoleBtn: "🏫 私の理想の学校", tableauTitle: "🎓 黒板", gommeTitle: "消しゴム", effacerBtn: "🗑 消す",
    quizLaunchBtnQcm: "🎯 いつもの選択式クイズ（⭐ 正解1問につき25）", quizLaunchBtnEval: "📋 総合テスト（⭐ 正解1問につき30）",
    quizLaunchBtnEcrit: "✍️ 記述式の答え（⭐ 正解1問につき25〜50）", quizWrittenPlaceholder: "答えを書いてね...",
    quizValidateBtn: "確認", quizValidateAllBtn: "答えを確認する",
    videoWatchedReward: "🎉 動画を最後まで見たね！ +{n} 個の星",
    gamesBtn: "🎮 ゲーム", gamesHeaderTitle: "🎮 ゲーム", gamePriceLabel: "参加料",
    gameSeconds: "秒", gamePlayBtn: "プレイ", gameNeedStars: "{n} 必要", gameOverScore: "🎉 最終スコア：{n}",
    toutEffacerTitle: "すべて消す", boardPlaceholder: "✏️ ここに描くか、先生に黒板に書いてもらおう",
    quizLoading: "クイズを準備中...", quizNextBtn: "次へ →", quizResultTitle: "🎉 クイズ終了！",
    quizRestartBtn: "🔁 もう一度", ficheHeaderTitle: "📄 まとめプリント", downloadFicheBtn: "⬇️ ダウンロード",
    ficheLoading: "まとめプリントを作成中...", ficheResumeLabel: "📌 ポイント",
    ecoleProgressLabel: "学校の進み具合", ecoleSettingsHeading: "⚙️ 設定",
    ecoleHint: "⌨️ 矢印キーで移動 · 🖱️ 空いているマスをクリックして建てよう",
    ecoleSatisfactionLabel: "生徒の満足度", ecoleOpenSchool: "🔔 学校を開ける", ecoleCloseSchool: "🔕 学校を閉める",
    ecoleScheduleBtn: "📅 時間割", ecoleSafetyBtn: "🛡️ 安全",
    ecoleScheduleTitle: "📅 時間割", ecoleScheduleIntro: "それぞれの時間にアクティビティを入れよう。1日が充実するほど、生徒は喜ぶよ。",
    ecoleScheduleEmpty: "— 予定なし —", ecoleScheduleNoRooms: "時間割を埋めるには、まず部屋を建てよう！",
    ecoleRoomConflict: "🚫 この時間、この部屋はもう別のクラスが使っているよ！",
    ecoleFloor2Btn: "🏗️ 2階 — ⭐ 400", ecoleNotEnoughStars: "⭐ 星が足りないよ！",
    ecoleFloor2Unlocked: "🏗️ 2階が解放されたよ！もっと部屋を建てられるね。",
    ecoleTeacherLabel: "👩‍🏫 先生（見守り・手当て担当）", ecoleHireTeacher: "雇う",
    ecoleTeacherHired: "👩‍🏫 新しい先生が学校に加わったよ！",
    ecoleInjuryNoKit: "🤕 生徒がけがをしたよ！救急箱がない... 星 -{n}。",
    ecoleInjuryHandled: "🩹 生徒がけがをしたけど、救急箱で大丈夫だったよ！",
    ecoleFireHandled: "🔥 小さな火事が起きたけど、設備のおかげですぐに消えたよ！",
    ecoleFireDamage: "🔥 火事！安全設備が足りなくて被害が出たよ。星 -{n}。",
    ecoleFloor1Tab: "1️⃣ 1階", ecoleFloor2Tab: "2️⃣ 2階",
    ecolePlayerTookOver: "🧑 この部屋では、あなたが先生の代わりを務めるよ。先生は別の部屋を見守るね！",
    ecoleStudentDroppedOut: "😭 誰も間に合わなかった... この生徒はもう学校に来ないよ。",
    ecoleFireEvacuation: "🔥 みんな学校から避難したよ！明日は戻ってくる生徒が少ないかも...",
    ecoleSafetyTitle: "🛡️ 安全検査", ecoleSafetyIntro: "学校に設備をそろえて、検査を受けよう。合格したら星がもらえるよ！",
    ecoleRunInspection: "🔍 検査を受ける", ecoleSafetyOwned: "✔ 設置済み", ecoleSafetyBuy: "買う",
    ecoleNeedRooms: "学校を開ける前に、部屋を最低1つ建てよう！",
    ecoleNeedSafetyFirst: "🛡️ 学校を開ける前に、安全設備をすべてそろえよう！",
    ecoleNeedTeachersFirst: "👩‍🏫 開校には先生が {n} 人必要だよ（今は {have} 人）— 1つのクラスはあなたに任せたよ！",
    ecoleSchoolOpened: "🔔 学校が開いたよ！生徒たちが来るよ。", ecoleSchoolClosed: "🔕 学校は閉まっているよ。",
    ecoleInspectionPass: "✅ 検査に合格！あなたの学校は安全だよ。",
    ecoleInspectionFail: "❌ 検査に不合格！安全設備が足りないよ。生徒たちは不安がっているよ。",
    ecoleBuildTitle: "🧱 この部屋を建てる", cancel: "‹ キャンセル", ecoleKeysIntro: "移動キー：",
    avancer: "前へ", reculer: "後ろへ", gauche: "左", droite: "右", close: "‹ 閉じる",
    accountHeading: "👤 あなたのアカウント",
    accountIntro: "アカウントを作ると、星を次回以降も持ち越せるよ。アカウントがないと、訪れるたびにすべてリセットされるよ。",
    accountNamePlaceholder: "あなたの名前", accountCodePlaceholder: "あいことば（例：apple123）",
    accountLoginBtn: "ログイン / アカウント作成", accountLoggedAs: "ログイン中：",
    accountStarsSaved: "個の星を保存済み", accountLogoutBtn: "ログアウト",
    languageHeading: "🌐 言語を選ぼう", languageIntro: "先生はこの言語で話したり書いたりするよ。",
    statusThinking: "考え中...", statusTalking: "話し中...", statusListening: "聞いているよ...",
    videoComingSoon: "近日公開！", noResults: "テーマが見つかりませんでした。", customTopicLabel: "自分で決めたテーマ",
    noVideoFound: "動画が見つかりませんでした。", serverError: "サーバーに接続できませんでした。",
    customTopicWorkOn: "✨ これを勉強する：", micNotSupported: "マイクに対応していません（Chromeを試してね）",
    micErrorPrefix: "マイクエラー：",
    greetingTemplate: "こんにちは！{name}です。今日は{subject}を勉強しよう。マイクを押して、わからないところを教えてね！",
    quizResultTemplate: "最終スコア：{score}点（{correct}/{total}問正解）。{note}",
    quizDifficultySame: "次のクイズのレベルは同じだよ。",
    quizDifficultyEasier: "次のクイズは少しやさしくなるよ。",
    quizDifficultyHarder: "次のクイズは少しむずかしくなるよ！",
  },
  'it-IT': {
    accountBtnDefault: "Accedi al tuo account", appTitle: "Classe Virtuale",
    appSubtitle: "Il tuo insegnante virtuale ti aiuta a capire senza darti la risposta!",
    chooseProf: "SCEGLI IL TUO INSEGNANTE", madameName: "Professoressa", madameSub: "Virtuale",
    monsieurName: "Professore", monsieurSub: "Virtuale", back: "‹ Indietro",
    gradeQuestion: "In che classe sei?", gradeSubtitle: "Il tuo insegnante virtuale adatterà le sue spiegazioni per te.",
    groupPrimaire: "SCUOLA ELEMENTARE", groupCollege: "SCUOLA MEDIA", groupLycee: "SCUOLA SUPERIORE", groupSuperieur: "UNIVERSITÀ",
    groupAutre: "ALTRO", autre: "❓ Altro", subjectQuestion: "Su cosa vuoi lavorare?",
    subjectSubtitle: "Cerca una materia tra più di 100 argomenti, organizzati per categoria.",
    searchPlaceholderLong: "Cerca un tema (es: frazioni, coniugazione, Rivoluzione francese...)",
    searchPlaceholderShort: "Cerca un tema (es: frazioni, coniugazione...)",
    statusWaiting: "In attesa", changer: "Cambia", modeVoix: "🎤 Voce", modeEcrire: "⌨️ Scrivi",
    modeQuestions: "💡 Domande", micBtn: "🎤 Parla con l'insegnante", writePlaceholder: "Scrivi la tua domanda...",
    sendBtn: "Invia", quizLaunchBtn: "🎮 Avvia il quiz su questo tema", videoBtn: "🎥 Video", ficheBtn: "📄 Scheda",
    suggestVideo: "🎥 Guarda un video su questo argomento", suggestFiche: "📄 Vedi la scheda di studio", suggestQuiz: "❓ Fai qualche domanda su questo",
    ecoleBtn: "🏫 La mia scuola dei sogni", tableauTitle: "🎓 Lavagna", gommeTitle: "Gomma", effacerBtn: "🗑 Cancella",
    quizLaunchBtnQcm: "🎯 Quiz a scelta multipla come prima (⭐ 25/risposta corretta)", quizLaunchBtnEval: "📋 Verifica completa (⭐ 30/risposta corretta)",
    quizLaunchBtnEcrit: "✍️ Risposte scritte (⭐ 25-50/risposta corretta)", quizWrittenPlaceholder: "Scrivi la tua risposta...",
    quizValidateBtn: "Conferma", quizValidateAllBtn: "Conferma le mie risposte",
    videoWatchedReward: "🎉 Video guardato fino alla fine! +{n} stelle",
    gamesBtn: "🎮 Videogiochi", gamesHeaderTitle: "🎮 Videogiochi", gamePriceLabel: "Prezzo d'ingresso",
    gameSeconds: "secondi", gamePlayBtn: "Gioca", gameNeedStars: "Servono {n}", gameOverScore: "🎉 Punteggio finale: {n}",
    toutEffacerTitle: "Cancella tutto", boardPlaceholder: "✏️ Disegna qui o chiedi all'insegnante di scrivere sulla lavagna",
    quizLoading: "Preparazione del quiz...", quizNextBtn: "Avanti →", quizResultTitle: "🎉 Quiz terminato!",
    quizRestartBtn: "🔁 Ricomincia", ficheHeaderTitle: "📄 Scheda di studio", downloadFicheBtn: "⬇️ Scarica",
    ficheLoading: "Creazione della tua scheda di studio...", ficheResumeLabel: "📌 Da ricordare",
    ecoleProgressLabel: "PROGRESSI DELLA SCUOLA", ecoleSettingsHeading: "⚙️ Impostazioni",
    ecoleHint: "⌨️ Frecce per muoverti · 🖱️ Clicca su una casella vuota per costruire",
    ecoleSatisfactionLabel: "SODDISFAZIONE DEGLI STUDENTI", ecoleOpenSchool: "🔔 Apri la scuola", ecoleCloseSchool: "🔕 Chiudi la scuola",
    ecoleScheduleBtn: "📅 Orario", ecoleSafetyBtn: "🛡️ Sicurezza",
    ecoleScheduleTitle: "📅 Orario", ecoleScheduleIntro: "Inserisci un'attività in ogni fascia oraria. Più la giornata è piena, più gli studenti sono contenti.",
    ecoleScheduleEmpty: "— Niente in programma —", ecoleScheduleNoRooms: "Costruisci prima delle stanze per poter riempire l'orario!",
    ecoleRoomConflict: "🚫 Quest'aula è già occupata dall'altra classe in questa fascia oraria!",
    ecoleFloor2Btn: "🏗️ Piano 2 — ⭐ 400", ecoleNotEnoughStars: "⭐ Non hai abbastanza stelle per questo!",
    ecoleFloor2Unlocked: "🏗️ Piano 2 sbloccato! Ancora più stanze da costruire.",
    ecoleTeacherLabel: "👩‍🏫 Insegnante (sorveglia e cura)", ecoleHireTeacher: "Assumi",
    ecoleTeacherHired: "👩‍🏫 Un nuovo insegnante si è unito alla scuola!",
    ecoleInjuryNoKit: "🤕 Uno studente si è fatto male! Nessuna cassetta del pronto soccorso... -{n} stelle.",
    ecoleInjuryHandled: "🩹 Uno studente si è fatto male, ma la cassetta del pronto soccorso è bastata!",
    ecoleFireHandled: "🔥 Si è sviluppato un piccolo incendio, ma la tua attrezzatura lo ha spento subito!",
    ecoleFireDamage: "🔥 Incendio! Senza abbastanza attrezzature di sicurezza, ha fatto dei danni. -{n} stelle.",
    ecoleFloor1Tab: "1️⃣ Piano 1", ecoleFloor2Tab: "2️⃣ Piano 2",
    ecolePlayerTookOver: "🧑 Prendi il posto dell'insegnante in quest'aula, lui andrà a sorvegliarne un'altra!",
    ecoleStudentDroppedOut: "😭 Nessuno è arrivato in tempo... questo studente non tornerà più a scuola.",
    ecoleFireEvacuation: "🔥 Tutti evacuano la scuola! Domani non torneranno molti studenti...",
    ecoleSafetyTitle: "🛡️ Controllo di sicurezza", ecoleSafetyIntro: "Attrezza la tua scuola, poi fai il controllo. Se lo superi, guadagni delle stelle!",
    ecoleRunInspection: "🔍 Avvia il controllo", ecoleSafetyOwned: "✔ Installato", ecoleSafetyBuy: "Compra",
    ecoleNeedRooms: "Costruisci almeno una stanza prima di aprire la scuola!",
    ecoleNeedSafetyFirst: "🛡️ Attrezza completamente la sicurezza prima di aprire la scuola!",
    ecoleNeedTeachersFirst: "👩‍🏫 Servono {n} insegnante/i prima di aprire (ne hai {have}) — una classe può contare su di te!",
    ecoleSchoolOpened: "🔔 La scuola è aperta! Gli studenti stanno arrivando.", ecoleSchoolClosed: "🔕 La scuola è chiusa.",
    ecoleInspectionPass: "✅ Controllo superato! La tua scuola è sicura.",
    ecoleInspectionFail: "❌ Controllo fallito! Mancano delle attrezzature di sicurezza. Gli studenti sono preoccupati.",
    ecoleBuildTitle: "🧱 Costruisci questa stanza", cancel: "‹ Annulla", ecoleKeysIntro: "Tasti per muoversi:",
    avancer: "Avanti", reculer: "Indietro", gauche: "Sinistra", droite: "Destra", close: "‹ Chiudi",
    accountHeading: "👤 Il tuo account",
    accountIntro: "Crea un account per conservare le tue stelle da una visita all'altra. Senza account, ogni volta si riparte da zero.",
    accountNamePlaceholder: "Il tuo nome", accountCodePlaceholder: "Codice segreto (es: mela123)",
    accountLoginBtn: "Accedi / Crea il mio account", accountLoggedAs: "Connesso come",
    accountStarsSaved: "stelle salvate", accountLogoutBtn: "Esci",
    languageHeading: "🌐 Scegli la tua lingua", languageIntro: "L'insegnante ti parlerà e ti scriverà in questa lingua.",
    statusThinking: "Sta pensando...", statusTalking: "Sta parlando...", statusListening: "Ti ascolto...",
    videoComingSoon: "Presto disponibile!", noResults: "Nessun tema trovato.", customTopicLabel: "Tema personalizzato",
    noVideoFound: "Nessun video trovato.", serverError: "Impossibile contattare il server.",
    customTopicWorkOn: "✨ Lavorare su:", micNotSupported: "Microfono non supportato (prova Chrome)",
    micErrorPrefix: "Errore del microfono:",
    greetingTemplate: "Ciao! Sono {name}. Oggi lavoriamo su {subject}. Premi il microfono e dimmi cosa non capisci!",
    quizResultTemplate: "Punteggio finale: {score} punti ({correct}/{total} risposte corrette). {note}",
    quizDifficultySame: "Il livello del prossimo quiz resta lo stesso.",
    quizDifficultyEasier: "Il prossimo quiz sarà un po' più facile.",
    quizDifficultyHarder: "Il prossimo quiz sarà un po' più difficile!",
  },
  'ko-KR': {
    accountBtnDefault: "내 계정에 로그인", appTitle: "가상 교실",
    appSubtitle: "가상 선생님이 정답을 알려 주지 않고 이해하도록 도와줘요!",
    chooseProf: "선생님을 골라 보세요", madameName: "여자 선생님", madameSub: "가상",
    monsieurName: "남자 선생님", monsieurSub: "가상", back: "‹ 뒤로",
    gradeQuestion: "몇 학년이에요?", gradeSubtitle: "가상 선생님이 너에게 맞게 설명을 조절해 줄 거예요.",
    groupPrimaire: "초등학교", groupCollege: "중학교", groupLycee: "고등학교", groupSuperieur: "대학교",
    groupAutre: "기타", autre: "❓ 기타", subjectQuestion: "무엇을 공부하고 싶어요?",
    subjectSubtitle: "100개가 넘는 주제 중에서 카테고리별로 찾아보세요.",
    searchPlaceholderLong: "주제 검색 (예: 분수, 동사 활용, 프랑스 혁명...)",
    searchPlaceholderShort: "주제 검색 (예: 분수, 동사 활용...)",
    statusWaiting: "대기 중", changer: "변경", modeVoix: "🎤 음성", modeEcrire: "⌨️ 글쓰기",
    modeQuestions: "💡 질문", micBtn: "🎤 선생님께 말하기", writePlaceholder: "질문을 써 보세요...",
    sendBtn: "보내기", quizLaunchBtn: "🎮 이 주제로 퀴즈 시작하기", videoBtn: "🎥 영상", ficheBtn: "📄 요약 노트",
    suggestVideo: "🎥 이 주제의 영상 보기", suggestFiche: "📄 요약 노트 보기", suggestQuiz: "❓ 이것에 대해 문제 풀기",
    ecoleBtn: "🏫 나의 꿈의 학교", tableauTitle: "🎓 칠판", gommeTitle: "지우개", effacerBtn: "🗑 지우기",
    quizLaunchBtnQcm: "🎯 예전처럼 객관식 (⭐ 정답당 25)", quizLaunchBtnEval: "📋 종합 평가 (⭐ 정답당 30)",
    quizLaunchBtnEcrit: "✍️ 서술형 답안 (⭐ 정답당 25-50)", quizWrittenPlaceholder: "답을 써 보세요...",
    quizValidateBtn: "확인", quizValidateAllBtn: "내 답안 확인",
    videoWatchedReward: "🎉 영상을 끝까지 봤어요! +{n} 별",
    gamesBtn: "🎮 비디오 게임", gamesHeaderTitle: "🎮 비디오 게임", gamePriceLabel: "입장료",
    gameSeconds: "초", gamePlayBtn: "플레이", gameNeedStars: "{n} 필요", gameOverScore: "🎉 최종 점수: {n}",
    toutEffacerTitle: "모두 지우기", boardPlaceholder: "✏️ 여기에 그리거나 선생님께 칠판에 써 달라고 해 보세요",
    quizLoading: "퀴즈를 준비하는 중...", quizNextBtn: "다음 →", quizResultTitle: "🎉 퀴즈 끝!",
    quizRestartBtn: "🔁 다시 시작", ficheHeaderTitle: "📄 요약 노트", downloadFicheBtn: "⬇️ 다운로드",
    ficheLoading: "요약 노트를 만드는 중...", ficheResumeLabel: "📌 꼭 기억하기",
    ecoleProgressLabel: "학교 진행도", ecoleSettingsHeading: "⚙️ 설정",
    ecoleHint: "⌨️ 화살표로 이동 · 🖱️ 빈 칸을 클릭해서 건설하세요",
    ecoleSatisfactionLabel: "학생 만족도", ecoleOpenSchool: "🔔 학교 열기", ecoleCloseSchool: "🔕 학교 닫기",
    ecoleScheduleBtn: "📅 시간표", ecoleSafetyBtn: "🛡️ 안전",
    ecoleScheduleTitle: "📅 시간표", ecoleScheduleIntro: "각 시간대에 활동을 하나씩 넣어 보세요. 하루가 알차질수록 학생들이 더 좋아해요.",
    ecoleScheduleEmpty: "— 계획 없음 —", ecoleScheduleNoRooms: "시간표를 채우려면 먼저 교실을 지어야 해요!",
    ecoleRoomConflict: "🚫 이 시간에는 이 교실을 다른 반이 이미 쓰고 있어요!",
    ecoleFloor2Btn: "🏗️ 2층 — ⭐ 400", ecoleNotEnoughStars: "⭐ 별이 부족해요!",
    ecoleFloor2Unlocked: "🏗️ 2층이 열렸어요! 지을 수 있는 교실이 더 많아졌어요.",
    ecoleTeacherLabel: "👩‍🏫 선생님 (지켜보고 돌봐 줘요)", ecoleHireTeacher: "고용하기",
    ecoleTeacherHired: "👩‍🏫 새 선생님이 학교에 오셨어요!",
    ecoleInjuryNoKit: "🤕 학생이 다쳤어요! 구급상자가 없어요... 별 -{n}.",
    ecoleInjuryHandled: "🩹 학생이 다쳤지만 구급상자로 충분했어요!",
    ecoleFireHandled: "🔥 작은 불이 났지만, 장비 덕분에 금방 껐어요!",
    ecoleFireDamage: "🔥 화재! 안전 장비가 부족해서 피해가 생겼어요. 별 -{n}.",
    ecoleFloor1Tab: "1️⃣ 1층", ecoleFloor2Tab: "2️⃣ 2층",
    ecolePlayerTookOver: "🧑 이 교실에서는 네가 선생님 자리를 맡고, 선생님은 다른 교실을 지켜봐요!",
    ecoleStudentDroppedOut: "😭 아무도 제시간에 오지 못했어요... 이 학생은 더 이상 학교에 오지 않아요.",
    ecoleFireEvacuation: "🔥 모두 학교에서 대피해요! 내일은 돌아오는 학생이 많지 않을 거예요...",
    ecoleSafetyTitle: "🛡️ 안전 점검", ecoleSafetyIntro: "학교에 장비를 갖추고 점검을 받으세요. 통과하면 별을 받아요!",
    ecoleRunInspection: "🔍 점검 시작", ecoleSafetyOwned: "✔ 설치됨", ecoleSafetyBuy: "구매",
    ecoleNeedRooms: "학교를 열기 전에 교실을 적어도 하나는 지어야 해요!",
    ecoleNeedSafetyFirst: "🛡️ 학교를 열기 전에 안전 장비를 모두 갖춰야 해요!",
    ecoleNeedTeachersFirst: "👩‍🏫 학교를 열려면 선생님이 {n}명 필요해요 (지금은 {have}명) — 한 반은 네가 맡을 수 있어요!",
    ecoleSchoolOpened: "🔔 학교가 열렸어요! 학생들이 오고 있어요.", ecoleSchoolClosed: "🔕 학교가 문을 닫았어요.",
    ecoleInspectionPass: "✅ 점검 통과! 네 학교는 안전해요.",
    ecoleInspectionFail: "❌ 점검 실패! 안전 장비가 부족해요. 학생들이 걱정하고 있어요.",
    ecoleBuildTitle: "🧱 이 교실 짓기", cancel: "‹ 취소", ecoleKeysIntro: "이동 키:",
    avancer: "앞으로", reculer: "뒤로", gauche: "왼쪽", droite: "오른쪽", close: "‹ 닫기",
    accountHeading: "👤 내 계정",
    accountIntro: "계정을 만들면 방문할 때마다 별을 이어서 모을 수 있어요. 계정이 없으면 방문할 때마다 모든 게 처음부터 시작돼요.",
    accountNamePlaceholder: "이름", accountCodePlaceholder: "비밀 코드 (예: apple123)",
    accountLoginBtn: "로그인 / 계정 만들기", accountLoggedAs: "로그인한 사용자:",
    accountStarsSaved: "별 저장됨", accountLogoutBtn: "로그아웃",
    languageHeading: "🌐 언어를 골라 보세요", languageIntro: "선생님이 이 언어로 말하고 글을 써 줄 거예요.",
    statusThinking: "생각 중...", statusTalking: "말하는 중...", statusListening: "듣고 있어요...",
    videoComingSoon: "곧 만나요!", noResults: "주제를 찾지 못했어요.", customTopicLabel: "나만의 주제",
    noVideoFound: "영상을 찾지 못했어요.", serverError: "서버에 연결할 수 없어요.",
    customTopicWorkOn: "✨ 공부할 주제:", micNotSupported: "마이크를 지원하지 않아요 (Chrome을 써 보세요)",
    micErrorPrefix: "마이크 오류:",
    greetingTemplate: "안녕하세요! 저는 {name}이에요. 오늘은 {subject}을(를) 공부해요. 마이크를 누르고 이해가 안 되는 걸 말해 주세요!",
    quizResultTemplate: "최종 점수: {score}점 ({correct}/{total} 정답). {note}",
    quizDifficultySame: "다음 퀴즈 난이도는 그대로예요.",
    quizDifficultyEasier: "다음 퀴즈는 조금 더 쉬워질 거예요.",
    quizDifficultyHarder: "다음 퀴즈는 조금 더 어려워질 거예요!",
  },
  'id-ID': {
    accountBtnDefault: "Masuk ke akunmu", appTitle: "Kelas Virtual",
    appSubtitle: "Guru virtualmu membantumu memahami tanpa langsung memberi jawaban!",
    chooseProf: "PILIH GURUMU", madameName: "Ibu Guru", madameSub: "Virtual",
    monsieurName: "Bapak Guru", monsieurSub: "Virtual", back: "‹ Kembali",
    gradeQuestion: "Kamu kelas berapa?", gradeSubtitle: "Guru virtualmu akan menyesuaikan penjelasannya untukmu.",
    groupPrimaire: "SEKOLAH DASAR", groupCollege: "SEKOLAH MENENGAH PERTAMA", groupLycee: "SEKOLAH MENENGAH ATAS", groupSuperieur: "PERGURUAN TINGGI",
    groupAutre: "LAINNYA", autre: "❓ Lainnya", subjectQuestion: "Kamu mau belajar apa?",
    subjectSubtitle: "Cari pelajaran dari lebih dari 100 topik, diatur berdasarkan kategori.",
    searchPlaceholderLong: "Cari topik (mis: pecahan, konjugasi, Revolusi Prancis...)",
    searchPlaceholderShort: "Cari topik (mis: pecahan, konjugasi...)",
    statusWaiting: "Menunggu", changer: "Ganti", modeVoix: "🎤 Suara", modeEcrire: "⌨️ Tulis",
    modeQuestions: "💡 Pertanyaan", micBtn: "🎤 Bicara dengan guru", writePlaceholder: "Tulis pertanyaanmu...",
    sendBtn: "Kirim", quizLaunchBtn: "🎮 Mulai kuis tentang topik ini", videoBtn: "🎥 Video", ficheBtn: "📄 Ringkasan",
    suggestVideo: "🎥 Tonton video tentang topik ini", suggestFiche: "📄 Lihat lembar ringkasan", suggestQuiz: "❓ Coba beberapa pertanyaan tentang ini",
    ecoleBtn: "🏫 Sekolah Impianku", tableauTitle: "🎓 Papan Tulis", gommeTitle: "Penghapus", effacerBtn: "🗑 Hapus",
    quizLaunchBtnQcm: "🎯 Pilihan ganda seperti biasa (⭐ 25/jawaban benar)", quizLaunchBtnEval: "📋 Penilaian lengkap (⭐ 30/jawaban benar)",
    quizLaunchBtnEcrit: "✍️ Jawaban tertulis (⭐ 25-50/jawaban benar)", quizWrittenPlaceholder: "Tulis jawabanmu...",
    quizValidateBtn: "Periksa", quizValidateAllBtn: "Periksa jawabanku",
    videoWatchedReward: "🎉 Video sudah ditonton sampai habis! +{n} bintang",
    gamesBtn: "🎮 Video game", gamesHeaderTitle: "🎮 Video game", gamePriceLabel: "Harga masuk",
    gameSeconds: "detik", gamePlayBtn: "Main", gameNeedStars: "Butuh {n}", gameOverScore: "🎉 Skor akhir: {n}",
    toutEffacerTitle: "Hapus semua", boardPlaceholder: "✏️ Gambar di sini atau minta guru menulis di papan tulis",
    quizLoading: "Menyiapkan kuis...", quizNextBtn: "Lanjut →", quizResultTitle: "🎉 Kuis selesai!",
    quizRestartBtn: "🔁 Ulangi", ficheHeaderTitle: "📄 Lembar ringkasan", downloadFicheBtn: "⬇️ Unduh",
    ficheLoading: "Membuat lembar ringkasanmu...", ficheResumeLabel: "📌 Yang perlu diingat",
    ecoleProgressLabel: "KEMAJUAN SEKOLAH", ecoleSettingsHeading: "⚙️ Pengaturan",
    ecoleHint: "⌨️ Tombol panah untuk bergerak · 🖱️ Klik petak kosong untuk membangun",
    ecoleSatisfactionLabel: "KEPUASAN SISWA", ecoleOpenSchool: "🔔 Buka sekolah", ecoleCloseSchool: "🔕 Tutup sekolah",
    ecoleScheduleBtn: "📅 Jadwal pelajaran", ecoleSafetyBtn: "🛡️ Keselamatan",
    ecoleScheduleTitle: "📅 Jadwal pelajaran", ecoleScheduleIntro: "Taruh satu kegiatan di setiap waktu. Makin penuh harinya, makin senang para siswa.",
    ecoleScheduleEmpty: "— Belum ada rencana —", ecoleScheduleNoRooms: "Bangun beberapa ruangan dulu supaya kamu bisa mengisi jadwal!",
    ecoleRoomConflict: "🚫 Ruangan ini sudah dipakai kelas lain pada waktu tersebut!",
    ecoleFloor2Btn: "🏗️ Lantai 2 — ⭐ 400", ecoleNotEnoughStars: "⭐ Bintangmu tidak cukup untuk itu!",
    ecoleFloor2Unlocked: "🏗️ Lantai 2 terbuka! Lebih banyak ruangan untuk dibangun.",
    ecoleTeacherLabel: "👩‍🏫 Guru (mengawasi dan merawat)", ecoleHireTeacher: "Rekrut",
    ecoleTeacherHired: "👩‍🏫 Seorang guru baru bergabung di sekolah!",
    ecoleInjuryNoKit: "🤕 Seorang siswa terluka! Tidak ada kotak P3K... -{n} bintang.",
    ecoleInjuryHandled: "🩹 Seorang siswa terluka, tapi kotak P3K sudah cukup!",
    ecoleFireHandled: "🔥 Terjadi kebakaran kecil, tapi peralatanmu cepat memadamkannya!",
    ecoleFireDamage: "🔥 Kebakaran! Tanpa peralatan keselamatan yang cukup, terjadi kerusakan. -{n} bintang.",
    ecoleFloor1Tab: "1️⃣ Lantai 1", ecoleFloor2Tab: "2️⃣ Lantai 2",
    ecolePlayerTookOver: "🧑 Kamu menggantikan guru di ruangan ini, dan guru akan mengawasi ruangan lain!",
    ecoleStudentDroppedOut: "😭 Tidak ada yang datang tepat waktu... siswa ini tidak akan kembali ke sekolah.",
    ecoleFireEvacuation: "🔥 Semua orang mengungsi dari sekolah! Besok tidak banyak siswa yang akan kembali...",
    ecoleSafetyTitle: "🛡️ Pemeriksaan keselamatan", ecoleSafetyIntro: "Lengkapi sekolahmu, lalu jalani pemeriksaan. Kalau lulus, kamu dapat bintang!",
    ecoleRunInspection: "🔍 Mulai pemeriksaan", ecoleSafetyOwned: "✔ Terpasang", ecoleSafetyBuy: "Beli",
    ecoleNeedRooms: "Bangun minimal satu ruangan sebelum membuka sekolah!",
    ecoleNeedSafetyFirst: "🛡️ Lengkapi semua peralatan keselamatan sebelum membuka sekolah!",
    ecoleNeedTeachersFirst: "👩‍🏫 Kamu butuh {n} guru sebelum membuka sekolah (kamu punya {have}) — satu kelas bisa mengandalkanmu!",
    ecoleSchoolOpened: "🔔 Sekolah sudah buka! Para siswa berdatangan.", ecoleSchoolClosed: "🔕 Sekolah sudah tutup.",
    ecoleInspectionPass: "✅ Pemeriksaan lulus! Sekolahmu aman.",
    ecoleInspectionFail: "❌ Pemeriksaan gagal! Peralatan keselamatan kurang. Para siswa jadi khawatir.",
    ecoleBuildTitle: "🧱 Bangun ruangan ini", cancel: "‹ Batal", ecoleKeysIntro: "Tombol untuk bergerak:",
    avancer: "Maju", reculer: "Mundur", gauche: "Kiri", droite: "Kanan", close: "‹ Tutup",
    accountHeading: "👤 Akunmu",
    accountIntro: "Buat akun untuk menyimpan bintangmu dari kunjungan ke kunjungan. Tanpa akun, semuanya mulai dari nol setiap kali kamu berkunjung.",
    accountNamePlaceholder: "Nama depanmu", accountCodePlaceholder: "Kode rahasia (mis: apel123)",
    accountLoginBtn: "Masuk / Buat akunku", accountLoggedAs: "Masuk sebagai",
    accountStarsSaved: "bintang tersimpan", accountLogoutBtn: "Keluar",
    languageHeading: "🌐 Pilih bahasamu", languageIntro: "Guru akan berbicara dan menulis kepadamu dalam bahasa ini.",
    statusThinking: "Sedang berpikir...", statusTalking: "Sedang bicara...", statusListening: "Aku mendengarkan...",
    videoComingSoon: "Segera hadir!", noResults: "Topik tidak ditemukan.", customTopicLabel: "Topik pilihanmu",
    noVideoFound: "Video tidak ditemukan.", serverError: "Tidak bisa terhubung ke server.",
    customTopicWorkOn: "✨ Belajar tentang:", micNotSupported: "Mikrofon tidak didukung (coba Chrome)",
    micErrorPrefix: "Kesalahan mikrofon:",
    greetingTemplate: "Halo! Aku {name}. Hari ini kita belajar {subject}. Tekan mikrofon dan ceritakan apa yang belum kamu pahami!",
    quizResultTemplate: "Skor akhir: {score} poin ({correct}/{total} jawaban benar). {note}",
    quizDifficultySame: "Tingkat kuis berikutnya tetap sama.",
    quizDifficultyEasier: "Kuis berikutnya akan sedikit lebih mudah.",
    quizDifficultyHarder: "Kuis berikutnya akan sedikit lebih sulit!",
  },
};

// Alias de secours pour d'eventuelles langues sans traduction complete (vide : les 15 langues
// proposees ont toutes un bloc complet). Mecanisme conserve pour de futurs ajouts.
const I18N_FALLBACK_ALIAS = {};

function getUiStrings(langCode) {
  if (I18N[langCode]) return I18N[langCode];
  const alias = I18N_FALLBACK_ALIAS[langCode];
  if (alias && I18N[alias]) return I18N[alias];
  return I18N['fr-FR'];
}

function t(key) {
  const strings = getUiStrings(profLanguage.code);
  return strings[key] ?? I18N['fr-FR'][key] ?? key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });
}

applyTranslations();

// ============ Etape 1 : choix du professeur ============
function setGender(g) {
  gender = g;
  avatarEl.classList.toggle('homme', g === 'homme');
  avatarImgEl.src = IMAGES[g];
  profTitleNameEl.textContent = TITLES[g];
  gradeSubtitleEl.textContent = `${NAMES[g]} va adapter ses explications pour toi.`;
}

document.getElementById('pickFemale').addEventListener('click', () => {
  setGender('femme');
  selectScreen.style.display = 'none';
  gradeScreen.style.display = 'flex';
});
document.getElementById('pickMale').addEventListener('click', () => {
  setGender('homme');
  selectScreen.style.display = 'none';
  gradeScreen.style.display = 'flex';
});

document.getElementById('backToProf').addEventListener('click', () => {
  gradeScreen.style.display = 'none';
  selectScreen.style.display = 'flex';
});

// ============ Etape 2 : choix de la classe ============
// Traduction des noms de classe (CP, 6eme...) selon le systeme scolaire du pays de chaque langue,
// pas juste une traduction litterale du mot francais (ex: CP -> "1st Grade" en anglais).
const GRADE_LABELS = {
  'fr-FR': { CP: 'CP', CE1: 'CE1', CE2: 'CE2', CM1: 'CM1', CM2: 'CM2', '6ème': '6ème', '5ème': '5ème', '4ème': '4ème', '3ème': '3ème', Seconde: 'Seconde', Première: 'Première', Terminale: 'Terminale', Université: 'Université' },
  'en-US': { CP: '1st Grade', CE1: '2nd Grade', CE2: '3rd Grade', CM1: '4th Grade', CM2: '5th Grade', '6ème': '6th Grade', '5ème': '7th Grade', '4ème': '8th Grade', '3ème': '9th Grade', Seconde: '10th Grade', Première: '11th Grade', Terminale: '12th Grade', Université: 'University' },
  'zh-CN': { CP: '一年级', CE1: '二年级', CE2: '三年级', CM1: '四年级', CM2: '五年级', '6ème': '六年级', '5ème': '初一', '4ème': '初二', '3ème': '初三', Seconde: '高一', Première: '高二', Terminale: '高三', Université: '大学' },
  'hi-IN': { CP: 'पहली कक्षा', CE1: 'दूसरी कक्षा', CE2: 'तीसरी कक्षा', CM1: 'चौथी कक्षा', CM2: 'पाँचवीं कक्षा', '6ème': 'छठी कक्षा', '5ème': 'सातवीं कक्षा', '4ème': 'आठवीं कक्षा', '3ème': 'नौवीं कक्षा', Seconde: 'दसवीं कक्षा', Première: 'ग्यारहवीं कक्षा', Terminale: 'बारहवीं कक्षा', Université: 'विश्वविद्यालय' },
  'es-ES': { CP: '1º Primaria', CE1: '2º Primaria', CE2: '3º Primaria', CM1: '4º Primaria', CM2: '5º Primaria', '6ème': '6º Primaria', '5ème': '1º ESO', '4ème': '2º ESO', '3ème': '3º ESO', Seconde: '4º ESO', Première: '1º Bachillerato', Terminale: '2º Bachillerato', Université: 'Universidad' },
  'ar-SA': { CP: 'الصف الأول', CE1: 'الصف الثاني', CE2: 'الصف الثالث', CM1: 'الصف الرابع', CM2: 'الصف الخامس', '6ème': 'الصف السادس', '5ème': 'الصف السابع', '4ème': 'الصف الثامن', '3ème': 'الصف التاسع', Seconde: 'الصف العاشر', Première: 'الصف الحادي عشر', Terminale: 'الصف الثاني عشر', Université: 'الجامعة' },
  'bn-BD': { CP: 'প্রথম শ্রেণি', CE1: 'দ্বিতীয় শ্রেণি', CE2: 'তৃতীয় শ্রেণি', CM1: 'চতুর্থ শ্রেণি', CM2: 'পঞ্চম শ্রেণি', '6ème': 'ষষ্ঠ শ্রেণি', '5ème': 'সপ্তম শ্রেণি', '4ème': 'অষ্টম শ্রেণি', '3ème': 'নবম শ্রেণি', Seconde: 'দশম শ্রেণি', Première: 'একাদশ শ্রেণি', Terminale: 'দ্বাদশ শ্রেণি', Université: 'বিশ্ববিদ্যালয়' },
  'pt-PT': { CP: '1º Ano', CE1: '2º Ano', CE2: '3º Ano', CM1: '4º Ano', CM2: '5º Ano', '6ème': '6º Ano', '5ème': '7º Ano', '4ème': '8º Ano', '3ème': '9º Ano', Seconde: '10º Ano', Première: '11º Ano', Terminale: '12º Ano', Université: 'Universidade' },
  'ru-RU': { CP: '1 класс', CE1: '2 класс', CE2: '3 класс', CM1: '4 класс', CM2: '5 класс', '6ème': '6 класс', '5ème': '7 класс', '4ème': '8 класс', '3ème': '9 класс', Seconde: '10 класс', Première: '11 класс', Terminale: '12 класс (выпускной)', Université: 'Университет' },
  'ur-PK': { CP: 'پہلی جماعت', CE1: 'دوسری جماعت', CE2: 'تیسری جماعت', CM1: 'چوتھی جماعت', CM2: 'پانچویں جماعت', '6ème': 'چھٹی جماعت', '5ème': 'ساتویں جماعت', '4ème': 'آٹھویں جماعت', '3ème': 'نویں جماعت', Seconde: 'دسویں جماعت', Première: 'گیارہویں جماعت', Terminale: 'بارہویں جماعت', Université: 'یونیورسٹی' },
  'de-DE': { CP: '1. Klasse', CE1: '2. Klasse', CE2: '3. Klasse', CM1: '4. Klasse', CM2: '5. Klasse', '6ème': '6. Klasse', '5ème': '7. Klasse', '4ème': '8. Klasse', '3ème': '9. Klasse', Seconde: '10. Klasse', Première: '11. Klasse', Terminale: '12./13. Klasse', Université: 'Universität' },
  'ja-JP': { CP: '小学1年生', CE1: '小学2年生', CE2: '小学3年生', CM1: '小学4年生', CM2: '小学5年生', '6ème': '小学6年生', '5ème': '中学1年生', '4ème': '中学2年生', '3ème': '中学3年生', Seconde: '高校1年生', Première: '高校2年生', Terminale: '高校3年生', Université: '大学' },
  'it-IT': { CP: 'Prima elementare', CE1: 'Seconda elementare', CE2: 'Terza elementare', CM1: 'Quarta elementare', CM2: 'Quinta elementare', '6ème': 'Prima media', '5ème': 'Seconda media', '4ème': 'Terza media', '3ème': 'Prima superiore', Seconde: 'Seconda superiore', Première: 'Terza superiore', Terminale: 'Quarta superiore', Université: 'Università' },
  'ko-KR': { CP: '초등학교 1학년', CE1: '초등학교 2학년', CE2: '초등학교 3학년', CM1: '초등학교 4학년', CM2: '초등학교 5학년', '6ème': '초등학교 6학년', '5ème': '중학교 1학년', '4ème': '중학교 2학년', '3ème': '중학교 3학년', Seconde: '고등학교 1학년', Première: '고등학교 2학년', Terminale: '고등학교 3학년', Université: '대학교' },
  'id-ID': { CP: 'Kelas 1', CE1: 'Kelas 2', CE2: 'Kelas 3', CM1: 'Kelas 4', CM2: 'Kelas 5', '6ème': 'Kelas 6', '5ème': 'Kelas 7', '4ème': 'Kelas 8', '3ème': 'Kelas 9', Seconde: 'Kelas 10', Première: 'Kelas 11', Terminale: 'Kelas 12', Université: 'Universitas' },
};

function getGradeLabels(langCode) {
  if (GRADE_LABELS[langCode]) return GRADE_LABELS[langCode];
  const alias = I18N_FALLBACK_ALIAS[langCode];
  if (alias && GRADE_LABELS[alias]) return GRADE_LABELS[alias];
  return GRADE_LABELS['fr-FR'];
}

function translateGradeCode(code) {
  if (!code) return code;
  const labels = getGradeLabels(profLanguage.code);
  return labels[code] || code;
}

function applyGradeTranslations() {
  document.querySelectorAll('.grade-btn[data-grade]:not([data-grade=""])').forEach(btn => {
    const code = btn.dataset.grade;
    const emojiMatch = btn.textContent.match(/^\S+\s/);
    const emoji = emojiMatch ? emojiMatch[0] : '';
    btn.textContent = emoji + translateGradeCode(code);
  });
}
applyGradeTranslations();

document.querySelectorAll('.grade-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    grade = translateGradeCode(btn.dataset.grade);
    gradeScreen.style.display = 'none';
    subjectScreen.style.display = 'flex';
    subjectSearchOnboarding.value = '';
    renderTopicList(subjectResultsOnboarding, '', (t) => {
      applySubject(t);
      subjectScreen.style.display = 'none';
      mainApp.style.display = 'block';
      bubbleText.textContent = buildGreeting();
    });
  });
});

document.getElementById('backToGrade').addEventListener('click', () => {
  subjectScreen.style.display = 'none';
  gradeScreen.style.display = 'flex';
});

subjectSearchOnboarding.addEventListener('input', () => {
  renderTopicList(subjectResultsOnboarding, subjectSearchOnboarding.value, (t) => {
    applySubject(t);
    subjectScreen.style.display = 'none';
    mainApp.style.display = 'block';
    bubbleText.textContent = buildGreeting();
  });
});

document.getElementById('backToSubjectBtn').addEventListener('click', () => {
  if (recognition && listening) recognition.stop();
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  mainApp.style.display = 'none';
  subjectScreen.style.display = 'flex';
  subjectSearchOnboarding.value = '';
  renderTopicList(subjectResultsOnboarding, '', (t) => {
    applySubject(t);
    subjectScreen.style.display = 'none';
    mainApp.style.display = 'block';
    bubbleText.textContent = buildGreeting();
  });
});

function buildGreeting() {
  const gradeSuffix = grade ? ` (${grade})` : '';
  return t('greetingTemplate')
    .replace('{name}', NAMES[gender])
    .replace('{subject}', `${subject.label}${gradeSuffix}`);
}

// ============ Selecteur de matiere (recherche parmi 300+ themes) ============
function applySubject(topic) {
  subject = { icon: topic.icon, label: topic.label };
  subjectIcon.textContent = topic.icon;
  subjectLabel.textContent = topic.label;
}

function renderTopicList(container, query, onPick) {
  const trimmedQuery = query.trim();
  const q = trimmedQuery.toLowerCase();
  const translatedTopics = ALL_TOPICS.map(translateTopic);
  const matches = q
    ? translatedTopics.filter(topic => topic.label.toLowerCase().includes(q) || topic.subject.toLowerCase().includes(q))
    : translatedTopics;

  container.innerHTML = '';
  const limited = matches.slice(0, 60);

  // Si l'eleve a tape un theme qui n'est pas dans la liste (ou meme un theme different
  // de ce qu'il a trouve), il peut quand meme travailler dessus avec un theme personnalise.
  if (trimmedQuery) {
    const customBtn = document.createElement('button');
    customBtn.className = 'subject-option subject-option-custom';
    const main = document.createElement('span');
    main.textContent = `${t('customTopicWorkOn')} "${trimmedQuery}"`;
    const sub = document.createElement('span');
    sub.className = 'opt-subject';
    sub.textContent = t('customTopicLabel');
    customBtn.appendChild(main);
    customBtn.appendChild(sub);
    customBtn.addEventListener('click', () => onPick({ icon: '✨', subject: t('customTopicLabel'), label: trimmedQuery }));
    container.appendChild(customBtn);
  }

  if (limited.length === 0) {
    if (!trimmedQuery) {
      const div = document.createElement('div');
      div.className = 'subject-no-results';
      div.textContent = t('noResults');
      container.appendChild(div);
    }
    return;
  }

  limited.forEach(topic => {
    const btn = document.createElement('button');
    btn.className = 'subject-option';
    btn.innerHTML = `<span>${topic.icon} ${topic.label}</span><span class="opt-subject">${topic.subject}</span>`;
    btn.addEventListener('click', () => onPick(topic));
    container.appendChild(btn);
  });
}

changeSubjectBtn.addEventListener('click', () => {
  const willShow = subjectPicker.style.display === 'none';
  subjectPicker.style.display = willShow ? 'flex' : 'none';
  if (willShow) {
    subjectSearch.value = '';
    renderTopicList(subjectResults, '', (t) => {
      applySubject(t);
      subjectPicker.style.display = 'none';
    });
    subjectSearch.focus();
  }
});

subjectSearch.addEventListener('input', () => {
  renderTopicList(subjectResults, subjectSearch.value, (t) => {
    applySubject(t);
    subjectPicker.style.display = 'none';
  });
});

// ============ Onglets Voix / Ecrire / Questions ============
document.querySelectorAll('.mode-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('modeVoix').style.display = tab.dataset.mode === 'voix' ? 'block' : 'none';
    document.getElementById('modeEcrire').style.display = tab.dataset.mode === 'ecrire' ? 'block' : 'none';
    document.getElementById('modeQuestions').style.display = tab.dataset.mode === 'questions' ? 'block' : 'none';
  });
});

document.querySelectorAll('.question-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    showEleveLine(chip.textContent);
    askProf(chip.textContent);
  });
});

sendTextBtn.addEventListener('click', sendTextMessage);
textInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendTextMessage();
});

function sendTextMessage() {
  const text = textInput.value.trim();
  if (!text) return;
  showEleveLine(text);
  textInput.value = '';
  askProf(text);
}

// ============ Boutons decoratifs ============
document.querySelectorAll('.extra-btn[data-soon]').forEach(btn => {
  btn.addEventListener('click', () => showError('Bientôt disponible !'));
});

// ============ Tableau (canvas) ============
function clearBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  boardPlaceholder.style.display = 'flex';
}
clearBoard();

document.getElementById('clearBoardBtn').addEventListener('click', clearBoard);

document.getElementById('eraserBtn').addEventListener('click', () => {
  erasing = !erasing;
  document.getElementById('eraserBtn').classList.toggle('active', erasing);
});

document.querySelectorAll('.color-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    boardColor = dot.dataset.color;
    erasing = false;
    document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
  });
});

let drawing = false;
let lastX = 0, lastY = 0;

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
}

function startDraw(e) {
  drawing = true;
  boardPlaceholder.style.display = 'none';
  const pos = getPos(e);
  lastX = pos.x;
  lastY = pos.y;
}

function moveDraw(e) {
  if (!drawing) return;
  e.preventDefault();
  const pos = getPos(e);
  ctx.strokeStyle = erasing ? '#fdf8e8' : boardColor;
  ctx.lineWidth = erasing ? 22 : 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  lastX = pos.x;
  lastY = pos.y;
}

function endDraw() { drawing = false; }

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', moveDraw);
window.addEventListener('mouseup', endDraw);
canvas.addEventListener('touchstart', startDraw);
canvas.addEventListener('touchmove', moveDraw);
canvas.addEventListener('touchend', endDraw);

function writeOnBoard(text) {
  if (!text) return;
  boardPlaceholder.style.display = 'none';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = boardColor;
  ctx.font = '24px "Comic Sans MS", "Segoe UI", cursive';
  ctx.textBaseline = 'top';

  const maxWidth = canvas.width - 40;
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);

  let i = 0;
  let charIndex = 0;
  const lineHeight = 34;
  const startY = 30;

  function drawStep() {
    if (i >= lines.length) return;
    const current = lines[i];
    charIndex++;
    ctx.clearRect(20, startY + i * lineHeight, maxWidth, lineHeight);
    ctx.fillText(current.slice(0, charIndex), 20, startY + i * lineHeight);
    if (charIndex >= current.length) {
      i++;
      charIndex = 0;
    }
    if (i < lines.length) setTimeout(drawStep, 35);
  }
  drawStep();
}

// ============ Zone de conversation (bulle unique) ============
function showEleveLine(text) {
  eleveLine.textContent = text;
  eleveLine.style.display = 'block';
  errorBanner.style.display = 'none';
}

function showError(text) {
  errorBanner.textContent = text;
  errorBanner.style.display = 'block';
}

// ============ Voix ============
const FEMALE_NAME_HINTS = ['julie', 'hortense', 'denise', 'amelie', 'audrey', 'celine', 'female', 'femme'];
const MALE_NAME_HINTS = ['paul', 'guillaume', 'thomas', 'nicolas', 'henri', 'male', 'homme'];
// Les voix "Online (Natural)"/"Neural" (disponibles surtout dans Microsoft Edge) sonnent bien plus
// humaines que les vieilles voix locales (ex: Microsoft Hortense/Paul, assez mécaniques). On les
// prefere des qu'elles existent.
const NATURAL_NAME_HINTS = ['natural', 'online', 'neural'];

function pickVoice(g) {
  const langPrefix = profLanguage.code.split('-')[0];
  const voices = speechSynthesis.getVoices().filter(v => v.lang && v.lang.startsWith(langPrefix));
  if (voices.length === 0) return null;
  const hints = g === 'homme' ? MALE_NAME_HINTS : FEMALE_NAME_HINTS;
  const isNatural = (v) => NATURAL_NAME_HINTS.some(h => v.name.toLowerCase().includes(h));

  // 1. Voix naturelle qui correspond au genre choisi
  const naturalGendered = voices.find(v => isNatural(v) && hints.some(h => v.name.toLowerCase().includes(h)));
  if (naturalGendered) return naturalGendered;
  // 2. N'importe quelle voix naturelle
  const natural = voices.find(isNatural);
  if (natural) return natural;
  // 3. Voix locale qui correspond au genre choisi
  const gendered = voices.find(v => hints.some(h => v.name.toLowerCase().includes(h)));
  if (gendered) return gendered;
  // 4. Repli : la premiere voix francaise disponible
  return voices[0];
}

function setStatus(state, label) {
  statusDot.className = 'status-dot' + (state ? ' ' + state : '');
  statusText.textContent = label;
}

// Arrete la voix du prof (et le micro s'il ecoutait) : a appeler des qu'on quitte le chat pour
// une autre page (quiz, video, fiche, ecole...), sinon il continue a parler par-dessus.
function stopProfSpeaking() {
  if (recognition && listening) recognition.stop();
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  avatarEl.classList.remove('talking');
}

// Les symboles markdown/ponctuation en rafale (ex: "**", "...", "--") font buter les vieilles voix
// locales sur des mots bizarres ou des pauses trop longues : on nettoie avant de parler.
function cleanSpeechText(text) {
  return text
    .replace(/[*_#>`~]/g, '')
    .replace(/\.{2,}/g, ',')
    .replace(/\s+/g, ' ')
    .trim();
}

// Une seule longue utterance sonne monotone d'un bout a l'autre. En decoupant phrase par phrase et
// en variant tres legerement la hauteur de l'une a l'autre (comme une vraie intonation), avec une
// courte pause entre chaque, le rendu est nettement moins mécanique sur les vieilles voix locales.
function splitIntoSentences(text) {
  const parts = text.match(/[^.!?]+[.!?]*/g) || [text];
  return parts.map(s => s.trim()).filter(Boolean);
}

function speakSentence(sentence, voice, isNaturalVoice, pitch) {
  return new Promise((resolve) => {
    const utter = new SpeechSynthesisUtterance(sentence);
    utter.lang = profLanguage.code;
    if (voice) utter.voice = voice;
    utter.rate = isNaturalVoice ? 1 : 0.92;
    utter.pitch = pitch;
    utter.onend = () => resolve();
    utter.onerror = () => resolve();
    speechSynthesis.speak(utter);
  });
}

async function speak(text) {
  if (!('speechSynthesis' in window) || !text) return;

  const cleaned = cleanSpeechText(text);
  const sentences = splitIntoSentences(cleaned);
  if (sentences.length === 0) return;

  const voice = pickVoice(gender);
  const isNaturalVoice = voice && NATURAL_NAME_HINTS.some(h => voice.name.toLowerCase().includes(h));

  avatarEl.classList.add('talking');
  setStatus('talking', t('statusTalking'));

  for (let i = 0; i < sentences.length; i++) {
    // Legere variation de hauteur d'une phrase a l'autre, seulement pour les voix locales
    // (les voix naturelles gerent deja tres bien leur propre intonation).
    const pitch = isNaturalVoice ? 1 : 1 + (i % 2 === 0 ? -0.02 : 0.03);
    await speakSentence(sentences[i], voice, isNaturalVoice, pitch);
    if (i < sentences.length - 1) {
      await new Promise(r => setTimeout(r, isNaturalVoice ? 60 : 150));
    }
  }

  avatarEl.classList.remove('talking');
}

// Affiche un bouton suggerant a l'eleve d'aller regarder une video, lire la fiche ou faire le quiz,
// quand le prof juge que c'est pertinent pour la notion en cours.
const SUGGESTION_ACTIONS = {
  video: { labelKey: 'suggestVideo', open: openVideo },
  fiche: { labelKey: 'suggestFiche', open: openFiche },
  quiz: { labelKey: 'suggestQuiz', open: openQuiz },
};

function showSuggestion(kind) {
  const action = SUGGESTION_ACTIONS[kind];
  if (!action) {
    suggestionChip.style.display = 'none';
    return;
  }
  suggestionChip.textContent = t(action.labelKey);
  suggestionChip.style.display = 'flex';
  suggestionChip.onclick = action.open;
}

// ============ Appel au serveur (Claude) ============
async function askProf(eleveText) {
  history.push({ role: 'user', content: eleveText });
  setStatus('thinking', t('statusThinking'));
  suggestionChip.style.display = 'none';

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: history, grade, subject: subject.label, language: profLanguage.label }),
    });
    const data = await res.json();

    if (data.error) {
      showError(data.error);
      setStatus(null, t('statusWaiting'));
      return;
    }

    history.push({ role: 'assistant', content: JSON.stringify(data) });

    bubbleText.textContent = data.reponse;
    writeOnBoard(data.tableau);
    showSuggestion(data.suggestion);
    await speak(data.reponse);
    setStatus(null, t('statusWaiting'));
  } catch (err) {
    console.error(err);
    showError('Impossible de contacter le serveur.');
    setStatus(null, t('statusWaiting'));
  }
}

// ============ Reconnaissance vocale ============
const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (SpeechRecognitionImpl) {
  recognition = new SpeechRecognitionImpl();
  recognition.lang = profLanguage.code;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    listening = true;
    micBtn.classList.add('listening');
    setStatus('listening', t('statusListening'));
  };

  recognition.onresult = (event) => {
    const texte = event.results[0][0].transcript;
    showEleveLine(texte);
    askProf(texte);
  };

  recognition.onerror = (event) => {
    setStatus(null, t('micErrorPrefix') + " " + event.error);
  };

  recognition.onend = () => {
    listening = false;
    micBtn.classList.remove('listening');
  };
} else {
  micBtn.disabled = true;
  setStatus(null, t('micNotSupported'));
}

micBtn.addEventListener('click', () => {
  if (!recognition || listening) return;
  try {
    recognition.lang = profLanguage.code;
    recognition.start();
  } catch (e) {
    console.error(e);
  }
});

// ============ Quiz (3 modes : QCM classique, evaluation complete, reponses ecrites) ============
const QUIZ_TIME_PER_QUESTION = 20;

// Difficulte adaptative : 5/5 -> plus dur la prochaine fois, 20% ou moins -> plus facile,
// sinon on ne change rien. Persiste tant qu'on reste sur la page (pas par matiere).
const QUIZ_LEVELS = ['facile', 'normal', 'difficile'];
let quizDifficulty = 'normal';
const QUIZ_LEVEL_LABELS = { facile: 'Facile', normal: 'Normal', difficile: 'Difficile' };

function adjustQuizDifficulty(correctCount, total) {
  let idx = QUIZ_LEVELS.indexOf(quizDifficulty);
  const ratio = total > 0 ? correctCount / total : 0;
  if (correctCount === total) idx = Math.min(idx + 1, QUIZ_LEVELS.length - 1);
  else if (ratio <= 0.2) idx = Math.max(idx - 1, 0);
  quizDifficulty = QUIZ_LEVELS[idx];
}

let quizQuestions = [];
let quizIndex = 0;
let quizScore = 0;
let quizCorrectCount = 0;
let quizTimeLeft = QUIZ_TIME_PER_QUESTION;
let quizTimerHandle = null;
let quizAnswered = false;
let quizMode = 'qcm'; // 'qcm' | 'evaluation' | 'ecrit'
let quizEvalSelections = [];
let quizEvalTitle = '';

function quizPointsPerCorrect(elaborated) {
  if (quizMode === 'qcm') return 25;
  if (quizMode === 'evaluation') return 30;
  return elaborated ? 50 : 25; // ecrit : phrase complete = 50, juste la reponse brute = 25
}

// Compare deux textes en tolerant les petites fautes de frappe/orthographe (accents, casse,
// ponctuation, et une distance d'edition proportionnelle a la longueur du mot).
function normalizeAnswerText(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}
function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}
function fuzzyAnswerMatch(userAnswer, expected) {
  const a = normalizeAnswerText(userAnswer);
  const b = normalizeAnswerText(expected);
  if (!a || !b) return false;
  if (a === b) return true;

  // La bonne reponse peut etre noyee dans une phrase complete (ex: "ca fait 10" contient "10") :
  // on cherche la sequence de mots attendue a l'interieur de ce que l'eleve a ecrit.
  const aWords = a.split(' ');
  const bWords = b.split(' ');
  for (let i = 0; i <= aWords.length - bWords.length; i++) {
    if (aWords.slice(i, i + bWords.length).join(' ') === bWords.join(' ')) return true;
  }

  // Sinon, tolerance aux fautes de frappe si l'eleve a tape juste la reponse (avec une petite erreur)
  const dist = levenshtein(a, b);
  const tolerance = Math.max(1, Math.floor(b.length * 0.25));
  return dist <= tolerance;
}

// Vrai si l'eleve a redige une phrase complete (pas juste le mot/chiffre attendu tout seul)
function answerIsElaborated(userAnswer, expected) {
  const userWords = normalizeAnswerText(userAnswer).split(' ').filter(Boolean);
  const expectedWords = normalizeAnswerText(expected).split(' ').filter(Boolean);
  return userWords.length >= expectedWords.length + 2;
}

function openQuiz(mode) {
  stopProfSpeaking();
  quizMode = mode || 'qcm';
  quizScreen.style.display = 'flex';
  quizBadge.textContent = `🎓 ${subject.icon} ${subject.label} · ${QUIZ_LEVEL_LABELS[quizDifficulty]}`;
  quizResult.style.display = 'none';
  quizBody.style.display = 'none';
  quizEvalBody.style.display = 'none';
  quizLoading.style.display = 'block';
  quizLoading.textContent = t('quizLoading');

  quizScore = 0;
  quizCorrectCount = 0;
  quizIndex = 0;
  updateQuizScore();

  loadQuiz();
}

function closeQuiz() {
  stopQuizTimer();
  quizScreen.style.display = 'none';
}

async function loadQuiz() {
  try {
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ grade, subject: subject.label, difficulty: quizDifficulty, language: profLanguage.label, mode: quizMode, history }),
    });
    const data = await res.json();

    if (data.error || !Array.isArray(data.questions) || data.questions.length === 0) {
      quizLoading.textContent = data.error || "Impossible de générer le quiz pour le moment.";
      return;
    }

    quizQuestions = data.questions;
    quizIndex = 0;
    quizLoading.style.display = 'none';

    if (quizMode === 'evaluation') {
      quizEvalTitle = data.titre || '';
      renderEvalPage();
    } else {
      quizBody.style.display = 'flex';
      showQuizQuestion();
    }
  } catch (err) {
    console.error(err);
    quizLoading.textContent = 'Impossible de contacter le serveur.';
  }
}

function updateQuizScore() {
  quizScoreEl.textContent = String(quizScore).padStart(4, '0');
}

function showQuizQuestion() {
  const q = quizQuestions[quizIndex];
  quizAnswered = false;
  quizQNumber.textContent = `Question ${quizIndex + 1} / ${quizQuestions.length}`;
  quizQText.textContent = q.question;

  if (quizMode === 'ecrit') {
    quizOptions.style.display = 'none';
    quizWritten.style.display = 'flex';
    quizWrittenInput.value = '';
    quizWrittenInput.disabled = false;
    quizWrittenInput.classList.remove('correct', 'wrong');
    quizWrittenValidateBtn.style.display = 'inline-block';
  } else {
    quizWritten.style.display = 'none';
    quizOptions.style.display = 'grid';
    quizOptionsEls.forEach((btn, i) => {
      btn.querySelector('.quiz-option-text').textContent = q.options[i] ?? '';
      btn.classList.remove('correct', 'wrong');
      btn.disabled = false;
    });
  }

  quizExplanation.style.display = 'none';
  quizNextBtn.style.display = 'none';

  startQuizTimer();
}

function startQuizTimer() {
  stopQuizTimer();
  quizTimeLeft = QUIZ_TIME_PER_QUESTION;
  quizTimerEl.textContent = quizTimeLeft;
  quizTimerEl.classList.remove('urgent');

  quizTimerHandle = setInterval(() => {
    quizTimeLeft--;
    quizTimerEl.textContent = quizTimeLeft;
    if (quizTimeLeft <= 5) quizTimerEl.classList.add('urgent');
    if (quizTimeLeft <= 0) {
      stopQuizTimer();
      if (quizMode === 'ecrit') revealWrittenAnswer();
      else revealQuizAnswer(-1);
    }
  }, 1000);
}

function stopQuizTimer() {
  if (quizTimerHandle) {
    clearInterval(quizTimerHandle);
    quizTimerHandle = null;
  }
}

function revealQuizAnswer(chosenIdx) {
  if (quizAnswered) return;
  quizAnswered = true;
  stopQuizTimer();

  const q = quizQuestions[quizIndex];
  quizOptionsEls.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correctIndex) btn.classList.add('correct');
    else if (i === chosenIdx) btn.classList.add('wrong');
  });

  if (chosenIdx === q.correctIndex) {
    const points = quizPointsPerCorrect();
    quizScore += points;
    quizCorrectCount++;
    addStars(points);
    updateQuizScore();
  }

  quizExplanation.textContent = q.explanation || '';
  quizExplanation.style.display = 'block';
  quizNextBtn.style.display = 'inline-block';
  quizNextBtn.textContent = quizIndex < quizQuestions.length - 1 ? 'Suivant →' : 'Voir mon score →';
}

function revealWrittenAnswer() {
  if (quizAnswered) return;
  quizAnswered = true;
  stopQuizTimer();

  const q = quizQuestions[quizIndex];
  const correct = fuzzyAnswerMatch(quizWrittenInput.value, q.answer);
  quizWrittenInput.disabled = true;
  quizWrittenInput.classList.add(correct ? 'correct' : 'wrong');
  quizWrittenValidateBtn.style.display = 'none';

  if (correct) {
    const points = quizPointsPerCorrect(answerIsElaborated(quizWrittenInput.value, q.answer));
    quizScore += points;
    quizCorrectCount++;
    addStars(points);
    updateQuizScore();
  }

  quizExplanation.textContent = `${correct ? '' : `✅ ${q.answer} — `}${q.explanation || ''}`;
  quizExplanation.style.display = 'block';
  quizNextBtn.style.display = 'inline-block';
  quizNextBtn.textContent = quizIndex < quizQuestions.length - 1 ? 'Suivant →' : 'Voir mon score →';
}

quizOptionsEls.forEach((btn) => {
  btn.addEventListener('click', () => revealQuizAnswer(Number(btn.dataset.idx)));
});
quizWrittenValidateBtn.addEventListener('click', revealWrittenAnswer);
quizWrittenInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') revealWrittenAnswer();
});

quizNextBtn.addEventListener('click', () => {
  quizIndex++;
  if (quizIndex >= quizQuestions.length) {
    showQuizResult();
  } else {
    showQuizQuestion();
  }
});

// --- Mode evaluation : toutes les questions affichees en une seule page, groupees par exercice ---
function renderEvalPage() {
  quizEvalSelections = quizQuestions.map(() => null);
  quizEvalList.innerHTML = '';

  if (quizEvalTitle) {
    const titleEl = document.createElement('div');
    titleEl.className = 'quiz-eval-title';
    titleEl.textContent = quizEvalTitle;
    quizEvalList.appendChild(titleEl);
  }

  let lastExercice = null;
  quizQuestions.forEach((q, qi) => {
    if (q.exercice && q.exercice !== lastExercice) {
      lastExercice = q.exercice;
      const header = document.createElement('div');
      header.className = 'quiz-eval-exercice';
      header.innerHTML = `<div class="quiz-eval-exercice-title">${q.exercice}</div>${
        q.consigne ? `<div class="quiz-eval-exercice-consigne">${q.consigne}</div>` : ''
      }`;
      quizEvalList.appendChild(header);
    }

    const item = document.createElement('div');
    item.className = 'quiz-eval-item';
    if (q.type === 'ecrit') {
      item.innerHTML = `
        <div class="quiz-eval-question">${qi + 1}. ${q.question}</div>
        <input type="text" class="quiz-written-input quiz-eval-written" data-q="${qi}" data-i18n-placeholder="quizWrittenPlaceholder" placeholder="${t('quizWrittenPlaceholder')}">
      `;
    } else {
      const optionsHtml = q.options.map((opt, oi) =>
        `<button class="quiz-eval-option" data-q="${qi}" data-o="${oi}">${opt}</button>`
      ).join('');
      item.innerHTML = `
        <div class="quiz-eval-question">${qi + 1}. ${q.question}</div>
        <div class="quiz-eval-options">${optionsHtml}</div>
      `;
    }
    quizEvalList.appendChild(item);
  });
  quizEvalList.querySelectorAll('.quiz-eval-option').forEach(btn => {
    btn.addEventListener('click', () => {
      if (quizEvalValidateBtn.disabled) return;
      const qi = Number(btn.dataset.q);
      quizEvalSelections[qi] = Number(btn.dataset.o);
      quizEvalList.querySelectorAll(`.quiz-eval-option[data-q="${qi}"]`).forEach(b => {
        b.classList.toggle('selected', Number(b.dataset.o) === quizEvalSelections[qi]);
      });
    });
  });
  quizEvalValidateBtn.disabled = false;
  quizEvalValidateBtn.textContent = t('quizValidateAllBtn');
  quizEvalBody.style.display = 'flex';
}

quizEvalValidateBtn.addEventListener('click', () => {
  quizEvalValidateBtn.disabled = true;
  const points = quizPointsPerCorrect();
  quizQuestions.forEach((q, qi) => {
    if (q.type === 'ecrit') {
      const input = quizEvalList.querySelector(`.quiz-eval-written[data-q="${qi}"]`);
      const correct = fuzzyAnswerMatch(input.value, q.answer);
      input.disabled = true;
      input.classList.add(correct ? 'correct' : 'wrong');
      if (!correct) {
        const hint = document.createElement('div');
        hint.className = 'quiz-eval-written-answer';
        hint.textContent = `✅ ${q.answer}`;
        input.insertAdjacentElement('afterend', hint);
      }
      if (correct) { quizScore += points; quizCorrectCount++; }
    } else {
      const chosen = quizEvalSelections[qi];
      if (chosen === q.correctIndex) { quizScore += points; quizCorrectCount++; }
      quizEvalList.querySelectorAll(`.quiz-eval-option[data-q="${qi}"]`).forEach(b => {
        const oi = Number(b.dataset.o);
        b.classList.remove('selected');
        if (oi === q.correctIndex) b.classList.add('correct');
        else if (oi === chosen) b.classList.add('wrong');
      });
    }
  });
  addStars(quizCorrectCount * points);
  updateQuizScore();
  setTimeout(showQuizResult, 900);
});

function showQuizResult() {
  quizBody.style.display = 'none';
  quizEvalBody.style.display = 'none';
  quizResult.style.display = 'block';

  const total = quizQuestions.length;
  let difficultyNote = t('quizDifficultySame');
  if (quizMode === 'qcm') {
    const previousDifficulty = quizDifficulty;
    adjustQuizDifficulty(quizCorrectCount, total);
    if (quizDifficulty !== previousDifficulty) {
      difficultyNote = quizDifficulty === 'facile' ? t('quizDifficultyEasier') : t('quizDifficultyHarder');
    }
  }

  quizResultScore.textContent = t('quizResultTemplate')
    .replace('{score}', String(quizScore).padStart(4, '0'))
    .replace('{correct}', quizCorrectCount)
    .replace('{total}', total)
    .replace('{note}', difficultyNote);
}

launchQuizBtn.addEventListener('click', () => openQuiz('qcm'));
launchEvalBtn.addEventListener('click', () => openQuiz('evaluation'));
launchEcritBtn.addEventListener('click', () => openQuiz('ecrit'));
quizCloseBtn.addEventListener('click', closeQuiz);
quizBackBtn.addEventListener('click', closeQuiz);
quizRestartBtn.addEventListener('click', () => openQuiz(quizMode));

// ============ Video (recherche YouTube integree) ============
// L'API IFrame de YouTube (pas juste un src d'iframe classique) permet d'ecouter le vrai etat de
// lecture (onStateChange -> ENDED) : c'est la seule facon fiable de savoir que l'eleve a regarde
// la video jusqu'au bout, plutot que de deviner ou de faire confiance a un simple minuteur.
let ytApiLoadingPromise = null;
function loadYouTubeIframeApi() {
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (ytApiLoadingPromise) return ytApiLoadingPromise;
  ytApiLoadingPromise = new Promise((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (previousCallback) previousCallback();
      resolve();
    };
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  });
  return ytApiLoadingPromise;
}

let ytPlayer = null;
let videoWatchedRewardGiven = false;

function showVideoRewardBanner() {
  videoRewardBanner.textContent = t('videoWatchedReward').replace('{n}', 500);
  videoRewardBanner.style.display = 'block';
}

// Empeche de gagner les etoiles en avancant simplement la barre de lecture jusqu'a la fin :
// on verifie regulierement que le temps de lecture avance a peu pres a la meme vitesse que le
// temps reel, et on renvoie l'eleve la ou il en etait vraiment s'il essaie de sauter en avant.
let videoWatchGuardHandle = null;
let videoFurthestTime = 0;
function startVideoWatchGuard() {
  stopVideoWatchGuard();
  videoFurthestTime = 0;
  videoWatchGuardHandle = setInterval(() => {
    if (!ytPlayer || !ytPlayer.getCurrentTime || ytPlayer.getPlayerState() !== YT.PlayerState.PLAYING) return;
    const current = ytPlayer.getCurrentTime();
    if (current > videoFurthestTime + 3) {
      ytPlayer.seekTo(videoFurthestTime, true);
    } else {
      videoFurthestTime = Math.max(videoFurthestTime, current);
    }
  }, 1000);
}
function stopVideoWatchGuard() {
  if (videoWatchGuardHandle) { clearInterval(videoWatchGuardHandle); videoWatchGuardHandle = null; }
}

function resetVideoPlayer() {
  stopVideoWatchGuard();
  if (ytPlayer && ytPlayer.destroy) {
    try { ytPlayer.destroy(); } catch (err) { /* deja detruit */ }
  }
  ytPlayer = null;
  // Le YT.Player precedent remplace/detruit son propre element : on redonne toujours un
  // conteneur frais avant d'en creer un nouveau, plutot que de reutiliser un noeud possiblement disparu.
  videoScreenBody.innerHTML = '<div id="videoIframe"></div>';
}

async function openVideo() {
  stopProfSpeaking();
  videoScreenTitle.textContent = `🎥 ${subject.label}...`;
  videoRewardBanner.style.display = 'none';
  videoWatchedRewardGiven = false;
  videoScreen.style.display = 'flex';
  resetVideoPlayer();

  try {
    const res = await fetch('/api/video-search', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ grade, subject: subject.label, history }),
    });
    const data = await res.json();

    if (data.error || !data.videoId) {
      videoScreenTitle.textContent = data.error || t('noVideoFound');
      return;
    }

    videoScreenTitle.textContent = `🎥 ${data.title || subject.label}`;

    await loadYouTubeIframeApi();
    resetVideoPlayer();
    ytPlayer = new YT.Player('videoIframe', {
      videoId: data.videoId,
      playerVars: { autoplay: 1, disablekb: 1 },
      events: {
        onReady: () => startVideoWatchGuard(),
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.ENDED) {
            stopVideoWatchGuard();
            if (!videoWatchedRewardGiven) {
              videoWatchedRewardGiven = true;
              addStars(500);
              showVideoRewardBanner();
            }
          }
        },
      },
    });
  } catch (err) {
    console.error(err);
    videoScreenTitle.textContent = t('serverError');
  }
}

function closeVideo() {
  videoScreen.style.display = 'none';
  resetVideoPlayer();
}

openVideoBtn.addEventListener('click', openVideo);
videoCloseBtn.addEventListener('click', closeVideo);

// ============ Fiche de cours ============
let currentFiche = null;

async function openFiche() {
  stopProfSpeaking();
  ficheScreen.style.display = 'flex';
  ficheHeaderTitle.textContent = `📄 Fiche : ${subject.label}`;
  ficheLoading.style.display = 'block';
  ficheLoading.textContent = t('ficheLoading');
  ficheContent.style.display = 'none';
  downloadFicheBtn.style.display = 'none';
  currentFiche = null;

  try {
    const res = await fetch('/api/fiche', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ grade, subject: subject.label, history, language: profLanguage.label }),
    });
    const data = await res.json();

    if (data.error) {
      ficheLoading.textContent = data.error;
      return;
    }

    currentFiche = data;
    renderFiche(data);
  } catch (err) {
    console.error(err);
    ficheLoading.textContent = 'Impossible de contacter le serveur.';
  }
}

function renderFiche(fiche) {
  ficheTitre.textContent = fiche.titre || subject.label;
  ficheMeta.textContent = `${subject.icon} ${subject.label}${grade ? ' · ' + grade : ''} · ${NAMES[gender]}`;

  ficheSectionsEl.innerHTML = '';
  (fiche.sections || []).forEach(s => {
    const block = document.createElement('div');
    block.className = 'fiche-section-block';
    const title = document.createElement('div');
    title.className = 'fiche-section-title';
    title.textContent = s.titre;
    const text = document.createElement('div');
    text.className = 'fiche-section-text';
    text.textContent = s.contenu;
    block.appendChild(title);
    block.appendChild(text);
    ficheSectionsEl.appendChild(block);
  });

  ficheResumeEl.textContent = fiche.resume || '';

  ficheLoading.style.display = 'none';
  ficheContent.style.display = 'block';
  downloadFicheBtn.style.display = 'inline-block';
}

function closeFiche() {
  ficheScreen.style.display = 'none';
}

function downloadFiche() {
  if (!currentFiche) return;

  let text = `${currentFiche.titre}\n`;
  text += `${subject.label}${grade ? ' - ' + grade : ''}\n`;
  text += '='.repeat(40) + '\n\n';

  (currentFiche.sections || []).forEach(s => {
    text += `${s.titre}\n${'-'.repeat(s.titre.length)}\n${s.contenu}\n\n`;
  });

  text += `À retenir :\n${currentFiche.resume || ''}\n`;

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fiche-${subject.label.replace(/\s+/g, '_')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

openFicheBtn.addEventListener('click', openFiche);
ficheCloseBtn.addEventListener('click', closeFiche);
downloadFicheBtn.addEventListener('click', downloadFiche);

// ============ Salle d'arcade : 4 mini-jeux contre des etoiles ============
const GAME_COST = 250;
const GAME_DURATION = 30;
// Choix de duree : 250 etoiles pour 30 secondes, ou 500 etoiles pour une minute complete
const GAME_TIERS = [
  { cost: 250, duration: 30 },
  { cost: 500, duration: 60 },
];
const GAMES = [
  { key: 'stars', icon: '⭐', title: 'Attrape les Étoiles', desc: "Attrape un maximum d'étoiles en 30 secondes !", controls: '← →', gradient: 'linear-gradient(135deg, #7c5cff, #4b3fd6)' },
  { key: 'space', icon: '🚀', title: "Esquive l'Espace", desc: 'Pilote ton vaisseau, esquive les météorites et tire avec Espace !', controls: '← ↑ → ↓ · Espace', gradient: 'linear-gradient(135deg, #232946, #121629)' },
  { key: 'snake', icon: '🐍', title: 'Serpent Gourmand', desc: 'Guide le serpent pour manger des pommes sans te mordre !', controls: '← ↑ → ↓', gradient: 'linear-gradient(135deg, #1fa87a, #0d7a55)' },
  { key: 'balloons', icon: '🎈', title: 'Tir aux Ballons', desc: 'Vise avec la souris et tire (clic ou Espace) pour éclater les ballons !', controls: '🖱️ · Espace', gradient: 'linear-gradient(135deg, #ff5c9c, #e0245e)' },
];

function renderGamesList() {
  gamesListEl.innerHTML = '';
  GAMES.forEach(g => {
    const card = document.createElement('div');
    card.className = 'game-card';
    const tiersHtml = GAME_TIERS.map((tier, ti) => {
      const canAfford = stars >= tier.cost;
      return `
        <div class="game-card-tier">
          <div>
            <div class="game-card-price">⭐ ${tier.cost}</div>
            <div class="game-card-duration">⏱ ${tier.duration} ${t('gameSeconds')}</div>
          </div>
          <button class="game-card-play" data-key="${g.key}" data-tier="${ti}" ${canAfford ? '' : 'disabled'}>${
            canAfford ? t('gamePlayBtn') : t('gameNeedStars').replace('{n}', tier.cost)
          }</button>
        </div>
      `;
    }).join('');
    card.innerHTML = `
      <div class="game-card-header" style="background:${g.gradient}">
        <div class="game-card-icon">${g.icon}</div>
        <div>
          <div class="game-card-title">${g.title}</div>
          <div class="game-card-desc">${g.desc}${g.controls ? ' ' + g.controls : ''}</div>
        </div>
      </div>
      <div class="game-card-body">
        <div class="game-card-price-label">${t('gamePriceLabel')}</div>
        <div class="game-card-tiers">${tiersHtml}</div>
      </div>
    `;
    gamesListEl.appendChild(card);
  });
  gamesListEl.querySelectorAll('.game-card-play').forEach(btn => {
    btn.addEventListener('click', () => startGame(btn.dataset.key, GAME_TIERS[Number(btn.dataset.tier)]));
  });
}

function openGames() {
  stopProfSpeaking();
  gamesScreen.style.display = 'flex';
  renderGamesList();
}
function closeGames() {
  gamesScreen.style.display = 'none';
}
openGamesBtn.addEventListener('click', openGames);
gamesCloseBtn.addEventListener('click', closeGames);

// --- Moteur commun aux 4 jeux : un seul canvas, un seul timer, une seule boucle d'animation ---
let activeGame = null;
let gameOver = false;
let gameScore = 0;
let gameFrame = 0;
let gameTimeLeft = GAME_DURATION;
let gameTimerHandle = null;
let gameAnimHandle = null;
const gameKeysPressed = new Set();

function resizeGameCanvas() {
  gameCanvas.width = gameCanvas.clientWidth;
  gameCanvas.height = gameCanvas.clientHeight;
}
window.addEventListener('resize', () => {
  if (gamePlayScreen.style.display !== 'none') resizeGameCanvas();
});

function gameKeyDown(e) {
  if (gamePlayScreen.style.display === 'none') return;
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
    e.preventDefault();
    gameKeysPressed.add(e.key);
  }
}
function gameKeyUp(e) { gameKeysPressed.delete(e.key); }
window.addEventListener('keydown', gameKeyDown);
window.addEventListener('keyup', gameKeyUp);

// Manette tactile : chaque bouton fait comme la touche du clavier correspondante
document.querySelectorAll('.game-touch-btn').forEach((btn) => {
  const key = btn.dataset.key;
  const press = (e) => { e.preventDefault(); gameKeysPressed.add(key); btn.classList.add('pressed'); };
  const release = (e) => { e.preventDefault(); gameKeysPressed.delete(key); btn.classList.remove('pressed'); };
  btn.addEventListener('pointerdown', press);
  btn.addEventListener('pointerup', release);
  btn.addEventListener('pointercancel', release);
  btn.addEventListener('pointerleave', release);
  btn.addEventListener('contextmenu', (e) => e.preventDefault());
});

function gameCanvasPos(e) {
  const rect = gameCanvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) * (gameCanvas.width / rect.width),
    y: (e.clientY - rect.top) * (gameCanvas.height / rect.height),
  };
}

gameCanvas.addEventListener('mousemove', (e) => {
  if (activeGame !== 'balloons' || !balloonGame) return;
  const pos = gameCanvasPos(e);
  balloonGame.aimX = pos.x;
  balloonGame.aimY = pos.y;
});

gameCanvas.addEventListener('click', (e) => {
  if (activeGame !== 'balloons' || gameOver) return;
  const pos = gameCanvasPos(e);
  balloonGame.aimX = pos.x;
  balloonGame.aimY = pos.y;
  fireBalloonBullet();
});

function startGame(key, tier) {
  const chosenTier = tier || GAME_TIERS[0];
  if (!spendStars(chosenTier.cost)) return;
  activeGame = key;
  gameOver = false;
  gameScore = 0;
  gameFrame = 0;
  gameTimeLeft = chosenTier.duration;
  gameKeysPressed.clear();
  gamePlayScreen.dataset.game = key;
  gamePlayTitle.textContent = GAMES.find(g => g.key === key).title;
  gamePlayTimer.textContent = gameTimeLeft;
  gameEndOverlay.style.display = 'none';
  gamePlayScreen.style.display = 'flex';
  resizeGameCanvas();
  initGame(key);

  if (gameTimerHandle) clearInterval(gameTimerHandle);
  gameTimerHandle = setInterval(() => {
    if (gameOver) return;
    gameTimeLeft--;
    gamePlayTimer.textContent = gameTimeLeft;
    if (gameTimeLeft <= 0) endGame();
  }, 1000);

  if (!gameAnimHandle) gameLoop();
}

function endGame() {
  if (gameOver) return;
  gameOver = true;
  if (gameTimerHandle) { clearInterval(gameTimerHandle); gameTimerHandle = null; }
  gameEndText.textContent = t('gameOverScore').replace('{n}', gameScore);
  gameEndOverlay.style.display = 'flex';
}

function closeGamePlay() {
  gameOver = true;
  if (gameTimerHandle) { clearInterval(gameTimerHandle); gameTimerHandle = null; }
  if (gameAnimHandle) { cancelAnimationFrame(gameAnimHandle); gameAnimHandle = null; }
  gamePlayScreen.style.display = 'none';
  activeGame = null;
}
gamePlayCloseBtn.addEventListener('click', closeGamePlay);
gameEndCloseBtn.addEventListener('click', closeGamePlay);

function gameLoop() {
  gameAnimHandle = requestAnimationFrame(gameLoop);
  if (!activeGame) return;
  gameFrame++;
  if (!gameOver) updateGame(activeGame);
  drawGame(activeGame);
}

function initGame(key) {
  if (key === 'stars') initStarGame();
  else if (key === 'space') initSpaceGame();
  else if (key === 'snake') initSnakeGame();
  else if (key === 'balloons') initBalloonGame();
}
function updateGame(key) {
  if (key === 'stars') updateStarGame();
  else if (key === 'space') updateSpaceGame();
  else if (key === 'snake') updateSnakeGame();
  else if (key === 'balloons') updateBalloonGame();
}
function drawGame(key) {
  if (key === 'stars') drawStarGame();
  else if (key === 'space') drawSpaceGame();
  else if (key === 'snake') drawSnakeGame();
  else if (key === 'balloons') drawBalloonGame();
}

function gameDrawScore() {
  gameCtx.fillStyle = 'white';
  gameCtx.font = 'bold 18px sans-serif';
  gameCtx.textAlign = 'left';
  gameCtx.fillText(`⭐ ${gameScore}`, 14, 28);
}

// --- Jeu 1 : Attrape les Étoiles (panier a gauche/droite, etoiles qui tombent, dynamite/etoile bleue pieges) ---
let starGame = null;
function randomDynamiteDelay() {
  return (10 + Math.random() * 20) * 60; // entre 10 et 30 secondes, en frames (~60 fps)
}
function initStarGame() {
  starGame = {
    paddleX: gameCanvas.width / 2 - 45, paddleW: 90, items: [],
    nextDynamiteAt: randomDynamiteDelay(),
    regularCaught: 0, blueCaught: 0, giantMilestone: 10,
  };
}
function spawnGiantStars() {
  for (let i = 0; i < 3; i++) {
    starGame.items.push({
      type: 'giant',
      x: 30 + Math.random() * (gameCanvas.width - 60),
      y: -30 - i * 60,
      speed: 2 + Math.random(),
    });
  }
}
function updateStarGame() {
  const speed = 6;
  if (gameKeysPressed.has('ArrowLeft')) starGame.paddleX -= speed;
  if (gameKeysPressed.has('ArrowRight')) starGame.paddleX += speed;
  starGame.paddleX = Math.max(0, Math.min(gameCanvas.width - starGame.paddleW, starGame.paddleX));

  if (gameFrame % 50 === 0) {
    // Une petite partie des etoiles est bleue : un bonus qui rapporte 10 points au lieu d'un seul
    const type = Math.random() < 0.08 ? 'bluestar' : 'star';
    starGame.items.push({ type, x: Math.random() * (gameCanvas.width - 20) + 10, y: -10, speed: 2.5 + Math.random() * 2.5 });
  }

  // De temps en temps (toutes les 10 a 30 secondes), une dynamite tombe parmi les etoiles :
  // l'attraper fait perdre 5 points au lieu d'en rapporter.
  if (gameFrame >= starGame.nextDynamiteAt) {
    starGame.items.push({ type: 'dynamite', x: Math.random() * (gameCanvas.width - 20) + 10, y: -10, speed: 3 + Math.random() * 2 });
    starGame.nextDynamiteAt = gameFrame + randomDynamiteDelay();
  }

  // Tous les 10 etoiles normales recuperees, 3 enormes etoiles bonus tombent d'un coup
  if (starGame.regularCaught >= starGame.giantMilestone) {
    spawnGiantStars();
    starGame.giantMilestone += 10;
  }

  const paddleY = gameCanvas.height - 30;
  starGame.items = starGame.items.filter(it => {
    it.y += it.speed;
    if (it.y >= paddleY - 10 && it.y <= paddleY + 14 && it.x >= starGame.paddleX && it.x <= starGame.paddleX + starGame.paddleW) {
      if (it.type === 'dynamite') {
        gameScore = Math.max(0, gameScore - 5);
      } else if (it.type === 'bluestar') {
        gameScore += 10;
        starGame.blueCaught++;
      } else if (it.type === 'giant') {
        gameScore += 3;
        starGame.regularCaught++;
      } else {
        gameScore++;
        starGame.regularCaught++;
      }
      return false;
    }
    return it.y < gameCanvas.height + 20;
  });
}
// Dessine une etoile a 5 branches (utilise pour l'etoile bleue piegee, sans emoji bleu disponible)
function drawStarShape(cx, cy, radius, color) {
  gameCtx.fillStyle = color;
  gameCtx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? radius : radius * 0.45;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;
    if (i === 0) gameCtx.moveTo(px, py);
    else gameCtx.lineTo(px, py);
  }
  gameCtx.closePath();
  gameCtx.fill();
}

function drawStarGame() {
  gameCtx.fillStyle = '#1b1b2f';
  gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  gameCtx.textAlign = 'center';
  starGame.items.forEach(it => {
    if (it.type === 'dynamite') {
      gameCtx.font = '26px sans-serif';
      gameCtx.fillText('🧨', it.x, it.y);
    } else if (it.type === 'bluestar') {
      drawStarShape(it.x, it.y, 13, '#3d7fd6');
    } else if (it.type === 'giant') {
      gameCtx.font = '52px sans-serif';
      gameCtx.fillText('⭐', it.x, it.y);
    } else {
      gameCtx.font = '26px sans-serif';
      gameCtx.fillText('⭐', it.x, it.y);
    }
  });

  // Panier en osier (trapeze + rebord + quelques traits de tressage), a la place de la simple barre
  const paddleY = gameCanvas.height - 30;
  const bx = starGame.paddleX;
  const bw = starGame.paddleW;
  const topY = paddleY - 6;
  const botY = paddleY + 22;
  const inset = bw * 0.12;

  gameCtx.fillStyle = '#c98a4b';
  gameCtx.beginPath();
  gameCtx.moveTo(bx, topY);
  gameCtx.lineTo(bx + bw, topY);
  gameCtx.lineTo(bx + bw - inset, botY);
  gameCtx.lineTo(bx + inset, botY);
  gameCtx.closePath();
  gameCtx.fill();

  // Le panier se remplit d'etoiles au fur et a mesure qu'on en attrape (plafonne pour ne pas deborder),
  // avec quelques etoiles bleues melangees si on en a attrape.
  const MAX_FILL = 12;
  const totalCaught = starGame.regularCaught + starGame.blueCaught;
  const filled = Math.min(totalCaught, MAX_FILL);
  const blueInFill = Math.min(starGame.blueCaught, filled);
  const perRow = 4;
  const cellW = (bw - inset * 1.4) / perRow;
  gameCtx.font = '13px sans-serif';
  gameCtx.textAlign = 'center';
  for (let i = 0; i < filled; i++) {
    const row = Math.floor(i / perRow);
    const col = i % perRow;
    const fx = bx + inset * 0.7 + cellW * (col + 0.5);
    const fy = botY - 8 - row * 12;
    if (i < blueInFill) drawStarShape(fx, fy - 4, 7, '#3d7fd6');
    else gameCtx.fillText('⭐', fx, fy);
  }

  gameCtx.strokeStyle = '#8a5a2b';
  gameCtx.lineWidth = 2;
  for (let i = 1; i <= 2; i++) {
    const y = topY + (i * (botY - topY)) / 3;
    const ratio = (y - topY) / (botY - topY);
    const leftX = bx + inset * ratio;
    const rightX = bx + bw - inset * ratio;
    gameCtx.beginPath();
    gameCtx.moveTo(leftX, y);
    gameCtx.lineTo(rightX, y);
    gameCtx.stroke();
  }

  gameCtx.fillStyle = '#7c5cff';
  gameCtx.beginPath();
  gameCtx.roundRect(bx - 4, topY - 6, bw + 8, 8, 4);
  gameCtx.fill();

  gameDrawScore();
}

// --- Jeu 2 : Esquive l'Espace (vaisseau libre, meteorites qui tombent, tir avec Espace) ---
let spaceGame = null;
function initSpaceGame() {
  spaceGame = { x: gameCanvas.width / 2, y: gameCanvas.height - 60, meteors: [], bullets: [], hitFlash: 0, fireCooldown: 0, lives: 3 };
}
function fireSpaceBullet() {
  if (!spaceGame || spaceGame.fireCooldown > 0) return;
  spaceGame.bullets.push({ x: spaceGame.x, y: spaceGame.y - 18 });
  spaceGame.fireCooldown = 10;
}
function updateSpaceGame() {
  const speed = 5;
  if (gameKeysPressed.has('ArrowLeft')) spaceGame.x -= speed;
  if (gameKeysPressed.has('ArrowRight')) spaceGame.x += speed;
  if (gameKeysPressed.has('ArrowUp')) spaceGame.y -= speed;
  if (gameKeysPressed.has('ArrowDown')) spaceGame.y += speed;
  spaceGame.x = Math.max(16, Math.min(gameCanvas.width - 16, spaceGame.x));
  spaceGame.y = Math.max(16, Math.min(gameCanvas.height - 16, spaceGame.y));

  if (spaceGame.fireCooldown > 0) spaceGame.fireCooldown--;
  if (gameKeysPressed.has(' ')) fireSpaceBullet();

  // Plus de meteorites qu'avant : spawn plus frequent, et parfois deux d'un coup
  if (gameFrame % 12 === 0) {
    spaceGame.meteors.push({ x: Math.random() * gameCanvas.width, y: -10, speed: 3 + Math.random() * 3 });
    if (Math.random() < 0.4) {
      spaceGame.meteors.push({ x: Math.random() * gameCanvas.width, y: -10, speed: 3 + Math.random() * 3 });
    }
  }
  if (gameFrame % 30 === 0) gameScore++;
  if (spaceGame.hitFlash > 0) spaceGame.hitFlash--;

  spaceGame.bullets = spaceGame.bullets.filter(b => {
    b.y -= 9;
    return b.y > -10;
  });

  spaceGame.meteors = spaceGame.meteors.filter(m => {
    m.y += m.speed;

    // Un tir qui touche la meteorite la detruit et rapporte des points
    const hitBulletIdx = spaceGame.bullets.findIndex(b => Math.hypot(b.x - m.x, b.y - m.y) < 18);
    if (hitBulletIdx >= 0) {
      spaceGame.bullets.splice(hitBulletIdx, 1);
      gameScore += 2;
      return false;
    }

    const dist = Math.hypot(m.x - spaceGame.x, m.y - spaceGame.y);
    if (dist < 22 && spaceGame.hitFlash === 0) {
      gameScore = Math.max(0, gameScore - 3);
      spaceGame.hitFlash = 30;
      spaceGame.lives--;
      if (spaceGame.lives <= 0) endGame();
    }
    return m.y < gameCanvas.height + 20;
  });
}
function drawSpaceGame() {
  gameCtx.fillStyle = spaceGame.hitFlash > 0 ? '#4a1420' : '#0b0e21';
  gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  gameCtx.font = '24px sans-serif';
  gameCtx.textAlign = 'center';
  spaceGame.meteors.forEach(m => gameCtx.fillText('☄️', m.x, m.y));
  gameCtx.fillStyle = '#4dd8ff';
  spaceGame.bullets.forEach(b => gameCtx.fillRect(b.x - 2, b.y - 8, 4, 14));
  gameCtx.save();
  gameCtx.translate(spaceGame.x, spaceGame.y);
  gameCtx.font = '28px sans-serif';
  gameCtx.fillText('🚀', 0, 0);
  gameCtx.restore();

  gameCtx.font = '20px sans-serif';
  gameCtx.textAlign = 'right';
  gameCtx.fillText('❤️'.repeat(Math.max(0, spaceGame.lives)), gameCanvas.width - 14, 28);
  gameCtx.textAlign = 'left';

  gameDrawScore();
}

// --- Jeu 3 : Serpent Gourmand (grille fixe style Google Snake, dans un fond neutre) ---
let snakeGame = null;
const GOOGLE_SNAKE_COLS = 17;
const GOOGLE_SNAKE_ROWS = 15;
function initSnakeGame() {
  const cols = GOOGLE_SNAKE_COLS;
  const rows = GOOGLE_SNAKE_ROWS;
  const cell = Math.floor(Math.min(gameCanvas.width / cols, gameCanvas.height / rows));
  const offsetX = Math.round((gameCanvas.width - cell * cols) / 2);
  const offsetY = Math.round((gameCanvas.height - cell * rows) / 2);
  const startX = Math.floor(cols / 2);
  const startY = Math.floor(rows / 2);
  snakeGame = {
    cell, cols, rows, offsetX, offsetY,
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    segments: [{ x: startX - 1, y: startY }, { x: startX - 2, y: startY }, { x: startX - 3, y: startY }],
    moveTimer: 0,
    moveInterval: 8,
  };
  snakeGame.segments.unshift({ x: startX, y: startY });
  spawnSnakeApple();
}
function spawnSnakeApple() {
  let pos;
  do {
    pos = { x: Math.floor(Math.random() * snakeGame.cols), y: Math.floor(Math.random() * snakeGame.rows) };
  } while (snakeGame.segments.some(s => s.x === pos.x && s.y === pos.y));
  snakeGame.apple = pos;
}
function updateSnakeGame() {
  const d = snakeGame.dir;
  if (gameKeysPressed.has('ArrowLeft') && d.x === 0) snakeGame.nextDir = { x: -1, y: 0 };
  else if (gameKeysPressed.has('ArrowRight') && d.x === 0) snakeGame.nextDir = { x: 1, y: 0 };
  else if (gameKeysPressed.has('ArrowUp') && d.y === 0) snakeGame.nextDir = { x: 0, y: -1 };
  else if (gameKeysPressed.has('ArrowDown') && d.y === 0) snakeGame.nextDir = { x: 0, y: 1 };

  snakeGame.moveTimer++;
  if (snakeGame.moveTimer < snakeGame.moveInterval) return;
  snakeGame.moveTimer = 0;
  snakeGame.dir = snakeGame.nextDir;

  const head = snakeGame.segments[0];
  const newHead = { x: head.x + snakeGame.dir.x, y: head.y + snakeGame.dir.y };

  if (newHead.x < 0 || newHead.y < 0 || newHead.x >= snakeGame.cols || newHead.y >= snakeGame.rows ||
      snakeGame.segments.some(s => s.x === newHead.x && s.y === newHead.y)) {
    endGame();
    return;
  }

  snakeGame.segments.unshift(newHead);
  if (newHead.x === snakeGame.apple.x && newHead.y === snakeGame.apple.y) {
    gameScore++;
    spawnSnakeApple();
  } else {
    snakeGame.segments.pop();
  }
}
function drawSnakeGame() {
  gameCtx.fillStyle = '#1b1b2f';
  gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

  const { cell, cols, rows, offsetX, offsetY } = snakeGame;
  gameCtx.save();
  gameCtx.translate(offsetX, offsetY);

  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      gameCtx.fillStyle = (gx + gy) % 2 === 0 ? '#aad751' : '#a2d149';
      gameCtx.fillRect(gx * cell, gy * cell, cell, cell);
    }
  }

  gameCtx.fillStyle = '#4a4ae0';
  snakeGame.segments.forEach((s, i) => {
    gameCtx.fillStyle = i === 0 ? '#4a4ae0' : '#5c5cf0';
    gameCtx.beginPath();
    gameCtx.roundRect(s.x * cell + 1, s.y * cell + 1, cell - 2, cell - 2, 6);
    gameCtx.fill();
  });

  const head = snakeGame.segments[0];
  const cx = head.x * cell + cell / 2;
  const cy = head.y * cell + cell / 2;
  const eyeOffsetX = snakeGame.dir.x * 4;
  const eyeOffsetY = snakeGame.dir.y * 4;
  const perpX = snakeGame.dir.y * 4;
  const perpY = snakeGame.dir.x * 4;
  gameCtx.fillStyle = 'white';
  [-1, 1].forEach(side => {
    gameCtx.beginPath();
    gameCtx.arc(cx + eyeOffsetX + perpX * side, cy + eyeOffsetY + perpY * side, 3, 0, Math.PI * 2);
    gameCtx.fill();
  });

  const ax = snakeGame.apple.x * cell + cell / 2;
  const ay = snakeGame.apple.y * cell + cell / 2;
  gameCtx.fillStyle = '#e0302f';
  gameCtx.beginPath();
  gameCtx.arc(ax, ay + 2, cell * 0.32, 0, Math.PI * 2);
  gameCtx.fill();
  gameCtx.strokeStyle = '#5c3a1e';
  gameCtx.lineWidth = 2;
  gameCtx.beginPath();
  gameCtx.moveTo(ax, ay - cell * 0.28);
  gameCtx.lineTo(ax, ay - cell * 0.42);
  gameCtx.stroke();

  gameCtx.restore();
  gameDrawScore();
}

// --- Jeu 4 : Tir aux Ballons (pistolet qui vise a la souris, tire au clic ou avec Espace) ---
let balloonGame = null;
function initBalloonGame() {
  balloonGame = {
    balloons: [], bullets: [],
    aimX: gameCanvas.width / 2, aimY: gameCanvas.height / 2,
    fireCooldown: 0,
  };
}
function fireBalloonBullet() {
  if (!balloonGame || balloonGame.fireCooldown > 0) return;
  balloonGame.bullets.push({
    x: gameCanvas.width / 2, y: gameCanvas.height - 10,
    targetX: balloonGame.aimX, targetY: balloonGame.aimY,
  });
  balloonGame.fireCooldown = 10;
}
function updateBalloonGame() {
  if (gameFrame % 35 === 0) {
    balloonGame.balloons.push({
      x: 20 + Math.random() * (gameCanvas.width - 40),
      y: gameCanvas.height + 20,
      speed: 1.5 + Math.random() * 1.5,
      radius: 22,
    });
  }
  balloonGame.balloons = balloonGame.balloons.filter(b => {
    b.y -= b.speed;
    return b.y > -30;
  });

  if (balloonGame.fireCooldown > 0) balloonGame.fireCooldown--;
  if (gameKeysPressed.has(' ')) fireBalloonBullet();

  const bulletSpeed = 16;
  balloonGame.bullets = balloonGame.bullets.filter(bullet => {
    const dx = bullet.targetX - bullet.x;
    const dy = bullet.targetY - bullet.y;
    const dist = Math.hypot(dx, dy);
    if (dist < bulletSpeed) {
      bullet.x = bullet.targetX;
      bullet.y = bullet.targetY;
    } else {
      bullet.x += (dx / dist) * bulletSpeed;
      bullet.y += (dy / dist) * bulletSpeed;
    }

    const hitIdx = balloonGame.balloons.findIndex(b => Math.hypot(b.x - bullet.x, b.y - bullet.y) < b.radius);
    if (hitIdx >= 0) {
      balloonGame.balloons.splice(hitIdx, 1);
      gameScore++;
      return false;
    }
    return dist >= bulletSpeed; // le tir disparait une fois arrive a la cible visee, meme sans toucher
  });
}
function drawBalloonGame() {
  const grad = gameCtx.createLinearGradient(0, 0, 0, gameCanvas.height);
  grad.addColorStop(0, '#bfe3ff');
  grad.addColorStop(1, '#eaf6ff');
  gameCtx.fillStyle = grad;
  gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

  gameCtx.font = '36px sans-serif';
  gameCtx.textAlign = 'center';
  balloonGame.balloons.forEach(b => gameCtx.fillText('🎈', b.x, b.y));

  gameCtx.fillStyle = '#ff9a3d';
  balloonGame.bullets.forEach(bullet => {
    gameCtx.beginPath();
    gameCtx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
    gameCtx.fill();
  });

  gameCtx.strokeStyle = '#e0245e';
  gameCtx.lineWidth = 2;
  gameCtx.beginPath();
  gameCtx.arc(balloonGame.aimX, balloonGame.aimY, 16, 0, Math.PI * 2);
  gameCtx.moveTo(balloonGame.aimX - 22, balloonGame.aimY);
  gameCtx.lineTo(balloonGame.aimX + 22, balloonGame.aimY);
  gameCtx.moveTo(balloonGame.aimX, balloonGame.aimY - 22);
  gameCtx.lineTo(balloonGame.aimX, balloonGame.aimY + 22);
  gameCtx.stroke();

  gameCtx.save();
  gameCtx.translate(gameCanvas.width / 2, gameCanvas.height - 10);
  const angle = Math.atan2(balloonGame.aimY - (gameCanvas.height - 10), balloonGame.aimX - gameCanvas.width / 2);
  gameCtx.rotate(angle + Math.PI / 2);
  gameCtx.font = '30px sans-serif';
  gameCtx.fillText('🔫', 0, 0);
  gameCtx.restore();

  gameCtx.fillStyle = '#26263a';
  gameCtx.font = 'bold 18px sans-serif';
  gameCtx.fillText(`⭐ ${gameScore}`, gameCanvas.width / 2, 28);
  gameCtx.textAlign = 'left';
}

})();
