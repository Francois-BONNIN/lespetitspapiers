import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useI18n } from "@/i18n/language-context";
import { ToastCard, type ToastMessage } from "./ToastCard";
import {
  ToastContext,
  type ToastContextValue,
  type ToastVariant,
} from "./toast-context";

export function ToastProvider({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, variant, title, description }]);
      window.setTimeout(() => dismiss(id), variant === "error" ? 7000 : 4500);
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toast,
      success: (title, description) => toast("success", title, description),
      error: (title, description) => toast("error", title, description),
      info: (title, description) => toast("info", title, description),
      warning: (title, description) => toast("warning", title, description),
    }),
    [toast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:top-0 sm:items-end sm:p-6"
        role="region"
        aria-label={t.common.notifications}
      >
        {toasts.map((item) => (
          <ToastCard key={item.id} toast={item} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
