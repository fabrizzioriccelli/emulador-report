/*
 * Build de DEMONSTRAÇÃO do portfólio: os mesmos emuladores PF e PJ (o mesmo converter-html-eml.html, o mesmo
 * tools/motor.js e o mesmo template/report.html), com a identidade visual do case e dados 100% fictícios.
 *
 * O que muda em relação ao kit de produção (só numa cópia de trabalho; os arquivos originais não são tocados):
 *   - marca: cores e fontes (Arial e Georgia, sem fontes proprietárias), símbolo do case no lugar do símbolo do banco,
 *     sem personagem; nomes de área e rótulos de seção neutros;
 *   - dados: tools/portfolio/demo/dados-demo-{pf,pj}.txt e as peças de tools/portfolio/demo/assets/;
 *   - emulador: faixa "DEMONSTRAÇÃO · DADOS FICTÍCIOS" e um botão que abre o report fictício (página servida por http).
 * O comportamento (edição, organização, imagens, vídeo, links, salvar, e-mail-resumo, .eml) é o do código de produção.
 *
 * Uso: node tools/portfolio/montar-demo.js [pasta-de-trabalho]   →   docs/demo/
 * Requer Node.js e Playwright (Chromium).
 */
"use strict";
var path = require("path"), fs = require("fs"), os = require("os"), cp = require("child_process");
var chromium = require("playwright").chromium;
var RAIZ = path.join(__dirname, "..", "..");
var DEMO = path.join(__dirname, "demo");
var TMP = path.resolve(process.argv[2] || path.join(os.tmpdir(), "demo-report-build"));
var SAIDA = path.join(RAIZ, "docs", "demo");

/* identidade do case (a mesma de docs/assets/css/site.css) */
var COR = { ink: "#14161B", paper: "#F7F5F0", cobalt: "#2D5BFF", cobaltDark: "#1F45D6", cobaltDeep: "#1A3AB8", cobaltTint: "#E8EEFF", cobaltLine: "#C9D6FF",
  teal: "#0F8A7E", tealDark: "#0B6F65", tealDeep: "#0A5A52", tealTint: "#E3F2EF", tealLine: "#9FD5CC", tealPaper: "#F4FAF8",
  amber: "#8A5200", amberTint: "#FFEFC9", green: "#1D6B4F", greenTint: "#CDEBDD", violet: "#6E56CF", violetTint: "#ECE8FB", coral: "#B23A0B", coralTint: "#FDE3D3", gray: "#5D6270", line: "#E4E0D8" };

function troca(txt, de, para, onde) {
  var n = txt.split(de).length - 1;
  if (n !== 1) throw new Error((onde || "") + ": esperava 1 ocorrência, achei " + n + " de " + String(de).slice(0, 80));
  return txt.split(de).join(para);
}
function trocaRe(txt, re, para, onde, minimo) {
  var n = (txt.match(new RegExp(re.source, re.flags.indexOf("g") < 0 ? re.flags + "g" : re.flags)) || []).length;
  if (n < (minimo || 1)) throw new Error((onde || "") + ": não encontrei " + re);
  return txt.replace(re, para);
}
function copiar(rel) {
  var de = path.join(RAIZ, rel), para = path.join(TMP, rel);
  fs.mkdirSync(path.dirname(para), { recursive: true });
  if (fs.statSync(de).isDirectory()) fs.cpSync(de, para, { recursive: true }); else fs.copyFileSync(de, para);
}
/* config de marca: troca valores por seção ("SECAO.chave") ou por chave única ("chave"); tira os comentários */
function marca(arq, valores) {
  var usados = {}, secao = "";
  var out = fs.readFileSync(path.join(RAIZ, arq), "utf8").split(/\r?\n/).filter(function (l) { return !/^#/.test(l); }).map(function (l) {
    var s = /^\[([^\]]+)\]\s*$/.exec(l); if (s) { secao = s[1]; return l; }
    var m = /^([a-z_]+):\s?(.*)$/.exec(l); if (!m) return l;
    var k = secao + "." + m[1], v = Object.prototype.hasOwnProperty.call(valores, k) ? k : Object.prototype.hasOwnProperty.call(valores, m[1]) ? m[1] : null;
    if (!v) return l;
    usados[v] = (usados[v] || 0) + 1; return m[1] + ": " + valores[v];
  });
  Object.keys(valores).forEach(function (k) {
    if (!usados[k]) throw new Error(arq + ": chave não encontrada: " + k);
    if (k.indexOf(".") < 0 && usados[k] > 1) throw new Error(arq + ": chave ambígua (use SECAO.chave): " + k);
  });
  return "# Marca da DEMONSTRAÇÃO do portfólio (gerada por tools/portfolio/montar-demo.js). Dados fictícios.\n" + out.join("\n").replace(/\n{3,}/g, "\n\n");
}

(async function () {
  console.log("Pasta de trabalho: " + TMP);
  fs.rmSync(TMP, { recursive: true, force: true }); fs.mkdirSync(TMP, { recursive: true });
  ["converter-html-eml.html", "gerar-report.html", "template", "tools/motor.js", "tools/coringa.js", "tools/coringa-pj.js", "tools/montar-avulso.js", "config", "dados/CORINGA.txt", "dados/CORINGA-PJ.txt", "assets/exemplo", "assets/exemplo-pj"].forEach(copiar);
  fs.copyFileSync(path.join(DEMO, "dados-demo-pf.txt"), path.join(TMP, "dados/DEMO-PF.txt"));
  fs.copyFileSync(path.join(DEMO, "dados-demo-pj.txt"), path.join(TMP, "dados/DEMO-PJ.txt"));
  fs.cpSync(path.join(DEMO, "assets/pf"), path.join(TMP, "assets/demo-pf"), { recursive: true });
  fs.cpSync(path.join(DEMO, "assets/pj"), path.join(TMP, "assets/demo-pj"), { recursive: true });

  var browser = await chromium.launch();

  /* 1 · símbolo do case: PNG para o report e os ícones da aba */
  var svg = fs.readFileSync(path.join(RAIZ, "docs/assets/brand/marca.svg"), "utf8").replace(/\s*\n\s*/g, "");
  async function png(lado, fundo) {
    var p = await browser.newPage({ viewport: { width: lado, height: lado } });
    await p.setContent('<html><body style="margin:0;background:' + (fundo || "transparent") + '">' + svg.replace("<svg ", '<svg width="' + lado + '" height="' + lado + '" style="display:block" ') + "</body></html>");
    var b = await p.screenshot({ omitBackground: !fundo }); await p.close(); return b;
  }
  fs.mkdirSync(path.join(TMP, "assets/demo-marca"), { recursive: true });
  fs.writeFileSync(path.join(TMP, "assets/demo-marca/marca.png"), await png(96));
  var b64 = function (b) { return "data:image/png;base64," + b.toString("base64"); };
  var svgUri = "data:image/svg+xml," + encodeURIComponent(svg).replace(/'/g, "%27");
  var ICONE = '<link rel="icon" type="image/png" sizes="32x32" href="' + b64(await png(32)) + '">\n<link rel="icon" type="image/png" sizes="16x16" href="' + b64(await png(16)) + '">\n' +
    '<link rel="icon" type="image/svg+xml" sizes="any" href="' + svgUri + '">\n<link rel="apple-touch-icon" sizes="180x180" href="' + b64(await png(180, COR.paper)) + '">';

  /* 1b · espaços de imagem do modelo em branco ("troque pelo emulador") nas cores da demonstração */
  var ESPACOS = {
    coringa: { cor: COR.cobalt, fundo: COR.cobaltTint, itens: { "coringa-principal.png": [368, 460, "IMAGEM DA CAMPANHA", "retângulo vertical · troque pelo emulador"], "coringa-destaque.png": [1000, 1000, "IMAGEM", "do destaque"],
      "coringa-lancamento.png": [900, 360, "IMAGEM DA PEÇA", "troque pelo emulador"], "coringa-logo.png": [240, 240, "LOGO", ""], "coringa-print.png": [1008, 630, "PRINT DA FERRAMENTA", "troque pelo emulador"], "coringa-selo.png": [400, 400, "SELO", "PNG original"] } },
    "coringa-pj": { cor: COR.teal, fundo: COR.tealTint, itens: { "coringa-pj-principal.png": [368, 460, "IMAGEM DA CAMPANHA", "retângulo vertical · troque pelo emulador"], "coringa-pj-destaque.png": [368, 600, "IMAGEM", "da campanha em destaque"],
      "coringa-pj-campanha.png": [900, 360, "IMAGEM DA CAMPANHA", "troque pelo emulador"], "coringa-pj-logo.png": [240, 240, "LOGO", ""], "coringa-pj-print.png": [1008, 630, "PRINT DA ANÁLISE", "troque pelo emulador"], "coringa-pj-selo.png": [400, 400, "SELO", "PNG original"] } }
  };
  for (var pasta of Object.keys(ESPACOS)) {
    var E = ESPACOS[pasta]; fs.mkdirSync(path.join(TMP, "assets", pasta), { recursive: true });
    for (var arq of Object.keys(E.itens)) {
      var it = E.itens[arq], u = Math.min(it[0], it[1]) / 20, pg = await browser.newPage({ viewport: { width: it[0], height: it[1] } });
      await pg.setContent('<html><body style="margin:0;width:' + it[0] + 'px;height:' + it[1] + 'px;background:' + E.fundo + ';display:grid;place-items:center;font-family:Arial,sans-serif;text-align:center;box-sizing:border-box;border:' + Math.max(2, u * 0.35) + 'px dashed ' + E.cor + ';border-radius:' + u + 'px">' +
        '<div><div style="font-weight:700;color:' + E.cor + ';font-size:' + Math.max(14, u * (it[2].length > 12 ? 1.4 : 2.4)) + 'px;letter-spacing:.04em">' + it[2] + '</div><div style="margin-top:6px;color:' + COR.gray + ';font-size:' + Math.max(10, u * 0.8) + 'px">' + it[3] + "</div></div></body></html>");
      fs.writeFileSync(path.join(TMP, "assets", pasta, arq), await pg.screenshot()); await pg.close();
    }
  }

  /* 2 · marca da demonstração */
  var comum = { titulos: "Arial, Helvetica, sans-serif", texto: "Arial, Helvetica, sans-serif", impacto: "Georgia, 'Times New Roman', serif", titulos_outlook_windows: "Arial", texto_outlook_windows: "Arial",
    "LOGO.arquivo": "assets/demo-marca/marca.png", largura: 32, "LOGO.descricao": "Emulador Report (demonstração)", "FORMIGUINHA.arquivo": "", positivo: COR.green, positivo_fundo: COR.greenTint, atencao: COR.amber, atencao_fundo: COR.amberTint };
  fs.writeFileSync(path.join(TMP, "config/marca.txt"), marca("config/marca.txt", Object.assign({}, comum, {
    marca: COR.cobalt, titulo: COR.cobalt, "CORES.texto": COR.ink, texto_corpo: COR.ink, texto_apoio: COR.gray, fundo_pagina: COR.paper, fundo_email: "#FFFFFF",
    capa_selo: "#FFFFFF", capa_filete: "#FFFFFF", grupo_resultados: COR.teal, grupo_resultados_fundo: COR.tealTint, grupo_evolucao: COR.violet, grupo_evolucao_fundo: COR.violetTint,
    grupo_aprendizado: COR.coral, grupo_aprendizado_fundo: COR.coralTint, abertura_fundo: COR.cobalt, abertura_texto: "#FFFFFF", bloco_fundo: COR.cobaltTint, abertura_linha: "#FFFFFF", capa_destaque: "#FFFFFF",
    linha: COR.line, creative_x: COR.violet, creative_x_anterior: COR.gray, transformation: COR.cobalt, transformation_titulo: COR.cobalt, transformation_fundo: COR.cobaltTint, transformation_linha: COR.cobaltTint,
    transformation_placeholder_fundo: COR.paper, transformation_placeholder_borda: COR.cobaltLine, foco_fundo: COR.ink, foco_rotulo: "#FFFFFF", foco_texto: "#FFFFFF", rodape_claro: COR.cobaltTint, rodape_fundo: COR.ink,
    placeholder_fundo: COR.paper, placeholder_borda: COR.cobaltLine })));
  fs.writeFileSync(path.join(TMP, "config/marca-pj.txt"), marca("config/marca-pj.txt", Object.assign({}, comum, {
    marca: COR.teal, titulo: COR.ink, "CORES.texto": COR.ink, texto_corpo: COR.ink, texto_apoio: COR.ink, fundo_pagina: "#FFFFFF", fundo_email: COR.tealTint,
    grupo_resultados: COR.tealDark, grupo_resultados_fundo: "#FFFFFF", grupo_evolucao: COR.tealDark, grupo_evolucao_fundo: "#FFFFFF", grupo_aprendizado: COR.tealDeep, grupo_aprendizado_fundo: "#FFFFFF",
    rotulo_texto: COR.tealDark, capa_selo: COR.tealTint, selo_texto: COR.tealDark, capa_filete: COR.tealTint, capa_destaque: COR.ink, abertura_fundo: "#FFFFFF", abertura_texto: COR.ink, bloco_fundo: "#FFFFFF",
    foco_fundo: "#FFFFFF", abertura_linha: COR.tealTint, linha: "#FFFFFF", creative_x: COR.tealDark, creative_x_anterior: COR.ink, transformation: COR.ink, transformation_titulo: COR.ink, cartao_fundo: "#FFFFFF",
    transformation_fundo: "#FFFFFF", transformation_linha: COR.tealTint, transformation_placeholder_fundo: COR.tealTint, transformation_placeholder_borda: COR.teal, foco_rotulo: COR.ink, foco_texto: COR.ink,
    rodape_claro: COR.tealTint, rodape_fundo: "#FFFFFF", placeholder_fundo: "#FFFFFF", placeholder_borda: COR.teal })));

  /* 3 · motor: nomes de área, rótulos neutros, ícones e paleta do e-mail-resumo da demonstração */
  var mp = path.join(TMP, "tools/motor.js"), m = fs.readFileSync(mp, "utf8");
  m = troca(m, 'area: "Creative Strategy PF", area_linha: "CUSTOMER INTERACTIONS"', 'area: "Marketing PF · Demo", area_linha: "DADOS FICTÍCIOS"', "motor");
  m = troca(m, 'area: "Creative Strategy PJ", area_linha: "SANTANDER EMPRESAS"', 'area: "Marketing PJ · Demo", area_linha: "DADOS FICTÍCIOS"', "motor");
  /* rótulos das seções: só dentro dos perfis (os nomes dos blocos de dados, como [CREATIVE X], não mudam) */
  var pi = m.indexOf("var PERFIS = {"), pf = m.indexOf("\n  };", pi);
  if (pi < 0 || pf < 0) throw new Error("motor: PERFIS não encontrado");
  var perfis = m.slice(pi, pf);
  perfis = trocaRe(perfis, /"Creative X trimestral"/g, '"Qualidade criativa trimestral"', "perfis");
  perfis = trocaRe(perfis, /"Creative X"/g, '"Qualidade criativa"', "perfis");
  perfis = trocaRe(perfis, /"CREATIVE X"/g, '"QUALIDADE CRIATIVA"', "perfis");
  perfis = trocaRe(perfis, /"Transformation Hub"/g, '"Laboratório"', "perfis");
  perfis = trocaRe(perfis, /"TRANSFORMATION HUB"/g, '"LABORATÓRIO"', "perfis");
  m = m.slice(0, pi) + perfis + m.slice(pf);
  m = trocaRe(m, /var ICONE_TAG = "(?:[^"\\]|\\.)*";/, function () { return "var ICONE_TAG = " + JSON.stringify(ICONE) + ";"; }, "motor");
  m = trocaRe(m, /var ICONE_TAG_PJ = "(?:[^"\\]|\\.)*";/, function () { return "var ICONE_TAG_PJ = " + JSON.stringify(ICONE) + ";"; }, "motor");
  m = trocaRe(m, /var CR = \{[\s\S]*?\n  \};/, function () {
    return "var CR = {\n    marca: \"" + COR.cobalt + "\", branco: \"#FFFFFF\", lisboa: \"" + COR.paper + "\", rio: \"" + COR.tealTint + "\", mexico: \"" + COR.cobaltLine + "\", texto: \"" + COR.ink + "\", apoio: \"" + COR.gray + "\", linha: \"" + COR.line + "\",\n" +
      "    positivo: \"" + COR.green + "\", positivo_fundo: \"" + COR.greenTint + "\", atencao: \"" + COR.amber + "\", atencao_fundo: \"" + COR.amberTint + "\", boston: \"" + COR.tealDark + "\",\n" +
      "    turquesa: \"" + COR.teal + "\", turquesa_fundo: \"" + COR.tealTint + "\", roxo: \"" + COR.violet + "\", roxo_fundo: \"" + COR.violetTint + "\", rosa: \"" + COR.coral + "\", rosa_fundo: \"" + COR.coralTint + "\"\n  };";
  }, "motor");
  m = trocaRe(m, /alt="Santander"/g, 'alt="Emulador Report (demonstração)"', "motor");
  fs.writeFileSync(mp, m);

  /* 3b · emulador: os mesmos rótulos neutros no mapa de nomes do PF (a interface usa esse mapa nas listas e avisos) */
  var cvp = path.join(TMP, "converter-html-eml.html"), cv = fs.readFileSync(cvp, "utf8");
  cv = troca(cv, 'cx: "Creative X", transformation: "Transformation Hub"', 'cx: "Qualidade criativa", transformation: "Laboratório"', "emulador");
  cv = troca(cv, 'cxt: "Creative X: indicadores do trimestre"', 'cxt: "Qualidade criativa: indicadores do trimestre"', "emulador");
  cv = troca(cv, 'transformation: "Transformation Hub", aprendizado:', 'transformation: "Laboratório", aprendizado:', "emulador");
  cv = troca(cv, 'cx: "Creative X", sugestao:', 'cx: "Qualidade criativa", sugestao:', "emulador");
  fs.writeFileSync(cvp, cv);
  ["dados/CORINGA.txt", "dados/CORINGA-PJ.txt"].forEach(function (d) {
    var t = fs.readFileSync(path.join(TMP, d), "utf8").replace(/Transformation Hub/g, "Laboratório").replace(/Creative X/g, "Qualidade criativa");
    fs.writeFileSync(path.join(TMP, d), t);
  });

  /* 4 · reports e modelos em branco pelo caminho oficial (gerar-report.html num navegador de verdade) */
  async function gerar(dados) {
    var page = await browser.newPage({ acceptDownloads: true }), erros = [];
    page.on("pageerror", function (e) { erros.push(e.message); });
    await page.goto("file://" + path.join(TMP, "gerar-report.html"));
    await page.setInputFiles("#pasta", TMP);
    await page.waitForSelector("#secConf:not([hidden])", { timeout: 30000 });
    await page.selectOption("#mes", dados);
    await page.waitForFunction(function () { return /pend|faltam|pronto/i.test(document.getElementById("banner").textContent); }, null, { timeout: 30000 });
    await page.waitForTimeout(1500);
    var banner = (await page.textContent("#banner")).replace(/\s+/g, " ").trim(), rascunho = false;
    if (await page.$eval("#bHtml", function (b) { return b.disabled; })) { await page.check("#rascunho"); rascunho = true; }
    var d = await Promise.all([page.waitForEvent("download"), page.click("#bHtml")]);
    var html = fs.readFileSync(await d[0].path(), "utf8");
    await page.close();
    if (erros.length) throw new Error(dados + ": erros na página: " + erros.join(" | "));
    console.log("  " + dados + ": " + Math.round(Buffer.byteLength(html) / 1024) + " KB" + (rascunho ? " (rascunho)" : "") + " · " + banner.slice(0, 110));
    return { html: html, rascunho: rascunho };
  }
  var coringa = await gerar("dados/CORINGA.txt"), coringaPJ = await gerar("dados/CORINGA-PJ.txt");
  var demoPF = await gerar("dados/DEMO-PF.txt"), demoPJ = await gerar("dados/DEMO-PJ.txt");
  if (demoPF.rascunho || demoPJ.rascunho) throw new Error("o report de demonstração saiu como rascunho: confira os dados");
  function js(html, de) { return "/* Modelo em branco da DEMONSTRAÇÃO (gerado de " + de + ", sem dado real). */\nwindow.CORINGA_HTML = " + JSON.stringify(html).replace(/</g, "\\u003c") + ";\n"; }
  fs.writeFileSync(path.join(TMP, "tools/coringa.js"), js(coringa.html, "dados/CORINGA.txt"));
  fs.writeFileSync(path.join(TMP, "tools/coringa-pj.js"), js(coringaPJ.html, "dados/CORINGA-PJ.txt"));

  /* 5 · emuladores avulsos (o mesmo montar-avulso.js do kit) */
  cp.execFileSync("node", [path.join(TMP, "tools/montar-avulso.js"), path.join(TMP, "saida/emulador-pf.html")], { stdio: "inherit" });
  cp.execFileSync("node", [path.join(TMP, "tools/montar-avulso.js"), "pj", path.join(TMP, "saida/emulador-pj.html")], { stdio: "inherit" });

  /* 6 · camada visual da demonstração no emulador (só aparência e o aviso; nenhuma função muda) */
  var PALETA = {
    pf: { "#EC0000": COR.cobalt, "#CC0000": COR.cobaltDark, "#990000": COR.cobaltDeep, "#F5DECF": COR.cobaltTint, "#FBF1EA": COR.paper, "#F0B998": COR.cobaltLine },
    pj: { "#EC0000": COR.teal, "#CC0000": COR.tealDark, "#990000": COR.tealDeep, "#F5DECF": COR.tealTint, "#FBF1EA": COR.tealPaper, "#F0B998": COR.tealLine }
  };
  var svgHeader = svgUri;
  function camada(html, seg) {
    var nome = seg === "pf" ? "PF" : "PJ", report = "report-demo-" + seg + ".html";
    if (seg === "pf") {
      var ini = html.indexOf("<!-- Ícone da aba: Santander + PF"), fim = html.indexOf("<title>Emulador Report PF</title>");
      if (ini < 0 || fim < ini) throw new Error("ícone da aba do PF não encontrado");
      html = html.slice(0, ini) + "<!-- Ícone da aba: símbolo do case (demonstração do portfólio). -->\n" + ICONE + "\n" + html.slice(fim);
    }
    html = html.replace(/<!-- Ícone da aba: Santander \+ PJ[^>]*-->/, "<!-- Ícone da aba: símbolo do case (demonstração do portfólio). -->");
    html = trocaRe(html, /(<span class="marca-pf"><img src=")[^"]+(" alt=")Santander P[FJ](")/, function (x, a, b, c) { return a + svgHeader + b + "Emulador Report" + c; }, "símbolo do cabeçalho");
    html = troca(html, "<title>Emulador Report " + nome + "</title>", "<title>Emulador Report " + nome + " · Demonstração</title>", "título");
    Object.keys(PALETA[seg]).forEach(function (k) { html = html.replace(new RegExp(k, "gi"), PALETA[seg][k]); });
    var css = "\n  /* DEMONSTRAÇÃO do portfólio: identidade do case */\n" +
      (seg === "pf" ? "  header{background:" + COR.cobalt + ";color:#fff}\n" : "  header{background:" + COR.tealTint + ";color:" + COR.ink + "}header h1,header p,header #versao{color:" + COR.ink + "}\n") +
      "  .marca-pf{background:transparent;box-shadow:none}.marca-pf img{width:52px;height:52px;border-radius:14px}\n" +
      "  .demo-faixa{background:" + COR.ink + ";color:#fff;font:14px/1.45 system-ui,-apple-system,'Segoe UI',Arial,sans-serif;padding:12px 24px;display:flex;flex-wrap:wrap;gap:8px 18px;align-items:center}\n" +
      "  .demo-faixa b{letter-spacing:.06em;font-size:12px;background:#F2B33D;color:" + COR.ink + ";padding:3px 8px;border-radius:6px}\n" +
      "  .demo-faixa span{flex:1 1 420px;opacity:.92}.demo-faixa a{color:#fff}\n" +
      "  .demo-faixa button{font:600 14px system-ui,-apple-system,'Segoe UI',Arial,sans-serif;background:#fff;color:" + COR.ink + ";border:0;border-radius:10px;padding:8px 14px;cursor:pointer}\n" +
      "  .demo-faixa button:focus-visible{outline:3px solid #F2B33D;outline-offset:2px}\n" +
      "  .demo-faixa .demo-msg{flex-basis:100%;font-size:13px;opacity:.9}\n" +
      "  @media (max-width:600px){.demo-faixa{padding:10px 16px}}\n";
    html = troca(html, "</style>\n</head>", css + "</style>\n</head>", "estilo");
    var faixa = '<div class="demo-faixa" role="note" aria-label="Aviso de demonstração"><b>DEMONSTRAÇÃO · DADOS FICTÍCIOS</b>' +
      "<span>Campanhas, números, imagens e telas são fictícios e servem só para apresentar as funcionalidades. Nenhum dado representa resultados reais, clientes ou campanhas do Santander. " +
      'Case de portfólio independente, sem vínculo institucional. <a href="../">Sobre o projeto</a></span>' +
      '<button type="button" id="demoAbrir">Abrir o report fictício de abril</button><span class="demo-msg" id="demoMsg" hidden></span></div>';
    html = troca(html, "</div></header>", "</div></header>\n" + faixa, "faixa");
    var script = "<script>\n/* DEMONSTRAÇÃO: abre o report fictício pelo mesmo caminho do botão \"Abrir um report salvo\" (precisa da página servida por http). */\n" +
      "(function(){var b=document.getElementById('demoAbrir'),msg=document.getElementById('demoMsg');if(!b)return;\n" +
      "function abrir(){fetch('" + report + "').then(function(r){if(!r.ok)throw 0;return r.text();}).then(function(t){var dt=new DataTransfer();dt.items.add(new File([t],'" + report + "',{type:'text/html'}));var i=document.getElementById('arquivo');i.files=dt.files;i.dispatchEvent(new Event('change',{bubbles:true}));})\n" +
      ".catch(function(){msg.hidden=false;msg.textContent='Aberto direto do computador, o navegador não deixa buscar o arquivo: use \"Abrir um report salvo\" e escolha " + report + ", na mesma pasta.';});}\n" +
      "b.addEventListener('click',abrir);if(/[?&]demo=1/.test(location.search))abrir();})();\n</script>\n</body>";
    html = trocaRe(html, /<\/body>(?![\s\S]*<\/body>)/, script, "fim do body");
    /* comentários do código de produção que citam a marca original (inclusive um que iria, como comentário, para o
       HTML do e-mail): na demonstração, viram termos neutros. Só o aviso de demonstração cita o nome, de propósito. */
    var i0 = html.indexOf('<div class="demo-faixa"'), i1 = html.indexOf("</div>", i0) + 6;
    var neutro = function (t) {
      return t.replace(/Brand Guide Santander( Brasil| Empresas)?/g, "guia de marca").replace(/Vermelho Santander/g, "vermelho da marca").replace(/Santander \+ P([FJ])/g, "símbolo + P$1")
        .replace(/\(Santander Empresas\)/g, "(PJ)").replace(/Santander Empresas/g, "PJ").replace(/\|\| "Santander"/g, '|| "Logo"').replace(/santander-p([fj])/g, "simbolo-p$1").replace(/Santander/g, "a marca");
    };
    html = neutro(html.slice(0, i0)) + html.slice(i0, i1) + neutro(html.slice(i1));
    return html;
  }
  fs.rmSync(SAIDA, { recursive: true, force: true }); fs.mkdirSync(SAIDA, { recursive: true });
  fs.writeFileSync(path.join(SAIDA, "emulador-pf.html"), camada(fs.readFileSync(path.join(TMP, "saida/emulador-pf.html"), "utf8"), "pf"));
  fs.writeFileSync(path.join(SAIDA, "emulador-pj.html"), camada(fs.readFileSync(path.join(TMP, "saida/emulador-pj.html"), "utf8"), "pj"));
  function paleta(html, seg) { Object.keys(PALETA[seg]).forEach(function (k) { html = html.replace(new RegExp(k, "gi"), PALETA[seg][k]); }); return html; }
  fs.writeFileSync(path.join(SAIDA, "report-demo-pf.html"), paleta(demoPF.html, "pf"));
  fs.writeFileSync(path.join(SAIDA, "report-demo-pj.html"), paleta(demoPJ.html, "pj"));

  /* 7 · conferência dos arquivos publicados:
     - reports: nenhum termo da marca original, da personagem ou do vermelho do banco, nem no código-fonte;
     - emuladores: o código de produção embutido tem comentários técnicos que citam a origem; por isso a conferência olha
       o que aparece na tela (fora do aviso de demonstração), os ícones e as fontes declaradas. */
  var PROIBIDOS = /santander|formiguinha|creative strategy|customer interactions|transformation hub|#ec0000/i, problemas = [];
  ["report-demo-pf.html", "report-demo-pj.html"].forEach(function (f) {
    var t = fs.readFileSync(path.join(SAIDA, f), "utf8"), re = new RegExp(PROIBIDOS.source, "gi"), x, ex = [];
    while ((x = re.exec(t))) ex.push(t.slice(Math.max(0, x.index - 40), x.index + 30).replace(/\s+/g, " "));
    if (ex.length) problemas.push(f + ": " + ex.length + " · " + ex.slice(0, 3).join(" | "));
  });
  for (var f of ["emulador-pf.html", "emulador-pj.html"]) {
    var t = fs.readFileSync(path.join(SAIDA, f), "utf8");
    if (/M 31\.5,19\.5 C 31\.4,18/.test(t) || /M%2031\.5%2C19\.5/.test(t)) problemas.push(f + ": traço da chama encontrado");
    if (/font-family:[^;"}]*Santander/i.test(t)) problemas.push(f + ": fonte proprietária declarada");
    var semAviso = t.replace(/<div class="demo-faixa"[\s\S]*?<\/div>/, "");
    if (/santander/i.test(semAviso)) problemas.push(f + ": o nome da marca original aparece fora do aviso de demonstração");
    var pg = await browser.newPage();
    await pg.goto("file://" + path.join(SAIDA, f));
    await pg.click("#bModelo"); await pg.waitForTimeout(2500);
    var visivel = await pg.evaluate(function () {
      var fora = document.querySelector(".demo-faixa"); var txt = document.body.innerText.replace(fora ? fora.innerText : "", "");
      var fr = document.querySelector("#edFrame"); if (fr && fr.contentDocument) txt += "\n" + fr.contentDocument.body.innerText;
      return txt + "\n" + document.title + "\n" + Array.prototype.map.call(document.querySelectorAll("img"), function (i) { return i.alt; }).join(" ");
    });
    await pg.close();
    var m2 = visivel.match(new RegExp(PROIBIDOS.source, "gi"));
    if (m2) problemas.push(f + ": na tela: " + m2.slice(0, 5).join(", "));
  }
  await browser.close();
  fs.readdirSync(SAIDA).forEach(function (f) { console.log("docs/demo/" + f + " (" + Math.round(fs.statSync(path.join(SAIDA, f)).size / 1024) + " KB)"); });
  if (problemas.length) { console.error("Conferência da marca: FALHA\n  " + problemas.join("\n  ")); process.exit(2); }
  console.log("Conferência da marca: ok (reports sem termos da marca original; emuladores sem a marca na tela, nos ícones e nas fontes).");
})().catch(function (e) { console.error(e); process.exit(1); });
