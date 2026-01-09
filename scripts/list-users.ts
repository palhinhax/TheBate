import { prisma } from "../lib/prisma";

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      _count: {
        select: {
          topics: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log(`\n📊 Total users: ${users.length}\n`);

  users.forEach((user) => {
    console.log(`👤 ${user.username} (${user.email})`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Topics: ${user._count.topics} | Comments: ${user._count.comments}`);
    console.log("");
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
