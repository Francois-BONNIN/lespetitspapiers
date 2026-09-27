import { useRef, type ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { useI18n } from "@/i18n/language-context";

export function CsvImportButton({ onImport }: { onImport: (file: File) => void }) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = "";
    }
  };

  return (
    <>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="btn btn-sm btn-outline"
        title={t.participants.importTitle}
      >
        <Upload size={15} />
        {t.participants.importAction}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}
