import { FieldLabel } from "@/components/ui/FieldLabel";
import type { EventSettings } from "@/domain/types";
import { useI18n } from "@/i18n/language-context";
import { SettingsSection } from "./SettingsSection";

interface EventSectionProps {
  settings: EventSettings;
  onUpdate: (changes: Partial<EventSettings>) => void;
}

export function EventSection({ settings, onUpdate }: EventSectionProps) {
  const { t } = useI18n();

  return (
    <SettingsSection
      id="event"
      title={t.settings.eventTitle}
      description={t.settings.eventHint}
      className="mb-7"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FieldLabel htmlFor="settings-event-name" optional>
            {t.settings.eventNameLabel}
          </FieldLabel>
          <input
            id="settings-event-name"
            type="text"
            value={settings.eventName}
            onChange={(e) => onUpdate({ eventName: e.target.value })}
            placeholder={t.settings.eventNamePlaceholder}
            className="field"
            autoComplete="off"
          />
        </div>
        <div>
          <FieldLabel htmlFor="settings-budget" optional>
            {t.settings.budgetLabel}
          </FieldLabel>
          <input
            id="settings-budget"
            type="text"
            value={settings.budget}
            onChange={(e) => onUpdate({ budget: e.target.value })}
            placeholder={t.settings.budgetPlaceholder}
            className="field"
            autoComplete="off"
          />
        </div>
        <div>
          <FieldLabel htmlFor="settings-date" optional>
            {t.settings.dateLabel}
          </FieldLabel>
          <input
            id="settings-date"
            type="date"
            value={settings.exchangeDate}
            onChange={(e) => onUpdate({ exchangeDate: e.target.value })}
            className="field"
          />
        </div>
      </div>
    </SettingsSection>
  );
}
