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

  // Idioma da página aberta: en/index.html tem data-page-lang="en"; a página principal é português
  function pageLang() {
    return document.documentElement.getAttribute('data-page-lang') === 'en' ? 'en' : 'pt';
  }

  function initialLang() {
    try {
      var q = new URLSearchParams(window.location.search).get('lang');
      if (q === 'pt' || q === 'en') return q;
    } catch (e) {}
    // Quem abre /en/ (por exemplo, vindo do Google em inglês) vê inglês
    if (pageLang() === 'en') return 'en';
    var saved = storageGet('kivo-lang');
    return saved === 'en' || saved === 'pt' ? saved : 'pt';
  }

  // Mantém o endereço igual ao idioma (/ ou /en/), sem recarregar a página
  function syncUrl(lang) {
    try {
      var path = lang === 'en' ? '/en/' : '/';
      if (window.location.pathname !== path || window.location.search) {
        window.history.replaceState(null, '', path + window.location.hash);
      }
    } catch (e) {}
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
    $$('.js-review-wa').forEach(function (a) { a.href = waLink(d.waReview); });
    if (morph) morph.relabel();
    if (nicheShow) nicheShow.relabel();
    $$('.js-privacy-link').forEach(function (a) { a.href = '/privacidade.html?lang=' + lang; });
    updateConsentText();
    hideFeedback();
    syncUrl(lang);

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
          img.src = '/assets/kivo-avatar-lima.svg';
          img.alt = '';
          word.appendChild(img);
        } else {
          word.textContent = w;
        }
        line.appendChild(word);
      });
      title.appendChild(line);
    });
    // O "_" da marca piscando depois da última palavra
    var last = title.lastChild && title.lastChild.lastChild;
    if (last) {
      var cursor = document.createElement('span');
      cursor.className = 'cursor';
      cursor.setAttribute('aria-hidden', 'true');
      last.appendChild(cursor);
    }
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

    var bar = $('.progress');
    var steps = $('.js-steps');
    var stepItems = steps ? $$('.step', steps) : [];
    var vertical = window.matchMedia('(max-width: 860px)');

    function clamp01(v) { return Math.max(0, Math.min(1, v)); }

    function update() {
      ticking = false;
      var vh = window.innerHeight;
      var p = clamp01(window.scrollY / (vh * 0.6));
      var inset = (mobile.matches ? 8 : 40) * (1 - p);
      sheet.style.setProperty('--sheet-inset', inset.toFixed(2) + 'px');
      sheet.style.setProperty('--sheet-radius', (mobile.matches ? 24 : 40) + 'px');

      // Barra de leitura no topo (o "_" do logo esticado)
      var max = document.documentElement.scrollHeight - vh;
      if (bar) bar.style.setProperty('--read', (max > 0 ? clamp01(window.scrollY / max) : 0).toFixed(4));

      // Linha das etapas: enche conforme a seção passa pela tela
      if (steps) {
        var r = steps.getBoundingClientRect();
        var sp = vertical.matches ? clamp01((vh * 0.7 - r.top) / r.height) : clamp01((vh * 0.85 - r.top) / (vh * 0.45));
        steps.style.setProperty('--p', sp.toFixed(4));
        stepItems.forEach(function (item, i) {
          item.classList.toggle('is-done', sp >= i / stepItems.length + 0.02);
        });
      }
    }
    function onScroll() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ---------- Responsividade: aparelhos sobem quando o cartão aparece ---------- */
  function setupDeviceCards() {
    var cards = $$('.js-rs-card');
    if (!cards.length) return;
    if (!('IntersectionObserver' in window)) {
      cards.forEach(function (c) { c.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      });
    }, { threshold: 0.25 });
    cards.forEach(function (c) { io.observe(c); });
  }

  /* ==========================================================================
     FIGURA EM PEDAÇOS DA ABERTURA
     Os 32 triângulos (.morph__piece) mudam de forma pelo atributo data-shape;
     as formas ficam em css/formas.css. Começa espalhado ("intro"), monta o k_
     e depois passa sozinho pelos tipos de negócio enquanto a abertura está na
     tela. Clicar num botão escolhe a figura e para a troca automática.
     ========================================================================== */
  var SHAPES = ['kivo', 'cafe', 'loja', 'salao', 'clinica', 'local'];
  var morph = null; // { relabel } depois de setupMorph()

  function setupMorph() {
    var el = $('.js-morph');
    if (!el) return;
    var buttons = $$('.niche[data-shape]');
    var toggle = $('.js-morph-toggle');
    var stage = $('.js-stage');
    var nameEl = $('.js-stage-name');
    var countEl = $('.js-stage-count');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var current = 'kivo';
    var playing = !reduce;
    var visible = true;
    var timer = null;

    function relabel() {
      var names = dyn('niches');
      if (nameEl) nameEl.textContent = names[current];
      if (countEl) countEl.textContent = '0' + (SHAPES.indexOf(current) + 1) + '/0' + SHAPES.length;
      el.setAttribute('aria-label', dyn('stageAria')(names[current]));
      if (toggle) {
        toggle.setAttribute('aria-label', playing ? dyn('morphPause') : dyn('morphPlay'));
        $('.js-icon-pause', toggle).hidden = !playing;
        $('.js-icon-play', toggle).hidden = playing;
      }
    }
    function show(shape) {
      current = shape;
      el.setAttribute('data-shape', shape);
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-shape') === shape)); });
      relabel();
    }
    function schedule(delay) {
      clearTimeout(timer);
      if (playing && visible && !document.hidden) timer = setTimeout(next, delay || 3400);
    }
    function next() {
      show(SHAPES[(SHAPES.indexOf(current) + 1) % SHAPES.length]);
      schedule();
    }
    function setPlaying(on) {
      playing = on;
      relabel();
      if (on) schedule(900); else clearTimeout(timer);
    }

    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        show(b.getAttribute('data-shape'));
        setPlaying(false);
      });
    });
    if (toggle) toggle.addEventListener('click', function () { setPlaying(!playing); });
    document.addEventListener('visibilitychange', function () { if (started) schedule(); });
    morph = { relabel: relabel };
    if (reduce) { show('kivo'); return; }

    // Entrada: os pedaços soltos se juntam e formam o k_. Começa quando o palco
    // aparece na tela (no celular ele fica mais para baixo).
    var started = false;
    function intro() {
      if (started) return;
      started = true;
      setTimeout(function () { show('kivo'); schedule(4600); }, 350);
    }
    if ('IntersectionObserver' in window && stage) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (!visible) { clearTimeout(timer); return; }
        if (!started) intro(); else schedule();
      }, { threshold: 0.35 }).observe(stage);
    } else {
      intro();
    }
  }

  /* ==========================================================================
     PARA CADA NEGÓCIO: a figura muda conforme a pessoa rola pelos textos.
     Com GSAP, cada texto vira um ScrollTrigger; sem ele, um IntersectionObserver.
     ========================================================================== */
  var nicheShow = null;

  function setupNicheShow() {
    var el = $('.js-morph-scroll');
    var items = $$('.niche-item');
    if (!el || !items.length) return;
    var nameEl = $('.js-nshow-name');
    var countEl = $('.js-nshow-count');
    var current = items[0];

    function relabel() {
      var shape = current.getAttribute('data-shape');
      if (nameEl) nameEl.textContent = dyn('niches')[shape];
      if (countEl) countEl.textContent = '0' + (items.indexOf(current) + 1) + '/0' + items.length;
    }
    function activate(item) {
      current = item;
      el.setAttribute('data-shape', item.getAttribute('data-shape'));
      items.forEach(function (it) { it.classList.toggle('is-active', it === item); });
      relabel();
    }

    if (hasGsap()) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      items.forEach(function (item) {
        window.ScrollTrigger.create({
          trigger: item, start: 'top 60%', end: 'bottom 60%',
          onToggle: function (self) { if (self.isActive) activate(item); },
        });
      });
    } else if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) activate(e.target); });
      }, { rootMargin: '-40% 0px -40% 0px' });
      items.forEach(function (item) { io.observe(item); });
    }
    nicheShow = { relabel: relabel };
    activate(items[0]);
  }

  /* ==========================================================================
     GSAP (carregado do cdnjs no <head>): animações ligadas à rolagem.
     Tudo aqui é extra: sem o GSAP, ou com "reduzir movimento", o site funciona igual.
     ========================================================================== */
  function hasGsap() {
    return !!(window.gsap && window.ScrollTrigger) &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Quebra o texto de um título em palavras (<span class="split-w"><span>palavra</span></span>)
  function splitWords(root) {
    var words = [];
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var parts = node.textContent.split(/(\s+)/);
      if (parts.length < 1 || !node.textContent.trim()) return;
      var frag = document.createDocumentFragment();
      parts.forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var outer = document.createElement('span');
        outer.className = 'split-w';
        var inner = document.createElement('span');
        inner.textContent = part;
        outer.appendChild(inner);
        frag.appendChild(outer);
        words.push(inner);
      });
      node.parentNode.replaceChild(frag, node);
    });
    return words;
  }

  function setupGsap() {
    if (!hasGsap()) return;
    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    // Títulos das seções: as palavras sobem de dentro de uma "janela"
    $$('.section__title, .band__title, .quote__title').forEach(function (title) {
      var words = splitWords(title);
      gsap.from(words, {
        yPercent: 110, duration: 0.9, ease: 'power3.out', stagger: 0.045,
        scrollTrigger: { trigger: title, start: 'top 88%', once: true },
      });
    });

    // Faixas escuras crescem até o tamanho final ao entrar na tela
    $$('.band, .quote').forEach(function (box) {
      gsap.fromTo(box, { scale: 0.94 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: box, start: 'top bottom', end: 'top 40%', scrub: true },
      });
    });

    // Abertura saindo da tela: texto sobe e o palco tomba para trás em 3D (só computador)
    gsap.matchMedia().add('(min-width: 901px)', function () {
      var st = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.hero__text', { yPercent: -14, opacity: 0.25, ease: 'none', scrollTrigger: st });
      gsap.to('.js-hero-depth', {
        rotateX: 28, scale: 0.86, y: 30, transformPerspective: 900, transformOrigin: '50% 100%',
        ease: 'none', scrollTrigger: st,
      });
    });
  }

  /* ---------- Palco inclina um pouco seguindo o mouse (só computador) ---------- */
  function setupStageTilt() {
    var art = $('.hero__art');
    var stage = $('.js-stage');
    if (!art || !stage) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    art.addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      stage.style.setProperty('--rx', (x * 10).toFixed(2) + 'deg');
      stage.style.setProperty('--ry', (-y * 10).toFixed(2) + 'deg');
    });
    art.addEventListener('pointerleave', function () {
      stage.style.setProperty('--rx', '0deg');
      stage.style.setProperty('--ry', '0deg');
    });
  }

  /* ---------- Blocos aparecem ao rolar (.rv ganha .is-in) ---------- */
  function setupReveal() {
    var els = $$('.rv');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    // Cartões lado a lado entram um depois do outro
    els.forEach(function (el) {
      var siblings = $$(':scope > .rv', el.parentNode);
      if (siblings.length > 1) el.style.setProperty('--d', (0.07 * (siblings.indexOf(el) % 4)).toFixed(2) + 's');
    });
    document.documentElement.classList.add('js-rv');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Avaliações: link do Google (js/config.js) ---------- */
  function setupReviews() {
    var url = String(cfg.googleReviewUrl || '').trim();
    var btn = $('.js-review-google');
    if (!btn || !/^https:\/\//.test(url)) return; // sem link: fica só o botão do WhatsApp
    btn.href = url;
    btn.hidden = false;
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
  setupDeviceCards();
  setupMorph();
  setupNicheShow();
  setupStageTilt();
  setupReveal();
  setupReviews();
  setupFaq();
  setupForm();
  setupClickTracking();
  setupConsent();
  applyLang(initialLang(), true);
  startHeroAnimation();
  setupGsap(); // depois do idioma: os títulos já estão com o texto certo quando são quebrados
})();
