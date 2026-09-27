import type { GroupColor } from "@/components/participant/groupColors";
import type { HomonymHint } from "@/domain/homonyms";
import { useI18n } from "@/i18n/language-context";
import { ParticipantPill } from "./ParticipantPill";
import { UNGROUPED, type ParticipantGroup } from "./participantGroups";

interface GroupSectionProps {
  group: ParticipantGroup;
  colors: GroupColor;
  showHeading: boolean;
  recentlyAdded: Set<string>;
  hintOf: (id: string) => HomonymHint | undefined;
  onDelete: (id: string) => void;
}

export function GroupSection({
  group,
  colors,
  showHeading,
  recentlyAdded,
  hintOf,
  onDelete,
}: GroupSectionProps) {
  const { t } = useI18n();

  return (
    <div>
      {showHeading && (
        <div className="mb-2 flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
          <h3
            className={`text-xs font-bold uppercase tracking-wider ${colors.label}`}
          >
            {group.name === UNGROUPED ? t.participants.ungrouped : group.name}
          </h3>
          <span className={`chip ${colors.badge}`}>{group.members.length}</span>
        </div>
      )}
      <ul className="flex flex-wrap gap-2">
        {group.members.map((participant) => (
          <ParticipantPill
            key={participant.id}
            participant={participant}
            hint={hintOf(participant.id)}
            surface={colors.surface}
            isNew={recentlyAdded.has(participant.id)}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
}
