import { useEffect, useState } from "react";
import { buildDrawMessage } from "@/domain/message";
import type { ParticipantDirectory } from "@/domain/participantDirectory";
import type { Draw, EventSettings } from "@/domain/types";
import { useI18n } from "@/i18n/language-context";
import { useToast } from "@/providers/toast/toast-context";
import { buildRevealUrl, type PersonalDraw } from "@/services/shareLink";

const COPIED_FEEDBACK_MS = 2000;
const MESSAGE_SEPARATOR = "\n\n———\n\n";

type PendingLink = string | Promise<string>;

export interface DrawMessages {
  copiedId: string | null;
  copyMessage: (draw: Draw) => void;
  copyAll: () => void;
}

function toPersonalDraw(
  draw: Draw,
  directory: ParticipantDirectory,
  settings: EventSettings,
): PersonalDraw {
  return {
    drawerName: directory.labelOf(draw.drawer_id),
    drawnName: directory.labelOf(draw.drawn_id),
    eventName: settings.eventName.trim(),
    budget: settings.budget.trim(),
    exchangeDate: settings.exchangeDate,
    drawDate: draw.draw_date,
  };
}

export function useDrawMessages(
  draws: Draw[],
  directory: ParticipantDirectory,
  eventSettings: EventSettings,
): DrawMessages {
  const toast = useToast();
  const { t } = useI18n();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [personalLinks, setPersonalLinks] = useState<Map<string, string>>(
    () => new Map(),
  );
  const sendsLink = eventSettings.delivery === "link";

  useEffect(() => {
    if (!sendsLink || draws.length === 0) return;

    let cancelled = false;
    Promise.all(
      draws.map(
        async (draw) =>
          [
            draw.id,
            await buildRevealUrl(toPersonalDraw(draw, directory, eventSettings)),
          ] as const,
      ),
    ).then(
      (entries) => {
        if (!cancelled) setPersonalLinks(new Map(entries));
      },
      (error) => console.error(error),
    );

    return () => {
      cancelled = true;
    };
  }, [sendsLink, draws, directory, eventSettings]);

  const copyText = async (text: string, onDone: () => void) => {
    try {
      await navigator.clipboard.writeText(text);
      onDone();
    } catch {
      toast.error(t.toast.copyFailed, t.toast.copyFailedDescription);
    }
  };

  const linkFor = (draw: Draw): PendingLink =>
    !sendsLink
      ? ""
      : (personalLinks.get(draw.id) ??
        buildRevealUrl(toPersonalDraw(draw, directory, eventSettings)));

  const whenLinksReady = (
    links: PendingLink[],
    onReady: (resolved: string[]) => void,
  ) => {
    if (links.every((link): link is string => typeof link === "string")) {
      onReady(links);
      return;
    }
    Promise.all(links).then(onReady, (error) => {
      console.error(error);
      toast.error(t.toast.copyFailed);
    });
  };

  const messageFor = (draw: Draw, link: string) =>
    buildDrawMessage(
      directory.labelOf(draw.drawer_id),
      directory.labelOf(draw.drawn_id),
      eventSettings,
      t,
      link,
    );

  const copyMessage = (draw: Draw) => {
    whenLinksReady([linkFor(draw)], ([link]) =>
      copyText(messageFor(draw, link), () => {
        setCopiedId(draw.id);
        window.setTimeout(() => setCopiedId(null), COPIED_FEEDBACK_MS);
      }),
    );
  };

  const copyAll = () => {
    whenLinksReady(draws.map(linkFor), (links) => {
      const all = draws
        .map((draw, index) => messageFor(draw, links[index]))
        .join(MESSAGE_SEPARATOR);
      copyText(all, () =>
        toast.success(
          t.toast.messagesCopied,
          t.toast.messagesCopiedDescription(draws.length),
        ),
      );
    });
  };

  return { copiedId, copyMessage, copyAll };
}
