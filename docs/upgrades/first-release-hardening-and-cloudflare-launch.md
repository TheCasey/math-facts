# First Release Hardening And Cloudflare Launch

## Summary

The current repo already contains a working first-pass implementation of the underwater math facts game: local student profiles, setup flow, underwater gameplay, results, and mastery stats all exist in code. The next step is to harden that implementation for a real first release and prepare it for GitHub-connected Cloudflare Pages deployment on `mathfacts.thecaseyb.com`.

This plan intentionally does not reopen the solved product questions around operations, mastery, local profiles, or progression. It focuses on release readiness.

## Evidence Of Current State

The following files show that the core release scope is already implemented:

- `src/App.tsx`
- `src/features/setup/SetupScreen.tsx`
- `src/features/game/GameScreen.tsx`
- `src/features/results/ResultsScreen.tsx`
- `src/features/stats/StatsScreen.tsx`
- `src/lib/game/storage.ts`
- `src/lib/game/mastery.ts`
- `src/lib/game/questions.ts`
- `src/lib/game/validation.ts`
- `src/lib/game/questions.test.ts`
- `src/lib/game/mastery.test.ts`
- `src/lib/game/validation.test.ts`

The current execution workflow in `docs/specs/underwater-math-facts-game-workflow/` is now stale because it preserves the original build-out phases even though the repo already spans setup, gameplay, and stats. That older scaffold is now historical and has been superseded by the release-hardening workflow.

## Release Gap Inventory

### Phase 2: Gameplay and usability hardening only

- Enforce setup validation before entering gameplay. `src/features/setup/SetupScreen.tsx` renders validation errors, but the start action is still always available and `src/App.tsx` starts the dive without rechecking settings.
- Improve distractor quality and survival pacing in the current implementation. `src/lib/game/questions.ts` still uses generic numeric offsets for distractors, and `src/features/game/GameScreen.tsx` still needs release-quality tuning rather than first-pass defaults.
- Verify and tighten keyboard, touch, reduced-motion, and responsive behavior for the existing UI. The repo already has button-based controls and a reduced-motion fallback, but those interaction paths still need a release pass on tablet and Chromebook-oriented layouts.

### Phase 3: Cloudflare Pages prep only

- Add the missing baseline repo usage docs. There is still no top-level `README.md`.
- Document the GitHub-connected Cloudflare Pages preview flow and production-domain attachment for `mathfacts.thecaseyb.com`.
- Surface any hidden local assumptions that would block another maintainer from building or previewing the app.

### Phase 4: Verification and signoff only

- Run `npm test` and `npm run build` against the release candidate.
- Manually smoke-test the existing profile, setup, gameplay, results, and stats flow.
- Publish the known limitations note and the launch checklist.

## Goals

- Make the current app feel stable and fair enough for a first release.
- Close the most important usability and accessibility gaps.
- Add clear deployment and preview guidance for GitHub-connected Cloudflare Pages.
- Produce a release checklist that matches the real current app rather than the original scaffold assumptions.

## Non-Goals

- Student accounts or cloud sync
- Teacher dashboard work
- Content expansion such as new game modes or themes
- Backend or database work

## Workstreams

### 1. Release-readiness audit

- Reconcile the planning docs and workflow state with the code that already exists.
- Identify the highest-signal remaining issues in the current implementation.
- Remove or clarify stale assumptions in the old workflow so future work does not start from the wrong phase.

### 2. Gameplay and usability hardening

- Tune distractors so wrong answers feel plausible without being random noise.
- Improve fairness and pacing in the survival loop, especially on `easy` and `medium`.
- Add any missing keyboard or touch interaction polish needed for classroom-friendly use.
- Verify reduced-motion behavior and responsive layout against the implemented game loop.

### 3. Deployment preparation

- Add or improve repo-level guidance for local development, build, and release.
- Document the Cloudflare Pages setup flow for GitHub previews and the production custom domain `mathfacts.thecaseyb.com`.
- Ensure the build output and scripts are deployment-ready without requiring hidden local steps.

### 4. Release verification and signoff

- Run the relevant automated tests and production build.
- Manually verify core flows in the browser against the current release candidate.
- Produce a short release checklist and known-limitations note.

## Deliverables

- Updated docs that reflect the actual implemented state of the project
- Tuned gameplay or UI fixes required for first-release quality
- Cloudflare Pages deployment guide for preview deploys and production domain attachment
- Release checklist with concrete verification steps and known limitations

## Acceptance Criteria

- The current implementation and workflow docs no longer contradict each other about what has already been built.
- The app has a documented, repeatable path to GitHub-connected Cloudflare Pages deployment.
- The highest-priority fairness or usability issues in the existing game loop are addressed.
- Release verification covers build, tests, and manual browser smoke checks.
- The project has a clear first-release checklist for `mathfacts.thecaseyb.com`.

## Risks

- The gameplay may still need one or two rounds of tuning after real student use.
- Some deployment steps will remain dashboard-driven and cannot be fully encoded in repo files.
- The old broad workflow may confuse future work unless this narrower release workflow clearly supersedes it for the next phase of work.

## Recommended Sequence

1. Audit and align docs with repo reality.
2. Fix the highest-priority polish and fairness gaps.
3. Write the Cloudflare Pages release guide and preview-deploy instructions.
4. Run final verification and produce a release checklist.
