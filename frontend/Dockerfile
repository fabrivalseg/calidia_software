FROM node:20 as build

WORKDIR /app

ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Servidor nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80