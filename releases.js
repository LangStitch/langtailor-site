(function () {
  const REPO = 'vijayptiwari/LangStitch';

  function formatSize(bytes) {
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function enableDownload(id, asset, label) {
    const el = document.getElementById(id);
    if (!el || !asset) return;
    el.href = asset.browser_download_url;
    el.textContent = label + ' (' + formatSize(asset.size) + ')';
    el.classList.remove('btn-secondary');
    el.classList.add('btn-primary');
    el.removeAttribute('aria-disabled');
  }

  async function loadReleases() {
    const versionEl = document.getElementById('release-version');
    try {
      const res = await fetch('https://api.github.com/repos/' + REPO + '/releases/latest');
      if (!res.ok) throw new Error('No release');
      const data = await res.json();

      if (versionEl) versionEl.textContent = data.tag_name;

      const vsix = data.assets.find(function (a) {
        return a.name.endsWith('.vsix');
      });
      const winZip = data.assets.find(function (a) {
        return /LangTailor-win.*\.zip$/i.test(a.name);
      });

      enableDownload('dl-windows', winZip, 'Download portable .zip');
      enableDownload('dl-vsix', vsix, 'Download .vsix');
    } catch (_err) {
      if (versionEl) versionEl.textContent = 'pre-release';
    }
  }

  document.addEventListener('DOMContentLoaded', loadReleases);
})();
