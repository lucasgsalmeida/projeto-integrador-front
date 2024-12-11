# Fase de build
FROM node:18 AS builder

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto, incluindo o index.html
COPY . .

# Verifica se o diretório com index.html está presente
RUN ls -la /app

# Define a variável de ambiente para o build
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Executa o build da aplicação React
RUN npm run build

# Fase de produção
FROM node:18 AS production

WORKDIR /app

# Copia os arquivos de build da fase anterior
COPY --from=builder /app/build ./build

# Cria o arquivo env-config.js com a variável de ambiente REACT_APP_API_URL
RUN echo "window.env = { REACT_APP_API_URL: '$REACT_APP_API_URL' };" > /app/build/env-config.js

# Verifica se o arquivo foi criado corretamente
RUN ls -la /app/build

# Instala o serve globalmente para servir os arquivos estáticos
RUN npm install -g serve

# Expõe a porta 3000
EXPOSE 3000

# Comando para iniciar o servidor estático
CMD ["serve", "-s", "build", "-l", "3000"]
