import { Ticket } from "lucide-react";

const APP_NAME = "Les Petits Papiers";

export function BrandMark({ tagline }: { tagline?: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
        <Ticket size={18} />
      </span>
      {tagline ? (
        <span className="min-w-0">
          <span className="block truncate font-display text-base font-semibold leading-tight text-ink-900 dark:text-white">
            {APP_NAME}
          </span>
          <span className="hidden text-xs text-ink-500 dark:text-ink-400 sm:block">
            {tagline}
          </span>
        </span>
      ) : (
        <span className="truncate font-display text-base font-semibold text-ink-900 dark:text-white">
          {APP_NAME}
        </span>
      )}
    </div>
  );
}
