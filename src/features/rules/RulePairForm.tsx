import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { useParticipantDirectory } from "@/components/participant/useParticipantDirectory";
import { FieldLabel } from "@/components/ui/FieldLabel";
import type { Participant } from "@/domain/types";
import { useI18n } from "@/i18n/language-context";

interface ParticipantSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (id: string) => void;
  participants: Participant[];
  labelOf: (id: string) => string;
}

function ParticipantSelect({
  id,
  label,
  value,
  onChange,
  participants,
  labelOf,
}: ParticipantSelectProps) {
  const { t } = useI18n();

  return (
    <div className="min-w-0">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field w-full min-w-0"
        required
      >
        <option value="">{t.common.select}</option>
        {participants.map((p) => (
          <option key={p.id} value={p.id}>
            {labelOf(p.id)}
          </option>
        ))}
      </select>
    </div>
  );
}

interface RulePairFormProps {
  idPrefix: string;
  participants: Participant[];
  connector: string;
  onSubmit: (drawerId: string, drawnId: string) => void;
}

export function RulePairForm({
  idPrefix,
  participants,
  connector,
  onSubmit,
}: RulePairFormProps) {
  const { t } = useI18n();
  const directory = useParticipantDirectory(participants);
  const [drawerId, setDrawerId] = useState("");
  const [drawnId, setDrawnId] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (drawerId && drawnId && drawerId !== drawnId) {
      onSubmit(drawerId, drawnId);
      setDrawerId("");
      setDrawnId("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-inset mb-4 p-4">
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end">
        <ParticipantSelect
          id={`${idPrefix}-drawer`}
          label={t.rules.drawerLabel}
          value={drawerId}
          onChange={setDrawerId}
          participants={participants}
          labelOf={directory.labelOf}
        />

        <span className="text-center text-sm font-medium text-ink-500 dark:text-ink-400 sm:flex sm:h-11 sm:items-center">
          {connector}
        </span>

        <ParticipantSelect
          id={`${idPrefix}-drawn`}
          label={t.rules.drawnLabel}
          value={drawnId}
          onChange={setDrawnId}
          participants={participants.filter((p) => p.id !== drawerId)}
          labelOf={directory.labelOf}
        />
      </div>
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          className="btn btn-md btn-primary"
          disabled={!drawerId || !drawnId}
        >
          <Plus size={16} />
          {t.common.add}
        </button>
      </div>
    </form>
  );
}
