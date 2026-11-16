<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/brand/banner-escuro.png">
    <img src="docs/assets/brand/banner-claro.png" alt="Emulador Report: reports de performance editados na própria página. Telas reais dos emuladores com dados fictícios." width="100%">
  </picture>
</p>

<p align="center">
  <b>Português</b> · <a href="README.en.md">English</a>
</p>

<p align="center">
  <a href="#demonstrações-em-vídeo">Vídeos</a> ·
  <a href="#galeria">Galeria</a> ·
  <a href="docs/demo/">Demonstração interativa</a> ·
  <a href="#arquitetura">Arquitetura</a> ·
  <a href="#minha-contribuição">Minha contribuição</a> ·
  <a href="#documentação">Documentação</a>
</p>

# Emulador Report

**O report mensal de performance de marketing, editado na própria página — e transformado em um e-mail executivo pronto para o Outlook. Sem código, sem instalar nada.**

Dois emuladores, um para **PF** e outro para **PJ**, que nasceram de uma necessidade real de comunicação de resultados: atualizar todo mês um report com campanhas, indicadores, peças e vídeos, manter a identidade de cada segmento e entregar um resumo que a liderança lê no e-mail.

> [!NOTE]
> **Demonstração fictícia:** este repositório utiliza imagens ilustrativas, campanhas fictícias, nomes demonstrativos e dados sintéticos exclusivamente para apresentar as funcionalidades do projeto. Nenhum dado exibido representa resultados reais, informações de clientes ou campanhas internas do Santander.
> Case de portfólio independente, sem vínculo institucional nem endosso do Santander. Detalhes em [avisos de dados, marca e licença](docs/disclaimer.md).

<p align="center">
  <img src="docs/assets/gifs/01-visao-geral.gif" alt="Gravação real: o Emulador Report PF abre o report fictício de abril e a página do mês vira o editor" width="100%">
</p>

## Em 30 segundos

| | |
|---|---|
| **O problema** | Um report mensal com a mesma estrutura, refeito todo mês, com regras de marca, limites do Outlook e dois segmentos com identidades diferentes. As primeiras versões eram HTML editado à mão. |
| **A resposta** | Um arquivo que abre no navegador e transforma a página do report no próprio editor: clicar, escrever, organizar, trocar imagens e vídeos, salvar um `.html` único e gerar o e-mail-resumo `.eml`. |
| **O diferencial** | Separar **conteúdo** (o time), **forma** (a marca e o layout) e **canal** (página e e-mail). Um motor, dois perfis (PF e PJ), nenhum número inventado pela ferramenta. |

## Sumário

1. [Contexto](#contexto)
2. [Dores e oportunidades](#dores-e-oportunidades)
3. [A solução](#a-solução)
4. [Os dois emuladores: PF e PJ](#os-dois-emuladores-pf-e-pj)
5. [Principais funcionalidades](#principais-funcionalidades)
6. [Galeria](#galeria)
7. [Demonstrações em vídeo](#demonstrações-em-vídeo)
8. [Como funciona](#como-funciona)
9. [Arquitetura](#arquitetura)
10. [Tecnologias](#tecnologias)
11. [Organização das pastas](#organização-das-pastas)
12. [Como executar](#como-executar)
13. [Documentação](#documentação)
14. [Minha contribuição](#minha-contribuição)
15. [Linha do tempo](#linha-do-tempo)
16. [Dados fictícios, marca e licença](#dados-fictícios-marca-e-licença)
17. [Status e próximos passos](#status-e-próximos-passos)

## Contexto

O projeto nasceu no contexto de uma experiência profissional em marketing, ligada às frentes **PF** (pessoa física) e **PJ** (empresas) do Santander. A necessidade era a de muitos times de marketing: **contar todo mês o que foi feito e o que funcionou** — campanhas, indicadores, peças, vídeos, aprendizados e próximos passos — para quem precisa decidir, num formato bonito, consistente e fácil de atualizar.

O report tinha dois destinos: uma **página completa** (com movimento, vídeos e peças no clique) e um **e-mail** (a porta de entrada, lido no Outlook). Quem atualizava não era desenvolvedor, e o ambiente era corporativo: nada de instalar programas.

## Dores e oportunidades

O que o projeto precisou resolver, segundo o histórico do repositório (versões, documentação e decisões registradas). A intensidade de cada dor não foi medida: a tabela mostra o que aparece documentado.

| Dor | Evidência no repositório | Oportunidade | O que a solução faz |
|---|---|---|---|
| Report refeito todo mês, com a mesma estrutura | Fluxo mensal em [`docs/COMO_ATUALIZAR_O_MES.md`](docs/COMO_ATUALIZAR_O_MES.md) | Reaproveitar o mês anterior | Abrir o report salvo e editar só o que mudou; modelo em branco para começar do zero |
| Edição técnica (HTML) | Versões 1.x e 2.x: "e-mail HTML editável à mão" ([CHANGELOG](CHANGELOG.md)) | Tirar o código do caminho | Edição na própria página: clicar e escrever, barra do item, Desfazer e Refazer |
| Consistência visual e regras de marca | Marca centralizada em [`config/marca.txt`](config/marca.txt); guia de tipografia | A ferramenta cuida da forma | Cores, fontes, símbolo e grade aplicados pelo motor; o time só mexe no conteúdo |
| Limites do Outlook | [`docs/OUTLOOK_COMPATIBILITY.md`](docs/OUTLOOK_COMPATIBILITY.md), correções de modo escuro (4.12.1) | E-mail que chega como a prévia | HTML de e-mail em tabelas e estilos em linha, modo escuro tratado, `.eml` pronto |
| Dois segmentos com identidades diferentes | Versões 5.0 a 5.4 (PJ) | Um sistema, dois perfis | Mesmo código, perfis PF e PJ; cada emulador só abre o seu segmento |
| Resumo executivo à parte | E-mail-resumo desde a 3.9; destaques escolhidos na 4.13 | Gerar o resumo da própria página | Até 4 destaques escolhidos do report, prévia e status em tempo real |
| Pessoas sem conhecimento técnico, sem instalação | [`docs/CORPORATE_SETUP.md`](docs/CORPORATE_SETUP.md) | Um arquivo, dois cliques | Emulador avulso (um `.html`) que abre no Chrome ou no Edge |
| Confiabilidade dos números | Regras do emulador em [`docs/operacao.md`](docs/operacao.md) | Ferramenta que não inventa | Não cria nem calcula número; indicador sem dado fica oculto |

<p align="center"><img src="docs/assets/diagrams/problema-oportunidade-solucao.svg" alt="Diagrama: desafios do report mensal, a oportunidade de separar conteúdo, forma e canal, e a solução com os emuladores PF e PJ" width="100%"></p>

## A solução

Os **emuladores** são ferramentas de criação e edição de reports de performance de marketing que funcionam inteiramente no navegador:

- **Criar e atualizar** o report do mês a partir do modelo em branco ou do mês anterior.
- **Editar visualmente**: textos, números, etiquetas de resultado, campanhas, destaques e aprendizados, direto na página.
- **Organizar**: novo item, arrastar com encaixe, mover para outra seção, mostrar, ocultar e reordenar seções.
- **Inserir mídia**: trocar imagens (reduzidas e recortadas no próprio navegador), colocar vídeos e links.
- **Visualizar antes de salvar**: computador e celular.
- **Gerar um report HTML único**, com imagens e vídeos embutidos.
- **Produzir o resumo executivo por e-mail** e exportar em **EML** para o Outlook.
- **Padronizar sem apagar a identidade** de cada segmento: PF e PJ compartilham o motor e mudam marca, seções e layout.
- **Ser usada por quem não programa**: um arquivo, sem instalação, sem servidor.

Cada item acima está verificado no código e nos testes: veja [`docs/features.md`](docs/features.md).

## Os dois emuladores: PF e PJ

| Emulador Report PF | Emulador Report PJ |
|---|---|
| <img src="docs/assets/screenshots/01-emulador-pf.webp" alt="Tela inicial do Emulador Report PF, com o aviso de demonstração" width="100%"> | <img src="docs/assets/screenshots/02-emulador-pj.webp" alt="Tela inicial do Emulador Report PJ, com o aviso de demonstração" width="100%"> |
| Página contínua; seções de lançamentos, qualidade criativa, laboratório e aprendizados | Layout com painéis; campanhas, indicadores, análises e funil nos principais resultados |

O **mesmo código** (`converter-html-eml.html`, `tools/motor.js` e `template/report.html`) atende os dois segmentos. Muda o perfil: marca, nomes de seção, modelo em branco e layout. O segmento fica gravado na página, e um emulador **não abre** o report do outro.

<p align="center"><img src="docs/assets/diagrams/estrutura-pf-pj.svg" alt="Diagrama: um código (emulador, motor e template) e dois perfis, PF e PJ" width="100%"></p>

## Principais funcionalidades

| Recurso | O que resolve |
|---|---|
| **Edição na própria página** | Clicar e escrever; o texto ganha contorno e vira campo editável. Sem formulário separado. |
| **Etiquetas de resultado** | Variação em verde ou âmbar, com **Tirar etiqueta** quando não vale no mês e **+ Etiqueta** para voltar. |
| **+ Novo item e + Novo tópico** | Itens novos entram com textos `[entre colchetes]`, na grade certa. |
| **Arrastar com encaixe** | Reordena pela linha de encaixe, inclusive para grupos compatíveis, sem quebrar o layout. |
| **Mover para outra seção** | Leva o item com textos e números para uma seção do mesmo tipo. |
| **Seções** | Ordem, visibilidade e posição ao lado da página. |
| **Imagens, vídeos e links** | Trocar imagem (com recorte e redução automáticos), colocar vídeo, imagem embaixo, + Link. |
| **Funil** | Principais resultados também como funil (cliques → leads → contas). |
| **Desfazer, Refazer e Recuperar** | A edição fica guardada no navegador (IndexedDB) até salvar. |
| **Importar conteúdo** | Cola blocos de texto estruturados (por exemplo, gerados com o Copilot corporativo a partir da biblioteca de prompts) e preenche os campos. |
| **Report `.html` único** | Imagens e vídeos dentro do arquivo; abre em qualquer navegador, no computador e no celular. |
| **E-mail-resumo `.eml`** | Até 4 destaques, link do report completo, prévia no computador e no celular, status em tempo real e exportação para o Outlook (mais o e-mail completo e uma imagem `.png` do resumo). |

Lista completa, com a evidência de cada recurso no código e nos testes: [`docs/features.md`](docs/features.md).

## Galeria

Capturas reais dos emuladores de demonstração (versão 5.6), com dados fictícios.

| | |
|---|---|
| <img src="docs/assets/screenshots/03-edicao-texto.webp" alt="Edição de texto na própria página"><br><sub>**Clique e escreva:** o texto vira campo editável na página.</sub> | <img src="docs/assets/screenshots/04-indicadores.webp" alt="Edição de indicadores e etiquetas"><br><sub>**Indicadores e etiquetas:** valor, variação, cor e referência.</sub> |
| <img src="docs/assets/screenshots/05-adicionar-item.webp" alt="Barra do item com Novo item, Arrastar e Mover"><br><sub>**Barra do item:** + Novo item, arrastar, mover, link, imagem.</sub> | <img src="docs/assets/screenshots/06-organizar.webp" alt="Mover para outra seção"><br><sub>**Organizar:** mover um item para outra seção do mesmo tipo.</sub> |
| <img src="docs/assets/screenshots/07-imagem-video.webp" alt="Barra da imagem com Trocar imagem e Colocar vídeo"><br><sub>**Imagens e vídeos:** trocar imagem, colocar vídeo.</sub> | <img src="docs/assets/screenshots/08-previa-celular.webp" alt="Prévia do report no celular dentro do emulador"><br><sub>**Prévia no celular** antes de salvar.</sub> |
| <img src="docs/assets/screenshots/09-report-html.webp" alt="Report HTML final"><br><sub>**O report final:** um arquivo HTML com tudo dentro.</sub> | <img src="docs/assets/screenshots/12-funil-pj.webp" alt="Principais resultados em funil no PJ"><br><sub>**PJ:** resultados como funil, com números coerentes.</sub> |
| <img src="docs/assets/screenshots/10-email-resumo.webp" alt="Seleção de destaques do e-mail-resumo e prévia"><br><sub>**E-mail-resumo:** até 4 destaques, com prévia ao lado.</sub> | <img src="docs/assets/screenshots/11-exportar-eml.webp" alt="Status e exportação do e-mail em EML"><br><sub>**Status e exportação** do `.eml` para o Outlook.</sub> |

<p align="center"><img src="docs/assets/screenshots/13-celular.webp" alt="Report de demonstração aberto no celular" width="260"><br><sub>O mesmo report no celular, em uma coluna.</sub></p>

## Demonstrações em vídeo

Gravações reais da interface (sem slides), com legendas na tela para assistir sem áudio. O GitHub não reproduz MP4 do repositório dentro do README: clique na imagem para abrir o arquivo, ou veja todos na [página de apresentação](docs/index.html) quando o GitHub Pages estiver ativo.

| | |
|---|---|
| [<img src="docs/assets/videos/overview.jpg" alt="Miniatura do vídeo de visão geral">](docs/assets/videos/overview.mp4)<br>**Visão geral** · 45 s · PF, celular, PJ, funil e e-mail | [<img src="docs/assets/videos/emuladores-pf-pj.jpg" alt="Miniatura do vídeo PF e PJ">](docs/assets/videos/emuladores-pf-pj.mp4)<br>**Os dois emuladores** · 26 s · PF e PJ lado a lado no tempo |
| [<img src="docs/assets/videos/workflow-report.jpg" alt="Miniatura do vídeo do fluxo de criação">](docs/assets/videos/workflow-report.mp4)<br>**Do modelo em branco ao arquivo salvo** · 78 s | [<img src="docs/assets/videos/email-summary.jpg" alt="Miniatura do vídeo do e-mail-resumo">](docs/assets/videos/email-summary.mp4)<br>**E-mail-resumo e .eml** · 34 s |

GIFs curtos:

| Edição | Organização | E-mail-resumo |
|---|---|---|
| <img src="docs/assets/gifs/02-edicao.gif" alt="GIF: edição de período, frase e indicadores" width="100%"> | <img src="docs/assets/gifs/03-organizacao.gif" alt="GIF: novo item, arrastar e mover para outra seção" width="100%"> | <img src="docs/assets/gifs/04-email-resumo.gif" alt="GIF: destaques, prévia e exportação do e-mail-resumo" width="100%"> |

## Como funciona

<p align="center"><img src="docs/assets/diagrams/fluxo-de-uso.svg" alt="Fluxo de uso em sete passos: abrir, editar, organizar, mídia, conferir, salvar e e-mail" width="100%"></p>

1. **Abrir** o emulador (um arquivo `.html`, dois cliques) e escolher o modelo em branco ou o report do mês anterior.
2. **Editar** campanhas, textos, números e etiquetas na própria página.
3. **Organizar** os itens e as seções: novo item, arrastar, mover, ordem e visibilidade.
4. **Inserir** imagens, vídeos e links.
5. **Conferir** no computador e no celular.
6. **Salvar** o report: um `.html` com tudo embutido.
7. **Gerar** o e-mail-resumo, escolher os destaques e baixar o `.eml`, que abre no Outlook.

Do report ao e-mail: [diagrama do fluxo de e-mail](docs/assets/diagrams/fluxo-do-email.svg). Do conteúdo à página: [diagrama da criação do report](docs/assets/diagrams/fluxo-do-report.svg).

## Arquitetura

Tudo roda **no navegador, a partir de um arquivo local**: não há servidor, banco de dados, API nem serviço externo. O Node.js só é usado por quem mantém a ferramenta, para montar os arquivos avulsos e rodar os testes.

<p align="center"><img src="docs/assets/diagrams/arquitetura.svg" alt="Diagrama de arquitetura: emulador, página do report em iframe, motor, modelos em branco e IndexedDB no navegador; saídas .html, .eml e .png; montagem e testes em Node.js" width="100%"></p>

| Componente | Papel |
|---|---|
| `converter-html-eml.html` | A interface do emulador: abrir, editar (a página do report num iframe), organizar, salvar, e-mail-resumo |
| `tools/motor.js` | O motor: lê os blocos de dados, aplica template e marca, confere pendências, gera o e-mail (`.eml`) e o modo escuro; perfis PF e PJ |
| `template/report.html` | O esqueleto da página do report (um só, para PF e PJ) |
| `config/marca*.txt` | Marca de cada segmento: cores, fontes, símbolo, regras de imagens e links |
| `tools/coringa*.js` | Os modelos em branco, embutidos no emulador |
| `tools/montar-avulso.js` | Monta o emulador avulso (um único `.html`, com motor e modelo dentro) |
| `tests/` | Testes de ponta a ponta (Playwright) e do motor (Node) |

Mais detalhes, com Mermaid e a relação entre os componentes: [`docs/architecture.md`](docs/architecture.md).

## Tecnologias

- **HTML, CSS e JavaScript**, sem framework e sem dependências no navegador.
- **Web APIs do navegador**: `contenteditable`, arrastar e soltar, Canvas (recorte e redução de imagens), File API, IndexedDB, Blob e download.
- **E-mail**: HTML compatível com Outlook (tabelas, estilos em linha, modo escuro) e geração de `.eml` (MIME) no próprio navegador.
- **Node.js** para montagem e manutenção; **Playwright** (Chromium) para testes de ponta a ponta e para as capturas e vídeos deste case; **ffmpeg** para os vídeos e GIFs.

## Organização das pastas

```text
.
├── README.md · README.en.md · CHANGELOG.md
├── converter-html-eml.html     interface do emulador (código-fonte)
├── gerar-report.html           gerador a partir dos arquivos de dados
├── template/report.html        esqueleto da página do report
├── config/                     marca de cada segmento (PF e PJ)
├── dados/                      modelos de dados e exemplos de treinamento (fictícios)
├── assets/                     marca, ícones, espaços de imagem e peças de exemplo
├── tools/
│   ├── motor.js                motor do report e do e-mail
│   ├── montar-avulso.js        monta os emuladores avulsos
│   ├── atualizar-coringa.js    regenera os modelos em branco
│   ├── guia/                   gera o guia operacional
│   └── portfolio/              build de demonstração, dados fictícios, mídia e diagramas deste case
├── kit/                        o que o time usava: emuladores, modelos e guias (versão de produção)
├── tests/                      testes de ponta a ponta e do motor
└── docs/
    ├── index.html              página de apresentação (GitHub Pages)
    ├── demo/                   emuladores e reports de demonstração (dados fictícios)
    ├── assets/                 marca do case, capturas, GIFs, vídeos, diagramas, fontes
    ├── overview.md · problem-and-solution.md · architecture.md · features.md
    ├── user-guide.md · benchmark.md · contribution.md · disclaimer.md · demo-data.md
    ├── audit/                  auditoria de publicação e relatório de testes
    └── operacao.md e demais    documentação operacional original do time
```

## Como executar

**Demonstração (sem instalar nada):** baixe o repositório e abra [`docs/demo/emulador-pf.html`](docs/demo/emulador-pf.html) ou [`docs/demo/emulador-pj.html`](docs/demo/emulador-pj.html) no Chrome ou no Edge. Use **Abrir um report salvo** e escolha `docs/demo/report-demo-pf.html` (ou `-pj`). Servida por http (GitHub Pages ou `python3 -m http.server --directory docs`), a página tem o botão **Abrir o report fictício de abril**.

**Manutenção** (Node.js 18+ e Playwright):

```bash
node tools/montar-avulso.js            # monta kit/emulador-report.html (PF)
node tools/montar-avulso.js pj         # monta kit/emulador-report-pj.html (PJ)
node tests/motor.test.js               # testes do motor
node tests/edicao.e2e.js               # um dos testes de ponta a ponta (Playwright)

# demonstração do portfólio (docs/demo/ e mídia)
node tools/portfolio/conferir-dados.js # confere as relações entre os números fictícios
node tools/portfolio/montar-demo.js    # build de demonstração com a marca do case
```

O passo a passo de cada script está em [`tools/portfolio/README.md`](tools/portfolio/README.md) e em [`tools/README.md`](tools/README.md).

## Documentação

| Documento | Conteúdo |
|---|---|
| [Visão geral](docs/overview.md) | O projeto em uma página |
| [Problema e solução](docs/problem-and-solution.md) | Dores, evidências, oportunidades e decisões |
| [Arquitetura](docs/architecture.md) | Componentes, fluxos e diagramas |
| [Funcionalidades](docs/features.md) | Cada recurso com a evidência no código e nos testes |
| [Guia de uso](docs/user-guide.md) | Como usar os emuladores, passo a passo |
| [Dados fictícios](docs/demo-data.md) | A base da demonstração e como os números foram calculados |
| [Benchmark](docs/benchmark.md) | 12 referências de apresentação e o que foi adaptado |
| [Contribuição](docs/contribution.md) | Meu papel no projeto |
| [Avisos](docs/disclaimer.md) | Dados fictícios, marca, propriedade intelectual e licença |
| [Auditoria de publicação](docs/audit/publication-audit.md) | Segurança, privacidade e o que pode ser publicado |
| [Relatório de testes](docs/audit/test-report.md) | O que foi testado e o resultado |
| [Documentação operacional](docs/operacao.md) | O README do time e os guias originais |

## Minha contribuição

Conduzi o projeto de ponta a ponta, como dono do produto: identifiquei a oportunidade no processo do report mensal, defini o que a ferramenta precisava fazer e para quem, e evoluí a solução versão a versão a partir do uso real.

- **Problema e requisitos:** traduzi a rotina do report (conteúdo, marca, Outlook, celular, dois segmentos) em requisitos e regras, como "a ferramenta não inventa número" e "indicador sem dado fica oculto".
- **Experiência de uso:** desenhei o fluxo de edição na própria página, para pessoas sem conhecimento técnico, e simplifiquei a interface a cada rodada de uso (por exemplo, a troca da aba Elementos pelo + Novo item na 5.6).
- **Produto PF e PJ:** levei o sistema de um segmento para dois, com o mesmo motor e identidades próprias.
- **Desenvolvimento com IA:** construí a solução com apoio de IA generativa (Claude Code): eu definia o problema, os critérios de aceite e as prioridades, revisava cada entrega e validava no uso real. O histórico registra 41 pull requests revisados e integrados por mim.
- **Qualidade e documentação:** testes automatizados, guia operacional, biblioteca de prompts para o Copilot corporativo e material de treinamento para o time.

Detalhes e evidências: [`docs/contribution.md`](docs/contribution.md).

**Competências demonstradas:** visão de produto · marketing e comunicação de resultados · dados e indicadores · experiência do usuário · organização de processos · automação · tecnologia e uso aplicado de IA.

## Linha do tempo

| Período | Marco |
|---|---|
| Out/2026 · 1.x–2.x | Report em HTML com vídeo; e-mail HTML editável à mão, pronto para o Outlook |
| Out/2026 · 3.x | Modelo reutilizável: dados do mês em texto + motor de geração; marca aplicada pelo sistema |
| Out/2026 · 4.0–4.2 | E-mail-resumo, versão interativa e campos editáveis identificados |
| Out/2026 · 4.3 | **O emulador vira o centro da operação:** edição na própria página |
| Out–Nov/2026 · 4.4–4.13 | Links e mídia em qualquer item, celular, desempenho, modo escuro, destaques escolhidos |
| Nov/2026 · 5.0–5.4 | **Emulador PJ**, esqueleto único de página, identidade do segmento, funil |
| Nov/2026 · 5.5–5.6 | Arrastar com encaixe, Refazer, + Novo item, etiqueta removível, mover entre seções |

São 42 entradas de versão no [CHANGELOG](CHANGELOG.md) em cerca de seis semanas (02/10 a 11/11/2026).

## Dados fictícios, marca e licença

- **Dados:** todas as telas, vídeos e GIFs deste case usam a base fictícia de [`docs/demo-data.md`](docs/demo-data.md), com relações conferidas automaticamente (CTR = cliques ÷ impressões, custo por conversão = investimento ÷ conversões, etapas do funil). Os materiais levam a marcação **DEMO · DADOS FICTÍCIOS**.
- **Marca:** a demonstração usa a identidade própria do case (não a do banco). O Santander é citado apenas para contextualizar a origem profissional do projeto. Este repositório **não** é uma publicação institucional, não é um produto oficial e não tem endosso do Santander.
- **Licença:** nenhuma licença de código aberto foi atribuída. A titularidade do código produzido em contexto profissional precisa ser confirmada antes de qualquer licenciamento ([auditoria](docs/audit/publication-audit.md)). As fontes da página de apresentação (Inter, Instrument Serif e JetBrains Mono) são SIL OFL.

## Status e próximos passos

- **Emuladores:** versão 5.6, estável; suíte de testes completa verde (veja o [relatório de testes](docs/audit/test-report.md)).
- **Publicação:** este repositório é **privado**. O histórico de commits contém materiais de trabalho que **não** podem ser publicados. Antes de qualquer publicação pública:
  - confirmar a autorização sobre o código;
  - publicar a partir de um repositório novo, sem o histórico ([auditoria](docs/audit/publication-audit.md)).
- **GitHub Pages:** a página está pronta em [`docs/index.html`](docs/index.html). A ativação depende da visibilidade e do plano da conta.

---

<sub>Emulador Report · case de portfólio · dados fictícios · sem vínculo institucional.</sub>
