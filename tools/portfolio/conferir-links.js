/*
 * Confere os links da apresentação: README.md, README.en.md, docs/*.md (os documentos do case) e docs/index.html.
 * - links e imagens relativos: o arquivo existe;
 * - âncoras (#...): existe um título com esse "slug" (regra do GitHub) no documento de destino;
 * - links externos: só lista (a rede deste ambiente não acessa todos os domínios).
 * Uso: node tools/portfolio/conferir-links.js
 */
"use strict";
var fs = require("fs"), path = require("path");
var RAIZ = path.join(__dirname, "..", "..");
var DOCS = ["README.md", "README.en.md", "CHANGELOG.md", "docs/overview.md", "docs/problem-and-solution.md", "docs/architecture.md", "docs/features.md", "docs/user-guide.md", "docs/demo-data.md",
  "docs/benchmark.md", "docs/contribution.md", "docs/disclaimer.md", "docs/operacao.md", "docs/audit/publication-audit.md", "docs/audit/test-report.md", "tools/portfolio/README.md", "docs/index.html"];

function slug(t) {
  return t.trim().toLowerCase().replace(/<[^>]+>/g, "").replace(/[`*_~]/g, "").replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s/g, "-");
}
function ancoras(arq) {
  var t = fs.readFileSync(arq, "utf8"), s = {}, vistos = {};
  if (/\.html$/.test(arq)) { (t.match(/\sid="([^"]+)"/g) || []).forEach(function (m) { s[m.slice(5, -1)] = 1; }); return s; }
  t.replace(/```[\s\S]*?```/g, "").split(/\r?\n/).forEach(function (l) {
    var m = /^#{1,6}\s+(.+?)\s*#*\s*$/.exec(l); if (!m) return;
    var b = slug(m[1]), k = b; if (vistos[b] !== undefined) { vistos[b]++; k = b + "-" + vistos[b]; } else vistos[b] = 0; s[k] = 1;
  });
  return s;
}
var erros = [], externos = {}, total = 0;
DOCS.forEach(function (rel) {
  var arq = path.join(RAIZ, rel); if (!fs.existsSync(arq)) { erros.push(rel + ": o documento não existe"); return; }
  var t = fs.readFileSync(arq, "utf8").replace(/```[\s\S]*?```/g, ""), links = [];
  var re = /\]\(([^)\s]+)(?:\s+"[^"]*")?\)|(?:src|href|srcset|poster)="([^"]+)"/g, m;
  while ((m = re.exec(t))) links.push(m[1] || m[2]);
  links.forEach(function (u) {
    total++;
    if (/^(https?:|mailto:)/.test(u)) { externos[u] = (externos[u] || []).concat(rel); return; }
    if (/^data:/.test(u)) return;
    var p = u.split("#"), alvo = p[0] ? path.resolve(path.dirname(arq), decodeURIComponent(p[0].split("?")[0])) : arq, anc = p[1];
    if (!fs.existsSync(alvo)) { erros.push(rel + ": arquivo não encontrado: " + u); return; }
    if (anc && fs.statSync(alvo).isFile() && /\.(md|html)$/.test(alvo)) {
      if (!ancoras(alvo)[decodeURIComponent(anc)]) erros.push(rel + ": âncora não encontrada: " + u);
    }
  });
});
console.log(total + " links conferidos em " + DOCS.length + " documentos; " + Object.keys(externos).length + " externos (listados, não acessados):");
Object.keys(externos).sort().forEach(function (u) { console.log("  " + u); });
if (erros.length) { console.log("\nPROBLEMAS (" + erros.length + "):\n  " + erros.join("\n  ")); process.exit(1); }
console.log("\nNenhum link relativo quebrado e nenhuma âncora faltando.");
