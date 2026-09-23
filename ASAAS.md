# Pagamentos em reais — Asaas

O site cobra em **reais** pelo Asaas (Pix, boleto e cartão nacional) e em
**dólar** pelo Stripe (cartão internacional). Os dois gateways usam o mesmo
pedido e a mesma liberação de licença (`src/modules/billing/fulfillment.ts`).

## Arquivos

| Arquivo | Função |
| --- | --- |
| `src/lib/asaas.ts` | Cliente da API do Asaas (clientes, cobranças) |
| `src/lib/cpf-cnpj.ts` | Validação e máscara de CPF/CNPJ |
| `src/app/api/checkout/asaas/route.ts` | Cria cliente + pedido + cobrança e devolve a fatura |
| `src/app/api/webhooks/asaas/route.ts` | Recebe a confirmação e libera a licença |
| `src/components/AsaasCheckoutForm.tsx` | Campo de CPF/CNPJ e botão no checkout |
| `prisma/migrations/20260923000000_asaas` | Novas colunas e tabela `WebhookEvent` |

## Configuração (Sandbox)

1. Crie a conta em https://sandbox.asaas.com e gere uma chave de API
   (Integrações → Chaves de API).
2. No `.env`, preencha `ASAAS_API_URL`, `ASAAS_API_KEY` (**sem o `$` inicial**)
   e `ASAAS_WEBHOOK_TOKEN` (`openssl rand -hex 32`).
3. No Asaas: Integrações → Webhooks → Adicionar:
   - URL: `https://www.kelvensousa.com.br/api/webhooks/asaas`
   - Token de autenticação: o mesmo valor de `ASAAS_WEBHOOK_TOKEN`
   - Eventos de cobrança: `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`,
     `PAYMENT_DELETED`, `PAYMENT_REFUNDED`, `PAYMENT_CHARGEBACK_REQUESTED`,
     `PAYMENT_CREDIT_CARD_CAPTURE_REFUSED`, `PAYMENT_REPROVED_BY_RISK_ANALYSIS`
4. Na VPS: `docker compose build && docker compose up -d`
   (o serviço `migrate` aplica a migração e grava os preços em reais).

## Teste

1. Compre um produto escolhendo "Pagar em reais" e informe um CPF válido.
2. Na fatura do Sandbox, pague (ou use "Confirmar pagamento" no painel).
3. A licença deve aparecer em **Minhas compras**.
4. Se não aparecer: Asaas → Integrações → Logs de Webhooks mostra o código
   HTTP que o site respondeu; `docker compose logs app | grep ASAAS` mostra o erro.

## Produção

Troque `ASAAS_API_URL` para `https://api.asaas.com/v3`, use a chave de
produção e cadastre o webhook de novo (Sandbox e Produção são independentes).
Para voltar ao site automaticamente após pagar, cadastre o domínio em
Configurações da conta → Informações e defina `ASAAS_SUCCESS_REDIRECT=true`.
