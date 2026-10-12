/* ==========================================================================
   Páginas de serviço: menu do celular, perguntas, entrada ao rolar, WhatsApp,
   medição de cliques e aviso de cookies. Versão enxuta do main.js, só em português.
   Número do WhatsApp e códigos de medição: js/config.js.
   ========================================================================== */
(function () {
  var cfg = window.KIVO_CONFIG || {};
  var tracking = window.KivoTracking || { enabled: false, start: function () {}, track: function () {}, consent: function () { return null; }, setConsent: function () {} };

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- WhatsApp: cada link leva a mensagem da própria página (data-wa) ---------- */
  var waNumber = String(cfg.whatsapp || '').replace(/\D/g, '');
  var waPadrao = document.body.getAttribute('data-wa') || 'Olá, Kivo! Quero saber mais sobre sites.';
  $$('.js-wa-link').forEach(function (a) {
    var texto = a.getAttribute('data-wa') || waPadrao;
    a.href = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(texto);
  });

  /* ---------- Ano no rodapé ---------- */
  $$('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Menu do celular ---------- */
  var header = $('.header');
  var toggle = $('.menu-toggle');
  function setMenu(open) {
    header.classList.toggle('is-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  if (header && toggle) {
    toggle.addEventListener('click', function () { setMenu(!header.classList.contains('is-menu-open')); });
    $$('.mobile-menu a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });
  }

  /* ---------- Barra de leitura no topo ---------- */
  var bar = $('.progress');
  if (bar) {
    var onScroll = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty('--read', max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Perguntas: uma aberta por vez ---------- */
  var items = $$('.faq__item');
  function setOpen(item, open) {
    item.classList.toggle('is-open', open);
    $('.faq__btn', item).setAttribute('aria-expanded', String(open));
    $('.faq__a', item).hidden = !open;
  }
  items.forEach(function (item) {
    $('.faq__btn', item).addEventListener('click', function () {
      var wasOpen = item.classList.contains('is-open');
      items.forEach(function (other) { setOpen(other, false); });
      if (!wasOpen) setOpen(item, true);
    });
  });

  /* ---------- Blocos aparecem ao rolar ---------- */
  var rv = $$('.rv');
  if (rv.length && 'IntersectionObserver' in window) {
    rv.forEach(function (el) {
      var irmaos = $$(':scope > .rv', el.parentNode);
      if (irmaos.length > 1) el.style.setProperty('--d', (0.07 * (irmaos.indexOf(el) % 4)).toFixed(2) + 's');
    });
    document.documentElement.classList.add('js-rv');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Cliques medidos (só com consentimento; nunca dados digitados) ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track="contact"]');
    if (!el) return;
    tracking.track('contact', 'Contact', {
      method: el.getAttribute('data-track-method'),
      local: el.getAttribute('data-track-local'),
      pagina: location.pathname,
    });
  });

  /* ---------- Aviso de cookies ---------- */
  var box = $('.consent');
  if (tracking.enabled && box) {
    var nomes = [tracking.hasGA && 'do Google Analytics', tracking.hasMeta && 'da Meta'].filter(Boolean).join(' e ');
    var texto = $('.js-consent-text', box);
    if (texto) texto.textContent = 'Usamos cookies ' + nomes + ' para entender como o site é usado e melhorar nossos anúncios. Eles só são ativados se você aceitar. Saiba mais na ';
    var prefs = $('.js-cookie-prefs');
    if (prefs) {
      prefs.hidden = false;
      prefs.addEventListener('click', function () { box.hidden = false; });
    }
    $$('[data-consent]', box).forEach(function (btn) {
      btn.addEventListener('click', function () {
        box.hidden = true;
        tracking.setConsent(btn.getAttribute('data-consent'));
      });
    });
    box.hidden = tracking.consent() !== null;
    tracking.start();
  }
})();
