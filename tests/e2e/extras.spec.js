// Funny extras (owner request 2026-10-26): blooper reel, audience, usher, red-carpet flashes,
// post-credits scene, spoiler tape, and the "Which came first?" bonus.
import { test, expect } from '@playwright/test'
import {
  openMenu, startMode, submitGuess, currentCard, pinDailyDate, resumeStandardWithCards, waitForSave, readDeck,
} from './helpers.js'

const card77 = () => readDeck().find((c) => c.id === 77)
async function finishDaily(page, { wrong = [] } = {}) {
  await pinDailyDate(page)
  await openMenu(page)
  await startMode(page, 'daily')
  const card = await currentCard(page, 'daily')
  for (const w of wrong) await submitGuess(page, w)
  await submitGuess(page, card.mashedTitle)
  await page.getByRole('button', { name: 'Finish' }).click()
  await expect(page.getByText('The End')).toBeVisible()
}

test.describe('1. Blooper reel in the end credits', () => {
  test('plays back the wrong guesses', async ({ page }) => {
    await finishDaily(page, { wrong: ['zzqx shrek wars'] })
    await expect(page.getByLabel('Credits')).toContainText('Blooper reel')
    await expect(page.getByLabel('Credits')).toContainText('“zzqx shrek wars”')
  })
  test('a clean run has an empty blooper reel', async ({ page }) => {
    await finishDaily(page)
    await expect(page.getByLabel('Credits')).toContainText('Empty. Not one bad take.')
  })
})

test.describe('2. The audience', () => {
  // Only the big moments (owner request 2026-10-26): not for ordinary wrong guesses.
  test('stays quiet for an ordinary miss, then cheers the solve', async ({ page }) => {
    await resumeStandardWithCards(page, [77])
    await submitGuess(page, 'zzqxwrong')
    await page.waitForTimeout(400)
    await expect(page.getByRole('status', { name: /Audience/ })).toHaveCount(0)
    await submitGuess(page, card77().mashedTitle)
    await expect(page.getByRole('status', { name: 'Audience cheers' })).toBeAttached()
  })
  test('groans when a card is lost', async ({ page }) => {
    await resumeStandardWithCards(page, [77])
    for (let i = 0; i < 6; i++) await submitGuess(page, `zzqxwrong${'abcdef'[i]}`)
    await expect(page.getByRole('status', { name: 'Audience groans' })).toBeAttached()
  })
  test('stays home when the phone asks for less motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await resumeStandardWithCards(page, [77])
    await submitGuess(page, card77().mashedTitle)
    await page.waitForTimeout(300)
    await expect(page.getByRole('status', { name: /Audience/ })).toHaveCount(0)
  })
})

test.describe('3. The usher', () => {
  test('shines the flashlight after 30 seconds of doing nothing', async ({ page }) => {
    await page.clock.install()
    await resumeStandardWithCards(page, [77])
    await page.clock.runFor(20_000)
    await expect(page.getByRole('status', { name: 'Usher' })).toHaveCount(0)
    await page.clock.runFor(12_000)
    await expect(page.getByRole('status', { name: 'Usher' })).toContainText("Psst… the film's started.")
  })
  test('typing keeps the usher away', async ({ page }) => {
    await page.clock.install()
    await resumeStandardWithCards(page, [77])
    for (let i = 0; i < 4; i++) { await page.clock.runFor(15_000); await page.keyboard.press('a') }
    await expect(page.getByRole('status', { name: 'Usher' })).toHaveCount(0)
  })
})

test.describe('Curtains (owner request 2026-10-26)', () => {
  const curtainsDrawn = (page) => page.evaluate(() => [...document.querySelectorAll('div')].some((d) => d.style.animation.includes('curtainLeft')))
  test('open when a Standard game starts', async ({ page }) => {
    await openMenu(page)
    await page.getByRole('button', { name: 'Standard Mode' }).click()
    expect(await curtainsDrawn(page)).toBe(true)
  })
  test('open when a saved game is resumed', async ({ page }) => {
    await resumeStandardWithCards(page, [77])
    expect(await curtainsDrawn(page)).toBe(true)
  })
  test('reveal the final score at the end, long enough to read', async ({ page }) => {
    await finishDaily(page)
    await expect(page.getByText(/^Final score: \d+ points?$/)).toBeVisible()
    await page.waitForTimeout(1_800)
    await expect(page.getByText(/^Final score: \d+ points?$/)).toBeVisible() // still there ~2 s later
  })
  test('the curtain picker shows drawn curtains, not colour squares', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('plotmix_prizes', JSON.stringify({ won: ['bronze'], best: 50, curtain: 'red' })))
    await openMenu(page)
    await page.getByRole('button', { name: 'Popcorn Panic', exact: true }).click()
    for (const name of ['Red Velvet', 'Midnight Blue']) {
      await expect(page.getByRole('button', { name: `Curtains: ${name}` }).locator('svg')).toBeVisible()
    }
  })
})

test.describe('5. Post-credits scene', () => {
  test("teases tomorrow's Daily after the credits", async ({ page }) => {
    await finishDaily(page)
    await expect(page.getByRole('status', { name: 'Post-credits scene' })).toContainText(/Coming tomorrow: a .+ mashup\. Same time, same theatre\./, { timeout: 9_000 })
  })
})

test.describe('6. Spoiler tape', () => {
  test('rips off the Lead Actors hint', async ({ page }) => {
    await resumeStandardWithCards(page, [77])
    await page.getByRole('button', { name: 'Open hints' }).click()
    await page.getByRole('button', { name: /Lead Actors/ }).click()
    await expect(page.locator('[data-spoiler-tape]')).toHaveCount(2) // one per film
    await expect(page.locator('[data-spoiler-tape]')).toHaveCount(0, { timeout: 2_000 }) // and it's gone
  })
})

test.describe('7. Which came first? bonus', () => {
  const older = () => { const c = card77(); const [a, b] = c.hintData.films; return a.year < b.year ? c.movies[0] : c.movies[1] }
  const newer = () => { const c = card77(); return c.movies.find((m) => m !== older()) }

  test('naming the older film is worth +1', async ({ page }) => {
    await resumeStandardWithCards(page, [77, 1])
    await submitGuess(page, card77().mashedTitle)
    const bonus = page.getByRole('group', { name: 'Which came first?' })
    await expect(bonus).toBeVisible()
    // Readable: the unanswered buttons keep their coloured (cyan) background behind the white text.
    const bg = await bonus.getByRole('button', { name: `${older()} came first` }).evaluate((b) => getComputedStyle(b).backgroundColor)
    expect(bg).not.toMatch(/rgba\(0, 0, 0, 0\)|rgb\(2[0-9]{2}, 2[0-9]{2}, 2[0-9]{2}\)/)
    await bonus.getByRole('button', { name: `${older()} came first` }).click()
    await expect(page.getByRole('status', { name: 'Bonus result' })).toHaveText('✓ Film buff! +1 point')
    await expect(bonus.getByRole('button', { name: `${newer()} came first` })).toBeDisabled() // one answer only
    await page.getByRole('button', { name: 'Next' }).click()
    const s = await waitForSave(page, 'standard', (x) => x.cardIdx === 1)
    expect(s.results[0]).toMatchObject({ pts: 11, bonus: 1 })
  })

  test('a wrong answer scores nothing extra', async ({ page }) => {
    await resumeStandardWithCards(page, [77, 1])
    await submitGuess(page, card77().mashedTitle)
    await page.getByRole('button', { name: `${newer()} came first` }).click()
    await expect(page.getByRole('status', { name: 'Bonus result' })).toHaveText('✗ Nope, the other one. No bonus.')
    await page.getByRole('button', { name: 'Next' }).click()
    const s = await waitForSave(page, 'standard', (x) => x.cardIdx === 1)
    expect(s.results[0]).toMatchObject({ pts: 10, bonus: 0 })
  })

  test('using any hint rules the bonus out', async ({ page }) => {
    await resumeStandardWithCards(page, [77, 1])
    await page.getByRole('button', { name: 'Open hints' }).click()
    await page.getByRole('button', { name: /Year & Genre/ }).click()
    await page.getByRole('button', { name: 'Close hints' }).click()
    await submitGuess(page, card77().mashedTitle)
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible()
    await expect(page.getByRole('group', { name: 'Which came first?' })).toHaveCount(0)
  })

  test('just opening the hints (without using one) keeps it', async ({ page }) => {
    await resumeStandardWithCards(page, [77, 1])
    await page.getByRole('button', { name: 'Open hints' }).click()
    await page.getByRole('button', { name: 'Close hints' }).click()
    await submitGuess(page, card77().mashedTitle)
    await expect(page.getByRole('group', { name: 'Which came first?' })).toBeVisible()
  })

  test('a Popcorn Peek power-up rules it out too', async ({ page }) => {
    await page.addInitScript(() => { if (!localStorage.getItem('plotmix_powerups')) localStorage.setItem('plotmix_powerups', JSON.stringify({ hint: 0, peek: 1 })) })
    await resumeStandardWithCards(page, [77, 1])
    await page.getByRole('button', { name: 'Open hints' }).click()
    await page.getByRole('button', { name: /Use a Popcorn Peek/ }).click()
    await page.getByRole('button', { name: 'Close hints' }).click()
    await submitGuess(page, card77().mashedTitle)
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible()
    await expect(page.getByRole('group', { name: 'Which came first?' })).toHaveCount(0)
  })
})

// Holiday weeks (owner request 2026-10-26): decorations for about a week around major holidays,
// following the real Chinese, Hebrew and Islamic calendars.
test.describe('Holiday decorations', () => {
  for (const [date, name] of [
    ['2026-10-14T12:00:00', null],
    ['2026-10-26T12:00:00', 'Fright Week'],
    ['2026-12-08T12:00:00', 'Hanukkah'],      // Hanukkah 2026: 5–12 Dec
    ['2026-12-23T12:00:00', 'Christmas'],
    ['2027-01-01T12:00:00', 'New Year'],
    ['2027-02-07T12:00:00', 'Lunar New Year'], // Lunar New Year 2027: 6 Feb
    ['2026-03-20T12:00:00', 'Eid al-Fitr'],    // Eid al-Fitr 2026: 20 Mar
    ['2027-03-28T12:00:00', 'Easter'],         // Easter 2027: 28 Mar
  ]) {
    test(`${date.slice(0, 10)}: ${name || 'no holiday'}`, async ({ page }) => {
      await page.clock.setFixedTime(new Date(date))
      await openMenu(page)
      if (name) await expect(page.getByRole('img', { name: `${name} decorations` })).toBeVisible()
      else await expect(page.getByRole('img', { name: /decorations$/ })).toHaveCount(0)
    })
  }
})

test.describe('Popcorn Panic feedback', () => {
  test('each speed-up shows a VHS fast-forward key being pressed', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('plotmix_arcade_passes', '1'))
    await openMenu(page)
    await page.getByRole('button', { name: 'Popcorn Panic', exact: true }).click()
    await page.getByRole('button', { name: 'Play Popcorn Panic' }).click()
    await expect(page.getByRole('status', { name: 'Speeding up' }).locator('[data-vhs-key]')).toBeAttached({ timeout: 8_000 })
  })
  test('catching a bad piece buzzes the phone', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('plotmix_arcade_passes', '1')
      window.__vib = []
      Object.defineProperty(navigator, 'vibrate', { value: (p) => { window.__vib.push(p); return true }, configurable: true })
      let n = 0; Math.random = () => 0.6 + (n++ % 2) * 0.01 // only burnt popcorn, falling in one spot
    })
    await openMenu(page)
    await page.getByRole('button', { name: 'Popcorn Panic', exact: true }).click()
    await page.getByRole('button', { name: 'Play Popcorn Panic' }).click()
    const bad = page.getByRole('img', { name: 'Burnt popcorn', exact: true }).first()
    await expect(bad).toBeAttached({ timeout: 10_000 })
    const box = await bad.boundingBox()
    await page.mouse.move(box.x + box.width / 2, 800)
    await expect.poll(() => page.evaluate(() => window.__vib), { timeout: 10_000 }).toContainEqual([120, 60, 120])
  })
})
