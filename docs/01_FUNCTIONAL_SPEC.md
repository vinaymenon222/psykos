# 01 Functional Specification

## 1. Context

- **Institution:** Rajagiri School of Engineering and Technology (Autonomous), Kakkanad, Kochi
- **Students:** first-year B.Tech (Semester I/II, common to AD, AE, CE, CS, EC, EE, ME, IT)
- **Subjects in scope:** English (course 102908/EN900G, English for Engineers) and Mathematics (syllabus to be shared later)
- **Scale:** 6 to 8 classes per semester, up to 72 students per class (about 576 students per intake year); up to 6 faculty working at the same time. Data accumulates every year.

## 2. User roles

| Role | Who | Sees |
|---|---|---|
| **Admin** | The project owner (Vinay) and anyone he delegates | Everything, across all batches, including students and faculty who have left. Manages Module 0. |
| **Faculty / Mentor** | Course teachers | Only the classes assigned to them in Module 0. One tab per class. |
| **Counsellor** | College counsellor | Psychometric data; receives one-to-one session requests. Exact permissions to be confirmed. |
| **Student** | First-year students | Only their own data. |

## 3. The overall program workflow

1. Students take a diagnostic test in English and Math when they join.
2. Students take a psychometric test (tests chosen by the counsellor).
3. Results are entered into Excel / Google Sheets (Modules I and II).
4. Faculty can enter marks for a whole class, a few students, or one student, and view or edit them.
5. Faculty see graphs of each student's performance over time.
6. Faculty see each student's psychometric results.
7. Students see their own marks and feedback, can request a mentoring session on any topic, and can browse the interactive lesson repository.
8. Students get pop-ups for every topic they did poorly in, each linking directly to the matching lesson page.

## 4. Module 0: Admin / Setup

**Status:** proposed and agreed in principle. Not part of the hackathon build. Starts as a master workbook; an admin screen can come later.

Holds everything that rarely changes and that every other module reads:
- Faculty list and roles
- Classes and class student lists
- Which faculty member teaches which class
- The topic map: subject, module, topic, sub-topic, CO, lesson page link
- The evaluation list and item map (which question or column measures which topic)
- Settings: **weak cut-off = below 50%** (agreed for now), maximum number of pop-ups (to be decided), academic year
- Batch list (one marks workbook per admission batch)
- Access status for students and faculty (see section 9)

## 5. Module I: Academic data entry

**Status:** later. For the hackathon the owner supplies Excel files.

- Faculty enter marks for the initial diagnostic test and all later evaluations (assignments, tests, AAMs, internals).
- Marks can be entered for an entire class, a few students, or a single student.
- **The raw data stays in an Excel / Google Sheet maintained by faculty**, because the same file is also used to enter marks into the college portal. There is no separate database for this purpose.
- One tab per evaluation, test or assignment.
- Faculty can view and edit marks at student level or at evaluation level.
- Optional (from the whiteboard): CO attainment calculation.

## 6. Module II: Psychometric data entry

**Status:** later. For the hackathon the owner supplies an Excel file.

- The college counsellor recommends the psychometric tests to use.
- Results are kept in an Excel / Google Sheet, maintained like the academic marks.
- Faculty can view an individual student's test scores.
- Whiteboard notes for this module: login, individual, see.

## 7. Module III: Mentor Dashboard (faculty view)

**Status:** BUILD FOR HACKATHON. "Mentor Dashboard" is the proposed name; the whiteboard calls it "Faculty / Mentor view". "Student Insight Dashboard" was the alternative.

### 7.1 Layout
- On sign-in, a faculty member lands on their home page with **one tab per class they teach**. Every tab is the same dashboard, filtered to that class's students.
- Subject selection (English / Math) where a class has both.

### 7.2 Weak student list
- List of students who are weak, **grouped by topic category** (module, topic, sub-topic from the topic map).
- "Weak" = below the cut-off (50%) in that topic. See `02_DATA_SPEC_AND_TOPIC_MAP.md` section 8 for the calculation.
- Clicking a student opens their individual view.

### 7.3 Individual student view (shown once a student is selected)
- **Performance graph:** the student's performance over time, with **vertical lines marking each test or evaluation** that was conducted (diagnostic, each assignment, AAMs, internal exam). Labels on the lines show the evaluation name and date.
- **Psychological profile:** a display of the student's psychometric results, with plain-language interpretation from the counsellor's definitions.
- Marks by evaluation and by topic, with weak topics highlighted.
- Any feedback already given, and a way to add feedback (writes to the Feedback tab).

### 7.4 PDF report
- A button to generate a PDF report of everything in the individual student view: identity, marks, topic strengths and weaknesses, graph, psychological profile, feedback.

## 8. Module IV: Student View

**Status:** BUILD FOR HACKATHON.

### 8.1 Lesson repository navigation
Basic site map:

```
Home > English or Math > Modules in that subject > Topics in the selected module > Interactive HTML lesson page
```

The repository is open to every student: they can browse all lessons, not only those for their weak topics.

### 8.2 Weak-topic pop-ups (the main feature of this page)
- When a student opens their page, pop-ups appear on top of the page (a box or panel), **one pop-up per topic they did poorly in**, based on the data already recorded.
- Each pop-up links directly to that topic's interactive lesson page.
- The number of pop-ups is **capped**; the cap is still to be decided (set it in Settings, default suggestion 5, show the weakest topics first).
- Topics with no lesson page yet should still be listed but marked "lesson coming soon" rather than linking nowhere.

### 8.3 Marks
- The student sees **their marks as they are: plain numbers, no assessment, no graphs.**

### 8.4 Faculty feedback
- Shows any feedback from faculty, if there is any.

### 8.5 Request a one-to-one session
- A button to contact the faculty member or the counsellor and request a one-to-one mentoring session on any topic.
- Suggested fields: who to contact (faculty / counsellor), topic, short message. For the demo, this can open a pre-filled email or log to a Requests tab.

### 8.6 What the student never sees
- Other students' data.
- Psychometric results (shown to faculty only, unless the counsellor decides otherwise).

## 9. Login and access behaviour

- **Faculty sign-in:** lands on their home page with one tab per assigned class.
- **Student sign-in:** sees only their own data.
- **Unknown user:** access denied.
- **Students keep access for 4 years** (while in college); then access is revoked.
- **Faculty keep access until they leave.**
- **The admin retains all data permanently**, including for students who have graduated and faculty who have left. Revoking access never deletes data.
- **Hackathon demo:** a "Sign in as" dropdown replaces real login.

## 10. Original whiteboard layout (for reference)

The owner presented this layout to colleagues. Modules I to III are the faculty view; Module IV is the student view.

- **I. Input / Data:** 1. Upload Excel; 2. Individual; 3. See marks; Optional: CO attainment. Sketch shows a grid of students (A, B, C) by marks (M1, M2, M3) with tabs at the bottom for Test / Eval.
- **II. Psychometric:** 1. Login; 2. Individual; 3. See.
- **III. Faculty / Mentor view:** 1. Weak student list; 2. Individual performance; 3. Report; plus a line graph and a "PSY" panel. Arrows link the weak student list to the student's HTML page, and the report to faculty feedback.
- **IV. Student:** 1. Marks; 2. HTML page (dynamic); 3. Repository; 4. Mentor; 5. Faculty feedback.
