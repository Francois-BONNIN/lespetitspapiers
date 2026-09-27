import type { Participant } from "@/domain/types";

export const UNGROUPED = "";

export interface ParticipantGroup {
  name: string;
  members: Participant[];
}

export function listKnownGroups(
  participants: Participant[],
  locale: string,
): string[] {
  return Array.from(
    new Set(
      participants
        .map((p) => p.family?.trim())
        .filter((group): group is string => Boolean(group)),
    ),
  ).sort((a, b) => a.localeCompare(b, locale));
}

export function searchParticipants(
  participants: Participant[],
  query: string,
): Participant[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return participants;
  return participants.filter((p) =>
    [p.name, p.family]
      .filter((value): value is string => Boolean(value))
      .some((value) => value.toLowerCase().includes(needle)),
  );
}

export function groupParticipants(
  participants: Participant[],
  locale: string,
): ParticipantGroup[] {
  const membersByGroup = new Map<string, Participant[]>();
  participants.forEach((participant) => {
    const name = participant.family?.trim() || UNGROUPED;
    const members = membersByGroup.get(name);
    if (members) members.push(participant);
    else membersByGroup.set(name, [participant]);
  });

  return Array.from(membersByGroup, ([name, members]) => ({
    name,
    members,
  })).sort((a, b) => {
    if (a.name === UNGROUPED) return 1;
    if (b.name === UNGROUPED) return -1;
    return a.name.localeCompare(b.name, locale);
  });
}
