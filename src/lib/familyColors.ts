export interface GroupColor {
  surface: string;
  avatar: string;
  label: string;
  badge: string;
  dot: string;
}

const PALETTE: GroupColor[] = [
  {
    surface:
      "border-brand-200 bg-brand-50/70 dark:border-brand-500/20 dark:bg-brand-500/[0.08]",
    avatar: "bg-brand-500 text-white",
    label: "text-brand-700 dark:text-brand-300",
    badge:
      "bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
    dot: "bg-brand-500",
  },
  {
    surface:
      "border-emerald-200 bg-emerald-50/70 dark:border-emerald-500/20 dark:bg-emerald-500/[0.08]",
    avatar: "bg-emerald-500 text-white",
    label: "text-emerald-700 dark:text-emerald-300",
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  {
    surface:
      "border-amber-200 bg-amber-50/70 dark:border-amber-500/20 dark:bg-amber-500/[0.08]",
    avatar: "bg-amber-500 text-white",
    label: "text-amber-700 dark:text-amber-300",
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  {
    surface:
      "border-rose-200 bg-rose-50/70 dark:border-rose-500/20 dark:bg-rose-500/[0.08]",
    avatar: "bg-rose-500 text-white",
    label: "text-rose-700 dark:text-rose-300",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    dot: "bg-rose-500",
  },
  {
    surface:
      "border-sky-200 bg-sky-50/70 dark:border-sky-500/20 dark:bg-sky-500/[0.08]",
    avatar: "bg-sky-500 text-white",
    label: "text-sky-700 dark:text-sky-300",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  {
    surface:
      "border-violet-200 bg-violet-50/70 dark:border-violet-500/20 dark:bg-violet-500/[0.08]",
    avatar: "bg-violet-500 text-white",
    label: "text-violet-700 dark:text-violet-300",
    badge:
      "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    dot: "bg-violet-500",
  },
  {
    surface:
      "border-teal-200 bg-teal-50/70 dark:border-teal-500/20 dark:bg-teal-500/[0.08]",
    avatar: "bg-teal-500 text-white",
    label: "text-teal-700 dark:text-teal-300",
    badge: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300",
    dot: "bg-teal-500",
  },
  {
    surface:
      "border-fuchsia-200 bg-fuchsia-50/70 dark:border-fuchsia-500/20 dark:bg-fuchsia-500/[0.08]",
    avatar: "bg-fuchsia-500 text-white",
    label: "text-fuchsia-700 dark:text-fuchsia-300",
    badge:
      "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300",
    dot: "bg-fuchsia-500",
  },
];

const NEUTRAL: GroupColor = {
  surface:
    "border-ink-200 bg-ink-50/70 dark:border-white/10 dark:bg-white/[0.04]",
  avatar: "bg-ink-400 text-white dark:bg-ink-600",
  label: "text-ink-600 dark:text-ink-300",
  badge: "bg-ink-100 text-ink-600 dark:bg-white/10 dark:text-ink-300",
  dot: "bg-ink-400",
};

export function getGroupColor(groupName: string): GroupColor {
  if (!groupName) return NEUTRAL;

  let hash = 0;
  for (let i = 0; i < groupName.length; i++) {
    hash = (hash * 31 + groupName.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
