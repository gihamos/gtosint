export interface Endorsement {
  level: number;
  frame: string;
}

export interface CompetitiveStats {
  damage: number | null;
  support: number | null;
  tank: number | null;
  open: number | null;
  season: number;
}

export interface Summary {
  username: string;
  avatar: string;
  namecard: string;
  title: string | null;
  endorsement: Endorsement;
  competitive: {
    pc: CompetitiveStats;
    console: CompetitiveStats;
  };
  last_updated_at: number;
}

export interface Stat {
  key: string;
  label: string;
  value: number;
}

export interface Category {
  category: string;
  label: string;
  stats: Stat[];
}

export type HeroStats = Record<string, Category[]>;

export interface GameStats {
  allHeroes: Category[];
  heroSpecific: HeroStats;
}

export interface playStats {
  career_stats: GameStats;
}

export interface Stats {
  pc: {
    quickplay: playStats;
    competitive: playStats;
  };
  console: {
    quickplay: playStats;
    competitive: playStats;
  };
}

export interface OverfastResponse {
  summary: Summary;
  stats: Stats;
}