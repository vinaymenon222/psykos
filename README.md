# PSY:KOS: First-Year Learning Support (demo)

Rajagiri School of Engineering and Technology. A demo of Module III (Mentor Dashboard) and Module IV (Student View).

**Live site:** published with GitHub Pages from the `main` branch.

## What is here

| Path | What it is |
|---|---|
| `index.html` | Landing page with a demo "sign in as" (no real login) |
| `mentor.html` | Mentor Dashboard: class tabs, class overview, student report, PDF |
| `student.html` | Student Dashboard: topics to revisit, marks, feedback, one-to-one request |
| `lessons.html` | Lesson library: Home > Subject > Module > Topic > lesson page |
| `lessons/` | Interactive lesson pages, one file per topic |
| `data/` | Demo Excel files (anonymised: joke names and demo roll numbers) |
| `js/data.js` | All data access. Replace with Apps Script calls for production |
| `js/weak.js` | Weak-topic calculation |
| `docs/` | Planning handoff pack |

## Updating the demo

- **Marks:** replace `data/marks_batch2026.xlsx` (same tab and column layout). The site updates within a minute or two.
- **Settings:** change `WeakCutoff`, `PopupCap` or `WeakRule` in the `Settings` tab of `data/master.xlsx`.
- **Adding a lesson:** put the HTML file in `lessons/<subject>/module-<n>/<topic-slug>.html`, then add its path to the `LessonPage` column of the `Topics` tab in `data/master.xlsx`.

## Privacy

Everything in this repository is public. Never commit real names, real roll numbers, emails or real psychometric results. The file that links demo roll numbers to real students is kept offline by the project owner.

## Running locally

The pages read the Excel files, so they must be served over http, not opened by double-clicking:

```
python -m http.server 8000
```

Then open http://localhost:8000.

Uses [SheetJS](https://sheetjs.com) (Apache 2.0, in `vendor/`) and the Lexend font from Google Fonts.
