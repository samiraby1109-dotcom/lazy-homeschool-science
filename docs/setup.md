# Setup

## Requirements

- Node.js 18+
- pnpm
- Postgres database

## Steps

1. Install dependencies:

```bash
pnpm install
```

2. Create `.env` from `.env.example` and update values.

3. Run migrations:

```bash
pnpm prisma:migrate
```

4. Seed sample data:

```bash
pnpm seed
```

5. Start the dev server:

```bash
pnpm dev
```
