# Use Debian Slim (better compatibility for C++ modules like better-sqlite3)
FROM node:22-slim AS builder
WORKDIR /app

# Install basic build tools (python3, make, g++)
RUN apt-get update && apt-get install -y python3 make g++

RUN npm install -g pnpm

# Force pnpm to create a flat node_modules folder (fixes Docker copying issues)
RUN echo "node-linker=hoisted" > .npmrc

COPY package.json pnpm-lock.yaml ./

# Install dependencies
# pnpm will now see the "onlyBuiltDependencies" in package.json and 
# ACTUALLY run the build scripts for better-sqlite3
RUN pnpm install --frozen-lockfile

COPY . .

# Create the data directory to prevent 'CANTOPEN' error
RUN mkdir -p data

RUN pnpm run build
RUN pnpm prune --prod

# ---------------------------------------
# Runner Stage
# ---------------------------------------
FROM node:22-slim
WORKDIR /app

# Install runtime libraries for C++ modules
# libsqlite3-0 is helpful, though better-sqlite3 bundles its own, 
# but installing standard libs prevents missing shared object errors.
RUN apt-get update && apt-get install -y libstdc++6 openssl

# Copy the "hoisted" (flat) node_modules from builder
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/build build/
COPY package.json .

# Create data directory in runner
RUN mkdir -p data

EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]