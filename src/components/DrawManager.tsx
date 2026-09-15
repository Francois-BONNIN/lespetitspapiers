import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Copy,
  Download,
  Eye,
  EyeOff,
  Info,
  RotateCcw,
  Shuffle,
  Sparkles,
} from "lucide-react";
import { Participant, Draw } from "../lib/database";
import {
  exportDrawsToCSV,
  downloadCSV,
  generateMessageForDraw,
} from "../lib/csvExport";
import { getInitials } from "../lib/familyColors";
import { SectionCard } from "./ui/SectionCard";
import { EmptyState } from "./ui/EmptyState";
import { useToast } from "./ui/toast-context";
import { useI18n } from "./ui/language-context";

interface DrawManagerProps {
  participants: Participant[];
  draws: Draw[];
  onPerformDraw: () => void;
  onClearDraws: () => void;
  isDrawing: boolean;
}

export function DrawManager({
  participants,
  draws,
  onPerformDraw,
  onClearDraws,
  isDrawing,
}: DrawManagerProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const toast = useToast();
  const { t } = useI18n();

  const getParticipantName = (id: string) =>
    participants.find((p) => p.id === id)?.name ?? t.common.unknown;

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

  const handleCopyMessage = (draw: Draw) => {
    const message = generateMessageForDraw(
      getParticipantName(draw.drawer_id),
      getParticipantName(draw.drawn_id),
      t
    );
    copyText(message, () => {
      setCopiedId(draw.id);
      window.setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleCopyAll = () => {
    const all = sortedDraws
      .map((draw) =>
        generateMessageForDraw(
          getParticipantName(draw.drawer_id),
          getParticipantName(draw.drawn_id),
          t
        )
      )
      .join("\n\n———\n\n");
    copyText(all, () =>
      toast.success(
        t.toast.messagesCopied,
        t.toast.messagesCopiedDescription(draws.length)
      )
    );
  };

  return (
    <SectionCard
      icon={Shuffle}
      title={t.draw.title}
      description={
        hasDraws ? t.draw.descriptionDone : t.draw.descriptionPending
      }
      accent="amber"
      actions={
        hasDraws ? (
          <>
            <button
              onClick={toggleRevealAll}
              className="btn btn-sm btn-secondary"
            >
              {allRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
              <span className="hidden sm:inline">
                {allRevealed ? t.draw.hideAll : t.draw.revealAll}
              </span>
            </button>
            <button onClick={handleCopyAll} className="btn btn-sm btn-secondary">
              <Copy size={15} />
              <span className="hidden sm:inline">{t.draw.copyAll}</span>
            </button>
            <button
              onClick={handleExportDraws}
              className="btn btn-sm btn-secondary"
            >
              <Download size={15} />
              <span className="hidden sm:inline">{t.draw.csv}</span>
            </button>
            <button onClick={onClearDraws} className="btn btn-sm btn-secondary">
              <RotateCcw size={15} />
              <span className="hidden sm:inline">{t.draw.restart}</span>
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
          </div>
        )
      ) : (
        <div className="animate-fade-up">
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 dark:border-emerald-500/20 dark:bg-emerald-500/[0.08]">
            <Check
              size={18}
              className="shrink-0 text-emerald-600 dark:text-emerald-400"
            />
            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
              {t.draw.resultBanner(draws.length)}
            </p>
          </div>

          <ul className="grid gap-2.5 lg:grid-cols-2">
            {sortedDraws.map((draw, index) => {
              const drawerName = getParticipantName(draw.drawer_id);
              const drawnName = getParticipantName(draw.drawn_id);
              const isRevealed = revealedIds.has(draw.id);
              const isCopied = copiedId === draw.id;

              return (
                <li
                  key={draw.id}
                  className="flex animate-draw-in items-center gap-3 rounded-xl border border-ink-200 bg-white p-3 transition-shadow hover:shadow-card dark:border-white/10 dark:bg-white/[0.03]"
                  style={{ animationDelay: `${Math.min(index, 14) * 55}ms` }}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300"
                    aria-hidden
                  >
                    {getInitials(drawerName)}
                  </span>

                  <div className="flex min-w-0 flex-1 items-center gap-2 text-sm">
                    <span className="truncate font-semibold text-ink-900 dark:text-white">
                      {drawerName}
                    </span>
                    <ArrowRight
                      size={14}
                      className="shrink-0 text-ink-400"
                      aria-hidden
                    />
                    <button
                      onClick={() => toggleReveal(draw.id)}
                      className={`min-w-0 truncate rounded-md px-1.5 py-0.5 text-left font-semibold transition-all ${
                        isRevealed
                          ? "text-brand-700 dark:text-brand-300"
                          : "select-none bg-ink-100 text-transparent blur-[5px] dark:bg-white/10"
                      }`}
                      aria-label={
                        isRevealed
                          ? t.draw.hideResult(drawerName)
                          : t.draw.revealResult(drawerName)
                      }
                    >
                      {drawnName}
                    </button>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
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
                      className={`btn btn-sm ${
                        isCopied ? "btn-primary" : "btn-secondary"
                      }`}
                      title={t.draw.copyMessageTitle(drawerName)}
                    >
                      {isCopied ? <Check size={15} /> : <Copy size={15} />}
                      <span className="hidden xl:inline">
                        {isCopied ? t.draw.copied : t.draw.message}
                      </span>
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
