// Shared helpers for PlotMix end-to-end tests.
// These only read the app's own localStorage keys; they never change game code.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
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

// The Daily card is chosen from the date, so pin the browser's date to keep
// Daily tests on the same card every day. Timers keep running normally.
// 2026-10-14 is the day this suite was first verified. Some cards would break
// the "name each film separately" test (see docs/TESTING.md, card #54).
export const PINNED_DAILY_DATE = new Date('2026-10-14T12:00:00')

export async function pinDailyDate(page) {
  await page.clock.setFixedTime(PINNED_DAILY_DATE)
}

export async function startMode(page, modeId) {
  await page.getByRole('button', { name: MODES[modeId].label }).click()
  await expect(guessInput(page)).toBeVisible()
  // Speed Run opens with a 3-2-1 countdown; typing is possible once it ends.
  await expect(guessInput(page)).toBeEnabled()
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

// After a solved card, move on to card `nextIdx`. Every 5 in a row the Popcorn Panic offer
// box opens with the result, and on slow engines it can open just after Next is tapped, so
// keep choosing "Continue" or "Next" until the save shows the next card.
export async function continueToCard(page, modeId, nextIdx) {
  const offer = page.getByRole('button', { name: 'Continue to the next PlotMix' })
  const next = page.getByRole('button', { name: /^(Next|Finish)$/ })
  await expect(async () => {
    if (((await readSaves(page))[modeId] || {}).cardIdx === nextIdx) return
    if (await offer.isVisible()) await offer.click({ timeout: 2_000 })
    else if (await next.isVisible()) await next.click({ timeout: 2_000 })
    await expect.poll(async () => ((await readSaves(page))[modeId] || {}).cardIdx, { timeout: 2_000 }).toBe(nextIdx)
  }).toPass({ timeout: 20_000 })
}

// The end screen shows symbols only; tapping one shows what it is in the "Symbol info" line.
export async function tapSymbol(page, name) {
  await page.getByRole('button', { name }).click()
  return page.getByRole('status', { name: 'Symbol info' })
}

export async function currentCard(page, modeId) {
  const session = await waitForSave(page, modeId)
  return session.deck[session.cardIdx]
}

export const pointsCounter = (page) => page.getByText(/^PTS: \d+$/)

// The card list, read straight from PlotMix.jsx (same method as tests/data/deck-check.mjs).
// Tests run from the project root, where playwright.config.js lives.
export function readDeck() {
  const source = readFileSync(join(process.cwd(), 'PlotMix.jsx'), 'utf8')
  const start = source.indexOf('const MASTER_DECK = [')
  const end = source.indexOf('\n];', start)
  return new Function(`return ${source.slice(start + 'const MASTER_DECK = '.length, end + 2)}`)()
}

// Start a Standard run on chosen cards by saving a game and using the normal
// "Resume Game" button. The chosen cards come first; the rest fill up the deck.
export async function resumeStandardWithCards(page, cardIds) {
  const all = readDeck()
  const chosen = cardIds.map((id) => all.find((c) => c.id === id))
  const deck = [...chosen, ...all.filter((c) => !cardIds.includes(c.id))].slice(0, MODES.standard.roundCount)
  const save = {
    standard: {
      modeName: MODES.standard.label, modeId: 'standard', cardIdx: 0, guesses: [], hintsRevealed: [],
      results: [], totalScore: 0, lives: 6, timeLeft: 0, deckLen: deck.length, deck,
      dailyKey: null, schemaVersion: 2, savedAt: Date.now(),
    },
  }
  // The game wipes saved games on load unless its storage version is already recorded.
  const source = readFileSync(join(process.cwd(), 'PlotMix.jsx'), 'utf8')
  const storageVersion = source.match(/const APP_STORAGE_VERSION = "([^"]+)"/)[1]
  await page.addInitScript(([key, value, version]) => {
    if (sessionStorage.getItem('seeded')) return
    localStorage.setItem('plotmix_app_version', version)
    localStorage.setItem(key, value)
    sessionStorage.setItem('seeded', '1')
  }, [SAVE_KEY, JSON.stringify(save), storageVersion])
  await openMenu(page)
  await page.getByRole('button', { name: 'Resume Game' }).click()
  await expect(guessInput(page)).toBeVisible()
}
