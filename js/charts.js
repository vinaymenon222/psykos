/* Performance graph: score (% of maximum) per evaluation over time, with a labelled vertical line per evaluation. */
(function (global) {
  'use strict';
  var esc = function (s) { return global.Psy.esc(s); };
  var SHORT = { DIAG26: 'DIAG', INT1: 'IE1' };

  function dayNum(iso) { return Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) / 864e5; }

  /* evals: [{ id, name, date, pct, absent }], cutoff: 0.5. Returns an SVG string. */
  function performanceGraph(evals, cutoff, studentName) {
    var list = evals.filter(function (e) { return e.date && e.type !== 'attendance'; })
      .sort(function (a, b) { return a.date === b.date ? a.order - b.order : (a.date < b.date ? -1 : 1); });
    if (!list.length) return '<p class="muted">No evaluations yet.</p>';
    var W = 660, H = 250, L = 50, R = 630, T = 34, B = 210;
    var d0 = dayNum(list[0].date), d1 = dayNum(list[list.length - 1].date), span = Math.max(1, d1 - d0);
    var x = function (iso) { return L + (dayNum(iso) - d0) / span * (R - L); };
    var y = function (p) { return B - p * (B - T); };
    // group evaluations that share a date
    var groups = [];
    list.forEach(function (e) {
      var g = groups[groups.length - 1];
      if (g && g.date === e.date) g.items.push(e); else groups.push({ date: e.date, items: [e] });
    });
    var s = '<svg role="img" viewBox="0 0 ' + W + ' ' + (H + 6) + '" aria-label="' + esc('Scores of ' + (studentName || 'the student') + ' across ' + list.length + ' evaluations') + '">';
    s += '<text class="axis" x="40" y="' + (y(1) + 4) + '" text-anchor="end">100</text>';
    s += '<text class="axis" x="40" y="' + (y(0.5) + 4) + '" text-anchor="end">50</text>';
    s += '<text class="axis" x="40" y="' + (y(0) + 4) + '" text-anchor="end">0</text>';
    s += '<line class="grid" x1="' + L + '" x2="' + R + '" y1="' + B + '" y2="' + B + '"/>';
    var rowEnd = [-1e9, -1e9];   // two label rows; a label drops to the second row if it would overlap
    groups.forEach(function (g) {
      var gx = x(g.date);
      var anchor = gx > R - 30 ? 'end' : (gx < L + 30 ? 'start' : 'middle');
      var label = g.items.map(function (e) { return SHORT[e.id] || e.id; }).join(' · ');
      var w = label.length * 7;
      var x0 = anchor === 'end' ? gx - w : (anchor === 'start' ? gx : gx - w / 2);
      var rowIdx = x0 > rowEnd[0] + 8 ? 0 : 1;
      rowEnd[rowIdx] = x0 + w;
      s += '<line class="evline" x1="' + gx + '" x2="' + gx + '" y1="' + T + '" y2="' + B + '"/>';
      s += '<text class="evlabel" x="' + gx + '" y="' + (rowIdx ? 26 : 12) + '" text-anchor="' + anchor + '">' + esc(label) + '</text>';
      s += '<text class="axis" x="' + gx + '" y="' + (B + 20) + '" text-anchor="' + anchor + '">' + esc(global.Psy.fmtDate(g.date)) + '</text>';
      if (g.items.some(function (e) { return e.absent; })) {
        s += '<text class="axis" x="' + gx + '" y="' + (B + 34) + '" text-anchor="' + anchor + '">' +
          esc(g.items.filter(function (e) { return e.absent; }).map(function (e) { return (SHORT[e.id] || e.id) + ' absent'; }).join(', ')) + '</text>';
      }
    });
    s += '<line class="cut" x1="' + L + '" x2="' + R + '" y1="' + y(cutoff) + '" y2="' + y(cutoff) + '"/>';
    var pts = [];
    groups.forEach(function (g) {
      var present = g.items.filter(function (e) { return !e.absent; });
      present.forEach(function (e, i) {
        var off = present.length > 1 ? (i - (present.length - 1) / 2) * 10 : 0;
        pts.push({ x: x(g.date) + off, y: y(e.pct), e: e });
      });
    });
    if (pts.length > 1) s += '<polyline class="line" points="' + pts.map(function (p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' ') + '"/>';
    pts.forEach(function (p) {
      s += '<circle class="pt' + (p.e.pct < cutoff ? ' is-weak' : '') + '" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="4.5"><title>' +
        esc(p.e.name + ': ' + Math.round(p.e.pct * 100) + '%') + '</title></circle>';
    });
    return s + '</svg>';
  }

  global.PsyCharts = { performanceGraph: performanceGraph };
})(window);
