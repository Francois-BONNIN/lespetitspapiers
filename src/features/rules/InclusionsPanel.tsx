import { Target } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Inclusion, Participant } from "@/domain/types";
import { useI18n } from "@/i18n/language-context";
import { ForcedDrawList } from "./ForcedDrawList";
import { RulePairForm } from "./RulePairForm";

interface InclusionsPanelProps {
  participants: Participant[];
  inclusions: Inclusion[];
  onAddInclusion: (participantId: string, includedId: string) => void;
  onDeleteInclusion: (id: string) => void;
}

export function InclusionsPanel({
  participants,
  inclusions,
  onAddInclusion,
  onDeleteInclusion,
}: InclusionsPanelProps) {
  const { t } = useI18n();

  return (
    <>
      <p className="mb-4 text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
        {t.inclusions.description}
      </p>

      {participants.length < 2 ? (
        <EmptyState
          icon={Target}
          compact
          title={t.inclusions.notEnoughTitle}
          description={t.inclusions.notEnoughDescription}
        />
      ) : (
        <>
          <RulePairForm
            idPrefix="inclusion"
            participants={participants}
            connector={t.inclusions.connector}
            onSubmit={(drawerId, drawnId) => onAddInclusion(drawnId, drawerId)}
          />
          <ForcedDrawList
            participants={participants}
            inclusions={inclusions}
            onDelete={onDeleteInclusion}
          />
        </>
      )}
    </>
  );
}
