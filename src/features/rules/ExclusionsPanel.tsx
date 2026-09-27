import { ArrowLeftRight, Ban, Users } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Exclusion, Participant } from "@/domain/types";
import { useI18n } from "@/i18n/language-context";
import { ExclusionList } from "./ExclusionList";
import { RulePairForm } from "./RulePairForm";
import { RuleToggle } from "./RuleToggle";

interface ExclusionsPanelProps {
  participants: Participant[];
  exclusions: Exclusion[];
  excludeSameFamily: boolean;
  avoidReciprocal: boolean;
  onAddExclusion: (participantId: string, excludedId: string) => void;
  onDeleteExclusion: (id: string) => void;
  onToggleExcludeSameFamily: () => void;
  onToggleAvoidReciprocal: () => void;
}

export function ExclusionsPanel({
  participants,
  exclusions,
  excludeSameFamily,
  avoidReciprocal,
  onAddExclusion,
  onDeleteExclusion,
  onToggleExcludeSameFamily,
  onToggleAvoidReciprocal,
}: ExclusionsPanelProps) {
  const { t } = useI18n();

  return (
    <>
      <p className="mb-4 text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
        {t.exclusions.description}
      </p>

      <div className="mb-5 space-y-2">
        <RuleToggle
          icon={Users}
          label={t.exclusions.sameGroupLabel}
          description={t.exclusions.sameGroupDescription}
          checked={excludeSameFamily}
          onToggle={onToggleExcludeSameFamily}
        />
        <RuleToggle
          icon={ArrowLeftRight}
          label={t.exclusions.reciprocalLabel}
          description={t.exclusions.reciprocalDescription}
          checked={avoidReciprocal}
          onToggle={onToggleAvoidReciprocal}
        />
      </div>

      {participants.length < 2 ? (
        <EmptyState
          icon={Ban}
          compact
          title={t.exclusions.notEnoughTitle}
          description={t.exclusions.notEnoughDescription}
        />
      ) : (
        <>
          <RulePairForm
            idPrefix="exclusion"
            participants={participants}
            connector={t.exclusions.connector}
            onSubmit={onAddExclusion}
          />
          <ExclusionList
            participants={participants}
            exclusions={exclusions}
            onDelete={onDeleteExclusion}
          />
        </>
      )}
    </>
  );
}
