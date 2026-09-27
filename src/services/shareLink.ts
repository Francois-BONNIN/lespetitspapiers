import { toEventSettings } from "@/domain/eventSettings";
import type {
  EventSettings,
  IndexPair,
  Setup,
  SetupSnapshot,
} from "@/domain/types";
import {
  decodeCompressedJson,
  encodeCompressedJson,
} from "./compressedJson";

const SETUP_HASH_PREFIX = "#share=";
const REVEAL_HASH_PREFIX = "#reveal=";
const SHARE_FORMAT_VERSION = 1;

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

interface RevealPayload {
  v: number;
  f: string;
  t: string;
  e: string;
  b: string;
  x: string;
  w: string | null;
}

export interface PersonalDraw {
  drawerName: string;
  drawnName: string;
  eventName: string;
  budget: string;
  exchangeDate: string;
  drawDate: string | null;
}

function currentPageLink(hash: string): string {
  const { origin, pathname, search } = window.location;
  return `${origin}${pathname}${search}${hash}`;
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function optionalText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function toPayload(setup: Setup, includeDraws: boolean): SharePayload {
  const indexById = new Map(setup.participants.map((p, index) => [p.id, index]));
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
    p: setup.participants.map((p) =>
      p.family ? [p.name, p.family] : [p.name],
    ),
    x: toPairs(
      setup.exclusions.map((e) => [e.participant_id, e.excluded_participant_id]),
    ),
    i: toPairs(
      setup.inclusions.map((i) => [i.participant_id, i.included_participant_id]),
    ),
    s: setup.excludeSameFamily ? 1 : 0,
    a: setup.avoidReciprocal ? 1 : 0,
    m: setup.eventSettings,
  };

  if (includeDraws && setup.draws.length > 0) {
    payload.r = toPairs(setup.draws.map((d) => [d.drawer_id, d.drawn_id]));
    payload.w = setup.draws[0].draw_date;
  }

  return payload;
}

function isIndexPair(value: unknown, size: number): value is IndexPair {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every(
      (index) => Number.isInteger(index) && index >= 0 && index < size,
    ) &&
    value[0] !== value[1]
  );
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
    return name ? [{ name, family: optionalText(entry[1]) }] : [];
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
  setup: Setup,
  includeDraws: boolean,
): Promise<string> {
  const encoded = await encodeCompressedJson(toPayload(setup, includeDraws));
  return currentPageLink(`${SETUP_HASH_PREFIX}${encoded}`);
}

export async function buildRevealUrl(draw: PersonalDraw): Promise<string> {
  const payload: RevealPayload = {
    v: SHARE_FORMAT_VERSION,
    f: draw.drawerName,
    t: draw.drawnName,
    e: draw.eventName,
    b: draw.budget,
    x: draw.exchangeDate,
    w: draw.drawDate,
  };
  const encoded = await encodeCompressedJson(payload);
  return currentPageLink(`${REVEAL_HASH_PREFIX}${encoded}`);
}

export function takeSharePayloadFromUrl(): string | null {
  const { hash, pathname, search } = window.location;
  if (!hash.startsWith(SETUP_HASH_PREFIX)) return null;
  window.history.replaceState(null, "", `${pathname}${search}`);
  return hash.slice(SETUP_HASH_PREFIX.length);
}

export function readRevealPayloadFromUrl(): string | null {
  const { hash } = window.location;
  return hash.startsWith(REVEAL_HASH_PREFIX)
    ? hash.slice(REVEAL_HASH_PREFIX.length)
    : null;
}

export function clearLinkFromUrl(): void {
  const { pathname, search } = window.location;
  window.history.replaceState(null, "", `${pathname}${search}`);
}

export async function decodeSharePayload(
  encoded: string,
): Promise<SetupSnapshot | null> {
  try {
    return fromPayload(await decodeCompressedJson(encoded));
  } catch (error) {
    console.error("Lien de partage illisible.", error);
    return null;
  }
}

export async function decodeRevealPayload(
  encoded: string,
): Promise<PersonalDraw | null> {
  try {
    const raw = await decodeCompressedJson(encoded);
    if (typeof raw !== "object" || raw === null) return null;
    const payload = raw as Partial<Record<keyof RevealPayload, unknown>>;
    if (payload.v !== SHARE_FORMAT_VERSION) return null;

    const drawerName = text(payload.f).trim();
    const drawnName = text(payload.t).trim();
    if (!drawerName || !drawnName) return null;

    return {
      drawerName,
      drawnName,
      eventName: text(payload.e).trim(),
      budget: text(payload.b).trim(),
      exchangeDate: text(payload.x),
      drawDate: optionalText(payload.w),
    };
  } catch (error) {
    console.error("Lien personnel illisible.", error);
    return null;
  }
}
