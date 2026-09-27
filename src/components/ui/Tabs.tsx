import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface TabItem<T extends string> {
  id: T;
  label: string;
  icon: LucideIcon;
  count: number;
}

interface TabListProps<T extends string> {
  idPrefix: string;
  label: string;
  tabs: TabItem<T>[];
  selected: T;
  onSelect: (id: T) => void;
  className?: string;
}

export function TabList<T extends string>({
  idPrefix,
  label,
  tabs,
  selected,
  onSelect,
  className = "",
}: TabListProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={`flex gap-1 rounded-xl bg-ink-100 p-1 dark:bg-white/[0.06] ${className}`}
    >
      {tabs.map(({ id, label: tabLabel, icon: Icon, count }) => {
        const active = selected === id;
        return (
          <button
            key={id}
            role="tab"
            id={`${idPrefix}-tab-${id}`}
            aria-selected={active}
            aria-controls={`${idPrefix}-panel-${id}`}
            onClick={() => onSelect(id)}
            className={`flex h-9 flex-1 items-center justify-center gap-2 rounded-lg text-[13px] font-semibold transition-colors ${
              active
                ? "bg-white text-ink-900 shadow-sm dark:bg-white/[0.12] dark:text-white"
                : "text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100"
            }`}
          >
            <Icon size={15} />
            <span className="truncate">{tabLabel}</span>
            {count > 0 && (
              <span className="rounded-full bg-ink-200 px-1.5 text-[11px] font-bold text-ink-600 dark:bg-white/15 dark:text-ink-200">
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

interface TabPanelProps {
  idPrefix: string;
  id: string;
  children: ReactNode;
}

export function TabPanel({ idPrefix, id, children }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      id={`${idPrefix}-panel-${id}`}
      aria-labelledby={`${idPrefix}-tab-${id}`}
    >
      {children}
    </div>
  );
}
