# Déclare un argument pour choisir le stage (dev ou prod)
ARG STAGE=prod

# Étape 1 : Construction de l'application Angular
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production
RUN ls -la /app/dist/gtosint

# 🖥 Étape 2 : Serveur pour le mode développement (Angular Live Server)
FROM node:20-alpine AS dev
WORKDIR /app
COPY --from=build /app /app
EXPOSE 4200
CMD ["npm", "run", "start"]

# 🚀 Étape 3 : Serveur Nginx pour le mode production
FROM nginx:alpine AS prod
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist/gtosint /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf
RUN ls -la /usr/share/nginx/html
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]

# Sélectionner l'étape finale selon le mode (dev ou prod)
FROM ${STAGE}

# # Stage 0, "build-stage", based on Node.js, to build and compile the frontend
# FROM node:20-alpine AS build-stage
# WORKDIR /app
# COPY package*.json /app/
# RUN npm install
# COPY ./ /app/
# ARG configuration=production
# RUN npm run build -- --output-path=./dist/out --configuration $configuration

# # Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
# FROM nginx:1.15
# #Copy ci-dashboard-dist
# COPY --from=build-stage /app/dist/out/ /usr/share/nginx/html
# #Copy default nginx configuration
# COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf