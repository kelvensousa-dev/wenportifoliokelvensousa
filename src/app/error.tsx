'use client';

import { useEffect } from 'react';

/**
 * Tela de erro amigavel. Sem ela, qualquer falha inesperada de renderizacao
 * mostrava a tela branca padrao do Next para o usuario final.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F8F9FA] px-6 text-center text-[#1A202C]">
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#C53030]">Algo deu errado</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-[-.05em]">Não conseguimos carregar esta página.</h1>
      <p className="mt-4 max-w-md text-sm leading-6 text-[#718096]">Tente novamente em alguns instantes.{error.digest ? ` Código: ${error.digest}` : ''}</p>
      <button onClick={reset} className="mt-8 rounded-full bg-[#1A202C] px-6 py-3 text-sm font-bold text-white">Tentar novamente</button>
    </main>
  );
}
