/* ==========================================================================
   Kivo Digital: comportamento do site
   Depende de: js/config.js, js/i18n.js e js/tracking.js (carregados antes).
   ========================================================================== */
(function () {
  'use strict';

  var cfg = window.KIVO_CONFIG || {};
  var I18N = window.KIVO_I18N || { en: {}, dynamic: { pt: {}, en: {} } };
  var tracking = window.KivoTracking || { enabled: false, start: function () {}, track: function () {}, consent: function () { return null; }, setConsent: function () {} };

  var state = { lang: 'pt', site: 'nao' };

  document.documentElement.classList.remove('no-js');

  /* ---------- Utilitários ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  // Lê "services.0.title" dentro de um objeto
  function get(obj, path) {
    return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
  }
  // Frases montadas pelo script, no idioma atual
  function dyn(key) { return I18N.dynamic[state.lang][key]; }
  function storageGet(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } }
  function storageSet(key, value) { try { window.localStorage.setItem(key, value); } catch (e) {} }

  /* ---------- WhatsApp e telefone (número em js/config.js) ---------- */
  function waNumber() { return String(cfg.whatsapp || '').replace(/\D/g, ''); }
  function isProvisionalNumber() { return /^550+$/.test(waNumber()); }
  // 5511912345678 -> +55 (11) 91234-5678
  function phoneDisplay() {
    var n = waNumber();
    var m = n.match(/^55(\d{2})(\d{4,5})(\d{4})$/);
    return m ? '+55 (' + m[1] + ') ' + m[2] + '-' + m[3] : '+' + n;
  }
  function waLink(text) {
    return 'https://wa.me/' + waNumber() + '?text=' + encodeURIComponent(text);
  }

  function setupPhone() {
    if (isProvisionalNumber()) return; // continua escondido
    var item = $('.js-phone');
    if (!item) return;
    $('.js-phone-link', item).href = 'tel:+' + waNumber();
    $('.js-phone-text', item).textContent = phoneDisplay();
    item.hidden = false;
  }

  /* ==========================================================================
     IDIOMA
     O português vem do próprio HTML; o inglês vem de js/i18n.js.
     ========================================================================== */
  var I18N_ATTRS = ['aria-label', 'placeholder'];
  var original = new Map(); // textos em português lidos do HTML

  function captureOriginals() {
    $$('[data-i18n]').forEach(function (el) {
      original.set(el, { text: el.textContent });
    });
    I18N_ATTRS.forEach(function (attr) {
      $$('[data-i18n-' + attr + ']').forEach(function (el) {
        var saved = original.get(el) || {};
        saved[attr] = el.getAttribute(attr);
        original.set(el, saved);
      });
    });
  }

  function translateStatic(lang) {
    original.forEach(function (saved, el) {
      var key = el.getAttribute('data-i18n');
      if (key) {
        var text = lang === 'pt' ? saved.text : get(I18N.en, key);
        if (typeof text === 'string') el.textContent = text;
        else if (window.console) console.warn('[i18n] tradução faltando:', key);
      }
      I18N_ATTRS.forEach(function (attr) {
        var attrKey = el.getAttribute('data-i18n-' + attr);
        if (!attrKey) return;
        var value = lang === 'pt' ? saved[attr] : get(I18N.en, attrKey);
        if (typeof value === 'string') el.setAttribute(attr, value);
      });
    });
  }

  function initialLang() {
    try {
      var q = new URLSearchParams(window.location.search).get('lang');
      if (q === 'pt' || q === 'en') return q;
    } catch (e) {}
    var saved = storageGet('kivo-lang');
    return saved === 'en' || saved === 'pt' ? saved : 'pt';
  }

  function applyLang(lang, isInit) {
    state.lang = lang;
    var d = I18N.dynamic[lang];

    document.documentElement.lang = d.htmlLang;
    document.title = d.title;
    var meta = $('meta[name="description"]');
    if (meta) meta.setAttribute('content', d.description);

    translateStatic(lang);
    if (!(isInit && lang === 'pt')) buildHeroTitle(d.heroLines); // o HTML já vem em português

    $$('.lang__btn').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
    });
    updateMenuLabel();
    $$('.js-wa-link').forEach(function (a) { a.href = waLink(d.waDirect); });
    $$('.js-privacy-link').forEach(function (a) { a.href = 'privacidade.html?lang=' + lang; });
    updateConsentText();
    hideFeedback();

    if (!isInit) storageSet('kivo-lang', lang);
  }

  function setupLangSwitch() {
    $$('.lang__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-lang');
        if (lang !== state.lang) applyLang(lang, false);
      });
    });
  }

  /* ==========================================================================
     ABERTURA: título palavra por palavra e animação de entrada
     ========================================================================== */
  function setWordDelays() {
    $$('.hero__word').forEach(function (word, i) {
      word.style.setProperty('--d', (0.08 * i).toFixed(2) + 's');
    });
  }

  function buildHeroTitle(lines) {
    var title = $('.hero__title');
    if (!title || !lines) return;
    title.textContent = '';
    lines.forEach(function (words) {
      var line = document.createElement('span');
      line.className = 'hero__line';
      words.forEach(function (w) {
        var word = document.createElement('span');
        word.className = 'hero__word reveal';
        if (w === '@icon') {
          var img = document.createElement('img');
          img.className = 'hero__icon';
          img.src = 'assets/kivo-avatar-lima.svg';
          img.alt = '';
          word.appendChild(img);
        } else {
          word.textContent = w;
        }
        line.appendChild(word);
      });
      title.appendChild(line);
    });
    setWordDelays();
  }

  function startHeroAnimation() {
    setWordDelays();
    setTimeout(function () { document.body.classList.add('is-loaded'); }, 80);
  }

  /* ==========================================================================
     MENU DO CELULAR (abaixo de 1024px)
     ========================================================================== */
  var header = $('.header');
  var menuToggle = $('.menu-toggle');

  function isMenuOpen() { return header.classList.contains('is-menu-open'); }
  function updateMenuLabel() {
    if (!menuToggle) return;
    menuToggle.setAttribute('aria-label', isMenuOpen() ? dyn('menuClose') : dyn('menuOpen'));
  }
  function setMenu(open) {
    header.classList.toggle('is-menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    updateMenuLabel();
  }

  function setupMenu() {
    if (!menuToggle) return;
    menuToggle.addEventListener('click', function () { setMenu(!isMenuOpen()); });
    $$('.mobile-menu a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (e) {
      if (e.matches) setMenu(false);
    });
  }

  /* ==========================================================================
     FOLHA CLARA: sobe e alarga conforme a página rola
     ========================================================================== */
  function setupSheet() {
    var sheet = $('.sheet');
    if (!sheet) return;
    var mobile = window.matchMedia('(max-width: 767px)');
    var ticking = false;

    function update() {
      ticking = false;
      var p = Math.max(0, Math.min(1, window.scrollY / (window.innerHeight * 0.6)));
      var inset = (mobile.matches ? 8 : 40) * (1 - p);
      sheet.style.setProperty('--sheet-inset', inset.toFixed(2) + 'px');
      sheet.style.setProperty('--sheet-radius', (mobile.matches ? 24 : 40) + 'px');
    }
    function onScroll() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ==========================================================================
     PERGUNTAS FREQUENTES: uma aberta por vez
     ========================================================================== */
  function setupFaq() {
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
  }

  /* ==========================================================================
     FORMULÁRIO DE ORÇAMENTO: monta a mensagem e abre o WhatsApp
     Nada é guardado no site.
     ========================================================================== */
  var form = $('#form-orcamento');
  var feedback = form ? $('.form__feedback', form) : null;

  function showFeedback(text, type) {
    feedback.textContent = text;
    feedback.className = 'form__feedback ' + (type === 'erro' ? 'is-error' : 'is-ok');
    feedback.hidden = false;
  }
  function hideFeedback() { if (feedback) feedback.hidden = true; }

  function setupForm() {
    if (!form) return;

    $$('.pill', form).forEach(function (pill) {
      pill.addEventListener('click', function () {
        state.site = pill.getAttribute('data-site');
        $$('.pill', form).forEach(function (p) { p.setAttribute('aria-pressed', String(p === pill)); });
      });
    });

    $$('.field__input', form).forEach(function (input) {
      input.addEventListener('input', hideFeedback);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = form.elements.nome.value.trim();
      var negocio = form.elements.negocio.value.trim();
      var msg = form.elements.msg.value.trim();

      if (!nome || !negocio) {
        showFeedback(dyn('fbErro'), 'erro');
        return;
      }

      var texto = dyn('waIntro') + '\n\n' +
        '*' + dyn('waNome') + ':* ' + nome + '\n' +
        '*' + dyn('waNegocio') + ':* ' + negocio + '\n' +
        '*' + dyn('waSite') + ':* ' + dyn('siteOpts')[state.site] +
        (msg ? '\n*' + dyn('waMsg') + ':* ' + msg : '');

      // Nunca enviar nome, negócio ou mensagem para as ferramentas de medição (dados pessoais)
      tracking.track('generate_lead', 'Lead', { method: 'formulario', ja_tem_site: state.site, idioma: state.lang });

      showFeedback(dyn('fbOk'), 'ok');
      setTimeout(function () { window.open(waLink(texto), '_blank'); }, 600);
    });
  }

  /* ==========================================================================
     CLIQUES MEDIDOS (WhatsApp, e-mail, telefone, Instagram)
     Qualquer link com data-track="contact" vira um evento.
     ========================================================================== */
  function setupClickTracking() {
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-track]');
      if (!el) return;
      if (el.getAttribute('data-track') === 'contact') {
        tracking.track('contact', 'Contact', {
          method: el.getAttribute('data-track-method'),
          local: el.getAttribute('data-track-local'),
        });
      }
    });
  }

  /* ==========================================================================
     AVISO DE COOKIES
     ========================================================================== */
  var consentBox = $('.consent');

  function updateConsentText() {
    var el = $('.js-consent-text');
    if (!el) return;
    var tools = dyn('consentTools');
    var names = [tracking.hasGA && tools.ga, tracking.hasMeta && tools.meta].filter(Boolean).join(tools.and);
    el.textContent = dyn('consentText')(names);
  }

  function setupConsent() {
    if (!tracking.enabled || !consentBox) return;
    var prefs = $('.js-cookie-prefs');
    if (prefs) {
      prefs.hidden = false;
      prefs.addEventListener('click', function () { consentBox.hidden = false; });
    }
    $$('[data-consent]', consentBox).forEach(function (btn) {
      btn.addEventListener('click', function () {
        consentBox.hidden = true;
        tracking.setConsent(btn.getAttribute('data-consent'));
      });
    });
    consentBox.hidden = tracking.consent() !== null;
    tracking.start();
  }

  /* ==========================================================================
     INÍCIO
     ========================================================================== */
  $$('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  captureOriginals();
  setupPhone();
  setupLangSwitch();
  setupMenu();
  setupSheet();
  setupFaq();
  setupForm();
  setupClickTracking();
  setupConsent();
  applyLang(initialLang(), true);
  startHeroAnimation();
})();
