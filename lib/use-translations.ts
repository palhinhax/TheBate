"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type TranslationKey = string;
type Translations = Record<string, unknown>;

const translationsCache: Record<string, Translations> = {};

/**
 * Simple client-side translation hook
 * Uses user's preferred language from session, or detects browser language
 */
export function useTranslations() {
  const [translations, setTranslations] = useState<Translations>({});
  const [locale, setLocale] = useState<string>("pt");
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    async function loadTranslations() {
      // Supported languages
      const supportedLangs = ["pt", "en", "es", "fr", "de"];

      let selectedLang: string;

      // First priority: user's preferred language from session
      if (session?.user?.preferredLanguage) {
        selectedLang = session.user.preferredLanguage;
        console.log("🌐 Loading translations for user preference:", selectedLang);
      } else {
        // Second priority: detect browser language
        const browserLang =
          typeof navigator !== "undefined"
            ? navigator.language.split("-")[0]
            : "pt";
        selectedLang = supportedLangs.includes(browserLang)
          ? browserLang
          : "pt";
        console.log("🌐 Loading translations for browser language:", selectedLang);
      }

      // Only update if language actually changed
      if (selectedLang !== locale) {
        console.log(`🌐 Language changed from ${locale} to ${selectedLang}`);
        setLocale(selectedLang);
      }

      // Check cache first
      if (translationsCache[selectedLang]) {
        console.log("✅ Translations loaded from cache:", selectedLang);
        setTranslations(translationsCache[selectedLang]);
        setIsLoading(false);
        return;
      }

      // Load translations
      try {
        console.log("🔄 Fetching translations for:", selectedLang);
        const response = await fetch(`/locales/${selectedLang}.json`);
        const data = await response.json();
        translationsCache[selectedLang] = data;
        setTranslations(data);
        console.log("✅ Translations loaded successfully:", selectedLang);
      } catch (error) {
        console.error("❌ Failed to load translations:", error);
        // Fallback to Portuguese
        try {
          const fallbackResponse = await fetch("/locales/pt.json");
          const fallbackData = await fallbackResponse.json();
          translationsCache["pt"] = fallbackData;
          setTranslations(fallbackData);
          console.log("⚠️ Loaded fallback Portuguese translations");
        } catch (fallbackError) {
          console.error("❌ Failed to load fallback translations:", fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    }

    // Wait for session to load before loading translations
    if (status !== "loading") {
      console.log("🔍 Session status:", status, "User preference:", session?.user?.preferredLanguage);
      loadTranslations();
    }
  }, [session?.user?.preferredLanguage, status, locale]);

  const t = (key: TranslationKey, fallback?: string): string => {
    // Debug: check if translations object is empty
    const translationsCount = Object.keys(translations).length;
    
    if (translationsCount === 0) {
      console.warn(`⚠️ Translations object is empty! isLoading: ${isLoading}, locale: ${locale}, key: ${key}`);
      return fallback || key;
    }

    const keys = key.split(".");
    let value: unknown = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        console.warn(`⚠️ Translation key not found: ${key}, locale: ${locale}, keys checked: ${keys.join(".")}`);
        console.log("📦 Available translations:", Object.keys(translations));
        return fallback || key;
      }
    }

    return typeof value === "string" ? value : fallback || key;
  };

  return { t, locale, isLoading };
}
