/* Shared helpers: theme, header, icons, escaping, formatting. */
(function (global) {
  'use strict';

  var THEME_KEY = 'psykos-theme';

  function getTheme() {
    try { return localStorage.getItem(THEME_KEY) || 'dark'; } catch (e) { return 'dark'; }
  }
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem(THEME_KEY, t); } catch (e) { /* storage unavailable: theme still changes for this page */ }
    var b = document.getElementById('theme-btn');
    if (b) b.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  function toggleTheme() { setTheme(getTheme() === 'dark' ? 'light' : 'dark'); }

  var ICONS = {
    sun: '<svg class="icon-sun" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg class="icon-moon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
    signout: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l-5-5 5-5"/><path d="M5 12h11"/></svg>',
    arrow: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>',
    back: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M11 18l-6-6 6-6"/></svg>',
    chevron: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    download: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>',
    bell: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/></svg>',
    close: '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12"/><path d="M18 6L6 18"/></svg>',
    book: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/></svg>',
    chart: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/></svg>',
    leaf: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15"/><path d="M5 19l7-7"/></svg>'
  };

  /* Renders the page header. opts: { who: 'Name', signOut: true, backHref: 'x.html', backLabel: 'Back' } */
  function renderHeader(opts) {
    opts = opts || {};
    var el = document.getElementById('site-header');
    if (!el) return;
    var right = '';
    if (opts.backHref) right += '<a class="btn btn-ghost btn-sm" href="' + esc(opts.backHref) + '">' + ICONS.back + esc(opts.backLabel || 'Back') + '</a>';
    if (opts.who) right += '<span class="who">' + esc(opts.who) + '</span>';
    right += '<button id="theme-btn" class="icon-btn" type="button" aria-label="' + (getTheme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode') + '">' + ICONS.sun + ICONS.moon + '</button>';
    if (opts.signOut) right += '<a class="icon-btn" href="index.html" id="signout" aria-label="Sign out">' + ICONS.signout + '</a>';
    var home = opts.homeHref || 'index.html';
    el.innerHTML = '<div class="wrap"><a class="brand" href="' + esc(home) + '" aria-label="PSY:KOS home">' +
      '<img class="logo-dark" src="' + esc(opts.assetBase || '') + 'assets/logo-dark.png" alt="PSY:KOS">' +
      '<img class="logo-light" src="' + esc(opts.assetBase || '') + 'assets/logo-light.png" alt="PSY:KOS"></a>' +
      '<div class="header-actions">' + right + '</div></div>';
    document.getElementById('theme-btn').addEventListener('click', toggleTheme);
    var so = document.getElementById('signout');
    if (so && global.PsyData) so.addEventListener('click', function () { global.PsyData.signOut(); });
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fmtDate(iso) {
    if (!iso) return '';
    var p = String(iso).split('-');
    return parseInt(p[2], 10) + ' ' + MONTHS[parseInt(p[1], 10) - 1];
  }
  function fmtNum(n) {
    if (n == null || n === '') return '';
    var r = Math.round(n * 10) / 10;
    return String(r);
  }
  function initials(name) {
    return String(name || '').split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
  }
  function showError(msg) {
    var m = document.getElementById('main');
    if (m) m.innerHTML = '<div class="wrap"><div class="empty"><b>Something went wrong</b><span class="muted">' + esc(msg) + '</span></div></div>';
  }

  global.Psy = { getTheme: getTheme, setTheme: setTheme, toggleTheme: toggleTheme, renderHeader: renderHeader,
    ICONS: ICONS, esc: esc, fmtDate: fmtDate, fmtNum: fmtNum, initials: initials, showError: showError };
})(window);
