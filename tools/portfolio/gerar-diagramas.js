/*
 * Diagramas do case em SVG (vetoriais, legíveis no tema claro e no escuro do GitHub: cada diagrama tem fundo próprio).
 * Refletem a arquitetura real do repositório: nenhum serviço, API ou integração que não exista.
 * Uso: node tools/portfolio/gerar-diagramas.js   →   docs/assets/diagrams/*.svg
 */
"use strict";
var fs = require("fs"), path = require("path");
var SAIDA = path.join(__dirname, "..", "..", "docs", "assets", "diagrams");
var C = { ink: "#14161B", paper: "#F7F5F0", line: "#DCD7CD", gray: "#5D6270", cobalt: "#2D5BFF", cobaltTint: "#E8EEFF", teal: "#0F8A7E", tealTint: "#E3F2EF", amber: "#F2B33D", amberTint: "#FFF4D6", coral: "#B23A0B", coralTint: "#FDE9DF", white: "#FFFFFF" };
var FONTE = "Inter, 'Segoe UI', -apple-system, Helvetica, Arial, sans-serif", MONO = "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace";

function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function caixa(x, y, w, h, o) {
  o = o || {}; var r = [], fill = o.fill || C.white, stroke = o.stroke || C.line, ty = y + (o.pad || 26);
  r.push('<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (o.rx || 14) + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (o.sw || 1.5) + '"' + (o.dash ? ' stroke-dasharray="6 5"' : "") + "/>");
  if (o.tag) { r.push('<text x="' + (x + 16) + '" y="' + ty + '" font-family="' + MONO + '" font-size="11" letter-spacing="1.2" fill="' + (o.tagCor || C.gray) + '">' + esc(o.tag) + "</text>"); ty += 22; }
  if (o.titulo) { r.push('<text x="' + (o.centro ? x + w / 2 : x + 16) + '" y="' + ty + '"' + (o.centro ? ' text-anchor="middle"' : "") + ' font-family="' + FONTE + '" font-size="' + (o.tam || 16) + '" font-weight="700" fill="' + (o.corTitulo || C.ink) + '">' + esc(o.titulo) + "</text>"); ty += 22; }
  (o.linhas || []).forEach(function (l) {
    var mono = /^`[^`]*`$/.test(l), t = mono ? l.slice(1, -1) : l.replace(/`/g, ""), cont = /^ {2}/.test(t);
    if (cont) ty -= Math.round((o.entre || 20) * 0.32);
    r.push('<text x="' + (o.centro ? x + w / 2 : x + (cont ? 28 : 16)) + '" y="' + ty + '"' + (o.centro ? ' text-anchor="middle"' : "") + ' font-family="' + (mono ? MONO : FONTE) + '" font-size="' + (mono ? 12 : 13.5) + '" fill="' + (o.corTexto || C.gray) + '">' + esc(t) + "</text>"); ty += o.entre || 20;
  });
  return r.join("\n");
}
function seta(x1, y1, x2, y2, o) {
  o = o || {}; var r = [], cor = o.cor || C.gray;
  var d = o.curva ? "M" + x1 + "," + y1 + " C" + (x1 + (x2 - x1) / 2) + "," + y1 + " " + (x1 + (x2 - x1) / 2) + "," + y2 + " " + x2 + "," + y2 : "M" + x1 + "," + y1 + " L" + x2 + "," + y2;
  r.push('<path d="' + d + '" fill="none" stroke="' + cor + '" stroke-width="1.8"' + (o.dash ? ' stroke-dasharray="5 5"' : "") + ' marker-end="url(#ponta)"/>');
  if (o.rotulo) r.push('<text x="' + ((x1 + x2) / 2 + (o.dx || 0)) + '" y="' + ((y1 + y2) / 2 + (o.dy || -8)) + '" text-anchor="middle" font-family="' + FONTE + '" font-size="12" fill="' + C.gray + '">' + esc(o.rotulo) + "</text>");
  return r.join("\n");
}
function svg(w, h, titulo, desc, corpo, rodape) {
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + " " + h + '" width="' + w + '" height="' + h + '" role="img" aria-labelledby="t d">\n' +
    '<title id="t">' + esc(titulo) + '</title>\n<desc id="d">' + esc(desc) + "</desc>\n" +
    '<defs><marker id="ponta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="' + C.gray + '"/></marker></defs>\n' +
    '<rect width="' + w + '" height="' + h + '" rx="18" fill="' + C.paper + '"/>\n' +
    '<text x="32" y="44" font-family="' + FONTE + '" font-size="20" font-weight="700" fill="' + C.ink + '">' + esc(titulo) + "</text>\n" +
    corpo + "\n" +
    (rodape ? '<text x="32" y="' + (h - 20) + '" font-family="' + FONTE + '" font-size="12" fill="' + C.gray + '">' + esc(rodape) + "</text>\n" : "") + "</svg>\n";
}

var D = {};

/* 1 · problema → oportunidade → solução */
D["problema-oportunidade-solucao"] = svg(1200, 530, "Do problema à solução", "Desafios identificados no histórico do projeto, a oportunidade e a solução construída.", [
  caixa(32, 76, 360, 400, { fill: C.coralTint, stroke: "#F3C2AC", tag: "DESAFIOS · EVIDÊNCIA NO HISTÓRICO", tagCor: C.coral, titulo: "O report mensal", linhas: [
    "• Refeito todo mês, com a mesma estrutura", "• Primeiras versões: HTML editado à mão", "• Regras de marca e limites do Outlook", "  para seguir sem apoio técnico", "• Dois segmentos (PF e PJ), com", "  identidades e seções diferentes", "• Resumo executivo por e-mail,", "  montado à parte", "• Ambiente corporativo: nada", "  para instalar"], entre: 28 }),
  seta(392, 266, 448, 266),
  caixa(448, 136, 300, 260, { fill: C.amberTint, stroke: "#EBD08A", tag: "OPORTUNIDADE", tagCor: "#8A5200", titulo: "Separar conteúdo, forma e canal", linhas: [
    "O time cuida do conteúdo do mês.", "A ferramenta cuida da marca,", "do layout, do celular e do e-mail.", "", "Sem servidor, sem instalação:", "um arquivo que abre no navegador."], entre: 24 }),
  seta(748, 266, 804, 266),
  caixa(804, 76, 364, 400, { fill: C.cobaltTint, stroke: "#C9D6FF", tag: "SOLUÇÃO", tagCor: C.cobalt, titulo: "Emuladores PF e PJ", linhas: [
    "• Edição na própria página do report", "• Um motor, dois perfis (PF e PJ)", "• Report .html com tudo embutido", "• E-mail-resumo .eml pronto", "  para o Outlook", "• Prévia no computador e no celular", "• Status de conferência em tempo real", "• Nenhum número é inventado", "  ou calculado pela ferramenta"], entre: 28 })
].join("\n"), "Fontes: CHANGELOG.md (versões 1.x a 5.6) e docs/ do repositório.");

/* 2 · fluxo de uso */
(function () {
  var passos = [["1", "Abrir", ["modelo em branco", "ou report salvo"]], ["2", "Editar", ["textos, números", "e etiquetas"]], ["3", "Organizar", ["novo item, arrastar,", "mover, seções"]], ["4", "Mídia", ["imagens, vídeos", "e links"]],
    ["5", "Conferir", ["prévia no computador", "e no celular"]], ["6", "Salvar", ["um .html só,", "tudo embutido"]], ["7", "E-mail", ["resumo com até 4", "destaques · .eml"]]];
  var r = [], w = 142, g = 22, x0 = 32;
  passos.forEach(function (p, i) {
    var x = x0 + i * (w + g), cor = i < 6 ? C.cobalt : C.teal;
    r.push(caixa(x, 96, w, 150, { fill: C.white, stroke: C.line }));
    r.push('<circle cx="' + (x + 30) + '" cy="126" r="15" fill="' + cor + '"/><text x="' + (x + 30) + '" y="131" text-anchor="middle" font-family="' + FONTE + '" font-size="14" font-weight="700" fill="#fff">' + p[0] + "</text>");
    r.push('<text x="' + (x + 16) + '" y="176" font-family="' + FONTE + '" font-size="17" font-weight="700" fill="' + C.ink + '">' + esc(p[1]) + "</text>");
    p[2].forEach(function (l, k) { r.push('<text x="' + (x + 16) + '" y="' + (202 + k * 19) + '" font-family="' + FONTE + '" font-size="13" fill="' + C.gray + '">' + esc(l) + "</text>"); });
    if (i < passos.length - 1) r.push(seta(x + w + 2, 171, x + w + g - 2, 171));
  });
  r.push(caixa(32, 268, 1136, 64, { fill: C.cobaltTint, stroke: "#C9D6FF", linhas: ["Desfazer e Refazer em todos os passos · a edição fica guardada no navegador até salvar (Recuperar a edição) · a mesma sequência no PF e no PJ"], pad: 37 }));
  D["fluxo-de-uso"] = svg(1200, 372, "Fluxo de uso: o mês em sete passos", "Sequência de uso dos emuladores, do arquivo aberto ao e-mail-resumo.", r.join("\n"));
})();

/* 3 · estrutura PF e PJ */
D["estrutura-pf-pj"] = svg(1200, 520, "Um código, dois segmentos", "O mesmo emulador, motor e template, com perfis PF e PJ.", [
  caixa(380, 76, 440, 128, { fill: C.ink, stroke: C.ink, tag: "MESMO CÓDIGO", tagCor: "#9AA3B2", titulo: "Emulador + motor + template", corTitulo: "#fff", corTexto: "#D5D9E0", linhas: ["`converter-html-eml.html · tools/motor.js`", "`template/report.html (um esqueleto de página)`"] }),
  seta(520, 204, 300, 262, { curva: true }), seta(680, 204, 900, 262, { curva: true }),
  caixa(80, 262, 440, 196, { fill: C.cobaltTint, stroke: "#C9D6FF", tag: "PERFIL PF", tagCor: C.cobalt, titulo: "Emulador Report PF", linhas: ["`config/marca.txt` · cores, fontes, símbolo", "Seções: visão geral, resultados, lançamentos,", "qualidade criativa, laboratório, aprendizados…", "Modelo em branco próprio (`tools/coringa.js`)", "Layout de página contínua"] }),
  caixa(680, 262, 440, 196, { fill: C.tealTint, stroke: "#9FD5CC", tag: "PERFIL PJ", tagCor: C.teal, titulo: "Emulador Report PJ", linhas: ["`config/marca-pj.txt` · cores, fontes, símbolo", "Seções: campanhas, indicadores, análises,", "próximas iniciativas, vem aí", "Modelo em branco próprio (`tools/coringa-pj.js`)", "Layout com painéis · funil nos resultados"] }),
  '<text x="600" y="488" text-anchor="middle" font-family="' + FONTE + '" font-size="13" fill="' + C.gray + '">O segmento fica gravado na página (meta report-segmento): cada emulador só abre os reports do seu segmento.</text>'
].join("\n"));

/* 4 · criação do report */
D["fluxo-do-report"] = svg(1200, 470, "Como um report é criado", "Dois caminhos que geram o mesmo report HTML: o emulador e o gerador por arquivo de dados.", [
  caixa(32, 80, 300, 150, { fill: C.white, tag: "ENTRADA · EMULADOR", titulo: "Abrir no emulador", linhas: ["Modelo em branco (coringa)", "ou o report do mês anterior (.html)", "ou blocos de texto colados", "(Importar conteúdo)"] }),
  seta(332, 155, 402, 155),
  caixa(402, 80, 360, 150, { fill: C.cobaltTint, stroke: "#C9D6FF", tag: "EDIÇÃO NA PÁGINA", tagCor: C.cobalt, titulo: "A página do mês vira o editor", linhas: ["Clique e escreva · barra do item", "Novo item, arrastar, mover, seções", "Imagens reduzidas e recortadas no navegador", "Desfazer, Refazer, Recuperar"] }),
  seta(762, 155, 832, 155),
  caixa(832, 80, 336, 150, { fill: C.ink, stroke: C.ink, tag: "SAÍDA", tagCor: "#9AA3B2", titulo: "report-AAAA-MM.html", corTitulo: "#fff", corTexto: "#D5D9E0", linhas: ["Um arquivo só: imagens e vídeos dentro", "Abre em qualquer navegador", "Movimento ao rolar, vídeo no clique", "Pronto para o computador e o celular"] }),
  caixa(32, 270, 300, 150, { fill: C.white, dash: true, tag: "ENTRADA · GERADOR", titulo: "Arquivos do mês", linhas: ["`dados/AAAA-MM.txt` (blocos)", "`assets/` (peças e vídeos)", "`config/marca.txt` (marca)"] }),
  seta(332, 345, 402, 345),
  caixa(402, 270, 360, 150, { fill: C.white, dash: true, tag: "GERAR-REPORT.HTML + MOTOR", titulo: "Conferência e montagem", linhas: ["Lê os blocos e o template", "Confere imagens, links e campos", "Lista pendências antes de liberar", "Monta a página com a marca do segmento"] }),
  seta(762, 345, 850, 232, { curva: true })
].join("\n"), "O caminho tracejado é o original (gerador); desde a versão 4.3 o emulador é o centro da operação.");

/* 5 · e-mail-resumo */
D["fluxo-do-email"] = svg(1200, 420, "Do report ao e-mail executivo", "Geração do e-mail-resumo e do arquivo .eml a partir do report.", [
  caixa(32, 80, 220, 140, { fill: C.ink, stroke: C.ink, tag: "ORIGEM", tagCor: "#9AA3B2", titulo: "Report do mês", corTitulo: "#fff", corTexto: "#D5D9E0", linhas: ["a página aberta", "no emulador"] }),
  seta(252, 150, 292, 150),
  caixa(292, 80, 270, 140, { fill: C.white, tag: "SUGESTÃO", titulo: "Leitura do report", linhas: ["Frase do mês e período", "Destaques sugeridos: os", "principais resultados"] }),
  seta(562, 150, 602, 150),
  caixa(602, 80, 270, 140, { fill: C.cobaltTint, stroke: "#C9D6FF", tag: "ESCOLHA", tagCor: C.cobalt, titulo: "Até 4 destaques", linhas: ["Tirar, incluir, ordenar, editar", "Link do report completo", "Imagem ou capa de vídeo"] }),
  seta(872, 150, 912, 150),
  caixa(912, 80, 256, 140, { fill: C.tealTint, stroke: "#9FD5CC", tag: "SAÍDA", tagCor: C.teal, titulo: "Arquivos", linhas: ["E-mail-resumo (.eml)", "E-mail completo (.eml, opcional)", "Imagem do resumo (.png)"] }),
  caixa(292, 252, 876, 108, { fill: C.white, tag: "ENQUANTO EDITA", titulo: "Prévia e status em tempo real", linhas: ["Prévia no computador e no celular · HTML compatível com o Outlook (tabelas, estilos em linha, modo escuro)", "Status de cada etapa: o download só libera quando o link e os campos obrigatórios estão certos"] }),
  seta(737, 220, 737, 252, { dash: true })
].join("\n"), "Nenhum serviço de envio: o .eml abre no Outlook de quem envia, e o envio é feito pela própria pessoa.");

/* 6 · arquitetura técnica */
D["arquitetura"] = svg(1200, 610, "Arquitetura técnica", "Componentes reais: tudo roda no navegador, sem servidor; o Node.js só monta e testa.", [
  caixa(32, 74, 760, 380, { fill: "#FBFAF7", stroke: C.line, tag: "NAVEGADOR (CHROME OU EDGE) · ARQUIVO LOCAL · SEM SERVIDOR", titulo: "" }),
  caixa(56, 120, 340, 150, { fill: C.cobaltTint, stroke: "#C9D6FF", tag: "INTERFACE", tagCor: C.cobalt, titulo: "Emulador (um .html avulso)", linhas: ["Abrir · editar · organizar · salvar", "Seções, prévia, Desfazer/Refazer", "E-mail-resumo e status"] }),
  caixa(420, 120, 348, 150, { fill: C.white, tag: "IFRAME", titulo: "Página do report", linhas: ["O próprio report, editável", "data-campo / data-item / data-img", "Grade única: computador e celular"] }),
  seta(396, 195, 420, 195),
  caixa(56, 290, 340, 140, { fill: C.ink, stroke: C.ink, tag: "EMBUTIDO", tagCor: "#9AA3B2", titulo: "Motor (tools/motor.js)", corTitulo: "#fff", corTexto: "#D5D9E0", linhas: ["Blocos de dados · template · marca", "Conferência · e-mail (.eml) · modo escuro", "Perfis PF e PJ"] }),
  caixa(420, 290, 168, 140, { fill: C.white, tag: "EMBUTIDO", titulo: "Modelos", linhas: ["em branco", "PF e PJ", "`tools/coringa*.js`"] }),
  caixa(600, 290, 168, 140, { fill: C.white, tag: "NAVEGADOR", titulo: "IndexedDB", linhas: ["Recuperar", "a edição", "até salvar"] }),
  caixa(832, 74, 336, 220, { fill: C.tealTint, stroke: "#9FD5CC", tag: "SAÍDAS (DOWNLOAD)", tagCor: C.teal, titulo: "Arquivos gerados", linhas: ["report-AAAA-MM.html", "  imagens e vídeos em base64", "report-AAAA-MM-resumo.eml", "e-mail completo .eml (opcional)", "imagem do resumo .png"] }),
  seta(792, 184, 832, 184),
  caixa(832, 318, 336, 136, { fill: C.white, dash: true, tag: "ENTRADAS", titulo: "Arquivos da pessoa", linhas: ["Report salvo (.html)", "Imagens, vídeos (Explorador)", "Blocos de texto (Importar conteúdo)"] }),
  seta(832, 386, 792, 386),
  caixa(32, 478, 1136, 100, { fill: C.white, tag: "MANUTENÇÃO (NODE.JS) · NÃO VAI PARA O TIME", titulo: "Montagem e testes", linhas: ["`tools/montar-avulso.js` → kit/emulador-report*.html · `tools/atualizar-coringa.js` (gerar-report.html num Chromium) · `tests/` (Playwright e Node)", "`tools/portfolio/` → build de demonstração, peças fictícias, capturas, vídeos e diagramas deste case"] })
].join("\n"));

/* 7 · relação entre componentes */
D["componentes"] = svg(1200, 470, "Relação entre os componentes", "Como template, marca, dados, motor e emulador se ligam.", [
  caixa(32, 90, 230, 76, { fill: C.white, titulo: "template/report.html", linhas: ["esqueleto da página"] }),
  caixa(32, 186, 230, 76, { fill: C.white, titulo: "config/marca*.txt", linhas: ["cores, fontes, símbolo"] }),
  caixa(32, 282, 230, 76, { fill: C.white, dash: true, titulo: "dados/*.txt + assets/", linhas: ["conteúdo do mês"] }),
  seta(262, 128, 352, 210, { curva: true }), seta(262, 224, 352, 224), seta(262, 320, 352, 238, { curva: true }),
  caixa(352, 160, 250, 130, { fill: C.ink, stroke: C.ink, titulo: "tools/motor.js", corTitulo: "#fff", corTexto: "#D5D9E0", linhas: ["parser · montagem", "conferência · e-mail", "perfis PF/PJ"], pad: 34 }),
  seta(602, 200, 692, 140, { curva: true, rotulo: "embutido" }), seta(602, 250, 692, 330, { curva: true }),
  caixa(692, 90, 250, 100, { fill: C.cobaltTint, stroke: "#C9D6FF", titulo: "Emulador PF / PJ", linhas: ["converter-html-eml.html", "+ motor + modelo em branco"] }),
  caixa(692, 290, 250, 100, { fill: C.white, titulo: "Report .html", linhas: ["gerado pelo motor ou", "salvo pelo emulador"] }),
  seta(817, 190, 817, 290, { rotulo: "abre, edita, salva", dx: 70, dy: 4 }),
  seta(942, 140, 1012, 214, { curva: true }), seta(942, 340, 1012, 252, { curva: true }),
  caixa(1012, 186, 156, 100, { fill: C.tealTint, stroke: "#9FD5CC", titulo: "E-mail .eml", linhas: ["resumo e", "completo"] })
].join("\n"));

fs.mkdirSync(SAIDA, { recursive: true });
Object.keys(D).forEach(function (k) { fs.writeFileSync(path.join(SAIDA, k + ".svg"), D[k]); console.log(k + ".svg"); });
