# Minha contribuição

Este documento descreve o meu papel no projeto, com base no que o histórico do repositório registra. Não inclui métricas de impacto (tempo economizado, adoção, resultados de campanha): elas não foram medidas e registradas, e este case não as apresenta.

## Papel

**Dono do produto, de ponta a ponta.** Identifiquei a oportunidade no processo do report mensal e defini o que a ferramenta precisava fazer, para quem e com que regras. Depois, conduzi a evolução versão a versão, a partir do uso real.

## O que fiz

### Identificação da oportunidade e requisitos

- Transformei a rotina do report (conteúdo do mês, marca, Outlook, celular, dois segmentos) em requisitos e regras da ferramenta.
- Defini regras de confiabilidade que valem até hoje:
  - a ferramenta não cria nem calcula número;
  - indicador sem dado fica oculto;
  - cada segmento só abre o seu report.

### Experiência de uso

- Defini a direção central do produto: **a página do report é o editor**. Quem edita vê exatamente o que vai sair.
- Organizei o fluxo do mês (abrir, editar, organizar, conferir, salvar, e-mail) para pessoas sem conhecimento técnico.
- Simplifiquei a interface a cada rodada de uso. Exemplos registrados no CHANGELOG:
  - a troca da aba Elementos pelo **+ Novo item** na barra do item (5.6);
  - a etiqueta removível (5.6);
  - o **Mover para outra seção** (5.6).

### Produto em dois segmentos

- Levei o sistema de um segmento (PF) para dois (PF e PJ), com o mesmo motor e identidades próprias (versões 5.0 a 5.4). A paridade de funções entre os dois foi garantida na 5.5.

### Organização da informação e da comunicação

- Estruturei como o report conta o mês: o mês em uma frase, o que lançamos, os indicadores, os aprendizados, o foco e a agenda.
- Defini o e-mail-resumo como porta de entrada, com até 4 destaques escolhidos.

### Desenvolvimento com IA generativa

- Construí a solução com apoio de um assistente de programação com IA (Claude Code). Eu definia o problema, os critérios de aceite e as prioridades, revisava cada entrega e validava no uso real.
- O histórico registra **41 pull requests** revisados e integrados por mim. Os commits de código trazem a coautoria do assistente.
- Na rotina do time, a IA entrou por uma **biblioteca de 12 prompts** para o Copilot corporativo, que estrutura o conteúdo do mês no formato de blocos que o emulador importa ([`PROMPTS_COPILOT.md`](PROMPTS_COPILOT.md)).

### Qualidade, documentação e capacitação

- Testes automatizados de ponta a ponta nos dois emuladores ([relatório](audit/test-report.md)).
- Guia operacional, documentação de cada parte do processo (Outlook, `.eml`, links, backup, ambiente corporativo) e material de treinamento para o time.

### Este case

- Transformei o projeto num case de portfólio publicável, com:
  - auditoria de propriedade intelectual e dados;
  - build de demonstração com identidade própria e dados fictícios coerentes;
  - documentação, diagramas, capturas, GIFs e vídeos gravados da ferramenta real.

## Competências demonstradas

| Competência | Onde aparece |
|---|---|
| Visão de produto | Separar conteúdo, forma e canal; evolução por versões a partir do uso |
| Marketing e comunicação | A estrutura do report e o e-mail executivo como porta de entrada |
| Dados e indicadores | Regras de confiabilidade e apresentação de KPIs, variações e funil |
| Experiência do usuário | Edição na própria página; simplificações registradas no CHANGELOG |
| Organização de processos | O mês em passos; guia operacional; checklist |
| Automação e tecnologia | Motor de geração, e-mail `.eml` no navegador, testes de ponta a ponta |
| IA aplicada | Desenvolvimento assistido por IA e biblioteca de prompts para o Copilot |

## Linha do tempo

As 42 entradas do [CHANGELOG](../CHANGELOG.md), de 02/10 a 11/11/2026, mostram o processo: HTML à mão (1.x–2.x), motor e modelo reutilizável (3.x), emulador no centro da operação (4.3), refinamentos de uso (4.4–4.13), segmento PJ (5.0–5.4) e simplificação da edição (5.5–5.6).
