'use client';

import { BarChart3, Bot, Box, ChevronRight, GitBranch, LayoutDashboard, LogOut, Mail, PackageCheck, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSelector from '@/components/LanguageSelector';

import { signOut, useSession } from 'next-auth/react';

type AdminRoute = '/admin' | '/admin/faturamento' | '/admin/produtos' | '/admin/leads' | '/admin/carrinhos' | '/admin/releases' | '/admin/atendimento';

const navigation: Array<{ href: AdminRoute; label: string; icon: LucideIcon }> = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/faturamento', label: 'Faturamento & BI', icon: BarChart3 },
  { href: '/admin/produtos', label: 'Produtos ativos', icon: Box },
  { href: '/admin/leads', label: 'Leads & campanhas', icon: Users },
  { href: '/admin/carrinhos', label: 'Carrinhos abandonados', icon: PackageCheck },
  { href: '/admin/releases', label: 'Releases & updates', icon: GitBranch },
  { href: '/admin/atendimento', label: 'IA & WhatsApp', icon: Bot }
];

export default function AdminShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // A autorizacao real acontece em src/middleware.ts (server-side).
  // Aqui apenas evitamos exibir a UI antes de a sessao hidratar.
  function handleSignOut() {
    signOut({ callbackUrl: '/admin/login' });
  }

  if (status === 'loading') return <main className="flex min-h-screen items-center justify-center bg-[#F8F9FA] text-sm font-semibold text-[#718096]">Validando acesso administrativo...</main>;
  if (!session?.user?.isAdmin) return null;

  return <main className="min-h-screen bg-[#F8F9FA] text-[#1A202C] lg:flex"><aside className="hidden w-72 shrink-0 border-r border-black/5 bg-white p-6 lg:block"><Link href="/admin" className="flex items-center gap-3 font-display text-lg font-bold tracking-tight"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1A202C] text-sm text-white">K.</span> KELVEN<span className="font-normal text-[#A0AEC0]">/OPS</span></Link><p className="mt-10 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#A0AEC0]">Command center</p><nav className="mt-4 grid gap-1">{navigation.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${pathname === href ? 'bg-[#1A202C] text-white' : 'text-[#718096] hover:bg-[#F8F9FA] hover:text-[#1A202C]'}`}><Icon size={17} /> {label}<ChevronRight size={14} className="ml-auto opacity-40" /></Link>)}</nav><div className="mt-10 rounded-2xl bg-[#EFFFFF] p-4"><ShieldStatus /></div></aside><section className="min-w-0 flex-1"><header className="flex items-center justify-between border-b border-black/5 bg-white/80 px-6 py-4 backdrop-blur-xl lg:px-10"><div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#36A5B4]">Admin only</p><p className="mt-1 text-sm font-semibold">Operações Kelven Studio</p></div><div className="flex items-center gap-3"><LanguageSelector /><button onClick={handleSignOut} className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-2 text-xs font-bold text-[#718096] hover:bg-[#F8F9FA]"><LogOut size={15} /> Sair</button></div></header><div className="p-6 lg:p-10">{children}</div></section></main>;
}

function ShieldStatus() {
  return <><div className="flex items-center gap-2 text-xs font-bold text-[#277C73]"><Mail size={15} /> Dados protegidos</div><p className="mt-2 text-[11px] leading-5 text-[#4A5568]">Acesso restrito por sessão administrativa e 2FA.</p></>;
}
