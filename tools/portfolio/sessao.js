/*
 * Sessão de demonstração: abre um emulador de docs/demo/ num Chromium de verdade e oferece as ações de uma pessoa
 * (mover o mouse, clicar, escrever, rolar), um cursor e um anel de clique desenhados por cima (o Chromium sem janela
 * não mostra o mouse), uma legenda explicativa na tela e o selo fixo "DEMO · DADOS FICTÍCIOS".
 * Gravação opcional pelo screencast do Chromium (quadros JPEG com horário), convertida em MP4 (H.264) pelo ffmpeg.
 * As janelas do sistema (Explorador de Arquivos, Salvar, caixa de texto do link) não aparecem: a legenda diz o que se faz nelas.
 */
"use strict";
var path = require("path"), fs = require("fs"), cp = require("child_process");
var chromium = require("playwright").chromium;
var RAIZ = path.join(__dirname, "..", "..");
var BASE = process.env.DEMO_URL || "http://127.0.0.1:8765/demo/";
var PECAS = path.join(__dirname, "demo", "assets");
var CURSOR = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 30 30"><path d="M4 2 L4 24 L9.6 18.6 L13.4 27 L17.2 25.4 L13.5 17.2 L21 17.2 Z" fill="#14161B" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>';

async function abrir(opc) {
  opc = opc || {};
  var W = opc.w || 1440, H = opc.h || 900;
  var browser = await chromium.launch();
  var ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: opc.escala || 1, acceptDownloads: true });
  var p = await ctx.newPage(), erros = [], dialogos = [], marcas = [], quadros = [], t0 = null, cdp = null, dirQ = null;
  p.on("pageerror", function (e) { erros.push(e.message); });
  p.on("dialog", function (d) { var r = dialogos.shift(); if (d.type() === "prompt" && r !== undefined) d.accept(r); else d.dismiss(); });
  var cur = { x: W / 2, y: H / 2 };

  async function camada() {
    await p.evaluate(function (o) {
      if (document.getElementById("cursorDemo")) return;
      var c = document.createElement("div"); c.id = "cursorDemo"; c.innerHTML = o.svg;
      c.style.cssText = "position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;transform:translate(" + o.x + "px," + o.y + "px);filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))" + (o.cursor ? "" : ";display:none");
      var r = document.createElement("div"); r.id = "cliqueDemo";
      r.style.cssText = "position:fixed;left:0;top:0;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;border:4px solid #2D5BFF;z-index:2147483646;pointer-events:none;opacity:0";
      var l = document.createElement("div"); l.id = "legendaDemo";
      l.style.cssText = "position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:2147483645;pointer-events:none;display:none;align-items:center;gap:12px;max-width:min(1040px,92vw);padding:12px 20px 12px 12px;background:#14161B;color:#fff;border-radius:14px;box-shadow:0 10px 30px rgba(20,22,27,.28);font:600 19px/1.35 system-ui,-apple-system,'Segoe UI',Arial,sans-serif";
      l.innerHTML = '<b style="flex:none;display:inline-flex;align-items:center;justify-content:center;min-width:32px;height:32px;padding:0 8px;border-radius:9px;background:#2D5BFF;color:#fff;font-size:16px"></b><span></span>';
      var s = document.createElement("div"); s.id = "seloDemo";
      s.style.cssText = "position:fixed;right:18px;top:14px;z-index:2147483644;pointer-events:none;font:600 12px/1 ui-monospace,'JetBrains Mono',Menlo,monospace;letter-spacing:.08em;background:#F2B33D;color:#14161B;padding:7px 10px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.15)";
      s.textContent = "DEMO · DADOS FICTÍCIOS";
      document.body.appendChild(s); document.body.appendChild(l); document.body.appendChild(r); document.body.appendChild(c);
    }, { svg: CURSOR, x: cur.x, y: cur.y, cursor: opc.cursor !== false });
  }
  async function ir(x, y, ms) {
    ms = ms || 700; var n = Math.max(10, Math.round(ms / 24)), a = { x: cur.x, y: cur.y };
    for (var i = 1; i <= n; i++) {
      var k = i / n, e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, xx = a.x + (x - a.x) * e, yy = a.y + (y - a.y) * e;
      await p.mouse.move(xx, yy);
      await p.evaluate(function (o) { var c = document.getElementById("cursorDemo"); if (c) c.style.transform = "translate(" + (o[0] - 4) + "px," + (o[1] - 2) + "px)"; }, [xx, yy]);
      await p.waitForTimeout(8);
    }
    cur = { x: x, y: y };
  }
  async function clicar() {
    await p.evaluate(function (o) { var r = document.getElementById("cliqueDemo"); if (!r) return; r.style.transition = "none"; r.style.left = o[0] + "px"; r.style.top = o[1] + "px"; r.style.opacity = "1"; r.style.transform = "scale(.5)"; r.offsetWidth; r.style.transition = "opacity .55s ease, transform .55s ease"; r.style.opacity = "0"; r.style.transform = "scale(1.45)"; }, [cur.x, cur.y]);
    await p.mouse.down(); await p.waitForTimeout(70); await p.mouse.up(); await p.waitForTimeout(300);
  }
  async function legenda(n, t, ms) {
    marcas.push({ n: n, t: t, s: t0 === null ? 0 : Date.now() / 1000 - t0 });
    await p.evaluate(function (o) { var l = document.getElementById("legendaDemo"); if (!l) return; l.style.display = o[1] ? "flex" : "none"; l.firstChild.textContent = o[0]; l.lastChild.textContent = o[1]; }, [String(n), t || ""]);
    await p.waitForTimeout(ms === undefined ? 1400 : ms);
  }
  function frame() { return p.$("#edFrame"); }
  function retF(sel) { return p.evaluate(function (s) { var f = document.querySelector("#edFrame"); if (!f) return null; var fr = f.getBoundingClientRect(), e = Array.prototype.find.call(f.contentDocument.querySelectorAll(s), function (x) { var r = x.getBoundingClientRect(); return r.width > 0 && r.height > 0; }); if (!e) return null; var r = e.getBoundingClientRect(); return { x: fr.left + r.left, y: fr.top + r.top, w: r.width, h: r.height }; }, sel); }
  function retP(sel) { return p.evaluate(function (s) { var e = Array.prototype.find.call(document.querySelectorAll(s), function (x) { var r = x.getBoundingClientRect(); return r.width > 0 && r.height > 0; }); if (!e) return null; var r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; }, sel); }
  function nq(fn, arg) { return p.evaluate(function (o) { var d = document.querySelector("#edFrame").contentDocument; return new Function("d", "arg", "return (" + o.f + ")(d, arg);")(d, o.a); }, { f: fn.toString(), a: arg === undefined ? null : arg }); }
  async function rolarAte(sel, frac) {
    var y = await p.evaluate(function (o) { var f = document.querySelector("#edFrame"), fr = f.getBoundingClientRect(), e = f.contentDocument.querySelector(o[0]); if (!e) return null; var r = e.getBoundingClientRect(); return window.scrollY + fr.top + r.top - innerHeight * o[1]; }, [sel, frac === undefined ? 0.35 : frac]);
    if (y === null) throw new Error("não achei " + sel);
    await p.evaluate(function (y) { window.scrollTo({ top: Math.max(0, y), behavior: "smooth" }); }, y); await p.waitForTimeout(1000);
  }
  async function rolarPara(sel, desloc) { await p.evaluate(function (o) { var e = document.querySelector(o[0]); window.scrollTo({ top: Math.max(0, e.getBoundingClientRect().top + window.scrollY - o[1]), behavior: "smooth" }); }, [sel, desloc || 8]); await p.waitForTimeout(1100); }
  async function semBarra() { await nq(function (d) { var x = d.getElementById("ed-barra"); if (x) x.hidden = true; }); }
  async function botaoBarra(rot) {
    var b = await nq(function (d, r) { var q = document.querySelector("#edFrame").getBoundingClientRect(), x = Array.prototype.find.call(d.querySelectorAll("#ed-barra button"), function (k) { return k.textContent === r; }); if (!x) return null; var rr = x.getBoundingClientRect(); return { x: q.left + rr.left + rr.width / 2, y: q.top + rr.top + rr.height / 2 }; }, rot);
    if (!b) throw new Error("botão não encontrado: " + rot);
    await ir(b.x, b.y, 550); await p.waitForTimeout(200); await clicar();
  }
  async function noCampo(sel, texto, o) {
    o = o || {};
    var r = await retF(sel); if (!r) throw new Error("campo não encontrado: " + sel);
    await ir(r.x + Math.min(r.w - 6, o.dx || r.w / 2), r.y + r.h / 2, 650); await p.waitForTimeout(200); await clicar();
    if (texto !== undefined) { await p.keyboard.press("Control+a"); await p.waitForTimeout(200); await p.keyboard.type(texto, { delay: o.delay || 55 }); await p.waitForTimeout(250); await p.keyboard.press("Enter"); }
    await p.waitForTimeout(500);
  }
  async function noBotao(sel, ms) { var b = await retP(sel); if (!b) throw new Error("sem " + sel); await ir(b.x + b.w / 2, b.y + b.h / 2, ms || 750); await p.waitForTimeout(250); await clicar(); }
  async function escolherArquivo(acao, arquivo) { var fc = p.waitForEvent("filechooser"); await acao(); var c = await fc; await p.waitForTimeout(1100); await c.setFiles(arquivo); }
  async function esperarEditor() {
    await p.waitForFunction(function () { var f = document.querySelector("#edFrame"); return f && f.contentDocument && f.contentDocument.querySelector("[data-ed-campo]"); }, null, { timeout: 30000 });
    await p.waitForTimeout(900); await camada();
  }
  async function abrirDemo() { await noBotao("#demoAbrir", 800); await esperarEditor(); }
  async function iniciarGravacao(dir) {
    dirQ = dir; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    cdp = await ctx.newCDPSession(p);
    cdp.on("Page.screencastFrame", function (ev) {
      var t = ev.metadata.timestamp; if (t0 === null) t0 = t;
      var arq = path.join(dir, String(quadros.length).padStart(6, "0") + ".jpg");
      fs.writeFileSync(arq, Buffer.from(ev.data, "base64")); quadros.push({ arq: arq, t: t - t0 });
      cdp.send("Page.screencastFrameAck", { sessionId: ev.sessionId }).catch(function () {});
    });
    await cdp.send("Page.startScreencast", { format: "jpeg", quality: 90, maxWidth: W, maxHeight: H, everyNthFrame: 1 });
    await p.waitForTimeout(500);
  }
  /* MP4 (H.264, 30 qps) e a lista de marcas (início de cada legenda), para cortar os GIFs */
  async function pararGravacao(mp4) {
    await p.waitForTimeout(600);
    var tFim = Date.now() / 1000 - t0;
    await cdp.send("Page.stopScreencast");
    var lista = quadros.map(function (q, i) { var d = (i + 1 < quadros.length ? quadros[i + 1].t : Math.max(q.t + 0.5, tFim)) - q.t; return "file '" + q.arq + "'\nduration " + Math.max(0.001, d).toFixed(4); }).join("\n") + "\nfile '" + quadros[quadros.length - 1].arq + "'\n";
    var txt = dirQ + ".txt"; fs.writeFileSync(txt, lista);
    fs.mkdirSync(path.dirname(mp4), { recursive: true });
    cp.execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", txt, "-vf", "fps=30,scale=1280:-2:flags=lanczos,format=yuv420p", "-c:v", "libx264", "-preset", "slow", "-crf", "26", "-tune", "animation", "-movflags", "+faststart", "-an", mp4]);
    fs.rmSync(txt); fs.rmSync(dirQ, { recursive: true, force: true });
    var info = { duracao: Math.max(quadros[quadros.length - 1].t + 0.5, tFim), marcas: marcas, erros: erros.slice() };
    fs.writeFileSync(mp4.replace(/\.mp4$/, ".json"), JSON.stringify(info, null, 1));
    return info;
  }
  return { p: p, ctx: ctx, browser: browser, erros: erros, dialogos: dialogos, BASE: BASE, PECAS: PECAS, camada: camada, ir: ir, clicar: clicar, legenda: legenda, frame: frame, retF: retF, retP: retP, nq: nq,
    rolarAte: rolarAte, rolarPara: rolarPara, semBarra: semBarra, botaoBarra: botaoBarra, noCampo: noCampo, noBotao: noBotao, escolherArquivo: escolherArquivo, esperarEditor: esperarEditor, abrirDemo: abrirDemo,
    iniciarGravacao: iniciarGravacao, pararGravacao: pararGravacao, cur: function () { return cur; },
    async ir_para(seg) { await p.goto(BASE + "emulador-" + seg + ".html"); if (await p.$("#recuperar:not([hidden])")) await p.click("#bDescartar"); await p.evaluate(function () { window.showSaveFilePicker = async function (o) { return { name: o.suggestedName, createWritable: async function () { return { write: async function () {}, close: async function () { window.__salvo = o.suggestedName; } }; } }; }; }); await camada(); },
    async fechar() { await ctx.close(); await browser.close(); } };
}

/* GIF de um trecho do MP4: paleta própria, 12 qps, 960 px */
function gif(mp4, ini, dur, saida, largura) {
  var pal = saida + ".pal.png", f = "fps=10,scale=" + (largura || 880) + ":-1:flags=lanczos";
  cp.execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-ss", String(ini), "-t", String(dur), "-i", mp4, "-vf", f + ",palettegen=max_colors=96:stats_mode=diff", pal]);
  cp.execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-ss", String(ini), "-t", String(dur), "-i", mp4, "-i", pal, "-lavfi", f + "[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle", saida]);
  fs.rmSync(pal);
}

module.exports = { abrir: abrir, gif: gif, RAIZ: RAIZ, PECAS: PECAS };
