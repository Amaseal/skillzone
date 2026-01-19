FROM node:22-alpine AS builder
WORKDIR /app

# Install tools and Python (Fix #1 from before)
RUN apk add --no-cache python3 make g++ && ln -sf python3 /usr/bin/python

RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./

# Install deps (Fix #2 from before)
RUN pnpm install --frozen-lockfile --config.build-from-source=better-sqlite3

COPY . .

# --- NEW FIX START ---
# Create the data directory so the build doesn't crash when initializing the DB
RUN mkdir -p data
# --- NEW FIX END ---

RUN pnpm run build
RUN pnpm prune --prod

FROM node:22-alpine
WORKDIR /app

# Runtime dependencies (Fix #3 from before)
RUN apk add --no-cache libstdc++

COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]