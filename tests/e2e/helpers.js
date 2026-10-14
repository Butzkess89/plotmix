// Shared helpers for PlotMix end-to-end tests.
// These only read the app's own localStorage keys; they never change game code.
import { expect } from '@playwright/test'

export const SAVE_KEY = 'plotmix_save_v2'

// Mirrors GAME_MODES in PlotMix.jsx (button aria-label and round count).
export const MODES = {
  daily: { label: 'Daily Challenge', roundCount: 1 },
  standard: { label: 'Standard Mode', roundCount: 10 },
  speedrun: { label: 'Speed Run', roundCount: 8 },
}

// Google Fonts are cosmetic; blocking them keeps tests independent of the network.
export async function blockExternalFonts(page) {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort())
}

// Open the app as a returning player (onboarding already seen) and wait for the menu.
export async function openMenu(page) {
  await blockExternalFonts(page)
  await page.addInitScript(() => {
    try { localStorage.setItem('plotmix_onboarded', '1') } catch {}
  })
  await page.goto('/')
  await expect(page.getByRole('button', { name: MODES.standard.label })).toBeVisible({ timeout: 30_000 })
}

export async function startMode(page, modeId) {
  await page.getByRole('button', { name: MODES[modeId].label }).click()
  await expect(guessInput(page)).toBeVisible()
}

export const guessInput = (page) => page.getByRole('textbox', { name: 'Movie title guess' })

export async function submitGuess(page, text) {
  await guessInput(page).fill(text)
  await guessInput(page).press('Enter')
}

export async function readSaves(page) {
  return page.evaluate((key) => {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : {}
  }, SAVE_KEY)
}

// The game autosaves after every change; wait until the save for this mode exists.
export async function waitForSave(page, modeId, predicate = () => true) {
  let session
  await expect.poll(async () => {
    session = (await readSaves(page))[modeId]
    return !!session && predicate(session)
  }).toBe(true)
  return session
}

export async function currentCard(page, modeId) {
  const session = await waitForSave(page, modeId)
  return session.deck[session.cardIdx]
}

export const pointsCounter = (page) => page.getByText(/^PTS: \d+$/)
