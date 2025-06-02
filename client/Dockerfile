FROM node:22.11-slim

WORKDIR /app

COPY client/package*.json ./
COPY client/tsconfig*.json ./
COPY client/vite.config.ts ./
COPY client/index.html ./
COPY client/.env .env
COPY client/src ./src

COPY tsconfig.base.json ../tsconfig.base.json

RUN rm -rf node_modules client/node_modules client/package-lock.json

RUN npm install --legacy-peer-deps
RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host"]

