// Tests for the cinema extras (owner request 2026-10-21): animations, jokes, badges, sounds.
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  openMenu, startMode, submitGuess, guessInput, currentCard, pinDailyDate, resumeStandardWithCards, waitForSave,
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

test.describe('Gold Lamé curtains: 3 perfect Dailies in a row (owner decision 2026-10-25)', () => {
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
    await expect(page.getByLabel('Perfect Daily streak')).toContainText('1 of 3')
    expect(await won(page)).not.toContain('perfectDaily3')
  })

  test('the third perfect Daily in a row unlocks them', async ({ page }) => {
    await playDaily(page, { before: 2, perfect: true })
    await expect(page.getByLabel('Gold curtains')).toHaveText('✨ 3 perfect Dailies in a row: Gold Lamé curtains unlocked!')
    expect(await won(page)).toContain('perfectDaily3')
  })

  test('one wrong guess, even on a solved Daily, starts the count again', async ({ page }) => {
    await playDaily(page, { before: 2, perfect: false })
    await expect(page.getByLabel('Perfect Daily streak')).toContainText('0 of 3')
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
