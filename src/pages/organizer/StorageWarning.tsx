import { AlertTriangle } from "lucide-react";
import { useI18n } from "@/i18n/language-context";

export function StorageWarning() {
  const { t } = useI18n();

  return (
    <div className="mb-6 flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/[0.08] dark:text-amber-200">
      <AlertTriangle size={18} className="mt-0.5 shrink-0" />
      <span>
        <strong className="font-semibold">{t.storage.title}</strong>{" "}
        {t.storage.body}
      </span>
    </div>
  );
}
