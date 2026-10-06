/* ==========================================================================
   Medição com consentimento (LGPD): Google Analytics 4 + Pixel da Meta.
   Nada é carregado antes de o visitante clicar em "Aceitar".
   Os códigos ficam em js/config.js.
   ========================================================================== */
(function () {
  var cfg = window.KIVO_CONFIG || {};
  var GA4_ID = cfg.ga4Id || '';
  var META_PIXEL_ID = cfg.metaPixelId || '';
  var STORAGE_KEY = 'kivo-consent';
  var loaded = false;

  function readConsent() {
    try { return window.localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function saveConsent(value) {
    try { window.localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }

  // Carrega cada ferramenta uma única vez
  function load() {
    if (loaded) return;
    loaded = true;
    if (GA4_ID) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', GA4_ID);
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
      document.head.appendChild(s);
    }
    if (META_PIXEL_ID) {
      /* código padrão do Pixel da Meta */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', META_PIXEL_ID);
      window.fbq('track', 'PageView');
    }
  }

  window.KivoTracking = {
    // true se pelo menos uma ferramenta estiver configurada
    enabled: !!(GA4_ID || META_PIXEL_ID),
    hasGA: !!GA4_ID,
    hasMeta: !!META_PIXEL_ID,

    // 'granted' | 'denied' | null (ainda não respondeu)
    consent: readConsent,

    start: function () {
      if (this.enabled && readConsent() === 'granted') load();
    },

    setConsent: function (value) {
      saveConsent(value);
      if (value === 'granted') load();
      // Ao recusar depois de ter aceitado, recarrega para descarregar as ferramentas
      else if (loaded) window.location.reload();
    },

    // Registra um evento nas duas ferramentas.
    // ga: nome do evento no GA4; meta: evento padrão da Meta ('Lead' ou 'Contact').
    // Nunca envie aqui dados que a pessoa digitou (nome, negócio, mensagem).
    track: function (ga, meta, params) {
      if (!loaded) return;
      params = params || {};
      try { if (GA4_ID && window.gtag) window.gtag('event', ga, params); } catch (e) {}
      try { if (META_PIXEL_ID && window.fbq) window.fbq('track', meta, params); } catch (e) {}
    },
  };
})();
