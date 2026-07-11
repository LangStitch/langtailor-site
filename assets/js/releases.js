(function (global) {
  var MANIFEST_URL = "/assets/data/releases.json";
  var cache = null;

  var ASSET_LABELS = {
    "win-installer": "Windows",
    "macos-arm64-dmg": "macOS arm64",
    "macos-x64-dmg": "macOS x64",
    vsx: "VSX"
  };

  function fetchManifest() {
    if (cache) return Promise.resolve(cache);
    return fetch(MANIFEST_URL, { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("releases.json unavailable");
        return r.json();
      })
      .then(function (data) {
        cache = data;
        return data;
      });
  }

  function downloadHref(assetId) {
    return "/dl.html?asset=" + encodeURIComponent(assetId);
  }

  function trackUrl(assetId, apiBase) {
    var base = apiBase || "https://api.langstitch.com/api/download";
    return base.replace(/\/$/, "") + "/" + encodeURIComponent(assetId);
  }

  function statsUrl(apiBase) {
    var base = apiBase || "https://api.langstitch.com/api/download";
    return base.replace(/\/$/, "") + "/stats";
  }

  function formatDate(iso) {
    try {
      return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch (e) {
      return iso;
    }
  }

  function renderDownloadRow(asset, featured) {
    var row = document.createElement("div");
    row.className = "dl-row" + (featured || asset.featured ? " dl-row--featured" : "");
    row.innerHTML =
      '<div class="dl-row__info"><h3>' +
      asset.label +
      '</h3><div class="dl-row__meta">' +
      asset.meta +
      '</div></div><div class="dl-row__ver">v' +
      asset.version +
      '</div><div class="dl-row__actions"><a class="btn ' +
      (featured || asset.featured ? "btn-primary" : "btn-outline") +
      ' btn-sm" href="' +
      downloadHref(asset.id) +
      '">Download</a></div>';
    return row;
  }

  function manifestUnavailable(root) {
    root.innerHTML =
      '<p class="dim">Release data is temporarily unavailable. Get downloads from ' +
      '<a href="https://github.com/LangStitch/langtailor-releases/releases" rel="noopener">GitHub releases</a>.</p>';
  }

  function mountDownloads(root, filter) {
    if (!root) return;
    fetchManifest()
      .then(function (m) {
        var items = m.downloads.filter(function (d) {
          if (filter === "langtailor") return d.product === "langtailor";
          if (filter === "vsx") return d.product === "vsx";
          return true;
        });
        root.innerHTML = "";
        items.forEach(function (asset) {
          root.appendChild(renderDownloadRow(asset));
        });
      })
      .catch(function () {
        manifestUnavailable(root);
      });
  }

  function ensureStripClass(root) {
    if (!root) return;
    if ((" " + root.className + " ").indexOf(" strip ") === -1) {
      root.className = (root.className ? root.className + " " : "") + "strip";
    }
  }

  function mountReleaseStrip(root) {
    if (!root) return;
    ensureStripClass(root);
    fetchManifest()
      .then(function (m) {
        var lt = m.langtailor;
        ensureStripClass(root);
        root.innerHTML =
          '<span class="tag tag--live">Latest</span>' +
          "<strong>LangTailor v" +
          lt.version +
          "</strong>" +
          '<span class="dim">' +
          formatDate(lt.published) +
          "</span>" +
          '<a href="' +
          lt.notesUrl +
          '">Release notes</a>' +
          '<span class="dim dl-stats" data-dl-stats hidden></span>';
        refreshStats(root.querySelector("[data-dl-stats]"));
      })
      .catch(function () {
        root.innerHTML =
          '<a href="https://github.com/LangStitch/langtailor-releases/releases" rel="noopener">Latest releases on GitHub</a>';
      });
  }

  function historyAssetButtons(rel) {
    var assets = rel.assets;
    if (!assets || typeof assets !== "object" || Array.isArray(assets)) {
      return "";
    }
    var keys = Object.keys(assets);
    if (!keys.length) return "";

    return keys
      .map(function (id) {
        var url = assets[id];
        if (!url) return "";
        var label = ASSET_LABELS[id] || id;
        var primary = rel.latest && id === "win-installer";
        return (
          '<a class="btn ' +
          (primary ? "btn-primary" : "btn-outline") +
          ' btn-sm" href="' +
          url +
          '" rel="noopener">' +
          label +
          "</a>"
        );
      })
      .join("");
  }

  function mountReleaseHistory(root) {
    if (!root) return;
    fetchManifest()
      .catch(function () {
        manifestUnavailable(root);
        return null;
      })
      .then(function (m) {
        if (!m) return;
        root.innerHTML = "";
        m.releaseHistory.forEach(function (rel) {
          var row = document.createElement("div");
          row.className = "dl-row" + (rel.latest ? " dl-row--featured" : "");
          var actions = historyAssetButtons(rel);
          var notesHref =
            "https://github.com/LangStitch/" +
            rel.repo +
            "/releases/tag/" +
            rel.tag;
          row.innerHTML =
            '<div class="dl-row__info"><h3>' +
            rel.tag +
            '</h3><div class="dl-row__meta">' +
            rel.summary +
            " · " +
            formatDate(rel.published) +
            '</div></div><div class="dl-row__ver">' +
            (rel.latest ? '<span class="tag tag--live">Latest</span>' : "v" + rel.version) +
            '</div><div class="dl-row__actions">' +
            actions +
            '<a class="btn btn-ghost btn-sm" href="' +
            notesHref +
            '">Notes</a></div>';
          root.appendChild(row);
        });
      });
  }

  function hydrateVersionTags() {
    fetchManifest()
      .then(function (m) {
        document.querySelectorAll("[data-langtailor-version]").forEach(function (el) {
          el.textContent = "v" + m.langtailor.version;
        });
        document.querySelectorAll("[data-vsx-version]").forEach(function (el) {
          el.textContent = "v" + m.vsx.version;
        });
        document.querySelectorAll("[data-langtailor-download]").forEach(function (el) {
          el.setAttribute("href", downloadHref("win-installer"));
        });
      })
      .catch(function () {});
  }

  function refreshStats(el) {
    if (!el) return;
    fetchManifest()
      .then(function (m) {
        return fetch(statsUrl(m.downloadApiBase), { mode: "cors", cache: "no-cache" })
          .then(function (r) {
            if (!r.ok) return null;
            return r.json();
          })
          .then(function (data) {
            if (!data || !data.total) return;
            el.textContent =
              data.total + " site download" + (data.total === 1 ? "" : "s");
            el.hidden = false;
          });
      })
      .catch(function () {});
  }

  function initNavDrawer() {
    var toggle = document.getElementById("nav-toggle");
    if (!toggle) return;

    function syncBodyLock() {
      document.body.classList.toggle("nav-open", toggle.checked);
    }

    toggle.addEventListener("change", syncBodyLock);
    syncBodyLock();

    document.querySelectorAll(".nav-links a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (toggle.checked) {
          toggle.checked = false;
          syncBodyLock();
        }
      });
    });
  }

  function init() {
    mountDownloads(document.querySelector("[data-mount=langtailor-downloads]"), "langtailor");
    mountDownloads(document.querySelector("[data-mount=all-downloads]"));
    mountReleaseStrip(document.querySelector("[data-mount=release-strip]"));
    mountReleaseHistory(document.querySelector("[data-mount=release-history]"));
    hydrateVersionTags();
    refreshStats(document.querySelector("[data-dl-stats]"));
    initNavDrawer();

    fetchManifest()
      .then(function (m) {
        document.querySelectorAll("[data-vsx-install-cmd]").forEach(function (el) {
          el.textContent = m.vsx.installCommand;
        });
        document.querySelectorAll("[data-vsx-openvsx]").forEach(function (el) {
          el.setAttribute("href", m.vsx.openVsxUrl);
        });
        document.querySelectorAll("[data-vsx-download]").forEach(function (el) {
          el.setAttribute("href", downloadHref("vsx"));
        });
      })
      .catch(function () {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  global.LangStitchReleases = {
    fetchManifest: fetchManifest,
    downloadHref: downloadHref,
    trackUrl: trackUrl,
    refreshStats: refreshStats
  };
})(window);
