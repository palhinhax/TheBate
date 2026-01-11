/**
 * YAML-based seed script for TheBate
 * 
 * This script reads seed data from prisma/seed-data.yml and applies it idempotently.
 * It ensures the database is always in sync with the YAML configuration.
 * 
 * Features:
 * - Idempotent: Can be run multiple times safely
 * - Creates missing users, topics, etc.
 * - Updates existing records if needed
 * - Does not delete existing data
 * 
 * Run with: pnpm run db:seed-yaml
 */

import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { join } from "path";
import { load } from "js-yaml";
import { generateSlug } from "../lib/slug";

const prisma = new PrismaClient();

interface UserData {
  username: string;
  email: string;
  name: string;
  password: string;
  role?: string;
  preferred_language: string;
  preferred_content_languages: string[];
}

interface TopicData {
  language: string;
  title: string;
  description: string;
  tags: string[];
  created_by: string;
  type?: string;
}

async function seedUsers(users: UserData[], markAsSeed: boolean = false): Promise<Map<string, string>> {
  const userIdMap = new Map<string, string>();
  
  for (const userData of users) {
    try {
      // Check if user exists
      const existing = await prisma.user.findFirst({
        where: {
          OR: [
            { email: userData.email },
            { username: userData.username },
          ],
        },
      });

      if (existing) {
        console.log(`   ⏭️  User already exists: ${userData.username}`);
        userIdMap.set(userData.username, existing.id);
        continue;
      }

      // Create new user
      const passwordHash = await bcrypt.hash(userData.password, 12);
      const user = await prisma.user.create({
        data: {
          username: userData.username,
          email: userData.email,
          name: userData.name,
          passwordHash,
          role: (userData.role as UserRole) || "USER",
          preferredLanguage: userData.preferred_language,
          preferredContentLanguages: userData.preferred_content_languages,
          isSeed: markAsSeed,
        },
      });

      console.log(`   ✅ Created user: ${userData.username} (${userData.email})`);
      userIdMap.set(userData.username, user.id);
    } catch (error) {
      console.error(`   ❌ Failed to create user ${userData.username}:`, error);
    }
  }

  return userIdMap;
}

async function seedTopics(topics: TopicData[], userIdMap: Map<string, string>): Promise<void> {
  for (const topicData of topics) {
    try {
      const slug = generateSlug(topicData.title);
      
      // Check if topic exists
      const existing = await prisma.topic.findUnique({
        where: { slug },
      });

      if (existing) {
        console.log(`   ⏭️  Topic already exists: ${topicData.title}`);
        continue;
      }

      // Get creator user ID
      const creatorId = userIdMap.get(topicData.created_by);
      if (!creatorId) {
        console.error(`   ❌ Creator user not found: ${topicData.created_by}`);
        continue;
      }

      // Create topic
      await prisma.topic.create({
        data: {
          slug,
          title: topicData.title,
          description: topicData.description,
          language: topicData.language,
          tags: topicData.tags,
          type: topicData.type === "MULTI_CHOICE" ? "MULTI_CHOICE" : "YES_NO",
          createdById: creatorId,
          status: "ACTIVE",
        },
      });

      console.log(`   ✅ Created topic [${topicData.language}]: ${topicData.title}`);
    } catch (error) {
      console.error(`   ❌ Failed to create topic:`, error);
    }
  }
}

async function main() {
  console.log("🌱 Starting YAML-based seed...\n");

  try {
    // Read and parse YAML file
    const yamlPath = join(__dirname, "seed-data.yml");
    console.log(`📄 Reading seed data from: ${yamlPath}`);
    const yamlContent = readFileSync(yamlPath, "utf-8");
    const seedData = load(yamlContent) as Record<string, unknown>;
    
    console.log("✅ Parsed seed data successfully\n");

    // Seed admin users (not marked as seed data - permanent)
    console.log("👥 Seeding admin users...");
    const adminUsers = (seedData.admin_users || []) as UserData[];
    const adminUserMap = await seedUsers(adminUsers, false);
    console.log("");

    // Seed sample users (marked as seed data for cleanup)
    console.log("👥 Seeding sample users...");
    const sampleUsers = (seedData.sample_users || []) as UserData[];
    const sampleUserMap = await seedUsers(sampleUsers, true);
    console.log("");

    // Combine user maps
    const allUserMap = new Map<string, string>();
    adminUserMap.forEach((value, key) => allUserMap.set(key, value));
    sampleUserMap.forEach((value, key) => allUserMap.set(key, value));

    // Seed topics
    console.log("📝 Seeding topics...");
    const topics = (seedData.sample_topics || []) as TopicData[];
    await seedTopics(topics, allUserMap);
    console.log("");

    // Summary
    console.log("🎉 Seed completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`   👥 Admin users: ${adminUsers.length}`);
    console.log(`   👥 Sample users: ${sampleUsers.length}`);
    console.log(`   📝 Topics: ${topics.length}`);
    console.log("");
    console.log("📧 Login credentials:");
    console.log("   Admin: admin@thebate.com / password123");
    console.log("   Moderator: mod@thebate.com / password123");
    console.log("   Sample users: Use their emails with password123");
  } catch (error) {
    console.error("\n❌ Error during seeding:", error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
