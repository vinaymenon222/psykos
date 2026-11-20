# 04 Build Plan, Testing and Roadmap

## 1. Build order for the hackathon demo

Each step has a check: do not move on until it passes.

| # | Step | Done when |
|---|---|---|
| 1 | Review the owner's uploaded Excels against `02_DATA_SPEC_AND_TOPIC_MAP.md`; propose the reshaped format | Owner approves the converted layout |
| 2 | Create the master workbook: `Students`, `Faculty`, `Classes`, `Topics`, `Evaluations`, `ItemMap`, `Settings`, `PsychTests`, `Feedback` | Every evaluation column in the marks file appears in `ItemMap` |
| 3 | Convert marks and psychometric data; anonymise for the repo | No real names or real psychometric data in any committed file |
| 4 | Set up the repo structure and `js/data.js` reading the local files | `getStudentRecord('<roll>')` returns correct marks for a hand-checked student |
| 5 | Build `weak.js` | For three hand-checked students, the weak topic list matches a manual calculation at 50% |
| 6 | Home page with "Sign in as" | Choosing a faculty member opens the dashboard; choosing a student opens the student view |
| 7 | Mentor Dashboard: class tabs and weak list grouped by topic | Each faculty sees only their classes; switching tabs changes the student list |
| 8 | Individual student view: performance graph with vertical evaluation lines | One line per evaluation, labelled, in date order |
| 9 | Psychological profile panel | Scores shown with band labels from `PsychTests` |
| 10 | PDF report | Downloaded PDF contains identity, marks, weak topics, graph, psych profile, feedback |
| 11 | Lesson repository: Home > Subject > Module > Topic > page | Every lesson file in `lessons/` is reachable by clicking |
| 12 | Student view: plain marks and feedback | Numbers only, no graphs; feedback shows when present |
| 13 | Weak-topic pop-ups | One per weak topic, weakest first, capped, each opens the right lesson; "coming soon" when no page |
| 14 | Request one-to-one session button | Opens a pre-filled email or logs a request |
| 15 | Publish with GitHub Pages | Live link works on a phone and a laptop |

Visual reference: the PSYKOS page (sidebar navigation, cards, pills, light/dark support). Keep the same clean style.

## 2. Test checklist (does it work?)

- A student with 40% in articles sees an "Articles" pop-up that opens `lessons/english/module-1/articles.html` (or the matching path).
- A student above 50% in everything sees no pop-ups.
- A student marked `AB` in an evaluation is not flagged weak for that evaluation.
- Items mapped `N` (for example GK) never create pop-ups.
- Changing `WeakCutoff` in `Settings` changes the weak lists.
- Changing `PopupCap` changes the number of pop-ups.
- Faculty A cannot see Faculty B's classes.
- The student view never shows another student's data or any psychometric data.
- The performance graph has the right number of vertical lines in date order.
- The PDF opens and is readable when printed.
- Every lesson link resolves; no 404s.
- Pages work on a phone screen.

## 3. User testing and feedback plan

Three simple sources of data:

### 3.1 Watch (finds most problems quickly)
- Sit with 3 faculty and 5 or 6 students. Give each a few tasks and do not help. Note where they hesitate, go wrong, or give up, and how long each task takes.
- Faculty tasks: "Find the student weakest in grammar in your class." "Download that student's report." "Find a student whose marks dropped after the diagnostic."
- Student tasks: "Find your marks for the presentation." "Open the lesson for your weakest topic." "Ask your teacher for a one-to-one session on listening."

### 3.2 Ask
- A **Feedback button on every page** linking to a short Google Form: 1 to 5 rating, "What confused you?", "What would you add?", with the page name pre-filled.
- A five-question survey after the first few weeks of use.

### 3.3 Count (does the program actually work?)
- Do students open the lessons from their pop-ups?
- Do their marks in those topics improve in the next evaluation? This is the real measure of success.
- Each lesson page ends with "Did this help? Yes / No".
- A free, privacy-friendly visit counter can track page opens without collecting names.

## 4. Roadmap (after the hackathon)

1. Module 0 admin screen (edit the master workbook from the app).
2. Module I data entry screens (whole class, a few students, one student; view and edit by student or evaluation).
3. Module II psychometric entry and counsellor view, once the counsellor chooses tests.
4. Real login with Google Workspace and Apps Script; Shared Drive data.
5. Mathematics syllabus, topic map, diagnostic mapping and lessons.
6. Sub-criteria rubrics for the AAMs (letter, speech, data interpretation) and the report rubric.
7. Updated assignments for next semester.
8. CO attainment view (optional item from the whiteboard).
9. Remedial-to-retest loop, as in the PSYKOS prototype: assign lesson, student retests, faculty accepts, pop-up clears.
10. Mentoring request tracking (status, replies) and notifications.
11. Lesson effectiveness analytics (lesson opened vs. later marks).
12. Move to a hosted database only if scale or features demand it.

## 5. Progress tracker

Keep a simple tracker (a sheet is fine) with: Task, Module, Owner, Status (Not started / In progress / Done / Blocked), Notes, Date. Start it from the build order above.
