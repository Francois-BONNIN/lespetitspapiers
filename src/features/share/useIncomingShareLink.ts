import { useEffect } from "react";
import { useLatest } from "@/hooks/useLatest";
import { takeSharePayloadFromUrl } from "@/services/shareLink";

export function useIncomingShareLink(onPayload: (payload: string) => void) {
  const onPayloadRef = useLatest(onPayload);

  useEffect(() => {
    const takeLink = () => {
      const payload = takeSharePayloadFromUrl();
      if (payload) onPayloadRef.current(payload);
    };

    takeLink();
    window.addEventListener("hashchange", takeLink);
    return () => window.removeEventListener("hashchange", takeLink);
  }, [onPayloadRef]);
}
