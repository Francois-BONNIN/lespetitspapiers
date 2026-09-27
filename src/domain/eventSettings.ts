import type { EventSettings } from "./types";

export const DEFAULT_EVENT_SETTINGS: EventSettings = {
  eventName: "",
  budget: "",
  exchangeDate: "",
  messageTemplate: null,
  delivery: "message",
};

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
