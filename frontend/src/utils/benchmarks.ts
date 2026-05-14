import type { Tier } from '../types/riot';

/**
 * Benchmark values by tier for radar chart normalization.
 * These are estimated averages per tier for ranked solo/duo.
 */
export interface TierBenchmarks {
  csPerMinute: number;
  goldPerMinute: number;
  damagePerMinute: number;
  visionScore: number;
  killParticipation: number; // %
  kda: number;
  turretKills: number;
  wardsPlaced: number;
  skillshotsHit: number;
  laneMinionsFirst10Minutes: number;
  totalTimeSpentDead: number; // seconds (lower is better)
}

export const TIER_BENCHMARKS: Record<Tier, TierBenchmarks> = {
  IRON: {
    csPerMinute: 4.5,
    goldPerMinute: 950,
    damagePerMinute: 550,
    visionScore: 18,
    killParticipation: 52,
    kda: 2.0,
    turretKills: 1.2,
    wardsPlaced: 6,
    skillshotsHit: 15,
    laneMinionsFirst10Minutes: 50,
    totalTimeSpentDead: 380,
  },
  BRONZE: {
    csPerMinute: 5.0,
    goldPerMinute: 1050,
    damagePerMinute: 620,
    visionScore: 20,
    killParticipation: 54,
    kda: 2.2,
    turretKills: 1.4,
    wardsPlaced: 7,
    skillshotsHit: 18,
    laneMinionsFirst10Minutes: 55,
    totalTimeSpentDead: 350,
  },
  SILVER: {
    csPerMinute: 5.5,
    goldPerMinute: 1100,
    damagePerMinute: 680,
    visionScore: 22,
    killParticipation: 56,
    kda: 2.4,
    turretKills: 1.6,
    wardsPlaced: 8,
    skillshotsHit: 22,
    laneMinionsFirst10Minutes: 58,
    totalTimeSpentDead: 320,
  },
  GOLD: {
    csPerMinute: 6.0,
    goldPerMinute: 1180,
    damagePerMinute: 750,
    visionScore: 25,
    killParticipation: 58,
    kda: 2.6,
    turretKills: 1.8,
    wardsPlaced: 9,
    skillshotsHit: 26,
    laneMinionsFirst10Minutes: 61,
    totalTimeSpentDead: 290,
  },
  PLATINUM: {
    csPerMinute: 6.5,
    goldPerMinute: 1250,
    damagePerMinute: 830,
    visionScore: 28,
    killParticipation: 60,
    kda: 2.9,
    turretKills: 2.0,
    wardsPlaced: 10,
    skillshotsHit: 30,
    laneMinionsFirst10Minutes: 64,
    totalTimeSpentDead: 265,
  },
  EMERALD: {
    csPerMinute: 7.0,
    goldPerMinute: 1320,
    damagePerMinute: 900,
    visionScore: 30,
    killParticipation: 62,
    kda: 3.1,
    turretKills: 2.2,
    wardsPlaced: 11,
    skillshotsHit: 34,
    laneMinionsFirst10Minutes: 66,
    totalTimeSpentDead: 245,
  },
  DIAMOND: {
    csPerMinute: 7.5,
    goldPerMinute: 1400,
    damagePerMinute: 980,
    visionScore: 33,
    killParticipation: 65,
    kda: 3.4,
    turretKills: 2.4,
    wardsPlaced: 12,
    skillshotsHit: 38,
    laneMinionsFirst10Minutes: 68,
    totalTimeSpentDead: 225,
  },
  MASTER: {
    csPerMinute: 8.0,
    goldPerMinute: 1500,
    damagePerMinute: 1080,
    visionScore: 36,
    killParticipation: 67,
    kda: 3.8,
    turretKills: 2.6,
    wardsPlaced: 13,
    skillshotsHit: 43,
    laneMinionsFirst10Minutes: 70,
    totalTimeSpentDead: 210,
  },
  GRANDMASTER: {
    csPerMinute: 8.5,
    goldPerMinute: 1580,
    damagePerMinute: 1150,
    visionScore: 39,
    killParticipation: 69,
    kda: 4.2,
    turretKills: 2.8,
    wardsPlaced: 14,
    skillshotsHit: 47,
    laneMinionsFirst10Minutes: 72,
    totalTimeSpentDead: 195,
  },
  CHALLENGER: {
    csPerMinute: 9.0,
    goldPerMinute: 1680,
    damagePerMinute: 1250,
    visionScore: 42,
    killParticipation: 72,
    kda: 4.8,
    turretKills: 3.0,
    wardsPlaced: 15,
    skillshotsHit: 52,
    laneMinionsFirst10Minutes: 74,
    totalTimeSpentDead: 180,
  },
};

export function getBenchmarks(tier?: string | null): TierBenchmarks {
  const key = (tier?.toUpperCase() as Tier) || 'GOLD';
  return TIER_BENCHMARKS[key] || TIER_BENCHMARKS.GOLD;
}
