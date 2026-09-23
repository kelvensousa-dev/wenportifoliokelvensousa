'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = { productId: string; productName: string; active: boolean };

/** Botao do admin para retirar/recolocar um produto no site. */
export function ProductStatusToggle({ productId, productName, active }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function toggle() {
    const next = !active;
    const question = next
      ? `Recolocar "${productName}" à venda no site?`
      : `Retirar "${productName}" do site? Ele deixa de aparecer e não pode mais ser comprado. As compras já feitas continuam valendo.`;
    if (!window.confirm(question)) return;

    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(productId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: next })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message ?? 'Não foi possível alterar.');
        return;
      }
      router.refresh();
    } catch {
      setError('Falha de conexão.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1 sm:items-end">
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition disabled:cursor-wait disabled:opacity-60 ${active ? 'border border-red-200 bg-white text-red-600 hover:bg-red-50' : 'bg-[#1A202C] text-white hover:bg-[#2D3748]'}`}
      >
        {active ? <EyeOff size={14} /> : <Eye size={14} />}
        {loading ? 'Salvando...' : active ? 'Retirar do site' : 'Recolocar no site'}
      </button>
      {error && <p role="alert" className="text-[11px] font-bold text-red-500">{error}</p>}
    </div>
  );
}
