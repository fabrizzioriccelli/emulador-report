# tools/portfolio

Scripts que produzem a apresentação do case: o build de demonstração, os dados e peças fictícios, as capturas, os vídeos, os GIFs, os diagramas e o banner. Nada aqui é usado pelo time no dia a dia, e nenhum script altera os arquivos de produção (`kit/`, `config/`, `tools/motor.js`…).

> [!NOTE]
> Tudo o que estes scripts produzem usa **dados fictícios** e a **identidade visual do case**. Veja [`docs/demo-data.md`](../../docs/demo-data.md) e [`docs/disclaimer.md`](../../docs/disclaimer.md).

## Requisitos

- Node.js 18+ com Playwright (Chromium)
- ffmpeg (vídeos e GIFs)
- Python 3 com Pillow (conversão das capturas para WebP)

## Ordem de execução

```bash
node tools/portfolio/conferir-dados.js      # 1. confere as 41 relações entre os números fictícios
node tools/portfolio/gerar-pecas.js         # 2. peças e vídeos fictícios → tools/portfolio/demo/assets/
node tools/portfolio/montar-demo.js         # 3. build de demonstração → docs/demo/ (com conferência da marca)

python3 -m http.server 8765 --directory docs &   # 4. servir docs/ (o botão do report fictício usa http)
node tools/portfolio/capturas.js            # 5. capturas → docs/assets/screenshots/
node tools/portfolio/gravar-demos.js        # 6. vídeos e GIFs → docs/assets/videos/ e docs/assets/gifs/
node tools/portfolio/gerar-banner.js        # 7. banner e prévia social → docs/assets/brand/
node tools/portfolio/gerar-diagramas.js     # 8. diagramas SVG → docs/assets/diagrams/
node tools/portfolio/conferir-links.js      # 9. confere links, imagens e âncoras do README e dos docs
```

## Arquivos

| Arquivo | O que faz |
|---|---|
| `demo/dados-demo-pf.txt`, `demo/dados-demo-pj.txt` | Reports fictícios no formato de blocos do motor |
| `demo/metricas.json` | Base numérica dos dados fictícios |
| `demo/assets/` | Peças e vídeos fictícios gerados por `gerar-pecas.js` |
| `conferir-dados.js` | Recalcula os indicadores a partir da base e compara com os arquivos de dados |
| `gerar-pecas.js` | Composições geométricas (sem pessoas, fotos ou marcas) com o selo "DEMO · DADOS FICTÍCIOS" |
| `montar-demo.js` | Copia o projeto para uma pasta de trabalho, aplica a marca do case e gera reports, modelos em branco e emuladores pelo caminho oficial (`gerar-report.html` e `montar-avulso.js`). Termina com uma conferência que falha se a marca original aparecer |
| `sessao.js` | Sessão de demonstração no Chromium: cursor, anel de clique, legendas, selo e gravação (screencast → MP4) |
| `capturas.js` | As 13 capturas da galeria, em 2× |
| `gravar-demos.js` | Os 4 vídeos e os 4 GIFs |
| `gerar-banner.js` | Banner claro e escuro do README e prévia social |
| `gerar-diagramas.js` | Os 7 diagramas SVG |
| `conferir-links.js` | Conferência de links, imagens e âncoras |

## Limitações conhecidas

- As janelas do sistema (Explorador de Arquivos, Salvar, caixa de texto do link) não aparecem nas gravações, porque o Chromium sem janela não as desenha. As legendas dizem o que se faz nelas.
- O cursor e o anel de clique são desenhados por cima da página, para quem assiste: o Chromium sem janela não mostra o mouse.
- Na gravação do fluxo, a janela "Salvar" foi substituída por uma resposta automática. O salvamento real em disco é coberto pelos testes do emulador (`tests/emulador.e2e.js`).
