"use client";

import { useState, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { Button } from "./ui/button";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
];

export function LanguageSelector() {
  const [selectedLangs, setSelectedLangs] = useState<string[]>(["pt"]);
  const [isOpen, setIsOpen] = useState(false);

  // Load saved preferences on mount
  useEffect(() => {
    const saved = localStorage.getItem('preferredLanguages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedLangs(parsed);
        }
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);

  const handleLanguageToggle = (code: string) => {
    let newSelection: string[];
    
    if (selectedLangs.includes(code)) {
      // Don't allow deselecting all languages
      if (selectedLangs.length === 1) return;
      newSelection = selectedLangs.filter(l => l !== code);
    } else {
      newSelection = [...selectedLangs, code];
    }
    
    setSelectedLangs(newSelection);
    localStorage.setItem('preferredLanguages', JSON.stringify(newSelection));
    window.location.reload();
  };

  const displayText = selectedLangs.length === 1 
    ? languages.find(l => l.code === selectedLangs[0])?.name || 'Idioma'
    : `${selectedLangs.length} idiomas`;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{displayText}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-md border bg-background shadow-lg z-50">
          <div className="py-2 px-3 border-b">
            <p className="text-xs text-muted-foreground font-medium">
              Selecione as línguas que prefere ver:
            </p>
          </div>
          <div className="py-1">
            {languages.map((lang) => {
              const isSelected = selectedLangs.includes(lang.code);
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageToggle(lang.code)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 ${
                    isSelected ? 'bg-muted/50' : ''
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="flex-1">{lang.name}</span>
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
