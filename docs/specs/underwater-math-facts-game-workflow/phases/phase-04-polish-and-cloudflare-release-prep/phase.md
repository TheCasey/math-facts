# Phase 4: Polish And Cloudflare Release Prep

Historical note: this phase has been superseded by the narrower release-hardening workflow in `docs/upgrades/first-release-hardening-and-cloudflare-launch-workflow/`. Do not dispatch work from this file.

## Goal

Harden usability, accessibility, and deployment readiness for release under the target Cloudflare subdomain.

## Depends On

- Phase 3: Mastery And Stats

## Expected Downstream Role Sequence

`developer -> tester`

## Scope

- Improve mobile and tablet layout behavior.
- Add reduced-motion support and keyboard-friendly interaction where practical.
- Prepare deployment configuration and release notes for Cloudflare Pages.
- Tune gameplay defaults based on playtest feedback.
- Keep deployment preparation centered on a Cloudflare Pages subdomain release path.

## Deliverables

- Accessibility and responsive layout pass
- Deployment-ready project configuration
- Release checklist and playtest notes

## Files Or Areas To Touch

- src/
- public/
- docs/
- README.md

## Exit Criteria

- The app is usable on tablet and desktop screen sizes.
- Reduced-motion behavior exists for bubble movement or a reasonable fallback is documented.
- Production build output is ready for Cloudflare Pages.
- Release notes capture known limitations and next steps.

## Test Commands

- npm run build
- npm run test -- --run

## Master Developer Review Focus

Keep this phase about shipping readiness, not feature expansion.

## Runtime Handoff Notes

- `developer`: Polish and harden the current scope. Do not start accounts, dashboards, or unrelated content features.
- `tester`: Focus on release-critical regressions, responsive behavior, and accessibility risks.

## Next Phase Inputs

- Production-ready MVP plus mastery support
- Documented next-step backlog for accounts or teacher features
