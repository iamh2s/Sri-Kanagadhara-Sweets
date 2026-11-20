# Delivery plan and decision gates

## Draft BRD to existing storefront

Source: KS-BRD-FE-001 v1.0, 20 November 2026, 47 pages. The attachment supplies requirements and acceptance scenarios. The initial authorization covered phases 1–3. The owner subsequently requested work to start on the proposed first milestone, phase 4A: catalog reads, stable product and weight identifiers, and regression checks. Later commerce milestones require separate scope decisions. KS-BRD-BE-001 is referenced as a future deliverable. Proposed endpoint names and schema choices require reconciliation with that document.

| BRD reference | Current evidence | Planned acceptance |
| --- | --- | --- |
| BR-01, BR-03, BR-10 | Catalog search and weight selection exist. Product view is a dialog. Prices are indicative. | Preserve search and cart. Addressable PDP for each product, approved ingredients, allergens, weight, price and shelf life, indexable product/category pages. |
| BR-02, BR-04, BR-08 | Order inquiries use email. Checkout, serviceability and tracking depend on new services. | Check pincode and stock, quote on server, support pending/failure/retry, show paid only after backend confirmation. Exercise verified guest or account ownership. |
| BR-05–07, BR-11 | Gift collection and promo content exist. No campaign, preorder cap, quote or coupon service found. | Confirm release priorities for festival cutoffs, gifts, bulk quotations, coupon rules and moderated reviews. Test cutoff boundaries and quantity caps. |
| BR-09, BR-12 | Footer contains policy placeholders. Account features are unavailable. | Owner supplies approved policies, labels and grievance details. Validate consent, data minimization and redacted analytics with business reviewers. |
| Sections 13–16 | Responsive CSS and motion handling exist. Carousel keyboard stops, image weight and SEO need measurement. | Baseline keyboard, reduced motion, screen sizes, indexability and mobile Core Web Vitals. Target WCAG 2.1 AA and BRD thresholds. Document measured results. |

## Work sequence

| Phase / priority | Owner and dependency | Completion evidence |
| --- | --- | --- |
| 1–2 / now | Coordinator and five read-only roles | Inventory, feature gaps, draft contracts, security baseline and proposed isolated branches. |
| 3 / decision | Owner forwards packet to Astra High | Record reviewer feedback, baseline choice and owner-approved ticket IDs. Stop here. |
| 4A / P0 foundation | Database and backend after base SHA and contracts confirmed. Frontend can baseline current UI independently. | Stable catalog-to-SKU mapping and read API, test fixtures, original visuals and saved bags preserved. |
| 4B / P1 commerce | Backend + database after identity, delivery and stock decisions. Frontend after API fixtures. | Session/guest flows, owner-scoped cart, authoritative checkout, order history; retry and stale-price tests pass. |
| 4C / separately gated | Named payment engineer after provider, test account and verification design approved | Razorpay test-mode failure, cancel, retry, late notification and duplicate reconciliation evidenced. |
| 4D / priority by owner | Frontend + backend after business content and scope confirmation | Approved policy, accessibility, SEO, gifting, reviews, campaign and support scenarios traced to BRD. |
| 5 / verification | QA on the review candidate | Record build, contract, unit, integration and browser evidence with exact candidate identity. |
| 6 / independent review | Security auditor reviews candidate and diff | Findings, dependency results and remediation retests attached. |
| 7 / integration | QA compares branches with approved base | Review changed paths, collisions, conflict resolutions and combined test results on isolated candidate. |
| 8 / final authorization | Owner after manager recommendation | Release-readiness report identifies open risks, rollback point and decision. Merge and deployment require explicit authorization. |

Resolve BRD Q-01 to Q-12 with the named business stakeholders. In particular decide COD, identity/guest verification, shipping fees and minimums, stock reservation, delivery cutoffs, payment methods, policy text and expected festival load. Keep unconfirmed values outside implementation acceptance criteria.
