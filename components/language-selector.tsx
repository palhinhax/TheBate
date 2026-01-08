"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "./ui/button";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
];

export function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState("en");
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (code: string) => {
    setCurrentLang(code);
    setIsOpen(false);
    // Store in localStorage and update URL
    localStorage.setItem("language", code);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", code);
    window.history.pushState({}, "", url);
    window.location.reload();
  };

  const currentLanguage = languages.find((lang) => lang.code === currentLang);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLanguage?.flag}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-md border bg-background shadow-lg z-50">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
