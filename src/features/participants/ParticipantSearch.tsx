import { Search } from "lucide-react";
import { useI18n } from "@/i18n/language-context";

interface ParticipantSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ParticipantSearch({ value, onChange }: ParticipantSearchProps) {
  const { t } = useI18n();

  return (
    <div className="relative mb-4">
      <Search
        size={16}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.participants.searchPlaceholder}
        className="field pl-10"
        aria-label={t.participants.searchLabel}
      />
    </div>
  );
}
