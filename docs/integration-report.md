# Integration and verification record · 20 November 2026

QA used installed project binaries with a fresh temporary output directory, preserving src and the existing dist. The inspection found no npm test script or conventionally named test/spec files under src.

| Command | Result |
| --- | --- |
| node_modules/.bin/tsc.cmd -p tsconfig.app.json --noEmit --incremental --tsBuildInfoFile <temp>/app.tsbuildinfo | Exit 0 |
| node_modules/.bin/tsc.cmd -p tsconfig.node.json --noEmit --incremental --tsBuildInfoFile <temp>/node.tsbuildinfo | Exit 0 |
| node_modules/.bin/vite.cmd build --outDir <temp>/dist | Exit 0, 2,049 modules, 15.44 s. Gzip JS 133.40 kB and CSS 26.71 kB. |

Temporary root: %TEMP%/kanagadhara-qa-74e4d908-3656-407f-a232-39613597ee41. Unit, API integration and fresh browser tests in this planning pass: Not executed. The preceding debugging session exercised search, wishlist, dialog focus, cart persistence and email drafts in Chrome. Those results predate this baseline and have no commit identifier.

## Candidate test matrix

- At 390, 768 and 1440 px exercise navigation, hero, carousel, search, category listing, direct product links, cart weights and focus restoration. Check keyboard-only access, zoom, alternate text, reduced motion and small-screen overflow.
- Compare baseline screenshots and network transfer before changing imagery. Measure mobile LCP, INP and CLS against BRD NFR-01 to NFR-03; distinguish lab measurements from post-launch field percentiles.
- Exercise expired or corrupt saved bags, removed variants, stock changes, guest/account transition, stale quotes, delivery restrictions and server errors. Assert retry and duplicate requests produce consistent orders.
- Test session boundaries and customer/admin permissions with isolated fixtures. Verify seed reruns, indexes and stock/order consistency against a disposable MongoDB database.
- Once approved, run provider test-mode cancellation, failure, duplicate webhook, delayed verification and refresh scenarios. Never use production credentials.

Integration status: frontend baseline only. Candidate SHA, branch collisions, combined server tests, merge recommendation and rollback rehearsal are pending. For a release, record candidate/base SHAs, ticket-to-BRD coverage, exact commands, outcomes, regressions, unresolved risks, rollback target and the owner's decision.
