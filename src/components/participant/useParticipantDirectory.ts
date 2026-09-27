import { useMemo } from "react";
import {
  createParticipantDirectory,
  type ParticipantDirectory,
} from "@/domain/participantDirectory";
import type { Participant } from "@/domain/types";
import { useI18n } from "@/i18n/language-context";

export function useParticipantDirectory(
  participants: Participant[],
): ParticipantDirectory {
  const { t } = useI18n();
  const unknownName = t.common.unknown;

  return useMemo(
    () => createParticipantDirectory(participants, unknownName),
    [participants, unknownName],
  );
}
