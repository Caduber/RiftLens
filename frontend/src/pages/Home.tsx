import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, BarChart2, Shield, Eye } from 'lucide-react';
import type { Region } from '@/types/riot';

const REGIONS: { value: Region; label: string }[] = [
  { value: 'BR1', label: 'BR — Brasil' },
  { value: 'NA1', label: 'NA — América do Norte' },
  { value: 'EUW1', label: 'EUW — Europa Oeste' },
  { value: 'EUN1', label: 'EUNE — Europa Norte/Leste' },
  { value: 'KR', label: 'KR — Coreia' },
  { value: 'JP1', label: 'JP — Japão' },
  { value: 'LA1', label: 'LAN — América Latina Norte' },
  { value: 'LA2', label: 'LAS — América Latina Sul' },
  { value: 'OC1', label: 'OCE — Oceania' },
  { value: 'TR1', label: 'TR — Turquia' },
  { value: 'RU', label: 'RU — Rússia' },
  { value: 'PH2', label: 'PH — Filipinas' },
  { value: 'SG2', label: 'SG — Singapura' },
  { value: 'TH2', label: 'TH — Tailândia' },
  { value: 'TW2', label: 'TW — Taiwan' },
  { value: 'VN2', label: 'VN — Vietnã' },
];

const LOADING_MESSAGES = [
  'Buscando perfil…',
  'Verificando rank…',
  'Carregando histórico de partidas…',
  'Analisando dados de combate…',
  'Calculando métricas de visão…',
  'Processando fases do jogo…',
  'Calculando correlações…',
  'Gerando insights…',
];

export default function Home() {
  const navigate = useNavigate();
  const [gameName, setGameName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [region, setRegion] = useState<Region>('BR1');
  const [count, setCount] = useState(20);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameName.trim() || !tagLine.trim()) {
      setError('Preencha o nome e a tag do jogador.');
      return;
    }

    setError('');
    setLoading(true);

    // Cycle loading messages
    let msgIdx = 0;
    setLoadingMsg(LOADING_MESSAGES[0]);
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[msgIdx]);
    }, 1800);

    try {
      // Fetch player
      const playerRes = await fetch(
        `/api/player/${region}/${encodeURIComponent(gameName.trim())}/${encodeURIComponent(tagLine.trim())}`
      );
      const playerData = await playerRes.json();

      if (!playerRes.ok || playerData.error) {
        throw new Error(playerData.message || 'Jogador não encontrado.');
      }

      // Fetch matches
      const matchRes = await fetch(
        `/api/matches/${playerData.puuid}/${region}?count=${count}`
      );
      const matchData = await matchRes.json();

      if (!matchRes.ok || matchData.error) {
        throw new Error(matchData.message || 'Erro ao carregar partidas.');
      }

      clearInterval(msgInterval);
      setLoading(false);

      // Navigate to analysis with data
      navigate('/analysis', {
        state: {
          player: playerData,
          matches: matchData.matches,
          region,
        },
      });
    } catch (err) {
      clearInterval(msgInterval);
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Erro desconhecido.');
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[250px] h-[250px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-amber-400" />
            </div>
            <h1 className="text-4xl font-black tracking-tight">
              <span className="text-gradient-amber">RIFT</span>
              <span className="text-white"> LENS</span>
            </h1>
          </div>
          <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
            Análise avançada de desempenho para League of Legends. Descubra o que te faz ganhar ou perder.
          </p>

          {/* Feature pills */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            {[
              { icon: <Zap className="w-3 h-3" />, label: 'Correlações com vitória' },
              { icon: <BarChart2 className="w-3 h-3" />, label: 'Fases do jogo' },
              { icon: <Eye className="w-3 h-3" />, label: 'Insights automáticos' },
              { icon: <Shield className="w-3 h-3" />, label: 'Por campeão' },
            ].map((f) => (
              <span key={f.label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700 text-zinc-400 text-xs">
                {f.icon} {f.label}
              </span>
            ))}
          </div>
        </div>

        {/* Search form */}
        <div className="bg-[#0f0f12] border border-zinc-800 rounded-2xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Nick + Tag */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wider">
                  Nome de invocador
                </label>
                <input
                  id="input-gamename"
                  type="text"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  placeholder="Ex: Faker"
                  disabled={loading}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all disabled:opacity-50"
                />
              </div>
              <div className="w-28">
                <label className="block text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wider">
                  #TAG
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">#</span>
                  <input
                    id="input-tagline"
                    type="text"
                    value={tagLine}
                    onChange={(e) => setTagLine(e.target.value)}
                    placeholder="BR1"
                    disabled={loading}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-6 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Region select */}
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wider">
                Região
              </label>
              <select
                id="select-region"
                value={region}
                onChange={(e) => setRegion(e.target.value as Region)}
                disabled={loading}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all disabled:opacity-50 appearance-none cursor-pointer"
              >
                {REGIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Match count slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                  Partidas a analisar
                </label>
                <span className="text-sm font-bold text-amber-400">{count}</span>
              </div>
              <input
                id="slider-count"
                type="range"
                min="10"
                max="100"
                step="5"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                disabled={loading}
                className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-amber-500 disabled:opacity-50"
              />
              <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
                <span>10</span><span>55</span><span>100</span>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400 flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Submit button */}
            <button
              id="btn-analyze"
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/40 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 glow-amber"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Analisando…
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Analisar Jogador
                </>
              )}
            </button>
          </form>
        </div>

        {/* Loading progress */}
        {loading && (
          <div className="mt-6 text-center animate-fade-in">
            <div className="text-sm text-amber-400 font-medium mb-3">{loadingMsg}</div>
            {/* Skeleton cards preview */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 skeleton rounded-lg" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-zinc-600 mt-6">
          Powered by Riot Games API · Apenas partidas ranqueadas (Solo/Duo)
        </p>
      </div>
    </div>
  );
}
