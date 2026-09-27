import { createContext, useContext } from "react";
import type { Language, Translation } from "./translations";

export interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translation;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useI18n(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useI18n doit être utilisé dans un <LanguageProvider>");
  }
  return ctx;
}
