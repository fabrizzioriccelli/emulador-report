# Dados fictícios da demonstração

> [!IMPORTANT]
> **Demonstração fictícia:** este repositório utiliza imagens ilustrativas, campanhas fictícias, nomes demonstrativos e dados sintéticos exclusivamente para apresentar as funcionalidades do projeto. Nenhum dado exibido representa resultados reais, informações de clientes ou campanhas internas do Santander.

Toda a demonstração (README, página de apresentação, capturas, GIFs e vídeos) usa um único conjunto de dados inventados, que foi construído para ser **coerente**. Os números saem de uma base ([`tools/portfolio/demo/metricas.json`](../tools/portfolio/demo/metricas.json)), e o script [`tools/portfolio/conferir-dados.js`](../tools/portfolio/conferir-dados.js) recalcula **41 relações** e compara com o texto do report. A última execução terminou com 41 ok e nenhuma falha.

- **Período:** abril de 2099. A referência é março de 2099, e o ano distante deixa claro, em qualquer captura, que não é um mês real.
- **Marcação:** as peças levam o selo **DEMO · DADOS FICTÍCIOS**, e o rodapé do report diz "DADOS FICTÍCIOS".

## PF · Campanha Horizonte (campanha do mês)

| Base (abril) | Valor | Base (março) | Valor |
|---|---|---|---|
| Impressões | 2.400.000 | Impressões | 2.250.000 |
| Cliques | 42.000 | Cliques | 31.500 |
| Conversões | 3.150 | Conversões | 2.700 |
| Investimento | R$ 94.500 | Investimento | R$ 97.200 |

| Indicador no report | Cálculo | Abril | Março | Variação |
|---|---|---|---|---|
| CTR | cliques ÷ impressões | 42.000 ÷ 2.400.000 = **1,75%** | 31.500 ÷ 2.250.000 = 1,40% | 1,75 ÷ 1,40 − 1 = **+25%** |
| Custo por conversão | investimento ÷ conversões | 94.500 ÷ 3.150 = **R$ 30,00** | 97.200 ÷ 2.700 = R$ 36,00 | **−16,7%** |
| Conversões | — | **3.150** | 2.700 | **+16,7%** |

## PF · Projeto Aurora (destaque)

| Indicador | Cálculo | Abril | Março | Variação |
|---|---|---|---|---|
| Visualizações completas | — | **215 mil** | 180 mil | **+19,4%** |
| Taxa de conclusão | completas ÷ alcance | 215.000 ÷ 860.000 = **25,0%** | 180.000 ÷ 800.000 = 22,5% | **+11,1%** |
| Custo por visualização completa | investimento ÷ completas | 25.800 ÷ 215.000 = **R$ 0,12** | 25.200 ÷ 180.000 = R$ 0,14 | **−14,3%** |

Índice de qualidade criativa (fictício): 68% → **74%** (+6 p.p.).

## PJ · Programa Vértice (funil)

| Etapa | Abril | Conversão da etapa | Março |
|---|---|---|---|
| Impressões | 1.200.000 | — | 1.100.000 |
| Cliques | **18.000** | 1,5% das impressões | 15.000 |
| Leads | **3.600** | **20%** dos cliques | 2.700 (18%) |
| Contas abertas | **720** | **20%** dos leads | 600 |

Variações no report: cliques **+20%**, leads **+33,3%**, contas **+20%**.

## PJ · Conecta Negócios (destaque)

| Indicador | Cálculo | Abril | Março | Variação |
|---|---|---|---|---|
| Participantes | — | **806** | 700 | **+15,1%** |
| Taxa de presença | participantes ÷ inscritos | 806 ÷ 1.240 = **65,0%** | — | — |
| NPS dos encontros | — | **72** | 64 | **+8 pts** |

Índice de qualidade criativa (fictício): 70% → **76%** (+6 p.p.).

## Nomes e peças

- **Campanhas e projetos:**
  - PF: Campanha Horizonte, Projeto Aurora, Jornada Conecta, Programa Vértice e Campanha Evolução;
  - PJ: Programa Vértice, Conecta Negócios, Impulso PME e Rota Exportação.
- **Peças:** composições geométricas geradas por código ([`tools/portfolio/gerar-pecas.js`](../tools/portfolio/gerar-pecas.js)), sem pessoas, fotos de banco de imagens ou marcas de terceiros. Os dois vídeos (teasers) são animações das mesmas peças.
- **Links:** endereços do domínio reservado `example.com` (RFC 2606), que não leva a nenhum site real.
- **Contato:** `demo@example.com`.

## Arquivos

| Arquivo | O que é |
|---|---|
| [`tools/portfolio/demo/dados-demo-pf.txt`](../tools/portfolio/demo/dados-demo-pf.txt) | Report PF fictício, no formato de blocos do motor |
| [`tools/portfolio/demo/dados-demo-pj.txt`](../tools/portfolio/demo/dados-demo-pj.txt) | Report PJ fictício |
| [`tools/portfolio/demo/metricas.json`](../tools/portfolio/demo/metricas.json) | Base numérica (abril e março) |
| [`tools/portfolio/demo/assets/`](../tools/portfolio/demo/assets/) | Peças e vídeos fictícios |
| [`demo/report-demo-pf.html`](demo/report-demo-pf.html), [`demo/report-demo-pj.html`](demo/report-demo-pj.html) | Reports gerados pelo motor a partir desses dados |
