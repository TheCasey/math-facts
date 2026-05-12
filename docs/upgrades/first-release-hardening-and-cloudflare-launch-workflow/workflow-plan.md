# First Release Hardening And Cloudflare Launch Workflow

Source plan: `docs/upgrades/first-release-hardening-and-cloudflare-launch.md`

## Summary

Take the already-implemented underwater math facts app through release hardening, workflow alignment, Cloudflare Pages preparation, and final verification for the first public launch.

This workflow supersedes the older build-out scaffold in `docs/specs/underwater-math-facts-game-workflow/`.

## Roles

- `master-developer`: Own workflow orchestration, reconcile repo reality with the old broader scaffold, and dispatch one bounded release-hardening task at a time.
- `developer`: Implement only the active hardening or deployment-prep slice and leave clear release-oriented notes.
- `tester`: Validate only the active slice and record concrete release risks, pass criteria, or blockers.
- `researcher`: Answer bounded Cloudflare or release-process blockers without drifting into implementation.

## Phase Map

| Phase | Downstream Roles | Depends On | Status |
| --- | --- | --- | --- |
| [Phase 1: Audit And Workflow Alignment](phases/phase-01-audit-and-workflow-alignment/phase.md) | `developer -> tester` | None | `ready_for_master_developer` |
| [Phase 2: Gameplay And Usability Hardening](phases/phase-02-gameplay-and-usability-hardening/phase.md) | `developer -> tester` | Phase 1: Audit And Workflow Alignment | `pending` |
| [Phase 3: Cloudflare Pages Prep](phases/phase-03-cloudflare-pages-prep/phase.md) | `developer -> tester` | Phase 2: Gameplay And Usability Hardening | `pending` |
| [Phase 4: Release Verification And Signoff](phases/phase-04-release-verification-and-signoff/phase.md) | `developer -> tester` | Phase 3: Cloudflare Pages Prep | `pending` |

## Workflow Rules

- `master-developer` is the persistent orchestrator for the whole workflow.
- `workflow-state.yaml` is the source of truth for what should happen next.
- Each phase enters `ready_for_master_developer` before the first downstream handoff and after every downstream result.
- Each phase `role_sequence` is the expected downstream order under `master-developer` oversight.
- The scaffold does not prewrite downstream prompts. `master-developer` writes one runtime prompt at a time based on the live workflow state.
- Downstream agents should work only on the active phase and should return control to `master-developer` instead of handing off directly.
- Agents should update the current phase `run-log.md` before moving the workflow forward.
- `researcher` may be inserted for a bounded blocker even if it was not the originally expected next role. Record the reason in `run-log.md` and `workflow-state.yaml`.
- Do not start a later phase while the current phase is `blocked` or still active.
