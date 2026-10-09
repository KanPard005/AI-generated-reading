/* Article page: math, code blocks, charts, diagrams, TOC, progress, read status. */
(function () {
  "use strict";
  var RR = window.RR;
  var article = document.querySelector("article.article");
  var body = document.getElementById("article-body");
  if (!article || !body) return;
  var articleId = article.dataset.articleId;

  /* ---------- math ----------
     kramdown (math_engine: mathjax) emits \( \) and \[ \]. Older kramdown emits
     <script type="math/tex">, and a missing engine emits .kdmath spans. Handle all. */
  function renderMath() {
    if (!window.katex) return;
    body.querySelectorAll('script[type^="math/tex"]').forEach(function (s) {
      var display = /mode=display/.test(s.type);
      var el = document.createElement(display ? "div" : "span");
      try { katex.render(s.textContent, el, { displayMode: display, throwOnError: false }); } catch (e) { el.textContent = s.textContent; }
      s.replaceWith(el);
    });
    body.querySelectorAll(".kdmath").forEach(function (el) {
      var src = el.textContent.trim();
      var display = el.tagName === "DIV" || /^\$\$/.test(src);
      src = src.replace(/^\${1,2}|\${1,2}$/g, "");
      try { katex.render(src, el, { displayMode: display, throwOnError: false }); } catch (e) {}
    });
    RR.renderMath(body);
  }
  renderMath();

  /* ---------- mermaid diagrams (```mermaid fences) ---------- */
  var mermaidNodes = [];
  body.querySelectorAll("div.language-mermaid, pre > code.language-mermaid").forEach(function (el) {
    var host = el.tagName === "DIV" ? el : el.parentElement;
    var pre = document.createElement("pre");
    pre.className = "mermaid";
    pre.textContent = host.textContent.trim();
    pre.dataset.src = pre.textContent;
    host.replaceWith(pre);
    mermaidNodes.push(pre);
  });

  /* ---------- code blocks: language label + copy ---------- */
  body.querySelectorAll("div.highlighter-rouge").forEach(function (block) {
    var m = block.className.match(/language-([\w+-]+)/);
    if (m && m[1] !== "plaintext") {
      var lang = document.createElement("span");
      lang.className = "code-lang";
      lang.textContent = m[1];
      block.appendChild(lang);
    }
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "code-copy";
    btn.setAttribute("aria-label", "Copy code");
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/></svg>';
    btn.addEventListener("click", function () {
      var code = block.querySelector("code");
      navigator.clipboard.writeText(code ? code.innerText : "").then(function () {
        btn.classList.add("copied");
        setTimeout(function () { btn.classList.remove("copied"); }, 1200);
      });
    });
    block.appendChild(btn);
  });

  /* ---------- lazy script loader ---------- */
  var loaded = {};
  function load(src) {
    if (!loaded[src]) loaded[src] = new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = src; s.async = false; s.onload = res; s.onerror = function () { rej(new Error("Failed to load " + src)); };
      document.head.appendChild(s);
    });
    return loaded[src];
  }
  function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

  /* ---------- Vega-Lite charts ----------
     <script type="application/vnd.vegalite+json"> {spec} </script>  */
  var charts = [];
  body.querySelectorAll('script[type="application/vnd.vegalite+json"]').forEach(function (s) {
    var target = document.createElement("div");
    target.className = "chart-render";
    s.after(target);
    try { charts.push({ el: target, spec: JSON.parse(s.textContent) }); }
    catch (e) { target.innerHTML = '<p class="chart-error">Chart spec is not valid JSON: ' + RR.esc(e.message) + "</p>"; }
  });

  function vegaConfig() {
    var text = cssVar("--text"), muted = cssVar("--muted"), border = cssVar("--border"), font = "IBM Plex Sans, sans-serif";
    var topic = getComputedStyle(article).getPropertyValue("--topic").trim() || cssVar("--accent");
    return {
      background: null,
      font: font,
      padding: 4,
      view: { stroke: null },
      title: { color: text, font: font, fontWeight: 600, fontSize: 14, anchor: "start" },
      axis: {
        labelColor: muted, titleColor: muted, labelFont: font, titleFont: font, labelFontSize: 11, titleFontSize: 12, titleFontWeight: 500,
        domainColor: border, tickColor: border, gridColor: border, gridOpacity: 0.7
      },
      legend: { labelColor: muted, titleColor: muted, labelFont: font, titleFont: font, labelFontSize: 11, titleFontSize: 12 },
      header: { labelColor: muted, titleColor: text },
      text: { color: text, font: font },
      mark: { color: topic },
      line: { color: topic, strokeWidth: 2 },
      point: { color: topic, filled: true },
      bar: { color: topic },
      area: { color: topic, opacity: 0.35 },
      rule: { color: muted },
      range: { category: [topic, cssVar("--accent"), cssVar("--topic-philosophy"), cssVar("--topic-finance"), cssVar("--topic-science"), cssVar("--sw-pink"), muted] }
    };
  }

  function renderCharts() {
    if (!charts.length) return;
    load("https://cdn.jsdelivr.net/npm/vega@5.30.0/build/vega.min.js")
      .then(function () { return load("https://cdn.jsdelivr.net/npm/vega-lite@5.21.0/build/vega-lite.min.js"); })
      .then(function () { return load("https://cdn.jsdelivr.net/npm/vega-embed@6.26.0/build/vega-embed.min.js"); })
      .then(function () {
        var cfg = vegaConfig();
        charts.forEach(function (c) {
          var spec = JSON.parse(JSON.stringify(c.spec));
          if (spec.width === undefined && !spec.facet && !spec.hconcat && !spec.concat && !spec.repeat) {
            spec.width = "container";
            spec.autosize = spec.autosize || { type: "fit-x", contains: "padding" };
          }
          spec.config = Object.assign({}, cfg, spec.config || {});
          if (c.view) { try { c.view.finalize(); } catch (e) {} }
          c.el.innerHTML = "";
          window.vegaEmbed(c.el, spec, { actions: false, renderer: "svg" })
            .then(function (res) { c.view = res.view; })
            .catch(function (e) { c.el.innerHTML = '<p class="chart-error">' + RR.esc(e.message) + "</p>"; });
        });
      })
      .catch(function (e) { charts.forEach(function (c) { c.el.innerHTML = '<p class="chart-error">' + RR.esc(e.message) + "</p>"; }); });
  }

  function renderMermaid() {
    if (!mermaidNodes.length) return;
    load("https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js").then(function () {
      mermaidNodes.forEach(function (n) { n.removeAttribute("data-processed"); n.innerHTML = RR.esc(n.dataset.src); });
      window.mermaid.initialize({
        startOnLoad: false,
        theme: RR.currentTheme() === "dark" ? "dark" : "neutral",
        fontFamily: "IBM Plex Sans, sans-serif",
        securityLevel: "strict"
      });
      return window.mermaid.run({ nodes: mermaidNodes });
    }).catch(function (e) { console.error(e); });
  }

  renderCharts();
  renderMermaid();
  document.addEventListener("rr:themechange", function () { renderCharts(); renderMermaid(); });

  /* ---------- heading anchors + TOC ---------- */
  var heads = Array.prototype.slice.call(body.querySelectorAll("h2[id], h3[id]"));
  heads.forEach(function (h) {
    var a = document.createElement("a");
    a.className = "heading-anchor";
    a.href = "#" + h.id;
    a.setAttribute("aria-hidden", "true");
    a.tabIndex = -1;
    a.textContent = "#";
    h.prepend(a);
  });

  var toc = document.querySelector(".toc");
  if (toc && heads.length >= 3) {
    var ol = toc.querySelector("ol");
    var links = {};
    heads.forEach(function (h) {
      var li = document.createElement("li");
      li.className = "toc-" + h.tagName.toLowerCase();
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent.replace(/^#/, "").trim();
      li.appendChild(a);
      ol.appendChild(li);
      links[h.id] = a;
    });
    toc.hidden = false;

    var active = null;
    function spy() {
      var y = window.scrollY + 120, cur = heads[0];
      for (var i = 0; i < heads.length; i++) { if (heads[i].offsetTop <= y) cur = heads[i]; else break; }
      if (cur && active !== cur.id) {
        if (active && links[active]) links[active].classList.remove("active");
        active = cur.id;
        links[active].classList.add("active");
      }
    }
    window.addEventListener("scroll", spy, { passive: true });
    spy();
  }

  /* ---------- reading progress ---------- */
  var bar = document.querySelector(".progress span");
  function progress() {
    var rect = article.getBoundingClientRect();
    var total = rect.height - window.innerHeight * 0.6;
    var p = Math.min(1, Math.max(0, -rect.top / Math.max(1, total)));
    if (bar) bar.style.width = (p * 100).toFixed(2) + "%";
  }
  window.addEventListener("scroll", progress, { passive: true });
  window.addEventListener("resize", progress);
  progress();

  /* ---------- read status ---------- */
  var readBtn = document.getElementById("mark-read");
  var readMeta = document.querySelector(".meta__read");
  function syncRead() {
    var on = RR.isRead(articleId);
    if (readBtn) { readBtn.setAttribute("aria-pressed", on ? "true" : "false"); readBtn.textContent = on ? "✓ Read" : "Mark as read"; }
    if (readMeta) readMeta.hidden = !on;
  }
  if (readBtn) readBtn.addEventListener("click", function () { RR.setRead(articleId, !RR.isRead(articleId)); syncRead(); });
  syncRead();

  window.RR_ARTICLE_READY = true;
  document.dispatchEvent(new CustomEvent("rr:article-ready"));
})();
