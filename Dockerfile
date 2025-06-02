# Этап 1: сборка клиента
FROM node:20-alpine as builder

WORKDIR /app

COPY . .

RUN npm install --legacy-peer-deps
RUN npm run build:client

RUN npm run build:server

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app /app

RUN npm install --legacy-peer-deps --omit=dev
RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:server"]
