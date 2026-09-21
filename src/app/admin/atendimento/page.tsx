import AdminPlaceholder from '@/components/AdminPlaceholder';
import AdminShell from '@/components/AdminShell';
import { requireAdmin } from '@/lib/require-admin';

export default async function SupportPage() {
  await requireAdmin();
  return (
    <AdminShell>
      <AdminPlaceholder
        eyebrow="Support hub"
        title="IA & WhatsApp."
        description="Atendimento automatizado e encaminhamento para humanos."
        nextSteps={[
          'Conectar a API oficial do WhatsApp Business (Meta Cloud API).',
          'Integrar um modelo de IA com base de conhecimento dos produtos.',
          'Enquanto isso, os contatos do site ficam em "Leads & campanhas".'
        ]}
      />
    </AdminShell>
  );
}
