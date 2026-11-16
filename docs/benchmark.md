# Benchmark de apresentação

Referências públicas usadas para desenhar a apresentação deste case. A escolha não seguiu número de estrelas: entraram projetos cujo README (ou página) **conta bem o produto** — posicionamento claro, demonstração visual cedo, documentação fácil de navegar.

> Consulta feita em 16/11/2026, lendo o `README.md` público de cada repositório (`raw.githubusercontent.com`). READMEs mudam com o tempo: as observações abaixo descrevem o que estava publicado nessa data.

**Como ler:** para cada referência, o que funciona e o que foi **adaptado** (nunca copiado) para cá. A identidade visual deste repositório é própria; o benchmark orientou estrutura, hierarquia e navegação.

---

## Visão geral

| # | Projeto | Área | O que tomamos como aprendizado |
|---|---|---|---|
| 1 | [Excalidraw](https://github.com/excalidraw/excalidraw) | Produtividade visual | Capa clicável com versão clara e escura; linha curta de navegação logo abaixo |
| 2 | [Supabase](https://github.com/supabase/supabase) | Plataforma SaaS | Diagrama de arquitetura com cada componente explicado em uma linha |
| 3 | [PostHog](https://github.com/PostHog/posthog) | Produto e analytics | Miniatura de vídeo que leva à demonstração; sumário no topo |
| 4 | [Plausible Analytics](https://github.com/plausible/analytics) | Dados | Valor em tópicos curtos, screenshot cedo e seção explícita de licença e marca |
| 5 | [Twenty](https://github.com/twentyhq/twenty) | SaaS (CRM) | Capa clara/escura e funcionalidades apresentadas com imagem própria |
| 6 | [tldraw](https://github.com/tldraw/tldraw) | Produtividade / SDK | "Feature highlights" no formato **recurso — explicação** |
| 7 | [Typst](https://github.com/typst/typst) | Ferramenta de documentos | Imagem de abertura mostrando entrada e resultado lado a lado |
| 8 | [Evidence](https://github.com/evidence-dev/evidence) | Dados / relatórios | Posicionamento em uma linha e "How it works" em três tópicos |
| 9 | [Metabase](https://github.com/metabase/metabase) | BI | Uma frase de valor e o screenshot do produto antes de qualquer instrução |
| 10 | [Maybe](https://github.com/maybe-finance/maybe) | Produto pessoal (finanças) | Alerta de status do projeto e regras de marca explícitas |
| 11 | [Appwrite](https://github.com/appwrite/appwrite) | Plataforma | Seletor de idioma no topo e sumário de seções |
| 12 | [brittanychiang.com v4](https://github.com/bchiang7/v4) | Portfólio pessoal | Evolução por versões e pedido claro de atribuição |

---

## 1. Excalidraw

- **O que torna a apresentação boa:** a primeira coisa que aparece é uma capa do produto, clicável, com versão para tema claro e escuro (`<picture>` com `prefers-color-scheme`). Logo abaixo, uma linha com quatro destinos: editor, blog, documentação e a versão paga.
- **Elementos visuais que funcionam:** capa larga, sem texto em excesso; navegação em uma linha.
- **Narrativa:** produto primeiro, depois funcionalidades, quick start e integrações ("quem usa").
- **Demonstração:** o próprio editor on-line é a demonstração (link direto).
- **Documentação:** fora do README, em site próprio, com o README apontando para ela.
- **O que adaptamos:** capa própria com variação clara/escura e uma linha de navegação curta (Demo · Vídeos · Documentação · Contribuição) logo abaixo do hero.

## 2. Supabase

- **O que torna a apresentação boa:** a seção "How it works" traz um diagrama de arquitetura em SVG e, embaixo, uma linha para cada componente explicando o papel dele.
- **Elementos visuais que funcionam:** logo com variante para tema claro/escuro (`#gh-light-mode-only`); lista de funcionalidades em formato de checklist, cada item com link para a documentação.
- **Narrativa:** o que é → o que já existe (checklist) → como funciona (arquitetura) → comunidade.
- **Demonstração:** documentação e plataforma hospedada.
- **Documentação:** cada funcionalidade aponta para a página específica.
- **O que adaptamos:** o diagrama de arquitetura deste case tem legenda por componente (`docs/architecture.md`), e cada funcionalidade em `docs/features.md` aponta para a evidência no código ou no teste.

## 3. PostHog

- **O que torna a apresentação boa:** logo, uma linha de links (docs, comunidade, roadmap) e uma **miniatura de vídeo** que leva para a demonstração, antes de qualquer texto técnico. Há um sumário ("Table of Contents") e uma seção que explica com transparência o que é aberto e o que é pago.
- **Elementos visuais que funcionam:** miniatura de vídeo como chamada principal.
- **Narrativa:** posicionamento → demonstração em vídeo → como começar → aprender mais.
- **Demonstração:** vídeo hospedado fora do GitHub, chamado por uma imagem.
- **Documentação:** sumário com âncoras.
- **O que adaptamos:** o README usa GIF curto inline e miniaturas que levam aos vídeos MP4 da página de apresentação; o sumário por âncoras abre o documento.

## 4. Plausible Analytics

- **O que torna a apresentação boa:** a proposta de valor vem em cinco tópicos curtos com links, seguida de um screenshot do dashboard. "Why Plausible?" explica o porquê antes do como. No fim, uma seção **License & Trademarks** separa o código da marca.
- **Elementos visuais que funcionam:** screenshot grande e limpo logo no início.
- **Narrativa:** o que é → por que existe → como começar → tecnologia → licença e marca.
- **Demonstração:** link "Live Demo" na primeira linha.
- **Documentação:** links para o site de docs em cada tópico.
- **O que adaptamos:** a ordem "por que existe antes de como funciona" e uma seção própria de **marca, dados e licença** (`docs/disclaimer.md`), visível a partir do README.

## 5. Twenty

- **O que torna a apresentação boa:** capa com versões clara e escura, tagline centralizada e seções de funcionalidades em que cada recurso tem a sua imagem.
- **Elementos visuais que funcionam:** muitas imagens, todas do mesmo sistema visual; ícones pequenos e consistentes nos links.
- **Narrativa:** por que existe → instalação → funcionalidades com imagem → stack.
- **Demonstração:** imagens de cada tela.
- **Documentação:** links para o site.
- **O que adaptamos:** a galeria do README apresenta cada momento da experiência com uma captura real e uma legenda de uma linha, no mesmo enquadramento.

## 6. tldraw

- **O que torna a apresentação boa:** hero claro/escuro, uma frase de posicionamento e "Feature highlights" escritos como **Recurso — explicação**, que se leem em segundos. Tem seção de marcas (Trademarks).
- **Elementos visuais que funcionam:** poucos badges, todos úteis (versão, downloads, comunidade).
- **Narrativa:** posicionamento → destaques → quem usa → início rápido.
- **Demonstração:** exemplos e starter kits.
- **Documentação:** site dedicado.
- **O que adaptamos:** as funcionalidades do README seguem o formato **Recurso — o que resolve**. Nenhum badge foi adicionado sem informação verificável.

## 7. Typst

- **O que torna a apresentação boa:** a imagem de abertura mostra **a entrada e o resultado lado a lado** (marcação → documento). Entende-se o produto sem ler.
- **Elementos visuais que funcionam:** a comparação direta antes/depois.
- **Narrativa:** o que é e por que é diferente → exemplo → instalação → uso.
- **Demonstração:** o próprio exemplo, com código e saída.
- **Documentação:** comandos com comentário em cada linha.
- **O que adaptamos:** o painel "do conteúdo ao e-mail" mostra a mesma informação em três formas (página editável → report HTML → e-mail-resumo), e o diagrama problema → solução segue a lógica de antes e depois.

## 8. Evidence

- **O que torna a apresentação boa:** é um produto de **relatórios**, o mesmo domínio deste case. Posicionamento em uma linha ("ferramenta para criar reports com os seus dados") e "How it works" em três tópicos.
- **Elementos visuais que funcionam:** wordmark claro/escuro, sem excesso.
- **Narrativa:** o que é → como funciona em três passos → instalar → publicar.
- **Demonstração:** site e documentação.
- **Documentação:** curta, focada no primeiro uso.
- **O que adaptamos:** "Como funciona" em poucos passos numerados, com o fluxo real do mês.

## 9. Metabase

- **O que torna a apresentação boa:** título, uma frase de valor e um screenshot grande do produto — nessa ordem, antes de qualquer instrução de instalação.
- **Elementos visuais que funcionam:** um único screenshot, grande, com dados de exemplo.
- **Narrativa:** valor → produto → recursos-chave → instalação.
- **Demonstração:** screenshot e site.
- **Documentação:** recursos com link para a página de cada um.
- **O que adaptamos:** o hero do README traz a demonstração animada logo depois do posicionamento; instruções técnicas ficam para o fim.

## 10. Maybe

- **O que torna a apresentação boa:** imagem de largura total no topo e um alerta (`> [!IMPORTANT]`) dizendo com franqueza o status do projeto. Há uma seção específica sobre **fork, atribuição e uso da marca**.
- **Elementos visuais que funcionam:** hero simples; alertas nativos do GitHub para avisos.
- **Narrativa:** produto → status → hospedagem → regras de marca → desenvolvimento.
- **Demonstração:** hero e dados de demonstração opcionais.
- **Documentação:** guias em `docs/`.
- **O que adaptamos:** alertas nativos do GitHub (`> [!NOTE]`, `> [!IMPORTANT]`) para o aviso de dados fictícios e para o status de publicação, e regras claras de marca.

## 11. Appwrite

- **O que torna a apresentação boa:** banner, uma frase de posicionamento, **seletor de idioma** ("English | 简体中文") e um sumário de seções. Tem diagrama de arquitetura.
- **Elementos visuais que funcionam:** banner de largura total; sumário logo no início.
- **Narrativa:** posicionamento → produtos → instalação → arquitetura → contribuição.
- **Demonstração:** nuvem e guias.
- **Documentação:** README em mais de um idioma.
- **O que adaptamos:** seletor **Português | English** no topo, com `README.en.md` escrito como adaptação profissional, não tradução literal.

## 12. brittanychiang.com v4 (portfólio pessoal)

- **O que torna a apresentação boa:** é um portfólio pessoal de referência. O README mostra a evolução do trabalho (links para as versões anteriores v1, v2 e v3), um screenshot e uma seção clara pedindo **atribuição** a quem reutilizar o código.
- **Elementos visuais que funcionam:** logo, uma linha de contexto e uma imagem.
- **Narrativa:** o que é → versões anteriores → como reutilizar com crédito → instalação.
- **Demonstração:** o site publicado.
- **Documentação:** passos de instalação curtos.
- **O que adaptamos:** a evolução do produto por versões (1.x → 5.6) entra como linha do tempo no case; a seção de marca e direitos deixa claro o que pode e o que não pode ser reutilizado.

---

## Síntese aplicada neste repositório

1. **Primeiro o porquê, depois o como** (Plausible, Twenty): o README abre com o problema e a resposta, e só no fim fala de execução e pastas.
2. **Demonstração antes do texto** (Metabase, PostHog, Typst): GIF real logo após o posicionamento; galeria de capturas reais; vídeos MP4 na página de apresentação.
3. **Navegação curta** (Excalidraw, Appwrite): linha de links e sumário por âncoras no topo; seletor de idioma.
4. **Arquitetura legível** (Supabase): diagrama com legenda por componente, refletindo o código real.
5. **Transparência** (Plausible, Maybe, tldraw): aviso de dados fictícios, de marca e do status de publicação visível no README, não escondido.
6. **Evolução como prova de trabalho** (brittanychiang.com): a linha do tempo das versões mostra o processo de produto.
7. **Pouco ruído** (tldraw, Evidence): sem badges decorativos; ícones e emojis só quando têm função.
