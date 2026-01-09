import { prisma } from "../lib/prisma";

async function checkTopics() {
  const topics = await prisma.topic.findMany({
    take: 10,
    select: {
      id: true,
      title: true,
      language: true,
      status: true,
    },
  });

  console.log("📊 Topics in database:", topics.length);
  topics.forEach((topic) => {
    console.log(
      `- [${topic.language}] ${topic.title} (${topic.status}) - ID: ${topic.id.slice(0, 8)}`
    );
  });

  const activeTopics = await prisma.topic.count({
    where: { status: "ACTIVE" },
  });
  console.log(`\n✅ Active topics: ${activeTopics}`);

  const byLanguage = await prisma.topic.groupBy({
    by: ["language"],
    _count: true,
  });
  console.log("\n📝 Topics by language:");
  byLanguage.forEach((group) => {
    console.log(`  ${group.language}: ${group._count}`);
  });

  await prisma.$disconnect();
}

checkTopics();
