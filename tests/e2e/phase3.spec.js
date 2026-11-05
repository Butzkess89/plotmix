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
test.describe('3A-3 how a run ends, Play Again, Speed Run countdown', () => {
  test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: 'reduce' }) })

  async function skipCard(page) {
    await page.getByRole('button', { name: 'Skip card' }).click()
    await page.getByRole('button', { name: 'Skip It' }).click()
    await page.getByRole('button', { name: /^(Next|Finish)$/ }).click()
  }
  async function solvePerfectly(page) {
    const card = await currentCard(page, 'standard')
    await submitGuess(page, card.mashedTitle)
    const next = page.getByRole('button', { name: /^(Next|Finish)$/ })
    await expect(next).toBeVisible()
    // Since 2026-10-25, 5 in a row offers Popcorn Panic; these tests continue to the next card.
    const offer = page.getByRole('button', { name: 'Continue to the next PlotMix' })
    if (await offer.isVisible().catch(() => false)) await offer.click()
    else await next.click()
  }

  test('skips are free; spending the whole budget ends the run, and Play Again starts a fresh one', async ({ page }) => {
    await openMenu(page)
    await startMode(page, 'standard')
    for (let i = 0; i < 6; i++) await skipCard(page)
    expect((await waitForSave(page, 'standard', (s) => s.cardIdx === 6)).budget).toBe(10)
    for (let i = 0; i < 10; i++) await submitGuess(page, `zzqxwrong${i}`)
    await expect(page.getByRole('img', { name: 'Cancelled' })).toBeVisible()
    await page.getByRole('button', { name: 'Finish' }).click()
    await expect(page.getByText('The End')).toBeVisible()
    expect((await readSaves(page)).standard).toBeUndefined() // the finished run is not resumable

    await page.getByRole('button', { name: 'Play Again' }).click()
    const fresh = await waitForSave(page, 'standard')
    expect(fresh).toMatchObject({ cardIdx: 0, budget: 10, totalScore: 0, results: [] })
  })

  test('finishing the last card ends the run with the total score', async ({ page }) => {
    await openMenu(page)
    await startMode(page, 'standard')
    for (let i = 0; i < 10; i++) await solvePerfectly(page)
    await expect(page.getByText('The End')).toBeVisible()
    await expect(page.getByText('10', { exact: true }).first()).toBeVisible() // 10 films released
  })

  test('only a clean solve earns $20M back, and never past the $100M max (owner decision 2026-11-05)', async ({ page }) => {
    await openMenu(page)
    await startMode(page, 'standard')
    await solvePerfectly(page) // already at the $100M max: nothing extra
    expect((await waitForSave(page, 'standard', (s) => s.cardIdx === 1)).budget).toBe(10)
    await submitGuess(page, 'zzqxwrong') // -$10M, so this solve is not clean and earns nothing
    await solvePerfectly(page)
    expect((await waitForSave(page, 'standard', (s) => s.cardIdx === 2)).budget).toBe(9)
    await solvePerfectly(page) // clean: +$20M, capped back at $100M
    expect((await waitForSave(page, 'standard', (s) => s.cardIdx === 3)).budget).toBe(10)
    await skipCard(page)
    expect((await waitForSave(page, 'standard', (s) => s.cardIdx === 4)).budget).toBe(10)
  })

  test('the Speed Run clock counts down from 1:00 and runs out', async ({ page }) => {
    await page.clock.install()
    await openMenu(page)
    await startMode(page, 'speedrun')
    await expect(page.getByText('1:00', { exact: true })).toBeVisible()
    await page.clock.runFor(10_000)
    await expect(page.getByText('0:50', { exact: true })).toBeVisible()
    await page.clock.runFor(51_000)
    // Running out of time ends the run (owner decision 2026-10-26).
    await expect(page.getByText("Time's Up!")).toBeVisible()
    await page.getByRole('button', { name: 'Finish' }).click()
    await page.clock.runFor(1_000)
    await expect(page.getByText('The End')).toBeVisible()
  })
})

test.describe('3A-2 earlier cards are view-only on rewind (owner decision B, 2026-10-19)', () => {
  test('when a Speed Run card times out, the run ends and cannot be resumed (owner decision 2026-10-26)', async ({ page }) => {
    await page.clock.install()
    await openMenu(page)
    await startMode(page, 'speedrun')
    const card = await currentCard(page, 'speedrun')
    await submitGuess(page, card.mashedTitle) // card 1 solved
    await page.getByRole('button', { name: 'Next' }).click()
    await page.clock.runFor(1_500)
    await waitForSave(page, 'speedrun', (s) => s.cardIdx === 1)
    await page.clock.runFor(61_000) // card 2 times out
    await page.getByRole('button', { name: 'Finish' }).click()
    await page.clock.runFor(1_500)
    await expect(page.getByText('The End')).toBeVisible()
    expect((await readSaves(page)).speedrun).toBeUndefined()
  })

})
