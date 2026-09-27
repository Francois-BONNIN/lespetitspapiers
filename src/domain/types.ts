export interface Participant {
  id: string;
  name: string;
  family: string | null;
  created_at: string;
}

export interface Exclusion {
  id: string;
  participant_id: string;
  excluded_participant_id: string;
  created_at: string;
}

export interface Inclusion {
  id: string;
  participant_id: string;
  included_participant_id: string;
  created_at: string;
}

export interface Draw {
  id: string;
  drawer_id: string;
  drawn_id: string;
  draw_date: string;
  created_at: string;
}

export type Delivery = "message" | "link";

export interface EventSettings {
  eventName: string;
  budget: string;
  exchangeDate: string;
  messageTemplate: string | null;
  delivery: Delivery;
}

export interface Setup {
  participants: Participant[];
  exclusions: Exclusion[];
  inclusions: Inclusion[];
  draws: Draw[];
  excludeSameFamily: boolean;
  avoidReciprocal: boolean;
  eventSettings: EventSettings;
}

export type IndexPair = [number, number];

export interface SetupSnapshot {
  participants: Array<Pick<Participant, "name" | "family">>;
  exclusions: IndexPair[];
  inclusions: IndexPair[];
  draws: IndexPair[];
  drawDate: string | null;
  excludeSameFamily: boolean;
  avoidReciprocal: boolean;
  eventSettings: EventSettings | null;
}
