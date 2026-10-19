// Tests for Phase 3 Batch 3A (approved 2026-10-19). Each failed on the code before its change.
import { test, expect } from '@playwright/test'
import { resumeStandardWithCards, submitGuess, guessInput, openMenu, startMode, currentCard, waitForSave, readSaves } from './helpers.js'

// The longest plot in the deck (#57) is the hardest case for small screens.
const LONGEST_PLOT_CARD = 57

async function typingBoxClearOfButtonBar(page) {
  return page.evaluate(() => {
    const input = document.querySelector('input[aria-label="Movie title guess"]').getBoundingClientRect()
    const bar = document.querySelector('button[aria-label="Submit guess"]').closest('div[style*="position: fixed"]').getBoundingClientRect()
    return input.top >= 0 && input.bottom <= bar.top
  })
}

test.describe('3A-1 the typing box is never hidden behind the bottom button bar', () => {
  for (const [label, width, height] of [['small Android 360x640', 360, 640], ['small phone 320x568', 320, 568], ['landscape 844x390', 844, 390]]) {
    test(`${label}: visible on arrival and after a guess`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await resumeStandardWithCards(page, [LONGEST_PLOT_CARD])
      await page.waitForTimeout(500)
      expect(await typingBoxClearOfButtonBar(page)).toBe(true)
      await submitGuess(page, 'zzqxwrong')
      await page.waitForTimeout(500)
      expect(await typingBoxClearOfButtonBar(page)).toBe(true)
      await expect(guessInput(page)).toBeFocused()
    })
  }

  test('nothing scrolls sideways', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 })
    await resumeStandardWithCards(page, [LONGEST_PLOT_CARD])
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
})

test.describe('3A-1 the exit button is easy to tap', () => {
  test('its tap area is at least 44x44', async ({ page }) => {
    await resumeStandardWithCards(page, [LONGEST_PLOT_CARD])
    const box = await page.getByRole('button', { name: 'Exit to menu' }).boundingBox()
    expect(box.width).toBeGreaterThanOrEqual(44)
    expect(box.height).toBeGreaterThanOrEqual(44)
  })
})

test.describe('3A-4 lighter first load', () => {
  test('the intro video is under 1.5 MB and still a playable MP4', async ({ request }) => {
    const res = await request.get('/design-reference/it_s_nearly_perfect_except_th.mp4')
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('video/mp4')
    expect((await res.body()).length).toBeLessThan(1.5e6)
  })
})

// Characterisation tests: they describe how runs end today, so later changes can't break it silently.
test.describe('3A-3 how a run ends, bonus heart, Play Again, Speed Run countdown', () => {
  test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: 'reduce' }) })

  async function skipCard(page) {
    await page.getByRole('button', { name: 'Skip card' }).click()
    await page.getByRole('button', { name: 'Skip It' }).click()
    await page.getByRole('button', { name: /^(Next|Finish)$/ }).click()
  }
  async function solvePerfectly(page) {
    const card = await currentCard(page, 'standard')
    await submitGuess(page, card.mashedTitle)
    await page.getByRole('button', { name: /^(Next|Finish)$/ }).click()
  }

  test('losing all 6 hearts ends the run, and Play Again starts a fresh one', async ({ page }) => {
    await openMenu(page)
    await startMode(page, 'standard')
    for (let i = 0; i < 6; i++) await skipCard(page)
    await expect(page.getByText('The End')).toBeVisible()
    expect((await readSaves(page)).standard).toBeUndefined() // the finished run is not resumable

    await page.getByRole('button', { name: 'Play Again' }).click()
    const fresh = await waitForSave(page, 'standard')
    expect(fresh).toMatchObject({ cardIdx: 0, lives: 6, totalScore: 0, results: [] })
  })

  test('finishing the last card ends the run with the total score', async ({ page }) => {
    await openMenu(page)
    await startMode(page, 'standard')
    for (let i = 0; i < 10; i++) await solvePerfectly(page)
    await expect(page.getByText('The End')).toBeVisible()
    await expect(page.getByText('100', { exact: true })).toBeVisible() // 10 cards x 10 points
  })

  test('four perfect solves in a row give back a lost heart', async ({ page }) => {
    await openMenu(page)
    await startMode(page, 'standard')
    await skipCard(page)
    await waitForSave(page, 'standard', (s) => s.cardIdx === 1 && s.lives === 5)
    for (let i = 0; i < 3; i++) await solvePerfectly(page)
    expect((await waitForSave(page, 'standard', (s) => s.cardIdx === 4)).lives).toBe(5)
    await solvePerfectly(page)
    expect((await waitForSave(page, 'standard', (s) => s.cardIdx === 5)).lives).toBe(6)
  })

  test('the Speed Run clock counts down from 1:00 and runs out', async ({ page }) => {
    await page.clock.install()
    await openMenu(page)
    await startMode(page, 'speedrun')
    await expect(page.getByText('1:00', { exact: true })).toBeVisible()
    await page.clock.runFor(10_000)
    await expect(page.getByText('0:50', { exact: true })).toBeVisible()
    await page.clock.runFor(51_000)
    await page.getByRole('button', { name: 'Next' }).click()
    await page.clock.runFor(1_000)
    const s = await waitForSave(page, 'speedrun', (x) => x.cardIdx === 1)
    expect(s.results[0]).toMatchObject({ solved: false, pts: 0 })
    expect(s.lives).toBe(5)
  })
})

test.describe('3A-2 earlier cards are view-only on rewind (owner decision B, 2026-10-19)', () => {
  test('a timed-out Speed Run card cannot be replayed after rewinding', async ({ page }) => {
    await page.clock.install()
    await openMenu(page)
    await startMode(page, 'speedrun')
    await page.clock.runFor(61_000) // card 1 times out unsolved, with points left
    await page.getByRole('button', { name: 'Next' }).click()
    await page.clock.runFor(1_500)
    await waitForSave(page, 'speedrun', (s) => s.cardIdx === 1)

    await page.getByRole('button', { name: 'Rewind to previous card' }).click()
    await expect(page.getByRole('button', { name: 'Hints unavailable in view-only' })).toBeVisible()
    await expect(guessInput(page)).toBeDisabled()
    await expect(page.getByText('PTS: 0', { exact: true })).toBeVisible()
  })
})
