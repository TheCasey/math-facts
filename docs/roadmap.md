# Roadmap

## Goal

Ship a simple, replayable math facts game for elementary students with mastery tracking in the first public release, then layer in teacher-friendly visibility without overbuilding the stack.

## Guiding Sequence

### Milestone 0: Planning And Workflow

Status: completed enough to hand off to the release-hardening workflow

- Lock the product spec, architecture assumptions, and agent workflow.
- Define MVP versus later-phase features so implementation stays narrow.
- Retire the older build-out scaffold in favor of the live release workflow in `docs/upgrades/first-release-hardening-and-cloudflare-launch-workflow/`.

### Milestone 1: First Public Release

Status: implemented baseline in repo; remaining work is release hardening

Target outcome: a student can configure a quiz, play the underwater survival loop in the browser, and see mastery-driven progress that is solid enough for a real first public launch.

Implemented in the current repo:

- Add simple local student profiles for shared-device use.
- Build the setup portal with multi-operation selection.
- Support lowest and highest operand ranges for each selected operation.
- Add difficulty levels that change bubble speed and answer count.
- Implement the endless round loop with score, air, streak, timer, and results.
- Track per-fact performance locally.
- Derive mastered facts and highest mastered range by operation.
- Add a stats view for strengths, weak spots, and progress by operation.
- Show a mastery-based recommended next range without removing manual custom range selection.
- Save recent settings, local mastery data, and local best score per profile on the device.

Remaining before launch:

- Enforce setup validation before a round starts instead of only rendering error text.
- Harden distractor quality, survival pacing, and interaction polish for the current playable build.
- Verify keyboard, touch, reduced-motion, and responsive behavior against tablet and Chromebook use.
- Add the missing repo-level run and deployment guidance, including the Cloudflare Pages release path.
- Run final automated and manual release verification, then record known limitations and the launch checklist.

### Milestone 2: Accounts And Cloud Sync

Target outcome: progress follows the student across devices.

- Add lightweight account support or classroom access model.
- Move mastery and score storage from local-only to a Cloudflare-backed data layer.
- Preserve offline-friendly play when possible.

### Milestone 3: Teacher And Parent Features

Target outcome: adults can assign, monitor, and review practice.

- Teacher or parent dashboard
- Saved presets or assignments
- Progress summaries by operation and range
- Optional printable or exportable reports

### Milestone 4: Content And Retention

Target outcome: more replay value without changing the core math practice loop.

- More themes or environments
- Time-attack or challenge modes
- Optional guided unlock mode that auto-advances available ranges
- Badges or cosmetic rewards
- Adaptive question weighting based on weak facts

## Release Priorities

### Implemented in repo today

- Setup portal
- Operation and range selection
- Difficulty selection
- Underwater bubble-answer gameplay
- Results screen
- Mastery model
- Stats screen
- Recommended next range based on mastery
- Multiple local student profiles
- Local best score
- Reduced-motion fallback for the bubble-answer screen

### Remaining before first public launch

- Setup-flow guardrails that prevent invalid or empty operation selections from entering gameplay
- Gameplay and usability hardening for distractors, pacing, keyboard/touch behavior, and responsive layout
- Baseline repo usage docs plus Cloudflare Pages preview and production-domain guidance
- Final release verification, known limitations, and launch checklist

### Should wait until the product proves useful

- Student accounts
- Cloud data sync
- Teacher dashboard
- Assignment workflows

## Success Signals

- A child can start a round in under 20 seconds without adult help.
- Touch accuracy stays reliable on tablet-sized screens.
- The round loop feels replayable rather than repetitive.
- Mastery stats are simple enough for a student to understand.
- Progression feels encouraging without taking away teacher or parent control over range selection.
- Shared-device use does not mix one student's mastery and stats with another student's data.
