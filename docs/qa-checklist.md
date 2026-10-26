# Manual QA checklist

Use synthetic local profiles. Record the commit, date, browser/version, device, and result for each case. The cases below are a test plan; no pass results are implied.

| Case | Action | Expected result |
| --- | --- | --- |
| Profile separation | Create two local profiles and play a round on one | Saved progress belongs to the selected profile |
| Empty operations | Disable all operations | A round cannot start; setup explains the issue |
| Invalid range | Set minimum greater than maximum | A round cannot start until corrected |
| Valid setup | Select valid operations/ranges and start | Gameplay opens with the selected settings |
| Exact division | Play division questions | Divisors are nonzero and answers are whole numbers |
| Round outcome | Answer correctly, incorrectly, and miss a question | Score/air/feedback match the selected outcome |
| Keyboard | Start, navigate, and answer without a pointer | Focus remains usable and answers register |
| Reduced motion | Enable reduced motion and play | Static answer controls support the same round flow |
| End-to-end smoke | Profile → setup → game → results → stats → setup | Results and saved profile statistics agree |
| Persistence | Refresh after a round | Selected profile progress remains in this browser |
| Storage boundary | Open a separate origin/browser | Local progress is independent; no cloud sync is promised |

Run `npm test` and `npm run build` separately from manual checks. A passing logic or component suite does not replace touch-device, browser, or accessibility testing. Report failures using the bug report template with expected/actual results and redacted evidence.
