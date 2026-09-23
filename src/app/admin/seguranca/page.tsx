import { ShieldCheck } from 'lucide-react';
import AdminShell from '@/components/AdminShell';
import { TwoFactorSetup } from '@/components/TwoFactorSetup';
import { requireAdmin } from '@/lib/require-admin';

export const dynamic = 'force-dynamic';

/** Configuracao do 2FA. E a unica pagina do admin acessivel antes de ativa-lo. */
export default async function AdminSecurityPage() {
  const admin = await requireAdmin({ allowWithout2fa: true });
  const enabled = Boolean(admin.totpEnabledAt);

  return (
    <AdminShell>
      <section className="mx-auto max-w-4xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#36A5B4]">Conta</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-[-.05em] sm:text-5xl">Segurança.</h1>

        {!enabled && (
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            A verificação em duas etapas é <strong>obrigatória</strong> para contas administrativas. O restante do painel fica bloqueado até a ativação.
          </p>
        )}

        <div className="mt-8">
          {enabled ? (
            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E6FFFA] text-[#277C73]"><ShieldCheck size={22} /></span>
              <h2 className="mt-6 font-display text-2xl font-bold">Verificação em duas etapas ativa</h2>
              <p className="mt-3 text-sm text-[#718096]">
                Ativada em {admin.totpEnabledAt!.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}. Códigos de recuperação restantes: <strong>{admin.totpRecoveryHashes.length}</strong> de 8.
              </p>
              <p className="mt-4 text-sm leading-6 text-[#718096]">
                Trocou de celular ou acabaram os códigos de recuperação? Por segurança, a redefinição é feita pelo servidor (veja <code className="rounded bg-[#F8F9FA] px-1">SEGURANCA.md</code>).
              </p>
            </div>
          ) : (
            <TwoFactorSetup />
          )}
        </div>
      </section>
    </AdminShell>
  );
}
