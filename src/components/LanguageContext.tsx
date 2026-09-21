'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type SiteLanguage = 'pt-BR' | 'es' | 'en-US';

type TranslationKey = 'home' | 'portfolio' | 'contact' | 'buy' | 'selectLanguage' | 'backHome' | 'continueShopping' | 'secureCheckout' | 'finishPurchase' | 'choosePayment' | 'paymentAuthorization' | 'confirmAuthorize' | 'paymentProtected' | 'humanSupport' | 'digitalProducts';

type LanguageContextValue = {
  language: SiteLanguage;
  setLanguage: (language: SiteLanguage) => void;
  translate: (key: TranslationKey) => string;
};

const translations: Record<SiteLanguage, Record<TranslationKey, string>> = {
  'pt-BR': {
    home: 'Início', portfolio: 'Portfólio', contact: 'Contato', buy: 'Comprar', selectLanguage: 'Selecionar idioma', backHome: 'Tela inicial', continueShopping: 'Continuar comprando', secureCheckout: 'Checkout seguro', finishPurchase: 'Finalize sua compra.', choosePayment: 'Escolha uma modalidade e informe os dados necessários para validar seu pagamento.', paymentAuthorization: 'Autorização segura', confirmAuthorize: 'Confirme e autorize.', paymentProtected: 'Pagamento protegido e entrega automática', humanSupport: 'Atendimento Humano', digitalProducts: 'Produtos digitais, sistemas e automações para negócios que querem operar melhor.'
  },
  es: {
    home: 'Inicio', portfolio: 'Portafolio', contact: 'Contacto', buy: 'Comprar', selectLanguage: 'Seleccionar idioma', backHome: 'Pantalla de inicio', continueShopping: 'Seguir comprando', secureCheckout: 'Pago seguro', finishPurchase: 'Finaliza tu compra.', choosePayment: 'Elige un método e informa los datos necesarios para validar tu pago.', paymentAuthorization: 'Autorización segura', confirmAuthorize: 'Confirma y autoriza.', paymentProtected: 'Pago protegido y entrega automática', humanSupport: 'Atención Humana', digitalProducts: 'Productos digitales, sistemas y automatizaciones para negocios que quieren operar mejor.'
  },
  'en-US': {
    home: 'Home', portfolio: 'Portfolio', contact: 'Contact', buy: 'Buy', selectLanguage: 'Select language', backHome: 'Home', continueShopping: 'Continue shopping', secureCheckout: 'Secure checkout', finishPurchase: 'Complete your purchase.', choosePayment: 'Choose a method and provide the details needed to validate your payment.', paymentAuthorization: 'Secure authorization', confirmAuthorize: 'Confirm and authorize.', paymentProtected: 'Protected payment and automatic delivery', humanSupport: 'Human Support', digitalProducts: 'Digital products, systems and automations for businesses that want to operate better.'
  }
};

const pageTranslations: Record<string, Record<SiteLanguage, string>> = {
  'Digital, but deliberate.': { 'pt-BR': 'Digital, mas intencional.', es: 'Digital, pero intencional.', 'en-US': 'Digital, but deliberate.' },
  'Produtos digitais que fazem o trabalho': { 'pt-BR': 'Produtos digitais que fazem o trabalho', es: 'Productos digitales que hacen avanzar el', 'en-US': 'Digital products that move' },
  'avançar.': { 'pt-BR': 'avançar.', es: 'trabajo.', 'en-US': 'work forward.' },
  'WEEKLY SIGNAL': { 'pt-BR': 'SINAL DA SEMANA', es: 'SEÑAL DE LA SEMANA', 'en-US': 'WEEKLY SIGNAL' },
  'revenue this month': { 'pt-BR': 'receita este mês', es: 'ingresos este mes', 'en-US': 'revenue this month' },
  'The catalogue': { 'pt-BR': 'O catálogo', es: 'El catálogo', 'en-US': 'The catalog' },
  'Escolha seu próximo': { 'pt-BR': 'Escolha seu próximo', es: 'Elige tu próximo', 'en-US': 'Choose your next' },
  'salto.': { 'pt-BR': 'salto.', es: 'salto.', 'en-US': 'leap.' },
  'All': { 'pt-BR': 'Todos', es: 'Todos', 'en-US': 'All' },
  'Demo ao vivo': { 'pt-BR': 'Demo ao vivo', es: 'Demo en vivo', 'en-US': 'Live demo' },
  'The difference': { 'pt-BR': 'A diferença', es: 'La diferencia', 'en-US': 'The difference' },
  'Menos promessa. Mais produto.': { 'pt-BR': 'Menos promessa. Mais produto.', es: 'Menos promesas. Más producto.', 'en-US': 'Less promise. More product.' },
  'Cada template nasce de um problema real, com documentação honesta e espaço para a sua própria assinatura.': { 'pt-BR': 'Cada template nasce de um problema real, com documentação honesta e espaço para a sua própria assinatura.', es: 'Cada plantilla nace de un problema real, con documentación honesta y espacio para tu propia firma.', 'en-US': 'Every template starts with a real problem, honest documentation and room for your own signature.' },
  'O que importa': { 'pt-BR': 'O que importa', es: 'Lo que importa', 'en-US': 'What matters' },
  'Outros': { 'pt-BR': 'Outros', es: 'Otros', 'en-US': 'Others' },
  'Código legível': { 'pt-BR': 'Código legível', es: 'Código legible', 'en-US': 'Readable code' },
  'Updates incluídos': { 'pt-BR': 'Updates incluídos', es: 'Actualizaciones incluidas', 'en-US': 'Updates included' },
  'Suporte humano': { 'pt-BR': 'Suporte humano', es: 'Soporte humano', 'en-US': 'Human support' },
  'Stay in the loop': { 'pt-BR': 'Fique por dentro', es: 'Mantente al día', 'en-US': 'Stay in the loop' },
  'Uma boa ideia merece chegar inteira.': { 'pt-BR': 'Uma boa ideia merece chegar inteira.', es: 'Una buena idea merece llegar completa.', 'en-US': 'A good idea deserves to arrive whole.' },
  'Me avise': { 'pt-BR': 'Me avise', es: 'Avísame', 'en-US': 'Notify me' },
  'Construído para 2.000+ makers e equipes.': { 'pt-BR': 'Construído para 2.000+ makers e equipes.', es: 'Creado para más de 2.000 makers y equipos.', 'en-US': 'Built for 2,000+ makers and teams.' },
  'SSL 256-bit · PCI-DSS · LGPD': { 'pt-BR': 'SSL 256-bit · PCI-DSS · LGPD', es: 'SSL de 256 bits · PCI-DSS · LGPD', 'en-US': '256-bit SSL · PCI-DSS · LGPD' },
  'Feito com intenção.': { 'pt-BR': 'Feito com intenção.', es: 'Hecho con intención.', 'en-US': 'Made with intention.' },
  'seu@email.com': { 'pt-BR': 'seu@email.com', es: 'tu@email.com', 'en-US': 'you@email.com' },
  'Seu e-mail': { 'pt-BR': 'Seu e-mail', es: 'Tu correo', 'en-US': 'Your email' },
  'Adicionar Orbit CRM ao carrinho': { 'pt-BR': 'Adicionar Orbit CRM ao carrinho', es: 'Añadir Orbit CRM al carrito', 'en-US': 'Add Orbit CRM to cart' },
  'Adicionar Atlas Storefront ao carrinho': { 'pt-BR': 'Adicionar Atlas Storefront ao carrinho', es: 'Añadir Atlas Storefront al carrito', 'en-US': 'Add Atlas Storefront to cart' },
  'Adicionar Signal Launch ao carrinho': { 'pt-BR': 'Adicionar Signal Launch ao carrinho', es: 'Añadir Signal Launch al carrito', 'en-US': 'Add Signal Launch to cart' },
  'Adicionar Flow Bot ao carrinho': { 'pt-BR': 'Adicionar Flow Bot ao carrinho', es: 'Añadir Flow Bot al carrito', 'en-US': 'Add Flow Bot to cart' },
  'Apps': { 'pt-BR': 'Apps', es: 'Apps', 'en-US': 'Apps' },
  'Web': { 'pt-BR': 'Web', es: 'Web', 'en-US': 'Web' },
  'Bots WhatsApp': { 'pt-BR': 'Bots WhatsApp', es: 'Bots de WhatsApp', 'en-US': 'WhatsApp bots' },
  'Operação comercial clara para times que precisam crescer sem perder contexto.': { 'pt-BR': 'Operação comercial clara para times que precisam crescer sem perder contexto.', es: 'Operación comercial clara para equipos que necesitan crecer sin perder contexto.', 'en-US': 'Clear sales operations for teams that need to grow without losing context.' },
  'Uma base veloz e elegante para transformar tráfego em vendas recorrentes.': { 'pt-BR': 'Uma base veloz e elegante para transformar tráfego em vendas recorrentes.', es: 'Una base rápida y elegante para convertir tráfico en ventas recurrentes.', 'en-US': 'A fast, elegant foundation for turning traffic into recurring sales.' },
  'Landing page de alta conversão com narrativa modular e CMS pronto.': { 'pt-BR': 'Landing page de alta conversão com narrativa modular e CMS pronto.', es: 'Landing page de alta conversión con narrativa modular y CMS listo.', 'en-US': 'High-converting landing page with modular storytelling and a ready CMS.' },
  'Automação conversacional para captar, qualificar e encaminhar oportunidades.': { 'pt-BR': 'Automação conversacional para captar, qualificar e encaminhar oportunidades.', es: 'Automatización conversacional para captar, calificar y encaminar oportunidades.', 'en-US': 'Conversational automation to capture, qualify and route opportunities.' },
  'Every reply, right on time.': { 'pt-BR': 'Cada resposta, na hora certa.', es: 'Cada respuesta, justo a tiempo.', 'en-US': 'Every reply, right on time.' },
  '14 conversations automated': { 'pt-BR': '14 conversas automatizadas', es: '14 conversaciones automatizadas', 'en-US': '14 conversations automated' },
  '© 2026 Kelven Studio. Feito com intenção.': { 'pt-BR': '© 2026 Kelven Studio. Feito com intenção.', es: '© 2026 Kelven Studio. Hecho con intención.', 'en-US': '© 2026 Kelven Studio. Made with intention.' },
  'Início': { 'pt-BR': 'Início', es: 'Inicio', 'en-US': 'Home' },
  'Portfólio': { 'pt-BR': 'Portfólio', es: 'Portafolio', 'en-US': 'Portfolio' },
  'Contato': { 'pt-BR': 'Contato', es: 'Contacto', 'en-US': 'Contact' },
  'Comprar': { 'pt-BR': 'Comprar', es: 'Comprar', 'en-US': 'Buy' },
  'Tela inicial': { 'pt-BR': 'Tela inicial', es: 'Pantalla de inicio', 'en-US': 'Home' },
  'Continuar comprando': { 'pt-BR': 'Continuar comprando', es: 'Seguir comprando', 'en-US': 'Continue shopping' },
  'Checkout seguro': { 'pt-BR': 'Checkout seguro', es: 'Pago seguro', 'en-US': 'Secure checkout' },
  'Finalize sua compra.': { 'pt-BR': 'Finalize sua compra.', es: 'Finaliza tu compra.', 'en-US': 'Complete your purchase.' },
  'Dados do pagamento': { 'pt-BR': 'Dados do pagamento', es: 'Datos del pago', 'en-US': 'Payment details' },
  'Autorização segura': { 'pt-BR': 'Autorização segura', es: 'Autorización segura', 'en-US': 'Secure authorization' },
  'Confirme e autorize.': { 'pt-BR': 'Confirme e autorize.', es: 'Confirma y autoriza.', 'en-US': 'Confirm and authorize.' },
  'Atendimento Humano': { 'pt-BR': 'Atendimento Humano', es: 'Atención Humana', 'en-US': 'Human Support' },
  'Peça seu orçamento': { 'pt-BR': 'Peça seu orçamento', es: 'Solicita tu presupuesto', 'en-US': 'Request a quote' },
  'Continuar para verificação': { 'pt-BR': 'Continuar para verificação', es: 'Continuar a la verificación', 'en-US': 'Continue to verification' },
  'Autorizar pagamento': { 'pt-BR': 'Autorizar pagamento', es: 'Autorizar pago', 'en-US': 'Authorize payment' },
  'Pagamento protegido e entrega automática': { 'pt-BR': 'Pagamento protegido e entrega automática', es: 'Pago protegido y entrega automática', 'en-US': 'Protected payment and automatic delivery' },
  'Produtos': { 'pt-BR': 'Produtos', es: 'Productos', 'en-US': 'Products' },
  'Por que nós': { 'pt-BR': 'Por que nós', es: 'Por qué nosotros', 'en-US': 'Why us' },
  'Entrar': { 'pt-BR': 'Entrar', es: 'Iniciar sesión', 'en-US': 'Sign in' },
  'Explorar produtos': { 'pt-BR': 'Explorar produtos', es: 'Explorar productos', 'en-US': 'Explore products' },
  'Ver o estúdio': { 'pt-BR': 'Ver o estúdio', es: 'Ver el estudio', 'en-US': 'See the studio' },
  'Produtos digitais que fazem o trabalho avançar.': { 'pt-BR': 'Produtos digitais que fazem o trabalho avançar.', es: 'Productos digitales que hacen avanzar el trabajo.', 'en-US': 'Digital products that move work forward.' },
  'Sistemas, automações e interfaces criados para equipes que preferem clareza ao ruído. Compre, personalize e coloque no ar.': { 'pt-BR': 'Sistemas, automações e interfaces criados para equipes que preferem clareza ao ruído. Compre, personalize e coloque no ar.', es: 'Sistemas, automatizaciones e interfaces creados para equipos que prefieren claridad al ruido. Compra, personaliza y lanza.', 'en-US': 'Systems, automations and interfaces for teams that prefer clarity over noise. Buy, customize and launch.' },
  'Mais vendidos & mais quentes': { 'pt-BR': 'Mais vendidos & mais quentes', es: 'Más vendidos y tendencias', 'en-US': 'Best sellers & trending' },
  'Escolha por objetivo.': { 'pt-BR': 'Escolha por objetivo.', es: 'Elige por objetivo.', 'en-US': 'Choose by objective.' },
  'O catálogo completo': { 'pt-BR': 'O catálogo completo', es: 'El catálogo completo', 'en-US': 'The full catalog' },
  'Seu portfólio, em movimento': { 'pt-BR': 'Seu portfólio, em movimento', es: 'Tu portafolio, en movimiento', 'en-US': 'Your portfolio, in motion' },
  'Encontre o sistema que faz seu próximo salto acontecer.': { 'pt-BR': 'Encontre o sistema que faz seu próximo salto acontecer.', es: 'Encuentra el sistema que hace posible tu próximo salto.', 'en-US': 'Find the system that makes your next leap happen.' },
  'Soluções digitais prontas para vender mais, operar melhor e criar experiências que o cliente lembra.': { 'pt-BR': 'Soluções digitais prontas para vender mais, operar melhor e criar experiências que o cliente lembra.', es: 'Soluciones digitales listas para vender más, operar mejor y crear experiencias memorables.', 'en-US': 'Digital solutions ready to sell more, operate better and create memorable experiences.' },
  'Peça seu orçamento.': { 'pt-BR': 'Peça seu orçamento.', es: 'Solicita tu presupuesto.', 'en-US': 'Request your quote.' },
  'Seu carrinho está vazio.': { 'pt-BR': 'Seu carrinho está vazio.', es: 'Tu carrito está vacío.', 'en-US': 'Your cart is empty.' },
  'Escolha uma solução no portfólio para iniciar uma compra.': { 'pt-BR': 'Escolha uma solução no portfólio para iniciar uma compra.', es: 'Elige una solución del portafolio para iniciar una compra.', 'en-US': 'Choose a solution from the portfolio to start a purchase.' },
  'Pagamento autorizado': { 'pt-BR': 'Pagamento autorizado', es: 'Pago autorizado', 'en-US': 'Payment authorized' },
  'Pedido confirmado.': { 'pt-BR': 'Pedido confirmado.', es: 'Pedido confirmado.', 'en-US': 'Order confirmed.' },
  'Seu próximo projeto começa com uma boa pergunta.': { 'pt-BR': 'Seu próximo projeto começa com uma boa pergunta.', es: 'Tu próximo proyecto comienza con una buena pregunta.', 'en-US': 'Your next project starts with a good question.' },
  'Vamos conversar': { 'pt-BR': 'Vamos conversar', es: 'Hablemos', 'en-US': 'Let’s talk' },
  'Mensagem enviada.': { 'pt-BR': 'Mensagem enviada.', es: 'Mensaje enviado.', 'en-US': 'Message sent.' },
  'Retornaremos em até um dia útil.': { 'pt-BR': 'Retornaremos em até um dia útil.', es: 'Responderemos en un día hábil.', 'en-US': 'We will reply within one business day.' },
  'Verificando acesso...': { 'pt-BR': 'Verificando acesso...', es: 'Verificando acceso...', 'en-US': 'Checking access...' },
  'O que está em alta': { 'pt-BR': 'O que está em alta', es: 'Lo que es tendencia', 'en-US': 'What is trending' },
  'Atualizado hoje': { 'pt-BR': 'Atualizado hoje', es: 'Actualizado hoy', 'en-US': 'Updated today' },
  'Do briefing ao resultado': { 'pt-BR': 'Do briefing ao resultado', es: 'Del briefing al resultado', 'en-US': 'From brief to outcome' },
  'Uma compra simples. Uma entrega que parece feita para você.': { 'pt-BR': 'Uma compra simples. Uma entrega que parece feita para você.', es: 'Una compra sencilla. Una entrega hecha para ti.', 'en-US': 'A simple purchase. A delivery that feels made for you.' },
  'Notificações': { 'pt-BR': 'Notificações', es: 'Notificaciones', 'en-US': 'Notifications' },
  'Voltar ao portfólio': { 'pt-BR': 'Voltar ao portfólio', es: 'Volver al portafolio', 'en-US': 'Back to portfolio' },
  'Novo release disponível': { 'pt-BR': 'Novo release disponível', es: 'Nuevo lanzamiento disponible', 'en-US': 'New release available' },
  'Oferta para sua operação': { 'pt-BR': 'Oferta para sua operação', es: 'Oferta para tu operación', 'en-US': 'Offer for your operation' },
  'Conta protegida': { 'pt-BR': 'Conta protegida', es: 'Cuenta protegida', 'en-US': 'Account protected' },
  'Bem-vindo ao Studio': { 'pt-BR': 'Bem-vindo ao Studio', es: 'Bienvenido al Studio', 'en-US': 'Welcome to the Studio' },
  'Termos de uso': { 'pt-BR': 'Termos de uso', es: 'Términos de uso', 'en-US': 'Terms of use' },
  'Política de privacidade': { 'pt-BR': 'Política de privacidade', es: 'Política de privacidad', 'en-US': 'Privacy policy' },
  'Bem-vindo de volta': { 'pt-BR': 'Bem-vindo de volta', es: 'Bienvenido de nuevo', 'en-US': 'Welcome back' },
  'Entre no seu espaço.': { 'pt-BR': 'Entre no seu espaço.', es: 'Entra en tu espacio.', 'en-US': 'Enter your workspace.' },
  'Crie seu acesso.': { 'pt-BR': 'Crie seu acesso.', es: 'Crea tu acceso.', 'en-US': 'Create your access.' },
  'Confirme sua identidade.': { 'pt-BR': 'Confirme sua identidade.', es: 'Confirma tu identidad.', 'en-US': 'Confirm your identity.' },
  'Cadastre-se grátis': { 'pt-BR': 'Cadastre-se grátis', es: 'Regístrate gratis', 'en-US': 'Sign up free' },
  'Entrar na conta': { 'pt-BR': 'Entrar na conta', es: 'Iniciar sesión', 'en-US': 'Sign in' },
  'Criar minha conta': { 'pt-BR': 'Criar minha conta', es: 'Crear mi cuenta', 'en-US': 'Create my account' }
  , 'Cartão internacional': { 'pt-BR': 'Cartão internacional', es: 'Tarjeta internacional', 'en-US': 'International card' }
  , 'Aprovação imediata no Brasil': { 'pt-BR': 'Aprovação imediata no Brasil', es: 'Aprobación inmediata en Brasil', 'en-US': 'Instant approval in Brazil' }
  , 'Pague com sua conta PayPal': { 'pt-BR': 'Pague com sua conta PayPal', es: 'Paga con tu cuenta PayPal', 'en-US': 'Pay with your PayPal account' }
  , 'Escolha uma modalidade e informe os dados necessários para validar seu pagamento.': { 'pt-BR': 'Escolha uma modalidade e informe os dados necessários para validar seu pagamento.', es: 'Elige un método e informa los datos necesarios para validar tu pago.', 'en-US': 'Choose a method and provide the details needed to validate your payment.' }
  , 'Nome no cartão': { 'pt-BR': 'Nome no cartão', es: 'Nombre en la tarjeta', 'en-US': 'Name on card' }
  , 'Como aparece no cartão': { 'pt-BR': 'Como aparece no cartão', es: 'Como aparece en la tarjeta', 'en-US': 'As shown on the card' }
  , 'Número do cartão': { 'pt-BR': 'Número do cartão', es: 'Número de tarjeta', 'en-US': 'Card number' }
  , 'Validade': { 'pt-BR': 'Validade', es: 'Vencimiento', 'en-US': 'Expiry date' }
  , 'Seu pedido': { 'pt-BR': 'Seu pedido', es: 'Tu pedido', 'en-US': 'Your order' }
  , 'Licença comercial · 1 produto': { 'pt-BR': 'Licença comercial · 1 produto', es: 'Licencia comercial · 1 producto', 'en-US': 'Commercial license · 1 product' }
  , 'Licença comercial': { 'pt-BR': 'Licença comercial', es: 'Licencia comercial', 'en-US': 'Commercial license' }
  , 'Entrega digital': { 'pt-BR': 'Entrega digital', es: 'Entrega digital', 'en-US': 'Digital delivery' }
  , 'Incluída': { 'pt-BR': 'Incluída', es: 'Incluida', 'en-US': 'Included' }
  , 'Total': { 'pt-BR': 'Total', es: 'Total', 'en-US': 'Total' }
  , 'Empresa': { 'pt-BR': 'Empresa', es: 'Empresa', 'en-US': 'Company' }
  , 'Comprar agora': { 'pt-BR': 'Comprar agora', es: 'Comprar ahora', 'en-US': 'Buy now' }
  , 'Peça um orçamento': { 'pt-BR': 'Peça um orçamento', es: 'Solicita un presupuesto', 'en-US': 'Request a quote' }
  , 'Compra protegida': { 'pt-BR': 'Compra protegida', es: 'Compra protegida', 'en-US': 'Protected purchase' }
  , 'Privacidade': { 'pt-BR': 'Privacidade', es: 'Privacidad', 'en-US': 'Privacy' }
  , 'SSL 256-bit, pagamentos processados por parceiros certificados e suporte humano.': { 'pt-BR': 'SSL 256-bit, pagamentos processados por parceiros certificados e suporte humano.', es: 'SSL de 256 bits, pagos procesados por socios certificados y soporte humano.', 'en-US': '256-bit SSL, payments processed by certified partners and human support.' }
  , '01 Pagamento': { 'pt-BR': '01 Pagamento', es: '01 Pago', 'en-US': '01 Payment' }
  , '02 Verificação': { 'pt-BR': '02 Verificação', es: '02 Verificación', 'en-US': '02 Verification' }
  , '03 Entrega': { 'pt-BR': '03 Entrega', es: '03 Entrega', 'en-US': '03 Delivery' }
  , 'LGPD · PCI-DSS · Licenças comerciais': { 'pt-BR': 'LGPD · PCI-DSS · Licenças comerciais', es: 'LGPD · PCI-DSS · Licencias comerciales', 'en-US': 'LGPD · PCI-DSS · Commercial licenses' }
  , 'Documento legal': { 'pt-BR': 'Documento legal', es: 'Documento legal', 'en-US': 'Legal document' }
  , 'Transparência': { 'pt-BR': 'Transparência', es: 'Transparencia', 'en-US': 'Transparency' }
  , 'Última atualização: 17 de setembro de 2026': { 'pt-BR': 'Última atualização: 17 de setembro de 2026', es: 'Última actualización: 17 de septiembre de 2026', 'en-US': 'Last updated: September 17, 2026' }
  , '1. Uso da plataforma': { 'pt-BR': '1. Uso da plataforma', es: '1. Uso de la plataforma', 'en-US': '1. Platform use' }
  , '2. Licenças e propriedade intelectual': { 'pt-BR': '2. Licenças e propriedade intelectual', es: '2. Licencias y propiedad intelectual', 'en-US': '2. Licenses and intellectual property' }
  , '3. Pagamentos e entrega': { 'pt-BR': '3. Pagamentos e entrega', es: '3. Pagos y entrega', 'en-US': '3. Payments and delivery' }
  , '4. Suporte e atualizações': { 'pt-BR': '4. Suporte e atualizações', es: '4. Soporte y actualizaciones', 'en-US': '4. Support and updates' }
  , '5. Responsabilidades': { 'pt-BR': '5. Responsabilidades', es: '5. Responsabilidades', 'en-US': '5. Responsibilities' }
  , '6. Contato': { 'pt-BR': '6. Contato', es: '6. Contacto', 'en-US': '6. Contact' }
  , '1. Dados que coletamos': { 'pt-BR': '1. Dados que coletamos', es: '1. Datos que recopilamos', 'en-US': '1. Data we collect' }
  , '2. Como usamos seus dados': { 'pt-BR': '2. Como usamos seus dados', es: '2. Cómo usamos tus datos', 'en-US': '2. How we use your data' }
  , '3. Pagamentos': { 'pt-BR': '3. Pagamentos', es: '3. Pagos', 'en-US': '3. Payments' }
  , '4. Cookies e segurança': { 'pt-BR': '4. Cookies e segurança', es: '4. Cookies y seguridad', 'en-US': '4. Cookies and security' }
  , '5. Seus direitos': { 'pt-BR': '5. Seus direitos', es: '5. Tus derechos', 'en-US': '5. Your rights' }
  , '6. Encarregado': { 'pt-BR': '6. Encarregado', es: '6. Responsable de privacidad', 'en-US': '6. Privacy contact' }
  , 'Acesso com intenção': { 'pt-BR': 'Acesso com intenção', es: 'Acceso con intención', 'en-US': 'Intentional access' }
  , 'Seu próximo avanço começa aqui.': { 'pt-BR': 'Seu próximo avanço começa aqui.', es: 'Tu próximo avance comienza aquí.', 'en-US': 'Your next step starts here.' }
  , 'Uma conta para seus produtos, licenças e próximos lançamentos.': { 'pt-BR': 'Uma conta para seus produtos, licenças e próximos lançamentos.', es: 'Una cuenta para tus productos, licencias y próximos lanzamientos.', 'en-US': 'One account for your products, licenses and upcoming releases.' }
  , 'Acesse seu painel e continue de onde parou.': { 'pt-BR': 'Acesse seu painel e continue de onde parou.', es: 'Accede a tu panel y continúa donde lo dejaste.', 'en-US': 'Access your dashboard and pick up where you left off.' }
  , 'Nome completo': { 'pt-BR': 'Nome completo', es: 'Nombre completo', 'en-US': 'Full name' }
  , 'E-mail profissional': { 'pt-BR': 'E-mail profissional', es: 'Correo profesional', 'en-US': 'Work email' }
  , 'Senha': { 'pt-BR': 'Senha', es: 'Contraseña', 'en-US': 'Password' }
  , 'Lembrar de mim': { 'pt-BR': 'Lembrar de mim', es: 'Recuérdame', 'en-US': 'Remember me' }
  , 'Esqueci minha senha': { 'pt-BR': 'Esqueci minha senha', es: 'Olvidé mi contraseña', 'en-US': 'Forgot password' }
  , 'Explorar soluções': { 'pt-BR': 'Explorar soluções', es: 'Explorar soluciones', 'en-US': 'Explore solutions' }
  , 'Produtos no portfólio': { 'pt-BR': 'Produtos no portfólio', es: 'Productos en el portafolio', 'en-US': 'Products in portfolio' }
  , 'Projetos entregues': { 'pt-BR': 'Projetos entregues', es: 'Proyectos entregados', 'en-US': 'Projects delivered' }
  , 'Satisfação média': { 'pt-BR': 'Satisfação média', es: 'Satisfacción media', 'en-US': 'Average satisfaction' }
  , 'Buscar solução...': { 'pt-BR': 'Buscar solução...', es: 'Buscar solución...', 'en-US': 'Search solution...' }
  , 'Todos': { 'pt-BR': 'Todos', es: 'Todos', 'en-US': 'All' }
  , 'Vendas': { 'pt-BR': 'Vendas', es: 'Ventas', 'en-US': 'Sales' }
  , 'Marketing': { 'pt-BR': 'Marketing', es: 'Marketing', 'en-US': 'Marketing' }
  , 'Sistemas ERP': { 'pt-BR': 'Sistemas ERP', es: 'Sistemas ERP', 'en-US': 'ERP systems' }
  , 'WhatsApp': { 'pt-BR': 'WhatsApp', es: 'WhatsApp', 'en-US': 'WhatsApp' }
  , 'Landing Pages': { 'pt-BR': 'Landing Pages', es: 'Landing Pages', 'en-US': 'Landing Pages' }
  , 'Escolha': { 'pt-BR': 'Escolha', es: 'Elige', 'en-US': 'Choose' }
  , 'Encontre uma base pronta para o seu momento.': { 'pt-BR': 'Encontre uma base pronta para o seu momento.', es: 'Encuentra una base lista para tu momento.', 'en-US': 'Find a ready base for your moment.' }
  , 'Personalize': { 'pt-BR': 'Personalize', es: 'Personaliza', 'en-US': 'Customize' }
  , 'Ajustamos identidade, dados e operação.': { 'pt-BR': 'Ajustamos identidade, dados e operação.', es: 'Ajustamos identidad, datos y operación.', 'en-US': 'We adapt identity, data and operations.' }
  , 'Escale': { 'pt-BR': 'Escale', es: 'Escala', 'en-US': 'Scale' }
  , 'Você recebe suporte, updates e clareza.': { 'pt-BR': 'Você recebe suporte, updates e clareza.', es: 'Recibes soporte, actualizaciones y claridad.', 'en-US': 'You receive support, updates and clarity.' }
  , 'Precisa de algo único?': { 'pt-BR': 'Precisa de algo único?', es: '¿Necesitas algo único?', 'en-US': 'Need something unique?' }
  , 'Conte o que sua operação precisa e receba uma proposta com escopo, prazo e investimento.': { 'pt-BR': 'Conte o que sua operação precisa e receba uma proposta com escopo, prazo e investimento.', es: 'Cuéntanos lo que necesita tu operación y recibe una propuesta con alcance, plazo e inversión.', 'en-US': 'Tell us what your operation needs and receive a proposal with scope, timeline and investment.' }
  , 'Falar com um especialista': { 'pt-BR': 'Falar com um especialista', es: 'Hablar con un especialista', 'en-US': 'Talk to a specialist' }
  , 'Admin only': { 'pt-BR': 'Apenas admin', es: 'Solo admin', 'en-US': 'Admin only' }
  , 'Operações Kelven Studio': { 'pt-BR': 'Operações Kelven Studio', es: 'Operaciones Kelven Studio', 'en-US': 'Kelven Studio operations' }
  , 'Command center': { 'pt-BR': 'Central de comando', es: 'Centro de control', 'en-US': 'Command center' }
  , 'Overview': { 'pt-BR': 'Visão geral', es: 'Resumen', 'en-US': 'Overview' }
  , 'Faturamento & BI': { 'pt-BR': 'Faturamento & BI', es: 'Facturación & BI', 'en-US': 'Billing & BI' }
  , 'Produtos ativos': { 'pt-BR': 'Produtos ativos', es: 'Productos activos', 'en-US': 'Active products' }
  , 'Leads & campanhas': { 'pt-BR': 'Leads & campanhas', es: 'Leads y campañas', 'en-US': 'Leads & campaigns' }
  , 'Carrinhos abandonados': { 'pt-BR': 'Carrinhos abandonados', es: 'Carritos abandonados', 'en-US': 'Abandoned carts' }
  , 'Releases & updates': { 'pt-BR': 'Releases & atualizações', es: 'Lanzamientos y actualizaciones', 'en-US': 'Releases & updates' }
  , 'IA & WhatsApp': { 'pt-BR': 'IA & WhatsApp', es: 'IA y WhatsApp', 'en-US': 'AI & WhatsApp' }
  , 'Dados protegidos': { 'pt-BR': 'Dados protegidos', es: 'Datos protegidos', 'en-US': 'Protected data' }
  , 'Acesso restrito por sessão administrativa e 2FA.': { 'pt-BR': 'Acesso restrito por sessão administrativa e 2FA.', es: 'Acceso restringido por sesión administrativa y 2FA.', 'en-US': 'Access restricted by admin session and 2FA.' }
  , 'Sair': { 'pt-BR': 'Sair', es: 'Cerrar sesión', 'en-US': 'Sign out' }
  , 'há 42 min': { 'pt-BR': 'há 42 min', es: 'hace 42 min', 'en-US': '42 min ago' }
  , 'há 2 h': { 'pt-BR': 'há 2 h', es: 'hace 2 h', 'en-US': '2 hr ago' }
  , 'há 5 h': { 'pt-BR': 'há 5 h', es: 'hace 5 h', 'en-US': '5 hr ago' }
  , 'Atualizado há 4 min': { 'pt-BR': 'Atualizado há 4 min', es: 'Actualizado hace 4 min', 'en-US': 'Updated 4 min ago' }
  , 'Dados atualizados há 4 min': { 'pt-BR': 'Dados atualizados há 4 min', es: 'Datos actualizados hace 4 min', 'en-US': 'Data updated 4 min ago' }
  , 'Visão geral do negócio.': { 'pt-BR': 'Visão geral do negócio.', es: 'Resumen del negocio.', 'en-US': 'Business overview.' }
  , 'Faturamento, produtos e relacionamento em uma única leitura.': { 'pt-BR': 'Faturamento, produtos e relacionamento em uma única leitura.', es: 'Facturación, productos y relaciones en una sola lectura.', 'en-US': 'Revenue, products and relationships in one view.' }
  , 'Receita líquida': { 'pt-BR': 'Receita líquida', es: 'Ingresos netos', 'en-US': 'Net revenue' }
  , 'Pedidos pagos': { 'pt-BR': 'Pedidos pagos', es: 'Pedidos pagados', 'en-US': 'Paid orders' }
  , 'Leads capturados': { 'pt-BR': 'Leads capturados', es: 'Leads captados', 'en-US': 'Captured leads' }
  , 'Ticket médio': { 'pt-BR': 'Ticket médio', es: 'Ticket medio', 'en-US': 'Average order value' }
  , 'no período': { 'pt-BR': 'no período', es: 'en el período', 'en-US': 'in period' }
  , 'Performance': { 'pt-BR': 'Performance', es: 'Rendimiento', 'en-US': 'Performance' }
  , 'Receita por mês': { 'pt-BR': 'Receita por mês', es: 'Ingresos por mes', 'en-US': 'Revenue by month' }
  , 'Exportar BI': { 'pt-BR': 'Exportar BI', es: 'Exportar BI', 'en-US': 'Export BI' }
  , 'Marketing em movimento.': { 'pt-BR': 'Marketing em movimento.', es: 'Marketing en movimiento.', 'en-US': 'Marketing in motion.' }
  , '3 campanhas ativas e 214 clientes aguardando novidades.': { 'pt-BR': '3 campanhas ativas e 214 clientes aguardando novidades.', es: '3 campañas activas y 214 clientes esperando novedades.', 'en-US': '3 active campaigns and 214 customers waiting for updates.' }
  , '72% da meta mensal': { 'pt-BR': '72% da meta mensal', es: '72% del objetivo mensual', 'en-US': '72% of monthly target' }
  , 'Financeiro & BI': { 'pt-BR': 'Financeiro & BI', es: 'Finanzas & BI', 'en-US': 'Finance & BI' }
  , 'Faturamento completo.': { 'pt-BR': 'Faturamento completo.', es: 'Facturación completa.', 'en-US': 'Complete billing.' }
  , 'Acompanhe vendas, ticket, canais e produtos que geram receita.': { 'pt-BR': 'Acompanhe vendas, ticket, canais e produtos que geram receita.', es: 'Sigue ventas, ticket, canales y productos que generan ingresos.', 'en-US': 'Track sales, order value, channels and revenue-generating products.' }
  , 'Últimos 30 dias': { 'pt-BR': 'Últimos 30 dias', es: 'Últimos 30 días', 'en-US': 'Last 30 days' }
  , 'Últimos 90 dias': { 'pt-BR': 'Últimos 90 dias', es: 'Últimos 90 días', 'en-US': 'Last 90 days' }
  , 'Este ano': { 'pt-BR': 'Este ano', es: 'Este año', 'en-US': 'This year' }
  , 'Exportar': { 'pt-BR': 'Exportar', es: 'Exportar', 'en-US': 'Export' }
  , 'Receita bruta': { 'pt-BR': 'Receita bruta', es: 'Ingresos brutos', 'en-US': 'Gross revenue' }
  , 'Taxas e descontos': { 'pt-BR': 'Taxas e descontos', es: 'Comisiones y descuentos', 'en-US': 'Fees and discounts' }
  , '9,2% da receita': { 'pt-BR': '9,2% da receita', es: '9,2% de los ingresos', 'en-US': '9.2% of revenue' }
  , 'Produtos vendidos': { 'pt-BR': 'Produtos vendidos', es: 'Productos vendidos', 'en-US': 'Products sold' }
  , 'Receita por produto': { 'pt-BR': 'Receita por produto', es: 'Ingresos por producto', 'en-US': 'Revenue by product' }
  , 'Filtrar': { 'pt-BR': 'Filtrar', es: 'Filtrar', 'en-US': 'Filter' }
  , 'Referência': { 'pt-BR': 'Referência', es: 'Referencia', 'en-US': 'Reference' }
  , 'Produto': { 'pt-BR': 'Produto', es: 'Producto', 'en-US': 'Product' }
  , 'Cliente': { 'pt-BR': 'Cliente', es: 'Cliente', 'en-US': 'Customer' }
  , 'Valor': { 'pt-BR': 'Valor', es: 'Valor', 'en-US': 'Amount' }
  , 'Canal': { 'pt-BR': 'Canal', es: 'Canal', 'en-US': 'Channel' }
  , 'Status': { 'pt-BR': 'Status', es: 'Estado', 'en-US': 'Status' }
  , 'Pago': { 'pt-BR': 'Pago', es: 'Pagado', 'en-US': 'Paid' }
  , 'Compatível com exportação para Power BI via API/CSV. Os indicadores acima são demonstração local até conectar o provedor de dados.': { 'pt-BR': 'Compatível com exportação para Power BI via API/CSV. Os indicadores acima são demonstração local até conectar o provedor de dados.', es: 'Compatible con exportación a Power BI mediante API/CSV. Estos indicadores son una demostración local hasta conectar el proveedor de datos.', 'en-US': 'Ready for Power BI export via API/CSV. These metrics are local demo data until the provider is connected.' }
  , 'Catálogo': { 'pt-BR': 'Catálogo', es: 'Catálogo', 'en-US': 'Catalog' }
  , 'Cadastre, publique, edite e arquive produtos do portfólio.': { 'pt-BR': 'Cadastre, publique, edite e arquive produtos do portfólio.', es: 'Registra, publica, edita y archiva productos del portafolio.', 'en-US': 'Create, publish, edit and archive portfolio products.' }
  , 'Novo produto': { 'pt-BR': 'Novo produto', es: 'Nuevo producto', 'en-US': 'New product' }
  , 'Buscar produtos...': { 'pt-BR': 'Buscar produtos...', es: 'Buscar productos...', 'en-US': 'Search products...' }
  , 'Ativo': { 'pt-BR': 'Ativo', es: 'Activo', 'en-US': 'Active' }
  , 'Rascunho': { 'pt-BR': 'Rascunho', es: 'Borrador', 'en-US': 'Draft' }
  , 'vendas': { 'pt-BR': 'vendas', es: 'ventas', 'en-US': 'sales' }
  , 'Capture, segmente e envie automações de marketing.': { 'pt-BR': 'Capture, segmente e envie automações de marketing.', es: 'Captura, segmenta y envía automatizaciones de marketing.', 'en-US': 'Capture, segment and send marketing automations.' }
  , 'Nova campanha': { 'pt-BR': 'Nova campanha', es: 'Nueva campaña', 'en-US': 'New campaign' }
  , 'Campanha criada como rascunho. Conecte seu provedor de e-mail para disparar.': { 'pt-BR': 'Campanha criada como rascunho. Conecte seu provedor de e-mail para disparar.', es: 'Campaña creada como borrador. Conecta tu proveedor de correo para enviarla.', 'en-US': 'Campaign created as a draft. Connect your email provider to send it.' }
  , 'Leads ativos': { 'pt-BR': 'Leads ativos', es: 'Leads activos', 'en-US': 'Active leads' }
  , 'Taxa de conversão': { 'pt-BR': 'Taxa de conversão', es: 'Tasa de conversión', 'en-US': 'Conversion rate' }
  , 'Base opt-in': { 'pt-BR': 'Base opt-in', es: 'Base con consentimiento', 'en-US': 'Opt-in audience' }
  , 'Últimos leads capturados': { 'pt-BR': 'Últimos leads capturados', es: 'Últimos leads captados', 'en-US': 'Latest captured leads' }
  , 'Automação ativa': { 'pt-BR': 'Automação ativa', es: 'Automatización activa', 'en-US': 'Automation active' }
  , 'Origem:': { 'pt-BR': 'Origem:', es: 'Origen:', 'en-US': 'Source:' }
  , 'Score': { 'pt-BR': 'Score', es: 'Puntuación', 'en-US': 'Score' }
  , 'Publique versões, arquivos e atualizações para clientes com Product Key.': { 'pt-BR': 'Publique versões, arquivos e atualizações para clientes com Product Key.', es: 'Publica versiones, archivos y actualizaciones para clientes con Product Key.', 'en-US': 'Publish versions, files and updates for customers with a Product Key.' }
  , 'Nova release': { 'pt-BR': 'Nova release', es: 'Nuevo lanzamiento', 'en-US': 'New release' }
  , 'Atualização publicada': { 'pt-BR': 'Atualização publicada', es: 'Actualización publicada', 'en-US': 'Update published' }
  , 'Em revisão': { 'pt-BR': 'Em revisão', es: 'En revisión', 'en-US': 'Under review' }
  , 'Agendada': { 'pt-BR': 'Agendada', es: 'Programada', 'en-US': 'Scheduled' }
  , 'Notificar compradores': { 'pt-BR': 'Notificar compradores', es: 'Notificar compradores', 'en-US': 'Notify buyers' }
  , 'Atendimento humano': { 'pt-BR': 'Atendimento humano', es: 'Atención humana', 'en-US': 'Human support' }
  , 'Monitore o agente, revise conversas e encaminhe atendimentos humanos.': { 'pt-BR': 'Monitore o agente, revise conversas e encaminhe atendimentos humanos.', es: 'Supervisa el agente, revisa conversaciones y deriva atenciones humanas.', 'en-US': 'Monitor the agent, review conversations and route human support.' }
  , 'Kelven AI Concierge': { 'pt-BR': 'Kelven AI Concierge', es: 'Kelven AI Concierge', 'en-US': 'Kelven AI Concierge' }
  , 'Online · base atualizada': { 'pt-BR': 'Online · base atualizada', es: 'En línea · base actualizada', 'en-US': 'Online · knowledge base updated' }
  , 'WhatsApp conectado': { 'pt-BR': 'WhatsApp conectado', es: 'WhatsApp conectado', 'en-US': 'WhatsApp connected' }
  , 'Olá. Sou o assistente do Kelven Studio. Como posso ajudar?': { 'pt-BR': 'Olá. Sou o assistente do Kelven Studio. Como posso ajudar?', es: 'Hola. Soy el asistente de Kelven Studio. ¿Cómo puedo ayudarte?', 'en-US': 'Hi. I am the Kelven Studio assistant. How can I help?' }
  , 'CANAIS': { 'pt-BR': 'CANAIS', es: 'CANALES', 'en-US': 'CHANNELS' }
  , 'Conecte WhatsApp Business, e-mail e filas internas para assumir conversas que precisam de contexto.': { 'pt-BR': 'Conecte WhatsApp Business, e-mail e filas internas para assumir conversas que precisam de contexto.', es: 'Conecta WhatsApp Business, correo y colas internas para asumir conversaciones que necesitan contexto.', 'en-US': 'Connect WhatsApp Business, email and internal queues to take over conversations that need context.' }
  , 'Configurar canais': { 'pt-BR': 'Configurar canais', es: 'Configurar canales', 'en-US': 'Configure channels' }
  , 'HOJE': { 'pt-BR': 'HOJE', es: 'HOY', 'en-US': 'TODAY' }
  , 'Conversas IA': { 'pt-BR': 'Conversas IA', es: 'Conversaciones IA', 'en-US': 'AI conversations' }
  , 'Encaminhadas': { 'pt-BR': 'Encaminhadas', es: 'Derivadas', 'en-US': 'Routed' }
  , 'SLA médio': { 'pt-BR': 'SLA médio', es: 'SLA medio', 'en-US': 'Average SLA' }
  , 'Escreva uma mensagem...': { 'pt-BR': 'Escreva uma mensagem...', es: 'Escribe un mensaje...', 'en-US': 'Write a message...' }
  , 'Enviar mensagem': { 'pt-BR': 'Enviar mensagem', es: 'Enviar mensaje', 'en-US': 'Send message' }
  , '• Online · base atualizada': { 'pt-BR': '• Online · base atualizada', es: '• En línea · base actualizada', 'en-US': '• Online · knowledge base updated' }
  , 'Canais': { 'pt-BR': 'Canais', es: 'Canales', 'en-US': 'Channels' }
  , 'Hoje': { 'pt-BR': 'Hoje', es: 'Hoy', 'en-US': 'Today' }
  , 'Controle de versões consistente': { 'pt-BR': 'Controle de versões consistente', es: 'Control de versiones consistente', 'en-US': 'Consistent version control' }
  , 'Links privados e temporários': { 'pt-BR': 'Links privados e temporários', es: 'Enlaces privados y temporales', 'en-US': 'Private, temporary links' }
  , 'Atualizações para compradores': { 'pt-BR': 'Atualizações para compradores', es: 'Actualizaciones para compradores', 'en-US': 'Updates for buyers' }
  , 'Recovery automation': { 'pt-BR': 'Automação de recuperação', es: 'Automatización de recuperación', 'en-US': 'Recovery automation' }
  , 'Carrinhos abandonados.': { 'pt-BR': 'Carrinhos abandonados.', es: 'Carritos abandonados.', 'en-US': 'Abandoned carts.' }
  , 'Recupere oportunidades com desconto personalizado e sequência automática.': { 'pt-BR': 'Recupere oportunidades com desconto personalizado e sequência automática.', es: 'Recupera oportunidades con descuento personalizado y secuencia automática.', 'en-US': 'Recover opportunities with personalized discounts and an automated sequence.' }
  , 'Em recuperação': { 'pt-BR': 'Em recuperação', es: 'En recuperación', 'en-US': 'In recovery' }
  , 'Valor potencial': { 'pt-BR': 'Valor potencial', es: 'Valor potencial', 'en-US': 'Potential value' }
  , 'Recuperados este mês': { 'pt-BR': 'Recuperados este mês', es: 'Recuperados este mes', 'en-US': 'Recovered this month' }
  , 'Fila de recuperação': { 'pt-BR': 'Fila de recuperação', es: 'Cola de recuperación', 'en-US': 'Recovery queue' }
  , 'Oferta enviada apenas para clientes com opt-in de comunicação.': { 'pt-BR': 'Oferta enviada apenas para clientes com opt-in de comunicação.', es: 'Oferta enviada solo a clientes con consentimiento de comunicación.', 'en-US': 'Offer sent only to customers who opted into communications.' }
  , 'Enviar oferta': { 'pt-BR': 'Enviar oferta', es: 'Enviar oferta', 'en-US': 'Send offer' }
  , 'Enviado': { 'pt-BR': 'Enviado', es: 'Enviado', 'en-US': 'Sent' }
  , 'Growth engine': { 'pt-BR': 'Motor de crescimento', es: 'Motor de crecimiento', 'en-US': 'Growth engine' }
  , 'Leads & campanhas.': { 'pt-BR': 'Leads & campanhas.', es: 'Leads y campañas.', 'en-US': 'Leads & campaigns.' }
  , 'Delivery system': { 'pt-BR': 'Sistema de entrega', es: 'Sistema de entrega', 'en-US': 'Delivery system' }
  , 'Releases & updates.': { 'pt-BR': 'Releases & atualizações.', es: 'Lanzamientos y actualizaciones.', 'en-US': 'Releases & updates.' }
  , 'Support hub': { 'pt-BR': 'Central de suporte', es: 'Centro de soporte', 'en-US': 'Support hub' }
  , 'IA & WhatsApp.': { 'pt-BR': 'IA & WhatsApp.', es: 'IA y WhatsApp.', 'en-US': 'AI & WhatsApp.' }
  , 'Termos': { 'pt-BR': 'Termos', es: 'Términos', 'en-US': 'Terms' }
  , 'Minhas compras': { 'pt-BR': 'Minhas compras', es: 'Mis compras', 'en-US': 'My purchases' }
  , 'Pagar com segurança': { 'pt-BR': 'Pagar com segurança', es: 'Pagar con seguridad', 'en-US': 'Pay securely' }
  , 'Comprar solução': { 'pt-BR': 'Comprar solução', es: 'Comprar solución', 'en-US': 'Buy solution' }
  , 'Ver solução': { 'pt-BR': 'Ver solução', es: 'Ver solución', 'en-US': 'View solution' }
  , 'Falar com especialista': { 'pt-BR': 'Falar com especialista', es: 'Hablar con especialista', 'en-US': 'Talk to a specialist' }
  , 'Mais vendido': { 'pt-BR': 'Mais vendido', es: 'Más vendido', 'en-US': 'Best seller' }
  , 'Em alta': { 'pt-BR': 'Em alta', es: 'En tendencia', 'en-US': 'Trending' }
  , 'Menu': { 'pt-BR': 'Menu', es: 'Menú', 'en-US': 'Menu' }
  , 'Enviar briefing': { 'pt-BR': 'Enviar briefing', es: 'Enviar briefing', 'en-US': 'Send brief' }
  , 'Pedido recebido.': { 'pt-BR': 'Pedido recebido.', es: 'Solicitud recibida.', 'en-US': 'Request received.' }
  , 'Pagamentos via Stripe · LGPD': { 'pt-BR': 'Pagamentos via Stripe · LGPD', es: 'Pagos vía Stripe · LGPD', 'en-US': 'Payments via Stripe · LGPD' }
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * Para cada no de texto guardamos o texto original (em PT) e o ultimo valor
 * que NOS escrevemos. Se o React trocar o texto (ex.: botao muda de
 * "Entrar na conta" para "Processando..."), o valor atual deixa de bater com
 * o que escrevemos e o novo texto passa a ser a nova origem.
 *
 * A versao anterior guardava apenas o primeiro texto visto: depois de uma
 * mudanca de estado, o tradutor sobrescrevia o texto novo do React com a
 * traducao do texto ANTIGO (botoes com rotulo errado).
 */
type NodeMemory = { source: string; written: string };
const textMemory = new WeakMap<Text, NodeMemory>();
const attributeMemory = new WeakMap<Element, Map<string, NodeMemory>>();
const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'aria-label', 'title'] as const;
const STORAGE_KEY = 'kelven-language';

function isSiteLanguage(value: unknown): value is SiteLanguage {
  return value === 'pt-BR' || value === 'es' || value === 'en-US';
}

function readStoredLanguage(): SiteLanguage | null {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return isSiteLanguage(saved) ? saved : null;
  } catch {
    // Navegacao privada em alguns navegadores bloqueia o localStorage.
    return null;
  }
}

export function LanguageProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [language, setLanguageState] = useState<SiteLanguage>('pt-BR');

  useEffect(() => {
    const saved = readStoredLanguage();
    if (saved) {
      setLanguageState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLanguage = useCallback((nextLanguage: SiteLanguage) => {
    setLanguageState(nextLanguage);
    try {
      window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    } catch {
      /* ignora: preferencia apenas nao sera lembrada */
    }
    document.documentElement.lang = nextLanguage;
  }, []);

  useEffect(() => {
    const lookup = new Map<string, Record<SiteLanguage, string>>();
    Object.entries(pageTranslations).forEach(([source, values]) => {
      lookup.set(source.trim(), values);
      Object.values(values).forEach((value) => {
        if (!lookup.has(value.trim())) lookup.set(value.trim(), values);
      });
    });

    const translateText = (textNode: Text) => {
      const current = textNode.nodeValue ?? '';
      const trimmed = current.trim();
      if (!trimmed) return;
      const memory = textMemory.get(textNode);
      const source = memory && memory.written === current ? memory.source : trimmed;
      const translated = lookup.get(source)?.[language];
      let next = current;
      if (translated) {
        const leading = current.match(/^\s*/)?.[0] ?? '';
        const trailing = current.match(/\s*$/)?.[0] ?? '';
        next = `${leading}${translated}${trailing}`;
        if (next !== current) textNode.nodeValue = next;
      }
      textMemory.set(textNode, { source, written: next });
    };

    const translatePage = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          // Nunca traduz conteudo digitado pelo usuario ou scripts.
          if (parent.closest('script, style, textarea, [contenteditable="true"], [data-no-translate]')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      let node = walker.nextNode();
      while (node) {
        translateText(node as Text);
        node = walker.nextNode();
      }

      document.querySelectorAll<HTMLElement>('[placeholder], [aria-label], [title]').forEach((element) => {
        const memories = attributeMemory.get(element) ?? new Map<string, NodeMemory>();
        TRANSLATABLE_ATTRIBUTES.forEach((attribute) => {
          const current = element.getAttribute(attribute);
          if (!current) return;
          const memory = memories.get(attribute);
          const source = memory && memory.written === current ? memory.source : current.trim();
          const translated = lookup.get(source)?.[language];
          const next = translated ?? current;
          if (next !== current) element.setAttribute(attribute, next);
          memories.set(attribute, { source, written: next });
        });
        attributeMemory.set(element, memories);
      });
    };

    let scheduled = 0;
    const schedule = () => {
      if (scheduled) return;
      scheduled = window.requestAnimationFrame(() => {
        scheduled = 0;
        translatePage();
      });
    };

    schedule();
    // characterData: captura textos alterados pelo React sem trocar o no.
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => {
      if (scheduled) window.cancelAnimationFrame(scheduled);
      observer.disconnect();
    };
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, translate: (key) => translations[language][key] }),
    [language, setLanguage]
  );

  // Removido `key={language}`: ele desmontava a aplicacao inteira a cada troca
  // de idioma, apagando formularios preenchidos e o estado das telas.
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
