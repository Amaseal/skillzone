FROM node:22-alpine AS builder
WORKDIR /app

# 1. Install build tools (build-base covers make/g++/gcc)
RUN apk add --no-cache python3 build-base && ln -sf python3 /usr/bin/python

RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./

# 2. Install dependencies
RUN pnpm install --frozen-lockfile

# 3. CRITICAL FIX: Explicitly force a rebuild of better-sqlite3
# This ensures the binary is compiled for this exact Alpine environment
RUN pnpm rebuild better-sqlite3

COPY . .

# 4. Create the data directory (Keep this!)
RUN mkdir -p data

RUN pnpm run build
RUN pnpm prune --prod

FROM node:22-alpine
WORKDIR /app

# 5. Runtime dependencies
RUN apk add --no-cache libstdc++

COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]