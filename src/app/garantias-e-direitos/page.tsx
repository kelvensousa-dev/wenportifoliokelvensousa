import type { Metadata } from 'next';
import Link from 'next/link';
import { Scale } from 'lucide-react';
import LegalPage, { ContactChannels } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Garantias e direitos do consumidor',
  description: 'Garantia legal, direito de arrependimento, reparação de defeitos e onde reclamar: seus direitos nas compras da Kelven Studio.'
};

export default function GuaranteesPage() {
  return (
    <LegalPage
      current="/garantias-e-direitos"
      icon={Scale}
      kicker="Amparo ao consumidor"
      title="Garantias e direitos do consumidor"
      summary="Resumo: além do que prometemos na página de cada produto, a lei garante a você garantia contra defeitos, cumprimento da oferta e desistência em 7 dias. Nenhuma regra do nosso site diminui esses direitos."
    >
      <h2>1. Seus direitos estão na lei</h2>
      <p>As compras feitas por consumidores neste site seguem o Código de Defesa do Consumidor (Lei nº 8.078/1990), o Decreto nº 7.962/2013, que trata do comércio eletrônico, e a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Nenhum dos nossos documentos exclui, limita ou reduz os direitos que essas leis dão a você. Se algum trecho tiver esse efeito, ele não vale.</p>

      <h2>2. Garantia legal contra defeitos</h2>
      <p>A garantia legal existe por força de lei, não precisa ser contratada nem depende de termo escrito, e não tem custo (CDC, arts. 24 e 26). O prazo para reclamar de defeitos é de:</p>
      <ul>
        <li><strong>90 dias</strong> para produtos duráveis. Adotamos esse prazo para licenças de software, aplicativos, templates e automações.</li>
        <li><strong>30 dias</strong> para serviços e produtos não duráveis.</li>
      </ul>
      <p>O prazo conta da entrega do produto (a liberação da licença no painel) ou do término do serviço. Se o defeito estava escondido, ele conta a partir do momento em que o problema fica evidente (CDC, art. 26, § 3º).</p>

      <h2>3. Defeito no produto ou no serviço</h2>
      <p>Se o produto não funcionar como anunciado ou tiver defeito que o torne impróprio ao uso, temos até 30 dias para corrigir. Passado esse prazo sem solução, você escolhe entre (CDC, arts. 18 e 20):</p>
      <ol>
        <li>a substituição por outro produto equivalente ou a nova execução do serviço;</li>
        <li>a devolução imediata do valor pago, monetariamente atualizado, sem prejuízo de eventual indenização por perdas e danos;</li>
        <li>o abatimento proporcional do preço.</li>
      </ol>
      <p>Você também pode pedir uma dessas opções de imediato, sem esperar os 30 dias, quando o defeito comprometer a essência do produto, reduzir o seu valor ou tornar a correção inviável.</p>

      <h2>4. Oferta descumprida</h2>
      <p>O que anunciamos nos vincula. Se não entregarmos o que foi ofertado, você pode, à sua escolha, exigir o cumprimento da oferta, aceitar outro produto ou serviço equivalente, ou cancelar a compra e receber de volta o valor pago, atualizado, sem prejuízo de perdas e danos (CDC, art. 35).</p>

      <h2>5. Direito de arrependimento</h2>
      <p>Você pode desistir da compra feita pela internet em até 7 dias corridos, sem justificar, e receber tudo o que pagou de volta (CDC, art. 49). O passo a passo está na <Link href="/politica-de-compra">Política de compra</Link>.</p>

      <h2>6. Garantia contratual</h2>
      <p>Quando a página de um produto ou a proposta de um projeto oferecer uma garantia adicional, como suporte estendido ou atualizações, ela soma-se à garantia legal e não a substitui (CDC, art. 50).</p>

      <h2>7. O que não é considerado defeito</h2>
      <p>Não configuram defeito, por si sós, o mau uso do produto, alterações feitas por terceiros no código ou na configuração, o uso em ambiente diferente do informado na página do produto e a falta de resultados comerciais específicos, que dependem da operação de cada cliente. Em caso de dúvida, vamos analisar o seu caso individualmente, e o ônus de comprovar que o problema não é defeito é nosso, nas hipóteses em que a lei assim determina.</p>

      <h2>8. Como acionar a garantia</h2>
      <p>Fale com a <Link href="/atendimento">central de atendimento</Link> por qualquer canal abaixo, informando o e-mail da compra, o produto e a descrição do problema. Prints e mensagens de erro ajudam a resolver mais rápido.</p>
      <ContactChannels />
      <p>Você receberá a confirmação do recebimento da sua solicitação e a resposta de uma pessoa da nossa equipe em até 1 dia útil.</p>

      <h2>9. Se não resolvermos</h2>
      <p>Você pode, a qualquer momento e sem custo, recorrer também a:</p>
      <ul>
        <li><strong>Procon</strong> do seu estado ou município;</li>
        <li><strong><a href="https://www.consumidor.gov.br" target="_blank" rel="noopener noreferrer">consumidor.gov.br</a></strong>, serviço público e gratuito de solução de conflitos de consumo;</li>
        <li><strong>Juizado Especial Cível</strong>, que atende causas de menor valor e, em várias delas, dispensa advogado.</li>
      </ul>
      <p>Procurar esses órgãos não impede que você fale conosco, e nós preferimos resolver diretamente.</p>

      <h2>10. Dados pessoais</h2>
      <p>Direitos sobre os seus dados, como acesso, correção e exclusão, estão na <Link href="/politica-de-privacidade">Política de privacidade</Link>. Reclamações sobre proteção de dados também podem ser feitas à Autoridade Nacional de Proteção de Dados (ANPD).</p>
    </LegalPage>
  );
}
