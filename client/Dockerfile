FROM node:22.11-slim

WORKDIR /app/client

COPY client/package*.json ./
COPY client/tsconfig*.json ./
COPY client/src ./src
COPY client/vite.config.ts ./
COPY client/.env .env
COPY client/index.html ./   

WORKDIR /app
COPY tsconfig.base.json ./tsconfig.base.json

WORKDIR /app/client

ENV VITE_BASE_URL=http://localhost:3000/api

RUN npm install
RUN npm run build

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host"]
