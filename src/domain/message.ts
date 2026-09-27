import { translations, type Translation } from "@/i18n/translations";
import type { EventSettings } from "./types";

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

function tokenOf(name: string): MessageToken | undefined {
  return tokenByAlias.get(name.trim().toLowerCase());
}

export function findUnknownPlaceholders(template: string): string[] {
  const unknown = new Set<string>();
  for (const [placeholder, name] of template.matchAll(TOKEN_PATTERN)) {
    if (!tokenOf(name)) unknown.add(placeholder);
  }
  return Array.from(unknown);
}

function containsToken(template: string, token: MessageToken): boolean {
  return Array.from(template.matchAll(TOKEN_PATTERN)).some(
    ([, name]) => tokenOf(name) === token
  );
}

export function formatExchangeDate(value: string, locale: string): string {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(date);
}

export function formatDrawDate(value: string, locale: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(locale, {
        dateStyle: "long",
        timeStyle: "short",
      }).format(date);
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
        const token = tokenOf(name);
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
  t: Translation,
  personalLink = ""
): string {
  const sendsLink = settings.delivery === "link";
  const template = settings.messageTemplate ?? t.settings.defaultTemplate;
  const templateWithLink =
    sendsLink && !containsToken(template, "link")
      ? `${template}\n\n${tokenPlaceholder("link", t)}`
      : template;

  return renderMessage(templateWithLink, {
    participant: drawerName,
    drawn: sendsLink ? "" : drawnName,
    link: sendsLink ? personalLink : "",
    event: settings.eventName,
    budget: settings.budget,
    date: formatExchangeDate(settings.exchangeDate, t.meta.locale),
  });
}
