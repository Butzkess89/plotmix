// Regression tests for bugs found in the Phase 2 audit (docs/PHASE2_AUDIT.md).
// Each test reproduced its bug on the unfixed code before the fix was written.
import { test, expect } from '@playwright/test'
import {
  openMenu, startMode, submitGuess, waitForSave, currentCard, readSaves, pointsCounter,
  resumeStandardWithCards, readDeck, continueToCard,
} from './helpers.js'

// One made-up word: not a film title and not a word in any mashed title, so it costs exactly 1 point.
const WRONG_GUESS = 'zzqxwrong'

async function loseCardWithWrongGuesses(page) {
  for (let i = 0; i < 6; i++) await submitGuess(page, `${WRONG_GUESS}${i}`)
}

test.describe('G1: repeated taps on Next apply the round once', () => {
  test('double-clicking Next after a win scores the card once', async ({ page }) => {
    await openMenu(page)
    await startMode(page, 'standard')
    const card = await currentCard(page, 'standard')
    await submitGuess(page, card.mashedTitle)

    const next = page.getByRole('button', { name: 'Next' })
    await expect(next).toBeVisible()
    await next.dblclick()

    const session = await waitForSave(page, 'standard', (s) => s.cardIdx === 1)
    await page.waitForTimeout(500) // let any second, delayed card swap land
    const after = (await readSaves(page)).standard
    expect(after.cardIdx).toBe(1)
    expect(after.totalScore).toBe(10)
    const streak = await page.evaluate(() => JSON.parse(localStorage.getItem('plotmix_streak')))
    expect(streak.current).toBe(1)
    expect(session.results.filter(Boolean)).toHaveLength(1)
  })

  test('double-clicking Next after a lost card costs one heart', async ({ page }) => {
    await openMenu(page)
    await startMode(page, 'standard')
    await loseCardWithWrongGuesses(page)

    const next = page.getByRole('button', { name: 'Next' })
    await expect(next).toBeVisible()
    await next.dblclick()

    await waitForSave(page, 'standard', (s) => s.cardIdx === 1)
    await page.waitForTimeout(500)
    expect((await readSaves(page)).standard.lives).toBe(5)
  })
})

test.describe('G3: Speed Run clock keeps running while rewound', () => {
  test('time runs out on the current card even while viewing a solved card', async ({ page }) => {
    await page.clock.install()
    await openMenu(page)
    await startMode(page, 'speedrun')
    const card = await currentCard(page, 'speedrun')
    await submitGuess(page, card.mashedTitle)
    await page.clock.runFor(5_000)
    await page.getByRole('button', { name: 'Next' }).click()
    await page.clock.runFor(1_000)
    await waitForSave(page, 'speedrun', (s) => s.cardIdx === 1)

    await page.getByRole('button', { name: 'Rewind to previous card' }).click()
    await page.clock.runFor(65_000)

    // The current card timed out: its result shows, and (owner decision 2026-10-26) the run ends.
    const finish = page.getByRole('button', { name: 'Finish' })
    await expect(finish).toBeVisible()
    await finish.click()
    await page.clock.runFor(2_000)
    await expect(page.getByText('The End')).toBeVisible()
  })
})

test.describe('G4: a card lost to wrong guesses is view-only when rewound', () => {
  test('rewinding to it shows 0 points and no hints', async ({ page }) => {
    await openMenu(page)
    await startMode(page, 'standard')
    await loseCardWithWrongGuesses(page)
    await page.getByRole('button', { name: 'Next' }).click()
    await waitForSave(page, 'standard', (s) => s.cardIdx === 1)

    await page.getByRole('button', { name: 'Rewind to previous card' }).click()
    await expect(page.getByRole('button', { name: 'Hints unavailable in view-only' })).toBeVisible()
    await expect(pointsCounter(page)).toHaveText('PTS: 0')
  })
})

test.describe('A2: the OS "reduce motion" setting is respected', () => {
  async function playOneCardAndWatchTransition(page) {
    await openMenu(page)
    await startMode(page, 'standard')
    const card = await currentCard(page, 'standard')
    await submitGuess(page, card.mashedTitle)
    await page.getByRole('button', { name: 'Next' }).click()
    // A card change ("5, 4, blip!" or the film-reel run, picked at random) is on screen for about 1 s.
    const change = page.getByRole('status', { name: /^(Next card countdown|Film reel change|Iris change|Clapper change)$/ })
    try { await change.waitFor({ state: 'visible', timeout: 1_000 }); return true } catch { return false }
  }

  test('with reduce motion, the card-change animation is skipped', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    expect(await playOneCardAndWatchTransition(page)).toBe(false)
  })

  test('without it, the card-change animation still plays', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    expect(await playOneCardAndWatchTransition(page)).toBe(true)
  })

  test('between cards: "5, 4, blip!" then the next card, in under 2 seconds', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.addInitScript(() => localStorage.setItem('plotmix_force_card_change', '"leader"'))
    // Record what the countdown shows, and when, as it happens.
    await page.addInitScript(() => {
      window.__leader = []
      new MutationObserver(() => {
        const el = document.querySelector('[aria-label="Next card countdown"]')
        const v = el ? (el.textContent || 'blip') : 'gone'
        if (window.__leader[window.__leader.length - 1]?.v !== v) window.__leader.push({ v, t: performance.now() })
      }).observe(document, { subtree: true, childList: true, characterData: true })
    })
    expect(await playOneCardAndWatchTransition(page)).toBe(true)
    await expect.poll(() => page.evaluate(() => window.__leader.map((x) => x.v).join(' ')), { timeout: 3_000 }).toMatch(/5 4 blip gone$/)
    const tl = await page.evaluate(() => window.__leader)
    const start = tl.find((x) => x.v === '5').t
    expect(tl[tl.length - 1].t - start).toBeLessThan(2_000)
  })

  for (const [kind, label] of [['reel', 'Film reel change'], ['iris', 'Iris change'], ['clapper', 'Clapper change']]) {
    test(`between cards: ${label.toLowerCase()} (one of four, picked at random), under 2 seconds`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'no-preference' })
      await page.addInitScript((k) => localStorage.setItem('plotmix_force_card_change', JSON.stringify(k)), kind)
      expect(await playOneCardAndWatchTransition(page)).toBe(true)
      await expect(page.getByRole('status', { name: label })).toBeAttached()
      await expect(page.getByRole('status', { name: label })).toHaveCount(0, { timeout: 2_000 })
    })
  }
  test('the clapperboard shows the next scene number', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.addInitScript(() => localStorage.setItem('plotmix_force_card_change', '"clapper"'))
    expect(await playOneCardAndWatchTransition(page)).toBe(true)
    await expect(page.getByRole('status', { name: 'Clapper change' })).toContainText('SCENE 2')
    await page.waitForTimeout(600) // still SCENE 2 after the card underneath has changed
    await expect(page.getByRole('status', { name: 'Clapper change' })).toContainText('SCENE 2')
  })

  test('the same card change never plays twice in a row', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.addInitScript(() => {
      window.__changes = []
      new MutationObserver(() => {
        const el = document.querySelector('[aria-label="Next card countdown"], [aria-label="Film reel change"], [aria-label="Iris change"], [aria-label="Clapper change"]')
        if (el && window.__last !== el) { window.__changes.push(el.getAttribute('aria-label')); window.__last = el }
      }).observe(document, { subtree: true, childList: true })
    })
    const deck = readDeck()
    const ids = [77, 1, 2, 3, 11, 12, 13]
    await resumeStandardWithCards(page, ids)
    for (let i = 0; i < 6; i++) {
      await submitGuess(page, deck.find((c) => c.id === ids[i]).mashedTitle)
      await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeVisible()
      await continueToCard(page, 'standard', i + 1)
      await page.waitForTimeout(1_500)
    }
    const changes = await page.evaluate(() => window.__changes)
    expect(changes.length).toBe(6)
    for (let i = 1; i < changes.length; i++) expect(changes[i]).not.toBe(changes[i - 1])
  })

})

test.describe('P1: sticker images are lightweight', () => {
  test('the menu sticker is a WebP image that loads', async ({ page }) => {
    await openMenu(page)
    const sticker = page.locator('img[src*="/stickers/"]').first()
    await expect(sticker).toHaveAttribute('src', /\.webp$/)
    await expect.poll(() => sticker.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true)
  })
})

test.describe('G10: a title revealed word by word completes the card', () => {
  test('owner report: "officespace" then "cowboys" solves "Office Space Cowboys"', async ({ page }) => {
    await resumeStandardWithCards(page, [35])
    await submitGuess(page, 'officespace')
    await expect(page.getByRole('button', { name: 'Next' })).toHaveCount(0) // one film named isn't enough
    await submitGuess(page, 'cowboys')
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible()
    const s = await waitForSave(page, 'standard', () => true)
    expect(s).toBeTruthy()
  })
  test('words typed run together count for each word ("office" then "spacecowboys")', async ({ page }) => {
    await resumeStandardWithCards(page, [35])
    await submitGuess(page, 'office')
    await submitGuess(page, 'spacecowboys')
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible()
  })
  test('words typed several at a time count, so a fully revealed title is solved', async ({ page }) => {
    // #77 "The Nightmare Before Christmas Story": the owner got stuck here on 2026-10-15.
    await resumeStandardWithCards(page, [77])
    for (const g of ['The Nightmare', 'Before Christmas', 'Story']) await submitGuess(page, g)
    await page.getByRole('button', { name: 'Next' }).click()
    const session = await waitForSave(page, 'standard', (s) => s.cardIdx === 1)
    // Words that are in the title never count as wrong guesses, so the card keeps full points.
    expect(session.results[0]).toMatchObject({ solved: true, pts: 10, guesses: 3 })
  })

  test('"day", "will", "there" and "being" are real words that must be found', async ({ page }) => {
    // #10 "Being John Wick": "John" and "Wick" alone must not complete it.
    await resumeStandardWithCards(page, [10])
    await submitGuess(page, 'John')
    await submitGuess(page, 'Wick')
    await page.waitForTimeout(1_000)
    await expect(page.getByRole('button', { name: 'Next' })).toHaveCount(0)
    await submitGuess(page, 'Being')
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible()
  })
})
