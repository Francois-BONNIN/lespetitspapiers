import type { Participant } from "./types";
import { buildHomonymHints, labelWithHint, type HomonymHint } from "./homonyms";

export interface ParticipantDirectory {
  hintOf: (id: string) => HomonymHint | undefined;
  nameOf: (id: string) => string;
  labelOf: (id: string) => string;
  groupOf: (id: string) => string;
}

export function createParticipantDirectory(
  participants: Participant[],
  unknownName: string,
): ParticipantDirectory {
  const byId = new Map(participants.map((p) => [p.id, p]));
  const hints = buildHomonymHints(participants);

  return {
    hintOf: (id) => hints.get(id),
    nameOf: (id) => byId.get(id)?.name ?? unknownName,
    labelOf: (id) => {
      const participant = byId.get(id);
      return participant
        ? labelWithHint(participant.name, hints.get(id))
        : unknownName;
    },
    groupOf: (id) => byId.get(id)?.family?.trim() ?? "",
  };
}
