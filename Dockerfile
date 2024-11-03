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

# Fase de produção
FROM nginx:alpine

# Copia os arquivos compilados para o diretório do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta padrão do Nginx
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
