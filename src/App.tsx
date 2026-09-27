import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Settings, Ticket, Trophy } from "lucide-react";
import {
  Participant,
  Exclusion,
  Inclusion,
  Draw,
  EventSettings,
  DEFAULT_EVENT_SETTINGS,
  getEventSettings,
  saveEventSettings,
  getParticipants,
  getExclusions,
  getInclusions,
  getDraws,
  getExcludeSameFamilySetting,
  setExcludeSameFamilySetting,
  getAvoidReciprocalSetting,
  setAvoidReciprocalSetting,
  clearAllData,
  addParticipant,
  deleteParticipant,
  addExclusion,
  deleteExclusion,
  addInclusion,
  deleteInclusion,
  saveDraws,
  clearDraws as clearStoredDraws,
  isStorageAvailable,
  replaceAllData,
} from "./lib/database";
import {
  DrawRules,
  isDrawConsistent,
  performDraw,
} from "./lib/drawAlgorithm";
import {
  exportParticipantsToCSV,
  downloadCSV,
  importParticipantsFromCSV,
} from "./lib/csvExport";
import {
  buildShareUrl,
  decodeSharePayload,
  takeSharePayloadFromUrl,
} from "./lib/shareLink";
import { ParticipantManager } from "./components/ParticipantManager";
import { RulesManager } from "./components/RulesManager";
import { DrawManager } from "./components/DrawManager";
import { SettingsManager } from "./components/SettingsManager";
import { ThemeToggle } from "./components/ui/ThemeToggle";
import { LanguageToggle } from "./components/ui/LanguageToggle";
import { useToast } from "./components/ui/toast-context";
import { useConfirm } from "./components/ui/confirm-context";
import { useI18n } from "./components/ui/language-context";

function App() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [exclusions, setExclusions] = useState<Exclusion[]>([]);
  const [inclusions, setInclusions] = useState<Inclusion[]>([]);
  const [draws, setDraws] = useState<Draw[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [excludeSameFamily, setExcludeSameFamilyState] = useState(true);
  const [avoidReciprocal, setAvoidReciprocalState] = useState(false);
  const [eventSettings, setEventSettings] = useState<EventSettings>(
    DEFAULT_EVENT_SETTINGS
  );
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [storageAvailable] = useState(isStorageAvailable);

  const toast = useToast();
  const confirm = useConfirm();
  const { t } = useI18n();
  const openSharedSetupRef = useRef<(payload: string) => Promise<void>>();

  useEffect(() => {
    openSharedSetupRef.current = handleOpenSharedSetup;
  });

  useEffect(() => {
    loadData();

    const openSharedLinkFromUrl = () => {
      const payload = takeSharePayloadFromUrl();
      if (payload) void openSharedSetupRef.current?.(payload);
    };

    openSharedLinkFromUrl();
    window.addEventListener("hashchange", openSharedLinkFromUrl);
    return () =>
      window.removeEventListener("hashchange", openSharedLinkFromUrl);
  }, []);

  const loadData = () => {
    setParticipants(getParticipants());
    setExclusions(getExclusions());
    setInclusions(getInclusions());
    setDraws(getDraws());
    setExcludeSameFamilyState(getExcludeSameFamilySetting());
    setAvoidReciprocalState(getAvoidReciprocalSetting());
    setEventSettings(getEventSettings());
  };

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const handleChangeEventSettings = (settings: EventSettings) => {
    setEventSettings(settings);
    saveEventSettings(settings);
  };

  const drawRules = useMemo<DrawRules>(
    () => ({ exclusions, inclusions, excludeSameFamily, avoidReciprocal }),
    [exclusions, inclusions, excludeSameFamily, avoidReciprocal]
  );

  const drawIsStale = useMemo(
    () =>
      draws.length > 0 && !isDrawConsistent(draws, participants, drawRules),
    [draws, participants, drawRules]
  );

  const handleAddParticipant = (name: string, family: string) => {
    const duplicate = participants.some(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );

    try {
      const newParticipant = addParticipant(name, family || null);
      setParticipants([...participants, newParticipant]);
      if (duplicate) {
        toast.warning(
          t.toast.participantAdded(name),
          t.toast.participantDuplicate
        );
      } else {
        toast.success(t.toast.participantAdded(name));
      }
    } catch (error) {
      toast.error(
        t.toast.addFailed,
        t.toast.participantAddFailedDescription
      );
      console.error(error);
    }
  };

  const handleDeleteParticipant = async (id: string) => {
    const participant = participants.find((p) => p.id === id);
    const linkedConstraints =
      exclusions.filter(
        (e) => e.participant_id === id || e.excluded_participant_id === id
      ).length +
      inclusions.filter(
        (i) => i.participant_id === id || i.included_participant_id === id
      ).length;

    const confirmed = await confirm({
      title: t.confirm.deleteParticipantTitle(
        participant?.name ?? t.confirm.deleteParticipantFallback
      ),
      description: [
        linkedConstraints > 0
          ? t.confirm.linkedConstraints(linkedConstraints)
          : null,
        draws.length > 0 ? t.confirm.drawInvalidated : null,
      ]
        .filter(Boolean)
        .join(" ") || t.confirm.irreversible,
      confirmLabel: t.common.delete,
    });

    if (!confirmed) return;

    try {
      deleteParticipant(id);
      loadData();
      toast.success(t.toast.participantDeleted);
    } catch (error) {
      toast.error(t.toast.deleteFailed);
      console.error(error);
    }
  };

  const handleAddExclusion = (participantId: string, excludedId: string) => {
    const exists = exclusions.some(
      (e) =>
        e.participant_id === participantId &&
        e.excluded_participant_id === excludedId
    );

    if (exists) {
      toast.warning(t.toast.exclusionExists);
      return;
    }

    try {
      setExclusions([...exclusions, addExclusion(participantId, excludedId)]);
      toast.success(t.toast.exclusionAdded);
    } catch (error) {
      toast.error(t.toast.addFailed, t.toast.exclusionAddFailedDescription);
      console.error(error);
    }
  };

  const handleDeleteExclusion = (id: string) => {
    try {
      deleteExclusion(id);
      setExclusions(exclusions.filter((e) => e.id !== id));
      toast.success(t.toast.exclusionDeleted);
    } catch (error) {
      toast.error(t.toast.deleteFailed);
      console.error(error);
    }
  };

  const handleAddInclusion = (participantId: string, includedId: string) => {
    const exists = inclusions.some(
      (i) =>
        i.participant_id === participantId &&
        i.included_participant_id === includedId
    );

    if (exists) {
      toast.warning(t.toast.inclusionExists);
      return;
    }

    try {
      setInclusions([...inclusions, addInclusion(participantId, includedId)]);
      toast.success(t.toast.inclusionAdded);
    } catch (error) {
      toast.error(t.toast.addFailed, t.toast.inclusionAddFailedDescription);
      console.error(error);
    }
  };

  const handleDeleteInclusion = (id: string) => {
    try {
      deleteInclusion(id);
      setInclusions(inclusions.filter((i) => i.id !== id));
      toast.success(t.toast.inclusionDeleted);
    } catch (error) {
      toast.error(t.toast.deleteFailed);
      console.error(error);
    }
  };

  const handlePerformDraw = () => {
    setIsDrawing(true);

    window.setTimeout(() => {
      const results = performDraw(participants, drawRules);

      if (!results) {
        toast.error(t.toast.drawFailed, t.toast.drawFailedDescription);
        setIsDrawing(false);
        return;
      }

      try {
        setDraws(
          saveDraws(
            results.map((r) => ({
              drawer_id: r.drawer_id,
              drawn_id: r.drawn_id,
            }))
          )
        );
        toast.success(
          t.toast.drawDone,
          t.toast.drawDoneDescription(results.length)
        );
      } catch (error) {
        toast.error(t.toast.drawSaveFailed, t.toast.drawSaveFailedDescription);
        console.error(error);
      }

      setIsDrawing(false);
    }, 700);
  };

  const handleRedraw = async () => {
    const confirmed = await confirm({
      title: t.confirm.redrawTitle,
      description: t.confirm.redrawDescription,
      confirmLabel: t.confirm.redrawConfirm,
    });

    if (confirmed) handlePerformDraw();
  };

  const handleClearDraws = async () => {
    const confirmed = await confirm({
      title: t.confirm.resetDrawTitle,
      description: t.confirm.resetDrawDescription,
      confirmLabel: t.confirm.resetDrawConfirm,
    });

    if (!confirmed) return;

    try {
      clearStoredDraws();
      setDraws([]);
      toast.success(t.toast.drawReset);
    } catch (error) {
      toast.error(t.toast.drawResetFailed);
      console.error(error);
    }
  };

  const handleToggleExcludeSameFamily = () => {
    const newValue = !excludeSameFamily;
    setExcludeSameFamilyState(newValue);
    setExcludeSameFamilySetting(newValue);
  };

  const handleToggleAvoidReciprocal = () => {
    const newValue = !avoidReciprocal;
    setAvoidReciprocalState(newValue);
    setAvoidReciprocalSetting(newValue);
  };

  const handleClearAll = async () => {
    closeSettings();

    const confirmed = await confirm({
      title: t.confirm.clearAllTitle,
      description: t.confirm.clearAllDescription,
      confirmLabel: t.confirm.clearAllConfirm,
    });

    if (!confirmed) return;

    if (clearAllData()) {
      loadData();
      toast.success(t.toast.allCleared);
    } else {
      toast.error(t.toast.clearAllFailed);
    }
  };

  const handleExportData = () => {
    downloadCSV(
      exportParticipantsToCSV(participants, exclusions, inclusions, t),
      `${t.csv.participantsFilename}-${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    toast.success(t.toast.exportStarted, t.toast.exportParticipantsDescription);
  };

  const handleImportData = async (file: File) => {
    try {
      const importResult = importParticipantsFromCSV(await file.text());

      if (!importResult) {
        toast.error(t.toast.importFailed, t.toast.importFailedDescription);
        return;
      }

      const participantMap = new Map<string, string>();
      importResult.participants.forEach((p) => {
        participantMap.set(p.name, addParticipant(p.name, p.family).id);
      });

      importResult.exclusions.forEach((e) => {
        const participantId = participantMap.get(e.participantName);
        const excludedId = participantMap.get(e.excludedName);
        if (participantId && excludedId) {
          try {
            addExclusion(participantId, excludedId);
          } catch (error) {
            console.error("Erreur lors de l'ajout d'une exclusion:", error);
          }
        }
      });

      importResult.inclusions.forEach((i) => {
        const participantId = participantMap.get(i.participantName);
        const includedId = participantMap.get(i.includedName);
        if (participantId && includedId) {
          try {
            addInclusion(participantId, includedId);
          } catch (error) {
            console.error("Erreur lors de l'ajout d'une inclusion:", error);
          }
        }
      });

      loadData();
      toast.success(
        t.toast.importDone,
        t.toast.importDoneDescription(importResult.participants.length)
      );
    } catch (error) {
      toast.error(
        t.toast.importReadFailed,
        t.toast.importReadFailedDescription
      );
      console.error(error);
    }
  };

  const copyShareLink = async (includeDraws: boolean) => {
    try {
      const url = await buildShareUrl(
        {
          participants,
          exclusions,
          inclusions,
          draws,
          excludeSameFamily,
          avoidReciprocal,
          eventSettings,
        },
        includeDraws
      );
      await navigator.clipboard.writeText(url);
      if (includeDraws) {
        toast.success(t.toast.fullLinkCopied, t.toast.fullLinkCopiedDescription);
      } else {
        toast.success(t.toast.shareCopied, t.toast.shareCopiedDescription);
      }
    } catch (error) {
      toast.error(t.toast.shareFailed, t.toast.copyFailedDescription);
      console.error(error);
    }
  };

  const handleOpenSharedSetup = async (payload: string) => {
    const setup = await decodeSharePayload(payload);

    if (!setup) {
      toast.error(t.toast.sharedInvalid, t.toast.sharedInvalidDescription);
      return;
    }

    const hasLocalData =
      getParticipants().length > 0 || getDraws().length > 0;

    if (hasLocalData) {
      const ruleCount = setup.exclusions.length + setup.inclusions.length;
      const confirmed = await confirm({
        title: t.confirm.openSharedTitle,
        description:
          setup.draws.length > 0
            ? t.confirm.openSharedWithDrawDescription(
                setup.participants.length,
                ruleCount
              )
            : t.confirm.openSharedDescription(
                setup.participants.length,
                ruleCount
              ),
        confirmLabel: t.confirm.openSharedConfirm,
      });
      if (!confirmed) return;
    }

    replaceAllData(setup);
    loadData();
    toast.success(
      t.toast.sharedLoaded,
      setup.draws.length > 0
        ? t.toast.sharedLoadedWithDrawDescription(setup.participants.length)
        : t.toast.sharedLoadedDescription(setup.participants.length)
    );
  };

  return (
    <div className="aurora-bg min-h-screen">
      <header className="sticky top-0 z-30 border-b border-ink-200/70 bg-ink-50/80 backdrop-blur-md dark:border-white/10 dark:bg-ink-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
              <Ticket size={18} />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-base font-semibold leading-tight text-ink-900 dark:text-white">
                Les Petits Papiers
              </span>
              <span className="hidden text-xs text-ink-500 dark:text-ink-400 sm:block">
                {t.header.tagline}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {draws.length > 0 &&
              (drawIsStale ? (
                <span className="chip hidden bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300 sm:inline-flex">
                  <AlertTriangle size={13} />
                  {t.header.drawStale}
                </span>
              ) : (
                <span className="chip hidden bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 sm:inline-flex">
                  <Trophy size={13} />
                  {t.header.drawDone}
                </span>
              ))}
            <button
              onClick={openSettings}
              className="btn btn-sm btn-secondary rounded-full"
              aria-label={t.settings.open}
              title={t.settings.open}
            >
              <Settings size={15} />
              <span className="hidden sm:inline">{t.settings.open}</span>
            </button>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <div className="mb-8 text-center sm:mb-10">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink-900 dark:text-white sm:text-5xl">
            {t.hero.titleMain}
            <span className="text-brand-600 dark:text-brand-400">
              {t.hero.titleAccent}
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-500 dark:text-ink-400 sm:text-base">
            {t.hero.subtitle}
          </p>
        </div>

        {!storageAvailable && (
          <div className="mb-6 flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/[0.08] dark:text-amber-200">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <span>
              <strong className="font-semibold">{t.storage.title}</strong>{" "}
              {t.storage.body}
            </span>
          </div>
        )}

        <div className="space-y-5">
          <ParticipantManager
            participants={participants}
            excludeSameFamily={excludeSameFamily}
            onAddParticipant={handleAddParticipant}
            onDeleteParticipant={handleDeleteParticipant}
            onExportData={handleExportData}
            onImportData={handleImportData}
            hasDraws={draws.length > 0}
            onShareLink={() => copyShareLink(false)}
            onShareFullLink={() => copyShareLink(true)}
          />

          <RulesManager
            participants={participants}
            exclusions={exclusions}
            inclusions={inclusions}
            onAddExclusion={handleAddExclusion}
            onDeleteExclusion={handleDeleteExclusion}
            onAddInclusion={handleAddInclusion}
            onDeleteInclusion={handleDeleteInclusion}
            excludeSameFamily={excludeSameFamily}
            onToggleExcludeSameFamily={handleToggleExcludeSameFamily}
            avoidReciprocal={avoidReciprocal}
            onToggleAvoidReciprocal={handleToggleAvoidReciprocal}
          />

          <DrawManager
            participants={participants}
            draws={draws}
            eventSettings={eventSettings}
            isStale={drawIsStale}
            onPerformDraw={handlePerformDraw}
            onRedraw={handleRedraw}
            onCustomizeMessage={openSettings}
            onClearDraws={handleClearDraws}
            isDrawing={isDrawing}
          />
        </div>

        <footer className="mt-12 text-center text-xs text-ink-400 dark:text-ink-500">
          {t.footer}
        </footer>
      </main>

      <SettingsManager
        open={settingsOpen}
        onClose={closeSettings}
        settings={eventSettings}
        onChange={handleChangeEventSettings}
        onClearAll={handleClearAll}
      />
    </div>
  );
}

export default App;
