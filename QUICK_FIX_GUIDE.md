# Quick Fix Guide: Missing Topic.type Column

## Problem

Your production database is missing the `Topic.type` column, causing this error:

```
PrismaClientKnownRequestError: Invalid prisma.topic.findMany() invocation:
The column Topic.type does not exist in the current database.
Code: P2022
```

## Why This Happened

The auto-migration workflow was added to the repository **after** the migration was already committed. Since the workflow only triggers on **new** pushes that modify schema/migrations, it never ran automatically.

## Solution (2 minutes)

### Step 1: Go to GitHub Actions

1. Open your repository in GitHub
2. Click on the **"Actions"** tab at the top
3. In the left sidebar, find and click **"Auto-migrate Database on Push"**

### Step 2: Run the Workflow Manually

1. Click the **"Run workflow"** dropdown button (top right)
2. Make sure **branch: main** is selected
3. For **"Force migration"**, select **"false"**
4. Click the green **"Run workflow"** button

### Step 3: Monitor Execution

1. Wait a few seconds, then refresh the page
2. Click on the new workflow run that appears
3. Click on the **"migrate"** job to see detailed logs
4. Wait for completion (should take 1-2 minutes)

### Step 4: Verify Success

Look for these indicators in the logs:

- ✅ "Migration successful"
- ✅ "Migrations completed successfully"

If you see any errors:

- ❌ Check that `DATABASE_URL` secret is set correctly in GitHub
- ❌ Verify your database is accessible
- ❌ Try running with `force_migrate: true`

## Alternative Solutions

### Option 2: Full Update with Seeding

If you also want to add seed data:

1. Go to **Actions** > **"Database Update & Seed"**
2. Click **"Run workflow"**
3. Set **seed_type: none** (or choose yaml/engagement if you want seed data)
4. Click **"Run workflow"**

### Option 3: Command Line (Advanced)

If you prefer using the command line:

```bash
# Set your production DATABASE_URL
export DATABASE_URL="your_production_database_url_from_vercel"

# Run migrations
npx prisma migrate deploy
```

## What This Migration Does

The `20260111000000_add_multi_choice_topics` migration adds:

- ✅ `TopicType` enum with values: `YES_NO`, `MULTI_CHOICE`
- ✅ `type` column on Topic table (defaults to `YES_NO`)
- ✅ `allowMultipleVotes` and `maxChoices` columns
- ✅ `TopicOption` table for storing voting options
- ✅ Updated indexes and foreign key constraints

**Important**: All existing topics will automatically get `type = YES_NO`, so they'll work exactly as before. This migration is **backward compatible**.

## Need Help?

If you continue to have issues:

1. Check the full workflow logs in GitHub Actions
2. Verify `DATABASE_URL` in your GitHub repository secrets (Settings > Secrets and variables > Actions)
3. Review [PRODUCTION_DB_MIGRATION.md](./PRODUCTION_DB_MIGRATION.md) for detailed troubleshooting
4. Check your database provider's dashboard for connection issues

## Prevention

This fix also ensures this won't happen again:

- ✅ The workflow can now be triggered manually anytime
- ✅ Future schema/migration changes will auto-migrate on push to main
- ✅ Documentation is updated with clear troubleshooting steps
