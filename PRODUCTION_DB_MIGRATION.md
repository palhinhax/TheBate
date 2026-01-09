# Production Database Migration Issue - URGENT

## Problem

The production database is missing required tables:

- `PasswordResetToken`
- `EmailVerificationToken`

Error: `The table 'public.PasswordResetToken' does not exist in the current database.`

## Solution

You need to run Prisma migrations on your production database. Here are the steps:

### Option 1: Manual Migration via Vercel CLI (Recommended)

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

### Option 2: Via Vercel Build Process

Add a build script to automatically run migrations during deployment.

Update `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

**⚠️ Warning**: This approach runs migrations on every deployment, which might cause issues if multiple builds run simultaneously.

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

## Verify Migrations

After running migrations, verify the tables exist:

```sql
-- Connect to your database and run:
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

You should see:

- `User`
- `Topic`
- `Comment`
- `Vote`
- `TopicVote`
- `PasswordResetToken` ✓
- `EmailVerificationToken` ✓

## Existing Migrations

The following migrations need to be applied:

1. `20260108094102_init` - Initial schema
2. `20260108112142_add_language_to_topics` - Add language field
3. `20260108125538_remove_comment_score` - Remove score
4. `20260108140000_add_score_to_comment` - Add score back
5. `20260108170645_add_is_owner_field` - Add isOwner field
6. `20260108195051_add_password_reset_token` - **PasswordResetToken table** ⚠️
7. `20260109103101_add_email_verification` - **EmailVerificationToken table** ⚠️

## Prevention

To avoid this in the future:

1. **Always run migrations in production** after deployment
2. **Add a post-deploy hook** in Vercel settings
3. **Use Vercel's "Ignored Build Step"** to prevent builds without proper setup
4. **Test migrations in a staging environment** before production

## Quick Fix Script

Create a script `scripts/migrate-production.sh`:

```bash
#!/bin/bash
set -e

echo "Pulling production environment variables..."
vercel env pull .env.production --yes

echo "Running migrations..."
DATABASE_URL="$(grep DATABASE_URL .env.production | cut -d '=' -f2-)" npx prisma migrate deploy

echo "✓ Migrations completed successfully!"
```

Make it executable:

```bash
chmod +x scripts/migrate-production.sh
```

Run it:

```bash
./scripts/migrate-production.sh
```

## Need Help?

If you encounter issues:

1. Check Vercel logs for detailed error messages
2. Verify DATABASE_URL is correctly set in Vercel environment variables
3. Ensure your database user has CREATE TABLE permissions
4. Check if there are any pending migrations: `npx prisma migrate status`
