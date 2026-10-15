// Smoke tests: the app loads and every game mode can be started.
import { test, expect } from '@playwright/test'
import { MODES, blockExternalFonts, openMenu, startMode, waitForSave, pointsCounter } from './helpers.js'

test('first visit goes intro -> onboarding -> menu without errors', async ({ page }) => {
  const errors = []
  page.on('pageerror', (err) => errors.push(err.message))
  await blockExternalFonts(page)

  await page.goto('/')
  await expect(page).toHaveTitle('PlotMix')

  // A new player sees the how-to-play carousel after the intro video.
  const skip = page.getByRole('button', { name: 'Skip how to play' })
  await expect(skip).toBeVisible({ timeout: 30_000 })
  await skip.click()

  for (const mode of Object.values(MODES)) {
    await expect(page.getByRole('button', { name: mode.label })).toBeVisible()
  }
  expect(await page.evaluate(() => localStorage.getItem('plotmix_onboarded'))).toBe('1')
  expect(errors).toEqual([])
})

for (const [modeId, mode] of Object.entries(MODES)) {
  test(`${mode.label} starts a game with a full-value first card`, async ({ page }) => {
    const errors = []
    page.on('pageerror', (err) => errors.push(err.message))

    await openMenu(page)
    await startMode(page, modeId)

    await expect(pointsCounter(page)).toHaveText('PTS: 10')

    const session = await waitForSave(page, modeId)
    expect(session.cardIdx).toBe(0)
    expect(session.deck).toHaveLength(mode.roundCount)
    expect(session.lives).toBe(6)
    expect(session.totalScore).toBe(0)
    // Every card in a run is a different movie pair.
    const pairs = session.deck.map((c) => [...c.movies].sort().join('|'))
    expect(new Set(pairs).size).toBe(pairs.length)

    expect(errors).toEqual([])
  })
}

test('Daily Challenge has no skip button, other modes do', async ({ page }) => {
  await openMenu(page)
  await startMode(page, 'daily')
  await expect(page.getByRole('button', { name: 'Skip card' })).toHaveCount(0)

  await page.getByRole('button', { name: 'Exit to menu' }).click()
  await startMode(page, 'standard')
  await expect(page.getByRole('button', { name: 'Skip card' })).toBeVisible()
})
