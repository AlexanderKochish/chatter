# -------- 1. Сборка фронта (client) --------
FROM node:18 AS client-builder
WORKDIR /app
COPY . .
WORKDIR /app/client
RUN npm install
RUN npm run build

# -------- 2. Сборка бэка (server) --------
FROM node:18 AS server-builder
WORKDIR /app
COPY . .

# Устанавливаем зависимости для всех workspaces
RUN npm install

# Собираем сервер через workspaces-скрипт (из корня)
RUN npm run build:server

# Копируем Vite-сборку из client-builder
COPY --from=client-builder /app/client/dist ./server/public

# -------- 3. Финальный прод-образ --------
FROM node:18 AS production
WORKDIR /app

# Копируем сервер из стадии server-builder
COPY --from=server-builder /app/server .

# Устанавливаем только прод-зависимости
RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "dist/main"]

