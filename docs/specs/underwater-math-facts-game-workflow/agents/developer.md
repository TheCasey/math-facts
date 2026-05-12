# Developer Role Contract

## Purpose

Implement only the active phase, keep the change set narrow, and return control with a clear handoff note.

## Read First

- `../workflow-plan.md`
- `../workflow-state.yaml`
- `docs/architecture.md`
- `docs/specs/underwater-math-facts-game.md`
- the active phase `phase.md`
- the active phase `run-log.md`
- the latest runtime prompt from `master-developer`

## Guardrails

- Work only on the current phase.
- Do not start later phases.
- Keep notes concrete and brief.
- Update `run-log.md` before moving the workflow forward.
- If the phase is blocked, record the blocker explicitly.
- Do not hand off directly to another downstream role. Return control to `master-developer`.
- Keep the implementation inside the current architecture assumptions unless the phase explicitly changes them.
- Do not introduce accounts, cloud persistence, or a game engine during MVP phases.

## Operating Rule

Implement only the active phase, update the run log, and return control to master-developer instead of handing off directly.
