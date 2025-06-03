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

# Устанавливаем зависимости всех workspace
RUN npm install

# Сборка сервера из его директории
WORKDIR /app/server
RUN npx nest build

# Копируем фронт в публичную папку
COPY --from=client-builder /app/client/dist ./public

# ---------- 3. Прод-образ ----------
FROM node:22 AS production
WORKDIR /app

# Копируем собранный сервер
COPY --from=server-builder /app/server ./

# Установка только прод-зависимостей
RUN npm install --omit=dev

EXPOSE 3000
CMD ["node", "dist/main"]
