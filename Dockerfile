FROM node:20-alpine AS client-builder
WORKDIR /app

COPY client/package.json ./client/

RUN cd client && npm install

COPY client ./client
RUN cd client && npm run build

FROM node:20-alpine AS server-builder
WORKDIR /app

COPY server/package.json ./server/
RUN cd server && npm install
COPY server ./server
RUN cd server && npm run build

FROM node:20-alpine
WORKDIR /app

COPY --from=client-builder /app/client/dist ./client/dist
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/node_modules ./server/node_modules

RUN npm install -g serve

CMD sh -c '(cd server && node dist/main.js) & serve -s client/dist -l $PORT'