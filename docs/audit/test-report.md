# Relatório de testes

**Data:** 16/11/2026 · **Versão dos emuladores:** 5.6 (2026-11-11) · **Ambiente:** Linux, Chromium do Playwright, Node.js 22, ffmpeg

O relatório separa o que foi **testado de fato** do que **não pôde ser testado** neste ambiente (seção 6).

## 1. Emuladores: suíte completa

Rodada na branch, com o código da versão 5.6, nos dois caminhos: o código-fonte (`converter-html-eml.html`) e o emulador avulso do kit (`kit/emulador-report*.html`). Todos os 28 grupos terminaram com código de saída 0 e **nenhuma falha**.

| Grupo | O que confere | Verificações ok | Kit |
|---|---|---|---|
| `motor.test.js` | Motor: blocos, template, conferência, e-mail | 81 | — |
| `trabalhador.test.js` | Web Worker: separar e juntar mídia em base64 | 10 | — |
| `emulador.e2e.js` | Caminho completo: modelo em branco → texto, número, etiqueta, imagem, link → salvar → e-mail | 57 | 57 |
| `emulador-extras.e2e.js` | + Link e + Imagem em qualquer item, + Novo tópico, Desfazer | 57 | 57 |
| `edicao.e2e.js` | 5.6: + Novo item, arrastar, mover para outra seção, etiqueta (PF e PJ) | 51 | 51 |
| `assistente.e2e.js` | + Adicionar item (assistente com prévia) | 48 | 48 |
| `pj.e2e.js` | Emulador PJ e proteção de segmento | 47 | — |
| `funil.e2e.js` | Funil e peça embaixo | 35 | — |
| `leveza.e2e.js` | Imagens e vídeos leves, prévia sem rolagem interna | 31 | 31 |
| `resumo.e2e.js` | E-mail-resumo com destaques escolhidos | 30 | 30 |
| `celular.e2e.js` | Conteúdo longo no celular (320 a 700 px) | 29 | 29 |
| `aprendizado.e2e.js` | "O que aprendemos" em cada campanha | 27 | 27 |
| `movimento.e2e.js` | Movimento na página | 18 | — |
| `escuro.e2e.js` | E-mail-resumo no modo escuro | 15 | — |
| `desempenho.e2e.js` | Report de ~27 MB com a CPU 4× mais lenta | 7 | 7 |
| `barras.e2e.js` | Barras flutuantes estáveis no caminho do mouse | 5 | — |
| `grade.e2e.js` | Grade medida a cada passo (computador e celular) | 97 passos, "tudo certo" | 97 passos |
| `ferramenta.e2e.js` | `gerar-report.html` em 390, 360 e 320 px | 3 larguras ok | — |

**Total:** 885 verificações "ok", mais as medições de grade e de largura. As saídas brutas ficaram fora do repositório, porque a pasta `tests/saida/` é ignorada pelo git.

## 2. Build de demonstração

| Teste | Resultado |
|---|---|
| Coerência dos dados fictícios (`conferir-dados.js`) | **41 de 41** relações ok (CTR, custo por conversão, taxas, funil, variações e textos que citam números) |
| Reports gerados pelo caminho oficial (`gerar-report.html`) | PF e PJ: "Tudo certo: nenhuma pendência" (versão final, não rascunho) |
| Conferência da marca (`montar-demo.js`) | Ok: os reports não têm termos da marca original; os emuladores não mostram a marca na tela, nos ícones nem nas fontes |
| Abrir a demonstração por http (botão "Abrir o report fictício") | PF e PJ: abre o editor, sem erros de página |
| Teste de fumaça do build final (PF e PJ) | Abrir o report fictício, editar a frase, + Novo item (3 → 4 lançamentos), salvar (`report-2099-04.html`), baixar o e-mail-resumo: `.eml` válido (MIME 1.0, 29.423 e 28.555 bytes), sem o nome da marca original; nenhum erro de página |
| Abrir pelo arquivo local (`file://`) | O botão explica que, aberto direto do computador, é preciso usar "Abrir um report salvo" (o navegador bloqueia a busca do arquivo) |

## 3. Interações gravadas (vídeos, GIFs e capturas)

Cada gravação é uma interação real com os emuladores de demonstração. O script falha se um passo não acontece.

| Fluxo | Conferido |
|---|---|
| Começar do modelo em branco | Editor aberto |
| Editar período, frase, nome da campanha, valor, nome, etiqueta e referência | Campos preenchidos na página |
| Trocar imagem (seletor de arquivo) e colocar vídeo | Mídia aplicada |
| + Novo item, arrastar até o fim do grupo, mover para "Também vem aí" | Itens reorganizados |
| Salvar report | Nome sugerido `report-2099-04.html` (a janela "Salvar" foi simulada na automação) |
| E-mail-resumo: link, tirar e incluir destaque, prévia no celular | Prévia atualizada |
| Baixar e-mail-resumo | `.eml` baixado de verdade: `report-2099-04-resumo.eml`, 31.795 bytes |
| Funil no PJ | "Ver como funil" e "Ver em colunas" |

## 4. Página de apresentação (`docs/index.html`)

| Teste | Resultado |
|---|---|
| Desktop 1440 × 900, celular 390 × 844, tema escuro, movimento reduzido | Sem erros de página, sem requisições falhando, sem rolagem lateral, todas as imagens carregadas e todo o conteúdo visível com `prefers-reduced-motion` |
| Vídeos | Os 4 MP4 carregam (45, 26, 78 e 34 s) |
| Acessibilidade automática (axe-core 4.10.2, WCAG 2.1 A e AA) | **0 violações** no tema claro e no escuro |

## 5. README e documentação

| Teste | Resultado |
|---|---|
| Links relativos, imagens e âncoras (`conferir-links.js`) | Ver a última execução abaixo |
| Varredura de termos sensíveis nos arquivos novos e alterados | Nenhuma ocorrência |
| Tamanho da mídia | Capturas 2,8 MB (WebP), GIFs 6,5 MB, vídeos 9,9 MB |

Última execução de `node tools/portfolio/conferir-links.js`: **311 links em 17 documentos, nenhum link relativo quebrado e nenhuma âncora faltando.** Os 12 links externos (as referências do benchmark) não foram acessados pelo verificador; os repositórios correspondentes foram consultados ao montar o benchmark (leitura do `README.md` público de cada um em 16/11/2026).

## 6. O que não foi testado aqui

- **Renderização no site do GitHub:** o repositório é privado e o ambiente não acessa o github.com pelo navegador. Os recursos usados (alertas `[!NOTE]`, `<picture>`, Mermaid, tabelas) são suportados pelo GitHub, mas não foram vistos renderizados.
- **GitHub Pages publicado:** a página foi testada servida localmente; o Pages não está ativo.
- **Outlook real:** o `.eml` foi gerado e baixado, mas não foi aberto num Outlook. A compatibilidade com o Outlook é coberta pelas regras e testes do motor, e o modo escuro por `escuro.e2e.js`.
- **Outros navegadores:** só Chromium; Edge, Firefox e Safari não foram testados nesta rodada.
- **Leitor de tela:** apenas a auditoria automática (axe-core), sem teste manual.
- **Máquina corporativa:** os emuladores de produção não foram testados no ambiente corporativo nesta rodada.
