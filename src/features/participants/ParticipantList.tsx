import { useMemo } from "react";
import { Search, Users } from "lucide-react";
import {
  assignGroupColors,
  getGroupColor,
} from "@/components/participant/groupColors";
import { useParticipantDirectory } from "@/components/participant/useParticipantDirectory";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Participant } from "@/domain/types";
import { useRecentlyAdded } from "@/hooks/useRecentlyAdded";
import { useI18n } from "@/i18n/language-context";
import { GroupSection } from "./GroupSection";
import {
  UNGROUPED,
  groupParticipants,
  searchParticipants,
} from "./participantGroups";

interface ParticipantListProps {
  participants: Participant[];
  query: string;
  onDelete: (id: string) => void;
}

export function ParticipantList({
  participants,
  query,
  onDelete,
}: ParticipantListProps) {
  const { t } = useI18n();
  const locale = t.meta.locale;
  const directory = useParticipantDirectory(participants);
  const recentlyAdded = useRecentlyAdded(participants.map((p) => p.id));

  const groupColors = useMemo(
    () => assignGroupColors(participants),
    [participants],
  );

  const groups = useMemo(
    () => groupParticipants(searchParticipants(participants, query), locale),
    [participants, query, locale],
  );

  if (participants.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title={t.participants.emptyTitle}
        description={t.participants.emptyDescription}
      />
    );
  }

  if (groups.length === 0) {
    return (
      <EmptyState
        icon={Search}
        compact
        title={t.participants.noResultTitle}
        description={t.participants.noResultDescription(query)}
      />
    );
  }

  const hasNamedGroup = groups.some((group) => group.name !== UNGROUPED);

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <GroupSection
          key={group.name || "__ungrouped__"}
          group={group}
          colors={getGroupColor(groupColors, group.name)}
          showHeading={group.name !== UNGROUPED || hasNamedGroup}
          recentlyAdded={recentlyAdded}
          hintOf={directory.hintOf}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
