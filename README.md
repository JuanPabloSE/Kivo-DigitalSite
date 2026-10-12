# Site da Kivo Digital

Site estático em HTML, CSS e JavaScript puros, publicado pelo GitHub Pages em
https://kivodigitalbr.com.br. Não há etapa de build: o que está no repositório é o que vai ao ar.

## Onde mexer

| Quero mudar... | Arquivo |
|---|---|
| Número do WhatsApp, códigos do Google Analytics e do Pixel da Meta, link de avaliação no Google | `js/config.js` |
| Um texto em **português** | `index.html` |
| Um texto em **inglês** | `js/i18n.js` (parte `en`) |
| Mensagem do WhatsApp, erros do formulário, aviso de cookies, título da abertura | `js/i18n.js` (parte `dynamic`) |
| Cores, fontes, espaçamentos, tamanhos | `css/styles.css` (cores nas variáveis do topo) |
| Menu, perguntas, formulário, troca de idioma | `js/main.js` |
| Figuras em pedaços da abertura (k_, xícara, sacola...) | `_ferramentas/gerar-formas.py`, depois rode `python3 _ferramentas/gerar-formas.py` (gera `css/formas.css`) |
| Logos da faixa "Ferramentas" | desenho no `<svg class="sprite">` do `index.html` (id `si-nome`) e item nas duas listas da seção |
| Aviso de cookies e medição | `js/tracking.js` |
| Política de privacidade | `privacidade.html`, `css/privacidade.css`, `js/privacidade.js` |

## Google (SEO)

- **Página em inglês (`/en/`)**: o arquivo `en/index.html` é **gerado**, não edite. Depois de mudar
  o `index.html`, rode antes do commit:
  `pwsh -NoProfile -File _ferramentas/gerar-en.ps1`
  O título, a descrição e a prévia em inglês ficam em `_ferramentas/seo-en.html`.
- **Título e descrição em português**: no `<head>` do `index.html`, entre `SEO:INICIO` e `SEO:FIM`
  (e também em `js/i18n.js > dynamic`, usado quando a pessoa troca de idioma).
- **Dados da empresa para o Google** (serviços, áreas atendidas, contato): bloco
  `application/ld+json` no `<head>` do `index.html`.
- **Página nova**: acrescente o endereço no `sitemap.xml`.
- Pastas que começam com `_` (como `_ferramentas`) não são publicadas pelo GitHub Pages.

## Páginas de serviço

`criacao-de-sites/`, `landing-page/`, `loja-virtual/` e `cardapio-digital/` são **geradas**, não edite o
`index.html` delas. Textos, perguntas, prazo e ícones ficam em `_ferramentas/gerar-paginas.py`. Depois de
mudar o gerador (ou o rodapé do `index.html`), rode:
`python3 _ferramentas/gerar-paginas.py`

Estilo próprio dessas páginas: `css/pagina.css`. Script: `js/pagina.js` (menu, perguntas, WhatsApp com
mensagem de cada página, cookies). Ao criar uma página nova, inclua no `sitemap.xml` e no `llms.txt`.
Regra da Kivo: **nenhum valor em reais no site**. Preço é sempre "sob orçamento".

Sem PowerShell, a versão em inglês também pode ser gerada com `python3 _ferramentas/gerar-en.py .`

## Regras para não quebrar

- Cada texto traduzível tem um `data-i18n="chave"` no HTML. Ao criar um texto novo, crie a
  mesma chave em `js/i18n.js > en`. Se faltar, o texto fica em português e aparece um aviso no
  console do navegador.
- Não coloque estilos dentro das tags (`style="..."`): use uma classe no `css/styles.css`.
- Identidade: azul, verde-limão e branco; roxo só em detalhes. O "_" do logo é o padrão da marca
  (cursor piscando, barra de leitura no topo, linha das etapas). Animações respeitam a opção
  "reduzir movimento" do aparelho (`prefers-reduced-motion`).
- Nunca envie para a medição dados que a pessoa digitou (nome, negócio, mensagem).
- Os textos de `og:` no `<head>` do `index.html` são a prévia ao compartilhar o link.
- O arquivo `CNAME` liga o domínio próprio. Não apague.

## Testar antes de subir

Abra o `index.html` por um servidor local (não direto pelo arquivo) e confira no computador e no
celular, em PT e EN.
