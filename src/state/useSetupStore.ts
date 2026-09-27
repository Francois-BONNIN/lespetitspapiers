import { useCallback, useMemo, useState } from "react";
import { isDrawConsistent, type DrawRules } from "@/domain/drawAlgorithm";
import type { Setup } from "@/domain/types";
import { loadSetup } from "@/services/storage";

type SetupChanges = Partial<Setup> | ((current: Setup) => Partial<Setup>);

export interface SetupStore {
  setup: Setup;
  drawRules: DrawRules;
  drawIsStale: boolean;
  update: (changes: SetupChanges) => void;
  reload: () => void;
}

export function useSetupStore(): SetupStore {
  const [setup, setSetup] = useState<Setup>(loadSetup);
  const { participants, draws } = setup;
  const { exclusions, inclusions, excludeSameFamily, avoidReciprocal } = setup;

  const drawRules = useMemo<DrawRules>(
    () => ({ exclusions, inclusions, excludeSameFamily, avoidReciprocal }),
    [exclusions, inclusions, excludeSameFamily, avoidReciprocal],
  );

  const drawIsStale = useMemo(
    () => draws.length > 0 && !isDrawConsistent(draws, participants, drawRules),
    [draws, participants, drawRules],
  );

  const update = useCallback((changes: SetupChanges) => {
    setSetup((current) => ({
      ...current,
      ...(typeof changes === "function" ? changes(current) : changes),
    }));
  }, []);

  const reload = useCallback(() => setSetup(loadSetup()), []);

  return { setup, drawRules, drawIsStale, update, reload };
}
