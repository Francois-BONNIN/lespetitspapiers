import { useState } from "react";
import { SectionCard } from "@/components/ui/SectionCard";
import type { Participant } from "@/domain/types";
import { useI18n } from "@/i18n/language-context";
import { CsvImportButton } from "./CsvImportButton";
import { ParticipantForm } from "./ParticipantForm";
import { ParticipantList } from "./ParticipantList";
import { ParticipantSearch } from "./ParticipantSearch";

const SEARCH_THRESHOLD = 3;

interface ParticipantsStepProps {
  participants: Participant[];
  excludeSameFamily: boolean;
  onAddParticipant: (name: string, family: string) => void;
  onDeleteParticipant: (id: string) => void;
  onImportCsv: (file: File) => void;
}

export function ParticipantsStep({
  participants,
  excludeSameFamily,
  onAddParticipant,
  onDeleteParticipant,
  onImportCsv,
}: ParticipantsStepProps) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  return (
    <SectionCard
      step={1}
      title={t.participants.title}
      description={t.participants.description}
      badge={
        participants.length > 0 ? (
          <span className="chip bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
            {participants.length}
          </span>
        ) : null
      }
      actions={<CsvImportButton onImport={onImportCsv} />}
    >
      <ParticipantForm
        participants={participants}
        excludeSameFamily={excludeSameFamily}
        onAdd={onAddParticipant}
      />
      {participants.length > SEARCH_THRESHOLD && (
        <ParticipantSearch value={query} onChange={setQuery} />
      )}
      <ParticipantList
        participants={participants}
        query={query}
        onDelete={onDeleteParticipant}
      />
    </SectionCard>
  );
}
