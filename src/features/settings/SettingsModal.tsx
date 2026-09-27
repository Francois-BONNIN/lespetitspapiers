import { Settings } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import type { EventSettings } from "@/domain/types";
import { useI18n } from "@/i18n/language-context";
import { DataSection } from "./DataSection";
import { DeliveryPicker } from "./DeliveryPicker";
import { EventSection } from "./EventSection";
import { MessagePreview } from "./MessagePreview";
import { SettingsSection } from "./SettingsSection";
import { TemplateEditor } from "./TemplateEditor";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  settings: EventSettings;
  onChange: (settings: EventSettings) => void;
  onClearAll: () => void;
}

export function SettingsModal({
  open,
  onClose,
  settings,
  onChange,
  onClearAll,
}: SettingsModalProps) {
  const { t } = useI18n();

  const update = (changes: Partial<EventSettings>) =>
    onChange({ ...settings, ...changes });

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
      <EventSection settings={settings} onUpdate={update} />

      <SettingsSection id="message" title={t.settings.messageTitle}>
        <DeliveryPicker
          value={settings.delivery}
          onChange={(delivery) => update({ delivery })}
        />
        <TemplateEditor settings={settings} onUpdate={update} />
        <MessagePreview settings={settings} />
      </SettingsSection>

      <DataSection onClearAll={onClearAll} />
    </Modal>
  );
}
