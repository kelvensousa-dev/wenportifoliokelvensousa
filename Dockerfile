# syntax=docker/dockerfile:1

# ── Dependencias ──────────────────────────────────────────────
FROM node:20-alpine AS deps
# O Prisma 5 precisa de OpenSSL no Alpine; sem ele o client falha em runtime.
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json ./
# `npm ci` instala exatamente o que esta no lockfile (build reproduzivel).
RUN npm ci

# ── Build ─────────────────────────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variaveis NEXT_PUBLIC_* sao embutidas no JavaScript durante o build.
# Elas chegam como build args (ver docker-compose.yml), pois o .env NAO e
# copiado para a imagem (.dockerignore) — assim nenhum segredo fica gravado.
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_CONTACT_EMAIL
ARG NEXT_PUBLIC_WHATSAPP_NUMBER
ARG NEXT_PUBLIC_LINKEDIN_URL
ARG NEXT_PUBLIC_INSTAGRAM_URL
ARG NEXT_PUBLIC_COMPANY_NAME
ARG NEXT_PUBLIC_COMPANY_DOCUMENT
ARG NEXT_PUBLIC_COMPANY_ADDRESS
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_CONTACT_EMAIL=$NEXT_PUBLIC_CONTACT_EMAIL \
    NEXT_PUBLIC_WHATSAPP_NUMBER=$NEXT_PUBLIC_WHATSAPP_NUMBER \
    NEXT_PUBLIC_LINKEDIN_URL=$NEXT_PUBLIC_LINKEDIN_URL \
    NEXT_PUBLIC_INSTAGRAM_URL=$NEXT_PUBLIC_INSTAGRAM_URL \
    NEXT_PUBLIC_COMPANY_NAME=$NEXT_PUBLIC_COMPANY_NAME \
    NEXT_PUBLIC_COMPANY_DOCUMENT=$NEXT_PUBLIC_COMPANY_DOCUMENT \
    NEXT_PUBLIC_COMPANY_ADDRESS=$NEXT_PUBLIC_COMPANY_ADDRESS \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ── Migracoes (executado uma vez a cada deploy) ───────────────
# Antes nao havia nenhum passo que aplicasse as migracoes em producao:
# o banco subia vazio e a aplicacao quebrava na primeira consulta.
FROM builder AS migrator
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed"]

# ── Imagem final (enxuta, sem codigo-fonte nem devDependencies) ─
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health >/dev/null || exit 1
CMD ["node", "server.js"]
