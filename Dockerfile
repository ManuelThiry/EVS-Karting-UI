# Étape 1 : build
FROM node:22-alpine AS builder
WORKDIR /app

# Copier package.json et yarn.lock pour installer les dépendances
COPY package.json yarn.lock ./
RUN yarn install

# Copier le reste des fichiers
COPY . .

# Build de l'app React
RUN yarn build

# Étape 2 : serveur nginx
FROM nginx:stable-alpine

# Copier le nginx.conf custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés dans nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
