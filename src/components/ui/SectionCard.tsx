import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface SectionCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  accent?: "brand" | "amber" | "rose" | "emerald";
  badge?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

const ACCENTS = {
  brand:
    "bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
  amber:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  emerald:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
};

export function SectionCard({
  icon: Icon,
  title,
  description,
  accent = "brand",
  badge,
  actions,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <section
      className={`card flex flex-col p-5 hover:shadow-card-hover sm:p-6 ${className}`}
    >
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${ACCENTS[accent]}`}
          >
            <Icon size={19} />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="section-title">{title}</h2>
              {badge}
            </div>
            {description && (
              <p className="mt-1 text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
      </header>
      <div className="flex-1">{children}</div>
    </section>
  );
}
