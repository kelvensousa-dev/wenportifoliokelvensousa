# Deploy em produção

Pré-requisitos no servidor: Docker + Docker Compose v2, domínio apontando para o IP do servidor, portas 80 e 443 liberadas.

## 1. Configuração

```bash
cp .env.example .env
nano .env
```

Obrigatório trocar: `POSTGRES_PASSWORD` (e a mesma senha dentro de `DATABASE_URL`), `REDIS_PASSWORD` (e em `REDIS_URL`), `NEXTAUTH_SECRET`, `NEXTAUTH_URL` e `NEXT_PUBLIC_APP_URL` (ambos `https://SEU-DOMINIO`), chaves do Stripe e `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` (mínimo 12 caracteres).

Gerar segredos: `openssl rand -base64 32`

## 2. Primeiro deploy (ainda sem certificado)

No `.env`, adicione temporariamente:

```
NGINX_CONF=nginx.http-only.conf
```

```bash
docker compose build
docker compose up -d
docker compose logs migrate      # deve terminar com "Seed concluido."
```

## 3. Certificado HTTPS (Let's Encrypt)

```bash
docker compose run --rm certbot certonly --webroot -w /var/www/certbot \
  -d SEU-DOMINIO -d www.SEU-DOMINIO --email SEU-EMAIL --agree-tos --no-eff-email

cp -L infra/nginx/letsencrypt/live/SEU-DOMINIO/fullchain.pem infra/nginx/certs/
cp -L infra/nginx/letsencrypt/live/SEU-DOMINIO/privkey.pem   infra/nginx/certs/
```

Remova a linha `NGINX_CONF=...` do `.env` (volta para `nginx.conf`, com HTTPS) e rode:

```bash
docker compose up -d nginx
```

Renovação (a cada 60 dias, via cron):

```bash
docker compose run --rm certbot renew && \
cp -L infra/nginx/letsencrypt/live/SEU-DOMINIO/*.pem infra/nginx/certs/ && \
docker compose restart nginx
```

**Alternativa mais simples:** Cloudflare com modo "Full (strict)" e um *Origin Certificate* gerado no painel (válido por 15 anos), salvo como `fullchain.pem` e `privkey.pem` em `infra/nginx/certs/`. Nesse caso, descomente o bloco `real_ip` no `nginx.conf`.

## 4. Stripe

1. Painel Stripe → Desenvolvedores → Webhooks → Adicionar endpoint: `https://SEU-DOMINIO/api/webhooks/stripe`
2. Eventos: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `checkout.session.expired`
3. Copie o "Signing secret" para `STRIPE_WEBHOOK_SECRET` e rode `docker compose up -d app`.
4. Faça uma compra de teste com chaves `sk_test_` e o cartão `4242 4242 4242 4242` antes de trocar para `sk_live_`.

## 5. Atualizações futuras

```bash
git pull
docker compose build
docker compose up -d   # o serviço migrate aplica novas migrações automaticamente
```

## 6. Checklist antes de abrir ao público

- [ ] `https://SEU-DOMINIO/api/health` responde `{"status":"ok","database":"ok"}`
- [ ] Cadastro, login e logout funcionando
- [ ] Compra de teste gera a Product Key em "Minhas compras"
- [ ] Formulário de contato aparece em Admin → Leads
- [ ] `/admin` bloqueado para usuário comum
- [ ] Teste em celular (Android e iPhone), tablet e desktop
- [ ] Nota A em https://securityheaders.com e https://www.ssllabs.com/ssltest/
- [ ] Backup do banco agendado e restauração testada
- [ ] Firewall: somente portas 22, 80 e 443 abertas
