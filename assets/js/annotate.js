/* Highlights + typed notes for article pages.
 *
 * Anchoring: each annotation stores the exact quoted text plus ~32 chars of
 * context on either side and a character offset hint (W3C TextQuoteSelector
 * style). On load, the quote is re-located in the article's text, so small
 * edits to an article don't orphan highlights. Annotations that can no longer
 * be found are kept and listed as "unanchored" in the panel.
 *
 * Storage: localStorage key `rr:ann:<article-id>` (see common.js). Use the
 * panel's Export / Import to move them between browsers or back them up.
 */
(function () {
  "use strict";
  var RR = window.RR;
  var article = document.querySelector("article.article");
  var root = document.getElementById("article-body");
  if (!RR || !article || !root) return;

  var articleId = article.dataset.articleId;
  var COLORS = ["yellow", "green", "blue", "pink"];
  var EXCLUDE = ".chart-render, .mermaid, script, style, svg, button, textarea, .heading-anchor, .code-lang, .ann-ui";
  var CTX = 32;
  var coarse = window.matchMedia && matchMedia("(pointer: coarse)").matches;

  var rec = RR.loadAnnotations(articleId);
  var lastColor = RR.getJSON("rr:lastColor", "yellow");
  if (COLORS.indexOf(lastColor) < 0) lastColor = "yellow";

  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function nowISO() { return new Date().toISOString(); }
  function byId(id) { for (var i = 0; i < rec.items.length; i++) if (rec.items[i].id === id) return rec.items[i]; return null; }
  function marksFor(id) { return root.querySelectorAll('mark.ann[data-ann-id="' + id + '"]'); }
  function save() {
    rec.title = article.dataset.articleTitle || document.title;
    rec.url = location.pathname;
    rec.items.forEach(function (it) { delete it._orphan; });
    RR.saveAnnotations(articleId, JSON.parse(JSON.stringify(rec)));
  }

  /* ======================= text model =======================
     The article is flattened into a string. Ordinary text nodes contribute
     their text; each rendered KaTeX formula is an indivisible "atom" that
     contributes its TeX source as \( … \), so quotes keep the math and can
     be re-rendered in the notes panel. */
  function texOf(el) {
    var a = el.querySelector('annotation[encoding="application/x-tex"]');
    return "\\(" + (a ? a.textContent : el.textContent).trim() + "\\)";
  }
  function collect(node, out) {
    for (var c = node.firstChild; c; c = c.nextSibling) {
      if (c.nodeType === 3) { if (c.nodeValue) out.push({ node: c, text: c.nodeValue }); }
      else if (c.nodeType === 1) {
        if (c.classList.contains("katex")) out.push({ node: c, text: texOf(c), atom: true });
        else if (!c.matches(EXCLUDE)) collect(c, out);
      }
    }
  }
  function textIndex() {
    var raw = [], parts = [], pos = 0;
    collect(root, raw);
    raw.forEach(function (r) {
      r.start = pos; r.end = pos + r.text.length; pos = r.end;
      parts.push(r.text);
    });
    return { nodes: raw, text: parts.join("") };
  }

  function rangeToQuote(range) {
    var idx = textIndex(), s = null, e = null;
    for (var i = 0; i < idx.nodes.length; i++) {
      var t = idx.nodes[i];
      if (!range.intersectsNode(t.node)) continue;
      var a, b;
      if (t.atom) { a = 0; b = t.text.length; }
      else {
        a = t.node === range.startContainer ? range.startOffset : 0;
        b = t.node === range.endContainer ? range.endOffset : t.text.length;
      }
      if (s === null) s = t.start + a;
      e = t.start + b;
    }
    if (s === null || e <= s) return null;
    var txt = idx.text;
    while (s < e && /\s/.test(txt[s])) s++;
    while (e > s && /\s/.test(txt[e - 1])) e--;
    if (e <= s) return null;
    return { exact: txt.slice(s, e), prefix: txt.slice(Math.max(0, s - CTX), s), suffix: txt.slice(e, e + CTX), start: s };
  }

  function commonSuffix(a, b) { var n = 0; while (n < a.length && n < b.length && a[a.length - 1 - n] === b[b.length - 1 - n]) n++; return n; }
  function commonPrefix(a, b) { var n = 0; while (n < a.length && n < b.length && a[n] === b[n]) n++; return n; }

  function locate(ann, txt) {
    if (!ann.exact) return -1;
    var best = -1, bestScore = -Infinity, from = 0, guard = 0, i;
    while ((i = txt.indexOf(ann.exact, from)) !== -1 && guard++ < 2000) {
      var score = commonSuffix(txt.slice(Math.max(0, i - CTX), i), ann.prefix || "") +
                  commonPrefix(txt.slice(i + ann.exact.length, i + ann.exact.length + CTX), ann.suffix || "") -
                  Math.abs(i - (ann.start || 0)) / 10000;
      if (score > bestScore) { bestScore = score; best = i; }
      from = i + 1;
    }
    return best;
  }

  /* ======================= DOM wrapping ======================= */
  function wrap(s, e, ann) {
    var idx = textIndex(), marks = [];
    idx.nodes.forEach(function (t) {
      if (t.end <= s || t.start >= e) return;
      var node = t.node;
      if (!t.atom) {
        var a = Math.max(s, t.start) - t.start, b = Math.min(e, t.end) - t.start;
        var seg = node.nodeValue.slice(a, b);
        if (!seg.trim() && (/\n/.test(seg) || /^(TABLE|THEAD|TBODY|TFOOT|TR|UL|OL|DL)$/.test(node.parentNode.nodeName))) return;
        if (b < node.nodeValue.length) node.splitText(b);
        if (a > 0) node = node.splitText(a);
      }
      var m = document.createElement("mark");
      m.className = "ann ann-" + ann.color + (t.atom ? " ann-math" : "");
      m.dataset.annId = ann.id;
      node.parentNode.insertBefore(m, node);
      m.appendChild(node);
      marks.push(m);
    });
    decorate(ann);
    return marks;
  }

  function unwrap(id) {
    marksFor(id).forEach(function (m) {
      var p = m.parentNode;
      while (m.firstChild) p.insertBefore(m.firstChild, m);
      p.removeChild(m);
      p.normalize();
    });
  }

  function decorate(ann) {
    var ms = marksFor(ann.id);
    ms.forEach(function (m, i) {
      COLORS.forEach(function (c) { m.classList.remove("ann-" + c); });
      m.classList.add("ann-" + ann.color);
      m.classList.toggle("has-note-end", !!ann.note && i === ms.length - 1);
      if (ann.note) m.title = ann.note.length > 140 ? ann.note.slice(0, 140) + "…" : ann.note;
      else m.removeAttribute("title");
    });
  }

  function applyAll() {
    var txt = textIndex().text;
    rec.items.forEach(function (ann) {
      var s = locate(ann, txt);
      if (s < 0) { ann._orphan = true; return; }
      ann._orphan = false;
      ann.start = s;
      wrap(s, s + ann.exact.length, ann);
    });
  }

  /* ======================= UI scaffolding ======================= */
  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; }
  function swatches() {
    return COLORS.map(function (c) {
      return '<button type="button" class="ann-swatch" data-color="' + c + '" aria-label="' + c + ' highlight" title="' + c + '"></button>';
    }).join("");
  }
  var ICON_NOTE = '<svg viewBox="0 0 24 24" width="15" height="15"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/></svg>';
  var ICON_TRASH = '<svg viewBox="0 0 24 24" width="15" height="15"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>';

  var toolbar = el('<div class="ann-ui ann-toolbar" role="toolbar" aria-label="Annotate selection" hidden>' + swatches() +
    '<span class="ann-divider"></span><button type="button" class="ann-tool" data-act="note">' + ICON_NOTE + 'Note</button></div>');

  var popover = el('<div class="ann-ui ann-popover" role="dialog" aria-label="Edit annotation" hidden>' +
    '<div class="ann-popover__row"><div>' + swatches() + '</div>' +
    '<button type="button" class="ann-tool ann-tool--danger" data-act="delete" title="Delete highlight">' + ICON_TRASH + 'Delete</button></div>' +
    '<textarea placeholder="Add a note…  (math: $x^2$ or $$…$$)" aria-label="Note"></textarea>' +
    '<div class="ann-popover__row"><span class="ann-popover__hint"><span class="kbd">⌘</span> <span class="kbd">↵</span> to close</span>' +
    '<button type="button" class="ann-tool" data-act="done">Done</button></div></div>');

  var fab = el('<button type="button" class="ann-ui ann-fab" aria-controls="ann-panel" aria-expanded="false" title="Annotations (A)">' +
    ICON_NOTE + '<span class="label">Notes</span><span class="count">0</span></button>');

  var panel = el('<aside class="ann-ui ann-panel" id="ann-panel" aria-label="Annotations">' +
    '<div class="ann-panel__head"><h2>Annotations</h2><button type="button" class="icon-btn" data-act="close" aria-label="Close">' +
    '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' +
    '<div class="ann-panel__actions">' +
    '<button type="button" class="ann-tool" data-act="md">Copy as Markdown</button>' +
    '<button type="button" class="ann-tool" data-act="export">Export all</button>' +
    '<label class="ann-tool" tabindex="0">Import<input type="file" accept="application/json,.json" hidden></label>' +
    '</div><div class="ann-panel__list"></div></aside>');

  var scrim = el('<div class="ann-ui ann-scrim"></div>');
  [toolbar, popover, fab, scrim, panel].forEach(function (n) { document.body.appendChild(n); });
  var textarea = popover.querySelector("textarea");
  var list = panel.querySelector(".ann-panel__list");

  /* ======================= selection toolbar ======================= */
  var pendingRange = null;

  function selectionInRoot() {
    var sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null;
    var r = sel.getRangeAt(0);
    if (!root.contains(r.commonAncestorContainer) && !r.intersectsNode(root)) return null;
    if (popover.contains(r.commonAncestorContainer) || panel.contains(r.commonAncestorContainer)) return null;
    if (!r.toString().trim()) return null;
    return r;
  }

  function placeNear(box, rect, below) {
    box.style.visibility = "hidden";
    box.hidden = false;
    var w = box.offsetWidth, h = box.offsetHeight;
    var left = rect.left + rect.width / 2 - w / 2;
    left = Math.max(8, Math.min(left, document.documentElement.clientWidth - w - 8));
    var top = below ? rect.bottom + 10 : rect.top - h - 10;
    if (!below && top < 60) top = rect.bottom + 10;
    box.style.left = left + window.scrollX + "px";
    box.style.top = top + window.scrollY + "px";
    box.style.visibility = "";
  }

  function updateToolbar() {
    if (!popover.hidden) return;
    var r = selectionInRoot();
    if (!r) { toolbar.hidden = true; pendingRange = null; return; }
    pendingRange = r.cloneRange();
    var rects = r.getClientRects();
    var rect = rects.length ? (coarse ? rects[rects.length - 1] : rects[0]) : r.getBoundingClientRect();
    placeNear(toolbar, rect, coarse);
    toolbar.querySelectorAll(".ann-swatch").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.color === lastColor ? "true" : "false"); });
  }

  var selTimer;
  document.addEventListener("selectionchange", function () { clearTimeout(selTimer); selTimer = setTimeout(updateToolbar, coarse ? 350 : 120); });
  ["mousedown", "pointerdown"].forEach(function (ev) {
    toolbar.addEventListener(ev, function (e) { e.preventDefault(); });
  });

  toolbar.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.color) create(b.dataset.color, false);
    else if (b.dataset.act === "note") create(lastColor, true);
  });

  function create(color, withNote) {
    if (!pendingRange) return;
    var q = rangeToQuote(pendingRange);
    if (!q) return;
    lastColor = color;
    RR.setJSON("rr:lastColor", color);
    var t = nowISO();
    var ann = { id: uid(), color: color, note: "", exact: q.exact, prefix: q.prefix, suffix: q.suffix, start: q.start, created: t, updated: t };
    rec.items.push(ann);
    var marks = wrap(q.start, q.start + q.exact.length, ann);
    save();
    try { window.getSelection().removeAllRanges(); } catch (err) {}
    toolbar.hidden = true;
    pendingRange = null;
    renderPanel();
    if (withNote && marks.length) openPopover(ann.id, marks[marks.length - 1], true);
  }

  /* ======================= popover (edit) ======================= */
  var editing = null, noteTimer;

  function openPopover(id, anchorMark, focus) {
    var ann = byId(id);
    if (!ann) return;
    closePopover();
    editing = ann;
    toolbar.hidden = true;
    textarea.value = ann.note || "";
    popover.querySelectorAll(".ann-swatch").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.color === ann.color ? "true" : "false"); });
    marksFor(id).forEach(function (m) { m.classList.add("active"); });
    var mark = anchorMark || marksFor(id)[0];
    var rects = mark.getClientRects();
    placeNear(popover, rects.length ? rects[rects.length - 1] : mark.getBoundingClientRect(), true);
    if (focus) textarea.focus({ preventScroll: true });
  }

  function closePopover() {
    if (!editing) { popover.hidden = true; return; }
    commitNote();
    marksFor(editing.id).forEach(function (m) { m.classList.remove("active"); });
    editing = null;
    popover.hidden = true;
  }

  function commitNote() {
    if (!editing) return;
    var v = textarea.value.replace(/\s+$/, "");
    if (v !== (editing.note || "")) {
      editing.note = v;
      editing.updated = nowISO();
      decorate(editing);
      save();
      renderPanel();
    }
  }

  textarea.addEventListener("input", function () { clearTimeout(noteTimer); noteTimer = setTimeout(commitNote, 400); });
  textarea.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); closePopover(); }
    if (e.key === "Escape") { e.preventDefault(); closePopover(); }
  });

  popover.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b || !editing) return;
    if (b.dataset.color) {
      editing.color = b.dataset.color;
      editing.updated = nowISO();
      lastColor = editing.color;
      RR.setJSON("rr:lastColor", lastColor);
      decorate(editing);
      popover.querySelectorAll(".ann-swatch").forEach(function (s) { s.setAttribute("aria-pressed", s === b ? "true" : "false"); });
      save();
      renderPanel();
    } else if (b.dataset.act === "delete") {
      var id = editing.id;
      editing = null;
      popover.hidden = true;
      remove(id);
    } else if (b.dataset.act === "done") {
      closePopover();
    }
  });

  function remove(id) {
    unwrap(id);
    rec.items = rec.items.filter(function (a) { return a.id !== id; });
    save();
    renderPanel();
    RR.toast("Highlight removed");
  }

  /* click a highlight to edit it */
  root.addEventListener("click", function (e) {
    var m = e.target.closest("mark.ann");
    if (!m) return;
    var sel = window.getSelection();
    if (sel && !sel.isCollapsed) return;
    e.preventDefault();
    openPopover(m.dataset.annId, m, false);
  });

  document.addEventListener("mousedown", function (e) {
    if (!popover.hidden && !popover.contains(e.target) && !e.target.closest("mark.ann") && !panel.contains(e.target)) closePopover();
  });

  /* ======================= side panel ======================= */
  function setPanel(open) {
    panel.classList.toggle("open", open);
    scrim.classList.toggle("open", open && window.innerWidth < 1400);
    fab.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) renderPanel();
  }
  fab.addEventListener("click", function () { setPanel(!panel.classList.contains("open")); });
  scrim.addEventListener("click", function () { setPanel(false); });

  function sortedItems() {
    return rec.items.slice().sort(function (a, b) {
      if (!!a._orphan !== !!b._orphan) return a._orphan ? 1 : -1;
      return (a.start || 0) - (b.start || 0);
    });
  }

  function renderPanel() {
    var n = rec.items.length;
    fab.querySelector(".count").textContent = n;
    panel.querySelector("h2").textContent = n ? "Annotations (" + n + ")" : "Annotations";
    if (!panel.classList.contains("open")) return;
    if (!n) {
      list.innerHTML = '<div class="ann-panel__empty">Select any passage to highlight it or attach a note.<br><br>' +
        'Shortcuts with text selected: <kbd>H</kbd> highlight, <kbd>N</kbd> note, <kbd>1</kbd>–<kbd>4</kbd> colour. ' +
        '<kbd>A</kbd> toggles this panel.<br><br>Annotations live in this browser; use <em>Export all</em> to back them up.</div>';
      return;
    }
    list.innerHTML = sortedItems().map(function (a) {
      return '<button type="button" class="ann-item' + (a._orphan ? " orphan" : "") + '" data-id="' + a.id + '" data-color="' + a.color + '">' +
        '<p class="ann-item__quote">' + RR.esc(a.exact) + "</p>" +
        (a.note ? '<p class="ann-item__note">' + RR.esc(a.note) + "</p>" : "") +
        '<div class="ann-item__meta">' + (a._orphan ? "Unanchored — text changed · " : "") + RR.fmtDate(a.updated || a.created) + "</div></button>";
    }).join("");
    list.querySelectorAll(".ann-item__quote, .ann-item__note").forEach(RR.renderNoteMath);
  }

  list.addEventListener("click", function (e) {
    var item = e.target.closest(".ann-item");
    if (!item) return;
    var id = item.dataset.id, ms = marksFor(id);
    if (!ms.length) {
      var a = byId(id);
      if (a && confirmDelete(a)) remove(id);
      return;
    }
    if (window.innerWidth < 1400) setPanel(false);
    focusMark(id, true);
  });

  function confirmDelete(a) {
    return window.confirm("This highlight's text is no longer in the article:\n\n“" + a.exact.slice(0, 200) + "”\n\nDelete it?");
  }

  function focusMark(id, edit) {
    var ms = marksFor(id);
    if (!ms.length) return;
    ms[0].scrollIntoView({ behavior: "smooth", block: "center" });
    ms.forEach(function (m) { m.classList.add("flash"); });
    setTimeout(function () {
      ms.forEach(function (m) { m.classList.remove("flash"); });
      if (edit) openPopover(id, ms[ms.length - 1], false);
    }, 650);
  }

  panel.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (!b) return;
    if (b.dataset.act === "close") setPanel(false);
    if (b.dataset.act === "export") RR.exportAll();
    if (b.dataset.act === "md") {
      navigator.clipboard.writeText(toMarkdown()).then(function () { RR.toast("Copied annotations as Markdown"); });
    }
  });
  panel.querySelector('input[type="file"]').addEventListener("change", function (e) {
    var f = e.target.files[0];
    if (!f) return;
    RR.importFile(f).then(function (r) {
      reload();
      RR.toast("Imported: " + r.added + " new, " + r.updated + " updated");
    }).catch(function (err) { RR.toast(err.message); });
    e.target.value = "";
  });

  function toMarkdown() {
    var out = ["# " + (article.dataset.articleTitle || document.title), "", location.href.split("#")[0], ""];
    sortedItems().forEach(function (a) {
      out.push("> " + a.exact.replace(/\n+/g, "\n> "));
      if (a.note) out.push("", a.note);
      out.push("");
    });
    return out.join("\n");
  }

  function reload() {
    rec.items.forEach(function (a) { unwrap(a.id); });
    rec = RR.loadAnnotations(articleId);
    applyAll();
    renderPanel();
  }

  /* ======================= keyboard ======================= */
  document.addEventListener("keydown", function (e) {
    var t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key.toLowerCase();
    if (!toolbar.hidden && pendingRange) {
      if (k === "h") { e.preventDefault(); create(lastColor, false); return; }
      if (k === "n") { e.preventDefault(); create(lastColor, true); return; }
      if (/^[1-4]$/.test(k)) { e.preventDefault(); create(COLORS[+k - 1], false); return; }
    }
    if (k === "a") { setPanel(!panel.classList.contains("open")); }
    if (k === "escape") { closePopover(); toolbar.hidden = true; setPanel(false); }
  });

  /* other tabs editing the same article */
  window.addEventListener("storage", function (e) {
    if (e.key === "rr:ann:" + articleId) reload();
  });

  /* ======================= boot ======================= */
  function boot() {
    applyAll();
    renderPanel();
    var m = location.hash.match(/^#ann-([\w-]+)/);
    if (m) setTimeout(function () { focusMark(m[1], false); }, 300);
  }
  if (window.RR_ARTICLE_READY) boot();
  else document.addEventListener("rr:article-ready", boot, { once: true });
})();
