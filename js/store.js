// Camada de dados do portal. Tudo o que o usuario cria/edita pelo site
// (sistemas, grupos, documentos) e guardado aqui, em localStorage, no
// navegador em que a edicao foi feita. Nao ha servidor por tras — entao
// edicoes feitas num computador nao aparecem em outro. Veja o README.
(function (global) {
  "use strict";

  var STORAGE_KEY = "portal-data-v1";

  var PALETTE = {
    blue: { from: "#2f5fb3", to: "#5b9bd5" },
    teal: { from: "#0f6d63", to: "#2a9d8f" },
    indigo: { from: "#4338ca", to: "#6d5ce0" },
    green: { from: "#15803d", to: "#3fa85c" },
    amber: { from: "#a16207", to: "#d99a2b" },
    violet: { from: "#6d28d9", to: "#9061e8" },
    pink: { from: "#be185d", to: "#e0559b" },
    orange: { from: "#b45309", to: "#e08838" },
    red: { from: "#b91c1c", to: "#e0524b" },
    slate: { from: "#475569", to: "#7587a0" },
  };
  var PALETTE_ORDER = ["blue", "teal", "indigo", "green", "amber", "violet", "pink", "orange", "red", "slate"];

  function uid(prefix) {
    return prefix + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function safeGet() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function safeSet(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  var state = safeGet();
  var usingFallback = false;
  if (!state || !Array.isArray(state.groups) || !Array.isArray(state.systems)) {
    state = {
      groups: clone(typeof DEFAULT_GROUPS !== "undefined" ? DEFAULT_GROUPS : []),
      systems: clone(typeof DEFAULT_SYSTEMS !== "undefined" ? DEFAULT_SYSTEMS : []),
    };
    usingFallback = !safeSet(state);
  }

  function persist() {
    if (!usingFallback) usingFallback = !safeSet(state);
  }

  var Store = {
    PALETTE: PALETTE,
    PALETTE_ORDER: PALETTE_ORDER,
    uid: uid,
    isPersistent: function () { return !usingFallback; },

    getGroups: function () {
      return state.groups.slice().sort(function (a, b) { return a.order - b.order; });
    },
    getGroup: function (id) {
      return state.groups.filter(function (g) { return g.id === id; })[0] || null;
    },
    getSystems: function () {
      return state.systems.slice();
    },
    getSystemsByGroup: function (groupId) {
      return state.systems.filter(function (s) { return s.groupId === groupId; });
    },
    getSystem: function (id) {
      return state.systems.filter(function (s) { return s.id === id; })[0] || null;
    },
    countByGroup: function (groupId) {
      return state.systems.filter(function (s) { return s.groupId === groupId; }).length;
    },

    createGroup: function (data) {
      data = data || {};
      var group = {
        id: uid("grp"),
        name: (data.name || "").trim() || "Novo grupo",
        color: data.color || "blue",
        order: state.groups.length,
      };
      state.groups.push(group);
      persist();
      return group;
    },
    updateGroup: function (id, patch) {
      var group = this.getGroup(id);
      if (!group) return null;
      patch = patch || {};
      if (typeof patch.name === "string" && patch.name.trim()) group.name = patch.name.trim();
      if (typeof patch.color === "string") group.color = patch.color;
      persist();
      return group;
    },
    deleteGroup: function (id) {
      var hasSystems = state.systems.some(function (s) { return s.groupId === id; });
      if (hasSystems) return { ok: false, reason: "not-empty" };
      state.groups = state.groups.filter(function (g) { return g.id !== id; });
      persist();
      return { ok: true };
    },

    createSystem: function (data) {
      data = data || {};
      var system = {
        id: uid("sys"),
        name: (data.name || "").trim() || "Novo sistema",
        tag: (data.tag || "").trim().slice(0, 3).toUpperCase() || "??",
        color: data.color || "blue",
        groupId: data.groupId || (state.groups[0] && state.groups[0].id) || null,
        documents: Array.isArray(data.documents) ? data.documents : [],
      };
      state.systems.push(system);
      persist();
      return system;
    },
    updateSystem: function (id, patch) {
      var system = this.getSystem(id);
      if (!system) return null;
      patch = patch || {};
      if (typeof patch.name === "string" && patch.name.trim()) system.name = patch.name.trim();
      if (typeof patch.tag === "string" && patch.tag.trim()) system.tag = patch.tag.trim().slice(0, 3).toUpperCase();
      if (typeof patch.color === "string") system.color = patch.color;
      if (typeof patch.groupId === "string") system.groupId = patch.groupId;
      if (Array.isArray(patch.documents)) system.documents = patch.documents;
      persist();
      return system;
    },
    deleteSystem: function (id) {
      state.systems = state.systems.filter(function (s) { return s.id !== id; });
      persist();
      return { ok: true };
    },
  };

  global.Store = Store;
})(window);
