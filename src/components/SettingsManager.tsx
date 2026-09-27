import { useRef } from "react";
import {
  AlertTriangle,
  Info,
  Plus,
  RotateCcw,
  Settings,
  Trash2,
} from "lucide-react";
import { EventSettings } from "../lib/database";
import {
  buildDrawMessage,
  findUnknownPlaceholders,
  tokenPlaceholder,
  type MessageToken,
} from "../lib/message";
import { Modal } from "./ui/Modal";
import { useI18n } from "./ui/language-context";

interface SettingsManagerProps {
  open: boolean;
  onClose: () => void;
  settings: EventSettings;
  onChange: (settings: EventSettings) => void;
  onClearAll: () => void;
}

export function SettingsManager({
  open,
  onClose,
  settings,
  onChange,
  onClearAll,
}: SettingsManagerProps) {
  const { t } = useI18n();
  const templateRef = useRef<HTMLTextAreaElement>(null);
  const template = settings.messageTemplate ?? t.settings.defaultTemplate;
  const tokens = Object.keys(t.settings.tokens) as MessageToken[];
  const unknownPlaceholders = findUnknownPlaceholders(template);

  const update = (changes: Partial<EventSettings>) =>
    onChange({ ...settings, ...changes });

  const updateTemplate = (value: string) =>
    update({
      messageTemplate: value === t.settings.defaultTemplate ? null : value,
    });

  const insertToken = (token: MessageToken) => {
    const textarea = templateRef.current;
    const placeholder = tokenPlaceholder(token, t);
    const start = textarea?.selectionStart ?? template.length;
    const end = textarea?.selectionEnd ?? template.length;
    const caret = start + placeholder.length;

    updateTemplate(template.slice(0, start) + placeholder + template.slice(end));
    requestAnimationFrame(() => {
      textarea?.focus();
      textarea?.setSelectionRange(caret, caret);
    });
  };

  const preview = buildDrawMessage(
    t.settings.previewDrawer,
    t.settings.previewDrawn,
    settings,
    t
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.settings.title}
      description={t.settings.description}
      icon={Settings}
      accent="brand"
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-500 dark:text-ink-400">
            {t.settings.autosave}
          </p>
          <button
            onClick={onClose}
            className="btn btn-md btn-primary max-sm:w-full"
          >
            {t.settings.done}
          </button>
        </div>
      }
    >
      <section aria-labelledby="settings-event-title" className="mb-7">
        <h3
          id="settings-event-title"
          className="text-sm font-semibold text-ink-900 dark:text-white"
        >
          {t.settings.eventTitle}
        </h3>
        <p className="mb-3 mt-1 text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
          {t.settings.eventHint}
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="settings-event-name">
              {t.settings.eventNameLabel}{" "}
              <span className="normal-case text-ink-400">
                {t.common.optional}
              </span>
            </label>
            <input
              id="settings-event-name"
              type="text"
              value={settings.eventName}
              onChange={(e) => update({ eventName: e.target.value })}
              placeholder={t.settings.eventNamePlaceholder}
              className="field"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="label" htmlFor="settings-budget">
              {t.settings.budgetLabel}{" "}
              <span className="normal-case text-ink-400">
                {t.common.optional}
              </span>
            </label>
            <input
              id="settings-budget"
              type="text"
              value={settings.budget}
              onChange={(e) => update({ budget: e.target.value })}
              placeholder={t.settings.budgetPlaceholder}
              className="field"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="label" htmlFor="settings-date">
              {t.settings.dateLabel}{" "}
              <span className="normal-case text-ink-400">
                {t.common.optional}
              </span>
            </label>
            <input
              id="settings-date"
              type="date"
              value={settings.exchangeDate}
              onChange={(e) => update({ exchangeDate: e.target.value })}
              className="field"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="settings-message-title">
        <h3
          id="settings-message-title"
          className="mb-3 text-sm font-semibold text-ink-900 dark:text-white"
        >
          {t.settings.messageTitle}
        </h3>

        <label className="label" htmlFor="settings-message">
          {t.settings.messageLabel}
        </label>
        <textarea
          id="settings-message"
          ref={templateRef}
          rows={7}
          value={template}
          onChange={(e) => updateTemplate(e.target.value)}
          className="field h-auto resize-y py-3 leading-relaxed"
          aria-describedby="settings-message-hint"
        />

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-ink-500 dark:text-ink-400">
            {t.settings.insertLabel}
          </span>
          {tokens.map((token) => (
            <button
              key={token}
              type="button"
              onClick={() => insertToken(token)}
              className="chip bg-brand-50 text-brand-700 ring-1 ring-brand-200 transition-colors hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-300 dark:ring-brand-500/30 dark:hover:bg-brand-500/20"
              title={t.settings.insertTitle(t.settings.tokenLabels[token])}
            >
              <Plus size={12} />
              {t.settings.tokenLabels[token]}
            </button>
          ))}
        </div>

        {unknownPlaceholders.length > 0 && (
          <p className="mt-3 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs leading-relaxed text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/[0.08] dark:text-amber-200">
            <AlertTriangle size={14} className="mt-px shrink-0" />
            {t.settings.unknownPlaceholders(unknownPlaceholders)}
          </p>
        )}

        <p
          id="settings-message-hint"
          className="mt-3 flex gap-2 text-xs leading-relaxed text-ink-500 dark:text-ink-400"
        >
          <Info size={14} className="mt-px shrink-0" />
          {t.settings.messageHint}
        </p>

        {settings.messageTemplate !== null && (
          <button
            type="button"
            onClick={() => update({ messageTemplate: null })}
            className="btn btn-sm btn-ghost mt-2"
          >
            <RotateCcw size={14} />
            {t.settings.resetMessage}
          </button>
        )}

        <div className="mt-5">
          <p className="label">{t.settings.previewTitle}</p>
          <p className="mb-2 text-xs text-ink-500 dark:text-ink-400">
            {t.settings.previewDescription}
          </p>
          <div className="card-inset whitespace-pre-wrap break-words p-4 text-sm leading-relaxed text-ink-800 dark:text-ink-100">
            {preview}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="settings-data-title"
        className="mt-7 border-t border-ink-200/80 pt-6 dark:border-white/10"
      >
        <h3
          id="settings-data-title"
          className="text-sm font-semibold text-ink-900 dark:text-white"
        >
          {t.settings.dataTitle}
        </h3>
        <p className="mb-3 mt-1 text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
          {t.settings.dataDescription}
        </p>
        <button
          type="button"
          onClick={onClearAll}
          className="btn btn-sm border border-rose-200 bg-white text-rose-700 hover:border-rose-300 hover:bg-rose-50 dark:border-rose-500/30 dark:bg-transparent dark:text-rose-300 dark:hover:bg-rose-500/10"
        >
          <Trash2 size={15} />
          {t.settings.clearAll}
        </button>
      </section>
    </Modal>
  );
}
