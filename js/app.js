(function () {
  "use strict";

  var PENCIL_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>';
  var FOLDER_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"></path></svg>';
  var PLUS_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>';
  var BACK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"></path></svg>';

  var viewState = { type: "home" };
  var editingSystemId = null;
  var editingGroupId = null;
  var selectedSystemColor = "blue";
  var selectedGroupColor = "blue";
  var pendingDocuments = [];

  // ---------- helpers ----------

  function normalize(str) {
    return (str || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  }

  function normalizeUrl(url) {
    url = (url || "").trim();
    if (!url) return "";
    if (!/^https?:\/\//i.test(url)) return "https://" + url;
    return url;
  }

  function shortenUrl(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch (e) {
      return url.length > 44 ? url.slice(0, 44) + "…" : url;
    }
  }

  function fallbackTag(name) {
    var letters = (name || "").replace(/[^A-Za-zÀ-ÿ0-9]/g, "");
    return (letters.slice(0, 2) || "??").toUpperCase();
  }

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function buildExternalIcon() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "tool-external-icon");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    var path = document.createElementNS(ns, "path");
    path.setAttribute("d", "M17 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5");
    svg.appendChild(path);
    var poly = document.createElementNS(ns, "polyline");
    poly.setAttribute("points", "14 3 20 3 20 9");
    svg.appendChild(poly);
    var line = document.createElementNS(ns, "line");
    line.setAttribute("x1", "10"); line.setAttribute("y1", "14");
    line.setAttribute("x2", "20"); line.setAttribute("y2", "4");
    svg.appendChild(line);
    return svg;
  }

  function gradient(colorName) {
    var c = Store.PALETTE[colorName] || Store.PALETTE.blue;
    return "linear-gradient(135deg, " + c.from + ", " + c.to + ")";
  }

  // ---------- dialog plumbing ----------

  function setupBackdropClose(dialog) {
    dialog.addEventListener("click", function (e) {
      var rect = dialog.getBoundingClientRect();
      var inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inside) dialog.close();
    });
  }

  function setupModalCloseButtons() {
    document.querySelectorAll("[data-close]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var dialog = btn.closest("dialog");
        if (dialog) dialog.close();
      });
    });
  }

  function confirmDialog(message, opts) {
    opts = opts || {};
    var modal = document.getElementById("confirm-modal");
    document.getElementById("confirm-title").textContent = opts.title || "Confirmar";
    document.getElementById("confirm-message").textContent = message;
    var okBtn = document.getElementById("confirm-ok");
    okBtn.textContent = opts.okLabel || "Confirmar";

    return new Promise(function (resolve) {
      var resolved = false;
      function onOk() { resolved = true; modal.close(); }
      function onClose() {
        okBtn.removeEventListener("click", onOk);
        resolve(resolved);
      }
      okBtn.addEventListener("click", onOk);
      modal.addEventListener("close", onClose, { once: true });
      modal.showModal();
    });
  }

  // ---------- color swatches ----------

  function renderColorSwatches(container, selected, onPick) {
    container.innerHTML = "";
    Store.PALETTE_ORDER.forEach(function (name) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "color-swatch" + (name === selected ? " is-selected" : "");
      btn.style.background = gradient(name);
      btn.setAttribute("aria-label", name);
      btn.addEventListener("click", function () {
        container.querySelectorAll(".color-swatch").forEach(function (s) { s.classList.remove("is-selected"); });
        btn.classList.add("is-selected");
        onPick(name);
      });
      container.appendChild(btn);
    });
  }

  function populateGroupSelect(select, selectedId) {
    select.innerHTML = "";
    Store.getGroups().forEach(function (g) {
      var opt = document.createElement("option");
      opt.value = g.id;
      opt.textContent = g.name;
      if (g.id === selectedId) opt.selected = true;
      select.appendChild(opt);
    });
  }

  // ---------- system modal ----------

  function openSystemModal(systemId, presetGroupId) {
    if (!systemId && Store.getGroups().length === 0) {
      openGroupModal(null);
      return;
    }
    editingSystemId = systemId || null;
    var system = systemId ? Store.getSystem(systemId) : null;

    document.getElementById("system-modal-title").textContent = system ? "Editar sistema" : "Novo sistema";
    document.getElementById("sm-name").value = system ? system.name : "";
    document.getElementById("sm-tag").value = system ? system.tag : "";
    populateGroupSelect(document.getElementById("sm-group"), system ? system.groupId : (presetGroupId || Store.getGroups()[0].id));

    selectedSystemColor = system ? system.color : "blue";
    renderColorSwatches(document.getElementById("sm-colors"), selectedSystemColor, function (c) { selectedSystemColor = c; });

    pendingDocuments = system ? system.documents.map(function (d) { return { id: d.id, label: d.label, url: d.url }; }) : [];
    renderDocumentEditor();

    document.getElementById("sm-delete").hidden = !system;

    var modal = document.getElementById("system-modal");
    modal.showModal();
    document.getElementById("sm-name").focus();
  }

  function renderDocumentEditor() {
    var container = document.getElementById("sm-documents");
    container.innerHTML = "";
    if (pendingDocuments.length === 0) {
      container.appendChild(el("p", "doc-editor-empty", "Nenhum documento ainda. Clique em “+ Adicionar documento”."));
    }
    pendingDocuments.forEach(function (doc, index) {
      var row = el("div", "doc-editor-row");

      var labelInput = document.createElement("input");
      labelInput.type = "text";
      labelInput.className = "field-input doc-editor-label";
      labelInput.placeholder = "Nome (ex: Planilha principal)";
      labelInput.value = doc.label || "";
      labelInput.addEventListener("input", function () { doc.label = labelInput.value; });

      var urlInput = document.createElement("input");
      urlInput.type = "text";
      urlInput.className = "field-input doc-editor-url";
      urlInput.placeholder = "https://...";
      urlInput.value = doc.url || "";
      urlInput.addEventListener("input", function () { doc.url = urlInput.value; });

      var removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "doc-editor-remove";
      removeBtn.setAttribute("aria-label", "Remover documento");
      removeBtn.textContent = "×";
      removeBtn.addEventListener("click", function () {
        pendingDocuments.splice(index, 1);
        renderDocumentEditor();
      });

      row.appendChild(labelInput);
      row.appendChild(urlInput);
      row.appendChild(removeBtn);
      container.appendChild(row);
    });
  }

  function saveSystemFromForm() {
    var name = document.getElementById("sm-name").value.trim();
    var tag = document.getElementById("sm-tag").value.trim() || fallbackTag(name);
    var groupId = document.getElementById("sm-group").value;
    var docs = pendingDocuments
      .map(function (d) { return { id: d.id, label: (d.label || "").trim() || "Acessar", url: normalizeUrl(d.url) }; })
      .filter(function (d) { return d.url; });

    var payload = { name: name, tag: tag, color: selectedSystemColor, groupId: groupId, documents: docs };
    if (editingSystemId) Store.updateSystem(editingSystemId, payload);
    else Store.createSystem(payload);

    document.getElementById("system-modal").close();
    render();
  }

  function wireSystemForm() {
    var form = document.getElementById("system-form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      saveSystemFromForm();
    });

    document.getElementById("sm-add-doc").addEventListener("click", function () {
      pendingDocuments.push({ id: Store.uid("doc"), label: "", url: "" });
      renderDocumentEditor();
      var rows = document.querySelectorAll("#sm-documents .doc-editor-label");
      if (rows.length) rows[rows.length - 1].focus();
    });

    document.getElementById("sm-delete").addEventListener("click", function () {
      if (!editingSystemId) return;
      var system = Store.getSystem(editingSystemId);
      confirmDialog("Excluir o sistema “" + system.name + "”? Essa ação não pode ser desfeita.", { title: "Excluir sistema", okLabel: "Excluir" })
        .then(function (ok) {
          if (!ok) return;
          Store.deleteSystem(editingSystemId);
          document.getElementById("system-modal").close();
          render();
        });
    });
  }

  // ---------- group modal ----------

  function openGroupModal(groupId) {
    editingGroupId = groupId || null;
    var group = groupId ? Store.getGroup(groupId) : null;

    document.getElementById("group-modal-title").textContent = group ? "Editar grupo" : "Novo grupo";
    document.getElementById("gm-name").value = group ? group.name : "";

    selectedGroupColor = group ? group.color : "blue";
    renderColorSwatches(document.getElementById("gm-colors"), selectedGroupColor, function (c) { selectedGroupColor = c; });

    var count = group ? Store.countByGroup(group.id) : 0;
    document.getElementById("gm-delete").hidden = !group;
    document.getElementById("gm-hint").hidden = count === 0;

    var modal = document.getElementById("group-modal");
    modal.showModal();
    document.getElementById("gm-name").focus();
  }

  function wireGroupForm() {
    var form = document.getElementById("group-form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var name = document.getElementById("gm-name").value.trim();
      var payload = { name: name, color: selectedGroupColor };

      if (editingGroupId) {
        Store.updateGroup(editingGroupId, payload);
      } else {
        var created = Store.createGroup(payload);
        viewState = { type: "group", groupId: created.id };
      }
      document.getElementById("group-modal").close();
      render();
    });

    document.getElementById("gm-delete").addEventListener("click", function () {
      if (!editingGroupId) return;
      var group = Store.getGroup(editingGroupId);
      confirmDialog("Excluir o grupo “" + group.name + "”?", { title: "Excluir grupo", okLabel: "Excluir" })
        .then(function (ok) {
          if (!ok) return;
          var res = Store.deleteGroup(editingGroupId);
          if (!res.ok) {
            document.getElementById("gm-hint").hidden = false;
            return;
          }
          document.getElementById("group-modal").close();
          if (viewState.type === "group" && viewState.groupId === editingGroupId) viewState = { type: "home" };
          render();
        });
    });
  }

  // ---------- doc picker ----------

  function openDocPicker(system) {
    document.getElementById("doc-picker-title").textContent = system.name;
    var list = document.getElementById("doc-picker-list");
    list.innerHTML = "";
    var modal = document.getElementById("doc-picker-modal");

    system.documents.forEach(function (doc) {
      var link = document.createElement("a");
      link.className = "doc-picker-item";
      link.href = doc.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.addEventListener("click", function () { setTimeout(function () { modal.close(); }, 30); });

      link.appendChild(el("span", "doc-picker-label", "")).textContent = doc.label || "Acessar";
      link.appendChild(el("span", "doc-picker-url", "")).textContent = shortenUrl(doc.url);
      list.appendChild(link);
    });

    modal.showModal();
  }

  function openSystem(system) {
    var docs = system.documents || [];
    if (docs.length === 0) { openSystemModal(system.id); return; }
    if (docs.length === 1) { window.open(docs[0].url, "_blank", "noopener,noreferrer"); return; }
    openDocPicker(system);
  }

  // ---------- tile builders ----------

  function buildSystemTile(system, opts) {
    opts = opts || {};
    var card = el("div", "tool-card" + (system.documents.length === 0 ? " is-empty-doc" : ""));
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.title = system.documents.length ? "Abrir " + system.name : "Adicionar link em " + system.name;

    var badge = el("div", "tool-badge", "");
    badge.style.background = gradient(system.color);
    badge.textContent = system.tag;
    card.appendChild(badge);

    card.appendChild(el("div", "tool-name", "")).textContent = system.name;

    if (opts.showGroup) {
      var group = Store.getGroup(system.groupId);
      if (group) card.appendChild(el("div", "tool-group-label", "")).textContent = group.name;
    }

    if (system.documents.length === 0) {
      card.appendChild(el("span", "tool-pending-pill", "Sem link"));
    } else if (system.documents.length > 1) {
      card.appendChild(el("span", "tool-doc-count", "")).textContent = system.documents.length + " links";
    } else {
      card.appendChild(buildExternalIcon());
    }

    var editBtn = el("button", "tile-edit-btn", PENCIL_SVG);
    editBtn.type = "button";
    editBtn.setAttribute("aria-label", "Editar " + system.name);
    editBtn.addEventListener("click", function (e) { e.stopPropagation(); openSystemModal(system.id); });
    card.appendChild(editBtn);

    card.addEventListener("click", function () { openSystem(system); });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openSystem(system); }
    });

    return card;
  }

  function buildGroupTile(group) {
    var count = Store.countByGroup(group.id);
    var card = el("div", "group-card");
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.title = "Abrir grupo " + group.name;
    card.style.setProperty("--group-accent", (Store.PALETTE[group.color] || Store.PALETTE.blue).from);

    var badge = el("div", "group-badge", FOLDER_SVG);
    badge.style.background = gradient(group.color);
    card.appendChild(badge);

    card.appendChild(el("div", "group-name", "")).textContent = group.name;
    card.appendChild(el("div", "group-count", "")).textContent = count + (count === 1 ? " sistema" : " sistemas");

    var editBtn = el("button", "tile-edit-btn", PENCIL_SVG);
    editBtn.type = "button";
    editBtn.setAttribute("aria-label", "Editar grupo " + group.name);
    editBtn.addEventListener("click", function (e) { e.stopPropagation(); openGroupModal(group.id); });
    card.appendChild(editBtn);

    card.addEventListener("click", function () { viewState = { type: "group", groupId: group.id }; render(); });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); viewState = { type: "group", groupId: group.id }; render(); }
    });

    return card;
  }

  function buildAddTile(label, onClick) {
    var card = document.createElement("button");
    card.type = "button";
    card.className = "add-tile";
    card.innerHTML = PLUS_SVG + '<span>' + label + '</span>';
    card.addEventListener("click", onClick);
    return card;
  }

  // ---------- views ----------

  function searchSystems(query) {
    var norm = normalize(query);
    return Store.getSystems().filter(function (s) { return normalize(s.name).indexOf(norm) !== -1; });
  }

  function renderHomeView() {
    var wrap = el("div");
    var grid = el("div", "groups-grid");
    Store.getGroups().forEach(function (g) { grid.appendChild(buildGroupTile(g)); });
    grid.appendChild(buildAddTile("Novo grupo", function () { openGroupModal(null); }));
    wrap.appendChild(grid);
    return wrap;
  }

  function renderGroupView(group) {
    var wrap = el("div");
    var grid = el("div", "tools-grid");
    Store.getSystemsByGroup(group.id).forEach(function (s) { grid.appendChild(buildSystemTile(s, {})); });
    grid.appendChild(buildAddTile("Adicionar sistema", function () { openSystemModal(null, group.id); }));
    wrap.appendChild(grid);
    return wrap;
  }

  function renderResultsView(results) {
    var wrap = el("div");
    if (results.length === 0) {
      wrap.appendChild(el("p", "tools-empty", "Nenhum sistema encontrado para essa busca."));
      return wrap;
    }
    var grid = el("div", "tools-grid");
    results.forEach(function (s) { grid.appendChild(buildSystemTile(s, { showGroup: true })); });
    wrap.appendChild(grid);
    return wrap;
  }

  function renderToolbar(mode, payload) {
    var toolbar = document.getElementById("toolbar-title");
    toolbar.innerHTML = "";
    document.getElementById("btn-add-system").hidden = mode !== "group";

    if (mode === "search") {
      toolbar.appendChild(el("span", "toolbar-heading", "")).textContent = "Resultados da busca";
      toolbar.appendChild(el("span", "toolbar-count", "")).textContent = payload + (payload === 1 ? " sistema" : " sistemas");
      return;
    }

    if (mode === "group") {
      var back = document.createElement("button");
      back.type = "button";
      back.className = "btn-back";
      back.innerHTML = BACK_SVG + "Todos os grupos";
      back.addEventListener("click", function () { viewState = { type: "home" }; render(); });
      toolbar.appendChild(back);
      toolbar.appendChild(el("span", "toolbar-sep", "/"));
      toolbar.appendChild(el("span", "toolbar-heading", "")).textContent = payload.name;

      var editBtn = el("button", "icon-btn", PENCIL_SVG);
      editBtn.type = "button";
      editBtn.setAttribute("aria-label", "Editar grupo");
      editBtn.addEventListener("click", function () { openGroupModal(payload.id); });
      toolbar.appendChild(editBtn);

      var count = Store.countByGroup(payload.id);
      toolbar.appendChild(el("span", "toolbar-count", "")).textContent = count + (count === 1 ? " sistema" : " sistemas");
      return;
    }

    var groups = Store.getGroups().length;
    var systems = Store.getSystems().length;
    toolbar.appendChild(el("span", "toolbar-heading", "")).textContent =
      groups + (groups === 1 ? " grupo" : " grupos") + " · " + systems + (systems === 1 ? " sistema" : " sistemas");
  }

  function render() {
    var root = document.getElementById("view-root");
    root.innerHTML = "";
    var query = document.getElementById("search-input").value.trim();

    if (query) {
      var results = searchSystems(query);
      renderToolbar("search", results.length);
      root.appendChild(renderResultsView(results));
      return;
    }

    if (viewState.type === "group" && !Store.getGroup(viewState.groupId)) {
      viewState = { type: "home" };
    }

    if (viewState.type === "group") {
      var group = Store.getGroup(viewState.groupId);
      renderToolbar("group", group);
      root.appendChild(renderGroupView(group));
    } else {
      renderToolbar("home", null);
      root.appendChild(renderHomeView());
    }
  }

  // ---------- search box, clock, theme (infra) ----------

  function setupSearch() {
    var input = document.getElementById("search-input");
    var clearBtn = document.getElementById("search-clear");

    input.addEventListener("input", function () {
      clearBtn.hidden = input.value.length === 0;
      render();
    });
    clearBtn.addEventListener("click", function () {
      input.value = "";
      clearBtn.hidden = true;
      input.focus();
      render();
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && input.value) {
        input.value = "";
        clearBtn.hidden = true;
        render();
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
      timeEl.textContent = String(hours).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
    }
    tick();
    setInterval(tick, 15000);
  }

  function setupThemeToggle() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme");
      var isDark = current ? current === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
      var next = isDark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("portal-theme", next); } catch (e) { /* localStorage indisponível */ }
    });
  }

  function setupFooterYear() {
    var elYear = document.getElementById("footer-year");
    if (elYear) elYear.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupClock();
    setupThemeToggle();
    setupFooterYear();
    setupSearch();
    setupModalCloseButtons();
    ["system-modal", "group-modal", "doc-picker-modal", "confirm-modal"].forEach(function (id) {
      setupBackdropClose(document.getElementById(id));
    });
    wireSystemForm();
    wireGroupForm();

    document.getElementById("btn-add-system").addEventListener("click", function () {
      if (Store.getGroups().length === 0) { openGroupModal(null); return; }
      var presetGroup = viewState.type === "group" ? viewState.groupId : null;
      openSystemModal(null, presetGroup);
    });

    render();
  });
})();
