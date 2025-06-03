# ---------- 1. Сборка фронта ----------
FROM node:22 AS client-builder
WORKDIR /app
COPY . .
WORKDIR /app/client
RUN npm install
RUN npm run build

# ---------- 2. Сборка сервера ----------
FROM node:22 AS server-builder
WORKDIR /app
COPY . .
RUN npm install -g @nestjs/cli
# Устанавливаем зависимости с workspace-поддержкой
RUN npm install

# Собираем сервер
RUN npm run build:server

# Копируем Vite-сборку из client-builder в серверную public
COPY --from=client-builder /app/client/dist ./server/public

# ---------- 3. Финальный образ ----------
FROM node:22 AS production
WORKDIR /app

# Копируем собранный сервер
COPY --from=server-builder /app/server .

# Устанавливаем только прод-зависимости
RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "dist/main"]
