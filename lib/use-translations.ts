"use client";

import { useState, useEffect } from "react";

type TranslationKey = string;
type Translations = Record<string, unknown>;

const translationsCache: Record<string, Translations> = {};

/**
 * Simple client-side translation hook
 * Detects browser language and loads appropriate translations
 */
export function useTranslations() {
  const [translations, setTranslations] = useState<Translations>({});
  const [locale, setLocale] = useState<string>("pt");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTranslations() {
      // Detect browser language
      const browserLang =
        typeof navigator !== "undefined"
          ? navigator.language.split("-")[0]
          : "pt";

      // Supported languages
      const supportedLangs = ["pt", "en", "es", "fr", "de"];
      const selectedLang = supportedLangs.includes(browserLang)
        ? browserLang
        : "pt";

      setLocale(selectedLang);

      // Check cache first
      if (translationsCache[selectedLang]) {
        setTranslations(translationsCache[selectedLang]);
        setIsLoading(false);
        return;
      }

      // Load translations
      try {
        const response = await fetch(`/locales/${selectedLang}.json`);
        const data = await response.json();
        translationsCache[selectedLang] = data;
        setTranslations(data);
      } catch (error) {
        console.error("Failed to load translations:", error);
        // Fallback to Portuguese
        try {
          const fallbackResponse = await fetch("/locales/pt.json");
          const fallbackData = await fallbackResponse.json();
          translationsCache["pt"] = fallbackData;
          setTranslations(fallbackData);
        } catch (fallbackError) {
          console.error("Failed to load fallback translations:", fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadTranslations();
  }, []);

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

  return { t, locale, isLoading };
}
