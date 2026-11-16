/*
 * Teste de ponta a ponta da edição visual (5.6), no Emulador Report PF e no PJ. Uso técnico, opcional.
 * Só conteúdo fictício (modelo em branco do kit). Confere, nos dois emuladores, a MESMA lógica:
 *   tudo se põe e se move na própria página (sem painel de elementos à parte): + Novo item na barra do item e
 *   + Adicionar embaixo do grupo · arrastar com a linha de encaixe, no grupo e para outra seção do mesmo tipo ·
 *   Mover para outra seção (janela) · etiqueta verde/âmbar que sai (Tirar etiqueta) e volta (+ Etiqueta) ·
 *   Desfazer e Refazer (botões e Ctrl+Z / Ctrl+Y fora de um texto) · Esc fecha as janelas · as seções ao lado da
 *   página · funil e peça embaixo também no PF · passos do e-mail com a prévia ao lado · nomes do PJ no Novo tópico.
 *   Requer Node.js + Playwright:  node tests/edicao.e2e.js [pasta-de-saida]
 */
"use strict";
var path = require("path"), fs = require("fs");
var chromium = require("playwright").chromium;
var RAIZ = path.join(__dirname, ".."), SAIDA = path.resolve(process.argv[2] || path.join(RAIZ, "tests", "saida", "edicao"));
var KITS = [["PF", process.env.EMULADOR || path.join(RAIZ, "kit", "emulador-report.html")], ["PJ", process.env.EMULADOR_PJ || path.join(RAIZ, "kit", "emulador-report-pj.html")]];
var IMG = path.join(RAIZ, "assets", "icones", "icone-prancheta.png");
var falhas = 0;
function confere(ok, msg) { console.log((ok ? "  ok   " : "  FALHA ") + msg); if (!ok) falhas++; }

(async function () {
  fs.mkdirSync(SAIDA, { recursive: true });
  var browser = await chromium.launch();
  for (var kk = 0; kk < KITS.length; kk++) {
    var SEG = KITS[kk][0], URL = "file://" + path.resolve(KITS[kk][1]);
    console.log("\n" + SEG);
    var ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
    var p = await ctx.newPage(), erros = [];
    p.on("pageerror", function (e) { erros.push(e.message + " @ " + String(e.stack || "").split("\n")[1]); });
    p.on("console", function (m) { if (m.type() === "error") erros.push("console: " + m.text()); });
    p.on("dialog", function (d) { if (d.type() === "prompt") d.accept("Imagem de teste"); else d.dismiss(); });
    await p.goto(URL);
    if (await p.$("#recuperar:not([hidden])")) await p.click("#bDescartar");
    await p.click("#bModelo");
    await p.waitForFunction(function () { var f = document.querySelector("#edFrame"); return f && f.contentDocument && f.contentDocument.querySelector("[data-ed-campo]"); }, null, { timeout: 30000 });
    await p.waitForTimeout(900);
    var f = await (await p.$("#edFrame")).contentFrame();
    function nq(fn, arg) { return p.evaluate(function (o) { var d = document.querySelector("#edFrame").contentDocument; return new Function("d", "arg", "return (" + o.f + ")(d, arg);")(d, o.a); }, { f: fn.toString(), a: arg === undefined ? null : arg }); }
    function conta(g) { return nq(function (d, g2) { return Array.prototype.filter.call(d.querySelectorAll('[data-item^="' + g2 + '-"]'), function (x) { return /^[a-z]+-\d+$/.test(x.getAttribute("data-item")); }).length; }, g); }
    async function semBarra() { await p.mouse.move(3, 3); await nq(function (d) { var x = d.getElementById("ed-barra"); if (x) x.hidden = true; }); }

    function barra() { return nq(function (d) { var b = d.getElementById("ed-barra"); return b && !b.hidden ? Array.prototype.map.call(b.querySelectorAll("button"), function (x) { return x.textContent; }) : []; }); }
    async function botao(rot) { var ok = await nq(function (d, r) { var x = Array.prototype.find.call(d.querySelectorAll("#ed-barra button"), function (b) { return b.textContent === r; }); if (x) x.click(); return !!x; }, rot); await p.waitForTimeout(450); return ok; }
    async function passar(sel) { await semBarra(); await nq(function (d, s2) { d.querySelector(s2).scrollIntoView({ block: "center" }); }, sel); await p.waitForTimeout(150); await f.hover(sel, { force: true }); await p.waitForTimeout(450); }
    function texto(sel) { return nq(function (d, s2) { var x = d.querySelector(s2); return x ? x.textContent.trim() : null; }, sel); }

    /* 1. ao lado da página: só as seções (nada de painel de elementos à parte) */
    var lat = await p.evaluate(function () {
      var a = document.querySelector("#lateral").getBoundingClientRect(), fr = document.querySelector("#edFrame").getBoundingClientRect();
      return { lado: a.right <= fr.left + 2, elem: document.querySelectorAll(".elem, #biblioteca, [role=tab]").length, secoes: document.querySelectorAll("#secoesRep .secaoRep").length, como: !!document.querySelector("#comoPor"), form: !!document.querySelector("#bAdicionarItem"),
        umaLinha: (function () { var bs = document.querySelectorAll("#secEditar .ferramentas > button, #secEditar .ferramentas > .tabs"), t = {}; Array.prototype.forEach.call(bs, function (b) { t[Math.round(b.getBoundingClientRect().top)] = 1; }); return Object.keys(t).length; })() };
    });
    confere(lat.lado && lat.elem === 0 && lat.secoes >= 8 && lat.como && lat.form, SEG + ": ao lado da página, só as seções (" + lat.secoes + "), a dica de como pôr e mover, e o formulário; sem painel de elementos");
    confere(lat.umaLinha === 1, SEG + ": barra de ferramentas numa linha só a 1440 px");
    confere(await conta("lancamento") === 3 && await conta("agenda") === 3, SEG + ": modelo em branco com 3 cards e 3 itens de agenda (espaço livre para pôr mais)");

    /* 2. + Novo item na barra do card: entra logo depois dele; Desfazer e Refazer */
    await passar('[data-item="lancamento-1"] [data-campo$=".nome"]');
    var b1 = await barra();
    confere(b1.indexOf("+ Novo item") >= 0 && b1.indexOf("⠿ Arrastar") === 0 && b1.indexOf("Mover →") >= 0 && b1.indexOf("Depois →") < 0 && b1.indexOf("+ Adicionar depois") < 0, SEG + ": barra do item com nomes claros · " + b1.join(" | "));
    await botao("+ Novo item");
    var c1 = await nq(function (d) { var it = d.querySelectorAll('[data-item^="lancamento-"]'); return { n: it.length, n2: it[1] && it[1].querySelector('[data-campo$=".nome"]').textContent.trim() }; });
    confere(c1.n === 4 && /2\]$/.test(c1.n2), SEG + ": + Novo item: o card novo entra logo depois, com o texto do modelo numerado pela posição · " + c1.n2);
    await p.click("#bDesfazer"); await p.waitForTimeout(300); var u1 = await conta("lancamento");
    await p.click("#bRefazer"); await p.waitForTimeout(300); var r1 = await conta("lancamento");
    confere(u1 === 3 && r1 === 4, SEG + ": Desfazer tira o card e Refazer devolve");

    /* 3. Ctrl+Z e Ctrl+Y fora de um texto */
    await semBarra(); await p.click("#secEditar h2");
    await p.keyboard.press("Control+z"); await p.waitForTimeout(300); var k1 = await conta("lancamento");
    await p.keyboard.press("Control+y"); await p.waitForTimeout(300); var k2 = await conta("lancamento");
    confere(k1 === 3 && k2 === 4, SEG + ": Ctrl+Z desfaz e Ctrl+Y refaz (fora de um texto)");

    /* 4. + Adicionar embaixo dos números: 4 colunas iguais */
    await f.click('.ed-mais button[data-grupo="numero"]', { force: true }); await p.waitForTimeout(500);
    var g4 = await nq(function (d) { var it = Array.prototype.filter.call(d.querySelectorAll('[data-item^="numero-"]'), function (x) { return /^numero-\d+$/.test(x.getAttribute("data-item")); }); return { n: it.length, larg: it.map(function (x) { return x.getAttribute("width"); }).join(",") }; });
    confere(g4.n === 4 && g4.larg === "132,132,132,132", SEG + ": + Adicionar indicador: 4 colunas iguais (" + g4.larg + ")");

    /* 5. arrastar no grupo: o 1º número vai para o fim */
    var v1 = await texto('[data-campo="numero-1.valor"]');
    await passar('[data-item="numero-1"] [data-campo="numero-1.titulo"]');
    var pega = await nq(function (d) { var q = document.querySelector("#edFrame").getBoundingClientRect(), b = Array.prototype.find.call(d.querySelectorAll("#ed-barra button"), function (x) { return /Arrastar/.test(x.textContent); }); if (!b) return null; var r = b.getBoundingClientRect(); return { x: q.left + r.left + r.width / 2, y: q.top + r.top + r.height / 2 }; });
    var fim = await nq(function (d) { var q = document.querySelector("#edFrame").getBoundingClientRect(), r = d.querySelector('[data-item="numero-4"]').getBoundingClientRect(); return { x: q.left + r.right + 8, y: q.top + r.top + r.height / 2 }; });
    if (pega) {
      await p.mouse.move(pega.x, pega.y); await p.mouse.down();
      for (var s = 1; s <= 14; s++) { await p.mouse.move(pega.x + (fim.x - pega.x) * s / 14, pega.y + (fim.y - pega.y) * s / 14); await p.waitForTimeout(25); }
      var ind = await nq(function (d) { var x = d.getElementById("ed-vaga"); return x && !x.hidden ? x.textContent : ""; });
      await p.mouse.up(); await p.waitForTimeout(500);
      var depois = await nq(function (d) { var it = Array.prototype.filter.call(d.querySelectorAll('[data-item^="numero-"]'), function (x) { return /^numero-\d+$/.test(x.getAttribute("data-item")); }); return { ult: d.querySelector('[data-campo="numero-4.valor"]').textContent.trim(), larg: it.map(function (x) { return x.getAttribute("width"); }).join(",") }; });
      confere(ind === "Soltar aqui" && depois.ult === v1 && depois.larg === "132,132,132,132", SEG + ": arrastar no grupo: linha \"Soltar aqui\", o 1º número foi para o fim e a grade continua igual");
    } else confere(false, SEG + ": barra do número com ⠿ Arrastar");

    /* 6. etiqueta: Tirar etiqueta (clicando nela) e + Etiqueta (barra do item); Desfazer */
    await semBarra();
    await nq(function (d) { d.querySelector('[data-campo="numero-2.variacao"]').scrollIntoView({ block: "center" }); }); await p.waitForTimeout(150);
    await f.click('[data-campo="numero-2.variacao"]', { force: true }); await p.waitForTimeout(400);
    var be = await barra();
    await botao("Tirar etiqueta");
    var semEt = await nq(function (d) { return !d.querySelector('[data-campo="numero-2.variacao"]'); });
    confere(be.indexOf("Tirar etiqueta") >= 0 && be.indexOf("Cor: verde") >= 0 && semEt, SEG + ": clique na etiqueta: Cor e Tirar etiqueta; a etiqueta saiu · " + be.join(" | "));
    await passar('[data-item="numero-2"] [data-campo="numero-2.titulo"]');
    var bp = await barra(); await botao("+ Etiqueta");
    var volta = await nq(function (d) { var e = d.querySelector('[data-campo="numero-2.variacao"]'), t = d.querySelector('[data-campo="numero-2.titulo"]'); return { tem: !!e, depoisDoTitulo: !!(e && t && (t.compareDocumentPosition(e) & 4)), editavel: !!(e && e.hasAttribute("data-ed-campo")) }; });
    confere(bp.indexOf("+ Etiqueta") >= 0 && volta.tem && volta.depoisDoTitulo && volta.editavel, SEG + ": + Etiqueta põe a etiqueta de volta no lugar dela (editável)");
    await p.click("#bDesfazer"); await p.waitForTimeout(300);
    confere(await nq(function (d) { return !d.querySelector('[data-campo="numero-2.variacao"]'); }), SEG + ": Desfazer tira a etiqueta posta");

    /* 7. Mover para outra seção (janela): o 1º card vai para a agenda, com o nome; Desfazer volta os dois grupos */
    await nq(function (d) { var n = d.querySelector('[data-campo="lancamento-1.nome"]'); n.textContent = "Campanha que muda de seção"; });
    var ag0 = await conta("agenda"), la0 = await conta("lancamento");
    await passar('[data-item="lancamento-1"] [data-campo$=".nome"]');
    await botao("Mover para outra seção");
    var dlg = await p.evaluate(function () { return { aberto: !document.querySelector("#modal").hidden, opcoes: Array.prototype.map.call(document.querySelectorAll('input[name="destinoItem"]'), function (x) { return x.value; }) }; });
    var agendaOk = dlg.opcoes.indexOf("agenda") >= 0, numeroFora = dlg.opcoes.indexOf("numero") < 0;
    if (agendaOk) await p.check('input[name="destinoItem"][value="agenda"]');
    await p.click("#modalOk"); await p.waitForTimeout(600);
    var mv = await nq(function (d) { var it = Array.prototype.filter.call(d.querySelectorAll('[data-item^="agenda-"]'), function (x) { return /^agenda-\d+$/.test(x.getAttribute("data-item")); }), u = it[it.length - 1]; return u ? u.querySelector('[data-campo$=".titulo"]').textContent.trim() : ""; });
    confere(dlg.aberto && agendaOk && numeroFora && await conta("agenda") === ag0 + 1 && await conta("lancamento") === la0 - 1 && mv === "Campanha que muda de seção", SEG + ": Mover para outra seção: só seções do mesmo tipo (" + dlg.opcoes.join(",") + "); o card foi para o fim da agenda com o nome");
    await p.click("#bDesfazer"); await p.waitForTimeout(400);
    confere(await conta("agenda") === ag0 && await conta("lancamento") === la0 && await texto('[data-campo="lancamento-1.nome"]') === "Campanha que muda de seção", SEG + ": Desfazer: o card volta para o lugar dele (um passo só)");

    /* 8. arrastar para outra seção: o 1º item da agenda vai para o começo dos cards */
    await nq(function (d) { d.querySelector('[data-campo="agenda-1.titulo"]').textContent = "Item que vira card"; });
    await passar('[data-item="agenda-1"] [data-campo="agenda-1.titulo"]');
    var pg2 = await nq(function (d) { var q = document.querySelector("#edFrame").getBoundingClientRect(), b = Array.prototype.find.call(d.querySelectorAll("#ed-barra button"), function (x) { return /Arrastar/.test(x.textContent); }); if (!b) return null; var r = b.getBoundingClientRect(); return { x: q.left + r.left + r.width / 2, y: q.top + r.top + r.height / 2 }; });
    if (pg2) {
      await p.mouse.move(pg2.x, pg2.y); await p.mouse.down(); await p.waitForTimeout(100);
      /* os cards ficam bem acima: leva o ponteiro para o alto da janela e deixa a página rolar até eles (como uma pessoa faria) */
      var topo = await p.evaluate(function () { return document.querySelector("#secEditar .ferramentas").getBoundingClientRect().bottom + 20; });
      for (var s3 = 1; s3 <= 10; s3++) { await p.mouse.move(pg2.x, pg2.y + (topo - pg2.y) * s3 / 10); await p.waitForTimeout(30); }
      for (var t3 = 0; t3 < 80; t3++) {
        var vis = await nq(function (d) { var q = document.querySelector("#edFrame").getBoundingClientRect(), r = d.querySelector('[data-item="lancamento-1"]').getBoundingClientRect(); return q.top + r.top; });
        if (vis > topo + 120) break;
        await p.waitForTimeout(100);
      }
      var alvo = await nq(function (d) { var q = document.querySelector("#edFrame").getBoundingClientRect(), r = d.querySelector('[data-item="lancamento-1"]').getBoundingClientRect(); return { x: q.left + r.left - 8, y: q.top + r.top + r.height / 2 }; });
      await p.mouse.move(alvo.x, alvo.y); await p.waitForTimeout(250);
      var ind2 = await nq(function (d) { var x = d.getElementById("ed-vaga"); return x && !x.hidden ? x.textContent : ""; });
      await p.mouse.up(); await p.waitForTimeout(600);
      var c2 = await texto('[data-campo="lancamento-1.nome"]');
      confere(/^Soltar aqui · /.test(ind2) && c2 === "Item que vira card" && await conta("agenda") === ag0 - 1 && await conta("lancamento") === la0 + 1, SEG + ": arrastar para outra seção: \"" + ind2 + "\"; o item da agenda virou o 1º card");
      await p.click("#bDesfazer"); await p.waitForTimeout(400);
      confere(await conta("agenda") === ag0 && await conta("lancamento") === la0, SEG + ": Desfazer devolve o item à agenda");
    } else confere(false, SEG + ": barra da agenda com ⠿ Arrastar");

    /* 9. Novo tópico (botão da barra): o diálogo abre; nomes do PJ; Esc fecha */
    await semBarra(); await p.click("#bNovoTopico"); await p.waitForTimeout(300);
    var dt = await p.evaluate(function () { var m = document.querySelector("#modal"); return { aberto: !m.hidden, texto: m.textContent }; });
    confere(dt.aberto, SEG + ": + Novo tópico abre o diálogo");
    if (SEG === "PJ") confere(/as Análises/.test(dt.texto) && /como Aprendizados/.test(dt.texto) && /como Outras campanhas/.test(dt.texto) && !/Transformation Hub|Também neste mês/.test(dt.texto), "PJ: o Novo tópico usa os nomes das seções do PJ");
    await p.keyboard.press("Escape"); await p.waitForTimeout(200);
    confere(await p.$eval("#modal", function (e) { return e.hidden; }), SEG + ": Esc fecha o diálogo");

    /* 10. Funil pelo botão embaixo dos números (PF e PJ) */
    await f.click('.ed-mais button[data-acao="funil"]', { force: true }); await p.waitForTimeout(500);
    var fu = await nq(function (d) { var t = d.querySelector("table[data-funil]"); return t ? t.querySelectorAll("tr[data-item]").length : 0; });
    confere(fu === 4, SEG + ": Ver como funil: os 4 números viram degraus");

    /* 11. Peça da visão geral embaixo (também no PF) */
    await passar('img[data-img="principal"]');
    var bi = await barra();
    confere(bi.indexOf("Imagem embaixo") >= 0, SEG + ": peça da visão geral com \"Imagem embaixo\"");

    /* 12. Seções ao lado da página: desmarcar tira, marcar devolve */
    await semBarra();
    await p.uncheck('#secoesRep input[value="aprendizados"]'); await p.waitForTimeout(250);
    var some = await nq(function (d) { return !!d.querySelector('[data-ed-oculta]'); });
    await p.check('#secoesRep input[value="aprendizados"]'); await p.waitForTimeout(250);
    confere(some && !(await nq(function (d) { return !!d.querySelector('[data-ed-oculta]'); })), SEG + ": a lista ao lado tira e devolve a seção");

    /* 13. Passos do e-mail com a prévia ao lado */
    await p.click("#bIrResumo"); await p.waitForTimeout(2200);
    var lado = await p.evaluate(function () { var a = document.querySelector("#secResumo").getBoundingClientRect(), b = document.querySelector("#secPrev").getBoundingClientRect(); return { a: Math.round(a.right), b: Math.round(b.left), prevOculta: document.querySelector("#secPrev").hidden, lado: b.left >= a.right - 1, sticky: getComputedStyle(document.querySelector(".colPrev")).position, topo: Math.round(document.querySelector("#secLink").getBoundingClientRect().top) }; });
    confere(lado.lado && lado.sticky === "sticky" && lado.topo < 200, SEG + ": E-mail-resumo ↓ leva aos passos do e-mail, com a prévia fixa ao lado · " + JSON.stringify(lado));
    await p.screenshot({ path: path.join(SAIDA, SEG + "-email.png") });
    await p.click("#bVoltaEdicao"); await p.waitForTimeout(2200);
    confere(Math.abs(await p.evaluate(function () { return document.querySelector("#secEditar").getBoundingClientRect().top; })) < 60, SEG + ": Voltar ao report sobe para a edição");

    /* 14. salvar com tudo isso e reabrir: sem marcas de edição */
    await p.evaluate(function () { window.__salvos = []; window.showSaveFilePicker = async function (o) { return { name: o.suggestedName, createWritable: async function () { var partes = []; return { write: async function (b) { partes.push(await b.text()); }, close: async function () { window.__salvos.push({ nome: o.suggestedName, html: partes.join("") }); } }; } }; }; });
    await p.click("#bSalvar"); await p.waitForFunction(function () { return window.__salvos && window.__salvos.length; }, null, { timeout: 30000 });
    var salvo = await p.evaluate(function () { return window.__salvos[0].html; });
    confere(!/ed-zonas|ed-vaga|ed-itemMovido|ed-novo|contenteditable|data-ed-campo|class="ed-mais"/.test(salvo) && /data-funil/.test(salvo), SEG + ": salvo sem as marcas da edição (linha de encaixe, destaques, campos editáveis) e com o funil");
    confere(erros.length === 0, SEG + ": sem erros no console" + (erros.length ? ": " + erros.join(" | ") : ""));
    await ctx.close();
  }
  await browser.close();
  console.log(falhas ? "\n" + falhas + " FALHA(S)." : "\nTudo certo.");
  process.exit(falhas ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(1); });
