# Fase de build
FROM node:18 AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos do package.json e package-lock.json
COPY package*.json ./ 

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Define a variável de ambiente para a URL da API
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Executa o build da aplicação React
RUN npm run build

# Fase de produção
FROM node:18 AS production

WORKDIR /app

# Verifica se o diretório /app/build foi criado corretamente
RUN ls -la /app

# Copia os arquivos compilados para o container
COPY --from=builder /app/build ./build

# Cria o arquivo env-config.js com o valor da variável de ambiente REACT_APP_API_URL
RUN echo "window.env = { REACT_APP_API_URL: '$REACT_APP_API_URL' };" > /app/build/env-config.js

# Expõe a porta 3000 para o servidor estático
EXPOSE 3000

# Comando para iniciar o servidor estático
CMD ["serve", "-s", "build", "-l", "3000"]
