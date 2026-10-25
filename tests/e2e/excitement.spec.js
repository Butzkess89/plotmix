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

const dayNumber = (y, m, d) => Math.floor(Date.UTC(y, m - 1, d) / 86400000)

test.describe('F. Film Vault and ticket stubs', () => {
  test('a solved card adds its stub to the Vault, after the welcome stub', async ({ page }) => {
    await resumeStandardWithCards(page, [77, 1])
    await submitGuess(page, 'The Nightmare Before Christmas Story')
    await page.getByRole('button', { name: 'Next' }).click()
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('plotmix_vault') || '[]'))).toEqual([77])
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('plotmix_stubs')))).toEqual({ earned: 2, spent: 0 })
    await page.getByRole('button', { name: 'Exit to menu' }).click()
    await page.getByRole('button', { name: 'Film Vault' }).click()
    await expect(page.getByLabel('Vault progress')).toHaveText('2/95 stubs collected')
    await expect(page.getByLabel('Stub: The Nightmare Before Christmas Story')).toBeVisible()
  })

  test('replaying a finished Daily earns no extra stub', async ({ page }) => {
    await pinDailyDate(page)
    await openMenu(page)
    await startMode(page, 'daily')
    const card = await currentCard(page, 'daily')
    await submitGuess(page, card.mashedTitle)
    await page.getByRole('button', { name: 'Finish' }).click()
    await page.getByRole('button', { name: 'Play Again' }).click()
    await submitGuess(page, card.mashedTitle)
    await page.getByRole('button', { name: 'Finish' }).click()
    await expect(page.getByText('The End')).toBeVisible()
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('plotmix_stubs')).earned)).toBe(2)
  })
})

test.describe('G. Combo ladder', () => {
  test('correct guesses in a row climb the scale; a miss starts again', async ({ page }) => {
    await page.addInitScript(() => {
      window.__notes = []
      const orig = AudioParam.prototype.setValueAtTime
      AudioParam.prototype.setValueAtTime = function (v, t) { if (v > 500 && v < 1100) window.__notes.push(Math.round(v)); return orig.call(this, v, t) }
    })
    await resumeStandardWithCards(page, [77])
    for (const w of ['Nightmare', 'Before', 'zzqxwrong', 'Christmas']) await submitGuess(page, w)
    await page.waitForTimeout(300)
    const combo = await page.evaluate(() => window.__notes.filter((f) => [523, 587, 659].includes(f)))
    expect(combo).toEqual([523, 587, 523])
  })
})

test.describe('H. Themed weeks', () => {
  test('during Fright Week the Daily is a horror or thriller mashup', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-10-26T12:00:00'))
    await openMenu(page)
    await startMode(page, 'daily')
    const card = await currentCard(page, 'daily')
    expect(card.hintData.films.some((f) => /horror|thriller/i.test(f.genre))).toBe(true)
  })
  test('the next day brings a different Fright Week card', async ({ browser }) => {
    const ids = []
    for (const d of ['2026-10-26', '2026-10-27']) {
      const page = await browser.newPage()
      await page.clock.setFixedTime(new Date(`${d}T12:00:00`))
      await openMenu(page)
      await startMode(page, 'daily')
      ids.push((await currentCard(page, 'daily')).id)
      await page.close()
    }
    expect(ids[0]).not.toBe(ids[1])
  })
})

test.describe('I. Add to home screen', () => {
  test('offered only after a Daily win, using the browser prompt', async ({ page }) => {
    await pinDailyDate(page)
    await openMenu(page)
    await page.evaluate(() => {
      const e = new Event('beforeinstallprompt', { cancelable: true })
      e.prompt = () => { window.__prompted = true }
      window.dispatchEvent(e)
    })
    await startMode(page, 'daily')
    const card = await currentCard(page, 'daily')
    await submitGuess(page, card.mashedTitle)
    await page.getByRole('button', { name: 'Finish' }).click()
    await page.getByRole('button', { name: /Add PlotMix to your home screen/ }).click()
    expect(await page.evaluate(() => window.__prompted)).toBe(true)
  })
  test('the app has an install manifest with icons', async ({ request }) => {
    const m = await (await request.get('/manifest.webmanifest')).json()
    expect(m.display).toBe('standalone')
    for (const icon of m.icons) expect((await request.get(icon.src)).status()).toBe(200)
  })
})

test.describe('J. Daily streak with a weekly saver', () => {
  test('one missed day is forgiven by the streak saver', async ({ page }) => {
    await page.addInitScript((last) => {
      if (!localStorage.getItem('plotmix_dstreak')) localStorage.setItem('plotmix_dstreak', JSON.stringify({ count: 3, best: 3, lastDay: last, saverWeek: null }))
    }, dayNumber(2026, 10, 12)) // missed the 13th
    await pinDailyDate(page) // 14th
    await openMenu(page)
    await startMode(page, 'daily')
    const card = await currentCard(page, 'daily')
    await submitGuess(page, card.mashedTitle)
    await page.getByRole('button', { name: 'Finish' }).click()
    await expect(page.getByLabel('Daily streak')).toHaveText('🔥 Daily streak: 4 days · 🧊 streak saver covered a missed day')
  })
  test('two missed days start the streak again', async ({ page }) => {
    await page.addInitScript((last) => {
      if (!localStorage.getItem('plotmix_dstreak')) localStorage.setItem('plotmix_dstreak', JSON.stringify({ count: 3, best: 3, lastDay: last, saverWeek: null }))
    }, dayNumber(2026, 10, 11))
    await pinDailyDate(page)
    await openMenu(page)
    await startMode(page, 'daily')
    const card = await currentCard(page, 'daily')
    await submitGuess(page, card.mashedTitle)
    await page.getByRole('button', { name: 'Finish' }).click()
    await expect(page.getByLabel('Daily streak')).toHaveText('🔥 Daily streak: 1 day')
  })
})

test.describe('K. A softer first game', () => {
  test("a new player's first Standard card is Easy", async ({ page }) => {
    await openMenu(page)
    await startMode(page, 'standard')
    expect((await currentCard(page, 'standard')).difficulty).toBe('Easy')
  })
})

test.describe("L. Director's Whisper hint", () => {
  test('costs 2 points and never shows a title word', async ({ page }) => {
    await resumeStandardWithCards(page, [11]) // any card with a written clue
    await page.getByRole('button', { name: 'Open hints' }).click()
    await page.getByRole('button', { name: /Director's Whisper/ }).click()
    await page.getByRole('button', { name: 'Close hints' }).click()
    await expect(page.getByText('PTS: 8')).toBeVisible()
  })
  test('title words in the clue are blanked', async ({ page }) => {
    const { readDeck } = await import('./helpers.js')
    const card = readDeck().find((c) => c.movies.includes('Dirty Harry'))
    await resumeStandardWithCards(page, [card.id])
    await page.getByRole('button', { name: 'Open hints' }).click()
    await page.getByRole('button', { name: /Director's Whisper/ }).click()
    const text = await page.getByLabel("Director's Whisper").textContent()
    expect(text).toContain('▢')
    expect(text.toLowerCase()).not.toContain('harry')
  })
})

test.describe('Arcade side-quest: Popcorn Panic', () => {
  test('locked until there are 5 stubs', async ({ page }) => {
    await openMenu(page)
    await page.getByRole('button', { name: 'Arcade' }).click()
    await expect(page.getByRole('button', { name: 'Play Popcorn Panic' })).toBeDisabled()
    await expect(page.getByLabel('Stubs to spend')).toHaveText('You have 1 🎟️. Solve 4 more cards to play')
  })

  test('a game costs 5 stubs, lasts 20 seconds and awards a prize', async ({ page }) => {
    test.setTimeout(60_000)
    await page.addInitScript(() => { if (!localStorage.getItem('plotmix_stubs')) localStorage.setItem('plotmix_stubs', JSON.stringify({ earned: 6, spent: 0 })) })
    await openMenu(page)
    await page.getByRole('button', { name: 'Arcade' }).click()
    await page.getByRole('button', { name: 'Play Popcorn Panic' }).click()
    const end = Date.now() + 22_000
    while (Date.now() < end && !(await page.getByRole('status').count())) {
      const k = page.getByRole('button', { name: 'Catch popcorn' })
      if (await k.count()) await k.first().dispatchEvent('pointerdown').catch(() => {})
      await page.waitForTimeout(80)
    }
    await expect(page.getByRole('status')).toContainText(/Reel!/)
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('plotmix_stubs')))).toEqual({ earned: 6, spent: 5 })
    const prizes = await page.evaluate(() => JSON.parse(localStorage.getItem('plotmix_prizes')))
    expect(prizes.won.length).toBe(1)
    await page.getByRole('button', { name: 'Back to the arcade' }).click()
    await page.getByRole('button', { name: 'Back' }).click()
    await page.getByRole('button', { name: 'Film Vault' }).click()
    await expect(page.getByRole('button', { name: /Curtains: (Midnight Blue|Emerald|Gold Lamé)$/ })).toBeEnabled()
  })
})
