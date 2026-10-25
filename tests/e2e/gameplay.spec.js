// Regression tests for critical gameplay behaviour, written against the
// current rules in PlotMix.jsx (they describe what the game does today):
//   - each card starts at 10 points
//   - each wrong word in a guess -1 (a one-word wrong guess costs 1), "Year & Genre" hint -1, "Lead Actors" hint -3
//   - guessing each film separately is not penalised
//   - 6 wrong guesses lose the card; a lost or skipped card costs 1 heart
import { test, expect } from '@playwright/test'
import {
  openMenu, startMode, submitGuess, guessInput, waitForSave, currentCard, pointsCounter, pinDailyDate, resumeStandardWithCards,
} from './helpers.js'

// Clearly not a film title and not a word from any mashed title.
// One made-up word: not a film title and not a word in any mashed title, so it costs exactly 1 point.
const WRONG_GUESS = 'zzqxwrong'

async function finishRound(page, label) {
  const button = page.getByRole('button', { name: label })
  await expect(button).toBeVisible()
  await button.click()
}

test.describe('guessing and scoring', () => {
  test('naming both films separately solves the card for full points', async ({ page }) => {
    await pinDailyDate(page)
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
      await submitGuess(page, `${WRONG_GUESS}${i}`)
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
  test('Copy puts the result summary on the clipboard', async ({ page, context, browserName }) => {
    test.skip(browserName === 'webkit', 'Playwright cannot grant clipboard permission in WebKit')
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await pinDailyDate(page)
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
    // Changed 2026-10-22 (owner-approved): Daily number and a spoiler-free journey row.
    expect(lines[0]).toBe('🎬 PLOTMIX Daily Challenge #14') // 2026-10-14
    expect(lines[1]).toMatch(/^📅 /)
    expect(lines[2]).toBe('🟩') // one guess that found something
    // solved / failed / skipped / best streak / score
    expect(lines[3]).toBe('1✅ 0❌ 0⏭️ 1🔥 10⭐')
    expect(lines[4]).toBe('Play: https://plotmix-app.vercel.app')
    expect(lines).toHaveLength(5)
  })
})

test.describe('Naming a film shows its part of a blended title word', () => {
  test('"good fellas" opens GOODFELL in "Goodfellowship of the Ring"', async ({ page }) => {
    await resumeStandardWithCards(page, [90])
    await submitGuess(page, 'good fellas')
    const shown = () => page.evaluate(() => [...document.querySelectorAll('[aria-label="Title letters"] div')]
      .filter((d) => d.children.length === 0 && /^[a-z]$/i.test(d.textContent)).map((d) => d.textContent).join(''))
    await expect.poll(shown).toBe('Goodfell')
    await submitGuess(page, 'The Lord of the Rings: The Fellowship of the Ring')
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible() // both films: solved
  })
})

