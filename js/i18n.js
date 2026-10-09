/* ==========================================================================
   Textos do site em dois idiomas.

   COMO EDITAR:
   - Texto em PORTUGUÊS que aparece na página: edite direto no index.html.
   - Texto em INGLÊS: edite a parte "en" abaixo. Cada chave corresponde a um
     data-i18n="..." no index.html (ex.: data-i18n="services.0.title").
   - A parte "dynamic" guarda frases montadas pelo script (mensagem do
     WhatsApp, erros do formulário, aviso de cookies), nos dois idiomas.
   ========================================================================== */
window.KIVO_I18N = {
  en: {
    navLabel: 'Main', homeLabel: 'Kivo Digital, home', langLabel: 'Language',
    navServices: 'Services', navProcess: 'How it works', navReviews: 'Reviews', navFaq: 'FAQ', navContact: 'Contact',
    cta: 'Get a quote',
    heroEyebrow: 'Website design for small businesses, from Brazil to the world',
    heroSub: 'We build fast websites that work well on mobile and that you can update yourself. The technical side, from building to hosting, is on us.',
    heroSecondary: 'See services',
    promises: ['Designed for mobile first', 'Updates without a developer', 'Price and timeline in writing'],
    // Figura em pedaços da abertura
    stageTop: 'websites for', nichesLabel: 'Business examples',
    niches: { cafe: 'Coffee shop', loja: 'Store', salao: 'Salon', clinica: 'Clinic', local: 'Local business' },

    // Rótulos em fonte mono acima dos títulos (01 Serviços, 02 Ferramentas...)
    kickers: ['Services', 'Tools', 'Any screen', 'How it works', 'Reviews', 'FAQ', 'Quote', 'Contact', 'For every business'],

    servTitle: 'Services to put your business ', servAccent: 'online',
    servSub: 'Pick what makes sense right now. You can start with a single page and grow later.',
    services: [
      { title: 'Professional websites', text: 'A complete website with the pages your business needs, in Portuguese, English or both, for clients in Brazil and abroad.' },
      { title: 'Landing pages', text: 'A single, focused page to promote a product or a campaign, or to collect leads from ads.' },
      { title: 'Online stores', text: 'Catalog, shopping cart and online payment to sell your products on the internet.' },
      { title: 'Digital menus', text: 'Your menu on the customer’s phone, with orders straight to WhatsApp. Changed a price? You update it yourself.' },
      { title: 'Hosting and domain', text: 'We register your website address and keep everything online, with the security padlock active.' },
      { title: 'Google optimization (SEO)', text: 'Structure, copy and speed tuned so your site shows up when someone searches for what you offer.' },
    ],

    nichTitle: 'A website that looks like ', nichAccent: 'your business',
    nichSub: 'Every kind of business needs a different website. Scroll down and see how we plan yours around what your customers are looking for.',
    nicheShow: [
      { tag: 'Coffee shops, bakeries and restaurants', title: 'Menu on the phone, orders on WhatsApp', text: 'Customers see the menu with photos and prices and send the order ready to go. Changed a price? You update it yourself.' },
      { tag: 'Shops and fashion', title: 'Your shop window, open 24 hours', text: 'Catalog with photos, sizes and prices, a cart and online payment, or orders straight to WhatsApp.' },
      { tag: 'Salons, barbers and beauty', title: 'Services, prices and hours in one place', text: 'Show your work, your price list and a button to book on WhatsApp.' },
      { tag: 'Clinics and practices', title: 'Trust before the first appointment', text: 'Specialties, team and location on a clear page that makes patients feel safe.' },
      { tag: 'Local services and shops', title: 'Show up for people searching nearby', text: 'A website connected to your Google profile and the map, so people looking for your service nearby can find you.' },
    ],

    toolsTitle: 'The tools your customers ', toolsAccent: 'already use',
    toolsSub: 'Ads on Google and Meta, measurement with Google Analytics, conversations on WhatsApp, payments by Pix and card, and websites that work on any phone, tablet or computer, Apple or Android. We work with the platforms that are part of your customers’ everyday life.',
    payLabel: 'Payments: Pix, cards and card machines',
    toolsNote: 'Trademarks belong to their owners. They show the tools we use in our projects and do not imply an official partnership.',

    respTitle: 'Perfect on ', respAccent: 'any screen',
    respSub: 'The same website rearranges itself for phones, tablets and computers. Your customers read everything without zooming or scrolling sideways.',
    resp: [
      { title: 'Responsive design', text: 'Looks right on any screen size: phone, tablet or computer. No tiny text, no buttons out of place.' },
      { title: 'Designed for mobile first', text: 'Most of your customers arrive on their phone. Big buttons, readable text and WhatsApp one tap away.' },
      { title: 'Comfortable on iPad and tablets', text: 'On a tablet the content gets more room and stays easy to browse, in portrait or landscape.' },
    ],
    respChips: ['Laptop · 1512 px', 'Smartphone · 393 px', 'iPad and tablet · 1210 px'],
    // Textos do site de exemplo dentro das telas dos aparelhos
    mock: { tag: 'Artisan bakery', title: 'Fresh bread every day', cta: 'Order on WhatsApp', nav: 'Order' },

    procTitle: 'From the first hello to ', procAccent: 'a live website',
    procSub: 'Four steps, and you follow each one of them.',
    steps: [
      { title: 'Chat on WhatsApp', text: 'You tell us how your business works and what you expect from the website.' },
      { title: 'Fixed-price quote', text: 'You get the price and the timeline in writing before any work starts.' },
      { title: 'Design and approval', text: 'We build the site and show it to you before it goes live. We adjust whatever is needed.' },
      { title: 'Your site goes live', text: 'We publish it at your address and show you how to update text, photos and opening hours.' },
    ],
    procCta: 'Get a quote',

    revTitle: 'Have you worked with us? ', revAccent: 'Tell us how it went',
    revSub: 'Kivo is new, and every review helps another small business find us. It takes less than a minute and counts for any experience, from the first chat to delivery.',
    revGoogle: 'Review us on Google', revWa: 'Tell us on WhatsApp',
    revCardSub: 'Website design', revCardText: 'Your review here',

    faqTitle: 'Frequently asked ', faqAccent: 'questions',
    faqSub: 'Didn’t find your question? ', faqLink: 'Message us on WhatsApp',
    faqs: [
      { q: 'How much does a website cost?', a: 'It depends on the size of the site and what it needs to do. You explain it on WhatsApp and get a fixed-price quote, with no extra charges along the way.' },
      { q: 'How long does it take?', a: 'The timeline is in writing in the quote, along with the price. You know from the start when your site goes live.' },
      { q: 'Do I need to be good with technology?', a: 'No. The technical side is on us, and we talk without jargon. You just need to tell us how your business works.' },
      { q: 'Can I update the site later?', a: 'Yes. Changing a text, a photo or your opening hours doesn’t require a developer, and we show you how at handover.' },
      { q: 'Does the site work well on mobile?', a: 'Yes. Most of your customers will open the site on their phone, so it is designed for small screens first.' },
      { q: 'Do you work with my type of business?', a: 'We work with small businesses from many fields: beauty salons, restaurants, neighborhood shops, offices and service providers.' },
    ],

    orcTitle: 'Tell us about your ', orcAccent: 'business',
    orcSub: 'Fill in the fields and the conversation continues on WhatsApp, with the details already written.',
    fNome: 'Your name', fNomePh: 'What should we call you?',
    fNegocio: 'Your business', fNegocioPh: 'E.g. bakery, clinic, office',
    fSite: 'Do you already have a website?', siteOpts: { nao: 'No', refazer: 'Yes, I want a new one' },
    fMsg: 'Tell us a bit about what you need ', fOptional: '(optional)',
    fMsgPh: 'E.g. I want to show my services and receive orders',
    fSubmit: 'Get a quote on WhatsApp',

    contTitle: 'Get in ', contAccent: 'touch',
    contSub: 'Pick the channel you prefer.',
    contLabels: ['Email', 'Phone and WhatsApp', 'Instagram'],

    footerAbout: 'Professional websites for small businesses, custom-built and kept online by our team.',
    footerNav: 'Navigation', footerContact: 'Contact', footerCompany: 'Company',
    footerCities: 'São Paulo and Bahia, Brazil',
    footerLocation: 'Serving clients in Brazil and worldwide',
    footerTag: 'All rights reserved.',
    privacyLink: 'Privacy policy', cookiePrefs: 'Cookie preferences',
    consentTitle: 'Your privacy', consentAccept: 'Accept', consentDecline: 'Decline',
    waFloat: 'Chat with Kivo on WhatsApp',
  },

  dynamic: {
    pt: {
      htmlLang: 'pt-BR',
      title: 'Criação de Sites em São Paulo e Todo o Brasil | Kivo Digital',
      description: 'A Kivo Digital cria sites profissionais, landing pages, lojas virtuais e cardápios digitais para pequenos negócios em São Paulo, na Bahia e em todo o Brasil. Orçamento fechado pelo WhatsApp.',
      heroLines: [['Seu', 'negócio'], ['merece', 'um', 'site'], ['de', '@icon', 'verdade']],
      menuOpen: 'Abrir menu', menuClose: 'Fechar menu',
      fbErro: 'Preencha seu nome e o tipo de negócio para continuar.', fbOk: 'Abrindo o WhatsApp...',
      siteOpts: { nao: 'Não', refazer: 'Sim, quero refazer' },
      waIntro: 'Olá, Kivo! Quero um orçamento de site.', waNome: 'Nome', waNegocio: 'Negócio',
      waSite: 'Já tem site', waMsg: 'O que preciso',
      waDirect: 'Olá, Kivo! Quero saber mais sobre sites.',
      waReview: 'Olá, Kivo! Quero contar como foi o meu projeto com vocês.',
      niches: { kivo: 'kivo_digital', cafe: 'cafeteria', loja: 'loja', salao: 'salão de beleza', clinica: 'clínica', local: 'negócio local' },
      stageAria: name => `Figura em pedaços mostrando: ${name}`,
      morphPause: 'Pausar animação', morphPlay: 'Continuar animação',
      consentTools: { ga: 'do Google Analytics', meta: 'da Meta', and: ' e ' },
      consentText: tools => `Usamos cookies ${tools} para entender como o site é usado e melhorar nossos anúncios. Eles só são ativados se você aceitar. Saiba mais na `,
    },
    en: {
      htmlLang: 'en',
      title: 'Website Design for Small Businesses | Kivo Digital, Brazil',
      description: 'Kivo Digital designs professional websites, landing pages, online stores and digital menus for small businesses in Brazil and abroad, in English or Portuguese. Fixed-price quotes on WhatsApp.',
      heroLines: [['Your', 'business'], ['deserves', 'a'], ['real', '@icon', 'website']],
      menuOpen: 'Open menu', menuClose: 'Close menu',
      fbErro: 'Please fill in your name and type of business to continue.', fbOk: 'Opening WhatsApp...',
      siteOpts: { nao: 'No', refazer: 'Yes, I want a new one' },
      waIntro: 'Hi, Kivo! I’d like a website quote.', waNome: 'Name', waNegocio: 'Business',
      waSite: 'Already has a website', waMsg: 'What I need',
      waDirect: 'Hi, Kivo! I’d like to know more about websites.',
      waReview: 'Hi, Kivo! I’d like to tell you how my project went.',
      niches: { kivo: 'kivo_digital', cafe: 'coffee shop', loja: 'store', salao: 'beauty salon', clinica: 'clinic', local: 'local business' },
      stageAria: name => `Shape made of pieces showing: ${name}`,
      morphPause: 'Pause animation', morphPlay: 'Play animation',
      consentTools: { ga: 'Google Analytics', meta: 'Meta', and: ' and ' },
      consentText: tools => `We use ${tools} cookies to understand how the site is used and to improve our ads. They are only turned on if you accept. Learn more in our `,
    },
  },
};
