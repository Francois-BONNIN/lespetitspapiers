import type { LucideIcon } from "lucide-react";

interface RuleToggleProps {
  icon: LucideIcon;
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

export function RuleToggle({
  icon: Icon,
  label,
  description,
  checked,
  onToggle,
}: RuleToggleProps) {
  return (
    <label className="card-inset flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-ink-100/60 dark:hover:bg-white/[0.06]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-ink-300 text-brand-600 focus:ring-2 focus:ring-brand-500/40 dark:border-white/20 dark:bg-white/10"
      />
      <span className="min-w-0">
        <span className="flex items-center gap-2 text-sm font-semibold text-ink-900 dark:text-white">
          <Icon size={15} className="text-ink-400" />
          {label}
        </span>
        <span className="mt-1 block text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
          {description}
        </span>
      </span>
    </label>
  );
}
