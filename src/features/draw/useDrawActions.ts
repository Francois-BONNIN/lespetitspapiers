import { useState } from "react";
import { performDraw } from "@/domain/drawAlgorithm";
import { useI18n } from "@/i18n/language-context";
import { useConfirm } from "@/providers/confirm/confirm-context";
import { useToast } from "@/providers/toast/toast-context";
import { clearDraws, saveDraws } from "@/services/storage";
import type { SetupStore } from "@/state/useSetupStore";

const DRAW_SUSPENSE_MS = 700;

export interface DrawActions {
  isDrawing: boolean;
  perform: () => void;
  redraw: () => Promise<void>;
  clear: () => Promise<void>;
}

export function useDrawActions({
  setup,
  drawRules,
  update,
}: SetupStore): DrawActions {
  const toast = useToast();
  const confirm = useConfirm();
  const { t } = useI18n();
  const [isDrawing, setIsDrawing] = useState(false);

  const perform = () => {
    setIsDrawing(true);

    window.setTimeout(() => {
      const results = performDraw(setup.participants, drawRules);

      if (!results) {
        toast.error(t.toast.drawFailed, t.toast.drawFailedDescription);
        setIsDrawing(false);
        return;
      }

      try {
        update({ draws: saveDraws(results) });
        toast.success(
          t.toast.drawDone,
          t.toast.drawDoneDescription(results.length),
        );
      } catch (error) {
        toast.error(t.toast.drawSaveFailed, t.toast.drawSaveFailedDescription);
        console.error(error);
      }

      setIsDrawing(false);
    }, DRAW_SUSPENSE_MS);
  };

  const redraw = async () => {
    const confirmed = await confirm({
      title: t.confirm.redrawTitle,
      description: t.confirm.redrawDescription,
      confirmLabel: t.confirm.redrawConfirm,
    });

    if (confirmed) perform();
  };

  const clear = async () => {
    const confirmed = await confirm({
      title: t.confirm.resetDrawTitle,
      description: t.confirm.resetDrawDescription,
      confirmLabel: t.confirm.resetDrawConfirm,
    });

    if (!confirmed) return;

    try {
      clearDraws();
      update({ draws: [] });
      toast.success(t.toast.drawReset);
    } catch (error) {
      toast.error(t.toast.drawResetFailed);
      console.error(error);
    }
  };

  return { isDrawing, perform, redraw, clear };
}
