import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import LegalPage, { SupplierInfo } from '@/components/LegalPage';
import { company, contactEmail } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Termos de uso',
  description: 'Regras de uso da plataforma, licenças, pagamentos, suporte e responsabilidades da Kelven Studio.'
};

export default function TermsPage() {
  return (
    <LegalPage current="/termos-de-uso" icon={FileText} kicker="Documento legal" title="Termos de uso">
      <h2>1. Aceite e quem somos</h2>
      <p>Estes termos regulam o uso do site e a contratação de produtos e serviços oferecidos por {company.name}. Ao navegar, criar uma conta ou comprar, você declara que leu e concorda com estes termos, com a <Link href="/politica-de-privacidade">Política de privacidade</Link> e com a <Link href="/politica-de-compra">Política de compra</Link>.</p>
      <SupplierInfo />

      <h2>2. Uso da plataforma</h2>
      <p>Oferecemos produtos digitais, licenças, templates, softwares e serviços sob medida. Você concorda em fornecer informações corretas e em usar os produtos conforme a licença adquirida e a lei. Para contratar, é preciso ter capacidade civil, ou ser representado ou assistido por responsável legal.</p>

      <h2>3. Conta e credenciais</h2>
      <p>Você é responsável por manter suas credenciais em sigilo e por toda atividade feita na sua conta. Se suspeitar de uso indevido, avise a <Link href="/atendimento">central de atendimento</Link> imediatamente. Podemos suspender contas usadas para fraude, abuso ou violação destes termos, garantido o seu direito de esclarecimento.</p>

      <h2>4. Licenças e propriedade intelectual</h2>
      <p>A compra concede o direito de uso definido na página do produto ou na proposta comercial. O código, a identidade visual e os materiais continuam protegidos por direitos de propriedade intelectual. É proibida a revenda, a sublicença e a redistribuição não autorizadas.</p>

      <h2>5. Preços, pagamentos e entrega</h2>
      <p>O preço, a moeda e o conteúdo de cada oferta são informados antes da contratação. Os pagamentos são processados pelo Stripe, e o pedido é confirmado após a aprovação. Depois disso, a licença e os links de download ficam no painel do cliente, por URLs temporárias e protegidas. Detalhes na <Link href="/politica-de-compra">Política de compra</Link>.</p>

      <h2>6. Desistência, garantias e reembolso</h2>
      <p>Você pode desistir da compra em até 7 dias corridos, sem justificar, e tem garantia legal contra defeitos, nos termos do Código de Defesa do Consumidor. As regras completas estão na <Link href="/politica-de-compra">Política de compra</Link> e em <Link href="/garantias-e-direitos">Garantias e direitos do consumidor</Link>.</p>

      <h2>7. Suporte e atualizações</h2>
      <p>O nível de suporte e as atualizações variam conforme o produto e estão descritos na página de cada um. O escopo de projetos sob medida é definido em proposta aprovada pelas partes.</p>

      <h2>8. Atendimento ao cliente</h2>
      <p>O atendimento é feito por WhatsApp, e-mail e formulário. O primeiro atendimento no WhatsApp é feito por um assistente virtual com inteligência artificial, e você pode pedir um atendente humano a qualquer momento. Veja como funciona na <Link href="/atendimento">Central de atendimento</Link>.</p>

      <h2>9. Responsabilidades</h2>
      <p>O cliente é responsável pelos dados que insere e pelo uso legal das soluções. {company.name} responde pelos produtos e serviços que fornece, nos limites da lei. Não garantimos resultados comerciais específicos, pois eles dependem do contexto e da operação de cada cliente. Também não respondemos por indisponibilidades causadas por serviços de terceiros ou por eventos fora do nosso controle, na medida em que a lei permitir.</p>

      <h2>10. Direitos do consumidor</h2>
      <p>Nada nestes termos exclui ou limita os direitos garantidos ao consumidor pela lei. Em caso de conflito entre estes termos e o Código de Defesa do Consumidor, prevalece o Código.</p>

      <h2>11. Alterações destes termos</h2>
      <p>Podemos atualizar estes termos para refletir mudanças na lei ou no serviço. A data da última atualização fica no topo desta página. Compras já realizadas continuam regidas pelos termos vigentes na data da contratação.</p>

      <h2>12. Lei aplicável e foro</h2>
      <p>Estes termos seguem a lei brasileira. Para consumidores, fica eleito o foro do domicílio do consumidor para resolver eventuais conflitos.</p>

      <h2>13. Contato</h2>
      <p>Dúvidas sobre estes termos podem ser enviadas para <a href={`mailto:${contactEmail}`}>{contactEmail}</a> ou pelos demais canais da <Link href="/atendimento">central de atendimento</Link>.</p>
    </LegalPage>
  );
}
