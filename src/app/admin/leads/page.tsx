import AdminShell from '@/components/AdminShell';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';

export const dynamic = 'force-dynamic';

const sourceLabel: Record<string, string> = { newsletter: 'Newsletter', contato: 'Contato', orcamento: 'Orçamento', homepage: 'Home' };

export default async function LeadsPage() {
  await requireAdmin();

  const [total, leads] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 100 })
  ]);

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">Growth engine</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-[-.05em] sm:text-4xl">Leads & contatos.</h1>
        <p className="mt-3 text-sm text-[#718096]">{total.toLocaleString('pt-BR')} registros no total. Exibindo os 100 mais recentes.</p>

        <section className="mt-8 grid gap-3">
          {leads.length === 0 && <p className="rounded-2xl border border-dashed border-black/15 bg-white p-8 text-center text-sm text-[#718096]">Nenhum lead ainda. Eles aparecem aqui quando alguém usa a newsletter, o contato ou o pedido de orçamento.</p>}
          {leads.map((lead) => (
            <article key={lead.id} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <p className="break-all text-sm font-bold" data-no-translate>{lead.name ? `${lead.name} · ` : ''}{lead.email}</p>
                  <p className="mt-1 text-xs text-[#718096]">{sourceLabel[lead.source] ?? lead.source}{lead.subject ? ` · ${lead.subject}` : ''}</p>
                </div>
                <time className="shrink-0 text-xs text-[#A0AEC0]">{lead.createdAt.toLocaleString('pt-BR')}</time>
              </div>
              {lead.message && <p className="mt-3 whitespace-pre-wrap break-words rounded-xl bg-[#F8F9FA] p-4 text-sm leading-6 text-[#4A5568]" data-no-translate>{lead.message}</p>}
            </article>
          ))}
        </section>
      </div>
    </AdminShell>
  );
}
