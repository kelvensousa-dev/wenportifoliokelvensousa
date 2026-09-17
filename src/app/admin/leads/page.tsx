'use client';

import { Mail, Megaphone, Send, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import AdminShell from '@/components/AdminShell';

const leads = [['ana@empresa.com', 'Landing Page', 'Alta', 'Hoje'], ['joao@grupo.io', 'WhatsApp', 'Média', 'Hoje'], ['maria@studio.co', 'Checkout', 'Alta', 'Ontem'], ['leo@commerce.com', 'Newsletter', 'Baixa', 'Ontem']];

export default function LeadsPage() {
  const [sent, setSent] = useState(false);
  const leadMetrics: Array<[string, string, LucideIcon]> = [['Leads ativos', '1.284', Users], ['Taxa de conversão', '8,4%', Send], ['Base opt-in', '932', Mail]];
  return <AdminShell><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">Growth engine</p><h1 className="mt-2 font-display text-4xl font-bold tracking-[-.05em]">Leads & campanhas.</h1><p className="mt-3 text-sm text-[#718096]">Capture, segmente e envie automações de marketing.</p></div><button onClick={() => setSent(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1A202C] px-5 py-3 text-sm font-bold text-white"><Megaphone size={17} /> Nova campanha</button></div>{sent && <p className="mt-5 rounded-xl bg-[#E6FFFA] p-4 text-sm font-bold text-[#277C73]">Campanha criada como rascunho. Conecte seu provedor de e-mail para disparar.</p>}<div className="mt-8 grid gap-4 md:grid-cols-3">{leadMetrics.map(([label, value, Icon]) => <article key={label} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"><Icon size={19} className="text-[#36B7C9]" /><p className="mt-6 text-sm text-[#718096]">{label}</p><p className="mt-1 font-display text-3xl font-bold">{value}</p></article>)}</div><section className="mt-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><h2 className="font-display text-2xl font-bold">Últimos leads capturados</h2><span className="text-xs font-bold text-[#1597A8]">Automação ativa</span></div><div className="mt-6 grid gap-3">{leads.map(([email, source, score, date]) => <div key={email} className="flex flex-col justify-between gap-3 rounded-xl border border-black/5 p-4 sm:flex-row sm:items-center"><div><p className="text-sm font-bold">{email}</p><p className="mt-1 text-xs text-[#718096]">Origem: {source} · {date}</p></div><span className="rounded-full bg-[#F8F9FA] px-3 py-1 text-xs font-bold text-[#718096]">Score {score}</span></div>)}</div></section></div></AdminShell>;
}
