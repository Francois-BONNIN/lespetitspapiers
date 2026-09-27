import { AlertTriangle, Check, PenLine, Shuffle } from "lucide-react";
import { useI18n } from "@/i18n/language-context";

interface StaleDrawBannerProps {
  isDrawing: boolean;
  onRedraw: () => void;
}

export function StaleDrawBanner({ isDrawing, onRedraw }: StaleDrawBannerProps) {
  const { t } = useI18n();

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3.5 dark:border-amber-500/30 dark:bg-amber-500/[0.08]">
      <AlertTriangle
        size={18}
        className="shrink-0 self-start text-amber-600 dark:text-amber-400"
      />
      <div className="min-w-0 flex-1 basis-56">
        <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
          {t.draw.staleTitle}
        </p>
        <p className="mt-0.5 text-[13px] leading-relaxed text-amber-800 dark:text-amber-200/80">
          {t.draw.staleDescription}
        </p>
      </div>
      <button
        onClick={onRedraw}
        disabled={isDrawing}
        className="btn btn-md btn-primary shrink-0 max-sm:w-full"
      >
        <Shuffle size={16} className={isDrawing ? "animate-spin" : undefined} />
        {isDrawing ? t.draw.inProgress : t.draw.redraw}
      </button>
    </div>
  );
}

interface DrawDoneBannerProps {
  drawCount: number;
  sendsLink: boolean;
  onCustomizeMessage: () => void;
}

export function DrawDoneBanner({
  drawCount,
  sendsLink,
  onCustomizeMessage,
}: DrawDoneBannerProps) {
  const { t } = useI18n();

  return (
    <div className="mb-5 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 dark:border-emerald-500/20 dark:bg-emerald-500/[0.08]">
      <Check
        size={18}
        className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
      />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
          {t.draw.resultBanner(drawCount)}
        </p>
        <p className="mt-0.5 text-[13px] leading-relaxed text-emerald-800 dark:text-emerald-200/80">
          {sendsLink ? t.draw.resultInstructionsLink : t.draw.resultInstructions}
        </p>
        <button
          onClick={onCustomizeMessage}
          className="mt-1.5 inline-flex items-center gap-1.5 rounded-md text-[13px] font-semibold text-emerald-800 underline-offset-2 hover:underline dark:text-emerald-200"
        >
          <PenLine size={13} />
          {t.settings.customize}
        </button>
      </div>
    </div>
  );
}
