FROM node:24-alpine AS base

FROM base AS builder
RUN apk update && \
    apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app
RUN npm install -g turbo@latest
COPY . .

 
RUN turbo prune --scope=@my-fullstack-setup/server --docker
RUN ls -R /app/apps/server
 
# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/full/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN corepack enable && \
    corepack prepare --activate
RUN pnpm install --frozen-lockfile && \
    pnpm store prune && \
    rm -rf /root/.npm
RUN npx turbo run build --filter=@my-fullstack-setup/server

FROM base AS runner
WORKDIR /app
 
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs
USER nodejs
COPY --from=installer --chown=nodejs:nodejs /app .

WORKDIR /app/apps/server
CMD ["node", "./dist/index.js"]