// Types for analysis computations

import type { MatchData } from './riot';

export interface PlayerStats {
  winRate: number;
  avgKDA: number;
  avgDamagePerMinute: number;
  avgCSPerMinute: number;
  avgGoldPerMinute: number;
  avgVisionScore: number;
  avgKillParticipation: number;
  avgTimeSpentDead: number;
  totalGames: number;
  wins: number;
  losses: number;
}

export interface AttributeAnalysis {
  key: keyof MatchData;
  label: string;
  description: string;
  playerAvg: number;
  winAvg: number;
  lossAvg: number;
  winRateAboveAvg: number;
  winRateBelowAvg: number;
  impact: number; // winRateAboveAvg - winRateBelowAvg
  higherIsBetter: boolean;
  benchmarkValue?: number;
  benchmarkLabel?: string;
}

export interface PhaseScore {
  early: number;
  mid: number;
  late: number;
}

export interface PhaseAnalysis {
  phase: 'early' | 'mid' | 'late';
  label: string;
  dominanceScore: number; // 0-100
  winRateWhenStrong: number;
  winRateWhenWeak: number;
  avgAttributes: Record<string, number>;
  winAvgAttributes: Record<string, number>;
  lossAvgAttributes: Record<string, number>;
}

export interface ChampionStats {
  championId: number;
  championName: string;
  games: number;
  wins: number;
  losses: number;
  winRate: number;
  avgKDA: number;
  avgDamagePerMinute: number;
  avgCSPerMinute: number;
  avgGoldPerMinute: number;
  avgKillParticipation: number;
  matches: MatchData[];
}

export interface RadarData {
  combat: number;
  mechanics: number;
  vision: number;
  farm: number;
  objectives: number;
  teamfight: number;
}

export interface WinratePoint {
  game: number;
  winrate: number;
  win: boolean;
}

export interface SparklinePoint {
  value: number;
}

export interface AnalysisResult {
  playerStats: PlayerStats;
  radarData: RadarData;
  winrateLine: WinratePoint[];
  attributes: AttributeAnalysis[];
  phases: PhaseAnalysis[];
  champions: ChampionStats[];
  matches: MatchData[];
}
