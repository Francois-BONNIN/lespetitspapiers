import type { Exclusion, Inclusion, Participant } from "./database";

const SHARE_HASH_PREFIX = "#share=";
const SHARE_FORMAT_VERSION = 1;

type IndexPair = [number, number];

export interface SharedSetup {
  participants: Array<{
    name: string;
    family: string | null;
  }>;
  exclusions: IndexPair[];
  inclusions: IndexPair[];
  excludeSameFamily: boolean;
}

interface SharePayload {
  v: number;
  p: Array<[string, string?]>;
  x: IndexPair[];
  i: IndexPair[];
  s: 0 | 1;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "="));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function pipeBytes(
  bytes: Uint8Array,
  transform: CompressionStream | DecompressionStream
): Promise<Uint8Array> {
  const stream = new Blob([bytes]).stream().pipeThrough(transform);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

function toPayload(
  participants: Participant[],
  exclusions: Exclusion[],
  inclusions: Inclusion[],
  excludeSameFamily: boolean
): SharePayload {
  const indexById = new Map(participants.map((p, index) => [p.id, index]));
  const toPairs = (links: Array<[string, string]>) =>
    links.flatMap(([from, to]): IndexPair[] => {
      const fromIndex = indexById.get(from);
      const toIndex = indexById.get(to);
      return fromIndex === undefined || toIndex === undefined
        ? []
        : [[fromIndex, toIndex]];
    });

  return {
    v: SHARE_FORMAT_VERSION,
    p: participants.map((p) =>
      p.family ? [p.name, p.family] : [p.name]
    ),
    x: toPairs(
      exclusions.map((e) => [e.participant_id, e.excluded_participant_id])
    ),
    i: toPairs(
      inclusions.map((i) => [i.participant_id, i.included_participant_id])
    ),
    s: excludeSameFamily ? 1 : 0,
  };
}

function isIndexPair(value: unknown, size: number): value is IndexPair {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every(
      (index) => Number.isInteger(index) && index >= 0 && index < size
    ) &&
    value[0] !== value[1]
  );
}

function optionalText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function fromPayload(raw: unknown): SharedSetup | null {
  if (typeof raw !== "object" || raw === null) return null;
  const payload = raw as Partial<SharePayload>;
  if (payload.v !== SHARE_FORMAT_VERSION || !Array.isArray(payload.p)) {
    return null;
  }

  const participants = payload.p.flatMap((entry) => {
    if (!Array.isArray(entry)) return [];
    const name = optionalText(entry[0]);
    return name
      ? [{ name, family: optionalText(entry[1]) }]
      : [];
  });
  if (participants.length !== payload.p.length) return null;

  const size = participants.length;
  const pairs = (value: unknown) =>
    Array.isArray(value)
      ? value.filter((pair): pair is IndexPair => isIndexPair(pair, size))
      : [];

  return {
    participants,
    exclusions: pairs(payload.x),
    inclusions: pairs(payload.i),
    excludeSameFamily: payload.s !== 0,
  };
}

export async function buildShareUrl(
  participants: Participant[],
  exclusions: Exclusion[],
  inclusions: Inclusion[],
  excludeSameFamily: boolean
): Promise<string> {
  const json = JSON.stringify(
    toPayload(participants, exclusions, inclusions, excludeSameFamily)
  );
  const compressed = await pipeBytes(
    new TextEncoder().encode(json),
    new CompressionStream("deflate-raw")
  );
  const { origin, pathname, search } = window.location;
  return `${origin}${pathname}${search}${SHARE_HASH_PREFIX}${bytesToBase64Url(compressed)}`;
}

export function takeSharePayloadFromUrl(): string | null {
  const { hash, pathname, search } = window.location;
  if (!hash.startsWith(SHARE_HASH_PREFIX)) return null;
  window.history.replaceState(null, "", `${pathname}${search}`);
  return hash.slice(SHARE_HASH_PREFIX.length);
}

export async function decodeSharePayload(
  encoded: string
): Promise<SharedSetup | null> {
  try {
    const bytes = await pipeBytes(
      base64UrlToBytes(encoded),
      new DecompressionStream("deflate-raw")
    );
    return fromPayload(JSON.parse(new TextDecoder().decode(bytes)));
  } catch (error) {
    console.error("Lien de partage illisible.", error);
    return null;
  }
}
