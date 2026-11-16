/*
 * Galeria do portfólio: capturas REAIS dos emuladores de demonstração e dos reports gerados (docs/demo/), com dados
 * fictícios, em alta resolução (2x). Cada captura mostra um momento da experiência no estado real da interface.
 * Precisa de docs/ servido por http:  python3 -m http.server 8765 --directory docs
 * Uso: node tools/portfolio/capturas.js   →   docs/assets/screenshots/*.webp (+ capturas.json com as legendas)
 * Requer Node.js, Playwright e Python 3 com Pillow (conversão para WebP).
 */
"use strict";
var path = require("path"), fs = require("fs"), cp = require("child_process");
var S = require("./sessao.js");
var SAIDA = path.join(S.RAIZ, "docs", "assets", "screenshots"), TMP = path.join(require("os").tmpdir(), "demo-capturas");
fs.rmSync(TMP, { recursive: true, force: true }); fs.mkdirSync(TMP, { recursive: true }); fs.mkdirSync(SAIDA, { recursive: true });
var LISTA = [];

async function foto(s, nome, legenda, opc) {
  opc = opc || {};
  await s.p.evaluate(function (c) { var x = document.getElementById("cursorDemo"); if (x) x.style.display = c ? "" : "none"; var l = document.getElementById("legendaDemo"); if (l) l.style.display = "none"; }, !!opc.cursor);
  await s.p.waitForTimeout(350);
  var arq = path.join(TMP, nome + ".png");
  await s.p.screenshot(Object.assign({ path: arq }, opc.clip ? { clip: opc.clip } : {}, opc.inteira ? { fullPage: true } : {}));
  LISTA.push({ arquivo: nome + ".webp", legenda: legenda });
  console.log("  " + nome + " · " + legenda);
}

(async function () {
  /* 1 e 2 · telas iniciais */
  var s = await S.abrir({ escala: 2, cursor: false }), p = s.p;
  await s.ir_para("pf"); await foto(s, "01-emulador-pf", "Emulador Report PF: abre no navegador, sem instalar nada");
  await s.ir_para("pj"); await foto(s, "02-emulador-pj", "Emulador Report PJ: o mesmo sistema, com a identidade do segmento");

  /* 3 a 8 · edição no report fictício do PF */
  await s.ir_para("pf"); await s.abrirDemo(); await s.rolarPara("#secEditar");
  await s.rolarAte('[data-campo="frase"]', 0.3); await s.semBarra();
  await s.noCampo('[data-campo="frase_final"]', undefined, { dx: 260 });
  await s.p.keyboard.press("End");
  await foto(s, "03-edicao-texto", "Clique e escreva: o texto vira campo editável na própria página", { cursor: true });
  await s.p.keyboard.press("Escape"); await s.semBarra();
  await s.rolarAte('[data-campo="numero-2.variacao"]', 0.45); await s.semBarra();
  await s.noCampo('[data-campo="numero-2.variacao"]');
  await foto(s, "04-indicadores", "Indicadores e etiquetas: valor, variação, cor e referência", { cursor: true });
  await s.semBarra();
  await s.rolarAte('[data-item="lancamento-2"]', 0.45); await s.semBarra();
  var n = await s.retF('[data-item="lancamento-2"] [data-campo$=".nome"]'); await s.ir(n.x + n.w / 2, n.y + n.h / 2, 200); await p.waitForTimeout(900);
  await foto(s, "05-adicionar-item", "Barra do item: + Novo item, arrastar, mover para outra seção, link, imagem", { cursor: true });
  await s.botaoBarra("Mover para outra seção"); await p.waitForTimeout(1000);
  await foto(s, "06-organizar", "Organizar: mover um item para outra seção do mesmo tipo, com textos e números");
  await s.noBotao("#modalCancelar").catch(async function () { await p.keyboard.press("Escape"); }); await p.waitForTimeout(500); await s.semBarra();
  await s.rolarAte('img[data-img="principal"]', 0.35); await s.semBarra();
  var im = await s.retF('img[data-img="principal"]'); await s.ir(im.x + im.w / 2, im.y + im.h / 2, 200); await p.waitForTimeout(900);
  await foto(s, "07-imagem-video", "Imagens e vídeos: trocar imagem, colocar vídeo, imagem embaixo", { cursor: true });
  await s.semBarra(); await s.rolarPara("#secEditar"); await s.noBotao('[data-ew="390px"]', 200); await p.waitForTimeout(1500);
  await foto(s, "08-previa-celular", "Prévia no celular antes de salvar");
  await s.noBotao('[data-ew="100%"]', 200); await p.waitForTimeout(600);
  await s.fechar();

  /* 9 · o report final (página gerada) */
  s = await S.abrir({ escala: 2, cursor: false }); p = s.p;
  await p.goto(S.RAIZ ? "http://127.0.0.1:8765/demo/report-demo-pf.html" : ""); await p.waitForTimeout(1500);
  await p.evaluate(async function () { for (var y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(function (r) { setTimeout(r, 90); }); } window.scrollTo(0, 0); });
  await p.waitForTimeout(900); await s.camada();
  await foto(s, "09-report-html", "O report final: um arquivo HTML, com movimento, vídeo e peças no clique");

  /* 10 e 11 · e-mail-resumo (PJ) */
  await s.ir_para("pj"); await s.abrirDemo(); await s.rolarPara("#secEditar"); await s.noBotao("#bIrResumo", 200); await p.waitForTimeout(1800);
  await p.evaluate(function () { var e = document.querySelector("#dtqEscolhidos"); window.scrollTo(0, window.scrollY + e.getBoundingClientRect().top - 120); }); await p.waitForTimeout(700);
  await foto(s, "10-email-resumo", "E-mail-resumo: até 4 destaques escolhidos do report, com prévia ao lado");
  await p.evaluate(function () { var e = document.querySelector("#bEmlRes"); window.scrollTo(0, window.scrollY + e.getBoundingClientRect().top - 430); }); await p.waitForTimeout(700);
  await foto(s, "11-exportar-eml", "Status em tempo real e exportação do e-mail-resumo em .eml para o Outlook");

  /* 12 · funil do PJ */
  await s.rolarPara("#secEditar"); await s.rolarAte('[data-item="numero-1"]', 0.4); await s.semBarra();
  var bf = await s.retF('.ed-mais button[data-acao="funil"]'); await s.ir(bf.x + bf.w / 2, bf.y + bf.h / 2, 200); await s.clicar(); await p.waitForTimeout(1800); await s.semBarra();
  await s.rolarAte('[data-item="numero-1"]', 0.45); await s.semBarra(); await s.ir(5, 5, 100);
  await foto(s, "12-funil-pj", "PJ: principais resultados como funil (dados fictícios e coerentes entre as etapas)");
  await s.fechar();

  /* 13 · celular */
  s = await S.abrir({ w: 390, h: 844, escala: 3, cursor: false }); p = s.p;
  await p.goto("http://127.0.0.1:8765/demo/report-demo-pj.html"); await p.waitForTimeout(1200);
  await p.evaluate(async function () { for (var y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(function (r) { setTimeout(r, 80); }); } window.scrollTo(0, 0); });
  await p.waitForTimeout(800); await s.camada();
  await foto(s, "13-celular", "No celular: o mesmo report, em uma coluna");
  await s.fechar();

  /* WebP (qualidade 90) */
  cp.execFileSync("python3", ["-c", "import sys,glob,os\nfrom PIL import Image\nfor f in glob.glob(os.path.join(sys.argv[1],'*.png')):\n  Image.open(f).convert('RGB').save(os.path.join(sys.argv[2],os.path.basename(f)[:-4]+'.webp'),'WEBP',quality=90,method=6)", TMP, SAIDA]);
  fs.writeFileSync(path.join(SAIDA, "capturas.json"), JSON.stringify(LISTA, null, 1));
  var total = fs.readdirSync(SAIDA).filter(function (f) { return /\.webp$/.test(f); }).reduce(function (a, f) { return a + fs.statSync(path.join(SAIDA, f)).size; }, 0);
  console.log(LISTA.length + " capturas, " + Math.round(total / 1024) + " KB no total");
})().catch(function (e) { console.error(e); process.exit(1); });
