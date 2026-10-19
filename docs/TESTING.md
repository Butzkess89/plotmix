# Testing PlotMix

## How to run

```bash
npm ci
npx playwright install chromium   # first time only
npm run test:data   # card-data check, about 1 second
npm run test:e2e    # browser tests
```

Wrong guesses in tests are one made-up word (`zzqxwrong`), because each wrong
word costs a point.

The tests build the app (`vite build`), serve it with `vite preview` on port
4173, and drive it at the game's 402x874 phone size in Chromium and, in CI,
also in WebKit (Safari's engine, used by every iPhone browser). To run the
WebKit project locally: `npx playwright install webkit` then
`PW_WEBKIT=1 npm run test:e2e`. Clipboard tests are skipped on WebKit because
Playwright cannot grant clipboard permission there.

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
- **Daily tests pin the browser date to 2026-10-14** (`pinDailyDate` in
  `helpers.js`). The Daily card is chosen from the date, so without the pin
  a test's card changes every day. Timers still run normally.

## Known game defects found by testing (not fixed; need an owner decision)

- **Card #54 "The Green 8 Mile": naming one film solves the whole card.**
  "The Green Mile" is within the 2-character typo tolerance of the full
  mashed title, so `isMashedTitleGuess` accepts it as the complete answer.
  Found by checking every card against the matching code; reproduced in the
  browser with the date set to 2026-11-18, when #54 is the Daily card. Fixing
  it changes matching rules, so it needs approval first.

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
| Card data | Every card has the required fields; no duplicate ids, titles or film pairs; extra answers are only the real title written differently | `tests/data/deck-check.mjs` |
| Regressions | Double tap on Next applies a round once (G1); Speed Run clock runs while rewound (G3); lost card is view-only on rewind (G4); OS reduce-motion respected and animations still play without it (A2); stickers are WebP (P1) | `regressions.spec.js` |
| Owner decisions (Batch 2) | Share text ends with the game link and uses the share menu where available (#1); link-preview tags and image (#2); one film name never solves a card (#3); apostrophes ignored (#4); each wrong word costs a point, correct guesses free (#5); first Daily result kept on replay (#6); Daily rotation without repeats from 2026-11-01, earlier dates unchanged (#7); nicknames don't count as film names (#8); sound on/off remembered and silences the game (#9); fonts self-hosted, no Google request (#10); card #51 text (#11) | `batch2.spec.js` |
| Phase 3A | Typing box clear of the bottom bar on small phones and in landscape; 44x44 exit tap area; intro video under 1.5 MB; losing all hearts ends the run; Play Again starts fresh; finishing 10 cards ends with the total; 4 perfect solves give back a heart; Speed Run clock counts down and runs out | `phase3.spec.js` |

## Not covered yet

- **Speed Run timer**: only the rewind case is covered. The normal countdown
  and the pause on the result popup are not.
- **Rewind replay**: solving an earlier unsolved card after rewinding records
  nothing (no points, no streak). Found 2026-10-19; awaiting an owner decision
  on what replay should do. The suspected double streak update (G7) cannot
  happen because of this.
- **Daily rules**: same card for everyone on a given date, never the same top
  card two days running, replay after completion.
- **Matching edge cases**: typo tolerance, aliases, apostrophes ("Can't"),
  title words typed one at a time, film titles inside a longer sentence.
  These are best covered by fast unit tests, which need the matching
  functions to be importable (a separate, approved change).
- **Storage version reset** (`APP_STORAGE_VERSION`) and old-save rejection.
- **Content quality** (facts, alias quality, wording). The data check covers
  structure and duplicates only.
- **Visuals**: animations, stickers, video, layout and screenshots. The intro
  video and stickers are not checked to actually play.
- **Other browsers**: Firefox is untested. WebKit runs in CI, but it is not
  the same as Safari on a real iPhone (no on-screen keyboard, no real share
  menu or sound output).
