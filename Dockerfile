# Stage 1: Client build (Vite)
FROM node:22-alpine AS client
WORKDIR /app/client

# 1. Копируем только package.json (package-lock.json опционально)
COPY client/package.json .
COPY client/package-lock.json* ./

# 2. Устанавливаем зависимости
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; \
    else npm install --legacy-peer-deps --force; fi

# 3. Копируем tsconfig файлы из корня в папку клиента
COPY tsconfig*.json ./

# 4. Копируем исходный код клиента
COPY client .

# 5. Собираем клиент (с обработкой ошибок tsconfig)
RUN if [ -f tsconfig.base.json ]; then npm run build; \
    else echo "Using default TypeScript config" && npm run build; fi

# Stage 2: Server build (NestJS)
FROM node:22-alpine AS server
WORKDIR /app/server

# 1. Устанавливаем Nest CLI
RUN npm install -g @nestjs/cli

# 2. Копируем package.json сервера
COPY server/package.json .
COPY server/package-lock.json* ./

# 3. Устанавливаем зависимости сервера
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps --include=optional; \
    else npm install --legacy-peer-deps --include=optional --force; fi

# 4. Копируем tsconfig файлы из корня
COPY tsconfig*.json ./

# 5. Копируем исходный код сервера
COPY server .

# 6. Собираем сервер
RUN npm run build

# Final stage
FROM node:22-alpine
WORKDIR /app

# 1. Устанавливаем serve для статики
RUN npm install -g serve

# 2. Копируем собранный клиент
COPY --from=client /app/client/dist ./client/dist

# 3. Копируем собранный сервер
COPY --from=server /app/server/dist ./server/dist
COPY --from=server /app/server/node_modules ./server/node_modules

# 4. Health check для Railway
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT || exit 1

# 5. Запускаем оба процесса
CMD sh -c 'node server/dist/main.js & serve -s client/dist -l $PORT'