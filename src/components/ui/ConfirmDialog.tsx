import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { useI18n } from "./language-context";
import {
  ConfirmContext,
  type ConfirmFn,
  type ConfirmOptions,
} from "./confirm-context";

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  const confirm = useCallback<ConfirmFn>((opts) => {
    setOptions(opts);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = useCallback((result: boolean) => {
    resolver.current?.(result);
    resolver.current = null;
    setOptions(null);
  }, []);

  useEffect(() => {
    if (!options) return;
    confirmButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [options, close]);

  const danger = options?.tone !== "neutral";

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {options && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/50 p-4 backdrop-blur-sm animate-fade-in sm:items-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close(false);
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
                onClick={() => close(false)}
                className="btn btn-md btn-secondary"
              >
                {options.cancelLabel ?? t.common.cancel}
              </button>
              <button
                ref={confirmButtonRef}
                onClick={() => close(true)}
                className={`btn btn-md ${danger ? "btn-accent" : "btn-primary"}`}
              >
                {options.confirmLabel ?? t.common.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
