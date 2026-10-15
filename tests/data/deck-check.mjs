// Card-data check for the PlotMix deck. Run with: npm run test:data
// Reads MASTER_DECK straight from PlotMix.jsx (no changes to the game code needed)
// and fails if any card is malformed or duplicated.
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../../PlotMix.jsx', import.meta.url), 'utf8')
const start = source.indexOf('const MASTER_DECK = [')
const end = source.indexOf('\n];', start)
if (start < 0 || end < 0) throw new Error('MASTER_DECK not found in PlotMix.jsx')
const deck = new Function(`return ${source.slice(start + 'const MASTER_DECK = '.length, end + 2)}`)()

const DIFFICULTIES = new Set(['Easy', 'Medium', 'Hard'])
const norm = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
const nonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0

const problems = []
const seen = { id: new Map(), title: new Map(), pair: new Map() }
const noteDuplicate = (kind, key, id) => {
  if (seen[kind].has(key)) problems.push(`#${id}: duplicate ${kind} of #${seen[kind].get(key)} (${key})`)
  else seen[kind].set(key, id)
}

for (const card of deck) {
  const id = card.id
  if (!Number.isInteger(id)) problems.push(`card without integer id: ${JSON.stringify(card).slice(0, 60)}`)
  for (const field of ['mashedTitle', 'mashedPlot', 'connection', 'difficultyReason']) {
    if (!nonEmptyString(card[field])) problems.push(`#${id}: missing ${field}`)
  }
  if (!Array.isArray(card.movies) || card.movies.length !== 2 || !card.movies.every(nonEmptyString)) {
    problems.push(`#${id}: movies must be two titles`)
  }
  if (!Array.isArray(card.aliases) || card.aliases.length !== 2 || !card.aliases.every(Array.isArray)) {
    problems.push(`#${id}: aliases must be two lists`)
  }
  if (!Array.isArray(card.hints) || card.hints.length === 0 || !card.hints.every(nonEmptyString)) {
    problems.push(`#${id}: hints missing`)
  }
  if (!DIFFICULTIES.has(card.difficulty)) problems.push(`#${id}: difficulty "${card.difficulty}"`)
  const films = card.hintData?.films
  if (!Array.isArray(films) || films.length !== 2) problems.push(`#${id}: hintData.films must have two films`)
  else films.forEach((f, i) => {
    if (!Number.isInteger(f.year) || f.year < 1890 || f.year > 2100) problems.push(`#${id}: film ${i + 1} year`)
    if (!nonEmptyString(f.genre)) problems.push(`#${id}: film ${i + 1} genre`)
    if (!Array.isArray(f.actors) || !f.actors.length || !f.actors.every(nonEmptyString)) problems.push(`#${id}: film ${i + 1} actors`)
  })

  noteDuplicate('id', id, id)
  if (nonEmptyString(card.mashedTitle)) noteDuplicate('title', norm(card.mashedTitle), id)
  if (Array.isArray(card.movies)) noteDuplicate('pair', card.movies.map(norm).sort().join(' + '), id)
}

if (problems.length) {
  console.error(`Deck check FAILED: ${problems.length} problem(s) in ${deck.length} cards`)
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}
console.log(`Deck check passed: ${deck.length} cards`)
