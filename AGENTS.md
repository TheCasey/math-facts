# AGENTS

## Mission

Build a kid-friendly, web-based math facts game with an underwater survival theme. The product should be simple to deploy under a Cloudflare-managed subdomain and should prioritize fast interaction, clear feedback, and low operational complexity.

## Read Order

Before planning or coding, read these files in order:

1. `AGENTS.md`
2. `docs/roadmap.md`
3. `docs/architecture.md`
4. `docs/specs/underwater-math-facts-game.md`
5. `docs/decisions/stack-and-open-questions.md`

## Default Technical Assumptions

- Frontend: React + TypeScript + Vite
- Hosting: Cloudflare Pages on a custom subdomain
- State management: local React state plus `useReducer` for the game loop
- Styling: plain CSS with CSS variables; no design system dependency unless the repo later adopts one
- Persistence for v1: `localStorage`, scoped by local student profile
- Persistence for cross-device sync later: Cloudflare Pages Functions or Workers plus D1
- Animation: DOM elements and CSS animations first; do not introduce a game engine unless the browser implementation proves inadequate

## Product Guardrails

- The setup flow must let students choose one or more operations: addition, subtraction, multiplication, and division.
- Each selected operation must support a configurable lowest and highest operand range.
- Difficulty must control bubble count and bubble speed independently from the math range.
- The first public release must support separate local profiles so multiple students can use one device without mixing progress.
- The underwater loop must stay readable on tablets, laptops, and school Chromebooks.
- Treat accessibility as a first-order feature: large targets, strong contrast, keyboard fallback, and reduced-motion support.
- Avoid punitive mastery rules. Prefer progress models that feel attainable and transparent.

## Engineering Guardrails

- Keep math generation logic pure and separately testable from the UI.
- Normalize addition and multiplication facts for mastery tracking so equivalent pairs do not fragment progress.
- Keep the first playable build frontend-only unless a feature explicitly requires a backend.
- Do not add authentication, billing, analytics SaaS, or a teacher portal without updating the spec and roadmap first.
- If a backend is introduced, document why `localStorage` is no longer sufficient.

## Definition Of Done

- The active feature matches the current spec and roadmap.
- Core logic has automated tests where practical.
- The app builds cleanly for production.
- The feature is usable on both desktop and touch devices.
- Any plan or architecture changes are reflected in the docs before closing the task.
