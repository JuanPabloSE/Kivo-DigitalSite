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
    navServices: 'Services', navTestimonials: 'Testimonials', navFaq: 'FAQ', navContact: 'Contact',
    cta: 'Get a quote',
    heroSub: 'Fast, beautiful on mobile and easy to update. We handle the tech, you take care of your customers.',
    promises: ['Built mobile-first', 'Easy to update', 'Fixed-price quote'],

    servTitle: 'Everything your business needs ', servAccent: 'to be online',
    servSub: 'From a full website to a menu on your customer’s phone: we build it, put it live and help people find you.',
    services: [
      { title: 'Professional websites', text: 'For businesses in Brazil and abroad, in Portuguese, English or both.' },
      { title: 'Landing pages', text: 'A focused, single page to promote a product or campaign, or to capture leads.' },
      { title: 'Online stores', text: 'Sell your products online, with a catalog, shopping cart and online payment.' },
      { title: 'Digital menus', text: 'Your menu on your customer’s phone, easy to update, with orders via WhatsApp.' },
      { title: 'Hosting and domain', text: 'We take care of your website address and keep it online, fast and secure.' },
      { title: 'Google optimization (SEO)', text: 'A site built to show up when people search for what you offer.' },
    ],

    procTitle: 'From the first hello to ', procAccent: 'a live website',
    procSub: 'A simple process, with no hassle and no tech jargon.',
    steps: [
      { title: 'Chat on WhatsApp', text: 'Message us and tell us about your business and what you need.' },
      { title: 'Fixed-price quote', text: 'You get the price and the timeline in writing before we start.' },
      { title: 'Design and approval', text: 'We build your site and show it to you before it goes live, so we can adjust whatever you need.' },
      { title: 'Your site goes live', text: 'Your site is published, ready for you to share with your customers.' },
    ],
    procCta: 'Get started',

    depTitle: 'Businesses already online with ', depAccent: 'Kivo',
    depSub: 'Business owners, in their own words.',
    testimonials: [
      { quote: 'I used to think websites were for big companies. Now customers find me on Google and already know what I do when they reach out.', biz: 'Eyebrow studio' },
      { quote: 'They explained everything straight to the point. When I need to change the menu, I do it myself in two minutes.', biz: 'Burger restaurant' },
      { quote: 'The WhatsApp button changed my routine. Quote requests come straight in, already with the right information.', biz: 'Architecture firm' },
    ],

    faqTitle: 'Frequently asked ', faqAccent: 'questions',
    faqSub: 'Didn’t find your question? ', faqLink: 'Message us on WhatsApp',
    faqs: [
      { q: 'How much does a website cost?', a: 'It depends on what your business needs. Tell us about it on WhatsApp and you get a fixed-price quote, with no surprises along the way.' },
      { q: 'How long does it take?', a: 'The timeline is written in the quote, along with the price. You know from day one when your site goes live.' },
      { q: 'Do I need to be good with technology?', a: 'No. We handle the technical side and speak your language. You just tell us how your business works.' },
      { q: 'Can I update the site later?', a: 'Yes. The site is built to be easy to update: changing a text, a photo or your opening hours doesn’t require a developer.' },
      { q: 'Does the site work well on mobile?', a: 'Yes. Most of your customers will open it on their phone, so the site is designed for small screens first.' },
      { q: 'Do you work with my type of business?', a: 'We work with small businesses of every kind: from beauty salons to accounting offices, from neighborhood shops to service providers.' },
    ],

    orcTitle: 'Ready to get your website ', orcAccent: 'off the ground?',
    orcSub: 'Fill in the form and continue the conversation on WhatsApp, with everything already written.',
    fNome: 'Your name', fNomePh: 'What should we call you?',
    fNegocio: 'Your business', fNegocioPh: 'E.g. bakery, clinic, office',
    fSite: 'Do you already have a website?', siteOpts: { nao: 'No', refazer: 'Yes, I want a new one' },
    fMsg: 'Tell us a bit about what you need ', fOptional: '(optional)',
    fMsgPh: 'E.g. I want to show my services and receive orders',
    fSubmit: 'Get a quote on WhatsApp',

    contTitle: 'Get in ', contAccent: 'touch',
    contSub: 'Pick the channel that works best for you. We reply fast.',
    contLabels: ['Email', 'Phone and WhatsApp', 'Instagram'],

    footerTag: 'Professional websites for small businesses.',
    privacyLink: 'Privacy policy', cookiePrefs: 'Cookie preferences',
    consentTitle: 'Your privacy', consentAccept: 'Accept', consentDecline: 'Decline',
    waFloat: 'Chat with Kivo on WhatsApp',
  },

  dynamic: {
    pt: {
      htmlLang: 'pt-BR',
      title: 'Kivo Digital: sites profissionais para pequenos negócios',
      description: 'A Kivo Digital cria sites profissionais, rápidos e fáceis de atualizar para pequenos negócios. Peça seu orçamento pelo WhatsApp.',
      heroLines: [['Seu', 'negócio'], ['merece', 'um', 'site'], ['de', '@icon', 'verdade']],
      menuOpen: 'Abrir menu', menuClose: 'Fechar menu',
      fbErro: 'Preencha seu nome e o tipo de negócio para continuar.', fbOk: 'Abrindo o WhatsApp...',
      siteOpts: { nao: 'Não', refazer: 'Sim, quero refazer' },
      waIntro: 'Olá, Kivo! Quero um orçamento de site.', waNome: 'Nome', waNegocio: 'Negócio',
      waSite: 'Já tem site', waMsg: 'O que preciso',
      waDirect: 'Olá, Kivo! Quero saber mais sobre sites.',
      consentTools: { ga: 'do Google Analytics', meta: 'da Meta', and: ' e ' },
      consentText: tools => `Usamos cookies ${tools} para entender como o site é usado e melhorar nossos anúncios. Eles só são ativados se você aceitar. Saiba mais na `,
    },
    en: {
      htmlLang: 'en',
      title: 'Kivo Digital: professional websites for small businesses',
      description: 'Kivo Digital builds professional websites for small businesses: fast and easy to update. Get your quote on WhatsApp.',
      heroLines: [['Your', 'business'], ['deserves', 'a'], ['real', '@icon', 'website']],
      menuOpen: 'Open menu', menuClose: 'Close menu',
      fbErro: 'Please fill in your name and type of business to continue.', fbOk: 'Opening WhatsApp...',
      siteOpts: { nao: 'No', refazer: 'Yes, I want a new one' },
      waIntro: 'Hi, Kivo! I’d like a website quote.', waNome: 'Name', waNegocio: 'Business',
      waSite: 'Already has a website', waMsg: 'What I need',
      waDirect: 'Hi, Kivo! I’d like to know more about websites.',
      consentTools: { ga: 'Google Analytics', meta: 'Meta', and: ' and ' },
      consentText: tools => `We use ${tools} cookies to understand how the site is used and to improve our ads. They are only turned on if you accept. Learn more in our `,
    },
  },
};
