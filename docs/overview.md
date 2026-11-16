# Visão geral

> [!NOTE]
> **Demonstração fictícia:** este repositório utiliza imagens ilustrativas, campanhas fictícias, nomes demonstrativos e dados sintéticos exclusivamente para apresentar as funcionalidades do projeto. Nenhum dado exibido representa resultados reais, informações de clientes ou campanhas internas do Santander.

## O que é

O **Emulador Report** é um par de ferramentas (PF e PJ) para **criar, atualizar e distribuir o report mensal de performance de marketing**. Cada emulador é um único arquivo `.html` que abre no navegador e transforma a página do report no próprio editor. No fim, ele salva um report `.html` completo e gera um **e-mail-resumo** em `.eml`, pronto para o Outlook.

## Para quem

Times de marketing que precisam contar, todo mês, o que foi feito e o que funcionou. Quem atualiza não precisa programar. Quem lê recebe um e-mail curto e, se quiser, abre o report completo.

## Por que existe

O report tinha a mesma estrutura todo mês e regras de marca, de e-mail (Outlook) e de celular. Também havia dois segmentos com identidades diferentes. As primeiras versões eram HTML editado à mão. O projeto separou **conteúdo** (o que o time escreve), **forma** (marca e layout, aplicados pelo motor) e **canal** (página completa e e-mail).

## Em números (do próprio repositório, não de resultado de negócio)

| | |
|---|---|
| Período de desenvolvimento | 02/10 a 11/11/2026 |
| Entradas de versão no CHANGELOG | 42 (de 1.x a 5.6) |
| Segmentos | 2 (PF e PJ), um só código |
| Arquivo do emulador | ~1,1 MB, sem dependências |
| Testes automatizados | 18 arquivos; suíte completa com 885 verificações registradas como "ok", além de medições de grade e de celular |

Não há métricas de impacto (tempo economizado, adoção) medidas e registradas. Por isso este case não apresenta nenhuma.

## Leia em seguida

- [Problema e solução](problem-and-solution.md)
- [Funcionalidades](features.md)
- [Arquitetura](architecture.md)
- [Guia de uso](user-guide.md)
- [Minha contribuição](contribution.md)
