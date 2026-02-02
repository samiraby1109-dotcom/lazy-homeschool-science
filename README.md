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

### Seeding data

Run the seed script to create sample topics and trusted sources:

```bash
pnpm seed
```

### Adding YouTube channel IDs

Trusted YouTube sources require a channel ID. In the admin dashboard:

1. Go to **Admin → Trusted Sources**.
2. Edit the source and paste the channel ID (starts with `UC`).
3. Save and mark the source active to include it in auto-fill suggestions.

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
