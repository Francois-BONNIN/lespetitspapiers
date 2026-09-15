import { v4 as uuidv4 } from "uuid";

export interface Participant {
  id: string;
  name: string;
  email: string | null;
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

const STORAGE_KEYS = {
  PARTICIPANTS: "petits_papiers_participants",
  EXCLUSIONS: "petits_papiers_exclusions",
  INCLUSIONS: "petits_papiers_inclusions",
  DRAWS: "petits_papiers_draws",
  EXCLUDE_SAME_FAMILY: "petits_papiers_exclude_same_group",
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
  email: string | null,
  family: string | null
): Participant {
  const participants = getParticipants();
  const newParticipant: Participant = {
    id: generateId(),
    name,
    email,
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
