import type { Participant } from "./database";

export interface HomonymHint {
  index: number | null;
  label: string | null;
}

const DISCRIMINANTS = ["family", "email"] as const;

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

function findDiscriminant(cluster: Participant[]) {
  return DISCRIMINANTS.find(
    (field) => new Set(cluster.map((p) => p[field]?.trim() ?? "")).size >= 2
  );
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

    const discriminant = findDiscriminant(cluster);
    const ranks = rankSharedGroups(cluster);

    cluster.forEach((participant) => {
      const label =
        (discriminant && participant[discriminant]?.trim()) || null;
      const index = ranks.get(participant.id) ?? null;
      if (!label && index === null) return;
      hints.set(participant.id, { index, label });
    });
  });

  return hints;
}

export function labelWithHint(
  name: string,
  hint: HomonymHint | undefined
): string {
  if (!hint) return name;

  const suffix = [hint.label, hint.index === null ? null : `#${hint.index}`]
    .filter(Boolean)
    .join(" ");

  return suffix ? `${name} (${suffix})` : name;
}
