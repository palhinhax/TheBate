# Quick Start: Engagement Seeding

After deploying the application for the first time, populate it with engagement data so it doesn't look empty.

## Prerequisites

1. Application deployed and running
2. Database migrations applied
3. Topics seeded (if using topic seed script)

## Steps

### 1. Run the engagement seed script

```bash
npm run seed:engagement
```

This creates:
- **60 users** across 6 languages (en, pt, es, fr, de, it)
- **8-20 comments per topic** with realistic opinions
- **Replies** to comments (max depth: 2 levels)
- **Votes** with realistic long-tail distribution

**Time:** Takes about 30-60 seconds depending on number of topics.

### 2. Verify the results

Visit the application and check:
- Topics now have comments
- Comments show different opinions (pro, contra, neutral)
- Some comments have replies
- Vote counts vary realistically
- Activity dates are spread over time

### 3. (Optional) Clean up if needed

To remove all seed data:

```bash
npm run seed:cleanup
```

Then you can re-seed if desired:

```bash
npm run seed:engagement
```

## Notes

- **One-time operation**: The script checks if it already ran and exits safely
- **Safe for production**: Only affects data marked with `isSeed = true`
- **No pipeline impact**: Must be run manually, doesn't affect deployments
- **Realistic data**: Time-distributed with activity patterns (nights/weekends)

## Full Documentation

See [scripts/SEED_README.md](./SEED_README.md) for complete documentation.
