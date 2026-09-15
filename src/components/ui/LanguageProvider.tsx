import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  detectLanguage,
  translations,
  LANGUAGE_STORAGE_KEY,
  type Language,
} from "../../lib/i18n";
import { LanguageContext, type LanguageContextValue } from "./language-context";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(detectLanguage);

  useEffect(() => {
    const t = translations[lang];
    document.documentElement.lang = t.meta.htmlLang;
    document.title = t.meta.documentTitle;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", t.meta.documentDescription);

    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
    }
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, t: translations[lang] }),
    [lang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
