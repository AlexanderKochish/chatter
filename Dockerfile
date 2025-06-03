# ---------- Build frontend ----------
FROM node:18 AS client-builder
WORKDIR /app
COPY . .
WORKDIR /app/client
RUN npm install && npm run build

# ---------- Build backend ----------
FROM node:18 AS server-builder
WORKDIR /app
COPY . .

# Устанавливаем зависимости с поддержкой workspaces
RUN npm install

# Собираем сервер через workspace-скрипт
RUN npm run build:server

# Копируем React-сборку внутрь сервера
RUN cp -r ./client/dist ./server/public

# ---------- Final image ----------
FROM node:18 AS production
WORKDIR /app

# Копируем собранный NestJS сервер
COPY --from=server-builder /app/server .

# Устанавливаем только прод-зависимости
RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "dist/main"]
