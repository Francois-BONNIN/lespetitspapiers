import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "@/i18n/language-context";
import type { ToastVariant } from "./toast-context";

export interface ToastMessage {
  id: number;
  variant: ToastVariant;
  title: string;
  description?: string;
}

const VARIANTS: Record<
  ToastVariant,
  { icon: LucideIcon; accent: string; iconColor: string }
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

interface ToastCardProps {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}

export function ToastCard({ toast, onDismiss }: ToastCardProps) {
  const { t } = useI18n();
  const { icon: Icon, accent, iconColor } = VARIANTS[toast.variant];

  return (
    <div
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
          {toast.title}
        </p>
        {toast.description && (
          <p className="mt-0.5 text-[13px] leading-snug text-ink-500 dark:text-ink-400">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="btn btn-ghost btn-icon -mr-1 -mt-1 h-7 w-7"
        aria-label={t.common.closeNotification}
      >
        <X size={15} />
      </button>
    </div>
  );
}
