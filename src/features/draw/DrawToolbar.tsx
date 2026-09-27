import {
  Copy,
  Download,
  Eye,
  EyeOff,
  MoreHorizontal,
  RotateCcw,
} from "lucide-react";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { useI18n } from "@/i18n/language-context";

interface DrawToolbarProps {
  allRevealed: boolean;
  onToggleRevealAll: () => void;
  onCopyAll: () => void;
  onExportCsv: () => void;
  onRestart: () => void;
}

export function DrawToolbar({
  allRevealed,
  onToggleRevealAll,
  onCopyAll,
  onExportCsv,
  onRestart,
}: DrawToolbarProps) {
  const { t } = useI18n();

  return (
    <>
      <ActionMenu
        icon={MoreHorizontal}
        label={t.draw.moreActions}
        items={[
          {
            id: "reveal-all",
            icon: allRevealed ? EyeOff : Eye,
            label: allRevealed ? t.draw.hideAll : t.draw.revealAll,
            description: allRevealed
              ? t.draw.hideAllDescription
              : t.draw.revealAllDescription,
            onSelect: onToggleRevealAll,
          },
          {
            id: "copy-all",
            icon: Copy,
            label: t.draw.copyAll,
            description: t.draw.copyAllDescription,
            onSelect: onCopyAll,
          },
          {
            id: "export-csv",
            icon: Download,
            label: t.draw.csv,
            description: t.draw.csvDescription,
            onSelect: onExportCsv,
          },
        ]}
      />
      <button onClick={onRestart} className="btn btn-sm btn-outline">
        <RotateCcw size={15} />
        {t.draw.restart}
      </button>
    </>
  );
}
