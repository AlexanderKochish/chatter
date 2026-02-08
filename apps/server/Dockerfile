
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.base.json ./
COPY apps/server/package*.json ./apps/server/
COPY packages/shared/package*.json ./packages/shared/

RUN npm install

COPY . .

RUN npx prisma generate --schema=./apps/server/prisma/schema.prisma

RUN npm run build --workspace=server

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod --workspace=server"]