// Tests for Phase 3 Batch 3A (approved 2026-10-19). Each failed on the code before its change.
import { test, expect } from '@playwright/test'
import { resumeStandardWithCards, submitGuess, guessInput } from './helpers.js'

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
