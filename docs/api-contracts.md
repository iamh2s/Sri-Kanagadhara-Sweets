# Catalog API and proposed commerce contracts

## Implemented catalog milestone

Run `npm run dev:api` and `npm run dev` in separate terminals. The API defaults to 127.0.0.1:3001. The Vite development server forwards /api requests to that port. The storefront and API read the same catalog module. The existing storefront renders locally, so browsing and saved bags continue to work without the API process.

| GET path | Behavior |
| --- | --- |
| /api/v1/categories | Returns seven navigation categories as `{data:[{name,slug,image,route}]}`. Gift Boxes is a collection without individual catalog products. |
| /api/v1/products | Returns `{data:[...],nextCursor:null}` or a cursor for the next page. Optional q matches name, description or category (up to 100 characters). category accepts a category slug. limit defaults to 20 and accepts 1–50. cursor is the exclusive numeric product ID from the previous page. |
| /api/v1/products/mysore-pak | Returns one product in the data envelope, including numeric ID, slug, name, category, categorySlug, description, image, currency and variants. Each variant carries sku, weight and pricePaise. The existing 250g Mysore Pak variant is KS-1-250g at 18000 paise. |

The weight-based identifiers use the original product ID and weight; prices can change independently. A stale or unknown product slug returns 404. Unsupported or malformed query fields return 400. Rate-limited requests return 429. Errors include a requestId and the same identifier is available in the X-Request-Id header. The catalog carries the store's existing indicative prices. Availability and approved product disclosures require business data.

## Remaining contracts for review

The table below records the wider BRD proposal. The three catalog reads above are implemented. Other endpoints are awaiting the backend BRD and scope approval. Paths are relative to /api/v1.

| Operation | Request and result | Access / constraints |
| --- | --- | --- |
| GET /categories, GET /products, GET /products/:slug | Categories; bounded cursor page with q and category; product with variants, integer INR paise, availability and approved disclosures | Public, published items only. Invalid query 400, absent product 404. |
| POST /auth/challenges, POST /auth/verify, GET /session, DELETE /session | Proposed OTP flow takes a normalized identifier, then a challenge ID and code. Return minimal session identity or revoke it. | Owner to confirm guest and login methods. Expiry, attempt limits, generic challenge response and rotated HttpOnly session cookie. |
| GET /cart, PUT /cart/items/:sku, DELETE /cart/items/:sku | Read bag, set absolute quantity, remove line. Return canonical items and estimated subtotal. | Current session only. Check bounds, stock and SKU. Merge guest and account carts under a confirmed policy. |
| POST /checkout/quote | Cart revision, delivery pincode, chosen slot and optional coupon. Return quote ID, expiry, item snapshots, shipping, discount, total and currency. | Server validates serviceability, cutoffs, price and stock. No client-supplied totals. |
| POST /orders, GET /orders, GET /orders/:id | Create from quote ID and delivery details with Idempotency-Key. Return pending order ID and state. Reads are paginated or by ID. | Verified account or approved verified guest. Server derives owner, rechecks quote and availability and atomically applies stock policy. Same key + same request returns original result. Different request or stale quote returns 409. |
| POST /orders/:id/payment-attempts, POST /payments/verify | Proposed test provider order and public checkout parameters. Verify returned payment ID, order ID and signature. Return backend-confirmed status, including pending. | Owner-bound order only. Server controls amount and currency and checks provider binding, verification and payment state. |
| POST /payments/webhooks/razorpay | Raw provider event with authenticated signature. Process once, acknowledge durably, reconcile out-of-order delivery. | Server-only secret, no browser session. Persist event and guarded order transition before acknowledging success. |
| POST/PATCH /admin/products and /admin/categories | Controlled catalog edits with validated variants and prices. PATCH addresses a specific ID. | Server-enforced admin role and audit trail. Admin UI is a separate scope. |

Success envelope proposed as `{"data":...}`; list responses may include `nextCursor`. Error example: `{"error":{"code":"QUOTE_EXPIRED","message":"Refresh your order total."},"requestId":"..."}`. Use 201 for creation, 204 for empty success, 400 for malformed input, 401 for missing identity, 403 for denied operations, 404 for unavailable resources, 409 for state conflicts and 429 for rate limits. Do not reveal private object existence to unrelated customers.

Contract tests must cover exact request/response shapes, pagination limits, stale carts, retries, cross-customer access and server pricing. Address book, verified guest tracking, pre-orders, reviews/moderation, gifts, bulk enquiries and content APIs require owner-confirmed workflows and the backend BRD before contracts are frozen.
