import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Creating Trump Greenland debate...");

  // Find admin/owner user to create the debate
  const admin = await prisma.user.findFirst({
    where: {
      OR: [{ role: "ADMIN" }, { isOwner: true }],
    },
  });

  if (!admin) {
    console.error("No admin or owner user found. Please create an admin user first.");
    process.exit(1);
  }

  console.log(`Creating debate as user: ${admin.username || admin.email}`);

  const topic = await prisma.topic.create({
    data: {
      title:
        'Trump says US will have Greenland "one way or the other" — how should Denmark, Greenland, and NATO respond?',
      slug: "trump-greenland-one-way-or-another-nato-response",
      description: `Donald Trump has renewed calls for the US to take control of Greenland, claiming it is strategically necessary in the Arctic.
Denmark and Greenland reject the idea, and European leaders warn that any attempt to take Greenland by force could trigger a major crisis for NATO and Europe's security architecture.

What should happen next?`,
      type: "MULTI_CHOICE",
      language: "en",
      tags: ["World", "Geopolitics", "NATO", "Greenland", "Denmark", "United States", "Europe"],
      status: "ACTIVE",
      allowMultipleVotes: false,
      maxChoices: 1,
      createdById: admin.id,
      options: {
        create: [
          {
            label: "Diplomacy first",
            description:
              "Keep talks open, avoid escalation, and strengthen Arctic cooperation inside NATO",
            order: 0,
          },
          {
            label: "Firm rejection",
            description:
              "Denmark/Greenland should refuse clearly and treat this as a sovereignty red line",
            order: 1,
          },
          {
            label: "Europe must deter",
            description:
              "Prepare sanctions and a united EU/NATO response if coercion or force is threatened",
            order: 2,
          },
          {
            label: "Let Greenland decide",
            description:
              "Fast-track a self-determination path (independence or closer EU ties) to reduce vulnerability",
            order: 3,
          },
        ],
      },
    },
    include: {
      options: true,
    },
  });

  console.log("\n✅ Debate created successfully!");
  console.log(`Title: ${topic.title}`);
  console.log(`Slug: ${topic.slug}`);
  console.log(`URL: https://thebatee.com/t/${topic.slug}`);
  console.log(`\nOptions created: ${topic.options.length}`);
  topic.options.forEach((option, index) => {
    console.log(`  ${String.fromCharCode(65 + index)}. ${option.label} — ${option.description}`);
  });
}

main()
  .catch((error) => {
    console.error("Error creating debate:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
