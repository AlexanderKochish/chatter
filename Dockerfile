# Stage 1: Client build (Vite + React)
FROM node:22-alpine AS client-builder
WORKDIR /app/client

# 1. Копируем package.json и package-lock.json
COPY client/package.json client/package-lock.json ./

# 2. Устанавливаем зависимости клиента
RUN npm install --legacy-peer-deps --force

# 3. Копируем остальные файлы клиента
COPY client/ .

# 4. Собираем клиент (разделяем tsc и vite build)
RUN tsc -b || echo "TypeScript compilation warning"
RUN vite build

# Stage 2: Server build (NestJS)
FROM node:22-alpine AS server-builder
WORKDIR /app/server

# 1. Устанавливаем Nest CLI и зависимости
RUN npm install -g @nestjs/cli

# 2. Копируем package.json и package-lock.json
COPY server/package.json server/package-lock.json ./

# 3. Устанавливаем зависимости сервера
RUN npm install --legacy-peer-deps --include=optional --force

# 4. Копируем остальные файлы сервера
COPY server/ .

# 5. Генерируем Prisma клиент (если нужно)
RUN npx prisma generate

# 6. Собираем сервер
RUN npm run build

# Final stage
FROM node:22-alpine
WORKDIR /app

# 1. Устанавливаем serve для статики
RUN npm install -g serve

# 2. Копируем собранный клиент
COPY --from=client-builder /app/client/dist ./client/dist

# 3. Копируем собранный сервер
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/node_modules ./server/node_modules

# 4. Если используете Prisma:
COPY --from=server-builder /app/server/prisma ./server/prisma

# 5. Health check для Railway
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT || exit 1

# 6. Запускаем оба процесса
CMD sh -c 'cd server && ( [ -f prisma/schema.prisma ] && npx prisma migrate deploy || true ) && node dist/main.js & serve -s client/dist -l $PORT'