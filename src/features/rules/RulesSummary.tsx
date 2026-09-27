import type { ReactNode } from "react";
import { ArrowLeftRight, Ban, Target, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DrawRules } from "@/domain/drawAlgorithm";
import { useI18n } from "@/i18n/language-context";

const CHIP_TONES = {
  neutral: "bg-ink-100 text-ink-600 dark:bg-white/[0.08] dark:text-ink-300",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  emerald:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
};

interface RuleChipProps {
  icon: LucideIcon;
  tone: keyof typeof CHIP_TONES;
  children: ReactNode;
}

function RuleChip({ icon: Icon, tone, children }: RuleChipProps) {
  return (
    <span className={`chip ${CHIP_TONES[tone]}`}>
      <Icon size={12} />
      {children}
    </span>
  );
}

interface RulesSummaryProps {
  rules: DrawRules;
  hasGroups: boolean;
  forcedDrawCount: number;
}

export function RulesSummary({
  rules,
  hasGroups,
  forcedDrawCount,
}: RulesSummaryProps) {
  const { t } = useI18n();
  const sameGroupApplies = rules.excludeSameFamily && hasGroups;
  const exclusionCount = rules.exclusions.length;
  const hasRule =
    sameGroupApplies ||
    rules.avoidReciprocal ||
    exclusionCount > 0 ||
    forcedDrawCount > 0;

  if (!hasRule) {
    return (
      <p className="text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
        {t.rules.none}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {sameGroupApplies && (
        <RuleChip icon={Users} tone="neutral">
          {t.rules.summarySameGroup}
        </RuleChip>
      )}
      {rules.avoidReciprocal && (
        <RuleChip icon={ArrowLeftRight} tone="neutral">
          {t.rules.summaryNoReciprocal}
        </RuleChip>
      )}
      {exclusionCount > 0 && (
        <RuleChip icon={Ban} tone="rose">
          {t.rules.summaryExclusions(exclusionCount)}
        </RuleChip>
      )}
      {forcedDrawCount > 0 && (
        <RuleChip icon={Target} tone="emerald">
          {t.rules.summaryInclusions(forcedDrawCount)}
        </RuleChip>
      )}
    </div>
  );
}
