# Prompt para o Gemini (Google Antigravity)

Copie o bloco abaixo e cole no agente do Antigravity, com a pasta do projeto aberta.

---

```
Você é um engenheiro full stack sênior revisando um projeto Next.js 14 (App Router) + TypeScript + Prisma 5 (PostgreSQL) + NextAuth 4 + Stripe, empacotado com Docker Compose e Nginx.

CONTEXTO IMPORTANTE
Este projeto acabou de passar por uma auditoria de segurança e correção completa. Leia primeiro os arquivos AUDITORIA.md e DEPLOY.md na raiz. As decisões descritas neles são intencionais e NÃO devem ser revertidas nem reescritas.

SUA TAREFA É SOMENTE VERIFICAR E COMPILAR, NÃO REDESENHAR:

1. Rode, nesta ordem, e me mostre a saída de cada comando:
   npm ci
   npx prisma generate
   npm run typecheck
   npm run build

2. Se houver ERROS de TypeScript ou de build, corrija APENAS o necessário para compilar, com a menor alteração possível, preservando a lógica existente. Para cada correção, diga o arquivo, a linha, o erro e o que mudou.

3. Suba o ambiente local e teste o fluxo:
   cp .env.example .env   (preencha valores de teste; Stripe em modo teste;
                           para rodar fora do Docker use localhost:5433 no DATABASE_URL
                           e localhost:6379 no REDIS_URL)
   docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d postgres redis
   npx prisma migrate deploy
   npx prisma db seed
   npm run dev
   Verifique: home, /dashboard (portfólio público), /solucoes/orbit-crm-pro, /checkout?produto=orbit-crm-pro, /contato, /cadastre-se, /login, /dashboard/notificacoes (exige login), /admin (exige admin), /api/health.
   Teste as larguras 375px (celular), 768px (tablet) e 1440px (desktop) e relate qualquer quebra de layout.

REGRAS — NÃO FAÇA:
- NÃO recrie o checkout com campos de cartão. O pagamento é feito exclusivamente pelo Stripe Checkout hospedado.
- NÃO volte a expor a porta do PostgreSQL no docker-compose.
- NÃO remova: src/lib/security.ts (safeInternalPath, clientIp), src/lib/rate-limit.ts, src/lib/require-admin.ts, os cabeçalhos de segurança do next.config.mjs, o descarte do cabeçalho x-middleware-subrequest no Nginx, a idempotência do webhook do Stripe.
- NÃO transforme /dashboard em rota protegida (ela é o portfólio público; /dashboard/* é que é protegido).
- NÃO recoloque números/dados fictícios nas telas do admin.
- NÃO crie um segundo catálogo de produtos: a fonte única é src/lib/products.ts (o seed importa esse arquivo).
- NÃO adicione dependências novas sem me perguntar; se adicionar, atualize o package-lock.json.
- NÃO reative experimental.typedRoutes.
- NÃO faça commit do arquivo .env.

Ao final, entregue: (a) lista de comandos executados e resultados, (b) lista de arquivos alterados com justificativa, (c) qualquer problema que exija minha decisão.
```
