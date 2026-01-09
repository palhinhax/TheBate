import { prisma } from "../lib/prisma";
import { SUPPORTED_LANGUAGES } from "../lib/language-shared";

async function testLanguageFilter() {
  console.log("🧪 Testing language filter behavior\n");

  // Test 1: All languages (default)
  const allLangs = [...SUPPORTED_LANGUAGES];
  console.log("📝 Test 1: Filter with all languages:", allLangs);
  const allTopics = await prisma.topic.findMany({
    where: {
      status: "ACTIVE",
      language: { in: allLangs },
    },
    take: 5,
    select: { id: true, title: true, language: true },
  });
  console.log(`  ✅ Found ${allTopics.length} topics`);

  // Test 2: Single language (pt)
  console.log('\n📝 Test 2: Filter with ["pt"]');
  const ptTopics = await prisma.topic.findMany({
    where: {
      status: "ACTIVE",
      language: { in: ["pt"] },
    },
    take: 5,
    select: { id: true, title: true, language: true },
  });
  console.log(`  ✅ Found ${ptTopics.length} topics`);
  ptTopics.forEach((t) => console.log(`    - [${t.language}] ${t.title}`));

  // Test 3: Empty array (this might be the issue!)
  console.log('\n📝 Test 3: Filter with empty array []');
  const emptyTopics = await prisma.topic.findMany({
    where: {
      status: "ACTIVE",
      language: { in: [] },
    },
    take: 5,
    select: { id: true, title: true, language: true },
  });
  console.log(`  ⚠️  Found ${emptyTopics.length} topics (should be 0)`);

  // Test 4: No language filter
  console.log("\n📝 Test 4: No language filter at all");
  const noFilterTopics = await prisma.topic.findMany({
    where: {
      status: "ACTIVE",
    },
    take: 5,
    select: { id: true, title: true, language: true },
  });
  console.log(`  ✅ Found ${noFilterTopics.length} topics`);

  await prisma.$disconnect();
}

testLanguageFilter();
