# Dockerfile pour React Frontend - Mode Développement
FROM node:18-alpine AS base

# Installer les dépendances système
RUN apk add --no-cache \
    curl \
    bash

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration des packages
COPY package*.json ./

# Étape de développement
FROM base AS development
RUN npm install
COPY . .
EXPOSE 3000
ENV CHOKIDAR_USEPOLLING=true
CMD ["npm", "start"]

# Étape de build pour production
FROM base AS build
RUN npm ci --only=production
COPY . .
RUN npm run build

# Étape de production avec Nginx
FROM nginx:alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
