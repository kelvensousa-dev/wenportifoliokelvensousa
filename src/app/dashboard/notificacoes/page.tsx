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
                <article key={order.id} className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/[0.02] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="flex gap-4">
                      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-inner ${order.status === 'CANCELED' ? 'bg-[#FFF5F5] text-[#C53030]' : order.status === 'PENDING' ? 'bg-[#FFFAF0] text-[#DD6B20]' : 'bg-gradient-to-br from-[#EFFFFF] to-[#E6FFFA] text-[#1597A8]'}`}>
                        {order.status === 'CANCELED' ? <XCircle size={20} /> : order.status === 'PENDING' ? <Clock3 size={20} /> : <Package size={20} />}
                      </span>
                      <div className="min-w-0 flex flex-col justify-center">
                        <h2 className="text-base font-bold text-[#1A202C]">{order.items.map((item) => item.product.name).join(', ')}</h2>
                        <div className="mt-1 flex items-center gap-2 text-xs text-[#718096]">
                          <span className="font-medium">{order.createdAt.toLocaleDateString('pt-BR')}</span>
                          <span>•</span>
                          <span className="font-semibold text-[#4A5568]" data-no-translate>{formatPrice(order.totalCents, order.currency)}</span>
                        </div>
                        <p className="mt-1.5 break-all font-mono text-[10px] uppercase tracking-wider text-[#A0AEC0]">{order.reference}</p>
                      </div>
                    </div>
                    <span className={`w-fit shrink-0 rounded-full border px-3 py-1 text-xs font-bold shadow-sm ${status.className} ${order.status === 'PAID' || order.status === 'FULFILLED' ? 'border-[#9AE6B4]/50' : 'border-black/5'}`}>{status.text}</span>
                  </div>
                  {order.productKeys.length > 0 && (
                    <div className="relative z-10 mt-6 overflow-hidden rounded-2xl bg-[#1A202C] p-5 text-white shadow-lg">
                      <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[#36B7C9]/20 blur-xl" />
                      <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-[#9AE6B4]/20 blur-xl" />
                      <p className="relative flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#A0AEC0]"><KeyRound size={14} className="text-[#36B7C9]" /> Product Key</p>
                      <div className="mt-3 flex flex-col gap-2">
                        {order.productKeys.map((productKey) => (
                          <div key={productKey.id} className="relative rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md transition-colors hover:bg-white/10">
                            <p className="select-all break-all font-mono text-sm font-semibold tracking-widest text-[#E2E8F0]" data-no-translate>{productKey.key}</p>
                          </div>
                        ))}
                      </div>
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
