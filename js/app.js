(function () {
  "use strict";

  var tools = (typeof TOOLS !== "undefined") ? TOOLS : [];
  var notices = (typeof NOTICES !== "undefined") ? NOTICES : [];

  var EXTERNAL_ICON_NS = "http://www.w3.org/2000/svg";

  function buildExternalIcon() {
    var svg = document.createElementNS(EXTERNAL_ICON_NS, "svg");
    svg.setAttribute("class", "tool-external-icon");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");

    var path = document.createElementNS(EXTERNAL_ICON_NS, "path");
    path.setAttribute("d", "M17 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5");
    svg.appendChild(path);

    var poly = document.createElementNS(EXTERNAL_ICON_NS, "polyline");
    poly.setAttribute("points", "14 3 20 3 20 9");
    svg.appendChild(poly);

    var line = document.createElementNS(EXTERNAL_ICON_NS, "line");
    line.setAttribute("x1", "10");
    line.setAttribute("y1", "14");
    line.setAttribute("x2", "20");
    line.setAttribute("y2", "4");
    svg.appendChild(line);

    return svg;
  }

  function normalize(str) {
    return (str || "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase();
  }

  function renderTools() {
    var grid = document.getElementById("tools-grid");
    if (!grid) return;
    grid.innerHTML = "";

    tools.forEach(function (tool) {
      var hasUrl = !!tool.url;
      var card = document.createElement(hasUrl ? "a" : "div");
      card.className = "tool-card" + (hasUrl ? "" : " is-disabled");
      card.dataset.search = normalize(tool.name);

      if (hasUrl) {
        card.href = tool.url;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        card.title = "Abrir " + tool.name;
      } else {
        card.setAttribute("aria-disabled", "true");
        card.title = "Link ainda não configurado";
      }

      var badge = document.createElement("div");
      badge.className = "tool-badge";
      badge.textContent = tool.tag || "?";
      badge.setAttribute("aria-hidden", "true");
      card.appendChild(badge);

      var name = document.createElement("div");
      name.className = "tool-name";
      name.textContent = tool.name;
      card.appendChild(name);

      if (hasUrl) {
        card.appendChild(buildExternalIcon());
      } else {
        var pill = document.createElement("span");
        pill.className = "tool-pending-pill";
        pill.textContent = "Em breve";
        card.appendChild(pill);
      }

      grid.appendChild(card);
    });

    updateCount(tools.length, tools.length);
  }

  function updateCount(visible, total) {
    var el = document.getElementById("tools-count");
    if (!el) return;
    if (visible === total) {
      el.textContent = total + (total === 1 ? " sistema" : " sistemas");
    } else {
      el.textContent = visible + " de " + total + " sistemas";
    }
  }

  function setupSearch() {
    var input = document.getElementById("search-input");
    var clearBtn = document.getElementById("search-clear");
    var emptyMsg = document.getElementById("tools-empty");
    var grid = document.getElementById("tools-grid");
    if (!input || !grid) return;

    function applyFilter() {
      var query = normalize(input.value.trim());
      var cards = grid.children;
      var visible = 0;

      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var match = !query || card.dataset.search.indexOf(query) !== -1;
        card.hidden = !match;
        if (match) visible++;
      }

      clearBtn.hidden = input.value.length === 0;
      emptyMsg.hidden = visible !== 0;
      updateCount(visible, tools.length);
    }

    input.addEventListener("input", applyFilter);

    clearBtn.addEventListener("click", function () {
      input.value = "";
      input.focus();
      applyFilter();
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && input.value) {
        input.value = "";
        applyFilter();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "/") return;
      var active = document.activeElement;
      var tag = active && active.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (active && active.isContentEditable)) return;
      e.preventDefault();
      input.focus();
      input.select();
    });
  }

  function renderNotices() {
    var list = document.getElementById("notices-list");
    if (!list) return;
    list.innerHTML = "";

    if (!notices.length) {
      var empty = document.createElement("div");
      empty.className = "notices-empty";
      empty.textContent = "Nenhum recado no momento.";
      list.appendChild(empty);
      return;
    }

    notices.forEach(function (notice) {
      var item = document.createElement("div");
      item.className = "notice-item";

      if (notice.date) {
        var date = document.createElement("span");
        date.className = "notice-date";
        date.textContent = notice.date;
        item.appendChild(date);
      }

      var text = document.createElement("span");
      text.className = "notice-text";
      text.textContent = notice.text || "";
      item.appendChild(text);

      list.appendChild(item);
    });
  }

  function setupClock() {
    var greetingEl = document.getElementById("clock-greeting");
    var timeEl = document.getElementById("clock-time");
    if (!greetingEl || !timeEl) return;

    function tick() {
      var now = new Date();
      var hours = now.getHours();
      var greeting = "Boa noite";
      if (hours >= 5 && hours < 12) greeting = "Bom dia";
      else if (hours >= 12 && hours < 18) greeting = "Boa tarde";
      greetingEl.textContent = greeting;

      var hh = String(hours).padStart(2, "0");
      var mm = String(now.getMinutes()).padStart(2, "0");
      timeEl.textContent = hh + ":" + mm;
    }

    tick();
    setInterval(tick, 15000);
  }

  function setupThemeToggle() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;

    btn.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme");
      var isDark = current
        ? current === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      var next = isDark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("portal-theme", next); } catch (e) { /* localStorage indisponível */ }
    });
  }

  function setupFooterYear() {
    var el = document.getElementById("footer-year");
    if (el) el.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderTools();
    renderNotices();
    setupSearch();
    setupClock();
    setupThemeToggle();
    setupFooterYear();
  });
})();
