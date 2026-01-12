import { prisma } from "../lib/prisma";
import { generateSlug } from "../lib/slug";

async function main() {
  // Find or create a user to author the topic
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: "admin@thebate.com" },
        { role: "ADMIN" }
      ]
    },
    orderBy: { createdAt: "desc" },
  });

  if (!user) {
    // If no admin exists, use the first available user
    user = await prisma.user.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }

  if (!user) {
    throw new Error("No user found! Create a user first.");
  }

  console.log(`\n🎯 Creating ICE Renee Good debate topic`);
  console.log(`   Author: ${user.username || user.email} (${user.id})\n`);

  const slug = "us-protests-ice-killing-renee-good";

  // Check if topic already exists
  const existingTopic = await prisma.topic.findUnique({
    where: { slug },
  });

  if (existingTopic) {
    console.log(`⚠️  Topic with slug "${slug}" already exists. Deleting it first...`);
    await prisma.topic.delete({
      where: { id: existingTopic.id },
    });
  }

  // Create the multi-choice topic
  const topic = await prisma.topic.create({
    data: {
      slug,
      title: "US protests condemn ICE killing of Renee Good — justified action or abuse of power?",
      description: `The killing of Renee Good by an ICE agent has sparked nationwide protests across the United States.

Supporters of the government argue the agent acted in self-defense during a federal operation.

Critics claim this case represents an abuse of power and a dangerous lack of accountability.

What is your position?`,
      type: "MULTI_CHOICE",
      allowMultipleVotes: false, // Single vote only
      maxChoices: 1,
      language: "en",
      tags: ["Politics", "Society", "Human Rights", "United States", "ICE", "Accountability"],
      status: "ACTIVE",
      createdById: user.id,
      options: {
        create: [
          {
            label: "Yes — the agent acted in self-defense and followed protocol",
            description: "The agent followed proper procedures during a lawful federal operation",
            order: 1,
          },
          {
            label: "No — the use of lethal force was unjustified and excessive",
            description: "The situation did not warrant deadly force",
            order: 2,
          },
          {
            label: "Unclear — we need the results of an independent investigation",
            description: "More information is needed before making a judgment",
            order: 3,
          },
          {
            label: "This reflects a deeper systemic problem with ICE and federal power",
            description: "The issue extends beyond this single incident",
            order: 4,
          },
        ],
      },
    },
    include: {
      options: true,
    },
  });

  console.log(`✅ Topic created: ${topic.title}`);
  console.log(`   ID: ${topic.id}`);
  console.log(`   Slug: ${topic.slug}`);
  console.log(`   Options: ${topic.options.length}`);

  // Create diverse, realistic users for comments
  const commentUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: "sarah.martinez@example.com" },
      update: {},
      create: {
        email: "sarah.martinez@example.com",
        username: "sarah_martinez",
        name: "Sarah Martinez",
        isSeed: true,
        preferredLanguage: "en",
        preferredContentLanguages: ["en"],
      },
    }),
    prisma.user.upsert({
      where: { email: "james.thompson@example.com" },
      update: {},
      create: {
        email: "james.thompson@example.com",
        username: "james_thompson",
        name: "James Thompson",
        isSeed: true,
        preferredLanguage: "en",
        preferredContentLanguages: ["en"],
      },
    }),
    prisma.user.upsert({
      where: { email: "maria.garcia@example.com" },
      update: {},
      create: {
        email: "maria.garcia@example.com",
        username: "maria_garcia",
        name: "Maria Garcia",
        isSeed: true,
        preferredLanguage: "en",
        preferredContentLanguages: ["en"],
      },
    }),
    prisma.user.upsert({
      where: { email: "david.chen@example.com" },
      update: {},
      create: {
        email: "david.chen@example.com",
        username: "david_chen",
        name: "David Chen",
        isSeed: true,
        preferredLanguage: "en",
        preferredContentLanguages: ["en"],
      },
    }),
    prisma.user.upsert({
      where: { email: "emily.johnson@example.com" },
      update: {},
      create: {
        email: "emily.johnson@example.com",
        username: "emily_johnson",
        name: "Emily Johnson",
        isSeed: true,
        preferredLanguage: "en",
        preferredContentLanguages: ["en"],
      },
    }),
    prisma.user.upsert({
      where: { email: "robert.williams@example.com" },
      update: {},
      create: {
        email: "robert.williams@example.com",
        username: "robert_williams",
        name: "Robert Williams",
        isSeed: true,
        preferredLanguage: "en",
        preferredContentLanguages: ["en"],
      },
    }),
    prisma.user.upsert({
      where: { email: "lisa.patel@example.com" },
      update: {},
      create: {
        email: "lisa.patel@example.com",
        username: "lisa_patel",
        name: "Lisa Patel",
        isSeed: true,
        preferredLanguage: "en",
        preferredContentLanguages: ["en"],
      },
    }),
    prisma.user.upsert({
      where: { email: "michael.brown@example.com" },
      update: {},
      create: {
        email: "michael.brown@example.com",
        username: "michael_brown",
        name: "Michael Brown",
        isSeed: true,
        preferredLanguage: "en",
        preferredContentLanguages: ["en"],
      },
    }),
  ]);

  console.log(`\n✅ Created ${commentUsers.length} comment users\n`);

  // Get the options
  const [optionA, optionB, optionC, optionD] = topic.options;

  // Create realistic, thoughtful comments for each option
  const comments = [
    // Option A comments (Justified/self-defense)
    {
      content: `We need to wait for the full investigation report before making judgments. Federal agents operate under strict rules of engagement, and if the agent felt their life was in danger, protocol allows for defensive action. The media often rushes to conclusions before all facts are available.`,
      userId: commentUsers[0].id,
      topicId: topic.id,
      optionId: optionA.id,
    },
    {
      content: `Having worked in law enforcement for 15 years, I can tell you that split-second decisions in the field are incredibly difficult. Agents are trained to assess threats and respond accordingly. Without being there, it's hard to second-guess someone's judgment when they believe their safety is at risk.`,
      userId: commentUsers[1].id,
      topicId: topic.id,
      optionId: optionA.id,
    },

    // Option B comments (Unjustified/excessive)
    {
      content: `The video footage shows that Ms. Good was unarmed and not posing an immediate lethal threat. There's a fundamental difference between feeling uncomfortable and facing a life-threatening situation. Law enforcement officers receive training in de-escalation techniques for exactly these scenarios.`,
      userId: commentUsers[2].id,
      topicId: topic.id,
      optionId: optionB.id,
    },
    {
      content: `This is another example of excessive force being used when other options were available. Tasers, pepper spray, backup—all of these exist specifically to prevent lethal outcomes. The threshold for using deadly force should be extremely high, and from what we know, that threshold was not met here.`,
      userId: commentUsers[3].id,
      topicId: topic.id,
      optionId: optionB.id,
    },
    {
      content: `The family deserves answers. Renee Good was a mother, a community member, and a human being. The fact that she's being portrayed as a threat when witness accounts say otherwise is deeply troubling. Federal agents must be held to the same accountability standards as everyone else.`,
      userId: commentUsers[4].id,
      topicId: topic.id,
      optionId: optionB.id,
    },

    // Option C comments (Need investigation)
    {
      content: `I think it's premature to take a strong position either way. We have conflicting witness statements, incomplete video evidence, and a lot of political pressure from both sides. An independent investigation should examine the agent's training record, the specific circumstances, and whether proper procedures were followed.`,
      userId: commentUsers[5].id,
      topicId: topic.id,
      optionId: optionC.id,
    },
    {
      content: `The problem with these cases is that everyone forms an opinion based on partial information. We need forensic analysis, expert testimony, and a thorough review of the bodycam footage if it exists. Only then can we make an informed judgment about whether the use of force was justified.`,
      userId: commentUsers[6].id,
      topicId: topic.id,
      optionId: optionC.id,
    },

    // Option D comments (Systemic problem)
    {
      content: `This isn't about one agent or one incident. ICE has a documented history of operating with minimal oversight. The agency has been criticized repeatedly by civil rights organizations for using excessive force, conducting raids without proper warrants, and lacking transparency. We need systemic reform, not just individual accountability.`,
      userId: commentUsers[7].id,
      topicId: topic.id,
      optionId: optionD.id,
    },
    {
      content: `The broader issue here is the militarization of immigration enforcement. ICE operates with weapons, tactical gear, and powers that blur the line between civilian law enforcement and military operations. This creates an environment where tragic outcomes become more likely. We need to fundamentally rethink how immigration enforcement works in this country.`,
      userId: commentUsers[0].id,
      topicId: topic.id,
      optionId: optionD.id,
    },
    {
      content: `What worries me most is the lack of accountability mechanisms. When police officers are involved in shootings, there's usually a clear protocol for investigation. But ICE operates under different rules, often with less transparency. This case highlights the need for independent oversight of federal immigration agencies.`,
      userId: commentUsers[1].id,
      topicId: topic.id,
      optionId: optionD.id,
    },

    // Additional nuanced comments
    {
      content: `I'm torn on this. On one hand, I believe officers deserve the benefit of the doubt when making split-second decisions. On the other hand, the video I've seen doesn't show an obvious threat. I hope the investigation is truly independent and not conducted by ICE itself, as that would be a conflict of interest.`,
      userId: commentUsers[2].id,
      topicId: topic.id,
      optionId: optionC.id,
    },
    {
      content: `People saying "just comply and nothing will happen" are ignoring the reality that compliance doesn't always prevent tragedy. There are documented cases of unarmed, compliant individuals being shot by law enforcement. The standard should be objective threat assessment, not subjective fear.`,
      userId: commentUsers[3].id,
      topicId: topic.id,
      optionId: optionB.id,
    },
    {
      content: `I think both things can be true: the agent may have felt threatened AND used excessive force. Fear doesn't automatically justify lethal action. That's why training exists—to help officers respond appropriately to threats. If the training is inadequate, that's a systemic problem that needs addressing.`,
      userId: commentUsers[4].id,
      topicId: topic.id,
      optionId: optionD.id,
    },
    {
      content: `What's missing from this conversation is the legal context. Federal agents have qualified immunity, which makes it extremely difficult to hold them accountable even when wrongdoing is proven. Until we reform qualified immunity laws, we'll keep seeing these cases with no real consequences.`,
      userId: commentUsers[5].id,
      topicId: topic.id,
      optionId: optionD.id,
    },
    {
      content: `The protests are understandable given the history of similar cases. But I also think we should let the investigation proceed before concluding the agent acted criminally. If evidence shows misconduct, then yes, there should be prosecution. If not, we should accept that outcome too. Justice requires patience.`,
      userId: commentUsers[6].id,
      topicId: topic.id,
      optionId: optionC.id,
    },
  ];

  console.log(`📝 Creating ${comments.length} realistic comments...\n`);

  for (const comment of comments) {
    const created = await prisma.comment.create({
      data: {
        ...comment,
        isSeed: true,
        status: "ACTIVE",
      },
    });
    console.log(`   ✅ Comment by ${commentUsers.find(u => u.id === comment.userId)?.username}`);
  }

  console.log(`\n✅ Successfully created debate topic with ${comments.length} comments`);
  console.log(`\n🌐 View at: /t/${slug}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
