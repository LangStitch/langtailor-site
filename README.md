# LangTailor — Download site

Landing page for the LangTailor desktop IDE and VSX extension.

- **Live:** https://langtailor.langstitch.com
- **Product:** https://langstitch.com

## Structure

| Path | Purpose |
|------|---------|
| `index.html` | Main landing page (hero, downloads, VSX vs IDE, releases) |
| `dl.html` | Download redirect helper (`?asset=win-installer`, etc.) |
| `styles.css` | Shared styles (Geist fonts via CDN) |
| `assets/data/releases.json` | Version manifest for download rows (current: **0.4.0**) |
| `assets/js/releases.js` | Hydrates download tables and version tags |
| `index.html` metadata | Static canonical, social cards and JSON-LD |

Deployed to GitHub Pages and Hostinger on every push to `main`.

## Hostinger deploy (separate pipeline)

This repo has its own **Deploy to Hostinger** workflow. Configure these GitHub Actions secrets on **this repo** (`langtailor-site`):

| Secret | Value |
|--------|--------|
| `FTP_SERVER` | Hostinger FTP host (IP only, no `ftp://` prefix) |
| `FTP_USERNAME` | FTP username for the langtailor.langstitch.com account |
| `FTP_PASSWORD` | FTP password for that account |

FTP account is scoped to `public_html/langtailor` — deploy target is `./`.

## Release and discoverability checks

Run `node scripts/validate-site.cjs` before publishing. The page includes static metadata, structured data, native-language scope, direct artifact links and release content so it remains useful without JavaScript. The feed records SHA-256 checksums verified against the published release and GitHub asset digests.

The social preview is authored in `assets/og-card.svg`; `assets/og-card.png` is the 1200 × 630 rendered image served to social crawlers.
