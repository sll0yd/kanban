# Kanban 🎯 Mono-dépôt

## En mode developpement

- `npm run dev:back` : lance le back
- `npm run dev:front` : lance le front

## En mode production

- `npm run build` : créer le bundler
- `npm run start` : lance l'API (`/api`) + serve le dossier `dist` comme étant notre dossier "public" (`/`)


Pour mettre en production :
- on build : `npm run build` ==> générer le dossier `client/dist`
- on start : `npm run start` ==> lancer l'api (`/api`) + serveur le dossier `dist` (dont l'`index.html`, ie. la route `/` avec notre front)

