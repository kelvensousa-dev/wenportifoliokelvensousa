'use client';

import { ArrowLeft, ArrowRight, Eye, EyeOff, Github, LockKeyhole, Mail, ShieldCheck, Sparkles, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { FormEvent, Suspense, useState } from 'react';

type AuthMode = 'login' | 'signup';

type AuthShellProps = {
  mode: AuthMode;
  /**
   * Providers OAuth realmente configurados no ambiente. Passe a partir de uma
   * Server Component que leia `process.env`, para nao exibir botoes mortos.
   */
  oauthProviders?: Array<'google' | 'github'>;
};

const providerMeta = {
  google: { name: 'Google', label: 'Continuar com Google', mark: 'G', className: 'bg-white text-[#1A202C]' },
  github: { name: 'GitHub', label: 'Continuar com GitHub', mark: <Github size={17} />, className: 'bg-[#1A202C] text-white' }
} as const;

/**
 * Mudancas em relacao a versao anterior:
 *
 * 1. O passo "two-factor" foi removido. Ele coletava um codigo de 6 digitos
 *    que nunca era comparado com nada — `signIn` era chamado so com e-mail e
 *    senha. Era um obstaculo visual, nao uma protecao. O 2FA real entra no
 *    Sprint 2, com segredo TOTP por usuario.
 * 2. O cadastro agora cria o usuario de fato (POST /api/auth/register). Antes
 *    o formulario de signup tentava logar com credenciais inexistentes.
 * 3. As credenciais de teste deixaram de ser renderizadas na tela.
 */
function AuthForm({ mode, oauthProviders = [] }: AuthShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isSignup = mode === 'signup';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const name = String(formData.get('name') ?? '').trim();

    try {
      if (isSignup) {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          setError(payload.message ?? 'Nao foi possivel criar a conta.');
          return;
        }
      }

      const result = await signIn('credentials', { redirect: false, email, password });

      if (result?.error) {
        setError(isSignup ? 'Conta criada, mas o acesso falhou. Tente entrar novamente.' : 'E-mail ou senha incorretos.');
        return;
      }

      router.push((callbackUrl.startsWith('/') ? callbackUrl : '/dashboard') as any);
      router.refresh();
    } catch {
      setError('Falha de conexao. Verifique sua internet e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#1A202C] lg:grid lg:grid-cols-[.9fr_1.1fr]">
      <section className="relative hidden overflow-hidden bg-[#1A202C] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="relative z-10 flex items-center gap-3 font-display text-lg font-bold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm text-[#1A202C]">K.</span>
          KELVEN<span className="font-normal text-[#718096]">/STUDIO</span>
        </div>

        <div className="relative z-10 max-w-xl pb-8 xl:pb-16">
          <div className="mb-6 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#9AE6B4]">
            <Sparkles size={15} /> Acesso com intencao
          </div>
          <h1 className="font-display text-5xl font-bold leading-[.98] tracking-[-.05em] xl:text-7xl">
            Seu proximo avanco comeca aqui.
          </h1>
          <p className="mt-7 max-w-md text-base leading-7 text-[#CBD5E0]">
            Entre para gerenciar suas licencas, downloads e produtos digitais em um so lugar.
          </p>
          <div className="mt-10 flex items-center gap-4 text-sm text-[#CBD5E0]">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10">
              <ShieldCheck size={18} className="text-[#9AE6B4]" />
            </span>
            <span>
              Sessao protegida
              <br />
              <strong className="text-white">e criptografada</strong>
            </span>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-[#718096]">
          <span>SSL 256-bit · LGPD</span>
          <span>© 2026 Kelven Studio</span>
        </div>
      </section>

      <section className="flex min-h-screen flex-col px-6 py-7 sm:px-10 lg:px-16 xl:px-24">
        <div className="flex items-center justify-between lg:justify-end">
          <Link href="/" className="flex items-center gap-2 font-display text-sm font-bold lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A202C] text-xs text-white">K.</span>
            KELVEN/STUDIO
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#718096] transition hover:text-[#1A202C]">
            <ArrowLeft size={15} /> Voltar para a home
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <div className="mb-9">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">
              {isSignup ? 'Comece agora' : 'Bem-vindo de volta'}
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-[-.05em]">
              {isSignup ? 'Crie seu acesso.' : 'Entre no seu espaco.'}
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#718096]">
              {isSignup
                ? 'Uma conta para seus produtos, licencas e proximos lancamentos.'
                : 'Acesse seu painel e continue de onde parou.'}
            </p>
          </div>

          {oauthProviders.length > 0 && (
            <>
              <div className={`grid gap-3 ${oauthProviders.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {oauthProviders.map((id) => {
                  const provider = providerMeta[id];
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-label={provider.label}
                      onClick={() => signIn(id, { callbackUrl })}
                      className={`flex h-12 items-center justify-center gap-2 rounded-xl border border-black/10 text-sm font-bold transition hover:-translate-y-0.5 hover:shadow-md ${provider.className}`}
                    >
                      <span className="flex h-5 w-5 items-center justify-center font-display font-bold">{provider.mark}</span>
                      <span>{provider.name}</span>
                    </button>
                  );
                })}
              </div>
              <div className="my-7 flex items-center gap-4 text-xs font-bold text-[#A0AEC0]">
                <span className="h-px flex-1 bg-black/10" /> ou continue com e-mail <span className="h-px flex-1 bg-black/10" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-[#4A5568]">Nome completo</span>
                <span className="relative block">
                  <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
                  <input
                    required
                    minLength={2}
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Como podemos chamar voce?"
                    className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-[#A0AEC0] focus:border-[#36B7C9] focus:ring-4 focus:ring-[#36B7C9]/10"
                  />
                </span>
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[#4A5568]">E-mail profissional</span>
              <span className="relative block">
                <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />
                <input
                  required
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@empresa.com"
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
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
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
              {isSignup && <span className="mt-2 block text-[11px] text-[#A0AEC0]">Minimo de 8 caracteres.</span>}
            </label>

            {!isSignup && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 font-semibold text-[#718096]">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                    className="h-4 w-4 accent-[#36B7C9]"
                  />
                  Lembrar de mim
                </label>
                {/* Fluxo de recuperacao entra no Sprint 2 (token por e-mail).
                    Mantido como botao para nao quebrar o `typedRoutes` com
                    uma rota que ainda nao existe. */}
                <button type="button" className="font-bold text-[#1597A8] hover:underline">
                  Esqueci minha senha
                </button>
              </div>
            )}

            {isSignup && (
              <label className="flex items-start gap-2 text-xs leading-5 text-[#718096]">
                <input required type="checkbox" className="mt-1 h-4 w-4 accent-[#36B7C9]" />
                Confirmo que este e-mail e meu e aceito os termos de uso e a politica de privacidade. O Product Key das compras
                sera enviado para este endereco.
              </label>
            )}

            {error && (
              <p role="alert" className="text-xs font-bold text-red-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1A202C] text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#2D3748] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Processando...' : isSignup ? 'Criar minha conta' : 'Entrar na conta'}
              <ArrowRight size={17} />
            </button>
          </form>

          <p className="mt-9 text-center text-sm text-[#718096]">
            {isSignup ? 'Ja possui uma conta?' : 'Ainda nao tem uma conta?'}{' '}
            <Link href={isSignup ? '/login' : '/cadastre-se'} className="font-bold text-[#1597A8] hover:underline">
              {isSignup ? 'Entrar' : 'Cadastre-se gratis'}
            </Link>
          </p>

          <p className="mt-8 text-center text-[11px] leading-5 text-[#A0AEC0]">
            Ao continuar, voce concorda com nossos termos e reconhece nossa politica de privacidade.
          </p>
        </div>
      </section>
    </main>
  );
}

export default function AuthShell(props: AuthShellProps) {
  // useSearchParams exige um limite de Suspense no App Router.
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F8F9FA] text-sm font-semibold text-[#718096]">
          Carregando...
        </main>
      }
    >
      <AuthForm {...props} />
    </Suspense>
  );
}
