import { PenLine, Shuffle, Sparkles } from "lucide-react";
import { useI18n } from "@/i18n/language-context";

interface DrawLauncherProps {
  participantCount: number;
  isDrawing: boolean;
  onStart: () => void;
  onCustomizeMessage: () => void;
}

export function DrawLauncher({
  participantCount,
  isDrawing,
  onStart,
  onCustomizeMessage,
}: DrawLauncherProps) {
  const { t } = useI18n();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-amber-50 px-6 py-12 text-center dark:border-brand-500/20 dark:from-brand-500/10 dark:via-ink-900 dark:to-amber-500/[0.06]">
      <span
        className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-card transition-transform duration-300 dark:bg-white/10 dark:text-brand-300 ${
          isDrawing ? "scale-110 animate-pulse" : "animate-float"
        }`}
      >
        <Sparkles size={26} />
      </span>
      <p className="font-display text-xl font-semibold text-ink-900 dark:text-white">
        {t.draw.ready(participantCount)}
      </p>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink-500 dark:text-ink-400">
        {t.draw.readyDescription}
      </p>
      <button
        onClick={onStart}
        disabled={isDrawing}
        className="btn btn-lg btn-primary mx-auto mt-6 shadow-glow"
      >
        <Shuffle size={20} className={isDrawing ? "animate-spin" : undefined} />
        {isDrawing ? t.draw.inProgress : t.draw.start}
      </button>
      <div className="mt-3">
        <button onClick={onCustomizeMessage} className="btn btn-sm btn-ghost">
          <PenLine size={14} />
          {t.settings.customize}
        </button>
      </div>
    </div>
  );
}
