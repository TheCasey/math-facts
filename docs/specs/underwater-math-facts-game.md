# Underwater Math Facts Game

## Product Summary

Create a simple web game where students practice addition, subtraction, multiplication, and division facts inside an underwater survival loop. Students configure the operations and number ranges they want, then answer floating multiple-choice bubbles before they drift off screen. Correct answers refill air; wrong or missed answers reduce it. The goal is to survive underwater as long as possible while building fact fluency.

## Primary Users

- Elementary students practicing math facts
- Parents or teachers helping choose practice settings
- Multiple students sharing the same device in homes or classrooms

## Product Goals

- Make fact practice feel like a replayable game instead of a worksheet.
- Give students control over which operations and ranges they practice.
- Separate math difficulty from action difficulty.
- Ship mastery tracking and progress visibility in the first release.

## Non-Goals For MVP

- Student login accounts
- Teacher dashboards
- Multiplayer or live competition
- Content management or curriculum authoring tools

## Core Game Loop

1. Student opens the app.
2. Student selects or creates their local profile.
3. Student selects one or more operations.
4. Student enters the lowest and highest operand range for each selected operation.
5. Student selects a difficulty level.
6. Student starts the round.
7. A problem appears on screen with floating answer bubbles.
8. Student clicks or taps the correct bubble before it escapes.
9. The game updates air, score, streak, and timer.
10. The game repeats until air reaches zero.
11. The app shows results and offers replay or stats.

## Profile Requirements

- The first public release must support multiple local student profiles on one device.
- Each profile should have at least:
  - display name
  - saved settings
  - best score
  - mastery and stats data
- Profile switching should be simple and fast.
- The product does not need cloud login in the first release.
- The local profile model should later map cleanly to platform accounts when this game is added to a larger system.

## Setup Requirements

### Operation selection

- The student can enable any combination of:
  - addition
  - subtraction
  - multiplication
  - division
- At least one operation must be selected before the round can start.

### Range selection

- Each selected operation has:
  - lowest operand
  - highest operand
- Validation rules:
  - both values are required
  - lowest must be less than or equal to highest
  - values must stay within a sensible application limit to avoid absurd inputs

Suggested global guardrails for MVP:

- minimum allowed input: `0`
- maximum allowed input: `20`

This limit can be raised later after playtesting.

### Progression and unlocking

- Manual custom range selection stays available in the first release.
- Mastery data should also drive a simple recommended next range for each operation.
- Example:
  - `Addition mastered through 7`
  - `Recommended next range: 1-8`
- Do not hard-lock higher ranges in v1.
- If automatic range unlocking is added later, it should be an optional guided mode rather than the only way to practice.

### Difficulty selection

Difficulty changes reaction pressure, not the configured math range.

Suggested defaults:

- `easy`: 3 bubbles, slow rise
- `medium`: 4 bubbles, medium rise
- `hard`: 5 bubbles, fast rise
- `challenge`: 6 bubbles, very fast rise

## Question Rules

### Addition

- Both addends are chosen from the configured range.
- Order can vary visually, but mastery tracking should normalize equivalent pairs.

### Subtraction

- MVP should generate non-negative answers only.
- Use the configured range for operands, but order them so the larger operand comes first.

### Multiplication

- Both factors are chosen from the configured range.
- Order can vary visually, but mastery tracking should normalize equivalent pairs.

### Division

- MVP should generate whole-number answers only.
- Never allow a zero divisor.
- Build division questions from known quotient and divisor pairs so the answer is exact.

### Mixed operation mode

- If multiple operations are enabled, select the next operation randomly from the enabled set.

## Bubble Gameplay Rules

- One correct answer bubble appears per question.
- The rest are distractor bubbles.
- Bubble positions should vary enough to avoid obvious patterns.
- Bubbles rise upward and disappear when they leave the screen.
- If the correct bubble is not selected in time, the question counts as missed.

## Scoring And Survival

Track:

- score
- current streak
- accuracy
- elapsed time
- remaining air

Suggested MVP defaults:

- start air: `100`
- correct answer: `+12` air
- wrong answer: `-18` air
- missed answer: `-10` air

The exact values should be tuned after playtesting.

## Screens

### Setup screen

- Current student profile with a switch affordance
- Game title and theme artwork
- Operation toggles
- Range inputs for selected operations
- Difficulty selection
- Start button
- Link to stats

### Profile screen or modal

- Create profile
- Select profile
- Rename profile
- Optional delete profile with confirmation

### Game screen

- Current problem
- Floating answer bubbles
- Air meter
- Score
- Streak
- Timer
- Pause or exit affordance

### Results screen

- Final score
- Total questions answered
- Accuracy
- Best streak
- Time survived
- Play again button
- View stats button

### Stats screen

This is part of the first public release.

- Progress by operation
- Highest range mastered by operation
- Strongest facts
- Weakest facts
- Overall accuracy by operation

## Mastery Model

Mastery should be fact-based, not just session-based.

For each fact, store:

- `timesSeen`
- `timesCorrect`
- `currentStreak`
- `lastPlayedAt`

Suggested mastery rule:

- seen at least `10` times
- accuracy at least `90%`
- current streak at least `5`

This threshold is intentionally softer than "20 perfect answers with no mistakes ever."

### Derived progress summaries

- For addition and multiplication, normalize equivalent pairs.
- For each operation, compute the highest fully mastered range.
- Also derive a recommended next range for continued practice.
- Example output:
  - `Addition mastered through 9`
  - `Multiplication mastered through 7`
  - `Recommended next multiplication range: 1-8`

## Accessibility Requirements

- Large tap targets
- Strong color contrast
- Reduced-motion mode
- Keyboard support for non-pointer interaction where practical
- Do not communicate correctness by color alone

## Technical Requirements

- Must work well on tablets and laptops.
- Must be deployable to the Cloudflare-managed subdomain `mathfacts.thecaseyb.com`.
- Must support local persistence even without login.
- Must be structured so cloud-backed persistence can be added later without rewriting the game logic.

## Acceptance Criteria For MVP

- A student can create and switch between local profiles.
- A student can select one or more operations and define ranges.
- A student can choose difficulty before starting.
- The game presents one problem at a time with floating answer bubbles.
- Correct, wrong, and missed answers update the round state correctly.
- The round ends when air reaches zero.
- The results screen shows a clear session summary.
- The app records per-fact performance locally.
- The stats view shows highest mastered range by operation.
- The stats view shows a recommended next range by operation.
- Manual custom ranges remain selectable even after mastery data exists.
- The app remembers recent settings, local mastery data, and a local best score per profile.
- The app can later swap local persistence for a Cloudflare-backed data layer without changing the fact model.

## Risks And Open Questions

- Bubble motion must stay fun without becoming frustrating on touch devices.
- The mastery threshold may need tuning after observing real student behavior.
- The app will eventually need a decision on whether progress is single-device only or student-specific across devices.
