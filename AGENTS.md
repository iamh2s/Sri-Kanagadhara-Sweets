# Kanagadhara Sweets contributor instructions

## Scope and approvals

Read the owner's request, the applicable BRD revision, docs/project-plan.md and docs/api-contracts.md before taking a ticket. KS-BRD-FE-001 v1.0 is a stakeholder draft. Record disagreements or missing business rules for the owner. The owner authorized the first read-only catalog milestone and storefront regression checks after the planning handoff. Start feature work only after the owner approves a named scope. Astra High reviews through a manual handoff. The owner separately authorizes merge and deployment.

## Ownership

| Role | Owns in an approved worktree |
| --- | --- |
| Frontend | src, public/brand and frontend CSS. Coordinate entry point and routing changes with QA. |
| Backend | Proposed server HTTP routes, middleware, auth, services and API contract changes. |
| Database | Proposed server persistence layer, models, migrations, seed scripts and indexes. |
| Integration and QA | Contract fixtures, cross-layer tests, build evidence and integration report. |
| Security auditor | Independent review evidence in docs/security-review.md. Implementation owners remediate findings. |

The coordinating thread owns shared planning files and assigns a single editor for shared manifests, lockfiles, contracts and build configuration per change. Agree on interfaces before parallel edits. Read docs/agent-assignments.md for branch setup and reporting.

## Implementation conventions

Preserve the existing brand, assets, routes, interactions and customer data. Make small, typed changes around existing entry points. Keep React components accessible by keyboard, respect reduced motion and test mobile layouts. Keep API and database credentials on the server. Use consistent REST errors, input allowlists and bounded payloads. Derive identity and resource ownership from the server session. Protect admin writes, apply rate limits, validate origins and CSRF defenses, redact sensitive logs, and calculate all payable amounts on the server. Payment work requires owner approval of the provider and server verification workflow.

## Git and evidence

Inspect status, branch, worktree list and base SHA before editing. Work in the assigned checkout only. Preserve other people's edits. Never reset, clean, delete branches or overwrite a conflicting directory. Stage reviewed paths explicitly. Exclude dependencies, build output, machine caches, environment secrets and credentials. Do not use production data or credentials for tests. Use additive migrations and test reruns on disposable data.

Run the applicable TypeScript checks and production build, focused tests, and integration regressions described in docs/integration-report.md. The security auditor reviews the actual candidate independently. Record every Critical or High finding, evidence, owner and retest status. Use the exact reporting fields in docs/agent-assignments.md. Include base and candidate SHAs in handoffs when available. Stop for owner decisions at the gates in docs/project-plan.md.
