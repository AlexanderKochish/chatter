FROM node:20-alpine

WORKDIR /app

COPY server/package*.json ./
COPY server/tsconfig*.json ./
COPY server/prisma ./prisma
COPY server/src ./src

COPY tsconfig.base.json ./

RUN rm -rf node_modules package-lock.json && \
    npm install --legacy-peer-deps --include=optional
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod", "--workspace=server"]



