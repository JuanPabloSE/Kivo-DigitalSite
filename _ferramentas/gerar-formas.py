# ==========================================================================
# Gera css/formas.css: as figuras "em pedaços" da abertura do site.
#
# QUANDO RODAR: só se mudar alguma figura aqui embaixo.
#   python3 _ferramentas/gerar-formas.py
#
# Como funciona: cada figura (o k_ da Kivo, a xícara, a sacola...) é desenhada
# com polígonos numa área de 100 x 100. O script corta tudo em triângulos e
# deixa todas as figuras com o mesmo número de pedaços (PECAS). No site, cada
# pedaço é um <span> recortado com clip-path; ao trocar a figura, o CSS anima
# cada triângulo até a nova posição e cor (ideia do species-in-pieces.com).
# ==========================================================================
import math
import os
import random

PECAS = 32

# Paleta (mesmas cores do :root em css/styles.css)
BRANCO = '#F5F7FA'
AZUL_50 = '#EEF3FF'
AZUL_100 = '#DCE6FF'
AZUL_200 = '#B9CDFF'
AZUL_300 = '#8DAEFF'
AZUL_400 = '#5B8CFF'
AZUL_500 = '#2F6BFF'
AZUL_600 = '#1F55E6'
AZUL_700 = '#1741B8'
LIMA_300 = '#DDF98A'
LIMA_500 = '#C6F432'
LIMA_700 = '#9BC21F'
ROXO_500 = '#7C5CFF'


# --------------------------------------------------------------------------
# Geometria
# --------------------------------------------------------------------------
def area2(a, b, c):
    return (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])


def triangular(poly):
    """Corta um polígono simples (sem buracos) em triângulos (ear clipping)."""
    pts = list(poly)
    if sum(area2(pts[0], pts[i], pts[i + 1]) for i in range(1, len(pts) - 1)) < 0:
        pts.reverse()
    tris = []
    while len(pts) > 3:
        for i in range(len(pts)):
            a, b, c = pts[i - 1], pts[i], pts[(i + 1) % len(pts)]
            if area2(a, b, c) <= 0:
                continue
            if any(p not in (a, b, c) and dentro(p, a, b, c) for p in pts):
                continue
            tris.append((a, b, c))
            pts.pop(i)
            break
        else:
            raise ValueError('polígono inválido')
    tris.append(tuple(pts))
    return tris


def dentro(p, a, b, c):
    return area2(a, b, p) >= 0 and area2(b, c, p) >= 0 and area2(c, a, p) >= 0


def anel(cx, cy, r_ext, r_int, a0, a1, n):
    """Anel (ou arco de anel) entre dois círculos, em 2n triângulos."""
    tris = []
    for i in range(n):
        t0 = math.radians(a0 + (a1 - a0) * i / n)
        t1 = math.radians(a0 + (a1 - a0) * (i + 1) / n)
        e0 = (cx + r_ext * math.cos(t0), cy + r_ext * math.sin(t0))
        e1 = (cx + r_ext * math.cos(t1), cy + r_ext * math.sin(t1))
        i0 = (cx + r_int * math.cos(t0), cy + r_int * math.sin(t0))
        i1 = (cx + r_int * math.cos(t1), cy + r_int * math.sin(t1))
        tris += [(e0, e1, i1), (e0, i1, i0)]
    return tris


def faixa(pontos, larg0, larg1):
    """Faixa que segue uma linha, afinando de larg0 até larg1."""
    tris = []
    n = len(pontos) - 1
    lados = []
    for i, p in enumerate(pontos):
        antes, depois = pontos[max(i - 1, 0)], pontos[min(i + 1, n)]
        dx, dy = depois[0] - antes[0], depois[1] - antes[1]
        d = math.hypot(dx, dy) or 1
        w = (larg0 + (larg1 - larg0) * i / n) / 2
        nx, ny = -dy / d * w, dx / d * w
        lados.append(((p[0] + nx, p[1] + ny), (p[0] - nx, p[1] - ny)))
    for i in range(n):
        (a, b), (c, d) = lados[i], lados[i + 1]
        tris += [(a, c, d), (a, d, b)]
    return tris


def ret(x0, y0, x1, y1):
    return [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]


def girar(tris, cx, cy, graus):
    t = math.radians(graus)
    c, s = math.cos(t), math.sin(t)
    return [tuple((cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c) for x, y in tri) for tri in tris]


# --------------------------------------------------------------------------
# Figuras: lista de (camada, cor, triângulos). Camadas maiores ficam por cima.
# --------------------------------------------------------------------------
def fig_kivo():
    # Contorno do "k" e do "_" tirados de assets/kivo-avatar-lima.svg
    s = 84 / 805
    def m(x, y):
        return (8 + (x - 70) * s, 13.5 + (y + 700) * s)
    def poly(pts):
        return triangular([m(*p) for p in pts])
    return [
        (0, BRANCO, poly([(70, -700), (196, -700), (196, -350), (70, -350)])),
        (0, AZUL_100, poly([(70, -350), (196, -350), (196, 0), (70, 0)])),
        (0, AZUL_50, poly([(196, -313), (214, -313), (313, -256), (214, -197), (196, -197)])),
        (0, AZUL_200, poly([(214, -313), (378, -496), (542, -496), (313, -256)])),
        (0, AZUL_300, poly([(313, -256), (550, 0), (388, 0), (214, -197)])),
        (1, LIMA_500, poly([(595, -78), (875, -78), (875, 0), (595, 0)])),
    ]


def fig_cafe():
    return [
        (0, AZUL_500, triangular([(22, 40), (70, 40), (64, 80), (28, 80)])),
        (1, AZUL_300, triangular([(19, 34), (73, 34), (71, 41), (21, 41)])),
        (0, AZUL_400, anel(67, 56, 14, 8, -80, 80, 4)),
        (2, BRANCO, triangular([(10, 81), (84, 81), (77, 89), (17, 89)])),
        (2, LIMA_500, faixa([(36, 29), (32, 22), (37, 14), (33, 6)], 4.4, 2.2)),
        (2, LIMA_300, faixa([(52, 29), (48, 22), (53, 14), (49, 6)], 4.4, 2.2)),
    ]


def fig_loja():
    return [
        (0, AZUL_600, triangular([(18, 44), (82, 44), (86, 90), (14, 90)])),
        (1, AZUL_400, triangular([(18, 36), (82, 36), (82, 44), (18, 44)])),
        (0, LIMA_500, anel(50, 36, 17, 11, 180, 360, 6)),
        (2, LIMA_500, triangular(ret(41, 66, 59, 71))),
    ]


def fig_salao():
    return [
        (0, BRANCO, faixa([(41, 66), (73, 7)], 7.5, 1.2)),
        (1, AZUL_100, faixa([(59, 66), (27, 7)], 7.5, 1.2)),
        (2, AZUL_400, anel(33, 77, 13, 7.5, 0, 360, 6)),
        (2, AZUL_500, anel(67, 77, 13, 7.5, 0, 360, 6)),
        (3, LIMA_500, triangular([(47, 50), (50, 47), (53, 50), (50, 53)])),
    ]


def fig_clinica():
    coracao = [(50, 90), (30, 72), (14, 55), (8, 40), (11, 25), (22, 14), (36, 13), (46, 20),
               (50, 27), (54, 20), (64, 13), (78, 14), (89, 25), (92, 40), (86, 55), (70, 72)]
    return [
        (0, AZUL_500, triangular(coracao)),
        (1, BRANCO, triangular(ret(44.5, 32, 55.5, 66))),
        (2, BRANCO, triangular(ret(33, 43.5, 67, 54.5))),
    ]


def fig_local():
    cx, cy, r = 50, 38, 27
    ponta = (50, 93)
    # Contorno da gota: arco do círculo por cima e duas retas até a ponta
    tang = math.degrees(math.acos(r / (ponta[1] - cy)))
    arco = [(cx + r * math.cos(math.radians(g)), cy + r * math.sin(math.radians(g)))
            for g in [90 + tang + (360 - 2 * tang) * k / 60 for k in range(61)]]
    contorno = [ponta] + arco
    def borda(graus):
        # Onde o raio que sai do centro encontra o contorno
        dx, dy = math.cos(math.radians(graus)), math.sin(math.radians(graus))
        melhor = None
        for i in range(len(contorno)):
            (ax, ay), (bx, by) = contorno[i], contorno[(i + 1) % len(contorno)]
            ex, ey = bx - ax, by - ay
            den = dx * ey - dy * ex
            if abs(den) < 1e-9:
                continue
            k = ((ax - cx) * ey - (ay - cy) * ex) / den
            u = ((ax - cx) * dy - (ay - cy) * dx) / den
            if k > 0 and -1e-9 <= u <= 1 + 1e-9 and (melhor is None or k < melhor):
                melhor = k
        return (cx + melhor * dx, cy + melhor * dy)
    n, r_int = 10, 10.5
    def interno(g):
        return (cx + r_int * math.cos(math.radians(g)), cy + r_int * math.sin(math.radians(g)))
    tris, centro = [], []
    for i in range(n):
        g0, g1 = 90 + 360 * i / n, 90 + 360 * (i + 1) / n
        e0, e1, i0, i1 = borda(g0), borda(g1), interno(g0), interno(g1)
        tris += [(e0, e1, i1), (e0, i1, i0)]
        centro.append(((cx, cy), i0, i1))
    return [
        (0, AZUL_500, tris),
        (1, LIMA_500, centro),
    ]


FIGURAS = {
    'kivo': fig_kivo,
    'cafe': fig_cafe,
    'loja': fig_loja,
    'salao': fig_salao,
    'clinica': fig_clinica,
    'local': fig_local,
}


# --------------------------------------------------------------------------
# Pedaços
# --------------------------------------------------------------------------
def tamanho(t):
    return abs(area2(*t)) / 2


def dividir(t):
    """Divide o triângulo no meio do lado mais comprido."""
    a, b, c = t
    lados = [(a, b, c), (b, c, a), (c, a, b)]
    p, q, r = max(lados, key=lambda l: math.dist(l[0], l[1]))
    m = ((p[0] + q[0]) / 2, (p[1] + q[1]) / 2)
    return (p, m, r), (m, q, r)


def tom(cor, ajuste):
    """Clareia (+) ou escurece (-) a cor um pouco, para dar o efeito facetado."""
    r, g, b = (int(cor[i:i + 2], 16) for i in (1, 3, 5))
    if ajuste >= 0:
        r, g, b = (round(v + (255 - v) * ajuste) for v in (r, g, b))
    else:
        r, g, b = (round(v * (1 + ajuste)) for v in (r, g, b))
    return '#%02X%02X%02X' % (r, g, b)


def pecas(nome):
    rnd = random.Random(nome)
    lista = []
    for camada, cor, tris in FIGURAS[nome]():
        for t in tris:
            if tamanho(t) > 0.01:
                lista.append([camada, cor, t])
    if len(lista) > PECAS:
        raise ValueError('%s tem %d pedaços (máximo %d)' % (nome, len(lista), PECAS))
    while len(lista) < PECAS:
        i = max(range(len(lista)), key=lambda k: tamanho(lista[k][2]))
        camada, cor, t = lista.pop(i)
        a, b = dividir(t)
        lista += [[camada, cor, a], [camada, cor, b]]
    # Ordem: camada (o que fica por cima vem depois) e ângulo em volta do centro
    def chave(p):
        cx = sum(v[0] for v in p[2]) / 3
        cy = sum(v[1] for v in p[2]) / 3
        return (p[0], math.atan2(cy - 50, cx - 50))
    lista.sort(key=chave)
    return [(tom(cor, rnd.uniform(-0.1, 0.12)), t) for _, cor, t in lista]


def espalhadas():
    """Estado inicial da animação de entrada: pedacinhos soltos pela área."""
    rnd = random.Random('kivo-intro')
    saida = []
    for i in range(PECAS):
        ang = rnd.uniform(0, 2 * math.pi)
        dist = rnd.uniform(30, 48)
        x, y = 50 + dist * math.cos(ang), 50 + dist * math.sin(ang)
        s = rnd.uniform(1.2, 2.6)
        rot = rnd.uniform(0, 2 * math.pi)
        t = tuple((x + s * math.cos(rot + k * 2.094), y + s * math.sin(rot + k * 2.094)) for k in range(3))
        saida.append((AZUL_300 if i % 3 else LIMA_500, t))
    return saida


def poligono(t):
    return 'polygon(' + ','.join('%s%% %s%%' % (fmt(x), fmt(y)) for x, y in t) + ')'


def fmt(v):
    return ('%.2f' % v).rstrip('0').rstrip('.')


def main():
    raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    linhas = [
        '/* ARQUIVO GERADO por _ferramentas/gerar-formas.py. Não edite aqui: edite o script e rode de novo. */',
        '/* Figuras da abertura feitas de %d triângulos (clip-path). A figura atual fica em data-shape no .morph. */' % PECAS,
        '',
    ]
    for i in range(PECAS):
        linhas.append('.morph__piece:nth-child(%d){--i:%d}' % (i + 1, i))
    linhas.append('')
    for i, (cor, t) in enumerate(espalhadas()):
        linhas.append('.morph[data-shape="intro"] .morph__piece:nth-child(%d){clip-path:%s;background-color:%s;opacity:0}' % (i + 1, poligono(t), cor))
    for nome in FIGURAS:
        linhas.append('')
        extra = ',.no-js .morph .morph__piece:nth-child(%d)' if nome == 'kivo' else ''
        for i, (cor, t) in enumerate(pecas(nome)):
            sel = '.morph[data-shape="%s"] .morph__piece:nth-child(%d)' % (nome, i + 1)
            if extra:
                sel += extra % (i + 1)
            # O k_ também é o que aparece sem JavaScript (por isso o opacity:1)
            linhas.append('%s{clip-path:%s;background-color:%s%s}' % (sel, poligono(t), cor, ';opacity:1' if extra else ''))
    with open(os.path.join(raiz, 'css', 'formas.css'), 'w', encoding='utf-8', newline='\n') as f:
        f.write('\n'.join(linhas) + '\n')
    print('Gerado: css/formas.css')


if __name__ == '__main__':
    main()
