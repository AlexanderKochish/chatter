# ====================== Stage 1: Клиентская часть ======================
FROM node:20-alpine AS client

WORKDIR /app/client

# Сначала копируем только файлы, необходимые для установки зависимостей
COPY client/package.json client/package-lock.json ./
RUN npm install

# Копируем все клиентские файлы и tsconfig (если он есть в корне проекта)
COPY client/ .

RUN npm run build

# ====================== Stage 2: Серверная часть ======================
FROM node:20-alpine AS server

WORKDIR /app/server

# Сначала устанавливаем зависимости
COPY server/package.json server/package-lock.json ./
RUN npm install --legacy-peer-deps --include=optional 

# Затем копируем остальные файлы
COPY server/ .
RUN npm run build

# ====================== Stage 3: Финальный образ ======================
FROM node:20-alpine

WORKDIR /app

COPY server/package.json server/package-lock.json ./
RUN npm install --production --ignore-scripts

# Копируем собранные файлы из предыдущих стадий
COPY --from=client /app/client/dist ./client/dist
COPY --from=server /app/server/dist ./server/dist

COPY server/.env.prod ./

ENV PORT=3000
EXPOSE $PORT

CMD ["sh", "-c","node", "server/dist/main.js"]

