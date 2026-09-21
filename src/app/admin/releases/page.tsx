import AdminPlaceholder from '@/components/AdminPlaceholder';
import AdminShell from '@/components/AdminShell';
import { requireAdmin } from '@/lib/require-admin';

export default async function ReleasesPage() {
  await requireAdmin();
  return (
    <AdminShell>
      <AdminPlaceholder
        eyebrow="Delivery system"
        title="Releases & updates."
        description="Publicação de versões e arquivos para quem possui Product Key."
        nextSteps={[
          'Criar a API de upload para o MinIO/S3 (já previsto no docker-compose).',
          'Gerar links de download temporários (URL assinada) apenas para donos de licença.',
          'Enviar aviso por e-mail aos compradores quando uma versão for publicada.'
        ]}
      />
    </AdminShell>
  );
}
