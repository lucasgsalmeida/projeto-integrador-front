# Fase de build
FROM node:18 AS builder

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Define a variável de ambiente para o build
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Executa o build da aplicação React
RUN npm run build

# Verifica se o diretório build foi criado corretamente
RUN ls -la /app/build  # Verifica se o diretório build existe
RUN cat /app/build/static/js/main*.js  # Verifica se os arquivos estão sendo gerados
