/* Página de política de privacidade: troca de idioma */
// Mesmo idioma do site: ?lang= na URL, depois a escolha salva, padrão português
(function () {
  var pick = 'pt';
  try {
    var q = new URLSearchParams(location.search).get('lang');
    var saved = localStorage.getItem('kivo-lang');
    pick = q === 'en' || q === 'pt' ? q : (saved === 'en' ? 'en' : 'pt');
  } catch (e) {}
  var titles = { pt: 'Política de privacidade | Kivo Digital', en: 'Privacy policy | Kivo Digital' };
  function apply(lang) {
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    document.title = titles[lang];
    document.querySelectorAll('[data-version]').forEach(function (el) { el.hidden = el.getAttribute('data-version') !== lang; });
    document.querySelectorAll('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });
    var back = document.querySelector('.back');
    back.textContent = back.getAttribute('data-' + lang);
    back.href = './?lang=' + lang;
    document.querySelector('.langs').setAttribute('aria-label', lang === 'en' ? 'Language' : 'Idioma');
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      var lang = b.getAttribute('data-lang');
      try { localStorage.setItem('kivo-lang', lang); } catch (e) {}
      apply(lang);
    });
  });
  apply(pick);
})();
