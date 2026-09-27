import type { Inclusion } from "./types";

export interface ForcedDraw {
  drawnId: string;
  drawers: Inclusion[];
}

export function groupForcedDraws(inclusions: Inclusion[]): ForcedDraw[] {
  const drawersByDrawn = new Map<string, Inclusion[]>();
  inclusions.forEach((inclusion) => {
    const drawers = drawersByDrawn.get(inclusion.participant_id);
    if (drawers) drawers.push(inclusion);
    else drawersByDrawn.set(inclusion.participant_id, [inclusion]);
  });
  return Array.from(drawersByDrawn, ([drawnId, drawers]) => ({
    drawnId,
    drawers,
  }));
}

export function countForcedDraws(inclusions: Inclusion[]): number {
  return new Set(inclusions.map((i) => i.participant_id)).size;
}
