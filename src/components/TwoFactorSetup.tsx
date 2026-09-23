'use client';

import { Check, Copy, KeyRound, QrCode, ShieldCheck, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Step = 'start' | 'scan' | 'done';

/** Assistente de ativacao do 2FA: QR Code → primeiro codigo → codigos de recuperacao. */
export function TwoFactorSetup() {
  const [step, setStep] = useState<Step>('start');
  const [qr, setQr] = useState('');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function generate() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/2fa/setup', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setError(data.message ?? 'Não foi possível gerar o QR Code.');
      setQr(data.qr);
      setSecret(data.secret);
      setStep('scan');
    } catch {
      setError('Falha de conexão.');
    } finally {
      setLoading(false);
    }
  }

  async function enable() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/2fa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setError(data.message ?? 'Não foi possível ativar.');
      setRecoveryCodes(data.recoveryCodes);
      setStep('done');
    } catch {
      setError('Falha de conexão.');
    } finally {
      setLoading(false);
    }
  }

  async function copyCodes() {
    try {
      await navigator.clipboard.writeText(recoveryCodes.join('\n'));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const card = 'rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8';
  const primary = 'inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#1A202C] px-6 text-sm font-bold text-white transition hover:bg-[#2D3748] disabled:cursor-not-allowed disabled:opacity-50';

  if (step === 'start') {
    return (
      <div className={card}>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFFFFF] text-[#1597A8]"><Smartphone size={22} /></span>
        <h2 className="mt-6 font-display text-2xl font-bold">Ative a verificação em duas etapas</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#718096]">
          Além da senha, o acesso ao admin vai pedir um código de 6 dígitos gerado no seu celular. Mesmo que alguém descubra sua senha, não entra sem o seu aparelho.
        </p>
        <ol className="mt-6 grid gap-2 text-sm text-[#4A5568]">
          <li>1. Instale no celular o <strong>Google Authenticator</strong>, <strong>Microsoft Authenticator</strong> ou <strong>Authy</strong>.</li>
          <li>2. Clique no botão abaixo para gerar o QR Code.</li>
        </ol>
        <button type="button" onClick={generate} disabled={loading} className={`${primary} mt-8`}>
          <QrCode size={17} /> {loading ? 'Gerando...' : 'Gerar QR Code'}
        </button>
        {error && <p role="alert" className="mt-4 text-xs font-bold text-red-500">{error}</p>}
      </div>
    );
  }

  if (step === 'scan') {
    return (
      <div className={card}>
        <h2 className="font-display text-2xl font-bold">Escaneie com o app</h2>
        <p className="mt-3 text-sm leading-6 text-[#718096]">No aplicativo, toque em <strong>+</strong> → <strong>Ler QR Code</strong> e aponte a câmera.</p>
        <div className="mt-6 flex flex-col items-start gap-6 md:flex-row md:items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qr} alt="QR Code para o aplicativo autenticador" width={220} height={220} className="rounded-2xl border border-black/10 bg-white p-2" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#4A5568]">Não consegue ler? Digite esta chave no app:</p>
            <code className="mt-2 block break-all rounded-xl bg-[#F8F9FA] px-4 py-3 font-mono text-sm tracking-wider" data-no-translate>{secret}</code>
          </div>
        </div>

        <label htmlFor="totp-code" className="mt-8 block text-xs font-bold text-[#4A5568]">Digite o código de 6 dígitos que aparece no app</label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id="totp-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={7}
            placeholder="000000"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/[^\d]/g, '').slice(0, 6))}
            onKeyDown={(event) => event.key === 'Enter' && code.length === 6 && !loading && enable()}
            className="h-12 w-full rounded-xl border border-black/10 px-4 text-center font-mono text-lg tracking-[0.4em] outline-none focus:border-[#36B7C9] focus:ring-4 focus:ring-[#36B7C9]/10 sm:w-48"
          />
          <button type="button" onClick={enable} disabled={loading || code.length !== 6} className={primary}>
            <ShieldCheck size={17} /> {loading ? 'Conferindo...' : 'Ativar 2FA'}
          </button>
        </div>
        {error && <p role="alert" className="mt-4 text-xs font-bold text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className={card}>
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E6FFFA] text-[#277C73]"><Check size={22} /></span>
      <h2 className="mt-6 font-display text-2xl font-bold">2FA ativado!</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-[#718096]">
        Guarde os <strong>códigos de recuperação</strong> abaixo. Se você perder o celular, cada código permite entrar <strong>uma vez</strong> no lugar do código do app.
        <strong className="text-red-600"> Eles não serão mostrados de novo.</strong>
      </p>
      <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-[#F8F9FA] p-4 font-mono text-sm sm:max-w-md" data-no-translate>
        {recoveryCodes.map((item) => <span key={item} className="rounded-lg bg-white px-3 py-2 text-center">{item}</span>)}
      </div>
      <button type="button" onClick={copyCodes} className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#1597A8] hover:underline">
        <Copy size={14} /> {copied ? 'Copiados!' : 'Copiar códigos'}
      </button>
      <label className="mt-6 flex items-start gap-3 text-sm text-[#4A5568]">
        <input type="checkbox" checked={saved} onChange={(event) => setSaved(event.target.checked)} className="mt-1 accent-[#1A202C]" />
        Guardei os códigos em um lugar seguro, fora deste computador (gerenciador de senhas ou papel).
      </label>
      <button type="button" disabled={!saved} onClick={() => { router.replace('/admin'); router.refresh(); }} className={`${primary} mt-6`}>
        <KeyRound size={17} /> Ir para o admin
      </button>
    </div>
  );
}
