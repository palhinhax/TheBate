# Database Migration Fix - Topic.type Column Error

## Problem

Production deployment was failing with the error:
```
PrismaClientKnownRequestError: Invalid prisma.topic.findMany() invocation:
The column Topic.type does not exist in the current database.
Code: P2022
```

## Root Cause

The migration `20260111000000_add_multi_choice_topics` exists in the codebase but was never applied to the production database. This migration adds:
- `TopicType` enum (`YES_NO`, `MULTI_CHOICE`)
- `type` column to the Topic table
- `TopicOption` table for multi-choice voting
- Related fields and indexes

## Solution Implemented

### 1. Automatic Migration on Push to Main

Created `.github/workflows/migrate-on-push.yml` that:
- Triggers automatically when changes are pushed to `main` branch
- Detects changes to `prisma/schema.prisma` or `prisma/migrations/**`
- Runs `prisma migrate deploy` with retry logic
- Reports success/failure status

**Benefits:**
- ✅ Migrations run automatically before deployment
- ✅ Prevents deployment with outdated database schema
- ✅ Includes retry logic for reliability
- ✅ Proper timeout configuration

### 2. Updated Vercel Build Script

Modified `package.json` to include migration in the `vercel-build` script:
```json
"vercel-build": "prisma generate && prisma migrate deploy && next build"
```

**Benefits:**
- ✅ Ensures database is up-to-date during deployment
- ✅ Prevents server from starting with mismatched schema
- ✅ Works with Vercel's deployment pipeline

### 3. Updated Documentation

Updated `PRODUCTION_DB_MIGRATION.md` and `DEPLOY.md` to:
- Document the automatic migration workflow
- Explain the specific error and its solution
- Provide manual migration options as fallback
- Clarify when migrations run

## How to Apply the Fix

### Option 1: Automatic (Recommended)
Simply push this PR to the `main` branch. The GitHub Actions workflow will:
1. Detect the migration changes
2. Apply pending migrations to production database
3. Complete the deployment

### Option 2: Manual via GitHub Actions
1. Go to **Actions** > **Database Update & Seed**
2. Click **Run workflow**
3. Set `seed_type: none`
4. Click **Run workflow**

### Option 3: Manual via CLI
```bash
# Set production database URL
export DATABASE_URL="your_production_database_url"

# Run migrations
npx prisma migrate deploy
```

## Verification

After the fix is applied, verify:

1. **Check GitHub Actions logs** - Migration should complete successfully
2. **Visit your site** - Should load without errors
3. **Check database** - Run this SQL to verify:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'Topic' AND column_name = 'type';
   ```
   Should return: `type | USER-DEFINED (TopicType enum)`

## Prevention

This fix includes automatic migration on push, which prevents this issue from happening again by:
- Running migrations before deployment
- Ensuring schema is always synchronized
- Failing deployment if migrations fail (preventing broken deployments)

## Related Files

- `.github/workflows/migrate-on-push.yml` - New automatic migration workflow
- `package.json` - Updated `vercel-build` script
- `PRODUCTION_DB_MIGRATION.md` - Updated documentation
- `DEPLOY.md` - Updated deployment guide
- `prisma/migrations/20260111000000_add_multi_choice_topics/migration.sql` - The migration that needs to be applied
