# Rajagiri First-Year Learning Support Program: Handoff Pack

**Read this file first.** It explains what the project is, what to build now, and where every detail lives.

- **Project owner:** Vinay (English faculty, Rajagiri School of Engineering and Technology (Autonomous), Kakkanad, Kochi)
- **Prepared:** 19 November 2026, from a planning conversation with Claude
- **Status:** Planning complete for the hackathon demo. No code has been written yet.

---

## 1. What this project is, in one paragraph

First-year B.Tech students take a diagnostic test in English and Mathematics when they join the college, plus a psychometric test recommended by the college counsellor. Through the semester they also complete assignments, alternative assessments and an internal exam. This program brings all of those results together. Faculty can see which students are weak in which topics, follow each student's progress on a graph, see their psychological profile, and download a PDF report. Students see their own marks and teacher feedback, can request a one-to-one session, browse a library of interactive HTML lessons made by faculty, and get pop-ups pointing them to the exact lessons for the topics they did poorly in.

## 2. What to build right now (faculty hackathon demo)

The owner is presenting at a faculty hackathon with only a few hours available.

**Build now:**
- **Module III: Mentor Dashboard** (faculty view)
- **Module IV: Student View**
- A simple home page with a fake "Sign in as" selector (pick a faculty member or a student) so the demo shows role-based views without real logins.

**Do not build now:**
- Module 0 (Admin), Module I (Academic data entry) and Module II (Psychometric data entry). For the demo these are replaced by Excel files the owner uploads.
- Real authentication.

**Inputs the owner will upload in this account:**
- Compiled Excel files of marks for the tests already conducted (diagnostic, assignments, AAMs, internal exam) and psychometric data.
- The interactive HTML lesson pages made by colleagues (one Math page on graph theory exists; English pages are being made).
- Reference PDFs: syllabus, assignment handout, English diagnostic test blueprint, and a whiteboard photo of the module layout.

**Hosting:** the code goes on the college's GitHub. The demo can be served with GitHub Pages.

## 3. Files in this pack

| File | What it covers |
|---|---|
| `00_README_START_HERE.md` | This overview, build order, and critical warnings |
| `01_FUNCTIONAL_SPEC.md` | Modules 0 to IV in detail: who sees what, every feature, pop-up rules, login behaviour |
| `02_DATA_SPEC_AND_TOPIC_MAP.md` | Excel format rules, workbook and tab layouts, the full syllabus topic tree, every evaluation with marks and CO, diagnostic blueprint mapping, how "weak" is calculated |
| `03_TECHNICAL_DESIGN.md` | Architecture for the demo and for real deployment, repo structure, lesson page conventions, hosting, scaling, access lifecycle, privacy |
| `04_BUILD_PLAN_AND_TESTING.md` | Step-by-step build order with acceptance checks, test checklist, user testing and feedback plan, roadmap |
| `05_DECISIONS_AND_OPEN_QUESTIONS.md` | Every decision made so far, and every question still open |

## 4. Reference implementation

A public prototype exists at `https://github.com/ramkumarpb-byte/PSYKOS` (file `OBE Learning Platform.html`, live at `https://ramkumarpb-byte.github.io/PSYKOS/OBE%20Learning%20Platform`). **Use it as a visual and structural reference only. Its workflow is not the one this project follows.**

What it is: a single self-contained HTML file (no libraries, about 160 lines) with a sidebar (Dashboard, Students, Suggestions, Student portal), a Mathematics/English toggle, CO attainment bars, KPI tiles, a student roster with filters, remedial and advanced topic suggestions, and a remedial-task loop (assign, student submits re-test score and reflection, teacher accepts or sends back).

Its limits, which this project must not repeat: all data is in memory and lost on refresh; there are no logins, so anyone can view any student; subjects, COs and topics are hard-coded (3 COs per subject); there is no PO mapping.

## 5. Critical warnings

1. **No real student data on a public site.** GitHub Pages sites are public, and so are the files in a public repo. For the demo, use anonymised or sample data (roll numbers plus made-up names). Psychometric data is the most sensitive of all. Never commit real psychometric results to GitHub.
2. **Filtering must happen on a server in production.** Hiding rows in the browser is not security. Any student could open the browser tools and see the whole class. The demo can fake this. Production must not (see `03_TECHNICAL_DESIGN.md`).
3. **Separate data access from the pages.** Write one data layer (for example `data.js` with functions like `getStudentsForClass()`, `getStudentRecord()`) so the demo can read local files now and the production version can call Google Apps Script later without rewriting the pages.
4. **Everything is driven by the topic map.** No subject, module, topic, evaluation or cut-off should be hard-coded in page logic. All of it comes from the master workbook described in `02_DATA_SPEC_AND_TOPIC_MAP.md`.
5. **Writing style for any user-facing text:** avoid em dashes and stock AI-style transitional phrases.

## 6. Suggested first steps in this account

1. Read all six files.
2. Look at the owner's uploaded Excels and compare them with `02_DATA_SPEC_AND_TOPIC_MAP.md`. List what needs reshaping and propose the converted format before building.
3. Build the master topic map and item map for the English diagnostic using the blueprint in `02_DATA_SPEC_AND_TOPIC_MAP.md`.
4. Follow the build order in `04_BUILD_PLAN_AND_TESTING.md`.
