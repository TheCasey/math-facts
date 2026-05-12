# Phase 2: Core Underwater Gameplay

Historical note: this phase is already implemented in the repo and is preserved only as a record of the original build-out plan. Do not hand off new work from this phase. Use `docs/upgrades/first-release-hardening-and-cloudflare-launch-workflow/` for active release work.

## Goal

Implement question generation, the endless underwater survival loop, and floating bubble answer interactions.

## Depends On

- Phase 1: Foundation And Setup Shell

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Generate valid questions for all four operations based on selected ranges.
- Apply difficulty to bubble count and bubble rise speed.
- Track air, score, streak, accuracy, and elapsed time.
- Handle correct, wrong, and missed answers and move cleanly to the next question.
- Keep subtraction non-negative and division whole-number only for MVP.

## Deliverables

- Question generation engine
- Playable bubble-answer round loop
- Results screen with session summary

## Files Or Areas To Touch

- src/features/game/
- src/features/results/
- src/lib/questions/
- src/lib/scoring/
- src/styles/

## Exit Criteria

- A student can start from the setup screen and reach a playable round.
- Bubble count and rise speed change with difficulty.
- Air reaches zero and ends the round cleanly.
- The results screen shows score, accuracy, best streak, and time survived.

## Test Commands

- npm run build
- npm run test -- --run

## Master Developer Review Focus

Keep this phase focused on the first fully playable loop before adding long-term progress tracking.

## Runtime Handoff Notes

- `developer`: Build the core game loop only. Do not start mastery stats or cloud persistence.
- `developer`: Keep the bubble mechanic accessible by using large clickable targets and avoid turning this phase into a Canvas or engine rewrite.
- `tester`: Verify gameplay flow, difficulty behavior, and end-of-round transitions.

## Next Phase Inputs

- Stable question engine
- Session result model
- Round state transition model
