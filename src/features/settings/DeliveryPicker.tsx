import { Link2, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Delivery } from "@/domain/types";
import { useI18n } from "@/i18n/language-context";

interface DeliveryOption {
  value: Delivery;
  icon: LucideIcon;
  label: string;
  description: string;
}

interface DeliveryPickerProps {
  value: Delivery;
  onChange: (delivery: Delivery) => void;
}

export function DeliveryPicker({ value, onChange }: DeliveryPickerProps) {
  const { t } = useI18n();

  const options: DeliveryOption[] = [
    {
      value: "message",
      icon: MessageSquare,
      label: t.settings.deliveryMessage,
      description: t.settings.deliveryMessageDescription,
    },
    {
      value: "link",
      icon: Link2,
      label: t.settings.deliveryLink,
      description: t.settings.deliveryLinkDescription,
    },
  ];

  return (
    <fieldset className="mb-4">
      <legend className="label">{t.settings.deliveryLabel}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const Icon = option.icon;
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={`card-inset flex cursor-pointer items-start gap-3 p-3.5 transition-colors ${
                selected
                  ? "border-brand-400 bg-brand-50/60 ring-1 ring-brand-400 dark:border-brand-400/60 dark:bg-brand-500/10 dark:ring-brand-400/60"
                  : "hover:bg-ink-100/60 dark:hover:bg-white/[0.06]"
              }`}
            >
              <input
                type="radio"
                name="settings-delivery"
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer"
              />
              <span className="min-w-0">
                <span className="flex items-center gap-2 text-sm font-semibold text-ink-900 dark:text-white">
                  <Icon size={15} className="text-ink-400" />
                  {option.label}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-ink-500 dark:text-ink-400">
                  {option.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
