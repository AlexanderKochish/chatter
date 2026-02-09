FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY tsconfig.base.json ./
COPY apps/server/package*.json ./apps/server/
COPY packages/shared/package*.json ./packages/shared/

RUN npm install

RUN npm install -g prisma@6.7.0

COPY . .

RUN prisma generate --schema=./apps/server/prisma/schema.prisma

RUN npm run build --workspace=server

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app ./

RUN npm install -g prisma@6.7.0

EXPOSE 3000

CMD ["sh", "-c", "prisma migrate deploy --schema=./apps/server/prisma/schema.prisma && npm run start:prod --workspace=server"]