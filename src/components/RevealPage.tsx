import { useState } from "react";
import { ArrowRight, CalendarDays, Gift, Ticket, Wallet } from "lucide-react";
import type { PersonalDraw } from "../lib/shareLink";
import { formatDrawDate, formatExchangeDate } from "../lib/message";
import { LanguageToggle } from "./ui/LanguageToggle";
import { ThemeToggle } from "./ui/ThemeToggle";
import { useI18n } from "./ui/language-context";

interface RevealPageProps {
  draw: PersonalDraw | null;
  onExit: () => void;
}

export function RevealPage({ draw, onExit }: RevealPageProps) {
  const { t } = useI18n();
  const [opened, setOpened] = useState(false);
  const locale = t.meta.locale;

  return (
    <div className="aurora-bg flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
            <Ticket size={18} />
          </span>
          <span className="truncate font-display text-base font-semibold text-ink-900 dark:text-white">
            Les Petits Papiers
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-16 pt-6">
        <section className="card w-full max-w-md animate-fade-up p-6 text-center sm:p-8">
          {draw ? (
            <>
              <h1 className="break-words font-display text-3xl font-bold tracking-tight text-ink-900 dark:text-white">
                {t.reveal.greeting(draw.drawerName)}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
                {draw.eventName
                  ? t.reveal.introEvent(draw.eventName)
                  : t.reveal.intro}
              </p>

              <div className="card-inset mt-6 border-dashed px-6 py-8" aria-live="polite">
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
                      {t.reveal.exchange(
                        formatExchangeDate(draw.exchangeDate, locale)
                      )}
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
          ) : (
            <p className="py-10 text-sm text-ink-500 dark:text-ink-400">
              {t.reveal.loading}
            </p>
          )}
        </section>

        <button onClick={onExit} className="btn btn-sm btn-ghost mt-6">
          {t.reveal.organize}
          <ArrowRight size={15} />
        </button>
      </main>
    </div>
  );
}
