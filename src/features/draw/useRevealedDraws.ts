import { useState } from "react";
import type { Draw } from "@/domain/types";

export interface RevealedDraws {
  isRevealed: (id: string) => boolean;
  allRevealed: boolean;
  toggle: (id: string) => void;
  toggleAll: () => void;
}

export function useRevealedDraws(draws: Draw[]): RevealedDraws {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(() => new Set());
  const allRevealed =
    draws.length > 0 && draws.every((draw) => revealedIds.has(draw.id));

  return {
    isRevealed: (id) => revealedIds.has(id),
    allRevealed,
    toggle: (id) => {
      setRevealedIds((current) => {
        const next = new Set(current);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    toggleAll: () => {
      setRevealedIds(
        allRevealed ? new Set() : new Set(draws.map((draw) => draw.id)),
      );
    },
  };
}
