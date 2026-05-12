# Phase 1: Audit And Workflow Alignment

## Goal

Reconcile the planning artifacts and workflow state with the code that is already implemented so release work starts from the real current baseline.

## Depends On

- None

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Audit the implemented app against roadmap, spec, and the older broad workflow.
- Update stale workflow notes or release-facing docs so they reflect repo reality.
- Identify the highest-priority remaining release gaps.
- Treat `docs/specs/underwater-math-facts-game-workflow/` as an input to reconcile, not the source of truth for what is still unbuilt.

## Deliverables

- Updated workflow or release-state notes
- Short release-gap inventory
- Clean starting baseline for the remaining hardening phases

## Files Or Areas To Touch

- docs/
- README.md
- src/
- docs/specs/underwater-math-facts-game-workflow/

## Exit Criteria

- The docs no longer imply that setup, gameplay, and stats are unimplemented.
- The next hardening targets are explicit and grounded in the current app.
- A downstream agent can continue release work without re-auditing the whole repo.

## Test Commands

- npm test
- npm run build

## Master Developer Review Focus

Treat this phase as a reality-alignment pass, not a feature pass.

## Runtime Handoff Notes

- `developer`: Do not add new product scope. Focus on correcting stale assumptions and making the next release tasks explicit.
- `developer`: Prefer documentation and workflow-state corrections over code changes unless a tiny code adjustment is required to explain repo reality accurately.
- `tester`: Validate that the updated docs and notes match the observable behavior of the current app.

## Next Phase Inputs

- Aligned release baseline
- Explicit hardening targets
