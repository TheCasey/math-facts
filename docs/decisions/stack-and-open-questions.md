# Stack And Open Questions

## Recommended V1 Stack

- React + TypeScript + Vite
- Cloudflare Pages for hosting
- Plain CSS with CSS variables for styling
- `localStorage` for saved settings, best scores, and early mastery data
- Vitest and React Testing Library for logic and component tests

## Release-Phase Status

- The stack and scope decisions here are already reflected in the current repo.
- Local profiles, setup, gameplay, results, mastery tracking, and stats are implemented.
- The remaining workflow should stay limited to release hardening, Cloudflare Pages prep, and final verification.

## Confirmed Decisions

- Separate min and max ranges per selected operation ship in the current repo.
- Mastery tracking and stats ship in the current repo.
- Multiple local student profiles ship in the current repo.
- Deployment will use GitHub-connected Cloudflare Pages with preview deploys.
- Range progression in v1 will be mastery-informed but not hard-locked.
- The planned production host is `mathfacts.thecaseyb.com`.

## Why Not A Heavier Stack

### Why not Next.js first

- The product is a browser game, not a content-heavy or SEO-heavy site.
- Server rendering is not needed for the core gameplay loop.
- Vite keeps the first build simpler and faster to reason about.

### Why not Phaser or another game engine first

- The interaction model is simple enough for DOM and CSS.
- Accessibility is easier when answer bubbles are still ordinary buttons.
- It reduces initial complexity while the gameplay is still being proven.

## Cloudflare Fit

The current recommendation is to host the app on Cloudflare Pages and place it on your chosen subdomain. This is a good fit because Cloudflare documents a React-on-Pages deployment path, supports attaching a custom subdomain to a Pages project, and treats static asset requests as free and unlimited on Pages. The suggestion to stay frontend-only until accounts or teacher dashboards exist is a product and operational tradeoff inferred from those platform capabilities.

## Recommended Progression Model

I recommend a soft progression model for v1:

- Let students or adults still enter custom ranges manually.
- Use mastery to show `mastered through X` and `recommended next range`.
- Reserve strict automatic unlocking for a later optional guided mode.

This keeps the original flexibility you asked for while still giving mastery a practical use in the first release.

## When To Add A Backend

Do not add a backend in v1 unless at least one of these becomes a hard requirement:

- student accounts
- cross-device sync
- classroom or teacher dashboard
- server-side progress reporting
- moderation or content management

If one of those becomes required, add Pages Functions or Workers and store durable data in D1.

## Resolved In Code For This Release

- The current build stays frontend-only and local-profile based.
- The game is silent in the first release baseline.
- Subtraction stays non-negative and division stays whole-number only.
- Progression is recommendation-based, not hard-locked.

If any of those change, update the roadmap and spec before implementation.

## Remaining Release-Level Decision

- Decide whether `mathfacts.thecaseyb.com` should go public immediately after Phase 4 or after a short preview-only burn-in. This is launch sequencing, not missing product scope.

## Cloudflare Domain Note

You do not need to pre-create `mathfacts.thecaseyb.com` before building the app. The practical flow is:

- Create the Cloudflare Pages project and connect it to GitHub.
- Go through the Pages custom-domain flow for `mathfacts.thecaseyb.com`.
- If `thecaseyb.com` is already managed as a Cloudflare zone, Cloudflare can add the needed CNAME record after you confirm the domain association.
- If it is not managed as a Cloudflare zone, create a CNAME from `mathfacts.thecaseyb.com` to the project `*.pages.dev` hostname after associating the custom domain in the Pages dashboard.

The order matters because Cloudflare documents that manually adding the CNAME before associating the subdomain in the Pages dashboard can fail to resolve correctly.

## Cloudflare References

- React on Pages: https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/
- Pages custom domains: https://developers.cloudflare.com/pages/configuration/custom-domains/
- Pages pricing: https://developers.cloudflare.com/pages/functions/pricing/
- D1 overview: https://developers.cloudflare.com/d1/
