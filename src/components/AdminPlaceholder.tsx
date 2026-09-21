import { Construction } from 'lucide-react';

/**
 * Modulos que ainda nao tem backend. Antes estas telas exibiam numeros e
 * listas inventados (e-mails de clientes ficticios, "WhatsApp conectado",
 * botoes "Enviar oferta" que nao enviavam nada), o que induz a decisoes
 * erradas. Agora a tela diz a verdade sobre o estado do modulo.
 */
export default function AdminPlaceholder({ eyebrow, title, description, nextSteps }: { eyebrow: string; title: string; description: string; nextSteps: string[] }) {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">{eyebrow}</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-[-.05em] sm:text-4xl">{title}</h1>
      <p className="mt-3 text-sm text-[#718096]">{description}</p>
      <section className="mt-8 rounded-3xl border border-dashed border-black/15 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3 text-sm font-bold text-[#C05621]"><Construction size={18} /> Módulo em desenvolvimento</div>
        <p className="mt-3 text-sm leading-6 text-[#4A5568]">Esta área ainda não está conectada a dados reais. Para ativá-la será preciso:</p>
        <ul className="mt-4 grid gap-2 text-sm text-[#4A5568]">
          {nextSteps.map((step) => <li key={step} className="rounded-xl bg-[#F8F9FA] px-4 py-3">{step}</li>)}
        </ul>
      </section>
    </div>
  );
}
