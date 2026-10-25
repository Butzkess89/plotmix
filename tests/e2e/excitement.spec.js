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

test.describe('A. Spoiler-free share journey', () => {
  test('the Daily share shows each guess and hint, never the answer', async ({ page, context, browserName }) => {
    test.skip(browserName === 'webkit', 'Playwright cannot grant clipboard permission in WebKit')
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await pinDailyDate(page)
    await openMenu(page)
    await startMode(page, 'daily')
    const card = await currentCard(page, 'daily')
    await submitGuess(page, 'zzqxwrong')
    await page.getByRole('button', { name: 'Open hints' }).click()
    await page.getByRole('button', { name: /Year & Genre/ }).click()
    await page.getByRole('button', { name: 'Close hints' }).click()
    await submitGuess(page, card.movies[0])
    await submitGuess(page, card.movies[1])
    await page.getByRole('button', { name: 'Finish' }).click()
    await page.getByRole('button', { name: 'Copy' }).click()
    const text = await page.evaluate(() => navigator.clipboard.readText())
    expect(text.split('\n')[2]).toBe('🟥🟩🟩 💡')
    for (const film of card.movies) expect(text.toLowerCase()).not.toContain(film.toLowerCase())
  })
})

test.describe('B. Letter tiles flip when revealed', () => {
  test('a guessed title word flips its tiles; tiles already showing do not', async ({ page }) => {
    await resumeStandardWithCards(page, [77]) // "The Nightmare Before Christmas Story"
    const flipping = () => page.evaluate(() => [...document.querySelectorAll('[aria-label="Title letters"] div')]
      .filter((d) => d.style.animation.includes('tileFlip')).map((d) => d.textContent).join(''))
    expect(await flipping()).toBe('')
    await submitGuess(page, 'Nightmare')
    await expect.poll(flipping).toBe('Nightmare')
  })

  test('no flip when the phone asks for less motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await resumeStandardWithCards(page, [77])
    await submitGuess(page, 'Nightmare')
    await page.waitForTimeout(200)
    expect(await page.evaluate(() => [...document.querySelectorAll('[aria-label="Title letters"] div')]
      .some((d) => d.style.animation.includes('tileFlip')))).toBe(false)
  })
})

test.describe('C. Vibration on phones that support it', () => {
  async function recordVibrations(page) {
    await page.addInitScript(() => { window.__buzz = []; navigator.vibrate = (p) => { window.__buzz.push(p); return true } })
  }
  test('a miss buzzes twice and a find buzzes once', async ({ page }) => {
    await recordVibrations(page)
    await resumeStandardWithCards(page, [77])
    await submitGuess(page, 'zzqxwrong')
    await submitGuess(page, 'A Christmas Story')
    await expect.poll(() => page.evaluate(() => window.__buzz)).toEqual([[30, 50, 30], 25])
  })
  test('turning sound off also turns vibration off', async ({ page }) => {
    await recordVibrations(page)
    await page.addInitScript(() => localStorage.setItem('plotmix_sound', 'off'))
    await resumeStandardWithCards(page, [77])
    await submitGuess(page, 'zzqxwrong')
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => window.__buzz)).toEqual([])
  })
})

test.describe('D. Daily number and countdown', () => {
  test('the Daily end screen shows its number and time to the next one', async ({ page }) => {
    await pinDailyDate(page) // 2026-10-14 12:00
    await openMenu(page)
    await startMode(page, 'daily')
    const card = await currentCard(page, 'daily')
    await submitGuess(page, card.mashedTitle)
    await page.getByRole('button', { name: 'Finish' }).click()
    await expect(page.getByLabel('Next Daily')).toHaveText('Daily #14 · Next Daily in 12:00:00')
  })
})

test.describe('E. Points roll and shake', () => {
  test('losing points shakes the counter, harder for bigger losses', async ({ page }) => {
    await resumeStandardWithCards(page, [77])
    const amp = () => page.evaluate(() => [...document.querySelectorAll('span')].find((s) => /^PTS: /.test(s.textContent))?.style.getPropertyValue('--amp'))
    await submitGuess(page, 'zzqxwrong') // -1
    await expect.poll(amp).toBe('4px')
    await expect(page.getByText('PTS: 9')).toBeVisible()
    await submitGuess(page, 'zzqa zzqb zzqc') // -3
    await expect.poll(amp).toBe('8px')
    await expect(page.getByText('PTS: 6')).toBeVisible()
  })
})
