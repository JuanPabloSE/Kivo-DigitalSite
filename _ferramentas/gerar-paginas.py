#!/usr/bin/env python3
# ==========================================================================
# Gera as páginas de serviço (uma pasta com index.html para cada serviço).
#
# QUANDO RODAR: depois de mudar qualquer texto, preço ou prazo deste arquivo,
# ou o cabeçalho/rodapé do index.html.
#   python3 _ferramentas/gerar-paginas.py
#
# Preço e prazo de cada serviço ficam em SERVICOS (campos "preco" e "prazo").
# Deixe None para mostrar "Sob orçamento" / "Combinado no orçamento".
# Ícones: copiados do sprite do index.html (só os usados).
# Pastas que começam com "_" não são publicadas pelo GitHub Pages.
# ==========================================================================
import html
import json
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SITE = "https://kivodigitalbr.com.br"

# --------------------------------------------------------------------------
# Conteúdo de cada serviço
# --------------------------------------------------------------------------
SERVICOS = [
    {
        "slug": "criacao-de-sites",
        "nome": "Criação de sites",
        "menu": "Sites profissionais",
        "icone": "ph-globe",
        "preco": None,
        "prazo": "Em média 15 dias",
        "title": "Criação de Sites em Santo André e Todo o Brasil | Kivo Digital",
        "description": "Criação de sites profissionais para pequenos negócios, com hospedagem, domínio e configuração para o Google. Orçamento fechado e prazo médio de 15 dias. Santo André, Grande ABC, São Paulo e todo o Brasil.",
        "h1": ["Criação de sites para pequenos negócios em ", "Santo André e todo o Brasil"],
        "lead": "A Kivo Digital cria sites profissionais para pequenos negócios, com hospedagem, domínio e configuração para aparecer no Google. Você recebe o site pronto em <strong>cerca de 15 dias</strong>, funcionando bem no celular, e consegue atualizar textos e fotos sem depender de programador.",
        "wa": "Olá, Kivo! Vi a página de criação de sites e quero um orçamento.",
        "explica": [
            "Um site profissional é o endereço do seu negócio na internet. É onde o cliente confirma que você existe, vê seus serviços, preços e horários, e chama no WhatsApp com confiança.",
            "Diferente do Instagram, o site aparece no Google quando alguém procura o que você oferece na sua região. Ele também passa mais credibilidade na hora de fechar: o cliente encontra tudo em um lugar só, organizado, sem precisar rolar o feed.",
        ],
        "incluso": [
            ("ph-browser", "Páginas sob medida", "Início, serviços, sobre e contato, ou as páginas que o seu negócio precisa, em português, inglês ou nos dois."),
            ("ph-whatsapp-logo", "Botão de WhatsApp", "O cliente chama você em um toque, de qualquer página, com a mensagem já escrita."),
            ("ph-magnifying-glass", "Configuração para o Google", "Títulos, descrições, mapa do site e dados da empresa organizados para o Google entender e mostrar o seu site."),
            ("ph-hard-drives", "Hospedagem e domínio", "Registramos o endereço do site e mantemos tudo no ar, com o cadeado de segurança ativo."),
        ],
        "para_quem": ["Clínicas e consultórios", "Salões e barbearias", "Restaurantes e cafeterias", "Lojas de bairro", "Escritórios", "Prestadores de serviço", "Ateliês e confeitarias"],
        "para_quem_texto": "Serve para quem quer ser encontrado no Google e passar confiança antes da primeira conversa. Se você precisa de uma página só, para um anúncio ou uma campanha, a <a href=\"/landing-page/\">landing page</a> pode ser o caminho mais rápido.",
        "faq": [
            ("Quanto custa criar um site?", "É sob orçamento, porque o valor depende de quantas páginas e recursos o site precisa. Você explica pelo WhatsApp e recebe o orçamento com valor fechado por escrito, sem cobrança extra no meio do caminho."),
            ("Em quanto tempo o site fica pronto?", "Em média 15 dias. O prazo exato vem por escrito no orçamento, junto com o valor."),
            ("O site aparece no Google?", "Sim. Todo site sai com a configuração básica para o Google: títulos, descrições, mapa do site e dados da empresa. A posição na busca também depende do conteúdo e do tempo de site no ar, e a gente orienta você nos próximos passos."),
            ("Consigo atualizar o site sozinho?", "Sim. Trocar um texto, uma foto ou um horário não depende de programador. Na entrega mostramos como fazer."),
            ("O site funciona bem no celular?", "Sim. A maioria dos clientes abre o site pelo celular, então ele é pensado primeiro para a tela pequena e depois ajustado para tablet e computador."),
            ("Vocês atendem fora de Santo André?", "Sim. A base da Kivo fica em Santo André (SP), e o atendimento é online para todo o Brasil e também para o exterior."),
        ],
    },
    {
        "slug": "landing-page",
        "nome": "Landing page",
        "menu": "Landing pages",
        "icone": "ph-browser",
        "preco": None,
        "prazo": "Em média 15 dias",
        "title": "Criação de Landing Page para Anúncios e Campanhas | Kivo Digital",
        "description": "Landing page objetiva para divulgar um produto, uma campanha ou receber contatos de anúncios no Google e no Instagram. Orçamento fechado pelo WhatsApp.",
        "h1": ["Criação de landing page para ", "anúncios e campanhas"],
        "lead": "A Kivo Digital cria landing pages: uma página única e objetiva para divulgar um produto, uma campanha ou receber contatos vindos de anúncios no Google, no Instagram e no Facebook. Tudo leva para um único próximo passo, normalmente uma conversa no seu WhatsApp.",
        "wa": "Olá, Kivo! Vi a página de landing page e quero um orçamento.",
        "explica": [
            "Landing page é uma página feita para uma ação só. Em vez de mostrar tudo sobre o negócio, ela apresenta uma oferta e conduz a pessoa até o botão de contato.",
            "Ela é a melhor parceira de quem anuncia: o clique do anúncio cai numa página que fala exatamente daquilo que a pessoa viu, e isso costuma gerar mais contatos do que mandar o anúncio para o perfil do Instagram.",
        ],
        "incluso": [
            ("ph-browser", "Uma página focada", "Título, benefícios, prova e chamada para ação, na ordem certa para quem chega de um anúncio."),
            ("ph-whatsapp-logo", "Contato pelo WhatsApp", "Botões em vários pontos da página, com a mensagem já escrita para o cliente só enviar."),
            ("ph-magnifying-glass", "Pronta para anúncios", "Preparada para receber a medição do Google Analytics e do Pixel da Meta, com aviso de cookies."),
            ("ph-hard-drives", "Hospedagem e domínio", "No ar no endereço do seu negócio, com o cadeado de segurança ativo."),
        ],
        "para_quem": ["Lançamento de produto", "Promoções e datas especiais", "Captação de contatos", "Eventos e cursos", "Serviços com anúncio pago"],
        "para_quem_texto": "Serve para quem tem uma oferta específica e quer transformar visitas em contatos. Se o objetivo é apresentar o negócio inteiro e aparecer no Google para vários serviços, um <a href=\"/criacao-de-sites/\">site profissional</a> é mais indicado.",
        "faq": [
            ("Qual a diferença entre landing page e site?", "O site apresenta o negócio inteiro, com várias páginas. A landing page é uma página só, focada em uma oferta e em uma ação, como chamar no WhatsApp. Muitos negócios usam as duas: o site para o Google e a landing page para os anúncios."),
            ("Quanto custa uma landing page?", "O valor depende do conteúdo e dos recursos da página. Você conta a sua oferta pelo WhatsApp e recebe o orçamento com valor e prazo fechados por escrito."),
            ("Em quanto tempo a landing page fica pronta?", "Em média 15 dias. O prazo exato vem por escrito no orçamento, junto com o valor."),
            ("A landing page funciona com anúncios do Google e do Instagram?", "Sim. Ela é feita para receber o tráfego dos anúncios e pode ter a medição do Google Analytics e do Pixel da Meta, ativada só com o consentimento do visitante."),
            ("Dá para mudar a oferta depois?", "Sim. Textos, preços e imagens podem ser atualizados quando a campanha mudar."),
        ],
    },
    {
        "slug": "loja-virtual",
        "nome": "Loja virtual",
        "menu": "Loja virtual",
        "icone": "ph-storefront",
        "preco": None,
        "prazo": "Em média 15 dias",
        "title": "Criação de Loja Virtual para Pequenos Negócios | Kivo Digital",
        "description": "Loja virtual feita do zero para pequenos negócios venderem pela internet: catálogo com fotos e preços, carrinho e pagamento com Pix e cartões. Orçamento fechado.",
        "h1": ["Criação de loja virtual para ", "pequenos negócios"],
        "lead": "A Kivo Digital cria lojas virtuais para pequenos negócios venderem pela internet: catálogo com fotos, tamanhos e preços, carrinho e pagamento com <strong>Pix e cartões</strong>. A loja é feita do zero, com a cara do seu negócio, e fica aberta 24 horas no seu próprio endereço.",
        "wa": "Olá, Kivo! Vi a página de loja virtual e quero um orçamento.",
        "explica": [
            "Uma loja virtual própria deixa o cliente escolher o produto, ver fotos e preços e comprar sem esperar alguém responder mensagem por mensagem.",
            "Para quem está começando, dá para ir por etapas: primeiro um catálogo com pedido pelo WhatsApp, depois o carrinho e o pagamento online quando as vendas crescerem.",
        ],
        "incluso": [
            ("ph-storefront", "Catálogo de produtos", "Fotos, descrição, tamanhos, variações e preços organizados por categoria."),
            ("ph-browser", "Carrinho e pagamento", "O cliente monta o pedido e paga com Pix ou cartão, ou envia o pedido pronto para o seu WhatsApp."),
            ("ph-magnifying-glass", "Produtos no Google", "Páginas de produto organizadas para o Google entender o que você vende."),
            ("ph-hard-drives", "Hospedagem e segurança", "Loja no ar no endereço do seu negócio, com o cadeado de segurança ativo."),
        ],
        "para_quem": ["Lojas de roupa e moda", "Ateliês", "Confeitarias e doces", "Artesanato", "Cosméticos", "Lojas de bairro"],
        "para_quem_texto": "Serve para quem já vende pelo Instagram ou WhatsApp e quer organizar os pedidos e vender a qualquer hora. Se você trabalha com comida e pedidos do dia, o <a href=\"/cardapio-digital/\">cardápio digital</a> costuma ser mais simples e rápido.",
        "faq": [
            ("Quanto custa uma loja virtual?", "Depende da quantidade de produtos e de como o cliente vai pagar. Você conta como vende hoje pelo WhatsApp e recebe o orçamento com valor e prazo fechados por escrito."),
            ("Quais formas de pagamento a loja aceita?", "Pix e cartões. O pagamento é feito na própria loja, e o pedido chega organizado para você."),
            ("A loja é feita em alguma plataforma pronta?", "Não. A Kivo cria a loja do zero, com a identidade do seu negócio, no seu próprio endereço. Assim você não fica preso a mensalidade de plataforma nem a um modelo igual ao de outras lojas."),
            ("Em quanto tempo a loja fica pronta?", "Em média 15 dias. O prazo exato vem por escrito no orçamento e depende da quantidade de produtos."),
            ("Dá para começar só com catálogo e pedido no WhatsApp?", "Sim. É um bom começo para quem vende pouco por dia: o cliente monta o pedido no site e ele chega pronto no seu WhatsApp. O pagamento online pode entrar depois."),
            ("Eu mesmo consigo cadastrar produtos e mudar preços?", "Sim. Mostramos na entrega como incluir produtos, trocar fotos e atualizar preços."),
            ("A loja funciona no celular?", "Sim. A loja é pensada primeiro para o celular, que é onde a maior parte das compras acontece."),
        ],
    },
    {
        "slug": "cardapio-digital",
        "nome": "Cardápio digital",
        "menu": "Cardápio digital",
        "icone": "ph-fork-knife",
        "preco": None,
        "prazo": "Em média 15 dias",
        "title": "Cardápio Digital com Pedido pelo WhatsApp | Kivo Digital",
        "description": "Cardápio digital para restaurantes, lanchonetes, cafeterias e confeitarias, com fotos, preços e pedido direto pelo WhatsApp. Você mesmo atualiza os preços.",
        "h1": ["Cardápio digital com ", "pedido pelo WhatsApp"],
        "lead": "A Kivo Digital cria cardápios digitais para restaurantes, lanchonetes, cafeterias e confeitarias. O cliente vê o cardápio no celular, com fotos e preços, e manda o pedido pronto para o seu WhatsApp. Mudou um preço? Você mesmo atualiza.",
        "wa": "Olá, Kivo! Vi a página de cardápio digital e quero um orçamento.",
        "explica": [
            "O cardápio digital substitui o PDF e a foto do cardápio impresso. Ele abre rápido no celular, mostra cada prato com foto e preço, e organiza o pedido para o cliente.",
            "O pedido chega no seu WhatsApp já escrito, com os itens e as quantidades, sem precisar de aplicativo de entrega e sem taxa por pedido.",
        ],
        "incluso": [
            ("ph-fork-knife", "Cardápio com fotos", "Pratos, bebidas e adicionais organizados por categoria, com foto, descrição e preço."),
            ("ph-whatsapp-logo", "Pedido no WhatsApp", "O cliente monta o pedido e ele chega pronto na sua conversa, com itens e quantidades."),
            ("ph-browser", "Você atualiza", "Preços, pratos do dia e itens esgotados mudam na hora, sem reimprimir nada."),
            ("ph-hard-drives", "Link e domínio próprios", "Um endereço só seu para colocar no Instagram, no Google e nas mesas."),
        ],
        "para_quem": ["Restaurantes", "Lanchonetes", "Pizzarias", "Cafeterias e padarias", "Confeitarias", "Delivery"],
        "para_quem_texto": "Serve para quem recebe pedidos pelo WhatsApp e quer menos mensagens de ida e volta. Se você vende produtos com estoque, tamanhos e envio, a <a href=\"/loja-virtual/\">loja virtual</a> é mais completa.",
        "faq": [
            ("Quanto custa um cardápio digital?", "Depende da quantidade de itens e categorias. Você manda o seu cardápio atual pelo WhatsApp e recebe o orçamento com valor e prazo fechados por escrito."),
            ("Em quanto tempo o cardápio fica pronto?", "Em média 15 dias. O prazo exato vem por escrito no orçamento, junto com o valor."),
            ("Preciso pagar taxa por pedido?", "Não. O pedido vai direto para o seu WhatsApp, sem intermediário cobrando por pedido."),
            ("Dá para colocar o cardápio num QR code na mesa?", "Sim. O cardápio tem um link próprio, e esse link pode virar um QR code para as mesas, o balcão ou a embalagem."),
            ("Eu consigo mudar preços sozinho?", "Sim. Preços, itens do dia e produtos esgotados podem ser atualizados por você, e mostramos como na entrega."),
        ],
    },
]

PASSOS = [
    ("Conversa no WhatsApp", "Você conta como funciona o seu negócio e o que espera."),
    ("Orçamento fechado", "Você recebe o valor e o prazo por escrito antes de qualquer trabalho começar."),
    ("Criação e aprovação", "Montamos e mostramos para você antes de publicar. Ajustamos o que for preciso."),
    ("No ar", "Publicamos no seu endereço e mostramos como atualizar textos, fotos e preços."),
]

# --------------------------------------------------------------------------
# Peças reaproveitadas do index.html
# --------------------------------------------------------------------------
INDEX = (RAIZ / "index.html").read_text(encoding="utf-8")


def simbolos(ids):
    partes = []
    for i in ids:
        m = re.search(r'\s*<symbol id="%s".*?</symbol>' % re.escape(i), INDEX, re.S)
        if not m:
            raise SystemExit("Ícone não encontrado no index.html: " + i)
        partes.append(m.group(0).strip())
    return '<svg class="sprite" aria-hidden="true">\n  ' + "\n  ".join(partes) + "\n</svg>"


def bloco(inicio, fim):
    a = INDEX.index(inicio)
    b = INDEX.index(fim, a) + len(fim)
    return INDEX[a:b]


def tirar_i18n(s):
    return re.sub(r'\s+data-i18n(?:-[a-z-]+)?="[^"]*"', "", s)


def esc(t):
    return html.escape(t, quote=True)


def icone(i, tam=18, cls="icon"):
    return f'<svg class="{cls}" width="{tam}" height="{tam}" aria-hidden="true"><use href="#{i}"/></svg>'


def preco_txt(s):
    return f"A partir de R$ {s['preco']}" if s["preco"] else "Sob orçamento"


def prazo_txt(s):
    return s["prazo"] or "Combinado no orçamento"


def cabecalho():
    return f"""<header class="header">
  <nav class="nav" aria-label="Principal">
    <a class="nav__logo" href="/" aria-label="Kivo Digital, início">
      <img src="/assets/kivo-negativa.svg" alt="Kivo Digital">
    </a>
    <div class="nav__right">
      <a class="nav__link" href="/#servicos">Serviços</a>
      <a class="nav__link" href="#como-funciona">Como funciona</a>
      <a class="nav__link" href="#perguntas">Perguntas</a>
      <a class="nav__link" href="/#contato">Contato</a>
      <a class="nav__cta js-wa-link" href="/#orcamento" target="_blank" rel="noopener" data-track="contact" data-track-method="whatsapp" data-track-local="menu">Pedir orçamento</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu-mobile" aria-label="Abrir menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>
  <div class="mobile-menu" id="menu-mobile">
    <a class="mobile-menu__link" href="/#servicos">Serviços</a>
    <a class="mobile-menu__link" href="#como-funciona">Como funciona</a>
    <a class="mobile-menu__link" href="#perguntas">Perguntas</a>
    <a class="mobile-menu__link" href="/#contato">Contato</a>
    <a class="mobile-menu__cta js-wa-link" href="/#orcamento" target="_blank" rel="noopener" data-track="contact" data-track-method="whatsapp" data-track-local="menu_celular">Pedir orçamento</a>
  </div>
  <div class="progress" aria-hidden="true"><span class="progress__bar"></span></div>
</header>"""


def rodape():
    r = bloco('<footer class="footer">', "</footer>")
    r = tirar_i18n(r)
    r = r.replace('href="#servicos"', 'href="/#servicos"').replace('href="#avaliacoes"', 'href="/#avaliacoes"')
    r = r.replace('href="#orcamento"', 'href="/#orcamento"').replace('href="#contato"', 'href="/#contato"')
    r = r.replace('href="#como-funciona"', 'href="/#como-funciona"').replace('href="#perguntas"', 'href="/#perguntas"')
    r = r.replace('    <!-- Cidade: troque o texto abaixo quando quiserem mostrar a cidade (ex.: "São Paulo, SP") -->\n', "")
    links = "\n".join(f'          <li><a href="/{s["slug"]}/">{esc(s["nome"])}</a></li>' for s in SERVICOS)
    servicos_col = f"""      <nav class="footer__col" aria-labelledby="rodape-servicos">
        <p class="footer__heading" id="rodape-servicos">Serviços</p>
        <ul class="footer__list">
{links}
        </ul>
      </nav>
"""
    # Troca a coluna "Navegação" pela lista de serviços (mais útil nas páginas internas)
    r = re.sub(r'      <nav class="footer__col" aria-labelledby="rodape-navegacao">.*?</nav>\n', servicos_col, r, flags=re.S)
    return r


def fim_de_pagina():
    consent = re.search(r'<div class="consent".*?\n</div>', INDEX, re.S).group(0)
    consent = tirar_i18n(consent)
    flutuante = re.search(r'<a class="wa-float.*?</a>', INDEX, re.S).group(0)
    flutuante = tirar_i18n(flutuante)
    return consent + "\n\n" + flutuante


# --------------------------------------------------------------------------
# Dados estruturados
# --------------------------------------------------------------------------
def schema(s):
    url = f"{SITE}/{s['slug']}/"
    servico = {
        "@type": "Service",
        "@id": url + "#servico",
        "name": s["nome"],
        "serviceType": s["nome"],
        "description": s["description"],
        "url": url,
        "provider": {"@id": f"{SITE}/#empresa"},
        "areaServed": [
            {"@type": "City", "name": "Santo André"},
            {"@type": "AdministrativeArea", "name": "Grande ABC"},
            {"@type": "City", "name": "São Paulo"},
            {"@type": "Country", "name": "Brasil"},
        ],
        "availableChannel": {"@type": "ServiceChannel", "serviceUrl": url, "availableLanguage": ["pt-BR", "en"]},
    }
    if s["preco"]:
        servico["offers"] = {
            "@type": "Offer",
            "priceCurrency": "BRL",
            "priceSpecification": {"@type": "PriceSpecification", "minPrice": s["preco"], "priceCurrency": "BRL"},
        }
    grafo = [
        {
            "@type": "WebPage",
            "@id": url,
            "url": url,
            "name": s["title"],
            "description": s["description"],
            "inLanguage": "pt-BR",
            "isPartOf": {"@id": f"{SITE}/#site"},
            "about": {"@id": url + "#servico"},
            "breadcrumb": {"@id": url + "#trilha"},
        },
        servico,
        {
            "@type": "BreadcrumbList",
            "@id": url + "#trilha",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Início", "item": f"{SITE}/"},
                {"@type": "ListItem", "position": 2, "name": "Serviços", "item": f"{SITE}/#servicos"},
                {"@type": "ListItem", "position": 3, "name": s["nome"], "item": url},
            ],
        },
        {
            "@type": "FAQPage",
            "@id": url + "#perguntas",
            "inLanguage": "pt-BR",
            "mainEntity": [
                {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in s["faq"]
            ],
        },
    ]
    return json.dumps({"@context": "https://schema.org", "@graph": grafo}, ensure_ascii=False, indent=2)


# --------------------------------------------------------------------------
# Página
# --------------------------------------------------------------------------
def pagina(s):
    url = f"{SITE}/{s['slug']}/"
    icones = ["ph-arrow-right", "ph-plus", "ph-whatsapp-logo", "ph-envelope-simple", "ph-instagram-logo"]
    icones += [i for i, _, _ in s["incluso"]] + [o["icone"] for o in SERVICOS]
    icones = list(dict.fromkeys(icones))

    incluso = "\n".join(
        f"""          <li class="service rv">
            <span class="service__top"><span class="service__icon" aria-hidden="true">{icone(i, 26)}</span></span>
            <h3 class="card-title">{esc(t)}</h3>
            <p class="card-text">{esc(d)}</p>
          </li>"""
        for i, t, d in s["incluso"]
    )
    fits = "\n".join(f"          <li>{esc(p)}</li>" for p in s["para_quem"])
    explica = "\n".join(f"          <p>{esc(p)}</p>" for p in s["explica"])
    passos = "\n".join(
        f"""          <li class="step rv">
            <span class="step__num" aria-hidden="true">{n:02d}</span>
            <h3 class="card-title">{esc(t)}</h3>
            <p class="card-text">{esc(d)}</p>
          </li>"""
        for n, (t, d) in enumerate(PASSOS, 1)
    )
    faq = "\n".join(
        f"""          <div class="faq__item{' is-open' if n == 0 else ''}">
            <h3 class="faq__q"><button class="faq__btn" type="button" aria-expanded="{'true' if n == 0 else 'false'}" aria-controls="faq-{n}"><span>{esc(q)}</span><span class="faq__icon" aria-hidden="true">{icone('ph-plus', 16)}</span></button></h3>
            <p class="faq__a" id="faq-{n}"{'' if n == 0 else ' hidden'}>{esc(a)}</p>
          </div>"""
        for n, (q, a) in enumerate(s["faq"])
    )
    outros = "\n".join(
        f"""          <li><a class="other" href="/{o['slug']}/">
            <span class="other__name">{esc(o['nome'])}{icone('ph-arrow-right', 18)}</span>
            <span class="other__text">{esc(o['description'].split('. ')[0])}.</span>
          </a></li>"""
        for o in SERVICOS
        if o["slug"] != s["slug"]
    )
    h1a, h1b = s["h1"]
    wa = esc(s["wa"])

    return f"""<!DOCTYPE html>
<!-- ARQUIVO GERADO por _ferramentas/gerar-paginas.py. Não edite aqui: edite o gerador e rode de novo. -->
<html lang="pt-BR" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(s['title'])}</title>
<meta name="description" content="{esc(s['description'])}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Kivo Digital">
<meta property="og:locale" content="pt_BR">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{esc(s['title'].replace(' | Kivo Digital', ''))}">
<meta property="og:description" content="{esc(s['description'])}">
<meta property="og:image" content="{SITE}/assets/kivo-og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">

<script type="application/ld+json">
{schema(s)}
</script>

<meta name="theme-color" content="#050A1C">
<link rel="icon" href="/assets/kivo-avatar-lima.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;700&display=swap">
<link rel="stylesheet" href="/css/styles.css">
<link rel="stylesheet" href="/css/pagina.css">
<script src="/js/config.js" defer></script>
<script src="/js/tracking.js" defer></script>
<script src="/js/pagina.js" defer></script>
</head>
<body data-wa="{wa}">

{simbolos(icones)}

{cabecalho()}

<main id="topo">

  <section class="phero" aria-labelledby="titulo">
    <div class="hero__bg" aria-hidden="true">
      <div class="hero__floor"></div>
      <div class="hero__glow"></div>
    </div>
    <div class="phero__inner">
      <nav aria-label="Você está em">
        <ol class="crumbs">
          <li><a href="/">Início</a></li>
          <li><a href="/#servicos">Serviços</a></li>
          <li><span aria-current="page">{esc(s['nome'])}</span></li>
        </ol>
      </nav>
      <h1 class="phero__title" id="titulo">{esc(h1a)}<span class="accent">{esc(h1b)}</span><span class="cursor" aria-hidden="true"></span></h1>
      <p class="phero__lead">{s['lead']}</p>
      <div class="hero__ctas">
        <a class="btn btn--lime js-wa-link" href="/#orcamento" target="_blank" rel="noopener" data-track="contact" data-track-method="whatsapp" data-track-local="abertura">Pedir orçamento no WhatsApp {icone('ph-arrow-right')}</a>
        <a class="btn btn--ghost" href="#incluso">Ver o que está incluso</a>
      </div>
      <ul class="hero__promises">
        <li>Preço e prazo por escrito</li>
        <li>Pensado primeiro para o celular</li>
        <li>Suporte 24h no WhatsApp</li>
      </ul>
    </div>
  </section>

  <div class="sheet">

    <section class="section" id="resumo" aria-labelledby="resumo-titulo">
      <div class="section__inner">
        <div class="section__head rv">
          <p class="kicker"><span class="kicker__num">01</span><span>Resumo</span></p>
          <h2 class="section__title" id="resumo-titulo">O que é e <span class="accent">quanto custa</span></h2>
        </div>
        <div class="prose rv">
{explica}
        </div>
        <ul class="facts">
          <li class="fact fact--accent rv">
            <span class="fact__label">Investimento</span>
            <span class="fact__value">{esc(preco_txt(s))}</span>
            <span class="fact__note">Valor fechado por escrito antes de começar, sem cobrança extra no meio do caminho.</span>
          </li>
          <li class="fact rv">
            <span class="fact__label">Prazo</span>
            <span class="fact__value">{esc(prazo_txt(s))}</span>
            <span class="fact__note">Você sabe desde o início quando vai ficar pronto.</span>
          </li>
          <li class="fact rv">
            <span class="fact__label">Suporte</span>
            <span class="fact__value">24h no WhatsApp</span>
            <span class="fact__note">Primeira resposta em até 1 hora, com resumo de cada atendimento.</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="section" id="incluso" aria-labelledby="incluso-titulo">
      <div class="section__inner">
        <div class="section__head rv">
          <p class="kicker"><span class="kicker__num">02</span><span>Incluso</span></p>
          <h2 class="section__title" id="incluso-titulo">O que você <span class="accent">recebe</span></h2>
        </div>
        <ul class="services services--4">
{incluso}
        </ul>
      </div>
    </section>

    <section class="section" id="para-quem" aria-labelledby="para-quem-titulo">
      <div class="section__inner">
        <div class="section__head rv">
          <p class="kicker"><span class="kicker__num">03</span><span>Para quem é</span></p>
          <h2 class="section__title" id="para-quem-titulo">Feito para <span class="accent">pequenos negócios</span></h2>
          <p class="section__sub">{s['para_quem_texto']}</p>
        </div>
        <ul class="fits rv">
{fits}
        </ul>
      </div>
    </section>

    <section class="section" id="como-funciona" aria-labelledby="proc-titulo">
      <div class="section__inner">
        <div class="section__head rv">
          <p class="kicker"><span class="kicker__num">04</span><span>Como funciona</span></p>
          <h2 class="section__title" id="proc-titulo">Do primeiro oi ao <span class="accent">projeto no ar</span></h2>
          <p class="section__sub">Quatro etapas, e você acompanha cada uma delas.</p>
        </div>
        <ol class="steps steps--static">
{passos}
        </ol>
      </div>
    </section>

    <section class="section" id="perguntas" aria-labelledby="faq-titulo">
      <div class="section__inner section__inner--narrow">
        <div class="section__head rv">
          <p class="kicker"><span class="kicker__num">05</span><span>Perguntas</span></p>
          <h2 class="section__title" id="faq-titulo">Perguntas <span class="accent">frequentes</span></h2>
        </div>
        <div class="faq">
{faq}
        </div>
      </div>
    </section>

    <section class="section" id="pedir" aria-labelledby="cta-titulo">
      <div class="section__inner">
        <div class="cta-box rv">
          <div>
            <h2 class="cta-box__title" id="cta-titulo">Vamos colocar o seu negócio <span class="accent">no ar?</span></h2>
            <p class="cta-box__sub">Conte como funciona o seu negócio e receba o orçamento com valor e prazo fechados.</p>
          </div>
          <a class="btn btn--lime js-wa-link" href="/#orcamento" target="_blank" rel="noopener" data-track="contact" data-track-method="whatsapp" data-track-local="chamada_final">{icone('ph-whatsapp-logo', 20)} Chamar no WhatsApp</a>
        </div>
      </div>
    </section>

    <section class="section" id="outros" aria-labelledby="outros-titulo">
      <div class="section__inner">
        <div class="section__head rv">
          <p class="kicker"><span class="kicker__num">06</span><span>Outros serviços</span></p>
          <h2 class="section__title" id="outros-titulo">Veja também</h2>
        </div>
        <ul class="others">
{outros}
        </ul>
      </div>
    </section>

  </div>
</main>

{rodape()}

{fim_de_pagina()}

</body>
</html>
"""


def main():
    for s in SERVICOS:
        pasta = RAIZ / s["slug"]
        pasta.mkdir(exist_ok=True)
        (pasta / "index.html").write_text(pagina(s), encoding="utf-8")
        print("Gerado:", s["slug"] + "/index.html")


if __name__ == "__main__":
    main()
