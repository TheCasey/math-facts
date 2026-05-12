# Phase 4: Release Verification And Signoff

## Goal

Run the final release checks, summarize known limitations, and produce a clear signoff checklist for the first public launch.

## Depends On

- Phase 3: Cloudflare Pages Prep

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Run the final automated checks.
- Manually verify the core app flows against the release candidate.
- Document the known limitations and launch checklist.

## Deliverables

- Release checklist
- Known limitations note
- Final verification summary

## Files Or Areas To Touch

- docs/
- README.md

## Exit Criteria

- The release candidate has a clear pass or blocker summary.
- The launch checklist is concrete enough to use during Cloudflare Pages setup.
- Known limitations are documented instead of implied.

## Test Commands

- npm test
- npm run build

## Master Developer Review Focus

This phase is about signoff quality, not additional feature work.

## Runtime Handoff Notes

- `developer`: Record release readiness clearly and keep any final edits minimal.
- `tester`: Treat this as a release gate and enumerate concrete blockers if the app is not yet ready.

## Next Phase Inputs

- Launch-ready release notes
- Clear blockers if the app is not ready
