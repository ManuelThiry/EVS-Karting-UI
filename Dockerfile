# Étape 1 : build
FROM node:22-alpine AS builder
WORKDIR /app

# Copier package.json et yarn.lock pour installer les dépendances
COPY package.json yarn.lock ./
RUN yarn install

# Copier le reste des fichiers
COPY . .

# Ajout : récupérer la variable d'API au build
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build de l'app React avec la bonne variable d'env
RUN yarn build

# Étape 2 : serveur nginx
FROM nginx:stable-alpine

# Copier le nginx.conf custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés dans nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier le script d'entrée
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]