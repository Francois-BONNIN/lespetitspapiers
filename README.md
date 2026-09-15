# Le tirage des Petits Papiers

Application web de tirage au sort type « Secret Santa » : gestion des participants,
règles d'exclusion / d'inclusion, et tirage. Les données sont stockées dans le
`localStorage` du navigateur (aucune base de données ni backend requis).

Stack : Vite + React + TypeScript + Tailwind CSS.

## Développement local

```bash
npm install
npm run dev
```

L'application est disponible sur http://localhost:5173.

## Build de production

```bash
npm run build      # génère le dossier dist/
npm run start      # sert dist/ en local (respecte la variable PORT)
```

## Déploiement sur Railway

Le projet est prêt pour Railway (configuration dans `railway.json`).

1. **Pousser le code sur GitHub** (voir plus bas), puis dans Railway :
   *New Project → Deploy from GitHub repo* et sélectionner ce dépôt.
2. Railway détecte automatiquement Node via Nixpacks et exécute :
   - Build : `npm run build`
   - Start : `npm run start` (`serve -s dist`, qui écoute sur `$PORT`)
3. **Aucune variable d'environnement n'est nécessaire** : l'application est
   entièrement côté client et n'utilise aucun service externe.
4. Une fois déployé, générer un domaine public dans *Settings → Networking →
   Generate Domain*.

### Alternative : déploiement via la CLI Railway

```bash
npm i -g @railway/cli
railway login
railway init        # ou: railway link  pour rattacher à un projet existant
railway up
```

## Pousser sur GitHub

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<votre-compte>/<votre-repo>.git
git push -u origin main
```
