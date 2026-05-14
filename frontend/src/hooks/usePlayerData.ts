import { useState, useCallback } from 'react';
import type { PlayerProfile, Region } from '../types/riot';

interface UsePlayerDataReturn {
  player: PlayerProfile | null;
  loading: boolean;
  error: string | null;
  fetchPlayer: (gameName: string, tagLine: string, region: Region) => Promise<PlayerProfile | null>;
  reset: () => void;
}

export function usePlayerData(): UsePlayerDataReturn {
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayer = useCallback(async (
    gameName: string,
    tagLine: string,
    region: Region
  ): Promise<PlayerProfile | null> => {
    setLoading(true);
    setError(null);
    setPlayer(null);

    try {
      const res = await fetch(`/api/player/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.message || 'Erro ao buscar jogador.');
      }

      setPlayer(data);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido.';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setPlayer(null);
    setError(null);
    setLoading(false);
  }, []);

  return { player, loading, error, fetchPlayer, reset };
}
