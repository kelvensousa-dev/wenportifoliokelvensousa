'use client';

import { ArrowRight, Check, Mail, MessageCircle, Phone } from 'lucide-react';
import { FormEvent, useState } from 'react';
import PublicShell from '@/components/PublicShell';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">Vamos conversar</p>
            <h1 className="mt-4 max-w-xl font-display text-5xl font-bold leading-[.98] tracking-[-.05em]">Seu próximo projeto começa com uma boa pergunta.</h1>
            <p className="mt-7 max-w-md text-base leading-7 text-[#718096]">Conte o que você quer vender, automatizar ou construir. Respondemos com clareza sobre escopo, prazo e investimento.</p>
            <div className="mt-10 grid gap-3">
              <a href="mailto:hello@kelven.studio" className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 text-sm font-semibold"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFFFFF] text-[#1597A8]"><Mail size={18} /></span> hello@kelven.studio</a>
              <a href="https://wa.me/5500000000000" className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 text-sm font-semibold"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6FFFA] text-[#277C73]"><MessageCircle size={18} /></span> Falar pelo WhatsApp</a>
              <div className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 text-sm font-semibold"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF5F5] text-[#C53030]"><Phone size={18} /></span> Atendimento Humano</div>
            </div>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-7 shadow-glass md:p-10">
            {sent ? (
              <div className="py-12 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E6FFFA] text-[#277C73]"><Check size={24} /></span><h2 className="mt-5 font-display text-2xl font-bold">Mensagem enviada.</h2><p className="mt-3 text-sm text-[#718096]">Retornaremos em até um dia útil.</p></div>
            ) : (
              <><h2 className="font-display text-2xl font-bold">Peça seu orçamento</h2><p className="mt-2 text-sm text-[#718096]">Quanto mais contexto, melhor a primeira proposta.</p><form onSubmit={submit} className="mt-7 grid gap-4"><input required placeholder="Seu nome" className="h-12 rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-[#36B7C9]" /><input required type="email" placeholder="Seu e-mail" className="h-12 rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-[#36B7C9]" /><select required defaultValue="" className="h-12 rounded-xl border border-black/10 bg-white px-4 text-sm text-[#718096] outline-none focus:border-[#36B7C9]"><option value="" disabled>Assunto</option><option>Quero comprar uma solução</option><option>Quero um projeto sob medida</option><option>Suporte pós-compra</option><option>Parceria</option></select><textarea required placeholder="Conte sobre seu objetivo" className="min-h-36 resize-none rounded-xl border border-black/10 p-4 text-sm outline-none focus:border-[#36B7C9]" /><button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#1A202C] text-sm font-bold text-white">Enviar mensagem <ArrowRight size={17} /></button></form></>
            )}
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
