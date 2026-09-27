import { ArrowRight, Check, Copy, Eye, EyeOff } from "lucide-react";
import { ParticipantName } from "@/components/participant/ParticipantName";
import type { HomonymHint } from "@/domain/homonyms";
import { useI18n } from "@/i18n/language-context";

const MAX_STAGGERED_ROWS = 14;
const STAGGER_MS = 55;

export interface DrawRowParticipant {
  name: string;
  hint: HomonymHint | undefined;
  surface: string;
}

interface DrawResultRowProps {
  index: number;
  drawer: DrawRowParticipant;
  drawn: DrawRowParticipant;
  isRevealed: boolean;
  isCopied: boolean;
  onToggleReveal: () => void;
  onCopyMessage: () => void;
}

export function DrawResultRow({
  index,
  drawer,
  drawn,
  isRevealed,
  isCopied,
  onToggleReveal,
  onCopyMessage,
}: DrawResultRowProps) {
  const { t } = useI18n();

  return (
    <li
      className="flex animate-draw-in flex-wrap items-center gap-3 rounded-xl border border-ink-200 bg-white p-3 transition-shadow hover:shadow-card dark:border-white/10 dark:bg-white/[0.03]"
      style={{
        animationDelay: `${Math.min(index, MAX_STAGGERED_ROWS) * STAGGER_MS}ms`,
      }}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1.5">
        <span
          className={`pill px-3 py-1.5 text-ink-900 dark:text-white ${drawer.surface}`}
        >
          <ParticipantName name={drawer.name} hint={drawer.hint} />
        </span>
        <ArrowRight size={14} className="shrink-0 text-ink-400" aria-hidden />
        <button
          onClick={onToggleReveal}
          className={`pill px-3 py-1.5 text-left transition-all ${
            isRevealed
              ? `text-ink-900 dark:text-white ${drawn.surface}`
              : "select-none border-transparent bg-ink-100 text-transparent blur-[5px] dark:bg-white/10"
          }`}
          aria-label={
            isRevealed
              ? t.draw.hideResult(drawer.name)
              : t.draw.revealResult(drawer.name)
          }
        >
          {isRevealed ? (
            <ParticipantName name={drawn.name} hint={drawn.hint} />
          ) : (
            <span className="truncate">{drawn.name}</span>
          )}
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-1 max-sm:w-full">
        <button
          onClick={onToggleReveal}
          className="btn btn-ghost btn-icon"
          aria-label={isRevealed ? t.draw.hide : t.draw.reveal}
          title={isRevealed ? t.draw.hide : t.draw.reveal}
        >
          {isRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
        <button
          onClick={onCopyMessage}
          className={`btn btn-sm max-sm:flex-1 ${
            isCopied ? "btn-primary" : "btn-secondary"
          }`}
          title={t.draw.copyMessageTitle(drawer.name)}
        >
          {isCopied ? <Check size={15} /> : <Copy size={15} />}
          {isCopied ? t.draw.copied : t.draw.copyMessage}
        </button>
      </div>
    </li>
  );
}
