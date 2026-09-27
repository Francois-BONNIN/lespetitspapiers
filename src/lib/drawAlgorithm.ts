import { Participant, Exclusion, Inclusion } from "./database";

export interface DrawResult {
  drawer_id: string;
  drawn_id: string;
}

export interface DrawRules {
  exclusions: Exclusion[];
  inclusions: Inclusion[];
  excludeSameFamily: boolean;
  avoidReciprocal: boolean;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function respectsRules(
  drawer: Participant,
  candidate: Participant,
  rules: DrawRules,
  drawnByDrawer: Map<string, string>
): boolean {
  if (drawer.id === candidate.id) return false;

  if (rules.avoidReciprocal && drawnByDrawer.get(candidate.id) === drawer.id) {
    return false;
  }

  const candidateInclusions = rules.inclusions.filter(
    (inc) => inc.participant_id === candidate.id
  );

  if (candidateInclusions.length > 0) {
    const isIncluded = candidateInclusions.some(
      (inc) => inc.included_participant_id === drawer.id
    );
    if (!isIncluded) return false;
  }

  if (
    rules.excludeSameFamily &&
    drawer.family &&
    candidate.family &&
    drawer.family === candidate.family
  ) {
    return false;
  }

  const hasExclusion = rules.exclusions.some(
    (exc) =>
      exc.participant_id === drawer.id &&
      exc.excluded_participant_id === candidate.id
  );

  return !hasExclusion;
}

export function performDraw(
  participants: Participant[],
  rules: DrawRules
): DrawResult[] | null {
  if (participants.length < 2) {
    return null;
  }

  const maxAttempts = 1000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const results: DrawResult[] = [];
    const alreadyDrawn = new Set<string>();
    const drawnByDrawer = new Map<string, string>();
    const shuffledParticipants = shuffleArray(participants);
    let failed = false;

    for (const drawer of shuffledParticipants) {
      const candidates = shuffleArray(
        participants.filter(
          (p) =>
            !alreadyDrawn.has(p.id) &&
            respectsRules(drawer, p, rules, drawnByDrawer)
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
      drawnByDrawer.set(drawer.id, drawn.id);
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
  rules: DrawRules
): boolean {
  if (draws.length !== participants.length) return false;

  const participantsById = new Map(participants.map((p) => [p.id, p]));
  const drawnByDrawer = new Map(draws.map((d) => [d.drawer_id, d.drawn_id]));
  const drawn = new Set(draws.map((d) => d.drawn_id));
  if (drawnByDrawer.size !== draws.length || drawn.size !== draws.length) {
    return false;
  }

  return draws.every(({ drawer_id, drawn_id }) => {
    const drawer = participantsById.get(drawer_id);
    const candidate = participantsById.get(drawn_id);
    return Boolean(
      drawer &&
        candidate &&
        respectsRules(drawer, candidate, rules, drawnByDrawer)
    );
  });
}
