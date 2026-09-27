import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { SectionCard } from "@/components/ui/SectionCard";
import type { DrawRules } from "@/domain/drawAlgorithm";
import { countForcedDraws } from "@/domain/forcedDraws";
import type { Participant } from "@/domain/types";
import { useI18n } from "@/i18n/language-context";
import { ExclusionsPanel } from "./ExclusionsPanel";
import { InclusionsPanel } from "./InclusionsPanel";
import { RulesModal } from "./RulesModal";
import { RulesSummary } from "./RulesSummary";

interface RulesStepProps {
  participants: Participant[];
  rules: DrawRules;
  onAddExclusion: (participantId: string, excludedId: string) => void;
  onDeleteExclusion: (id: string) => void;
  onAddInclusion: (participantId: string, includedId: string) => void;
  onDeleteInclusion: (id: string) => void;
  onToggleExcludeSameFamily: () => void;
  onToggleAvoidReciprocal: () => void;
}

export function RulesStep({
  participants,
  rules,
  onAddExclusion,
  onDeleteExclusion,
  onAddInclusion,
  onDeleteInclusion,
  onToggleExcludeSameFamily,
  onToggleAvoidReciprocal,
}: RulesStepProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const hasGroups = participants.some((p) => p.family?.trim());
  const forcedDrawCount = countForcedDraws(rules.inclusions);

  return (
    <>
      <SectionCard
        step={2}
        title={t.rules.stepTitle}
        description={t.rules.description}
        badge={
          <span className="chip bg-ink-100 text-ink-600 dark:bg-white/[0.08] dark:text-ink-300">
            {t.rules.optional}
          </span>
        }
        actions={
          <button
            onClick={() => setOpen(true)}
            className="btn btn-sm btn-outline"
            title={t.rules.openLabel}
          >
            <SlidersHorizontal size={15} />
            {t.rules.configure}
          </button>
        }
      >
        <RulesSummary
          rules={rules}
          hasGroups={hasGroups}
          forcedDrawCount={forcedDrawCount}
        />
      </SectionCard>

      <RulesModal
        open={open}
        onClose={() => setOpen(false)}
        exclusionCount={rules.exclusions.length}
        forcedDrawCount={forcedDrawCount}
        exclusionsPanel={
          <ExclusionsPanel
            participants={participants}
            exclusions={rules.exclusions}
            excludeSameFamily={rules.excludeSameFamily}
            avoidReciprocal={rules.avoidReciprocal}
            onAddExclusion={onAddExclusion}
            onDeleteExclusion={onDeleteExclusion}
            onToggleExcludeSameFamily={onToggleExcludeSameFamily}
            onToggleAvoidReciprocal={onToggleAvoidReciprocal}
          />
        }
        inclusionsPanel={
          <InclusionsPanel
            participants={participants}
            inclusions={rules.inclusions}
            onAddInclusion={onAddInclusion}
            onDeleteInclusion={onDeleteInclusion}
          />
        }
      />
    </>
  );
}
