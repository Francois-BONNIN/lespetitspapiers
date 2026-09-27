import { X } from "lucide-react";
import { ParticipantName } from "@/components/participant/ParticipantName";
import type { HomonymHint } from "@/domain/homonyms";
import type { Participant } from "@/domain/types";
import { useI18n } from "@/i18n/language-context";

interface ParticipantPillProps {
  participant: Participant;
  hint: HomonymHint | undefined;
  surface: string;
  isNew: boolean;
  onDelete: (id: string) => void;
}

export function ParticipantPill({
  participant,
  hint,
  surface,
  isNew,
  onDelete,
}: ParticipantPillProps) {
  const { t } = useI18n();
  const deleteLabel = t.participants.deleteLabel(participant.name);

  return (
    <li
      className={`pill gap-0.5 py-0.5 pl-3 pr-0.5 text-ink-900 dark:text-white ${surface} ${
        isNew ? "item-added" : ""
      }`}
    >
      <ParticipantName
        name={participant.name}
        hint={hint}
        withGroupLabel={false}
      />
      <button
        onClick={() => onDelete(participant.id)}
        className="btn btn-danger-ghost h-7 w-7 shrink-0 rounded-full px-0"
        aria-label={deleteLabel}
        title={deleteLabel}
      >
        <X size={14} />
      </button>
    </li>
  );
}
