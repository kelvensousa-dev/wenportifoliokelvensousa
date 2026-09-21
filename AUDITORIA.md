# Auditoria técnica — Kelven Studio (21/09/2026)

Resumo do que foi encontrado e do que foi corrigido nesta revisão.
Gravidade: **CRÍTICO** (impede lançamento ou expõe dados/dinheiro), **ALTO**, **MÉDIO**, **BAIXO**.

## 1. Críticos (corrigidos)

| # | Problema | Onde | Correção |
|---|----------|------|----------|
| 1 | O checkout era uma **simulação**: pedia número do cartão e CVV no próprio site, "autorizava" com o código fixo `123456` exibido na tela e mostrava "Pedido confirmado" + Product Key falsa sem cobrar nada. | `src/app/checkout/page.tsx` | Reescrito. Resumo do produto escolhido e redirecionamento para a página segura do **Stripe Checkout**. Nenhum dado de cartão passa pelo servidor. |
| 2 | **Banco de dados exposto na internet** (`ports: "5433:5432"`). | `docker-compose.yml` | Porta removida; banco só na rede interna. |
| 3 | Arquivo `src/next-auth.d.ts` continha **SQL** (cópia da migração). O TypeScript tenta compilá-lo e o build falha. Também havia cópias soltas de `migration.sql` e `migration_lock.toml` em `src/`. | `src/` | Arquivos removidos. |
| 4 | **Catálogos duplicados e incompatíveis**: a home usava IDs que o portfólio não conhecia; o portfólio usava IDs que não existiam no banco. Comprar pelo portfólio era impossível. | `src/lib/products.ts`, `prisma/seed.ts` | Catálogo único; o seed importa a mesma lista. |
| 5 | Nenhum passo aplicava as **migrações em produção** — o banco subia vazio. | `Dockerfile`, `docker-compose.yml` | Novo serviço `migrate` (roda `prisma migrate deploy` + seed antes do app). |
| 6 | Formulários de **contato, newsletter e orçamento descartavam os dados** (só mostravam "enviado"). | home, `/contato`, portfólio | Nova rota `POST /api/leads` gravando no banco, com validação, limite por IP e campo anti-robô. |
| 7 | Webhook do Stripe **não idempotente**: reenvios reprocessavam o pedido; pedido inexistente gerava erro 500 e o Stripe reenviava por dias; não conferia valor pago nem `payment_status`. As licenças nunca eram geradas. | `src/app/api/webhooks/stripe/route.ts` | Reescrito: transação, só avança pedidos `PENDING`, confere valor, trata pagamentos assíncronos/expirados e **gera a Product Key**. |

## 2. Altos (corrigidos)

- **Open redirect** no login: `callbackUrl=//site-falso.com` passava na checagem `startsWith('/')`. → `safeInternalPath()` em `src/lib/security.ts`.
- **Sem proteção contra força bruta** no login, cadastro e formulários. → Limitador com Redis (`src/lib/rate-limit.ts`) + `limit_req` no Nginx.
- **Enumeração de contas por tempo de resposta** no login. → Comparação bcrypt também para e-mails inexistentes.
- **Sem cabeçalhos de segurança** (CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy). → `next.config.mjs`.
- **Sem HTTPS** no Nginx. → Configuração TLS 1.2/1.3 com redirecionamento 80→443 e suporte a Let's Encrypt.
- Cabeçalho `x-middleware-subrequest` repassado ao app (vetor do CVE-2025-29927). A versão travada no lockfile (Next 14.2.35) já é corrigida; o Nginx agora também descarta o cabeçalho.
- Admin rebaixado mantinha acesso por até 7 dias. → Privilégio revalidado no banco a cada 5 minutos.
- Páginas do admin dependiam só do middleware. → Segunda verificação no servidor (`requireAdmin()`), consultando o banco.
- Painel admin exibia **números inventados** como se fossem reais (US$ 84.290, 428 pedidos, e-mails fictícios, "WhatsApp conectado", "2FA"). → Overview, Faturamento, Leads e Produtos agora leem o banco; módulos sem backend dizem honestamente "em desenvolvimento".
- `.env` era copiado para dentro da imagem Docker. → `.dockerignore`; variáveis públicas passam como *build args*.
- Cadastro simultâneo com o mesmo e-mail gerava erro 500 (P2002). → Tratado.

## 3. Médios (corrigidos)

- `/dashboard` (o portfólio) exigia login: o link "Portfólio" levava visitantes ao login. → Portfólio público; `/dashboard/*` e `/admin` seguem protegidos.
- Área do cliente mostrava notificações fixas (incluindo "2FA confirmado", que não existe). → `/dashboard/notificacoes` agora é **Minhas compras**, com pedidos e Product Keys reais.
- Botão de compra exibia o preço em **R$** para produtos cobrados em **US$**; visitante sem login recebia um `alert` genérico. → Corrigido; redireciona ao login e volta ao checkout.
- `cancel_url` do Stripe apontava para `/products/...` (404).
- Fontes Manrope/Space Grotesk referenciadas mas **nunca carregadas**. → `next/font` (auto-hospedado).
- Classe `prose` sem o plugin instalado: títulos das páginas legais sem formatação. → CSS equivalente.
- Tradutor de idiomas: remontava o app inteiro a cada troca de idioma (apagando formulários) e sobrescrevia textos alterados pelo React com traduções antigas. → Corrigido.
- Textos sem acento em login/cadastro (também impediam a tradução).
- "Lembrar de mim" e "Esqueci minha senha" sem ação; aceite de termos não validado no servidor.
- Sem `robots.txt`, `sitemap.xml`, metadados Open Graph, página 404 e tela de erro amigável. → Adicionados.
- Título do site era "Mounday Tech" (marca diferente). → Kelven Studio.
- Proxy Nginx forçava `Connection: upgrade` em toda requisição; `client_max_body_size 50m` sem necessidade.
- `Dockerfile` usava `npm install` (build não reprodutível) e faltava OpenSSL para o Prisma no Alpine; sem healthcheck.
- MinIO com imagem `latest` e iniciado sem uso. → Perfil opcional `storage`.

## 4. Responsividade (desktop / tablet / celular)

- Menu "hambúrguer" existia apenas como ícone sem ação: no celular era impossível chegar ao login, contato ou portfólio. → `MobileMenu` em todas as páginas públicas.
- Barra lateral do admin sumia abaixo de 1024 px sem alternativa. → Navegação horizontal para celular/tablet.
- Títulos `text-5xl` estouravam a largura em telas de 320–375 px. → Tamanhos progressivos (`text-4xl sm:text-5xl ...`) e `break-words`.
- Modais sem fechar com Esc e com a página rolando por trás no celular. → Componente `Modal` acessível (bottom-sheet no celular).
- Campos com fonte < 16 px causavam zoom automático no iPhone. → Corrigido no CSS.
- Filtros de categoria agora rolam horizontalmente no celular; tabelas do admin com rolagem própria.

## 5. Pendências que dependem de você (não são código)

1. **Conteúdo e números**: "2.000+ makers", "180+ projetos", "98% de satisfação", "+38% conversão" e o gráfico "$84,290" são textos de exemplo. Anúncio com números não comprováveis pode ser questionado pelo CDC. Confirme ou substitua.
2. **Redes sociais e WhatsApp**: preencha `NEXT_PUBLIC_*` no `.env` (os botões ficam ocultos enquanto vazios).
3. **Stripe**: conta ativada, chaves `live` e webhook cadastrado (ver `DEPLOY.md`). Pix exige preço em BRL e ativação no Stripe Brasil — hoje o catálogo cobra em USD.
4. **Recuperação de senha e confirmação de e-mail**: exigem um provedor de e-mail transacional (Resend, Amazon SES, SendGrid). Por ora "Esqueci minha senha" leva ao contato.
5. **Termos e Política de Privacidade**: textos genéricos. Recomendo revisão por advogado (LGPD, CDC, direito de arrependimento de 7 dias para compras online).
6. **Dependências sem uso** no `package.json` (`@aws-sdk/*`, `bullmq`, `oauth`, `openid-client`, `framer-motion`, `dotenv`). Não removi para não dessincronizar o `package-lock.json` sem acesso à internet; pode remover com `npm uninstall ...` e commitar o lockfile.

## 6. Ferramentas adicionais recomendadas

| Ferramenta | Para quê | Prioridade |
|-----------|----------|-----------|
| **Cloudflare** (plano gratuito) | DNS, CDN, proteção DDoS, WAF, certificado. Esconde o IP do servidor. | Alta |
| **Firewall do servidor** (`ufw`) | Liberar só 22, 80 e 443. SSH apenas com chave. | Alta |
| **Backup automático do PostgreSQL** | `pg_dump` diário enviado para fora do servidor (ex.: S3/Backblaze), com teste de restauração. | Alta |
| **Sentry** | Captura de erros em produção com alerta. | Média |
| **UptimeRobot / Better Stack** | Monitorar `https://SEU-DOMINIO/api/health` e avisar se cair. | Média |
| **Dependabot / `npm audit`** | Avisos de vulnerabilidades nas bibliotecas. | Média |
| **fail2ban** | Bloqueio de IPs que atacam o SSH. | Média |

## 7. Limitação desta revisão

O ambiente desta auditoria não tinha acesso à internet, então **não foi possível rodar `npm ci`, `npm run typecheck` e `npm run build`**. Todo o código passou por verificação de sintaxe (55 arquivos, 0 erros) e revisão manual de tipos, mas o primeiro build deve ser feito na IDE antes do deploy — o arquivo `PROMPT_GEMINI.md` contém as instruções exatas.
