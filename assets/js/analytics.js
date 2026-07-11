(function () {
  'use strict';

  var API_BASE = 'https://api.langstitch.com/api';
  var CONSENT_KEY = 'ls_analytics_consent';
  var VISITOR_KEY = 'ls_analytics_visitor';
  var SESSION_KEY = 'ls_analytics_session';
  var SCROLL_MARKS = [25, 50, 75, 100];

  var script = document.currentScript;
  var site = (script && script.getAttribute('data-site')) || 'langstitch';
  if (script && script.getAttribute('data-api')) {
    API_BASE = script.getAttribute('data-api').replace(/\/$/, '');
  }

  var consent = readConsent();
  var visitorUuid = null;
  var sessionUuid = null;
  var sessionStarted = Date.now();
  var scrollSent = {};
  var queue = [];
  var flushTimer = null;

  // IDs are only created/persisted after the visitor accepts analytics.
  function ensureIds() {
    try {
      visitorUuid = localStorage.getItem(VISITOR_KEY);
      if (!visitorUuid) {
        visitorUuid = uuid();
        localStorage.setItem(VISITOR_KEY, visitorUuid);
      }
      sessionUuid = sessionStorage.getItem(SESSION_KEY);
      if (!sessionUuid) {
        sessionUuid = uuid();
        sessionStorage.setItem(SESSION_KEY, sessionUuid);
      }
    } catch (e) {
      visitorUuid = visitorUuid || uuid();
      sessionUuid = sessionUuid || uuid();
    }
  }

  function clearIds() {
    try {
      localStorage.removeItem(VISITOR_KEY);
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {
      /* ignore */
    }
    visitorUuid = null;
    sessionUuid = null;
  }

  mountBanner();
  mountPrivacySection();
  window.addEventListener('hashchange', syncPrivacyVisibility);
  syncPrivacyVisibility();
  document.addEventListener('keydown', onPrivacyKeydown);

  if (consent === 'accepted') {
    startTracking();
  }

  function readConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY) || '';
    } catch (e) {
      return '';
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch (e) {
      /* ignore */
    }
    consent = value;
  }

  function uuid() {
    if (window.crypto && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function mountBanner() {
    if (consent === 'accepted' || consent === 'denied') {
      if (consent === 'denied' && !sessionStorage.getItem('ls_analytics_denied_sent')) {
        sessionStorage.setItem('ls_analytics_denied_sent', '1');
        sendPayload({ consent: 'denied', site: site }, true);
      }
      return;
    }

    var root = document.createElement('div');
    root.className = 'ls-consent';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-live', 'polite');
    root.setAttribute('aria-label', 'Cookie consent');
    root.innerHTML =
      '<p class="ls-consent__title">Analytics cookies</p>' +
      '<p class="ls-consent__text">We use first-party cookies to understand how visitors use LangStitch sites — pages viewed, device type, and approximate location — only if you accept. See our <a href="#privacy">privacy note</a> or email <a href="mailto:connect@langstitch.com">connect@langstitch.com</a>.</p>' +
      '<div class="ls-consent__actions">' +
      '<button type="button" class="ls-consent__btn ls-consent__btn--accept" data-action="accept">Accept analytics</button>' +
      '<button type="button" class="ls-consent__btn" data-action="deny">Decline</button>' +
      '</div>';

    root.addEventListener('click', function (ev) {
      var btn = ev.target.closest('[data-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-action');
      if (action === 'accept') {
        setConsent('accepted');
        root.hidden = true;
        startTracking();
        trackEvent('consent', { choice: 'accepted' });
        flush(true);
        return;
      }
      if (action === 'deny') {
        setConsent('denied');
        root.hidden = true;
        clearIds();
        sessionStorage.setItem('ls_analytics_denied_sent', '1');
        sendPayload({ consent: 'denied', site: site }, true);
      }
    });

    document.body.appendChild(root);
  }

  var PRIVACY_BODY =
    '<h3>Overview</h3>' +
    '<p>LangStitch runs first-party analytics on our public sites to understand how visitors use pages and features. We do not use third-party ad trackers or sell visitor data.</p>' +
    '<h3>What we collect (with consent)</h3>' +
    '<ul>' +
    '<li>Pages viewed, clicks, scroll depth, and time on page</li>' +
    '<li>Browser, operating system, device type, screen size, and language</li>' +
    '<li>Approximate location (country/region/city derived from IP)</li>' +
    '<li>Referrer, UTM campaign parameters, and landing URL</li>' +
    '<li>A random visitor ID stored in your browser (local storage) and a session ID (session storage)</li>' +
    '</ul>' +
    '<h3>Your choices</h3>' +
    '<p>Accept or decline analytics in the cookie banner. If you decline, we do not set tracking cookies or record browsing events. You can clear site data in your browser to reset your choice.</p>' +
    '<h3>Data requests</h3>' +
    '<p>Email <a href="mailto:connect@langstitch.com?subject=Privacy%20request">connect@langstitch.com</a> to ask about your data or request deletion.</p>' +
    '<p class="privacy-updated"><em>Last updated: July 2026</em></p>';

  var privacyOverlay = site === 'marketplace';

  function mountPrivacySection() {
    var el = document.getElementById('privacy');
    if (!el) {
      el = document.createElement('section');
      el.id = 'privacy';
      document.body.appendChild(el);
    }
    if (privacyOverlay) {
      el.className = 'ls-privacy ls-privacy--overlay';
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-modal', 'true');
      el.setAttribute('aria-label', 'Privacy notice');
      el.innerHTML =
        '<div class="ls-privacy__dialog">' +
        '<button type="button" class="ls-privacy__close" aria-label="Close privacy notice">&times;</button>' +
        '<p class="ls-privacy__label">Privacy</p>' +
        '<h2 class="ls-privacy__title">Analytics &amp; cookies</h2>' +
        '<div class="privacy-panel">' +
        PRIVACY_BODY +
        '</div></div>';
      el.addEventListener('click', function (ev) {
        if (ev.target === el || ev.target.closest('.ls-privacy__close')) {
          closePrivacyOverlay();
        }
      });
      return;
    }
    if (!el.querySelector('.privacy-panel')) {
      var panel = document.createElement('div');
      panel.className = 'privacy-panel';
      panel.innerHTML = PRIVACY_BODY;
      el.appendChild(panel);
    }
  }

  function syncPrivacyVisibility() {
    var el = document.getElementById('privacy');
    if (!el) return;
    var open = location.hash === '#privacy';
    if (privacyOverlay) {
      el.classList.toggle('ls-privacy--open', open);
      el.hidden = !open;
      el.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.classList.toggle('ls-privacy-lock', open);
      return;
    }
    el.hidden = false;
    el.removeAttribute('aria-hidden');
    if (open) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function closePrivacyOverlay() {
    if (location.hash === '#privacy') {
      history.replaceState(null, '', location.pathname + location.search);
    }
    syncPrivacyVisibility();
  }

  function onPrivacyKeydown(ev) {
    if (ev.key === 'Escape' && location.hash === '#privacy' && privacyOverlay) {
      closePrivacyOverlay();
    }
  }

  function startTracking() {
    ensureIds();
    trackPageView();
    document.addEventListener('click', onClick, true);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('hashchange', trackPageView);
    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('beforeunload', onPageHide);
    flushTimer = window.setInterval(function () {
      flush(false);
    }, 15000);
  }

  function clientSnapshot() {
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    var params = new URLSearchParams(window.location.search);
    return {
      user_agent: navigator.userAgent,
      language: navigator.language || null,
      languages: navigator.languages ? Array.prototype.slice.call(navigator.languages, 0, 8) : [],
      platform: navigator.platform || null,
      timezone: safeTimezone(),
      screen_width: window.screen && window.screen.width,
      screen_height: window.screen && window.screen.height,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      pixel_ratio: window.devicePixelRatio || 1,
      color_depth: window.screen && window.screen.colorDepth,
      cpu_cores: navigator.hardwareConcurrency || null,
      device_memory_gb: navigator.deviceMemory || null,
      touch_points: navigator.maxTouchPoints || 0,
      connection_type: conn && conn.effectiveType ? conn.effectiveType : null,
      cookie_enabled: navigator.cookieEnabled,
      do_not_track: navigator.doNotTrack || window.doNotTrack || null,
      referrer: document.referrer || null,
      page_url: location.href,
      page_path: location.pathname + location.search + location.hash,
      search_params: params.toString() || null,
      hash: location.hash || null,
      utm: {
        source: params.get('utm_source'),
        medium: params.get('utm_medium'),
        campaign: params.get('utm_campaign'),
        term: params.get('utm_term'),
        content: params.get('utm_content'),
      },
    };
  }

  function safeTimezone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
      return null;
    }
  }

  function pagePayload(extra) {
    return Object.assign(
      {
        page_url: location.href,
        page_path: location.pathname + location.search + location.hash,
        page_title: document.title || null,
        referrer: document.referrer || null,
      },
      extra || {},
    );
  }

  function trackEvent(type, extra) {
    if (consent !== 'accepted') return;
    queue.push(Object.assign({ type: type }, pagePayload(extra)));
    if (queue.length >= 8) {
      flush(false);
    }
  }

  function trackPageView() {
    trackEvent('page_view', {
      payload: {
        landing: sessionStorage.getItem('ls_analytics_landing') !== '1' ? true : false,
      },
    });
    sessionStorage.setItem('ls_analytics_landing', '1');
  }

  function onClick(ev) {
    var el = ev.target && ev.target.closest('a,button,[role="button"],input[type="submit"]');
    if (!el) return;
    var text = (el.innerText || el.textContent || '').trim().slice(0, 120);
    trackEvent('click', {
      target_tag: el.tagName ? el.tagName.toLowerCase() : null,
      target_id: el.id || null,
      target_text: text || null,
      target_href: el.href || null,
    });
  }

  function onScroll() {
    var doc = document.documentElement;
    var height = Math.max(doc.scrollHeight - window.innerHeight, 1);
    var pct = Math.min(100, Math.round((window.scrollY / height) * 100));
    for (var i = 0; i < SCROLL_MARKS.length; i++) {
      var mark = SCROLL_MARKS[i];
      if (pct >= mark && !scrollSent[mark]) {
        scrollSent[mark] = true;
        trackEvent('scroll_depth', { scroll_depth: mark });
      }
    }
  }

  function onPageHide() {
    if (consent !== 'accepted') return;
    trackEvent('page_exit', {
      duration_seconds: Math.round((Date.now() - sessionStarted) / 1000),
    });
    flush(true);
  }

  function flush(useBeacon) {
    if (consent !== 'accepted' || queue.length === 0) return;
    var events = queue.splice(0, queue.length);
    sendPayload(
      {
        consent: 'accepted',
        visitor_uuid: visitorUuid,
        session_uuid: sessionUuid,
        site: site,
        client: clientSnapshot(),
        events: events,
      },
      useBeacon,
    );
  }

  function sendPayload(body, useBeacon) {
    var url = API_BASE + '/analytics/ingest';
    var json = JSON.stringify(body);
    if (useBeacon && navigator.sendBeacon) {
      try {
        navigator.sendBeacon(url, new Blob([json], { type: 'application/json' }));
        return;
      } catch (e) {
        /* fall through */
      }
    }
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
      keepalive: true,
      credentials: 'omit',
    }).catch(function () {
      /* ignore network errors */
    });
  }
})();
