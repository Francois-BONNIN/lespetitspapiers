import { v4 as uuidv4 } from "uuid";

export interface Participant {
  id: string;
  name: string;
  family: string | null;
  created_at: string;
}

export interface Exclusion {
  id: string;
  participant_id: string;
  excluded_participant_id: string;
  created_at: string;
}

export interface Inclusion {
  id: string;
  participant_id: string;
  included_participant_id: string;
  created_at: string;
}

export interface Draw {
  id: string;
  drawer_id: string;
  drawn_id: string;
  draw_date: string;
  created_at: string;
}

export type Delivery = "message" | "link";

export interface EventSettings {
  eventName: string;
  budget: string;
  exchangeDate: string;
  messageTemplate: string | null;
  delivery: Delivery;
}

export const DEFAULT_EVENT_SETTINGS: EventSettings = {
  eventName: "",
  budget: "",
  exchangeDate: "",
  messageTemplate: null,
  delivery: "message",
};

export interface SetupSnapshot {
  participants: Array<Pick<Participant, "name" | "family">>;
  exclusions: Array<[number, number]>;
  inclusions: Array<[number, number]>;
  draws: Array<[number, number]>;
  drawDate: string | null;
  excludeSameFamily: boolean;
  avoidReciprocal: boolean;
  eventSettings: EventSettings | null;
}

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

function write(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(
      `Écriture impossible de "${key}" dans localStorage : les données de cette session ne seront pas conservées.`,
      error
    );
    return false;
  }
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

export function getParticipants(): Participant[] {
  return readList<Participant>(STORAGE_KEYS.PARTICIPANTS);
}

export function addParticipant(
  name: string,
  family: string | null
): Participant {
  const participants = getParticipants();
  const newParticipant: Participant = {
    id: generateId(),
    name,
    family,
    created_at: new Date().toISOString(),
  };
  participants.push(newParticipant);
  write(STORAGE_KEYS.PARTICIPANTS, participants);
  return newParticipant;
}

export function getExclusions(): Exclusion[] {
  return readList<Exclusion>(STORAGE_KEYS.EXCLUSIONS);
}

export function addExclusion(
  participant_id: string,
  excluded_participant_id: string
): Exclusion {
  const exclusions = getExclusions();
  const newExclusion: Exclusion = {
    id: generateId(),
    participant_id,
    excluded_participant_id,
    created_at: new Date().toISOString(),
  };
  exclusions.push(newExclusion);
  write(STORAGE_KEYS.EXCLUSIONS, exclusions);
  return newExclusion;
}

export function deleteExclusion(id: string): void {
  const exclusions = getExclusions().filter((e) => e.id !== id);
  write(STORAGE_KEYS.EXCLUSIONS, exclusions);
}

export function getInclusions(): Inclusion[] {
  return readList<Inclusion>(STORAGE_KEYS.INCLUSIONS);
}

export function addInclusion(
  participant_id: string,
  included_participant_id: string
): Inclusion {
  const inclusions = getInclusions();
  const newInclusion: Inclusion = {
    id: generateId(),
    participant_id,
    included_participant_id,
    created_at: new Date().toISOString(),
  };
  inclusions.push(newInclusion);
  write(STORAGE_KEYS.INCLUSIONS, inclusions);
  return newInclusion;
}

export function deleteInclusion(id: string): void {
  const inclusions = getInclusions().filter((i) => i.id !== id);
  write(STORAGE_KEYS.INCLUSIONS, inclusions);
}

export function deleteParticipant(id: string): void {
  const participants = getParticipants().filter((p) => p.id !== id);
  write(STORAGE_KEYS.PARTICIPANTS, participants);

  const exclusions = getExclusions().filter(
    (e) => e.participant_id !== id && e.excluded_participant_id !== id
  );
  write(STORAGE_KEYS.EXCLUSIONS, exclusions);

  const inclusions = getInclusions().filter(
    (i) => i.participant_id !== id && i.included_participant_id !== id
  );
  write(STORAGE_KEYS.INCLUSIONS, inclusions);

  const draws = getDraws().filter(
    (d) => d.drawer_id !== id && d.drawn_id !== id
  );
  write(STORAGE_KEYS.DRAWS, draws);
}

export function getDraws(): Draw[] {
  return readList<Draw>(STORAGE_KEYS.DRAWS);
}

export function saveDraws(
  draws: Array<{ drawer_id: string; drawn_id: string }>
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
    snapshot.exclusions.map(([from, to]): Exclusion => ({
      id: generateId(),
      participant_id: idAt(from),
      excluded_participant_id: idAt(to),
      created_at: now,
    }))
  );
  write(
    STORAGE_KEYS.INCLUSIONS,
    snapshot.inclusions.map(([from, to]): Inclusion => ({
      id: generateId(),
      participant_id: idAt(from),
      included_participant_id: idAt(to),
      created_at: now,
    }))
  );
  write(
    STORAGE_KEYS.DRAWS,
    snapshot.draws.map(([from, to]): Draw => ({
      id: generateId(),
      drawer_id: idAt(from),
      drawn_id: idAt(to),
      draw_date: snapshot.drawDate ?? now,
      created_at: now,
    }))
  );
  setExcludeSameFamilySetting(snapshot.excludeSameFamily);
  setAvoidReciprocalSetting(snapshot.avoidReciprocal);
  if (snapshot.eventSettings) saveEventSettings(snapshot.eventSettings);
}

export function getExcludeSameFamilySetting(): boolean {
  try {
    const data = readRaw(STORAGE_KEYS.EXCLUDE_SAME_FAMILY);
    return data ? JSON.parse(data) === true : true;
  } catch (error) {
    console.error(
      "Lecture impossible du réglage d'exclusion par groupe.",
      error
    );
    return true;
  }
}

export function setExcludeSameFamilySetting(value: boolean): void {
  write(STORAGE_KEYS.EXCLUDE_SAME_FAMILY, value);
}

export function getAvoidReciprocalSetting(): boolean {
  try {
    return JSON.parse(readRaw(STORAGE_KEYS.AVOID_RECIPROCAL) ?? "false") === true;
  } catch (error) {
    console.error("Lecture impossible du réglage des tirages réciproques.", error);
    return false;
  }
}

export function setAvoidReciprocalSetting(value: boolean): void {
  write(STORAGE_KEYS.AVOID_RECIPROCAL, value);
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

export function toEventSettings(value: unknown): EventSettings {
  if (typeof value !== "object" || value === null) return DEFAULT_EVENT_SETTINGS;

  const stored = value as Record<string, unknown>;
  const text = (field: unknown) => (typeof field === "string" ? field : "");
  return {
    eventName: text(stored.eventName),
    budget: text(stored.budget),
    exchangeDate: text(stored.exchangeDate),
    messageTemplate:
      typeof stored.messageTemplate === "string" ? stored.messageTemplate : null,
    delivery: stored.delivery === "link" ? "link" : "message",
  };
}

export function getEventSettings(): EventSettings {
  try {
    const data = readRaw(STORAGE_KEYS.EVENT_SETTINGS);
    return toEventSettings(data ? JSON.parse(data) : null);
  } catch (error) {
    console.error("Lecture impossible des paramètres de l'événement.", error);
    return DEFAULT_EVENT_SETTINGS;
  }
}

export function saveEventSettings(settings: EventSettings): void {
  write(STORAGE_KEYS.EVENT_SETTINGS, settings);
}
