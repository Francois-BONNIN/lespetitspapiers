import { hintSuffix, type HomonymHint } from "@/domain/homonyms";

interface ParticipantNameProps {
  name: string;
  hint?: HomonymHint;
  withGroupLabel?: boolean;
  className?: string;
}

export function ParticipantName({
  name,
  hint,
  withGroupLabel = true,
  className = "",
}: ParticipantNameProps) {
  const suffix = hintSuffix(hint, { withLabel: withGroupLabel });

  return (
    <span className={`flex min-w-0 items-baseline gap-1.5 ${className}`}>
      <span className="truncate">{name}</span>
      {suffix && (
        <span className="shrink-0 text-xs font-medium text-ink-500 dark:text-ink-400">
          ({suffix})
        </span>
      )}
    </span>
  );
}
