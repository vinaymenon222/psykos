/*
 * Weak-topic calculation (02_DATA_SPEC section 9).
 * For each mapped subtopic: marks scored / marks possible, absent and blank items excluded.
 * WeakRule "latest": use only the most recent evaluation that tested the subtopic.
 * WeakRule "combined": add up every evaluation that tested it.
 * Weak = below WeakCutoff. Sorted weakest first.
 */
(function (global) {
  'use strict';
  var D = global.PsyData;

  function moduleNo(label) { var m = /(\d+)/.exec(label || ''); return m ? m[1] : ''; }

  /* All subtopic scores for a student: [{ subtopic, topic, module, co, pct, got, max, basis, evalNames, lesson, weak }] */
  function getTopicScores(roll, subject) {
    subject = subject || 'English';
    var set = D.getSettings();
    var ev = D.getSubtopicEvidence(roll, subject);
    return Object.keys(ev).map(function (k) {
      var o = ev[k];
      var list = Object.keys(o.evals).map(function (id) { return o.evals[id]; })
        .sort(function (a, b) { return a.date === b.date ? a.order - b.order : (a.date < b.date ? -1 : 1); });
      var use = set.weakRule === 'combined' ? list : [list[list.length - 1]];
      var got = 0, max = 0;
      use.forEach(function (e) { got += e.got; max += e.max; });
      var pct = max ? got / max : null;
      var info = D.getTopicInfo(subject, o.subtopic);
      return {
        subtopic: o.subtopic, topic: o.topic, module: o.module, moduleNo: moduleNo(o.module), co: o.co,
        pct: pct, got: got, max: max, basis: use.map(function (e) { return e.name; }).join(', '),
        lesson: info ? info.lesson : '', weak: pct != null && pct < set.weakCutoff
      };
    });
  }

  function sortWeakest(a, b) {
    if (a.pct !== b.pct) return a.pct - b.pct;
    if (a.max !== b.max) return b.max - a.max;   // more evidence first
    return a.subtopic < b.subtopic ? -1 : 1;
  }

  function getWeakTopics(roll, subject) {
    return getTopicScores(roll, subject).filter(function (t) { return t.weak; }).sort(sortWeakest);
  }

  /* Pop-ups for the student view: weakest first, capped by PopupCap. */
  function getPopups(roll, subject) {
    return getWeakTopics(roll, subject).slice(0, D.getSettings().popupCap);
  }

  /* Class view: subtopic -> weak students, most students first. */
  function getClassWeakByTopic(cls, subject) {
    var map = {};
    D.getStudentsForClass(cls).forEach(function (s) {
      getWeakTopics(s.roll, subject).forEach(function (t) {
        var g = map[t.subtopic] = map[t.subtopic] || { subtopic: t.subtopic, topic: t.topic, module: t.module, students: [] };
        g.students.push({ roll: s.roll, name: s.name, pct: t.pct });
      });
    });
    return Object.keys(map).map(function (k) {
      map[k].students.sort(function (a, b) { return a.pct - b.pct || (a.name < b.name ? -1 : 1); });
      return map[k];
    }).sort(function (a, b) { return b.students.length - a.students.length || (a.subtopic < b.subtopic ? -1 : 1); });
  }

  global.PsyWeak = { getTopicScores: getTopicScores, getWeakTopics: getWeakTopics, getPopups: getPopups,
    getClassWeakByTopic: getClassWeakByTopic, sortWeakest: sortWeakest };
})(window);
