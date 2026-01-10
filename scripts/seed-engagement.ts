/**
 * One-off seed script for populating engagement data
 * - Multi-language users
 * - Comments and replies
 * - Votes with realistic distribution
 * 
 * Run with: npm run seed:engagement
 */

import { PrismaClient, CommentSide } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  generateUsersForLocale,
  getRandomComment,
  randomDateInRange,
  adjustForActivityPattern,
  getLongTailVoteCount,
} from "./seed-data-generators";

const prisma = new PrismaClient();

const LOCALES = ["en", "pt", "es", "fr", "de", "it"];
const USERS_PER_LOCALE = 10; // 10 users per language = 60 total
const COMMENTS_PER_TOPIC_MIN = 8;
const COMMENTS_PER_TOPIC_MAX = 20;
const REPLY_PROBABILITY = 0.4; // 40% chance a comment gets replies
const MAX_REPLIES_PER_COMMENT = 3;
const ONE_HOUR_MS = 60 * 60 * 1000; // 1 hour in milliseconds

// Check if seed has already been run
async function checkIfSeeded(): Promise<boolean> {
  const seedUsers = await prisma.user.count({
    where: { isSeed: true },
  });
  return seedUsers > 0;
}

// Create a marker to track seed execution
async function createSeedMarker(): Promise<void> {
  // We use the presence of seed users as the marker
  console.log("✅ Seed marker created (seed users exist)");
}

async function main() {
  console.log("🌱 Starting engagement seed script...\n");

  // Check if already seeded
  const alreadySeeded = await checkIfSeeded();
  if (alreadySeeded) {
    console.log("⚠️  Seed data already exists!");
    console.log("   Run 'npm run seed:cleanup' first if you want to re-seed.");
    process.exit(0);
  }

  console.log("📊 Configuration:");
  console.log(`   - Locales: ${LOCALES.join(", ")}`);
  console.log(`   - Users per locale: ${USERS_PER_LOCALE}`);
  console.log(`   - Total users: ${LOCALES.length * USERS_PER_LOCALE}`);
  console.log("");

  // Step 1: Create seed users
  console.log("👥 Creating seed users...");
  const passwordHash = await bcrypt.hash("seed123password", 12);
  const allUsers: Array<{ id: string; locale: string; username: string }> = [];

  for (const locale of LOCALES) {
    const localeUsers = generateUsersForLocale(locale, USERS_PER_LOCALE);
    
    for (const userData of localeUsers) {
      // Generate random creation date (30-180 days ago)
      const createdAt = adjustForActivityPattern(randomDateInRange(180, 30));
      
      try {
        const user = await prisma.user.create({
          data: {
            name: userData.name,
            username: userData.username,
            email: userData.email,
            passwordHash,
            preferredLanguage: userData.locale,
            preferredContentLanguages: [userData.locale, "en"], // Native + English
            isSeed: true,
            createdAt,
          },
        });
        
        allUsers.push({
          id: user.id,
          locale: userData.locale,
          username: user.username,
        });
      } catch (error) {
        console.error(`   ⚠️  Failed to create user ${userData.username}:`, error);
      }
    }
    
    console.log(`   ✅ Created ${localeUsers.length} users for locale: ${locale}`);
  }

  console.log(`\n✅ Created ${allUsers.length} seed users\n`);

  // Step 2: Get all topics
  console.log("📝 Fetching topics...");
  const topics = await prisma.topic.findMany({
    select: {
      id: true,
      language: true,
      title: true,
      createdAt: true,
    },
  });
  console.log(`   Found ${topics.length} topics\n`);

  if (topics.length === 0) {
    console.log("⚠️  No topics found. Please create topics first.");
    process.exit(0);
  }

  // Step 3: Create comments and replies
  console.log("💬 Creating comments and replies...");
  let totalComments = 0;
  let totalReplies = 0;
  const allComments: Array<{
    id: string;
    topicId: string;
    userId: string;
    createdAt: Date;
    side: CommentSide | null;
  }> = [];

  for (const topic of topics) {
    // Get users who speak this language
    const topicUsers = allUsers.filter(
      (u) => u.locale === topic.language || u.locale === "en"
    );

    if (topicUsers.length === 0) {
      console.log(`   ⚠️  No users for language ${topic.language}, skipping topic`);
      continue;
    }

    // Random number of comments for this topic
    const numComments =
      COMMENTS_PER_TOPIC_MIN +
      Math.floor(Math.random() * (COMMENTS_PER_TOPIC_MAX - COMMENTS_PER_TOPIC_MIN));

    // Opinion distribution: 40% pro, 40% contra, 20% neutral
    const opinions: Array<"pro" | "contra" | "neutral"> = [];
    for (let i = 0; i < numComments; i++) {
      const rand = Math.random();
      if (rand < 0.4) opinions.push("pro");
      else if (rand < 0.8) opinions.push("contra");
      else opinions.push("neutral");
    }

    // Shuffle opinions
    opinions.sort(() => Math.random() - 0.5);

    // Create top-level comments
    for (let i = 0; i < numComments; i++) {
      const randomUser = topicUsers[Math.floor(Math.random() * topicUsers.length)];
      const opinion = opinions[i];
      
      // Map opinion to side (only for top-level comments)
      let side: CommentSide | null = null;
      if (opinion === "pro") side = "AFAVOR";
      else if (opinion === "contra") side = "CONTRA";
      // neutral stays null

      // Comment content
      const content = getRandomComment(topic.language, opinion);

      // Random date between topic creation and now (1-60 days ago)
      const commentDate = adjustForActivityPattern(
        randomDateInRange(60, 0)
      );

      // Make sure comment is after topic creation
      const finalCommentDate =
        commentDate > topic.createdAt ? commentDate : new Date(topic.createdAt.getTime() + ONE_HOUR_MS);

      try {
        const comment = await prisma.comment.create({
          data: {
            content,
            side,
            topicId: topic.id,
            userId: randomUser.id,
            isSeed: true,
            createdAt: finalCommentDate,
          },
        });

        allComments.push({
          id: comment.id,
          topicId: topic.id,
          userId: randomUser.id,
          createdAt: comment.createdAt,
          side: comment.side,
        });
        totalComments++;
      } catch (error) {
        console.error(`   ⚠️  Failed to create comment:`, error);
      }
    }
  }

  console.log(`   ✅ Created ${totalComments} top-level comments\n`);

  // Step 4: Create replies (max depth 2)
  console.log("💬 Creating replies...");
  
  for (const comment of allComments) {
    // Skip some comments (reply probability)
    if (Math.random() > REPLY_PROBABILITY) continue;

    // Get users who speak this topic's language
    const topic = topics.find((t) => t.id === comment.topicId);
    if (!topic) continue;

    const topicUsers = allUsers.filter(
      (u) => u.locale === topic.language || u.locale === "en"
    );

    // Random number of replies (1-3)
    const numReplies = Math.floor(Math.random() * MAX_REPLIES_PER_COMMENT) + 1;

    for (let i = 0; i < numReplies; i++) {
      // Pick different user than parent comment author
      const availableUsers = topicUsers.filter((u) => u.id !== comment.userId);
      if (availableUsers.length === 0) continue;

      const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];

      // Random opinion for reply
      const rand = Math.random();
      const opinion: "pro" | "contra" | "neutral" =
        rand < 0.4 ? "pro" : rand < 0.8 ? "contra" : "neutral";

      const content = getRandomComment(topic.language, opinion);

      // Reply date must be after parent comment
      const minDate = new Date(comment.createdAt.getTime() + 60000); // At least 1 minute after
      const maxDate = new Date();
      const replyDate = adjustForActivityPattern(
        new Date(
          minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime())
        )
      );

      try {
        await prisma.comment.create({
          data: {
            content,
            side: null, // Replies don't have side
            topicId: topic.id,
            userId: randomUser.id,
            parentId: comment.id,
            isSeed: true,
            createdAt: replyDate,
          },
        });
        totalReplies++;
      } catch (error) {
        console.error(`   ⚠️  Failed to create reply:`, error);
      }
    }
  }

  console.log(`   ✅ Created ${totalReplies} replies\n`);

  // Step 5: Create votes (long-tail distribution)
  console.log("👍 Creating votes...");
  
  // Get all comments (including replies)
  const allCommentsWithReplies = await prisma.comment.findMany({
    where: { isSeed: true },
    select: {
      id: true,
      createdAt: true,
      side: true,
    },
  });

  let totalVotes = 0;

  for (const comment of allCommentsWithReplies) {
    const voteCount = getLongTailVoteCount(50);
    
    if (voteCount === 0) continue;

    // Get random voters
    const shuffledUsers = [...allUsers].sort(() => Math.random() - 0.5);
    const voters = shuffledUsers.slice(0, Math.min(voteCount, allUsers.length));

    for (const voter of voters) {
      // Vote date between comment creation and now
      const voteDate = adjustForActivityPattern(
        new Date(
          comment.createdAt.getTime() +
            Math.random() * (Date.now() - comment.createdAt.getTime())
        )
      );

      try {
        await prisma.vote.create({
          data: {
            value: 1, // Always +1 (good argument vote)
            commentId: comment.id,
            userId: voter.id,
            isSeed: true,
            createdAt: voteDate,
          },
        });
        totalVotes++;
      } catch (error: unknown) {
        // Ignore duplicate vote errors (unique constraint on userId + commentId)
        // This can happen if the same user is selected twice randomly
        if (error instanceof Error && !error.message.includes("unique constraint")) {
          console.error(`   ⚠️  Unexpected error creating vote:`, error.message);
        }
      }
    }
  }

  console.log(`   ✅ Created ${totalVotes} votes\n`);

  // Create marker
  await createSeedMarker();

  // Final summary
  console.log("🎉 Seed completed successfully!\n");
  console.log("📊 Summary:");
  console.log(`   👥 Users: ${allUsers.length}`);
  console.log(`   💬 Comments: ${totalComments}`);
  console.log(`   💬 Replies: ${totalReplies}`);
  console.log(`   👍 Votes: ${totalVotes}`);
  console.log("");
  console.log("🧹 To remove seed data later, run: npm run seed:cleanup");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("\n❌ Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
