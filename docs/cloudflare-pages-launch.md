# Cloudflare Pages Launch Guide

This guide covers the first-release deployment path for `mathfacts.thecaseyb.com`. The app should stay static-first for this phase: Cloudflare Pages serves the Vite build from `dist/`, and no Workers, Pages Functions, D1 database, auth, or extra infrastructure are required.

## Preconditions

- The source must be pushed to a GitHub repository that Cloudflare Pages can access.
- The repository root must contain `package.json`, `package-lock.json`, `index.html`, `src/`, and `vite.config.ts`.
- Use Node.js `20.19.4` or newer. The current local verification used Node `24.15.0` and npm `11.12.1`.
- The Cloudflare account must have access to the `thecaseyb.com` zone, or the operator must be able to create the required DNS record wherever the zone is managed.

## Local Release Check

Before connecting or updating a Pages deployment, verify the static build locally:

```sh
npm ci
npm run build
npm run preview
```

Open the preview URL printed by Vite and confirm the app loads. If a browser already has old local profile data, use a fresh profile, private window, or clear site data when checking first-run behavior.

## Create The Pages Project

1. In Cloudflare, create a new Pages project.
2. Choose the GitHub-connected flow and select the math facts repository.
3. Configure the project with these settings:

| Setting | Value |
| --- | --- |
| Framework preset | React or Vite |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | repository root |
| Environment variables | none required |

If the build image does not already use Node `20.19.4` or newer, add `NODE_VERSION` with a compatible value such as `20.19.4` or `24`.

## Preview Deployment Flow

Cloudflare Pages should create preview deployments from GitHub branches and pull requests after the project is connected.

1. Push a branch to GitHub.
2. Open a pull request or let Cloudflare build the branch preview.
3. Wait for the Pages build to complete.
4. Open the generated `*.pages.dev` preview URL.
5. Smoke-test the static app:
   - create or select a local student profile
   - choose one or more operations and ranges
   - start a round
   - answer bubbles with pointer and keyboard input
   - reach results
   - open stats

Preview deployments use the same static bundle as production. Any saved profile or mastery data belongs to the browser and origin used for that preview URL.

## Production Domain: mathfacts.thecaseyb.com

Attach the custom domain from the Cloudflare Pages dashboard after the project exists.

1. Open the Pages project in Cloudflare.
2. Go to the custom domains section.
3. Add `mathfacts.thecaseyb.com`.
4. Confirm the domain association.
5. If `thecaseyb.com` is managed in Cloudflare, allow Cloudflare to create the DNS record during the custom-domain flow.
6. If DNS is managed elsewhere, create the CNAME requested by Cloudflare from `mathfacts.thecaseyb.com` to the project `*.pages.dev` hostname after the Pages custom-domain association is created.
7. Wait for DNS and certificate provisioning to finish.
8. Open `https://mathfacts.thecaseyb.com` and run the same smoke test used for previews.

Do not manually pre-create the production CNAME before associating the domain in Pages. The existing architecture notes call out that Cloudflare's custom-domain flow should come first so the association and DNS record resolve correctly.

## Hidden Assumptions To Keep Visible

- The local workspace used for this phase did not include `.git` metadata. Cloudflare's GitHub-connected flow requires the source to exist in a real GitHub repository before deployment.
- The first release is a single-page static app with no client-side URL routes beyond `/`. If future routes are added, document the Cloudflare static fallback behavior before launch; do not add server routes for v1.
- Browser storage is origin-scoped. Profiles created on a preview URL will not appear on `mathfacts.thecaseyb.com`.
- There are no required secrets. If a future feature needs API keys, accounts, or shared progress, update the roadmap and architecture before adding Cloudflare Functions, Workers, or D1.
