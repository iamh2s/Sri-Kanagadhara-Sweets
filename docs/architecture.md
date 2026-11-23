# Architecture baseline · 20 November 2026

## Catalog milestone implementation

The original inventory below describes commit 67e1ecf. The catalog milestone adds an Express/TypeScript service in server and a shared catalog module. The storefront still renders its local catalog and preserves existing browser storage. The local Vite server proxies /api to the catalog service. MongoDB, authoritative inventory and transactional checkout belong to later milestones.

## Existing application

| Layer | Evidence and implications |
| --- | --- |
| Boot and routing | src/main.tsx mounts React StrictMode and BrowserRouter. src/App.tsx selects home, shop-all, sweets, savouries, gift-boxes, our-story, contact, account or fallback. Product detail renders as a routed page at /products/:slug with a quick-view dialog available from product tiles. Production hosting needs deep-link handling and correct missing-page status. |
| Components and styling | Navbar, shopping overlays, category carousel, cinematic and landing heroes, footer and feather cursor already exist. src/index.css, component CSS, PostCSS and Tailwind configuration coexist. Retain assets in public/brand and emerald, gold, maroon and ivory styling. |
| Catalog and state | src/data/storefront.ts holds eight products with numeric IDs and three weights. App state calculates display totals. shoppingStorage.ts restores local cart and wishlist by product ID. Preserve saved bags during migration to SKUs. |
| Commerce boundary | storeContact.ts uses the public VITE_STORE_CONTACT_EMAIL for optional email drafts. Account and newsletter are unavailable. A mail draft does not create an order. |
| Server and persistence | Project inventory shows no Express service, MongoDB client, schemas, migrations, authentication, order ledger or payment verifier. tsconfig.node.json covers Vite configuration. |
| Tooling | Node 24.11.1, npm 11.18.0, Git 2.49.0.windows.1. Vite React plugin, strict TypeScript, @ alias to src. npm scripts are dev, build (tsc -b then vite build) and preview. Tests run via `npm run test:api` (catalog + admin session) and `npm test` (adds saved-bag). Git repository at branch main. |

Installed direct packages from `npm ls --depth=0`: react and react-dom 18.3.1, react-router-dom 7.18.6, aos 2.3.4, motion 14.14.0, lucide-react 0.468.0. Development packages include typescript 5.6.3, vite 6.4.6, @vitejs/plugin-react 4.7.0, tailwindcss 3.4.19, postcss 8.5.33, autoprefixer 10.6.2, @types/react 18.3.31, @types/react-dom 18.3.7 and @types/aos 3.0.8.

## Proposed architecture for approval

Keep the storefront and add a TypeScript Express service with discrete route, validation, service and persistence modules. Prefer a same-origin /api/v1 boundary. Separate catalog reads, session management, cart quotation and order transitions. MongoDB holds canonical variants, stock and order state. Browser totals remain estimates until revalidated at checkout. Evaluate prerendering or SSR for public PLP/PDP content against the BRD's indexing requirements before selecting a rendering change.

| Proposed collection | Integrity and query design |
| --- | --- |
| users / sessions | Unique verified normalized login identity, conditional indexes for optional email/phone, expiring opaque sessions with revocation and expiry checks. Decide OTP vs password with owner. |
| categories / products | Unique category slug, product slug, stable public catalog ID and SKU identifiers. Index category + active for listings. Validate integer paise, weight and sale status. |
| carts | Unique owner or verified guest session. Validate bounded line quantities and variant references. |
| orders | Immutable SKU, price, discount, delivery and address snapshots. Index owner + creation time, unique owner + idempotency key and unique provider order reference when present. |
| payment events | Unique provider event identifier and guarded state transitions. Repeated delivery must leave payment and stock consistent. |

Open a pooled database connection at service startup and bound connection timeouts. Restrict database permissions per environment. Build indexes against representative queries and inspect query plans. Version migrations and provide a dry run. Seed reviewed catalog mappings with idempotent upserts that preserve edited business values. Verify counts, unique keys and rollback/recovery on disposable data before proposing a production change.
