# Kelven Studio Platform

Plataforma internacional de produtos digitais, licenciamento e automações.

## Estrutura

```text
src/
  app/                 # App Router, layout, estilos e páginas
  lib/                 # Prisma e dados compartilhados
  modules/             # Domínios: auth, billing, catalog, leads, releases
prisma/                # Schema PostgreSQL/Prisma
infra/nginx/            # Proxy reverso e certificados de produção
Dockerfile              # Build multi-stage standalone do Next.js
docker-compose.yml      # App, PostgreSQL, Redis, MinIO e Nginx
```

## Desenvolvimento local

```bash
cp .env.example .env
npm install
npx prisma generate
npm run dev
```

A aplicação fica em `http://localhost:3000`.

## Deploy via Docker

Preencha `.env` com segredos reais, configure os certificados em `infra/nginx/certs` e execute:

```bash
docker compose up -d --build
```

Antes do primeiro uso, aplique as migrações no container da aplicação com `npx prisma migrate deploy`.

## Próximos módulos

- Route Handlers para catálogo, leads, checkout e webhooks idempotentes.
- Sessão JWT com refresh token HttpOnly, Argon2 e validação Zod.
- Filas BullMQ para e-mails, WhatsApp e entrega de licenças.
- URLs assinadas S3/MinIO para releases privados.
- `/admin` com RBAC, métricas e gestão de versões SemVer.
