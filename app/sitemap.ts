import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  // Get all active topics
  const topics = await prisma.topic.findMany({
    where: { status: "ACTIVE" as const },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const topicUrls = topics.map((topic) => ({
    url: `${baseUrl}/t/${topic.slug}`,
    lastModified: topic.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

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
