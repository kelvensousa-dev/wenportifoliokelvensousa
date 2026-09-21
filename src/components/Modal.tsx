'use client';

import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

/**
 * Modal acessivel: fecha com Esc e clique no fundo, trava a rolagem da
 * pagina e devolve o foco ao elemento anterior. Os modais antigos nao
 * fechavam com Esc e deixavam a pagina rolar por tras no celular.
 */
export default function Modal({ open, onClose, label, children, maxWidth = 'max-w-lg' }: { open: boolean; onClose: () => void; label: string; children: React.ReactNode; maxWidth?: string }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label={label} className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:px-6">
      <button type="button" aria-label="Fechar" tabIndex={-1} className="absolute inset-0 bg-[#1A202C]/60 backdrop-blur-sm" onClick={onClose} />
      <div ref={panelRef} tabIndex={-1} className={`relative max-h-[92vh] w-full ${maxWidth} overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl outline-none sm:rounded-3xl sm:p-8`}>
        <button type="button" aria-label="Fechar" onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-[#718096] hover:bg-[#F8F9FA] hover:text-[#1A202C]">
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}
