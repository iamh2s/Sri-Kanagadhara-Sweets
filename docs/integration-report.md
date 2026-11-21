# Integration and verification record · 20 November 2026

## First implementation milestone

At base 67e1ecf the original storefront was captured in Git. The candidate adds API tests for category and product reads, filtering, pagination, validation, missing resources and rate limiting. Three saved-bag tests cover pre-API numeric IDs, separate weights, stale entries and saved favorites. Run `npm test` to repeat the API and persistence checks.

Chrome 157.0.8103.79 exercised both the prior bundle and the freshly built frontend candidate (index-VJGDVQc_.js). Desktop 1440×900 used the desktop Shop link. Tablet 768×1024 and phone 390×844 used the mobile menu. Each viewport showed eight products, found Butter Murukku, selected 500g and restored quantity two at ₹250 each after refresh. The cart focused its close button and fit the viewport. Tests used reduced motion and blocked external media. Physical-device behavior, image fidelity and field performance were outside this run.

A separate local integration check queried /api/v1/products?category=ghee-sweets through the configured Vite development proxy. It returned Mysore Pak and the 500g variant at 35000 paise. A direct /shop-all navigation returned the storefront entry document.

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


## Customer pages and admin UI, 20 November 2026

AGENT NAME: Integration and QA
TASK: Verify the customer page inventory and local admin panel.
STATUS: Verified local preview.
FILES MODIFIED: Customer routing, cart, product and support views, customer commerce and admin components. Coordinator recorded results here.
IMPLEMENTATION SUMMARY: The customer UI includes catalog/search, product details, bag, demo checkout, confirmation, tracking, account tools, support and policy screens. The admin UI includes overview, products, categories, orders and inquiries. Missing published policies, contact data and stock details are identified in the relevant screens.
TESTS EXECUTED: npm run build, npm test, browser checks on desktop and mobile, local admin route and catalog API HTTP checks.
TEST RESULTS: Build passed; four catalog API tests and three saved-bag tests passed. Browser checks covered checkout and confirmation, tracking, address save/remove, product and category navigation, FAQ disclosures and admin edits. Eight catalog products returned. Admin preview fit widths of 320, 390 and 768 pixels.
SECURITY CONSIDERATIONS: Tests used synthetic shopper actions. Admin edits are in memory. Customer demo history uses browser storage.
UNRESOLVED ISSUES: Live account access, transactions, verified payment results, deployment status codes and owner-approved business content remain pending.
BRANCH: codex/backend
COMMIT HASH: Not available for uncommitted UI. Base 561da10.
RECOMMENDED NEXT ACTION: Review the local storefront and admin panel.

## Admin sign-in, gift boxes and shop browsing

The working candidate on codex/backend uses base 561da10bbdd4446ef8ec0c21671568cf549f7be5. The production build passed. All 11 automated tests passed, including four admin session checks. A disposable local credential verified login, authenticated reads, logout and revocation through the storefront proxy on port 5174.

Chrome checks at 390 and 1440 pixels verified the gift guide layout and its four destinations. Shop checks covered the eight products, category navigation, searching for Butter Murukku, clearing search, price sorting and empty results. The mobile shop and gift guide fit the viewport. Admin edits continue to use fictional data. The independent auth review is in docs/security-review.md.
