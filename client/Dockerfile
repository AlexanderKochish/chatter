FROM node:22.11-slim

WORKDIR /app

COPY client/package*.json ./
COPY tsconfig.base.json ../tsconfig.base.json

RUN rm -rf node_modules package-lock.json \
 && npm install --legacy-peer-deps

COPY client/tsconfig*.json ./
COPY client/vite.config.ts ./
COPY client/index.html ./
COPY client/.env .env
COPY client/src ./src

RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host"]

