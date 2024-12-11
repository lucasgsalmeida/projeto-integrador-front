FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG REACT_APP_API_URL
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist .

# Adicionar variáveis de ambiente no tempo de execução
COPY ./env-config.js ./env-config.js
CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/env-config.js > /usr/share/nginx/html/env-config.js && nginx -g 'daemon off;'"]
