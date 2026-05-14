/**
 * Mapeamento de região para cluster de match v5 e account v1
 */

// Cluster usado para lol/match/v5 e riot/account/v1
const REGION_TO_CLUSTER = {
  BR1: 'americas',
  LA1: 'americas',
  LA2: 'americas',
  NA1: 'americas',
  EUW1: 'europe',
  EUN1: 'europe',
  TR1: 'europe',
  RU: 'europe',
  KR: 'asia',
  JP1: 'asia',
  OC1: 'sea',
  PH2: 'sea',
  SG2: 'sea',
  TH2: 'sea',
  TW2: 'sea',
  VN2: 'sea',
};

// Host da API de summoner/league (ex: br1.api.riotgames.com)
const REGION_TO_HOST = {
  BR1: 'br1',
  LA1: 'la1',
  LA2: 'la2',
  NA1: 'na1',
  EUW1: 'euw1',
  EUN1: 'eun1',
  TR1: 'tr1',
  RU: 'ru',
  KR: 'kr',
  JP1: 'jp1',
  OC1: 'oc1',
  PH2: 'ph2',
  SG2: 'sg2',
  TH2: 'th2',
  TW2: 'tw2',
  VN2: 'vn2',
};

export function getCluster(region) {
  const cluster = REGION_TO_CLUSTER[region?.toUpperCase()];
  if (!cluster) throw new Error(`Região inválida: ${region}`);
  return cluster;
}

export function getRegionHost(region) {
  const host = REGION_TO_HOST[region?.toUpperCase()];
  if (!host) throw new Error(`Região inválida: ${region}`);
  return host;
}

export const VALID_REGIONS = Object.keys(REGION_TO_CLUSTER);
