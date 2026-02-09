FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.base.json ./
COPY apps/server/package*.json ./apps/server/
COPY packages/shared/package*.json ./packages/shared/

RUN npm install

COPY . .

RUN ./node_modules/.bin/prisma generate --schema=./apps/server/prisma/schema.prisma

RUN npm run build --workspace=server

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy --schema=./apps/server/prisma/schema.prisma && npm run start:prod --workspace=server"]