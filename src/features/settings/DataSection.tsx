import { Trash2 } from "lucide-react";
import { useI18n } from "@/i18n/language-context";
import { SettingsSection } from "./SettingsSection";

export function DataSection({ onClearAll }: { onClearAll: () => void }) {
  const { t } = useI18n();

  return (
    <SettingsSection
      id="data"
      title={t.settings.dataTitle}
      description={t.settings.dataDescription}
      className="mt-7 border-t border-ink-200/80 pt-6 dark:border-white/10"
    >
      <button
        type="button"
        onClick={onClearAll}
        className="btn btn-sm border border-rose-200 bg-white text-rose-700 hover:border-rose-300 hover:bg-rose-50 dark:border-rose-500/30 dark:bg-transparent dark:text-rose-300 dark:hover:bg-rose-500/10"
      >
        <Trash2 size={15} />
        {t.settings.clearAll}
      </button>
    </SettingsSection>
  );
}
