// Types for Riot Games API responses (after backend processing)

export interface PlayerProfile {
  puuid: string;
  gameName: string;
  tagLine: string;
  summonerId: string;
  accountId: string;
  profileIconId: number;
  summonerLevel: number;
  region: string;
  rankedSolo: RankInfo | null;
  rankedFlex: RankInfo | null;
}

export interface RankInfo {
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  winRate: number;
}

export interface MatchData {
  // Identification
  matchId: string;
  gameCreation: number;
  gameDuration: number;
  gameMode: string;
  queueId: number;

  // Champion
  championId: number;
  championName: string;
  championLevel: number;
  spell1Id: number;
  spell2Id: number;
  perks: Perks | null;

  // Result
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  kda: number;

  // Damage
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  magicDamageDealtToChampions: number;
  physicalDamageDealtToChampions: number;
  trueDamageDealtToChampions: number;
  damagePerMinute: number;
  damageTakenOnTeamPercentage: number;

  // Gold & Farm
  goldEarned: number;
  goldPerMinute: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  csPerMinute: number;

  // Vision
  visionScore: number;
  wardsPlaced: number;
  wardsKilled: number;
  visionWardsBoughtInGame: number;
  visionScoreAdvantageLaneOpponent: number;

  // Objectives
  turretKills: number;
  turretPlatesTaken: number;
  inhibitorKills: number;
  baronKills: number;
  dragonKills: number;
  objectivesStolen: number;

  // Combat
  soloKills: number;
  doubleKills: number;
  tripleKills: number;
  quadraKills: number;
  pentaKills: number;
  multikillsAfterAggressiveFlash: number;
  killParticipation: number;
  takedownsFirst25Minutes: number;
  takedownsAfterGainingLevelAdvantage: number;

  // Mechanics
  skillshotsDodged: number;
  skillshotsHit: number;
  dodgeSkillShotsSmallWindow: number;
  abilityUses: number;
  timeCCingOthers: number;
  totalTimeSpentDead: number;

  // Lane
  lane: string;
  role: string;
  laningPhaseGoldExpAdvantage: number;
  laneMinionsFirst10Minutes: number;
  highestChampionDamage: number;
  pickTurn: number;

  // Items
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
}

export interface Perks {
  statPerks: {
    defense: number;
    flex: number;
    offense: number;
  };
  styles: PerkStyle[];
}

export interface PerkStyle {
  description: string;
  selections: PerkSelection[];
  style: number;
}

export interface PerkSelection {
  perk: number;
  var1: number;
  var2: number;
  var3: number;
}

export type Region =
  | 'BR1' | 'LA1' | 'LA2' | 'NA1'
  | 'EUW1' | 'EUN1' | 'TR1' | 'RU'
  | 'KR' | 'JP1'
  | 'OC1' | 'PH2' | 'SG2' | 'TH2' | 'TW2' | 'VN2';

export type Tier = 'IRON' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'EMERALD' | 'DIAMOND' | 'MASTER' | 'GRANDMASTER' | 'CHALLENGER';
