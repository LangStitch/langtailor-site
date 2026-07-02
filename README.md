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
| `assets/data/releases.json` | Version manifest for download rows |
| `assets/js/releases.js` | Hydrates download tables and version tags |
| `assets/js/seo.js` | SEO meta tags and JSON-LD |

Deployed to GitHub Pages and Hostinger on every push to `main`.

## Hostinger deploy (separate pipeline)

This repo has its own **Deploy to Hostinger** workflow. Configure these GitHub Actions secrets on **this repo** (`langtailor-site`):

| Secret | Value |
|--------|--------|
| `FTP_SERVER` | FTP **IP** from hPanel → Plan Details (not `ftp.langstitch.com` unless DNS is set up) |
| `FTP_USERNAME` | FTP username from hPanel → FTP Accounts |
| `FTP_PASSWORD` | FTP password for that account |

Optional variable `FTP_SERVER_DIR` (default: `domains/langtailor.langstitch.com/public_html/`).

Use the same FTP IP/credentials as `langstitch-site` if both sites share the Hostinger account.

| Variable | Default |
|----------|---------|
| `FTP_SERVER_DIR` | `domains/langtailor.langstitch.com/public_html/` |
