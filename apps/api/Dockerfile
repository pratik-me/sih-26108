FROM node:20-slim AS builder

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml turbo.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/
COPY prisma/ ./prisma/
COPY scripts/ ./scripts/

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @bis/api run build

FROM node:20-slim AS runner
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/prisma ./prisma

ENV PORT=4000
ENV HOST=0.0.0.0
ENV NODE_ENV=production

EXPOSE 4000

CMD ["node", "apps/api/dist/main"]
