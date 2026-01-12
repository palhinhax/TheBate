import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use production URL or fallback to NEXTAUTH_URL for development
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://thebatee.com";

  let topicUrls: MetadataRoute.Sitemap = [];

  try {
    // Get ONLY active topics with substantial content
    const topics = await prisma.topic.findMany({
      where: {
        status: "ACTIVE",
        // Only include topics with meaningful content (description > 100 chars)
        description: {
          not: "",
        },
      },
      select: {
        slug: true,
        updatedAt: true,
        language: true,
        description: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    // Filter topics with at least some content or engagement
    const qualityTopics = topics.filter(
      (topic) => topic.description.length > 50 || topic._count.comments > 0
    );

    topicUrls = qualityTopics.map((topic) => ({
      url: `${baseUrl}/t/${topic.slug}`,
      lastModified: topic.updatedAt,
      changeFrequency: "daily" as const,
      priority: topic._count.comments > 5 ? 0.9 : 0.8, // Higher priority for popular debates
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

  // SEO landing pages - high priority for organic search
  const seoPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/create-debate`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/vote-on-topics`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/public-opinion-polls`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/debate-controversial-topics`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/online-voting-platform`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
  ];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    ...languageUrls,
    ...seoPages,
    {
      url: `${baseUrl}/giveaway`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9, // High priority - important marketing page
    },
    // Removed /new - requires auth, no SEO value
    // Removed legal pages from sitemap - low SEO priority
    ...topicUrls,
  ];
}
