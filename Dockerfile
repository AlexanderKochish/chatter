FROM node:20-alpine

WORKDIR /app

COPY package*.json .
COPY tsconfig*.json .

RUN npm install --workspaces --include=optional

COPY server/package*.json ./server/
COPY server/src ./server/src
COPY server/prisma ./server/prisma

COPY client/package*.json ./client/
COPY client/src ./client/src
COPY client/index.html ./client/
COPY client/vite.config.ts ./client/

RUN npm run build --workspace=server
RUN npm run build --workspace=client

CMD ["sh", "-c", "npm run start:prod --workspace=server & npm run preview --workspace=client -- --host 0.0.0.0 --port 4173"]