import { useState } from 'react';
import type { MatchData } from '@/types/riot';
import { getChampionIconUrl, getSpellIconUrlById, getLaneIcon, getLaneLabel } from '@/utils/assets';
import { formatStat, formatKDA, formatKDARatio, formatRelativeTime } from '@/utils/formatStat';
import { Badge } from '@/components/ui/Badge';
import { MatchDetail } from './MatchDetail';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchCardProps {
  match: MatchData;
}

export function MatchCard({ match }: MatchCardProps) {
  const [expanded, setExpanded] = useState(false);

  const isWin = match.win;
  const multiKills = match.quadraKills > 0
    ? 'Quadra Kill!'
    : match.tripleKills > 0
    ? 'Triple Kill!'
    : match.doubleKills > 1
    ? 'Multi Kill!'
    : '';

  return (
    <div
      className={cn(
        'rounded-xl border bg-[#0f0f12] overflow-hidden transition-all duration-200',
        isWin ? 'border-green-500/30' : 'border-red-500/30'
      )}
    >
      {/* Main row */}
      <div
        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-zinc-800/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
        id={`match-${match.matchId}`}
      >
        {/* Win/loss bar */}
        <div className={cn('w-1 self-stretch rounded-full flex-shrink-0', isWin ? 'bg-green-500' : 'bg-red-500')} />

        {/* Champion */}
        <div className="relative flex-shrink-0">
          <img
            src={getChampionIconUrl(match.championId)}
            alt={match.championName}
            className="w-12 h-12 rounded-lg border border-zinc-700"
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
          />
          <span className="absolute -bottom-1 -right-1 bg-zinc-900 text-[9px] text-zinc-300 border border-zinc-700 px-1 rounded font-bold">
            {match.championLevel}
          </span>
        </div>

        {/* Spells */}
        <div className="flex flex-col gap-1 flex-shrink-0">
          {[match.spell1Id, match.spell2Id].map((id, i) => (
            <img
              key={i}
              src={getSpellIconUrlById(id)}
              alt={String(id)}
              className="w-5 h-5 rounded"
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
            />
          ))}
        </div>

        {/* Result + Champion name */}
        <div className="flex-shrink-0 w-20">
          <div className={cn('text-sm font-bold', isWin ? 'text-green-400' : 'text-red-400')}>
            {isWin ? 'Vitória' : 'Derrota'}
          </div>
          <div className="text-xs text-zinc-400 truncate">{match.championName}</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">
            {getLaneIcon(match.lane)} {getLaneLabel(match.lane)}
          </div>
        </div>

        {/* KDA */}
        <div className="flex-shrink-0 w-28 text-center">
          <div className="text-sm font-bold text-white">{formatKDA(match.kills, match.deaths, match.assists)}</div>
          <div className="text-xs text-amber-400 font-semibold">{formatKDARatio(match.kda)} KDA</div>
          <div className="text-[10px] text-zinc-500">{formatStat(match.killParticipation, 'percent')} KP</div>
        </div>

        {/* CS & Gold */}
        <div className="hidden sm:flex flex-col flex-shrink-0 w-24 text-center">
          <div className="text-sm text-zinc-200 font-medium">
            {match.totalMinionsKilled + match.neutralMinionsKilled} CS
          </div>
          <div className="text-xs text-zinc-500">{formatStat(match.csPerMinute, 'decimal')} CS/min</div>
          <div className="text-xs text-amber-300/70">{formatStat(match.goldEarned, 'gold')}g</div>
        </div>

        {/* Damage */}
        <div className="hidden md:flex flex-col flex-shrink-0 w-24 text-center">
          <div className="text-sm text-zinc-200 font-medium">{formatStat(match.totalDamageDealtToChampions, 'gold')}</div>
          <div className="text-xs text-zinc-500">Dano</div>
          <div className="text-xs text-zinc-500">{formatStat(match.damagePerMinute, 'decimal')}/min</div>
        </div>

        {/* Vision */}
        <div className="hidden lg:flex flex-col flex-shrink-0 w-16 text-center">
          <div className="text-sm text-zinc-200 font-medium">{match.visionScore}</div>
          <div className="text-xs text-zinc-500">Visão</div>
        </div>

        {/* Duration + time */}
        <div className="hidden sm:flex flex-col flex-shrink-0 w-20 text-right ml-auto">
          <div className="text-sm text-zinc-300">{formatStat(match.gameDuration, 'duration')}</div>
          <div className="text-xs text-zinc-500">{formatRelativeTime(match.gameCreation)}</div>
        </div>

        {/* Badges */}
        <div className="hidden md:flex flex-col gap-1 flex-shrink-0">
          {match.pentaKills > 0 && <Badge variant="amber" size="sm">PENTA!</Badge>}
          {match.quadraKills > 0 && match.pentaKills === 0 && <Badge variant="cyan" size="sm">Quadra!</Badge>}
          {match.tripleKills > 0 && match.quadraKills === 0 && <Badge variant="blue" size="sm">Triple</Badge>}
          {match.skillshotsDodged > 15 && <Badge variant="outline" size="sm">🛡️ {match.skillshotsDodged}</Badge>}
        </div>

        {/* Expand chevron */}
        <div className="text-zinc-600 flex-shrink-0 ml-2">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && <MatchDetail match={match} />}
    </div>
  );
}
