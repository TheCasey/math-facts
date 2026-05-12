# Phase 3: Cloudflare Pages Prep

## Goal

Make the repo and docs ready for GitHub-connected Cloudflare Pages previews and production attachment on mathfacts.thecaseyb.com.

## Depends On

- Phase 2: Gameplay And Usability Hardening

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Add or improve repo documentation for install, dev, build, and deploy.
- Document the Cloudflare Pages preview and custom-domain flow.
- Ensure there are no hidden local-only assumptions blocking deployment.
- Keep the deployment path static-first and GitHub-connected; do not introduce Workers, D1, or extra infra for this phase.

## Deliverables

- Deployment documentation
- Preview-deploy and production-domain checklist
- Any minimal repo config changes needed for clean deployment

## Files Or Areas To Touch

- README.md
- docs/
- package.json

## Exit Criteria

- A maintainer can follow the repo docs to build and prepare the app for Cloudflare Pages.
- The preview-deploy and custom-domain flow is documented for mathfacts.thecaseyb.com.
- The repo does not rely on undocumented local setup tricks.

## Test Commands

- npm run build

## Master Developer Review Focus

Keep this phase pragmatic and documentation-oriented unless a tiny repo change is clearly required.

## Runtime Handoff Notes

- `developer`: Focus on making deployment repeatable and understandable, not on inventing infrastructure that the app does not need.
- `developer`: Assume some final steps stay in the Cloudflare dashboard and document them clearly instead of trying to replace them with unnecessary repo config.
- `tester`: Validate the docs against the real repo commands and flag any missing steps.

## Next Phase Inputs

- Documented deployment path
- Release checklist draft
