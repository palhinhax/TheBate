/**
 * Shared language types and constants
 * Safe for both client and server components
 */

export type SupportedLanguage = "en" | "pt" | "es" | "fr" | "de" | "hi" | "zh";

export const SUPPORTED_LANGUAGES = ["en", "pt", "es", "fr", "de", "hi", "zh"] as const;

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
  hi: {
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    locale: "hi_IN",
  },
  zh: {
    name: "Chinese",
    nativeName: "中文",
    flag: "🇨🇳",
    locale: "zh_CN",
  },
};

/**
 * Array format for easy iteration in UI components
 */
export const LANGUAGES = SUPPORTED_LANGUAGES.map((code) => ({
  code,
  ...LANGUAGE_METADATA[code],
}));
