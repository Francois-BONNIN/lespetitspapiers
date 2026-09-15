import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={`card-inset flex flex-col items-center justify-center border-dashed px-6 text-center ${
        compact ? "py-8" : "py-12"
      }`}
    >
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink-400 shadow-sm dark:bg-white/[0.06] dark:text-ink-500">
        <Icon size={22} />
      </span>
      <p className="text-sm font-semibold text-ink-700 dark:text-ink-200">
        {title}
      </p>
      {description && (
        <p className="mt-1 max-w-xs text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
