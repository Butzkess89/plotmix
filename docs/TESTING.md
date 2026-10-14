# Testing PlotMix

## How to run

```bash
npm ci
npx playwright install chromium   # first time only
npm run test:e2e
```

The tests build the app (`vite build`), serve it with `vite preview` on port
4173, and drive it in Chromium at the game's 402x874 phone size.

GitHub Actions runs the build and the full suite on every pull request
(`.github/workflows/ci.yml`). If it fails, the Playwright report with
screenshots and traces is attached to the run as `playwright-report`.

## Approach

- **End-to-end only, no changes to `PlotMix.jsx`.** Tests use the
  accessible labels already in the app (for example "Movie title guess",
  "Open hints", "Skip card") and read the game's own autosave in
  `localStorage` (`plotmix_save_v2`) to know the current card and check
  results.
- **Tests describe today's behaviour.** A failing test means behaviour
  changed. If the change was intended, update the test in the same pull
  request and say so. Never change gameplay rules to make a test pass.
- **Google Fonts requests are blocked in tests** so results don't depend on
  the network. Fonts are cosmetic and not under test.

## What is covered

| Area | Test | File |
|---|---|---|
| App loads | First visit: intro -> onboarding -> menu, no page errors, onboarding remembered | `smoke.spec.js` |
| Game modes | Daily, Standard and Speed Run each start with 10 points, 6 hearts, correct deck size, no duplicate film pairs | `smoke.spec.js` |
| Game modes | Daily has no Skip button; Standard does | `smoke.spec.js` |
| Guessing | Naming both films separately solves the card for 10 points (Daily), and records the daily result | `gameplay.spec.js` |
| Guessing | Full mashed title solves in one guess | `gameplay.spec.js` |
| Scoring | Wrong guess -1 point; guess history saved | `gameplay.spec.js` |
| Scoring | 6 wrong guesses lose the card: 0 points, input disabled, -1 heart | `gameplay.spec.js` |
| Hints | Year & Genre -1, Lead Actors -3, content shown, cannot buy twice, hints recorded | `gameplay.spec.js` |
| Skipping | Skip scores 0, -1 heart, moves to next card | `gameplay.spec.js` |
| Saving | Game survives a reload and resumes on the same card with the same guesses | `gameplay.spec.js` |
| Saving | Exit to menu discards the save | `gameplay.spec.js` |
| Sharing | Copy puts the exact summary text on the clipboard | `gameplay.spec.js` |

## Not covered yet

- **Speed Run timer**: countdown, timeout ending the card, timer pause on the
  result popup. Needs Playwright's fake clock.
- **Rewind**: revisiting earlier cards, view-only rules, and the two
  suspected bugs from the audit (a card lost to 6 wrong guesses can be
  rewound but not played; a Speed Run timeout while rewound).
- **Bonus heart** after 4 perfect solves in a row.
- **Run endings**: losing all hearts, the end screen chips for a full
  10-card run, Play Again.
- **Daily rules**: same card for everyone on a given date, never the same top
  card two days running, replay after completion.
- **Matching edge cases**: typo tolerance, aliases, apostrophes ("Can't"),
  title words typed one at a time, film titles inside a longer sentence.
  These are best covered by fast unit tests, which need the matching
  functions to be importable (a separate, approved change).
- **Storage version reset** (`APP_STORAGE_VERSION`) and old-save rejection.
- **Content checks** on the card deck (duplicate cards #51/#69 exist today).
- **Visuals**: animations, stickers, video, layout and screenshots. The intro
  video and stickers are not checked to actually play.
- **Other browsers**: only Chromium runs; Safari/WebKit and Firefox are untested.
