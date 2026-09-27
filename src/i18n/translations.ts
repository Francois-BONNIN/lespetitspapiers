import { en } from "./en";
import { fr, type Translation } from "./fr";

export type { Translation };

export type Language = "fr" | "en";

export const LANGUAGES: Language[] = ["fr", "en"];

export const LANGUAGE_STORAGE_KEY = "sp_lang";

export const translations: Record<Language, Translation> = { fr, en };

export function isLanguage(value: unknown): value is Language {
  return value === "fr" || value === "en";
}

export function detectLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isLanguage(stored)) return stored;
  } catch {
  }

  if (typeof navigator !== "undefined") {
    const preferred = navigator.languages?.[0] ?? navigator.language;
    if (preferred && !preferred.toLowerCase().startsWith("fr")) return "en";
  }

  return "fr";
}
