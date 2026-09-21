import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F8F9FA] px-6 text-center text-[#1A202C]">
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">Erro 404</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-[-.05em] sm:text-5xl">Página não encontrada.</h1>
      <p className="mt-4 max-w-md text-sm leading-6 text-[#718096]">O endereço pode ter mudado ou não existe mais.</p>
      <Link href="/" className="mt-8 rounded-full bg-[#1A202C] px-6 py-3 text-sm font-bold text-white">Voltar para o início</Link>
    </main>
  );
}
