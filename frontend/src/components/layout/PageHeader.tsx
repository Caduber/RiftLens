import { type PlayerProfile } from '@/types/riot';
import { getSummonerIconUrl, getChampionSplashUrl, getTierColor } from '@/utils/assets';
import { formatStat } from '@/utils/formatStat';
import { Shield, Zap, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { MatchData } from '@/types/riot';

interface PageHeaderProps {
  player: PlayerProfile;
  matches: MatchData[];
  avgKDA: number;
  winRate: number;
}

export function PageHeader({ player, matches, avgKDA, winRate }: PageHeaderProps) {
  const lastChamp = matches[0];
  const splashUrl = lastChamp ? getChampionSplashUrl(lastChamp.championId) : '';
  const rank = player.rankedSolo || player.rankedFlex;
  const tierColor = rank ? getTierColor(rank.tier) : '#71717a';

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-zinc-800 mb-6" style={{ minHeight: 180 }}>
      {/* Background splash */}
      {splashUrl && (
        <>
          <img
            src={splashUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
            style={{ filter: 'blur(2px) saturate(1.3)' }}
          />
          <div className="absolute inset-0 hero-overlay" />
        </>
      )}

      <div className="relative z-10 flex items-center gap-5 p-6">
        {/* Summoner icon */}
        <div className="relative flex-shrink-0">
          <img
            src={getSummonerIconUrl(player.profileIconId)}
            alt="Summoner icon"
            className="w-20 h-20 rounded-full border-2 border-amber-500 shadow-lg"
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-icon.png'; }}
          />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 px-2 rounded-full font-medium">
            {player.summonerLevel}
          </span>
        </div>

        {/* Name & rank */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-white">
            {player.gameName}
            <span className="text-zinc-500">#{player.tagLine}</span>
          </h1>
          <p className="text-xs text-zinc-500 mb-2">{player.region}</p>

          {rank && (
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="amber" className="text-sm font-bold px-3 py-1">
                <Shield className="w-3 h-3" style={{ color: tierColor }} />
                {rank.tier} {rank.rank} — {rank.leaguePoints} LP
              </Badge>
              <Badge variant="outline">
                {rank.wins}V {rank.losses}D · {rank.winRate}% WR
              </Badge>
            </div>
          )}
          {!rank && (
            <Badge variant="outline">Sem rank</Badge>
          )}
        </div>

        {/* Quick stats */}
        <div className="hidden md:flex items-center gap-6 flex-shrink-0">
          <Stat icon={<Zap className="w-4 h-4 text-amber-400" />} label="WinRate" value={`${formatStat(winRate, 'percent')}`} color="text-amber-400" />
          <Stat icon={<Eye className="w-4 h-4 text-blue-400" />} label="KDA Médio" value={formatStat(avgKDA, 'kda')} color="text-blue-400" />
          <Stat icon={<Shield className="w-4 h-4 text-zinc-400" />} label="Partidas" value={String(matches.length)} color="text-zinc-300" />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 mb-0.5">{icon}</div>
      <div className={`text-lg font-bold ${color}`}>{value}</div>
      <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}
