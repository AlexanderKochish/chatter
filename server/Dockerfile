FROM node:22.11-slim

WORKDIR /app

COPY server/package*.json ./
COPY server/tsconfig*.json ./
COPY server/prisma ./prisma
COPY server/src ./src
COPY tsconfig.base.json ../tsconfig.base.json

RUN npm install --legacy-peer-deps
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]


