
FROM node:22-alpine AS client-builder
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY client/package.json client/package-lock.json ./client/

RUN cd client && npm install --legacy-peer-deps

COPY client ./client
COPY tsconfig*.json ./

RUN cd client && npm run build

FROM node:22-alpine AS server-builder
WORKDIR /app

RUN npm install -g @nestjs/cli

COPY server/package.json server/package-lock.json ./server/

RUN cd server && npm install --legacy-peer-deps --include=optional

COPY server ./server
COPY tsconfig*.json ./

RUN cd server && npm run build

FROM node:22-alpine
WORKDIR /app

RUN npm install -g serve

COPY --from=server-builder /app/server/node_modules ./server/node_modules
COPY --from=server-builder /app/server/package.json ./server/

COPY --from=client-builder /app/client/dist ./client/dist
COPY --from=server-builder /app/server/dist ./server/dist

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT || exit 1

CMD ["sh", "-c", "node server/dist/main.js & serve -s client/dist -l $PORT"]