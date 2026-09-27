import {
  toEventSettings,
  type Draw,
  type EventSettings,
  type Exclusion,
  type Inclusion,
  type Participant,
  type SetupSnapshot,
} from "./database";

const SETUP_HASH_PREFIX = "#share=";
const SHARE_FORMAT_VERSION = 1;

type IndexPair = [number, number];

interface SharePayload {
  v: number;
  p: Array<[string, string?]>;
  x: IndexPair[];
  i: IndexPair[];
  s: 0 | 1;
  a: 0 | 1;
  m: EventSettings;
  r?: IndexPair[];
  w?: string;
}

export interface ShareSource {
  participants: Participant[];
  exclusions: Exclusion[];
  inclusions: Inclusion[];
  draws: Draw[];
  excludeSameFamily: boolean;
  avoidReciprocal: boolean;
  eventSettings: EventSettings;
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

async function encodeJson(value: unknown): Promise<string> {
  const compressed = await pipeBytes(
    new TextEncoder().encode(JSON.stringify(value)),
    new CompressionStream("deflate-raw")
  );
  return bytesToBase64Url(compressed);
}

async function decodeJson(encoded: string): Promise<unknown> {
  const bytes = await pipeBytes(
    base64UrlToBytes(encoded),
    new DecompressionStream("deflate-raw")
  );
  return JSON.parse(new TextDecoder().decode(bytes));
}

function currentPageLink(hash: string): string {
  const { origin, pathname, search } = window.location;
  return `${origin}${pathname}${search}${hash}`;
}

function toPayload(source: ShareSource, includeDraws: boolean): SharePayload {
  const indexById = new Map(source.participants.map((p, index) => [p.id, index]));
  const toPairs = (links: Array<[string, string]>) =>
    links.flatMap(([from, to]): IndexPair[] => {
      const fromIndex = indexById.get(from);
      const toIndex = indexById.get(to);
      return fromIndex === undefined || toIndex === undefined
        ? []
        : [[fromIndex, toIndex]];
    });

  const payload: SharePayload = {
    v: SHARE_FORMAT_VERSION,
    p: source.participants.map((p) =>
      p.family ? [p.name, p.family] : [p.name]
    ),
    x: toPairs(
      source.exclusions.map((e) => [e.participant_id, e.excluded_participant_id])
    ),
    i: toPairs(
      source.inclusions.map((i) => [i.participant_id, i.included_participant_id])
    ),
    s: source.excludeSameFamily ? 1 : 0,
    a: source.avoidReciprocal ? 1 : 0,
    m: source.eventSettings,
  };

  if (includeDraws && source.draws.length > 0) {
    payload.r = toPairs(source.draws.map((d) => [d.drawer_id, d.drawn_id]));
    payload.w = source.draws[0].draw_date;
  }

  return payload;
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

function fromPayload(raw: unknown): SetupSnapshot | null {
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
    draws: pairs(payload.r),
    drawDate: optionalText(payload.w),
    excludeSameFamily: payload.s !== 0,
    avoidReciprocal: payload.a === 1,
    eventSettings: payload.m === undefined ? null : toEventSettings(payload.m),
  };
}

export async function buildShareUrl(
  source: ShareSource,
  includeDraws: boolean
): Promise<string> {
  const encoded = await encodeJson(toPayload(source, includeDraws));
  return currentPageLink(`${SETUP_HASH_PREFIX}${encoded}`);
}

export function takeSharePayloadFromUrl(): string | null {
  const { hash, pathname, search } = window.location;
  if (!hash.startsWith(SETUP_HASH_PREFIX)) return null;
  window.history.replaceState(null, "", `${pathname}${search}`);
  return hash.slice(SETUP_HASH_PREFIX.length);
}

export async function decodeSharePayload(
  encoded: string
): Promise<SetupSnapshot | null> {
  try {
    return fromPayload(await decodeJson(encoded));
  } catch (error) {
    console.error("Lien de partage illisible.", error);
    return null;
  }
}
