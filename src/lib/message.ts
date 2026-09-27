import { translations, type Translation } from "./i18n";
import type { EventSettings } from "./database";

export type MessageToken = keyof Translation["settings"]["tokens"];

const TOKEN_PATTERN = /\{([^{}\n]+)\}/g;

const tokenByAlias = new Map<string, MessageToken>(
  Object.values(translations).flatMap((dictionary) =>
    (
      Object.entries(dictionary.settings.tokens) as Array<[MessageToken, string]>
    ).map(([token, alias]): [string, MessageToken] => [
      alias.toLowerCase(),
      token,
    ])
  )
);

export function tokenPlaceholder(token: MessageToken, t: Translation): string {
  return `{${t.settings.tokens[token]}}`;
}

export function findUnknownPlaceholders(template: string): string[] {
  const unknown = new Set<string>();
  for (const [placeholder, name] of template.matchAll(TOKEN_PATTERN)) {
    if (!tokenByAlias.has(name.trim().toLowerCase())) unknown.add(placeholder);
  }
  return Array.from(unknown);
}

function formatExchangeDate(value: string, locale: string): string {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(date);
}

export function renderMessage(
  template: string,
  values: Record<MessageToken, string>
): string {
  return template
    .split("\n")
    .flatMap((line) => {
      let hasEmptyValue = false;
      const rendered = line.replace(TOKEN_PATTERN, (match, name: string) => {
        const token = tokenByAlias.get(name.trim().toLowerCase());
        if (!token) return match;
        const value = values[token].trim();
        if (!value) hasEmptyValue = true;
        return value;
      });
      return hasEmptyValue ? [] : [rendered];
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function buildDrawMessage(
  drawerName: string,
  drawnName: string,
  settings: EventSettings,
  t: Translation
): string {
  return renderMessage(settings.messageTemplate ?? t.settings.defaultTemplate, {
    participant: drawerName,
    drawn: drawnName,
    event: settings.eventName,
    budget: settings.budget,
    date: formatExchangeDate(settings.exchangeDate, t.meta.locale),
  });
}
