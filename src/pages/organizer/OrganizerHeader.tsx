import { Settings } from "lucide-react";
import { BrandMark } from "@/components/layout/BrandMark";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ShareMenu } from "@/features/share/ShareMenu";
import { useI18n } from "@/i18n/language-context";

interface OrganizerHeaderProps {
  canShare: boolean;
  hasDraws: boolean;
  onCopyShareLink: () => void;
  onCopyFullLink: () => void;
  onOpenSettings: () => void;
}

export function OrganizerHeader({
  canShare,
  hasDraws,
  onCopyShareLink,
  onCopyFullLink,
  onOpenSettings,
}: OrganizerHeaderProps) {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-30 border-b border-ink-200/70 bg-ink-50/80 backdrop-blur-md dark:border-white/10 dark:bg-ink-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <BrandMark tagline={t.header.tagline} />

        <div className="flex items-center gap-2">
          <ShareMenu
            disabled={!canShare}
            hasDraws={hasDraws}
            onCopyShareLink={onCopyShareLink}
            onCopyFullLink={onCopyFullLink}
          />
          <button
            onClick={onOpenSettings}
            className="btn btn-sm btn-outline rounded-full"
            aria-label={t.settings.open}
            title={t.settings.open}
          >
            <Settings size={15} />
            <span className="hidden sm:inline">{t.settings.open}</span>
          </button>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
