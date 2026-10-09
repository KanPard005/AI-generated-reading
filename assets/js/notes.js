/* Notes page: every highlight and note across all articles, grouped by article. */
(function () {
  "use strict";
  var RR = window.RR;
  var meta = {};
  RR.articlesData().forEach(function (a) { meta[a.id] = a; });
  var listEl = document.getElementById("notes-list"), countEl = document.getElementById("ncount");
  var nq = document.getElementById("nq"), nkind = document.getElementById("nkind");

  function render() {
    var all = RR.allAnnotations();
    var terms = nq.value.toLowerCase().split(/\s+/).filter(Boolean);
    var kind = nkind.value;
    var groups = Object.keys(all).map(function (id) {
      var rec = all[id], m = meta[id] || {};
      var title = m.title || rec.title || id, url = m.url || rec.url || "#";
      var items = rec.items.filter(function (a) {
        if (kind === "notes" && !a.note) return false;
        if (kind && kind !== "notes" && a.color !== kind) return false;
        var hay = (a.exact + " " + (a.note || "") + " " + title).toLowerCase();
        return terms.every(function (t) { return hay.indexOf(t) !== -1; });
      }).sort(function (a, b) { return (a.start || 0) - (b.start || 0); });
      var latest = rec.items.reduce(function (s, a) { var u = a.updated || a.created || ""; return u > s ? u : s; }, "");
      return { id: id, title: title, url: url, items: items, latest: latest, missing: !meta[id] };
    }).filter(function (g) { return g.items.length; })
      .sort(function (a, b) { return a.latest < b.latest ? 1 : -1; });

    var total = groups.reduce(function (s, g) { return s + g.items.length; }, 0);
    countEl.textContent = total ? total + " annotation" + (total === 1 ? "" : "s") + " across " + groups.length + " article" + (groups.length === 1 ? "" : "s") : "";
    if (!groups.length) {
      listEl.innerHTML = '<div class="empty"><p>' + (terms.length || kind ? "Nothing matches." : "No highlights yet. Select text in any article to start.") + "</p></div>";
      return;
    }
    listEl.innerHTML = groups.map(function (g) {
      return '<section class="note-group"><header class="note-group__head"><h2><a href="' + RR.esc(g.url) + '">' + RR.esc(g.title) + "</a></h2>" +
        "<span>" + g.items.length + (g.missing ? " · article removed" : "") + "</span></header>" +
        g.items.map(function (a) {
          return '<div class="ann-item" data-color="' + RR.esc(a.color) + '"><p class="ann-item__quote">' + RR.esc(a.exact) + "</p>" +
            (a.note ? '<p class="ann-item__note">' + RR.esc(a.note) + "</p>" : "") +
            '<div class="ann-item__meta">' + RR.esc(RR.fmtDate(a.updated || a.created)) +
            ' · <a href="' + RR.esc(g.url) + "#ann-" + RR.esc(a.id) + '">Open in article →</a></div></div>';
        }).join("") + "</section>";
    }).join("");
    listEl.querySelectorAll(".ann-item__quote, .ann-item__note").forEach(RR.renderNoteMath);
  }

  var t;
  nq.addEventListener("input", function () { clearTimeout(t); t = setTimeout(render, 120); });
  nkind.addEventListener("change", render);
  document.getElementById("n-export").addEventListener("click", function () { RR.exportAll(); });
  document.getElementById("n-import").addEventListener("change", function (e) {
    var f = e.target.files[0];
    if (!f) return;
    RR.importFile(f).then(function (r) { render(); RR.toast("Imported: " + r.added + " new, " + r.updated + " updated"); })
      .catch(function (err) { RR.toast(err.message); });
    e.target.value = "";
  });
  window.addEventListener("storage", render);

  if (document.readyState === "complete") render();
  else window.addEventListener("load", render);
})();
