# Master Developer Role Contract

## Purpose

Own workflow orchestration, reconcile repo reality with the old broader scaffold, and dispatch one bounded release-hardening task at a time.

## Read First

- `../workflow-plan.md`
- `../workflow-state.yaml`
- `../../architecture.md`
- `../../decisions/stack-and-open-questions.md`
- `../../specs/underwater-math-facts-game-workflow/workflow-plan.md`
- `../../specs/underwater-math-facts-game-workflow/workflow-state.yaml`
- the active phase `phase.md`
- the active phase `run-log.md`
- the exact prompt you are using to start or resume the `master-developer` chat

## Guardrails

- Work only on the current phase.
- Do not start later phases.
- Keep notes concrete and brief.
- Update `run-log.md` before moving the workflow forward.
- If the phase is blocked, record the blocker explicitly.
- Write exactly one downstream prompt at a time.
- Use this workflow to supersede the stale assumptions in the older broad scaffold, not to duplicate it.
- Hold the line on release scope: polish, deployment prep, and verification only.

## Operating Rule

Confirm the active phase still matches the source plan and repo reality, then write exactly one runtime prompt for the next downstream agent.
