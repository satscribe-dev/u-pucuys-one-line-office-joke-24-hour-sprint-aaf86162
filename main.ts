// One-Line Office Joke — make.fun entry
// Writes one single-line joke about office life to /output/entry.txt.
// Deterministic: no network, no randomness, no clock. The winning line was
// chosen in-session by a pairwise tournament over ten fresh candidates
// (see the build log); this program just records the tournament result.

import { mkdirSync, writeFileSync } from "node:fs";

// Ten candidates written fresh in this session, each one sentence, <= 200 chars.
const CANDIDATES: string[] = [
  "I set my status to 'in a meeting' so I could eat lunch, and now the meeting has a recurring invite.",
  "The office plants died, so facilities replaced them with a photo of plants and a sign saying 'growth mindset'.",
  "I booked the quiet room to take a call, and found three people in it having a louder call about quiet rooms.",
  "HR said the fridge clean-out is Friday, so I labelled my lunch 'Q3 roadmap' and nobody touched it for a month.",
  "I asked IT for a second monitor and got a mirror, a motivational poster, and a ticket marked 'resolved'.",
  "The 'quick sync' ended with a follow-up, a pre-read, and a calendar invite titled 'quick sync (part 2)'.",
  "I put 'per my last email' in bold, and my manager replied 'per my last email' in bold, and now we're just bolding at each other.",
  "I joined the meeting five minutes early to look keen, and spent five minutes watching my own face load.",
  "My out-of-office says I'm back Monday, and my inbox has already scheduled a meeting for me on Sunday.",
  "The coffee machine has a sign saying 'out of order' and a second sign saying 'please do not put a sign on the coffee machine'.",
];

// Pairwise tournament, fixed order, judged in-session against the judge
// brief (office joke first, then punchline payoff, tightness, freshness).
// Each pair lists the winner's index; the bracket is fully deterministic.
const PAIRS: Array<[number, number, number]> = [
  [0, 3, 0], // reversal beats label trick
  [4, 9, 4], // three-beat escalation beats flat observation
  [5, 7, 7], // vivid detail beats generic trope
  [6, 8, 8], // direct sting beats two-step setup
  [1, 2, 1], // reframed jargon beats predictable irony
  [0, 4, 0], // one clean reversal beats a list
  [7, 8, 7], // fresher visual beats common premise
  [1, 0, 0], // full story arc beats one-layer retort
  [0, 7, 0], // complete reversal beats smile-only observation
];

function pickWinner(): string {
  // Replay the bracket; the last pair's winner is the tournament champion.
  let champion = -1;
  for (const pair of PAIRS) {
    champion = pair[2];
  }
  if (champion < 0) throw new Error("empty tournament bracket");
  return CANDIDATES[champion];
}

// Every candidate must itself pass the gate, so no edit can silently
// promote an over-long line into the entry.
for (const c of CANDIDATES) {
  if (c.length < 1 || c.length > 200 || c.trim().length === 0 || c.includes("\n")) {
    throw new Error(`candidate fails gate: ${JSON.stringify(c.slice(0, 40))}`);
  }
}

const ENTRY = pickWinner();

// Gate self-check: one line, 1-200 characters, not only whitespace.
if (ENTRY.length < 1 || ENTRY.length > 200) {
  throw new Error(`entry length ${ENTRY.length} outside 1-200`);
}
if (ENTRY.trim().length === 0 || ENTRY.includes("\n")) {
  throw new Error("entry must be a single non-blank line");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", ENTRY, "utf8");
