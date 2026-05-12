# Underwater Math Facts Game Workflow

Source plan: `docs/specs/underwater-math-facts-game.md`

Historical note: this scaffold captured the original build-out plan. Do not continue execution from this workflow. Use `docs/upgrades/first-release-hardening-and-cloudflare-launch-workflow/` as the live source of truth for current work.

## Summary

Historical build-out scaffold from before the repo had the current playable baseline. The codebase now already includes setup, local profiles, gameplay, results, local mastery, and stats, so the remaining release work lives in the newer hardening workflow rather than in these original phase handoffs.

## Roles

- `master-developer`: Own workflow orchestration, verify that each phase still matches the product docs, and write one runtime handoff at a time.
- `developer`: Implement only the active phase, keep the change set narrow, and return control with a clear handoff note.
- `tester`: Validate only the active phase, record concrete failures or approval, and return control to master-developer.
- `researcher`: Answer bounded platform or product blockers without drifting into implementation.

## Phase Map

| Phase | Downstream Roles | Depends On | Status |
| --- | --- | --- | --- |
| [Phase 1: Foundation And Setup Shell](phases/phase-01-foundation-and-setup-shell/phase.md) | `developer -> tester` | None | `implemented_in_repo` |
| [Phase 2: Core Underwater Gameplay](phases/phase-02-core-underwater-gameplay/phase.md) | `developer -> tester` | Phase 1: Foundation And Setup Shell | `implemented_in_repo` |
| [Phase 3: Mastery And Stats](phases/phase-03-mastery-and-stats/phase.md) | `developer -> tester` | Phase 2: Core Underwater Gameplay | `implemented_in_repo` |
| [Phase 4: Polish And Cloudflare Release Prep](phases/phase-04-polish-and-cloudflare-release-prep/phase.md) | `developer -> tester` | Phase 3: Mastery And Stats | `superseded_by_release_workflow` |

## Workflow Rules

- This workflow is historical only and should not receive new downstream handoffs.
- The active workflow for release work is `docs/upgrades/first-release-hardening-and-cloudflare-launch-workflow/`.
- `master-developer` is the persistent orchestrator for the whole workflow.
- `workflow-state.yaml` is the source of truth for what should happen next.
- Each phase enters `ready_for_master_developer` before the first downstream handoff and after every downstream result.
- Each phase `role_sequence` is the expected downstream order under `master-developer` oversight.
- The scaffold does not prewrite downstream prompts. `master-developer` writes one runtime prompt at a time based on the live workflow state.
- Downstream agents should work only on the active phase and should return control to `master-developer` instead of handing off directly.
- Agents should update the current phase `run-log.md` before moving the workflow forward.
- `researcher` may be inserted for a bounded blocker even if it was not the originally expected next role. Record the reason in `run-log.md` and `workflow-state.yaml`.
- Do not start a later phase while the current phase is `blocked` or still active.
