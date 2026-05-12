# Phase 2: Gameplay And Usability Hardening

## Goal

Address the highest-priority fairness, distractor, responsiveness, and interaction issues in the current playable build.

## Depends On

- Phase 1: Audit And Workflow Alignment

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Tune distractor generation and survival pacing.
- Polish keyboard, touch, and reduced-motion behavior where needed.
- Improve responsive behavior for the current game and stats screens.

## Deliverables

- Focused gameplay or UI polish changes
- Updated tests where logic changed
- Documented remaining known limitations if any tuning is intentionally deferred

## Files Or Areas To Touch

- src/features/game/
- src/features/setup/
- src/features/stats/
- src/lib/game/
- src/styles/

## Exit Criteria

- The biggest currently-known playability gaps are addressed.
- The app remains buildable and testable after tuning.
- The first-release experience feels coherent on desktop and touch-sized layouts.

## Test Commands

- npm test
- npm run build

## Master Developer Review Focus

Keep this phase tightly scoped to release-critical polish rather than backlog features.

## Runtime Handoff Notes

- `developer`: Do not start accounts, teachers, or new content. Fix the highest-signal usability issues only.
- `tester`: Focus on whether the gameplay loop now feels fair, stable, and usable rather than on stylistic opinions.

## Next Phase Inputs

- Release candidate UI and gameplay behavior
- Known limitations list if any issues remain intentionally deferred
