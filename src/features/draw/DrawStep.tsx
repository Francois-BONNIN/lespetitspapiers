import { useMemo } from "react";
import { Info, Shuffle } from "lucide-react";
import {
  assignGroupColors,
  getGroupColor,
} from "@/components/participant/groupColors";
import { useParticipantDirectory } from "@/components/participant/useParticipantDirectory";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionCard } from "@/components/ui/SectionCard";
import type { Draw, EventSettings, Participant } from "@/domain/types";
import { useI18n } from "@/i18n/language-context";
import { useToast } from "@/providers/toast/toast-context";
import { downloadCSV, exportDrawsToCSV } from "@/services/csv";
import { DrawDoneBanner, StaleDrawBanner } from "./DrawBanners";
import { DrawLauncher } from "./DrawLauncher";
import { DrawResultRow, type DrawRowParticipant } from "./DrawResultRow";
import { DrawToolbar } from "./DrawToolbar";
import { useDrawMessages } from "./useDrawMessages";
import { useRevealedDraws } from "./useRevealedDraws";

interface DrawStepProps {
  participants: Participant[];
  draws: Draw[];
  eventSettings: EventSettings;
  isStale: boolean;
  isDrawing: boolean;
  onPerformDraw: () => void;
  onRedraw: () => void;
  onClearDraws: () => void;
  onCustomizeMessage: () => void;
}

export function DrawStep({
  participants,
  draws,
  eventSettings,
  isStale,
  isDrawing,
  onPerformDraw,
  onRedraw,
  onClearDraws,
  onCustomizeMessage,
}: DrawStepProps) {
  const { t } = useI18n();
  const toast = useToast();
  const locale = t.meta.locale;
  const directory = useParticipantDirectory(participants);

  const groupColors = useMemo(
    () => assignGroupColors(participants),
    [participants],
  );

  const sortedDraws = useMemo(
    () =>
      [...draws].sort((a, b) =>
        directory
          .nameOf(a.drawer_id)
          .localeCompare(directory.nameOf(b.drawer_id), locale),
      ),
    [draws, directory, locale],
  );

  const revealed = useRevealedDraws(draws);
  const messages = useDrawMessages(sortedDraws, directory, eventSettings);
  const hasDraws = draws.length > 0;

  const rowParticipant = (id: string): DrawRowParticipant => ({
    name: directory.nameOf(id),
    hint: directory.hintOf(id),
    surface: getGroupColor(groupColors, directory.groupOf(id)).surface,
  });

  const handleExportCsv = () => {
    downloadCSV(
      exportDrawsToCSV(draws, directory, t),
      `${t.csv.drawsFilename}-${new Date().toISOString().split("T")[0]}.csv`,
    );
    toast.success(t.toast.exportStarted, t.toast.exportDrawsDescription);
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
          <DrawToolbar
            allRevealed={revealed.allRevealed}
            onToggleRevealAll={revealed.toggleAll}
            onCopyAll={messages.copyAll}
            onExportCsv={handleExportCsv}
            onRestart={onClearDraws}
          />
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
          <DrawLauncher
            participantCount={participants.length}
            isDrawing={isDrawing}
            onStart={onPerformDraw}
            onCustomizeMessage={onCustomizeMessage}
          />
        )
      ) : (
        <div className="animate-fade-up">
          {isStale ? (
            <StaleDrawBanner isDrawing={isDrawing} onRedraw={onRedraw} />
          ) : (
            <DrawDoneBanner
              drawCount={draws.length}
              sendsLink={eventSettings.delivery === "link"}
              onCustomizeMessage={onCustomizeMessage}
            />
          )}

          <ul className="grid gap-2.5 lg:grid-cols-2">
            {sortedDraws.map((draw, index) => (
              <DrawResultRow
                key={draw.id}
                index={index}
                drawer={rowParticipant(draw.drawer_id)}
                drawn={rowParticipant(draw.drawn_id)}
                isRevealed={revealed.isRevealed(draw.id)}
                isCopied={messages.copiedId === draw.id}
                onToggleReveal={() => revealed.toggle(draw.id)}
                onCopyMessage={() => messages.copyMessage(draw)}
              />
            ))}
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
