/* Página de apresentação: revelação discreta ao rolar e item ativo do menu. Respeita prefers-reduced-motion. */
(function () {
  "use strict";
  var reduzir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var alvos = document.querySelectorAll(".revelar");
  if (reduzir || !("IntersectionObserver" in window)) {
    alvos.forEach(function (el) { el.classList.add("visivel"); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("visivel"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    alvos.forEach(function (el) { io.observe(el); });
  }
  var links = document.querySelectorAll(".topo nav a[href^='#']");
  if ("IntersectionObserver" in window && links.length) {
    var mapa = {};
    links.forEach(function (a) { mapa[a.getAttribute("href").slice(1)] = a; });
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && mapa[e.target.id]) {
          links.forEach(function (a) { a.removeAttribute("aria-current"); });
          mapa[e.target.id].setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(mapa).forEach(function (id) { var s = document.getElementById(id); if (s) io2.observe(s); });
  }
  /* só um vídeo tocando por vez */
  var videos = document.querySelectorAll("video");
  videos.forEach(function (v) { v.addEventListener("play", function () { videos.forEach(function (o) { if (o !== v) o.pause(); }); }); });
})();
