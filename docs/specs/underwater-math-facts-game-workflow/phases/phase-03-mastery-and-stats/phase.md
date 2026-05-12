# Phase 3: Mastery And Stats

Historical note: this phase is already implemented in the repo and is preserved only as a record of the original build-out plan. Do not hand off new work from this phase. Use `docs/upgrades/first-release-hardening-and-cloudflare-launch-workflow/` for active release work.

## Goal

Track per-fact performance locally and present simple progress views by operation.

## Depends On

- Phase 2: Core Underwater Gameplay

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Define fact keys and mastery update rules.
- Scope stats, best scores, and mastery records to the active local profile.
- Persist fact stats in localStorage.
- Compute highest mastered range by operation.
- Build a stats screen for strengths, weaknesses, and progress summaries.
- Use normalized fact keys for addition and multiplication so equivalent pairs do not split progress.

## Deliverables

- Fact mastery storage model
- Profile-aware local persistence model
- Stats screen
- Derived highest mastered range summaries

## Files Or Areas To Touch

- src/features/stats/
- src/lib/mastery/
- src/lib/storage/
- src/styles/

## Exit Criteria

- The game records per-fact results after rounds.
- Profile switching does not leak mastery or best-score data between students.
- Addition and multiplication facts are normalized for mastery tracking.
- The stats view shows progress by operation and highest mastered range.
- Mastery logic is covered by targeted automated tests.

## Test Commands

- npm run build
- npm run test -- --run

## Master Developer Review Focus

Keep this phase local-only unless a hard product requirement forces a cloud data layer.

## Runtime Handoff Notes

- `developer`: Do not add accounts or backend storage. Implement local mastery and the student-facing stats view only.
- `developer`: Keep stats and mastery strictly profile-scoped so later platform account integration can replace the local profile id cleanly.
- `developer`: Start with the documented default mastery rule of seen at least 10 times, at least 90 percent accuracy, and a current streak of at least 5 unless the product docs are updated first.
- `tester`: Validate mastery calculations, normalization behavior, and stats rendering.

## Next Phase Inputs

- Stable local mastery model
- Stable profile-aware persistence model
- Stats UX ready for polish and release hardening
