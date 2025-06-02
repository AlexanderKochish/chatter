# Stage 1: Client build (Vite)
FROM node:22-alpine AS client
WORKDIR /app/client

# 1. Copy package files first for better caching
COPY client/package.json .
COPY client/package-lock.json* ./

# 2. Install client dependencies
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; \
    else npm install --legacy-peer-deps --force; fi

# 3. Copy tsconfig files from root
COPY tsconfig*.json ./

# 4. Copy client source
COPY client .

# 5. Build client
RUN npm run build

# Stage 2: Server build (NestJS)
FROM node:22-alpine AS server
WORKDIR /app/server

# 1. Install Nest CLI globally
RUN npm install -g @nestjs/cli

# 2. Copy package files first
COPY server/package.json .
COPY server/package-lock.json* ./

# 3. Install server dependencies
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps --include=optional; \
    else npm install --legacy-peer-deps --include=optional --force; fi

# 4. Copy tsconfig files from root
COPY tsconfig*.json ./

# 5. Copy server source
COPY server .

# 6. Build server
RUN npm run build

# Final stage
FROM node:22-alpine
WORKDIR /app

# 1. Install serve for static files
RUN npm install -g serve

# 2. Copy client build
COPY --from=client /app/client/dist ./client/dist

# 3. Copy server build and node_modules
COPY --from=server /app/server/dist ./server/dist
COPY --from=server /app/server/node_modules ./server/node_modules

# 4. Health check for Railway
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT || exit 1

# 5. Start both processes
CMD sh -c 'node server/dist/main.js & serve -s client/dist -l $PORT'