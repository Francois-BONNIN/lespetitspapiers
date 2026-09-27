import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Copy,
  Download,
  Eye,
  EyeOff,
  Info,
  MoreHorizontal,
  PenLine,
  RotateCcw,
  Shuffle,
  Sparkles,
} from "lucide-react";
import { Participant, Draw, EventSettings } from "../lib/database";
import { exportDrawsToCSV, downloadCSV } from "../lib/csvExport";
import { buildDrawMessage } from "../lib/message";
import { buildRevealUrl, type PersonalDraw } from "../lib/shareLink";
import { buildHomonymHints, labelWithHint } from "../lib/homonyms";
import { getGroupColor } from "../lib/familyColors";
import { SectionCard } from "./ui/SectionCard";
import { ActionMenu } from "./ui/ActionMenu";
import { EmptyState } from "./ui/EmptyState";
import { ParticipantName } from "./ui/ParticipantName";
import { useToast } from "./ui/toast-context";
import { useI18n } from "./ui/language-context";

interface DrawManagerProps {
  participants: Participant[];
  draws: Draw[];
  eventSettings: EventSettings;
  isStale: boolean;
  onPerformDraw: () => void;
  onRedraw: () => void;
  onClearDraws: () => void;
  onCustomizeMessage: () => void;
  isDrawing: boolean;
}

function toPersonalDraw(
  draw: Draw,
  labels: Map<string, string>,
  unknownLabel: string,
  settings: EventSettings
): PersonalDraw {
  return {
    drawerName: labels.get(draw.drawer_id) ?? unknownLabel,
    drawnName: labels.get(draw.drawn_id) ?? unknownLabel,
    eventName: settings.eventName.trim(),
    budget: settings.budget.trim(),
    exchangeDate: settings.exchangeDate,
    drawDate: draw.draw_date,
  };
}

export function DrawManager({
  participants,
  draws,
  eventSettings,
  isStale,
  onPerformDraw,
  onRedraw,
  onClearDraws,
  onCustomizeMessage,
  isDrawing,
}: DrawManagerProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const toast = useToast();
  const { t } = useI18n();

  const getParticipantName = (id: string) =>
    participants.find((p) => p.id === id)?.name ?? t.common.unknown;

  const getGroupColorOf = (id: string) =>
    getGroupColor(
      participants.find((p) => p.id === id)?.family?.trim() ?? ""
    );

  const homonymHints = useMemo(
    () => buildHomonymHints(participants),
    [participants]
  );

  const participantLabels = useMemo(
    () =>
      new Map(
        participants.map((p) => [
          p.id,
          labelWithHint(p.name, homonymHints.get(p.id)),
        ])
      ),
    [participants, homonymHints]
  );

  const unknownLabel = t.common.unknown;
  const getParticipantLabel = (id: string) =>
    participantLabels.get(id) ?? unknownLabel;

  const sendsLink = eventSettings.delivery === "link";
  const [personalLinks, setPersonalLinks] = useState<Map<string, string>>(
    () => new Map()
  );

  useEffect(() => {
    if (!sendsLink || draws.length === 0) return;

    let cancelled = false;
    Promise.all(
      draws.map(
        async (draw) =>
          [
            draw.id,
            await buildRevealUrl(
              toPersonalDraw(draw, participantLabels, unknownLabel, eventSettings)
            ),
          ] as const
      )
    ).then(
      (entries) => {
        if (!cancelled) setPersonalLinks(new Map(entries));
      },
      (error) => console.error(error)
    );

    return () => {
      cancelled = true;
    };
  }, [sendsLink, draws, participantLabels, unknownLabel, eventSettings]);

  const hasDraws = draws.length > 0;
  const allRevealed = hasDraws && revealedIds.size === draws.length;

  const sortedDraws = useMemo(
    () =>
      [...draws].sort((a, b) =>
        getParticipantName(a.drawer_id).localeCompare(
          getParticipantName(b.drawer_id),
          t.meta.locale
        )
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [draws, participants, t]
  );

  const toggleReveal = (id: string) => {
    setRevealedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleRevealAll = () => {
    setRevealedIds(allRevealed ? new Set() : new Set(draws.map((d) => d.id)));
  };

  const handleExportDraws = () => {
    downloadCSV(
      exportDrawsToCSV(draws, participants, t),
      `${t.csv.drawsFilename}-${new Date().toISOString().split("T")[0]}.csv`
    );
    toast.success(t.toast.exportStarted, t.toast.exportDrawsDescription);
  };

  const copyText = async (text: string, onDone: () => void) => {
    try {
      await navigator.clipboard.writeText(text);
      onDone();
    } catch {
      toast.error(t.toast.copyFailed, t.toast.copyFailedDescription);
    }
  };

  const linkFor = (draw: Draw): string | Promise<string> =>
    !sendsLink
      ? ""
      : personalLinks.get(draw.id) ??
        buildRevealUrl(
          toPersonalDraw(draw, participantLabels, unknownLabel, eventSettings)
        );

  const whenLinksReady = (
    links: Array<string | Promise<string>>,
    onReady: (resolved: string[]) => void
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
      getParticipantLabel(draw.drawer_id),
      getParticipantLabel(draw.drawn_id),
      eventSettings,
      t,
      link
    );

  const handleCopyMessage = (draw: Draw) => {
    whenLinksReady([linkFor(draw)], ([link]) =>
      copyText(messageFor(draw, link), () => {
        setCopiedId(draw.id);
        window.setTimeout(() => setCopiedId(null), 2000);
      })
    );
  };

  const handleCopyAll = () => {
    whenLinksReady(sortedDraws.map(linkFor), (links) => {
      const all = sortedDraws
        .map((draw, index) => messageFor(draw, links[index]))
        .join("\n\n———\n\n");
      copyText(all, () =>
        toast.success(
          t.toast.messagesCopied,
          t.toast.messagesCopiedDescription(draws.length)
        )
      );
    });
  };

  return (
    <SectionCard
      step={3}
      title={t.draw.title}
      description={
        hasDraws ? t.draw.descriptionDone : t.draw.descriptionPending
      }
      actions={
        hasDraws ? (
          <>
            <ActionMenu
              icon={MoreHorizontal}
              label={t.draw.moreActions}
              items={[
                {
                  id: "reveal-all",
                  icon: allRevealed ? EyeOff : Eye,
                  label: allRevealed ? t.draw.hideAll : t.draw.revealAll,
                  description: allRevealed
                    ? t.draw.hideAllDescription
                    : t.draw.revealAllDescription,
                  onSelect: toggleRevealAll,
                },
                {
                  id: "copy-all",
                  icon: Copy,
                  label: t.draw.copyAll,
                  description: t.draw.copyAllDescription,
                  onSelect: handleCopyAll,
                },
                {
                  id: "export-csv",
                  icon: Download,
                  label: t.draw.csv,
                  description: t.draw.csvDescription,
                  onSelect: handleExportDraws,
                },
              ]}
            />
            <button onClick={onClearDraws} className="btn btn-sm btn-secondary">
              <RotateCcw size={15} />
              {t.draw.restart}
            </button>
          </>
        ) : null
      }
    >
      {!hasDraws ? (
        participants.length < 2 ? (
          <EmptyState
            icon={Shuffle}
            title={t.draw.notPossibleTitle}
            description={t.draw.notPossibleDescription}
          />
        ) : (
          <div className="relative overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-amber-50 px-6 py-12 text-center dark:border-brand-500/20 dark:from-brand-500/10 dark:via-ink-900 dark:to-amber-500/[0.06]">
            <span
              className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-card transition-transform duration-300 dark:bg-white/10 dark:text-brand-300 ${
                isDrawing ? "scale-110 animate-pulse" : "animate-float"
              }`}
            >
              <Sparkles size={26} />
            </span>
            <p className="font-display text-xl font-semibold text-ink-900 dark:text-white">
              {t.draw.ready(participants.length)}
            </p>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink-500 dark:text-ink-400">
              {t.draw.readyDescription}
            </p>
            <button
              onClick={onPerformDraw}
              disabled={isDrawing}
              className="btn btn-lg btn-primary mx-auto mt-6 shadow-glow"
            >
              {isDrawing ? (
                <>
                  <Shuffle size={20} className="animate-spin" />
                  {t.draw.inProgress}
                </>
              ) : (
                <>
                  <Shuffle size={20} />
                  {t.draw.start}
                </>
              )}
            </button>
            <div className="mt-3">
              <button
                onClick={onCustomizeMessage}
                className="btn btn-sm btn-ghost"
              >
                <PenLine size={14} />
                {t.settings.customize}
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="animate-fade-up">
          {isStale ? (
            <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3.5 dark:border-amber-500/30 dark:bg-amber-500/[0.08]">
              <AlertTriangle
                size={18}
                className="shrink-0 self-start text-amber-600 dark:text-amber-400"
              />
              <div className="min-w-0 flex-1 basis-56">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                  {t.draw.staleTitle}
                </p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-amber-800 dark:text-amber-200/80">
                  {t.draw.staleDescription}
                </p>
              </div>
              <button
                onClick={onRedraw}
                disabled={isDrawing}
                className="btn btn-md btn-primary shrink-0 max-sm:w-full"
              >
                <Shuffle
                  size={16}
                  className={isDrawing ? "animate-spin" : undefined}
                />
                {isDrawing ? t.draw.inProgress : t.draw.redraw}
              </button>
            </div>
          ) : (
            <div className="mb-5 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 dark:border-emerald-500/20 dark:bg-emerald-500/[0.08]">
              <Check
                size={18}
                className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                  {t.draw.resultBanner(draws.length)}
                </p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-emerald-800 dark:text-emerald-200/80">
                  {sendsLink
                    ? t.draw.resultInstructionsLink
                    : t.draw.resultInstructions}
                </p>
                <button
                  onClick={onCustomizeMessage}
                  className="mt-1.5 inline-flex items-center gap-1.5 rounded-md text-[13px] font-semibold text-emerald-800 underline-offset-2 hover:underline dark:text-emerald-200"
                >
                  <PenLine size={13} />
                  {t.settings.customize}
                </button>
              </div>
            </div>
          )}

          <ul className="grid gap-2.5 lg:grid-cols-2">
            {sortedDraws.map((draw, index) => {
              const drawerName = getParticipantName(draw.drawer_id);
              const drawnName = getParticipantName(draw.drawn_id);
              const drawerHint = homonymHints.get(draw.drawer_id);
              const drawnHint = homonymHints.get(draw.drawn_id);
              const isRevealed = revealedIds.has(draw.id);
              const isCopied = copiedId === draw.id;

              return (
                <li
                  key={draw.id}
                  className="flex animate-draw-in flex-wrap items-center gap-3 rounded-xl border border-ink-200 bg-white p-3 transition-shadow hover:shadow-card dark:border-white/10 dark:bg-white/[0.03]"
                  style={{ animationDelay: `${Math.min(index, 14) * 55}ms` }}
                >
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1.5">
                    <span
                      className={`pill px-3 py-1.5 text-ink-900 dark:text-white ${
                        getGroupColorOf(draw.drawer_id).surface
                      }`}
                    >
                      <ParticipantName name={drawerName} hint={drawerHint} />
                    </span>
                    <ArrowRight
                      size={14}
                      className="shrink-0 text-ink-400"
                      aria-hidden
                    />
                    <button
                      onClick={() => toggleReveal(draw.id)}
                      className={`pill px-3 py-1.5 text-left transition-all ${
                        isRevealed
                          ? `text-ink-900 dark:text-white ${
                              getGroupColorOf(draw.drawn_id).surface
                            }`
                          : "select-none border-transparent bg-ink-100 text-transparent blur-[5px] dark:bg-white/10"
                      }`}
                      aria-label={
                        isRevealed
                          ? t.draw.hideResult(drawerName)
                          : t.draw.revealResult(drawerName)
                      }
                    >
                      {isRevealed ? (
                        <ParticipantName name={drawnName} hint={drawnHint} />
                      ) : (
                        <span className="truncate">{drawnName}</span>
                      )}
                    </button>
                  </div>

                  <div className="flex shrink-0 items-center gap-1 max-sm:w-full">
                    <button
                      onClick={() => toggleReveal(draw.id)}
                      className="btn btn-ghost btn-icon"
                      aria-label={isRevealed ? t.draw.hide : t.draw.reveal}
                      title={isRevealed ? t.draw.hide : t.draw.reveal}
                    >
                      {isRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button
                      onClick={() => handleCopyMessage(draw)}
                      className={`btn btn-sm max-sm:flex-1 ${
                        isCopied ? "btn-primary" : "btn-secondary"
                      }`}
                      title={t.draw.copyMessageTitle(drawerName)}
                    >
                      {isCopied ? <Check size={15} /> : <Copy size={15} />}
                      {isCopied ? t.draw.copied : t.draw.copyMessage}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="mt-5 flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[13px] leading-relaxed text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/[0.08] dark:text-amber-200">
            <Info size={16} className="mt-0.5 shrink-0" />
            <span>{t.draw.note}</span>
          </p>
        </div>
      )}
    </SectionCard>
  );
}
