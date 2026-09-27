import type { Participant } from "./database";

export interface HomonymHint {
  index: number | null;
  label: string | null;
}

function firstNameKey(participant: Participant): string {
  const first = participant.name.trim().split(/\s+/)[0] ?? "";
  return first
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function groupKey(participant: Participant): string {
  return participant.family?.trim().toLowerCase() ?? "";
}

function groupBy(
  participants: Participant[],
  keyOf: (participant: Participant) => string
): Map<string, Participant[]> {
  const buckets = new Map<string, Participant[]>();

  participants.forEach((participant) => {
    const key = keyOf(participant);
    const bucket = buckets.get(key);
    if (bucket) bucket.push(participant);
    else buckets.set(key, [participant]);
  });

  return buckets;
}

function isSplitByGroup(cluster: Participant[]): boolean {
  return new Set(cluster.map((p) => p.family?.trim() ?? "")).size >= 2;
}

function rankSharedGroups(cluster: Participant[]): Map<string, number> {
  const ranks = new Map<string, number>();

  groupBy(cluster, groupKey).forEach((members) => {
    if (members.length < 2) return;
    members.forEach((member, position) => ranks.set(member.id, position + 1));
  });

  return ranks;
}

export function buildHomonymHints(
  participants: Participant[]
): Map<string, HomonymHint> {
  const named = participants.filter((participant) => firstNameKey(participant));
  const hints = new Map<string, HomonymHint>();

  groupBy(named, firstNameKey).forEach((cluster) => {
    if (cluster.length < 2) return;

    const labelled = isSplitByGroup(cluster);
    const ranks = rankSharedGroups(cluster);

    cluster.forEach((participant) => {
      const label = (labelled && participant.family?.trim()) || null;
      const index = ranks.get(participant.id) ?? null;
      if (!label && index === null) return;
      hints.set(participant.id, { index, label });
    });
  });

  return hints;
}

export function hintSuffix(
  hint: HomonymHint | undefined,
  { withLabel = true } = {}
): string {
  if (!hint) return "";

  return [
    withLabel ? hint.label : null,
    hint.index === null ? null : `#${hint.index}`,
  ]
    .filter(Boolean)
    .join(" ");
}

export function labelWithHint(
  name: string,
  hint: HomonymHint | undefined
): string {
  const suffix = hintSuffix(hint);
  return suffix ? `${name} (${suffix})` : name;
}
