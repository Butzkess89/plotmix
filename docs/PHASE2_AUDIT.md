# PlotMix – Phase 2 Product and Technical Audit

**Date:** 2026-10-15 · **Audited commit:** `main` @ `3bdb18f` (game code identical to baseline `b01ebc7`)
**Scope:** read-only audit. No game code was changed. Exploratory browser checks were run locally and not committed.

Severity: **Critical** (wrong results or lost progress for normal players) · **High** · **Medium** · **Low**
Effort: **S** = under half a day · **M** = 1–3 days · **L** = more than 3 days
Evidence: **Confirmed** (reproduced in a browser or by running the game's own code) · **Code** (read in source, not reproduced) · **Unverified**

---

## 1. Project state (verified 2026-10-15)

| Item | State |
|---|---|
| `main` | `3bdb18f`, merge of PR #2; CI passed on it |
| Required check | "Build and end-to-end tests" is required by a **classic branch protection rule**, with enforcement `non_admins`: **repo admins can still merge with failing tests** |
| Ruleset "Protect main." | Active: blocks deletion and force-push, requires a PR (0 approvals) |
| Production | Both Vercel projects (`plotmix-app` and `plotmix`) deployed `3bdb18f` to production successfully |
| PR #1 | Closed without merging; branch `test/vercel-preview-check` kept |
| Baseline | Release `baseline-2026-10-14` → `b01ebc7` |

### Backup requirement (still open)

- **Exists on GitHub:** the baseline release, plus the source archive GitHub generates for it.
- **Not on GitHub:** a git bundle (`plotmix-baseline-2026-10-14.bundle`, SHA-256 `cfbb293a…2e8134d`) was sent to the owner on 2026-10-14. Its storage outside GitHub has **not been confirmed**.
- **Required:** keep one copy of the full history outside GitHub (for example Google Drive) and refresh it after each release. Command: `git clone --mirror https://github.com/Butzkess89/plotmix.git` then `git bundle create plotmix-YYYY-MM-DD.bundle --all`.
- **Vercel history:** it lists about 40 production deployments (May–July 2026) from commits that no longer exist in the git history. Treat Vercel Instant Rollback, not git, as the only way back to those versions.

---

## 2. Findings

### 2.1 Gameplay bugs

| ID | Finding | Severity | Player impact | Effort | Evidence |
|---|---|---|---|---|---|
| G1 | **Double-tapping "Next" applies the round result twice.** After a win, a 10-point card scores 20 and the streak goes up by 2. After a loss, the player loses 2 hearts instead of 1. Cause: the result handler has no guard against a second tap while the 190 ms card transition runs. | **Critical** | Inflated scores (and shared results); unfair game-overs on phones, where double taps are common | S | Confirmed (`dblclick` / double tap) |
| G2 | **Card #54 "The Green 8 Mile": typing "The Green Mile" alone solves the whole card.** It is within the 2-character typo tolerance of the full mashed title. | High | Free full-score solve on that card; next Daily occurrence is 2026-11-18 | S–M (matching rule) | Confirmed |
| G3 | **Speed Run clock freezes while you view a solved earlier card** (rewind). 120 s spent rewound cost 1 s. | Medium | Unlimited thinking time in a timed mode | S | Confirmed |
| G4 | A card lost to 6 wrong guesses can be rewound to. It shows "PTS: 4" but the input is disabled. | Low | Confusing; looks playable but isn't | S | Confirmed |
| G5 | Titles with apostrophes ("Can't") split into two words, so typing every title word one at a time doesn't complete the title unless the player also types "t". | Medium | Correct players not credited on some cards | S | Confirmed (game code) |
| G6 | Typing any word that appears in the mashed title never counts as a wrong guess. 87 of 95 cards can be solved for full points by trying words one at a time. | Medium (**design decision**) | Lowers challenge; weakens scoring | S once decided | Confirmed (game code) |
| G7 | The all-time streak is updated again when a rewound card is replayed (and twice by G1). | Low | Inflated streak | S | Code |
| G8 | Daily can be replayed without limit and each replay overwrites the stored result. | Low (**design decision**) | Daily score not "once a day" | S | Code |
| G9 | **Daily cards repeat often.** Each date is an independent shuffle: over the next 365 days there are 273 repeats, the shortest gap between repeats is 2 days, and 2 cards never appear. | Medium | Daily players see the same puzzle again within days | S (a fixed schedule) – changes which card shows on each date, so needs a decision | Confirmed (simulated with game code) |
| G10 | **A fully revealed title could stay unsolved.** The tiles reveal title words typed several at a time ("The Nightmare", "Before Christmas"), but completion only counted words typed one per guess. The screen showed the answer and the game could not be finished. Found by the owner on the Daily, 2026-10-15. | **High** | Players stuck with no way to finish the card | S | Confirmed; **fixed in PR #4** |

### 2.2 Content

| ID | Finding | Severity | Effort |
|---|---|---|---|
| C1 | Cards #51 and #69 are duplicates ("The Fault in Our Star Wars"). The game hides one at runtime, so 94 cards are playable, not 95. | Low | S |
| C2 | Some aliases are too loose: "kubrick" counts as the title *2001: A Space Odyssey*. Needs an alias review across the deck. | Low–Medium | S–M |
| C3 | Era balance of the 190 source films: 1990s 39, 2000s 66, 2010s 36, 2020s **5**, pre-1970 15. Few recent films. | Info | Content work |
| C4 | Content size: 94 cards supports about 9 Standard runs before repeats dominate. Content growth is the main limit on replay value. | Info | L (ongoing) |

### 2.3 Performance

| ID | Finding | Severity | Effort |
|---|---|---|---|
| P1 | **5.2 MB is downloaded before the menu appears:** intro video 2.5 MB, `Happy.png` 1.66 MB (displayed about 180 px tall), JavaScript 1.06 MB (295 KB compressed). | High (slow first load on mobile data) | S for the three PNG stickers: measured 5.06 MB → 0.12 MB as WebP at 2× display size (−98%); M for the video |
| P2 | About 33 MB of files in `public/` are never used, but are deployed and stored in the repo. | Low | S |
| P3 | Fonts load from Google, while the self-hosted copies in `public/fonts` are unused. Commit `b0c9b9f` ("self-host fonts for reliable mobile rendering") was undone by a later commit. | Medium (mobile rendering, privacy) | S |
| P4 | Sticker videos are green-screened in JavaScript by reading every pixel of every frame (`ChromaKeyVideo`). Likely heavy on low-end phones. | Medium | M (pre-rendered transparent video/WebP) – Unverified, needs a device test |

### 2.4 Security and dependencies

| ID | Finding | Severity | Effort |
|---|---|---|---|
| S1 | Production dependencies: **0 known vulnerabilities** (`npm audit --omit=dev`). | – | – |
| S2 | Development-only dependencies: 4 advisories (vite ≤6.4.2, esbuild ≤0.24.2, nanoid, source-map-js). These affect the local dev server, not the deployed site. The fix needs a Vite major upgrade. | Low | M (separate PR, full test run) |
| S3 | No security headers or Content Security Policy (no `vercel.json`). `lottie-web` uses `eval`, so a strict CSP would need a different lottie build. | Low | M |
| S4 | `dangerouslySetInnerHTML` is used twice, with fixed built-in SVG only. No player input is rendered as HTML. | Info (OK) | – |
| S5 | Scores live only in the player's browser and can be edited by that player. Acceptable while there are no leaderboards; must change before any prizes or leaderboards. | Info | – |
| S6 | Admins can bypass the required CI check (see section 1). | Low | Owner setting |

### 2.5 Accessibility and mobile

| ID | Finding | Severity | Effort |
|---|---|---|---|
| A1 | Good: every button has an accessible name, images have `alt`, `lang="en"`, and the keyboard reaches the mode buttons. | – | – |
| A2 | The OS "reduce motion" setting is ignored (`reducedMotion={false}` is hard-coded), although the game already supports reduced motion internally. | Medium | S |
| A3 | No way to turn sound off. | Medium | S |
| A4 | Not yet checked: colour contrast, the screen-reader experience on the SVG-art screens, focus visibility. | Unverified | S (manual check) |
| A5 | Real-device checks are not possible from the audit environment (`*.vercel.app` is blocked). The game is laid out on a fixed 402×874 frame and scaled; small phones, landscape and on-screen keyboard behaviour need owner testing. | Unverified | Owner, about 30 minutes |

### 2.6 Growth and discoverability

| ID | Finding | Severity | Effort |
|---|---|---|---|
| D1 | **The share text has no link to the game.** A shared result cannot bring a friend back. | High (growth) | S (product decision on wording) |
| D2 | No meta description or social-preview (Open Graph) tags. Links shared on WhatsApp, X etc. show no image or description. | Medium | S |
| D3 | Two production sites (`plotmix-app` and `plotmix`) dilute search ranking and analytics. | Medium | Owner setting |

### 2.7 Architecture and code health

| ID | Finding | Severity | Effort |
|---|---|---|---|
| R1 | One 4,972-line file holds content, rules, storage, sound and every screen. Game rules are computed inside the screen code, and three separate handlers end a round, each with its own copy of the scoring logic (the root cause of G1 and G7). | Medium (slows every change, raises risk) | M–L, incremental |
| R2 | Dead code: 11 unused components/handlers and 6 unused logic helpers (listed in the original audit). | Low | S |
| R3 | Changing `APP_STORAGE_VERSION` wipes every player's saved games and Daily history on their next visit. | Medium (release risk) | Documented rule |
| R4 | Outdated comments (an old "1000 points" scoring description; the green-screen comment says "near-black"). | Low | S |

### 2.8 Test coverage gaps

Covered today: 14 browser tests (see `docs/TESTING.md`). Highest-value gaps, in order:
1. Double-tap / repeated input on result buttons (G1).
2. Speed Run timer, including rewind (G3).
3. Rewind rules (G4, G7).
4. Matching edge cases (G2, G5, aliases). Best done as fast unit tests, which needs the matching functions to be importable (R1).
5. Run endings, bonus heart, Play Again.
6. Card-data checks in CI (duplicates, required fields), which would have caught C1.
7. Safari/WebKit and visual checks.

---

## 3. Recommended implementation order

Each step is a separate small PR. Each fix starts with a failing test that reproduces the bug, and needs owner approval before merge.

**Batch 1 – Quick fixes that don't change the rules (about 1–2 days in total)**
1. **G1** Double-tap guard on result buttons (+ test). *Critical.*
2. **G3** Keep the Speed Run clock running during rewind (+ test).
3. **G4** Make lost cards view-only on rewind (+ test).
4. **A2** Respect the OS reduce-motion setting.
5. **P1 (stickers only)** Convert the three sticker PNGs to WebP at 2× display size. Same look; measured 5.06 MB → 0.12 MB.
6. **C1 + card-data check in CI** Remove duplicate #69 and add the content test.

**Batch 2 – Needs your decisions first (decision memo, then small PRs)**
7. **D1 + D2** Add a link to the share text, plus social-preview tags. *Highest growth value.*
8. **G2, G5, C2** Matching rules: card #54, apostrophes, alias review.
9. **G6, G8, G9** Game design: free word-probing, Daily replays, Daily schedule.
10. **A3** Mute button. **P3** Self-hosted fonts.

**Batch 3 – Structural (approval required: refactor)**
11. **R1 step 1** Move the pure game logic (matching, scoring, deck) into its own file with unit tests, without changing any behaviour. This unlocks cheap testing for item 8.
12. **P2 / R2** Remove unused assets and dead code.
13. **S2 / S3** Vite upgrade and security headers.

**Owner-only actions (no code)**
- Include administrators in the required-check rule.
- Choose one production site (likely `plotmix-app`) and disconnect the other.
- Store the backup bundle outside GitHub.
- Do a 30-minute real-phone check (A5).

After Batch 1–2: Phase 3 polish (sound, animation, mobile, P4), then Phase 4 measurement and discoverability.
