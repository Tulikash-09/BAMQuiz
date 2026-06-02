# BAM! Quiz

A free, fan-made statistics and machine learning study tool based on [Josh Starmer's StatQuest YouTube playlists](https://www.youtube.com/@statquest) — the best free ML and stats education on the internet.

> Fan-made study tool. Not affiliated with or endorsed by Josh Starmer or StatQuest.

## Features

- **12,600+ questions** across 50 topics (Statistics + Machine Learning)
- 3 difficulty levels: Beginner / Intermediate / Advanced
- 5 question styles: Conceptual / Calculation / Scenario / Misconception / Interpretation
- Playlist switcher: Statistics ↔ Machine Learning
- Topic explorer — drill into any of the 40 topics in the UI
- Immediate feedback with explanations
- No repeat questions within a session (sessionStorage dedup)
- Keyboard navigation — `1`–`4` to select, `Enter` to advance
- Zero runtime API dependencies — all questions are static JSON


## Setup

```bash
npm install
cp .env.local.example .env.local   # add GEMINI_API_KEY
npm run generate                    # generate both playlists (~60–90 min total)
npm run dev
```

Get a free Gemini API key at https://aistudio.google.com

## Generation

```bash
npm run generate                         # both playlists (default)
npm run generate -- --playlist=stats     # Statistics only (~35 min)
npm run generate -- --playlist=ml        # Machine Learning only (~45 min)
```

Progress is saved to `public/questions/.progress.json` after every batch — if interrupted, re-run and it skips completed batches automatically. Commit the generated JSON files; Vercel serves them as static assets (no env vars needed at deploy time).


## Deploy to Vercel

Push to GitHub → connect to Vercel → deploy. No environment variables required. Question JSON is cached for 24h via `vercel.json` headers.

## Project structure

```
app/
  page.tsx              Landing page (hero, playlist cards, topic explorer)
  quiz/
    QuizClient.tsx      Quiz UI — filters, question card, keyboard nav, finish flow
  results/
    ResultsClient.tsx   Score, topic breakdown, retake actions
components/
  HamburgerNav.tsx      Fixed top bar + full-screen menu overlay
lib/
  types.ts              TypeScript interfaces
  topics.ts             Topic definitions (20 Stats + 20 ML)
  questions.ts          Question loading, shuffling, dedup utilities
public/questions/       Statistics JSON files (20 topics)
public/questions/ml/    Machine Learning JSON files (30 generated, 20 in UI)
scripts/
  generate-questions.ts Gemini-powered bulk generator (run locally)
  create-stubs.ts       Creates empty JSON stubs before generation
```
## Contributing & Community

BAM! Quiz is open source and community contributions are welcome — 
especially question quality improvements.

### Found a bad question?
Open a [Question Quality Report](../../issues/new?template=question-quality-report.md) 
and describe the issue. Please include the exact question text, what is wrong, 
and ideally a reference to the relevant StatQuest video.

### Found a bug?
Open a [Bug Report](../../issues/new?template=bug-report.md) with steps to reproduce, 
your device, and browser.

### Want to suggest a feature?
Open a [Feature Request](../../issues/new?template=feature-request.md). 
High-quality suggestions may be picked up in future releases.

### Pull Requests
PRs are reviewed manually before merging. Please:
- Use the PR template provided
- For question fixes, cite the StatQuest video or source
- Keep PRs small and focused — one fix or feature per PR
- Do not bulk-edit question JSON files without prior discussion in an issue

All merged contributions will be credited in the changelog.


## Credits

All credit for the stats and ML education goes to **Josh Starmer** and the [StatQuest YouTube channel](https://www.youtube.com/@statquest).

- [Statistics Fundamentals playlist](https://youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9)
- [Machine Learning playlist](https://youtube.com/playlist?list=PLblh5JKOoLULU3jFkdoW4MkAbfCjCs1vU)
