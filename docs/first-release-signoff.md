# First Release Signoff

Last verified: 2026-05-12

## Local Verification

The current release candidate was verified from the production build with a local Vite preview at `http://127.0.0.1:4173/`.

Automated checks:

- `npm test`: passed, 7 test files and 24 tests.
- `npm run build`: passed, producing the static Vite bundle in `dist/`.

Manual smoke test:

- Created a new local student profile named `Phase 4 Smoke`.
- Confirmed the setup screen loaded for that profile.
- Enabled addition and multiplication with valid ranges.
- Selected Medium difficulty.
- Started a round from setup.
- Exercised gameplay answer controls with the rendered answer buttons and keyboard-focused button activation.
- Reached the results screen after a completed round.
- Opened the mastery stats screen and confirmed saved sessions and facts seen updated.
- Verified `Leave dive` returns from gameplay to setup.
- Verified `Back to setup` returns from stats to setup.
- Checked browser console warnings and errors during the smoke test; none were reported.

## Release Status

Local release verification passes. No local release blocker was found for the frontend-only first release.

This signoff does not mean the public launch has already happened. The remaining launch steps require operator access to GitHub, Cloudflare Pages, and DNS for `thecaseyb.com`.

## Known Limitations

- Progress is stored in browser `localStorage` per origin. Profiles and mastery data do not sync across devices, browsers, preview URLs, or the production domain.
- There is no account system, teacher dashboard, assignment workflow, analytics service, backend API, Worker, Pages Function, or D1 database in v1.
- Clearing browser site data removes local profiles, saved settings, scores, sessions, and mastery progress.
- Preview deployment data and `https://mathfacts.thecaseyb.com` data are separate because browser storage is origin-scoped.
- The local workspace used for verification has no `.git` metadata, so GitHub-connected Cloudflare Pages deployment cannot be executed from this checkout alone.
- `package.json` still includes an `expo` dependency and the workspace contains `.expo/`. The verified release path is Vite static hosting, and this did not block `npm test`, `npm run build`, or local production preview.

## Launch Checklist

Local preflight:

- Run `npm ci`.
- Run `npm test`.
- Run `npm run build`.
- Run `npm run preview` and open the local preview URL printed by Vite.
- Repeat the smoke path:
  - create or select a local student profile
  - choose at least one operation with a valid lowest and highest range
  - choose a difficulty
  - start a round from setup
  - answer with pointer or touch controls
  - answer with keyboard-focused button activation or number shortcuts
  - reach results
  - open mastery stats
  - verify `Leave dive` and setup/back controls return to setup

GitHub and Cloudflare Pages:

- Push the release candidate to the GitHub repository Cloudflare Pages will use.
- Create or update the Cloudflare Pages project with:
  - install command: `npm ci`
  - build command: `npm run build`
  - output directory: `dist`
  - root directory: repository root
  - environment variables: none required for v1
- Ensure the Pages build uses Node.js `20.19.0` or newer. Set `NODE_VERSION` if the Cloudflare build image needs an override.
- Open the generated `*.pages.dev` preview URL and repeat the smoke test.

Production domain:

- In the Cloudflare Pages dashboard, add `mathfacts.thecaseyb.com` as the custom domain.
- Let Cloudflare create the DNS record if `thecaseyb.com` is managed in Cloudflare.
- If DNS is managed elsewhere, create the CNAME requested by Cloudflare after the Pages custom-domain association exists.
- Wait for DNS and certificate provisioning to complete.
- Open `https://mathfacts.thecaseyb.com` and repeat the smoke test on the production origin.

Do not add Workers, D1, auth, teacher features, analytics, or a backend service as part of this v1 launch unless the roadmap and architecture are updated first.
