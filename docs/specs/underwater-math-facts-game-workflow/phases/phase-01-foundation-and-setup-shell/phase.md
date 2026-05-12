# Phase 1: Foundation And Setup Shell

Historical note: this phase is already implemented in the repo and is preserved only as a record of the original build-out plan. Do not hand off new work from this phase. Use `docs/upgrades/first-release-hardening-and-cloudflare-launch-workflow/` for active release work.

## Goal

Bootstrap the project for Cloudflare Pages, define the typed game contracts, and implement the setup portal with operation, range, and difficulty selection.

## Depends On

- None

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Scaffold the React and TypeScript app for Cloudflare Pages.
- Define the core domain types for operations, ranges, settings, questions, and round state.
- Define the local student profile model and switching flow.
- Implement the setup screen and input validation.
- Persist recent settings locally.
- Support separate min and max range inputs for each selected operation in the setup UX.

## Deliverables

- Working frontend project scaffold
- Local profile model and profile-selection shell
- Setup screen with selectable operations, ranges, and difficulty
- Local settings persistence
- Stable domain model for later phases

## Files Or Areas To Touch

- package.json
- vite.config.ts
- src/App.tsx
- src/features/setup/
- src/lib/game/
- src/styles/

## Exit Criteria

- The app builds and renders the setup portal.
- A student can create or select a local profile before starting.
- At least one operation is required before starting.
- Each selected operation validates min and max inputs.
- Difficulty is stored in the settings model and saved locally.

## Test Commands

- npm run build
- npm run test -- --run

## Master Developer Review Focus

Keep this phase limited to project setup and the pre-game configuration flow.

## Runtime Handoff Notes

- `developer`: Do not start the gameplay loop yet. Focus on the app shell, data contracts, setup UX, and local settings persistence.
- `developer`: Build profile selection into the shell now so later mastery and stats work can key off a stable local profile id.
- `developer`: Prefer a simple Vite and React setup that can deploy cleanly to Cloudflare Pages without requiring a backend.
- `tester`: Validate setup behavior, input validation, and build health only.

## Next Phase Inputs

- Stable local profile contract
- Stable settings model
- Validated setup flow
- Project scaffold ready for gameplay wiring
