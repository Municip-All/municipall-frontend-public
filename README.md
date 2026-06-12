# Municipall — Frontend web (prototype)

Application web **React** de démonstration pour l’expérience citoyenne Municipall : accueil, signalements, carte (Leaflet), transports, contact, profil, etc.

> **Note** — Prototype web connecté à **municipall-backend-public** (API dev par défaut). L’app mobile de production est **municipall-app-public**. Le backoffice mairie est **municipall-web-backoffice-public**.

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

### API backend

Par défaut, l’app pointe vers **l’API dev** (y compris les builds prod) :

| Variable | Défaut |
|----------|--------|
| `REACT_APP_API_URL` | `https://dev.api.municipall.dev/api/v1/` |
| `REACT_APP_DEFAULT_TENANT_ID` | `le-kremlin-bicetre` |

Copier `.env.example` vers `.env` pour personnaliser.

### Compte démo

| Champ | Valeur |
|-------|--------|
| Email | `@demo.municipall.dev` |
| Mot de passe | `Demo2026!` |

Connexion via `POST /auth/login` — JWT stocké en `localStorage`.

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

## Données branchées sur l’API

| Écran | Source |
|-------|--------|
| Auth | `auth/login`, `auth/signup`, `auth/me` |
| Accueil | météo, événements, alertes transports |
| Signalements | `reports/mine` |
| Événements | `events` |
| Contact | `city-config` + `contact-tickets` |
| Collecte | `wasteConfig` (city-config) + toilettes Open Data Paris |
| Travaux | `construction-works` |
| Transports | `municipalities/:id/transports/disruptions` |
| Social | `associations` (city-config) |
| Carte | toilettes Open Data Paris |

Restent en local : notifications, chatbot MuniBot, onboarding.

## Licence

Projet privé Municipall.
