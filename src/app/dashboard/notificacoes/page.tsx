import type { Metadata } from 'next';
import { ArrowLeft, Clock3, KeyRound, Package, ShoppingBag, XCircle } from 'lucide-react';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/require-admin';
import { formatPrice } from '@/lib/products';

export const metadata: Metadata = { title: 'Minhas compras', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const statusLabel: Record<string, { text: string; className: string }> = {
  PENDING: { text: 'Aguardando pagamento', className: 'bg-[#FFFAF0] text-[#C05621]' },
  PAID: { text: 'Pago', className: 'bg-[#E6FFFA] text-[#277C73]' },
  FULFILLED: { text: 'Entregue', className: 'bg-[#E6FFFA] text-[#277C73]' },
  CANCELED: { text: 'Cancelado', className: 'bg-[#EDF2F7] text-[#718096]' }
};

/**
 * Area do cliente com dados REAIS.
 *
 * A pagina anterior exibia notificacoes fixas no codigo — inclusive
 * "Sua autenticacao em duas etapas foi confirmada", recurso que nao existe.
 * Agora lista os pedidos do usuario e as Product Keys geradas pelo webhook
 * de pagamento, que antes nao eram entregues em lugar nenhum.
 */
export default async function PurchasesPage() {
  const user = await requireUser('/dashboard/notificacoes');

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      items: { include: { product: { select: { name: true, slug: true } } } },
      productKeys: { select: { id: true, key: true, productId: true } }
    }
  });

  const visibleOrders = orders.filter((order) => order.status !== 'PENDING' || Date.now() - order.createdAt.getTime() < 24 * 60 * 60 * 1000);

  return (
    <main className="min-h-screen bg-[#F8F9FA] px-4 py-8 text-[#1A202C] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <header className="flex flex-col justify-between gap-5 border-b border-black/10 pb-6 sm:flex-row sm:items-end">
          <div>
            <Link href="/dashboard" className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-[#718096] hover:text-[#1A202C]"><ArrowLeft size={15} /> Voltar ao portfólio</Link>
            <h1 className="font-display text-3xl font-bold tracking-[-.05em] sm:text-4xl">Minhas compras</h1>
            <p className="mt-2 text-sm text-[#718096]">Pedidos e licenças da conta <span className="font-semibold text-[#4A5568]">{user.email}</span>.</p>
          </div>
          <SignOutButton />
        </header>

        {visibleOrders.length === 0 ? (
          <section className="mt-8 rounded-3xl border border-dashed border-black/15 bg-white p-10 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EFFFFF] text-[#1597A8]"><ShoppingBag size={22} /></span>
            <h2 className="mt-5 font-display text-2xl font-bold">Nenhuma compra ainda.</h2>
            <p className="mt-2 text-sm text-[#718096]">Quando você comprar uma solução, a licença aparece aqui.</p>
            <Link href="/dashboard" className="mt-6 inline-flex rounded-full bg-[#1A202C] px-5 py-3 text-xs font-bold text-white">Explorar soluções</Link>
          </section>
        ) : (
          <section className="mt-8 grid gap-4">
            {visibleOrders.map((order) => {
              const status = statusLabel[order.status] ?? statusLabel.PENDING;
              return (
                <article key={order.id} className="rounded-3xl border border-black/5 bg-white p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div className="flex gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFFFFF] text-[#1597A8]">
                        {order.status === 'CANCELED' ? <XCircle size={19} /> : order.status === 'PENDING' ? <Clock3 size={19} /> : <Package size={19} />}
                      </span>
                      <div className="min-w-0">
                        <h2 className="text-sm font-bold">{order.items.map((item) => item.product.name).join(', ')}</h2>
                        <p className="mt-1 break-all font-mono text-[11px] text-[#A0AEC0]">{order.reference}</p>
                        <p className="mt-1 text-xs text-[#718096]">{order.createdAt.toLocaleDateString('pt-BR')} · <span data-no-translate>{formatPrice(order.totalCents, order.currency)}</span></p>
                      </div>
                    </div>
                    <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${status.className}`}>{status.text}</span>
                  </div>
                  {order.productKeys.length > 0 && (
                    <div className="mt-5 rounded-2xl border border-[#36B7C9]/20 bg-[#EFFFFF] p-4">
                      <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#1597A8]"><KeyRound size={14} /> Product Key</p>
                      {order.productKeys.map((productKey) => (
                        <p key={productKey.id} className="mt-2 select-all break-all font-mono text-base font-bold tracking-wider" data-no-translate>{productKey.key}</p>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
