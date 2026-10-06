# Site da Kivo Digital

Site estático em HTML, CSS e JavaScript puros, publicado pelo GitHub Pages em
https://kivodigitalbr.com.br. Não há etapa de build: o que está no repositório é o que vai ao ar.

## Onde mexer

| Quero mudar... | Arquivo |
|---|---|
| Número do WhatsApp, códigos do Google Analytics e do Pixel da Meta | `js/config.js` |
| Um texto em **português** | `index.html` |
| Um texto em **inglês** | `js/i18n.js` (parte `en`) |
| Mensagem do WhatsApp, erros do formulário, aviso de cookies, título da abertura | `js/i18n.js` (parte `dynamic`) |
| Cores, fontes, espaçamentos, tamanhos | `css/styles.css` (cores nas variáveis do topo) |
| Menu, perguntas, formulário, troca de idioma | `js/main.js` |
| Aviso de cookies e medição | `js/tracking.js` |
| Política de privacidade | `privacidade.html`, `css/privacidade.css`, `js/privacidade.js` |

## Regras para não quebrar

- Cada texto traduzível tem um `data-i18n="chave"` no HTML. Ao criar um texto novo, crie a
  mesma chave em `js/i18n.js > en`. Se faltar, o texto fica em português e aparece um aviso no
  console do navegador.
- Não coloque estilos dentro das tags (`style="..."`): use uma classe no `css/styles.css`.
- Nunca envie para a medição dados que a pessoa digitou (nome, negócio, mensagem).
- Os textos de `og:` no `<head>` do `index.html` são a prévia ao compartilhar o link.
- O arquivo `CNAME` liga o domínio próprio. Não apague.

## Testar antes de subir

Abra o `index.html` por um servidor local (não direto pelo arquivo) e confira no computador e no
celular, em PT e EN.
