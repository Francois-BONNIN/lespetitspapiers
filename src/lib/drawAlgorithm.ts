import { Participant, Exclusion, Inclusion } from "./database";

export interface DrawResult {
  drawer_id: string;
  drawn_id: string;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function canDraw(
  drawer: Participant,
  candidate: Participant,
  exclusions: Exclusion[],
  inclusions: Inclusion[],
  alreadyDrawn: Set<string>,
  excludeSameFamily: boolean
): boolean {
  if (alreadyDrawn.has(candidate.id)) return false;
  return respectsRules(
    drawer,
    candidate,
    exclusions,
    inclusions,
    excludeSameFamily
  );
}

function respectsRules(
  drawer: Participant,
  candidate: Participant,
  exclusions: Exclusion[],
  inclusions: Inclusion[],
  excludeSameFamily: boolean
): boolean {
  if (drawer.id === candidate.id) return false;

  const candidateInclusions = inclusions.filter(
    (inc) => inc.participant_id === candidate.id
  );

  if (candidateInclusions.length > 0) {
    const isIncluded = candidateInclusions.some(
      (inc) => inc.included_participant_id === drawer.id
    );
    if (!isIncluded) return false;
  }

  if (
    excludeSameFamily &&
    drawer.family &&
    candidate.family &&
    drawer.family === candidate.family
  ) {
    return false;
  }

  const hasExclusion = exclusions.some(
    (exc) =>
      exc.participant_id === drawer.id &&
      exc.excluded_participant_id === candidate.id
  );

  return !hasExclusion;
}

export function performDraw(
  participants: Participant[],
  exclusions: Exclusion[],
  inclusions: Inclusion[],
  excludeSameFamily: boolean = false
): DrawResult[] | null {
  if (participants.length < 2) {
    return null;
  }

  const maxAttempts = 1000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const results: DrawResult[] = [];
    const alreadyDrawn = new Set<string>();
    const shuffledParticipants = shuffleArray(participants);
    let failed = false;

    for (const drawer of shuffledParticipants) {
      const candidates = shuffleArray(
        participants.filter((p) =>
          canDraw(
            drawer,
            p,
            exclusions,
            inclusions,
            alreadyDrawn,
            excludeSameFamily
          )
        )
      );

      if (candidates.length === 0) {
        failed = true;
        break;
      }

      const drawn = candidates[0];
      results.push({
        drawer_id: drawer.id,
        drawn_id: drawn.id,
      });
      alreadyDrawn.add(drawn.id);
    }

    if (!failed && results.length === participants.length) {
      return results;
    }
  }

  return null;
}

export function isDrawConsistent(
  draws: DrawResult[],
  participants: Participant[],
  exclusions: Exclusion[],
  inclusions: Inclusion[],
  excludeSameFamily: boolean
): boolean {
  if (draws.length !== participants.length) return false;

  const participantsById = new Map(participants.map((p) => [p.id, p]));
  const drawers = new Set<string>();
  const drawn = new Set<string>();

  return draws.every(({ drawer_id, drawn_id }) => {
    const drawer = participantsById.get(drawer_id);
    const candidate = participantsById.get(drawn_id);
    if (!drawer || !candidate || drawers.has(drawer_id) || drawn.has(drawn_id)) {
      return false;
    }
    drawers.add(drawer_id);
    drawn.add(drawn_id);
    return respectsRules(
      drawer,
      candidate,
      exclusions,
      inclusions,
      excludeSameFamily
    );
  });
}
