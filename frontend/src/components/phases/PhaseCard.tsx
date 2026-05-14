import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import type { PhaseAnalysis } from '@/types/analysis';
import { formatStat } from '@/utils/formatStat';
import { cn } from '@/lib/utils';

interface PhaseCardProps {
  phase: PhaseAnalysis;
}

const PHASE_META = {
  early: { label: 'Early Game', emoji: '🌅', color: '#06b6d4', desc: 'Primeiros 15 minutos — farm e domínio de lane' },
  mid: { label: 'Mid Game', emoji: '⚔️', color: '#f59e0b', desc: 'Rotações, objetivos e fights de 25min' },
  late: { label: 'Late Game', emoji: '🏆', color: '#a855f7', desc: 'Teamfights decisivos e pressão final' },
};

export function PhaseCard({ phase }: PhaseCardProps) {
  const meta = PHASE_META[phase.phase];
  const score = phase.dominanceScore;
  const scoreColor = score >= 65 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';

  const attrKeys = Object.keys(phase.avgAttributes);
  const chartData = attrKeys.slice(0, 4).map((k) => ({
    name: k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).substring(0, 14),
    Vitórias: parseFloat((phase.winAvgAttributes[k] || 0).toFixed(2)),
    Derrotas: parseFloat((phase.lossAvgAttributes[k] || 0).toFixed(2)),
  }));

  return (
    <Card className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{meta.emoji}</span>
          <div>
            <div className="text-base font-bold text-white">{meta.label}</div>
            <div className="text-[10px] text-zinc-500">{meta.desc}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black" style={{ color: scoreColor }}>{score}</div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Score</div>
        </div>
      </div>

      {/* Score bar */}
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: scoreColor }}
        />
      </div>

      {/* Win/loss when strong */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-center">
          <div className="text-sm font-bold text-green-400">{formatStat(phase.winRateWhenStrong, 'percent')}</div>
          <div className="text-[10px] text-zinc-500">WR quando forte</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-center">
          <div className="text-sm font-bold text-red-400">{formatStat(phase.winRateWhenWeak, 'percent')}</div>
          <div className="text-[10px] text-zinc-500">WR quando fraco</div>
        </div>
      </div>

      {/* Bar chart W vs L */}
      {chartData.length > 0 && (
        <div className="h-36 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#27272a" />
              <XAxis dataKey="name" tick={{ fill: '#52525b', fontSize: 8 }} tickLine={false} />
              <YAxis tick={{ fill: '#52525b', fontSize: 8 }} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0f0f12', border: '1px solid #27272a', borderRadius: 8, fontSize: 10 }}
              />
              <Bar dataKey="Vitórias" fill="#22c55e" fillOpacity={0.8} radius={[2, 2, 0, 0]} />
              <Bar dataKey="Derrotas" fill="#ef4444" fillOpacity={0.8} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
