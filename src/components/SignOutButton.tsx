'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function SignOutButton({ callbackUrl = '/', className }: { callbackUrl?: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl })}
      className={className ?? 'inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-2 text-xs font-bold text-[#718096] hover:bg-white hover:text-[#1A202C]'}
    >
      <LogOut size={15} /> Sair
    </button>
  );
}
