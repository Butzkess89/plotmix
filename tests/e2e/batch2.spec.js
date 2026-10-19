// Tests for the owner's Batch 2 decisions (docs/DECISIONS.md, decided 2026-10-19).
// Each was written before its change and failed on the code without it.
import { test, expect } from '@playwright/test'
import {
  openMenu, startMode, submitGuess, waitForSave, currentCard, readSaves, pointsCounter,
  resumeStandardWithCards, pinDailyDate, blockExternalFonts, readDeck,
} from './helpers.js'

const PLAY_URL = 'https://plotmix-app.vercel.app'
// Daily card on 2026-10-14 under the original shuffle (computed with the game's own code).
const LEGACY_CARD_2026_10_14 = 13
const nextButton = (page) => page.getByRole('button', { name: 'Next' })

test.describe('#1 share text links back to the game', () => {
  test('the copied result ends with a link to the game', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await pinDailyDate(page)
    await openMenu(page)
    await startMode(page, 'daily')
    const card = await currentCard(page, 'daily')
    await submitGuess(page, card.mashedTitle)
    await page.getByRole('button', { name: 'Finish' }).click()
    await page.getByRole('button', { name: 'Copy' }).click()
    const text = await page.evaluate(() => navigator.clipboard.readText())
    expect(text.split('\n').at(-1)).toBe(`Play: ${PLAY_URL}`)
  })

  test('where the device can share, the share menu opens with the same text', async ({ page }) => {
    await page.addInitScript(() => {
      navigator.share = (data) => { window.__shared = data; return Promise.resolve() }
    })
    await pinDailyDate(page)
    await openMenu(page)
    await startMode(page, 'daily')
    const card = await currentCard(page, 'daily')
    await submitGuess(page, card.mashedTitle)
    await page.getByRole('button', { name: 'Finish' }).click()
    await page.getByRole('button', { name: 'Share' }).click()
    const shared = await page.evaluate(() => window.__shared)
    expect(shared.text).toContain('PLOTMIX Daily Challenge')
    expect(shared.text).toContain(`Play: ${PLAY_URL}`)
  })
})

test.describe('#2 link previews', () => {
  test('the page has a description and a preview image that exists', async ({ page, request }) => {
    await blockExternalFonts(page)
    await page.goto('/')
    const meta = (sel) => page.locator(sel).getAttribute('content')
    expect(await meta('meta[name="description"]')).toBeTruthy()
    expect(await meta('meta[property="og:title"]')).toBe('PlotMix')
    expect(await meta('meta[property="og:description"]')).toBeTruthy()
    expect(await meta('meta[property="og:image"]')).toBe(`${PLAY_URL}/og-image.png`)
    expect(await meta('meta[name="twitter:card"]')).toBe('summary_large_image')
    const image = await request.get('/og-image.png')
    expect(image.status()).toBe(200)
    expect(image.headers()['content-type']).toContain('image/png')
  })
})

test.describe('#3 naming one film never counts as the whole card', () => {
  test('"The Green Mile" finds one film of "The Green 8 Mile", not both', async ({ page }) => {
    await resumeStandardWithCards(page, [54])
    await submitGuess(page, 'The Green Mile')
    await page.waitForTimeout(1_000)
    await expect(nextButton(page)).toHaveCount(0)
    await expect(pointsCounter(page)).toHaveText('PTS: 10') // a correct film name is free
    await submitGuess(page, '8 Mile')
    await expect(nextButton(page)).toBeVisible()
  })
})

test.describe('#4 apostrophes are ignored', () => {
  test('"Cant" counts as the title word "Can\'t" and the title completes word by word', async ({ page }) => {
    // #1 "12 Angry White Men Can't Jump"
    await resumeStandardWithCards(page, [1])
    for (const word of ['12', 'Angry', 'White', 'Men', 'Cant', 'Jump']) await submitGuess(page, word)
    await nextButton(page).click()
    const session = await waitForSave(page, 'standard', (s) => s.cardIdx === 1)
    expect(session.results[0]).toMatchObject({ solved: true, pts: 10 })
  })
})

test.describe('#5 each wrong word costs a point; correct guesses are free', () => {
  test('wrong words cost one point each, title words and film names cost nothing', async ({ page }) => {
    // #77 "The Nightmare Before Christmas Story"
    await resumeStandardWithCards(page, [77])
    await submitGuess(page, 'Halloween Town') // 2 wrong words
    await expect(pointsCounter(page)).toHaveText('PTS: 8')
    await submitGuess(page, 'Christmas Vacation') // "Christmas" is in the title, "Vacation" is not
    await expect(pointsCounter(page)).toHaveText('PTS: 7')
    await submitGuess(page, 'Nightmare Before') // both title words
    await expect(pointsCounter(page)).toHaveText('PTS: 7')
    await submitGuess(page, 'A Christmas Story') // correct film name
    await expect(pointsCounter(page)).toHaveText('PTS: 7')
  })

  test('grammar words are never counted as wrong', async ({ page }) => {
    await resumeStandardWithCards(page, [77])
    await submitGuess(page, 'Halloween of the Town')
    await expect(pointsCounter(page)).toHaveText('PTS: 8')
  })
})

test.describe('#6 the first Daily result of the day is the one kept', () => {
  test('replaying the Daily does not overwrite or change the shared result', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await pinDailyDate(page)
    await openMenu(page)
    await startMode(page, 'daily')
    const card = await currentCard(page, 'daily')
    await submitGuess(page, card.mashedTitle)
    await page.getByRole('button', { name: 'Finish' }).click()
    await expect(page.getByText('The End')).toBeVisible()

    // Replay and lose.
    await page.getByRole('button', { name: 'Play Again' }).click()
    for (let i = 0; i < 6; i++) await submitGuess(page, `zzqx wrong guess ${i}`)
    await page.getByRole('button', { name: 'Finish' }).click()
    await expect(page.getByText('The End')).toBeVisible()
    await expect(page.getByText(/first result.*kept/i)).toBeVisible()

    const stored = await page.evaluate(() => {
      const key = Object.keys(localStorage).find((k) => k.startsWith('plotmix_daily_'))
      return JSON.parse(localStorage.getItem(key))
    })
    expect(stored.score).toBe(10)
    await page.getByRole('button', { name: 'Copy' }).click()
    const text = await page.evaluate(() => navigator.clipboard.readText())
    expect(text).toContain('1✅ 0❌ 0⏭️ 1🔥 10⭐')
  })
})

test.describe('#7 Daily cards follow a no-repeat rotation', () => {
  async function dailyCardOn(browser, isoDate) {
    const page = await browser.newPage()
    await page.clock.setFixedTime(new Date(isoDate))
    await openMenu(page)
    await startMode(page, 'daily')
    const card = await currentCard(page, 'daily')
    await page.close()
    return card.id
  }

  test('a card does not come back within the rotation', async ({ browser }) => {
    // Before the rotation, card #19 was the Daily on both of these dates (5 days apart).
    const first = await dailyCardOn(browser, '2026-11-12T12:00:00')
    const fiveDaysLater = await dailyCardOn(browser, '2026-11-17T12:00:00')
    expect(fiveDaysLater).not.toBe(first)
  })

  test('dates before the rotation starts keep their old card', async ({ browser }) => {
    // 2026-10-14 is the date the Daily tests pin; its card must not change.
    expect(await dailyCardOn(browser, '2026-10-14T12:00:00')).toBe(LEGACY_CARD_2026_10_14)
  })
})

test.describe('#9 sound on/off', () => {
  async function countSounds(page) {
    await page.addInitScript(() => {
      window.__tones = 0
      const Ctx = window.AudioContext || window.webkitAudioContext
      const original = Ctx.prototype.createOscillator
      Ctx.prototype.createOscillator = function (...args) { window.__tones++; return original.apply(this, args) }
    })
  }

  test('turning sound off silences the game and is remembered', async ({ page }) => {
    await countSounds(page)
    await openMenu(page)
    const toggle = page.getByRole('button', { name: 'Sound' })
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')

    await page.reload()
    await expect(page.getByRole('button', { name: 'Sound' })).toHaveAttribute('aria-pressed', 'false')
    await startMode(page, 'standard')
    await submitGuess(page, 'zzqx wrong guess')
    await expect(pointsCounter(page)).toHaveText('PTS: 9')
    expect(await page.evaluate(() => window.__tones)).toBe(0)
  })

  test('with sound on, a wrong guess plays a sound', async ({ page }) => {
    await countSounds(page)
    await openMenu(page)
    await startMode(page, 'standard')
    await expect(page.getByRole('button', { name: 'Sound' })).toBeVisible()
    await submitGuess(page, 'zzqx wrong guess')
    await expect.poll(() => page.evaluate(() => window.__tones)).toBeGreaterThan(0)
  })
})

test.describe('#10 fonts come from the game itself', () => {
  test('no request goes to Google Fonts and the game fonts load', async ({ page }) => {
    const google = []
    page.on('request', (r) => { if (/fonts\.(googleapis|gstatic)\.com/.test(r.url())) google.push(r.url()) })
    await page.addInitScript(() => { try { localStorage.setItem('plotmix_onboarded', '1') } catch {} })
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Standard Mode' })).toBeVisible({ timeout: 30_000 })
    await page.evaluate(() => document.fonts.ready)
    expect(google).toEqual([])
    expect(await page.evaluate(() => document.fonts.check('16px "Rubik Mono One"') && document.fonts.check('16px "Outfit"'))).toBe(true)
  })
})

test.describe('#11 card #51 uses the funnier writing', () => {
  test('"The Fault in Our Star Wars" shows the Indianapolis plot', async ({ page }) => {
    await resumeStandardWithCards(page, [51])
    await expect(page.getByText(/Indianapolis/)).toBeVisible()
  })
})

test.describe('#8 only the real title counts as naming a film', () => {
  test('a nickname is a wrong guess; the real title counts', async ({ page }) => {
    // #11 "Brokeback to the Future": "bttf" is not the real title of Back to the Future.
    await resumeStandardWithCards(page, [11])
    await submitGuess(page, 'bttf')
    await expect(pointsCounter(page)).toHaveText('PTS: 9')
    await submitGuess(page, 'Back to the Future')
    await submitGuess(page, 'Brokeback Mountain')
    await expect(nextButton(page)).toBeVisible()
  })

  test('the card data has no aliases other than the real title written differently', () => {
    const key = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, 'and')
      .replace(/['’]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim().replace(/^(the|a|an) /, '').replace(/ /g, '')
    const extra = []
    for (const card of readDeck()) card.movies.forEach((m, i) => (card.aliases[i] || []).forEach((a) => {
      if (key(a) !== key(m)) extra.push(`#${card.id} ${m} <- ${a}`)
    }))
    expect(extra).toEqual([])
  })
})
