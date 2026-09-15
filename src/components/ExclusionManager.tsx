import { useMemo, useState } from "react";
import { ArrowRight, Ban, Plus, Trash2, Users } from "lucide-react";
import { Participant, Exclusion } from "../lib/database";
import { useRecentlyAdded } from "../lib/useRecentlyAdded";
import { buildHomonymHints, labelWithHint } from "../lib/homonyms";
import { EmptyState } from "./ui/EmptyState";
import { useI18n } from "./ui/language-context";

interface ExclusionManagerProps {
  participants: Participant[];
  exclusions: Exclusion[];
  onAddExclusion: (participantId: string, excludedId: string) => void;
  onDeleteExclusion: (id: string) => void;
  excludeSameFamily: boolean;
  onToggleExcludeSameFamily: () => void;
}

export function ExclusionManager({
  participants,
  exclusions,
  onAddExclusion,
  onDeleteExclusion,
  excludeSameFamily,
  onToggleExcludeSameFamily,
}: ExclusionManagerProps) {
  const { t } = useI18n();
  const [participantId, setParticipantId] = useState("");
  const [excludedId, setExcludedId] = useState("");
  const recentlyAdded = useRecentlyAdded(exclusions.map((e) => e.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (participantId && excludedId && participantId !== excludedId) {
      onAddExclusion(participantId, excludedId);
      setParticipantId("");
      setExcludedId("");
    }
  };

  const homonymHints = useMemo(
    () => buildHomonymHints(participants),
    [participants]
  );

  const getParticipantName = (id: string) =>
    participants.find((p) => p.id === id)?.name ?? t.common.unknown;

  const getOptionLabel = (participant: Participant) =>
    labelWithHint(participant.name, homonymHints.get(participant.id));

  return (
    <>
      <p className="mb-4 text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
        {t.exclusions.description}
      </p>

      <label className="card-inset mb-5 flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-ink-100/60 dark:hover:bg-white/[0.06]">
        <input
          type="checkbox"
          checked={excludeSameFamily}
          onChange={onToggleExcludeSameFamily}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-ink-300 text-brand-600 focus:ring-2 focus:ring-brand-500/40 dark:border-white/20 dark:bg-white/10"
        />
        <span className="min-w-0">
          <span className="flex items-center gap-2 text-sm font-semibold text-ink-900 dark:text-white">
            <Users size={15} className="text-ink-400" />
            {t.exclusions.sameGroupLabel}
          </span>
          <span className="mt-1 block text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
            {t.exclusions.sameGroupDescription}
          </span>
        </span>
      </label>

      {participants.length < 2 ? (
        <EmptyState
          icon={Ban}
          compact
          title={t.exclusions.notEnoughTitle}
          description={t.exclusions.notEnoughDescription}
        />
      ) : (
        <>
          <form onSubmit={handleSubmit} className="card-inset mb-4 p-4">
            <div className="grid items-center gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
              <select
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
                className="field w-full min-w-0"
                aria-label={t.exclusions.drawerLabel}
                required
              >
                <option value="">{t.common.select}</option>
                {participants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {getOptionLabel(p)}
                  </option>
                ))}
              </select>

              <span className="text-center text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                {t.exclusions.connector}
              </span>

              <select
                value={excludedId}
                onChange={(e) => setExcludedId(e.target.value)}
                className="field w-full min-w-0"
                aria-label={t.exclusions.excludedLabel}
                required
              >
                <option value="">{t.common.select}</option>
                {participants
                  .filter((p) => p.id !== participantId)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {getOptionLabel(p)}
                    </option>
                  ))}
              </select>

            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                className="btn btn-md btn-primary"
                disabled={!participantId || !excludedId}
              >
                <Plus size={16} />
                {t.common.add}
              </button>
            </div>
          </form>

          {exclusions.length === 0 ? (
            <EmptyState
              icon={Ban}
              compact
              title={t.exclusions.emptyTitle}
              description={t.exclusions.emptyDescription}
            />
          ) : (
            <ul className="space-y-2">
              {exclusions.map((exclusion) => (
                <li
                  key={exclusion.id}
                  className={`group flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50/70 p-3 dark:border-rose-500/20 dark:bg-rose-500/[0.08] ${
                    recentlyAdded.has(exclusion.id) ? "item-added" : ""
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2.5 text-sm">
                    <span className="truncate font-semibold text-ink-900 dark:text-white">
                      {getParticipantName(exclusion.participant_id)}
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-rose-600 dark:text-rose-400">
                      <ArrowRight size={14} />
                      <Ban size={14} />
                    </span>
                    <span className="truncate font-semibold text-ink-900 dark:text-white">
                      {getParticipantName(exclusion.excluded_participant_id)}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteExclusion(exclusion.id)}
                    className="btn btn-danger-ghost btn-icon shrink-0 transition-opacity sm:opacity-0 sm:focus-visible:opacity-100 sm:group-hover:opacity-100"
                    aria-label={t.exclusions.deleteLabel}
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}
