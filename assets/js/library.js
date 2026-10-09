/* Library page: search + filter by topic, tags, length, status. State mirrors the URL. */
(function () {
  "use strict";
  var RR = window.RR;
  var data = RR.articlesData();
  var $ = function (id) { return document.getElementById(id); };
  var q = $("q"), len = $("len"), status = $("status"), sort = $("sort");
  var topicsEl = $("topics"), tagsEl = $("tags"), results = $("results"), countEl = $("count"), empty = $("empty"), clearBtn = $("clear-filters");

  var state = { q: "", topic: "", tags: [], len: "", status: "", sort: "new" };
  var TAG_LIMIT = 40, showAllTags = false;

  /* ---------- URL <-> state ---------- */
  function readURL() {
    var p = new URLSearchParams(location.search);
    state.q = p.get("q") || "";
    state.topic = p.get("topic") || "";
    state.tags = (p.get("tag") || p.get("tags") || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    state.len = p.get("len") || "";
    state.status = p.get("status") || "";
    state.sort = p.get("sort") || "new";
  }
  function writeURL() {
    var p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.topic) p.set("topic", state.topic);
    if (state.tags.length) p.set("tag", state.tags.join(","));
    if (state.len) p.set("len", state.len);
    if (state.status) p.set("status", state.status);
    if (state.sort !== "new") p.set("sort", state.sort);
    var s = p.toString();
    history.replaceState(null, "", location.pathname + (s ? "?" + s : ""));
  }

  /* ---------- filtering ---------- */
  var readMap = RR.readMap();
  function annCount(id) { return RR.annotationCount(id); }

  function matchText(a, terms) {
    if (!terms.length) return true;
    var hay = [a.title, a.subtitle, a.summary, a.topic_label, (a.tags || []).join(" ")].join(" ").toLowerCase();
    return terms.every(function (t) { return hay.indexOf(t) !== -1; });
  }
  function matchLen(a) {
    var m = a.reading_time || 0;
    if (state.len === "short") return m <= 10;
    if (state.len === "medium") return m > 10 && m <= 20;
    if (state.len === "long") return m > 20;
    return true;
  }
  function matchStatus(a) {
    if (state.status === "read") return !!readMap[a.id];
    if (state.status === "unread") return !readMap[a.id];
    if (state.status === "annotated") return annCount(a.id) > 0;
    return true;
  }
  function matchTags(a) {
    var t = a.tags || [];
    return state.tags.every(function (x) { return t.indexOf(x) !== -1; });
  }

  function filtered(opts) {
    opts = opts || {};
    var terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    return data.filter(function (a) {
      return (opts.ignoreTopic || !state.topic || a.topic === state.topic) &&
        (opts.ignoreTags || matchTags(a)) && matchText(a, terms) && matchLen(a) && matchStatus(a);
    });
  }

  function sorted(arr) {
    var s = state.sort;
    return arr.slice().sort(function (a, b) {
      if (s === "old") return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
      if (s === "short") return (a.reading_time || 0) - (b.reading_time || 0);
      if (s === "long") return (b.reading_time || 0) - (a.reading_time || 0);
      if (s === "title") return a.title.localeCompare(b.title);
      return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
    });
  }

  /* ---------- rendering ---------- */
  function renderTopics() {
    var base = filtered({ ignoreTopic: true });
    var counts = {}, labels = {};
    data.forEach(function (a) { labels[a.topic] = a.topic_label || a.topic; counts[a.topic] = 0; });
    base.forEach(function (a) { counts[a.topic]++; });
    var html = '<button type="button" class="pill" data-topic="" aria-pressed="' + (!state.topic) + '">All <span class="n">' + base.length + "</span></button>";
    Object.keys(labels).sort().forEach(function (t) {
      html += '<button type="button" class="pill topic-' + RR.esc(t) + '" data-topic="' + RR.esc(t) + '" aria-pressed="' + (state.topic === t) + '">' +
        '<span class="dot"></span>' + RR.esc(labels[t]) + ' <span class="n">' + counts[t] + "</span></button>";
    });
    topicsEl.innerHTML = html;
  }

  function renderTags() {
    var base = filtered({ ignoreTags: true });
    var current = filtered();
    var all = {}, avail = {};
    data.forEach(function (a) { (a.tags || []).forEach(function (t) { all[t] = 0; }); });
    base.forEach(function (a) { (a.tags || []).forEach(function (t) { all[t]++; }); });
    current.forEach(function (a) { (a.tags || []).forEach(function (t) { avail[t] = (avail[t] || 0) + 1; }); });
    var names = Object.keys(all).sort(function (x, y) {
      var sx = state.tags.indexOf(x) !== -1, sy = state.tags.indexOf(y) !== -1;
      if (sx !== sy) return sx ? -1 : 1;
      return (all[y] - all[x]) || x.localeCompare(y);
    });
    var shown = showAllTags ? names : names.slice(0, TAG_LIMIT);
    tagsEl.innerHTML = shown.map(function (t) {
      var on = state.tags.indexOf(t) !== -1;
      var n = on ? all[t] : (avail[t] || 0);
      return '<button type="button" class="tag-toggle" data-tag="' + RR.esc(t) + '" aria-pressed="' + on + '"' + (!on && !n ? " disabled" : "") + ">" +
        RR.esc(t) + '<span class="n">' + n + "</span></button>";
    }).join("") +
      (names.length > TAG_LIMIT ? '<button type="button" class="link-btn" id="more-tags">' + (showAllTags ? "Fewer" : "All " + names.length + " tags") + "</button>" : "");
    if (!names.length) tagsEl.innerHTML = '<span class="results-count">No tags yet.</span>';
  }

  var CLOCK = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';

  function card(a) {
    var read = !!readMap[a.id], n = annCount(a.id);
    return '<li><div class="card topic-' + RR.esc(a.topic) + (read ? " is-read" : "") + '">' +
      '<div class="card__top"><span><span class="dot"></span> ' + RR.esc(a.topic_label || a.topic) + "</span>" +
      '<span class="card__time">' + CLOCK + (a.reading_time || "?") + " min</span></div>" +
      '<h2><a href="' + RR.esc(a.url) + '">' + RR.esc(a.title) + "</a></h2>" +
      (a.summary || a.subtitle ? '<p class="card__sub">' + RR.esc(a.summary || a.subtitle) + "</p>" : "") +
      ((a.tags || []).length ? '<ul class="tags">' + a.tags.map(function (t) {
        return '<li><a class="tag" href="?tag=' + encodeURIComponent(t) + '" data-tag="' + RR.esc(t) + '">' + RR.esc(t) + "</a></li>";
      }).join("") + "</ul>" : "") +
      '<div class="card__foot"><span>' + RR.esc(RR.fmtDate(a.date + "T12:00:00")) + "</span>" +
      (a.level ? "<span>· " + RR.esc(a.level) + "</span>" : "") +
      (read ? '<span class="badge badge--read">Read</span>' : "") +
      (n ? '<span class="badge badge--notes">' + n + " note" + (n === 1 ? "" : "s") + "</span>" : "") +
      "</div></div></li>";
  }

  function render() {
    renderTopics();
    renderTags();
    var list = sorted(filtered());
    results.innerHTML = list.map(card).join("");
    empty.hidden = list.length > 0 || data.length === 0;
    countEl.textContent = data.length === 0 ? "No articles yet." :
      list.length === data.length ? data.length + " article" + (data.length === 1 ? "" : "s") :
      list.length + " of " + data.length + " articles";
    var active = state.q || state.topic || state.tags.length || state.len || state.status;
    clearBtn.hidden = !active;
    q.value = state.q; len.value = state.len; status.value = state.status; sort.value = state.sort;
    writeURL();
  }

  function stats() {
    var mins = data.reduce(function (s, a) { return s + (a.reading_time || 0); }, 0);
    var nRead = data.filter(function (a) { return readMap[a.id]; }).length;
    var nAnn = Object.values(RR.allAnnotations()).reduce(function (s, r) { return s + r.items.length; }, 0);
    var dur = mins < 60 ? mins + " min" : (mins / 60).toFixed(1) + " h";
    $("lib-stats").textContent = data.length ? data.length + " article" + (data.length === 1 ? "" : "s") + " · " + dur + " of reading · " +
      nRead + " read · " + nAnn + " annotation" + (nAnn === 1 ? "" : "s") : "";
  }

  /* ---------- events ---------- */
  var qTimer;
  q.addEventListener("input", function () { clearTimeout(qTimer); qTimer = setTimeout(function () { state.q = q.value.trim(); render(); }, 120); });
  len.addEventListener("change", function () { state.len = len.value; render(); });
  status.addEventListener("change", function () { state.status = status.value; render(); });
  sort.addEventListener("change", function () { state.sort = sort.value; render(); });
  topicsEl.addEventListener("click", function (e) {
    var b = e.target.closest("[data-topic]");
    if (!b) return;
    state.topic = b.dataset.topic === state.topic ? "" : b.dataset.topic;
    render();
  });
  function toggleTag(t) {
    var i = state.tags.indexOf(t);
    if (i === -1) state.tags.push(t); else state.tags.splice(i, 1);
    render();
  }
  tagsEl.addEventListener("click", function (e) {
    if (e.target.id === "more-tags") { showAllTags = !showAllTags; renderTags(); return; }
    var b = e.target.closest("[data-tag]");
    if (b) toggleTag(b.dataset.tag);
  });
  results.addEventListener("click", function (e) {
    var t = e.target.closest("a.tag[data-tag]");
    if (!t) return;
    e.preventDefault();
    if (state.tags.indexOf(t.dataset.tag) === -1) toggleTag(t.dataset.tag);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  clearBtn.addEventListener("click", function () {
    state.q = ""; state.topic = ""; state.tags = []; state.len = ""; state.status = "";
    render();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== q && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
      e.preventDefault(); q.focus();
    }
  });
  window.addEventListener("pageshow", function (e) { if (e.persisted) { readMap = RR.readMap(); render(); stats(); } });

  readURL();
  render();
  stats();
})();
