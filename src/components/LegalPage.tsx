import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import PublicShell from '@/components/PublicShell';
import { legalLinks, legalUpdatedAt } from '@/lib/legal';
import { company, contactEmail, whatsappDisplay, whatsappUrl } from '@/lib/site';

type LegalPageProps = {
  icon: LucideIcon;
  kicker: string;
  title: string;
  /** Resumo curto em linguagem simples, exibido antes do texto formal. */
  summary?: string;
  /** href do documento atual (ele nao aparece na lista "Outros documentos"). */
  current: string;
  children: React.ReactNode;
};

/**
 * Estrutura comum das paginas legais (termos, privacidade, compra, garantias,
 * atendimento). Antes cada pagina repetia todo o layout em uma unica linha.
 */
export default function LegalPage({ icon: Icon, kicker, title, summary, current, children }: LegalPageProps) {
  const others = legalLinks.filter((link) => link.href !== current);

  return (
    <PublicShell>
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFFFFF] text-[#1597A8]"><Icon size={21} /></div>
        <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">{kicker}</p>
        <h1 className="mt-3 break-words font-display text-4xl font-bold tracking-[-.05em] sm:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-[#718096]">Última atualização: {legalUpdatedAt}</p>

        {summary && (
          <p className="mt-8 rounded-2xl border border-[#B9EEF3] bg-[#EFFFFF] p-5 text-sm leading-6 text-[#1A202C]">{summary}</p>
        )}

        <div className="prose prose-slate mt-10 max-w-none text-sm leading-7 text-[#4A5568]">{children}</div>

        <nav aria-label="Outros documentos" className="mt-16 border-t border-black/5 pt-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#A0AEC0]">Outros documentos</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {others.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="flex items-center justify-between rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-semibold transition hover:border-[#36B7C9]">
                  {link.label} <ArrowRight size={15} className="text-[#A0AEC0]" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </article>
    </PublicShell>
  );
}

/** Identificacao do fornecedor (Decreto 7.962/2013, art. 2o). Campos vazios sao omitidos. */
export function SupplierInfo() {
  return (
    <ul>
      <li><strong>Nome empresarial:</strong> {company.name}</li>
      {company.document && <li><strong>CNPJ/CPF:</strong> {company.document}</li>}
      {company.address && <li><strong>Endereço:</strong> {company.address}</li>}
      <li><strong>E-mail:</strong> <a href={`mailto:${contactEmail}`}>{contactEmail}</a></li>
      <li><strong>WhatsApp:</strong> <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">{whatsappDisplay}</a></li>
    </ul>
  );
}

/** Canais de atendimento, reaproveitados nas paginas legais. */
export function ContactChannels() {
  return (
    <ul>
      <li><strong>WhatsApp:</strong> <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">{whatsappDisplay}</a> (assistente virtual com inteligência artificial e atendimento humano)</li>
      <li><strong>E-mail:</strong> <a href={`mailto:${contactEmail}`}>{contactEmail}</a></li>
      <li><strong>Formulário:</strong> <Link href="/contato">página de contato</Link></li>
    </ul>
  );
}
