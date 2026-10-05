FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml turbo.json ./
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @bis/web run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Next.js standalone bundle output
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
