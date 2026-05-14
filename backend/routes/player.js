import express from 'express';
import { riotFetch } from '../services/riotApi.js';
import { getCache, setCache } from '../services/cache.js';
import { getCluster, getRegionHost } from '../utils/regionMapper.js';

const router = express.Router();

// GET /api/player/:region/:gameName/:tagLine
router.get('/:region/:gameName/:tagLine', async (req, res) => {
  const { region, gameName, tagLine } = req.params;
  const cacheKey = `player:${region}:${gameName}:${tagLine}`;

  const cached = getCache(cacheKey);
  if (cached) return res.json(cached);

  try {
    const cluster = getCluster(region);
    const regionHost = getRegionHost(region);

    // 1. Busca PUUID via account v1
    const accountData = await riotFetch(
      `https://${cluster}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
    );
    const puuid = accountData.puuid;

    // 2. Busca summoner pelo PUUID
    const summonerData = await riotFetch(
      `https://${regionHost}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`
    );

    // 3. Busca rank pelo summonerId
    // const leagueData = await riotFetch(
    //   `https://${regionHost}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}`
    // );

    // Filtra ranked solo/duo
    // const rankedSolo = leagueData.find((e) => e.queueType === 'RANKED_SOLO_5x5') || null;
    // const rankedFlex = leagueData.find((e) => e.queueType === 'RANKED_FLEX_SR') || null;

    const result = {
      puuid,
      gameName: accountData.gameName,
      tagLine: accountData.tagLine,
      summonerId: summonerData.id,
      accountId: summonerData.accountId,
      profileIconId: summonerData.profileIconId,
      summonerLevel: summonerData.summonerLevel,
      region: region.toUpperCase(),
      // rankedSolo: rankedSolo
      //   ? {
      //       tier: rankedSolo.tier,
      //       rank: rankedSolo.rank,
      //       leaguePoints: rankedSolo.leaguePoints,
      //       wins: rankedSolo.wins,
      //       losses: rankedSolo.losses,
      //       winRate: Math.round((rankedSolo.wins / (rankedSolo.wins + rankedSolo.losses)) * 100),
      //     }
      //   : null,
      // rankedFlex: rankedFlex
      //   ? {
      //       tier: rankedFlex.tier,
      //       rank: rankedFlex.rank,
      //       leaguePoints: rankedFlex.leaguePoints,
      //       wins: rankedFlex.wins,
      //       losses: rankedFlex.losses,
      //       winRate: Math.round((rankedFlex.wins / (rankedFlex.wins + rankedFlex.losses)) * 100),
      //     }
      //   : null,
    };

    setCache(cacheKey, result, 120); // TTL: 2 minutos
    res.json(result);
  } catch (err) {
    console.error('Erro em /api/player:', err.message);
    const status = err.response?.status || 500;
    const messages = {
      404: 'Jogador não encontrado. Verifique o nome e a tag.',
      401: 'API key inválida ou expirada.',
      403: 'Acesso negado pela API da Riot.',
      429: 'Limite de requisições atingido. Tente novamente em instantes.',
    };
    res.status(status).json({
      error: true,
      status,
      message: messages[status] || `Erro ao buscar jogador: ${err.message}`,
    });
  }
});

export default router;
