import { useMemo } from 'react';
import type { MatchData } from '../types/riot';
import type {
  PlayerStats,
  AttributeAnalysis,
  PhaseAnalysis,
  ChampionStats,
  RadarData,
  WinratePoint,
  AnalysisResult,
} from '../types/analysis';
import { normalizeStats } from '../utils/normalizeStats';
import { getBenchmarks } from '../utils/benchmarks';

interface AttributeConfig {
  key: keyof MatchData;
  label: string;
  description: string;
  higherIsBetter: boolean;
}

const ATTRIBUTE_CONFIGS: AttributeConfig[] = [
  { key: 'kda', label: 'KDA', description: 'Kills + Assists dividido por mortes. Reflete desempenho geral em combate.', higherIsBetter: true },
  { key: 'killParticipation', label: 'Kill Participation', description: '% de abates do time em que você participou.', higherIsBetter: true },
  { key: 'damagePerMinute', label: 'Dano por Minuto', description: 'Dano causado a campeões por minuto de jogo.', higherIsBetter: true },
  { key: 'csPerMinute', label: 'CS por Minuto', description: 'Farm (minions + monstros) por minuto. Crucial para ouro e progressão.', higherIsBetter: true },
  { key: 'goldPerMinute', label: 'Ouro por Minuto', description: 'Ouro ganho por minuto. Indica eficiência econômica.', higherIsBetter: true },
  { key: 'visionScore', label: 'Vision Score', description: 'Pontuação de visão. Envolve wards colocadas, destruídas e controle de mapa.', higherIsBetter: true },
  { key: 'skillshotsDodged', label: 'Skillshots Desviados', description: 'Quantidade de skillshots inimigos que você desviou.', higherIsBetter: true },
  { key: 'skillshotsHit', label: 'Skillshots Acertados', description: 'Quantidade de skillshots que você acertou em inimigos.', higherIsBetter: true },
  { key: 'totalTimeSpentDead', label: 'Tempo Morto (s)', description: 'Segundos passados morto. Menos é melhor — tempo morto = tempo sem impacto.', higherIsBetter: false },
  { key: 'soloKills', label: 'Solo Kills', description: 'Abates feitos 1v1 sem assistência. Indica domínio individual.', higherIsBetter: true },
  { key: 'turretKills', label: 'Torres Destruídas', description: 'Número de torres que você destruiu.', higherIsBetter: true },
  { key: 'turretPlatesTaken', label: 'Placas de Torre', description: 'Placas de torre coletadas na fase de rota (antes de cair).', higherIsBetter: true },
  { key: 'laneMinionsFirst10Minutes', label: 'CS nos Primeiros 10min', description: 'Farm nos primeiros 10 minutos. Indica domínio na fase de rota.', higherIsBetter: true },
  { key: 'laningPhaseGoldExpAdvantage', label: 'Vantagem de Lane (Ouro+EXP)', description: 'Vantagem acumulada de ouro e experiência durante a fase de rota.', higherIsBetter: true },
  { key: 'takedownsFirst25Minutes', label: 'Abates nos Primeiros 25min', description: 'Kills + Assists nos primeiros 25 minutos. Mede agressividade precoce.', higherIsBetter: true },
  { key: 'takedownsAfterGainingLevelAdvantage', label: 'Abates com Vantagem de Nível', description: 'Abates realizados quando você tinha vantagem de nível. Indica aproveitamento de lead.', higherIsBetter: true },
  { key: 'abilityUses', label: 'Uso de Habilidades', description: 'Total de habilidades usadas durante a partida.', higherIsBetter: true },
  { key: 'dodgeSkillShotsSmallWindow', label: 'Desvios em Janela Curta', description: 'Skillshots desviados em uma janela de tempo pequena (reflexo).', higherIsBetter: true },
  { key: 'multikillsAfterAggressiveFlash', label: 'Multikills após Flash Agressivo', description: 'Multikills conquistados após usar Flash ofensivamente.', higherIsBetter: true },
  { key: 'visionScoreAdvantageLaneOpponent', label: 'Vantagem de Visão vs Oponente', description: 'Diferença do seu vision score em relação ao adversário de lane.', higherIsBetter: true },
  { key: 'damageTakenOnTeamPercentage', label: '% de Dano Recebido do Time', description: 'Proporção do dano total recebido pelo seu time que foi absolvida por você.', higherIsBetter: false },
  { key: 'timeCCingOthers', label: 'Tempo de CC em Inimigos', description: 'Segundos de controle de grupo aplicados em inimigos.', higherIsBetter: true },
  { key: 'pickTurn', label: 'Turn de Pick', description: 'Posição de pick no draft. Número menor = pick mais cedo.', higherIsBetter: false },
  { key: 'gameDuration', label: 'Duração da Partida', description: 'Duração total da partida em segundos.', higherIsBetter: false },
];

function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function calcWinRate(matches: MatchData[]): number {
  if (!matches.length) return 0;
  return (matches.filter((m) => m.win).length / matches.length) * 100;
}

function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function useMatchAnalysis(
  matches: MatchData[],
  tier?: string | null
): AnalysisResult | null {
  return useMemo(() => {
    if (!matches.length) return null;

    const benchmarks = getBenchmarks(tier);

    // ── Player Stats ──────────────────────────────────────────────────────
    const wins = matches.filter((m) => m.win).length;
    const losses = matches.length - wins;

    const playerStats: PlayerStats = {
      winRate: (wins / matches.length) * 100,
      avgKDA: average(matches.map((m) => m.kda)),
      avgDamagePerMinute: average(matches.map((m) => m.damagePerMinute)),
      avgCSPerMinute: average(matches.map((m) => m.csPerMinute)),
      avgGoldPerMinute: average(matches.map((m) => m.goldPerMinute)),
      avgVisionScore: average(matches.map((m) => m.visionScore)),
      avgKillParticipation: average(matches.map((m) => m.killParticipation)),
      avgTimeSpentDead: average(matches.map((m) => m.totalTimeSpentDead)),
      totalGames: matches.length,
      wins,
      losses,
    };

    // ── Radar Data ─────────────────────────────────────────────────────────
    const radarData: RadarData = normalizeStats(matches, benchmarks);

    // ── Winrate Line ───────────────────────────────────────────────────────
    const winrateLine: WinratePoint[] = matches.map((m, idx) => {
      const subset = matches.slice(0, idx + 1);
      const wr = calcWinRate(subset);
      return { game: idx + 1, winrate: parseFloat(wr.toFixed(1)), win: m.win };
    });

    // ── Attribute Analysis ─────────────────────────────────────────────────
    const attributes: AttributeAnalysis[] = ATTRIBUTE_CONFIGS.map((config) => {
      const values = matches.map((m) => Number(m[config.key]) || 0);
      const playerAvg = average(values);

      const winMatches = matches.filter((m) => m.win);
      const lossMatches = matches.filter((m) => !m.win);

      const winAvg = average(winMatches.map((m) => Number(m[config.key]) || 0));
      const lossAvg = average(lossMatches.map((m) => Number(m[config.key]) || 0));

      // Above/below average split
      const aboveAvg = matches.filter((m) => Number(m[config.key]) >= playerAvg);
      const belowAvg = matches.filter((m) => Number(m[config.key]) < playerAvg);

      const winRateAbove = calcWinRate(aboveAvg);
      const winRateBelow = calcWinRate(belowAvg);

      // Impact = difference in winrate
      let impact: number;
      if (config.higherIsBetter) {
        impact = winRateAbove - winRateBelow;
      } else {
        impact = winRateBelow - winRateAbove;
      }

      // Benchmark value
      const benchmarkMap: Partial<Record<keyof MatchData, number>> = {
        csPerMinute: benchmarks.csPerMinute,
        goldPerMinute: benchmarks.goldPerMinute,
        damagePerMinute: benchmarks.damagePerMinute,
        visionScore: benchmarks.visionScore,
        killParticipation: benchmarks.killParticipation,
        kda: benchmarks.kda,
        turretKills: benchmarks.turretKills,
        laneMinionsFirst10Minutes: benchmarks.laneMinionsFirst10Minutes,
        totalTimeSpentDead: benchmarks.totalTimeSpentDead,
      };

      return {
        key: config.key,
        label: config.label,
        description: config.description,
        playerAvg,
        winAvg,
        lossAvg,
        winRateAboveAvg: winRateAbove,
        winRateBelowAvg: winRateBelow,
        impact,
        higherIsBetter: config.higherIsBetter,
        benchmarkValue: benchmarkMap[config.key],
        benchmarkLabel: `Ref. ${tier || 'Gold'}`,
      };
    }).sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

    // ── Phase Analysis ─────────────────────────────────────────────────────
    const calcPhase = (
      phase: 'early' | 'mid' | 'late',
      label: string,
      attrKeys: (keyof MatchData)[]
    ): PhaseAnalysis => {
      const values = matches.map((m) => {
        const sum = attrKeys.reduce((acc, k) => acc + (Number(m[k]) || 0), 0);
        return sum / attrKeys.length;
      });
      const med = median(values);

      const strong = matches.filter((_, i) => values[i] >= med);
      const weak = matches.filter((_, i) => values[i] < med);

      const avgAttrs: Record<string, number> = {};
      const winAttrs: Record<string, number> = {};
      const lossAttrs: Record<string, number> = {};
      const winM = matches.filter((m) => m.win);
      const lossM = matches.filter((m) => !m.win);

      for (const key of attrKeys) {
        avgAttrs[String(key)] = average(matches.map((m) => Number(m[key]) || 0));
        winAttrs[String(key)] = average(winM.map((m) => Number(m[key]) || 0));
        lossAttrs[String(key)] = average(lossM.map((m) => Number(m[key]) || 0));
      }

      // Dominance score: avg of normalized attrs
      const dominanceScore = Math.round(
        Math.min(100, (average(values) / (med || 1)) * 50)
      );

      return {
        phase,
        label,
        dominanceScore,
        winRateWhenStrong: calcWinRate(strong),
        winRateWhenWeak: calcWinRate(weak),
        avgAttributes: avgAttrs,
        winAvgAttributes: winAttrs,
        lossAvgAttributes: lossAttrs,
      };
    };

    const phases: PhaseAnalysis[] = [
      calcPhase('early', 'Early Game', ['laneMinionsFirst10Minutes', 'laningPhaseGoldExpAdvantage']),
      calcPhase('mid', 'Mid Game', ['takedownsFirst25Minutes', 'turretPlatesTaken', 'soloKills', 'goldPerMinute']),
      calcPhase('late', 'Late Game', ['totalDamageDealtToChampions', 'killParticipation', 'dragonKills', 'timeCCingOthers']),
    ];

    // ── Champion Analysis ──────────────────────────────────────────────────
    const champMap = new Map<string, MatchData[]>();
    for (const m of matches) {
      if (!champMap.has(m.championName)) champMap.set(m.championName, []);
      champMap.get(m.championName)!.push(m);
    }

    const champions: ChampionStats[] = Array.from(champMap.entries())
      .filter(([, ms]) => ms.length >= 1)
      .map(([name, ms]) => {
        const champWins = ms.filter((m) => m.win).length;
        return {
          championId: ms[0].championId,
          championName: name,
          games: ms.length,
          wins: champWins,
          losses: ms.length - champWins,
          winRate: (champWins / ms.length) * 100,
          avgKDA: average(ms.map((m) => m.kda)),
          avgDamagePerMinute: average(ms.map((m) => m.damagePerMinute)),
          avgCSPerMinute: average(ms.map((m) => m.csPerMinute)),
          avgGoldPerMinute: average(ms.map((m) => m.goldPerMinute)),
          avgKillParticipation: average(ms.map((m) => m.killParticipation)),
          matches: ms,
        };
      })
      .sort((a, b) => b.games - a.games);

    return { playerStats, radarData, winrateLine, attributes, phases, champions, matches };
  }, [matches, tier]);
}
