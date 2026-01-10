/**
 * Cleanup script to remove all seed data
 * Run with: npm run seed:cleanup
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Starting seed data cleanup...\n");

  // Check if there's any seed data
  const seedUserCount = await prisma.user.count({
    where: { isSeed: true },
  });

  if (seedUserCount === 0) {
    console.log("ℹ️  No seed data found. Nothing to clean up.");
    process.exit(0);
  }

  console.log(`   Found ${seedUserCount} seed users\n`);

  // Ask for confirmation (in production, you might want to add a CLI prompt)
  console.log("⚠️  This will delete ALL seed data:");
  console.log("   - Seed users");
  console.log("   - Seed comments and replies");
  console.log("   - Seed votes");
  console.log("");

  // Delete in correct order (respecting foreign keys)
  console.log("🗑️  Deleting seed votes...");
  const deletedVotes = await prisma.vote.deleteMany({
    where: { isSeed: true },
  });
  console.log(`   ✅ Deleted ${deletedVotes.count} votes\n`);

  console.log("🗑️  Deleting seed comments...");
  const deletedComments = await prisma.comment.deleteMany({
    where: { isSeed: true },
  });
  console.log(`   ✅ Deleted ${deletedComments.count} comments\n`);

  console.log("🗑️  Deleting seed users...");
  const deletedUsers = await prisma.user.deleteMany({
    where: { isSeed: true },
  });
  console.log(`   ✅ Deleted ${deletedUsers.count} users\n`);

  console.log("🎉 Cleanup completed successfully!\n");
  console.log("📊 Summary:");
  console.log(`   👥 Users deleted: ${deletedUsers.count}`);
  console.log(`   💬 Comments deleted: ${deletedComments.count}`);
  console.log(`   👍 Votes deleted: ${deletedVotes.count}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("\n❌ Error during cleanup:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
