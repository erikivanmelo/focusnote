# Etapa de construcción
FROM node:18-alpine AS builder

# Install build dependencies
RUN apk add --no-cache make gcc g++ python3

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install
RUN npm install -g typescript

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN tsc

# Etapa de producción
FROM node:18-alpine

WORKDIR /app

# Crear directorio de datos
RUN mkdir -p /app/data

# Copiar dependencias y código compilado
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Configurar variables de entorno
ENV DATABASE_PATH=/app/data/focusnote.db
ENV PORT=3001

# Exponer el puerto
EXPOSE 3001

# Comando para iniciar el servidor
CMD ["/bin/sh", "-c", "node dist/scripts/run-migrations.js && node dist/index.js"]
