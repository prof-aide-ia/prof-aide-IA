// ============ Les règles de Toto ============
// Ce fichier dit ce que Toto A LE DROIT de faire et ce qu'il N'A PAS LE DROIT de faire.
// Toto vérifie CHAQUE message de l'élève avec ces règles AVANT de répondre,
// et le serveur vérifie aussi tout ce que le prof Claude lui apprend.
// Tu peux modifier les listes ci-dessous : écris les mots en minuscules, sans accents.
(function (root) {
  // ---------- Ce que Toto A LE DROIT de faire ----------
  const A_LE_DROIT = [
    'Expliquer les leçons de toutes les matières, avec des exemples simples.',
    'Poser des questions à l\'élève pour l\'entraîner (interrogation, quiz).',
    'Donner des indices et des méthodes pour trouver la réponse soi-même.',
    'Répondre aux questions de culture générale.',
    'Encourager l\'élève et lui donner des conseils pour réviser.',
    'Chercher sur internet, mais seulement sur des sites fiables (jamais Wikipédia ni les forums).',
  ];

  // ---------- Ce que Toto N'A PAS LE DROIT de faire ----------
  const PAS_LE_DROIT = [
    'Faire les devoirs à la place de l\'élève ou donner directement la réponse d\'un exercice.',
    'Dire des gros mots ou des insultes, ou laisser passer des insultes.',
    'Demander ou garder des informations personnelles (adresse, téléphone, mot de passe...).',
    'Parler de sujets dangereux ou pour les adultes (armes, drogue, violence, piratage...).',
    'Donner son avis sur la politique ou la religion.',
    'Jouer au médecin : pour la santé, il faut voir un adulte ou un médecin.',
    'Utiliser des sites où tout le monde peut écrire (Wikipédia, forums...).',
  ];

  // ---------- Les listes de mots surveillés ----------
  const GROS_MOTS = ['con', 'conne', 'connard', 'connasse', 'merde', 'putain', 'pute', 'salope', 'salaud', 'encule', 'enculer', 'batard', 'bouffon', 'abruti', 'debile', 'cretin', 'nique', 'niquer', 'fdp', 'ntm', 'tg', 'ta gueule', 'ferme ta gueule', 'chier', 'foutre', 'bite', 'couille', 'couilles', 'pd', 'trou du cul', 'ta mere'];

  // Une situation grave : Toto répond avec douceur et donne les numéros d'aide (gratuits, 24h/24)
  const DANGER = [
    { mots: ['suicide', 'me suicider', 'me tuer', 'envie de mourir', 'veux mourir', 'en finir', 'me faire du mal', 'me scarifier', 'scarification', 'idees noires'],
      reponse: 'Ce que tu ressens est important, et tu n\'es pas seul. Parles-en tout de suite à tes parents, à ta maîtresse ou ton maître, ou à un autre adulte de confiance (l\'infirmière scolaire, un proche). Tu peux aussi appeler le 3114, gratuit, jour et nuit, où des personnes sont là pour t\'écouter. En cas de danger immédiat, appelle le 112.' },
    // (seulement quand ca arrive a l'eleve : "c'est quoi le harcelement" reste une question de cours)
    { mots: ['je suis harcele', 'je suis harcelee', 'je me fais harceler', 'on me harcele', 'ils me harcelent', 'on se moque de moi', 'tout le monde se moque de moi', 'on m\'insulte', 'on me menace', 'on me racket', 'je me fais racketter'],
      reponse: 'Personne n\'a le droit de se moquer de toi ou de te harceler, et ce n\'est jamais ta faute. Parles-en vite à tes parents, à ta maîtresse ou ton maître, ou à un autre adulte de l\'école (le directeur, le CPE, l\'infirmière). Ils sont là pour te protéger. Tu peux aussi appeler le 3018 : c\'est gratuit et anonyme, et ça aide les enfants qui sont embêtés, même sur internet.' },
    { mots: ['on me frappe', 'il me frappe', 'elle me frappe', 'on me bat', 'on me touche', 'maltraite', 'maltraitance', 'on me fait du mal'],
      reponse: 'Ce qui t\'arrive n\'est pas normal et tu as le droit d\'être protégé. Parles-en à un adulte de confiance (ta maîtresse ou ton maître, l\'infirmière scolaire, un proche), et appelle le 119 (Allô Enfance en danger) : c\'est gratuit, jour et nuit, et ça n\'apparaît pas sur la facture. En cas de danger immédiat : 17 (police) ou 112.' },
  ];

  // Des sujets interdits : Toto refuse gentiment et ramène l'élève vers ses cours
  const SUJETS_INTERDITS = ['fabriquer une bombe', 'bombe artisanale', 'fabriquer une arme', 'acheter une arme', 'drogue', 'cannabis', 'cocaine', 'se droguer', 'fumer du shit', 'acheter de l\'alcool', 'pirater', 'hacker un compte', 'voler un compte', 'mot de passe de', 'porno', 'sexe', 'tuer quelqu\'un', 'faire du mal a quelqu\'un', 'voler dans un magasin'];

  // Toto ne fait pas les devoirs à la place de l'élève
  const FAIRE_A_MA_PLACE = ['fais mon devoir', 'fais mes devoirs', 'fait mon devoir', 'fait mes devoirs', 'fais mon exercice', 'fais l\'exercice a ma place', 'ecris ma redaction', 'ecrit ma redaction', 'fais ma redaction', 'donne moi la reponse', 'donne la reponse', 'dis moi la reponse', 'donne moi les reponses', 'a ma place'];

  // Pas d'avis sur la politique ou la religion
  const OPINIONS = ['pour qui voter', 'quel parti', 'meilleur president', 'tu preferes quel president', 'quelle est la vraie religion', 'meilleure religion', 'dieu existe', 'est ce que dieu existe', 'tu es de droite', 'tu es de gauche'];

  // Pas de médecin
  // (attention : "j'ai mal compris" n'est pas un probleme de sante !)
  const SANTE = ['je suis malade', 'j\'ai mal au', 'j\'ai mal a la', 'j\'ai mal aux', 'j\'ai de la fievre', 'quel medicament', 'je me suis blesse', 'je saigne'];

  // ---------- Les outils ----------
  const simple = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’`]/g, '\'');
  const contient = (texte, mots) => {
    const s = ' ' + simple(texte).replace(/[^a-z0-9']+/g, ' ') + ' ';
    return mots.some((m) => s.includes(' ' + m + ' ') || (m.includes(' ') && s.includes(' ' + m)));
  };
  // Des infos personnelles : téléphone, e-mail, adresse, mot de passe
  const TELEPHONE = /(\+33|0)\s?[1-9]([\s.-]?\d{2}){4}/;
  const EMAIL = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
  const PERSO = ['j\'habite au', 'j\'habite a', 'j\'habite rue', 'mon adresse', 'mon numero', 'mon mot de passe', 'mon code secret', 'mon nom de famille est'];

  // Vérifie un message de l'élève. Renvoie null si tout va bien,
  // sinon { raison, reponse } : ce que Toto doit répondre à la place.
  function verifier(texte) {
    for (const d of DANGER) if (contient(texte, d.mots)) return { raison: 'danger', reponse: d.reponse, tableau: 'Parles-en à un adulte de confiance' };
    if (TELEPHONE.test(texte) || EMAIL.test(texte) || contient(texte, PERSO)) {
      return { raison: 'perso', reponse: 'Attention ! Ne donne jamais ton adresse, ton numéro de téléphone, ton e-mail ou ton mot de passe sur internet, même à moi. Garde-les secrets ! Pose-moi plutôt une question sur tes cours.', tableau: 'Mes infos perso restent secrètes !' };
    }
    if (contient(texte, GROS_MOTS)) return { raison: 'gros_mot', reponse: 'Oh, pas de gros mots ici ! On reste poli, même quand on est énervé. Si quelque chose t\'agace dans un exercice, explique-moi ce qui te bloque et on va trouver ensemble.', tableau: 'On reste poli 🙂' };
    if (contient(texte, SUJETS_INTERDITS)) return { raison: 'interdit', reponse: 'Ça, je n\'ai pas le droit d\'en parler. Je suis là pour t\'aider à apprendre : pose-moi une question sur tes cours !', tableau: null };
    if (contient(texte, OPINIONS)) return { raison: 'opinion', reponse: 'Je ne donne pas mon avis sur la politique ou la religion : chacun est libre de penser ce qu\'il veut. Par contre, je peux t\'expliquer comment ça marche, par exemple les élections ou la laïcité.', tableau: null };
    if (contient(texte, SANTE)) return { raison: 'sante', reponse: 'Je ne suis pas médecin, alors je ne peux pas t\'aider pour ça. Parles-en vite à un adulte. En cas d\'urgence, appelle le 15 (SAMU) ou le 112.', tableau: 'Urgence : 15 ou 112' };
    if (contient(texte, FAIRE_A_MA_PLACE)) return { raison: 'devoirs', reponse: 'Je ne fais pas tes devoirs à ta place : sinon, tu n\'apprendrais rien ! Par contre, je t\'aide à les réussir toi-même. Dis-moi ce qu\'on te demande et ce que tu as déjà essayé.', tableau: 'Je t\'aide, tu trouves 💪' };
    if (/\b(tes regles|tes regle|ce que tu as le droit|tu as le droit de quoi|qu'est-ce que tu peux faire|tu sers a quoi|tu peux faire quoi)\b/.test(simple(texte))) {
      return { raison: 'charte', reponse: charte(), tableau: 'Les règles de Toto' };
    }
    return null;
  }

  // Ce que Toto répond quand on lui demande ses règles
  function charte() {
    return `Voici mes règles ! J'ai le droit de : ${A_LE_DROIT.map((r) => r.charAt(0).toLowerCase() + r.slice(1, -1)).join(' ; ')}. Je n'ai pas le droit de : ${PAS_LE_DROIT.map((r) => r.charAt(0).toLowerCase() + r.slice(1, -1)).join(' ; ')}.`;
  }

  // Une réponse (de Toto ou de Claude) contient-elle quelque chose d'interdit ?
  function reponseInterdite(texte) {
    return contient(texte, GROS_MOTS) || contient(texte, SUJETS_INTERDITS) || /wikipedia|wikimedia|vikidia/i.test(String(texte || ''));
  }

  const Regles = { A_LE_DROIT, PAS_LE_DROIT, verifier, charte, reponseInterdite };
  root.TOTO_REGLES = Regles; // pour Toto (dans le navigateur, et aussi dans les tests)
  if (typeof module !== 'undefined' && module.exports) module.exports = Regles; // pour le serveur
})(typeof window !== 'undefined' ? window : globalThis);
