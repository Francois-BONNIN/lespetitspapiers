import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { useI18n } from "@/i18n/language-context";
import type { ConfirmOptions } from "./confirm-context";

interface ConfirmDialogProps {
  options: ConfirmOptions;
  onClose: (confirmed: boolean) => void;
}

export function ConfirmDialog({ options, onClose }: ConfirmDialogProps) {
  const { t } = useI18n();
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const danger = options.tone !== "neutral";

  useEffect(() => {
    confirmButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [options, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/50 p-4 backdrop-blur-sm animate-fade-in sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose(false);
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-md animate-scale-in rounded-2xl border border-ink-200 bg-white p-6 shadow-card-hover dark:border-white/10 dark:bg-ink-900"
      >
        <div className="flex gap-4">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
              danger
                ? "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400"
                : "bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-300"
            }`}
          >
            <AlertTriangle size={20} />
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <h2
              id="confirm-title"
              className="font-display text-lg font-semibold text-ink-900 dark:text-white"
            >
              {options.title}
            </h2>
            {options.description && (
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
                {options.description}
              </p>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={() => onClose(false)}
            className="btn btn-md btn-outline"
          >
            {options.cancelLabel ?? t.common.cancel}
          </button>
          <button
            ref={confirmButtonRef}
            onClick={() => onClose(true)}
            className={`btn btn-md ${danger ? "btn-accent" : "btn-primary"}`}
          >
            {options.confirmLabel ?? t.common.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
