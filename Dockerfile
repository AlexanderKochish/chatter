# -------- Сборка клиента --------
FROM node:20 AS client-builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build:client

# -------- Сборка сервера --------
FROM node:20 AS server-builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build:server

# Копируем клиент в сервер
RUN cp -r client/dist server/public

# -------- Финальный образ --------
FROM node:20 AS production
WORKDIR /app
COPY --from=server-builder /app/server .

# Только прод-зависимости
RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "dist/main"]


