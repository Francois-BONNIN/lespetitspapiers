import { useState } from "react";
import { DrawStep } from "@/features/draw/DrawStep";
import { useDrawActions } from "@/features/draw/useDrawActions";
import { ParticipantsStep } from "@/features/participants/ParticipantsStep";
import { useParticipantActions } from "@/features/participants/useParticipantActions";
import { RulesStep } from "@/features/rules/RulesStep";
import { useRuleActions } from "@/features/rules/useRuleActions";
import { SettingsModal } from "@/features/settings/SettingsModal";
import { useSettingsActions } from "@/features/settings/useSettingsActions";
import { useIncomingShareLink } from "@/features/share/useIncomingShareLink";
import { useShareActions } from "@/features/share/useShareActions";
import { useI18n } from "@/i18n/language-context";
import { isStorageAvailable } from "@/services/storage";
import { useSetupStore } from "@/state/useSetupStore";
import { Hero } from "./Hero";
import { OrganizerHeader } from "./OrganizerHeader";
import { StorageWarning } from "./StorageWarning";

export function OrganizerPage() {
  const { t } = useI18n();
  const store = useSetupStore();
  const { setup, drawRules, drawIsStale } = store;
  const [storageAvailable] = useState(isStorageAvailable);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const participantActions = useParticipantActions(store);
  const ruleActions = useRuleActions(store);
  const drawActions = useDrawActions(store);
  const settingsActions = useSettingsActions(store);
  const shareActions = useShareActions(store);
  useIncomingShareLink(shareActions.openSharedSetup);

  const openSettings = () => setSettingsOpen(true);
  const closeSettings = () => setSettingsOpen(false);

  const clearAll = () => {
    closeSettings();
    void settingsActions.clearAll();
  };

  return (
    <div className="aurora-bg min-h-screen">
      <OrganizerHeader
        canShare={setup.participants.length > 0}
        hasDraws={setup.draws.length > 0}
        onCopyShareLink={shareActions.copyShareLink}
        onCopyFullLink={shareActions.copyFullLink}
        onOpenSettings={openSettings}
      />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <Hero />

        {!storageAvailable && <StorageWarning />}

        <div className="space-y-5">
          <ParticipantsStep
            participants={setup.participants}
            excludeSameFamily={setup.excludeSameFamily}
            onAddParticipant={participantActions.add}
            onDeleteParticipant={participantActions.remove}
            onImportCsv={participantActions.importCsv}
          />

          <RulesStep
            participants={setup.participants}
            rules={drawRules}
            onAddExclusion={ruleActions.addExclusion}
            onDeleteExclusion={ruleActions.deleteExclusion}
            onAddInclusion={ruleActions.addInclusion}
            onDeleteInclusion={ruleActions.deleteInclusion}
            onToggleExcludeSameFamily={ruleActions.toggleExcludeSameFamily}
            onToggleAvoidReciprocal={ruleActions.toggleAvoidReciprocal}
          />

          <DrawStep
            participants={setup.participants}
            draws={setup.draws}
            eventSettings={setup.eventSettings}
            isStale={drawIsStale}
            isDrawing={drawActions.isDrawing}
            onPerformDraw={drawActions.perform}
            onRedraw={drawActions.redraw}
            onClearDraws={drawActions.clear}
            onCustomizeMessage={openSettings}
          />
        </div>

        <footer className="mt-12 text-center text-xs text-ink-400 dark:text-ink-500">
          {t.footer}
        </footer>
      </main>

      <SettingsModal
        open={settingsOpen}
        onClose={closeSettings}
        settings={setup.eventSettings}
        onChange={settingsActions.change}
        onClearAll={clearAll}
      />
    </div>
  );
}
