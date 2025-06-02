
FROM node:20-alpine AS client-builder
WORKDIR /app
COPY client/package.json client/package-lock.json ./client/
RUN cd client && npm ci
COPY client ./client
RUN cd client && npm run build

FROM node:20-alpine AS server-builder
WORKDIR /app
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci
COPY server ./server
RUN cd server && npm run build

FROM node:20-alpine
WORKDIR /app

COPY --from=client-builder /app/client/dist ./client/dist

COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/package.json ./server/
COPY --from=server-builder /app/server/node_modules ./server/node_modules

RUN npm install -g serve

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

CMD sh -c '(cd server && node dist/main.js) & serve -s client/dist -l $PORT'