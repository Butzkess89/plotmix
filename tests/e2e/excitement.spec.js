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

test.describe('F. Popcorn Panic on the menu', () => {
  test('sits under Speed Run as a popcorn bucket, with no Film Vault', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('plotmix_arcade_passes', '2'))
    await openMenu(page)
    const btn = page.getByRole('button', { name: 'Popcorn Panic', exact: true })
    await expect(btn).toContainText('2 plays')
    const speed = await page.getByRole('button', { name: 'Speed Run' }).boundingBox()
    const box = await btn.boundingBox()
    expect(box.y).toBeGreaterThan(speed.y + speed.height - 1)
    await expect(page.getByRole('button', { name: 'Film Vault' })).toHaveCount(0)
    await btn.click()
    await expect(page.getByLabel('Arcade passes')).toHaveText('You have 2 plays')
  })
})

test.describe('Menu layout', () => {
  for (const height of [874, 700, 640]) {
    test(`the T-rex never overlaps a menu button (402×${height}, saved game)`, async ({ page }) => {
      await page.setViewportSize({ width: 402, height })
      await resumeStandardWithCards(page, [77])
      await submitGuess(page, 'zzqxwrong')
      await waitForSave(page, 'standard', (st) => st.guesses.length === 1)
      await openMenu(page) // reload: the saved game puts Resume Game on the menu
      await expect(page.getByRole('button', { name: 'Resume Game' })).toBeVisible()
      const rex = await page.locator('img[src="/stickers/Happy.webp"]').boundingBox()
      const pop = await page.getByRole('button', { name: 'Popcorn Panic', exact: true }).boundingBox()
      const resume = await page.getByRole('button', { name: 'Resume Game' }).boundingBox()
      expect(rex.height).toBeGreaterThan(60)
      expect(rex.y).toBeGreaterThanOrEqual(pop.y + pop.height)
      expect(rex.y + rex.height).toBeLessThanOrEqual(resume.y)
    })
  }
})

test.describe('Popcorn Panic test link', () => {
  test('?popcorn on a test build opens Popcorn Panic with 3 plays', async ({ page }) => {
    await page.goto('/?popcorn')
    await expect(page.getByLabel('Arcade passes')).toHaveText('You have 3 plays')
    await page.getByRole('button', { name: 'Play Popcorn Panic' }).click()
    await expect(page.getByLabel('Popcorn arena')).toBeVisible()
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
    await page.getByRole('button', { name: 'Popcorn Panic', exact: true }).click()
    await page.getByRole('button', { name: 'Play Popcorn Panic' }).click()
  }
  // Pieces fall; the player slides the popcorn box (it follows the pointer) under them.
  const piece = (page, name) => page.getByRole('img', { name, exact: true }).first()
  // The lowest piece of these kinds that hasn't yet reached the box.
  async function lowest(page, names) {
    return page.evaluate((ns) => {
      const arena = document.querySelector('[aria-label="Popcorn arena"]')
      if (!arena) return null
      const catchLine = arena.getBoundingClientRect().bottom - 70
      const els = [...document.querySelectorAll('[role="img"]')].filter((e) => ns.includes(e.getAttribute('aria-label')))
        .map((e) => e.getBoundingClientRect()).filter((r) => r.top + r.height / 2 < catchLine)
      if (!els.length) return null
      const r = els.sort((a, b) => b.top - a.top)[0]
      return { x: r.left + r.width / 2 }
    }, names)
  }
  async function moveBoxUnder(page, names) {
    const target = await lowest(page, names)
    if (target) await page.mouse.move(target.x, 760)
  }
  const score = async (page) => Number((await page.getByLabel(/^Score: \d+$/).getAttribute('aria-label')).split(': ')[1])
  async function catchPopcorn(page, n) {
    const end = Date.now() + 25_000
    while ((await score(page)) < n && Date.now() < end) { await moveBoxUnder(page, ['Popcorn']); await page.waitForTimeout(40) }
  }
  async function loseAllLives(page) {
    const end = Date.now() + 40_000
    while (!(await page.getByLabel('Arcade result').count()) && Date.now() < end) {
      await moveBoxUnder(page, ['Burnt popcorn', 'Unpopped kernel']); await page.waitForTimeout(40)
    }
  }

  test('locked until earned, with no rules or prize list up front', async ({ page }) => {
    await openMenu(page)
    await page.getByRole('button', { name: 'Popcorn Panic', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Play Popcorn Panic' })).toBeDisabled()
    await expect(page.getByLabel('Arcade passes')).toHaveText('🔒 Solve 5 mashups in a row in Standard or Speed Run to unlock a play')
    await expect(page.getByText(/Burnt popcorn|Reel|Free Hint|points:/)).toHaveCount(0)
  })

  async function solveFiveInARow(page) {
    const { readDeck } = await import('./helpers.js')
    const ids = [77, 1, 2, 3, 11]
    const deck = readDeck()
    await resumeStandardWithCards(page, ids)
    for (const [i, id] of ids.entries()) {
      await submitGuess(page, deck.find((c) => c.id === id).mashedTitle)
      if (i < 4) await page.getByRole('button', { name: 'Next' }).click()
    }
  }

  test('5 in a row offers Popcorn Panic; continuing saves the play for later', async ({ page }) => {
    await solveFiveInARow(page)
    // The offer appears with the result and stays until the player chooses.
    const offer = page.getByRole('dialog', { name: 'Popcorn Panic offer' })
    await expect(offer).toBeVisible()
    await page.waitForTimeout(4000)
    await expect(offer).toBeVisible()
    await expect(offer).toContainText("You've solved 5 PlotMixes in a row!")
    await expect(offer).toContainText('Badge unlocked: Box Office Smash')
    await expect(page.getByRole('button', { name: /Play Popcorn Panic to win hidden prizes/ })).toBeVisible()
    // Continuing goes straight on to the next PlotMix.
    await page.getByRole('button', { name: 'Continue to the next PlotMix' }).click()
    await waitForSave(page, 'standard', (s) => s.cardIdx === 5)
    await expect(offer).toHaveCount(0)
    expect(await page.evaluate(() => localStorage.getItem('plotmix_arcade_passes'))).toBe('1')
  })

  test('playing from the offer starts the game at once and returns to the next card', async ({ page }) => {
    await seedRandom(page)
    await solveFiveInARow(page)
    await page.getByRole('button', { name: /^🍿 Play Popcorn Panic/ }).click()
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
    await expect(page.getByRole('img', { name: 'Popcorn box' })).toBeVisible()
  })

  // Fix Math.random so every piece is the same kind and falls in the same spot
  // (0.1 = popcorn, 0.7 = burnt popcorn, 0.95 = chocolate candy; others below).
  const fixRandom = (page, v) => page.evaluate((x) => { Math.random = () => x }, v)
  const fixRandomOnLoad = (page, v) => page.addInitScript((x) => { Math.random = () => x }, v)
  async function holdBoxUnderFirst(page, name) {
    const p = typeof name === 'string' ? piece(page, name) : page.getByRole('img', { name }).first()
    await expect(p).toBeAttached({ timeout: 10_000 })
    const box = await p.boundingBox()
    await page.mouse.move(box.x + box.width / 2, 760)
  }
  const BAD = /^(Burnt popcorn|Unpopped kernel)$/

  test('it speeds up every 5 seconds and ends when the lives run out', async ({ page }) => {
    await fixRandomOnLoad(page, 0.1)
    await startGame(page)
    await holdBoxUnderFirst(page, 'Popcorn')
    await expect(page.getByLabel('Level 1')).toBeVisible()
    await expect(page.getByLabel('Level 2')).toBeVisible({ timeout: 7_000 })
    await expect(page.getByLabel('Level up: 2')).toContainText('Faster!') // each new level is announced
    await expect(page.getByLabel('Lives: 3')).toBeVisible()
    await fixRandom(page, 0.7) // from now on only bad pieces, all falling in one spot
    await holdBoxUnderFirst(page, BAD)
    await expect(page.getByLabel('Arcade result')).toContainText('Out of lives on level', { timeout: 20_000 })
    // No paying to play again: the only way out is Done, and the play is used up.
    await expect(page.getByRole('button', { name: /play again/i })).toHaveCount(0)
    await page.getByRole('button', { name: 'Done' }).click()
    await page.getByRole('button', { name: 'Popcorn Panic', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Play Popcorn Panic' })).toBeDisabled()
  })

  test('popcorn caught in a row builds a combo; 15 in a row starts a Popcorn Frenzy', async ({ page }) => {
    await fixRandomOnLoad(page, 0.1)
    await startGame(page)
    await holdBoxUnderFirst(page, 'Popcorn')
    await expect(page.getByLabel('Combo ×2')).toBeVisible({ timeout: 15_000 })
    await expect(page.getByLabel('Combo ×3')).toBeVisible({ timeout: 15_000 })
    await expect(page.getByLabel('Arcade event')).toHaveText('🍿 POPCORN FRENZY!', { timeout: 15_000 })
  })

  test('a Popcorn Frenzy cannot set off the next one (owner report: it went on forever)', async ({ page }) => {
    await fixRandomOnLoad(page, 0.1)
    await page.addInitScript(() => {
      window.__frenzies = 0
      new MutationObserver(() => {
        const el = document.querySelector('[aria-label="Arcade event"]')
        const key = el && el.textContent.includes('FRENZY') ? el : null
        if (key && key !== window.__lastFrenzy) { window.__frenzies++; window.__lastFrenzy = key }
      }).observe(document, { subtree: true, childList: true })
    })
    await startGame(page)
    await holdBoxUnderFirst(page, 'Popcorn')
    await expect.poll(() => page.evaluate(() => window.__frenzies), { timeout: 20_000 }).toBe(1)
    // The frenzy lasts 2.5 s and the next needs another 15 in a row after it ends.
    await page.waitForTimeout(4_000)
    expect(await page.evaluate(() => window.__frenzies)).toBe(1)
  })

  test('each play is on a 45-second timer', async ({ page }) => {
    test.setTimeout(90_000)
    await fixRandomOnLoad(page, 0.1) // everything falls far from the box, so no lives are lost
    await startGame(page)
    await expect(page.getByLabel('Time left: 45')).toBeVisible()
    await expect(page.getByLabel('Time left: 40')).toBeVisible({ timeout: 7_000 })
    await expect(page.getByLabel('Arcade result')).toContainText("Time's up!", { timeout: 45_000 })
    await expect(page.getByLabel('Lives: 3')).toBeVisible()
  })

  test('tapping fires the laser: a bad piece explodes for points and a charge is used', async ({ page }) => {
    await fixRandomOnLoad(page, 0.7)
    await startGame(page)
    await expect(page.getByLabel('Laser charges: 3')).toBeVisible()
    const p = piece(page, 'Burnt popcorn')
    await expect(p).toBeAttached({ timeout: 10_000 })
    const box = await p.boundingBox()
    await page.mouse.click(box.x + box.width / 2, 800)
    await expect(page.locator('[data-boom]').first()).toBeAttached()
    await expect(page.getByLabel('Arcade event')).toHaveText('💥 Zapped! +2')
    await expect(page.getByLabel('Laser charges: 2')).toBeVisible()
    await expect(page.getByLabel('Lives: 3')).toBeVisible()
    expect(await score(page)).toBe(2)
  })

  test('the laser runs dry after 3 quick shots, then recharges', async ({ page }) => {
    await fixRandomOnLoad(page, 0.1)
    await startGame(page)
    for (let i = 0; i < 4; i++) await page.mouse.click(300, 800)
    await expect(page.getByLabel('Laser charges: 0')).toBeVisible()
    await expect(page.getByLabel('Arcade event')).toHaveText('🔋 Laser recharging…')
    await expect(page.getByLabel('Laser charges: 1')).toBeVisible({ timeout: 4_000 })
  })

  // Level 1 odds put each fixed random value on one kind of piece.
  for (const [v, name, event] of [
    [0.46, 'Movie ticket', /Golden seat! \+5/],
    [0.5, 'Film reel', /Film reel! \+3/],
    [0.88, 'Ringing phone', /Phones off in the theatre! −1 life/],
    [0.975, '3D glasses', /slow motion/],
    [0.99, 'Clapperboard', /Action! Laser fully charged/],
  ]) {
    test(`cinema extras: catching a ${name.toLowerCase()}`, async ({ page }) => {
      // Record every message shown: with only bad pieces falling, the game can end (and the
      // message vanish) within a second.
      await page.addInitScript(() => {
        window.__events = []
        new MutationObserver(() => {
          const el = document.querySelector('[aria-label="Arcade event"]')
          if (el && window.__events[window.__events.length - 1] !== el.textContent) window.__events.push(el.textContent)
        }).observe(document, { subtree: true, childList: true, characterData: true })
      })
      await fixRandomOnLoad(page, v)
      await startGame(page)
      await holdBoxUnderFirst(page, name)
      await expect.poll(() => page.evaluate(() => window.__events.join(' | ')), { timeout: 10_000 }).toMatch(event)
    })
  }

  test('vampire bats swoop from side to side', async ({ page }) => {
    await fixRandomOnLoad(page, 0.92)
    await startGame(page)
    const bat = piece(page, 'Vampire bat')
    await expect(bat).toBeAttached({ timeout: 10_000 })
    const x1 = (await bat.boundingBox()).x
    await page.waitForTimeout(400)
    const x2 = (await bat.boundingBox()).x
    expect(Math.abs(x2 - x1)).toBeGreaterThan(5)
  })

  test('catching burnt popcorn costs a life and breaks the combo', async ({ page }) => {
    // Record every lives value shown: on a slow phone several bad pieces can land between
    // two checks, so "Lives: 2" may only be on screen for a moment.
    await page.addInitScript(() => {
      window.__lives = []
      new MutationObserver(() => {
        const el = document.querySelector('[aria-label^="Lives: "]')
        const n = el && Number(el.getAttribute('aria-label').slice(7))
        if (el && window.__lives[window.__lives.length - 1] !== n) window.__lives.push(n)
      }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['aria-label'] })
    })
    await fixRandomOnLoad(page, 0.1)
    await startGame(page)
    await holdBoxUnderFirst(page, 'Popcorn')
    await expect(page.getByLabel('Combo ×2')).toBeVisible({ timeout: 15_000 })
    await fixRandom(page, 0.7)
    await holdBoxUnderFirst(page, BAD)
    await expect.poll(() => page.evaluate(() => window.__lives), { timeout: 10_000 }).toEqual(expect.arrayContaining([3, 2]))
    expect((await page.evaluate(() => window.__lives)).slice(0, 2)).toEqual([3, 2]) // one life per bad piece
    await expect(page.getByLabel('Combo ×2')).toHaveCount(0)
  })

  test('a chocolate candy caught in the box gives a boost', async ({ page }) => {
    await fixRandomOnLoad(page, 0.95)
    await startGame(page)
    await holdBoxUnderFirst(page, 'Chocolate candy')
    await expect(page.getByLabel('Arcade event')).toContainText('🍫', { timeout: 10_000 })
  })

  test('a winning score earns a power-up and a new record is celebrated', async ({ page }) => {
    await fixRandomOnLoad(page, 0.1)
    await startGame(page)
    await holdBoxUnderFirst(page, 'Popcorn')
    await expect.poll(() => score(page), { timeout: 25_000 }).toBeGreaterThanOrEqual(40)
    await fixRandom(page, 0.7)
    await holdBoxUnderFirst(page, BAD)
    await expect(page.getByLabel('Arcade result')).toBeVisible({ timeout: 20_000 })
    await expect(page.getByLabel('New record')).toBeVisible()
    await expect(page.getByLabel('Arcade result')).toContainText(/Reel!/)
    const power = await page.evaluate(() => JSON.parse(localStorage.getItem('plotmix_powerups')))
    expect(power.hint + power.peek).toBeGreaterThan(0)
    await page.getByRole('button', { name: 'Done' }).click()
    await page.getByRole('button', { name: 'Popcorn Panic', exact: true }).click()
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

test.describe('Win sticker clips', () => {
  // The popcorn sticker was cut off because its listed length (2.1 s) was shorter than the clip (3.7 s).
  test('listed clip lengths match the real video files', () => {
    const { readFileSync } = require('node:fs')
    const { join } = require('node:path')
    const src = readFileSync(join(process.cwd(), 'PlotMix.jsx'), 'utf8')
    const listed = [...src.matchAll(/\{ src: "(\/stickers\/[a-z]+\.mp4)", durationMs: (\d+) \}/g)]
    expect(listed.length).toBe(2)
    for (const [, file, ms] of listed) {
      const d = readFileSync(join(process.cwd(), 'public', file))
      const i = d.indexOf('mvhd')
      const seconds = d.readUInt32BE(i + 16 + 4) / d.readUInt32BE(i + 16)
      expect(Math.abs(Number(ms) / 1000 - seconds)).toBeLessThan(0.1)
    }
  })
})

test.describe('Owner fixes 2026-10-25', () => {
  test('solving word by word turns the letters green with the flip', async ({ page }) => {
    await resumeStandardWithCards(page, [77])
    for (const w of ['Nightmare', 'Before', 'Christmas', 'Story']) await submitGuess(page, w)
    await expect.poll(() => page.evaluate(() => [...document.querySelectorAll('[aria-label="Title letters"] div')]
      .filter((d) => /tileWinFlip/.test(d.style.animation)).length)).toBeGreaterThan(20)
    await page.waitForTimeout(1300)
    const colours = await page.evaluate(() => [...new Set([...document.querySelectorAll('[aria-label="Title letters"] div')]
      .filter((d) => d.children.length === 0 && d.textContent).map((d) => getComputedStyle(d).color))])
    expect(colours).toEqual(['rgb(21, 128, 61)'])
  })

  test('"in a row" drops to 0 as soon as a card is lost, then counts again', async ({ page }) => {
    await resumeStandardWithCards(page, [77, 1, 2])
    await submitGuess(page, 'The Nightmare Before Christmas Story')
    await expect(page.getByLabel('Streak: 1')).toBeVisible()
    await page.getByRole('button', { name: 'Next' }).click()
    for (let i = 0; i < 6; i++) await submitGuess(page, `zzqxwrong${'abcdef'[i]}`)
    await expect(page.getByLabel('Streak: 0')).toBeVisible() // already on the lost card's result
    await page.getByRole('button', { name: 'Next' }).click()
    await submitGuess(page, '13 Going on 30 Days of Night')
    await expect(page.getByLabel('Streak: 1')).toBeVisible()
  })
})
