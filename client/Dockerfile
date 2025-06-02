FROM node:20-slim

WORKDIR /app

COPY client/package*.json ./
COPY client/tsconfig*.json ./
COPY client/vite.config.ts ./
COPY client/index.html ./
COPY client/src ./src

COPY tsconfig.base.json ./

RUN rm -rf node_modules package-lock.json && npm install --legacy-peer-deps

RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host"]


