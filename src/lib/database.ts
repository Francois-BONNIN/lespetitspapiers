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
  PARTICIPANTS: "secret_santa_participants",
  EXCLUSIONS: "secret_santa_exclusions",
  INCLUSIONS: "secret_santa_inclusions",
  DRAWS: "secret_santa_draws",
  EXCLUDE_SAME_FAMILY: "secret_santa_exclude_same_family",
};

function generateId(): string {
  return uuidv4();
}

// Participants
export function getParticipants(): Participant[] {
  const data = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
  return data ? JSON.parse(data) : [];
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
  localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));
  return newParticipant;
}

// Exclusions
export function getExclusions(): Exclusion[] {
  const data = localStorage.getItem(STORAGE_KEYS.EXCLUSIONS);
  return data ? JSON.parse(data) : [];
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
  localStorage.setItem(STORAGE_KEYS.EXCLUSIONS, JSON.stringify(exclusions));
  return newExclusion;
}

export function deleteExclusion(id: string): void {
  const exclusions = getExclusions().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEYS.EXCLUSIONS, JSON.stringify(exclusions));
}

// Inclusions
export function getInclusions(): Inclusion[] {
  const data = localStorage.getItem(STORAGE_KEYS.INCLUSIONS);
  return data ? JSON.parse(data) : [];
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
  localStorage.setItem(STORAGE_KEYS.INCLUSIONS, JSON.stringify(inclusions));
  return newInclusion;
}

export function deleteInclusion(id: string): void {
  const inclusions = getInclusions().filter((i) => i.id !== id);
  localStorage.setItem(STORAGE_KEYS.INCLUSIONS, JSON.stringify(inclusions));
}

export function deleteParticipant(id: string): void {
  const participants = getParticipants().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));

  // Supprimer aussi les exclusions, inclusions et tirages liés
  const exclusions = getExclusions().filter(
    (e) => e.participant_id !== id && e.excluded_participant_id !== id
  );
  localStorage.setItem(STORAGE_KEYS.EXCLUSIONS, JSON.stringify(exclusions));

  const inclusions = getInclusions().filter(
    (i) => i.participant_id !== id && i.included_participant_id !== id
  );
  localStorage.setItem(STORAGE_KEYS.INCLUSIONS, JSON.stringify(inclusions));

  const draws = getDraws().filter(
    (d) => d.drawer_id !== id && d.drawn_id !== id
  );
  localStorage.setItem(STORAGE_KEYS.DRAWS, JSON.stringify(draws));
}

// Draws
export function getDraws(): Draw[] {
  const data = localStorage.getItem(STORAGE_KEYS.DRAWS);
  return data ? JSON.parse(data) : [];
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
  localStorage.setItem(STORAGE_KEYS.DRAWS, JSON.stringify(newDraws));
  return newDraws;
}

export function clearDraws(): void {
  localStorage.setItem(STORAGE_KEYS.DRAWS, JSON.stringify([]));
}

// Exclude Same Family Setting
export function getExcludeSameFamilySetting(): boolean {
  const data = localStorage.getItem(STORAGE_KEYS.EXCLUDE_SAME_FAMILY);
  return data ? JSON.parse(data) : true;
}

export function setExcludeSameFamilySetting(value: boolean): void {
  localStorage.setItem(STORAGE_KEYS.EXCLUDE_SAME_FAMILY, JSON.stringify(value));
}
