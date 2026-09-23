import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';

/**
 * Regras de pedido comuns a TODOS os gateways (Stripe e Asaas).
 *
 * Antes esta logica vivia dentro do webhook do Stripe. Com dois gateways,
 * ela precisa ser unica: o pedido e a licenca nao podem depender de por onde
 * o cliente pagou.
 */

/** Gera chave no formato KELV-XXXX-XXXX-XXXX (sem caracteres ambiguos). */
export function generateProductKey(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(12);
  const chars = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('');
  return `KELV-${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8, 12)}`;
}

export type FulfillResult = 'fulfilled' | 'already_processed' | 'order_not_found' | 'amount_mismatch' | 'provider_mismatch';

type FulfillInput = {
  orderId: string;
  provider: 'stripe' | 'asaas';
  providerId: string;
  /** Valor efetivamente pago, em centavos. Nulo quando o gateway nao informa. */
  paidCents: number | null;
};

/**
 * Marca o pedido como pago e gera as licencas, de forma IDEMPOTENTE.
 *
 * - So avanca pedidos PENDING: um webhook repetido nao gera licenca duplicada.
 * - Confere o valor pago contra o pedido (protege contra cobranca adulterada).
 * - Confere se o gateway que confirmou e o mesmo que criou o pedido.
 */
export async function fulfillOrder(input: FulfillInput): Promise<FulfillResult> {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: input.orderId }, include: { items: true } });
    if (!order) return 'order_not_found';

    if (order.provider && order.provider !== input.provider) return 'provider_mismatch';

    if (input.paidCents !== null && input.paidCents !== order.totalCents) return 'amount_mismatch';

    const updated = await tx.order.updateMany({
      where: { id: order.id, status: 'PENDING' },
      data: { status: 'PAID', providerId: input.providerId }
    });
    if (updated.count === 0) return 'already_processed';
    if (!order.userId) return 'fulfilled';

    for (const item of order.items) {
      for (let i = 0; i < item.quantity; i += 1) {
        await tx.productKey.create({
          data: {
            key: generateProductKey(),
            userId: order.userId,
            productId: item.productId,
            orderId: order.id,
            deliveredAt: new Date()
          }
        });
      }
    }
    return 'fulfilled';
  });
}

/** Cancela um pedido que ainda nao foi pago (cobranca expirada, removida ou recusada). */
export async function cancelPendingOrder(orderId: string): Promise<boolean> {
  const { count } = await prisma.order.updateMany({ where: { id: orderId, status: 'PENDING' }, data: { status: 'CANCELED' } });
  return count > 0;
}

/**
 * Pedido ja pago que foi estornado ou contestado (chargeback).
 * Cancela o pedido e revoga as licencas: o cliente recebeu o dinheiro de volta.
 */
export async function revokePaidOrder(orderId: string): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const { count } = await tx.order.updateMany({
      where: { id: orderId, status: { in: ['PAID', 'FULFILLED'] } },
      data: { status: 'CANCELED' }
    });
    if (count > 0) await tx.productKey.deleteMany({ where: { orderId } });
    return count > 0;
  });
}
