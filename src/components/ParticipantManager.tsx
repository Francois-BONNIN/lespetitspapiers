import { useMemo, useRef, useState } from "react";
import {
  Info,
  Link2,
  Search,
  Share2,
  Smartphone,
  Upload,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { Participant } from "../lib/database";
import { getGroupColor } from "../lib/familyColors";
import { buildHomonymHints } from "../lib/homonyms";
import { useRecentlyAdded } from "../lib/useRecentlyAdded";
import { SectionCard } from "./ui/SectionCard";
import { ActionMenu } from "./ui/ActionMenu";
import { EmptyState } from "./ui/EmptyState";
import { ParticipantName } from "./ui/ParticipantName";
import { useI18n } from "./ui/language-context";

interface ParticipantManagerProps {
  participants: Participant[];
  excludeSameFamily: boolean;
  hasDraws: boolean;
  onAddParticipant: (name: string, family: string) => void;
  onDeleteParticipant: (id: string) => void;
  onImportData: (file: File) => void;
  onShareLink: () => void;
  onShareFullLink: () => void;
}

const UNGROUPED = "";

export function ParticipantManager({
  participants,
  excludeSameFamily,
  hasDraws,
  onAddParticipant,
  onDeleteParticipant,
  onImportData,
  onShareLink,
  onShareFullLink,
}: ParticipantManagerProps) {
  const { t } = useI18n();
  const locale = t.meta.locale;
  const [name, setName] = useState("");
  const [family, setFamily] = useState("");
  const [query, setQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const recentlyAdded = useRecentlyAdded(participants.map((p) => p.id));

  const homonymHints = useMemo(
    () => buildHomonymHints(participants),
    [participants]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddParticipant(name.trim(), family.trim());
    setName("");
    nameInputRef.current?.focus();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportData(file);
      e.target.value = "";
    }
  };

  const knownGroups = useMemo(
    () =>
      Array.from(
        new Set(
          participants
            .map((p) => p.family?.trim())
            .filter((g): g is string => Boolean(g))
        )
      ).sort((a, b) => a.localeCompare(b, locale)),
    [participants, locale]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return participants;
    return participants.filter((p) =>
      [p.name, p.family]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(q))
    );
  }, [participants, query]);

  const groups = useMemo(() => {
    const map = new Map<string, Participant[]>();
    filtered.forEach((participant) => {
      const key = participant.family?.trim() || UNGROUPED;
      const bucket = map.get(key);
      if (bucket) bucket.push(participant);
      else map.set(key, [participant]);
    });

    return Array.from(map.entries()).sort(([a], [b]) => {
      if (a === UNGROUPED) return 1;
      if (b === UNGROUPED) return -1;
      return a.localeCompare(b, locale);
    });
  }, [filtered, locale]);

  const hasNamedGroup = groups.some(([key]) => key !== UNGROUPED);

  return (
    <SectionCard
      step={1}
      title={t.participants.title}
      description={t.participants.description}
      badge={
        participants.length > 0 ? (
          <span className="chip bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
            {participants.length}
          </span>
        ) : null
      }
      actions={
        <>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-sm btn-outline"
            title={t.participants.importTitle}
          >
            <Upload size={15} />
            {t.participants.importAction}
          </button>
          <ActionMenu
            icon={Share2}
            label={t.participants.shareAction}
            disabled={participants.length === 0}
            items={[
              {
                id: "share-link",
                icon: Link2,
                label: t.participants.shareLinkAction,
                description: t.participants.shareLinkDescription,
                onSelect: onShareLink,
              },
              {
                id: "full-link",
                icon: Smartphone,
                label: t.participants.fullLinkAction,
                description: hasDraws
                  ? t.participants.fullLinkDescription
                  : t.participants.fullLinkUnavailable,
                disabled: !hasDraws,
                onSelect: onShareFullLink,
              },
            ]}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </>
      }
    >
      <form onSubmit={handleSubmit} className="card-inset mb-5 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="label" htmlFor="participant-name">
              {t.participants.nameLabel}
            </label>
            <input
              id="participant-name"
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.participants.namePlaceholder}
              className="field"
              required
            />
          </div>
          <div className="flex-1">
            <label className="label" htmlFor="participant-group">
              {t.participants.groupLabel}{" "}
              <span className="normal-case text-ink-400">
                {t.common.optional}
              </span>
            </label>
            <input
              id="participant-group"
              type="text"
              value={family}
              onChange={(e) => setFamily(e.target.value)}
              placeholder={t.participants.groupPlaceholder}
              className="field"
              list="known-groups"
              autoComplete="off"
              aria-describedby="participant-group-hint"
            />
            <datalist id="known-groups">
              {knownGroups.map((group) => (
                <option key={group} value={group} />
              ))}
            </datalist>
          </div>
          <button type="submit" className="btn btn-md btn-primary sm:w-auto">
            <UserPlus size={17} />
            {t.common.add}
          </button>
        </div>
        <p
          id="participant-group-hint"
          className="mt-3 flex gap-2 text-xs leading-relaxed text-ink-500 dark:text-ink-400"
        >
          <Info size={14} className="mt-px shrink-0" />
          {excludeSameFamily
            ? t.participants.groupHintSameGroup
            : t.participants.groupHintFree}
        </p>
      </form>

      {participants.length > 3 && (
        <div className="relative mb-4">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.participants.searchPlaceholder}
            className="field pl-10"
            aria-label={t.participants.searchLabel}
          />
        </div>
      )}

      {participants.length === 0 ? (
        <EmptyState
          icon={Users}
          title={t.participants.emptyTitle}
          description={t.participants.emptyDescription}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          compact
          title={t.participants.noResultTitle}
          description={t.participants.noResultDescription(query)}
        />
      ) : (
        <div className="space-y-5">
          {groups.map(([groupName, members]) => {
            const colors = getGroupColor(groupName);
            const isUngrouped = groupName === UNGROUPED;

            return (
              <div key={groupName || "__ungrouped__"}>
                {(!isUngrouped || hasNamedGroup) && (
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
                    <h3
                      className={`text-xs font-bold uppercase tracking-wider ${colors.label}`}
                    >
                      {isUngrouped ? t.participants.ungrouped : groupName}
                    </h3>
                    <span className={`chip ${colors.badge}`}>
                      {members.length}
                    </span>
                  </div>
                )}
                <ul className="flex flex-wrap gap-2">
                  {members.map((participant) => (
                    <li
                      key={participant.id}
                      className={`pill gap-0.5 py-0.5 pl-3 pr-0.5 text-ink-900 dark:text-white ${
                        colors.surface
                      } ${recentlyAdded.has(participant.id) ? "item-added" : ""}`}
                    >
                      <ParticipantName
                        name={participant.name}
                        hint={homonymHints.get(participant.id)}
                        withGroupLabel={false}
                      />
                      <button
                        onClick={() => onDeleteParticipant(participant.id)}
                        className="btn btn-danger-ghost h-7 w-7 shrink-0 rounded-full px-0"
                        aria-label={t.participants.deleteLabel(participant.name)}
                        title={t.participants.deleteLabel(participant.name)}
                      >
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
