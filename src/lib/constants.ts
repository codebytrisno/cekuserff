export const UID_MIN_LENGTH = 8;
export const UID_MAX_LENGTH = 12;
export const UID_REGEX = /^\d{8,12}$/;

export const MAX_BOOKMARKS = 50;
export const MAX_HISTORY = 100;

export const ONLINE_POLL_INTERVAL = 30000;

export const DEFAULT_SERVER = "Indonesia";

export const SERVERS = [
  "Indonesia",
  "India",
  "Bangladesh",
  "Pakistan",
  "Brazil",
  "Global",
] as const;

export const RANKS = [
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Heroic",
  "Grandmaster",
] as const;
