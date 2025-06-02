# =========================
# СТАДИЯ 1: Сборка проекта
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем корневые файлы и workspace
COPY package*.json ./
COPY tsconfig.base.json ./

# Копируем клиент и сервер package.json
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Устанавливаем зависимости
RUN npm install --legacy-peer-deps

# Копируем исходный код
COPY client ./client
COPY server ./server

# Устанавливаем prisma CLI вручную, так как она не глобальная
RUN npx --yes prisma@6.7.0 generate --schema=server/prisma/schema.prisma

# Сборка клиентской и серверной частей
RUN npm run build:client && npm run build:server

# Копируем клиентскую сборку в сервер/public
RUN mkdir -p ./server/public && cp -r ./client/dist/* ./server/public/

# =========================
# СТАДИЯ 2: Production-образ
# =========================
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

# Устанавливаем только продакшн-зависимости
COPY package*.json ./
COPY server/package*.json ./server/
RUN npm install --omit=dev --legacy-peer-deps

# Копируем собранные артефакты
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/public ./server/public
COPY --from=builder /app/server/prisma ./server/prisma

# Порт сервера
EXPOSE 3000

# Запуск миграций и сервера
CMD npx --yes prisma@6.7.0 migrate deploy --schema=server/prisma/schema.prisma && \
    node server/dist/main

