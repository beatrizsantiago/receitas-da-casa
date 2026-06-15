# syntax=docker/dockerfile:1

# ─────────────────────────────────────────
# Stage 1 — Build (compila o NestJS + gera o Prisma Client)
# ─────────────────────────────────────────
FROM node:22-bookworm-slim AS builder
WORKDIR /app

# openssl é exigido pelo Prisma
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

# ─────────────────────────────────────────
# Stage 2 — Runtime (apenas deps de produção + dist)
# ─────────────────────────────────────────
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma

# Instala só deps de produção e regenera o client para esse node_modules.
# `prisma` e `@prisma/client` estão em dependencies, então o CLI fica
# disponível em runtime para rodar as migrations.
RUN npm ci --omit=dev \
  && npx prisma generate \
  && npm cache clean --force

COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Aplica as migrations pendentes e sobe a API.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
