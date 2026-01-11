# Resolving Failed Migrations

## Problem

When a migration fails during deployment, Prisma marks it as failed in the `_prisma_migrations` table. This prevents subsequent migration attempts from running because Prisma detects the failed migration and refuses to proceed.

**Common Error:**
```
Error: P3009

migrate found failed migrations in the target database, new migrations will not be applied.
The `20260111000000_add_multi_choice_topics` migration started at 2026-01-11 00:49:07.750636 UTC failed
```

## Root Cause

The migration `20260111000000_add_multi_choice_topics` initially had an error where it tried to:
```sql
ALTER TABLE "TopicVote" DROP CONSTRAINT "TopicVote_userId_topicId_key";
```

However, this was created as a **UNIQUE INDEX** (not a constraint) in the initial migration, causing PostgreSQL to fail with:
```
ERROR: constraint "TopicVote_userId_topicId_key" of relation "TopicVote" does not exist
```

## Solution

### Step 1: Resolve the Failed Migration Record

Use the provided script to mark the failed migration as rolled back:

```bash
# For production database via GitHub Actions
# (Add this as a step in the workflow if needed)
pnpm tsx scripts/resolve-failed-migration.ts

# Or manually via Vercel CLI
vercel env pull .env.production
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2-)" pnpm tsx scripts/resolve-failed-migration.ts
```

This script:
1. Finds all failed migrations (those with `finished_at = NULL` and `rolled_back_at = NULL`)
2. Marks them as rolled back by setting `rolled_back_at = NOW()`
3. Adds a log entry explaining the rollback

### Step 2: Re-run the Migration

After marking the failed migration as rolled back, you can retry:

**Via GitHub Actions:**
1. Go to **Actions** > **Database Update & Seed**
2. Click **Run workflow**
3. Set `force_migrate: true`
4. Click **Run workflow**

**Via Command Line:**
```bash
pnpm prisma migrate deploy
```

## What Was Fixed

The migration SQL has been corrected from:
```sql
ALTER TABLE "TopicVote" DROP CONSTRAINT "TopicVote_userId_topicId_key";
```

To:
```sql
DROP INDEX IF EXISTS "TopicVote_userId_topicId_key";
```

This properly drops the unique index (not constraint) before adding the new constraint.

## Alternative: Manual Database Fix

If the automated script doesn't work, you can manually fix the database:

### Option A: Mark Migration as Rolled Back (SQL)

Connect to your production database and run:

```sql
-- Find the failed migration
SELECT * FROM "_prisma_migrations" 
WHERE migration_name = '20260111000000_add_multi_choice_topics';

-- Mark it as rolled back
UPDATE "_prisma_migrations"
SET rolled_back_at = NOW(),
    logs = CONCAT(COALESCE(logs, ''), E'\n\nManually marked as rolled back')
WHERE migration_name = '20260111000000_add_multi_choice_topics'
AND finished_at IS NULL;
```

### Option B: Complete Manual Recovery

If you need more control, you can manually complete the migration steps:

```sql
-- 1. Check if TopicType enum exists
SELECT EXISTS (
  SELECT 1 FROM pg_type WHERE typname = 'TopicType'
);

-- If it doesn't exist, create it:
CREATE TYPE "TopicType" AS ENUM ('YES_NO', 'MULTI_CHOICE');

-- 2. Add columns if they don't exist (check first)
ALTER TABLE "Topic" ADD COLUMN IF NOT EXISTS "type" "TopicType" NOT NULL DEFAULT 'YES_NO';
ALTER TABLE "Topic" ADD COLUMN IF NOT EXISTS "allowMultipleVotes" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Topic" ADD COLUMN IF NOT EXISTS "maxChoices" INTEGER NOT NULL DEFAULT 1;

-- 3. Create TopicOption table if it doesn't exist
CREATE TABLE IF NOT EXISTS "TopicOption" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "topicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TopicOption_pkey" PRIMARY KEY ("id")
);

-- 4. Update TopicVote table
ALTER TABLE "TopicVote" ALTER COLUMN "vote" DROP NOT NULL;
ALTER TABLE "TopicVote" ADD COLUMN IF NOT EXISTS "optionId" TEXT;

-- 5. Add foreign key if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'TopicVote_optionId_fkey'
    ) THEN
        ALTER TABLE "TopicVote" ADD CONSTRAINT "TopicVote_optionId_fkey" 
        FOREIGN KEY ("optionId") REFERENCES "TopicOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- 6. Update Comment table
ALTER TABLE "Comment" ADD COLUMN IF NOT EXISTS "optionId" TEXT;

-- 7. Add foreign key if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Comment_optionId_fkey'
    ) THEN
        ALTER TABLE "Comment" ADD CONSTRAINT "Comment_optionId_fkey" 
        FOREIGN KEY ("optionId") REFERENCES "TopicOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- 8. Drop old unique index (this was the problematic line)
DROP INDEX IF EXISTS "TopicVote_userId_topicId_key";

-- 9. Add new unique constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'TopicVote_userId_topicId_optionId_key'
    ) THEN
        ALTER TABLE "TopicVote" ADD CONSTRAINT "TopicVote_userId_topicId_optionId_key" 
        UNIQUE("userId", "topicId", "optionId");
    END IF;
END $$;

-- 10. Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS "Topic_type_idx" ON "Topic"("type");
CREATE INDEX IF NOT EXISTS "TopicOption_topicId_order_idx" ON "TopicOption"("topicId", "order");
CREATE INDEX IF NOT EXISTS "TopicOption_topicId_idx" ON "TopicOption"("topicId");
CREATE INDEX IF NOT EXISTS "TopicVote_optionId_idx" ON "TopicVote"("optionId");
CREATE INDEX IF NOT EXISTS "Comment_topicId_optionId_idx" ON "Comment"("topicId", "optionId");

-- 11. Add TopicOption foreign key if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'TopicOption_topicId_fkey'
    ) THEN
        ALTER TABLE "TopicOption" ADD CONSTRAINT "TopicOption_topicId_fkey" 
        FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- 12. Mark the migration as completed
UPDATE "_prisma_migrations"
SET finished_at = NOW(),
    applied_steps_count = 8,
    logs = 'Manually completed after fixing the DROP CONSTRAINT issue'
WHERE migration_name = '20260111000000_add_multi_choice_topics';
```

## Prevention

To avoid similar issues in the future:

1. **Test migrations in staging first** - Always test migrations on a staging database before production
2. **Understand constraint vs index** - Be aware of the difference between UNIQUE INDEX and UNIQUE CONSTRAINT
3. **Use idempotent operations** - When possible, use `IF EXISTS` or `IF NOT EXISTS` clauses
4. **Review generated migrations** - Always review Prisma-generated migrations before applying
5. **Backup before migrating** - Take a database backup before running migrations in production

## Verification

After resolving the issue, verify the migration was successful:

```sql
-- Check migration status
SELECT * FROM "_prisma_migrations" 
WHERE migration_name = '20260111000000_add_multi_choice_topics';

-- Verify tables exist
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('Topic', 'TopicOption', 'TopicVote')
ORDER BY tablename;

-- Verify columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Topic' 
AND column_name IN ('type', 'allowMultipleVotes', 'maxChoices');

-- Verify the new constraint exists
SELECT conname FROM pg_constraint 
WHERE conname = 'TopicVote_userId_topicId_optionId_key';
```

## Need Help?

If you continue to experience issues:

1. Check the full error logs in GitHub Actions
2. Verify your DATABASE_URL is correct
3. Ensure you have sufficient database permissions
4. Contact your database provider if connection issues persist
5. Consider reaching out to the development team with specific error details
