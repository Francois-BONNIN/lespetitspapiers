import { buildDrawMessage } from "@/domain/message";
import type { EventSettings } from "@/domain/types";
import { useI18n } from "@/i18n/language-context";

export function MessagePreview({ settings }: { settings: EventSettings }) {
  const { t } = useI18n();
  const sampleLink = `${window.location.origin}${window.location.pathname}#reveal=…`;
  const preview = buildDrawMessage(
    t.settings.previewDrawer,
    t.settings.previewDrawn,
    settings,
    t,
    sampleLink,
  );

  return (
    <div className="mt-5">
      <p className="label">{t.settings.previewTitle}</p>
      <p className="mb-2 text-xs text-ink-500 dark:text-ink-400">
        {t.settings.previewDescription}
      </p>
      <div className="card-inset whitespace-pre-wrap break-words p-4 text-sm leading-relaxed text-ink-800 dark:text-ink-100">
        {preview}
      </div>
    </div>
  );
}
