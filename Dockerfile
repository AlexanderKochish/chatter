# Stage 1: Client build (Vite)
FROM node:22-alpine AS client
WORKDIR /app/client

# 1. Копируем только package.json
COPY package.json .

# 2. Устанавливаем зависимости
RUN npm install --legacy-peer-deps --force

# 3. Копируем остальные файлы клиента
COPY . .

# 4. Собираем клиент (только Vite, без tsc)
RUN npm run build -- --mode production

# Stage 2: Server build (NestJS)
FROM node:22-alpine AS server
WORKDIR /app/server

# 1. Устанавливаем Nest CLI
RUN npm install -g @nestjs/cli

# 2. Копируем package.json
COPY package.json .

# 3. Устанавливаем зависимости
RUN npm install --legacy-peer-deps --include=optional --force

# 4. Копируем остальные файлы сервера
COPY . .

# 5. Собираем сервер
RUN npm run build

# Final stage
FROM node:22-alpine
WORKDIR /app

# 1. Устанавливаем serve
RUN npm install -g serve

# 2. Копируем клиент
COPY --from=client /app/client/dist ./client/dist

# 3. Копируем сервер
COPY --from=server /app/server/dist ./server/dist
COPY --from=server /app/server/node_modules ./server/node_modules

# 4. Запускаем
CMD ["sh", "-c", "node server/dist/main.js & serve -s client/dist -l $PORT"]