# Funcionalidades

Todas as funcionalidades abaixo **existem na versão 5.6** e estão verificadas em duas fontes: o código e os testes automatizados (pasta [`tests/`](../tests/), resultado em [`audit/test-report.md`](audit/test-report.md)). Este documento não lista nada que não esteja no código.

> [!NOTE]
> As capturas citadas usam o build de demonstração (identidade do case e dados fictícios). O build de produção do time (`kit/`) tem as mesmas funções.

## Abrir e recomeçar

| Recurso | Como funciona | Evidência |
|---|---|---|
| Emulador avulso | Um único `.html` (cerca de 1,1 MB), com o motor e o modelo em branco dentro. Abre no Chrome ou no Edge, em qualquer pasta, sem instalação | `tools/montar-avulso.js`, `kit/emulador-report*.html` |
| Modelo em branco | Todas as seções, com textos `[entre colchetes]` e números em `X` para trocar | `tools/coringa*.js`, `tests/emulador.e2e.js` |
| Abrir um report salvo | O report do mês anterior (`.html`) abre para editar ou só para gerar o e-mail. Também dá para arrastar o arquivo para a página | `tests/emulador.e2e.js`, `tests/pj.e2e.js` |
| Segmento protegido | O emulador PF não altera um report PJ, e o PJ não altera um PF: avisa e não mexe em nada | `tests/pj.e2e.js` |
| Recuperar a edição | A edição fica guardada no navegador (IndexedDB) até salvar; ao reabrir, o emulador oferece **Recuperar a edição** | `converter-html-eml.html` (IndexedDB) |

## Editar na página

| Recurso | Como funciona | Evidência |
|---|---|---|
| Clique e escreva | O texto ganha contorno; clicar transforma em campo editável. Enter termina | `tests/emulador.e2e.js` · captura 03 |
| Período em todos os lugares | Trocar o mês atualiza o período onde ele aparece | `tests/emulador.e2e.js` |
| Indicadores | Valor, nome, variação e referência de cada número | `tests/emulador.e2e.js` · captura 04 |
| Etiquetas de resultado | Cor verde ou âmbar; **Tirar etiqueta** quando não vale; **+ Etiqueta** para pôr de volta | `tests/edicao.e2e.js` |
| Desfazer e Refazer | Botões e atalhos (Ctrl+Z, Ctrl+Y fora de um texto) | `tests/edicao.e2e.js`, `tests/emulador-extras.e2e.js` |
| Importar conteúdo | Cola blocos de texto estruturados (`[NUMERO 1]`, `valor: …`) e preenche os campos existentes, listando o que ficou de fora | `docs/PROMPTS_COPILOT.md`, botão **Importar conteúdo (Copilot)** |
| "O que aprendemos" | Um aprendizado curto dentro de cada campanha, que pode ser posto ou tirado | `tests/aprendizado.e2e.js` |

## Organizar

| Recurso | Como funciona | Evidência |
|---|---|---|
| **+ Novo item** | Na barra do item: um item igual entra logo depois, com textos para trocar | `tests/edicao.e2e.js` · captura 05 |
| **+ Adicionar item** (assistente) | Tipo › onde entra › conteúdo › prévia na página › confirmar | `tests/assistente.e2e.js` |
| **+ Novo tópico** | Uma seção nova com o nome e o layout escolhidos | `tests/emulador-extras.e2e.js` |
| Arrastar com encaixe | Segurar **⠿ Arrastar** e soltar na linha de encaixe, no mesmo grupo ou num grupo compatível | `tests/edicao.e2e.js` · GIF 03 |
| Mover para outra seção | Leva o item com textos e números para uma seção do mesmo tipo | `tests/edicao.e2e.js` · captura 06 |
| Seções | Ordem (↑ ↓, posição, arrastar a alça), mostrar e ocultar, ao lado da página | `tests/grade.e2e.js`, `tests/emulador.e2e.js` |
| Grade sempre íntegra | A cada passo de adicionar, tirar, ocultar e mostrar, a grade é medida no computador e no celular | `tests/grade.e2e.js` (97 passos medidos) |

## Imagens, vídeos e links

| Recurso | Como funciona | Evidência |
|---|---|---|
| Trocar imagem | Abre o Explorador de Arquivos; a imagem é recortada e reduzida no próprio navegador | `tests/emulador.e2e.js`, `tests/leveza.e2e.js` · captura 07 |
| Colocar vídeo | Vídeo no card, com capa e reprodução no clique no report | `tests/leveza.e2e.js` · vídeo do fluxo |
| Imagem embaixo | A peça da visão geral pode ir para baixo do texto | `tests/funil.e2e.js` |
| + Link e + Imagem em qualquer item | Até 3 imagens por item, links com texto, e opção de tirar | `tests/emulador-extras.e2e.js` |
| Arquivos leves | Imagens pesadas viram JPEG no tamanho de uso; vídeo pesado é otimizado; o trabalho pesado roda num Web Worker | `tests/leveza.e2e.js`, `tests/trabalhador.test.js` |
| Desempenho | Report pesado (~27 MB) aberto, editado e salvo com a CPU 4× mais lenta | `tests/desempenho.e2e.js` |

## Ver e salvar

| Recurso | Como funciona | Evidência |
|---|---|---|
| Prévia Computador e Celular | A página do report no tamanho do computador ou do celular, antes de salvar | `tests/celular.e2e.js` · captura 08 |
| Celular com conteúdo longo | Valores e títulos longos sem rolagem lateral, de 320 a 700 px | `tests/celular.e2e.js` |
| Salvar report | Um `.html` só, com imagens e vídeos embutidos (base64), nome `report-AAAA-MM.html` | `tests/emulador.e2e.js` · captura 09 |
| Movimento no report | Barra de leitura, seções aparecendo ao rolar, números contando | `tests/movimento.e2e.js` |
| Funil | Principais resultados como funil (degraus, nome e total) | `tests/funil.e2e.js` · captura 12 |
| Barras que não somem | As barras flutuantes não trocam no caminho do mouse até o botão | `tests/barras.e2e.js` |

## E-mail-resumo

| Recurso | Como funciona | Evidência |
|---|---|---|
| Destaques escolhidos | Sugestão automática (os principais resultados); tirar, incluir, ordenar e editar até 4 destaques | `tests/resumo.e2e.js` · captura 10 |
| Link do report completo | Qualquer link: arquivo da pasta, OneDrive, SharePoint ou web | `tests/emulador.e2e.js` |
| Prévia | Computador e celular, lado a lado com os passos | `tests/resumo.e2e.js` |
| Status em tempo real | Cada etapa conferida; o download libera quando está tudo certo | captura 11 |
| `.eml` para o Outlook | E-mail-resumo, e-mail completo (opcional) e imagem `.png` do resumo | `tests/resumo.e2e.js`, `tests/ferramenta.e2e.js` |
| Modo escuro | O e-mail continua legível no modo escuro do sistema e do Outlook | `tests/escuro.e2e.js` |

## Regras que a ferramenta segue

- Não cria nem calcula número. O que está na página é o que a pessoa escreveu.
- Indicador sem dado fica oculto: nunca aparece 0 nem o número do mês anterior.
- Ao mudar o período de um report antigo, o emulador lista o que ainda é do mês anterior.
- Cada emulador só altera reports do seu segmento.

## O que a ferramenta não faz

- Não envia e-mail: o `.eml` abre no Outlook de quem envia.
- Não se conecta a fontes de dados, painéis ou APIs: os números entram pela pessoa (na página ou pela importação de blocos).
- Não usa inteligência artificial dentro do emulador. A IA aparece no processo, fora dele: na biblioteca de prompts para o Copilot corporativo, que ajuda a estruturar o conteúdo antes da importação, e no desenvolvimento do código (veja [`contribution.md`](contribution.md)).
