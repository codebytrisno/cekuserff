export interface PlayerData {
  uid: string;
  name: string;
  level: number;
  avatar: string;
  guild: string | null;
  server: string;
  kd: number;
  wins: number;
  headshots: number;
  kills: number;
  deaths: number;
  rank: string;
  rankPoints: number;
  rankMaxPoints: number;
  csRankPoints: number;
  csRank: number;
  csMaxRank: number;
  maxRank: number;
  totalMatches: number;
  brWins: number;
  brKills: number;
  brDeaths: number;
  brHeadshots: number;
  brHeadshotKills: number;
  brDamage: number;
  brHighestKills: number;
  brRevives: number;
  brTopN: number;
  brWinRate: number;
  csMatches: number;
  csWins: number;
  csKills: number;
  accountAge: string;
  accountCreatedAt: string | null;
  lastActive: string;
  online: boolean;
  inGame: boolean;
  isBanned: boolean;
  banPeriod: number;
  exp: number;
  liked: number;
  seasonId: number;
  creditScore: number;
  diamondCost: number;
  signature: string;
  language: string;
  petLevel: number;
  petId: string;
  badges: number;
  title: number | null;
  releaseVersion: string;
  headPic: number;
  clanId: string | null;
  clanLevel: number;
  clanMembers: number;
  clanCapacity: number;
  primeLevel: number;
  weaponSkins: string[];
  avatarId: string;
  clothes: string[];
  skills: { skillId: number; slotId?: number }[];
}

export interface Bookmark {
  uid: string;
  name: string;
  level: number;
  rank: string;
  kd: number;
  headshot: number;
  guild: string | null;
  avatar: string;
  addedAt: number;
  lastCheckedAt: number;
  snapshots: Snapshot[];
}

export interface Snapshot {
  kd: number;
  rank: string;
  rankPoints: number;
  headshot: number;
  recordedAt: number;
}

export interface HistoryItem {
  uid: string;
  name: string;
  level: number;
  checkedAt: number;
}

export interface Settings {
  theme: "dark" | "light" | "system";
  defaultServer: string;
}

export interface Store {
  bookmarks: Bookmark[];
  history: HistoryItem[];
  settings: Settings;
  playerCache: Record<string, PlayerData>;
  addBookmark: (player: PlayerData) => void;
  removeBookmark: (uid: string) => void;
  addHistory: (player: PlayerData) => void;
  clearHistory: () => void;
  updateSettings: (partial: Partial<Settings>) => void;
  setPlayerCache: (uid: string, data: PlayerData) => void;
}

export interface PlayerState {
  data: PlayerData | null;
  loading: boolean;
  error: string | null;
}
