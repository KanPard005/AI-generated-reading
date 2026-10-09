/* Shared helpers: storage, theme, export/import, toast. Exposed as window.RR. */
(function () {
  "use strict";

  var ANN_PREFIX = "rr:ann:";
  var READ_KEY = "rr:read";

  function getJSON(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function setJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { toast("Couldn't save — browser storage is unavailable."); return false; }
  }
  function removeKey(key) { try { localStorage.removeItem(key); } catch (e) {} }
  function keys() {
    var out = [];
    try { for (var i = 0; i < localStorage.length; i++) out.push(localStorage.key(i)); } catch (e) {}
    return out;
  }

  /* ---------- annotations store ---------- */
  function loadAnnotations(id) {
    var rec = getJSON(ANN_PREFIX + id, null);
    if (!rec) return { v: 1, title: "", url: "", items: [] };
    if (Array.isArray(rec)) rec = { v: 1, title: "", url: "", items: rec };
    rec.items = rec.items || [];
    return rec;
  }
  function saveAnnotations(id, rec) {
    if (!rec.items.length) { removeKey(ANN_PREFIX + id); return true; }
    return setJSON(ANN_PREFIX + id, rec);
  }
  function allAnnotations() {
    var out = {};
    keys().forEach(function (k) {
      if (k && k.indexOf(ANN_PREFIX) === 0) out[k.slice(ANN_PREFIX.length)] = loadAnnotations(k.slice(ANN_PREFIX.length));
    });
    return out;
  }
  function annotationCount(id) { return loadAnnotations(id).items.length; }

  /* ---------- read status ---------- */
  function readMap() { return getJSON(READ_KEY, {}) || {}; }
  function isRead(id) { return !!readMap()[id]; }
  function setRead(id, on) {
    var m = readMap();
    if (on) m[id] = new Date().toISOString(); else delete m[id];
    setJSON(READ_KEY, m);
  }

  /* ---------- export / import ---------- */
  function exportAll(filename) {
    var data = {
      format: "reading-room-annotations",
      version: 1,
      exportedAt: new Date().toISOString(),
      articles: allAnnotations(),
      read: readMap()
    };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename || ("reading-room-annotations-" + new Date().toISOString().slice(0, 10) + ".json");
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  }

  /* Merge an export into local storage. Per annotation id, the newer `updated` wins. */
  function importData(data) {
    if (!data || data.format !== "reading-room-annotations" || !data.articles) throw new Error("Not a Reading Room export file.");
    var added = 0, updated = 0;
    Object.keys(data.articles).forEach(function (id) {
      var incoming = data.articles[id];
      if (Array.isArray(incoming)) incoming = { items: incoming };
      var local = loadAnnotations(id);
      local.title = local.title || incoming.title || "";
      local.url = local.url || incoming.url || "";
      var byId = {};
      local.items.forEach(function (it) { byId[it.id] = it; });
      (incoming.items || []).forEach(function (it) {
        var cur = byId[it.id];
        if (!cur) { local.items.push(it); added++; }
        else if ((it.updated || "") > (cur.updated || "")) { Object.assign(cur, it); updated++; }
      });
      saveAnnotations(id, local);
    });
    if (data.read) {
      var m = readMap();
      Object.keys(data.read).forEach(function (k) { if (!m[k]) m[k] = data.read[k]; });
      setJSON(READ_KEY, m);
    }
    return { added: added, updated: updated };
  }
  function importFile(file) {
    return file.text().then(function (txt) { return importData(JSON.parse(txt)); });
  }

  /* ---------- misc ---------- */
  var toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2200);
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function articlesData() {
    var el = document.getElementById("articles-data");
    if (!el) return [];
    try { return JSON.parse(el.textContent) || []; } catch (e) { console.error("Bad articles data", e); return []; }
  }
  var MATH_DELIMS = [
    { left: "$$", right: "$$", display: true },
    { left: "\\[", right: "\\]", display: true },
    { left: "\\(", right: "\\)", display: false }
  ];
  function renderMath(el) {
    if (window.renderMathInElement) {
      try { window.renderMathInElement(el, { delimiters: MATH_DELIMS, throwOnError: false }); } catch (e) {}
    }
  }
  /* Notes and quotes also accept single-dollar inline math, as in LaTeX. */
  var NOTE_DELIMS = MATH_DELIMS.concat([{ left: "$", right: "$", display: false }]);
  function renderNoteMath(el) {
    if (window.renderMathInElement) {
      try { window.renderMathInElement(el, { delimiters: NOTE_DELIMS, throwOnError: false }); } catch (e) {}
    }
  }
  function fmtDate(iso) {
    try { return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); }
    catch (e) { return iso; }
  }

  /* ---------- theme ---------- */
  function currentTheme() {
    var t = document.documentElement.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  var btn = document.getElementById("theme-toggle");
  if (btn) btn.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("rr:theme", next); } catch (e) {}
    document.dispatchEvent(new CustomEvent("rr:themechange", { detail: next }));
  });
  if (window.matchMedia) {
    var mq = matchMedia("(prefers-color-scheme: dark)");
    var onChange = function () {
      if (!document.documentElement.getAttribute("data-theme")) document.dispatchEvent(new CustomEvent("rr:themechange", { detail: currentTheme() }));
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
  }

  window.RR = {
    getJSON: getJSON, setJSON: setJSON,
    loadAnnotations: loadAnnotations, saveAnnotations: saveAnnotations, allAnnotations: allAnnotations, annotationCount: annotationCount,
    readMap: readMap, isRead: isRead, setRead: setRead,
    exportAll: exportAll, importData: importData, importFile: importFile,
    toast: toast, esc: esc, articlesData: articlesData, renderMath: renderMath, renderNoteMath: renderNoteMath, fmtDate: fmtDate,
    currentTheme: currentTheme, MATH_DELIMS: MATH_DELIMS
  };
})();
