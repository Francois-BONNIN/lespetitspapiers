import type { Participant } from "@/domain/types";

export interface GroupColor {
  surface: string;
  label: string;
  badge: string;
  dot: string;
}

export type GroupColors = Map<string, GroupColor>;

const PALETTE: GroupColor[] = [
  {
    surface:
      "border-brand-300 bg-brand-100/80 dark:border-brand-400/30 dark:bg-brand-500/15",
    label: "text-brand-700 dark:text-brand-300",
    badge:
      "bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300",
    dot: "bg-brand-500",
  },
  {
    surface:
      "border-amber-300 bg-amber-100/80 dark:border-amber-400/30 dark:bg-amber-500/15",
    label: "text-amber-700 dark:text-amber-300",
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  {
    surface:
      "border-emerald-300 bg-emerald-100/80 dark:border-emerald-400/30 dark:bg-emerald-500/15",
    label: "text-emerald-700 dark:text-emerald-300",
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  {
    surface:
      "border-rose-300 bg-rose-100/80 dark:border-rose-400/30 dark:bg-rose-500/15",
    label: "text-rose-700 dark:text-rose-300",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    dot: "bg-rose-500",
  },
  {
    surface:
      "border-sky-300 bg-sky-100/80 dark:border-sky-400/30 dark:bg-sky-500/15",
    label: "text-sky-700 dark:text-sky-300",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  {
    surface:
      "border-fuchsia-300 bg-fuchsia-100/80 dark:border-fuchsia-400/30 dark:bg-fuchsia-500/15",
    label: "text-fuchsia-700 dark:text-fuchsia-300",
    badge:
      "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300",
    dot: "bg-fuchsia-500",
  },
  {
    surface:
      "border-lime-300 bg-lime-100/80 dark:border-lime-400/30 dark:bg-lime-500/15",
    label: "text-lime-700 dark:text-lime-300",
    badge: "bg-lime-100 text-lime-700 dark:bg-lime-500/15 dark:text-lime-300",
    dot: "bg-lime-500",
  },
  {
    surface:
      "border-orange-300 bg-orange-100/80 dark:border-orange-400/30 dark:bg-orange-500/15",
    label: "text-orange-700 dark:text-orange-300",
    badge:
      "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
    dot: "bg-orange-500",
  },
];

const NEUTRAL: GroupColor = {
  surface:
    "border-ink-200 bg-ink-50/70 dark:border-white/10 dark:bg-white/[0.04]",
  label: "text-ink-600 dark:text-ink-300",
  badge: "bg-ink-100 text-ink-600 dark:bg-white/10 dark:text-ink-300",
  dot: "bg-ink-400",
};

export function assignGroupColors(participants: Participant[]): GroupColors {
  const colors: GroupColors = new Map();

  participants.forEach((participant) => {
    const group = participant.family?.trim();
    if (group && !colors.has(group)) {
      colors.set(group, PALETTE[colors.size % PALETTE.length]);
    }
  });

  return colors;
}

export function getGroupColor(
  colors: GroupColors,
  group: string | null | undefined
): GroupColor {
  return colors.get(group?.trim() ?? "") ?? NEUTRAL;
}
