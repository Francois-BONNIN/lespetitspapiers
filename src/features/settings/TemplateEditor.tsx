import { useRef } from "react";
import { AlertTriangle, Info, Plus, RotateCcw } from "lucide-react";
import { FieldLabel } from "@/components/ui/FieldLabel";
import {
  findUnknownPlaceholders,
  tokenPlaceholder,
  type MessageToken,
} from "@/domain/message";
import type { EventSettings } from "@/domain/types";
import { useI18n } from "@/i18n/language-context";

interface TemplateEditorProps {
  settings: EventSettings;
  onUpdate: (changes: Partial<EventSettings>) => void;
}

export function TemplateEditor({ settings, onUpdate }: TemplateEditorProps) {
  const { t } = useI18n();
  const templateRef = useRef<HTMLTextAreaElement>(null);
  const template = settings.messageTemplate ?? t.settings.defaultTemplate;
  const hiddenToken: MessageToken =
    settings.delivery === "link" ? "drawn" : "link";
  const tokens = (Object.keys(t.settings.tokens) as MessageToken[]).filter(
    (token) => token !== hiddenToken,
  );
  const unknownPlaceholders = findUnknownPlaceholders(template);

  const updateTemplate = (value: string) =>
    onUpdate({
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

  return (
    <>
      <FieldLabel htmlFor="settings-message">
        {t.settings.messageLabel}
      </FieldLabel>
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
          onClick={() => onUpdate({ messageTemplate: null })}
          className="btn btn-sm btn-ghost mt-2"
        >
          <RotateCcw size={14} />
          {t.settings.resetMessage}
        </button>
      )}
    </>
  );
}
