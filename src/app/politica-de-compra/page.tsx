import type { Metadata } from 'next';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import LegalPage, { ContactChannels, SupplierInfo } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Política de compra',
  description: 'Como funcionam preços, pagamento, entrega, direito de arrependimento de 7 dias e reembolso nas compras da Kelven Studio.'
};

export default function PurchasePolicyPage() {
  return (
    <LegalPage
      current="/politica-de-compra"
      icon={ShoppingBag}
      kicker="Compra segura"
      title="Política de compra"
      summary="Resumo: você recebe a licença no painel após a aprovação do pagamento e pode desistir da compra em até 7 dias, sem justificar e com devolução do valor pago, conforme o Código de Defesa do Consumidor."
    >
      <h2>1. Quem vende</h2>
      <p>As vendas deste site são feitas pelo fornecedor abaixo. Guarde estes dados: eles identificam quem responde pela sua compra.</p>
      <SupplierInfo />

      <h2>2. Produtos, preços e informações da oferta</h2>
      <p>Vendemos produtos digitais (licenças de software, templates, aplicativos e automações) e serviços sob medida. A página de cada produto informa, antes da contratação, o que está incluído, o preço, a moeda, o tipo de licença e o nível de suporte. Toda oferta veiculada nos vincula e integra o contrato (CDC, art. 30).</p>
      <p>Quando o preço for exibido em moeda estrangeira, como o dólar americano, o valor cobrado na fatura em reais depende da cotação do dia, do IOF e das tarifas da operadora do seu cartão. Esses valores não são definidos por nós.</p>

      <h2>3. Pagamento</h2>
      <p>O pagamento é feito por cartão de crédito na página segura do Stripe, Inc. Os dados do seu cartão são digitados diretamente no Stripe e nunca passam pelos nossos servidores. O pedido só é confirmado depois da aprovação do pagamento. Se ele for recusado ou cancelado, nenhuma licença é liberada e você pode tentar novamente.</p>

      <h2>4. Entrega</h2>
      <p>A entrega é digital e acontece logo após a aprovação do pagamento: a licença (Product Key) e os links de download ficam disponíveis em <Link href="/dashboard/notificacoes">Minhas compras</Link>, com acesso por links temporários e protegidos. Nenhum produto físico é enviado.</p>
      <p>Se o pagamento foi aprovado e a licença não apareceu no painel, fale com a nossa <Link href="/atendimento">central de atendimento</Link> informando o e-mail da compra. Resolveremos ou devolveremos o valor.</p>
      <p>Nos projetos sob medida, prazos, etapas e formas de entrega constam da proposta aprovada por você.</p>

      <h2>5. Direito de arrependimento: 7 dias</h2>
      <p>Como a compra é feita pela internet, você pode desistir dela em até <strong>7 dias corridos</strong>, contados da contratação ou do recebimento do produto ou serviço, sem precisar dar qualquer justificativa (CDC, art. 49).</p>
      <ul>
        <li><strong>Como pedir:</strong> por qualquer canal da <Link href="/atendimento">central de atendimento</Link>, incluindo o WhatsApp, o e-mail e o formulário do site. Informe o e-mail da compra e o produto.</li>
        <li><strong>Confirmação:</strong> confirmamos imediatamente o recebimento do seu pedido de desistência (Decreto 7.962/2013, art. 5º).</li>
        <li><strong>Devolução do valor:</strong> você recebe de volta tudo o que pagou, de imediato e monetariamente atualizado, pelo mesmo meio de pagamento. O estorno é solicitado ao Stripe assim que o pedido é confirmado. O prazo para aparecer na sua fatura ou conta depende do banco e da operadora do cartão.</li>
        <li><strong>Licença:</strong> com a desistência, a licença é cancelada e o produto não deve mais ser usado.</li>
      </ul>
      <p>Nos serviços sob medida, o direito de arrependimento também vale. As condições de pagamento e de andamento do projeto ficam na proposta aprovada e não afastam nenhum direito previsto no CDC.</p>

      <h2>6. Cancelamento e reembolso depois dos 7 dias</h2>
      <p>Passado o prazo de arrependimento, o reembolso é devido quando houver defeito que não seja corrigido no prazo legal, descumprimento da oferta ou cobrança indevida, conforme descrito em <Link href="/garantias-e-direitos">Garantias e direitos do consumidor</Link>. Também vale qualquer condição mais favorável que a página do produto ou a proposta ofereça.</p>

      <h2>7. Cobrança indevida ou em duplicidade</h2>
      <p>Se você identificar uma cobrança que não reconhece, um valor diferente do informado ou uma cobrança repetida, avise-nos pela central de atendimento. Verificamos o caso e, confirmado o erro, devolvemos o valor cobrado indevidamente, com os acréscimos previstos em lei (CDC, art. 42, parágrafo único).</p>

      <h2>8. Onde tirar dúvidas</h2>
      <p>Antes ou depois da compra, fale com a gente:</p>
      <ContactChannels />
    </LegalPage>
  );
}
