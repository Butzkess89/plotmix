# Retired cards

Cards removed from `MASTER_DECK` in `PlotMix.jsx`, kept here so no writing is lost.
To bring one back, copy its block into `MASTER_DECK` (the deck check, `npm run test:data`, will flag any duplicates).

## #69 "The Fault in Our Star Wars" (removed 2026-10-15)

- **Why:** same film pair and title as card #51. The game already dropped #69 at runtime (`uniqueCardsByMoviePair` keeps the first card of a pair), so players never saw it. Removing it changed no playable card and no Daily card (checked over the next 730 days).
- **Owner decision 2026-10-19:** #69's plot, hints, connection and hint data were moved into card #51 (keeping id 51, so the Daily schedule does not change). #51's previous writing is kept below.

```js
  {
    id: 69,
    mashedTitle: "The Fault in Our Star Wars",
    mashedPlot: "Two teenagers meet at a cancer support group in Indianapolis and fall deeply in love. When they travel to Amsterdam to meet a reclusive author, they discover he has secretly been recruited by the Rebel Alliance — and that the only way to save their relationship is to destroy the Death Star.",
    movies: ["The Fault in Our Stars", "Star Wars"],
    aliases: [["Fault in Our Stars", "The Fault In Our Stars"], ["Star Wars A New Hope", "Star Wars Episode 4", "Episode IV", "A New Hope"]],
    hints: ["One is a 2014 teen romance based on a John Green novel. The other is a 1977 space opera that changed cinema forever.", "One stars Shailene Woodley and Ansel Elgort. The other stars Mark Hamill, Harrison Ford and Carrie Fisher.", "A terminal cancer diagnosis meets the Force, lightsabers, and a galaxy far, far away."],
    difficulty: "Easy",
    difficultyReason: "Both films are massively well-known and the title mashup writes itself — players will laugh the moment they see the answer",
    connection: "Both films are fundamentally about young people confronting impossible odds — one against illness, one against an evil empire — and choosing love and hope anyway.",
    hintData: {"films":[{"year":2014,"genre":"Romantic Drama","actors":["Shailene Woodley","Ansel Elgort"]},{"year":1977,"genre":"Sci-Fi Adventure","actors":["Mark Hamill","Harrison Ford","Carrie Fisher"]}]}
  },
```

## #51 "The Fault in Our Star Wars": previous writing (replaced 2026-10-19)

```js
  {
    id: 51,
    mashedTitle: "The Fault in Our Star Wars",
    mashedPlot: "Two teenagers who meet at a cancer support group form a bittersweet romance while becoming entangled in an intergalactic rebellion against an evil empire, discovering the power of the Force along the way.",
    movies: ["The Fault in Our Stars", "Star Wars"],
    aliases: [["the fault in our stars", "fault in our stars"], ["star wars", "a new hope", "star wars a new hope", "star wars episode iv"]],
    hints: ["One is a YA cancer romance; the other the defining science fiction saga.", "Both feature young people who discover their lives are part of something much larger than themselves.", "Hazel and Augustus meet Luke and Leia."],
    difficulty: "Easy",
    difficultyReason: "Both are among the most recognisable films of their era",
    connection: "The Fault in Our Stars and Star Wars are both stories about young people who discover they have very little time and choose to spend it fighting for something that matters.",
    hintData: {"films": [{"year": 2014, "genre": "Romantic Drama", "actors": ["Shailene Woodley", "Ansel Elgort"]}, {"year": 1977, "genre": "Sci-Fi Adventure", "actors": ["Mark Hamill", "Harrison Ford"]}]},
  },
```
