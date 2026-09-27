import { useState } from "react";
import { Ban, SlidersHorizontal, Target, Users } from "lucide-react";
import { Participant, Exclusion, Inclusion } from "../lib/database";
import { ExclusionManager } from "./ExclusionManager";
import { InclusionManager } from "./InclusionManager";
import { Modal } from "./ui/Modal";
import { SectionCard } from "./ui/SectionCard";
import { useI18n } from "./ui/language-context";

interface RulesManagerProps {
  participants: Participant[];
  exclusions: Exclusion[];
  inclusions: Inclusion[];
  onAddExclusion: (participantId: string, excludedId: string) => void;
  onDeleteExclusion: (id: string) => void;
  onAddInclusion: (participantId: string, includedId: string) => void;
  onDeleteInclusion: (id: string) => void;
  excludeSameFamily: boolean;
  onToggleExcludeSameFamily: () => void;
}

type Tab = "exclusions" | "inclusions";

export function RulesManager({
  participants,
  exclusions,
  inclusions,
  onAddExclusion,
  onDeleteExclusion,
  onAddInclusion,
  onDeleteInclusion,
  excludeSameFamily,
  onToggleExcludeSameFamily,
}: RulesManagerProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("exclusions");

  const hasRule =
    excludeSameFamily || exclusions.length > 0 || inclusions.length > 0;

  const tabs: { id: Tab; label: string; icon: typeof Ban; count: number }[] = [
    {
      id: "exclusions",
      label: t.exclusions.title,
      icon: Ban,
      count: exclusions.length,
    },
    {
      id: "inclusions",
      label: t.inclusions.title,
      icon: Target,
      count: inclusions.length,
    },
  ];

  return (
    <>
      <SectionCard
        step={2}
        title={t.rules.stepTitle}
        description={t.rules.description}
        badge={
          <span className="chip bg-ink-100 text-ink-600 dark:bg-white/[0.08] dark:text-ink-300">
            {t.rules.optional}
          </span>
        }
        actions={
          <button
            onClick={() => setOpen(true)}
            className="btn btn-sm btn-secondary"
            title={t.rules.openLabel}
          >
            <SlidersHorizontal size={15} />
            {t.rules.configure}
          </button>
        }
      >
        {hasRule ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {excludeSameFamily && (
              <span className="chip bg-ink-100 text-ink-600 dark:bg-white/[0.08] dark:text-ink-300">
                <Users size={12} />
                {t.rules.summarySameGroup}
              </span>
            )}
            {exclusions.length > 0 && (
              <span className="chip bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                <Ban size={12} />
                {t.rules.summaryExclusions(exclusions.length)}
              </span>
            )}
            {inclusions.length > 0 && (
              <span className="chip bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                <Target size={12} />
                {t.rules.summaryInclusions(inclusions.length)}
              </span>
            )}
          </div>
        ) : (
          <p className="text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
            {t.rules.none}
          </p>
        )}
      </SectionCard>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t.rules.title}
        description={t.rules.description}
        icon={SlidersHorizontal}
        accent="amber"
        footer={
          <div className="flex justify-end">
            <button
              onClick={() => setOpen(false)}
              className="btn btn-md btn-primary max-sm:w-full"
            >
              {t.rules.done}
            </button>
          </div>
        }
      >
        <div
          role="tablist"
          aria-label={t.rules.title}
          className="mb-5 flex gap-1 rounded-xl bg-ink-100 p-1 dark:bg-white/[0.06]"
        >
          {tabs.map(({ id, label, icon: Icon, count }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                role="tab"
                id={`rules-tab-${id}`}
                aria-selected={active}
                aria-controls={`rules-panel-${id}`}
                onClick={() => setTab(id)}
                className={`flex h-9 flex-1 items-center justify-center gap-2 rounded-lg text-[13px] font-semibold transition-colors ${
                  active
                    ? "bg-white text-ink-900 shadow-sm dark:bg-white/[0.12] dark:text-white"
                    : "text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100"
                }`}
              >
                <Icon size={15} />
                <span className="truncate">{label}</span>
                {count > 0 && (
                  <span className="rounded-full bg-ink-200 px-1.5 text-[11px] font-bold text-ink-600 dark:bg-white/15 dark:text-ink-200">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`rules-panel-${tab}`}
          aria-labelledby={`rules-tab-${tab}`}
        >
          {tab === "exclusions" ? (
            <ExclusionManager
              participants={participants}
              exclusions={exclusions}
              onAddExclusion={onAddExclusion}
              onDeleteExclusion={onDeleteExclusion}
              excludeSameFamily={excludeSameFamily}
              onToggleExcludeSameFamily={onToggleExcludeSameFamily}
            />
          ) : (
            <InclusionManager
              participants={participants}
              inclusions={inclusions}
              onAddInclusion={onAddInclusion}
              onDeleteInclusion={onDeleteInclusion}
            />
          )}
        </div>
      </Modal>
    </>
  );
}
