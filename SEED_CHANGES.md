# Seed Changes

## Version 2.17.0+

The default Prisma seed has been changed from the manual JavaScript seed (`prisma/seed.ts`) to the new YAML-based seed (`prisma/seed-from-yaml.ts`).

### What Changed

**Before:**

- Manual seed script with hardcoded data
- Required code changes to modify seed data
- Ran via: `pnpm prisma db seed` or `pnpm run db:seed`

**After:**

- YAML-based configuration in `prisma/seed-data.yml`
- Edit YAML file to change seed data (no code changes needed)
- Idempotent (safe to run multiple times)
- Sample users marked for cleanup (`isSeed: true`)
- Admin users permanent (`isSeed: false`)
- Runs via: `pnpm prisma db seed` or `pnpm run db:seed-yaml`

### Migration Guide

If you need the old seed behavior:

1. The old seed script still exists at `prisma/seed.ts`
2. Run it manually: `pnpm run db:seed` (uses the old script)
3. Or modify `package.json` prisma.seed field to point back to `seed.ts`

### Benefits of YAML-Based Seed

1. **Version Control**: Seed data tracked in git
2. **Easy Updates**: Edit YAML file instead of code
3. **Idempotent**: Safe to run multiple times
4. **Cleanup Support**: Sample data can be removed with `pnpm run seed:cleanup`
5. **Documentation**: YAML structure is self-documenting

### Important Security Note

⚠️ **Default passwords in `seed-data.yml` are for development only!**

After seeding production:

1. Change all default passwords immediately
2. Consider using environment variables for production credentials
3. Review and customize user accounts as needed

### Related Documentation

- [SEED_QUICKSTART.md](./SEED_QUICKSTART.md) - Quick start guide
- [prisma/SEED_DATA_README.md](./prisma/SEED_DATA_README.md) - YAML structure
- [PRODUCTION_DB_MIGRATION.md](./PRODUCTION_DB_MIGRATION.md) - Migration guide
