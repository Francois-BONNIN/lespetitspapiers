import { Fragment, useMemo } from "react";
import { Target, UserCheck, X } from "lucide-react";
import { useParticipantDirectory } from "@/components/participant/useParticipantDirectory";
import { EmptyState } from "@/components/ui/EmptyState";
import { groupForcedDraws } from "@/domain/forcedDraws";
import type { Inclusion, Participant } from "@/domain/types";
import { useRecentlyAdded } from "@/hooks/useRecentlyAdded";
import { useI18n } from "@/i18n/language-context";

interface ForcedDrawItemProps {
  drawnName: string;
  drawers: Inclusion[];
  nameOf: (id: string) => string;
  isNew: boolean;
  onDelete: (id: string) => void;
}

function ForcedDrawItem({
  drawnName,
  drawers,
  nameOf,
  isNew,
  onDelete,
}: ForcedDrawItemProps) {
  const { t } = useI18n();

  const separatorAfter = (index: number) =>
    index < drawers.length - 2
      ? ", "
      : index === drawers.length - 2
        ? ` ${t.inclusions.or} `
        : "";

  return (
    <li
      className={`flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/[0.08] ${
        isNew ? "item-added" : ""
      }`}
    >
      <UserCheck
        size={15}
        className="mt-1.5 shrink-0 text-emerald-600 dark:text-emerald-400"
      />
      <p className="min-w-0 flex-1 break-words text-sm leading-7 text-ink-600 dark:text-ink-300">
        {drawers.map((inclusion, index) => {
          const drawerName = nameOf(inclusion.included_participant_id);
          const deleteLabel = t.inclusions.deleteLabel(drawerName, drawnName);

          return (
            <Fragment key={inclusion.id}>
              <span className="chip max-w-full gap-1 bg-white py-0.5 pl-2.5 pr-1 align-middle text-sm text-ink-900 ring-1 ring-emerald-200 dark:bg-white/10 dark:text-white dark:ring-emerald-500/30">
                <span className="truncate">{drawerName}</span>
                <button
                  type="button"
                  onClick={() => onDelete(inclusion.id)}
                  className="shrink-0 rounded-full p-0.5 text-ink-400 transition-colors hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-500/20 dark:hover:text-rose-300"
                  aria-label={deleteLabel}
                  title={deleteLabel}
                >
                  <X size={13} />
                </button>
              </span>
              {separatorAfter(index)}
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
}

interface ForcedDrawListProps {
  participants: Participant[];
  inclusions: Inclusion[];
  onDelete: (id: string) => void;
}

export function ForcedDrawList({
  participants,
  inclusions,
  onDelete,
}: ForcedDrawListProps) {
  const { t } = useI18n();
  const directory = useParticipantDirectory(participants);
  const recentlyAdded = useRecentlyAdded(inclusions.map((i) => i.id));
  const forcedDraws = useMemo(() => groupForcedDraws(inclusions), [inclusions]);

  if (forcedDraws.length === 0) {
    return (
      <EmptyState
        icon={Target}
        compact
        title={t.inclusions.emptyTitle}
        description={t.inclusions.emptyDescription}
      />
    );
  }

  return (
    <ul className="space-y-2">
      {forcedDraws.map(({ drawnId, drawers }) => (
        <ForcedDrawItem
          key={drawnId}
          drawnName={directory.nameOf(drawnId)}
          drawers={drawers}
          nameOf={directory.nameOf}
          isNew={drawers.some((d) => recentlyAdded.has(d.id))}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
