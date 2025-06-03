
FROM node:18 AS client-builder
WORKDIR /app
COPY client ./client
WORKDIR /app/client
RUN npm install && npm run build

FROM node:18 AS server-builder
WORKDIR /app
COPY server ./server
WORKDIR /app/server
RUN npm install && npm run build

COPY --from=client-builder /app/client/dist ./public

FROM node:18 AS production
WORKDIR /app
COPY --from=server-builder /app/server .

RUN npm install --only=production

EXPOSE 3000

CMD ["node", "dist/main"]


