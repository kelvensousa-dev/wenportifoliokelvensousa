import Stripe from 'stripe';

/**
 * Inicializacao preguicosa (lazy).
 *
 * A versao anterior fazia `throw` no escopo do modulo quando
 * STRIPE_SECRET_KEY estava ausente. Como o `next build` importa os modulos
 * para coletar as rotas, o build do Docker quebrava — o estagio `builder`
 * nao recebe variaveis de ambiente. Agora o erro so acontece no momento em
 * que o Stripe e realmente usado, em runtime.
 */
let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (client) return client;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY nao configurada no ambiente.');
  }

  client = new Stripe(secretKey, {
    apiVersion: '2024-06-20',
    appInfo: {
      name: 'Kelven Digital Platform',
      version: '0.1.0'
    }
  });

  return client;
}
