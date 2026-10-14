// Regression tests for critical gameplay behaviour, written against the
// current rules in PlotMix.jsx (they describe what the game does today):
//   - each card starts at 10 points
//   - wrong guess -1, "Year & Genre" hint -1, "Lead Actors" hint -3
//   - guessing each film separately is not penalised
//   - 6 wrong guesses lose the card; a lost or skipped card costs 1 heart
import { test, expect } from '@playwright/test'
import {
  openMenu, startMode, submitGuess, guessInput, waitForSave, currentCard, pointsCounter,
} from './helpers.js'

// Clearly not a film title and not a word from any mashed title.
const WRONG_GUESS = 'zzqx wrong guess'

async function finishRound(page, label) {
  const button = page.getByRole('button', { name: label })
  await expect(button).toBeVisible()
  await button.click()
}

test.describe('guessing and scoring', () => {
  test('naming both films separately solves the card for full points', async ({ page }) => {
    await openMenu(page)
    await startMode(page, 'daily')
    const card = await currentCard(page, 'daily')

    await submitGuess(page, card.movies[0])
    await expect(pointsCounter(page)).toHaveText('PTS: 10')
    await submitGuess(page, card.movies[1])

    await finishRound(page, 'Finish')
    await expect(page.getByText('The End')).toBeVisible()

    // Daily completion is recorded under today's date key with the score.
    const daily = await page.evaluate(() => {
      const key = Object.keys(localStorage).find((k) => k.startsWith('plotmix_daily_'))
      return key ? JSON.parse(localStorage.getItem(key)) : null
    })
    expect(daily?.score).toBe(10)
  })

  test('typing the full mashed title solves the card in one guess', async ({ page }) => {
    await openMenu(page)
    await startMode(page, 'standard')
    const card = await currentCard(page, 'standard')

    await submitGuess(page, card.mashedTitle)
    await finishRound(page, 'Next')

    const session = await waitForSave(page, 'standard', (s) => s.cardIdx === 1)
    expect(session.results[0]).toMatchObject({ solved: true, pts: 10, guesses: 1, hints: 0 })
    expect(session.totalScore).toBe(10)
    expect(session.lives).toBe(6)
  })

  test('a wrong guess costs 1 point and is kept in the guess history', async ({ page }) => {
    await openMenu(page)
    await startMode(page, 'standard')
    const card = await currentCard(page, 'standard')

    await submitGuess(page, WRONG_GUESS)
    await expect(pointsCounter(page)).toHaveText('PTS: 9')

    await submitGuess(page, card.mashedTitle)
    await finishRound(page, 'Next')

    const session = await waitForSave(page, 'standard', (s) => s.cardIdx === 1)
    expect(session.results[0]).toMatchObject({ solved: true, pts: 9, guesses: 2 })
    expect(session.results[0].guessList).toEqual([WRONG_GUESS, card.mashedTitle])
  })

  test('six wrong guesses lose the card, score 0 and cost one heart', async ({ page }) => {
    await openMenu(page)
    await startMode(page, 'standard')

    for (let i = 0; i < 6; i++) {
      await submitGuess(page, `${WRONG_GUESS} ${i}`)
    }
    await expect(guessInput(page)).toBeDisabled()
    await finishRound(page, 'Next')

    const session = await waitForSave(page, 'standard', (s) => s.cardIdx === 1)
    expect(session.results[0]).toMatchObject({ solved: false, pts: 0, guesses: 6 })
    expect(session.totalScore).toBe(0)
    expect(session.lives).toBe(5)
  })
})

test.describe('hints', () => {
  test('Year & Genre costs 1 point and Lead Actors costs 3', async ({ page }) => {
    await openMenu(page)
    await startMode(page, 'standard')
    const card = await currentCard(page, 'standard')

    await page.getByRole('button', { name: 'Open hints' }).click()
    await page.getByRole('button', { name: /Year & Genre/ }).click()
    await expect(page.getByText(String(card.hintData.films[0].year)).first()).toBeVisible()
    await expect(pointsCounter(page)).toHaveText('PTS: 9')

    await page.getByRole('button', { name: /Lead Actors/ }).click()
    await expect(page.getByText(card.hintData.films[0].actors[0]).first()).toBeVisible()
    await expect(pointsCounter(page)).toHaveText('PTS: 6')

    // A revealed hint cannot be bought twice.
    await expect(page.getByRole('button', { name: /Year & Genre/ })).toBeDisabled()
    await page.getByRole('button', { name: 'Close hints' }).click()

    await submitGuess(page, card.mashedTitle)
    await finishRound(page, 'Next')

    const session = await waitForSave(page, 'standard', (s) => s.cardIdx === 1)
    expect(session.results[0]).toMatchObject({ solved: true, pts: 6, hints: 2 })
    expect(session.results[0].hintList).toEqual(['metadata', 'actors'])
  })
})

test.describe('skipping', () => {
  test('skipping a card scores 0, costs one heart and moves on', async ({ page }) => {
    await openMenu(page)
    await startMode(page, 'standard')

    await page.getByRole('button', { name: 'Skip card' }).click()
    await page.getByRole('button', { name: 'Skip It' }).click()
    await finishRound(page, 'Next')

    const session = await waitForSave(page, 'standard', (s) => s.cardIdx === 1)
    expect(session.results[0]).toMatchObject({ skipped: true, solved: false, pts: 0 })
    expect(session.lives).toBe(5)
    expect(session.totalScore).toBe(0)
  })
})

test.describe('saving', () => {
  test('a game in progress survives a page reload and can be resumed', async ({ page }) => {
    await openMenu(page)
    await startMode(page, 'standard')
    const card = await currentCard(page, 'standard')

    await submitGuess(page, WRONG_GUESS)
    await waitForSave(page, 'standard', (s) => s.guesses.length === 1)

    await page.reload()
    const resume = page.getByRole('button', { name: 'Resume Game' })
    await expect(resume).toBeVisible({ timeout: 30_000 })
    await resume.click()

    await expect(pointsCounter(page)).toHaveText('PTS: 9')
    const resumed = await waitForSave(page, 'standard')
    expect(resumed.deck[resumed.cardIdx].id).toBe(card.id)
    expect(resumed.guesses).toEqual([WRONG_GUESS])
  })

  test('exiting to the menu discards the saved game', async ({ page }) => {
    await openMenu(page)
    await startMode(page, 'standard')
    await waitForSave(page, 'standard')

    await page.getByRole('button', { name: 'Exit to menu' }).click()
    await expect(page.getByRole('button', { name: 'Standard Mode' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Resume Game' })).toHaveCount(0)
  })
})

test.describe('sharing', () => {
  test('Copy puts the result summary on the clipboard', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await openMenu(page)
    await startMode(page, 'daily')
    const card = await currentCard(page, 'daily')

    await submitGuess(page, card.mashedTitle)
    await finishRound(page, 'Finish')
    await expect(page.getByText('The End')).toBeVisible()

    await page.getByRole('button', { name: 'Copy' }).click()
    await expect(page.getByRole('button', { name: 'Copied ✓' })).toBeVisible()

    const text = await page.evaluate(() => navigator.clipboard.readText())
    const lines = text.split('\n')
    expect(lines[0]).toBe('🎬 PLOTMIX Daily Challenge')
    expect(lines[1]).toMatch(/^📅 /)
    // solved / failed / skipped / best streak / score
    expect(lines[2]).toBe('1✅ 0❌ 0⏭️ 1🔥 10⭐')
  })
})
