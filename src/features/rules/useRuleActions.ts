import { useI18n } from "@/i18n/language-context";
import { useToast } from "@/providers/toast/toast-context";
import {
  addExclusion,
  addInclusion,
  deleteExclusion,
  deleteInclusion,
  setAvoidReciprocalSetting,
  setExcludeSameFamilySetting,
} from "@/services/storage";
import type { SetupStore } from "@/state/useSetupStore";

export interface RuleActions {
  addExclusion: (participantId: string, excludedId: string) => void;
  deleteExclusion: (id: string) => void;
  addInclusion: (participantId: string, includedId: string) => void;
  deleteInclusion: (id: string) => void;
  toggleExcludeSameFamily: () => void;
  toggleAvoidReciprocal: () => void;
}

export function useRuleActions({ setup, update }: SetupStore): RuleActions {
  const toast = useToast();
  const { t } = useI18n();

  return {
    addExclusion: (participantId, excludedId) => {
      const exists = setup.exclusions.some(
        (e) =>
          e.participant_id === participantId &&
          e.excluded_participant_id === excludedId,
      );

      if (exists) {
        toast.warning(t.toast.exclusionExists);
        return;
      }

      try {
        const exclusion = addExclusion(participantId, excludedId);
        update((current) => ({
          exclusions: [...current.exclusions, exclusion],
        }));
        toast.success(t.toast.exclusionAdded);
      } catch (error) {
        toast.error(t.toast.addFailed, t.toast.exclusionAddFailedDescription);
        console.error(error);
      }
    },

    deleteExclusion: (id) => {
      try {
        deleteExclusion(id);
        update((current) => ({
          exclusions: current.exclusions.filter((e) => e.id !== id),
        }));
        toast.success(t.toast.exclusionDeleted);
      } catch (error) {
        toast.error(t.toast.deleteFailed);
        console.error(error);
      }
    },

    addInclusion: (participantId, includedId) => {
      const exists = setup.inclusions.some(
        (i) =>
          i.participant_id === participantId &&
          i.included_participant_id === includedId,
      );

      if (exists) {
        toast.warning(t.toast.inclusionExists);
        return;
      }

      try {
        const inclusion = addInclusion(participantId, includedId);
        update((current) => ({
          inclusions: [...current.inclusions, inclusion],
        }));
        toast.success(t.toast.inclusionAdded);
      } catch (error) {
        toast.error(t.toast.addFailed, t.toast.inclusionAddFailedDescription);
        console.error(error);
      }
    },

    deleteInclusion: (id) => {
      try {
        deleteInclusion(id);
        update((current) => ({
          inclusions: current.inclusions.filter((i) => i.id !== id),
        }));
        toast.success(t.toast.inclusionDeleted);
      } catch (error) {
        toast.error(t.toast.deleteFailed);
        console.error(error);
      }
    },

    toggleExcludeSameFamily: () => {
      const excludeSameFamily = !setup.excludeSameFamily;
      setExcludeSameFamilySetting(excludeSameFamily);
      update({ excludeSameFamily });
    },

    toggleAvoidReciprocal: () => {
      const avoidReciprocal = !setup.avoidReciprocal;
      setAvoidReciprocalSetting(avoidReciprocal);
      update({ avoidReciprocal });
    },
  };
}
