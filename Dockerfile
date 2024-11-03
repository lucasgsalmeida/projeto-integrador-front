# Dockerfile para a aplicação React
FROM node:18 AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos do package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Compila o projeto para produção
RUN npm run build