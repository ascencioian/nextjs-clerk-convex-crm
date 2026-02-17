# Next.js + Clerk + Convex CRM MVP

This project implements an MVP CRM with:
- Landing page
- Authenticated profile create/update page (`/portal/profile`)
- Admin-only business profiles page (`/admin/businesses`)
- Convex storage headshot upload

## Prerequisites

- Node 18+
- Clerk app configured
- Convex account/deployment configured

## Environment variables

Copy `.env.example` to `.env.local` and fill values:

```bash
cp .env.example .env.local
```

Required values:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CONVEX_URL`
- `CLERK_JWT_ISSUER_DOMAIN` (e.g. `https://your-clerk-domain.clerk.accounts.dev`)
- `ADMIN_USER_ID` (your Clerk user ID)

## Convex setup

The `convex/_generated/*` files in this repo are temporary shims so the app compiles before first Convex login.

After authenticating with Convex, run:

```bash
npx convex dev
```

This will:
- create/update deployment configuration
- generate the real `convex/_generated/*` files
- sync schema and functions

## Run locally

```bash
npm install
npm run convex:dev
npm run dev
```

Open `http://localhost:3000`.

## Manual MVP checklist

- Sign up, visit `/portal/profile`, save a new profile, and reload to verify persistence.
- Update one field and verify `updatedAt` changes in admin list.
- Upload JPG/PNG headshot and verify it persists after reload.
- Non-admin account cannot use `/admin/businesses`.
- Admin account can search/list profiles in `/admin/businesses`.
