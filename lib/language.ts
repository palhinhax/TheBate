import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "./language-shared";

// Re-export for convenience
export type { SupportedLanguage } from "./language-shared";
export {
  SUPPORTED_LANGUAGES,
  LANGUAGE_METADATA,
  LANGUAGES,
} from "./language-shared";

/**
 * Detects user's preferred language based on:
 * 1. URL parameter (?lang=en)
 * 2. Cookie preference
 * 3. Accept-Language header
 * 4. Default to English
 */
export async function detectUserLanguage(searchParams?: {
  lang?: string;
}): Promise<SupportedLanguage> {
  // 1. Check URL parameter first (highest priority)
  if (searchParams?.lang) {
    const lang = searchParams.lang.toLowerCase().slice(0, 2);
    if (SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)) {
      return lang as SupportedLanguage;
    }
  }

  // 2. Check Accept-Language header
  try {
    const headersList = await headers();
    const acceptLanguage = headersList.get("accept-language");

    if (acceptLanguage) {
      // Parse Accept-Language header (e.g., "en-US,en;q=0.9,pt;q=0.8")
      const languages = acceptLanguage
        .split(",")
        .map((lang) => {
          const parts = lang.split(";");
          const code = parts[0].trim().split("-")[0].toLowerCase();
          const quality = parts[1] ? parseFloat(parts[1].split("=")[1]) : 1;
          return { code, quality };
        })
        .sort((a, b) => b.quality - a.quality);

      // Find first supported language
      for (const { code } of languages) {
        if (SUPPORTED_LANGUAGES.includes(code as SupportedLanguage)) {
          return code as SupportedLanguage;
        }
      }
    }
  } catch (error) {
    console.log("Error detecting language from headers:", error);
  }

  // 3. Default to English
  return "en";
}

/**
 * Gets languages user prefers to see
 * Priority:
 * 1. User's saved preferences in database (from settings)
 * 2. All supported languages by default
 */
export async function getUserLanguages(_searchParams?: {
  lang?: string;
}): Promise<SupportedLanguage[]> {
  // Get user's saved preferences from session
  const session = await auth();

  // Check if user has valid preferences (not null, is array, has items)
  if (
    session?.user?.preferredContentLanguages &&
    Array.isArray(session.user.preferredContentLanguages) &&
    session.user.preferredContentLanguages.length > 0
  ) {
    return session.user.preferredContentLanguages as SupportedLanguage[];
  }

  // Check if running on client and has saved preferences
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("preferredLanguages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed as SupportedLanguage[];
        }
      } catch {
        // Invalid JSON, ignore
      }
    }
  }

  // Default to all languages for better discovery
  return [...SUPPORTED_LANGUAGES];
}
