// Funny extras (owner request 2026-10-26): blooper reel, audience, usher, red-carpet flashes,
// post-credits scene, spoiler tape, and the "Which came first?" bonus.
import { test, expect } from '@playwright/test'
import {
  openMenu, startMode, submitGuess, currentCard, pinDailyDate, resumeStandardWithCards, waitForSave, readDeck,
  tapSymbol,
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
    // A clapperboard symbol pops in after the credits; tapping it shows the teaser.
    const clapper = page.getByRole('button', { name: /^Post-credits scene/ })
    await expect(clapper).toBeVisible({ timeout: 9_000 })
    await clapper.click()
    await expect(page.getByRole('status', { name: 'Symbol info' })).toContainText(/Post-credits scene: Tomorrow's Daily Challenge: a .+ mashup\. Same time, same theatre\./)
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

// Owner request 2026-10-26: the 3rd wrong guess brings the crowd back to boo and throw a tomato.
test.describe('Tomato and boo', () => {
  test('the 3rd wrong guess (not the 2nd) brings it, for under 3 seconds', async ({ page }) => {
    await resumeStandardWithCards(page, [77])
    await submitGuess(page, 'zzqxwronga')
    await submitGuess(page, 'zzqxwrongb')
    await page.waitForTimeout(300)
    await expect(page.getByRole('status', { name: 'Boo' })).toHaveCount(0)
    await submitGuess(page, 'zzqxwrongc')
    const boo = page.getByRole('status', { name: 'Boo' })
    await expect(boo).toContainText('BOO!')
    const shownAt = Date.now()
    await expect(boo).toHaveCount(0, { timeout: 3_500 })
    expect(Date.now() - shownAt).toBeLessThan(3_200)
  })
  test('stays away when the phone asks for less motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await resumeStandardWithCards(page, [77])
    for (const w of ['zzqxwronga', 'zzqxwrongb', 'zzqxwrongc']) await submitGuess(page, w)
    await page.waitForTimeout(300)
    await expect(page.getByRole('status', { name: 'Boo' })).toHaveCount(0)
  })
})

test.describe('Owner fixes 2026-10-26', () => {
  test('"off" shows only OFF in "Scarface/Off" and does not solve it; naming Scarface then does', async ({ page }) => {
    await resumeStandardWithCards(page, [41, 1])
    await submitGuess(page, 'off')
    const shown = () => page.evaluate(() => [...document.querySelectorAll('[aria-label="Title letters"] div')]
      .filter((d) => d.children.length === 0 && /^[a-z0-9]$/i.test(d.textContent)).map((d) => d.textContent).join(''))
    await expect.poll(shown).toMatch(/^off$/i) // only OFF, not SCARFACE
    await expect(page.getByRole('button', { name: 'Next' })).toHaveCount(0)
    await submitGuess(page, 'scarface')
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible()
  })

  test('the usher leaves the moment the screen is touched', async ({ page }) => {
    await page.clock.install()
    await resumeStandardWithCards(page, [77])
    await page.clock.runFor(31_000)
    await expect(page.getByRole('status', { name: 'Usher' })).toBeVisible()
    await page.mouse.click(200, 300)
    await expect(page.getByRole('status', { name: 'Usher' })).toHaveCount(0, { timeout: 300 })
  })

  test('holiday weeks keep the curtains you chose (Emerald Green during Fright Week)', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-10-26T12:00:00'))
    await page.addInitScript(() => localStorage.setItem('plotmix_prizes', JSON.stringify({ won: ['silver'], best: 90, curtain: 'emerald' })))
    await openMenu(page)
    await page.getByRole('button', { name: 'Standard Mode' }).click()
    const bg = await page.evaluate(() => [...document.querySelectorAll('div')].find((d) => d.style.animation.includes('curtainLeft'))?.style.background || '')
    expect(bg).toContain('rgb(11, 74, 51)') // Emerald Green, not the orange Fright Week velvet
  })

  test('a solved card plays the cheer: a fanfare plus applause', async ({ page }) => {
    // A pretend audio system that just counts the sounds made.
    await page.addInitScript(() => {
      window.__audio = { osc: 0, noise: 0 }
      const param = () => ({ value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} })
      const node = () => ({ connect() {}, start() {}, stop() {}, frequency: param(), gain: param(), Q: param(), type: '' })
      class FakeCtx {
        constructor() { this.currentTime = 0; this.sampleRate = 8000; this.destination = {} }
        createOscillator() { window.__audio.osc++; return node() }
        createGain() { return node() }
        createBiquadFilter() { return node() }
        createBuffer() { return { getChannelData: () => new Float32Array(16000) } }
        createBufferSource() { window.__audio.noise++; return node() }
        resume() {}
      }
      window.AudioContext = FakeCtx; window.webkitAudioContext = FakeCtx
    })
    await resumeStandardWithCards(page, [77, 1])
    const before = await page.evaluate(() => ({ ...window.__audio }))
    await submitGuess(page, card77().mashedTitle)
    await expect.poll(() => page.evaluate(() => window.__audio.noise)).toBeGreaterThan(before.noise + 15) // claps
    expect(await page.evaluate(() => window.__audio.osc)).toBeGreaterThan(before.osc + 4) // the fanfare
  })
})

// Owner question 2026-10-26: "how can the player even know they have a laser?"
test.describe('Learning the laser', () => {
  test('the first bad piece gets a "tap it to zap it" target until the first zap, then never again', async ({ page }) => {
    await page.addInitScript(() => {
      if (!sessionStorage.getItem('seeded')) { localStorage.setItem('plotmix_arcade_passes', '2'); sessionStorage.setItem('seeded', '1') }
      let n = 0; Math.random = () => 0.6 + (n++ % 2) * 0.01 // only burnt popcorn, in one spot
    })
    await openMenu(page)
    await page.getByRole('button', { name: 'Popcorn Panic', exact: true }).click()
    await page.getByRole('button', { name: 'Play Popcorn Panic' }).click()
    const coach = page.getByRole('status', { name: 'Zap coach' })
    await expect(coach).toContainText('Tap it to zap it!', { timeout: 10_000 })
    const bad = page.getByRole('img', { name: 'Burnt popcorn', exact: true }).first()
    const box = await bad.boundingBox()
    await page.mouse.click(box.x + box.width / 2, 800)
    await expect(page.getByLabel('Arcade event')).toHaveText(/Zapped!/)
    await expect(coach).toHaveCount(0)
    expect(await page.evaluate(() => localStorage.getItem('plotmix_zap_learned'))).toBe('true')
    // Next game: no coach.
    await openMenu(page)
    await page.getByRole('button', { name: 'Popcorn Panic', exact: true }).click()
    await page.getByRole('button', { name: 'Play Popcorn Panic' }).click()
    await expect(page.getByRole('img', { name: 'Burnt popcorn', exact: true }).first()).toBeAttached({ timeout: 10_000 })
    await expect(coach).toHaveCount(0)
  })
})

test.describe('Small words', () => {
  test('owner report: "of" and "on" are not in "The Little Mermaid in Manhattan", so no tick; "in" is', async ({ page }) => {
    await resumeStandardWithCards(page, [55])
    await submitGuess(page, 'of')
    await expect(page.getByText('Take 2')).toBeVisible() // counted as a wrong guess
    await submitGuess(page, 'in')
    const shown = () => page.evaluate(() => [...document.querySelectorAll('[aria-label="Title letters"] div')]
      .filter((d) => d.children.length === 0 && /^[a-z0-9]$/i.test(d.textContent)).map((d) => d.textContent).join(''))
    await expect.poll(shown).toMatch(/^in$/i)
  })
  test('grammar words next to real title words are still free ("the little")', async ({ page }) => {
    await resumeStandardWithCards(page, [55])
    await submitGuess(page, 'the little')
    await page.waitForTimeout(300)
    await expect(page.getByText('Take 2')).toHaveCount(0)
  })
})

test.describe('Free Hint with every hint already shown', () => {
  test('is greyed out and says it is saved for later (owner report 2026-10-26)', async ({ page }) => {
    await page.addInitScript(() => { if (!localStorage.getItem('plotmix_powerups')) localStorage.setItem('plotmix_powerups', JSON.stringify({ hint: 1, peek: 0 })) })
    await resumeStandardWithCards(page, [77])
    await page.getByRole('button', { name: 'Open hints' }).click()
    for (const h of [/Year & Genre/, /Director/, /Lead Actors/]) await page.getByRole('button', { name: h }).click()
    const free = page.getByRole('button', { name: 'Use a Free Hint (1 left)' })
    await expect(free).toBeDisabled()
    await expect(free).toContainText('no hints left to reveal')
    expect(await free.evaluate((b) => getComputedStyle(b).opacity)).toBe('0.4')
  })
})

test.describe('Small words that are not in the title', () => {
  test('owner report: "the" is not ticked for "La La Land Before Time"', async ({ page }) => {
    const { readDeck } = await import('./helpers.js')
    const card = readDeck().find((c) => /Land Before Time/.test(c.mashedTitle))
    await resumeStandardWithCards(page, [card.id])
    await submitGuess(page, 'the')
    await expect(page.getByText('Take 2')).toBeVisible() // a wrong guess, not a green tick
  })
})
