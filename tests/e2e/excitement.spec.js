// Tests for the owner's 2026-10-22 requests: jump to the letters after a guess, and the
// research-based excitement features (Tier 1-3) plus the arcade side-quest.
import { test, expect } from '@playwright/test'
import {
  openMenu, startMode, submitGuess, guessInput, currentCard, pinDailyDate, resumeStandardWithCards, waitForSave,
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
  // A fixed sequence of "random" numbers makes the falling pieces repeatable.
  async function seedRandom(page) {
    await page.addInitScript(() => {
      let a = 12345
      Math.random = () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
    })
  }
  async function startGame(page, passes = 1) {
    await page.addInitScript((n) => { if (localStorage.getItem('plotmix_arcade_passes') === null) localStorage.setItem('plotmix_arcade_passes', String(n)) }, passes)
    await openMenu(page)
    await page.getByRole('button', { name: 'Arcade' }).click()
    await page.getByRole('button', { name: 'Play Popcorn Panic' }).click()
  }
  const piece = (page, name) => page.getByRole('button', { name, exact: true }).first()
  async function catchPopcorn(page, n) {
    for (let i = 0; i < n; i++) {
      await expect(piece(page, 'Popcorn')).toBeAttached({ timeout: 10_000 })
      await piece(page, 'Popcorn').dispatchEvent('pointerdown')
    }
  }
  async function loseAllLives(page) {
    while (!(await page.getByLabel('Arcade result').count())) {
      const bad = page.getByRole('button', { name: /^(Burnt popcorn|Unpopped kernel)$/ }).first()
      if (await bad.count()) await bad.dispatchEvent('pointerdown').catch(() => {})
      await page.waitForTimeout(60)
    }
  }

  test('locked until earned, with no rules or prize list up front', async ({ page }) => {
    await openMenu(page)
    await page.getByRole('button', { name: 'Arcade' }).click()
    await expect(page.getByRole('button', { name: 'Play Popcorn Panic' })).toBeDisabled()
    await expect(page.getByLabel('Arcade passes')).toHaveText('🔒 Keep solving mashups to unlock a play')
    await expect(page.getByText(/Burnt popcorn|Reel|Free Hint|points:/)).toHaveCount(0)
  })

  async function solveFiveInARow(page) {
    const { readDeck } = await import('./helpers.js')
    const ids = [77, 1, 2, 3, 11]
    const deck = readDeck()
    await resumeStandardWithCards(page, ids)
    for (const id of ids) {
      await submitGuess(page, deck.find((c) => c.id === id).mashedTitle)
      await page.getByRole('button', { name: 'Next' }).click()
    }
  }

  test('5 in a row offers Popcorn Panic; keep guessing saves the play for later', async ({ page }) => {
    await solveFiveInARow(page)
    await expect(page.getByRole('dialog', { name: 'Popcorn Panic offer' })).toBeVisible()
    await page.getByRole('button', { name: 'Keep guessing' }).click()
    await waitForSave(page, 'standard', (s) => s.cardIdx === 5)
    expect(await page.evaluate(() => localStorage.getItem('plotmix_arcade_passes'))).toBe('1')
  })

  test('playing from the offer starts the game at once and returns to the next card', async ({ page }) => {
    await seedRandom(page)
    await solveFiveInARow(page)
    await page.getByRole('button', { name: '🍿 Play Popcorn Panic' }).click()
    await expect(page.getByLabel('Lives: 3')).toBeVisible()
    await loseAllLives(page)
    await page.getByRole('button', { name: 'Back to the game' }).click()
    await waitForSave(page, 'standard', (s) => s.cardIdx === 5)
    await expect(guessInput(page)).toBeEnabled()
    expect(await page.evaluate(() => localStorage.getItem('plotmix_arcade_passes'))).toBe('0')
  })

  test('pieces look like popcorn, burnt popcorn, unpopped kernels and chocolate candies', async ({ page }) => {
    await seedRandom(page)
    await startGame(page)
    for (const name of ['Popcorn', 'Burnt popcorn', 'Unpopped kernel', 'Chocolate candy']) {
      await expect(piece(page, name)).toBeAttached({ timeout: 20_000 })
    }
  })

  test('endless: it speeds up every 5 seconds and ends when the lives run out', async ({ page }) => {
    await seedRandom(page)
    await startGame(page)
    await expect(page.getByLabel('Level 1')).toBeVisible()
    await expect(page.getByLabel('Level 2')).toBeVisible({ timeout: 7_000 })
    await expect(page.getByLabel('Lives: 3')).toBeVisible()
    await loseAllLives(page)
    await expect(page.getByLabel('Arcade result')).toContainText('Out of lives on level')
    // No paying to play again: the only way out is Done, and the play is used up.
    await expect(page.getByRole('button', { name: /play again/i })).toHaveCount(0)
    await page.getByRole('button', { name: 'Done' }).click()
    await page.getByRole('button', { name: 'Arcade' }).click()
    await expect(page.getByRole('button', { name: 'Play Popcorn Panic' })).toBeDisabled()
  })

  test('quick catches build a combo, and 10 in a row starts a Popcorn Frenzy', async ({ page }) => {
    await seedRandom(page)
    await startGame(page)
    await catchPopcorn(page, 5)
    await expect(page.getByLabel('Combo ×2')).toBeVisible()
    await catchPopcorn(page, 5)
    await expect(page.getByLabel('Arcade event')).toHaveText('🍿 POPCORN FRENZY!')
    await expect(page.getByLabel('Combo ×3')).toBeVisible()
  })

  test('a chocolate candy gives a boost', async ({ page }) => {
    await seedRandom(page)
    await startGame(page)
    await expect(piece(page, 'Chocolate candy')).toBeAttached({ timeout: 20_000 })
    await piece(page, 'Chocolate candy').dispatchEvent('pointerdown')
    await expect(page.getByLabel('Arcade event')).toContainText('🍫')
  })

  test('a winning score earns a power-up and a new record is celebrated', async ({ page }) => {
    test.setTimeout(60_000)
    await seedRandom(page)
    await startGame(page)
    await catchPopcorn(page, 6) // 1+1+1+1+2+2 = 8 points: Bronze
    await loseAllLives(page)
    await expect(page.getByLabel('New record')).toBeVisible()
    await expect(page.getByLabel('Arcade result')).toContainText(/Reel!/)
    const power = await page.evaluate(() => JSON.parse(localStorage.getItem('plotmix_powerups')))
    expect(power.hint + power.peek).toBeGreaterThan(0)
    await page.getByRole('button', { name: 'Done' }).click()
    await page.getByRole('button', { name: 'Film Vault' }).click()
    await expect(page.getByRole('button', { name: /Curtains: (Midnight Blue|Emerald|Gold Lamé)$/ })).toBeEnabled()
  })
})

test.describe('Arcade power-ups in the main game', () => {
  const seed = (page, p) => page.addInitScript((v) => { if (!localStorage.getItem('plotmix_powerups')) localStorage.setItem('plotmix_powerups', JSON.stringify(v)) }, p)
  const shownLetters = (page) => page.evaluate(() => [...document.querySelectorAll('[aria-label="Title letters"] div')]
    .filter((d) => d.children.length === 0 && /^[a-z0-9]$/i.test(d.textContent)).map((d) => d.textContent).join(''))

  test('a Free Hint reveals the next hint without costing points, once', async ({ page }) => {
    await seed(page, { hint: 1, peek: 0 })
    await resumeStandardWithCards(page, [77])
    await page.getByRole('button', { name: 'Open hints' }).click()
    await page.getByRole('button', { name: 'Use a Free Hint (1 left)' }).click()
    await expect(page.getByRole('button', { name: /Year & Genre.*✓/ })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Use a Free Hint (0 left)' })).toBeDisabled()
    await page.getByRole('button', { name: 'Close hints' }).click()
    await expect(page.getByText('PTS: 10')).toBeVisible()
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('plotmix_powerups')))).toEqual({ hint: 0, peek: 0 })
  })

  test('a Popcorn Peek fills in every third letter', async ({ page }) => {
    await seed(page, { hint: 0, peek: 1 })
    await resumeStandardWithCards(page, [77]) // The Nightmare Before Christmas Story
    expect(await shownLetters(page)).toBe('')
    await page.getByRole('button', { name: 'Open hints' }).click()
    await page.getByRole('button', { name: 'Use a Popcorn Peek (1 left)' }).click()
    await page.getByRole('button', { name: 'Close hints' }).click()
    // the 3rd, 6th, 9th... letter of the title
    const letters = 'TheNightmareBeforeChristmasStory'.split('').filter((_, i) => (i + 1) % 3 === 0).join('')
    await expect.poll(() => shownLetters(page)).toBe(letters)
    await expect(page.getByText('PTS: 10')).toBeVisible()
  })

  test('power-ups are not offered in the Daily', async ({ page }) => {
    await seed(page, { hint: 2, peek: 2 })
    await pinDailyDate(page)
    await openMenu(page)
    await startMode(page, 'daily')
    await page.getByRole('button', { name: 'Open hints' }).click()
    await expect(page.getByRole('button', { name: /Use a Free Hint/ })).toHaveCount(0)
  })
})
