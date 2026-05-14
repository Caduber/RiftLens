import { useState } from 'react';
import type { ChampionStats } from '@/types/analysis';
import { getChampionIconUrl } from '@/utils/assets';
import { formatStat } from '@/utils/formatStat';
import { Badge } from '@/components/ui/Badge';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChampionCardProps {
  champ: ChampionStats;
}

export function ChampionCard({ champ }: ChampionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isPositive = champ.winRate >= 50;

  return (
    <div
      className={cn(
        'rounded-xl border bg-[#0f0f12] overflow-hidden transition-all duration-200',
        isPositive ? 'border-green-500/20 hover:border-green-500/40' : 'border-red-500/20 hover:border-red-500/40'
      )}
    >
      <div
        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-zinc-800/20 transition-colors"
        onClick={() => setExpanded(!expanded)}
        id={`champ-${champ.championName}`}
      >
        {/* Champion icon */}
        <div className="relative flex-shrink-0">
          <img
            src={getChampionIconUrl(champ.championId)}
            alt={champ.championName}
            className="w-12 h-12 rounded-lg border border-zinc-700"
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
          />
        </div>

        {/* Name & games */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white text-sm">{champ.championName}</div>
          <div className="text-xs text-zinc-500">{champ.games} partidas · {champ.wins}V {champ.losses}D</div>
        </div>

        {/* Winrate */}
        <div className="text-center flex-shrink-0 w-20">
          <div className={cn('text-lg font-bold', isPositive ? 'text-green-400' : 'text-red-400')}>
            {formatStat(champ.winRate, 'percent')}
          </div>
          <div className="text-[10px] text-zinc-500 uppercase">WinRate</div>
        </div>

        {/* KDA */}
        <div className="text-center flex-shrink-0 w-20 hidden sm:block">
          <div className="text-sm font-bold text-amber-400">{formatStat(champ.avgKDA, 'kda')}</div>
          <div className="text-[10px] text-zinc-500 uppercase">KDA</div>
        </div>

        {/* CS/min */}
        <div className="text-center flex-shrink-0 w-20 hidden md:block">
          <div className="text-sm text-zinc-200">{formatStat(champ.avgCSPerMinute, 'decimal')}</div>
          <div className="text-[10px] text-zinc-500 uppercase">CS/min</div>
        </div>

        {/* DPM */}
        <div className="text-center flex-shrink-0 w-24 hidden lg:block">
          <div className="text-sm text-zinc-200">{formatStat(champ.avgDamagePerMinute, 'integer')}</div>
          <div className="text-[10px] text-zinc-500 uppercase">Dmg/min</div>
        </div>

        {/* Expand */}
        <div className="text-zinc-600 flex-shrink-0">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Expanded stats */}
      {expanded && (
        <div className="border-t border-zinc-800 bg-[#0a0a0d] p-4 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              { label: 'KDA Médio', value: formatStat(champ.avgKDA, 'kda') },
              { label: 'CS por Minuto', value: formatStat(champ.avgCSPerMinute, 'decimal') },
              { label: 'Dano por Minuto', value: formatStat(champ.avgDamagePerMinute, 'integer') },
              { label: 'Ouro por Minuto', value: formatStat(champ.avgGoldPerMinute, 'decimal') },
              { label: 'Kill Participation', value: formatStat(champ.avgKillParticipation, 'percent') },
              { label: 'Partidas', value: String(champ.games) },
              { label: 'Vitórias', value: String(champ.wins) },
              { label: 'Derrotas', value: String(champ.losses) },
            ].map((stat) => (
              <div key={stat.label} className="bg-zinc-800/40 rounded-lg p-2 text-center">
                <div className="text-sm font-bold text-zinc-200">{stat.value}</div>
                <div className="text-[10px] text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
