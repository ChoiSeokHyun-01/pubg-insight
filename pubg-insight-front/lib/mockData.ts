export interface Player {
  name: string;
  lastUpdated: string;
  currentSeason: string;
  availableSeasons: string[];
}

export interface RankedStats {
  mode: "duo" | "squad";
  tier: string | null;
  rp: number;
  kda: number;
  winRate: number;
  top10Rate: number;
  avgDamage: number;
  matches: number;
  avgRank: number;
}

export interface CasualStats {
  mode: "solo" | "duo" | "squad";
  kda: number;
  winRate: number;
  top10Rate: number;
  avgDamage: number;
  games: number;
  kills: number;
  headshotRate: number;
  survivalTime: string;
}

export interface MatchHistoryItem {
  id: string;
  mode: string;
  rank: number;
  totalTeams: number;
  mapName: string;
  mainWeapon: string;
  kills: number;
  damage: number;
  dbno: number;
  distance: string;
  survivalTime: string;
  playedAt: string;
}

export const mockPlayerData: Player = {
  name: "디자인잘하는방법좀요",
  lastUpdated: "5분 전",
  currentSeason: "경쟁전 시즌 38",
  availableSeasons: ["경쟁전 시즌 36", "경쟁전 시즌 37", "경쟁전 시즌 38"],
};

export const mockRankedStats: RankedStats[] = [
  {
    mode: "duo",
    tier: null,
    rp: 0,
    kda: 0,
    winRate: 0,
    top10Rate: 0,
    avgDamage: 0,
    matches: 0,
    avgRank: 0,
  },
  {
    mode: "squad",
    tier: "Survivor",
    rp: 7732,
    kda: 2.3,
    winRate: 12.5,
    top10Rate: 45.8,
    avgDamage: 342,
    matches: 48,
    avgRank: 8.2,
  },
];

export const mockCasualStats: CasualStats[] = [
  {
    mode: "solo",
    kda: 1.8,
    winRate: 8.3,
    top10Rate: 32.1,
    avgDamage: 287,
    games: 24,
    kills: 43,
    headshotRate: 42.3,
    survivalTime: "14분 32초",
  },
  {
    mode: "duo",
    kda: 2.1,
    winRate: 10.5,
    top10Rate: 38.9,
    avgDamage: 315,
    games: 38,
    kills: 80,
    headshotRate: 39.8,
    survivalTime: "16분 18초",
  },
  {
    mode: "squad",
    kda: 2.5,
    winRate: 15.2,
    top10Rate: 52.3,
    avgDamage: 368,
    games: 66,
    kills: 165,
    headshotRate: 44.1,
    survivalTime: "18분 45초",
  },
];

export const mockMatchHistory: MatchHistoryItem[] = [
  {
    id: "1",
    mode: "스쿼드",
    rank: 10,
    totalTeams: 15,
    mapName: "에란겔",
    mainWeapon: "AUG A3",
    kills: 1,
    damage: 238,
    dbno: 1,
    distance: "8.64km",
    survivalTime: "17분 49초",
    playedAt: "25분 전",
  },
  {
    id: "2",
    mode: "듀오",
    rank: 3,
    totalTeams: 25,
    mapName: "미라마",
    mainWeapon: "M416",
    kills: 5,
    damage: 542,
    dbno: 3,
    distance: "12.3km",
    survivalTime: "28분 15초",
    playedAt: "1시간 전",
  },
  {
    id: "3",
    mode: "스쿼드",
    rank: 1,
    totalTeams: 20,
    mapName: "사녹",
    mainWeapon: "SCAR-L",
    kills: 8,
    damage: 892,
    dbno: 6,
    distance: "6.8km",
    survivalTime: "22분 34초",
    playedAt: "2시간 전",
  },
];
