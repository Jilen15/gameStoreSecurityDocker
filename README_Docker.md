# Déploiement Docker / Docker Compose

**Objectif**: Fournir une configuration reproductible pour déployer l'application (API Node.js, base de données Postgres, MongoDB et front-end) via Docker Compose.

**Fichiers ajoutés**
- `Dockerfile` (racine) : conteneurise l'API Node.js, génère un certificat auto-signé au build et exécute `src/server.js`.
- `frontend/Dockerfile` : multi-étape, build Vite puis sert `dist` avec `nginx`.
- `docker-compose.yml` : orchestre `api`, `frontend`, `postgres`, `mongo`.
- `.env.example` : variables d'environnement à copier en `.env` (ne pas committer de secrets).
- `.dockerignore` (root + frontend)

**Prérequis**
- Docker Engine (version récente, testée avec Docker 24+)
- Docker Compose (intégré à Docker Desktop) ou `docker compose` CLI
- OS: Linux / macOS / Windows (avec Docker Desktop)

1) Préparer les variables d'environnement

Copier et éditer le fichier d'exemple:

```
cp .env.example .env
# Éditez .env et remplacez les valeurs par des secrets sûrs en production
```

2) Build et démarrage

Pour construire les images et démarrer les services:

```bash
docker compose up --build -d
```

Vérifier les logs:

```bash
docker compose logs -f api
```

Arrêter et supprimer les conteneurs (sans supprimer les volumes de données):

```bash
docker compose down
```

Pour supprimer aussi les volumes persistants:

```bash
docker compose down -v
```

3) Points d'accès
- API HTTPS: https://localhost:3000 (auto-signé, le navigateur affichera un avertissement)
- Frontend: http://localhost:5173

4) Ports exposés
- `3000` — API (HTTPS)
- `5173` — Frontend (nginx sert sur 80 à l'intérieur, exposé sur 5173)

5) Volumes et persistance
- Postgres: volume `postgres_data` monté sur `/var/lib/postgresql/data` (persistant)
- Mongo: volume `mongo_data` monté sur `/data/db`
- Le fichier `data/bdd.sql` est injecté dans `/docker-entrypoint-initdb.d/` pour initialiser Postgres au premier démarrage

6) Variables d'environnement importantes
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` — initialisent Postgres
- `MONGO_URI`, `MONGO_DBNAME` — connexion Mongo utilisée par l'API
- `SESSION_SECRET` — clé pour les sessions (ne pas laisser vide en production)

7) Choix techniques et bonnes pratiques
- Images officielles légères (Node 18 slim, nginx:alpine, postgres, mongo).
- Génération d'un certificat auto-signé au build pour permettre HTTPS sans configuration manuelle. En production, remplacez par un certificat valide et gestion de secrets.
- Exécution de l'API avec un utilisateur non-root (`appuser`) pour limiter les risques.
- Pas de mots de passe en clair dans le dépôt: utilisez `.env` local, systèmes de gestion de secrets (Vault, AWS Secrets Manager) en production.
- Les fichiers `node_modules` ne sont pas montés dans le conteneur de production: build effectue `npm ci` et l'image contient les modules.

8) Dépannage rapide
- Si l'API ne démarre pas, vérifier la présence des variables d'environnement `MONGO_URI` et `POSTGRES_*` et consulter les logs via `docker compose logs -f api`.
- Si Postgres ne contient pas les tables attendues, assurez-vous que `data/bdd.sql` est présent et correctement formaté; le script s'exécute uniquement au premier démarrage du volume Postgres.

9) Extension possible
- Ajouter `pgadmin` ou `mongo-express` pour administration.
- Mettre en place des secrets Docker Swarm / Kubernetes pour la production.


