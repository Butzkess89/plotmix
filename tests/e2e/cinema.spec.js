// Tests for the cinema extras (owner request 2026-10-21): animations, jokes, badges, sounds.
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  openMenu, startMode, submitGuess, guessInput, currentCard, pinDailyDate, resumeStandardWithCards, waitForSave, readDeck, continueToCard,
  tapSymbol,
} from './helpers.js'

const nextButton = (page) => page.getByRole('button', { name: 'Next' })
const readBadges = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('plotmix_badges') || '[]'))

async function finishDailyPerfectly(page) {
  await pinDailyDate(page)
  await openMenu(page)
  await startMode(page, 'daily')
  const card = await currentCard(page, 'daily')
  await submitGuess(page, card.mashedTitle)
  await page.getByRole('button', { name: 'Finish' }).click()
  await expect(page.getByText('The End')).toBeVisible()
}

test.describe('Speed Run film-leader countdown', () => {
  test('counts 3-2-1 before the clock starts, then typing is allowed', async ({ page }) => {
    await openMenu(page)
    await page.getByRole('button', { name: 'Speed Run' }).click()
    await expect(page.getByRole('status', { name: 'Countdown' })).toBeVisible()
    await expect(guessInput(page)).toBeDisabled()
    await page.waitForTimeout(1_200)
    await expect(page.getByText('1:00')).toBeVisible() // clock has not started
    await expect(guessInput(page)).toBeEnabled({ timeout: 5_000 })
    await expect(page.getByRole('status', { name: 'Countdown' })).toHaveCount(0)
  })
})

test.describe('Clapperboard on a wrong guess', () => {
  test('shows the next take number with a director\'s note', async ({ page }) => {
    await resumeStandardWithCards(page, [77])
    await submitGuess(page, 'zzqxwrong')
    await expect(page.getByText('Take 2')).toBeVisible()
    await submitGuess(page, 'zzqxwrongb')
    await expect(page.getByText('Take 3')).toBeVisible()
  })
})

test.describe('Popcorn streak meter', () => {
  test('fills as cards are solved in a row', async ({ page }) => {
    await resumeStandardWithCards(page, [77, 1])
    await expect(page.getByLabel('Streak: 0')).toBeVisible() // shown empty from the start (owner request 2026-10-25)
    await expect(page.getByText('0 in a row')).toBeVisible()
    await submitGuess(page, 'The Nightmare Before Christmas')
    await submitGuess(page, 'A Christmas Story')
    await nextButton(page).click()
    await waitForSave(page, 'standard', (s) => s.cardIdx === 1)
    await expect(page.getByLabel('Streak: 1')).toBeVisible()
    await expect(page.getByText('1 in a row')).toBeVisible()
  })
})

test.describe('Typing box on phones', () => {
  test('is not flagged as a password field and the page resizes above the keyboard', async ({ page }) => {
    await resumeStandardWithCards(page, [77])
    await expect(guessInput(page)).toHaveAttribute('autocomplete', 'off')
    expect(await page.locator('meta[name="viewport"]').getAttribute('content')).toContain('interactive-widget=resizes-content')
  })
})

test.describe('Skip confirmation joke', () => {
  test('asks whether you want to walk out of the theatre', async ({ page }) => {
    await resumeStandardWithCards(page, [77])
    await page.getByRole('button', { name: 'Skip card' }).click()
    await expect(page.getByText('Walk out of the theatre? No refunds.')).toBeVisible()
  })
})

test.describe('Badges', () => {
  test('a first no-hint solve unlocks Director\'s Cut, once', async ({ page }) => {
    await resumeStandardWithCards(page, [77])
    await submitGuess(page, 'The Nightmare Before Christmas Story')
    await expect(page.getByText("Badge unlocked: Director's Cut")).toBeVisible()
    expect(await readBadges(page)).toEqual(['directorsCut'])
  })

  test('solving on the last guess unlocks Plot Twist', async ({ page }) => {
    await resumeStandardWithCards(page, [77])
    for (let i = 0; i < 5; i++) await submitGuess(page, `zzqxwrong${'abcde'[i]}`)
    await submitGuess(page, 'The Nightmare Before Christmas Story')
    await expect(page.getByText('Badge unlocked: Plot Twist')).toBeVisible()
    expect(await readBadges(page)).toContain('plotTwist')
  })
})

test.describe('End screen extras', () => {
  test('each fact shows once: a Daily has one 🔥 (the Daily streak), no Skip tile and no "best run" (owner request 2026-10-28)', async ({ page }) => {
    await finishDailyPerfectly(page)
    await expect(page.getByRole('button', { name: /^Daily streak/ })).toHaveCount(1)
    await expect(page.getByRole('button', { name: /^Best run in a row/ })).toHaveCount(0)
    await expect(page.getByRole('button', { name: /^Skipped/ })).toHaveCount(0)
    await expect(page.getByRole('button', { name: /Popcorn Panic play/ })).toHaveCount(0) // none saved: nothing to show
    // The post-credits ticket has its own symbol, not the Director's Cut clapperboard.
    const ticket = page.getByRole('button', { name: /^Post-credits scene/ })
    await expect(ticket).toBeVisible({ timeout: 9_000 })
    await expect(ticket).toContainText('🎟️')
  })

  test('Standard keeps its run tiles: Skipped and best run in a row, and no Daily streak', async ({ page }) => {
    await openMenu(page)
    await startMode(page, 'standard')
    for (let i = 0; i < 6; i++) { // six skips use up the hearts and end the run
      await page.getByRole('button', { name: 'Skip card' }).click()
      await page.getByRole('button', { name: 'Skip It' }).click()
      await page.getByRole('button', { name: /^(Next|Finish)$/ }).click()
    }
    await expect(page.getByText('The End')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Skipped: 6' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Best run in a row: 0' })).toBeVisible()
    await expect(page.getByRole('button', { name: /^Daily streak/ })).toHaveCount(0)
  })

  test('Home is a little cinema, not a clapperboard (owner request 2026-10-28)', async ({ page }) => {
    await finishDailyPerfectly(page)
    const home = page.getByRole('button', { name: 'Home', exact: true })
    await expect(home).toBeVisible()
    await expect(home).not.toContainText('🎬')
    await expect(home.locator('svg text')).toHaveText('CINEMA')
  })

  test('the end screen shows symbols, not sentences; tapping one says what it is (owner request 2026-10-28)', async ({ page }) => {
    await page.addInitScript(() => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('plotmix_arcade_passes', '2'); sessionStorage.setItem('seeded', '1') } })
    await finishDailyPerfectly(page)
    const info = page.getByRole('status', { name: 'Symbol info' })
    await expect(info).toHaveText('')
    for (const gone of ['Popcorn Panic plays saved', 'Daily streak:', 'Perfect Dailies in a row:', 'Tap one to see how to earn it']) {
      await expect(page.getByText(gone)).toHaveCount(0)
    }
    await expect(await tapSymbol(page, 'Solved: 1')).toHaveText('Solved: 1')
    await expect(await tapSymbol(page, /Popcorn Panic play/)).toHaveText('2 Popcorn Panic plays saved')
    await expect(await tapSymbol(page, "Badge: Director's Cut")).toContainText("Director's Cut")
    await page.getByRole('button', { name: "Badge: Director's Cut" }).click() // tapping again hides it
    await expect(info).toHaveText('')
  })

  test('the credits roll like a film: bold white names on a see-through black screen (owner request 2026-10-28)', async ({ page }) => {
    await finishDailyPerfectly(page)
    const credits = page.getByLabel('Credits', { exact: true })
    await expect(credits).toBeVisible()
    const look = await credits.evaluate((el) => {
      const bg = getComputedStyle(el).backgroundColor.match(/[\d.]+/g).map(Number)
      const name = el.querySelector('[data-credit-name]')
      const n = getComputedStyle(name)
      return { bg, weight: Number(n.fontWeight), color: n.color, size: parseFloat(n.fontSize) }
    })
    expect(look.bg.slice(0, 3)).toEqual([0, 0, 0])
    expect(look.bg[3]).toBeGreaterThan(0.5)
    expect(look.bg[3]).toBeLessThan(0.95)
    expect(look.weight).toBeGreaterThanOrEqual(800)
    expect(look.color).toBe('rgb(255, 255, 255)')
    expect(look.size).toBeGreaterThanOrEqual(15)
  })

  test('a perfect Daily is rated G, reviewed and credited, with the badge on the shelf', async ({ page }) => {
    await finishDailyPerfectly(page)
    await expect(page.getByLabel("Rated G: Got 'Em All")).toBeVisible()
    await expect(page.getByLabel('5 out of 5 stars')).toBeVisible()
    await expect(page.getByLabel('Credits')).toContainText('Starring')
    await expect(page.getByLabel('Credits')).toContainText('No films were harmed in the making of this mashup.')
    await expect(page.getByRole('button', { name: "Badge: Director's Cut" })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Badge: Plot Twist (locked)' })).toBeVisible()
    // The share text is unchanged by the extras.
    await expect(page.getByRole('button', { name: /^(Share|Copy)$/ })).toBeVisible()
  })

  test('a lost Daily is rated R and earns Straight to Video', async ({ page }) => {
    await pinDailyDate(page)
    await openMenu(page)
    await startMode(page, 'daily')
    for (let i = 0; i < 6; i++) await submitGuess(page, `zzqxwrong${'abcdef'[i]}`)
    await page.getByRole('button', { name: 'Finish' }).click()
    await expect(page.getByText('The End')).toBeVisible()
    await expect(page.getByLabel('Rated R: Rough Night')).toBeVisible()
    expect(await readBadges(page)).toContain('straightToVideo')
  })
})

test.describe('Gold Lamé curtains: 3 perfect Dailies in a row, or one perfect run (owner decisions 2026-10-25/26)', () => {
  // Seed the perfect-Daily run as of yesterday, then play today's Daily.
  async function playDaily(page, { before, perfect }) {
    await pinDailyDate(page)
    await openMenu(page)
    await page.evaluate((n) => {
      const d = new Date()
      const today = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000)
      localStorage.setItem('plotmix_perfect_daily', JSON.stringify({ count: n, lastDay: n ? today - 1 : null }))
    }, before)
    await startMode(page, 'daily')
    const card = await currentCard(page, 'daily')
    if (!perfect) await submitGuess(page, 'zzqxwrong')
    await submitGuess(page, card.mashedTitle)
    await page.getByRole('button', { name: 'Finish' }).click()
    await expect(page.getByText('The End')).toBeVisible()
  }
  const won = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('plotmix_prizes') || '{"won":[]}').won)

  test('a first perfect Daily counts 1 of 3', async ({ page }) => {
    await playDaily(page, { before: 0, perfect: true })
    await expect(await tapSymbol(page, /^Perfect Dailies in a row/)).toContainText('Perfect Dailies in a row: 1 of 3')
    expect(await won(page)).not.toContain('perfectDaily3')
  })

  test('the third perfect Daily in a row unlocks them', async ({ page }) => {
    await playDaily(page, { before: 2, perfect: true })
    await expect(await tapSymbol(page, /^3 perfect Dailies in a row/)).toHaveText('3 perfect Dailies in a row: Gold Lamé curtains unlocked!')
    expect(await won(page)).toContain('perfectDaily3')
  })

  // A whole Standard run: every card solved by its full title on the first guess.
  async function playStandardRun(page, { hintOnCard = -1 } = {}) {
    const ids = readDeck().slice(0, 10).map((c) => c.id)
    await resumeStandardWithCards(page, ids)
    for (let i = 0; i < ids.length; i++) {
      const card = await currentCard(page, 'standard')
      if (i === hintOnCard) {
        await page.getByRole('button', { name: 'Open hints' }).click()
        await page.getByRole('button', { name: /Year & Genre/ }).click()
        await page.getByRole('button', { name: 'Close hints' }).click()
      }
      await submitGuess(page, card.mashedTitle)
      const go = page.getByRole('button', { name: /^(Next|Finish|Continue to the next PlotMix)$/ })
      await expect(go.first()).toBeVisible()
      if (i < ids.length - 1) await continueToCard(page, 'standard', i + 1)
      else {
        await page.waitForTimeout(300) // the 5-in-a-row offer, if any, appears with the result
        const offer = page.getByRole('button', { name: 'Continue to the next PlotMix' })
        if (await offer.isVisible()) await offer.click()
        else await page.getByRole('button', { name: 'Finish' }).click()
      }
    }
    await expect(page.getByText('The End')).toBeVisible()
  }

  test('a perfect Standard run (no hints, no mistakes) also unlocks them', async ({ page }) => {
    test.setTimeout(240_000)
    await playStandardRun(page)
    await expect(await tapSymbol(page, /^A perfect run/)).toHaveText('A perfect run: no hints, no mistakes! Gold Lamé curtains unlocked!')
    await expect(page.getByLabel('Camera flashes')).toBeAttached() // red-carpet flashes (owner request 2026-10-26)
    expect(await won(page)).toContain('perfectDaily3')
  })

  test('one hint in an otherwise perfect run does not', async ({ page }) => {
    test.setTimeout(240_000)
    await playStandardRun(page, { hintOnCard: 3 })
    await expect(page.getByText('The End')).toBeVisible()
    await expect(page.getByRole('button', { name: /^A perfect run/ })).toHaveCount(0)
    await expect(page.getByLabel('Camera flashes')).toHaveCount(0)
    expect(await won(page)).not.toContain('perfectDaily3')
  })

  test('one wrong guess, even on a solved Daily, starts the count again', async ({ page }) => {
    await playDaily(page, { before: 2, perfect: false })
    await expect(await tapSymbol(page, /^Perfect Dailies in a row/)).toContainText('Perfect Dailies in a row: 0 of 3')
    expect(await won(page)).not.toContain('perfectDaily3')
  })
})

test.describe('Reduce motion', () => {
  test('curtains are not drawn when the phone asks for less motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await finishDailyPerfectly(page)
    expect(await page.evaluate(() => [...document.querySelectorAll('div')].some((d) => d.style.animation.includes('curtainLeft')))).toBe(false)
  })

  test('curtains open on the Daily and end screen otherwise', async ({ page }) => {
    await pinDailyDate(page)
    await openMenu(page)
    await page.getByRole('button', { name: 'Daily Challenge' }).click()
    expect(await page.evaluate(() => [...document.querySelectorAll('div')].some((d) => d.style.animation.includes('curtainLeft')))).toBe(true)
    // The curtains never block typing.
    const card = await currentCard(page, 'daily')
    await submitGuess(page, card.mashedTitle)
    await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible()
  })
})

test.describe('Intellectual property clean-up', () => {
  test('no real critics, people or company names in the jokes', () => {
    const source = readFileSync(join(process.cwd(), 'PlotMix.jsx'), 'utf8')
    expect(source).not.toMatch(/Weinstein|Ebert|Criterion|Netflix|Head to Blockbuster/)
  })
})
