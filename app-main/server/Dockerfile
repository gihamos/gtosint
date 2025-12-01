# Étape 1 : Utilisation d'une image Node.js comme base
FROM node:20-alpine

ARG BACK_PORT
ENV BACK_PORT=$BACK_PORT
ARG FRONT_URL
ENV FRONT_URL=$FRONT_URL
ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI
ARG JWT_SECRET
ENV JWT_SECRET=$JWT_SECRET

WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./
RUN npm install

# Copier le reste de l'application
COPY . .

# Exposer le port sur lequel l'application tourne
EXPOSE 3000

# Commande de démarrage en développement (avec nodemon si disponible)
CMD ["npm", "run", "start"]
