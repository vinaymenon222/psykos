# 05 Decisions and Open Questions

## 1. Decisions made

| # | Decision | Source |
|---|---|---|
| D1 | The program has five modules: **0 Admin/Setup, I Academic data entry, II Psychometric data entry, III Mentor Dashboard (faculty view), IV Student View** | Owner; Module 0 proposed by Claude and agreed |
| D2 | **Hackathon scope: build Modules III and IV only.** Modules 0, I and II come later; Excel files stand in for them now | Owner |
| D3 | Code is written in a separate (temporary) Claude account and hosted on the **college's GitHub** | Owner |
| D4 | Colleagues are making the interactive HTML lesson pages for the demo | Owner |
| D5 | The PSYKOS "OBE Learning Platform" page is a **reference point only**; its workflow is not followed | Owner |
| D6 | Raw marks stay in **Excel / Google Sheets maintained by faculty** (also used for the college portal); no separate database for now | Owner |
| D7 | **One tab per evaluation**; marks can be entered for a whole class, a few students or one student; viewable and editable by student or by evaluation | Owner |
| D8 | Psychometric tests are recommended by the **college counsellor**; results kept in Excel like the marks | Owner |
| D9 | **Weak cut-off: below 50%** (adjustable later in Module 0) | Owner |
| D10 | Pop-ups: **one per weak topic**, each linking to its lesson page, **capped** at a number to be decided | Owner |
| D11 | Student View shows marks **as they are: no assessment, no graphs** | Owner |
| D12 | Lesson navigation: **Home > English/Math > Modules > Topics > HTML page** | Owner |
| D13 | Mentor Dashboard: weak students grouped by topic; on selecting a student, a performance graph with **vertical lines for each evaluation**, the **psychological profile**, and a **PDF report** | Owner |
| D14 | Faculty home shows **one tab per class taught**; every tab works the same with a different student set | Owner |
| D15 | A student login shows **only that student's data** | Owner |
| D16 | Hosting direction: **Google Sheets + Google Apps Script now**; move to a free database (for example Supabase) later only if required | Owner, on Claude's recommendation |
| D17 | Students keep access for **4 years**, then access is revoked; faculty keep access until they leave; **the admin retains all data** | Owner |
| D18 | **Only one internal exam** was conducted; the owner will map it to topics. The **AAMs (50 marks) count as the second internal**, converted to 20 marks | Owner |
| D19 | AAMs: Letter writing 15, Speech 15 (3-minute individual speech on stage), Data interpretation 20 (descriptive paragraph this semester). No breakdown yet | Owner |
| D20 | Current assignments (Reading 10, Listening 10, Presentation 15, Report 15) are used for now; **assignments will change next semester** | Owner |
| D21 | Every mark column and question must be **mapped to a topic or sub-topic** | Owner |
| D22 | Math: only one lesson page exists (**graph theory**); syllabus to come later | Owner |
| D23 | Demo uses a fake **"Sign in as"** selector and anonymised data | Claude recommendation, consistent with owner's scope |
| D24 | One marks workbook and one psychometric workbook **per admission batch**; one master workbook | Claude recommendation, accepted in planning |
| D25 | Data files go in a **Shared Drive owned by the college/department**, not a personal Drive | Claude recommendation |
| D26 | Module III name: **"Mentor Dashboard"** (proposed; alternative "Student Insight Dashboard") | Claude proposal, not yet confirmed |

## 2. Open questions

| # | Question | Why it matters | Suggested default |
|---|---|---|---|
| Q1 | Does Rajagiri use **Google Workspace** for staff and student emails? | The whole login plan depends on it | Confirm before production; demo unaffected |
| Q2 | Weak rule: **latest evaluation** covering a topic, or **all evaluations combined**? | Decides when pop-ups disappear | Latest |
| Q3 | **Pop-up cap**: how many? | Too many pop-ups overwhelm students | 5, weakest first |
| Q4 | Exact **AAM conversion**: how do the 50 AAM marks become 20, and how does that combine with Internal 1 into the 40-mark internal component? | Correct totals for the portal | Confirm with owner |
| Q5 | **CO mapping for the AAMs** (letter, speech, data interpretation) | CO attainment later | Letter CO6?, Speech CO6, Data interpretation CO3 (confirm) |
| Q6 | **Diagnostic question-number to sub-topic mapping** (blueprint gives counts, not question numbers) | Needed to build `ItemMap` | Take from the owner's Excel or question paper |
| Q7 | Do the Reading and Listening tests have **per-question scores** in Google Forms? | Finer topic detail for free | Use them if available |
| Q8 | **Presentation report rubric** (blank page in the handout PDF) | Criterion-level detail for writing | Total only until available |
| Q9 | Which **psychometric tests** will the counsellor choose, and how should results be interpreted for faculty? | Defines Module II and the profile panel | Placeholder scales for the demo |
| Q10 | **Math syllabus**, Math diagnostic structure and topic map | Math side of everything | Placeholder with graph theory |
| Q11 | **Retention policy** for psychometric data after graduation, and who may see it | Privacy and compliance | Ask the college and counsellor |
| Q12 | Who receives **one-to-one requests**: course faculty, counsellor, or the student's choice? How are they delivered? | Request button behaviour | Student chooses; demo uses email |
| Q13 | Can **counsellors** see academic marks? Can **students** ever see their own psychometric results? | Role permissions | No to both until decided |
| Q14 | Confirm the **Module III name** | Labels in the UI | Mentor Dashboard |
| Q15 | Handout inconsistency: plagiarism/AI limit is **40%** in the rules but **50% / 30%** in the report format table | Only matters if the report is auto-checked | Note only |
