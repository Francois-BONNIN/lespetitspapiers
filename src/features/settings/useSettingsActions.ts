import type { EventSettings } from "@/domain/types";
import { useI18n } from "@/i18n/language-context";
import { useConfirm } from "@/providers/confirm/confirm-context";
import { useToast } from "@/providers/toast/toast-context";
import { clearAllData, saveEventSettings } from "@/services/storage";
import type { SetupStore } from "@/state/useSetupStore";

export interface SettingsActions {
  change: (settings: EventSettings) => void;
  clearAll: () => Promise<void>;
}

export function useSettingsActions({
  update,
  reload,
}: SetupStore): SettingsActions {
  const toast = useToast();
  const confirm = useConfirm();
  const { t } = useI18n();

  const change = (eventSettings: EventSettings) => {
    update({ eventSettings });
    saveEventSettings(eventSettings);
  };

  const clearAll = async () => {
    const confirmed = await confirm({
      title: t.confirm.clearAllTitle,
      description: t.confirm.clearAllDescription,
      confirmLabel: t.confirm.clearAllConfirm,
    });

    if (!confirmed) return;

    if (clearAllData()) {
      reload();
      toast.success(t.toast.allCleared);
    } else {
      toast.error(t.toast.clearAllFailed);
    }
  };

  return { change, clearAll };
}
