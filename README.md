# Lazy Homeschool Science

Mobile-first PWA that creates secular, evidence-based homeschool science units for ages 5–7. The app generates topic-based plans with vetted videos, worksheets, and hands-on experiments.

## Quick start

```bash
pnpm install
pnpm prisma:generate
pnpm dev
```

### Environment variables

Copy `.env.example` and fill in required values before running migrations or auth.

```bash
cp .env.example .env
```

## What’s included

- Next.js App Router + TypeScript + Tailwind CSS
- Prisma + Postgres schema
- NextAuth magic-link auth
- Stripe subscription scaffolding
- PostHog analytics scaffolding
- PWA manifest + install prompt
- Admin dashboard scaffolding

## Renaming the app

Update the name in `lib/config.ts` to change the display name across the UI and PWA manifest.

## Content standards

The worksheet generator refuses to create content unless it has vetted excerpts. All factual claims must be traceable to stored source text.

See `docs/content-standards.md` for more.
