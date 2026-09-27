import { useEffect, useState } from "react";
import { useLatest } from "@/hooks/useLatest";
import { useI18n } from "@/i18n/language-context";
import { useToast } from "@/providers/toast/toast-context";
import {
  clearLinkFromUrl,
  decodeRevealPayload,
  readRevealPayloadFromUrl,
  type PersonalDraw,
} from "@/services/shareLink";

export type PersonalDrawState = PersonalDraw | "loading" | null;

export function usePersonalDrawLink() {
  const toast = useToast();
  const { t } = useI18n();
  const [personalDraw, setPersonalDraw] = useState<PersonalDrawState>(() =>
    readRevealPayloadFromUrl() ? "loading" : null,
  );

  const openRef = useLatest(async (payload: string) => {
    setPersonalDraw("loading");
    const draw = await decodeRevealPayload(payload);

    if (!draw) {
      clearLinkFromUrl();
      setPersonalDraw(null);
      toast.error(t.toast.sharedInvalid, t.toast.sharedInvalidDescription);
      return;
    }

    setPersonalDraw(draw);
  });

  useEffect(() => {
    const syncWithUrl = () => {
      const payload = readRevealPayloadFromUrl();
      if (payload) void openRef.current(payload);
      else setPersonalDraw(null);
    };

    syncWithUrl();
    window.addEventListener("hashchange", syncWithUrl);
    return () => window.removeEventListener("hashchange", syncWithUrl);
  }, [openRef]);

  const exit = () => {
    clearLinkFromUrl();
    setPersonalDraw(null);
  };

  return { personalDraw, exit };
}
