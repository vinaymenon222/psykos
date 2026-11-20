# 03 Technical Design

## 1. Two stages

| | Hackathon demo (now) | Real deployment (later) |
|---|---|---|
| Data | Owner's Excel files, **anonymised**, or sample data in the same format | Google Sheets in a college Shared Drive |
| Server | None | Google Apps Script web app |
| Login | Fake "Sign in as" dropdown | College Google account (Google Workspace) |
| Pages served by | GitHub Pages | Apps Script (dashboards); GitHub Pages (lesson pages) |
| Code lives in | College GitHub repo | College GitHub repo |

**Agreed direction:** Google Sheets now; move to a free hosted database (for example Supabase) only if needed later.

## 2. How the pieces fit (plain explanation)

A website is a folder of files. GitHub stores the folder; GitHub Pages turns it into a live site with an address such as `collegename.github.io/program`. Each screen is one HTML file, and the pages link to each other like any website. When a file is updated on GitHub, the site updates within a minute or two.

```
College GitHub repo (published by GitHub Pages)
├── Home page (index.html)
│   ├── Mentor Dashboard (Module III)  ──reads──▶  Data
│   └── Student View (Module IV)       ──reads──▶  Data
│                                       ──links─▶  Lessons
├── Data folder (demo only: anonymised Excel / JSON + master)
└── Lessons folder (one HTML page per topic)
```

Data flow:

```
Faculty update the Excel (one tab per evaluation)
  → saved in the data source
  → page reads it, applies topic map and 50% cut-off
  → Mentor Dashboard: weak list, graph, PDF
  → Student View: marks, pop-ups, lessons
```

## 3. Suggested repository structure

```
/
├── index.html                 Home page and "Sign in as" (demo)
├── mentor.html                Module III
├── student.html               Module IV
├── lessons.html               Lesson repository browser (Home > Subject > Module > Topic)
├── js/
│   ├── data.js                ALL data access goes through here
│   ├── weak.js                Weak-topic calculation
│   ├── charts.js              Performance graph
│   └── report.js              PDF generation
├── css/
│   └── style.css
├── data/                      Demo only. Anonymised. Never real psychometric data.
│   ├── master.xlsx
│   ├── marks_batch2026.xlsx
│   └── psych_batch2026.xlsx
├── lessons/
│   ├── english/module-1/subject-verb-agreement.html
│   ├── english/module-2/...
│   └── math/graph-theory.html
└── docs/                      This handoff pack
```

Plain HTML, CSS and JavaScript keep it simple to host and to hand over. Suggested libraries, loaded from a CDN: **SheetJS** to read .xlsx in the browser, **Chart.js** for the performance graph (vertical lines via the annotation plugin), and **jsPDF** with **html2canvas** (or the browser's print-to-PDF) for reports. The other Claude may choose differently; keep it dependency-light.

### 3.1 The data layer (important)
All pages call functions in `js/data.js` and never read files directly. For example:
- `getCurrentUser()`
- `getClassesForFaculty(facultyId)`
- `getStudentsForClass(classId)`
- `getStudentRecord(rollNo)` (marks per evaluation, topic scores, feedback)
- `getPsychProfile(rollNo)`
- `getTopicMap(subject)`
- `getWeakTopics(rollNo)`

In the demo these read the local files. In production they call the Apps Script web app. The pages do not change.

## 4. Lesson pages (colleagues' HTML)

- Colleagues' lesson pages need no code changes to work.
- Each page is saved at a predictable path: `lessons/<subject>/module-<n>/<topic-slug>.html` (Math may skip the module level until its syllabus arrives).
- Slugs: lowercase, hyphens, no spaces (for example `subject-verb-agreement`).
- The master `Topics` tab records each page's path next to its topic. That is how a pop-up knows which page to open. **Adding a lesson = add the file + add the path to `Topics`.**
- Recommended: each lesson page has a small header block (title, subject, module, topic, author) and a "Back to repository" link. Later: a "Did this help? Yes / No" control and a Feedback link.
- Lesson pages contain no personal data, so they can stay on public GitHub Pages permanently.

## 5. Login and role routing (production)

1. User opens the app link, already signed in with their college Google account.
2. The server (Apps Script) reads their email.
3. It looks the email up in the master workbook:
   - In `Faculty` with Status Active: build the faculty home with one tab per class from `Classes`. Each tab is the same dashboard filtered to that class.
   - In `Students` with Status Active and today before `AccessUntil`: return only that student's rows.
   - Admin role: everything, all batches.
   - Otherwise: access denied.
4. **Filtering happens on the server before anything reaches the browser.** Never send the whole sheet and hide rows in the page.

Why Apps Script: within a Google Workspace domain, a web app deployed to execute as the owner can read the visiting user's email (`Session.getActiveUser().getEmail()`) when the visitor is in the same Workspace. No passwords to manage.

**Unconfirmed assumption:** Rajagiri uses Google Workspace for staff and student accounts (`@rajagiritech.ac.in`). This must be confirmed. If not, use Supabase with its built-in authentication instead.

**Demo:** a "Sign in as" dropdown listing a few faculty and students demonstrates exactly the same behaviour.

## 6. Scaling and growth

- About 576 new students a year (8 classes × 72). Each student generates roughly 150 to 200 cells a year, so about 100,000 cells per batch per year.
- Google Sheets supports up to 20 million cells per spreadsheet (raised from 10 million in September 2026). Size is not the constraint.
- **One workbook per admission batch** keeps each file small and fast; old batches simply stop being edited.
- Apps Script limits to keep in mind: 30 simultaneous executions per user (a web app running as the owner shares this across all visitors), 6 minutes per execution. Normal use by 6 faculty and students is fine; if a whole lab of 72 opens it at once, add caching (for example `CacheService`) so repeated reads are fast.
- When a database might become worthwhile: expansion beyond first-year English and Math to the whole college, heavy simultaneous use, or real-time features such as chat. Because every tab is a clean table keyed by roll number, migration is an export and import, not a rebuild.

## 7. Access lifecycle and data retention

- **Two locks:** (1) the `Status` and `AccessUntil` columns in the master workbook, checked on every login, so the admin can switch someone off with one cell; (2) the college deleting the Google account, after which the person cannot sign in at all.
- Students: access for 4 years from admission (`AccessUntil` = admission year + 4).
- Faculty: access until they leave (`Status` = Left).
- **Data is never deleted** when access ends. The admin sees all batches.
- **Ownership:** create all sheets in a **Shared Drive owned by the department or college**, not in anyone's personal Drive (including the owner's). Files in a personal Drive are tied to that account and can be lost if the account is deleted.

## 8. Privacy

- Psychometric results are sensitive personal data. Keep them in their own most-restricted file; show them only to faculty, counsellor and admin; never to students' peers; never on GitHub.
- Check with the college and the counsellor how long psychometric data may be kept after a student graduates and who may see it. Anonymising after a set period is one option. This is an open item.
- Demo data on GitHub must be anonymised (roll numbers plus invented names, or synthetic records).
