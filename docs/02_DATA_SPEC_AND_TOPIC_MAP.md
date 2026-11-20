# 02 Data Specification and Topic Map

The guiding rule: **every sheet must be readable by a person and by the program, without anyone having to explain it.**

The owner has already conducted all tests and compiled Excel files. Those files need reshaping into the format below. **First task: compare the uploaded Excels with this spec and propose the conversion before building.**

---

## 1. Ground rules for every sheet

1. **Roll number is the key.** Every row is identified by roll number (or university ID). Never use names as identifiers.
2. **Row 1 holds headers; every row after it is exactly one student.** No merged cells, titles, blank rows, or totals rows above or below the data.
3. **One tab per evaluation**, named with a short ID (for example `DIAG26`, `READ`, `LIST`, `PRES`, `REPT`, `AAM`, `INT1`).
4. **Each mark column header is a short item ID** (for example `G01`, `V07`, `EyeContact`), not text like "Q1 (2 marks)".
5. **Absent is not zero.** Use `AB` for absent. Leave a cell blank only if the mark has not been entered yet. Absent and blank cells are excluded from calculations.
6. **Extra columns are allowed** (totals, portal columns). The program reads only the columns listed in `ItemMap` and ignores the rest.
7. Max marks, topic mapping and conversion rules live in the master workbook, not in the marks tabs.

## 2. Workbook structure

| Workbook | Scope | Notes |
|---|---|---|
| **Master** (Module 0) | One for the whole program | Faculty, classes, topic map, evaluations, item map, settings, batches |
| **Marks: Batch YYYY** | One per admission batch | All evaluations for that batch, one tab per evaluation |
| **Psychometric: Batch YYYY** | One per admission batch | Most restricted file |

A new academic year means copying a blank template, renaming it (for example `Batch 2027`), and adding a row to `Batches`. Nothing else changes.

## 3. Master workbook tabs

| Tab | Columns |
|---|---|
| `Students` | RollNo, Name, Class, Batch, Email, Status (Active / Graduated / Left), AccessUntil |
| `Faculty` | FacultyID, Name, Email, Role (faculty / counsellor / admin), Status (Active / Left) |
| `Classes` | Class, Batch, Subject, FacultyID |
| `Topics` | Subject, ModuleNo, Module, Topic, Subtopic, CO, LessonPage |
| `Evaluations` | EvalID, Name, Type (diagnostic / assignment / AAM / internal), Subject, Date, MaxMarks, ScaleTo, Notes |
| `ItemMap` | EvalID, ItemID, MaxMarks, Subject, Module, Topic, Subtopic, CO, Difficulty, Mapped (Y/N) |
| `Settings` | WeakCutoff (50%), PopupCap (to be decided), AcademicYear, WeakRule (latest / combined) |
| `Batches` | Batch, MarksFile, PsychFile |
| `PsychTests` | TestID, Scale, MinScore, MaxScore, Bands (for example 0 to 10 Low), FacultyDescription |
| `Feedback` | RollNo, Date, FacultyID, Subject, Topic, Comment (could live in the batch marks file instead) |
| `Requests` | RollNo, Date, To (faculty / counsellor), Topic, Message, Status (later) |

Example `ItemMap` rows:

| EvalID | ItemID | Max | Topic | Subtopic | Mapped |
|---|---|---|---|---|---|
| DIAG26 | G01 | 1 | Grammar | Subject-verb agreement | Y |
| DIAG26 | K05 | 1 | General knowledge | | N |
| PRES | Language | 2 | Speaking | Language and fluency | Y |
| AAM | Letter | 15 | Writing | Letter writing | Y |

Items with `Mapped = N` still appear in marks but **never trigger a pop-up or a weak flag**.

## 4. Marks workbook layout (per batch)

One tab per evaluation:

| RollNo | Name | G01 | G02 | ... | V20 | L01 | ... |
|---|---|---|---|---|---|---|---|
| 26CS001 | Riya | 1 | 0 | ... | 1 | AB | ... |

How each evaluation is recorded:

| Evaluation | Columns |
|---|---|
| Diagnostic (English) | One column per question, 100 columns, each 1 or 0 |
| Diagnostic (Math) | To be defined when the Math blueprint is shared |
| Reading test | One total column for now; per-question columns if Google Forms provides them |
| Listening test | One total column for now; per-question columns if Google Forms provides them |
| Presentation | The 10 rubric criteria as columns (see section 6.2) |
| Presentation report | One total column until the rubric is available |
| AAM | Three columns: `Letter`, `Speech`, `DataInterp` |
| Internal exam 1 | One column per question, mapped in `ItemMap` |

## 5. Psychometric workbook (per batch)

- One tab per psychometric test: RollNo, then one column per scale score.
- Each scale is defined in the master `PsychTests` tab by the counsellor: name, range, interpretation bands, and a plain-language description for faculty.
- **The tests themselves are not yet chosen** (the counsellor will recommend them).

## 6. Evaluation catalogue (English, 102908/EN900G)

### 6.1 Course facts
- **Course:** 102908/EN900G English for Engineers. L 2, T 0, P 2. Credit: Pass/Fail. Introduced 2023. Syllabus for 2026 admissions.
- **CIE mark distribution (syllabus):** Attendance 10, Internal examination 40 (average of two scores), Assignment / Quiz / Course project 50. Total 100. **No end-semester exam.**
- **Internal exam pattern (syllabus), each out of 50:** Remember 15, Understand 15, Apply 20.
- **What actually happened this semester (owner):** only **one internal exam** was conducted. The owner will map its questions to topics and add it. The **AAMs (50 marks) stand in for the second internal exam**, converted to 20 marks. The exact conversion into the internal component is still to be confirmed (see `05_DECISIONS_AND_OPEN_QUESTIONS.md`).
- **Assignments will change next semester.** For now, use the current set below.

### 6.2 All evaluations

| EvalID | Evaluation | Marks | CO | Bloom level | Syllabus module and topic | Detail available |
|---|---|---|---|---|---|---|
| DIAG26 | English diagnostic test | 100 | see 6.3 | | Module 1, 2, 4 (see 6.3) | Per question |
| READ | Reading test | 10 | CO3 | C2 | M2 Reading: techniques, comprehension, inference | Total only |
| LIST | Listening test | 10 | CO5 | C2 | M4 Listening: strategies | Total only |
| PRES | Presentation | 15 | CO6 | C3 | M3 Speaking: presentation skills | 10 rubric criteria |
| REPT | Presentation report | 15 | CO4 | C2 | M5 Writing: reports, abstracts, referencing, summarising | Total only (rubric page blank in handout PDF) |
| AAM | Alternative assessment methods | 50 (scaled to 20) | to confirm | | see below | Three totals |
| INT1 | Internal exam 1 | 50 | to map | R/U/A | to map | Per question (owner to map) |

**Assignment details (from the handout):**
- **Reading test (10):** four excerpts of varying difficulty, each followed by MCQs on main ideas, supporting details, vocabulary, inference and critical thinking. In the language lab, about 2 hours, submitted via Google Forms.
- **Listening test (10):** four audio excerpts of varying difficulty with MCQs. Language lab, about 2 hours, Google Forms.
- **Presentation (15):** 5 to 7 minutes. PPT with title slide (topic, name, class, roll number), introduction, body, conclusion, works cited (minimum 3 sources, books and web, IEEE style). No plagiarism. Uploaded to Google Classroom.
- **Presentation report (15):** formal typed report on the presentation topic, 8 to 10 pages, Times New Roman 12 pt (headings 14 pt bold), 1.5 spacing, 1 inch margins, justified, page numbers bottom right. Turnitin plagiarism and AI check required, below 40% for both (over 40% gets zero). Two-phase submission. Sections: title page, acknowledgement, table of contents, abstract, introduction, body, conclusion, references (at least 5, one from a book, IEEE). Note: the handout's report format table states plagiarism below 50% and AI below 30% for the attached Turnitin report, which conflicts with the 40% rule elsewhere in the same handout.

**Presentation rubric (15 marks):**

| Group | Criterion (ItemID) | Weight | Proficient | Acceptable | Needs improvement | Maps to |
|---|---|---|---|---|---|---|
| Body language | Eye contact (`EyeContact`) | 1 | 1 | 0.75 | 0.5 | M3 Verbal and non-verbal behaviour |
| Body language | Posture and gestures (`Posture`) | 1 | 1 | 0.75 | 0.5 | M3 Verbal and non-verbal behaviour |
| Content | Structure (`Structure`) | 2 | 2 | 1.5 | 1 | M3 Presentation skills |
| Content | Depth (`Depth`) | 2 | 2 | 1.5 | 1 | M3 Presentation skills |
| Delivery | Voice and clarity (`Voice`) | 2 | 2 | 1.5 | 1 | M3 Pronunciation, stress, intonation |
| Delivery | Subject clarity (`SubjectClarity`) | 2 | 2 | 1.5 | 1 | M3 Delivering a presentation |
| Delivery | Language and fluency (`Language`) | 2 | 2 | 1.5 | 1 | M3 Speaking; also signals M1 grammar |
| Slides | Colour and font choice (`Colour`) | 1 | 1 | 0.75 | 0.5 | M3 Effective slide presentation |
| Slides | Consistency (`Consistency`) | 1 | 1 | 0.75 | 0.5 | M3 Effective slide presentation |
| Slides | Elements / components (`Elements`) | 1 | 1 | 0.75 | 0.5 | M3 Effective slide presentation |

**Alternative assessment methods (AAM), 50 marks total, converted to 20:**

| ItemID | Task | Marks | Description | Proposed mapping |
|---|---|---|---|---|
| `Letter` | Letter writing | 15 | Formal letter | M5 Letter writing and e-mail |
| `Speech` | Speech | 15 | Every student gives an individual 3-minute speech on stage | M3 Speaking in different contexts |
| `DataInterp` | Data interpretation | 20 | One or two tables and graphs; students answer a question or an MCQ. This semester it was a descriptive paragraph. | M2 Interpreting charts and data (CO3) |

No sub-criteria breakdown exists for the AAMs yet.

### 6.3 English diagnostic test blueprint (2026)

S1 B.Tech (common). 100 questions, **1 mark each**, five sections of 20. Sub-topics mapped to Module 1 of the syllabus.

| Section | Qs | Content | Syllabus mapping | Difficulty |
|---|---|---|---|---|
| 1. General knowledge | 20 | Kerala general facts (5); India, civics and politics (5); World facts, culture, pop culture (10) | **Not mapped** (no syllabus topic) | Not specified |
| 2. Vocabulary | 20 | Application-level (10), other question types (10) | Common words: meaning, synonyms/antonyms, idioms, analogy, confusables, usage (10); commonly misspelt words (6); foreign words (1). **3 unmapped:** apostrophe use, adjective order, punctuation (grammar-type items) | Easy 4, Medium 12, Difficult 4 |
| 3. Grammar | 20 | All application-level | Subject-verb agreement (6); parts of speech: prepositions (3), pronoun case (1); tenses (1, future perfect only); articles (1); voices (1); reported speech (1). **6 unmapped:** subjunctive, conditional, its/it's | Easy 4, Medium 12, Difficult 4 |
| 4. Listening | 20 | Nehru, "Tryst with Destiny" (8); YouTube video on the Great Fire of London (7); TED-Ed video on Chandigarh (5) | M4 Listening (section level) | Nehru: Difficult (8); Fire of London: Easy (7, longest clip); Chandigarh: Easy (5) |
| 5. Reading comprehension | 20 | Pop-science passage on the "nerd" scientist stereotype (10); pop-science passage on Smilodons (10) | M2 Reading (section level) | Moderate |

**Syllabus grammar topics not tested by the diagnostic:** modals, sentence structure. **Partly covered:** parts of speech (only prepositions and pronoun case), tenses (only future perfect).

**Suggested CO links for the diagnostic:** Vocabulary → CO1; Grammar → CO2; Reading → CO3; Listening → CO5; GK → none.

**The question-number to sub-topic mapping is not in the blueprint.** The owner's Excel or the question paper must supply which question number belongs to which sub-topic before `ItemMap` can be completed.

## 7. Topic map: English (102908/EN900G)

### 7.1 Course outcomes
- **CO1:** Use contextually appropriate vocabulary
- **CO2:** Construct grammatically correct and error-free sentences
- **CO3:** Analyse, interpret and infer data from a variety of textual matter by employing appropriate reading techniques
- **CO4:** Effectively summarise technical / non-technical content
- **CO5:** Receive and respond to aural content by using contextually appropriate listening styles
- **CO6:** Use eloquent language in their daily and professional life and also exhibit suitable non-verbal behaviour in different contexts

CO to PO mapping (syllabus): CO1 PO9 3, PO11 2; CO2 PO9 3, PO11 2; CO3 PO9 3, PO11 3; CO4 PO9 3, PO11 1; CO5 PO2 1, PO8 2, PO9 3; CO6 PO6 2, PO8 2, PO9 3, PO11 3. (Column alignment in the PDF was read from extracted text; verify against the original.)

### 7.2 Modules and topics (from the syllabus)

**Module 1: Vocabulary and Grammar**
- Vocabulary: Academic Word List (AWL); foreign words; semantics (synonyms, antonyms, one-word substitution); phrasal verbs; phrases and idioms; misspelt words
- Grammar: parts of speech; subject-verb agreement; tenses; articles; voices; reported speech; modals; sentence structure

**Module 2: Reading and Comprehension**
- Four reading techniques: scanning, skimming, intensive reading, extensive reading
- Fiction and non-fiction texts: difference, features, strategies, comprehension
- Strategies for reading general and professional content; identifying transitions in a text; note making
- Interpreting charts and data
- Academic reading: PQRST, SQ3R, KWL chart; critical reading; identifying credible sources; effective use of resources (index, table of contents, glossary)

**Module 3: Speaking**
- Importance of oral communication; phonetics: pronunciation, stress and intonation
- Speaking in different contexts: verbal and non-verbal behaviour
- Presentation skills: types (informative, persuasive, business); effective slide presentation; delivering a presentation
- Classroom participation: lectures, seminars, discussions, debates, group activities

**Module 4: Listening**
- Listening: types, purpose, barriers
- Strategies for effective listening in various contexts; note-taking as a tool for listening
- Dialects, accents and slang; dialectical varieties; English in India

**Module 5: Writing**
- Importance of written communication; stages in the writing process
- Letter writing and e-mail: letters and emails for various purposes
- Reporting / reports; introduction to abstracts and articles; difference between abstract and executive summary
- Summarising; paraphrasing; synthesising; editing and proofreading
- Plagiarism; referencing online and offline resources; formatting basics

### 7.3 Lesson page link convention
Each sub-topic row in `Topics` has a `LessonPage` path, for example:

```
lessons/english/module-1/subject-verb-agreement.html
```

See `03_TECHNICAL_DESIGN.md` for the naming rules.

## 8. Topic map: Mathematics

- **Syllabus not yet provided.** The owner will share it later.
- A Math diagnostic test has been conducted; its Excel will be uploaded.
- One interactive lesson page exists: **graph theory**.
- Until the syllabus arrives, create a placeholder Math branch in `Topics` with graph theory as its only lesson.

## 9. How "weak" is calculated

1. For each student and each mapped topic or sub-topic, add up marks scored and marks possible across the items mapped to it (absent and blank items excluded).
2. Percentage = scored / possible.
3. **Weak if the percentage is below 50%** (the `WeakCutoff` setting).
4. Granularity varies by evaluation:
   - **Diagnostic:** sub-topic level (for example "Subject-verb agreement").
   - **Presentation:** criterion level (for example "Effective slide presentation").
   - **Everything else:** whole-evaluation level, mapped to a broader topic (for example "Writing: letters", "Listening").
5. **Open decision:** use only the **latest** evaluation covering a topic, or **all evaluations combined**. Recommendation: latest, so a student who improves sees the pop-up disappear (which also rewards using the lessons). Make this a setting (`WeakRule`).
6. Pop-up order: weakest first, up to `PopupCap`.
