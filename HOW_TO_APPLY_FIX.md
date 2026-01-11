# How to Apply This Fix

## Quick Start

**Simply merge this PR to `main` branch.** The GitHub Actions workflow will automatically:
1. Detect pending migrations
2. Apply them to the production database
3. Allow Vercel deployment to proceed with updated schema

## What Happens When You Merge

### Step 1: GitHub Actions Runs
- Workflow: `.github/workflows/migrate-on-push.yml`
- Triggers on: Changes to `prisma/schema.prisma` or `prisma/migrations/**`
- Action: Runs `prisma migrate deploy` with retry logic
- Result: Production database gets the missing `Topic.type` column

### Step 2: Vercel Deploys
- Build runs: `prisma generate && next build`
- No migration conflicts (already done in Step 1)
- Application starts with correct schema

### Step 3: Site Works
- No more `Topic.type` column errors
- Application can query topics successfully

## Manual Migration (If Needed)

If for some reason the automatic workflow doesn't run or you need to apply migrations manually:

### Option 1: Run GitHub Actions Workflow Manually
1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Database Update & Seed** workflow
4. Click **Run workflow**
5. Select:
   - Branch: `main`
   - Seed type: `none` (just migrations, no seed data)
   - Force migrate: `false`
6. Click **Run workflow**
7. Wait for completion (check logs for success)

### Option 2: Use Prisma CLI
```bash
# Set your production DATABASE_URL
export DATABASE_URL="postgresql://user:pass@host:5432/db"

# Run migrations
npx prisma migrate deploy

# Verify
npx prisma migrate status
```

## Verification After Fix

### 1. Check GitHub Actions
- Go to **Actions** tab
- Find the **Auto-migrate Database on Push** workflow run
- Verify it shows ✅ success
- Check logs for "Migration successful" message

### 2. Check Production Site
- Visit: https://thebatee.com
- Should load without errors
- Try viewing topics - should work

### 3. Check Database (Optional)
Connect to your database and run:
```sql
-- Verify Topic.type column exists
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'Topic' AND column_name = 'type';

-- Should return:
-- column_name | data_type    | column_default
-- type        | USER-DEFINED | 'YES_NO'::TopicType
```

## Troubleshooting

### If Migration Fails

**Check GitHub Actions logs:**
1. Go to **Actions** tab
2. Click on the failed workflow run
3. Look for error messages

**Common issues:**
- **Database connection timeout**: Check DATABASE_URL secret is correct
- **Permission denied**: Database user needs CREATE/ALTER permissions
- **Migration already applied**: Check `prisma migrate status`

**Solutions:**
1. Verify `DATABASE_URL` in GitHub Secrets (Settings > Secrets > Actions)
2. Run manual workflow with `force_migrate: true`
3. Check database logs for connection issues

### If Error Persists After Merge

If you still see the `Topic.type` error after merging:

1. **Check if migration ran:**
   - Go to Actions tab
   - Verify "Auto-migrate Database on Push" completed successfully

2. **Run manual migration:**
   - Use Option 1 or 2 above

3. **Check database directly:**
   ```sql
   \d "Topic"  -- PostgreSQL: describe Topic table
   ```
   Look for `type` column with `TopicType` enum

4. **Check migration status:**
   ```bash
   npx prisma migrate status
   ```
   Should show all migrations as "Applied"

## Need Help?

If you continue to experience issues:

1. Check GitHub Actions logs for detailed error messages
2. Verify DATABASE_URL is correctly set in production
3. Check PostgreSQL logs for connection/permission errors
4. Review PRODUCTION_DB_MIGRATION.md for more troubleshooting steps

## Summary

✅ **Normal flow (automatic):**
- Merge PR → GitHub Actions runs migrations → Vercel deploys → Site works

✅ **Manual flow (if needed):**
- Run "Database Update & Seed" workflow manually → Verify success → Site works

✅ **Verification:**
- Check GitHub Actions logs
- Visit production site
- Query database (optional)
