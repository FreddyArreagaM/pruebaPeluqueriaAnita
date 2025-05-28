# Usar una imagen oficial de Node.js
FROM node:18

# Crear un directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto del backend
EXPOSE 3000

# Comando para iniciar la API
CMD ["node", "app.js"]
