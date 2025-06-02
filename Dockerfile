
FROM node:20-alpine AS builder

WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
COPY tsconfig.base.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/
COPY server/tsconfig*.json ./server/
COPY server/prisma ./server/prisma

RUN npm install --legacy-peer-deps --include=optional

COPY client ./client
COPY server ./server

RUN npx prisma generate --schema=server/prisma/schema.prisma

RUN npm run build:client && npm run build:server


RUN mkdir -p ./server/public && cp -r ./client/dist/* ./server/public/

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY server/package*.json ./server/
RUN npm install --omit=dev --legacy-peer-deps --include=optional

# Копируем собранный сервер и клиент
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/prisma ./server/prisma
COPY --from=builder /app/server/public ./server/public

EXPOSE 3000

CMD npx prisma migrate deploy --schema=server/prisma/schema.prisma && \
    node server/dist/main

