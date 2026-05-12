# Math Facts

A kid-friendly underwater math facts game built with React, TypeScript, and Vite. The first release is a static browser app: student profiles, settings, best scores, and mastery progress are stored locally in the browser with `localStorage`.

## Requirements

- Node.js `20.19.4` or newer. This workspace has been verified with Node `24.15.0` and npm `11.12.1`.
- npm. Use the checked-in `package-lock.json` with `npm ci` for repeatable installs.
- A modern browser for local preview and play testing.

No backend, database, Cloudflare Worker, or environment variables are required for the first release.

## Local Setup

Install dependencies:

```sh
npm ci
```

Start the Vite dev server:

```sh
npm run dev
```

Build the production static bundle:

```sh
npm run build
```

Run the automated tests:

```sh
npm test
```

Preview the production build locally:

```sh
npm run build
npm run preview
```

The production build is emitted to `dist/`. Cloudflare Pages should deploy that directory as static assets.

## First-Release Deployment

The intended release path is GitHub-connected Cloudflare Pages:

- Framework/build: React + Vite
- Install command: `npm ci`
- Build command: `npm run build`
- Build output directory: `dist`
- Runtime: Node `20.19.4` or newer. Set `NODE_VERSION` in Cloudflare Pages if the project build image does not already use a compatible Node version.
- Environment variables: none for v1
- Backend services: none for v1

Use the detailed operator checklist in [docs/cloudflare-pages-launch.md](docs/cloudflare-pages-launch.md) for preview deployments and production domain attachment at `mathfacts.thecaseyb.com`.

The current release-candidate signoff, known limitations, and final launch checklist are in [docs/first-release-signoff.md](docs/first-release-signoff.md).

## Local Data Notes

The game stores progress per local browser profile. Clearing site data, using a different browser, or opening the app on another device will not carry progress forward in v1. Cross-device sync is intentionally deferred until a later backend phase.
