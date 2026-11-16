/*
 * Peças ilustrativas da demonstração (todas FICTÍCIAS): composições geométricas na identidade do case, sem pessoas,
 * sem fotos de banco de imagens e sem marcas de terceiros. Cada peça leva o selo "DEMO · DADOS FICTÍCIOS".
 * Gera PNG nos tamanhos que o report usa e dois vídeos curtos (WebM) a partir de quadros de uma animação em CSS.
 * Uso: node tools/portfolio/gerar-pecas.js   →   tools/portfolio/demo/assets/{pf,pj}/
 * Requer Node.js, Playwright (Chromium) e ffmpeg.
 */
"use strict";
var path = require("path"), fs = require("fs"), cp = require("child_process");
var chromium = require("playwright").chromium;
var RAIZ = path.join(__dirname, "..", "..");
var FONTES = "file://" + path.join(RAIZ, "docs", "assets", "fonts") + "/";
var SAIDA = path.join(__dirname, "demo", "assets");
var C = { ink: "#14161B", paper: "#F7F5F0", cobalt: "#2D5BFF", cobaltLight: "#DCE5FF", teal: "#0F8A7E", tealLight: "#D8F0EC", amber: "#F2B33D", coral: "#E8684A", violet: "#6E56CF" };

function css() {
  return "@font-face{font-family:IS;src:url(" + FONTES + "instrument-serif-latin-400-normal.woff2)}" +
    "@font-face{font-family:IS;font-style:italic;src:url(" + FONTES + "instrument-serif-latin-400-italic.woff2)}" +
    "@font-face{font-family:Inter;font-weight:500;src:url(" + FONTES + "inter-latin-500-normal.woff2)}" +
    "@font-face{font-family:Inter;font-weight:700;src:url(" + FONTES + "inter-latin-700-normal.woff2)}" +
    "@font-face{font-family:JB;src:url(" + FONTES + "jetbrains-mono-latin-500-normal.woff2)}" +
    "*{margin:0;box-sizing:border-box}body{width:var(--w);height:var(--h);overflow:hidden;font-family:Inter,Arial,sans-serif}" +
    ".selo{position:absolute;right:calc(var(--u)*2.2);top:calc(var(--u)*2.2);font:500 calc(var(--u)*1.05)/1 JB,monospace;letter-spacing:.08em;padding:calc(var(--u)*.7) calc(var(--u)*1.1);border-radius:999px;background:rgba(20,22,27,.78);color:#fff}" +
    ".rot{font:500 calc(var(--u)*1.25)/1 JB,monospace;letter-spacing:.14em;text-transform:uppercase}" +
    ".nome{font-family:IS,serif;line-height:.92;letter-spacing:-.01em}";
}
/* composição: fundo, formas e textos; u = unidade proporcional ao lado menor */
function peca(o) {
  var u = Math.min(o.w, o.h) / 40;
  var formas = (o.formas || []).map(function (f) { return '<div style="position:absolute;' + f + '"></div>'; }).join("");
  return "<!doctype html><html><head><meta charset=utf-8><style>" + css() + ":root{--w:" + o.w + "px;--h:" + o.h + "px;--u:" + u + "px}" + (o.extra || "") + "</style></head>" +
    '<body style="position:relative;background:' + o.fundo + ';color:' + (o.cor || C.ink) + '">' + formas +
    '<div style="position:absolute;left:' + (u * 2.6) + 'px;' + (o.textoTopo ? "top:" + (u * 2.6) + "px;" : "bottom:" + (u * 2.6) + "px;") + 'max-width:' + (o.larguraTexto || 70) + '%">' +
    '<div class="rot" style="opacity:.8;margin-bottom:' + (u * 1.2) + 'px">' + o.rotulo + "</div>" +
    '<div class="nome" style="font-size:' + (u * (o.tamNome || 5.4)) + 'px">' + o.nome + "</div>" +
    (o.frase ? '<div style="margin-top:' + (u * 1.2) + 'px;font:500 ' + (u * 1.45) + 'px/1.35 Inter,sans-serif;opacity:.86">' + o.frase + "</div>" : "") +
    "</div>" + (o.semSelo ? "" : '<div class="selo">DEMO · DADOS FICTÍCIOS</div>') + "</body></html>";
}
function circ(x, y, d, cor, extra) { return "left:" + x + ";top:" + y + ";width:" + d + ";height:" + d + ";border-radius:50%;background:" + cor + ";" + (extra || ""); }
function ret(x, y, w, h, cor, r, extra) { return "left:" + x + ";top:" + y + ";width:" + w + ";height:" + h + ";border-radius:" + (r || 0) + ";background:" + cor + ";" + (extra || ""); }

var PECAS = {
  pf: {
    "horizonte-principal.jpg": { w: 880, h: 880, fundo: C.cobalt, cor: "#fff", rotulo: "Campanha fictícia · PF", nome: "Campanha<br>Horizonte", frase: "Um novo jeito de planejar o mês.",
      formas: [circ("52%", "-18%", "70%", "rgba(255,255,255,.14)"), circ("64%", "8%", "36%", C.amber), circ("-12%", "64%", "34%", "rgba(20,22,27,.14)")] },
    "aurora-destaque.jpg": { w: 736, h: 1200, fundo: C.ink, cor: "#fff", rotulo: "Projeto fictício · PF", nome: "Projeto<br>Aurora", frase: "Vídeos curtos para quem está começando.", tamNome: 6.2,
      formas: [circ("-30%", "6%", "110%", "radial-gradient(circle at 60% 40%, " + C.coral + ", rgba(232,104,74,0) 70%)"), circ("38%", "18%", "52%", C.amber), ret("10%", "52%", "80%", "1.2%", "rgba(255,255,255,.35)", "99px")] },
    "conecta.jpg": { w: 1400, h: 548, fundo: C.tealLight, rotulo: "Lançamento fictício", nome: "Jornada Conecta", frase: "Conteúdos que acompanham cada etapa.", textoTopo: false, larguraTexto: 58,
      formas: [circ("62%", "-40%", "62%", C.teal), circ("80%", "38%", "30%", C.cobalt), ret("56%", "70%", "40%", "6%", C.ink, "99px")] },
    "vertice.jpg": { w: 1400, h: 548, fundo: C.paper, rotulo: "Lançamento fictício", nome: "Programa Vértice", frase: "Benefícios em três degraus.", larguraTexto: 58,
      formas: [ret("64%", "58%", "10%", "42%", C.cobalt, "14px 14px 0 0"), ret("75%", "38%", "10%", "62%", C.teal, "14px 14px 0 0"), ret("86%", "14%", "10%", "86%", C.amber, "14px 14px 0 0")] },
    "evolucao.jpg": { w: 1400, h: 548, fundo: C.violet, cor: "#fff", rotulo: "Lançamento fictício", nome: "Campanha Evolução", frase: "Antes e depois, em uma linha.", larguraTexto: 58,
      formas: [circ("62%", "20%", "14%", "rgba(255,255,255,.25)"), circ("72%", "14%", "20%", "rgba(255,255,255,.4)"), circ("84%", "6%", "26%", C.amber)] },
    "painel-print.jpg": { w: 1600, h: 900, fundo: "#EEF1F6", rotulo: "Tela fictícia · protótipo", nome: "Painel de criativos", frase: "Peças, status e próximos passos num lugar só.", textoTopo: true, larguraTexto: 40, tamNome: 4.2,
      formas: [ret("46%", "10%", "48%", "80%", "#fff", "18px", "box-shadow:0 10px 40px rgba(20,22,27,.12)"), ret("50%", "16%", "18%", "26%", C.cobaltLight, "12px"), ret("71%", "16%", "19%", "26%", C.tealLight, "12px"),
        ret("50%", "48%", "40%", "3%", "#E4E0D8", "99px"), ret("50%", "55%", "32%", "3%", "#E4E0D8", "99px"), ret("50%", "62%", "36%", "3%", "#E4E0D8", "99px"), ret("50%", "74%", "12%", "8%", C.cobalt, "10px")] },
    "icone.png": { w: 96, h: 96, fundo: C.cobalt, semSelo: true, rotulo: "", nome: "", formas: [ret("22%", "26%", "56%", "12%", "#fff", "99px"), ret("22%", "46%", "38%", "12%", "rgba(255,255,255,.6)", "99px"), ret("22%", "66%", "48%", "12%", C.amber, "99px")] }
  },
  pj: {
    "vertice-principal.jpg": { w: 736, h: 920, fundo: C.teal, cor: "#fff", rotulo: "Campanha fictícia · PJ", nome: "Programa<br>Vértice", frase: "Da primeira conversa à conta aberta.", tamNome: 6.2,
      formas: [ret("54%", "8%", "36%", "18%", "rgba(255,255,255,.2)", "18px"), ret("40%", "28%", "50%", "18%", "rgba(255,255,255,.32)", "18px"), ret("26%", "48%", "64%", "18%", C.amber, "18px")] },
    "conecta-destaque.jpg": { w: 736, h: 1200, fundo: C.paper, rotulo: "Jornada fictícia · PJ", nome: "Conecta<br>Negócios", frase: "Encontros mensais com empresas parceiras.", tamNome: 6.2,
      formas: [circ("8%", "8%", "44%", C.cobalt), circ("46%", "16%", "44%", C.teal, "mix-blend-mode:multiply"), circ("27%", "34%", "44%", C.amber, "mix-blend-mode:multiply")] },
    "impulso.jpg": { w: 1400, h: 548, fundo: C.cobaltLight, rotulo: "Lançamento fictício", nome: "Impulso PME", frase: "Crédito explicado em três telas.", larguraTexto: 58,
      formas: [ret("60%", "30%", "34%", "12%", C.cobalt, "99px"), ret("66%", "50%", "28%", "12%", C.teal, "99px"), ret("72%", "70%", "22%", "12%", C.ink, "99px")] },
    "rota.jpg": { w: 1400, h: 548, fundo: C.ink, cor: "#fff", rotulo: "Lançamento fictício", nome: "Rota Exportação", frase: "Guia prático para vender fora.", larguraTexto: 58,
      formas: [circ("70%", "18%", "64%", "rgba(255,255,255,.08)"), circ("78%", "34%", "32%", C.teal), ret("60%", "58%", "36%", "1.6%", C.amber, "99px")] },
    "painel-print.jpg": { w: 1600, h: 900, fundo: "#EEF4F3", rotulo: "Tela fictícia · protótipo", nome: "Agenda de parceiros", frase: "Convites, presença e retorno de cada encontro.", textoTopo: true, larguraTexto: 40, tamNome: 4.2,
      formas: [ret("46%", "10%", "48%", "80%", "#fff", "18px", "box-shadow:0 10px 40px rgba(20,22,27,.12)"), ret("50%", "16%", "40%", "8%", C.tealLight, "10px"), ret("50%", "28%", "40%", "8%", "#F1EFEA", "10px"), ret("50%", "40%", "40%", "8%", "#F1EFEA", "10px"), ret("50%", "56%", "18%", "26%", C.cobaltLight, "12px"), ret("71%", "56%", "19%", "26%", "#FCEFD2", "12px")] }
  }
};
/* vídeos: quadros de uma animação em CSS (a mesma composição, com as formas em movimento) */
var VIDEOS = {
  pf: { arquivo: "horizonte-video.webm", capa: "horizonte-video.jpg", w: 540, h: 540, base: "horizonte-principal.jpg" },
  pj: { arquivo: "vertice-video.webm", capa: "vertice-video.jpg", w: 1400, h: 548, base: null }
};

(async function () {
  var browser = await chromium.launch();
  for (var seg of Object.keys(PECAS)) {
    var dir = path.join(SAIDA, seg); fs.mkdirSync(dir, { recursive: true });
    for (var nome of Object.keys(PECAS[seg])) {
      var o = PECAS[seg][nome], p = await browser.newPage({ viewport: { width: o.w, height: o.h } });
      await p.setContent(peca(o)); await p.evaluate(function () { return document.fonts.ready; }); await p.waitForTimeout(150);
      await p.screenshot(/\.jpg$/.test(nome) ? { path: path.join(dir, nome), type: "jpeg", quality: 88 } : { path: path.join(dir, nome) }); await p.close();
      console.log(seg + "/" + nome + " " + o.w + "x" + o.h);
    }
  }
  /* vídeo PF (quadrado) e PJ (horizontal): 4 s a 25 qps */
  var tmp = path.join(SAIDA, "_quadros");
  var cenas = {
    pf: { w: 540, h: 540, fundo: C.cobalt, cor: "#fff", rotulo: "Vídeo fictício · PF", nome: "Campanha<br>Horizonte", frase: "Teaser de demonstração", tamNome: 5.2,
      formas: [circ("52%", "-18%", "70%", "rgba(255,255,255,.14)", "animation:a 4s linear infinite"), circ("64%", "8%", "36%", C.amber, "animation:b 4s ease-in-out infinite")] },
    pj: { w: 1400, h: 548, fundo: C.teal, cor: "#fff", rotulo: "Vídeo fictício · PJ", nome: "Programa Vértice", frase: "Teaser de demonstração", larguraTexto: 58,
      formas: [ret("60%", "64%", "8%", "36%", "rgba(255,255,255,.3)", "12px 12px 0 0", "animation:c 4s ease-in-out infinite"), ret("71%", "44%", "8%", "56%", "rgba(255,255,255,.5)", "12px 12px 0 0", "animation:c 4s ease-in-out -.5s infinite"), ret("82%", "20%", "8%", "80%", C.amber, "12px 12px 0 0", "animation:c 4s ease-in-out -1s infinite")] }
  };
  var anim = "@keyframes a{to{transform:rotate(360deg) translateX(8%)}}@keyframes b{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(18%) scale(.9)}}@keyframes c{0%,100%{transform:scaleY(1);transform-origin:bottom}50%{transform:scaleY(.7);transform-origin:bottom}}";
  for (var s of Object.keys(cenas)) {
    var o2 = cenas[s], v = VIDEOS[s]; o2.extra = anim + "div{animation-play-state:paused!important}";
    fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp, { recursive: true });
    var pg = await browser.newPage({ viewport: { width: o2.w, height: o2.h } });
    await pg.setContent(peca(o2)); await pg.evaluate(function () { return document.fonts.ready; });
    for (var q = 0; q < 100; q++) {
      await pg.evaluate(function (t) { document.getAnimations().forEach(function (a) { a.currentTime = t; }); }, q * 40);
      await pg.screenshot({ path: path.join(tmp, String(q).padStart(4, "0") + ".png") });
    }
    cp.execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", path.join(tmp, "0030.png"), "-q:v", "3", path.join(SAIDA, s, v.capa)]);
    await pg.close();
    cp.execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-framerate", "25", "-i", path.join(tmp, "%04d.png"), "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "38", "-pix_fmt", "yuv420p", "-an", path.join(SAIDA, s, v.arquivo)]);
    console.log(s + "/" + v.arquivo + " e " + v.capa);
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  await browser.close();
})().catch(function (e) { console.error(e); process.exit(1); });
