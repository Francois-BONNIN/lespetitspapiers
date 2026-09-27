import { v4 as uuidv4 } from "uuid";
import {
  DEFAULT_EVENT_SETTINGS,
  toEventSettings,
} from "@/domain/eventSettings";
import type {
  Draw,
  EventSettings,
  Exclusion,
  Inclusion,
  Participant,
  Setup,
  SetupSnapshot,
} from "@/domain/types";

const STORAGE_KEYS = {
  PARTICIPANTS: "petits_papiers_participants",
  EXCLUSIONS: "petits_papiers_exclusions",
  INCLUSIONS: "petits_papiers_inclusions",
  DRAWS: "petits_papiers_draws",
  EXCLUDE_SAME_FAMILY: "petits_papiers_exclude_same_group",
  AVOID_RECIPROCAL: "petits_papiers_avoid_reciprocal",
  EVENT_SETTINGS: "petits_papiers_event_settings",
};

const LEGACY_STORAGE_KEYS: Record<string, string> = {
  [STORAGE_KEYS.PARTICIPANTS]: "secret_santa_participants",
  [STORAGE_KEYS.EXCLUSIONS]: "secret_santa_exclusions",
  [STORAGE_KEYS.INCLUSIONS]: "secret_santa_inclusions",
  [STORAGE_KEYS.DRAWS]: "secret_santa_draws",
  [STORAGE_KEYS.EXCLUDE_SAME_FAMILY]: "secret_santa_exclude_same_family",
};

function generateId(): string {
  return uuidv4();
}

function readRaw(key: string): string | null {
  const current = localStorage.getItem(key);
  if (current !== null) return current;

  const legacyKey = LEGACY_STORAGE_KEYS[key];
  const legacyValue = legacyKey ? localStorage.getItem(legacyKey) : null;
  if (legacyValue === null) return null;

  localStorage.setItem(key, legacyValue);
  localStorage.removeItem(legacyKey);
  return legacyValue;
}

function readList<T>(key: string): T[] {
  try {
    const data = readRaw(key);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error) {
    console.error(`Lecture impossible de "${key}" dans localStorage.`, error);
    return [];
  }
}

function readFlag(key: string, fallback: boolean): boolean {
  try {
    const data = readRaw(key);
    return data ? JSON.parse(data) === true : fallback;
  } catch (error) {
    console.error(`Lecture impossible de "${key}" dans localStorage.`, error);
    return fallback;
  }
}

function write(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(
      `Écriture impossible de "${key}" dans localStorage : les données de cette session ne seront pas conservées.`,
      error,
    );
    return false;
  }
}

function append<T>(key: string, record: T): T {
  write(key, [...readList<T>(key), record]);
  return record;
}

function removeById<T extends { id: string }>(key: string, id: string): void {
  write(key, readList<T>(key).filter((item) => item.id !== id));
}

export function isStorageAvailable(): boolean {
  try {
    const probe = "__storage_probe__";
    localStorage.setItem(probe, "1");
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

function getParticipants(): Participant[] {
  return readList<Participant>(STORAGE_KEYS.PARTICIPANTS);
}

function getExclusions(): Exclusion[] {
  return readList<Exclusion>(STORAGE_KEYS.EXCLUSIONS);
}

function getInclusions(): Inclusion[] {
  return readList<Inclusion>(STORAGE_KEYS.INCLUSIONS);
}

function getDraws(): Draw[] {
  return readList<Draw>(STORAGE_KEYS.DRAWS);
}

function getEventSettings(): EventSettings {
  try {
    const data = readRaw(STORAGE_KEYS.EVENT_SETTINGS);
    return toEventSettings(data ? JSON.parse(data) : null);
  } catch (error) {
    console.error("Lecture impossible des paramètres de l'événement.", error);
    return DEFAULT_EVENT_SETTINGS;
  }
}

export function loadSetup(): Setup {
  return {
    participants: getParticipants(),
    exclusions: getExclusions(),
    inclusions: getInclusions(),
    draws: getDraws(),
    excludeSameFamily: readFlag(STORAGE_KEYS.EXCLUDE_SAME_FAMILY, true),
    avoidReciprocal: readFlag(STORAGE_KEYS.AVOID_RECIPROCAL, false),
    eventSettings: getEventSettings(),
  };
}

export function addParticipant(
  name: string,
  family: string | null,
): Participant {
  return append<Participant>(STORAGE_KEYS.PARTICIPANTS, {
    id: generateId(),
    name,
    family,
    created_at: new Date().toISOString(),
  });
}

export function deleteParticipant(id: string): void {
  write(
    STORAGE_KEYS.PARTICIPANTS,
    getParticipants().filter((p) => p.id !== id),
  );
  write(
    STORAGE_KEYS.EXCLUSIONS,
    getExclusions().filter(
      (e) => e.participant_id !== id && e.excluded_participant_id !== id,
    ),
  );
  write(
    STORAGE_KEYS.INCLUSIONS,
    getInclusions().filter(
      (i) => i.participant_id !== id && i.included_participant_id !== id,
    ),
  );
  write(
    STORAGE_KEYS.DRAWS,
    getDraws().filter((d) => d.drawer_id !== id && d.drawn_id !== id),
  );
}

export function addExclusion(
  participant_id: string,
  excluded_participant_id: string,
): Exclusion {
  return append<Exclusion>(STORAGE_KEYS.EXCLUSIONS, {
    id: generateId(),
    participant_id,
    excluded_participant_id,
    created_at: new Date().toISOString(),
  });
}

export function deleteExclusion(id: string): void {
  removeById<Exclusion>(STORAGE_KEYS.EXCLUSIONS, id);
}

export function addInclusion(
  participant_id: string,
  included_participant_id: string,
): Inclusion {
  return append<Inclusion>(STORAGE_KEYS.INCLUSIONS, {
    id: generateId(),
    participant_id,
    included_participant_id,
    created_at: new Date().toISOString(),
  });
}

export function deleteInclusion(id: string): void {
  removeById<Inclusion>(STORAGE_KEYS.INCLUSIONS, id);
}

export function saveDraws(
  draws: Array<Pick<Draw, "drawer_id" | "drawn_id">>,
): Draw[] {
  const newDraws: Draw[] = draws.map((d) => ({
    id: generateId(),
    drawer_id: d.drawer_id,
    drawn_id: d.drawn_id,
    draw_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }));
  write(STORAGE_KEYS.DRAWS, newDraws);
  return newDraws;
}

export function clearDraws(): void {
  write(STORAGE_KEYS.DRAWS, []);
}

export function setExcludeSameFamilySetting(value: boolean): void {
  write(STORAGE_KEYS.EXCLUDE_SAME_FAMILY, value);
}

export function setAvoidReciprocalSetting(value: boolean): void {
  write(STORAGE_KEYS.AVOID_RECIPROCAL, value);
}

export function saveEventSettings(settings: EventSettings): void {
  write(STORAGE_KEYS.EVENT_SETTINGS, settings);
}

export function replaceAllData(snapshot: SetupSnapshot): void {
  const now = new Date().toISOString();
  const participants: Participant[] = snapshot.participants.map((entry) => ({
    id: generateId(),
    name: entry.name,
    family: entry.family,
    created_at: now,
  }));
  const idAt = (index: number) => participants[index].id;

  write(STORAGE_KEYS.PARTICIPANTS, participants);
  write(
    STORAGE_KEYS.EXCLUSIONS,
    snapshot.exclusions.map(
      ([from, to]): Exclusion => ({
        id: generateId(),
        participant_id: idAt(from),
        excluded_participant_id: idAt(to),
        created_at: now,
      }),
    ),
  );
  write(
    STORAGE_KEYS.INCLUSIONS,
    snapshot.inclusions.map(
      ([from, to]): Inclusion => ({
        id: generateId(),
        participant_id: idAt(from),
        included_participant_id: idAt(to),
        created_at: now,
      }),
    ),
  );
  write(
    STORAGE_KEYS.DRAWS,
    snapshot.draws.map(
      ([from, to]): Draw => ({
        id: generateId(),
        drawer_id: idAt(from),
        drawn_id: idAt(to),
        draw_date: snapshot.drawDate ?? now,
        created_at: now,
      }),
    ),
  );
  setExcludeSameFamilySetting(snapshot.excludeSameFamily);
  setAvoidReciprocalSetting(snapshot.avoidReciprocal);
  if (snapshot.eventSettings) saveEventSettings(snapshot.eventSettings);
}

export function clearAllData(): boolean {
  try {
    [
      ...Object.values(STORAGE_KEYS),
      ...Object.values(LEGACY_STORAGE_KEYS),
    ].forEach((key) => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error("Effacement impossible des données.", error);
    return false;
  }
}
