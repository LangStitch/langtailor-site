const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

process.chdir(path.resolve(__dirname, '..'));
const utf8 = new TextDecoder('utf-8', { fatal: true });
function read(file) {
  const text = utf8.decode(fs.readFileSync(file));
  assert(!text.includes('\uFFFD'), `${file} contains replacement characters`);
  return text;
}
const html = read('index.html');
const manifest = JSON.parse(read('assets/data/releases.json'));
const metadata = JSON.parse(html.match(/<script type="application\/ld\+json" id="langstitch-jsonld">([\s\S]*?)<\/script>/)[1]);
const application = metadata['@graph'].find(item => item['@type'] === 'SoftwareApplication');
const canonical = 'https://langtailor.langstitch.com/';
assert.equal(application.softwareVersion, manifest.langtailor.version);
assert.equal(application.operatingSystem, 'Windows, macOS');
assert.equal(application.downloadUrl, manifest.langtailor.notesUrl);
assert.equal(manifest.vsx.version, manifest.langtailor.version);
assert.equal(manifest.releaseHistory.filter(release => release.latest).length, 1);
assert.equal(manifest.releaseHistory.find(release => release.latest).version, manifest.langtailor.version);
assert.equal(html.match(/<link rel="canonical" href="([^"]+)"/)[1], canonical);
assert.equal(html.match(/<meta property="og:url" content="([^"]+)"/)[1], canonical);
assert(html.includes('name="twitter:description"'));
assert(html.includes('https://sdk.langstitch.com/docs/'));
assert(!/https:\/\/github\.com\/LangStitch\/langtailor(?:["/#?]|$)/.test(html), 'Do not advertise the private source repository as a public resource');
assert(read('sitemap.xml').includes(`<loc>${canonical}</loc>`));
assert(read('robots.txt').includes(`Sitemap: ${canonical}sitemap.xml`));
assert.equal(manifest.downloads.length, 4);
for (const asset of manifest.downloads) {
  assert.equal(asset.version, manifest.langtailor.version);
  assert(asset.url.startsWith(`https://github.com/LangStitch/langtailor-releases/releases/download/${manifest.langtailor.tag}/`));
  assert.match(asset.sha256, /^[a-f0-9]{64}$/);
  assert(asset.size > 0);
  assert(html.includes(`href="${asset.url}"`), `Missing static link to ${asset.id}`);
}
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  const target = match[1].split(/[?#]/)[0];
  if (/^(?:https?:|mailto:|data:)/.test(target)) continue;
  assert(fs.existsSync(target), `Missing local resource: ${target}`);
}
read('dl.html');
read('assets/js/releases.js');
read('assets/js/seo.js');
read('assets/og-card.svg');
const png = fs.readFileSync('assets/og-card.png');
assert.equal(png.subarray(1, 4).toString(), 'PNG');
assert.equal(png.readUInt32BE(16), 1200);
assert.equal(png.readUInt32BE(20), 630);
console.log(`Validated LangTailor ${manifest.langtailor.version}: static SEO, JSON-LD, four downloads, UTF-8 and social image.`);
