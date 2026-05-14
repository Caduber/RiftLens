import { Tooltip } from '@/components/ui/Tooltip';
import { Badge } from '@/components/ui/Badge';
import { formatStat } from '@/utils/formatStat';
import type { AttributeAnalysis } from '@/types/analysis';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttributeRowProps {
  attr: AttributeAnalysis;
  rank: number; // 1-indexed, top 3 get gold badge
}

export function AttributeRow({ attr, rank }: AttributeRowProps) {
  const isTop3 = rank <= 3;
  const impact = attr.impact;
  const impactAbs = Math.abs(impact);

  // Format player avg
  const isPercent = attr.key === 'killParticipation' || attr.key === 'damageTakenOnTeamPercentage';
  const isDuration = attr.key === 'totalTimeSpentDead' || attr.key === 'gameDuration';
  const isDecimal = ['kda', 'csPerMinute', 'goldPerMinute', 'damagePerMinute', 'visionScoreAdvantageLaneOpponent', 'laningPhaseGoldExpAdvantage'].includes(String(attr.key));

  const fmt = (v: number) => {
    if (isPercent) return formatStat(v, 'percent');
    if (isDuration) return formatStat(v, 'duration');
    if (isDecimal) return formatStat(v, 'decimal');
    return formatStat(v, 'integer');
  };

  return (
    <div className={cn(
      'bg-[#0f0f12] rounded-lg p-3 border transition-all duration-150',
      isTop3 ? 'border-amber-500/40' : 'border-zinc-800 hover:border-zinc-700'
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isTop3 && (
            <Badge variant="amber" size="sm">#{rank} 🏆</Badge>
          )}
          <Tooltip content={attr.description}>
            <span className="flex items-center gap-1 text-sm font-medium text-zinc-200 cursor-help">
              {attr.label}
              <Info className="w-3 h-3 text-zinc-600" />
            </span>
          </Tooltip>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span>Avg: <span className="text-zinc-300 font-medium">{fmt(attr.playerAvg)}</span></span>
          {attr.benchmarkValue !== undefined && (
            <span className="hidden sm:inline text-zinc-600">Ref: {fmt(attr.benchmarkValue)}</span>
          )}
        </div>
      </div>

      {/* Win/loss bars */}
      <div className="space-y-1.5">
        <WinBar
          label={`Acima da média`}
          extra={`(${fmt(attr.playerAvg)}+)`}
          winRate={attr.winRateAboveAvg}
          color="bg-green-500"
        />
        <WinBar
          label={`Abaixo da média`}
          extra={`(<${fmt(attr.playerAvg)})`}
          winRate={attr.winRateBelowAvg}
          color="bg-red-500"
        />
      </div>

      {/* Impact indicator */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Impacto</span>
        <div className="flex items-center gap-1">
          <div
            className="h-1.5 rounded-full bg-amber-500/40"
            style={{ width: `${Math.min(100, impactAbs * 1.5)}px` }}
          />
          <span className={cn(
            'text-xs font-bold',
            impact > 10 ? 'text-green-400' : impact < -10 ? 'text-red-400' : 'text-zinc-400'
          )}>
            {impact > 0 ? '+' : ''}{impact.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

function WinBar({ label, extra, winRate, color }: {
  label: string;
  extra: string;
  winRate: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-[10px] text-zinc-500 w-28 flex-shrink-0">
        {label} <span className="text-zinc-600 hidden sm:inline">{extra}</span>
      </div>
      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', color)}
          style={{ width: `${Math.max(0, Math.min(100, winRate))}%`, opacity: 0.8 }}
        />
      </div>
      <div className="text-xs font-mono font-semibold text-zinc-300 w-12 text-right">
        {formatStat(winRate, 'percent')}
      </div>
    </div>
  );
}
