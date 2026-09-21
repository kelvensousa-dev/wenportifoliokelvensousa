import { BarChart3, DollarSign, ShoppingCart, Users } from 'lucide-react';
import AdminShell from '@/components/AdminShell';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { formatPrice } from '@/lib/products';

export const dynamic = 'force-dynamic';

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

/**
 * Visao geral com dados REAIS do banco (antes: numeros fixos no codigo,
 * como "US$ 84.290" e "428 pedidos", mostrados como se fossem reais).
 */
export default async function AdminPage() {
  await requireAdmin();

  const since = new Date();
  since.setMonth(since.getMonth() - 11, 1);
  since.setHours(0, 0, 0, 0);

  const paidStatuses = ['PAID', 'FULFILLED'] as const;
  const [revenue, paidCount, leadCount, userCount, paidOrders] = await Promise.all([
    prisma.order.aggregate({ where: { status: { in: [...paidStatuses] } }, _sum: { totalCents: true } }),
    prisma.order.count({ where: { status: { in: [...paidStatuses] } } }),
    prisma.lead.count(),
    prisma.user.count(),
    prisma.order.findMany({ where: { status: { in: [...paidStatuses] }, createdAt: { gte: since } }, select: { totalCents: true, createdAt: true } })
  ]);

  const totalCents = revenue._sum.totalCents ?? 0;
  const averageCents = paidCount ? Math.round(totalCents / paidCount) : 0;

  const buckets = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(since);
    date.setMonth(since.getMonth() + index);
    return { key: `${date.getFullYear()}-${date.getMonth()}`, label: MONTHS[date.getMonth()], cents: 0 };
  });
  paidOrders.forEach((order) => {
    const bucket = buckets.find((item) => item.key === `${order.createdAt.getFullYear()}-${order.createdAt.getMonth()}`);
    if (bucket) bucket.cents += order.totalCents;
  });
  const maxCents = Math.max(1, ...buckets.map((bucket) => bucket.cents));

  const metrics = [
    { label: 'Receita (pedidos pagos)', value: formatPrice(totalCents), icon: DollarSign },
    { label: 'Pedidos pagos', value: paidCount.toLocaleString('pt-BR'), icon: ShoppingCart },
    { label: 'Leads capturados', value: leadCount.toLocaleString('pt-BR'), icon: Users },
    { label: 'Ticket médio', value: formatPrice(averageCents), icon: BarChart3 }
  ];

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">Command center</p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-[-.05em] sm:text-4xl">Visão geral do negócio.</h1>
            <p className="mt-3 text-sm text-[#718096]">{userCount.toLocaleString('pt-BR')} contas cadastradas · dados em tempo real do banco.</p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map(({ label, value, icon: Icon }) => (
            <article key={label} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-2"><p className="text-xs font-bold uppercase tracking-wider text-[#A0AEC0]">{label}</p><Icon size={18} className="shrink-0 text-[#36B7C9]" /></div>
              <p className="mt-7 break-words font-display text-2xl font-bold sm:text-3xl" data-no-translate>{value}</p>
            </article>
          ))}
        </div>
        <section className="mt-6 rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#A0AEC0]">Performance</p>
          <h2 className="mt-2 font-display text-2xl font-bold">Receita por mês (12 meses)</h2>
          <div className="mt-8 overflow-x-auto">
            <div className="flex h-56 min-w-[520px] items-end gap-2 border-b border-l border-black/10 px-2 pb-0 sm:px-4">
              {buckets.map((bucket) => (
                <div key={bucket.key} className="group flex h-full flex-1 flex-col items-center justify-end gap-2" title={formatPrice(bucket.cents)}>
                  <span className="w-full rounded-t-lg bg-[#36B7C9] transition group-hover:bg-[#1A202C]" style={{ height: `${Math.max(2, (bucket.cents / maxCents) * 100)}%` }} />
                </div>
              ))}
            </div>
            <div className="flex min-w-[520px] gap-2 px-2 pt-2 sm:px-4">{buckets.map((bucket) => <small key={bucket.key} className="flex-1 text-center text-[10px] text-[#A0AEC0]">{bucket.label}</small>)}</div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
