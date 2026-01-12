import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Use production URL or fallback to NEXTAUTH_URL for development
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://thebatee.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/t/",
          "/u/",
          "/create-debate",
          "/vote-on-topics",
          "/public-opinion-polls",
          "/debate-controversial-topics",
          "/online-voting-platform",
          "/giveaway",
        ],
        disallow: [
          "/api/",
          "/auth/",
          "/new",
          "/admin/",
          "/settings/",
          "/*?side=*", // Don't index filtered views
        ],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/t/",
          "/u/",
          "/create-debate",
          "/vote-on-topics",
          "/public-opinion-polls",
          "/debate-controversial-topics",
          "/online-voting-platform",
          "/giveaway",
        ],
        disallow: ["/api/", "/auth/", "/new", "/admin/", "/settings/"],
        crawlDelay: 0,
      },
      {
        userAgent: "Bingbot",
        allow: [
          "/",
          "/t/",
          "/u/",
          "/create-debate",
          "/vote-on-topics",
          "/public-opinion-polls",
          "/debate-controversial-topics",
          "/online-voting-platform",
          "/giveaway",
        ],
        disallow: ["/api/", "/auth/", "/new", "/admin/", "/settings/"],
        crawlDelay: 0,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
