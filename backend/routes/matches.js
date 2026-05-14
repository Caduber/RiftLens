import express from 'express';
import { riotFetch } from '../services/riotApi.js';
import { getCache, setCache } from '../services/cache.js';
import { getCluster } from '../utils/regionMapper.js';

const router = express.Router();

/**
 * Extrai os dados relevantes de um participante da partida
 */
function extractParticipant(participant, gameDurationSeconds) {
  const c = participant.challenges || {};
  const gameDurationMinutes = gameDurationSeconds / 60;

  const kills = participant.kills || 0;
  const deaths = participant.deaths || 0;
  const assists = participant.assists || 0;
  const kda = (kills + assists) / Math.max(1, deaths);

  const totalCS =
    (participant.totalMinionsKilled || 0) + (participant.neutralMinionsKilled || 0);
  const csPerMinute = gameDurationMinutes > 0 ? totalCS / gameDurationMinutes : 0;

  const totalDmg = participant.totalDamageDealtToChampions || 0;
  const damagePerMinute =
    gameDurationMinutes > 0 ? totalDmg / gameDurationMinutes : c.damagePerMinute || 0;

  const goldEarned = participant.goldEarned || 0;
  const goldPerMinute =
    gameDurationMinutes > 0 ? goldEarned / gameDurationMinutes : c.goldPerMinute || 0;

  const teamDamageTaken =
    c.damageTakenOnTeamPercentage !== undefined
      ? c.damageTakenOnTeamPercentage
      : 0;

  return {
    // Identificação
    matchId: participant.matchId || '',
    gameCreation: 0, // preenchido no nível da partida
    gameDuration: gameDurationSeconds,
    gameMode: '',
    queueId: 0,

    // Campeão
    championId: participant.championId,
    championName: participant.championName,
    championLevel: participant.champLevel,
    spell1Id: participant.summoner1Id,
    spell2Id: participant.summoner2Id,
    perks: participant.perks || null,

    // Resultado
    win: participant.win,
    kills,
    deaths,
    assists,
    kda: parseFloat(kda.toFixed(2)),

    // Dano
    totalDamageDealtToChampions: totalDmg,
    totalDamageTaken: participant.totalDamageTaken || 0,
    magicDamageDealtToChampions: participant.magicDamageDealtToChampions || 0,
    physicalDamageDealtToChampions: participant.physicalDamageDealtToChampions || 0,
    trueDamageDealtToChampions: participant.trueDamageDealtToChampions || 0,
    damagePerMinute: parseFloat(damagePerMinute.toFixed(2)),
    damageTakenOnTeamPercentage: parseFloat((teamDamageTaken * 100).toFixed(2)),

    // Ouro e farm
    goldEarned,
    goldPerMinute: parseFloat(goldPerMinute.toFixed(2)),
    totalMinionsKilled: participant.totalMinionsKilled || 0,
    neutralMinionsKilled: participant.neutralMinionsKilled || 0,
    csPerMinute: parseFloat(csPerMinute.toFixed(2)),

    // Visão
    visionScore: participant.visionScore || 0,
    wardsPlaced: participant.wardsPlaced || 0,
    wardsKilled: participant.wardsKilled || 0,
    visionWardsBoughtInGame: participant.visionWardsBoughtInGame || 0,
    visionScoreAdvantageLaneOpponent: c.visionScoreAdvantageLaneOpponent || 0,

    // Objetivos
    turretKills: participant.turretKills || 0,
    turretPlatesTaken: c.turretPlatesTaken || 0,
    inhibitorKills: participant.inhibitorKills || 0,
    baronKills: participant.baronKills || 0,
    dragonKills: participant.dragonKills || 0,
    objectivesStolen: participant.objectivesStolen || 0,

    // Combate
    soloKills: c.soloKills || 0,
    doubleKills: participant.doubleKills || 0,
    tripleKills: participant.tripleKills || 0,
    quadraKills: participant.quadraKills || 0,
    pentaKills: participant.pentaKills || 0,
    multikillsAfterAggressiveFlash: c.multikillsAfterAggressiveFlash || 0,
    killParticipation: parseFloat(((c.killParticipation || 0) * 100).toFixed(2)),
    takedownsFirst25Minutes: c.takedownsFirst25Minutes || 0,
    takedownsAfterGainingLevelAdvantage: c.takedownsAfterGainingLevelAdvantage || 0,

    // Mecânica
    skillshotsDodged: c.skillshotsDodged || 0,
    skillshotsHit: c.skillshotsHit || 0,
    dodgeSkillShotsSmallWindow: c.dodgeSkillShotsSmallWindow || 0,
    abilityUses: c.abilityUses || 0,
    timeCCingOthers: participant.timeCCingOthers || 0,
    totalTimeSpentDead: participant.totalTimeSpentDead || 0,

    // Lane
    lane: participant.teamPosition || participant.lane || 'UNKNOWN',
    role: participant.role || 'UNKNOWN',
    laningPhaseGoldExpAdvantage: c.laningPhaseGoldExpAdvantage || 0,
    laneMinionsFirst10Minutes: c.laneMinionsFirst10Minutes || 0,
    highestChampionDamage: c.highestChampionDamage || 0,
    pickTurn: c.pickTurn || 0,

    // Itens
    item0: participant.item0 || 0,
    item1: participant.item1 || 0,
    item2: participant.item2 || 0,
    item3: participant.item3 || 0,
    item4: participant.item4 || 0,
    item5: participant.item5 || 0,
    item6: participant.item6 || 0,
  };
}

// GET /api/matches/:puuid/:region?count=20
router.get('/:puuid/:region', async (req, res) => {
  const { puuid, region } = req.params;
  const rawCount = parseInt(req.query.count || '20', 10);
  const count = Math.min(100, Math.max(10, rawCount));

  const cacheKey = `matches:${puuid}:${region}:${count}`;
  const cached = getCache(cacheKey);
  if (cached) return res.json(cached);

  try {
    const cluster = getCluster(region);

    // 1. Busca IDs de partidas ranqueadas
    const matchIds = await riotFetch(
      `https://${cluster}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=420&count=${count}`
    );

    if (!matchIds || matchIds.length === 0) {
      return res.json({ matches: [], total: 0 });
    }

    // 2. Busca detalhes de cada partida em paralelo (lotes de 5 para não estourar rate limit)
    const matches = [];
    const batchSize = 5;
    for (let i = 0; i < matchIds.length; i += batchSize) {
      const batch = matchIds.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(async (matchId) => {
          try {
            const matchData = await riotFetch(
              `https://${cluster}.api.riotgames.com/lol/match/v5/matches/${matchId}`
            );
            const info = matchData.info;
            const participant = info.participants.find((p) => p.puuid === puuid);
            if (!participant) return null;

            const extracted = extractParticipant(participant, info.gameDuration);
            extracted.matchId = matchId;
            extracted.gameCreation = info.gameCreation;
            extracted.gameDuration = info.gameDuration;
            extracted.gameMode = info.gameMode;
            extracted.queueId = info.queueId;

            return extracted;
          } catch (err) {
            console.warn(`Falha ao buscar partida ${matchId}:`, err.message);
            return null;
          }
        })
      );
      matches.push(...batchResults.filter(Boolean));

      // Pausa entre lotes para respeitar rate limit
      if (i + batchSize < matchIds.length) {
        await new Promise((r) => setTimeout(r, 200));
      }
    }

    const result = {
      matches,
      total: matches.length,
    };

    setCache(cacheKey, result, 300); // TTL: 5 minutos
    res.json(result);
  } catch (err) {
    console.error('Erro em /api/matches:', err.message);
    const status = err.response?.status || 500;
    const messages = {
      404: 'PUUID não encontrado.',
      401: 'API key inválida ou expirada.',
      403: 'Acesso negado pela API da Riot.',
      429: 'Limite de requisições atingido. Tente novamente em instantes.',
    };
    res.status(status).json({
      error: true,
      status,
      message: messages[status] || `Erro ao buscar partidas: ${err.message}`,
    });
  }
});

export default router;
