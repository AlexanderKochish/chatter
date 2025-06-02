
FROM node:20-alpine AS client

WORKDIR /app/client

COPY client/package.json client/package-lock.json ./
RUN npm install --silent

COPY client/ .
RUN npm run build

FROM node:20-alpine AS server

WORKDIR /app/server

COPY server/package.json server/package-lock.json ./
RUN npm install --legacy-peer-deps --include=optional --force


COPY server/ .
RUN npm run build

# ====================== Stage 3: Финальный образ ======================
FROM node:20-alpine

WORKDIR /app

COPY server/package.json server/package-lock.json ./
RUN npm install --production --ignore-scripts


COPY --from=client /app/client/dist ./client/dist
COPY --from=server /app/server/dist ./server/dist


COPY server/.env .env 

ENV PORT=3000
EXPOSE $PORT

CMD ["node", "server/dist/main.js"]

