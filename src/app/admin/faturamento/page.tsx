import AdminShell from '@/components/AdminShell';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { formatPrice } from '@/lib/products';

export const dynamic = 'force-dynamic';

const statusStyle: Record<string, string> = {
  PENDING: 'bg-[#FFFAF0] text-[#C05621]',
  PAID: 'bg-[#E6FFFA] text-[#277C73]',
  FULFILLED: 'bg-[#E6FFFA] text-[#277C73]',
  CANCELED: 'bg-[#EDF2F7] text-[#718096]'
};
const statusText: Record<string, string> = { PENDING: 'Pendente', PAID: 'Pago', FULFILLED: 'Entregue', CANCELED: 'Cancelado' };

export default async function BillingPage() {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      user: { select: { email: true } },
      items: { include: { product: { select: { name: true } } } }
    }
  });

  const paid = orders.filter((order) => order.status === 'PAID' || order.status === 'FULFILLED');
  // Stripe cobra em US$ e o Asaas em R$: somar moedas diferentes daria um total sem sentido.
  const totals = paid.reduce<Record<string, number>>((acc, order) => {
    acc[order.currency] = (acc[order.currency] ?? 0) + order.totalCents;
    return acc;
  }, {});
  const paidTotal = Object.keys(totals).length
    ? Object.entries(totals).map(([currency, cents]) => formatPrice(cents, currency)).join(' + ')
    : formatPrice(0, 'BRL');

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">Financeiro</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-[-.05em] sm:text-4xl">Faturamento.</h1>
        <p className="mt-3 text-sm text-[#718096]">Últimos 100 pedidos. Valores brutos, antes das taxas do Stripe e do Asaas.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ['Receita paga (lista)', paidTotal],
            ['Pedidos pagos (lista)', String(paid.length)],
            ['Pedidos listados', String(orders.length)]
          ].map(([label, value]) => (
            <article key={label} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="text-sm text-[#718096]">{label}</p>
              <p className="mt-1 font-display text-3xl font-bold" data-no-translate>{value}</p>
            </article>
          ))}
        </div>

        <section className="mt-6 rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-2xl font-bold">Pedidos</h2>
          {orders.length === 0 ? (
            <p className="mt-6 text-sm text-[#718096]">Nenhum pedido registrado ainda.</p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="border-b border-black/10 text-xs uppercase tracking-wider text-[#A0AEC0]">
                  <tr><th className="pb-4">Referência</th><th className="pb-4">Produto</th><th className="pb-4">Cliente</th><th className="pb-4">Valor</th><th className="pb-4">Gateway</th><th className="pb-4">Data</th><th className="pb-4">Status</th></tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-black/5">
                      <td className="max-w-[180px] truncate py-4 font-mono text-xs" title={order.reference}>{order.reference}</td>
                      <td className="py-4 font-bold">{order.items.map((item) => item.product.name).join(', ')}</td>
                      <td className="py-4 text-[#718096]">{order.user?.email ?? '—'}</td>
                      <td className="py-4 font-bold" data-no-translate>{formatPrice(order.totalCents, order.currency)}</td>
                      <td className="py-4 capitalize text-[#718096]">{order.provider ?? '—'}</td>
                      <td className="py-4 text-[#718096]">{order.createdAt.toLocaleDateString('pt-BR')}</td>
                      <td className="py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle[order.status] ?? ''}`}>{statusText[order.status] ?? order.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <p className="mt-5 text-xs text-[#A0AEC0]">Para relatórios completos (taxas, estornos, repasses), use os painéis do Stripe e do Asaas.</p>
      </div>
    </AdminShell>
  );
}
