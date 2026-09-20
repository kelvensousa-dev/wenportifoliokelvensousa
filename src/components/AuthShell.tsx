'use client';

import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Github, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';

type AuthMode = 'login' | 'signup';
type AuthStep = 'credentials' | 'two-factor';

type AuthShellProps = {
  mode: AuthMode;
};

const providers = [
  { id: 'google', name: 'Google', label: 'Continuar com Google', mark: 'G', className: 'bg-white text-[#1A202C]' },
  { id: 'github', name: 'GitHub', label: 'Continuar com GitHub', mark: <Github size={17} />, className: 'bg-[#1A202C] text-white' }
];

const demoTwoFactorCode = '123456';

export default function AuthShell({ mode }: AuthShellProps) {
  const router = useRouter();
  const [step, setStep] = useState<AuthStep>('credentials');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isSignup = mode === 'signup';

  function submitCredentials(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setEmail(formData.get('email') as string);
    setPassword(formData.get('password') as string);
    setStep('two-factor');
  }

  async function submitTwoFactor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setTwoFactorError('E-mail ou senha incorretos no banco de dados. Para teste local use: admin@empresa.com e senha 123456.');
      return;
    }

    setTwoFactorError('');
    setSubmitted(true);
    router.push('/dashboard');
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#1A202C] lg:grid lg:grid-cols-[.9fr_1.1fr]">
      <section className="relative hidden overflow-hidden bg-[#1A202C] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative z-10 flex items-center gap-3 font-display text-lg font-bold tracking-tight"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm text-[#1A202C]">K.</span> KELVEN<span className="font-normal text-[#718096]">/STUDIO</span></div>
        <div className="relative z-10 max-w-xl pb-8 xl:pb-16"><div className="mb-6 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#9AE6B4]"><Sparkles size={15} /> Acesso com intenção</div><h1 className="font-display text-5xl font-bold leading-[.98] tracking-[-.05em] xl:text-7xl">Seu próximo avanço começa aqui.</h1><p className="mt-7 max-w-md text-base leading-7 text-[#CBD5E0]">Entre para gerenciar suas licenças, downloads e produtos digitais em um só lugar.</p><div className="mt-10 flex items-center gap-4 text-sm text-[#CBD5E0]"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10"><ShieldCheck size={18} className="text-[#9AE6B4]" /></span><span>Proteção em duas etapas<br /><strong className="text-white">por padrão</strong></span></div></div>
        <div className="relative z-10 flex items-center justify-between text-xs text-[#718096]"><span>SSL 256-bit · LGPD</span><span>© 2026 Kelven Studio</span></div>
      </section>

      <section className="flex min-h-screen flex-col px-6 py-7 sm:px-10 lg:px-16 xl:px-24">
        <div className="flex items-center justify-between lg:justify-end"><Link href="/" className="flex items-center gap-2 font-display text-sm font-bold lg:hidden"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A202C] text-xs text-white">K.</span> KELVEN/STUDIO</Link><Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#718096] transition hover:text-[#1A202C]"><ArrowLeft size={15} /> Voltar para a home</Link></div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12"><div className="mb-9"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">{isSignup ? 'Comece agora' : 'Bem-vindo de volta'}</p><h2 className="mt-3 font-display text-4xl font-bold tracking-[-.05em]">{step === 'two-factor' ? 'Confirme sua identidade.' : isSignup ? 'Crie seu acesso.' : 'Entre no seu espaço.'}</h2><p className="mt-4 text-sm leading-6 text-[#718096]">{step === 'two-factor' ? 'Enviamos um código de 6 dígitos para proteger sua conta.' : isSignup ? 'Uma conta para seus produtos, licenças e próximos lançamentos.' : 'Acesse seu painel e continue de onde parou.'}</p></div>

          {step === 'credentials' && <>
            <div className="grid grid-cols-2 gap-3">
              {providers.map((provider) => (
                <button
                  key={provider.name}
                  type="button"
                  aria-label={provider.label}
                  onClick={() => signIn(provider.id, { callbackUrl: '/dashboard' })}
                  className={`flex h-12 items-center justify-center gap-2 rounded-xl border border-black/10 text-sm font-bold transition hover:-translate-y-0.5 hover:shadow-md ${provider.className}`}
                >
                  <span className="flex h-5 w-5 items-center justify-center font-display font-bold">{provider.mark}</span>
                  <span>{provider.name}</span>
                </button>
              ))}
            </div>
            <div className="my-7 flex items-center gap-4 text-xs font-bold text-[#A0AEC0]"><span className="h-px flex-1 bg-black/10" /> ou continue com e-mail <span className="h-px flex-1 bg-black/10" /></div>
            <form onSubmit={submitCredentials} className="space-y-5">
              {isSignup && <label className="block"><span className="mb-2 block text-xs font-bold text-[#4A5568]">Nome completo</span><input required name="name" type="text" placeholder="Como podemos chamar você?" className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none transition placeholder:text-[#A0AEC0] focus:border-[#36B7C9] focus:ring-4 focus:ring-[#36B7C9]/10" /></label>}
              <label className="block"><span className="mb-2 block text-xs font-bold text-[#4A5568]">E-mail profissional</span><span className="relative block"><Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0AEC0]" /><input required name="email" type="email" placeholder="admin@empresa.com" className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-[#A0AEC0] focus:border-[#36B7C9] focus:ring-4 focus:ring-[#36B7C9]/10" /></span></label>
              <label className="block"><span className="mb-2 block text-xs font-bold text-[#4A5568]">Senha</span><span className="relative block"><LockKeyhole size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0AEC0]" /><input required minLength={6} name="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-[#A0AEC0] focus:border-[#36B7C9] focus:ring-4 focus:ring-[#36B7C9]/10" /><button type="button" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#A0AEC0] hover:text-[#1A202C]">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
              {!isSignup && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 font-semibold text-[#718096]"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-4 w-4 accent-[#36B7C9]" /> Lembrar de mim</label>
                    <button type="button" className="font-bold text-[#1597A8] hover:underline">Esqueci minha senha</button>
                  </div>
                  <p className="rounded-lg bg-gray-100 p-2 text-[11px] text-[#718096]">Conta de teste local: <strong className="text-[#1A202C]">admin@empresa.com</strong> | Senha: <strong className="text-[#1A202C]">123456</strong></p>
                </div>
              )}
              {isSignup && <label className="flex items-start gap-2 text-xs leading-5 text-[#718096]"><input required type="checkbox" className="mt-1 h-4 w-4 accent-[#36B7C9]" /> Confirmo que este e-mail é meu, aceito os termos de uso e a política de privacidade. O Product Key das compras será enviado para este endereço.</label>}
              <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1A202C] text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#2D3748]">{isSignup ? 'Criar minha conta' : 'Entrar na conta'} <ArrowRight size={17} /></button>
            </form>
          </>}

          {step === 'two-factor' && <form onSubmit={submitTwoFactor} className="space-y-6"><div className="rounded-2xl border border-[#36B7C9]/20 bg-[#EFFFFF] p-5"><div className="flex gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-[#1597A8]" size={20} /><div><p className="text-sm font-bold">Verificação em duas etapas</p><p className="mt-1 text-xs leading-5 text-[#4A5568]">Digite o código do seu aplicativo autenticador ou o código enviado para seu e-mail.</p><p className="mt-2 text-xs font-bold text-[#1597A8]">Demo local: use 123456</p></div></div></div><label className="block"><span className="mb-2 block text-xs font-bold text-[#4A5568]">Código de segurança</span><input autoFocus required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={twoFactorCode} onChange={(event) => { setTwoFactorCode(event.target.value.replace(/\D/g, '')); setTwoFactorError(''); }} placeholder="000000" className={`h-16 w-full rounded-xl border bg-white text-center font-display text-3xl font-bold tracking-[.45em] outline-none transition placeholder:text-[#CBD5E0] focus:ring-4 focus:ring-[#36B7C9]/10 ${twoFactorError ? 'border-red-400 focus:border-red-400' : 'border-black/10 focus:border-[#36B7C9]'}`} /></label>{twoFactorError && <p role="alert" className="-mt-3 text-xs font-bold text-red-500">{twoFactorError}</p>}<button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1A202C] text-sm font-bold text-white transition hover:bg-[#2D3748]">Confirmar acesso <ArrowRight size={17} /></button><button type="button" onClick={() => setStep('credentials')} className="w-full text-xs font-bold text-[#718096] hover:text-[#1A202C]">Voltar e revisar dados</button></form>}

          {submitted && <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#E6FFFA] p-4 text-sm font-semibold text-[#277C73]"><Check size={17} /> Código recebido. Integração de sessão pronta para conectar ao backend.</div>}
          <p className="mt-9 text-center text-sm text-[#718096]">{isSignup ? 'Já possui uma conta?' : 'Ainda não tem uma conta?'} <Link href={isSignup ? '/login' : '/cadastre-se'} className="font-bold text-[#1597A8] hover:underline">{isSignup ? 'Entrar' : 'Cadastre-se grátis'}</Link></p>
          <p className="mt-8 text-center text-[11px] leading-5 text-[#A0AEC0]">Ao continuar, você concorda com nossos termos e reconhece nossa política de privacidade.</p>
        </div>
      </section>
    </main>
  );
}
