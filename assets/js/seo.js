(function () {
  var SITE_ORIGIN = "https://langstitch.com";
  var SITE_NAME = "LangStitch";
  var PRODUCT_NAME = "LangTailor";
  var TWITTER = "@LangStitch";
  var EMAIL = "connect@langstitch.com";
  var GITHUB_ORG = "https://github.com/LangStitch";
  var LANGTAILOR_REPO = "https://github.com/LangStitch/langtailor";
  var SDK_REPO = "https://github.com/LangStitch/langstitch-sdk";
  var RELEASES_URL = "https://github.com/LangStitch/langtailor-releases/releases";
  var LANGTAILOR_URL = "https://langtailor.langstitch.com/";
  var SDK_URL = "https://sdk.langstitch.com/";
  var DOCS_URL = SITE_ORIGIN + "/docs/";
  var MARKETPLACE_URL = "https://marketplace.langstitch.com/";
  var MANIFEST_URL = "/assets/data/releases.json";
  var OG_IMAGE =
    (location.hostname === "langtailor.langstitch.com"
      ? "https://langtailor.langstitch.com"
      : SITE_ORIGIN) + "/assets/og-card.png";
  var LOGO =
    (location.hostname === "langtailor.langstitch.com"
      ? "https://langtailor.langstitch.com"
      : SITE_ORIGIN) + "/assets/brand-logo.svg";

  var VERSION = "0.2.9";
  var OS_LIST = "Windows, macOS";
  var DOWNLOAD_URL =
    "https://github.com/LangStitch/langtailor-releases/releases/download/langtailor-v0.2.9/LangTailor-0.2.9-win-x64-setup.exe";

  var ORG = {
    "@type": "Organization",
    "@id": SITE_ORIGIN + "/#organization",
    name: SITE_NAME,
    url: GITHUB_ORG,
    logo: { "@type": "ImageObject", url: LOGO },
    email: EMAIL,
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: EMAIL,
        contactType: "sales",
        description: "Business inquiries and partnerships"
      },
      {
        "@type": "ContactPoint",
        email: EMAIL,
        contactType: "customer support",
        description: "Training, workshops, and team enablement"
      }
    ],
    sameAs: [GITHUB_ORG, LANGTAILOR_URL, SDK_URL, MARKETPLACE_URL]
  };

  function buildPages() {
    return {
      home: {
        title: "LangTailor · Visual Agent IDE — Canvas to Python, Java, Go & Rust",
        description:
          "Design AI agents on a visual canvas. Export production code in Python today; Spring AI, Go, and Rust expanding. Free LangTailor desktop IDE + VS Code extension. MIT licensed.",
        keywords:
          "LangTailor, LangStitch, visual agent IDE, LangGraph canvas, AI agent builder, multi-language export, Spring AI, Go agents, Rust agents, Python export, RAG pipeline, VS Code extension, Open VSX, free IDE, MIT",
        canonical: SITE_ORIGIN + "/",
        ogTitle: "LangTailor — Design Agents Visually, Ship to Production",
        ogDescription:
          "The visual agent IDE for teams who want canvas design and real production export — Python today, Java · Go · Rust expanding. Download free.",
        twitterTitle: "LangTailor · Visual Agent IDE",
        imageAlt: "LangTailor visual agent IDE — design on canvas, export Python Java Go Rust",
        jsonLd: function () {
          return [
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": SITE_ORIGIN + "/#website",
              name: SITE_NAME,
              alternateName: PRODUCT_NAME,
              url: SITE_ORIGIN + "/",
              description:
                "Visual agent IDE — design workflows on a canvas and export production code in multiple languages.",
              inLanguage: "en-US",
              publisher: { "@id": SITE_ORIGIN + "/#organization" },
              potentialAction: {
                "@type": "DownloadAction",
                target: LANGTAILOR_URL,
                name: "Download LangTailor"
              }
            },
            ORG,
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "@id": SITE_ORIGIN + "/#langtailor",
              name: PRODUCT_NAME,
              alternateName: SITE_NAME,
              applicationCategory: "DeveloperApplication",
              applicationSubCategory: "IDE",
              operatingSystem: OS_LIST,
              softwareVersion: VERSION,
              description:
                "Visual agent IDE with canvas design, asset designers, RAG pipelines, and multi-language production export. Python ships today; Spring AI, Go, and Rust expanding.",
              url: LANGTAILOR_URL,
              downloadUrl: DOWNLOAD_URL,
              installUrl: LANGTAILOR_URL,
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock"
              },
              author: { "@id": SITE_ORIGIN + "/#organization" },
              license: "https://opensource.org/licenses/MIT",
              featureList: [
                "Visual LangGraph canvas",
                "Multi-language export",
                "RAG pipeline designer",
                "Docker and Helm deploy",
                "VS Code extension"
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is LangTailor?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "LangTailor is the LangStitch desktop IDE for designing AI agent workflows on a visual canvas and exporting production-ready projects."
                  }
                },
                {
                  "@type": "Question",
                  name: "What languages can LangStitch export to?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Python (LangGraph) export ships today. Spring AI (Java), Go, and Rust exporters are expanding — same canvas, same project format."
                  }
                },
                {
                  "@type": "Question",
                  name: "Is LangTailor free?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "Yes. LangTailor and the LangStitch VS Code extension are MIT licensed. Download, export, and keep your projects with no account required."
                  }
                }
              ]
            }
          ];
        }
      },
      langtailor: {
        title: "Download LangTailor · Free Visual Agent IDE — Windows & macOS",
        description:
          "Download LangTailor v" +
          VERSION +
          " — the LangStitch desktop agent IDE. Visual canvas, multi-language export, terminal, git, Docker/Helm deploy. Free MIT license.",
        keywords:
          "download LangTailor, LangStitch IDE, agent IDE download, Windows installer, macOS DMG, visual LangGraph IDE, free developer tools",
        canonical: LANGTAILOR_URL,
        ogTitle: "Download LangTailor — Free Visual Agent IDE",
        ogDescription:
          "Windows & macOS · Canvas + code · Python ships today; Spring AI, Go, Rust expanding · MIT licensed",
        twitterTitle: "Download LangTailor · Free Agent IDE",
        imageAlt: "Download LangTailor desktop IDE for Windows and macOS",
        sitemap: LANGTAILOR_URL + "sitemap.xml",
        jsonLd: function () {
          return [
            ORG,
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: PRODUCT_NAME,
              operatingSystem: OS_LIST,
              softwareVersion: VERSION,
              applicationCategory: "DeveloperApplication",
              url: LANGTAILOR_URL,
              downloadUrl: DOWNLOAD_URL,
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              author: { "@id": SITE_ORIGIN + "/#organization" }
            }
          ];
        }
      },
      sdk: {
        title: "langstitch-sdk · Python SDK for LangGraph Agents · pip install",
        description:
          "Build LangGraph agents in Python with decorators, typed YAML config, and a CLI. pip install langstitch-sdk — same structure LangTailor exports from the canvas.",
        keywords:
          "langstitch-sdk, LangGraph Python SDK, pip install langstitch-sdk, agent SDK, LangGraph decorators, Python agent framework",
        canonical: SDK_URL,
        ogTitle: "LangStitch SDK — Python SDK for LangGraph",
        ogDescription: "pip install langstitch-sdk · Decorators · typed config · CLI scaffold · MIT",
        twitterTitle: "langstitch-sdk · Python Agent SDK",
        imageAlt: "LangStitch Python SDK for LangGraph applications",
        jsonLd: function () {
          return [
            ORG,
            {
              "@context": "https://schema.org",
              "@type": "SoftwareSourceCode",
              name: "langstitch-sdk",
              programmingLanguage: "Python",
              codeRepository: SDK_REPO,
              url: SDK_URL,
              license: "https://opensource.org/licenses/MIT",
              author: { "@id": SITE_ORIGIN + "/#organization" }
            }
          ];
        }
      },
      docs: {
        title: "LangStitch Docs · Agent IDE, Export, SDK & Deployment Guide",
        description:
          "LangStitch documentation — visual agent IDE, Component Designer, asset designers, multi-language export, platform deploy, and langstitch-sdk guide.",
        keywords:
          "LangStitch docs, LangTailor documentation, LangGraph IDE guide, agent export, Component Designer, deployment Helm Docker",
        canonical: DOCS_URL,
        ogTitle: "LangStitch Documentation",
        ogDescription: "IDE guide · multi-language export · SDK · Docker · Helm · Component Designer",
        twitterTitle: "LangStitch Docs",
        imageAlt: "LangStitch documentation and SDK guide",
        jsonLd: function () {
          return [
            ORG,
            {
              "@context": "https://schema.org",
              "@type": "TechArticle",
              headline: "LangStitch Documentation",
              url: DOCS_URL,
              author: { "@id": SITE_ORIGIN + "/#organization" },
              publisher: { "@id": SITE_ORIGIN + "/#organization" }
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "LangStitch", item: SITE_ORIGIN + "/" },
                { "@type": "ListItem", position: 2, name: "Documentation", item: DOCS_URL }
              ]
            }
          ];
        }
      },
      try: {
        title: "Download LangTailor · LangStitch Desktop Agent IDE",
        description:
          "Redirecting to the official LangTailor download page — free visual agent IDE for Windows and macOS.",
        keywords: "LangTailor download, LangStitch download",
        canonical: LANGTAILOR_URL,
        robots: "noindex, follow",
        ogTitle: "Download LangTailor",
        ogDescription: "Free visual agent IDE — langtailor.langstitch.com",
        twitterTitle: "Download LangTailor",
        imageAlt: "Download LangTailor"
      }
    };
  }

  function resolvePageId() {
    var host = (location.hostname || "").toLowerCase();
    var path = location.pathname || "/";

    if (host === "langtailor.langstitch.com") return "langtailor";
    if (host === "sdk.langstitch.com") return "sdk";
    if (path.indexOf("/docs") === 0 || path.indexOf("/docs/") === 0) return "docs";

    var segs = path.split("/").filter(Boolean);
    var last = segs[segs.length - 1] || "";
    if (!last || !/\.html$/i.test(last)) return "home";
    if (last === "try.html") return "try";
    return "home";
  }

  function upsertMeta(name, content, property) {
    if (content == null || content === "") return;
    var sel = property ? 'meta[property="' + name + '"]' : 'meta[name="' + name + '"]';
    var node = document.head.querySelector(sel);
    if (!node) {
      node = document.createElement("meta");
      if (property) node.setAttribute("property", name);
      else node.setAttribute("name", name);
      document.head.appendChild(node);
    }
    node.setAttribute("content", content);
  }

  function upsertLink(rel, href, attrs) {
    if (!href) return;
    var node = document.head.querySelector('link[rel="' + rel + '"]');
    if (!node) {
      node = document.createElement("link");
      node.setAttribute("rel", rel);
      document.head.appendChild(node);
    }
    node.setAttribute("href", href);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        node.setAttribute(k, attrs[k]);
      });
    }
  }

  function injectJsonLd(blocks) {
    if (!blocks || !blocks.length) return;
    var existing = document.getElementById("langstitch-jsonld");
    if (existing) existing.remove();
    var payload =
      blocks.length === 1
        ? blocks[0]
        : { "@context": "https://schema.org", "@graph": blocks };
    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "langstitch-jsonld";
    script.textContent = JSON.stringify(payload);
    document.head.appendChild(script);
  }

  function applySeo() {
    var pageId = resolvePageId();
    var PAGES = buildPages();
    var page = PAGES[pageId];
    if (!page) return;

    var title = page.title;
    var description = page.description;
    var ogTitle = page.ogTitle || title;
    var ogDescription = page.ogDescription || description;
    var twitterTitle = page.twitterTitle || ogTitle;
    var imageAlt = page.imageAlt || SITE_NAME + " — visual agent IDE";
    var robots =
      page.robots || "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
    var sitemapHref = page.sitemap || SITE_ORIGIN + "/sitemap.xml";

    document.title = title;
    upsertMeta("description", description);
    upsertMeta("keywords", page.keywords);
    upsertMeta("author", SITE_NAME);
    upsertMeta("application-name", PRODUCT_NAME);
    upsertMeta("apple-mobile-web-app-title", PRODUCT_NAME);
    upsertMeta("robots", robots);
    upsertMeta("googlebot", robots);
    upsertMeta("bingbot", robots);
    upsertMeta("theme-color", "#000000");
    upsertMeta("color-scheme", "dark");

    upsertLink("canonical", page.canonical);
    upsertLink("icon", LOGO, { type: "image/svg+xml" });
    upsertLink("apple-touch-icon", LOGO);
    upsertLink("sitemap", sitemapHref, {
      type: "application/xml",
      title: "Sitemap"
    });

    upsertMeta("og:site_name", SITE_NAME, true);
    upsertMeta("og:type", "website", true);
    upsertMeta("og:url", page.canonical, true);
    upsertMeta("og:title", ogTitle, true);
    upsertMeta("og:description", ogDescription, true);
    upsertMeta("og:image", OG_IMAGE, true);
    upsertMeta("og:image:secure_url", OG_IMAGE, true);
    upsertMeta("og:image:alt", imageAlt, true);
    upsertMeta("og:image:width", "1200", true);
    upsertMeta("og:image:height", "630", true);
    upsertMeta("og:image:type", "image/png", true);
    upsertMeta("og:locale", "en_US", true);

    upsertMeta("twitter:card", "summary_large_image");
    upsertMeta("twitter:site", TWITTER);
    upsertMeta("twitter:creator", TWITTER);
    upsertMeta("twitter:title", twitterTitle);
    upsertMeta("twitter:description", ogDescription);
    upsertMeta("twitter:image", OG_IMAGE);
    upsertMeta("twitter:image:alt", imageAlt);

    if (page.jsonLd) injectJsonLd(page.jsonLd());
  }

  function loadManifestThenApply() {
    fetch(MANIFEST_URL, { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("releases.json unavailable");
        return r.json();
      })
      .then(function (m) {
        if (m.langtailor && m.langtailor.version) {
          VERSION = String(m.langtailor.version);
        }
        if (m.langtailor && m.langtailor.operatingSystem) {
          OS_LIST = String(m.langtailor.operatingSystem);
        } else {
          OS_LIST = "Windows, macOS";
        }
        var win = (m.downloads || []).find(function (d) {
          return d.id === "win-installer";
        });
        if (win && win.url) DOWNLOAD_URL = win.url;
      })
      .catch(function () {})
      .then(applySeo);
  }

  loadManifestThenApply();
})();
