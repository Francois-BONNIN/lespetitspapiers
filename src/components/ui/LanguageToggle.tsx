import { Languages } from "lucide-react";
import { translations } from "../../lib/i18n";
import { useI18n } from "./language-context";

export function LanguageToggle() {
  const { lang, setLang, t } = useI18n();
  const nextLang = lang === "fr" ? "en" : "fr";

  return (
    <button
      onClick={() => setLang(nextLang)}
      className="btn btn-sm btn-secondary rounded-full"
      aria-label={t.meta.switchLabel}
      title={t.meta.switchLabel}
    >
      <Languages size={15} />
      <span className="text-xs font-bold tracking-wide">
        {translations[nextLang].meta.code}
      </span>
    </button>
  );
}
