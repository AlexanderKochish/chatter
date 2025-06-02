FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package*.json .
COPY client/package*.json ./client/

RUN npm install --legacy-peer-deps --omit=dev --include=optional

COPY . .

RUN npm run build:client

EXPOSE 4173
CMD ["npm", "--workspace=client", "run", "preview", "--", "--host"]


