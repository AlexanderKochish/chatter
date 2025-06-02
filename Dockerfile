FROM node:20-alpine AS client-builder
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY client/package*.json ./client/

RUN cd client && npm install --legacy-peer-deps --omit=dev --include=optional

COPY . .

RUN npm run build:client --workspace=client

FROM node:20-alpine AS server-builder
WORKDIR /app

COPY server/package*.json ./server/
COPY server/tsconfig*.json ./server/

RUN cd server && \
    npm install --legacy-peer-deps --include=optional && \
    npx prisma generate

COPY server/src ./server/src
COPY tsconfig.base.json .

RUN cd server && npm run build

FROM node:20-alpine
WORKDIR /app

COPY --from=server-builder /app/server/package*.json ./server/
COPY --from=server-builder /app/server/node_modules ./server/node_modules
COPY --from=server-builder /app/server/prisma ./server/prisma

COPY --from=client-builder /app/client/dist ./client/dist
COPY --from=server-builder /app/server/dist ./server/dist

RUN npm install -g serve

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT || exit 1

CMD ["sh", "-c", "cd server && npx prisma migrate deploy && node dist/main.js & serve -s client/dist -l $PORT"]