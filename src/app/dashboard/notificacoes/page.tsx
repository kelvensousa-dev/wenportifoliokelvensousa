'use client';

import { ArrowLeft, Bell, Check, Info, Sparkles, Tag } from 'lucide-react';
import Link from 'next/link';

const notifications = [
  { title: 'Novo release disponível', text: 'O Flow Bot recebeu melhorias no handoff para atendimento humano.', time: 'Hoje, 10:42', icon: Sparkles, color: 'text-[#1597A8] bg-[#EFFFFF]', unread: true },
  { title: 'Oferta para sua operação', text: 'Condições especiais para o Atlas ERP Cloud até o fim do mês.', time: 'Ontem, 16:20', icon: Tag, color: 'text-[#C05621] bg-[#FFFAF0]', unread: true },
  { title: 'Conta protegida', text: 'Sua autenticação em duas etapas foi confirmada com sucesso.', time: '17 set, 09:14', icon: Check, color: 'text-[#277C73] bg-[#E6FFFA]', unread: false },
  { title: 'Bem-vindo ao Studio', text: 'Explore o portfólio e encontre a próxima solução para o seu negócio.', time: '17 set, 09:13', icon: Info, color: 'text-[#2B6CB0] bg-[#EBF8FF]', unread: false }
];

export default function NotificationsPage() {
  return <main className="min-h-screen bg-[#F8F9FA] px-6 py-8 text-[#1A202C] lg:px-10"><div className="mx-auto max-w-4xl"><header className="flex items-center justify-between border-b border-black/10 pb-6"><div><Link href="/dashboard" className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-[#718096] hover:text-[#1A202C]"><ArrowLeft size={15} /> Voltar ao portfólio</Link><h1 className="font-display text-4xl font-bold tracking-[-.05em]">Notificações</h1><p className="mt-2 text-sm text-[#718096]">Atualizações importantes sobre sua conta e seus produtos.</p></div><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#36A5B4] shadow-sm"><Bell size={20} /></span></header><section className="mt-8 overflow-hidden rounded-3xl border border-black/5 bg-white">{notifications.map(({ title, text, time, icon: Icon, color, unread }) => <article key={title} className={`flex gap-4 border-b border-black/5 p-5 last:border-0 md:p-6 ${unread ? 'bg-[#FCFEFE]' : ''}`}><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}><Icon size={18} /></span><div className="min-w-0 flex-1"><div className="flex flex-col justify-between gap-1 sm:flex-row"><h2 className="text-sm font-bold">{title} {unread && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-[#36B7C9]" />}</h2><time className="text-xs text-[#A0AEC0]">{time}</time></div><p className="mt-2 text-sm leading-6 text-[#718096]">{text}</p></div></article>)}</section></div></main>;
}
