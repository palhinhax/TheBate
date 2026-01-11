/**
 * Script to resolve failed migrations in production database
 * 
 * This script marks a failed migration as rolled back in the _prisma_migrations table,
 * allowing Prisma to attempt the migration again.
 * 
 * Usage:
 *   DATABASE_URL=your_db_url pnpm tsx scripts/resolve-failed-migration.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resolveFailedMigration() {
  try {
    console.log("🔍 Checking for failed migrations...");
    
    // Query the _prisma_migrations table for failed migrations
    const failedMigrations = await prisma.$queryRaw<Array<{
      id: string;
      checksum: string;
      finished_at: Date | null;
      migration_name: string;
      logs: string | null;
      rolled_back_at: Date | null;
      started_at: Date;
      applied_steps_count: number;
    }>>`
      SELECT * FROM "_prisma_migrations"
      WHERE finished_at IS NULL AND rolled_back_at IS NULL
      ORDER BY started_at DESC
    `;

    if (failedMigrations.length === 0) {
      console.log("✅ No failed migrations found");
      return;
    }

    console.log(`\n⚠️  Found ${failedMigrations.length} failed migration(s):\n`);
    failedMigrations.forEach((migration, index) => {
      console.log(`${index + 1}. ${migration.migration_name}`);
      console.log(`   Started at: ${migration.started_at}`);
      console.log(`   Applied steps: ${migration.applied_steps_count}`);
      if (migration.logs) {
        console.log(`   Logs: ${migration.logs.substring(0, 100)}...`);
      }
      console.log();
    });

    console.log("🔄 Marking failed migrations as rolled back...\n");

    for (const migration of failedMigrations) {
      await prisma.$executeRaw`
        UPDATE "_prisma_migrations"
        SET rolled_back_at = NOW(),
            logs = COALESCE(logs, '') || E'\n\nMarked as rolled back by resolve-failed-migration script'
        WHERE id = ${migration.id}
      `;
      console.log(`✅ Marked as rolled back: ${migration.migration_name}`);
    }

    console.log("\n✅ All failed migrations have been marked as rolled back");
    console.log("\n💡 You can now run 'prisma migrate deploy' to retry the migrations");
    
  } catch (error) {
    console.error("❌ Error resolving failed migrations:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

resolveFailedMigration()
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
