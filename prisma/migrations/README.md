# Database Migrations

This directory contains all Prisma migrations for TheBate.

## Migration History

Migrations are applied in chronological order based on their timestamp prefix.

### Migration List

1. `20260108094102_init` - Initial database schema
2. `20260108112142_add_language_to_topics` - Add language field to topics
3. `20260108125538_remove_comment_score` - Remove score field from comments
4. `20260108140000_add_score_to_comment` - Add score field back to comments
5. `20260108170645_add_is_owner_field` - Add isOwner field to users
6. `20260108195051_add_password_reset_token` - Add password reset functionality
7. `20260109103101_add_email_verification` - Add email verification functionality
8. `20260109120140_add_preferred_language_and_report_count` - Add user language preferences and report count
9. `20260109145337_add_preferred_content_languages` - Add preferred content languages for users
10. `20260109181945_add_comment_report_count` - Add report count to comments
11. `20260110200738_add_is_seed_fields` - Add isSeed fields for seed data tracking
12. `20260111000000_add_multi_choice_topics` - Add multi-choice topic support with TopicType enum, TopicOption table, and related fields

## Applying Migrations

### Development
```bash
pnpm run db:migrate
```

### Production
```bash
npx prisma migrate deploy
```

Or use the GitHub Actions workflow: **Database Update & Seed**

## Notes

- All migrations are tracked in the `_prisma_migrations` table
- Never modify existing migration files after they've been applied
- Always create new migrations for schema changes
- The `MANUAL_add_multi_choice_topics.sql` file was converted to migration `20260111000000_add_multi_choice_topics`

## See Also

- [Production Database Migration Guide](../../PRODUCTION_DB_MIGRATION.md)
- [Multi-Choice Feature Documentation](../../MULTI_CHOICE_FEATURE.md)
