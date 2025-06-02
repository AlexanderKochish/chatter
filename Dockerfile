# Stage 1: Сборка клиента (Vite)
FROM node:22-alpine AS client-builder
WORKDIR /app

# 1. Установка системных зависимостей
RUN apk add --no-cache libc6-compat

# 2. Создаем папку клиента
RUN mkdir -p client

# 3. Копируем ТОЛЬКО package.json (package-lock.json может отсутствовать)
COPY client/package.json ./client/

# 4. Устанавливаем зависимости клиента (автоматически создаст package-lock.json)
RUN cd client && npm install --legacy-peer-deps --force

# 5. Копируем остальные файлы клиента
COPY client ./client
COPY tsconfig*.json ./

# 6. Собираем клиент
RUN cd client && npm run build

# Stage 2: Сборка сервера (NestJS)
FROM node:22-alpine AS server-builder
WORKDIR /app

# 1. Устанавливаем Nest CLI глобально
RUN npm install -g @nestjs/cli

# 2. Создаем папку сервера
RUN mkdir -p server

# 3. Копируем package.json сервера
COPY server/package.json ./server/

# 4. Устанавливаем зависимости сервера
RUN cd server && npm install --legacy-peer-deps --include=optional --force

# 5. Копируем исходный код сервера
COPY server ./server
COPY tsconfig*.json ./

# 6. Если используете Prisma:
COPY server/prisma ./server/prisma
RUN cd server && npx prisma generate

# 7. Собираем сервер
RUN cd server && npm run build

# Stage 3: Финальный образ
FROM node:22-alpine
WORKDIR /app

# 1. Устанавливаем serve для статики
RUN npm install -g serve

# 2. Копируем production зависимости сервера
COPY --from=server-builder /app/server/node_modules ./server/node_modules

# 3. Копируем собранные файлы
COPY --from=client-builder /app/client/dist ./client/dist
COPY --from=server-builder /app/server/dist ./server/dist

# 4. Если используете Prisma:
COPY --from=server-builder /app/server/prisma ./server/prisma

# 5. Health check для Railway
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT || exit 1

# 6. Запускаем оба процесса
CMD ["sh", "-c", "cd server && ( [ -f prisma/schema.prisma ] && npx prisma migrate deploy || true ) && node dist/main.js & serve -s client/dist -l $PORT"]