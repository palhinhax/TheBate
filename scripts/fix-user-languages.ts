import { prisma } from "../lib/prisma";
import { SUPPORTED_LANGUAGES } from "../lib/language-shared";

async function fixUserLanguages() {
  console.log("🔧 Fixing user language preferences...\n");

  // Find users without preferredContentLanguages set or with empty array
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      preferredContentLanguages: true,
    },
  });

  console.log(`Found ${users.length} users\n`);

  for (const user of users) {
    console.log(`User: ${user.username}`);
    console.log(`  Current: ${JSON.stringify(user.preferredContentLanguages)}`);

    if (
      !user.preferredContentLanguages ||
      user.preferredContentLanguages.length === 0
    ) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          preferredContentLanguages: [...SUPPORTED_LANGUAGES],
        },
      });
      console.log(`  ✅ Updated to: ${JSON.stringify(SUPPORTED_LANGUAGES)}`);
    } else {
      console.log(`  ✓ Already set`);
    }
  }

  console.log("\n✅ Done!");
  await prisma.$disconnect();
}

fixUserLanguages();
