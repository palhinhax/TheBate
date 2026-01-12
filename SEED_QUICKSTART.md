# Quick Start: Database Seeding

After deploying the application for the first time, populate it with seed data so it doesn't look empty.

## New: YAML-Based Seeding (Recommended)

The easiest and most maintainable way to seed your database is using the new YAML-based approach.

### What is YAML-Based Seeding?

Seed data is defined in a declarative YAML file (`prisma/seed-data.yml`) which includes:

- Admin and moderator users
- Sample users for different languages
- Sample topics to demonstrate the platform

**Benefits:**

- ✅ **Idempotent**: Safe to run multiple times
- ✅ **Version controlled**: Changes tracked in git
- ✅ **Easy to customize**: Edit YAML file to change seed data
- ✅ **No code changes needed**: Just update the YAML file

### Quick Start with GitHub Actions

1. Go to your GitHub repository
2. Navigate to **Actions** > **Database Update & Seed**
3. Click **Run workflow**
4. Configure options:
   - **Type of seed to run**: Select `yaml`
   - **Force migration**: Keep as `false` (auto-detects if migrations needed)
5. Click **Run workflow**

**Required GitHub Secret:**

- `DATABASE_URL`: Your production database connection string (add in Settings > Secrets > Actions)

The workflow will:

- Check and run any pending migrations (with retry logic)
- Apply seed data from `prisma/seed-data.yml`
- Create admin, moderator, and sample users
- Create sample topics in multiple languages

### Local/Manual Seeding

If running locally or from a server:

```bash
# Set your database URL
export DATABASE_URL="your_database_url"

# Run YAML-based seed
pnpm run db:seed-yaml
```

### Customizing Seed Data

Edit `prisma/seed-data.yml` to customize:

- User accounts (usernames, emails, passwords)
- User roles and language preferences
- Topics (titles, descriptions, tags, languages)

After editing, simply run the seed command again. The script will:

- Skip existing users (by email/username)
- Skip existing topics (by slug)
- Create any new entries

## Engagement Seeding

For additional realistic engagement data after initial setup:

### Option A: GitHub Actions

1. Go to **Actions** > **Database Update & Seed**
2. Select `engagement` as seed type
3. Run workflow

### Option B: Local/Manual

```bash
pnpm run seed:engagement
```

This creates:

- **60 users** across 6 languages (en, pt, es, fr, de, it)
- **8-20 comments per topic** with realistic opinions
- **Replies** to comments (max depth: 2 levels)
- **Votes** with realistic long-tail distribution

**Time:** Takes about 30-60 seconds depending on number of topics.

**Note:** This script checks if it already ran and exits safely to prevent duplicates.

## Verify Results

Visit the application and check:

- Admin and sample users can log in
- Topics are displayed in multiple languages
- Comments show different opinions (if engagement seed was run)
- Vote counts vary realistically (if engagement seed was run)

## Default Credentials

After YAML seeding, you can log in with:

**Admin:**

- Email: `admin@thebate.com`
- Password: `password123`

**Moderator:**

- Email: `mod@thebate.com`
- Password: `password123`

**Sample Users:**

- `maria@example.com` (Portuguese)
- `john@example.com` (English)
- `carlos@example.com` (Spanish)
- `jean@example.com` (French)
- `hans@example.com` (German)
- Password for all: `password123`

## Clean Up (Optional)

To remove seed data (marked with `isSeed = true` flag):

```bash
pnpm run seed:cleanup
```

Then you can re-seed if desired:

```bash
pnpm run db:seed-yaml
# or
pnpm run seed:engagement
```

## Migration + Seed in One Step

The GitHub Actions workflow **"Database Update & Seed"** handles both migrations and seeding in one go:

1. Checks if migrations are needed
2. Runs migrations with retry logic (if needed)
3. Applies seed data
4. Provides detailed error reporting

**Why this workflow is better:**

- ✅ Handles PostgreSQL advisory lock timeouts
- ✅ Automatic retry (3 attempts with delays)
- ✅ Proper connection timeout configuration
- ✅ Comprehensive error messages
- ✅ Safe for concurrent usage

## Troubleshooting

### Issue: "User already exists"

This is normal and expected. The seed script is idempotent and will skip existing users.

### Issue: "Topic already exists"

This is normal and expected. The seed script skips existing topics by slug.

### Issue: "Connection timeout" or "Advisory lock timeout"

Use the GitHub Actions workflow which includes:

- Retry logic (3 attempts)
- Proper timeouts (15s connect, 45s statement)
- Better error handling

### Issue: Need different seed data

1. Edit `prisma/seed-data.yml`
2. Run `pnpm run db:seed-yaml` again
3. Only new entries will be created

## Notes

- **YAML seed**: Creates base users and topics (idempotent, always safe to run)
- **Engagement seed**: Adds comments and votes (one-time operation, checks before running)
- **Cleanup**: Only removes data marked with `isSeed = true` flag
- **Production**: Always use GitHub Actions workflow for safety and reliability

## Full Documentation

See [PRODUCTION_DB_MIGRATION.md](./PRODUCTION_DB_MIGRATION.md) for complete database management documentation.
