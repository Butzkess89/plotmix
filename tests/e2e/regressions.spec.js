// Regression tests for bugs found in the Phase 2 audit (docs/PHASE2_AUDIT.md).
// Each test reproduced its bug on the unfixed code before the fix was written.
import { test, expect } from '@playwright/test'
import {
  openMenu, startMode, submitGuess, waitForSave, currentCard, readSaves, pointsCounter,
  resumeStandardWithCards,
} from './helpers.js'

// One made-up word: not a film title and not a word in any mashed title, so it costs exactly 1 point.
const WRONG_GUESS = 'zzqxwrong'
const GENRE_TAG = /Blockbuster Cut|Dream Dissolve|Retro Splice|Thriller Smash/

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

    // The current card timed out: its result shows and costs a heart.
    const next = page.getByRole('button', { name: 'Next' })
    await expect(next).toBeVisible()
    await next.click()
    await page.clock.runFor(2_000)
    const session = await waitForSave(page, 'speedrun', (s) => s.cardIdx === 2)
    expect(session.results[1]).toMatchObject({ solved: false, pts: 0 })
    expect(session.lives).toBe(5)
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
    // The card-change overlay is visible for about half a second when motion is on.
    return page.getByText(GENRE_TAG).first().isVisible({ timeout: 0 }).then(async (v) => {
      if (v) return true
      try { await page.getByText(GENRE_TAG).first().waitFor({ state: 'visible', timeout: 1_000 }); return true } catch { return false }
    })
  }

  test('with reduce motion, the card-change animation is skipped', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    expect(await playOneCardAndWatchTransition(page)).toBe(false)
  })

  test('without it, the card-change animation still plays', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    expect(await playOneCardAndWatchTransition(page)).toBe(true)
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
