# Engagement Seed System

This directory contains scripts for seeding the application with realistic engagement data (users, comments, and votes).

## Overview

The engagement seed system is designed to populate the platform with realistic activity so it doesn't look empty at launch. It's a **one-time operation** that should be run manually after deployment.

## Features

- ✅ **Multi-language support**: Creates users for 6 locales (en, pt, es, fr, de, it)
- ✅ **Realistic time distribution**: Activity spread over 30-180 days with peak times
- ✅ **Opinion diversity**: Comments distributed as 40% pro, 40% contra, 20% neutral
- ✅ **Long-tail voting**: Few comments get many votes, most get few/none
- ✅ **Idempotent**: Checks if seed already ran and exits safely
- ✅ **Clean separation**: All seed data marked with `isSeed = true` for easy cleanup

## Scripts

### 1. `seed-engagement.ts` - Main Seed Script

Populates the database with:

- **60 users** (10 per locale)
- **8-20 comments per topic** with realistic opinions
- **Replies** (max depth: 2 levels, 40% of comments get 1-3 replies)
- **Votes** with long-tail distribution

**Usage:**

```bash
npm run seed:engagement
```

**Behavior:**

- Checks if seed data already exists
- Exits safely if already seeded
- Creates users with dates spread over last 30-180 days
- Creates comments/replies with dates spread over last 1-60 days
- Applies activity patterns (more at night 19:00-00:00 and weekends)
- Generates votes with long-tail distribution

**Configuration** (in `seed-engagement.ts`):

```typescript
const LOCALES = ["en", "pt", "es", "fr", "de", "it"];
const USERS_PER_LOCALE = 10;
const COMMENTS_PER_TOPIC_MIN = 8;
const COMMENTS_PER_TOPIC_MAX = 20;
const REPLY_PROBABILITY = 0.4;
const MAX_REPLIES_PER_COMMENT = 3;
```

### 2. `cleanup-seed-data.ts` - Cleanup Script

Removes all seed data from the database.

**Usage:**

```bash
npm run seed:cleanup
```

**Behavior:**

- Checks for seed data existence
- Deletes all records where `isSeed = true`:
  - Votes
  - Comments (including replies)
  - Users
- Shows summary of deleted records

### 3. `seed-data-generators.ts` - Utility Functions

Contains helper functions for generating realistic seed data:

- `generateUsersForLocale()` - Creates realistic names/emails per locale
- `getRandomComment()` - Returns locale-appropriate comment text
- `randomDateInRange()` - Generates dates within specified range
- `adjustForActivityPattern()` - Applies peak time/weekend patterns
- `getLongTailVoteCount()` - Returns vote counts with Pareto distribution

## Database Schema Changes

The following fields were added to support seed data:

```prisma
model User {
  // ... existing fields
  isSeed Boolean @default(false) // Mark seed users for cleanup
}

model Comment {
  // ... existing fields
  isSeed Boolean @default(false) // Mark seed comments for cleanup
}

model Vote {
  // ... existing fields
  isSeed Boolean @default(false) // Mark seed votes for cleanup
}
```

Migration: `prisma/migrations/20260110200738_add_is_seed_fields/`

## Workflow

### Initial Deployment

1. Deploy application to production
2. Run topic seed script (if needed):
   ```bash
   npm run db:seed-topics
   ```
3. Run engagement seed script:
   ```bash
   npm run seed:engagement
   ```
4. Verify data in the application

### Re-seeding (if needed)

1. Clean existing seed data:
   ```bash
   npm run seed:cleanup
   ```
2. Run engagement seed again:
   ```bash
   npm run seed:engagement
   ```

## Seed Data Characteristics

### Users (60 total)

- **Locales**: en, pt, es, fr, de, it (10 users each)
- **Names**: Realistic names per locale
- **Usernames**: Generated from names (e.g., "maria_silva")
- **Emails**: Locale-appropriate domains (e.g., @exemplo.pt)
- **Created dates**: Last 30-180 days
- **Password**: `seed123password` (for testing only)

### Comments

- **Quantity**: 8-20 per topic (varies)
- **Language**: Matches topic language
- **Style**: Short to medium, opinionated but not AI-perfect
- **Opinion distribution**:
  - 40% pro (side: AFAVOR)
  - 40% contra (side: CONTRA)
  - 20% neutral (side: null)
- **Created dates**: Last 1-60 days, after topic creation
- **Activity patterns**: More at night (19:00-00:00) and weekends

### Replies

- **Quantity**: 40% of comments get 1-3 replies
- **Max depth**: 2 levels (reply to comment only, no nested replies)
- **Side**: Always null (replies don't take sides)
- **Created dates**: After parent comment
- **Different authors**: Reply author ≠ parent author

### Votes

- **Distribution**: Long-tail (Pareto principle)
  - 50% of comments: 0 votes
  - 25% of comments: 1 vote
  - 15% of comments: 2-4 votes
  - 7% of comments: 5-14 votes
  - 3% of comments: 15+ votes
- **Value**: Always +1 (quality vote)
- **Created dates**: Between comment creation and now
- **Uniqueness**: Each user can vote once per comment

## Technical Implementation

### Batch Operations

The scripts use efficient batch operations to minimize database round-trips:

- User creation: Sequential to avoid conflicts
- Comment creation: Per topic, maintaining time order
- Vote creation: Batch per comment

### Time Distribution

All timestamps are carefully calculated:

1. Users: `randomDateInRange(180, 30)` → last 30-180 days
2. Comments: `randomDateInRange(60, 0)` → last 1-60 days
3. Replies: After parent comment + random offset
4. Votes: Between comment date and now
5. Activity adjustment: 60% moved to peak hours, 40% to weekends

### Idempotency

The script checks for existing seed data before running:

```typescript
const alreadySeeded = await checkIfSeeded();
if (alreadySeeded) {
  console.log("Seed data already exists!");
  process.exit(0);
}
```

## Safety Features

1. **Clear marking**: All seed data has `isSeed = true`
2. **Separate cleanup**: Can remove seed data without touching real data
3. **No production impact**: Doesn't affect deploy pipeline
4. **Manual execution**: Must be run explicitly

## Troubleshooting

### "Seed data already exists"

Run cleanup first: `npm run seed:cleanup`

### "No topics found"

Seed topics first: `npm run db:seed-topics`

### Duplicate key errors

Usually harmless - happens when generating random data with collisions

### Database connection errors

Ensure `DATABASE_URL` is set in `.env` file

## Development vs Production

### Development

- Use regular seed script: `npm run db:seed`
- This clears all data and creates fresh development data

### Production

- Use engagement seed: `npm run seed:engagement`
- Preserves existing data
- Adds engagement on top of real data
- Run once after initial deployment

## Examples

### Full setup from scratch

```bash
# 1. Run database migrations
npm run db:migrate

# 2. Seed hot topics
npm run db:seed-topics

# 3. Seed engagement
npm run seed:engagement
```

### Clean slate

```bash
# Remove only seed data
npm run seed:cleanup

# Or reset entire database (development only!)
npm run db:seed  # This clears ALL data
```

## Monitoring

After seeding, verify in the application:

- [ ] Users appear in different language contexts
- [ ] Comments show diverse opinions (pro/contra/neutral)
- [ ] Reply threads exist (max depth 2)
- [ ] Vote counts vary (long-tail distribution)
- [ ] Activity timestamps look realistic (spread over time)
- [ ] Peak activity times visible (nights/weekends)

## Future Enhancements

Possible improvements:

- [ ] Add CLI arguments for configuration
- [ ] Support for custom comment templates
- [ ] Topic-specific opinion distributions
- [ ] User interaction patterns (some users more active)
- [ ] Configurable seed size (small/medium/large)
- [ ] Progress indicators for long-running operations
