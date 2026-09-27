import type { Setup } from "@/domain/types";
import { useI18n } from "@/i18n/language-context";
import { useConfirm } from "@/providers/confirm/confirm-context";
import { useToast } from "@/providers/toast/toast-context";
import { importParticipantsFromCSV, type ImportResult } from "@/services/csv";
import {
  addExclusion,
  addInclusion,
  addParticipant,
  deleteParticipant,
} from "@/services/storage";
import type { SetupStore } from "@/state/useSetupStore";

export interface ParticipantActions {
  add: (name: string, family: string) => void;
  remove: (id: string) => Promise<void>;
  importCsv: (file: File) => Promise<void>;
}

function countLinkedRules({ exclusions, inclusions }: Setup, id: string) {
  return (
    exclusions.filter(
      (e) => e.participant_id === id || e.excluded_participant_id === id,
    ).length +
    inclusions.filter(
      (i) => i.participant_id === id || i.included_participant_id === id,
    ).length
  );
}

function storeImport(result: ImportResult): void {
  const idByName = new Map<string, string>();
  result.participants.forEach((p) => {
    idByName.set(p.name, addParticipant(p.name, p.family).id);
  });

  result.exclusions.forEach((e) => {
    const participantId = idByName.get(e.participantName);
    const excludedId = idByName.get(e.excludedName);
    if (participantId && excludedId) {
      try {
        addExclusion(participantId, excludedId);
      } catch (error) {
        console.error("Erreur lors de l'ajout d'une exclusion:", error);
      }
    }
  });

  result.inclusions.forEach((i) => {
    const participantId = idByName.get(i.participantName);
    const includedId = idByName.get(i.includedName);
    if (participantId && includedId) {
      try {
        addInclusion(participantId, includedId);
      } catch (error) {
        console.error("Erreur lors de l'ajout d'une inclusion:", error);
      }
    }
  });
}

export function useParticipantActions({
  setup,
  update,
  reload,
}: SetupStore): ParticipantActions {
  const toast = useToast();
  const confirm = useConfirm();
  const { t } = useI18n();

  const add = (name: string, family: string) => {
    const duplicate = setup.participants.some(
      (p) => p.name.toLowerCase() === name.toLowerCase(),
    );

    try {
      const participant = addParticipant(name, family || null);
      update((current) => ({
        participants: [...current.participants, participant],
      }));
      if (duplicate) {
        toast.warning(
          t.toast.participantAdded(name),
          t.toast.participantDuplicate,
        );
      } else {
        toast.success(t.toast.participantAdded(name));
      }
    } catch (error) {
      toast.error(t.toast.addFailed, t.toast.participantAddFailedDescription);
      console.error(error);
    }
  };

  const remove = async (id: string) => {
    const participant = setup.participants.find((p) => p.id === id);
    const linkedRules = countLinkedRules(setup, id);

    const confirmed = await confirm({
      title: t.confirm.deleteParticipantTitle(
        participant?.name ?? t.confirm.deleteParticipantFallback,
      ),
      description:
        [
          linkedRules > 0 ? t.confirm.linkedConstraints(linkedRules) : null,
          setup.draws.length > 0 ? t.confirm.drawInvalidated : null,
        ]
          .filter(Boolean)
          .join(" ") || t.confirm.irreversible,
      confirmLabel: t.common.delete,
    });

    if (!confirmed) return;

    try {
      deleteParticipant(id);
      reload();
      toast.success(t.toast.participantDeleted);
    } catch (error) {
      toast.error(t.toast.deleteFailed);
      console.error(error);
    }
  };

  const importCsv = async (file: File) => {
    try {
      const result = importParticipantsFromCSV(await file.text());

      if (!result) {
        toast.error(t.toast.importFailed, t.toast.importFailedDescription);
        return;
      }

      storeImport(result);
      reload();
      toast.success(
        t.toast.importDone,
        t.toast.importDoneDescription(result.participants.length),
      );
    } catch (error) {
      toast.error(
        t.toast.importReadFailed,
        t.toast.importReadFailedDescription,
      );
      console.error(error);
    }
  };

  return { add, remove, importCsv };
}
