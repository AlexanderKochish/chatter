
FROM node:20-alpine AS client-builder
WORKDIR /app

COPY tsconfig*.json ./
COPY client/package.json client/package-lock.json ./client/

RUN cd client && npm install --omit=dev && npm cache clean --force

COPY client ./client

RUN cd client && npm run build

FROM node:20-alpine AS server-builder
WORKDIR /app

COPY tsconfig*.json ./
COPY server/package.json server/package-lock.json ./server/

RUN cd server && npm install --omit=dev --max_old_space_size=4096 && npm cache clean --force

COPY server ./server

RUN cd server && npm run build

FROM node:20-alpine
WORKDIR /app

COPY --from=client-builder /app/client/dist ./client/dist
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/node_modules ./server/node_modules

RUN npm install -g serve

CMD sh -c '(cd server && node --max-old-space-size=4096 dist/main.js) & serve -s client/dist -l $PORT'