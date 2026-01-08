/**
 * Shared language types and constants
 * Safe for both client and server components
 */

export type SupportedLanguage = "en" | "pt" | "es" | "fr" | "de";

export const SUPPORTED_LANGUAGES = ["en", "pt", "es", "fr", "de"] as const;

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

/**
 * Array format for easy iteration in UI components
 */
export const LANGUAGES = SUPPORTED_LANGUAGES.map((code) => ({
  code,
  ...LANGUAGE_METADATA[code],
}));
