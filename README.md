# Prof Aide IA

Site avec une maitresse virtuelle : micro pour parler, voix pour repondre, tableau pour ecrire, et une methode socratique (elle guide, ne donne jamais la reponse finale).

## Installation

1. Installer les dependances :
   ```
   npm install
   ```
2. Recuperer une cle API Anthropic (Claude) **payante a l'usage** :
   - Va sur https://console.anthropic.com
   - Cree un compte, ajoute une methode de paiement
   - Dans "API Keys", clique sur "Create Key"
3. Copier `.env.example` en `.env` et y mettre ta cle Anthropic (la cle n'est PAS fournie avec le projet, elle reste secrete) :
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
   La recherche de videos YouTube n'a besoin d'aucune cle.
4. Lancer le serveur :
   ```
   npm start
   ```
5. Ouvrir `http://localhost:3000` dans **Chrome** ou **Edge** (la reconnaissance vocale du navigateur ne marche pas dans tous les navigateurs, ex: Firefox).

## Comment ca marche

- `public/` : l'interface (choix du prof, choix de la classe, choix du theme, avatar, tableau canvas, micro, quiz, video, fiche).
- `server.js` : petit serveur Node/Express qui recoit le texte de l'eleve et appelle l'API Claude (Anthropic). La cle API reste secrete cote serveur, jamais exposee dans le navigateur.
- Le prof repond en JSON structure (`reponse` a dire a voix haute, `tableau` a ecrire), avec une consigne stricte de ne jamais donner la solution finale.

## Limites connues

- La reconnaissance vocale (Speech Recognition) est une API du navigateur, disponible surtout sur Chrome/Edge.
- Sans cle API valide dans `.env`, le serveur repond avec un message d'erreur explicite au lieu de planter.
- L'API Claude est facturee a l'usage (pas de niveau gratuit) ; surveille ta consommation sur console.anthropic.com.
- Le serveur Node doit rester lance pour que le site fonctionne. S'il s'arrete, relance `npm start` dans le dossier du projet.
