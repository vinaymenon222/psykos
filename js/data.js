/*
 * Data layer. Every page gets its data through these functions and never reads files directly.
 *
 * DEMO: reads the Excel files in /data with SheetJS and keeps everything in memory.
 * PRODUCTION: replace the bodies of these functions with calls to the Google Apps Script web app,
 * which checks the signed-in Google account and filters rows on the server before anything reaches
 * the browser. The pages do not need to change.
 */
(function (global) {
  'use strict';

  var SESSION_KEY = 'psykos-user';
  var FEEDBACK_KEY = 'psykos-feedback';
  var DATA_DIR = 'data/';
  var DB = null;
  var loading = null;

  function fetchBook(name) {
    return fetch(DATA_DIR + name, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('Could not load ' + name + ' (' + r.status + ')');
      return r.arrayBuffer();
    }).then(function (buf) { return XLSX.read(buf, { type: 'array' }); });
  }
  function rows(book, sheet) {
    var ws = book.Sheets[sheet];
    return ws ? XLSX.utils.sheet_to_json(ws, { defval: '', raw: true }) : [];
  }
  function str(v) { return v == null ? '' : String(v).trim(); }
  function isAbsent(v) { return v === '' || v == null || str(v).toUpperCase() === 'AB'; }

  /* ---------------- loading ---------------- */
  function load() {
    if (DB) return Promise.resolve(DB);
    if (loading) return loading;
    loading = fetchBook('master.xlsx').then(function (master) {
      var db = {
        students: rows(master, 'Students').map(function (s) {
          return { roll: str(s.RollNo), name: str(s.Name), cls: str(s.Class), batch: str(s.Batch), email: str(s.Email), status: str(s.Status), accessUntil: str(s.AccessUntil) };
        }),
        faculty: rows(master, 'Faculty').map(function (f) {
          return { id: str(f.FacultyID), name: str(f.Name), email: str(f.Email), role: str(f.Role), status: str(f.Status) };
        }),
        classes: rows(master, 'Classes').map(function (c) {
          return { cls: str(c.Class), batch: str(c.Batch), subject: str(c.Subject), facultyId: str(c.FacultyID) };
        }),
        topics: rows(master, 'Topics').map(function (t) {
          return { subject: str(t.Subject), moduleNo: str(t.ModuleNo), module: str(t.Module), topic: str(t.Topic), subtopic: str(t.Subtopic), co: str(t.CO), lesson: str(t.LessonPage) };
        }),
        evaluations: rows(master, 'Evaluations').map(function (e, i) {
          return { id: str(e.EvalID), name: str(e.Name), type: str(e.Type), subject: str(e.Subject), date: str(e.Date), max: Number(e.MaxMarks) || 0, scaleTo: e.ScaleTo === '' ? null : Number(e.ScaleTo), order: i };
        }),
        items: rows(master, 'ItemMap').map(function (it) {
          return { evalId: str(it.EvalID), itemId: str(it.ItemID), max: Number(it.MaxMarks) || 0, subject: str(it.Subject), module: str(it.Module), topic: str(it.Topic), subtopic: str(it.Subtopic), co: str(it.CO), mapped: str(it.Mapped).toUpperCase() === 'Y' };
        }),
        settings: {},
        batches: rows(master, 'Batches'),
        psychTests: rows(master, 'PsychTests'),
        feedback: rows(master, 'Feedback').map(function (f) {
          return { roll: str(f.RollNo), date: str(f.Date), facultyId: str(f.FacultyID), subject: str(f.Subject), topic: str(f.Topic), comment: str(f.Comment) };
        }),
        marks: {},   // evalId -> roll -> { itemId: value | 'AB' }
        psych: {}    // roll -> { scaleKey: score }
      };
      rows(master, 'Settings').forEach(function (s) { db.settings[str(s.Setting)] = s.Value; });
      var loads = db.batches.map(function (b) {
        var marksFile = str(b.MarksFile), psychFile = str(b.PsychFile);
        var p1 = marksFile ? fetchBook(marksFile).then(function (book) {
          book.SheetNames.forEach(function (sn) {
            var m = db.marks[sn] = db.marks[sn] || {};
            rows(book, sn).forEach(function (r) { var roll = str(r.RollNo); if (roll) m[roll] = r; });
          });
        }) : Promise.resolve();
        var p2 = psychFile ? fetchBook(psychFile).then(function (book) {
          book.SheetNames.forEach(function (sn) {
            rows(book, sn).forEach(function (r) {
              var roll = str(r.RollNo); if (!roll) return;
              var p = db.psych[roll] = db.psych[roll] || {};
              Object.keys(r).forEach(function (k) { if (k !== 'RollNo' && k !== 'Name') p[k] = r[k]; });
            });
          });
        }) : Promise.resolve();
        return Promise.all([p1, p2]);
      });
      return Promise.all(loads).then(function () { DB = db; return db; });
    });
    return loading;
  }

  /* ---------------- session (demo stand-in for Google sign-in) ---------------- */
  function setCurrentUser(u) { try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(u)); } catch (e) { global.__psyUser = u; } }
  function signOut() { try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { global.__psyUser = null; } }
  /* Returns { role, id, name, ... } or null when the user is unknown or has no access. */
  function getCurrentUser() {
    var u = null;
    try { u = JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch (e) { u = global.__psyUser || null; }
    if (!u || !DB) return u;
    if (u.role === 'faculty') {
      var f = DB.faculty.filter(function (x) { return x.id === u.id && x.status === 'Active'; })[0];
      return f ? { role: 'faculty', id: f.id, name: f.name } : null;
    }
    if (u.role === 'student') {
      var s = getStudent(u.id);
      var today = new Date().toISOString().slice(0, 10);
      return s && s.status === 'Active' && (!s.accessUntil || today <= s.accessUntil) ? { role: 'student', id: s.roll, name: s.name, cls: s.cls } : null;
    }
    return null;
  }

  /* ---------------- lookups ---------------- */
  function getSettings() {
    var s = DB.settings;
    return { weakCutoff: Number(s.WeakCutoff) || 0.5, popupCap: Number(s.PopupCap) || 5, weakRule: str(s.WeakRule) || 'latest', academicYear: str(s.AcademicYear) };
  }
  function listFaculty() { return DB.faculty.filter(function (f) { return f.status === 'Active' && f.role === 'faculty'; }); }
  function listStudents() { return DB.students.filter(function (s) { return s.status === 'Active'; }); }
  function getStudent(roll) { return DB.students.filter(function (s) { return s.roll === roll; })[0] || null; }
  function getFaculty(id) { return DB.faculty.filter(function (f) { return f.id === id; })[0] || null; }

  /* One entry per class the faculty member teaches, with its subjects. */
  function getClassesForFaculty(facultyId) {
    var out = [], seen = {};
    DB.classes.forEach(function (c) {
      if (c.facultyId !== facultyId) return;
      if (!seen[c.cls]) { seen[c.cls] = { cls: c.cls, batch: c.batch, subjects: [] }; out.push(seen[c.cls]); }
      if (seen[c.cls].subjects.indexOf(c.subject) < 0) seen[c.cls].subjects.push(c.subject);
    });
    return out;
  }
  function getSubjectsForClass(cls) {
    var out = [];
    DB.classes.forEach(function (c) { if (c.cls === cls && out.indexOf(c.subject) < 0) out.push(c.subject); });
    return out;
  }
  function getStudentsForClass(cls) {
    return listStudents().filter(function (s) { return s.cls === cls; }).sort(function (a, b) { return a.roll < b.roll ? -1 : 1; });
  }
  function getEvaluations(subject) {
    return DB.evaluations.filter(function (e) { return !subject || e.subject === subject; });
  }
  function itemsFor(evalId) { return DB.items.filter(function (it) { return it.evalId === evalId; }); }
  function getTopicMap(subject) { return DB.topics.filter(function (t) { return t.subject === subject; }); }
  function getTopicInfo(subject, subtopic) {
    return DB.topics.filter(function (t) { return t.subject === subject && t.subtopic === subtopic; })[0] || null;
  }

  /* Marks for one student in one evaluation. Absent and blank items are left out of the totals. */
  function evalResult(ev, roll) {
    var row = (DB.marks[ev.id] || {})[roll];
    var its = itemsFor(ev.id);
    var got = 0, possible = 0, absentItems = 0;
    its.forEach(function (it) {
      var v = row ? row[it.itemId] : '';
      if (isAbsent(v)) { absentItems++; return; }
      got += Number(v); possible += it.max;
    });
    var absent = possible === 0;
    var pct = absent ? null : got / possible;
    var display = absent ? null : (ev.type === 'attendance' ? got : Math.round(pct * ev.max * 2) / 2);
    return { id: ev.id, name: ev.name, type: ev.type, date: ev.date, order: ev.order, max: ev.max, scaleTo: ev.scaleTo,
      got: got, possible: possible, pct: pct, display: display, absent: absent, partial: !absent && absentItems > 0, row: row || null };
  }

  /* Everything shown in a student's own record. */
  function getStudentRecord(roll, subject) {
    var s = getStudent(roll);
    if (!s) return null;
    subject = subject || 'English';
    var evals = getEvaluations(subject).map(function (ev) { return evalResult(ev, roll); });
    return { student: s, subject: subject, evaluations: evals, feedback: getFeedback(roll) };
  }

  /* Per-subtopic scores for one student: subtopic -> list of { evalId, date, got, max }. */
  function getSubtopicEvidence(roll, subject) {
    var out = {};
    getEvaluations(subject).forEach(function (ev) {
      var row = (DB.marks[ev.id] || {})[roll];
      if (!row) return;
      itemsFor(ev.id).forEach(function (it) {
        if (!it.mapped || !it.subtopic) return;
        var v = row[it.itemId];
        if (isAbsent(v)) return;
        var key = it.subtopic;
        var o = out[key] = out[key] || { subtopic: it.subtopic, topic: it.topic, module: it.module, co: it.co, evals: {} };
        var e = o.evals[ev.id] = o.evals[ev.id] || { evalId: ev.id, name: ev.name, date: ev.date, order: ev.order, got: 0, max: 0 };
        e.got += Number(v); e.max += it.max;
      });
    });
    return out;
  }

  function getPsychProfile(roll) {
    var p = DB.psych[roll];
    var scales = DB.psychTests.map(function (t) {
      var v = p ? p[str(t.Scale)] : '';
      return { key: str(t.Scale), label: str(t.Label) || str(t.Scale), min: Number(t.MinScore) || 0, max: Number(t.MaxScore) || 0,
        score: v === '' || v == null ? null : Number(v), description: str(t.FacultyDescription), tip: str(t.ClassroomTip) };
    });
    return { taken: scales.some(function (s) { return s.score != null; }), scales: scales };
  }

  /* Feedback from the master file plus notes added in this browser during the demo. */
  function localFeedback() { try { return JSON.parse(localStorage.getItem(FEEDBACK_KEY)) || []; } catch (e) { return []; } }
  function getFeedback(roll) {
    var list = DB.feedback.concat(localFeedback()).filter(function (f) { return f.roll === roll; });
    return list.map(function (f) {
      var fac = getFaculty(f.facultyId);
      return { date: f.date, by: fac ? fac.name : f.facultyId, topic: f.topic, subject: f.subject, comment: f.comment };
    }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  }
  function addFeedback(roll, facultyId, topic, comment) {
    var list = localFeedback();
    list.push({ roll: roll, date: new Date().toISOString().slice(0, 10), facultyId: facultyId, subject: 'English', topic: topic || 'General', comment: comment });
    try { localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list)); return true; } catch (e) { DB.feedback.push(list[list.length - 1]); return false; }
  }
  /* People a student can ask for a one-to-one session. */
  function getContacts(roll) {
    var s = getStudent(roll);
    var out = [];
    DB.classes.forEach(function (c) {
      if (!s || c.cls !== s.cls) return;
      var f = getFaculty(c.facultyId);
      if (f && !out.some(function (o) { return o.email === f.email; })) out.push({ label: f.name + ' (course teacher)', email: f.email });
    });
    DB.faculty.forEach(function (f) { if (f.role === 'counsellor' && f.status === 'Active') out.push({ label: f.name, email: f.email }); });
    return out;
  }

  global.PsyData = {
    load: load, getCurrentUser: getCurrentUser, setCurrentUser: setCurrentUser, signOut: signOut,
    getSettings: getSettings, listFaculty: listFaculty, listStudents: listStudents, getStudent: getStudent, getFaculty: getFaculty,
    getClassesForFaculty: getClassesForFaculty, getSubjectsForClass: getSubjectsForClass, getStudentsForClass: getStudentsForClass, getEvaluations: getEvaluations,
    getTopicMap: getTopicMap, getTopicInfo: getTopicInfo, getStudentRecord: getStudentRecord, evalResult: evalResult,
    getSubtopicEvidence: getSubtopicEvidence, getPsychProfile: getPsychProfile, getFeedback: getFeedback,
    addFeedback: addFeedback, getContacts: getContacts
  };
})(window);
