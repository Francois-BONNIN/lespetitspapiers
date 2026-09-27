import { useI18n } from "@/i18n/language-context";

export function Hero() {
  const { t } = useI18n();

  return (
    <div className="mb-8 text-center sm:mb-10">
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink-900 dark:text-white sm:text-5xl">
        {t.hero.titleMain}
        <span className="text-brand-600 dark:text-brand-400">
          {t.hero.titleAccent}
        </span>
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-500 dark:text-ink-400 sm:text-base">
        {t.hero.subtitle}
      </p>
    </div>
  );
}
