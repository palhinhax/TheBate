import { headers } from "next/headers";

export type SupportedLanguage = "en" | "pt" | "es" | "fr" | "de";

const SUPPORTED_LANGUAGES: SupportedLanguage[] = ["en", "pt", "es", "fr", "de"];

/**
 * Detects user's preferred language based on:
 * 1. URL parameter (?lang=en)
 * 2. Cookie preference
 * 3. Accept-Language header
 * 4. Default to English
 */
export async function detectUserLanguage(
  searchParams?: { lang?: string }
): Promise<SupportedLanguage> {
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
 * Gets languages user likely understands
 * Returns array with detected language + English as fallback
 */
export async function getUserLanguages(
  searchParams?: { lang?: string }
): Promise<SupportedLanguage[]> {
  const primaryLang = await detectUserLanguage(searchParams);
  
  // Return primary language + English as fallback (if not already English)
  if (primaryLang === "en") {
    return ["en"];
  }
  
  return [primaryLang, "en"];
}

/**
 * Language metadata for SEO and display
 */
export const LANGUAGE_METADATA: Record<
  SupportedLanguage,
  {
    name: string;
    nativeName: string;
    flag: string;
    locale: string;
  }
> = {
  en: {
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    locale: "en_US",
  },
  pt: {
    name: "Portuguese",
    nativeName: "Português",
    flag: "🇵🇹",
    locale: "pt_PT",
  },
  es: {
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    locale: "es_ES",
  },
  fr: {
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    locale: "fr_FR",
  },
  de: {
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    locale: "de_DE",
  },
};
