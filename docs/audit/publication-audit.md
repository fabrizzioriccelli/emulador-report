# Auditoria de segurança, privacidade e publicação

**Data:** 16/11/2026 · **Repositório:** privado · **Branch:** `claude/creative-strategy-html-video-dqdrsx`

> [!IMPORTANT]
> **Conclusão: este repositório não deve ser tornado público como está.** O código atual não tem segredos nem dados reais, mas o **histórico de commits** contém materiais de trabalho reais (um report mensal, peças de campanhas, nomes). Além disso, a **titularidade do código** e o uso de **ativos de marca** dependem de autorização. O caminho recomendado está na [seção 5](#5-caminho-recomendado-para-publicar).

## 1. O que foi verificado

| Item | Como | Resultado |
|---|---|---|
| Credenciais, tokens, senhas, chaves | Busca por padrões (chaves AWS, tokens GitHub e Slack, chaves privadas, `api_key=`, `password=`) em **todas as revisões** do histórico e nos arquivos atuais | Nada encontrado |
| Arquivos `.env`, `.pem`, `.key`, credenciais | Nomes de arquivo em todo o histórico | Nada encontrado |
| URLs e endpoints internos | Domínios citados nos arquivos atuais | Só exemplos (`empresa.sharepoint.com`, `example.com`, `intranet`, `servidor-interno`) em documentação e testes; nenhum endereço interno real |
| Dados reais (campanhas, resultados, pessoas) | Busca, em todas as revisões, por uma lista de termos sensíveis conhecidos, mantida **fora** do repositório (nomes de campanhas reais, identificadores de usuário e de pessoas). A lista não é reproduzida aqui para não expor o próprio conteúdo | **Arquivos atuais: nada encontrado. Histórico: encontrado** (seção 2) |
| Fotos licenciadas (banco de imagens) | `assets/fotos/` em todo o histórico | Nunca foram commitadas; o `.gitignore` bloqueia a pasta |
| Fontes proprietárias | Arquivos de fonte no repositório | Nenhum arquivo de fonte proprietária; só referências por nome em CSS e configuração |
| Ativos de marca | `assets/marca/`, ícones embutidos, personagem | Presentes (seção 3) |
| Metadados | Propriedades de PPTX e PDF do `kit/`; EXIF das imagens do case | PPTX e PDF com autor "Creative Strategy" (nome da área); nenhuma imagem do case com EXIF |
| Dados pessoais | Autoria de commits, exemplos | Nome e e-mail `noreply` do GitHub do próprio autor; exemplos fictícios (`fulano`, `demo@example.com`) |

## 2. Dados reais no histórico de commits

- Entre **06/10/2026 e 03/11/2026**, cerca de **26 revisões** do histórico contêm material real de trabalho:
  - um report mensal real (`reports/2026-09.html`);
  - imagens de peças e campanhas reais (`assets/2026-09/*.jpg`);
  - textos com nomes de campanhas e de pessoas.
- Esses arquivos **saíram dos arquivos atuais** na versão 4.10.2 ("Check-up final: dados reais fora do repositório"), mas **continuam no histórico**.
- Apagar um arquivo num commit novo **não** remove a exposição: qualquer pessoa com acesso ao repositório consegue ver as revisões antigas.

**Consequência:** tornar este repositório público exporia esses materiais.

Esta auditoria **não reescreveu o histórico**: isso é destrutivo, exige autorização explícita e não resolve cópias já existentes. A recomendação é publicar a partir de um repositório **novo**, sem histórico (seção 5).

## 3. Propriedade intelectual e marca

| Material | Situação | Classificação |
|---|---|---|
| Código-fonte (`converter-html-eml.html`, `tools/`, `template/`, `gerar-report.html`, `tests/`) | Produzido em contexto profissional, com apoio de IA. A titularidade (empregador ou autor) **não está definida** no repositório | **Depende de autorização** |
| `assets/marca/` (símbolo do banco, incluindo um vetor original "recebido da área") e os ícones embutidos no `kit/` | Ativos de marca de terceiros | **Não publicar** sem autorização |
| `assets/formiguinha/` (personagem da área, arquivo original recebido) | Ativo interno | **Não publicar** |
| `kit/` (guia operacional, apresentação executiva, emuladores e reports de produção) | Usa a identidade do banco e o modelo corporativo | **Não publicar** |
| `config/marca*.txt` e a documentação operacional (`docs/` em maiúsculas, `docs/operacao.md`) | Citam o Brand Guide interno, processos internos (Copilot corporativo, SharePoint) e regras de marca | **Revisar antes** de publicar |
| `dados/` (modelos e exemplos de treinamento, Janeiro 2099) | Fictício | Pode publicar (junto com o código, se autorizado) |
| **Materiais do case:** `README*.md`, `docs/*.md` em minúsculas, `docs/index.html`, `docs/assets/`, `docs/demo/`, `tools/portfolio/` | Identidade própria, fontes OFL e dados fictícios. A conferência automática garante que o build de demonstração não mostra a marca do banco | **Pode publicar**; `docs/demo/` embute o código dos emuladores e segue a autorização do código |
| Benchmark | Só links públicos e observações próprias | Pode publicar |

## 4. Licença

**Nenhuma licença foi criada.** Sem a titularidade definida, escolher uma licença de código aberto seria afirmar um direito que pode não existir. Pendência: confirmar a titularidade e então escolher a licença (ou manter "todos os direitos reservados").

## 5. Caminho recomendado para publicar

1. **Confirmar a autorização** para publicar o código (ou decidir publicar apenas os materiais do case, sem o código-fonte).
2. **Criar um repositório novo e público** (por exemplo, `emulador-report-case`), **sem o histórico deste**, com apenas os arquivos autorizados:

   ```text
   README.md, README.en.md, CHANGELOG.md (revisado)
   docs/index.html, docs/.nojekyll, docs/assets/, docs/demo/
   docs/overview.md, problem-and-solution.md, architecture.md, features.md, user-guide.md,
   docs/demo-data.md, benchmark.md, contribution.md, disclaimer.md, docs/audit/
   tools/portfolio/  (e, se autorizado: converter-html-eml.html, tools/motor.js, template/, tests/)
   ```

3. **Não levar:**
   - `kit/`, `assets/marca/`, `assets/formiguinha/`;
   - a documentação operacional interna;
   - nenhum arquivo do histórico.
4. **Rodar de novo** no repositório novo: `node tools/portfolio/conferir-links.js` e a varredura de termos sensíveis.
5. **Ativar o GitHub Pages** no repositório novo: Settings › Pages › branch `main`, pasta `/docs`.
6. **Configurar no GitHub** (veja as sugestões abaixo):
   - a descrição;
   - os tópicos;
   - a imagem de prévia social (`docs/assets/brand/social-preview.png`).

Nenhum desses passos foi executado: todos dependem da sua decisão. A visibilidade deste repositório **não** foi alterada.

## 6. Sugestões para o GitHub

- **Descrição:** "Case de portfólio: emuladores PF e PJ que transformam o report mensal de marketing numa página editável e num e-mail executivo (.eml). Dados fictícios."
- **Tópicos:** `marketing-analytics`, `reporting`, `html-email`, `outlook`, `eml`, `vanilla-javascript`, `contenteditable`, `no-code`, `playwright`, `portfolio`, `case-study`.
- **Prévia social:** `docs/assets/brand/social-preview.png` (1280 × 640).
- **Badges:** nenhum. O case não tem CI público, cobertura medida nem licença definida, e um badge desses criaria uma aparência de maturidade que não existe.

## 7. Checklist antes de publicar

- [ ] Autorização sobre o código (ou decisão de publicar só os materiais do case)
- [ ] Repositório novo, sem histórico, com os arquivos da lista da seção 5
- [ ] Nenhum arquivo de `kit/`, `assets/marca/` e `assets/formiguinha/`
- [ ] Varredura de termos sensíveis sem ocorrências
- [ ] Links conferidos (`node tools/portfolio/conferir-links.js`)
- [ ] Revisão pessoal da seção "Minha contribuição"
- [ ] Licença definida (ou "todos os direitos reservados")
- [ ] GitHub Pages ativado e testado no endereço final
