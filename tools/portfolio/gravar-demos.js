/*
 * Vídeos (MP4) e GIFs do portfólio: gravações REAIS dos emuladores de demonstração (docs/demo/), com dados fictícios,
 * interações de verdade (mouse, teclado, arquivos) e legendas explicativas na tela.
 * Precisa de docs/ servido por http (o botão "Abrir o report fictício" busca o arquivo):
 *   python3 -m http.server 8765 --directory docs
 * Uso: node tools/portfolio/gravar-demos.js [overview,emuladores,workflow,email]
 * Saída: docs/assets/videos/*.mp4 (+ .jpg de capa) e docs/assets/gifs/*.gif
 */
"use strict";
var path = require("path"), fs = require("fs"), cp = require("child_process");
var S = require("./sessao.js");
var VID = path.join(S.RAIZ, "docs", "assets", "videos"), GIF = path.join(S.RAIZ, "docs", "assets", "gifs"), TMP = path.join(require("os").tmpdir(), "demo-quadros");
var SO = process.argv[2] ? process.argv[2].split(",") : null;

function capa(mp4, t, jpg) { cp.execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-ss", String(t), "-i", mp4, "-frames:v", "1", "-q:v", "3", jpg]); }
function trecho(info, de, ate) {
  var m = info.marcas, a = m.find(function (x) { return x.n === de; }), b = ate ? m.find(function (x) { return x.n === ate; }) : null;
  return { ini: Math.max(0, a.s - 0.2), dur: (b ? b.s : info.duracao) - a.s };
}
/* arrastar o 1º indicador até o fim do grupo (mesma técnica dos testes: confere que o ⠿ está sob o cursor) */
async function arrastarNumero(s) {
  var p = s.p;
  await s.rolarAte('[data-item="numero-1"]', 0.4); await s.semBarra();
  var n2 = await s.retF('[data-item="numero-1"] [data-campo="numero-1.titulo"]'); await s.ir(n2.x + n2.w / 2, n2.y + n2.h / 2, 650); await p.waitForTimeout(800);
  var pg = null, certo = false;
  for (var t = 0; t < 4 && !certo; t++) {
    pg = await s.nq(function (d) { var q = document.querySelector("#edFrame").getBoundingClientRect(), x = Array.prototype.find.call(d.querySelectorAll("#ed-barra button"), function (k) { return /Arrastar/.test(k.textContent); }); if (!x || d.getElementById("ed-barra").hidden) return null; var r = x.getBoundingClientRect(); return { x: q.left + r.left + r.width / 2, y: q.top + r.top + r.height / 2 }; });
    if (pg) { await s.ir(pg.x, pg.y, 300); await p.waitForTimeout(300); }
    certo = !!pg && await s.nq(function (d, o) { var q = document.querySelector("#edFrame").getBoundingClientRect(), e = d.elementFromPoint(o.x - q.left, o.y - q.top); return !!(e && e.closest && e.closest("#ed-barra .pegaItem")); }, pg);
    if (!certo) { await s.ir(n2.x + n2.w / 2, n2.y + n2.h / 2, 300); await p.waitForTimeout(600); }
  }
  if (!certo) throw new Error("não achou o ⠿ Arrastar");
  var ult = await s.nq(function (d) { var it = Array.prototype.filter.call(d.querySelectorAll('[data-item^="numero-"]'), function (x) { return /^numero-\d+$/.test(x.getAttribute("data-item")); }); return it[it.length - 1].getAttribute("data-item"); });
  var u = await s.retF('[data-item="' + ult + '"]');
  await p.mouse.down(); await p.waitForTimeout(150);
  await s.ir(u.x + u.w + 6, u.y + u.h / 2, 1500); await p.waitForTimeout(800);
  await p.mouse.up(); await p.waitForTimeout(1200); await s.semBarra();
}
async function escreverEtiqueta(s, id, texto) {
  await s.noCampo('[data-campo="' + id + '"]'); await s.p.waitForTimeout(300);
  await s.nq(function (d, i) { var e = d.querySelector('[data-campo="' + i + '"] [data-tom]') || d.querySelector('[data-campo="' + i + '"]'); var r = d.createRange(); r.selectNodeContents(e); var sl = d.getSelection(); sl.removeAllRanges(); sl.addRange(r); }, id);
  await s.p.keyboard.type(texto, { delay: 70 }); await s.p.keyboard.press("Enter"); await s.p.waitForTimeout(700); await s.semBarra();
}

var CENAS = {
  /* 1 · visão geral: PF, a página editável, celular, PJ, funil e e-mail-resumo */
  overview: async function () {
    var s = await S.abrir(), p = s.p; await s.ir_para("pf");
    await s.iniciarGravacao(path.join(TMP, "overview"));
    await s.legenda(1, "Emulador Report PF: um arquivo que abre no navegador, sem instalar nada", 2600);
    await s.legenda(2, "Abre o report do mês anterior (aqui, o report fictício de abril)", 500);
    await s.abrirDemo(); await s.rolarPara("#secEditar"); await p.waitForTimeout(900);
    await s.legenda(3, "A página do mês vira o editor: seções ao lado, o report no meio", 1600);
    await s.rolarAte('[data-item="numero-1"]', 0.35); await s.semBarra(); await p.waitForTimeout(500);
    await s.legenda(4, "Cada bloco é um componente: indicadores, campanhas, destaques, aprendizados", 600);
    var n = await s.retF('[data-item="numero-2"] [data-campo="numero-2.titulo"]'); await s.ir(n.x + n.w / 2, n.y + n.h / 2, 800); await p.waitForTimeout(1600);
    await s.semBarra(); await s.rolarAte('[data-item="lancamento-1"]', 0.4); await s.semBarra(); await p.waitForTimeout(1200);
    await s.legenda(5, "Prévia no celular antes de salvar", 400);
    await s.rolarPara("#secEditar"); await s.noBotao('[data-ew="390px"]', 800); await p.waitForTimeout(1600);
    await p.evaluate(function () { window.scrollBy({ top: 700, behavior: "smooth" }); }); await p.waitForTimeout(1600);
    await s.rolarPara("#secEditar"); await s.noBotao('[data-ew="100%"]', 600); await p.waitForTimeout(900);
    await s.legenda(6, "Emulador Report PJ: o mesmo sistema, com a identidade e as seções do segmento", 300);
    await s.ir_para("pj"); await s.legenda(6, "Emulador Report PJ: o mesmo sistema, com a identidade e as seções do segmento", 900);
    await s.abrirDemo(); await s.rolarPara("#secEditar"); await p.waitForTimeout(900);
    await s.legenda(7, "Principais resultados como funil: cliques → leads → contas (dados fictícios)", 400);
    await s.rolarAte('[data-item="numero-1"]', 0.4); await s.semBarra();
    var bf = await s.retF('.ed-mais button[data-acao="funil"]'); await s.ir(bf.x + bf.w / 2, bf.y + bf.h / 2, 800); await s.clicar(); await p.waitForTimeout(2600); await s.semBarra();
    await s.ir(bf.x + 420, bf.y - 160, 600);
    await s.legenda(8, "E-mail-resumo: destaques escolhidos e a prévia do que chega no Outlook", 400);
    await s.rolarPara("#secEditar"); await s.noBotao("#bIrResumo", 800); await p.waitForTimeout(2200);
    var pv = await s.retP("#secPrev"); await s.ir(pv.x + pv.w / 2, Math.min(720, pv.y + 300), 900); await p.waitForTimeout(2400);
    var info = await s.pararGravacao(path.join(VID, "overview.mp4")); await s.fechar(); return info;
  },
  /* 2 · os dois ambientes, lado a lado no tempo */
  emuladores: async function () {
    var s = await S.abrir(), p = s.p; await s.ir_para("pf");
    await s.iniciarGravacao(path.join(TMP, "emuladores"));
    await s.legenda(1, "Emulador Report PF", 1600);
    await s.abrirDemo(); await s.rolarPara("#secEditar"); await p.waitForTimeout(600);
    await s.legenda(2, "PF: seções do report, ordem e visibilidade ao lado da página", 400);
    var sec = await s.retP("#secoesRep"); await s.ir(sec.x + sec.w / 2, sec.y + 120, 900); await p.waitForTimeout(2200);
    await s.rolarAte('[data-item="numero-1"]', 0.35); await s.semBarra(); await p.waitForTimeout(1600);
    await s.legenda(3, "Emulador Report PJ", 300);
    await s.ir_para("pj"); await s.legenda(3, "Emulador Report PJ", 1100);
    await s.abrirDemo(); await s.rolarPara("#secEditar"); await p.waitForTimeout(600);
    await s.legenda(4, "PJ: o mesmo motor, com seções próprias (Campanhas, Indicadores, Análises, Vem aí)", 400);
    sec = await s.retP("#secoesRep"); await s.ir(sec.x + sec.w / 2, sec.y + 160, 900); await p.waitForTimeout(2400);
    await s.rolarAte('[data-item="numero-1"]', 0.35); await s.semBarra(); await p.waitForTimeout(1200);
    await s.legenda(5, "Um emulador só abre reports do seu segmento: PF e PJ não se misturam", 2600);
    var info = await s.pararGravacao(path.join(VID, "emuladores-pf-pj.mp4")); await s.fechar(); return info;
  },
  /* 3 · o fluxo do mês, do modelo em branco ao arquivo salvo */
  workflow: async function () {
    var s = await S.abrir(), p = s.p; await s.ir_para("pf");
    await s.iniciarGravacao(path.join(TMP, "workflow"));
    await s.legenda(1, "Começar um mês novo: o modelo em branco já traz todas as seções", 600);
    await s.noBotao("#bModelo", 900); await s.esperarEditor(); await s.rolarPara("#secEditar"); await p.waitForTimeout(700);
    await s.legenda(2, "Clique e escreva: o período muda em todos os lugares da página", 400);
    await s.rolarAte('[data-campo="periodo"]', 0.3); await s.semBarra();
    await s.noCampo('[data-campo="periodo"]', "ABRIL 2099");
    await s.legenda(3, "Frase do mês e projeto principal", 300);
    await s.noCampo('[data-campo="frase"]', "Mais conversão", { dx: 200 });
    await s.noCampo('[data-campo="frase_final"]', "com o mesmo investimento.", { dx: 200 });
    await s.rolarAte('[data-campo="principal.nome"]', 0.4); await s.semBarra();
    await s.noCampo('[data-campo="principal.nome"]', "Campanha Horizonte", { dx: 160 });
    await s.legenda(4, "Indicadores: valor, nome, variação e referência (fictícios: CTR = cliques ÷ impressões)", 300);
    await s.rolarAte('[data-campo="numero-1.valor"]', 0.35); await s.semBarra();
    await s.noCampo('[data-campo="numero-1.valor"]', "1,75%");
    await s.noCampo('[data-campo="numero-1.titulo"]', "CTR");
    await escreverEtiqueta(s, "numero-1.variacao", "▲ +25%");
    await s.noCampo('[data-campo="numero-1.detalhe"]', "Referência: 1,40% em março", { dx: 120 });
    await s.legenda(5, "Imagem: Trocar imagem abre o Explorador de Arquivos (a janela não aparece na gravação)", 300);
    await s.rolarAte('img[data-img="principal"]', 0.3); await s.semBarra();
    var im = await s.retF('img[data-img="principal"]'); await s.ir(im.x + im.w / 2, im.y + im.h / 2, 700); await p.waitForTimeout(900);
    await s.escolherArquivo(function () { return s.botaoBarra("Trocar imagem"); }, path.join(S.PECAS, "pf", "horizonte-principal.jpg"));
    await p.waitForTimeout(1800); await s.semBarra();
    await s.legenda(6, "+ Novo item: um lançamento a mais, logo depois do atual", 300);
    await s.rolarAte('[data-item="lancamento-1"]', 0.4); await s.semBarra();
    var n1 = await s.retF('[data-item="lancamento-1"] [data-campo$=".nome"]'); await s.ir(n1.x + n1.w / 2, n1.y + n1.h / 2, 700); await p.waitForTimeout(900);
    await s.botaoBarra("+ Novo item"); await p.waitForTimeout(1300); await s.semBarra();
    await s.noCampo('[data-item="lancamento-2"] [data-campo$=".nome"]', "Jornada Conecta"); await s.semBarra();
    await s.legenda(7, "Arrastar: segure ⠿ Arrastar e solte na linha de encaixe", 300);
    await arrastarNumero(s);
    await s.legenda(8, "Mover para outra seção: o item vai com os textos e os números", 300);
    await s.rolarAte('[data-item="lancamento-3"]', 0.4); await s.semBarra();
    var n3 = await s.retF('[data-item="lancamento-3"] [data-campo$=".nome"]'); await s.ir(n3.x + n3.w / 2, n3.y + n3.h / 2, 700); await p.waitForTimeout(800);
    await s.botaoBarra("Mover para outra seção"); await p.waitForTimeout(1200);
    var op = await s.retP('input[name="destinoItem"][value="agenda"]'); if (!op) throw new Error("sem destino agenda");
    await s.ir(op.x + op.w / 2, op.y + op.h / 2, 600); await s.clicar(); await p.waitForTimeout(600);
    await s.noBotao("#modalOk", 500); await p.waitForTimeout(2000); await s.semBarra();
    await s.legenda(9, "Vídeo no card: Colocar vídeo e escolher o arquivo (a janela não aparece na gravação)", 300);
    await s.rolarAte('[data-item="lancamento-1"]', 0.4); await s.semBarra();
    var li = await s.retF('img[data-img="lancamento-1"]'); await s.ir(li.x + li.w / 2, li.y + li.h / 2, 700); await p.waitForTimeout(900);
    await s.escolherArquivo(function () { return s.botaoBarra("Colocar vídeo"); }, path.join(S.PECAS, "pf", "horizonte-video.webm"));
    await p.waitForTimeout(2000); await s.semBarra();
    await s.legenda(10, "Salvar report: um .html só, com imagens e vídeos dentro", 300);
    await s.rolarPara("#secEditar"); await s.noBotao("#bSalvar", 800); await p.waitForTimeout(2600);
    var salvo = await p.evaluate(function () { return window.__salvo || null; });
    if (!salvo) throw new Error("o report não foi salvo");
    var info = await s.pararGravacao(path.join(VID, "workflow-report.mp4")); info.salvo = salvo; await s.fechar(); return info;
  },
  /* 4 · e-mail-resumo e .eml */
  email: async function () {
    var s = await S.abrir(), p = s.p; await s.ir_para("pj");
    await s.iniciarGravacao(path.join(TMP, "email"));
    await s.legenda(1, "Report pronto: agora o e-mail-resumo, a porta de entrada do report", 500);
    await s.abrirDemo(); await s.rolarPara("#secEditar"); await p.waitForTimeout(500);
    await s.noBotao("#bIrResumo", 900); await p.waitForTimeout(2000);
    await s.legenda(2, "O link do report completo (aqui, um endereço de exemplo)", 300);
    var lk = await s.retP("#link"); await s.ir(lk.x + 120, lk.y + lk.h / 2, 700); await s.clicar();
    await p.keyboard.press("Control+a"); await p.keyboard.type("https://www.example.com/report-demo-pj.html", { delay: 28 }); await p.waitForTimeout(1300);
    await s.legenda(3, "Destaques: até 4, escolhidos do próprio report; a prévia muda na hora", 300);
    await p.evaluate(function () { var e = document.querySelector("#dtqEscolhidos"); window.scrollTo({ top: window.scrollY + e.getBoundingClientRect().top - 140, behavior: "smooth" }); }); await p.waitForTimeout(1200);
    var tirar = await p.evaluate(function () { var c = document.querySelectorAll("#dtqEscolhidos .dtq"), u = c[c.length - 1], b = Array.prototype.find.call(u.querySelectorAll("button"), function (x) { return x.textContent === "Tirar"; }), r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    await s.ir(tirar.x, tirar.y, 800); await p.waitForTimeout(250); await s.clicar(); await p.waitForTimeout(1300);
    await p.evaluate(function () { var e = document.querySelector("#dtqLista"); window.scrollTo({ top: window.scrollY + e.getBoundingClientRect().top - 260, behavior: "smooth" }); }); await p.waitForTimeout(1200);
    var mais = await p.evaluate(function () { var bs = Array.prototype.filter.call(document.querySelectorAll("#dtqLista button"), function (x) { return !x.disabled && /^\+ /.test(x.textContent); }), b = bs[Math.min(3, bs.length - 1)], r = b.getBoundingClientRect(); return { x: r.left + Math.min(r.width / 2, 120), y: r.top + r.height / 2 }; });
    await s.ir(mais.x, mais.y, 800); await p.waitForTimeout(300); await s.clicar(); await p.waitForTimeout(1600);
    await s.legenda(4, "Prévia: no computador e no celular", 300);
    await p.evaluate(function () { var e = document.querySelector("#secPrev"); window.scrollTo({ top: window.scrollY + e.getBoundingClientRect().top - 20, behavior: "smooth" }); }); await p.waitForTimeout(1200);
    var cel = await p.evaluate(function () { var b = Array.prototype.find.call(document.querySelectorAll("#secPrev button"), function (x) { return /^Celular$/.test(x.textContent.trim()); }); if (!b) return null; var r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    if (cel) { await s.ir(cel.x, cel.y, 700); await s.clicar(); await p.waitForTimeout(2200);
      var pc = await p.evaluate(function () { var b = Array.prototype.find.call(document.querySelectorAll("#secPrev button"), function (x) { return /^Computador$/.test(x.textContent.trim()); }); var r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
      await s.ir(pc.x, pc.y, 600); await s.clicar(); await p.waitForTimeout(1200); }
    await s.legenda(5, "Baixar e-mail-resumo (.eml): dois cliques no arquivo abrem a mensagem no Outlook", 300);
    await p.evaluate(function () { var e = document.querySelector("#bEmlRes"); window.scrollTo({ top: window.scrollY + e.getBoundingClientRect().top - 320, behavior: "smooth" }); }); await p.waitForTimeout(1300);
    var bb = await s.retP("#bEmlRes"); await s.ir(bb.x + bb.w / 2, bb.y + bb.h / 2, 800); await p.waitForTimeout(400);
    var dl = p.waitForEvent("download", { timeout: 15000 }).catch(function () { return null; });
    await s.clicar(); var d = await dl; await p.waitForTimeout(1600);
    if (!d) throw new Error("o .eml não baixou");
    var eml = path.join(require("os").tmpdir(), "demo-resumo.eml"); await d.saveAs(eml);
    await s.legenda(6, "Primeiro para você, testar o botão; depois para a área", 2200);
    var info = await s.pararGravacao(path.join(VID, "email-summary.mp4")); info.eml = { arquivo: d.suggestedFilename(), bytes: fs.statSync(eml).size }; await s.fechar(); return info;
  }
};

(async function () {
  fs.mkdirSync(VID, { recursive: true }); fs.mkdirSync(GIF, { recursive: true });
  var res = {};
  for (var k of Object.keys(CENAS)) {
    if (SO && SO.indexOf(k) < 0) continue;
    var info = await CENAS[k](); res[k] = info;
    console.log(k + ": " + info.duracao.toFixed(1) + " s, " + info.marcas.length + " legendas" + (info.erros.length ? " · ERROS: " + info.erros.join(" | ") : "") + (info.salvo ? " · salvo: " + info.salvo : "") + (info.eml ? " · eml: " + info.eml.arquivo + " " + info.eml.bytes + " B" : ""));
  }
  /* capas e GIFs a partir dos MP4 */
  var J = function (n) { return JSON.parse(fs.readFileSync(path.join(VID, n + ".json"), "utf8")); };
  var mapa = { overview: "overview", emuladores: "emuladores-pf-pj", workflow: "workflow-report", email: "email-summary" };
  Object.keys(mapa).forEach(function (k) { var f = path.join(VID, mapa[k] + ".mp4"); if (fs.existsSync(f)) { var i = J(mapa[k]); capa(f, Math.min(i.duracao - 0.5, (i.marcas[2] || i.marcas[0]).s + 1.2), f.replace(/\.mp4$/, ".jpg")); } });
  var gifs = [["overview", 1, 4, "01-visao-geral.gif"], ["workflow-report", 2, 5, "02-edicao.gif"], ["workflow-report", 6, 9, "03-organizacao.gif"], ["email-summary", 3, 6, "04-email-resumo.gif"]];
  gifs.forEach(function (g) {
    var f = path.join(VID, g[0] + ".mp4"); if (!fs.existsSync(f)) return;
    var t = trecho(J(g[0]), g[1], g[2]); S.gif(f, t.ini.toFixed(2), Math.min(t.dur, 18).toFixed(2), path.join(GIF, g[3]));
    console.log("gif " + g[3] + ": " + t.dur.toFixed(1) + " s, " + Math.round(fs.statSync(path.join(GIF, g[3])).size / 1024) + " KB");
  });
})().catch(function (e) { console.error(e); process.exit(1); });
