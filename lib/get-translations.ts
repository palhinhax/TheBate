import { readFile } from "fs/promises";
import { join } from "path";
import { detectUserLanguage, type SupportedLanguage } from "./language";

type TranslationKey = string;
type Translations = Record<string, unknown>;

// Cache translations in memory for performance
const translationsCache: Record<string, Translations> = {};

/**
 * Server-side translation utility
 * Loads translations from JSON files for server components
 */
export async function getTranslations(searchParams?: {
  lang?: string;
}): Promise<{ t: (key: TranslationKey, fallback?: string) => string; locale: SupportedLanguage }> {
  const locale = await detectUserLanguage(searchParams);

  // Check cache first
  if (!translationsCache[locale]) {
    try {
      const filePath = join(process.cwd(), "public", "locales", `${locale}.json`);
      const fileContent = await readFile(filePath, "utf-8");
      translationsCache[locale] = JSON.parse(fileContent);
    } catch (error) {
      console.error(`Failed to load translations for ${locale}:`, error);
      // Fallback to English
      if (locale !== "en") {
        try {
          const fallbackPath = join(process.cwd(), "public", "locales", "en.json");
          const fallbackContent = await readFile(fallbackPath, "utf-8");
          translationsCache[locale] = JSON.parse(fallbackContent);
        } catch (fallbackError) {
          console.error("Failed to load fallback translations:", fallbackError);
          translationsCache[locale] = {};
        }
      } else {
        translationsCache[locale] = {};
      }
    }
  }

  const translations = translationsCache[locale];

  const t = (key: TranslationKey, fallback?: string): string => {
    const keys = key.split(".");
    let value: unknown = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return fallback || key;
      }
    }

    return typeof value === "string" ? value : fallback || key;
  };

  return { t, locale };
}
