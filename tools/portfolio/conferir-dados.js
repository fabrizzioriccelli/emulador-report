/*
 * Confere a coerência dos dados FICTÍCIOS da demonstração: recalcula cada indicador a partir da base
 * (tools/portfolio/demo/metricas.json) e compara com o texto que está nos arquivos de dados do report
 * (dados-demo-pf.txt e dados-demo-pj.txt). Falha se algum número não bater.
 * Uso: node tools/portfolio/conferir-dados.js
 */
"use strict";
var fs = require("fs"), path = require("path");
var DIR = path.join(__dirname, "demo");
var M = JSON.parse(fs.readFileSync(path.join(DIR, "metricas.json"), "utf8"));

function blocos(arq) {
  var b = {}, atual = null;
  fs.readFileSync(path.join(DIR, arq), "utf8").split(/\r?\n/).forEach(function (l) {
    var t = /^\[([^\]]+)\]\s*$/.exec(l); if (t) { atual = b[t[1]] = {}; return; }
    var c = /^([a-z_]+):\s?(.*)$/.exec(l); if (c && atual) atual[c[1]] = c[2];
  });
  return b;
}
/* formatos pt-BR */
function dec(v, n) { return v.toFixed(n).replace(".", ","); }
function pct(v, n) { return dec(v * 100, n === undefined ? 2 : n) + "%"; }
function mil(v) { return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
function brl(v) { return "R$ " + dec(v, 2); }
function vari(atual, ref) { var x = (atual / ref - 1) * 100, s = x > 0 ? "+" : "-", a = Math.abs(x); return s + (Math.abs(a - Math.round(a)) < 0.05 ? String(Math.round(a)) : dec(a, 1)) + "%"; }

var erros = [], ok = 0;
function confere(onde, obtido, esperado) {
  if (obtido === esperado) { ok++; console.log("  ok  " + onde + ": " + obtido); }
  else { erros.push(onde); console.log("  FALHA " + onde + ": está \"" + obtido + "\", o cálculo dá \"" + esperado + "\""); }
}

/* ---- PF ---- */
var pf = blocos("dados-demo-pf.txt"), H = M.pf.campanha_horizonte, A = M.pf.projeto_aurora, Q = M.pf.qualidade_criativa;
var ctr = H.atual.cliques / H.atual.impressoes, ctrR = H.referencia.cliques / H.referencia.impressoes;
var cpa = H.atual.investimento / H.atual.conversoes, cpaR = H.referencia.investimento / H.referencia.conversoes;
console.log("PF · Campanha Horizonte");
confere("CTR (cliques ÷ impressões)", pf["NUMERO 1"].valor, pct(ctr));
confere("CTR de referência", pf["NUMERO 1"].detalhe, "Referência: " + pct(ctrR) + " em março");
confere("variação do CTR", pf["NUMERO 1"].variacao, vari(ctr, ctrR));
confere("custo por conversão (investimento ÷ conversões)", pf["NUMERO 2"].valor, brl(cpa));
confere("custo por conversão de referência", pf["NUMERO 2"].detalhe, "Referência: " + brl(cpaR) + " em março");
confere("variação do custo por conversão", pf["NUMERO 2"].variacao, vari(cpa, cpaR));
confere("conversões", pf["NUMERO 3"].valor, mil(H.atual.conversoes));
confere("conversões de referência", pf["NUMERO 3"].detalhe, "Referência: " + mil(H.referencia.conversoes) + " em março");
confere("variação das conversões", pf["NUMERO 3"].variacao, vari(H.atual.conversoes, H.referencia.conversoes));
confere("resumo da campanha", pf["PROJETO PRINCIPAL"].resumo, "A nova chamada principal elevou o CTR para " + pct(ctr) + " e reduziu o custo por conversão para " + brl(cpa) + ", com " + mil(H.atual.conversoes) + " conversões no mês.");
console.log("PF · Projeto Aurora");
var vc = A.atual.visualizacoes_completas, vcR = A.referencia.visualizacoes_completas;
confere("visualizações completas", pf["RESULTADO 1"].valor, Math.round(vc / 1000) + " mil");
confere("variação das visualizações", pf["RESULTADO 1"].variacao, vari(vc, vcR));
confere("taxa de conclusão (completas ÷ alcance)", pf["RESULTADO 2"].valor, pct(vc / A.atual.alcance, 1));
confere("taxa de conclusão de referência", pf["RESULTADO 2"].detalhe, "Referência: " + pct(vcR / A.referencia.alcance, 1) + " em março");
confere("variação da taxa de conclusão", pf["RESULTADO 2"].variacao, vari(vc / A.atual.alcance, vcR / A.referencia.alcance));
confere("custo por visualização completa", pf["RESULTADO 3"].valor, brl(A.atual.investimento / vc));
confere("custo de referência", pf["RESULTADO 3"].detalhe, "Referência: " + brl(A.referencia.investimento / vcR) + " em março");
confere("variação do custo", pf["RESULTADO 3"].variacao, vari(A.atual.investimento / vc, A.referencia.investimento / vcR));
console.log("PF · qualidade criativa e textos");
confere("índice atual", pf["CREATIVE X"].atual, Q.atual + "%");
confere("índice anterior", pf["CREATIVE X"].anterior, Q.referencia + "%");
confere("variação do índice", pf["CREATIVE X"].variacao, "+" + (Q.atual - Q.referencia) + " p.p.");
confere("aprendizado 1", pf["APRENDIZADO 1"].texto, "Com a nova chamada principal, o CTR da Campanha Horizonte passou de " + pct(ctrR) + " para " + pct(ctr) + ".");
confere("aprendizado 2", pf["APRENDIZADO 2"].texto, "No Projeto Aurora, " + pct(vc / A.atual.alcance, 1) + " de quem foi alcançado viu o vídeo até o fim (" + pct(vcR / A.referencia.alcance, 1) + " em março).");

/* ---- PJ ---- */
var pj = blocos("dados-demo-pj.txt"), V = M.pj.programa_vertice, C = M.pj.conecta_negocios, Q2 = M.pj.qualidade_criativa;
console.log("PJ · Programa Vértice (funil)");
confere("cliques", pj["NUMERO 1"].valor, mil(V.atual.cliques));
confere("variação dos cliques", pj["NUMERO 1"].variacao, vari(V.atual.cliques, V.referencia.cliques));
confere("leads", pj["NUMERO 2"].valor, mil(V.atual.leads));
confere("variação dos leads", pj["NUMERO 2"].variacao, vari(V.atual.leads, V.referencia.leads));
confere("contas abertas", pj["NUMERO 3"].valor, mil(V.atual.contas));
confere("variação das contas", pj["NUMERO 3"].variacao, vari(V.atual.contas, V.referencia.contas));
var c1 = V.atual.leads / V.atual.cliques, c2 = V.atual.contas / V.atual.leads;
confere("conversão clique → lead = lead → conta", pct(c1, 0), pct(c2, 0));
confere("resumo do funil", pj["PROJETO PRINCIPAL"].resumo, "Em abril, " + mil(V.atual.cliques) + " cliques viraram " + mil(V.atual.leads) + " leads e " + mil(V.atual.contas) + " contas abertas: " + pct(c1, 0) + " de conversão em cada etapa do funil.");
confere("aprendizado 1 (clique → lead, março)", pj["APRENDIZADO 1"].texto, "Com três campos, " + pct(c1, 0) + " dos cliques viraram leads (" + pct(V.referencia.leads / V.referencia.cliques, 0) + " em março).");
console.log("PJ · Conecta Negócios");
confere("participantes", pj["RESULTADO 1"].valor, mil(C.atual.participantes));
confere("variação dos participantes", pj["RESULTADO 1"].variacao, vari(C.atual.participantes, C.referencia.participantes));
confere("taxa de presença (participantes ÷ inscritos)", pj["RESULTADO 2"].valor, pct(C.atual.participantes / C.atual.inscritos, 1));
confere("detalhe da presença", pj["RESULTADO 2"].detalhe, mil(C.atual.participantes) + " de " + mil(C.atual.inscritos) + " inscritos");
confere("NPS", pj["RESULTADO 3"].valor, String(C.atual.nps));
confere("variação do NPS", pj["RESULTADO 3"].variacao, "+" + (C.atual.nps - C.referencia.nps) + " pts");
confere("aprendizado 2", pj["APRENDIZADO 2"].texto, "Nos encontros da Conecta Negócios, " + mil(C.atual.participantes) + " dos " + mil(C.atual.inscritos) + " inscritos participaram: " + pct(C.atual.participantes / C.atual.inscritos, 1) + ".");
confere("índice atual", pj["CREATIVE X"].atual, Q2.atual + "%");
confere("variação do índice", pj["CREATIVE X"].variacao, "+" + (Q2.atual - Q2.referencia) + " p.p.");

console.log("\n" + ok + " conferências ok" + (erros.length ? ", " + erros.length + " com FALHA" : ", nenhuma falha"));
process.exit(erros.length ? 1 : 0);
