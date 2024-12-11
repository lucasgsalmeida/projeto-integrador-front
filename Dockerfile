# Dockerfile para a aplicação React
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN REACT_APP_API_URL=$REACT_APP_API_URL npm run build

FROM node:18 AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
