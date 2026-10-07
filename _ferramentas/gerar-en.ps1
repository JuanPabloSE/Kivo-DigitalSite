# ==========================================================================
# Gera en/index.html (a versão em inglês que o Google indexa) a partir do index.html.
#
# QUANDO RODAR: sempre que mudar o index.html, antes do commit.
#   pwsh -NoProfile -File _ferramentas/gerar-en.ps1
#
# O que ele faz: copia o index.html, troca o bloco entre <!-- SEO:INICIO --> e
# <!-- SEO:FIM --> pelo conteúdo de _ferramentas/seo-en.html e marca a página
# como inglês (lang="en" e data-page-lang="en"). Os textos da página em inglês
# continuam vindo de js/i18n.js, aplicados pelo main.js.
# ==========================================================================
$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent $PSScriptRoot
$enc  = New-Object System.Text.UTF8Encoding $false

$html  = [IO.File]::ReadAllText((Join-Path $raiz 'index.html'))
$seoEn = [IO.File]::ReadAllText((Join-Path $PSScriptRoot 'seo-en.html')).TrimEnd()

$padrao = '(?s)<!-- SEO:INICIO.*?<!-- SEO:FIM -->'
if (-not [regex]::IsMatch($html, $padrao)) { throw 'Marcadores SEO:INICIO / SEO:FIM não encontrados no index.html' }
$html = [regex]::Replace($html, $padrao, { param($m) $seoEn })

$antes = '<html lang="pt-BR" class="no-js">'
if (-not $html.Contains($antes)) { throw "Tag <html> esperada não encontrada: $antes" }
$html = $html.Replace($antes, '<html lang="en" class="no-js" data-page-lang="en">')

$aviso = "<!-- ARQUIVO GERADO por _ferramentas/gerar-en.ps1 a partir do index.html. Não edite aqui: edite o index.html e rode o gerador. -->`n"
$html = $html.Replace('<!DOCTYPE html>', "<!DOCTYPE html>`n" + $aviso.TrimEnd())

$pasta = Join-Path $raiz 'en'
New-Item -ItemType Directory -Force $pasta | Out-Null
[IO.File]::WriteAllText((Join-Path $pasta 'index.html'), $html, $enc)
Write-Host "Gerado: en/index.html"
