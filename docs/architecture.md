# Architecture

## Recommended Stack

- UI framework: React
- Language: TypeScript
- Build tool: Vite
- Hosting: Cloudflare Pages
- Optional server layer later: Pages Functions or Workers
- Optional cloud database later: D1
- Testing: Vitest for logic coverage today, with React Testing Library or browser-level checks added only where release hardening needs them

## Why This Stack

The recommended v1 architecture is a static React application deployed to Cloudflare Pages. This is the lightest path that still fits your subdomain deployment requirement and gives room to add server-side features later. The recommendation is based on Cloudflare's React-on-Pages guide, Cloudflare Pages custom-domain support, and Cloudflare's note that static asset requests on Pages are free and unlimited. The recommendation to delay D1 until accounts or shared reporting exist is an inference from those docs and from the product scope, not a direct Cloudflare claim.

## Current Repo Snapshot

The current repo already contains the first playable release baseline:

- `src/App.tsx` wires profile management plus setup, gameplay, results, and stats views.
- `src/features/setup/SetupScreen.tsx`, `src/features/game/GameScreen.tsx`, `src/features/results/ResultsScreen.tsx`, and `src/features/stats/StatsScreen.tsx` implement the student-facing flow.
- `src/lib/game/storage.ts`, `src/lib/game/mastery.ts`, `src/lib/game/questions.ts`, and `src/lib/game/validation.ts` hold the local persistence and pure game logic.
- `src/lib/game/questions.test.ts`, `src/lib/game/mastery.test.ts`, and `src/lib/game/validation.test.ts` cover the core math and mastery rules.

Phase 1 of the release-hardening workflow should therefore treat setup, gameplay, mastery, and stats as implemented, then focus on the remaining hardening, documentation, and verification gaps.

## Deployment Topology

### V1

- Browser client served from Cloudflare Pages
- No required backend
- Local persistence via `localStorage`
- GitHub-connected preview deployments through Cloudflare Pages
- Production host on a Cloudflare-managed subdomain such as `math.yourdomain.com`

### Later, if accounts or teacher reporting are added

- Browser client served from Cloudflare Pages
- API routes via Pages Functions or Workers
- Persistent student and mastery data in D1

## Application Slices

The current repo already contains these slices:

### Setup Portal

- Operation selection
- Range inputs per selected operation
- Difficulty selection
- Start action

### Game Loop

- Current problem display
- Bubble answer generation and movement
- Air meter, score, streak, and timer
- Correct, wrong, and missed-answer resolution

### Results And Stats

- End-of-round summary
- Best score
- Accuracy and streak summaries
- Mastery views by operation

### Persistence

- Saved settings
- Best scores
- Per-fact mastery records

## State Model

Use a typed domain model and keep math logic outside the components.

Suggested core types:

- `Operation`: `add | subtract | multiply | divide`
- `RangeSettings`: `min`, `max`
- `Difficulty`: `easy | medium | hard | challenge`
- `StudentProfile`: `id`, `name`, `createdAt`, `lastPlayedAt`
- `GameSettings`: selected operations, per-operation ranges, difficulty
- `Question`: operands, operation, prompt, correct answer, distractors
- `RoundState`: air, score, streak, accuracy, elapsed time, current question
- `FactKey`: normalized identifier for mastery tracking
- `FactStats`: seen count, correct count, current streak, last played timestamp, mastered flag

## Question Generation Rules

- Addition: choose both operands inside the configured range.
- Subtraction: generate non-negative answers for MVP by ordering larger minus smaller.
- Multiplication: choose operands inside the configured range.
- Division: generate exact whole-number problems only and forbid zero divisors.
- Mixed mode: randomly select from enabled operations.

For mastery tracking:

- Normalize addition and multiplication fact keys so `3 + 4` and `4 + 3` count as the same fact.
- Do not normalize subtraction or division.

## Difficulty System

Difficulty should change reaction pressure, not the underlying math range.

Suggested defaults:

- `easy`: 3 answer bubbles, slow rise speed
- `medium`: 4 answer bubbles, moderate rise speed
- `hard`: 5 answer bubbles, fast rise speed
- `challenge`: 6 answer bubbles, very fast rise speed

Optional later tunables:

- Faster air drain
- Shorter spawn windows
- More similar distractors

## Motion And Rendering

The current implementation already uses standard DOM elements and CSS animation, with a reduced-motion fallback that swaps floating bubbles for a static answer grid.

Reasons:

- Easier accessibility and keyboard support
- Faster MVP delivery
- Simple debugging and responsive layout work
- Adequate performance for a small number of bubbles

If bubble density or effects later become performance-limited, revisit Canvas after measuring.

## Persistence Strategy

### MVP

- `localStorage` for:
  - local student profiles
  - saved settings
  - best scores
  - recent session stats
  - per-profile mastery records

Store local data under a profile-aware structure so each student has isolated settings, best score, and mastery progress. Keep the storage adapter abstract enough that a future platform account or cloud identity can replace the local profile id without changing the rest of the game logic.

### Mastery phase

- `localStorage` for per-fact stats and derived mastery summaries

### Cross-device phase

- Move persistence behind an API and store in D1
- Keep the client-side domain model stable so storage can swap without rewriting the UI

## Testing Strategy

- Current repo coverage: unit tests for question generation, mastery rules, and setup validation logic
- Release-hardening gap: setup-flow guardrails are not yet covered at the component or browser level
- Release-hardening gap: no documented final smoke test yet covers profile -> setup -> game -> results -> stats
- Manually verify tablet, touch, reduced-motion, and keyboard usability before any release

## Cloudflare References

- React on Pages: https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/
- Pages custom domains: https://developers.cloudflare.com/pages/configuration/custom-domains/
- Pages pricing for static assets and functions: https://developers.cloudflare.com/pages/functions/pricing/
- D1 overview: https://developers.cloudflare.com/d1/
