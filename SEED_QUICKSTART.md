# Quick Start: Engagement Seeding

After deploying the application for the first time, populate it with engagement data so it doesn't look empty.

## Prerequisites

1. Application deployed and running
2. Database migrations applied
3. Topics seeded (if using topic seed script)

## Two Ways to Seed

### Option A: GitHub Actions (Recommended for Production)

The easiest way to seed your production database is using the GitHub Actions workflow:

1. Go to your GitHub repository
2. Navigate to **Actions** > **Seed Production (One-off)**
3. Click **Run workflow**
4. Configure options:
   - **Run prisma migrate deploy before seed**: Select `true` if you need to run migrations first
   - **Must be true to run seed**: Keep as `true` to proceed
5. Click **Run workflow**

**Required GitHub Secret:**
- `DATABASE_URL`: Your production database connection string (add in Settings > Secrets > Actions)

The workflow will:
- Install dependencies
- Generate Prisma client
- Optionally run migrations
- Execute the seed script
- Exit safely if data already exists (idempotent)

### Option B: Local/Manual Seeding

If running locally or from a server:

```bash
pnpm run seed:engagement
```

Both methods create:
- **60 users** across 6 languages (en, pt, es, fr, de, it)
- **8-20 comments per topic** with realistic opinions
- **Replies** to comments (max depth: 2 levels)
- **Votes** with realistic long-tail distribution

**Time:** Takes about 30-60 seconds depending on number of topics.

## Verify Results

Visit the application and check:
- Topics now have comments
- Comments show different opinions (pro, contra, neutral)
- Some comments have replies
- Vote counts vary realistically
- Activity dates are spread over time

## Clean Up (Optional)

To remove all seed data:

```bash
pnpm run seed:cleanup
```

Then you can re-seed if desired:

```bash
pnpm run seed:engagement
```

## Notes

- **One-time operation**: The script checks if it already ran and exits safely
- **Safe for production**: Only affects data marked with `isSeed = true`
- **No pipeline impact**: Must be run manually, doesn't affect deployments
- **Realistic data**: Time-distributed with activity patterns (nights/weekends)

## Full Documentation

See [scripts/SEED_README.md](./SEED_README.md) for complete documentation.
