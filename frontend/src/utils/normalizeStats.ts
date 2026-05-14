import type { MatchData } from '../types/riot';
import type { RadarData } from '../types/analysis';
import type { TierBenchmarks } from './benchmarks';

/**
 * Clamp value between 0 and 100
 */
function clamp(v: number): number {
  return Math.max(0, Math.min(100, v));
}

/**
 * Normalize a value against a benchmark using a sigmoid-like curve
 * Returns 0-100 where 100 = at or above benchmark
 */
function normalizeToScore(value: number, benchmark: number, higherIsBetter = true): number {
  if (benchmark === 0) return 50;
  const ratio = value / benchmark;
  if (higherIsBetter) {
    return clamp(ratio * 100);
  } else {
    // Inverse: lower value = higher score
    return clamp((2 - ratio) * 100);
  }
}

/**
 * Calculate radar chart scores (0-100) for a player based on their matches
 * and benchmark for their tier.
 */
export function normalizeStats(matches: MatchData[], benchmarks: TierBenchmarks): RadarData {
  if (!matches.length) {
    return { combat: 0, mechanics: 0, vision: 0, farm: 0, objectives: 0, teamfight: 0 };
  }

  const avg = <K extends keyof MatchData>(key: K): number => {
    const vals = matches.map((m) => Number(m[key]) || 0);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };

  const avgKDA = avg('kda');
  const avgDPM = avg('damagePerMinute');
  const avgCS = avg('csPerMinute');
  const avgGold = avg('goldPerMinute');
  const avgVision = avg('visionScore');
  const avgKP = avg('killParticipation');
  const avgDead = avg('totalTimeSpentDead');
  const avgSkillshotsDodged = avg('skillshotsDodged');
  const avgAbilityUses = avg('abilityUses');
  const avgTurrets = avg('turretKills');
  const avgObjectives = avg('objectivesStolen') + avg('baronKills') + avg('dragonKills');
  const avgCC = avg('timeCCingOthers');
  const avgSoloKills = avg('soloKills');

  // Combat: KDA + soloKills + skillshots dodged
  const kdaScore = normalizeToScore(avgKDA, benchmarks.kda);
  const soloScore = normalizeToScore(avgSoloKills, 1.5);
  const dodgeScore = normalizeToScore(avgSkillshotsDodged, 8);
  const combat = clamp((kdaScore * 0.5 + soloScore * 0.25 + dodgeScore * 0.25));

  // Mechanics: ability uses + skillshots dodged + dead time (inverted)
  const abilityScore = normalizeToScore(avgAbilityUses, 200);
  const deadScore = normalizeToScore(avgDead, benchmarks.totalTimeSpentDead, false);
  const mechanics = clamp((abilityScore * 0.35 + dodgeScore * 0.35 + deadScore * 0.30));

  // Vision: vision score + wards
  const visionScore = normalizeToScore(avgVision, benchmarks.visionScore);
  const vision = clamp(visionScore);

  // Farm: CS/min + gold/min
  const csScore = normalizeToScore(avgCS, benchmarks.csPerMinute);
  const goldScore = normalizeToScore(avgGold, benchmarks.goldPerMinute);
  const farm = clamp((csScore * 0.6 + goldScore * 0.4));

  // Objectives: turrets + objectives stolen/taken
  const turretScore = normalizeToScore(avgTurrets, benchmarks.turretKills);
  const objScore = normalizeToScore(avgObjectives, 3);
  const objectives = clamp((turretScore * 0.5 + objScore * 0.5));

  // Teamfight: kill participation + damage/min + CC
  const kpScore = normalizeToScore(avgKP, benchmarks.killParticipation);
  const dpmScore = normalizeToScore(avgDPM, benchmarks.damagePerMinute);
  const ccScore = normalizeToScore(avgCC, 30);
  const teamfight = clamp((kpScore * 0.4 + dpmScore * 0.4 + ccScore * 0.2));

  return {
    combat: Math.round(combat),
    mechanics: Math.round(mechanics),
    vision: Math.round(vision),
    farm: Math.round(farm),
    objectives: Math.round(objectives),
    teamfight: Math.round(teamfight),
  };
}
