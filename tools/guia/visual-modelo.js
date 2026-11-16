/*
 * Sistema visual do modelo oficial Santander 2026 (Template_SANTANTANDER26_HZ_PT_.pptx), usado pelo guia operacional
 * e pela apresentação do treinamento. Página 20 x 11,25 in (medidas em pontos de 1440 x 810, como o modelo).
 * Do modelo: Arimo (fonte embutida no modelo), títulos em Vermelho Santander (EC0000) sem negrito, texto em preto,
 * painéis Lisboa (FBF1EA) sobre branco, aberturas com o painel Lisboa e a chama grande, número da página em cinza.
 * A chama pequena, o número da página e os painéis de abertura vêm da própria página-base do modelo (tools/guia/no-modelo.py).
 * Os caracteres que a Arimo não tem (✓ ⠿ ↶ ↷) vão em Segoe UI Symbol.
 */
"use strict";
var path = require("path");
var LARG = require("./arimo-larguras.json");

module.exports = function (pres, META, CAP) {
  /* sem preto puro: textos em grafite; números e títulos em Vermelho Santander, Boston ou branco (guide) */
  var C = { vm: "EC0000", boston: "CC0000", london: "990000", rio: "F5DECF", lisboa: "FBF1EA", cartao: "FBF1EA", br: "FFFFFF", pt: "222222", txt: "333333",
    cinza: "808080", linha: "EBDDD3", verde: "21634F", verdeF: "A3E0CE", ambar: "945400", ambarF: "FFE1B9", mexico: "F0B998" };
  var FT = "Arimo", FX = "Arimo", SIMB = "Segoe UI Symbol", RE_SIMB = /([✓⠿↶↷✗✕▶])/;
  function I(pt) { return pt / 72; }

  /* medidas de texto com as larguras reais da Arimo */
  function largura(t, s, b) { var d = LARG[b ? "b" : "r"], w = 0; for (var i = 0; i < t.length; i++) w += d[t[i]] || 0.6; return w * s; }
  function quebra(t, s, w, b) {
    var linhas = 0;
    String(t).split("\n").forEach(function (par) {
      var atual = 0, n = 1, esp = largura(" ", s, b);
      par.split(" ").forEach(function (p) { var lp = largura(p, s, b); if (atual > 0 && atual + esp + lp > w) { n++; atual = lp; } else atual += (atual > 0 ? esp : 0) + lp; });
      linhas += n;
    });
    return linhas;
  }

  /* runs com os símbolos em Segoe UI Symbol */
  function separar(runs) {
    var out = [];
    runs.forEach(function (r) {
      String(r.text).split(RE_SIMB).forEach(function (pedaco) {
        if (!pedaco) return;
        var o = JSON.parse(JSON.stringify(r.options || {}));
        if (RE_SIMB.test(pedaco)) o.fontFace = SIMB;
        out.push({ text: pedaco, options: o });
      });
    });
    return out;
  }
  /* Links: nunca no texto (o PowerPoint pinta texto com link de azul e sublinha); o texto fica com as cores do modelo
     e uma área clicável invisível por cima leva ao destino. */
  function texto(sl, t, o) {
    var runs = Array.isArray(t) ? t : [{ text: t, options: {} }], link = o.link;
    runs = runs.map(function (r) { r = typeof r === "string" ? { text: r, options: {} } : JSON.parse(JSON.stringify(r)); r.options = r.options || {}; if (r.options.hyperlink) { link = link || r.options.hyperlink; delete r.options.hyperlink; } return r; });
    sl.addText(separar(runs), {
      x: I(o.x), y: I(o.y), w: I(o.w), h: I(o.h || o.s * 1.6), margin: 0, isTextBox: true,
      fontFace: o.f === "fx" ? FX : FT, fontSize: o.s, bold: o.b !== undefined ? o.b : o.f !== "fx", italic: !!o.it, color: o.c || C.pt,
      align: o.al || "left", valign: o.va || "top", lineSpacingMultiple: o.ls || (o.f === "fx" ? 1.2 : 1.05), paraSpaceAfter: o.pa || 0, charSpacing: o.cs || 0,
      fit: "none", objectName: o.nome
    });
    if (link) clique(sl, o.x, o.y, o.w, o.h || o.s * 1.6, link, true);
  }
  /* caixa com link: a caixa leva ao destino; o que for desenhado por cima ganha a área clicável (ver fecharLinks) */
  function caixa(sl, x, y, w, h, o) {
    o = o || {};
    sl.addShape(o.r === 0 ? pres.shapes.RECTANGLE : pres.shapes.ROUNDED_RECTANGLE, {
      x: I(x), y: I(y), w: I(w), h: I(h), rectRadius: o.r === 0 ? undefined : I(o.r || 18),
      fill: o.fill ? { color: o.fill, transparency: o.transp || 0 } : { type: "none" }, line: o.line ? { color: o.line, width: o.lw || 1, dashType: o.tracejado ? "dash" : "solid" } : { type: "none" }, hyperlink: o.link, objectName: o.nome
    });
    if (o.link) sl.__links = (sl.__links || []).concat([{ x: x, y: y, w: w, h: h, link: o.link, r: o.r }]);
  }
  /* área clicável invisível (por cima de um elemento do modelo, ex.: o botão "Começa agora" da capa) */
  function clique(sl, x, y, w, h, link, reto) { sl.addShape(reto ? pres.shapes.RECTANGLE : pres.shapes.ROUNDED_RECTANGLE, { x: I(x), y: I(y), w: I(w), h: I(h), rectRadius: reto ? undefined : I(Math.min(h, w) / 2), fill: { color: "FFFFFF", transparency: 100 }, line: { type: "none" }, hyperlink: JSON.parse(JSON.stringify(link)), objectName: "Área clicável" }); }
  /* no fim da página: as caixas com link ganham uma área clicável por cima de tudo (o texto em cima delas também leva) */
  function fecharLinks(sl) { (sl.__links || []).forEach(function (l) { clique(sl, l.x, l.y, l.w, l.h, l.link, true); }); sl.__links = []; }
  function pilula(sl, t, x, y, w, h, o) {
    caixa(sl, x, y, w, h, { r: h / 2, fill: o.fill, line: o.line, lw: o.lw || 1 });
    texto(sl, t, { x: x, y: y, w: w, h: h, s: o.s || 12.5, c: o.c, al: "center", va: "middle", f: o.f, b: o.b });
    if (o.link) clique(sl, x, y, w, h, o.link);
  }
  function circulo(sl, t, x, y, d, fill, cor, s) {
    sl.addShape(pres.shapes.OVAL, { x: I(x), y: I(y), w: I(d), h: I(d), fill: { color: fill }, line: { type: "none" } });
    texto(sl, t, { x: x, y: y, w: d, h: d, s: s || d * 0.5, c: cor, al: "center", va: "middle" });
  }
  function seta(sl, x, y, d, fill, cor, link) {
    sl.addShape(pres.shapes.OVAL, { x: I(x), y: I(y), w: I(d), h: I(d), fill: { color: fill }, line: { type: "none" } });
    texto(sl, "→", { x: x, y: y - 1, w: d, h: d, s: d * 0.55, c: cor, al: "center", va: "middle" });
    if (link) clique(sl, x, y, d, d, link);
  }
  /* etiqueta do segmento: PF (contorno vermelho) e PJ (Rio com texto Boston) */
  function tags(sl, segs, x, y) {
    segs.forEach(function (s) {
      if (s === "PF") pilula(sl, "PF", x, y, 46, 26, { fill: C.br, line: C.vm, c: C.vm, s: 12 });
      else pilula(sl, "PJ", x, y, 46, 26, { fill: C.rio, c: C.boston, s: 12 });
      x += 52;
    });
  }
  /* título do modelo: Vermelho Santander, sem negrito; subtítulo preto */
  function titulo(sl, t, sub, segs) {
    texto(sl, t, { x: 64, y: 62, w: segs ? 1180 : 1310, h: 54, s: 44, b: false, c: C.vm, ls: 1.0 });
    if (segs) tags(sl, segs, 1377 - segs.length * 52 + 6, 76);
    if (sub) texto(sl, sub, largura(sub, 22, false) > 1310 ? { x: 64, y: 124, w: 1310, h: 44, s: 16, b: false, c: C.pt } : { x: 64, y: 128, w: 1310, h: 32, s: 22, b: false, c: C.pt });
  }

  /* ---------- blocos ---------- */
  function passos(sl, x, y, w, h, lista, o) {
    o = o || {};
    caixa(sl, x, y, w, h, { fill: o.fill || C.cartao, r: 18 });
    var cy = y + 22, s = o.s || 15.5, alt = o.alt || 0;
    if (o.cab) { texto(sl, o.cab, { x: x + 26, y: cy, w: w - 52, h: 30, s: 19, c: C.pt }); cy += 38; }
    lista.forEach(function (p, i) {
      var linhas = quebra(p[0] + (p[1] ? " " + p[1] : ""), s, w - 92, false), hh = alt || Math.max(28, linhas * s * 1.2 * 1.17 + 4);
      circulo(sl, String(i + 1), x + 24, cy + 1, 26, C.vm, C.br, 13);
      texto(sl, [{ text: p[0] + (p[1] ? " " : ""), options: { bold: true, color: C.pt } }, { text: p[1], options: { bold: false, color: C.txt } }],
        { x: x + 62, y: cy, w: w - 88, h: hh, s: s, f: "fx" });
      cy += hh + 10;
      if (i < lista.length - 1) sl.addShape(pres.shapes.LINE, { x: I(x + 62), y: I(cy - 6), w: I(w - 88), h: 0, line: { color: C.linha, width: 0.75 } });
    });
    return cy;
  }
  function aviso(sl, x, y, w, h, t, rot, simbolo, cor) {
    caixa(sl, x, y, w, h, { fill: C.cartao, r: 18 });
    circulo(sl, simbolo, x + 22, y + 18, 28, cor, C.br, 15);
    texto(sl, rot, { x: x + 60, y: y + 19, w: w - 80, h: 26, s: 17, c: C.pt });
    texto(sl, t, { x: x + 60, y: y + 46, w: w - 84, h: h - 54, s: 14.5, f: "fx", b: false, c: C.txt });
  }
  function confirmar(sl, x, y, w, h, t, rot) { aviso(sl, x, y, w, h, t, rot || "Como confirmar", "✓", C.verde); }
  function atencao(sl, x, y, w, h, t, rot) { aviso(sl, x, y, w, h, t, rot || "Atenção", "!", C.ambar); }
  function diferencaPJ(sl, x, y, w, h, t) {
    caixa(sl, x, y, w, h, { fill: C.cartao, r: 18 });
    pilula(sl, "No PJ", x + 20, y + 18, 74, 26, { fill: C.rio, c: C.boston, s: 12.5 });
    texto(sl, t, { x: x + 108, y: y + 19, w: w - 128, h: h - 30, s: 14.5, f: "fx", b: false, c: C.txt });
  }
  /* captura real num painel Lisboa, com as marcações [{i: índice da caixa gravada na captura, n: número}] */
  function captura(sl, nome, x, y, w, h, marcas, o) {
    o = o || {};
    var m = META[nome]; if (!m) throw new Error("captura não encontrada: " + nome);
    caixa(sl, x, y, w, h, { fill: o.fill || C.cartao, r: 18 });
    var pad = 14, cab = o.rot ? 30 : 0, bw = w - pad * 2, bh = h - pad * 2 - cab, esc = Math.min(bw / m.w, bh / m.h), iw = m.w * esc, ih = m.h * esc, ix = x + pad + (bw - iw) / 2, iy = y + pad + cab + (bh - ih) / 2;
    if (o.rot) { texto(sl, o.rot, { x: x + pad + 4, y: y + 12, w: w - 40, h: 22, s: 12, c: C.cinza, cs: 1.5 }); if (o.seg) tags(sl, [o.seg], x + w - pad - 46, y + 9); }
    sl.addImage({ path: path.join(CAP, m.arquivo), x: I(ix), y: I(iy), w: I(iw), h: I(ih), altText: "Captura de tela real do emulador: " + (m.legenda || nome) + " (dados fictícios de treinamento)" });
    sl.addShape(pres.shapes.RECTANGLE, { x: I(ix), y: I(iy), w: I(iw), h: I(ih), fill: { type: "none" }, line: { color: C.linha, width: 0.75 } });
    var pos = [];
    (marcas || []).forEach(function (mk) {
      var c = m.caixas[mk.i]; if (!c) throw new Error("marca sem caixa: " + nome + " #" + mk.i);
      var x0 = Math.max(0, c.x), y0 = Math.max(0, c.y), x1 = Math.min(1, c.x + c.w), y1 = Math.min(1, c.y + c.h);
      if (x1 <= x0 || y1 <= y0) throw new Error("marca fora da captura: " + nome + " #" + mk.i);
      /* marcação de algo fino (ex.: a linha "Soltar aqui"): um pouco mais larga, centrada */
      var mw = 10 / iw, mh = 10 / ih;
      if (x1 - x0 < mw) { var cxm = (x0 + x1) / 2; x0 = Math.max(0, cxm - mw / 2); x1 = Math.min(1, cxm + mw / 2); }
      if (y1 - y0 < mh) { var cym = (y0 + y1) / 2; y0 = Math.max(0, cym - mh / 2); y1 = Math.min(1, cym + mh / 2); }
      var bx = Math.max(ix, ix + x0 * iw - 3), by = Math.max(iy, iy + y0 * ih - 3), bw2 = Math.min(ix + iw, ix + x1 * iw + 3) - bx, bh2 = Math.min(iy + ih, iy + y1 * ih + 3) - by;
      caixa(sl, bx, by, bw2, bh2, { r: 6, line: C.vm, lw: 2.25 });
      if (mk.n) circulo(sl, String(mk.n), Math.max(ix - 6, bx - 13), Math.max(iy - 6, by - 13), 26, C.vm, C.br, 13);
      pos.push({ x: bx, y: by, w: bw2, h: bh2 });
    });
    /* o selo fica à direita (a caixa não chega perto da chama, no canto de baixo à esquerda) */
    if (!o.semSelo) texto(sl, w < 460 ? "CAPTURA REAL · FICTÍCIO" : "CAPTURA REAL · DADOS FICTÍCIOS DE TREINAMENTO", { x: x + w - Math.min(w - 28, w < 460 ? 190 : 360) - 14, y: y + h + 5, w: Math.min(w - 28, w < 460 ? 190 : 360), h: 14, s: 9, c: C.cinza, cs: 1.2, al: "right" });
    return { x: ix, y: iy, w: iw, h: ih, marcas: pos };
  }
  function esquema(sl, x, y, w, h, linhas, rot) {
    caixa(sl, x, y, w, h, { fill: C.cartao, r: 18 });
    texto(sl, rot || "ESQUEMA (NÃO É CAPTURA DE TELA)", { x: x + 24, y: y + 18, w: w - 48, h: 18, s: 11, c: C.cinza, cs: 1.5 });
    sl.addText(linhas.join("\n"), { x: I(x + 24), y: I(y + 44), w: I(w - 48), h: I(h - 60), margin: 0, fontFace: "Courier New", fontSize: 13.5, color: C.txt, valign: "top", isTextBox: true, lineSpacingMultiple: 1.15 });
  }
  /* tabela no estilo do modelo: cabeçalho em Vermelho Santander, linhas brancas e Lisboa */
  function tabela(sl, x, y, w, cab, linhas, larg, o) {
    o = o || {};
    var links = [], rows = [cab.map(function (t) { return { text: t, options: { bold: true, fontFace: FT, color: C.br, fill: { color: C.vm }, fontSize: o.s || 13.5 } }; })];
    linhas.forEach(function (l, i) {
      rows.push(l.map(function (t, j) {
        var r = typeof t === "object" ? t : { text: String(t) };
        if (r.link) links.push({ x: x + larg.slice(0, j).reduce(function (a, b) { return a + b; }, 0), y: y + (o.rowH || 30) * (i + 1), w: larg[j], h: o.rowH || 30, link: r.link });
        return { text: r.text, options: { fontFace: FT, bold: j === 0, color: r.link ? C.vm : C.pt, fill: { color: i % 2 ? C.lisboa : C.br }, fontSize: o.s || 13.5 } };
      }));
    });
    sl.addTable(rows, { x: I(x), y: I(y), w: I(w), colW: larg.map(I), border: { type: "solid", color: C.linha, pt: 0.75 }, margin: 0.08, valign: "middle", rowH: I(o.rowH || 30), autoPage: false });
    links.forEach(function (l) { clique(sl, l.x, l.y, l.w, l.h, l.link, true); });
  }
  function cartaoTexto(sl, x, y, w, h, cab, t, o) {
    o = o || {};
    caixa(sl, x, y, w, h, { fill: o.fill || C.cartao, r: 18, link: o.link });
    if (o.eyebrow) pilula(sl, o.eyebrow, x + 22, y + 20, Math.max(64, largura(o.eyebrow, 11.5, true) + 28), 24, { fill: o.eyeFill || C.br, c: o.eyeCor || C.boston, s: 11.5 });
    var oy = o.eyebrow ? 56 : 22;
    texto(sl, cab, { x: x + 24, y: y + oy, w: w - 48, h: 30, s: o.sc || 20, c: o.cc || C.boston });
    if (t) texto(sl, t, { x: x + 24, y: y + oy + (o.sc || 20) * 1.6, w: w - 48, h: h - oy - 40, s: o.st || 14.5, f: "fx", b: false, c: o.ct || C.txt });
  }
  /* seta reta (para as demonstrações antes → depois) */
  function flecha(sl, x1, y1, x2, y2, o) {
    o = o || {};
    sl.addShape(pres.shapes.LINE, { x: I(Math.min(x1, x2)), y: I(Math.min(y1, y2)), w: I(Math.abs(x2 - x1)), h: I(Math.abs(y2 - y1)), flipH: x2 < x1, flipV: y2 < y1, line: { color: o.cor || C.vm, width: o.lw || 3, endArrowType: "triangle" } });
  }

  return { C: C, I: I, FT: FT, FX: FX, largura: largura, quebra: quebra, texto: texto, caixa: caixa, clique: clique, fecharLinks: fecharLinks, pilula: pilula, circulo: circulo, seta: seta, tags: tags, titulo: titulo,
    passos: passos, confirmar: confirmar, atencao: atencao, diferencaPJ: diferencaPJ, captura: captura, esquema: esquema, tabela: tabela, cartaoTexto: cartaoTexto, flecha: flecha };
};
