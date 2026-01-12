# Production Database Migration & Seeding

## Automated Migration (Recommended)

✅ **Migrations now run automatically via GitHub Actions!**

### How It Works

**On every push to `main`** that includes changes to:

- `prisma/schema.prisma`
- `prisma/migrations/**`

**GitHub Actions automatically**:

- Checks if migrations are needed
- Runs `prisma migrate deploy` with retry logic
- Reports success/failure status
- **Blocks deployment if migrations fail** (prevents broken deployments)

**Important**: Migrations run **before** Vercel deployment, not during the build. This ensures:

- ✅ Database is updated before new code is deployed
- ✅ No concurrent migration conflicts
- ✅ Build failures don't prevent migration troubleshooting
- ✅ Clear separation of concerns

### Manual Migration (If Needed)

If you need to run migrations manually:

#### Option 1: Quick Migration (No Seeding)

Use the **Auto-migrate Database on Push** workflow:

1. Go to your GitHub repository
2. Navigate to **Actions** > **Auto-migrate Database on Push**
3. Click **Run workflow** dropdown
4. Select branch: `main`
5. Configure options:
   - **Force migration**: Choose `true` to force migration, or `false` to auto-detect
6. Click **Run workflow**

**When to use:**

- ✅ After initial deployment when migrations need to catch up
- ✅ When auto-migration didn't trigger (e.g., workflow added after migrations)
- ✅ To quickly apply pending migrations without seeding

#### Option 2: Migration with Seeding

Use the **Database Update & Seed** workflow:

1. Go to your GitHub repository
2. Navigate to **Actions** > **Database Update & Seed**
3. Click **Run workflow**
4. Configure options:
   - **Type of seed to run**: Choose `yaml` for initial setup, `engagement` for additional data, or `none` to just run migrations
   - **Force migration**: Usually keep as `false` (workflow will auto-detect if migrations are needed)
5. Click **Run workflow**

**When to use:**

- ✅ Initial setup with seed data
- ✅ Adding engagement data to existing topics
- ✅ Full database update including migrations and seeding

**Features:**

- ✅ Automatically checks if migrations are needed
- ✅ Retry logic (3 attempts) to handle timeouts
- ✅ Proper connection and statement timeouts
- ✅ Idempotent seeding (safe to run multiple times)
- ✅ Comprehensive error reporting

**Required GitHub Secret:**

- `DATABASE_URL`: Your production database connection string (add in Settings > Secrets > Actions)

## Common Issues & Solutions

### Issue: PostgreSQL Advisory Lock Timeout

**Error:**

```
P1002: The database server was reached but timed out.
Context: Timed out trying to acquire a postgres advisory lock
```

**Cause:** Multiple migration processes running simultaneously or a stale lock from a previous failed migration.

**Solutions:**

1. **Use the GitHub Actions workflow** (recommended) - it includes retry logic and proper timeouts
2. **Wait and retry** - If another process is running, wait a few minutes and try again
3. **Check for stuck processes** - Connect to your database and check for long-running queries:
   ```sql
   SELECT * FROM pg_stat_activity WHERE state = 'active';
   ```
4. **Clear advisory locks** (last resort):
   ```sql
   SELECT pg_advisory_unlock_all();
   ```

## Manual Migration Options

### Option 1: Using the Helper Script

Run the included migration helper script:

```bash
./scripts/migrate-production.sh
```

This script:

- Pulls production environment variables
- Runs migrations with proper timeouts
- Verifies the database schema

### Option 2: Via Vercel CLI

1. **Install Vercel CLI** (if not already installed):

```bash
pnpm add -g vercel
```

2. **Login to Vercel**:

```bash
vercel login
```

3. **Link your project**:

```bash
vercel link
```

4. **Pull production environment variables**:

```bash
vercel env pull .env.production
```

5. **Run migrations against production database**:

```bash
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2-)" npx prisma migrate deploy
```

### Option 3: Direct Database Connection

If you have direct access to your PostgreSQL database:

1. Get your production `DATABASE_URL` from Vercel dashboard
2. Set it locally:

```bash
export DATABASE_URL="your_production_database_url"
```

3. Run migrations:

```bash
npx prisma migrate deploy
```

## Seeding the Database

### YAML-Based Seeding (Recommended)

The new YAML-based approach allows you to define seed data in a structured format:

**File:** `prisma/seed-data.yml`

**Run locally:**

```bash
pnpm run db:seed-yaml
```

**Run via GitHub Actions:**
Use the "Database Update & Seed" workflow with `seed_type: yaml`

**Features:**

- ✅ Declarative configuration
- ✅ Idempotent (safe to run multiple times)
- ✅ Version controlled
- ✅ Easy to customize

### Engagement Seeding

For adding realistic engagement data (comments, votes, etc.):

```bash
pnpm run seed:engagement
```

This creates:

- 60 users across multiple languages
- 8-20 comments per topic with realistic opinions
- Replies to comments (max depth: 2 levels)
- Votes with realistic distribution

## Problem

The production database may be missing required tables or need schema updates:

- `PasswordResetToken`
- `EmailVerificationToken`
- Other schema changes from recent migrations

Error: `The table 'public.PasswordResetToken' does not exist in the current database.`

## Solution Overview

You need to run Prisma migrations on your production database. Choose one of the methods above based on your needs and environment.

## Verify Migrations

After running migrations, verify the tables exist:

```sql
-- Connect to your database and run:
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
```

You should see all required tables including:

- `User`
- `Topic`
- `TopicOption`
- `Comment`
- `Vote`
- `TopicVote`
- `PasswordResetToken` ✓
- `EmailVerificationToken` ✓

## Migration History

The repository contains the following migrations that may need to be applied:

1. `20260108094102_init` - Initial schema
2. `20260108112142_add_language_to_topics` - Add language field
3. `20260108125538_remove_comment_score` - Remove score
4. `20260108140000_add_score_to_comment` - Add score back
5. `20260108170645_add_is_owner_field` - Add isOwner field
6. `20260108195051_add_password_reset_token` - PasswordResetToken table
7. `20260109103101_add_email_verification` - EmailVerificationToken table
8. `20260109120140_add_preferred_language_and_report_count` - User preferences
9. `20260109145337_add_preferred_content_languages` - Content language preferences
10. `20260109181945_add_comment_report_count` - Comment moderation
11. `20260110200738_add_is_seed_fields` - Seed data tracking
12. `20260111000000_add_multi_choice_topics` - Multi-choice topic support with TopicType enum, TopicOption table, and related fields

## Known Issues & Solutions

### Issue: Missing Topic.type Column Error

**Error Message:**

```
PrismaClientKnownRequestError: Invalid prisma.topic.findMany() invocation:
The column Topic.type does not exist in the current database.
Code: P2022
```

**Cause:**
The production database is missing the `20260111000000_add_multi_choice_topics` migration. This migration adds the `type` column to the Topic table, which is required for all topics.

**Solutions (in order of preference):**

1. **Manual workflow trigger (recommended):**
   - Go to **Actions** > **Auto-migrate Database on Push**
   - Click **Run workflow** dropdown
   - Select branch: `main`
   - Set `force_migrate: false` (or `true` to force)
   - Click **Run workflow**
   - Wait for completion (check workflow logs for status)

2. **Alternative - Full update with seeding:**
   - Go to **Actions** > **Database Update & Seed**
   - Click **Run workflow**
   - Set `seed_type: none` and `force_migrate: false`
   - Click **Run workflow**

3. **Automatic fix (if manual doesn't work):**
   - Make any minor change to `prisma/schema.prisma` (e.g., add a comment)
   - Commit and push to `main` branch
   - The auto-migration workflow will trigger and apply pending migrations
   - Wait for GitHub Actions to complete successfully

4. **CLI fix (advanced):**
   ```bash
   # Ensure DATABASE_URL is set to production database
   export DATABASE_URL="your_production_database_url"
   npx prisma migrate deploy
   ```

**What the migration adds:**

- `TopicType` enum with values: `YES_NO`, `MULTI_CHOICE`
- `type` column on Topic table (defaults to `YES_NO`)
- `allowMultipleVotes` and `maxChoices` columns for multi-choice configuration
- `TopicOption` table for storing voting options
- Updated `TopicVote` and `Comment` tables to support option associations
- Necessary indexes and foreign key constraints

## Best Practices

### Prevention

To avoid migration issues in the future:

1. **Use the GitHub Actions workflow** - Automated with retry logic and proper error handling
2. **Test migrations in staging** before applying to production
3. **Monitor database connections** - Ensure connection pooling is properly configured
4. **Set appropriate timeouts** - The workflow now includes proper timeouts to prevent hangs
5. **Use idempotent seeding** - The YAML-based seed can be run multiple times safely

### Troubleshooting

If you encounter issues:

1. **Check GitHub Actions logs** - The workflow provides detailed error messages
2. **Verify DATABASE_URL** - Ensure it's correctly set in GitHub Secrets or Vercel environment variables
3. **Check database permissions** - Your database user needs CREATE TABLE permissions
4. **Monitor active connections** - Too many connections can cause timeouts
5. **Use retry logic** - The workflow automatically retries failed migrations

### Connection Timeout Configuration

The workflow now includes optimized connection settings:

```bash
export PGCONNECT_TIMEOUT=15        # 15 seconds to establish connection
export PGSTATEMENT_TIMEOUT=45000   # 45 seconds for statements
```

These settings help prevent:

- ✅ Advisory lock timeouts
- ✅ Connection hangs
- ✅ Long-running query issues

## Need Help?

If you continue to experience issues:

1. Review the GitHub Actions workflow logs for specific errors
2. Check PostgreSQL logs on your database server
3. Verify network connectivity to your database
4. Consider temporarily increasing connection limits
5. Contact your database provider for assistance with connection issues
