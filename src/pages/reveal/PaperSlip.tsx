import { useState } from "react";
import { CalendarDays, Gift, Wallet } from "lucide-react";
import { formatDrawDate, formatExchangeDate } from "@/domain/message";
import { useI18n } from "@/i18n/language-context";
import type { PersonalDraw } from "@/services/shareLink";

export function PaperSlip({ draw }: { draw: PersonalDraw }) {
  const { t } = useI18n();
  const [opened, setOpened] = useState(false);
  const locale = t.meta.locale;

  return (
    <>
      <h1 className="break-words font-display text-3xl font-bold tracking-tight text-ink-900 dark:text-white">
        {t.reveal.greeting(draw.drawerName)}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
        {draw.eventName ? t.reveal.introEvent(draw.eventName) : t.reveal.intro}
      </p>

      <div
        className="card-inset mt-6 border-dashed px-6 py-8"
        aria-live="polite"
      >
        {opened ? (
          <>
            <p className="label">{t.reveal.youDrew}</p>
            <p className="animate-draw-in break-words font-display text-4xl font-bold text-brand-600 dark:text-brand-400">
              {draw.drawnName}
            </p>
          </>
        ) : (
          <>
            <span className="mx-auto mb-5 flex h-14 w-14 animate-float items-center justify-center rounded-2xl bg-white text-brand-600 shadow-card dark:bg-white/10 dark:text-brand-300">
              <Gift size={26} />
            </span>
            <button
              onClick={() => setOpened(true)}
              className="btn btn-lg btn-primary shadow-glow"
            >
              {t.reveal.open}
            </button>
          </>
        )}
      </div>

      {(draw.budget || draw.exchangeDate) && (
        <ul className="mt-5 space-y-1.5 text-sm text-ink-700 dark:text-ink-200">
          {draw.budget && (
            <li className="flex items-center justify-center gap-2">
              <Wallet size={15} className="shrink-0 text-ink-400" />
              {t.reveal.budget(draw.budget)}
            </li>
          )}
          {draw.exchangeDate && (
            <li className="flex items-center justify-center gap-2">
              <CalendarDays size={15} className="shrink-0 text-ink-400" />
              {t.reveal.exchange(formatExchangeDate(draw.exchangeDate, locale))}
            </li>
          )}
        </ul>
      )}

      <p className="mt-6 text-xs leading-relaxed text-ink-500 dark:text-ink-400">
        {draw.drawDate &&
          `${t.reveal.drawnOn(formatDrawDate(draw.drawDate, locale))} `}
        {t.reveal.keepSecret}
      </p>
    </>
  );
}
