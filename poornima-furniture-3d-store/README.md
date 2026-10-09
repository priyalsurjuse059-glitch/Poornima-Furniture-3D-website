# Poornima Furniture — Premium 3D Furniture Store

A premium, responsive showroom and catalogue starter for **Poornima Furniture / पूर्णिमा फ़र्नीचर**, Sutgirni, Hingna Road, Nagpur, Maharashtra, India. Built with Next.js App Router, TypeScript, Supabase, and React Three Fiber.

> **Honest launch status:** This repository is a runnable foundation, not a claim that a live shop is already deployed. Before production use, configure Supabase, review RLS policies, set the business WhatsApp/contact details, add real product photography and approved 3D models, run the checks below, and complete the owner setup checklist.

## Experience and features

- Responsive editorial storefront in warm ivory, walnut, olive and brass tones.
- Collections landing cards and featured products loaded from Supabase when configured.
- Catalogue search, category/availability filtering and sorting.
- Shareable product detail routes, product image gallery/lightbox, specifications, related products and enquiry links.
- Persistent client cart for priced products; enquiry-only items remain quote-only. No live payment is claimed or collected.
- Actual GLB/GLTF viewer with rotation/zoom when a published product has a model URL; no-model and load-failure states are explicit.
- Enquiry form API with Zod validation, honeypot and a basic per-process rate limit.
- Supabase-backed admin login, profile-role gate, product create/edit/delete, and enquiry status management.
- SQL schema, indexes, timestamps, role checks, RLS policies, public product media bucket policies.
- SEO metadata, robots, dynamic sitemap, reduced-motion handling, keyboard focus styling and labelled controls.

## Stack

- Next.js 15 App Router / React 19 / TypeScript
- Supabase PostgreSQL, Auth, Storage, RLS
- React Three Fiber, Drei, Three.js
- Framer Motion, Lucide React, Zod
- Vitest for business logic validation

Dependency ranges are in `package.json`. Re-resolve and commit a lockfile with your environment's `npm install` before deployment.

## Run locally

Requirements: Node.js 20.9+ (Node 22 LTS is a good choice), npm, a Supabase project for full data-backed behaviour.

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000. Without Supabase values, the marketing pages still render, while the catalogue shows an explicit setup empty state. Never paste service-role keys into a `NEXT_PUBLIC_` variable or commit `.env.local`.

## Supabase setup

1. Create a new Supabase project.
2. Install the Supabase CLI and authenticate.
3. Link the project, then apply the migration:

   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase db push
   ```

   Or review and run `supabase/migrations/0001_initial_schema.sql` in the SQL Editor.
4. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`. The public anon/publishable key is intentionally used by public reads; RLS is required.
5. Create an owner account using Supabase Auth. Then, in the Supabase SQL Editor, promote that exact user UUID after verifying the intended owner:

   ```sql
   update public.profiles
   set role = 'admin'
   where id = 'THE_VERIFIED_AUTH_USER_UUID';
   ```

   Do not expose an open public “make me admin” route. Keep service-role keys in server-only deployment settings and use them only if a narrowly scoped administrative workflow genuinely requires one.
6. Add real categories and products from `/admin` after signing in. Products are hidden until `published=true`. The `product-media` bucket supports public read and admin-only uploads/deletions; only allow the documented image and GLTF formats.
7. Verify public reads, anonymous enquiry inserts, non-admin denials, admin product CRUD, and storage writes against a non-production test account before using customer data.

### Owner configuration

Set the brand contact variables in `.env.local` / Vercel after confirming them with the owner:

- `NEXT_PUBLIC_BUSINESS_PHONE`
- `NEXT_PUBLIC_BUSINESS_WHATSAPP` (include country code, digits only is safest)
- `NEXT_PUBLIC_BUSINESS_HOURS`
- `NEXT_PUBLIC_SITE_URL`

These are deliberately blank unless known. The address supplied for this project is shown as “Sutgirni, Hingna Road, Nagpur, Maharashtra, India”; adjust only after owner verification.

## Routes

- `/` — home / showroom visit info
- `/catalogue` — data-backed collection, filters and sorting
- `/catalogue/[slug]` — product details/gallery/model
- `/showroom` — only displays actual published 3D models
- `/cart` — persistent customer shortlist and WhatsApp quote workflow
- `/admin/login` — Supabase Auth password sign-in
- `/admin` — role-gated product/enquiry management
- `/api/products` — public published products API
- `/api/enquiries` — validated public enquiry insert
- `/api/admin/products` — admin-only product CRUD API
- `/api/admin/categories` — admin-only category CRUD API
- `/api/admin/upload` — admin-only, MIME/size-checked media uploads
- `/api/admin/orders` — admin-only order listing/status API (no order creation/payment flow)
- `/api/admin/enquiries` — admin-only enquiry status API

## Cart, checkout and payment safety

The current cart is an enquiry/shortlist foundation, not a live order checkout. Browser-stored values are for convenience only. Do not accept a cart total from the browser when building a purchase endpoint. A production purchase flow must re-fetch product and pricing records server-side, validate quantity and availability, create an order server-side, and verify Razorpay signatures/webhooks before recording successful payment. Payment is intentionally not wired until provider credentials and delivery/return policies have been configured and verified. Database tables for future orders/order items are present but no public endpoint currently creates orders or accepts payments.

## Security notes before launch

- Row Level Security is enabled on all application tables; the schema defines public published-product reads and administrator-only protected writes.
- All administrator API routes call `requireAdmin()` and validate input; `profiles.role` is not user-updatable through the granted column permissions.
- No service-role or payment key should be placed in browser code.
- Public form rate limiting in this starter is in-process and will reset on deploy/restarts; replace it with shared storage (e.g. a dedicated rate-limit service/Redis) or provider-level protection for serverless production.
- Review Supabase RLS policies in the target project after migrations. Keep backups, configure email/auth redirect URLs, and add monitoring/retention policy before handling real customer data.
- The admin UI currently includes basic product fields; richer image upload management, category CRUD UI, order fulfilment UI and internal-note/follow-up UI are next-step work. Backend category endpoints/schema exist.
- The initial 3D experience is product-model based. A hotspot-rich room scene requires approved, optimized room/furniture assets and is not represented by an empty/fake canvas.

## Tests and checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

`tests/cart.test.ts` covers subtotal and enquiry-only pricing, and `tests/validation.test.ts` covers core Zod input cases. Dependency installation was attempted in the generation environment but timed out before `node_modules` or a lockfile could be created. Therefore TypeScript, ESLint, Vitest and production-build results are **not verified here**. Run all checks after dependency installation and environment setup; do not infer a passing production build without executing it.

Responsive checkpoints to review manually: 320, 375, 430, 768, 1024, 1440, and 1920px. Check keyboard-only navigation, contrast, reduced motion, real phone/WhatsApp links, no-model product states, database errors, and non-admin API access.

## Deploy to Vercel

1. Create the GitHub repository `poornima-furniture-3d-store` under the intended account.
2. In this directory, commit and push the source (commands below).
3. In Vercel, import that GitHub repository and use the detected Next.js settings.
4. Add the same public Supabase values to Vercel project environment variables. Set verified business contact details and `NEXT_PUBLIC_SITE_URL` to the production origin.
5. Deploy to a preview first. Apply the SQL migration to the intended Supabase project, create/promote the owner admin, seed categories and real products, and verify all paths before production promotion.
6. Set Supabase Auth site URL and redirect allowlist to the production domain and any approved preview origins.
7. Test sitemap, robots, product metadata, image loading, model performance, RLS, enquiry submissions and mobile layouts; connect a custom domain later in Vercel and repeat smoke tests.

### Git commands

After creating an **empty** GitHub repository on GitHub's website (do not initialize it with a README if using these commands):

```bash
git init
git add .
git commit -m "feat: build Poornima Furniture storefront foundation"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/poornima-furniture-3d-store.git
git push -u origin main
```

You must replace `YOUR_GITHUB_USERNAME` with the verified repository owner. Do not include secrets in commits. A GitHub integration operation has not been completed from this environment.

## Screenshots

Add desktop/mobile screenshots to `docs/screenshots/` after running the app with a real catalogue; link them here once captured. This project does not claim screenshots or a live URL before these exist.

## Architecture overview

```text
Next.js App Router
├── Server-rendered storefront + catalogue/product routes
├── Client UI: catalogue filters, cart, model viewer, admin forms
├── Route handlers: public products/enquiry + admin-only mutations
└── Supabase
    ├── Postgres + RLS (products, categories, profiles, enquiries, orders)
    ├── Auth (owner/admin session)
    └── Storage (public product-media reads, admin-only writes)
```

## Known limitations

- No repository publication or Vercel deployment is claimed.
- No verified business phone, WhatsApp number, hours, logo file, customer testimonials or actual product specs/photos were provided with this task. Use owner-approved assets/data before launch.
- Category backend endpoints exist but admin category-management UI is not yet implemented.
- Admin media upload API exists, but the dashboard still needs a polished upload UI. Customer enquiry internal-note/follow-up fields are supported by the API but not fully exposed in the dashboard.
- No live payment flow or order creation endpoint is active.
- The current visual collection images use remote Unsplash editorial placeholders; replace with licensed/owner-approved product photos before commercial launch.
- The product model viewer needs tested GLB/GLTF assets. Model error fallback is provided, but mobile GPU/performance should be tested with real assets.
- Rate limiting is basic process-local protection and not sufficient by itself for an internet-facing production form.


## Connected Supabase project

This project is configured locally to use the separate Supabase project **Poornima Furniture** (region: Mumbai, India). The `.env.local` file contains the project URL and a publishable key; it does not contain a service-role or payment secret. `.env.local` is excluded from Git by `.gitignore`. Never add a service-role key to a `NEXT_PUBLIC_` variable or commit secret keys.

The initial database migration `supabase/migrations/0001_initial_schema.sql` has been applied to the connected project. It creates the catalogue, category, product image, enquiry, order, order item, profile, and site settings tables, enables row-level security, and creates the `product-media` storage bucket. The first administrator still needs to be created in Supabase Auth and promoted using the safe owner setup procedure below.

If you download the ZIP and want to run locally, keep `.env.local` at the project root, then run `npm install`, `npm run dev`. The publishable key is designed for browser use; database access remains governed by RLS policies.


## First administrator setup

1. In Supabase Dashboard, open **Authentication → Users** and create the owner's account with the intended email address.
2. Copy that user's UUID from the Users table.
3. Open **SQL Editor** and run the following, replacing the UUID with the actual owner account UUID:

```sql
update public.profiles
set role = 'admin'
where id = 'REPLACE-WITH-AUTH-USER-UUID'::uuid;
```

4. Confirm exactly one row was updated, then sign in at `/admin/login`. New sign-ups default to `customer`; never allow role promotion through public signup or editable user metadata.

The Supabase security advisor was checked after setup and returned no security lint findings. Performance advisor output still includes unused-index notices (expected on a new database before real traffic) and multiple permissive-policy warnings for admin/public access combinations.
