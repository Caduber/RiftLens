/**
 * Utility: format stat values for display
 */

export type StatType = 'percent' | 'decimal' | 'integer' | 'duration' | 'gold' | 'kda';

export function formatStat(value: number, type: StatType): string {
  if (value === null || value === undefined || isNaN(value)) return '—';

  switch (type) {
    case 'percent':
      return `${value.toFixed(1)}%`;

    case 'decimal':
      return value.toFixed(2);

    case 'kda':
      if (!isFinite(value)) return 'Perfect';
      return value.toFixed(2);

    case 'integer':
      return Math.round(value).toLocaleString('pt-BR');

    case 'gold':
      if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
      return Math.round(value).toString();

    case 'duration': {
      const totalSeconds = Math.round(value);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    default:
      return String(value);
  }
}

/**
 * Format KDA as "K/D/A"
 */
export function formatKDA(kills: number, deaths: number, assists: number): string {
  return `${kills}/${deaths}/${assists}`;
}

/**
 * Format KDA ratio
 */
export function formatKDARatio(kda: number): string {
  if (!isFinite(kda)) return '∞';
  return kda.toFixed(2);
}

/**
 * Format relative time (e.g. "há 2 horas")
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'agora mesmo';
  if (diffMin < 60) return `há ${diffMin} min`;
  if (diffHour < 24) return `há ${diffHour}h`;
  if (diffDay === 1) return 'ontem';
  if (diffDay < 7) return `há ${diffDay} dias`;
  if (diffDay < 30) return `há ${Math.floor(diffDay / 7)} sem`;
  return `há ${Math.floor(diffDay / 30)} meses`;
}
