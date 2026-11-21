# Independent security baseline · 20 November 2026

## Catalog candidate review

An independent auditor inspected the public, read-only Express routes, TypeScript data source, query validation, JSON error handling, loopback listener, Vite proxy, rate limiting, lockfile and tests. The first candidate lockfile audit reported four affected transitive packages including Critical proxy-addr (GHSA-jqcg-44mw-7w3h) and High body-parser (GHSA-27r3-jxmh-p828). The other affected packages were ip-address and qs. The catalog routes do not enable a body parser and the app uses Express's default untrusted proxy configuration.

The backend engineer updated the transitive resolutions. Independent re-audit of lock blob a1918ec3a1d1292439417ef0ff2e827e0894fb97 returned exit 0 and zero advisories across 276 dependencies. Installed remediation versions were proxy-addr 2.0.8, body-parser 2.4.0, ip-address 10.7.6 and qs 6.17.1. For a future public or multi-instance deployment, specify and test trusted proxy configuration and a shared rate-limit store. Review applies to the local catalog milestone.

Reviewer: Security Auditor subagent. Scope: existing storefront source and npm lockfile. No confirmed Critical or High issue emerged from those checks. Production security approval is pending an actual server implementation, deployment configuration and independently reviewed candidate.

| Area | Evidence | Required follow-up |
| --- | --- | --- |
| Access control, authentication and session design | No server login or order API found. Browser storage holds cart/wishlist selections. | Test owner-scoped account, guest and admin access, session rotation, logout, HttpOnly/Secure/SameSite cookies, CSRF protection and explicit allowed origins. |
| Input and injection | shoppingStorage.ts validates saved product IDs, weights and positive safe integer quantities. TS/TSX scan found no matches for selected raw HTML rendering, eval, cookie access, fetch, Axios or WebSocket patterns. | Validate bounded request bodies, allowlisted MongoDB fields/operators, contextual rendering and uniform errors at actual endpoints. |
| Order and payment integrity | App.tsx calculates display totals. ShoppingOverlays.tsx constructs an editable inquiry. storeContact.ts encodes mail body and subject. | Reprice, check ownership and stock, verify provider signatures and amounts on server, deduplicate events and reconcile before marking paid. |
| Secrets and cryptography | VITE_STORE_CONTACT_EMAIL is a public destination. Git history and deployed TLS/headers were unavailable for inspection. | Review staged files and history when available. Keep server secrets out of Vite, fixtures and logs. Inspect deployment CSP, HTTPS, session configuration and backups. |
| Components and supply chain | npm audit against the official registry returned exit 0 and zero advisories across 200 dependencies in the current lockfile. | Repeat on the approved candidate and any new server dependencies. Review package provenance and install scripts when dependencies change. |
| Logging, availability and external requests | Hosted controls, monitoring, rate limits and future server-side outbound calls have no runtime evidence. | Review redaction, order audit events, rate limiting, request timeouts and permitted destinations. Test degraded provider behavior on test infrastructure. |

Audit command: `npm.cmd audit --package-lock-only --json --registry=https://registry.npmjs.org --fetch-retries=0 --fetch-timeout=15000`. Dynamic security testing was not executed. This baseline covers selected OWASP risk areas; a candidate-specific OWASP Top 10 review is due in phase 6.

For each future finding capture severity, affected control, base/candidate SHA, observed evidence, impact, owner, remediation and independent retest. Escalate Critical and High findings to the owner and Astra High with sensitive details redacted. Record outstanding risks explicitly in the merge recommendation.


## Customer pages and admin UI review, 20 November 2026

AGENT NAME: Independent security auditor
TASK: Review customer and admin preview storage and write boundaries.
STATUS: Source review complete.
FILES MODIFIED: None by reviewer. Coordinator recorded this report.
IMPLEMENTATION SUMMARY: Admin catalog edits and sample queue updates use component state. The Express service exposes public catalog GET operations. Checkout stores a local demo summary and cannot mark a payment as paid.
TESTS EXECUTED: Independent read-only source inspection and targeted write/sink review.
TEST RESULTS: No confirmed Critical or High issue within the reviewed scope. Dynamic security tests: Not executed.
SECURITY CONSIDERATIONS: Manually saved demo addresses are readable by anyone sharing the browser profile. The address book and privacy notice disclose this. Use fictional addresses.
UNRESOLVED ISSUES: Real identity, private account storage, server-authorized admin writes, payment verification and order fulfillment require backend work.
BRANCH: codex/backend
COMMIT HASH: Not available for uncommitted UI. Base 561da10.
RECOMMENDED NEXT ACTION: Review the preview before approving transactional backend work.

## Admin preview sign-in review

AGENT NAME: Independent security reviewer  
TASK: Review password handling, session lifecycle, CSRF checks, proxy settings, and admin screen access.  
STATUS: Reviewed working tree. No Critical or High findings in this scope.  
FILES MODIFIED: docs/security-review.md  
IMPLEMENTATION SUMMARY: Inspected server/adminSession.ts, its mounting in server/app.ts, src/pages/AdminPage.tsx, scripts/start-admin-local.ps1, and vite.config.ts. The local launcher prompts privately and binds the API to loopback. Session creation uses 32 random bytes. The server stores token digests, checks expiry, revokes on logout, and disables login when credentials are missing. Mutations require a custom header and reject conflicting origins. The proxy preserves Host.  
TESTS EXECUTED: node --test server/adminSession.test.mjs  
TEST RESULTS: Four tests passed, covering sign-in and revocation, request restrictions and throttling, missing configuration, and production cookie attributes.  
SECURITY CONSIDERATIONS: Low-severity stale admin preview after logout in another tab was reported to the implementation owner. Static retest confirmed the revised component rechecks the server on focus and pageshow and closes the workspace on failure. Browser cross-tab retest by auditor: Not executed.  
UNRESOLVED ISSUES: Sessions and rate limits are process-local. The panel edits sample data only.  
BRANCH: codex/backend  
COMMIT HASH: Not available for working changes. Base 561da10bbdd4446ef8ec0c21671568cf549f7be5.  
RECOMMENDED NEXT ACTION: Include the session checks whenever a real admin data or mutation endpoint is introduced.
