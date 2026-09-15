import { getGroupColor, getInitials } from "../../lib/familyColors";

interface ParticipantAvatarProps {
  name: string;
  group?: string | null;
  index?: number | null;
  size?: "sm" | "md";
}

const SIZES = {
  sm: {
    circle: "h-7 w-7 text-[10px]",
    badge: "-right-1 -top-1 h-4 min-w-[1rem] text-[9px]",
  },
  md: {
    circle: "h-9 w-9 text-xs",
    badge: "-right-1 -top-1 h-[1.125rem] min-w-[1.125rem] text-[10px]",
  },
};

export function ParticipantAvatar({
  name,
  group,
  index,
  size = "md",
}: ParticipantAvatarProps) {
  const sizes = SIZES[size];

  return (
    <span className="relative inline-flex shrink-0" aria-hidden>
      <span
        className={`flex items-center justify-center rounded-full font-bold ${
          sizes.circle
        } ${getGroupColor(group?.trim() ?? "").avatar}`}
      >
        {getInitials(name)}
      </span>
      {index != null && (
        <span
          className={`absolute flex items-center justify-center rounded-full border-2 border-white bg-ink-900 px-1 font-bold leading-none text-white dark:border-ink-900 dark:bg-white dark:text-ink-900 ${sizes.badge}`}
        >
          {index}
        </span>
      )}
    </span>
  );
}
