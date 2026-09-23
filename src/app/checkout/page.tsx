'use client';

import { ArrowLeft, CircleAlert, CreditCard, Home, LockKeyhole, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { AsaasCheckoutForm } from '@/components/AsaasCheckoutForm';
import { CheckoutButton } from '@/components/CheckoutButton';
import PublicShell from '@/components/PublicShell';
import { findProduct, formatPrice } from '@/lib/products';

/**
 * Checkout com dois gateways:
 * - Reais (Asaas): Pix, boleto ou cartao nacional, na fatura hospedada do Asaas.
 * - Dolar (Stripe): cartao internacional, na pagina hospedada do Stripe.
 *
 * Nenhum dado de cartao passa por este site. A confirmacao real chega pelos
 * webhooks (/api/webhooks/asaas e /api/webhooks/stripe), que geram a licenca.
 */
type Method = 'brl' | 'usd';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const product = findProduct(searchParams.get('produto'));
  const canceled = searchParams.get('canceled') === 'true';
  const sellsInBrl = Boolean(product?.priceBrlCents);
  const [method, setMethod] = useState<Method>(sellsInBrl ? 'brl' : 'usd');

  if (!product) {
    return (
      <div className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EDF2F7] text-[#718096]"><CreditCard size={27} /></span>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-[-.05em] sm:text-4xl">Seu carrinho está vazio.</h1>
        <p className="mt-4 text-sm leading-6 text-[#718096]">Escolha uma solução no portfólio para iniciar uma compra.</p>
        <Link href="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1A202C] px-6 py-3 text-sm font-bold text-white"><ArrowLeft size={16} /> Voltar ao portfólio</Link>
      </div>
    );
  }

  const activeMethod: Method = sellsInBrl ? method : 'usd';
  const price =
    activeMethod === 'brl' && product.priceBrlCents
      ? formatPrice(product.priceBrlCents, 'BRL')
      : formatPrice(product.priceCents, product.currency);

  const methods: Array<{ id: Method; title: string; text: string; price: string }> = [
    ...(product.priceBrlCents
      ? [{ id: 'brl' as const, title: 'Pagar em reais', text: 'Pix, boleto ou cartão de crédito nacional', price: formatPrice(product.priceBrlCents, 'BRL') }]
      : []),
    { id: 'usd', title: 'Pagar em dólar', text: 'Cartão de crédito internacional', price: formatPrice(product.priceCents, product.currency) }
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href={`/solucoes/${product.slug}`} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-xs font-bold text-[#718096] transition hover:bg-[#1A202C] hover:text-white"><ArrowLeft size={15} /> Voltar ao produto</Link>
        <div className="flex items-center gap-3 text-xs font-bold text-[#A0AEC0]"><span className="text-[#1597A8]">01 Pagamento</span><span>•</span><span>02 Entrega</span></div>
      </div>

      {canceled && (
        <p role="status" className="mt-6 flex items-center gap-2 rounded-2xl border border-[#FBD38D] bg-[#FFFAF0] p-4 text-sm font-semibold text-[#C05621]">
          <CircleAlert size={17} /> O pagamento foi cancelado. Nenhuma cobrança foi feita — você pode tentar novamente.
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
        <section>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">Checkout seguro</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-[-.05em] sm:text-4xl">Finalize sua compra.</h1>
          <p className="mt-4 text-sm leading-6 text-[#718096]">
            Escolha a forma de pagamento. Você será direcionado a uma página de pagamento segura — os dados do cartão nunca passam pelos nossos servidores.
          </p>

          <fieldset className="mt-8">
            <legend className="sr-only">Forma de pagamento</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {methods.map((option) => {
                const selected = activeMethod === option.id;
                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-start gap-4 rounded-2xl border bg-white p-5 transition ${selected ? 'border-[#1A202C] ring-2 ring-[#1A202C]/10' : 'border-black/10 hover:border-black/25'}`}
                  >
                    <input type="radio" name="method" value={option.id} checked={selected} onChange={() => setMethod(option.id)} className="mt-1 accent-[#1A202C]" />
                    <span className="min-w-0 flex-1">
                      <strong className="block text-sm">{option.title}</strong>
                      <small className="mt-1 block text-xs text-[#718096]">{option.text}</small>
                      <span className="mt-2 block font-display text-lg font-bold" data-no-translate>{option.price}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-6 grid gap-3">
            {[
              ['Confirmação automática', 'A licença (Product Key) aparece em "Minhas compras" assim que o pagamento é aprovado'],
              ['Conta necessária', 'Se ainda não estiver conectado, pediremos seu login antes do pagamento']
            ].map(([title, text]) => (
              <div key={title} className="flex items-start gap-4 rounded-2xl border border-black/10 bg-white p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFFFFF] text-[#1597A8]"><ShieldCheck size={18} /></span>
                <span><strong className="block text-sm">{title}</strong><small className="mt-1 block text-xs text-[#718096]">{text}</small></span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            {activeMethod === 'brl' ? (
              <AsaasCheckoutForm productSlug={product.slug} />
            ) : (
              <CheckoutButton
                productSlug={product.slug}
                label="Pagar com cartão internacional"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1A202C] px-6 text-sm font-bold text-white transition hover:bg-[#2D3748] disabled:cursor-wait disabled:opacity-60 sm:w-auto"
              />
            )}
          </div>
          <p className="mt-4 text-xs leading-5 text-[#A0AEC0]">
            Ao continuar, você concorda com os <Link href="/termos-de-uso" className="underline">termos de uso</Link>, a <Link href="/politica-de-privacidade" className="underline">política de privacidade</Link> e a <Link href="/politica-de-compra" className="underline">política de compra</Link>.
          </p>
          <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-[#718096]">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#36A5B4]" />
            <span>Você pode desistir da compra em até 7 dias, sem justificar, e receber o valor de volta (CDC, art. 49). Veja <Link href="/garantias-e-direitos" className="underline">garantias e direitos</Link>.</span>
          </p>
        </section>

        <aside className="h-fit rounded-3xl bg-[#1A202C] p-6 text-white shadow-glass sm:p-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#9AE6B4]">Seu pedido</p>
          <h2 className="mt-4 font-display text-xl font-bold">{product.name}</h2>
          <p className="mt-1 text-xs text-[#A0AEC0]">Licença comercial · 1 produto</p>
          <div className="my-7 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between text-sm text-[#CBD5E0]"><span>Licença comercial</span><span data-no-translate>{price}</span></div>
            <div className="mt-3 flex items-center justify-between text-sm text-[#CBD5E0]"><span>Entrega digital</span><span className="text-[#9AE6B4]">Incluída</span></div>
          </div>
          <div className="flex items-end justify-between border-t border-white/10 pt-5"><span className="text-sm text-[#CBD5E0]">Total</span><span className="font-display text-3xl font-bold" data-no-translate>{price}</span></div>
          <p className="mt-6 flex items-center gap-2 text-[11px] text-[#A0AEC0]"><LockKeyhole size={14} className="text-[#9AE6B4]" /> Pagamento processado pelo {activeMethod === 'brl' ? 'Asaas' : 'Stripe'}</p>
        </aside>
      </div>

      <div className="mt-10">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#718096] hover:text-[#1A202C]"><Home size={15} /> Tela inicial</Link>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <PublicShell>
      <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center text-sm text-[#718096]">Carregando...</div>}>
        <CheckoutContent />
      </Suspense>
    </PublicShell>
  );
}
