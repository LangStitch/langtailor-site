(function (global) {
  var MANIFEST_URL = "/assets/data/releases.json";
  var cache = null;

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

  function trackUrl(assetId) {
    return "/api/download/" + encodeURIComponent(assetId);
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
      '" data-track-download="' +
      asset.id +
      '">Download</a></div>';
    return row;
  }

  function mountDownloads(root, filter) {
    if (!root) return;
    fetchManifest().then(function (m) {
      var items = m.downloads.filter(function (d) {
        if (filter === "langtailor") return d.product === "langtailor";
        if (filter === "vsx") return d.product === "vsx";
        return true;
      });
      root.innerHTML = "";
      items.forEach(function (asset) {
        root.appendChild(renderDownloadRow(asset));
      });
    });
  }

  function mountReleaseStrip(root) {
    if (!root) return;
    fetchManifest().then(function (m) {
      var lt = m.langtailor;
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
    });
  }

  function mountReleaseHistory(root) {
    if (!root) return;
    fetchManifest().then(function (m) {
      root.innerHTML = "";
      m.releaseHistory.forEach(function (rel) {
        var row = document.createElement("div");
        row.className = "dl-row" + (rel.latest ? " dl-row--featured" : "");
        var actions = rel.assets
          .map(function (id) {
            var asset = m.downloads.find(function (d) {
              return d.id === id;
            });
            if (!asset) return "";
            return (
              '<a class="btn ' +
              (rel.latest && asset.featured ? "btn-primary" : "btn-outline") +
              ' btn-sm" href="' +
              downloadHref(asset.id) +
              '">' +
              asset.label +
              "</a>"
            );
          })
          .join("");
        row.innerHTML =
          '<div class="dl-row__info"><h3>' +
          rel.tag +
          "</h3><div class=\"dl-row__meta\">" +
          rel.summary +
          " · " +
          formatDate(rel.published) +
          '</div></div><div class="dl-row__ver">' +
          (rel.latest ? '<span class="tag tag--live">Latest</span>' : "v" + rel.version) +
          '</div><div class="dl-row__actions">' +
          actions +
          '<a class="btn btn-ghost btn-sm" href="https://github.com/LangStitch/' +
          rel.repo +
          "/releases/tag/" +
          rel.tag +
          '">Notes</a></div>';
        root.appendChild(row);
      });
    });
  }

  function hydrateVersionTags() {
    fetchManifest().then(function (m) {
      document.querySelectorAll("[data-langtailor-version]").forEach(function (el) {
        el.textContent = "v" + m.langtailor.version;
      });
      document.querySelectorAll("[data-vsx-version]").forEach(function (el) {
        el.textContent = "v" + m.vsx.version;
      });
      document.querySelectorAll("[data-langtailor-download]").forEach(function (el) {
        el.setAttribute("href", downloadHref("win-installer"));
      });
    });
  }

  function refreshStats(el) {
    if (!el) return;
  }

  function init() {
    mountDownloads(document.querySelector("[data-mount=langtailor-downloads]"), "langtailor");
    mountDownloads(document.querySelector("[data-mount=all-downloads]"));
    mountReleaseStrip(document.querySelector("[data-mount=release-strip]"));
    mountReleaseHistory(document.querySelector("[data-mount=release-history]"));
    hydrateVersionTags();
    refreshStats(document.querySelector("[data-dl-stats]"));

    document.querySelectorAll("[data-vsx-install-cmd]").forEach(function (el) {
      fetchManifest().then(function (m) {
        el.textContent = m.vsx.installCommand;
      });
    });
    document.querySelectorAll("[data-vsx-openvsx]").forEach(function (el) {
      fetchManifest().then(function (m) {
        el.setAttribute("href", m.vsx.openVsxUrl);
      });
    });
    document.querySelectorAll("[data-vsx-download]").forEach(function (el) {
      fetchManifest().then(function (m) {
        el.setAttribute("href", downloadHref("vsx"));
      });
    });
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
