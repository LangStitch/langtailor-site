/**
 * Live marketplace catalog counts for marketing pages.
 * Lane inference matches langtailor/_canvas/src/lib/marketplaceCatalog.ts
 */
(function () {
  var API_URL = "https://api.langstitch.com/api/marketplace/plugins";
  var LANES = ["connectors", "agents", "mcps", "graphs", "skills", "plugins"];
  var LABELS = {
    connectors: "connectors",
    agents: "agents",
    mcps: "MCP packs",
    graphs: "graphs",
    skills: "skills",
    plugins: "plugins"
  };

  function inferLane(plugin) {
    if (plugin && plugin.kind === "connector") return "connectors";
    var haystack = [plugin.category, plugin.slug, plugin.name, plugin.summary]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (/\bagent/.test(haystack)) return "agents";
    if (/\bmcp/.test(haystack)) return "mcps";
    if (/\b(graph|visual|canvas|langgraph)/.test(haystack)) return "graphs";
    if (/\bskill/.test(haystack)) return "skills";
    return "plugins";
  }

  function emptyCounts() {
    var counts = { total: 0 };
    for (var i = 0; i < LANES.length; i++) counts[LANES[i]] = 0;
    return counts;
  }

  function countByLane(plugins) {
    var counts = emptyCounts();
    for (var i = 0; i < plugins.length; i++) {
      var lane = inferLane(plugins[i]);
      counts[lane] += 1;
      counts.total += 1;
    }
    return counts;
  }

  function summaryText(counts) {
    var parts = [];
    for (var i = 0; i < LANES.length; i++) {
      var id = LANES[i];
      if (counts[id] > 0) parts.push(counts[id] + " " + LABELS[id]);
    }
    return counts.total + " items — " + parts.join(" · ");
  }

  function setText(nodes, value) {
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = value;
    }
  }

  function applyCounts(counts) {
    setText(document.querySelectorAll("[data-mk-total]"), String(counts.total));
    setText(
      document.querySelectorAll("[data-mk-heading]"),
      counts.total + " catalog items ready to sync"
    );
    setText(document.querySelectorAll("[data-mk-summary]"), summaryText(counts));

    for (var i = 0; i < LANES.length; i++) {
      var id = LANES[i];
      var n = counts[id];
      setText(document.querySelectorAll('[data-mk-lane="' + id + '"]'), String(n));
      var rows = document.querySelectorAll('[data-mk-lane-row="' + id + '"]');
      for (var j = 0; j < rows.length; j++) {
        rows[j].hidden = n === 0;
        rows[j].style.display = n === 0 ? "none" : "";
      }
    }

    var roots = document.querySelectorAll("[data-mk-live]");
    for (var k = 0; k < roots.length; k++) {
      roots[k].setAttribute("data-mk-ready", "1");
      roots[k].removeAttribute("aria-busy");
    }
  }

  function load() {
    if (!document.querySelector("[data-mk-live], [data-mk-total], [data-mk-lane]")) {
      return;
    }
    fetch(API_URL, { mode: "cors", cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("marketplace catalog unavailable");
        return r.json();
      })
      .then(function (data) {
        var plugins = (data && data.plugins) || [];
        applyCounts(countByLane(plugins));
      })
      .catch(function () {
        /* keep SSR / seeded fallback numbers */
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", load);
  } else {
    load();
  }
})();
