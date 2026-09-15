import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useI18n } from "./language-context";
import {
  ToastContext,
  type ToastContextValue,
  type ToastVariant,
} from "./toast-context";

interface Toast {
  id: number;
  variant: ToastVariant;
  title: string;
  description?: string;
}

const VARIANTS: Record<
  ToastVariant,
  { icon: typeof Info; accent: string; iconColor: string }
> = {
  success: {
    icon: CheckCircle2,
    accent: "bg-brand-500",
    iconColor: "text-brand-600 dark:text-brand-400",
  },
  error: {
    icon: XCircle,
    accent: "bg-rose-500",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  warning: {
    icon: AlertTriangle,
    accent: "bg-amber-500",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  info: {
    icon: Info,
    accent: "bg-ink-400",
    iconColor: "text-ink-500 dark:text-ink-300",
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const { t: i18n } = useI18n();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, variant, title, description }]);
      window.setTimeout(() => dismiss(id), variant === "error" ? 7000 : 4500);
    },
    [dismiss]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toast,
      success: (title, description) => toast("success", title, description),
      error: (title, description) => toast("error", title, description),
      info: (title, description) => toast("info", title, description),
      warning: (title, description) => toast("warning", title, description),
    }),
    [toast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:top-0 sm:items-end sm:p-6"
        role="region"
        aria-label={i18n.common.notifications}
      >
        {toasts.map((t) => {
          const { icon: Icon, accent, iconColor } = VARIANTS[t.variant];
          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto relative flex w-full max-w-sm animate-slide-in-right items-start gap-3 overflow-hidden rounded-xl border border-ink-200/80 bg-white p-3.5 pl-4 shadow-card-hover dark:border-white/10 dark:bg-ink-800"
            >
              <span
                className={`absolute left-0 top-0 h-full w-1 ${accent}`}
                aria-hidden
              />
              <Icon size={18} className={`mt-0.5 shrink-0 ${iconColor}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink-900 dark:text-white">
                  {t.title}
                </p>
                {t.description && (
                  <p className="mt-0.5 text-[13px] leading-snug text-ink-500 dark:text-ink-400">
                    {t.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="btn btn-ghost btn-icon -mr-1 -mt-1 h-7 w-7"
                aria-label={i18n.common.closeNotification}
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
