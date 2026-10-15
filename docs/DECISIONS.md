# PlotMix – Decisions

Record of product decisions. Each pending item lists the options, the evidence and a recommendation. The owner decides; the decision and date are then filled in.

## Pending: Batch 2 (from `docs/PHASE2_AUDIT.md`), 2026-10-15

Measurements below come from running the game's own matching and shuffle code over all 94 playable cards.

### 1. Link in the share text (audit D1)
Today the copied result is 3 lines (mode, date, score emojis) with no way back to the game.
- **A.** Add one line: `Play: https://plotmix-app.vercel.app`
- **B.** A, plus on phones open the native share sheet (WhatsApp, Messages…) instead of only copying. Falls back to copy elsewhere.
- **C.** Keep as is.

**Recommendation: B.** Effort S. Spoiler-safe: the text contains no titles. Needs item 12 confirmed first (which address).

### 2. Link previews (audit D2)
Links shared on WhatsApp/X show no description or image.
- **A.** Add a description and a 1200×630 preview image, made from existing PlotMix art; you approve the image first.
- **B.** Not now.

**Recommendation: A.** Effort S.

### 3. Card #54: one film name solves the card (audit G2)
"The Green Mile" is within typo distance of "The Green 8 Mile". It is the only card where this happens.
- **A.** Rule: a guess that exactly matches one film's title (or alias) counts only for that film, never as the full mashed title. Measured: fixes #54, **0 regressions**, typo tolerance unchanged on 93/93 cards.
- **B.** Change card #54's content instead.
- **C.** Leave it.

**Recommendation: A.** Effort S.

### 4. Apostrophes (audit G5)
9 cards have an apostrophe in the title (#1, #4, #13, #29, #43, #64, #75, #78, #92). "Can't" is split into "can" + "t", so typing the title word by word completes only 1 of them.
- **A.** Ignore apostrophes when comparing ("can't" = "cant"). Measured: 9/9 complete, **0 regressions**.
- **B.** Leave it.

**Recommendation: A.** Effort S.

### 5. Free word guesses (audit G6)
Typing any word that is in the mashed title reveals it without costing anything, so most cards can be solved for full points by trying words one at a time. A title has 1–9 meaningful words (median 3). This is the core "hangman" feel, so it is a design call.
- **A.** Keep as is.
- **B.** The first 2 revealed words are free; each further one costs 1 point (no guess used).
- **C.** Every revealed word costs 1 point.

**Recommendation: B.** It keeps the fun of uncovering words while making full points require recognising the films. This is a judgment call; revisit with play data (Phase 4). Effort S.

### 6. Daily replays (audit G8)
Daily can be replayed without limit, and each replay overwrites the result.
- **A.** Allow replays for fun, but keep and share the **first** result of the day.
- **B.** Lock Daily after completion and show the result (Wordle-style).
- **C.** Keep as is.

**Recommendation: A.** Effort S.

### 7. Daily schedule (audit G9)
Each date is an independent shuffle: over the next year there are 273 repeats, some only 2 days apart, and 2 cards never appear.
- **A.** A fixed rotation through all 94 cards with no repeats, starting the day **after** release so nobody's current card changes mid-day.
- **B.** Keep as is.

**Recommendation: A.** Effort S. Everyone still gets the same card on the same local date.

### 8. Loose aliases (audit C2)
Of the 26 accepted answers that share no word with their film title, 24 are legitimate (spacing variants like "rainman", acronyms like "bttf", alternate titles like "live die repeat"). Two accept something that isn't the film's title:
- "kubrick" for *2001: A Space Odyssey* (#3) – the director's name.
- "andy kaufman film" for *Man on the Moon* (#22) – a description.
- **A.** Remove these two. **B.** Keep.

**Recommendation: A.** Effort S.

### 9. Sound on/off (audit A3)
There is no way to turn the sound effects off.
- **A.** A speaker button on the menu and in the game header, remembered between visits. Placement shown on a preview for your approval.
- **B.** Not now.

**Recommendation: A.** Effort S.

### 10. Fonts (audit P3)
The game loads fonts from Google. Self-hosted copies are in the repo but unused since a later commit undid "self-host fonts for reliable mobile rendering".
- **A.** Use the self-hosted fonts again (no visual change intended; no third-party request).
- **B.** Keep Google Fonts.

**Recommendation: A.** Effort S.

### 11. Card #51 writing
The removed duplicate #69 had different writing for the same card (see `docs/content/retired-cards.md`).
- **A.** Keep #51's writing.
- **B.** Use #69's plot, hints and connection under id 51 (the Daily schedule is unaffected).

**Recommendation: B.** #69's plot is more specific and funnier, and its hints are clearer. This is your editorial call.

### 12. Main website
- **A.** `plotmix-app.vercel.app` is the real site; the `plotmix` Vercel project gets disconnected (by you, in Vercel).
- **B.** The other way round.

**Recommendation: A** (it is the address in the master directive).

---

## Decided

| Date | Decision | By |
|---|---|---|
| 2026-10-14 | Read-only audit before any changes; work only through draft PRs | Owner |
| 2026-10-15 | Phase 2 Batch 1 approved (PR #4) | Owner |
