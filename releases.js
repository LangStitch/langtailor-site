(function () {
  const REPO = 'LangStitch/langtailor-releases';
  const OPEN_VSX =
    'https://open-vsx.org/extension/langstitch/langtailor-canvas';

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

  function enableSecondary(id, asset, label) {
    const el = document.getElementById(id);
    if (!el || !asset) return;
    el.href = asset.browser_download_url;
    el.textContent = label;
    el.classList.remove('btn-secondary');
    el.classList.add('btn-inline-link');
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
        return /LangTailor-win.*portable\.zip$/i.test(a.name);
      });
      const macArmDmg = data.assets.find(function (a) {
        return /LangTailor-darwin-arm64\.dmg$/i.test(a.name);
      });
      const macArmZip = data.assets.find(function (a) {
        return /LangTailor-darwin-arm64-portable\.zip$/i.test(a.name);
      });
      const macX64Dmg = data.assets.find(function (a) {
        return /LangTailor-darwin-x64\.dmg$/i.test(a.name);
      });
      const macX64Zip = data.assets.find(function (a) {
        return /LangTailor-darwin-x64-portable\.zip$/i.test(a.name);
      });

      enableDownload('dl-windows', winZip, 'Download portable .zip');
      enableDownload('dl-vsix', vsix, 'Download .vsix');
      enableDownload('dl-macos-arm64', macArmDmg || macArmZip, macArmDmg ? 'Download .dmg' : 'Download portable .zip');
      enableDownload('dl-macos-x64', macX64Dmg || macX64Zip, macX64Dmg ? 'Download .dmg' : 'Download portable .zip');
      enableSecondary('dl-macos-arm64-zip', macArmDmg && macArmZip ? macArmZip : null, 'Portable .zip');
      enableSecondary('dl-macos-x64-zip', macX64Dmg && macX64Zip ? macX64Zip : null, 'Portable .zip');
    } catch (_err) {
      if (versionEl) versionEl.textContent = 'pre-release';
    }

    const ovsx = document.getElementById('dl-openvsx');
    if (ovsx) {
      ovsx.href = OPEN_VSX;
      ovsx.textContent = 'Install from Open VSX';
      ovsx.classList.remove('btn-secondary');
      ovsx.classList.add('btn-primary');
      ovsx.removeAttribute('aria-disabled');
    }
  }

  document.addEventListener('DOMContentLoaded', loadReleases);
})();
