'use client';

import { ArrowRight, Check, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import Honeypot from '@/components/Honeypot';
import PublicShell from '@/components/PublicShell';
import { sendLead } from '@/lib/leads-client';
import { contactEmail, whatsappDisplay, whatsappUrl } from '@/lib/site';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Antes o formulario so mostrava "Mensagem enviada" e descartava tudo.
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    const result = await sendLead(event.currentTarget, 'contato');
    setLoading(false);
    if (result) setError(result);
    else setSent(true);
  }

  return (
    <PublicShell>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start lg:gap-14">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">Vamos conversar</p>
            <h1 className="mt-4 max-w-xl break-words font-display text-4xl font-bold leading-[.98] tracking-[-.05em] sm:text-5xl">Seu próximo projeto começa com uma boa pergunta.</h1>
            <p className="mt-7 max-w-md text-base leading-7 text-[#718096]">Conte o que você quer vender, automatizar ou construir. Respondemos com clareza sobre escopo, prazo e investimento.</p>
            <div className="mt-10 grid gap-3">
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-4 break-all rounded-2xl border border-black/5 bg-white p-4 text-sm font-semibold"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFFFFF] text-[#1597A8]"><Mail size={18} /></span> {contactEmail}</a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 text-sm font-semibold">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E6FFFA] text-[#277C73]"><MessageCircle size={18} /></span>
                <span>Falar pelo WhatsApp <span className="block text-xs font-medium text-[#718096]" data-no-translate>{whatsappDisplay}</span></span>
              </a>
            </div>
            <p className="mt-5 max-w-md text-xs leading-5 text-[#718096]">
              O atendimento no WhatsApp começa com um assistente virtual (IA), 24 horas por dia. Você pode pedir um atendente humano quando quiser. <Link href="/atendimento" className="font-semibold underline">Como funciona o atendimento</Link> · <Link href="/garantias-e-direitos" className="font-semibold underline">Seus direitos</Link>
            </p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-glass sm:p-7 md:p-10">
            {sent ? (
              <div role="status" className="py-12 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E6FFFA] text-[#277C73]"><Check size={24} /></span><h2 className="mt-5 font-display text-2xl font-bold">Mensagem enviada.</h2><p className="mt-3 text-sm text-[#718096]">Retornaremos em até um dia útil.</p></div>
            ) : (
              <>
                <h2 className="font-display text-2xl font-bold">Peça seu orçamento</h2>
                <p className="mt-2 text-sm text-[#718096]">Quanto mais contexto, melhor a primeira proposta.</p>
                <form onSubmit={submit} className="relative mt-7 grid gap-4">
                  <Honeypot />
                  <input required name="name" maxLength={120} autoComplete="name" placeholder="Seu nome" aria-label="Seu nome" className="h-12 rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-[#36B7C9]" />
                  <input required name="email" type="email" maxLength={254} autoComplete="email" placeholder="Seu e-mail" aria-label="Seu e-mail" className="h-12 rounded-xl border border-black/10 px-4 text-sm outline-none focus:border-[#36B7C9]" />
                  <select required name="subject" defaultValue="" aria-label="Assunto" className="h-12 rounded-xl border border-black/10 bg-white px-4 text-sm text-[#718096] outline-none focus:border-[#36B7C9]">
                    <option value="" disabled>Assunto</option>
                    <option>Quero comprar uma solução</option>
                    <option>Quero um projeto sob medida</option>
                    <option>Suporte pós-compra</option>
                    <option>Parceria</option>
                  </select>
                  <textarea required name="message" maxLength={4000} placeholder="Conte sobre seu objetivo" aria-label="Mensagem" className="min-h-36 resize-y rounded-xl border border-black/10 p-4 text-sm outline-none focus:border-[#36B7C9]" />
                  {error && <p role="alert" className="text-xs font-bold text-red-500">{error}</p>}
                  <button disabled={loading} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#1A202C] text-sm font-bold text-white disabled:opacity-60">{loading ? 'Enviando...' : 'Enviar mensagem'} <ArrowRight size={17} /></button>
                  <p className="text-[11px] leading-5 text-[#A0AEC0]">Seus dados são usados apenas para responder este contato, conforme a política de privacidade.</p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
