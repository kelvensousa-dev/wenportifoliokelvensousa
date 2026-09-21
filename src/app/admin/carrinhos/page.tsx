import AdminPlaceholder from '@/components/AdminPlaceholder';
import AdminShell from '@/components/AdminShell';
import { requireAdmin } from '@/lib/require-admin';

export default async function AbandonedCartsPage() {
  await requireAdmin();
  return (
    <AdminShell>
      <AdminPlaceholder
        eyebrow="Recovery automation"
        title="Carrinhos abandonados."
        description="Recuperação de vendas não concluídas."
        nextSteps={[
          'Usar os pedidos com status "Cancelado" (sessão do Stripe expirada) como fonte de carrinhos abandonados.',
          'Contratar um provedor de e-mail transacional (ex.: Resend, Amazon SES, SendGrid).',
          'Registrar consentimento (opt-in) antes de enviar ofertas, conforme a LGPD.'
        ]}
      />
    </AdminShell>
  );
}
