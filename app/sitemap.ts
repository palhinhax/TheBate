import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  let topicUrls: MetadataRoute.Sitemap = [];

  try {
    // Get all active topics
    const topics = await prisma.topic.findMany({
      where: { status: "ACTIVE" as const },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    topicUrls = topics.map((topic) => ({
      url: `${baseUrl}/t/${topic.slug}`,
      lastModified: topic.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));
  } catch (error) {
    // Database may not be available during build time
    console.warn("Could not fetch topics for sitemap:", error);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${baseUrl}/new`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...topicUrls,
  ];
}
