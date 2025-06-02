FROM node:20-alpine

WORKDIR /app

COPY package*.json .
COPY tsconfig*.json .

COPY client/package*..json ./client/
COPY client/tsconfig*.json ./client/
COPY client/vite.config.ts ./client/
COPY client/index.html ./client/
COPY client/src ./client/src

RUN npm install -g npm@latest
RUN npm install --workspace=client --legacy-peer-deps
RUN npm run build:client

EXPOSE 4173

CMD ["npm", "--workspace=client", "run", "preview", "--", "--host"]


