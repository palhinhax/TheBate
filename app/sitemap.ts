import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use production URL or fallback to NEXTAUTH_URL for development
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://thebatee.com";

  let topicUrls: MetadataRoute.Sitemap = [];

  try {
    // Get all active topics
    const topics = await prisma.topic.findMany({
      where: { status: "ACTIVE" as const },
      select: {
        slug: true,
        updatedAt: true,
        language: true,
      },
    });

    topicUrls = topics.map((topic) => ({
      url: `${baseUrl}/t/${topic.slug}`,
      lastModified: topic.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
      // Language alternatives for better SEO
      alternates: {
        languages: {
          [topic.language]: `${baseUrl}/t/${topic.slug}`,
        },
      },
    }));
  } catch (error) {
    // Database may not be available during build time
    console.warn("Could not fetch topics for sitemap:", error);
  }

  const languages = ["en", "pt", "es", "fr", "de", "hi", "zh", "ar", "bn", "ru", "id", "ja"];
  const languageUrls: MetadataRoute.Sitemap = languages.map((lang) => ({
    url: `${baseUrl}?lang=${lang}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    ...languageUrls,
    {
      url: `${baseUrl}/giveaway`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9, // High priority - important marketing page
    },
    {
      url: `${baseUrl}/new`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...topicUrls,
  ];
}
