import type { ReactNode } from "react";
import { useI18n } from "@/i18n/language-context";

interface SectionCardProps {
  step: number;
  title: string;
  description?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({
  step,
  title,
  description,
  badge,
  actions,
  children,
  className = "",
}: SectionCardProps) {
  const { t } = useI18n();

  return (
    <section
      className={`card flex flex-col p-5 hover:shadow-card-hover sm:p-6 ${className}`}
    >
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            aria-hidden
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 font-display text-lg font-bold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
          >
            {step}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="section-title">
                <span className="sr-only">{t.common.step(step)} </span>
                {title}
              </h2>
              {badge}
            </div>
            {description && (
              <p className="mt-1 text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
        )}
      </header>
      <div className="flex-1">{children}</div>
    </section>
  );
}
