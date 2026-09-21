'use client';

import { ArrowRight, LockKeyhole } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type CheckoutButtonProps = {
  productSlug: string;
  label?: string;
  className?: string;
};

/**
 * Inicia o pagamento no Stripe Checkout (pagina hospedada pelo Stripe).
 *
 * Correcoes em relacao a versao anterior:
 * - O preco exibido era calculado a partir do texto "US$ 129" e mostrado
 *   como "R$ 129,00" (moeda errada). O preco agora aparece apenas no card,
 *   e o valor cobrado e definido exclusivamente pelo servidor.
 * - Visitante sem login recebia um `alert` generico de erro. Agora e levado
 *   ao login e volta automaticamente para o checkout.
 */
export function CheckoutButton({ productSlug, label = 'Comprar', className }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleCheckout() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productSlug })
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
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className={
          className ??
          'inline-flex items-center gap-2 rounded-full bg-[#1A202C] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#2D3748] disabled:cursor-wait disabled:opacity-60'
        }
      >
        {loading ? 'Processando...' : label}
        {loading ? <LockKeyhole size={15} /> : <ArrowRight size={15} />}
      </button>
      {error && (
        <p role="alert" className="text-right text-[11px] font-bold text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
