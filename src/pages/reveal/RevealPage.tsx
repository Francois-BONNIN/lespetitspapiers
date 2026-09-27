import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/layout/BrandMark";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useI18n } from "@/i18n/language-context";
import type { PersonalDraw } from "@/services/shareLink";
import { PaperSlip } from "./PaperSlip";

interface RevealPageProps {
  draw: PersonalDraw | null;
  onExit: () => void;
}

export function RevealPage({ draw, onExit }: RevealPageProps) {
  const { t } = useI18n();

  return (
    <div className="aurora-bg flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <BrandMark />
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-16 pt-6">
        <section className="card w-full max-w-md animate-fade-up p-6 text-center sm:p-8">
          {draw ? (
            <PaperSlip draw={draw} />
          ) : (
            <p className="py-10 text-sm text-ink-500 dark:text-ink-400">
              {t.reveal.loading}
            </p>
          )}
        </section>

        <button onClick={onExit} className="btn btn-sm btn-ghost mt-6">
          {t.reveal.organize}
          <ArrowRight size={15} />
        </button>
      </main>
    </div>
  );
}
