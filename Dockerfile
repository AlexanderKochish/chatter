# ====================== Stage 1: Клиентская часть ======================
FROM node:20-alpine AS client

WORKDIR /app

# Сначала копируем только файлы, необходимые для установки зависимостей
COPY client/package.json client/package-lock.json ./
RUN npm install 

# Затем копируем остальные файлы
COPY client/ .
# Копируем tsconfig.base.json если он нужен (должен быть в корне проекта)
COPY ./tsconfig.base.json ./
RUN npm run build

# ====================== Stage 2: Серверная часть ======================
FROM node:20-alpine AS server

WORKDIR /app

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
RUN npm install

# Копируем собранные файлы из предыдущих стадий
COPY --from=client /app/dist ./client/dist
COPY --from=server /app/dist ./server/dist

COPY server/.env.prod ./

ENV PORT=3000
EXPOSE $PORT

CMD ["node", "server/dist/main.js"]

