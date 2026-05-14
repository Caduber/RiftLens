/**
 * Community Dragon and Data Dragon asset URL generators
 */

const CDRAGON_BASE = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1';
const DDRAGON_BASE = 'https://ddragon.leagueoflegends.com/cdn/14.24.1';

export function getSummonerIconUrl(iconId: number): string {
  return `${CDRAGON_BASE}/profile-icons/${iconId}.jpg`;
}

export function getChampionSplashUrl(championId: number): string {
  return `${CDRAGON_BASE}/champion-splashes/${championId}/${championId}000.jpg`;
}

export function getChampionIconUrl(championId: number): string {
  return `${CDRAGON_BASE}/champion-icons/${championId}.png`;
}

export function getItemIconUrl(itemId: number): string {
  if (!itemId || itemId === 0) return '';
  // Try DDragon first (more reliable for items)
  return `${DDRAGON_BASE}/img/item/${itemId}.png`;
}

export function getSpellIconUrl(spellKey: string): string {
  return `${DDRAGON_BASE}/img/spell/${spellKey}.png`;
}

export function getRuneIconUrl(perkId: number): string {
  // Map common rune IDs to their CDragon paths
  return `${CDRAGON_BASE}/perk-images/styles/${perkId}.png`;
}

// Summoner spell ID to key mapping (common spells)
const SPELL_ID_TO_KEY: Record<number, string> = {
  1: 'SummonerBoost',       // Cleanse
  3: 'SummonerExhaust',     // Exhaust
  4: 'SummonerFlash',       // Flash
  6: 'SummonerHaste',       // Ghost
  7: 'SummonerHeal',        // Heal
  11: 'SummonerSmite',      // Smite
  12: 'SummonerTeleport',   // Teleport
  13: 'SummonerMana',       // Clarity
  14: 'SummonerDot',        // Ignite
  21: 'SummonerBarrier',    // Barrier
  32: 'SummonerSnowball',   // Mark (ARAM)
  39: 'SummonerSnowURFSnowball_Mark',
  54: 'Summoner_UltBookPlaceholder',
  55: 'Summoner_UltBookSmitePlaceholder',
};

export function getSpellIconUrlById(spellId: number): string {
  const key = SPELL_ID_TO_KEY[spellId] || 'SummonerFlash';
  return `${DDRAGON_BASE}/img/spell/${key}.png`;
}

// Rank tier to icon color mapping
export const TIER_COLORS: Record<string, string> = {
  IRON: '#7c6e7a',
  BRONZE: '#a05a2c',
  SILVER: '#9aa4af',
  GOLD: '#f0b429',
  PLATINUM: '#4db8b8',
  EMERALD: '#2cb67d',
  DIAMOND: '#5b8cff',
  MASTER: '#a855f7',
  GRANDMASTER: '#ef4444',
  CHALLENGER: '#f59e0b',
};

export function getTierColor(tier: string): string {
  return TIER_COLORS[tier?.toUpperCase()] || '#71717a';
}

export const LANE_ICONS: Record<string, string> = {
  TOP: '⚔️',
  JUNGLE: '🌿',
  MIDDLE: '💎',
  BOTTOM: '🏹',
  UTILITY: '🛡️',
  SUPPORT: '🛡️',
  UNKNOWN: '❓',
};

export function getLaneIcon(lane: string): string {
  return LANE_ICONS[lane?.toUpperCase()] || '❓';
}

export function getLaneLabel(lane: string): string {
  const labels: Record<string, string> = {
    TOP: 'Top',
    JUNGLE: 'Jungle',
    MIDDLE: 'Mid',
    BOTTOM: 'Bot',
    UTILITY: 'Support',
    SUPPORT: 'Support',
    UNKNOWN: '—',
  };
  return labels[lane?.toUpperCase()] || lane || '—';
}
