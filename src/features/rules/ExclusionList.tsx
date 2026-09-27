import { Ban, Trash2 } from "lucide-react";
import { useParticipantDirectory } from "@/components/participant/useParticipantDirectory";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Exclusion, Participant } from "@/domain/types";
import { useRecentlyAdded } from "@/hooks/useRecentlyAdded";
import { useI18n } from "@/i18n/language-context";

interface ExclusionListProps {
  participants: Participant[];
  exclusions: Exclusion[];
  onDelete: (id: string) => void;
}

export function ExclusionList({
  participants,
  exclusions,
  onDelete,
}: ExclusionListProps) {
  const { t } = useI18n();
  const directory = useParticipantDirectory(participants);
  const recentlyAdded = useRecentlyAdded(exclusions.map((e) => e.id));

  if (exclusions.length === 0) {
    return (
      <EmptyState
        icon={Ban}
        compact
        title={t.exclusions.emptyTitle}
        description={t.exclusions.emptyDescription}
      />
    );
  }

  return (
    <ul className="space-y-2">
      {exclusions.map((exclusion) => (
        <li
          key={exclusion.id}
          className={`group flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50/70 p-3 dark:border-rose-500/20 dark:bg-rose-500/[0.08] ${
            recentlyAdded.has(exclusion.id) ? "item-added" : ""
          }`}
        >
          <div className="flex min-w-0 flex-1 items-start gap-2.5">
            <Ban
              size={15}
              className="mt-0.5 shrink-0 text-rose-600 dark:text-rose-400"
            />
            <p className="min-w-0 break-words text-sm text-ink-600 dark:text-ink-300">
              <span className="font-semibold text-ink-900 dark:text-white">
                {directory.nameOf(exclusion.participant_id)}
              </span>{" "}
              {t.exclusions.connector}{" "}
              <span className="font-semibold text-ink-900 dark:text-white">
                {directory.nameOf(exclusion.excluded_participant_id)}
              </span>
            </p>
          </div>
          <button
            onClick={() => onDelete(exclusion.id)}
            className="reveal-on-hover btn btn-danger-ghost btn-icon shrink-0"
            aria-label={t.exclusions.deleteLabel}
          >
            <Trash2 size={15} />
          </button>
        </li>
      ))}
    </ul>
  );
}
