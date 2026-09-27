import { Fragment, useMemo, useState } from "react";
import { Plus, Target, UserCheck, X } from "lucide-react";
import { Participant, Inclusion } from "../lib/database";
import { useRecentlyAdded } from "../lib/useRecentlyAdded";
import { buildHomonymHints, labelWithHint } from "../lib/homonyms";
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
  const [drawerId, setDrawerId] = useState("");
  const [drawnId, setDrawnId] = useState("");
  const recentlyAdded = useRecentlyAdded(inclusions.map((i) => i.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (drawerId && drawnId && drawerId !== drawnId) {
      onAddInclusion(drawnId, drawerId);
      setDrawerId("");
      setDrawnId("");
    }
  };

  const homonymHints = useMemo(
    () => buildHomonymHints(participants),
    [participants]
  );

  const forcedDraws = useMemo(() => {
    const drawersByDrawn = new Map<string, Inclusion[]>();
    inclusions.forEach((inclusion) => {
      const drawers = drawersByDrawn.get(inclusion.participant_id);
      if (drawers) drawers.push(inclusion);
      else drawersByDrawn.set(inclusion.participant_id, [inclusion]);
    });
    return Array.from(drawersByDrawn.entries());
  }, [inclusions]);

  const getParticipantName = (id: string) =>
    participants.find((p) => p.id === id)?.name ?? t.common.unknown;

  const getOptionLabel = (participant: Participant) =>
    labelWithHint(participant.name, homonymHints.get(participant.id));

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
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end">
              <div className="min-w-0">
                <label className="label" htmlFor="inclusion-drawer">
                  {t.rules.drawerLabel}
                </label>
                <select
                  id="inclusion-drawer"
                  value={drawerId}
                  onChange={(e) => setDrawerId(e.target.value)}
                  className="field w-full min-w-0"
                  required
                >
                  <option value="">{t.common.select}</option>
                  {participants.map((p) => (
                    <option key={p.id} value={p.id}>
                      {getOptionLabel(p)}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-center text-sm font-medium text-ink-500 dark:text-ink-400 sm:flex sm:h-11 sm:items-center">
                {t.inclusions.connector}
              </span>

              <div className="min-w-0">
                <label className="label" htmlFor="inclusion-drawn">
                  {t.rules.drawnLabel}
                </label>
                <select
                  id="inclusion-drawn"
                  value={drawnId}
                  onChange={(e) => setDrawnId(e.target.value)}
                  className="field w-full min-w-0"
                  required
                >
                  <option value="">{t.common.select}</option>
                  {participants
                    .filter((p) => p.id !== drawerId)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {getOptionLabel(p)}
                      </option>
                    ))}
                </select>
              </div>
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

          {forcedDraws.length === 0 ? (
            <EmptyState
              icon={Target}
              compact
              title={t.inclusions.emptyTitle}
              description={t.inclusions.emptyDescription}
            />
          ) : (
            <ul className="space-y-2">
              {forcedDraws.map(([drawnParticipantId, drawers]) => {
                const drawnName = getParticipantName(drawnParticipantId);

                return (
                  <li
                    key={drawnParticipantId}
                    className={`flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/[0.08] ${
                      drawers.some((d) => recentlyAdded.has(d.id))
                        ? "item-added"
                        : ""
                    }`}
                  >
                    <UserCheck
                      size={15}
                      className="mt-1.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                    />
                    <p className="min-w-0 flex-1 break-words text-sm leading-7 text-ink-600 dark:text-ink-300">
                      {drawers.map((inclusion, index) => {
                        const drawerName = getParticipantName(
                          inclusion.included_participant_id
                        );
                        const separator =
                          index < drawers.length - 2
                            ? ", "
                            : index === drawers.length - 2
                              ? ` ${t.inclusions.or} `
                              : "";

                        return (
                          <Fragment key={inclusion.id}>
                            <span className="chip max-w-full gap-1 bg-white py-0.5 pl-2.5 pr-1 align-middle text-sm text-ink-900 ring-1 ring-emerald-200 dark:bg-white/10 dark:text-white dark:ring-emerald-500/30">
                              <span className="truncate">{drawerName}</span>
                              <button
                                type="button"
                                onClick={() => onDeleteInclusion(inclusion.id)}
                                className="shrink-0 rounded-full p-0.5 text-ink-400 transition-colors hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-500/20 dark:hover:text-rose-300"
                                aria-label={t.inclusions.deleteLabel(
                                  drawerName,
                                  drawnName
                                )}
                                title={t.inclusions.deleteLabel(
                                  drawerName,
                                  drawnName
                                )}
                              >
                                <X size={13} />
                              </button>
                            </span>
                            {separator}
                          </Fragment>
                        );
                      })}{" "}
                      {t.inclusions.connector}{" "}
                      <span className="font-semibold text-ink-900 dark:text-white">
                        {drawnName}
                      </span>
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </>
  );
}
