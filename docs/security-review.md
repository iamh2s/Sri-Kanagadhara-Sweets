# Independent security baseline · 20 November 2026

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
