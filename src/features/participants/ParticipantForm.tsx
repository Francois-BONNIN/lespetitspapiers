import { useMemo, useRef, useState, type FormEvent } from "react";
import { Info, UserPlus } from "lucide-react";
import { FieldLabel } from "@/components/ui/FieldLabel";
import type { Participant } from "@/domain/types";
import { useI18n } from "@/i18n/language-context";
import { listKnownGroups } from "./participantGroups";

interface ParticipantFormProps {
  participants: Participant[];
  excludeSameFamily: boolean;
  onAdd: (name: string, family: string) => void;
}

export function ParticipantForm({
  participants,
  excludeSameFamily,
  onAdd,
}: ParticipantFormProps) {
  const { t } = useI18n();
  const locale = t.meta.locale;
  const [name, setName] = useState("");
  const [family, setFamily] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  const knownGroups = useMemo(
    () => listKnownGroups(participants, locale),
    [participants, locale],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), family.trim());
    setName("");
    nameInputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="card-inset mb-5 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <FieldLabel htmlFor="participant-name">
            {t.participants.nameLabel}
          </FieldLabel>
          <input
            id="participant-name"
            ref={nameInputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.participants.namePlaceholder}
            className="field"
            required
          />
        </div>
        <div className="flex-1">
          <FieldLabel htmlFor="participant-group" optional>
            {t.participants.groupLabel}
          </FieldLabel>
          <input
            id="participant-group"
            type="text"
            value={family}
            onChange={(e) => setFamily(e.target.value)}
            placeholder={t.participants.groupPlaceholder}
            className="field"
            list="known-groups"
            autoComplete="off"
            aria-describedby="participant-group-hint"
          />
          <datalist id="known-groups">
            {knownGroups.map((group) => (
              <option key={group} value={group} />
            ))}
          </datalist>
        </div>
        <button type="submit" className="btn btn-md btn-primary sm:w-auto">
          <UserPlus size={17} />
          {t.common.add}
        </button>
      </div>
      <p
        id="participant-group-hint"
        className="mt-3 flex gap-2 text-xs leading-relaxed text-ink-500 dark:text-ink-400"
      >
        <Info size={14} className="mt-px shrink-0" />
        {excludeSameFamily
          ? t.participants.groupHintSameGroup
          : t.participants.groupHintFree}
      </p>
    </form>
  );
}
