FROM node:20-alpine AS client-builder
WORKDIR /app

COPY client/package.json ./client/
RUN cd client && npm install && npm cache clean --force

COPY client ./client
COPY tsconfig*.json ./
RUN cd client && npm run build

FROM node:20-alpine AS server-builder
WORKDIR /app

COPY server/package.json ./server/
RUN cd server && npm install --omit=dev && npm cache clean --force
COPY server ./server
COPY tsconfig*.json ./
RUN cd server && npm run build

FROM node:20-alpine
WORKDIR /app

COPY --from=client-builder /app/client/dist ./client/dist
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/node_modules ./server/node_modules

RUN npm install -g serve && \
    rm -rf /var/cache/apk/* /tmp/*

CMD sh -c '(cd server && node dist/main.js) & serve -s client/dist -l $PORT'