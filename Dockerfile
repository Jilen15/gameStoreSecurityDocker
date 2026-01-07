FROM node:18-bullseye-slim

# Installe les dépendances nécessaires pour générer des certificats SSL
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Crée un utilisateur non-root pour exécuter l'application
RUN useradd --user-group --create-home --shell /bin/bash appuser

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production --silent

# Copie l'application source code
COPY . .

# Genere un certificat auto-signé pour HTTPS en développement
RUN mkdir -p certs \
  && openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout certs/localhost-key.pem -out certs/localhost.pem -subj \
    "/CN=localhost" || true

RUN chown -R appuser:appuser /usr/src/app

USER appuser

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "src/server.js"]
