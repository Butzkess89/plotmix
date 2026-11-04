// Phase 3C-1: security headers (audit item S3). `vite preview` sends the same headers as
// vercel.json, so these tests, and every other test, run under the live site's policy.
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { test, expect } from '@playwright/test'
import { openMenu, submitGuess, resumeStandardWithCards, readDeck } from './helpers.js'

const vercel = JSON.parse(readFileSync(join(process.cwd(), 'vercel.json'), 'utf8'))
const expected = Object.fromEntries(vercel.headers[0].headers.map((h) => [h.key.toLowerCase(), h.value]))

// Record every Content Security Policy violation the page reports.
async function recordViolations(page) {
  await page.addInitScript(() => {
    window.__csp = []
    document.addEventListener('securitypolicyviolation', (e) => {
      window.__csp.push(`${e.violatedDirective} blocked ${e.blockedURI || 'inline'}`)
    })
  })
}

test.describe('3C-1 security headers', () => {
  test('the live-site config applies to every page and file', async () => {
    expect(vercel.headers).toHaveLength(1)
    expect(vercel.headers[0].source).toBe('/(.*)')
  })

  test('the policy allows only this site: no eval, no outside scripts, no framing', async () => {
    const csp = expected['content-security-policy']
    expect(csp).toContain("default-src 'self'")
    expect(csp).toMatch(/script-src 'self'(;|$)/) // nothing else may run scripts, and no eval
    expect(csp).not.toContain('unsafe-eval')
    expect(csp).toContain("object-src 'none'")
    expect(csp).toContain("frame-ancestors 'none'")
    expect(expected['x-content-type-options']).toBe('nosniff')
    expect(expected['x-frame-options']).toBe('DENY')
  })

  test('the built game code never calls eval (the confetti uses the light Lottie player)', async () => {
    const dir = join(process.cwd(), 'dist', 'assets')
    const bundles = readdirSync(dir).filter((f) => f.endsWith('.js'))
    expect(bundles.length).toBeGreaterThan(0)
    for (const f of bundles) expect(/\beval\(/.test(readFileSync(join(dir, f), 'utf8')), f).toBe(false)
  })

  test('the page and its script are served with the headers', async ({ page }) => {
    const scripts = []
    page.on('response', (r) => { if (r.url().endsWith('.js')) scripts.push(r) })
    const response = await page.goto('/')
    const pageHeaders = response.headers()
    for (const [key, value] of Object.entries(expected)) expect(pageHeaders[key]).toBe(value)
    await expect.poll(() => scripts.length).toBeGreaterThan(0)
    expect(scripts[0].headers()['content-security-policy']).toBe(expected['content-security-policy'])
  })

  test('the menu, a solved card and its confetti run with no policy violations', async ({ page }) => {
    const errors = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await recordViolations(page)
    await openMenu(page)
    const deck = readDeck()
    await resumeStandardWithCards(page, [77, 1, 2])
    await submitGuess(page, deck.find((c) => c.id === 77).mashedTitle)
    await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeVisible()
    // The confetti is a Lottie animation drawn as SVG by the light (eval-free) player.
    await expect(page.locator('svg g[clip-path^="url(#__lottie_element"]').first()).toBeAttached()
    expect(await page.evaluate(() => window.__csp)).toEqual([])
    expect(errors).toEqual([])
  })

  test('a fresh visit (intro video, how-to-play) has no policy violations', async ({ page }) => {
    await recordViolations(page)
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Skip how to play' })).toBeVisible({ timeout: 30_000 })
    expect(await page.evaluate(() => window.__csp)).toEqual([])
  })
})
