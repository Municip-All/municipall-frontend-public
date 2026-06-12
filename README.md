# Municipall — Frontend web (prototype)

Application web **React** de démonstration pour l’expérience citoyenne Municipall : accueil, signalements, carte (Leaflet), transports, contact, profil, etc.

> **Note** — Ce dépôt est un **prototype UI** avec données mockées en mémoire. L’application mobile de production est **municipall-app-public** (Expo / React Native). Le backoffice mairie est **municipall-web-backoffice-public**.

## Stack

| Technologie | Usage |
|-------------|--------|
| [Create React App](https://create-react-app.dev/) 5 | Build & dev server |
| React 19 + TypeScript | Interface |
| Sass / CSS | Styles par écran |
| [Leaflet](https://leafletjs.com/) + react-leaflet | Carte interactive |
| Docker + nginx | Déploiement statique (CI) |

## Prérequis

- **Node.js** 20 LTS (recommandé, aligné sur la CI)
- **npm** 9+

## Démarrage rapide

```bash
git clone <repo>
cd municipall-frontend-public
npm ci
npm start
```

L’app est disponible sur [http://localhost:3000](http://localhost:3000).

### Compte démo (auth locale)

L’authentification est simulée côté client (`src/test/Appcontext.tsx`) :

| Champ | Valeur |
|-------|--------|
| Email | `marie.beaumont@email.fr` |
| Mot de passe | `demo1234` |

Aucun appel API backend n’est requis pour naviguer dans le prototype.

## Scripts npm

| Commande | Description |
|----------|-------------|
| `npm start` | Serveur de développement (port 3000) |
| `npm run build` | Build de production → dossier `build/` |
| `npm test` | Tests Jest (mode interactif) |
| `npm run lint` | ESLint sur `src/` |
| `npm run typecheck` | Vérification TypeScript |

## Parcours utilisateur

Au lancement :

1. **Écran de chargement** (`LoadingView`) — ~5 s
2. **Présentation** (`PresentationView`) — onboarding produit
3. **Application** — navigation par vues via le contexte React

### Vues disponibles

| Vue | Fichier | Description |
|-----|---------|-------------|
| `home` | `src/test/homeview.tsx` | Accueil citoyen |
| `sig` | `src/test/signalementview.tsx` | Signalements |
| `evenement` | `src/test/otherviews.tsx` | Événements |
| `contact` | `src/test/otherviews.tsx` | Contact mairie |
| `profil` | `src/test/otherviews.tsx` | Profil utilisateur |
| `collecte` | `src/test/otherviews.tsx` | Déchets & toilettes |
| `travaux` | `src/test/otherviews.tsx` | Travaux |
| `transports` | `src/test/otherviews.tsx` | Transports |
| `social` | `src/test/otherviews.tsx` | Vie associative |

La carte plein écran (`src/test/mapview.tsx`) s’ouvre depuis l’accueil. Le chatbot **MuniBot** et le tiroir de notifications sont montés globalement dans `App.tsx`.

## Structure du projet

```
municipall-frontend-public/
├── public/                 # Assets statiques (index.html, manifest)
├── src/
│   ├── App.tsx             # Shell : loading → présentation → routing
│   ├── data.ts             # Données démo (signalements, etc.)
│   ├── types/              # Types TypeScript (User, Signalement, …)
│   ├── context/
│   │   └── AppContext.tsx  # Re-export du contexte
│   └── test/               # Écrans prototype + styles
│       ├── Appcontext.tsx  # État global (auth, navigation, toasts)
│       ├── homeview.tsx
│       ├── mapview.tsx     # Leaflet
│       ├── signalementview.tsx
│       ├── layout.tsx      # NotifDrawer, MuniBot
│       └── …
├── Dockerfile              # Image nginx (build statique)
├── docker-compose.dev.yml  # Déploiement dev (port 3002)
├── docker-compose.prod.yml # Déploiement prod (port 3003)
└── .github/workflows/
    ├── deploy-dev.yml      # Push sur `dev` → GHCR + VPS
    └── deploy-prod.yml     # Push sur `main` → GHCR + VPS
```

## Déploiement

### CI/CD (GitHub Actions)

| Branche | Workflow | Image Docker | Variable build |
|---------|----------|--------------|----------------|
| `dev` | `deploy-dev.yml` | `ghcr.io/<owner>/municipall-frontend-dev` | `REACT_APP_API_URL=https://dev.api.municipall.dev/api/v1/` |
| `main` | `deploy-prod.yml` | `ghcr.io/<owner>/municipall-frontend-prod` | `REACT_APP_API_URL=https://api.municipall.dev/api/v1/` |

Secrets requis sur le dépôt : `VPS_IP`, `VPS_USER`, `SSH_PRIVATE_KEY`.

Sur le VPS, les conteneurs exposent :

- **Dev** : port `3002` → nginx
- **Prod** : port `3003` → nginx

### Docker en local

```bash
npm run build
docker build -t municipall-frontend .
```

Le `Dockerfile` copie le dossier CRA `build/` et le sert via nginx.

## Écosystème Municipall

| Dépôt | Rôle |
|-------|------|
| `municipall-backend-public` | API NestJS, multi-tenant |
| `municipall-app-public` | App mobile citoyenne (Expo) |
| `municipall-frontend-public` | **Ce dépôt** — prototype web |
| `municipall-web-backoffice-public` | Backoffice mairie |
| `municipall-webadmin-public` | Administration plateforme |

## Évolutions prévues

- Brancher les écrans sur l’API `municipall-backend-public` (auth JWT, signalements, config ville)
- Remplacer les données mockées par des appels `REACT_APP_*`
- Aligner le pipeline Docker/CI sur le output CRA (`build/`) si nécessaire
- Consolider les écrans hors du dossier `test/` une fois l’intégration API faite

## Licence

Projet privé Municipall.
