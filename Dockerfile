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
# Compila o projeto para produção
RUN npm run build

# Fase de produção
FROM node:18 AS production

WORKDIR /app

# Copia os arquivos compilados
COPY --from=builder /app/build ./build

# Instala um servidor estático para servir os arquivos
RUN npm install -g serve

# Expõe a porta que o serve usará
EXPOSE 3795

# Comando para iniciar o servidor estático
CMD ["serve", "-s", "dist", "-l", "3000"]
