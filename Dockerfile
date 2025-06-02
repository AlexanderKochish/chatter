# =========================
# СТАДИЯ 1: Сборка проекта
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
COPY tsconfig.base.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/
COPY server/tsconfig*.json ./server/
COPY server/prisma ./server/prisma

RUN npm install --legacy-peer-deps

# Копируем весь исходный код
COPY client ./client
COPY server ./server

# Генерируем Prisma Client
RUN npx prisma generate --schema=server/prisma/schema.prisma

# Сборка клиентской и серверной части
RUN npm run build:client && npm run build:server

# Переносим собранный клиент в сервер/public
RUN mkdir -p ./server/public && cp -r ./client/dist/* ./server/public/

# =========================
# СТАДИЯ 2: Production-образ
# =========================
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Копируем зависимости и устанавливаем продакшен-зависимости
COPY package*.json ./
COPY server/package*.json ./server/
RUN npm install --omit=dev --legacy-peer-deps

# Копируем собранный сервер и клиент
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/prisma ./server/prisma
COPY --from=builder /app/server/public ./server/public

# Открываем порт
EXPOSE 3000

# Запускаем миграции и приложение
CMD npx prisma migrate deploy --schema=server/prisma/schema.prisma && \
    node server/dist/main

