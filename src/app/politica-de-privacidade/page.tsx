import type { Metadata } from 'next';
import Link from 'next/link';
import { LockKeyhole } from 'lucide-react';
import LegalPage from '@/components/LegalPage';
import { company, contactEmail } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Política de privacidade',
  description: 'Como a Kelven Studio coleta, usa e protege seus dados pessoais, incluindo o atendimento por WhatsApp com inteligência artificial (LGPD).'
};

export default function PrivacyPage() {
  return (
    <LegalPage current="/politica-de-privacidade" icon={LockKeyhole} kicker="Transparência" title="Política de privacidade">
      <h2>1. Quem é o controlador</h2>
      <p>{company.name} é a controladora dos dados pessoais tratados neste site, nos termos da Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018). Você fala com a gente sobre privacidade em <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>

      <h2>2. Dados que coletamos</h2>
      <ul>
        <li><strong>Conta:</strong> nome, e-mail e senha. A senha é guardada de forma criptografada, e nunca em texto aberto.</li>
        <li><strong>Compras:</strong> produto, valor, status do pedido e licença emitida. Não guardamos dados de cartão.</li>
        <li><strong>Contato e propostas:</strong> nome, e-mail, assunto e a mensagem que você envia, incluindo dados de projeto.</li>
        <li><strong>Atendimento por WhatsApp:</strong> número de telefone, nome do perfil e o conteúdo e o histórico das conversas.</li>
        <li><strong>Dados técnicos:</strong> endereço IP, navegador e registros de acesso, usados para segurança e prevenção a fraude.</li>
      </ul>

      <h2>3. Para que usamos e em que bases legais</h2>
      <p>Usamos os dados para criar e proteger sua conta, processar compras, entregar licenças, prestar suporte, responder contatos, prevenir fraudes, emitir documentos fiscais quando aplicável e cumprir obrigações legais. As bases legais são a execução do contrato e de procedimentos preliminares a ele, o cumprimento de obrigação legal, o legítimo interesse (segurança e prevenção a fraude) e, quando necessário, o seu consentimento. Não vendemos dados pessoais.</p>

      <h2>4. Pagamentos</h2>
      <p>Dados de cartão não são coletados nem armazenados por {company.name}. O pagamento é feito diretamente na página segura do Stripe, Inc., que processa os dados conforme o padrão PCI-DSS e pode tratá-los fora do Brasil. Guardamos apenas o registro do pedido (produto, valor e status).</p>

      <h2>5. Atendimento por WhatsApp e inteligência artificial</h2>
      <p>O primeiro atendimento pelo WhatsApp é feito por um assistente virtual com inteligência artificial, e você pode pedir um atendente humano a qualquer momento (veja a <Link href="/atendimento">Central de atendimento</Link>). Para isso, tratamos o seu número, o seu nome de perfil e o conteúdo das mensagens, com as seguintes finalidades:</p>
      <ul>
        <li>responder dúvidas e prestar suporte;</li>
        <li>registrar solicitações, como desistência, reembolso e reclamações;</li>
        <li>comprovar o que foi solicitado e o que foi respondido;</li>
        <li>melhorar a qualidade do atendimento.</li>
      </ul>
      <p>As mensagens passam pela plataforma WhatsApp (Meta) e por fornecedores de infraestrutura e de inteligência artificial que nos prestam serviço como operadores, sob contrato e apenas para essas finalidades. Não peça nem envie senhas, códigos de verificação ou dados de cartão pelo chat. Decisões sobre cancelamento, reembolso e reclamações são tomadas por uma pessoa, e você pode pedir a revisão de decisões tomadas com base em tratamento automatizado (LGPD, art. 20).</p>

      <h2>6. Compartilhamento e transferência internacional</h2>
      <p>Compartilhamos dados apenas com quem precisa deles para prestar o serviço: processador de pagamentos (Stripe), provedores de hospedagem e infraestrutura, plataforma de mensagens e fornecedores de inteligência artificial, e com autoridades quando a lei exigir. Alguns desses fornecedores ficam fora do Brasil. Nesses casos, a transferência é feita com as garantias previstas no art. 33 da LGPD.</p>

      <h2>7. Cookies e segurança</h2>
      <p>Usamos armazenamento local e cookies estritamente necessários para manter sua sessão e suas preferências, como o idioma. Aplicamos controles de acesso, conexões seguras (HTTPS) e URLs temporárias para arquivos privados.</p>

      <h2>8. Por quanto tempo guardamos</h2>
      <p>Guardamos os dados pelo tempo necessário para cumprir as finalidades acima e as obrigações legais, fiscais e contratuais, e para o exercício regular de direitos. Depois disso, eles são eliminados ou anonimizados.</p>

      <h2>9. Seus direitos</h2>
      <p>Nos termos do art. 18 da LGPD, você pode solicitar a qualquer momento:</p>
      <ul>
        <li>a confirmação de que tratamos seus dados e o acesso a eles;</li>
        <li>a correção de dados incompletos, inexatos ou desatualizados;</li>
        <li>a anonimização, o bloqueio ou a eliminação de dados desnecessários ou tratados em desconformidade;</li>
        <li>a portabilidade dos dados;</li>
        <li>informações sobre com quem compartilhamos seus dados;</li>
        <li>a revogação do consentimento, quando essa for a base legal;</li>
        <li>a revisão de decisões tomadas com base em tratamento automatizado.</li>
      </ul>
      <p>Envie a solicitação para <a href={`mailto:${contactEmail}`}>{contactEmail}</a> ou pela <Link href="/atendimento">central de atendimento</Link>. Atenderemos dentro dos prazos da lei, respeitadas as obrigações legais de guarda. Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).</p>

      <h2>10. Encarregado pelo tratamento de dados</h2>
      <p>Para questões de privacidade e LGPD, o canal oficial é <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>

      <h2>11. Alterações</h2>
      <p>Podemos atualizar esta política. A data da última atualização fica no topo da página, e mudanças relevantes serão comunicadas pelos nossos canais.</p>
    </LegalPage>
  );
}
