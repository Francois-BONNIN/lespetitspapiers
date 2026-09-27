import { useI18n } from "@/i18n/language-context";
import { useConfirm } from "@/providers/confirm/confirm-context";
import { useToast } from "@/providers/toast/toast-context";
import { buildShareUrl, decodeSharePayload } from "@/services/shareLink";
import { replaceAllData } from "@/services/storage";
import type { SetupStore } from "@/state/useSetupStore";

export interface ShareActions {
  copyShareLink: () => Promise<void>;
  copyFullLink: () => Promise<void>;
  openSharedSetup: (payload: string) => Promise<void>;
}

export function useShareActions({ setup, reload }: SetupStore): ShareActions {
  const toast = useToast();
  const confirm = useConfirm();
  const { t } = useI18n();

  const copyLink = async (includeDraws: boolean) => {
    try {
      const url = await buildShareUrl(setup, includeDraws);
      await navigator.clipboard.writeText(url);
      if (includeDraws) {
        toast.success(
          t.toast.fullLinkCopied,
          t.toast.fullLinkCopiedDescription,
        );
      } else {
        toast.success(t.toast.shareCopied, t.toast.shareCopiedDescription);
      }
    } catch (error) {
      toast.error(t.toast.shareFailed, t.toast.copyFailedDescription);
      console.error(error);
    }
  };

  const openSharedSetup = async (payload: string) => {
    const snapshot = await decodeSharePayload(payload);

    if (!snapshot) {
      toast.error(t.toast.sharedInvalid, t.toast.sharedInvalidDescription);
      return;
    }

    const hasLocalData =
      setup.participants.length > 0 || setup.draws.length > 0;
    const participantCount = snapshot.participants.length;
    const withDraw = snapshot.draws.length > 0;

    if (hasLocalData) {
      const ruleCount = snapshot.exclusions.length + snapshot.inclusions.length;
      const confirmed = await confirm({
        title: t.confirm.openSharedTitle,
        description: withDraw
          ? t.confirm.openSharedWithDrawDescription(participantCount, ruleCount)
          : t.confirm.openSharedDescription(participantCount, ruleCount),
        confirmLabel: t.confirm.openSharedConfirm,
      });
      if (!confirmed) return;
    }

    replaceAllData(snapshot);
    reload();
    toast.success(
      t.toast.sharedLoaded,
      withDraw
        ? t.toast.sharedLoadedWithDrawDescription(participantCount)
        : t.toast.sharedLoadedDescription(participantCount),
    );
  };

  return {
    copyShareLink: () => copyLink(false),
    copyFullLink: () => copyLink(true),
    openSharedSetup,
  };
}
