'use client';

import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSession, signIn } from 'next-auth/react';
import { FormEvent, Suspense, useState } from 'react';
import { safeInternalPath } from '@/lib/security';

/**
 * Antes: o acesso administrativo era liberado por um literal '123456'
 * comparado no navegador, gravando `sessionStorage`. Qualquer visitante
 * entrava, e o middleware do NextAuth (que nao via sessao nenhuma) devolvia
 * o usuario para esta mesma tela — o loop infinito.
 *
 * Agora e um login de verdade: credenciais validadas no servidor e privilegio
 * conferido em `session.user.isAdmin`.
 */
function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requested = safeInternalPath(searchParams.get('callbackUrl'), '/admin');
  const callbackUrl = requested === '/admin' || requested.startsWith('/admin/') ? requested : '/admin';

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? '')
      });

      if (result?.error) {
        setError('E-mail ou senha inválidos.');
        return;
      }

      // Confere o privilegio antes de navegar, para nao jogar o usuario
      // dentro de /admin e deixar o middleware devolve-lo em seguida.
      const session = await getSession();
      if (!session?.user?.isAdmin) {
        setError('Esta conta não tem permissão administrativa.');
        return;
      }

      router.replace(callbackUrl as any);
      router.refresh();
    } catch {
      setError('Não foi possível concluir o acesso. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-black/5 bg-white p-6 shadow-glass sm:p-8 md:p-10">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1A202C] text-white">
        <LockKeyhole size={21} />
      </div>

      <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">Área restrita</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-[-.05em]">Admin access.</h1>
      <p className="mt-4 text-sm leading-6 text-[#718096]">
        Acesso exclusivo para gestores. Entre com suas credenciais administrativas.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <label className="block">
          <span className="mb-2 block text-xs font-bold text-[#4A5568]">E-mail</span>
          <span className="relative block">
            <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-[#A0AEC0] focus:border-[#36B7C9] focus:ring-4 focus:ring-[#36B7C9]/10"
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold text-[#4A5568]">Senha</span>
          <span className="relative block">
            <LockKeyhole size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
            <input
              required
              minLength={8}
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-[#A0AEC0] focus:border-[#36B7C9] focus:ring-4 focus:ring-[#36B7C9]/10"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#A0AEC0] hover:text-[#1A202C]"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </span>
        </label>

        {error && (
          <p role="alert" className="text-xs font-bold text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1A202C] text-sm font-bold text-white transition hover:bg-[#2D3748] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Validando acesso...' : 'Entrar no admin'} <ArrowRight size={17} />
        </button>
      </form>

      <p className="mt-6 flex items-center gap-2 text-xs text-[#718096]">
        <ShieldCheck size={15} className="text-[#36B7C9]" /> Tentativas repetidas são bloqueadas temporariamente.
      </p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#F8F9FA] px-4 py-10 sm:px-6">
      <Suspense fallback={<div className="text-sm font-semibold text-[#718096]">Carregando...</div>}>
        <AdminLoginForm />
      </Suspense>
    </main>
  );
}
