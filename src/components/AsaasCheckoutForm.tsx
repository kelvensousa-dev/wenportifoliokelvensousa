'use client';

import { ArrowRight, LockKeyhole } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { isValidCpfCnpj, maskCpfCnpj } from '@/lib/cpf-cnpj';

type Props = { productSlug: string };

/**
 * Inicia o pagamento em reais: envia o CPF/CNPJ ao servidor, que cria a
 * cobranca no Asaas e devolve a fatura hospedada (Pix, boleto ou cartao).
 * Nenhum dado de cartao passa pelo site.
 */
export function AsaasCheckoutForm({ productSlug }: Props) {
  const [document, setDocument] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit() {
    setError('');
    if (!isValidCpfCnpj(document)) {
      setError('Informe um CPF ou CNPJ válido.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/checkout/asaas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productSlug, cpfCnpj: document })
      });

      if (res.status === 401) {
        const back = `/checkout?produto=${encodeURIComponent(productSlug)}`;
        router.push(`/login?callbackUrl=${encodeURIComponent(back)}`);
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setError(data.message ?? 'Não foi possível iniciar o pagamento.');
        return;
      }

      window.location.assign(data.url);
    } catch {
      setError('Falha de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-3">
      <label htmlFor="cpf-cnpj" className="text-xs font-bold text-[#4A5568]">
        CPF ou CNPJ <span className="font-normal text-[#A0AEC0]">(exigido para emitir a cobrança)</span>
      </label>
      <input
        id="cpf-cnpj"
        inputMode="numeric"
        autoComplete="off"
        placeholder="000.000.000-00"
        value={document}
        onChange={(event) => setDocument(maskCpfCnpj(event.target.value))}
        onKeyDown={(event) => event.key === 'Enter' && !loading && handleSubmit()}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'cpf-cnpj-error' : undefined}
        className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 font-mono text-sm outline-none transition focus:border-[#36B7C9] focus:ring-4 focus:ring-[#36B7C9]/10 sm:max-w-xs"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1A202C] px-6 text-sm font-bold text-white transition hover:bg-[#2D3748] disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:justify-self-start"
      >
        {loading ? 'Gerando cobrança...' : 'Pagar com Pix, boleto ou cartão'}
        {loading ? <LockKeyhole size={15} /> : <ArrowRight size={15} />}
      </button>
      {error && (
        <p id="cpf-cnpj-error" role="alert" className="text-xs font-bold text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
