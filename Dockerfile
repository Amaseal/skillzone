FROM node:22-alpine AS builder
WORKDIR /app

# 1. FIX: Install tools AND create a 'python' symlink (node-gyp often looks for 'python', not 'python3')
RUN apk add --no-cache python3 make g++ && ln -sf python3 /usr/bin/python

RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./

# 2. FIX: Force better-sqlite3 to compile from source during install
RUN pnpm install --frozen-lockfile --config.build-from-source=better-sqlite3

COPY . .

# (Optional) Explicitly rebuild it just to be absolutely safe
RUN pnpm rebuild better-sqlite3

RUN pnpm run build
RUN pnpm prune --prod

FROM node:22-alpine
WORKDIR /app

# 3. FIX: Install libstdc++ in the runner. 
# The builder has it (via g++), but your final image is fresh and needs this to run the C++ code.
RUN apk add --no-cache libstdc++

COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]