# Stage 1: Сборка клиента (Vite)
FROM node:22-alpine AS client-builder
WORKDIR /app

# Установка системных зависимостей
RUN apk add --no-cache libc6-compat

# Создаем структуру папок
RUN mkdir -p client

# Копируем только нужные файлы клиента
COPY client/package.json ./client/
COPY client/package-lock.json* ./client/ 

# Устанавливаем зависимости клиента
RUN cd client && \
    if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; \
    else npm install --legacy-peer-deps --force; fi

# Копируем остальные файлы клиента
COPY client ./client
COPY tsconfig*.json ./

# Собираем клиент
RUN cd client && npm run build

# Stage 2: Сборка сервера (NestJS)
FROM node:22-alpine AS server-builder
WORKDIR /app

# Устанавливаем Nest CLI глобально
RUN npm install -g @nestjs/cli

# Создаем структуру папок
RUN mkdir -p server

# Копируем только нужные файлы сервера
COPY server/package.json ./server/
COPY server/package-lock.json* ./server/

# Устанавливаем зависимости сервера
RUN cd server && \
    if [ -f package-lock.json ]; then npm ci --legacy-peer-deps --include=optional; \
    else npm install --legacy-peer-deps --include=optional --force; fi

# Если используете Prisma:
COPY server/prisma ./server/prisma
RUN cd server && npx prisma generate

# Копируем исходный код сервера
COPY server ./server
COPY tsconfig*.json ./

# Собираем сервер
RUN cd server && npm run build

# Stage 3: Финальный образ
FROM node:22-alpine
WORKDIR /app

# Устанавливаем serve для статики
RUN npm install -g serve

# Копируем production зависимости сервера
COPY --from=server-builder /app/server/node_modules ./server/node_modules

# Копируем собранные файлы
COPY --from=client-builder /app/client/dist ./client/dist
COPY --from=server-builder /app/server/dist ./server/dist

# Если используете Prisma:
COPY --from=server-builder /app/server/prisma ./server/prisma

# Health check для Railway
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT || exit 1

CMD ["sh", "-c", "cd server && ( [ -f prisma/schema.prisma ] && npx prisma migrate deploy || true ) && node dist/main.js & serve -s client/dist -l $PORT"]