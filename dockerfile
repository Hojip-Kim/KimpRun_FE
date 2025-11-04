FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY . .
COPY .env.production ./

RUN npm run build

FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache dumb-init

# Create node user and setup permissions
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env.production ./
COPY --from=builder /app/next.config.mjs ./

# Create cache directory with proper permissions
RUN mkdir -p /app/.next/cache && \
    chown -R nextjs:nodejs /app/.next && \
    chmod -R 755 /app/.next/cache

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

# Switch to non-root user
USER nextjs

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]