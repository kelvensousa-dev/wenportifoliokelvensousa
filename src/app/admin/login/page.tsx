'use client';

import { ArrowRight, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (code !== '123456') {
      setError('Código administrativo inválido.');
      return;
    }
    sessionStorage.setItem('kelven-admin-authenticated', 'true');
    router.replace('/admin');
  }

  return <main className="grid min-h-screen place-items-center bg-[#F8F9FA] px-6"><div className="w-full max-w-md rounded-3xl border border-black/5 bg-white p-8 shadow-glass md:p-10"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1A202C] text-white"><LockKeyhole size={21} /></div><p className="mt-8 text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">Área restrita</p><h1 className="mt-3 font-display text-4xl font-bold tracking-[-.05em]">Admin access.</h1><p className="mt-4 text-sm leading-6 text-[#718096]">Acesso exclusivo para gestores. Confirme o segundo fator para abrir o command center.</p><form onSubmit={submit} className="mt-8 space-y-5"><label className="block"><span className="mb-2 block text-xs font-bold">Código 2FA administrativo</span><input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => { setCode(event.target.value.replace(/\D/g, '')); setError(''); }} placeholder="000000" className="h-14 w-full rounded-xl border border-black/10 text-center font-display text-2xl font-bold tracking-[.4em] outline-none focus:border-[#36B7C9]" /></label>{error && <p role="alert" className="text-xs font-bold text-red-500">{error}</p>}<button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1A202C] text-sm font-bold text-white">Entrar no admin <ArrowRight size={17} /></button></form><p className="mt-6 flex items-center gap-2 text-xs text-[#718096]"><ShieldCheck size={15} className="text-[#36B7C9]" /> Demo local: use 123456.</p></div></main>;
}
