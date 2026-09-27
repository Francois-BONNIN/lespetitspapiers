import type { ReactNode } from "react";

interface SettingsSectionProps {
  id: string;
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
}

export function SettingsSection({
  id,
  title,
  description,
  className,
  children,
}: SettingsSectionProps) {
  const titleId = `settings-${id}-title`;

  return (
    <section aria-labelledby={titleId} className={className}>
      <h3
        id={titleId}
        className={`text-sm font-semibold text-ink-900 dark:text-white ${
          description ? "" : "mb-3"
        }`}
      >
        {title}
      </h3>
      {description && (
        <p className="mb-3 mt-1 text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
          {description}
        </p>
      )}
      {children}
    </section>
  );
}
