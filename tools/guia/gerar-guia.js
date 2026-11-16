/*
 * Guia operacional unificado PF + PJ, no modelo oficial Santander 2026 (Template_SANTANTANDER26_HZ_PT_.pptx).
 * Cada página nasce de uma página-base do modelo (tools/guia/no-modelo.py): a capa (foto, chama, data), as aberturas
 * de seção (painel Lisboa com o número e o nome da seção, a chama grande) e as páginas de conteúdo (fundo branco,
 * chama e número da página). Por cima: navegação em pílulas (Índice · 01…14, a seção atual em destaque), títulos e
 * textos em Arimo, painéis Lisboa e as capturas REAIS dos emuladores (tools/guia/capturas.js), com marcações
 * discretas (contorno e número) nas posições exatas gravadas na captura.
 * Uso técnico (quem mantém a ferramenta; precisa do pptxgenjs e do python-pptx):
 *   node tools/guia/capturas.js <pasta>
 *   node tools/guia/gerar-guia.js <pasta> <saida.pptx> <modelo Santander 2026 .pptx>
 */
"use strict";
var path = require("path"), fs = require("fs"), cp = require("child_process");
var PptxGenJS = require("pptxgenjs");
var RAIZ = path.join(__dirname, "..", "..");
var CAP = path.resolve(process.argv[2] || "capturas"), SAIDA = path.resolve(process.argv[3] || path.join(RAIZ, "kit", "guia-operacional.pptx")), MODELO = process.argv[4] && path.resolve(process.argv[4]);
var META = JSON.parse(fs.readFileSync(path.join(CAP, "capturas.json"), "utf8"));
var VERSAO = require(path.join(RAIZ, "tools", "motor.js")).VERSAO;
var GUIA = "Guia operacional · Report mensal PF e PJ";

var SECOES = [
  ["Conhecendo os emuladores", "conhecendo"], ["Escolhendo PF ou PJ", "escolhendo"], ["Primeiros passos", "primeiros"], ["Atualizando informações", "atualizando"],
  ["Imagens e mídias", "imagens"], ["Adicionar e organizar", "organizar"], ["Visualizando", "visualizando"], ["Gerando o HTML", "html"], ["E-mail-resumo", "resumo"],
  ["Link do report", "link"], ["Arquivo .eml", "eml"], ["Prompts do Copilot", "prompts"], ["Solução de problemas", "problemas"], ["Checklist mensal", "checklist"]
];
var pres = new PptxGenJS();
pres.defineLayout({ name: "GUIA", width: 20, height: 11.25 });
pres.layout = "GUIA";
pres.title = GUIA;
pres.author = "Creative Strategy";
pres.company = "Santander";
var V = require("./visual-modelo.js")(pres, META, CAP), C = V.C, I = V.I, texto = V.texto, caixa = V.caixa, pilula = V.pilula;

/* Duas passadas: a 1ª só conta as páginas (para os links do índice e das pílulas); a 2ª desenha. */
var PAGINAS = [], INICIO = {}, PAG_INDICE = 2;
/* modelo: a página-base do modelo Santander e o que dela fica (ver no-modelo.py) */
function pagina(tipo, sec, fn, modelo) { PAGINAS.push({ tipo: tipo, sec: sec, fn: fn, modelo: modelo || { base: 14 } }); if (sec && !INICIO[sec]) INICIO[sec] = PAGINAS.length; }

/* ---------- moldura: pílulas de navegação no alto e o nome do guia no rodapé (a chama e o número vêm do modelo) ---------- */
function moldura(sl, secIdx, topo, escuro) {
  var itens = [{ t: "Índice", w: 66, alvo: PAG_INDICE, atual: false }];
  SECOES.forEach(function (s, i) {
    var n = (i < 9 ? "0" : "") + (i + 1), atual = i === secIdx, t = atual ? n + "  " + s[0] : n;
    itens.push({ t: t, w: atual ? Math.round(V.largura(t, 10.5, true) + 26) : 32, alvo: INICIO[s[1]], atual: atual });
  });
  var total = itens.reduce(function (a, b) { return a + b.w; }, 0) + 4 * (itens.length - 1), x = (topo ? 1360 : 1377) - total;
  itens.forEach(function (it) {
    pilula(sl, it.t, x, topo || 20, it.w, 24, escuro ? { fill: it.atual ? C.br : C.vm, line: C.br, c: it.atual ? C.vm : C.br, s: 10.5, link: it.alvo ? { slide: it.alvo, tooltip: it.t } : undefined }
      : { fill: it.atual ? C.vm : C.br, line: C.vm, c: it.atual ? C.br : C.vm, s: 10.5, link: it.alvo ? { slide: it.alvo, tooltip: it.t } : undefined });
    x += it.w + 4;
  });
  var sec = secIdx >= 0 ? SECOES[secIdx][0] : "";
  texto(sl, [{ text: GUIA + (sec ? "  ·  " + sec : ""), options: { hyperlink: { slide: PAG_INDICE, tooltip: "Índice" } } }], { x: 102, y: 757, w: 900, h: 18, s: 11.5, f: "fx", b: false, c: escuro ? C.br : C.cinza });
}

/* ---------- tipos de página ---------- */
/* abertura de seção: página 12 do modelo (Vermelho Santander), número e nome em branco; ao lado, um cartão branco com a
   frase da seção e uma captura real. A chama branca no canto (nada a cobre). */
function divisor(secKey, texto1, frase, eyebrow, cap) {
  var si = SECOES.findIndex(function (s) { return s[1] === secKey; });
  var nn = (si < 9 ? "0" : "") + (si + 1), nome = SECOES[si][0];
  pagina("divisor", secKey, function (sl) {
    moldura(sl, si, 20, true);
    var lin = V.quebra(nome, 90, 880, false), yt = 195 + lin * 97 + 30;
    texto(sl, texto1, { x: 64, y: yt, w: 860, h: 740 - yt - 20, s: 20, f: "fx", b: false, c: C.br, ls: 1.25 });
    var lf = V.quebra(frase, 21, 338, true);
    caixa(sl, 990, 104, 382, cap ? 440 : 58 + lf * 21 * 1.15 + 34, { fill: C.br, r: 22 });
    pilula(sl, eyebrow || "Nesta seção", 1012, 124, Math.max(104, V.largura(eyebrow || "Nesta seção", 12, true) + 30), 26, { fill: C.rio, c: C.boston, s: 12 });
    texto(sl, frase, { x: 1012, y: 162, w: 338, h: lf * 21 * 1.15 + 6, s: 21, c: C.vm, ls: 1.08 });
    if (cap) {
      var m = META[cap], top = 162 + lf * 21 * 1.15 + 18, bw = 338, bh = 524 - top, esc = Math.min(bw / m.w, bh / m.h), iw = m.w * esc, ih = m.h * esc;
      sl.addImage({ path: path.join(CAP, m.arquivo), x: I(1012 + (bw - iw) / 2), y: I(top + (bh - ih) / 2), w: I(iw), h: I(ih), altText: "Captura real do emulador (dados fictícios)" });
      sl.addShape(pres.shapes.RECTANGLE, { x: I(1012 + (bw - iw) / 2), y: I(top + (bh - ih) / 2), w: I(iw), h: I(ih), fill: { type: "none" }, line: { color: C.linha, width: 0.75 } });
    }
    sl.addImage({ path: path.join(RAIZ, "assets/marca/chama-santander-branca.png"), x: I(52), y: I(744), w: I(39), h: I(36.8) });
  }, { base: 12, manter: ["Group 4", "TextBox 7"], textos: { "Group 4": [nn], "TextBox 7": [nome] }, cores: { "Group 4": "FFFFFF", "TextBox 7": "FFFFFF" }, semChama: true });
}
/* página de conteúdo: página 14 do modelo (branca, chama e número da página) */
function conteudo(secKey, fn) {
  pagina("conteudo", secKey, function (sl, n) {
    var si = SECOES.findIndex(function (s) { return s[1] === secKey; });
    moldura(sl, si);
    fn(sl, n);
  }, { base: 14 });
}

module.exports = { pres: pres, pagina: pagina, conteudo: conteudo, divisor: divisor, moldura: moldura, SECOES: SECOES, INICIO: INICIO,
  PAGINAS: PAGINAS, META: META, RAIZ: RAIZ, CAP: CAP, VERSAO: VERSAO, GUIA: GUIA, CHAMA_BR: path.join(RAIZ, "assets/marca/chama-santander-branca.png") };
Object.keys(V).forEach(function (k) { module.exports[k] = V[k]; });

if (require.main === module) {
  if (!MODELO || !fs.existsSync(MODELO)) { console.error("Falta o modelo Santander 2026 (.pptx): node tools/guia/gerar-guia.js <capturas> <saida.pptx> <modelo.pptx>"); process.exit(1); }
  require("./conteudo-guia.js")(module.exports);
  PAGINAS.forEach(function (pg, i) { var sl = pres.addSlide(); pg.fn(sl, i + 1); V.fecharLinks(sl); });
  var tmp = SAIDA.replace(/\.pptx$/, ".gerado.pptx"), spec = SAIDA.replace(/\.pptx$/, ".modelo.json");
  fs.writeFileSync(spec, JSON.stringify(PAGINAS.map(function (p) { return p.modelo; })));
  pres.writeFile({ fileName: tmp }).then(function () {
    cp.execFileSync("python3", [path.join(__dirname, "no-modelo.py"), tmp, spec, MODELO, SAIDA], { stdio: "inherit" });
    fs.unlinkSync(tmp); fs.unlinkSync(spec);
    console.log("Guia: " + SAIDA + " (" + PAGINAS.length + " páginas)");
  });
}
