# Usa una imagen oficial de Node.js 18 como base
FROM node:18-alpine AS base

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Define el entorno como producción para instalar sólo dependencias necesarias
ENV NODE_ENV=production

# Copia los archivos de npm e instala dependencias de producción
COPY package*.json ./
RUN npm ci --omit=dev

# Copia el resto del código
COPY . .

# Variables de entorno por defecto (pueden sobrescribirse al correr el contenedor)
ENV PORT=8080
ENV MONGODB_URI=mongodb://host.docker.internal:27017/adoptme

# Expone el puerto del servidor Express
EXPOSE 8080

# Comando por defecto al iniciar el contenedor
CMD ["node", "src/server.js"]
