# --- Stage 1: Build ---
FROM node:22.12.0 AS build
WORKDIR /app
COPY . .

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile
RUN pnpm run build

# --- Stage 2: Serve static files directly ---
FROM busybox:stable-glibc

WORKDIR /app
COPY --from=build /app/build ./

# Coolify’s Caddy will serve these files automatically when port 80 is exposed
EXPOSE 80

# Start a simple HTTP file server (for local testing / Coolify health checks)
CMD ["busybox", "httpd", "-f", "-v", "-p", "80"]