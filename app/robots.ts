import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Use production URL or fallback to NEXTAUTH_URL for development
  const baseUrl = 
    process.env.NEXT_PUBLIC_SITE_URL || 
    process.env.NEXTAUTH_URL || 
    "https://thebatee.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/t/"],
        disallow: [
          "/api/",
          "/auth/",
          "/new",
          "/admin/",
          "/mod/",
          "/dashboard/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
