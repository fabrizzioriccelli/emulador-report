/*
 * Banner do README (claro e escuro) e imagem de prévia social do repositório, montados com capturas REAIS da galeria
 * (docs/assets/screenshots/). Tipografia aberta (Instrument Serif, Inter, JetBrains Mono · SIL OFL).
 * Uso: node tools/portfolio/gerar-banner.js   →   docs/assets/brand/{banner-claro,banner-escuro,social-preview}.png
 */
"use strict";
var path = require("path"), fs = require("fs");
var chromium = require("playwright").chromium;
var RAIZ = path.join(__dirname, "..", "..");
var A = "file://" + path.join(RAIZ, "docs", "assets") + "/";

function html(o) {
  var escuro = o.tema === "escuro";
  var ink = "#14161B", paper = "#F7F5F0", fg = escuro ? paper : ink, bg = escuro ? ink : paper, muted = escuro ? "rgba(247,245,240,.68)" : "#5D6270";
  return "<!doctype html><html><head><meta charset=utf-8><style>" +
    "@font-face{font-family:IS;src:url(" + A + "fonts/instrument-serif-latin-400-normal.woff2)}@font-face{font-family:IS;font-style:italic;src:url(" + A + "fonts/instrument-serif-latin-400-italic.woff2)}" +
    "@font-face{font-family:Inter;font-weight:500;src:url(" + A + "fonts/inter-latin-500-normal.woff2)}@font-face{font-family:Inter;font-weight:600;src:url(" + A + "fonts/inter-latin-600-normal.woff2)}" +
    "@font-face{font-family:JB;src:url(" + A + "fonts/jetbrains-mono-latin-500-normal.woff2)}" +
    "*{margin:0;box-sizing:border-box}body{width:" + o.w + "px;height:" + o.h + "px;overflow:hidden;background:" + bg + ";color:" + fg + ";font-family:Inter,sans-serif;position:relative}" +
    ".grade{position:absolute;inset:0;background-image:linear-gradient(" + (escuro ? "rgba(255,255,255,.045)" : "rgba(20,22,27,.05)") + " 1px,transparent 1px),linear-gradient(90deg," + (escuro ? "rgba(255,255,255,.045)" : "rgba(20,22,27,.05)") + " 1px,transparent 1px);background-size:40px 40px;mask-image:linear-gradient(90deg,#000 0,#000 40%,transparent 75%)}" +
    ".txt{position:absolute;left:" + o.pad + "px;top:50%;transform:translateY(-50%);width:" + o.txtW + "px}" +
    ".marca{display:flex;align-items:center;gap:14px;font:600 " + o.s(17) + "px Inter;letter-spacing:.01em;margin-bottom:" + o.s(26) + "px}.marca img{width:" + o.s(44) + "px;height:" + o.s(44) + "px}" +
    "h1{font:400 " + o.s(64) + "px/1.0 IS,serif;letter-spacing:-.015em}h1 em{font-style:italic;color:" + (escuro ? "#8FA9FF" : "#2D5BFF") + "}" +
    "p{margin-top:" + o.s(20) + "px;font:500 " + o.s(19) + "px/1.45 Inter;color:" + muted + ";max-width:" + o.s(470) + "px}" +
    ".tags{display:flex;gap:8px;flex-wrap:wrap;margin-top:" + o.s(26) + "px}.tags span{font:500 " + o.s(12.5) + "px JB,monospace;letter-spacing:.06em;padding:6px 10px;border-radius:8px;border:1px solid " + (escuro ? "rgba(247,245,240,.22)" : "rgba(20,22,27,.16)") + "}" +
    ".tags .demo{background:#F2B33D;color:#14161B;border-color:#F2B33D}" +
    ".tela{position:absolute;border-radius:14px;overflow:hidden;box-shadow:0 24px 60px rgba(20,22,27," + (escuro ? ".55" : ".22") + "),0 0 0 1px rgba(20,22,27,.08);background:#fff}" +
    ".tela img{display:block;width:100%}" +
    ".cel{position:absolute;border-radius:26px;overflow:hidden;border:6px solid " + ink + ";box-shadow:0 24px 60px rgba(20,22,27,.35);background:#fff}.cel img{display:block;width:100%}" +
    "</style></head><body><div class=grade></div>" +
    '<div class=txt><div class=marca><img src="' + A + (escuro ? "brand/marca-clara.svg" : "brand/marca.svg") + '">Emulador Report · case de portfólio</div>' +
    "<h1>Reports de performance,<br><em>editados na própria página.</em></h1>" +
    "<p>Dois emuladores, PF e PJ, que transformam o report mensal de marketing em uma página editável — e em um e-mail executivo pronto para o Outlook.</p>" +
    '<div class=tags><span>HTML + JS</span><span>SEM INSTALAÇÃO</span><span>.HTML → .EML</span><span class=demo>DADOS FICTÍCIOS</span></div></div>' +
    '<div class=tela style="left:' + o.tela[0] + "px;top:" + o.tela[1] + "px;width:" + o.tela[2] + 'px"><img src="' + A + 'screenshots/05-adicionar-item.webp"></div>' +
    '<div class=tela style="left:' + o.tela2[0] + "px;top:" + o.tela2[1] + "px;width:" + o.tela2[2] + 'px"><img src="' + A + 'screenshots/10-email-resumo.webp"></div>' +
    '<div class=cel style="left:' + o.cel[0] + "px;top:" + o.cel[1] + "px;width:" + o.cel[2] + 'px"><img src="' + A + 'screenshots/13-celular.webp"></div>' +
    "</body></html>";
}

(async function () {
  var browser = await chromium.launch();
  var S1 = function (x) { return x; }, S2 = function (x) { return Math.round(x * 0.92); };
  var pecas = [
    ["banner-claro.png", { tema: "claro", w: 1600, h: 680, pad: 84, txtW: 680, s: S1, tela: [760, 96, 820], tela2: [930, 380, 620], cel: [1400, 250, 190] }],
    ["banner-escuro.png", { tema: "escuro", w: 1600, h: 680, pad: 84, txtW: 680, s: S1, tela: [760, 96, 820], tela2: [930, 380, 620], cel: [1400, 250, 190] }],
    ["social-preview.png", { tema: "escuro", w: 1280, h: 640, pad: 64, txtW: 560, s: S2, tela: [640, 90, 700], tela2: [760, 360, 520], cel: [1110, 230, 160] }]
  ];
  for (var x of pecas) {
    var p = await browser.newPage({ viewport: { width: x[1].w, height: x[1].h }, deviceScaleFactor: x[0] === "social-preview.png" ? 1 : 2 });
    var tmp = path.join(RAIZ, "docs/assets/brand/_banner.html"); fs.writeFileSync(tmp, html(x[1])); await p.goto("file://" + tmp); await p.evaluate(function () { return document.fonts.ready; }); await p.waitForTimeout(600);
    await p.screenshot({ path: path.join(RAIZ, "docs/assets/brand", x[0]) }); await p.close(); fs.rmSync(tmp);
    console.log(x[0]);
  }
  await browser.close();
})().catch(function (e) { console.error(e); process.exit(1); });
