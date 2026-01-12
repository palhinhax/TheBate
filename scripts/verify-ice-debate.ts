import { prisma } from "../lib/prisma";

async function verify() {
  const topic = await prisma.topic.findUnique({
    where: { slug: "us-protests-ice-killing-renee-good" },
    include: {
      options: true,
      comments: {
        include: {
          user: true,
          option: true,
        },
      },
      createdBy: true,
    },
  });

  if (!topic) {
    console.log("❌ Topic not found!");
    return;
  }

  console.log("\n✅ Topic found!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📊 Title: ${topic.title}`);
  console.log(`🔗 Slug: ${topic.slug}`);
  console.log(`🌍 Language: ${topic.language}`);
  console.log(`📝 Type: ${topic.type}`);
  console.log(`🎯 Options: ${topic.options.length}`);
  console.log(`💬 Comments: ${topic.comments.length}`);
  console.log(`👤 Created by: ${topic.createdBy.username || topic.createdBy.email}`);

  console.log("\n📋 Voting Options:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  topic.options
    .sort((a, b) => a.order - b.order)
    .forEach((opt, index) => {
      const commentCount = topic.comments.filter((c) => c.optionId === opt.id).length;
      console.log(`\n${String.fromCharCode(65 + index)}. ${opt.label}`);
      console.log(`   Comments: ${commentCount}`);
    });

  console.log("\n💬 Comment Distribution:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  topic.options
    .sort((a, b) => a.order - b.order)
    .forEach((opt, index) => {
      const comments = topic.comments.filter((c) => c.optionId === opt.id);
      console.log(`\nOption ${String.fromCharCode(65 + index)}: ${comments.length} comments`);
      comments.forEach((c) => {
        const preview = c.content.substring(0, 80).replace(/\n/g, " ");
        console.log(`  • ${c.user.username}: "${preview}..."`);
      });
    });

  console.log("\n✅ Verification complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

verify()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
