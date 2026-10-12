# Mesmo resultado do gerar-en.ps1, para quem não tem PowerShell: python3 _ferramentas/gerar-en.py .
import re, sys, pathlib
raiz = pathlib.Path(sys.argv[1])
html = (raiz/'index.html').read_text(encoding='utf-8')
seo = (raiz/'_ferramentas'/'seo-en.html').read_text(encoding='utf-8').rstrip()
pad = re.compile(r'<!-- SEO:INICIO.*?<!-- SEO:FIM -->', re.S)
assert pad.search(html)
html = pad.sub(lambda m: seo, html, count=0)
antes = '<html lang="pt-BR" class="no-js">'
assert antes in html
html = html.replace(antes, '<html lang="en" class="no-js" data-page-lang="en">')
aviso = "<!-- ARQUIVO GERADO por _ferramentas/gerar-en.ps1 a partir do index.html. Não edite aqui: edite o index.html e rode o gerador. -->"
html = html.replace('<!DOCTYPE html>', '<!DOCTYPE html>\n' + aviso)
out = sys.argv[2] if len(sys.argv) > 2 else str(raiz/'en'/'index.html')
pathlib.Path(out).write_text(html, encoding='utf-8')
