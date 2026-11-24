// ============ Mon IA : le prof maison du site ============
// Une IA qui tourne entierement dans le navigateur : pas besoin de Claude, ni de cle API,
// ni d'internet. Elle :
//  - interroge l'eleve (elle invente des questions de calcul, fractions, geometrie, conjugaison
//    a l'infini, et pioche dans sa base de savoir pour les langues, l'histoire, la geo, les sciences),
//  - corrige ses reponses (en acceptant "3 sur 4", "trois", "12 cm", les petites fautes de frappe...),
//  - ne donne jamais la reponse : elle donne des indices de plus en plus precis (livre du bon prof),
//  - adapte la difficulte a son niveau grace a la mini-IA de progression (brain.js),
//  - repond aux questions de cours ("c'est quoi un denominateur ?") avec sa base de notions.
// Tu peux lui apprendre de nouvelles choses : ajoute des questions dans BANKS ou des notions dans NOTIONS.
(function (root) {
  // ---------- Outils ----------
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  function stripAccents(s) {
    return s.replace(/œ/g, 'oe').replace(/Œ/g, 'OE').replace(/æ/g, 'ae').normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  const NUMBER_WORDS = {
    zero: 0, un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9, dix: 10,
    onze: 11, douze: 12, treize: 13, quatorze: 14, quinze: 15, seize: 16, 'dix-sept': 17, 'dix-huit': 18, 'dix-neuf': 19,
    vingt: 20, trente: 30, quarante: 40, cinquante: 50, soixante: 60, cent: 100, mille: 1000,
  };
  const FRACTION_WORDS = { demi: 2, demis: 2, tiers: 3, quart: 4, quarts: 4, cinquieme: 5, cinquiemes: 5, sixieme: 6, sixiemes: 6, huitieme: 8, huitiemes: 8, dixieme: 10, dixiemes: 10 };

  // Met une reponse sous une forme simple a comparer : minuscules, sans accents, sans articles,
  // "3 sur 4" -> "3/4", "trois quarts" -> "3/4", "12 cm" -> "12"
  function normalize(text) {
    let s = stripAccents(String(text).toLowerCase()).replace(/[’`]/g, "'").replace(/²/g, '2').trim();
    // "c'est 12" -> "12" (mais "c'est" tout seul reste "c'est" : c'est parfois la reponse !)
    s = s.replace(/^(c'est|ca fait|ca donne|la reponse est|je pense que c'est|je dirais|reponse ?:?)\s+(?=\S)/g, '');
    // Une reponse qui n'est qu'un signe (":" , "+", "=") reste telle quelle
    if (/^[^a-z0-9]+$/.test(s)) return s.replace(/\s+/g, '');
    s = s.replace(/[!?.;:«»"]/g, ' ').replace(/,(?=\d)/g, '.').replace(/,/g, ' ');
    // Nombres en lettres
    s = s.replace(/[a-z-]+/g, (w) => (w in NUMBER_WORDS ? String(NUMBER_WORDS[w]) : w));
    // Fractions en lettres : "3 quarts", "un demi"
    s = s.replace(/(\d+)\s+([a-z]+)/g, (m, n, w) => (w in FRACTION_WORDS ? `${n}/${FRACTION_WORDS[w]}` : m));
    s = s.replace(/(\d+)\s*(sur|\/)\s*(\d+)/g, '$1/$3');
    // Unites et articles
    s = s.replace(/(\d)\s*(cm2|cm²|m2|m²|cm|mm|km|m|kg|g|l|euros?|€|ans?)\b/g, '$1');
    s = s.replace(/\b(le|la|les|l'|un|une|des|du|de|d'|en|a|au|aux)\s+/g, '').replace(/\b[ld]'/g, '');
    return s.replace(/\s+/g, ' ').trim();
  }

  function levenshtein(a, b) {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
    }
    return d[a.length][b.length];
  }

  // 'exact' : bonne reponse ; 'presque' : une petite faute de frappe ; null : faux
  function check(text, question) {
    const given = normalize(text);
    if (!given) return null;
    // D'abord une reponse exacte (parmi toutes les reponses acceptees), ensuite seulement "presque"
    if (question.answers.some((a) => normalize(a) === given)) return 'exact';
    for (const expected of question.answers) {
      const want = normalize(expected);
      if (given === want) return 'exact';
      // La reponse peut etre dans une phrase : "nous chantons", "la capitale c'est paris"
      const words = given.split(' ');
      // ("12 ou 13" ne compte pas : on ne donne pas plusieurs nombres pour tenter sa chance)
      const numbers = words.filter((w) => /\d/.test(w)).length;
      if (want.split(' ').length === 1 && words.includes(want) && words.length <= 4 && !(/\d/.test(want) && numbers > 1)) return 'exact';
      if (!question.strict && want.length >= 5 && !/\d/.test(want) && levenshtein(given, want) <= 1) return 'presque';
    }
    return null;
  }

  // ---------- Generateurs de questions (infinis) ----------
  // Chaque question : { q, answers, hints[], method, board, strict? } ; level 0 = facile, 1 = normal, 2 = difficile
  const GEN = {
    addition(level) {
      const max = [20, 100, 1000][level];
      const a = rand(2, max), b = rand(2, max);
      return {
        q: `Combien font ${a} + ${b} ?`, answers: [String(a + b)], board: `${a} + ${b} = ?`,
        hints: a >= 10 || b >= 10
          ? [`Commence par les dizaines (ou les centaines), puis les unités.`, `Les unités d'abord : ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}. Il te reste les dizaines.`, `Pose l'opération en colonnes, sans oublier la retenue.`]
          : [`Pars du plus grand nombre et avance de ${Math.min(a, b)} sur tes doigts.`, `Tu peux passer par 10 : complète jusqu'à 10, puis ajoute le reste.`],
        method: `Pour additionner, on ajoute les unités avec les unités, les dizaines avec les dizaines, en n'oubliant pas les retenues.`,
      };
    },
    soustraction(level) {
      const max = [20, 100, 1000][level];
      let a = rand(5, max), b = rand(1, max);
      if (b > a) [a, b] = [b, a];
      return {
        q: `Combien font ${a} − ${b} ?`, answers: [String(a - b)], board: `${a} − ${b} = ?`,
        hints: [`Tu peux compter de ${b} jusqu'à ${a} : combien de pas fais-tu ?`, `Vérifie avec une addition : ton résultat + ${b} doit faire ${a}.`, `Pose l'opération en colonnes en commençant par les unités.`],
        method: `Une soustraction, c'est l'écart entre deux nombres. On peut toujours vérifier avec une addition.`,
      };
    },
    tables(level) {
      const a = rand(2, [5, 9, 12][level]), b = rand(2, 10);
      return {
        q: `Combien font ${a} × ${b} ?`, answers: [String(a * b)], board: `${a} × ${b} = ?`,
        hints: [`${a} × ${b}, c'est ${b} fois le nombre ${a} : ${Array(Math.min(b, 4)).fill(a).join(' + ')}${b > 4 ? ' + ...' : ''}`, `Tu connais peut-être ${a} × ${b - 1} = ${a * (b - 1)} ? Il te reste à ajouter ${a}.`, `Récite la table de ${a} jusqu'à ${b}.`],
        method: `Multiplier, c'est additionner plusieurs fois le même nombre. Les tables se retiennent en les récitant souvent.`,
      };
    },
    multiplication(level) {
      if (level < 2) return GEN.tables(level + 1);
      const a = rand(11, 99), b = rand(3, 9);
      return {
        q: `Combien font ${a} × ${b} ?`, answers: [String(a * b)], board: `${a} × ${b} = ?`,
        hints: [`Découpe ${a} en ${a - (a % 10)} + ${a % 10}.`, `Calcule ${a - (a % 10)} × ${b} = ${(a - (a % 10)) * b}, puis ${a % 10} × ${b}.`, `Ajoute les deux résultats.`],
        method: `Pour multiplier un grand nombre, on le découpe en dizaines et unités, on multiplie chaque morceau, puis on additionne.`,
      };
    },
    division(level) {
      const b = rand(2, [5, 9, 12][level]), r = rand(2, 10), a = b * r;
      return {
        q: `Combien font ${a} ÷ ${b} ?`, answers: [String(r)], board: `${a} ÷ ${b} = ?`,
        hints: [`Cherche le nombre qui, multiplié par ${b}, donne ${a}.`, `Récite la table de ${b} jusqu'à tomber sur ${a}.`, `C'est comme partager ${a} bonbons entre ${b} amis : combien chacun en reçoit ?`],
        method: `Diviser, c'est partager en parts égales. On cherche dans la table de multiplication.`,
      };
    },
    equation(level) {
      const x = rand(1, [10, 20, 50][level]);
      if (level === 0 || Math.random() < 0.5) {
        const a = rand(2, 30);
        return {
          q: `Trouve x : x + ${a} = ${x + a}`, answers: [String(x), `x=${x}`, `x = ${x}`], board: `x + ${a} = ${x + a}`,
          hints: [`Quel nombre faut-il ajouter à ${a} pour obtenir ${x + a} ?`, `Pour « défaire » le + ${a}, on fait − ${a} des deux côtés.`],
          method: `Pour trouver x, on fait l'opération inverse des deux côtés de l'égalité.`,
        };
      }
      const a = rand(2, 9);
      return {
        q: `Trouve x : ${a}x = ${a * x}`, answers: [String(x), `x=${x}`, `x = ${x}`], board: `${a}x = ${a * x}`,
        hints: [`${a}x veut dire ${a} × x.`, `Pour « défaire » le × ${a}, on divise par ${a} des deux côtés.`],
        method: `Pour trouver x, on fait l'opération inverse des deux côtés de l'égalité.`,
      };
    },
    fractionPart(level) {
      const n = rand(2, [6, 10, 12][level]), k = rand(1, n - 1);
      const objet = pick([['Une tablette de chocolat', 'carrés'], ['Une équipe de foot', 'joueurs'], ['Une boîte de cartes Pokémon', 'cartes'], ['Une tarte aux pommes', 'parts'], ['Un mur de blocs Minecraft', 'blocs']]);
      return {
        q: `${objet[0]} a ${n} ${objet[1]} en tout. On en prend ${k}. Quelle fraction a-t-on prise ?`, answers: [`${k}/${n}`], board: `${k} ${objet[1]} sur ${n} : fraction ?`, strict: true,
        hints: [`Le nombre du bas (le dénominateur), c'est le nombre total de ${objet[1]}.`, `Le nombre du haut (le numérateur), c'est ce qu'on a pris.`, `Écris-la sous la forme « haut / bas ».`],
        method: `Une fraction s'écrit « parts prises / parts en tout ». Le nombre du bas dit en combien on a coupé.`,
      };
    },
    fractionSimplify(level) {
      const n = rand(2, [5, 9, 12][level]), k = rand(1, n - 1);
      if (gcd(k, n) !== 1) return GEN.fractionSimplify(level);
      const f = rand(2, [3, 5, 6][level]);
      return {
        q: `Simplifie la fraction ${k * f}/${n * f} le plus possible.`, answers: [`${k}/${n}`], board: `${k * f}/${n * f} = ?`, strict: true,
        hints: [`Cherche un nombre qui divise à la fois ${k * f} et ${n * f}.`, `Essaie de diviser le haut et le bas par ${f}.`, `Une fraction est simplifiée au maximum quand plus aucun nombre ne divise le haut ET le bas.`],
        method: `Simplifier, c'est diviser le numérateur et le dénominateur par le même nombre.`,
      };
    },
    fractionAdd(level) {
      const n = rand(3, [8, 12, 20][level]), a = rand(1, n - 2), b = rand(1, n - 1 - a);
      return {
        q: `Calcule ${a}/${n} + ${b}/${n}.`, answers: [`${a + b}/${n}`], board: `${a}/${n} + ${b}/${n} = ?`, strict: true,
        hints: [`Les deux fractions ont le même dénominateur (${n}) : les morceaux ont la même taille.`, `Le dénominateur ne change pas, on garde ${n}.`, `Additionne seulement les numérateurs : ${a} + ${b}.`],
        method: `Avec le même dénominateur, on additionne les numérateurs et on garde le dénominateur.`,
      };
    },
    fractionCompare(level) {
      const n = rand(3, [8, 12, 20][level]);
      let a = rand(1, n - 1), b = rand(1, n - 1);
      while (b === a) b = rand(1, n - 1);
      return {
        q: `Quelle fraction est la plus grande : ${a}/${n} ou ${b}/${n} ?`, answers: [`${Math.max(a, b)}/${n}`], board: `${a}/${n} ? ${b}/${n}`, strict: true, choices: [`${a}/${n}`, `${b}/${n}`, `${n}/${a}`, `${a + b}/${n}`],
        hints: [`Les deux ont des morceaux de même taille (même dénominateur ${n}).`, `Alors la plus grande, c'est celle où l'on prend le plus de morceaux.`],
        method: `Avec le même dénominateur, la plus grande fraction est celle qui a le plus grand numérateur.`,
      };
    },
    perimetre(level) {
      const L = rand(3, [10, 20, 50][level]), l = rand(2, L);
      if (Math.random() < 0.3) {
        return {
          q: `Quel est le périmètre d'un carré de ${L} cm de côté ?`, answers: [String(4 * L)], board: `Carré de côté ${L} cm : P = ?`,
          hints: [`Le périmètre, c'est le tour de la figure.`, `Un carré a 4 côtés de même longueur.`, `Calcule ${L} × 4.`],
          method: `Le périmètre d'un carré = côté × 4.`,
        };
      }
      return {
        q: `Quel est le périmètre d'un rectangle de ${L} cm sur ${l} cm ?`, answers: [String(2 * (L + l))], board: `Rectangle ${L} cm × ${l} cm : P = ?`,
        hints: [`Le périmètre, c'est la longueur du tour de la figure.`, `Un rectangle a 2 longueurs de ${L} cm et 2 largeurs de ${l} cm.`, `Calcule ${L} + ${l} + ${L} + ${l}.`],
        method: `Le périmètre d'un rectangle = (longueur + largeur) × 2.`,
      };
    },
    aire(level) {
      const L = rand(2, [10, 15, 30][level]), l = rand(2, L);
      return {
        q: `Quelle est l'aire d'un rectangle de ${L} cm sur ${l} cm (en cm²) ?`, answers: [String(L * l)], board: `Rectangle ${L} × ${l} : aire = ?`,
        hints: [`L'aire, c'est la surface à l'intérieur : combien de petits carrés de 1 cm² on peut y mettre.`, `Il y a ${l} rangées de ${L} petits carrés.`, `Calcule ${L} × ${l}.`],
        method: `L'aire d'un rectangle = longueur × largeur.`,
      };
    },
    conjugaison(level) {
      const PRONOUNS = ['je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles'];
      const P = rand(0, PRONOUNS.length - 1), pr = PRONOUNS[P];
      const idx = [0, 1, 2, 2, 2, 3, 4, 5, 5][P]; // personne grammaticale
      const IRREG = {
        'être': { present: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'], futur: ['serai', 'seras', 'sera', 'serons', 'serez', 'seront'], imparfait: ['étais', 'étais', 'était', 'étions', 'étiez', 'étaient'] },
        avoir: { present: ['ai', 'as', 'a', 'avons', 'avez', 'ont'], futur: ['aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront'], imparfait: ['avais', 'avais', 'avait', 'avions', 'aviez', 'avaient'] },
        aller: { present: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'], futur: ['irai', 'iras', 'ira', 'irons', 'irez', 'iront'], imparfait: ['allais', 'allais', 'allait', 'allions', 'alliez', 'allaient'] },
        faire: { present: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'], futur: ['ferai', 'feras', 'fera', 'ferons', 'ferez', 'feront'], imparfait: ['faisais', 'faisais', 'faisait', 'faisions', 'faisiez', 'faisaient'] },
        finir: { present: ['finis', 'finis', 'finit', 'finissons', 'finissez', 'finissent'], futur: ['finirai', 'finiras', 'finira', 'finirons', 'finirez', 'finiront'], imparfait: ['finissais', 'finissais', 'finissait', 'finissions', 'finissiez', 'finissaient'] },
      };
      const REGULAR = ['chanter', 'jouer', 'parler', 'danser', 'regarder', 'dessiner', 'nager', 'manger', 'lancer', 'grimper', 'sauter', 'écouter'];
      const temps = pick([['present'], ['present', 'futur'], ['present', 'futur', 'imparfait']][level]);
      const nomTemps = { present: 'présent', futur: 'futur', imparfait: 'imparfait' }[temps];
      const useIrreg = level > 0 && Math.random() < 0.4;
      let verbe, forme, hints;
      if (useIrreg) {
        verbe = pick(Object.keys(IRREG));
        forme = IRREG[verbe][temps][idx];
        hints = [`« ${verbe} » est un verbe ${verbe === 'finir' ? 'du 2e groupe' : 'irrégulier'} : il faut connaître sa conjugaison par cœur.`, `Récite « ${verbe} » au ${nomTemps} dans l'ordre : je, tu, il, nous, vous, ils.`, `Ça commence par « ${forme[0]} ».`];
      } else {
        verbe = pick(REGULAR);
        const rad = verbe.slice(0, -2);
        const nousRad = verbe.endsWith('ger') ? rad + 'e' : verbe.endsWith('cer') ? rad.slice(0, -1) + 'ç' : rad;
        const END = { present: ['e', 'es', 'e', 'ons', 'ez', 'ent'], futur: ['ai', 'as', 'a', 'ons', 'ez', 'ont'], imparfait: ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'] };
        if (temps === 'futur') forme = verbe + END.futur[idx];
        else if (temps === 'imparfait') forme = (idx === 3 || idx === 4 ? rad : nousRad) + END.imparfait[idx];
        else forme = (idx === 3 ? nousRad : rad) + END.present[idx];
        hints = [
          `« ${verbe} » finit par -er : c'est un verbe du 1er groupe.`,
          temps === 'futur' ? `Au futur, on garde tout l'infinitif « ${verbe} » et on ajoute la terminaison.` : `On enlève -er : le radical est « ${rad}- ».`,
          `Avec « ${pr} », au ${nomTemps}, la terminaison est « -${END[temps][idx]} ».${temps !== 'futur' && (verbe.endsWith('ger') || verbe.endsWith('cer')) && /^[ao]/.test(END[temps][idx]) ? ` Attention, avec -${verbe.slice(-3)}, il faut garder le son doux !` : ''}`,
        ];
      }
      const sujet = pr === 'je' && /^[aeiouéèh]/.test(forme) ? "j'" : pr + ' ';
      return {
        q: `Conjugue le verbe « ${verbe} » au ${nomTemps} avec « ${pr} ».`, answers: [forme], board: `${verbe} (${nomTemps}) : ${sujet}…`, strict: true,
        hints, method: `Pour conjuguer, on cherche le groupe du verbe, son radical, puis la terminaison qui va avec le sujet et le temps.`,
      };
    },
  };

  // ---------- Base de savoir (questions toutes faites) ----------
  // [question, reponse(s) acceptee(s) separees par |, indice facultatif]
  const BANKS = {
    anglais: [
      ['Comment dit-on « chat » en anglais ?', 'cat'], ['Comment dit-on « chien » en anglais ?', 'dog'], ['Comment dit-on « maison » en anglais ?', 'house|home'],
      ['Comment dit-on « rouge » en anglais ?', 'red'], ['Comment dit-on « bleu » en anglais ?', 'blue'], ['Comment dit-on « vert » en anglais ?', 'green'],
      ['Comment dit-on « pomme » en anglais ?', 'apple'], ['Comment dit-on « école » en anglais ?', 'school'], ['Comment dit-on « livre » en anglais ?', 'book'],
      ['Comment dit-on « frère » en anglais ?', 'brother'], ['Comment dit-on « sœur » en anglais ?', 'sister'], ['Comment dit-on « mercredi » en anglais ?', 'wednesday', 'Les jours anglais finissent tous par -day.'],
      ['Comment dit-on « bonjour » en anglais ?', 'hello|hi'], ['Comment dit-on « merci » en anglais ?', 'thank you|thanks'], ['Comment dit-on « eau » en anglais ?', 'water'],
      ['Comment dit-on « soleil » en anglais ?', 'sun'], ['Comment dit-on « oiseau » en anglais ?', 'bird'], ['Comment dit-on « cheval » en anglais ?', 'horse'],
      ['Traduis en anglais : « je suis ».', 'i am|i\'m', 'C\'est le verbe « to be ».'], ['Traduis en anglais : « il a ».', 'he has', 'C\'est le verbe « to have » avec he.'],
      ['Quel est le passé de « go » ?', 'went', 'C\'est un verbe irrégulier.'], ['Comment dit-on « vingt » en anglais ?', 'twenty'],
    ],
    espagnol: [
      ['Comment dit-on « chat » en espagnol ?', 'gato'], ['Comment dit-on « chien » en espagnol ?', 'perro'], ['Comment dit-on « maison » en espagnol ?', 'casa'],
      ['Comment dit-on « bonjour » en espagnol ?', 'hola|buenos dias'], ['Comment dit-on « merci » en espagnol ?', 'gracias'], ['Comment dit-on « rouge » en espagnol ?', 'rojo|roja'],
      ['Comment dit-on « eau » en espagnol ?', 'agua'], ['Comment dit-on « livre » en espagnol ?', 'libro'], ['Comment dit-on « ami » en espagnol ?', 'amigo'],
      ['Comment dit-on « soleil » en espagnol ?', 'sol'], ['Comment dit-on « trois » en espagnol ?', 'tres'], ['Comment dit-on « école » en espagnol ?', 'escuela|colegio'],
    ],
    allemand: [
      ['Comment dit-on « chat » en allemand ?', 'katze'], ['Comment dit-on « chien » en allemand ?', 'hund'], ['Comment dit-on « maison » en allemand ?', 'haus'],
      ['Comment dit-on « bonjour » en allemand ?', 'hallo|guten tag'], ['Comment dit-on « merci » en allemand ?', 'danke'], ['Comment dit-on « eau » en allemand ?', 'wasser'],
      ['Comment dit-on « livre » en allemand ?', 'buch'], ['Comment dit-on « école » en allemand ?', 'schule'], ['Comment dit-on « pomme » en allemand ?', 'apfel'],
    ],
    italien: [
      ['Comment dit-on « bonjour » en italien ?', 'ciao|buongiorno'], ['Comment dit-on « merci » en italien ?', 'grazie'], ['Comment dit-on « chat » en italien ?', 'gatto'],
      ['Comment dit-on « chien » en italien ?', 'cane'], ['Comment dit-on « maison » en italien ?', 'casa'], ['Comment dit-on « eau » en italien ?', 'acqua'],
    ],
    capitales: [
      ['Quelle est la capitale de la France ?', 'paris'], ['Quelle est la capitale de l\'Espagne ?', 'madrid'], ['Quelle est la capitale de l\'Italie ?', 'rome'],
      ['Quelle est la capitale de l\'Allemagne ?', 'berlin'], ['Quelle est la capitale du Royaume-Uni ?', 'londres'], ['Quelle est la capitale du Portugal ?', 'lisbonne'],
      ['Quelle est la capitale de la Belgique ?', 'bruxelles'], ['Quelle est la capitale du Japon ?', 'tokyo'], ['Quelle est la capitale de la Chine ?', 'pekin|beijing'],
      ['Quelle est la capitale des États-Unis ?', 'washington', 'Ce n\'est pas New York !'], ['Quelle est la capitale du Canada ?', 'ottawa', 'Ce n\'est ni Montréal ni Toronto.'],
      ['Quelle est la capitale du Brésil ?', 'brasilia', 'Ce n\'est pas Rio !'], ['Quelle est la capitale du Maroc ?', 'rabat'], ['Quelle est la capitale de l\'Égypte ?', 'le caire|caire'],
      ['Quelle est la capitale de la Russie ?', 'moscou'], ['Quelle est la capitale de la Grèce ?', 'athenes'], ['Quelle est la capitale de la Suisse ?', 'berne', 'Ce n\'est pas Genève.'],
      ['Quelle est la capitale de l\'Australie ?', 'canberra', 'Ce n\'est pas Sydney !'], ['Quel est le plus long fleuve de France ?', 'loire'],
      ['Quelle est la plus haute montagne d\'Europe de l\'Ouest ?', 'mont blanc|mont-blanc'], ['Sur quel continent se trouve le Kenya ?', 'afrique'],
      ['Quel est le plus grand océan du monde ?', 'pacifique|ocean pacifique'], ['Combien y a-t-il de continents (on compte souvent) ?', '6|5|7', 'On en compte 5, 6 ou 7 selon les pays.'],
    ],
    histoire: [
      ['En quelle année a commencé la Révolution française ?', '1789'], ['Quel roi a été guillotiné en 1793 ?', 'louis xvi|louis 16'],
      ['En quelle année Christophe Colomb est-il arrivé en Amérique ?', '1492'], ['En quelle année s\'est terminée la Seconde Guerre mondiale ?', '1945'],
      ['En quelle année a commencé la Première Guerre mondiale ?', '1914'], ['Qui a été sacré empereur des Français en 1804 ?', 'napoleon|napoleon bonaparte|napoleon ier|napoleon 1er'],
      ['Comment s\'appelle la période avant l\'invention de l\'écriture ?', 'prehistoire'], ['Quel roi était surnommé le Roi-Soleil ?', 'louis xiv|louis 14'],
      ['Qui était le chef des Gaulois face à Jules César ?', 'vercingetorix'], ['En quelle année l\'homme a-t-il marché sur la Lune pour la première fois ?', '1969'],
      ['Quelle forteresse a été prise le 14 juillet 1789 ?', 'bastille'], ['Quelle est la devise de la République française ?', 'liberte egalite fraternite|liberte, egalite, fraternite'],
      ['Qui a été sacré empereur en l\'an 800 ?', 'charlemagne'], ['Quelle jeune femme a aidé Charles VII pendant la guerre de Cent Ans ?', 'jeanne d\'arc|jeanne darc'],
    ],
    sciences: [
      ['Quel organe pompe le sang dans le corps ?', 'coeur|cœur'], ['Combien d\'os a un adulte (environ) ?', '206'], ['Quel gaz respirons-nous pour vivre ?', 'oxygene|dioxygene'],
      ['Quel gaz les plantes absorbent-elles pour faire la photosynthèse ?', 'dioxyde de carbone|co2|gaz carbonique'], ['Comment appelle-t-on un animal qui mange de la viande ?', 'carnivore'],
      ['Comment appelle-t-on un animal qui mange des plantes ?', 'herbivore'], ['À quelle température l\'eau bout-elle (en °C) ?', '100'], ['À quelle température l\'eau gèle-t-elle (en °C) ?', '0'],
      ['Quels sont les trois états de l\'eau ? Donne l\'état de la glace.', 'solide'], ['Quel organe nous permet de penser ?', 'cerveau'], ['Combien de dents a un adulte (en tout) ?', '32'],
      ['Comment s\'appelle le squelette des insectes, à l\'extérieur ?', 'exosquelette'], ['Combien de pattes a une araignée ?', '8'], ['Combien de pattes a un insecte ?', '6'],
    ],
    espace: [
      ['Quelle est la planète la plus proche du Soleil ?', 'mercure'], ['Quelle est la plus grande planète du système solaire ?', 'jupiter'],
      ['Combien y a-t-il de planètes dans le système solaire ?', '8'], ['Comment s\'appelle notre galaxie ?', 'voie lactee'], ['Quelle planète est surnommée la planète rouge ?', 'mars'],
      ['Quel est le satellite naturel de la Terre ?', 'lune'], ['Le Soleil est-il une planète ou une étoile ?', 'etoile'], ['Combien de temps met la Terre pour faire le tour du Soleil (en jours) ?', '365|365,25|365.25'],
      ['Quelle planète a de grands anneaux bien visibles ?', 'saturne'], ['Qui a été le premier humain à marcher sur la Lune ?', 'neil armstrong|armstrong'],
    ],
    animaux: [
      ['Quel est le plus grand animal du monde ?', 'baleine bleue|rorqual bleu'], ['Quel est l\'animal terrestre le plus rapide ?', 'guepard'], ['Comment s\'appelle le petit de la vache ?', 'veau'],
      ['Comment s\'appelle le petit du cheval ?', 'poulain'], ['La baleine est-elle un poisson ou un mammifère ?', 'mammifere'], ['Quel dinosaure avait trois cornes sur la tête ?', 'triceratops'],
      ['Quel grand dinosaure carnivore s\'appelle « T. rex » ?', 'tyrannosaure|tyrannosaurus|tyrannosaurus rex'], ['Combien de cœurs a une pieuvre ?', '3'],
      ['Comment s\'appelle la transformation de la chenille en papillon ?', 'metamorphose'], ['Quel oiseau ne vole pas et vit en Antarctique ?', 'manchot|manchot empereur'],
      ['Comment s\'appelle un animal qui vit la nuit ?', 'nocturne'], ['Que fabriquent les abeilles ?', 'miel'],
    ],
    grammaire: [
      ['Quelle est la nature du mot « chat » : nom, verbe ou adjectif ?', 'nom'], ['Quelle est la nature du mot « courir » : nom, verbe ou adjectif ?', 'verbe'],
      ['Quelle est la nature du mot « joli » : nom, verbe ou adjectif ?', 'adjectif'], ['Quel est le pluriel de « cheval » ?', 'chevaux'], ['Quel est le pluriel de « bijou » ?', 'bijoux', 'C\'est un des 7 mots en -ou qui prennent un x.'],
      ['Quel est le pluriel de « œil » ?', 'yeux'], ['Quel est le féminin de « acteur » ?', 'actrice'], ['Quel est le féminin de « chanteur » ?', 'chanteuse'],
      ['Dans « Le chien mange sa pâtée », quel est le sujet ?', 'chien|le chien'], ['Dans « Léa lit un livre », quel est le verbe ?', 'lit'],
      ['Quel est le contraire de « grand » ?', 'petit'], ['Quel est le synonyme de « content » : joyeux ou triste ?', 'joyeux'],
      ['Comment s\'appelle un mot qui remplace un nom (il, elle, ils...) ?', 'pronom'], ['Quel est le pluriel de « journal » ?', 'journaux'],
    ],
  };

  // Les questions toutes faites deviennent des questions avec des indices automatiques
  // Une banque est soit ici (BANKS), soit dans le savoir (public/savoir/*.js)
  function bankOf(name) {
    const ext = (root.MON_IA_SAVOIR && root.MON_IA_SAVOIR.banks) || {};
    const list = [...(BANKS[name] || []), ...(ext[name] || [])].filter((x) => Array.isArray(x) && x[0] && x[1]);
    return list;
  }
  function hasBank(name) {
    return bankOf(name).length > 0;
  }

  function fromBank(name) {
    const [q, ans, hint] = pick(bankOf(name));
    const answers = ans.split('|');
    const main = answers[0];
    const hints = [];
    if (hint) hints.push(hint);
    if (/^\d{4}$/.test(main)) {
      const y = Number(main);
      hints.push(`C'est entre ${Math.floor(y / 100) * 100} et ${Math.floor(y / 100) * 100 + 100}.`);
      hints.push(`C'est dans les années ${Math.floor(y / 10) * 10}.`);
    } else if (/^\d+$/.test(main)) {
      hints.push(`C'est un nombre ${Number(main) < 10 ? 'plus petit que 10' : `entre ${Math.floor(Number(main) / 10) * 10} et ${Math.floor(Number(main) / 10) * 10 + 10}`}.`);
    } else {
      const shown = main.replace(/^le |^la /, '');
      hints.push(`Ça commence par « ${shown[0].toUpperCase()} ».`);
      hints.push(`Le mot fait ${shown.replace(/[^a-z]/gi, '').length} lettres : ${shown[0].toUpperCase()}${shown.slice(1).replace(/[a-z]/gi, ' _')}`);
    }
    return { q, answers, hints, board: q.length > 70 ? q.slice(0, 67) + '…' : q, hint: hint || null, method: `Pour retenir, relis ta leçon et redis-la à voix haute : c'est en la redisant qu'on la garde.`, bank: true };
  }

  // ---------- Quelle IA pour quelle matiere ----------
  const g = (name) => Object.assign(() => (level) => GEN[name](level), { id: name });
  const b = (name) => Object.assign(() => () => fromBank(name), { id: name });
  const MATHS = [g('addition'), g('soustraction'), g('tables'), g('multiplication'), g('division'), g('fractionPart'), g('perimetre'), g('aire')];
  const FRACTIONS = [g('fractionPart'), g('fractionSimplify'), g('fractionAdd'), g('fractionCompare')];
  const FRANCAIS = [g('conjugaison'), b('grammaire')];
  const CULTURE = [b('capitales'), b('histoire'), b('sciences'), b('espace'), b('animaux')];
  const SUBJECT_MAP = [
    [/calcul mental/, [g('addition'), g('soustraction'), g('tables'), g('division')]],
    [/fraction/, FRACTIONS],
    [/geometrie/, [g('perimetre'), g('aire')]],
    [/algebre|maths expertes|terminale maths/, [g('equation'), g('multiplication'), g('fractionSimplify')]],
    [/math|statistique|finance|economie|ses/, [...MATHS, g('fractionSimplify'), g('equation')]],
    [/conjugaison/, [g('conjugaison')]],
    [/grammaire|orthographe|dictee|lecture|francais|llce|theatre/, FRANCAIS],
    [/anglais/, [b('anglais')]], [/espagnol/, [b('espagnol')]], [/allemand/, [b('allemand')]], [/italien/, [b('italien')]],
    [/histoire-geo|hggsp/, [b('histoire'), b('capitales')]],
    [/geographie|pays du monde|geopolitique|recettes du monde/, [b('capitales')]],
    [/histoire|revolution|guerre|moyen age|antiquite|prehistoire|emc|civique|mythologie/, [b('histoire')]],
    [/svt|biologie|corps humain|sante|nutrition|premiers secours|physique|chimie|meteo|geologie|volcan/, [b('sciences')]],
    [/astronomie|espace/, [b('espace')]],
    [/animaux|dinosaure|insecte|ocean|ecologie|jardinage/, [b('animaux')]],
  ];

  // Les equations (avec x) s'apprennent a partir de la 4eme : pas avant
  const EQUATION_GRADES = /4ème|3ème|Seconde|Première|Terminale|Université/;
  function forGrade(engines, grade) {
    if (!grade || EQUATION_GRADES.test(grade)) return engines;
    return engines.filter((e) => e.id !== 'equation');
  }

  function enginesFor(subject, grade) {
    const found = enginesForSubject(subject);
    return { engines: forGrade(found.engines, grade), known: found.known };
  }

  function enginesForSubject(subject) {
    const s = stripAccents(String(subject || '').toLowerCase());
    // Les banques du savoir (public/savoir/*.js) pour cette matiere precise
    const matieres = savoir().matieres || {};
    const label = Object.keys(matieres).find((k) => stripAccents(k.toLowerCase()) === s);
    const extra = label ? matieres[label].filter(hasBank).map((n) => b(n)) : [];
    for (const [re, engines] of SUBJECT_MAP) if (re.test(s)) return { engines: engines.concat(extra), known: true };
    if (extra.length) return { engines: extra, known: true };
    const culture = ['culture_generale', 'geo_capitales', 'animaux', 'inventions', 'espace'].filter((n) => savoir().banks && savoir().banks[n]).map((n) => b(n));
    return { engines: CULTURE.concat(culture), known: false };
  }

  // ---------- Notions de cours (pour repondre aux questions de l'eleve) ----------
  // Les notions de base sont ici ; le gros du savoir est dans public/savoir/*.js
  const NOTIONS = [
    { mots: ['multiplication', 'multiplier', 'fois', 'produit'], texte: 'Multiplier, c\'est additionner plusieurs fois le même nombre. 4 × 3, ça veut dire « 3 fois le nombre 4 » : 4 + 4 + 4.', exemple: 'Tu as 3 paquets de 4 cartes Pokémon : pour savoir combien tu as de cartes, tu fais 4 × 3, au lieu de compter 4 + 4 + 4.', astuce: 'L\'ordre ne change rien : 4 × 3 = 3 × 4. Donc si tu connais l\'un, tu connais l\'autre !', tableau: '4 × 3 = 4 + 4 + 4 = 3 × 4', quiz: ['tables', 'multiplication'] },
    { mots: ['table de', 'tables de', 'table de multiplication', 'tables'], texte: 'Une table de multiplication, c\'est la liste des résultats d\'un nombre multiplié par 1, 2, 3... jusqu\'à 10. La table de 2, c\'est compter de 2 en 2 : 2, 4, 6, 8...', exemple: 'Pour la table de 5, regarde une horloge : les minutes avancent de 5 en 5 (5, 10, 15, 20...).', astuce: 'La table de 9 : 9 × 3 = 27, et 2 + 7 = 9. Les chiffres du résultat font toujours 9 ! Et pour × 10, on ajoute juste un 0.', tableau: 'table de 2 : 2, 4, 6, 8, 10...', quiz: ['tables'] },
    { mots: ['fraction'], texte: 'Une fraction, c\'est un nombre qui représente une partie d\'un tout coupé en parts égales.', exemple: 'Une tablette de chocolat a 8 carrés et tu en manges 3 : tu as mangé 3/8 de la tablette.', astuce: 'En bas, en combien on a coupé ; en haut, combien on en prend.', tableau: 'fraction = parts prises / parts en tout', quiz: ['fractionPart', 'fractionCompare'] },
    { mots: ['numerateur'], texte: 'Le numérateur, c\'est le nombre du haut d\'une fraction : il dit combien de parts on prend.', exemple: 'Dans 3/8, le numérateur est 3 : on a pris 3 parts.', astuce: 'NUmérateur, comme NUage : il est en haut, dans le ciel !', tableau: 'numérateur = en haut', quiz: ['fractionPart'] },
    { mots: ['denominateur'], texte: 'Le dénominateur, c\'est le nombre du bas d\'une fraction : il dit en combien de parts égales on a coupé le tout.', exemple: 'Dans 3/8, le dénominateur est 8 : la tablette est coupée en 8 carrés.', astuce: 'Dénominateur, comme Dessous !', tableau: 'dénominateur = en bas', quiz: ['fractionPart'] },
    { mots: ['simplifier', 'simplification', 'simplifie'], texte: 'Simplifier une fraction, c\'est diviser le haut et le bas par le même nombre. La fraction garde la même valeur, elle est juste écrite plus simplement.', exemple: '6/8 de tablette, c\'est pareil que 3/4 : on a divisé par 2 en haut et en bas.', astuce: 'Essaie d\'abord de diviser par 2, puis par 3, puis par 5...', tableau: '6/8 = 3/4 (÷2 en haut et en bas)', quiz: ['fractionSimplify'] },
    { mots: ['perimetre'], texte: 'Le périmètre, c\'est la longueur du tour d\'une figure.', exemple: 'Si tu fais le tour d\'un terrain de foot en marchant sur la ligne blanche, la distance que tu parcours, c\'est son périmètre.', astuce: 'PÉRImètre comme PÉRIphérique : la route qui fait le tour de la ville.', tableau: 'P rectangle = (L + l) × 2', quiz: ['perimetre'] },
    { mots: ['aire', 'surface', 'superficie'], texte: 'L\'aire, c\'est la place qu\'il y a à l\'intérieur d\'une figure.', exemple: 'Le nombre de carreaux qu\'il faut pour couvrir le sol de ta chambre, c\'est son aire.', astuce: 'Rectangle : longueur × largeur. L\'aire se mesure en cm², m²...', tableau: 'A rectangle = L × l', quiz: ['aire'] },
    { mots: ['division', 'diviser', 'divise', 'partager', 'partage', 'quotient'], texte: 'Diviser, c\'est partager en parts égales. C\'est l\'inverse de la multiplication.', exemple: '12 bonbons partagés entre 3 amis : 12 ÷ 3. Chacun en reçoit autant, et il n\'en reste pas.', astuce: 'Pour 12 ÷ 3, cherche dans la table de 3 : 3 × ? = 12.', tableau: '12 ÷ 3 → 3 × ? = 12', quiz: ['division'] },
    { mots: ['addition', 'additionner', 'additionne', 'retenue', 'plus'], texte: 'Additionner, c\'est mettre ensemble. Quand les unités dépassent 9, on fait une retenue : 10 unités font 1 dizaine.', exemple: 'Tu as 27 € d\'argent de poche et on t\'en donne 15 : 27 + 15. 7 + 5 = 12, j\'écris 2 et je retiens 1 dizaine.', astuce: 'Pour calculer de tête, passe par la dizaine : 27 + 15 = 27 + 3 + 12.', tableau: '10 unités = 1 dizaine (retenue)', quiz: ['addition'] },
    { mots: ['soustraction', 'soustraire', 'soustrait', 'moins'], texte: 'Soustraire, c\'est enlever, ou chercher l\'écart entre deux nombres.', exemple: 'Tu as 50 € et tu achètes un jeu à 35 € : 50 − 35, c\'est ce qu\'il te reste.', astuce: 'Vérifie toujours avec une addition : résultat + ce qu\'on a enlevé = le nombre de départ.', tableau: '50 − 35 = ?  ⟺  35 + ? = 50', quiz: ['soustraction'] },
    { mots: ['equation', 'inconnue'], texte: 'Une équation, c\'est une égalité avec un nombre caché, souvent appelé x. Pour le trouver, on fait l\'opération inverse des deux côtés.', exemple: 'x + 3 = 10 : quel nombre plus 3 fait 10 ? On fait 10 − 3 des deux côtés.', astuce: 'Une équation, c\'est comme une balance : ce que tu fais d\'un côté, tu le fais de l\'autre.', tableau: 'x + 3 = 10 → x = 10 − 3', quiz: ['equation'] },
    { mots: ['verbe'], texte: 'Le verbe, c\'est le mot qui dit l\'action (courir, manger) ou l\'état (être, sembler). C\'est le mot qui change quand on change le temps.', exemple: 'Je mange, je mangeais, je mangerai : le mot qui change, c\'est le verbe « manger ».', astuce: 'Mets « hier » ou « demain » devant la phrase : le mot qui change, c\'est le verbe !', tableau: 'verbe = action ou état', quiz: ['conjugaison'] },
    { mots: ['conjugaison', 'conjuguer', 'conjugue', 'terminaison'], texte: 'Conjuguer, c\'est changer la fin du verbe selon le sujet et le temps.', exemple: 'Verbes en -er au présent : je chante, tu chantes, il chante, nous chantons, vous chantez, ils chantent.', astuce: 'Trouve d\'abord le groupe du verbe (-er = 1er groupe), puis le radical, puis la terminaison.', tableau: '-e -es -e -ons -ez -ent', quiz: ['conjugaison'] },
    { mots: ['present'], texte: 'Le présent, c\'est le temps de ce qui se passe maintenant.', exemple: 'En ce moment, je joue au foot : « je joue » est au présent.', astuce: 'Verbes en -er : -e, -es, -e, -ons, -ez, -ent.', tableau: 'présent : -e -es -e -ons -ez -ent', quiz: ['conjugaison'] },
    { mots: ['futur'], texte: 'Le futur, c\'est le temps de ce qui va se passer plus tard.', exemple: 'Demain, je jouerai aux cartes Pokémon : « je jouerai » est au futur.', astuce: 'Souvent, on garde l\'infinitif et on ajoute -ai, -as, -a, -ons, -ez, -ont (comme le verbe avoir !).', tableau: 'futur : -ai -as -a -ons -ez -ont', quiz: ['conjugaison'] },
    { mots: ['imparfait'], texte: 'L\'imparfait, c\'est un temps du passé pour raconter ce qui durait ou se répétait.', exemple: 'Quand j\'étais petit, je regardais des dessins animés tous les jours.', astuce: 'Terminaisons : -ais, -ais, -ait, -ions, -iez, -aient, pour tous les verbes !', tableau: 'imparfait : -ais -ais -ait -ions -iez -aient', quiz: ['conjugaison'] },
    { mots: ['sujet'], texte: 'Le sujet, c\'est qui fait l\'action du verbe.', exemple: 'Dans « Le chien mange sa pâtée », qui est-ce qui mange ? Le chien : c\'est le sujet.', astuce: 'Pose la question « Qui est-ce qui ? » devant le verbe. Tu peux aussi l\'encadrer avec « c\'est... qui ».', tableau: 'sujet : Qui est-ce qui + verbe ?', quiz: ['grammaire'] },
    { mots: ['nom commun', 'nom propre', 'nom', 'noms'], texte: 'Un nom désigne une personne, un animal, une chose ou une idée. Un nom propre (Léa, Paris) prend une majuscule.', exemple: 'Chien, table, joie, Léa : ce sont des noms.', astuce: 'Si tu peux mettre « le » ou « un » devant, c\'est un nom.', tableau: 'nom : on peut dire « un … »', quiz: ['grammaire'] },
    { mots: ['adjectif'], texte: 'Un adjectif dit comment est le nom. Il s\'accorde avec le nom.', exemple: 'Un chien noir, une grande maison, des cartes rares.', astuce: 'Pose la question « Comment est-il ? » : la réponse est l\'adjectif.', tableau: 'adjectif = décrit le nom', quiz: ['grammaire'] },
    { mots: ['pronom'], texte: 'Un pronom remplace un nom pour ne pas le répéter.', exemple: '« Léa joue. Elle rit. » Ici, « elle » remplace Léa.', astuce: 'Les pronoms personnels : je, tu, il, elle, on, nous, vous, ils, elles.', tableau: 'pronom : il, elle, ils...', quiz: ['grammaire'] },
    { mots: ['pluriel'], texte: 'Au pluriel, on ajoute souvent un s. Mais les mots en -al font souvent -aux, et 7 mots en -ou prennent un x.', exemple: 'Un cheval, des chevaux. Un hibou, des hiboux.', astuce: 'Les 7 mots en -oux : bijou, caillou, chou, genou, hibou, joujou, pou.', tableau: 'cheval → chevaux', quiz: ['grammaire'] },
    { mots: ['photosynthese'], texte: 'La photosynthèse, c\'est la façon dont les plantes fabriquent leur nourriture avec la lumière du soleil, de l\'eau et du dioxyde de carbone. Elles rejettent de l\'oxygène.', exemple: 'C\'est pour ça qu\'une plante dans un placard sans lumière finit par mourir.', astuce: 'PHOTO = lumière, SYNTHÈSE = fabriquer : fabriquer avec la lumière.', tableau: 'lumière + eau + CO2 → sucre + O2', quiz: ['sciences'] },
    { mots: ['planete', 'systeme solaire'], texte: 'Il y a 8 planètes qui tournent autour du Soleil : Mercure, Vénus, la Terre, Mars, Jupiter, Saturne, Uranus et Neptune.', exemple: 'La Terre met 365 jours pour faire le tour du Soleil : c\'est une année.', astuce: 'Phrase pour retenir : « Me Voici Toute Mouillée, J\'ai Suivi Un Nuage. »', tableau: 'Me Vé Te Ma Ju Sa Ur Ne', quiz: ['espace'] },
    { mots: ['mammifere'], texte: 'Un mammifère, c\'est un animal dont les petits boivent le lait de leur mère.', exemple: 'L\'humain, le chien et même la baleine sont des mammifères.', astuce: 'MAMMifère, comme MAMan qui donne son lait.', tableau: 'mammifère = petits nourris au lait', quiz: ['animaux'] },
    { mots: ['capitale'], texte: 'La capitale d\'un pays, c\'est la ville où se trouve le gouvernement. Ce n\'est pas toujours la plus grande ville !', exemple: 'La capitale de l\'Australie est Canberra, pas Sydney.', astuce: 'Apprends-les par continent, quelques-unes à la fois.', tableau: 'capitale = ville du gouvernement', quiz: ['capitales'] },
  ];

  // Tout le savoir : celui d'ici + celui des fichiers public/savoir/*.js
  function savoir() {
    return root.MON_IA_SAVOIR || { notions: [], banks: {}, matieres: {} };
  }
  // Quand Claude a ameliore une notion, la version amelioree remplace l'ancienne (la plus recente gagne)
  function notionKey(n) { return stripAccents(String((n.mots || [])[0] || '').toLowerCase()).trim(); }
  function allNotions() {
    const learned = savoir().notions || [];
    const lastImproved = new Map();
    learned.forEach((n, i) => { if (n.remplace) lastImproved.set(n.remplace, i); });
    if (!lastImproved.size) return NOTIONS.concat(learned);
    const base = NOTIONS.filter((n) => !lastImproved.has(notionKey(n)));
    const kept = learned.filter((n, i) => (n.remplace ? lastImproved.get(n.remplace) === i : !lastImproved.has(notionKey(n))));
    return base.concat(kept);
  }

  // ---------- Comprendre comment ecrit un enfant ----------
  // "comen sa marche les foi" -> "comment ca marche les fois"
  const KID_WORDS = [
    [/\bsa\b/g, 'ca'], [/\bcoi\b|\bkoi\b|\bquoa\b/g, 'quoi'], [/\bc\s+(quoi|koi)\b/g, "c'est quoi"], [/\bcest\b|\bces quoi\b/g, (m) => (m === 'cest' ? "c'est" : "c'est quoi")],
    [/\bkes(k|ke|ce)\b|\bqu'?est ce\b/g, "qu'est-ce"], [/\b(comen|commen|koman|komen|comant|comman)\b/g, 'comment'], [/\b(pk|pq|pourkoi|pourquoa)\b/g, 'pourquoi'],
    [/\bfoi\b/g, 'fois'], [/\bkan\b/g, 'quand'], [/\bkel(le)?s?\b/g, 'quel'], [/\bki\b/g, 'qui'], [/\bmarch\b/g, 'marche'], [/\bjsp\b|\bchais pas\b|\bje c pas\b|\bje sai pas\b/g, 'je sais pas'],
    [/\bexpli(k|qu)e?\b/g, 'explique'], [/\bstp\b|\bsvp\b/g, ''], [/[×*]/g, ' fois '], [/÷/g, ' divise par '],
    // Questions en anglais : "how do you say dog in english" -> "comment dit-on dog en anglais"
    [/\bhow (do you|to) say (.+?) in (english|spanish|german)\b/g, (m, a, w, l) => `comment dit-on ${w} en ${{ english: 'anglais', spanish: 'espagnol', german: 'allemand' }[l]}`],
    [/\bcomment on dit\b|\bcomment dit on\b/g, 'comment dit-on'],
    // "2eme guerre" -> "seconde guerre", "louis 16" -> "louis xvi"
    [/\b(2eme|2e|2nd|2nde|deuxieme)\b/g, 'seconde'], [/\b1ere\b/g, 'premiere'],
    [/\b(louis|henri|charles|francois|philippe) (\d{1,2})\b/g, (m, nom, n) => `${nom} ${ROMAN[Number(n)] || n}`],
  ];
  const ROMAN = ['', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii', 'xiii', 'xiv', 'xv', 'xvi', 'xvii', 'xviii', 'xix', 'xx'];
  function kidFix(text) {
    let s = stripAccents(String(text).toLowerCase()).replace(/[’`]/g, "'");
    for (const [re, to] of KID_WORDS) s = s.replace(re, to);
    return s.replace(/\s+/g, ' ').trim();
  }

  // Mots qui ne disent rien du sujet de la question
  const STOP = new Set(['comment', 'ca', 'marche', 'quoi', "c'est", 'est', 'les', 'le', 'la', 'un', 'une', 'des', 'de', 'du', 'que', 'qui', 'quel', 'pourquoi', 'explique', 'moi', 'je', 'tu', 'il', 'on', 'et', 'en', 'a', 'pas', 'comprends', 'sais', 'veut', 'dire', 'faire', 'fait', 'fonctionne', 'sert', 'quoi', 'mais', 'ok', 'bon', 'alors', 'aide', 'stp']);

  // Trouve la notion dont parle l'eleve, meme avec des fautes ("multiplicasion", "fraxion")
  // Mots-cles trop courants pour decider tout seuls de quoi parle l'eleve
  const WEAK_MOTS = new Set(['plus', 'moins', 'mot', 'mots', 'temps', 'langue', 'degre', 'degres', 'decouvert', 'jouer', 'piece', 'note', 'notes', 'nombre', 'nombres', 'ligne', 'point', 'points', 'face', 'droit', 'cercle', 'carte', 'scene', 'vie', 'eau', 'air', 'terre', 'lettre', 'lettres', 'son', 'sons']);

  // ---------- Les mots que Mon IA connait (pour comprendre "leau" = "l'eau", "dohm" = "d'ohm") ----------
  let vocab = null, vocabSize = -1;
  function getVocab() {
    const all = allNotions();
    if (vocab && vocabSize === all.length) return vocab;
    vocab = new Set();
    const add = (t) => { for (const w of stripAccents(String(t || '').toLowerCase()).split(/[^a-z0-9]+/)) if (w) vocab.add(w); };
    for (const n of all) { (n.mots || []).forEach(add); add(n.texte); add(n.exemple); }
    const ext = (root.MON_IA_SAVOIR && root.MON_IA_SAVOIR.banks) || {};
    for (const src of [BANKS, ext]) for (const list of Object.values(src)) for (const it of list || []) if (Array.isArray(it)) { add(it[0]); add(it[1]); }
    vocabSize = all.length;
    return vocab;
  }
  // Un enfant oublie souvent l'apostrophe : "leau", "lannee", "jarrive", "dohm" -> "l'eau", "l'annee"...
  function unglue(s) {
    const v = getVocab();
    return s.replace(/\b(l|d|j|n|s|qu)([aeiouyh][a-z0-9]{1,})\b/g, (m, p, rest) => (!v.has(m) && v.has(rest) ? `${p}'${rest}` : m));
  }

  // Combien de notions utilisent chaque mot-cle : un mot partout ("programmation") compte moins qu'un mot rare ("boucle")
  let motDF = null, motDFSize = -1;
  function motWeight(w) {
    const all = allNotions();
    if (!motDF || motDFSize !== all.length) {
      motDF = new Map();
      for (const n of all) {
        const seen = new Set();
        for (const m of n.mots || []) for (const x of stripAccents(String(m).toLowerCase()).split(/\s+/)) if (x && !seen.has(x)) { seen.add(x); motDF.set(x, (motDF.get(x) || 0) + 1); }
      }
      motDFSize = all.length;
    }
    return 1 / Math.sqrt(Math.max(1, motDF.get(w) || 1));
  }

  function findNotion(text) {
    // "la difference entre ou et où" : on cherche la notion qui parle des DEUX mots, pas de "difference"
    // (on enleve aussi les petits mots colles : "l'aire d'un cercle" -> "aire un cercle")
    const elide = (x) => x.replace(/\b(l|d|j|qu|n|s|t|m|c)['’]/g, '');
    const s = elide(unglue(kidFix(text)).replace(/\b(quelle est |c'est quoi )?(la )?difference( entre)?\b/g, ' ')).replace(/\s+/g, ' ').trim();
    const words = s.split(/[^a-z0-9-]+/).filter((w) => w && !STOP.has(w));
    // Le premier vrai mot de la question est souvent le sujet ("c'est quoi une VARIABLE en programmation")
    const focus = words[0];
    let best = null;
    for (const n of allNotions()) {
      // Chaque mot de l'eleve qui correspond a un mot-cle rapporte des points : la notion qui
      // correspond au plus de mots gagne ("variable en programmation" -> la variable, pas la programmation)
      const gained = new Map(); // mot de l'eleve -> points
      let strong = false;
      for (const rawMot of n.mots || []) {
        const mot = elide(stripAccents(String(rawMot).toLowerCase())).replace(/\s+/g, ' ').trim();
        if (!mot) continue;
        if (mot.includes(' ')) {
          if ((' ' + s + ' ').includes(' ' + mot + ' ')) {
            // Une expression entiere ("present perfect") : chacun de ses mots rapporte des points, sans les compter deux fois
            const covered = mot.split(' ').filter((cw) => cw && !STOP.has(cw));
            for (const cw of covered) gained.set(cw, Math.max(gained.get(cw) || 0, cw.length + 2 + 3 / covered.length));
            strong = true;
          }
          continue;
        }
        for (const w of words) {
          let pts = 0;
          if (w === mot) pts = mot.length + 2;
          else if (w.startsWith(mot) && mot.length >= 4 && w.length <= mot.length + 3) pts = mot.length + 1;
          // Petite faute de frappe ("multiplicasion", "fraxion") : meme debut de mot, une ou deux lettres de difference
          else if (mot.length >= 6 && w.slice(0, 2) === mot.slice(0, 2) && Math.abs(w.length - mot.length) <= 2) {
            const d = levenshtein(w, mot);
            if (d <= (mot.length >= 8 ? 2 : 1)) { pts = mot.length - 2 * d; if (!WEAK_MOTS.has(mot)) strong = true; }
          }
          if (pts > 0) {
            if (WEAK_MOTS.has(mot)) pts = Math.min(pts, 3);
            else if (pts >= mot.length) strong = true;
            if (pts > (gained.get(w) || 0)) gained.set(w, pts);
          }
        }
      }
      if (!gained.size) continue;
      let score = 0;
      for (const [w, v] of gained) score += (w === focus ? v * 1.6 : v) * (0.5 + 0.5 * motWeight(w));
      // En cas d'egalite, la notion dont c'est le SUJET PRINCIPAL (son premier mot-cle) gagne
      const main = elide(stripAccents(String((n.mots || [])[0] || '').toLowerCase()));
      if (focus && main.split(' ').includes(focus)) score += 2;
      // Un mot-cle faible tout seul ne suffit pas ("lire plus vite" n'est pas une addition)
      if (!strong) continue;
      // Les notions de secours ("aide-moi", "je comprends rien") ne passent jamais devant une vraie lecon
      const finalScore = n.secours ? Math.min(score, 4) : score;
      if (!best || finalScore > best.score) best = { notion: n, score: finalScore };
    }
    return best && best.notion;
  }

  // Termine une phrase par un point si elle n'a pas de ponctuation
  function dot(s) {
    s = String(s || '').trim();
    return /[.!?…»)]$/.test(s) ? s : s + '.';
  }
  // Met une minuscule apres « : » seulement pour les mots ordinaires (pas pour un nom comme Darwin)
  const COMMON_START = /^(Tu|Toi|Le|La|Les|L['’]|Un|Une|Des|Si|Quand|Dans|Pour|Avec|On|Il|Elle|Ils|C['’]est|Ce|Cette|Ces|En|Au|Aux|À|Mets|Pense|Retiens|Regarde|Imagine|Essaie|Pose|Souviens|Chaque|Une|Deux|Trois|Pas|Plus|Moins|Si)\b/;
  const lowerFirst = (s) => (COMMON_START.test(s) ? s[0].toLowerCase() + s.slice(1) : s);

  function explain(n) {
    const parts = [dot(n.texte)];
    if (n.exemple) parts.push(/^par exemple/i.test(n.exemple) ? dot(n.exemple) : `Par exemple : ${dot(lowerFirst(n.exemple))}`);
    if (n.astuce) parts.push(/^astuce/i.test(n.astuce) ? dot(n.astuce) : `Astuce : ${dot(lowerFirst(n.astuce))}`);
    return parts.join(' ');
  }

  // ---------- "Combien font 7 fois 8 ?" : on aide a trouver, sans donner la reponse ----------
  const OPS = [
    [/^(fois|x|multiplie par)$/, 'fois'], [/^(plus|\+)$/, 'plus'], [/^(moins|-|−)$/, 'moins'], [/^(divise par|diviser par|divise|\/|sur)$/, 'divise'],
  ];
  function parseCalc(text) {
    const s = kidFix(text).replace(/(\d)\s*x\s*(\d)/g, '$1 fois $2').replace(/(\d)\s*([+\-−/])\s*(\d)/g, '$1 $2 $3');
    const m = s.match(/(\d+)\s+(fois|x|multiplie par|plus|\+|moins|-|−|divise par|diviser par|\/)\s+(\d+)/);
    if (!m) return null;
    const a = Number(m[1]), b = Number(m[3]);
    const op = OPS.find(([re]) => re.test(m[2]))[1];
    if (a > 100000 || b > 100000) return null;
    if (op === 'fois') {
      return { q: `Combien font ${a} × ${b} ?`, answers: [String(a * b)], board: `${a} × ${b} = ?`,
        hints: [`${a} × ${b}, c'est ${b} fois le nombre ${a} : ${Array(Math.min(b, 4)).fill(a).join(' + ')}${b > 4 ? ' + ...' : ''}`, b > 1 && a <= 12 && b <= 12 ? `Tu connais peut-être ${a} × ${b - 1} = ${a * (b - 1)} ? Il te reste à ajouter ${a}.` : `Découpe le plus grand nombre en dizaines et unités, multiplie chaque morceau, puis additionne.`, `Récite la table de ${Math.min(a, b)}.`],
        method: 'Multiplier, c\'est additionner plusieurs fois le même nombre.' };
    }
    if (op === 'plus') {
      return { q: `Combien font ${a} + ${b} ?`, answers: [String(a + b)], board: `${a} + ${b} = ?`,
        hints: [`Commence par les unités : ${a % 10} + ${b % 10}.`, `Puis les dizaines, sans oublier la retenue si les unités dépassent 9.`],
        method: 'On ajoute les unités avec les unités, les dizaines avec les dizaines.' };
    }
    if (op === 'moins') {
      return { q: `Combien font ${a} − ${b} ?`, answers: [String(a - b)], board: `${a} − ${b} = ?`,
        hints: a >= b ? [`Compte de ${b} jusqu'à ${a} : combien de pas fais-tu ?`, `Vérifie avec une addition : ton résultat + ${b} doit faire ${a}.`] : [`${b} est plus grand que ${a} : le résultat sera un nombre négatif (en dessous de zéro).`, `Calcule d'abord ${b} − ${a}, puis mets un signe − devant.`],
        method: 'Une soustraction, c\'est l\'écart entre deux nombres.' };
    }
    if (b === 0) return { q: `Combien font ${a} ÷ 0 ?`, answers: ['impossible'], board: `${a} ÷ 0 = ?`, hints: ['Essaie de partager des bonbons entre 0 ami... c\'est possible ?'], method: 'On ne peut jamais diviser par zéro.' };
    const exact = a % b === 0;
    return { q: `Combien font ${a} ÷ ${b} ?`, answers: exact ? [String(a / b)] : [String(Math.round((a / b) * 100) / 100), `${Math.floor(a / b)} reste ${a % b}`], board: `${a} ÷ ${b} = ?`,
      hints: [`Cherche le nombre qui, multiplié par ${b}, donne ${a}${exact ? '' : ' (ou s\'en approche le plus)'}.`, `Récite la table de ${b}.`],
      method: 'Diviser, c\'est partager en parts égales : on cherche dans la table de multiplication.' };
  }

  // ---------- Moteur de recherche (comme un mini Google dans son savoir) ----------
  // Chaque mot recoit un poids : un mot rare ("japon") compte beaucoup, un mot courant ("pays") peu.
  const SEARCH_STOP = new Set([...STOP, 'quel', 'quelle', 'quels', 'quelles', 'sont', 'dans', 'pour', 'avec', 'par', 'sur', 'qui', 'que', 'quoi', 'comment', 'combien', 'quand', 'pourquoi', 'dit', 'dit-on', 'appelle', 'appelle-t-on', 'etait', 'ete', 'plus', 'cette', 'ces', 'son', 'sa', 'ses', 'leur', 'aux', 'elle', 'ils', 'nous', 'vous', 'avoir', 'etre', 'peut', 'on', 'se', 'ce', 'cela', 'ont', 'avait', 'tres', 'bien', 'aussi', 'entre', 'difference', 'how', 'you', 'say', 'what', 'the', 'stp', 'svp', 'moi', 'toi', 'dis', 'donne', 'veux', 'savoir', 'sais', 'connais', 'premier', 'premiere']);
  function stem(w) {
    if (w.length > 4 && /[sx]$/.test(w)) w = w.slice(0, -1);
    if (w.length > 5 && /e$/.test(w)) w = w.slice(0, -1);
    return w;
  }
  // Mots courts mais importants ("os", "pi", "ph"...)
  const SHORT_WORDS = new Set(['os', 'pi', 'ph', 'yen', 'adn', 'onu', 'pib', 'ue', 'co2', 'h2o', 'cod', 'coi', 'cm', 'km', 'kg', 'jo']);
  function tokens(text) {
    const s = unglue(kidFix(text))
      // "la plus grande planete" : "plus grand" est un seul mot important (sinon "grande planete" = Saturne et ses grands anneaux !)
      .replace(/\bplus (grand|petit|long|haut|rapide|chaud|froid|lourd|vieux|proche|loin|profond|peuple)(e|s|es)?\b/g, 'plus$1');
    return [...new Set(s.replace(/[«»"()?!.,;:]/g, ' ').split(/[\s'’-]+/).filter((w) => (w.length >= 3 || SHORT_WORDS.has(w)) && !SEARCH_STOP.has(w)).map(stem))];
  }

  let factIndex = null;
  function buildFactIndex() {
    const ext = (root.MON_IA_SAVOIR && root.MON_IA_SAVOIR.banks) || {};
    const docs = [];
    for (const src of [BANKS, ext]) {
      for (const [bank, list] of Object.entries(src)) {
        for (const item of list || []) {
          if (!Array.isArray(item) || !item[0] || !item[1]) continue;
          docs.push({ q: item[0], answer: String(item[1]).split('|')[0], hint: item[2] || null, bank, toks: tokens(item[0]) });
        }
      }
    }
    const df = new Map();
    for (const d of docs) for (const t of d.toks) df.set(t, (df.get(t) || 0) + 1);
    const idf = (t) => Math.log(1 + docs.length / (df.get(t) || 0.5));
    factIndex = { docs, idf };
    return factIndex;
  }

  // Trouve la question de la base la plus proche ; score = part des mots importants en commun
  function findFact(text) {
    const idx = factIndex || buildFactIndex();
    const qt = tokens(text);
    if (!qt.length) return null;
    const qWeight = qt.reduce((s, t) => s + idx.idf(t), 0);
    // Le genre de reponse attendu : "quand / combien" -> un nombre ; "qui / ou / comment dit-on" -> des mots
    const low = kidFix(text);
    const wantNumber = /^(quand|en quelle annee|en quel siecle|a quelle date|combien|a quel age|quelle annee)/.test(low);
    const wantWords = /^(qui|ou |dans quel|quel pays|quelle ville|quelle langue|comment (on dit|dit-on|dit on|se dit|s'appelle))/.test(low);
    // Le "qui" de l'eleve doit correspondre a un "qui" dans la question de la base (pas un "ou")
    const askWho = /^qui\b/.test(low), askWhere = /^(ou |dans quel)/.test(low);
    let best = null;
    for (const d of idx.docs) {
      const isNum = /^\d/.test(String(d.answer).trim());
      if ((wantNumber && !isNum) || (wantWords && isNum)) continue;
      const dq = stripAccents(d.q.toLowerCase());
      if (askWho && !/\bqui\b/.test(dq)) continue;
      if (askWhere && !/\b(ou|quel pays|quelle ville|quel continent|dans quel)\b/.test(dq)) continue;
      let shared = 0, n = 0;
      for (const t of qt) if (d.toks.includes(t)) { shared += idx.idf(t); n++; }
      if (!n) continue;
      const dWeight = d.toks.reduce((s, t) => s + idx.idf(t), 0) || 1;
      // Il faut que la question de l'eleve ET celle de la base soient bien couvertes
      const qCov = Math.min(shared / qWeight, 1), dCov = Math.min(shared / dWeight, 1);
      // Tous les mots importants de l'eleve doivent y etre ("monnaie du royaume-uni" n'est pas "capitale du royaume-uni")
      if (qCov < 0.78 || dCov < 0.4) continue;
      const score = qCov * 0.6 + dCov * 0.4;
      if (!best || score > best.score) best = { ...d, score, n };
    }
    // Assez sur de lui seulement : sinon il vaut mieux dire "je ne sais pas" que dire une betise
    if (!best || best.score < 0.62) return null;
    if (best.n < 2 && qt.length > 1 && best.score < 0.8) return null;
    return best;
  }

  // Cherche une notion avec les mots de son explication (quand aucun mot-cle ne correspond)
  let notionIndex = null;
  function findNotionByText(text) {
    if (!notionIndex) {
      const all = allNotions();
      const docs = all.map((n) => ({ n, toks: tokens(`${(n.mots || []).join(' ')} ${n.texte || ''}`) }));
      const df = new Map();
      for (const d of docs) for (const t of d.toks) df.set(t, (df.get(t) || 0) + 1);
      notionIndex = { docs, idf: (t) => Math.log(1 + docs.length / (df.get(t) || 0.5)) };
    }
    const qt = tokens(text);
    if (!qt.length) return null;
    const qWeight = qt.reduce((s, t) => s + notionIndex.idf(t), 0);
    let best = null;
    for (const d of notionIndex.docs) {
      let shared = 0, n = 0;
      for (const t of qt) if (d.toks.includes(t)) { shared += notionIndex.idf(t); n++; }
      const score = shared / qWeight;
      if (n && (!best || score > best.score)) best = { n: d.n, score, count: n };
    }
    return best && best.score >= 0.6 && (best.count >= 2 || qt.length === 1) ? best.n : null;
  }

  // ---------- Conseils de prof (methode, motivation) ----------
  NOTIONS.push(
    { mots: ['reviser', 'revision', 'revise', 'apprendre ma lecon', 'apprendre une lecon', 'apprendre mes lecons', 'retenir', 'memoriser', 'par coeur'], titre: 'Bien réviser', texte: 'Pour bien réviser, relis ta leçon, puis cache-la et essaie de la redire avec tes mots. Ce que tu arrives à redire, tu le sais vraiment.', exemple: 'fais-toi une petite fiche avec l\'essentiel, et demande à quelqu\'un de t\'interroger, ou à moi !', astuce: 'Révise un peu chaque jour plutôt que tout la veille : ton cerveau range les souvenirs pendant que tu dors.', tableau: 'Relire → cacher → redire', quiz: [] },
    { secours: true, mots: ['controle', 'evaluation demain', 'examen', 'brevet', 'bac', 'stresse', 'stress', 'peur du controle'], titre: 'Préparer un contrôle', texte: 'Avant un contrôle, revois les exemples faits en classe et entraîne-toi sur des exercices. Le stress, c\'est normal : c\'est ton corps qui se prépare.', exemple: 'la veille, dis-moi « interroge-moi » : je te pose des questions sur ta matière, comme un vrai contrôle.', astuce: 'Pendant le contrôle, commence par les questions que tu sais faire, et respire doucement si tu stresses.', tableau: 'S\'entraîner + bien dormir', quiz: [] },
    { secours: true, mots: ['je suis nul', 'suis nulle', 'je comprends rien', 'je comprend rien', 'j\'y arrive pas', 'trop dur', 'trop difficile', 'nul en', 'je deteste', 'j\'aime pas', 'decourage', 'abandonner'], titre: 'Tu n\'es pas nul !', texte: 'Tu n\'es pas nul : tu n\'as juste pas encore compris, et ça, ça s\'apprend ! Même les grands champions ont commencé par rater.', exemple: 'on va reprendre une toute petite étape facile, puis avancer petit à petit. Dis-moi ce qui te bloque, ou dis « interroge-moi » et je commence par du facile.', astuce: 'Le cerveau est comme un muscle : plus tu t\'entraînes, plus il devient fort.', tableau: 'Pas encore ≠ jamais', quiz: [] },
    { mots: ['concentrer', 'concentration', 'distrait', 'telephone', 'ecran'], titre: 'Se concentrer', texte: 'Pour te concentrer, travaille dans un endroit calme, sans écran à côté, par petites séances.', exemple: '20 minutes de travail, puis 5 minutes de pause : c\'est la méthode Pomodoro.', astuce: 'Range ton téléphone dans une autre pièce pendant tes devoirs.', tableau: '20 min travail + 5 min pause', quiz: [] },
    { mots: ['devoirs', 'organiser', 'organisation', 'agenda', 'emploi du temps'], titre: 'S\'organiser', texte: 'Pour t\'organiser, regarde ton agenda chaque soir et commence par le travail le plus urgent ou le plus difficile.', exemple: 'si tu as un contrôle vendredi, révise un petit peu lundi, mardi et jeudi.', astuce: 'Prépare ton cartable le soir : le matin, tu seras plus tranquille.', tableau: 'Agenda chaque soir', quiz: [] },
    { mots: ['dictee', 'orthographe', 'faute', 'fautes'], titre: 'Réussir sa dictée', texte: 'Pour la dictée, écoute toute la phrase avant d\'écrire, puis relis-toi en vérifiant les accords : qui fait l\'action, et est-ce singulier ou pluriel ?', exemple: '« Les chats mangent » : le sujet « les chats » est au pluriel, donc le verbe prend -ent.', astuce: 'Relis ta dictée trois fois : une pour les verbes, une pour les pluriels, une pour les accents.', tableau: 'Relire : verbes, pluriels, accents', quiz: ['grammaire', 'conjugaison'] },
  );

  // ---------- Phrases du prof (variees pour ne pas radoter) ----------
  const BRAVO = ['Bravo, tu as bien cherché !', 'Exact ! Ta méthode est la bonne.', 'Oui, c\'est juste ! Tu as bien réfléchi.', 'Parfait, tu as trouvé tout seul !', 'Très bien, c\'est ça !'];
  const NON = ['Pas tout à fait, mais on va trouver ensemble.', 'Ce n\'est pas encore ça, ce n\'est pas grave : c\'est comme ça qu\'on apprend.', 'Hmm, non. Réfléchissons ensemble.', 'Pas encore. Une erreur, c\'est normal !'];
  const ENCHAINE = ['Question suivante :', 'On continue :', 'À la suivante :', 'Et maintenant :'];

  // ---------- Etat ----------
  function newState() {
    return { subject: null, current: null, tries: 0, asked: 0, good: 0, streak: 0, misses: 0, bonus: 0, last: null, offer: null, engines: null, greeted: false };
  }

  // Avant de reexpliquer, on demande a l'eleve ce qui le bloque (comme un vrai prof)
  function askWhatBlocks(state, notion) {
    state.waitingDetail = notion;
    const sujet = notion.titre || (notion.mots && notion.mots[0]) || 'ça';
    return {
      reponse: `D'accord, on va y arriver ! Dis-moi ce que tu n'arrives pas à faire exactement avec « ${sujet} ». Par exemple : un mot que tu ne comprends pas, une étape, ou un exercice précis que tu dois faire.`,
      tableau: 'Qu\'est-ce qui te bloque ?',
    };
  }

  // Une autre explication, qui part de ce que l'eleve a dit, demandee au prof Claude
  function explainAgain(n, detail) {
    const sujet = n.titre || (n.mots && n.mots[0]) || 'cette notion';
    return {
      reponse: "Merci, je comprends mieux ! Je t'explique autrement, une petite seconde...",
      tableau: null,
      askClaude: `Je travaille sur « ${sujet} » et je n'ai pas compris cette explication : ${n.texte || ''} Voici ce qui me bloque : « ${String(detail || '').slice(0, 200)} ». Explique-moi autrement, plus simplement, en partant de ce qui me bloque, avec un exemple de la vie de tous les jours.`,
      again: true,
    };
  }

  function levelFor(state, ctx) {
    let base = 1;
    if (ctx.brain && ctx.MiniIA) {
      const lvl = ctx.MiniIA.chooseLevel(ctx.brain, ctx.subject);
      base = { facile: 0, normal: 1, difficile: 2 }[lvl] ?? 1;
    }
    if (ctx.grade && /CP|CE1/.test(ctx.grade)) base = Math.min(base, 0);
    if (ctx.grade && /Seconde|Première|Terminale|Université/.test(ctx.grade)) base = Math.max(base, 1);
    return clamp(base + state.bonus, 0, 2);
  }

  // Une liste de noms (generateurs ou banques) -> moteurs de questions
  function enginesFromNames(names) {
    return (names || []).map((n) => (GEN[n] ? g(n) : hasBank(n) ? b(n) : null)).filter(Boolean);
  }

  function nextQuestion(state, ctx) {
    const engines = (state.engines && state.engines.length) ? state.engines : enginesFor(ctx.subject, ctx.grade).engines;
    const level = levelFor(state, ctx);
    let q;
    for (let i = 0; i < 8; i++) {
      q = pick(engines)()(level);
      if (q.q !== state.last) break; // evite de reposer la meme question deux fois de suite
    }
    q.level = level;
    state.current = q;
    state.last = q.q;
    state.tries = 0;
    state.asked++;
    return q;
  }

  function learn(state, ctx, correct) {
    if (!ctx.brain || !ctx.MiniIA || !state.current || state.current.level === undefined) return;
    const level = ['facile', 'normal', 'difficile'][state.current.level];
    ctx.MiniIA.record(ctx.brain, ctx.subject, { level, index: 0, total: 1, guess: 0 }, correct);
  }

  function bilan(state) {
    if (!state.asked) return 'D\'accord ! Reviens quand tu veux : pose-moi une question ou demande-moi de t\'interroger.';
    const answered = state.asked - (state.current ? 1 : 0);
    const ratio = state.good / Math.max(1, answered);
    const avis = answered < 3 ? 'On a fait peu de questions : reviens vite pour une vraie interrogation !'
      : ratio >= 0.8 ? 'Tu maîtrises très bien, la prochaine fois je te donnerai des défis plus durs !'
      : ratio >= 0.5 ? 'C\'est bien, tu progresses. Revois juste les questions où tu as eu besoin d\'indices.'
        : 'Tu as fait l\'effort de chercher, c\'est ça le plus important. On revoit ça ensemble la prochaine fois, petit à petit.';
    return `Bilan : tu as trouvé ${state.good} bonne${state.good > 1 ? 's' : ''} réponse${state.good > 1 ? 's' : ''}. ${avis}`;
  }

  function startQuiz(state, ctx, intro) {
    const q = nextQuestion(state, ctx);
    return { reponse: `${intro} ${q.q}`, tableau: q.board };
  }

  // ---------- Le cerveau : repond a un message de l'eleve ----------
  // ctx = { subject, grade, brain, MiniIA } ; renvoie { reponse, tableau, correct?, stop? }
  function reply(text, state, ctx) {
    const raw = String(text || '').trim();
    const low = kidFix(raw).replace(/[.!…?]+$/, '').trim();

    if (state.subject !== ctx.subject) Object.assign(state, newState(), { subject: ctx.subject });

    // Premier message (bouton Mon IA) : on se presente
    if (!low && !state.greeted) {
      state.greeted = true;
      const { known } = enginesFor(ctx.subject);
      return {
        reponse: `Salut ! C'est moi, ton prof. Pose-moi une question de cours, par exemple « comment ça marche les fois ? », ou dis « interroge-moi » et je te pose des questions${known ? ` de ${ctx.subject}` : ''}.`,
        tableau: 'Pose-moi une question !',
      };
    }
    state.greeted = true;

    // Les regles de Toto (public/regles-toto.js) passent AVANT tout le reste :
    // gros mots, danger, infos perso, sujets interdits, devoirs a la place de l'eleve...
    const regles = root.TOTO_REGLES;
    const regle = regles && raw ? regles.verifier(raw) : null;
    if (regle) {
      // Si une interrogation est en cours, on la reprend apres (sauf en cas de danger : la priorite, c'est l'eleve)
      const reprise = state.current && regle.raison !== 'danger' ? ` Reprenons : ${state.current.q}` : '';
      return { reponse: regle.reponse + reprise, tableau: regle.tableau || (state.current ? state.current.board : null), regle: regle.raison };
    }

    // Arreter
    if (/^(stop|arrete|on arrete|fini|j'arrete|c'est fini|termine|au revoir|bye|salut bye)\b/.test(low)) {
      const r = bilan(state);
      Object.assign(state, newState(), { subject: ctx.subject, greeted: true });
      return { reponse: r, tableau: 'À bientôt !', stop: true };
    }

    const q = state.current;
    // L'eleve n'a pas compris l'explication d'avant : on l'explique AUTREMENT (pas la meme phrase)
    // L'eleve vient de dire ce qui le bloque : on lui explique en partant de ce qu'il a dit
    if (state.waitingDetail && !q) {
      const n = state.waitingDetail;
      state.waitingDetail = null;
      return explainAgain(n, raw);
    }
    const notUnderstood = /^(je (ne )?comprends? (pas|rien)|j'ai (pas|rien) compris|pas compris|toujours pas|je vois pas|je n'y arrive pas|j'y arrive pas|j'arrive pas|explique (encore|autrement|mieux|plus simplement)|reexplique|re-explique|encore)\b/.test(low);
    if (notUnderstood && !q && state.lastNotion) return askWhatBlocks(state, state.lastNotion);
    const isQuestion = /\?\s*$/.test(raw) || /^(c'est quoi|qu'est-ce|comment|pourquoi|explique|ca veut dire|que veut dire|je comprends pas|j'ai pas compris|je comprend pas|c'est comment|a quoi sert|quand|qui (est|etait)|ou (est|se trouve)|quel)/.test(low) || /\b(ca marche|explique|c'est quoi)\b/.test(low);

    // Un calcul demande : "combien font 7 fois 8 ?" -> on aide a le trouver, sans donner la reponse
    const calc = (isQuestion || !q || /combien/.test(low)) ? parseCalc(raw) : null;
    if (calc && (!q || isQuestion || /combien/.test(low))) {
      calc.level = undefined;
      state.current = calc;
      state.tries = 1;
      state.asked++;
      return { reponse: `Je ne vais pas te donner la réponse, mais je t'aide à la trouver ! Indice : ${dot(calc.hints[0])} Alors, ça fait combien ?`, tableau: calc.board };
    }

    // Une question de culture : "quelle est la capitale du japon", "qui a invente l'ampoule",
    // "comment on dit chien en anglais" -> Mon IA cherche dans ses 1 200+ questions
    const isFactual = /^(qui|quand|quel|quelle|quels|quelles|combien|ou |en quelle|comment (on dit|dit-on|dit on|se dit|s'appelle|on appelle)|how do you say|what is)/.test(low) || /\b(capitale|invente|decouvert|traduction|traduis|en anglais|en espagnol|en allemand|en italien|annee|date)\b/.test(low);
    const fact = (isQuestion || isFactual || !q) ? findFact(raw) : null;
    // (si c'est justement la question de l'interrogation en cours, on ne donne pas la reponse !)
    const cheating = fact && q && normalize(fact.q) === normalize(q.q);
    if (cheating) return giveHint(state, ctx, 'Ah, tu essaies de me faire donner la réponse ! 😉');

    // Une question de cours : "comment ca marche les fois ?", "c'est quoi un denominateur"
    // (pour une question de fait — qui, quand, combien... — une notion au hasard serait une betise : on prefere demander a Claude)
    let notion = (isQuestion || !q) && !isFactual ? findNotion(raw) : null;
    // Une question "pourquoi / comment / explique" demande une explication, pas un fait de quiz
    // (sinon "pourquoi le ciel est bleu" tomberait sur une question de grammaire avec « le ciel est bleu » !)
    const wantsExplanation = /^(pourquoi|comment|explique|c'est quoi|qu'est-ce|a quoi sert|ca veut dire|que veut dire)/.test(low) && !/^comment (on dit|dit-on|dit on|se dit|s'appelle|on appelle)/.test(low);
    if (fact && (isFactual || (!notion && !wantsExplanation && fact.score > 0.75))) {
      const extra = fact.hint ? ` ${dot(fact.hint)}` : '';
      const intro = pick(['Bonne question !', 'Je sais !', 'Ça, je le sais !']);
      if (q) return { reponse: `${intro} ${cap(fact.answer)}.${extra} Maintenant, à toi : ${q.q}`, tableau: q.board };
      state.offer = fact.bank ? enginesFromNames([fact.bank]) : null;
      return { reponse: `${intro} ${cap(fact.answer)}.${extra}${state.offer && state.offer.length ? ' Tu veux que je t\'interroge sur ce thème ? Dis « oui » !' : ''}`, tableau: `${fact.q.length > 40 ? fact.q.slice(0, 38) + '…' : fact.q} ${cap(fact.answer)}` };
    }
    // Dernier essai : chercher la notion avec les mots de son explication
    if (!notion && !isFactual && (isQuestion || !q)) notion = findNotionByText(raw);
    if (notion) {
      if (!q && state.lastNotion === notion) return askWhatBlocks(state, notion);
      state.lastNotion = notion;
      const ex = explain(notion);
      if (q) return { reponse: `Bonne question ! ${ex} Maintenant, à toi : ${q.q}`, tableau: notion.tableau || q.board };
      state.offer = enginesFromNames(notion.quiz);
      const propose = state.offer.length ? ' Tu veux que je t\'interroge là-dessus ? Dis « oui » !' : ' Tu as une autre question ?';
      return { reponse: `${ex}${propose}`, tableau: notion.tableau || null, reviewable: true, notion };
    }

    // Pas d'interrogation en cours
    if (!q) {
      if (state.offer && /^(oui|ok|d'accord|vas-y|vas y|go|ouais|yes|carrement|allez)\b/.test(low)) {
        state.engines = state.offer;
        state.offer = null;
        return startQuiz(state, ctx, 'C\'est parti ! Première question :');
      }
      if (/interroge|pose[- ]moi|questionne|quiz|teste[- ]moi|entraine|exercice|on commence|commence|go\b|oui/.test(low)) {
        // On interroge sur ce qu'il vient de travailler (la derniere notion), sinon sur toute la matiere
        const focus = state.lastNotion ? enginesFromNames(state.lastNotion.quiz) : [];
        if (focus.length) {
          state.engines = focus;
          return startQuiz(state, ctx, `C'est parti, je t'interroge sur « ${state.lastNotion.titre || ctx.subject} » ! Si tu bloques, dis « indice ». Première question :`);
        }
        state.engines = null;
        const { known } = enginesFor(ctx.subject);
        return startQuiz(state, ctx, known
          ? `C'est parti, je t'interroge en ${ctx.subject} ! Si tu bloques, dis « indice ». Première question :`
          : `Je ne connais pas encore bien « ${ctx.subject} », alors je t'interroge en culture générale. Si tu bloques, dis « indice ». Première question :`);
      }
      if (/^(non|bof|pas maintenant|nan)\b/.test(low)) {
        state.offer = null;
        return { reponse: 'D\'accord ! Pose-moi une autre question quand tu veux.', tableau: null };
      }
      if (/^(salut|bonjour|coucou|hello|yo|wesh|bonsoir)\b/.test(low)) {
        return { reponse: 'Salut ! Pose-moi une question de cours, ou dis « interroge-moi » et je te pose des questions.', tableau: 'Pose-moi une question !' };
      }
      if (/^(merci|super|cool|genial|top)\b/.test(low)) {
        return { reponse: 'Avec plaisir ! Tu veux que je t\'interroge pour vérifier que tu as bien compris ? Dis « interroge-moi ».', tableau: null };
      }
      // Je ne sais pas : je demande au prof Claude, et j'apprends sa reponse pour la prochaine fois
      return {
        reponse: 'Bonne question ! Je cherche la réponse, une petite seconde...',
        tableau: null,
        askClaude: raw,
      };
    }

    // Demande d'indice
    const wantsHint = /^(indice|aide|aide-moi|aide moi|je sais pas|je ne sais pas|sais pas|je trouve pas|je comprends pas|j'ai pas compris|je comprend pas|\?+)$/.test(low) || /\bindice\b/.test(low);
    if (wantsHint) return giveHint(state, ctx, null);

    // Passer la question
    if (/^(passe|je passe|suivante|question suivante|une autre|autre question)\b/.test(low)) {
      if (state.tries === 0) learn(state, ctx, false);
      state.bonus = Math.max(-1, state.bonus - 1);
      const n = nextQuestion(state, ctx);
      return { reponse: `Pas de souci, on garde celle-là pour plus tard. ${n.q}`, tableau: n.board };
    }

    // Sinon : c'est une reponse
    const result = check(raw, q);
    if (result) {
      if (state.tries === 0) learn(state, ctx, true);
      state.good++;
      state.streak++;
      state.misses = 0;
      if (state.streak >= 3 && state.tries === 0) { state.bonus = Math.min(1, state.bonus + 1); state.streak = 0; }
      const intro = result === 'presque' ? `C'est ça ! Fais juste attention à l'orthographe : ${q.answers[0]}.` : pick(BRAVO);
      const harder = state.bonus > 0 && state.streak === 0 ? ' Tu es à l\'aise, je monte la difficulté !' : '';
      const n = nextQuestion(state, ctx);
      return { reponse: `${intro}${harder} ${pick(ENCHAINE)} ${n.q}`, tableau: n.board, correct: true };
    }
    if (state.tries === 0) learn(state, ctx, false);
    state.streak = 0;
    return giveHint(state, ctx, pick(NON));
  }

  function giveHint(state, ctx, prefix) {
    const q = state.current;
    const hint = q.hints[state.tries];
    state.tries++;
    if (hint) {
      return { reponse: `${prefix ? prefix + ' ' : ''}Indice : ${dot(hint)} Essaie encore !`, tableau: q.board, correct: false };
    }
    // Plus d'indices : on explique la methode (sans donner la reponse) et on repart sur plus facile
    state.misses++;
    state.bonus = Math.max(-1, state.bonus - 1);
    const n = nextQuestion(state, ctx);
    return {
      reponse: `${prefix ? prefix + ' ' : ''}Retiens bien la méthode : ${q.method} On reviendra sur cette question plus tard. Essayons une autre : ${n.q}`,
      tableau: n.board, correct: false,
    };
  }

  // ---------- Mon IA fabrique les quiz et les fiches (pour remplacer Claude partout) ----------
  const cap = (s) => { s = String(s); return s ? s[0].toUpperCase() + s.slice(1) : s; };

  // Des mauvaises reponses credibles pour un QCM
  function distractors(q, engine, level) {
    const good = q.answers[0];
    const goodN = normalize(good);
    const out = new Set();
    const add = (x) => { const s = String(x); if (s && normalize(s) !== goodN && !q.answers.some((a) => normalize(a) === normalize(s))) out.add(s); };
    if (/^-?\d+(\.\d+)?$/.test(good)) {
      const n = Number(good);
      const step = Math.abs(n) >= 100 ? 10 : 1;
      for (const d of [step, -step, 2 * step, -2 * step, 10, -10, n, 3 * step]) { const v = d === n ? n * 2 : n + d; if (v >= 0 || n < 0) add(v); if (out.size >= 6) break; }
    } else if (/^\d+\/\d+$/.test(good)) {
      const [a, b2] = good.split('/').map(Number);
      [`${b2}/${a}`, `${a + 1}/${b2}`, `${Math.max(1, a - 1)}/${b2}`, `${a}/${b2 + 1}`, `${a * 2}/${b2}`].forEach(add);
    }
    // Les reponses d'autres questions du meme genre
    for (let i = 0; i < 25 && out.size < 6; i++) {
      try { const other = engine()(level); if (other && other.answers && other.answers[0]) add(other.answers[0]); } catch (e) { /* rien */ }
    }
    return [...out].slice(0, 3);
  }

  function explanationOf(q) {
    const bonne = `La bonne réponse est « ${cap(q.answers[0])} ».`;
    if (q.bank) return q.hint ? `${bonne} ${dot(q.hint)}` : bonne;
    return `${bonne} ${q.method || ''}`.trim();
  }

  // Plusieurs questions differentes pour une matiere
  function collect(subject, level, count, grade, focus) {
    const focused = forGrade(enginesFromNames(focus), grade);
    const engines = focused.length ? focused : enginesFor(subject, grade).engines;
    const seen = new Set();
    const list = [];
    for (let i = 0; i < count * 30 && list.length < count; i++) {
      const engine = engines[i % engines.length === 0 ? Math.floor(Math.random() * engines.length) : Math.floor(Math.random() * engines.length)];
      let q;
      try { q = engine()(level); } catch (e) { continue; }
      if (!q || !q.q || seen.has(q.q)) continue;
      seen.add(q.q);
      list.push({ q, engine });
    }
    return list;
  }

  function toQcm({ q, engine }, level) {
    const wrong = q.choices ? q.choices.filter((c) => normalize(c) !== normalize(q.answers[0])).slice(0, 3) : distractors(q, engine, level);
    while (wrong.length < 3) wrong.push(['Je ne sais pas', 'Aucune de ces réponses', 'Toutes ces réponses'][wrong.length]);
    const options = [cap(q.answers[0]), ...wrong.map(cap)];
    // Melange en gardant la trace de la bonne reponse
    const order = options.map((o, i) => [Math.random(), i]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
    return { question: q.q, options: order.map((i) => options[i]), correctIndex: order.indexOf(0), explanation: explanationOf(q) };
  }

  function toEcrit({ q }) {
    return { question: q.q, answer: cap(q.answers[0]), accept: q.answers, explanation: explanationOf(q) };
  }

  // mode : 'qcm' (10 questions), 'ecrit' (5), 'evaluation' (8, melange) ; difficulty : facile | normal | difficile
  // focus : les generateurs de la notion travaillee en ce moment (les questions portent dessus)
  function makeQuiz(subject, mode, difficulty, grade, focus) {
    const level = { facile: 0, normal: 1, difficile: 2 }[difficulty] ?? 1;
    if (mode === 'ecrit') return { questions: collect(subject, level, 5, grade, focus).map(toEcrit) };
    if (mode === 'evaluation') {
      const items = collect(subject, level, 8, grade, focus);
      const half = Math.ceil(items.length / 2);
      const questions = [
        ...items.slice(0, half).map((it) => ({ type: 'qcm', exercice: 'Exercice 1 : Questions à choix', consigne: 'Entoure la bonne réponse.', ...toQcm(it, level) })),
        ...items.slice(half).map((it) => ({ type: 'ecrit', exercice: 'Exercice 2 : Réponds par écrit', consigne: 'Écris ta réponse en un mot ou un nombre.', ...toEcrit(it) })),
      ];
      return { titre: `Évaluation : ${subject}`, questions };
    }
    return { questions: collect(subject, level, 10, grade, focus).map((it) => toQcm(it, level)) };
  }

  // Titre d'une notion avec les accents : on retrouve le mot-cle dans le texte ("Numérateur" et pas "Numerateur")
  function prettyTitle(n) {
    if (n.titre) return n.titre;
    const mot = String(n.mots[0]);
    const words = String(n.texte || '').split(/[\s,.;:!?()«»"]+/);
    const len = mot.split(' ').length;
    for (let i = 0; i + len <= words.length; i++) {
      const chunk = words.slice(i, i + len).join(' ');
      if (stripAccents(chunk.toLowerCase()).replace(/^[ld]['’]/, '') === mot) return cap(chunk.replace(/^[ldLD]['’]/, ''));
    }
    return cap(mot);
  }

  // Les notions qui parlent de cette matiere
  function notionsFor(subject) {
    const ids = new Set(enginesFor(subject).engines.map((e) => e.id).filter(Boolean));
    const found = allNotions().filter((n) => (n.quiz || []).some((id) => ids.has(id)));
    const direct = findNotion(String(subject));
    if (direct && !found.includes(direct)) found.unshift(direct);
    return found;
  }

  // Une fiche de cours : { titre, sections: [{ titre, contenu }], resume }
  function makeFiche(subject, lastQuestion) {
    let notions = notionsFor(subject);
    // Si l'eleve vient de parler d'une notion precise, la fiche commence par celle-la
    const focus = lastQuestion ? findNotion(lastQuestion) : null;
    if (focus) notions = [focus, ...notions.filter((n) => n !== focus)];
    notions = notions.filter((n, i) => notions.findIndex((m) => prettyTitle(m) === prettyTitle(n)) === i).slice(0, 5);
    if (notions.length) {
      return {
        titre: focus ? `Fiche : ${prettyTitle(focus)}` : `Fiche : ${subject}`,
        sections: notions.map((n) => ({ titre: prettyTitle(n), contenu: explain(n) })),
        resume: notions.map((n) => n.tableau).filter(Boolean).slice(0, 3).join(' • ') || 'Relis cette fiche à voix haute pour bien la retenir.',
      };
    }
    // Pas de notion : une fiche "a savoir" faite avec les questions de la matiere
    const facts = collect(subject, 1, 8).map(({ q }) => `${q.q} → ${cap(q.answers[0])}`);
    return {
      titre: `Fiche : ${subject}`,
      sections: [{ titre: 'À savoir', contenu: facts.slice(0, 4).join(' ') }, { titre: 'Encore plus', contenu: facts.slice(4).join(' ') }].filter((s) => s.contenu),
      resume: 'Cache les réponses et essaie de les retrouver : c\'est la meilleure façon de réviser.',
    };
  }

  // Apprend une nouvelle notion (donnee par Claude) : elle sert tout de suite, sans recharger la page
  function learn(n) {
    if (!n || !Array.isArray(n.mots) || !n.texte) return false;
    const S = root.MON_IA_SAVOIR = root.MON_IA_SAVOIR || { notions: [], banks: {}, matieres: {} };
    S.notions.push(n);
    notionIndex = null;
    return true;
  }

  // Une reponse de Claude -> texte a dire (meme format que les autres explications)
  function explainLearned(n) {
    return explain(n);
  }

  const MonIA = { reply, learn, explainLearned, makeQuiz, makeFiche,findFact, findNotionByText, newState, normalize, check, enginesFor, findNotion, parseCalc, kidFix, savoir, GEN, BANKS, NOTIONS };
  if (typeof module !== 'undefined' && module.exports) module.exports = MonIA;
  else root.MonIA = MonIA;
})(typeof window !== 'undefined' ? window : globalThis);
