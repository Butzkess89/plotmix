// Tests for the owner's 2026-10-22 requests: jump to the letters after a guess, and the
// research-based excitement features (Tier 1-3) plus the arcade side-quest.
import { test, expect } from '@playwright/test'
import {
  openMenu, startMode, submitGuess, guessInput, currentCard, pinDailyDate, resumeStandardWithCards,
} from './helpers.js'

const LONGEST_PLOT_CARD = 57

test.describe('After a guess the letter tiles come into view', () => {
  test('on a short screen scrolled to the bottom, the tiles are visible after guessing', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 420 }) // like a phone with the keyboard open
    await resumeStandardWithCards(page, [LONGEST_PLOT_CARD])
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await submitGuess(page, 'zzqxwrong')
    await expect.poll(async () => page.evaluate(() => {
      const tiles = document.querySelector('[aria-label="Title letters"]').getBoundingClientRect()
      const input = document.querySelector('input[aria-label="Movie title guess"]').getBoundingClientRect()
      return tiles.top >= 0 && tiles.top < input.top
    }), { timeout: 5_000 }).toBe(true)
    await expect(guessInput(page)).toBeFocused()
  })
})
