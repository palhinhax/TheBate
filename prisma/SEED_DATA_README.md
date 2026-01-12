# YAML Seed Data Configuration

This file (`prisma/seed-data.yml`) defines the baseline seed data for TheBate application.

## Overview

The YAML-based seeding approach provides a declarative, version-controlled way to manage seed data. This is the recommended method for initializing the database.

## Structure

### Admin Users

Administrative accounts with elevated privileges:

```yaml
admin_users:
  - username: admin
    email: admin@thebate.com
    name: Admin User
    password: password123 # Will be hashed with bcrypt
    role: ADMIN
    preferred_language: pt
    preferred_content_languages: [pt, en, es, fr, de]
```

**Fields:**

- `username` (required): Unique username
- `email` (required): Unique email address
- `name` (required): Display name
- `password` (required): Plain text password (will be hashed)
- `role` (optional): USER, MOD, or ADMIN (default: USER)
- `preferred_language` (required): ISO 639-1 language code for UI
- `preferred_content_languages` (required): Array of language codes for content filtering

### Sample Users

Regular user accounts for testing and demonstration:

```yaml
sample_users:
  - username: maria_silva
    email: maria@example.com
    name: Maria Silva
    password: password123
    preferred_language: pt
    preferred_content_languages: [pt, en]
```

Same fields as admin users, but `role` defaults to USER.

### Sample Topics

Discussion topics to demonstrate the platform:

```yaml
sample_topics:
  - language: pt
    title: A inteligência artificial vai substituir programadores?
    description: |
      Multi-line description goes here.
      You can use YAML's pipe (|) syntax for multi-line text.
    tags: [tecnologia, ia, programação, futuro]
    created_by: admin # Username from admin_users or sample_users
    type: YES_NO # YES_NO or MULTI_CHOICE
```

**Fields:**

- `language` (required): ISO 639-1 language code
- `title` (required): Topic title
- `description` (required): Topic description (can be multi-line)
- `tags` (required): Array of tag strings
- `created_by` (required): Username of the creator (must exist in admin_users or sample_users)
- `type` (optional): YES_NO or MULTI_CHOICE (default: YES_NO)

## Usage

### Run the Seed

**Via pnpm:**

```bash
pnpm run db:seed-yaml
```

**Via GitHub Actions:**

1. Go to Actions > Database Update & Seed
2. Select `yaml` as seed type
3. Click Run workflow

### Idempotent Behavior

The seed script is idempotent, meaning it can be run multiple times safely:

- **Existing users** (by email or username) are skipped
- **Existing topics** (by slug) are skipped
- **New entries** are created

This allows you to:

- Add new users or topics by editing the YAML
- Re-run without duplicating existing data
- Safely recover from partial failures

### Customization

To add your own seed data:

1. Edit `prisma/seed-data.yml`
2. Add users to `admin_users` or `sample_users`
3. Add topics to `sample_topics`
4. Run `pnpm run db:seed-yaml`

**Example - Adding a new user:**

```yaml
sample_users:
  # ... existing users ...
  - username: new_user
    email: new@example.com
    name: New User
    password: password123
    preferred_language: en
    preferred_content_languages: [en, pt]
```

**Example - Adding a new topic:**

```yaml
sample_topics:
  # ... existing topics ...
  - language: en
    title: Should we adopt a 4-day work week?
    description: |
      Discussion about the benefits and challenges of a 4-day work week.
    tags: [work, productivity, work-life-balance]
    created_by: admin
    type: YES_NO
```

## YAML Syntax Notes

- **Strings**: Can be unquoted unless they contain special characters
- **Multi-line strings**: Use `|` for literal blocks (preserves newlines)
- **Arrays**: Use `[item1, item2]` or list format with `-`
- **Comments**: Start with `#`
- **Indentation**: Use 2 spaces (not tabs)

## Password Security

Passwords in this file are plain text but will be:

- Hashed with bcrypt (12 rounds) before storing in database
- Only used during initial seeding
- Can be changed after first login via the application

**Production note:** Change default passwords immediately after seeding production database.

## Language Support

Supported languages in this application:

- `pt` - Portuguese (European)
- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German

Each user should have:

- `preferred_language`: Their UI language
- `preferred_content_languages`: Languages they want to see in content (topics, comments)

## Best Practices

1. **Version control**: Keep this file in git to track changes
2. **Staging first**: Test seed changes in staging before production
3. **Minimal seed**: Only include essential data for initial setup
4. **Clear names**: Use descriptive usernames and meaningful topic titles
5. **Multiple languages**: Include topics in various languages to demonstrate multi-language support
6. **Change passwords**: Update passwords after seeding production

## Migration Integration

The GitHub Actions workflow **"Database Update & Seed"** combines migration and seeding:

1. Checks migration status
2. Runs migrations if needed (with retry logic)
3. Applies YAML seed data
4. Reports success or detailed errors

This ensures your database is always up-to-date with both schema and data.

## Troubleshooting

### Error: "Creator user not found"

The `created_by` field must match a username from `admin_users` or `sample_users` that was successfully created.

**Solution:**

- Check that the username exists in the YAML file
- Ensure the user was created successfully (check console output)
- Fix typos in the `created_by` field

### Error: "User already exists"

This is expected behavior when re-running the seed. The script skips existing users.

**No action needed** unless you're trying to update an existing user (which requires manual database update).

### Error: "Topic already exists"

This is expected behavior when re-running the seed. The script skips existing topics by slug.

**No action needed** unless you're trying to update an existing topic (which requires manual database update).

## Related Documentation

- [SEED_QUICKSTART.md](../SEED_QUICKSTART.md) - Quick start guide
- [PRODUCTION_DB_MIGRATION.md](../PRODUCTION_DB_MIGRATION.md) - Database migration guide
- [scripts/SEED_README.md](../scripts/SEED_README.md) - Engagement seed documentation
