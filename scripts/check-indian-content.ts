import { prisma } from "../lib/prisma";

async function checkIndianContent() {
  console.log("📊 Checking Indian language content...\n");

  // Check Hindi topics
  const hindiTopics = await prisma.topic.count({
    where: {
      language: "hi",
      status: "ACTIVE",
    },
  });

  // Check Bengali topics
  const bengaliTopics = await prisma.topic.count({
    where: {
      language: "bn",
      status: "ACTIVE",
    },
  });

  // Check all topics
  const allTopics = await prisma.topic.count({
    where: { status: "ACTIVE" },
  });

  // Get sample Hindi topics
  const sampleHindi = await prisma.topic.findMany({
    where: {
      language: "hi",
      status: "ACTIVE",
    },
    select: {
      title: true,
      slug: true,
      createdAt: true,
    },
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  console.log(`Total active topics: ${allTopics}`);
  console.log(`🇮🇳 Hindi topics: ${hindiTopics} (${((hindiTopics / allTopics) * 100).toFixed(1)}%)`);
  console.log(
    `🇧🇩 Bengali topics: ${bengaliTopics} (${((bengaliTopics / allTopics) * 100).toFixed(1)}%)`
  );
  console.log(`\nSample Hindi topics:`);
  sampleHindi.forEach((t) => {
    console.log(`  - ${t.title}`);
    console.log(`    https://thebatee.com/t/${t.slug}`);
  });
}

checkIndianContent()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
