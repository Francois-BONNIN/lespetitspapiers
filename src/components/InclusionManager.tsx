import { useState } from "react";
import { Info, Plus, Target, Trash2, UserCheck } from "lucide-react";
import { Participant, Inclusion } from "../lib/database";
import { useRecentlyAdded } from "../lib/useRecentlyAdded";
import { EmptyState } from "./ui/EmptyState";
import { useI18n } from "./ui/language-context";

interface InclusionManagerProps {
  participants: Participant[];
  inclusions: Inclusion[];
  onAddInclusion: (participantId: string, includedId: string) => void;
  onDeleteInclusion: (id: string) => void;
}

export function InclusionManager({
  participants,
  inclusions,
  onAddInclusion,
  onDeleteInclusion,
}: InclusionManagerProps) {
  const { t } = useI18n();
  const [participantId, setParticipantId] = useState("");
  const [includedId, setIncludedId] = useState("");
  const recentlyAdded = useRecentlyAdded(inclusions.map((i) => i.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (participantId && includedId && participantId !== includedId) {
      onAddInclusion(participantId, includedId);
      setParticipantId("");
      setIncludedId("");
    }
  };

  const getParticipantName = (id: string) =>
    participants.find((p) => p.id === id)?.name ?? t.common.unknown;

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
          <form onSubmit={handleSubmit} className="card-inset mb-4 p-4">
            <div className="grid items-center gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
              <select
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
                className="field w-full min-w-0"
                aria-label={t.inclusions.drawnLabel}
                required
              >
                <option value="">{t.common.select}</option>
                {participants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <span className="text-center text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                {t.inclusions.connector}
              </span>

              <select
                value={includedId}
                onChange={(e) => setIncludedId(e.target.value)}
                className="field w-full min-w-0"
                aria-label={t.inclusions.drawerLabel}
                required
              >
                <option value="">{t.common.select}</option>
                {participants
                  .filter((p) => p.id !== participantId)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>

            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                className="btn btn-md btn-primary"
                disabled={!participantId || !includedId}
              >
                <Plus size={16} />
                {t.common.add}
              </button>
            </div>
          </form>

          {inclusions.length === 0 ? (
            <EmptyState
              icon={Target}
              compact
              title={t.inclusions.emptyTitle}
              description={t.inclusions.emptyDescription}
            />
          ) : (
            <>
              <ul className="space-y-2">
                {inclusions.map((inclusion) => (
                  <li
                    key={inclusion.id}
                    className={`group flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/[0.08] ${
                      recentlyAdded.has(inclusion.id) ? "item-added" : ""
                    }`}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2.5 text-sm">
                      <span className="truncate font-semibold text-ink-900 dark:text-white">
                        {getParticipantName(inclusion.participant_id)}
                      </span>
                      <UserCheck
                        size={15}
                        className="shrink-0 text-emerald-600 dark:text-emerald-400"
                      />
                      <span className="truncate font-semibold text-ink-900 dark:text-white">
                        {getParticipantName(inclusion.included_participant_id)}
                      </span>
                    </div>
                    <button
                      onClick={() => onDeleteInclusion(inclusion.id)}
                      className="btn btn-danger-ghost btn-icon shrink-0 transition-opacity sm:opacity-0 sm:focus-visible:opacity-100 sm:group-hover:opacity-100"
                      aria-label={t.inclusions.deleteLabel}
                    >
                      <Trash2 size={15} />
                    </button>
                  </li>
                ))}
              </ul>

              <p className="mt-4 flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[13px] leading-relaxed text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/[0.08] dark:text-amber-200">
                <Info size={16} className="mt-0.5 shrink-0" />
                <span>{t.inclusions.note}</span>
              </p>
            </>
          )}
        </>
      )}
    </>
  );
}
