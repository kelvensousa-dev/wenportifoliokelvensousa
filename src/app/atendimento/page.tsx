import type { Metadata } from 'next';
import Link from 'next/link';
import { Headset } from 'lucide-react';
import LegalPage, { ContactChannels } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Central de atendimento',
  description: 'Atendimento ao cliente da Kelven Studio por WhatsApp com assistente virtual (IA) e equipe humana, e-mail e formulário.'
};

export default function SupportPage() {
  return (
    <LegalPage
      current="/atendimento"
      icon={Headset}
      kicker="Atendimento ao consumidor"
      title="Central de atendimento"
      summary="Resumo: o primeiro atendimento no WhatsApp é feito por um assistente virtual com inteligência artificial, 24 horas por dia. Você pode pedir uma pessoa a qualquer momento, e solicitações como cancelamento e reembolso são analisadas pela nossa equipe."
    >
      <h2>1. Canais de atendimento</h2>
      <p>Dúvidas, reclamações, pedidos de suporte, cancelamento, desistência da compra e reembolso podem ser feitos por qualquer um dos canais abaixo, sem custo adicional além da sua conexão de internet.</p>
      <ContactChannels />
      <p>Respondemos os contatos feitos por e-mail e formulário, e os que precisarem de atendente humano, em até <strong>1 dia útil</strong>.</p>

      <h2>2. Como funciona o atendimento por inteligência artificial</h2>
      <p>O atendimento pelo WhatsApp começa com um <strong>assistente virtual que usa inteligência artificial</strong>. Ele não é uma pessoa e se apresenta como assistente virtual logo no início da conversa. Ele pode:</p>
      <ul>
        <li>tirar dúvidas sobre produtos, preços, licenças e como comprar;</li>
        <li>orientar sobre acesso ao painel, download e uso das soluções;</li>
        <li>registrar solicitações de suporte, reclamações, desistência e reembolso.</li>
      </ul>
      <p>O assistente pode errar. Por isso, informações importantes, como preços, prazos e condições de contrato, valem conforme a página do produto, a proposta e os documentos legais deste site, e não conforme uma resposta isolada do chat.</p>

      <h3>Atendimento humano</h3>
      <p>Você pode pedir para falar com uma pessoa a qualquer momento da conversa. O atendimento humano acontece em dias úteis, e a sua conversa fica registrada para que você não precise repetir o que já contou.</p>

      <h3>Decisões e revisão</h3>
      <p>O assistente virtual orienta e registra o seu pedido, mas <strong>não decide sozinho</strong> sobre cancelamentos, reembolsos ou reclamações. Essas solicitações são analisadas por uma pessoa da nossa equipe. Você tem direito de pedir a revisão de qualquer decisão tomada com base em tratamento automatizado de dados (LGPD, art. 20).</p>

      <h3>Cuidados com os seus dados</h3>
      <ul>
        <li>Nunca enviaremos pelo chat pedidos de senha, código de verificação ou número completo do cartão. Não compartilhe esses dados por mensagem.</li>
        <li>O pagamento é feito somente na página segura do Stripe, no nosso site.</li>
        <li>As conversas são armazenadas para atender você, comprovar o que foi solicitado e melhorar o serviço. O tratamento segue a <Link href="/politica-de-privacidade">Política de privacidade</Link>.</li>
      </ul>

      <h2>3. Pedidos que podem ser feitos pela central</h2>
      <ul>
        <li><strong>Desistência da compra em até 7 dias.</strong> Confirmamos o recebimento imediatamente. Veja a <Link href="/politica-de-compra">Política de compra</Link>.</li>
        <li><strong>Defeito ou problema no produto.</strong> Veja as <Link href="/garantias-e-direitos">Garantias e direitos do consumidor</Link>.</li>
        <li><strong>Cobrança indevida, em duplicidade ou licença não liberada.</strong> Informe o e-mail da compra.</li>
        <li><strong>Direitos sobre dados pessoais.</strong> Acesso, correção, exclusão e revisão de decisões automatizadas.</li>
        <li><strong>Sugestões e elogios.</strong> Eles nos ajudam a melhorar.</li>
      </ul>
      <p>Para agilizar, informe o e-mail usado na compra, o nome do produto e uma descrição do que aconteceu.</p>

      <h2>4. Se você não ficar satisfeito</h2>
      <p>Se a sua solicitação não for resolvida, você pode procurar o <strong>Procon</strong> do seu estado, o serviço público <a href="https://www.consumidor.gov.br" target="_blank" rel="noopener noreferrer">consumidor.gov.br</a> ou o Juizado Especial Cível. Saiba mais em <Link href="/garantias-e-direitos">Garantias e direitos do consumidor</Link>.</p>
    </LegalPage>
  );
}
