import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import type { PhaseAnalysis } from '@/types/analysis';

interface PhaseChartProps {
  phases: PhaseAnalysis[];
}

export function PhaseChart({ phases }: PhaseChartProps) {
  const wins = phases.map((p) => p.winRateWhenStrong);
  const losses = phases.map((p) => p.winRateWhenWeak);
  const labels = ['Early Game', 'Mid Game', 'Late Game'];

  const data = labels.map((label, i) => ({
    fase: label,
    'WR Forte': parseFloat(wins[i]?.toFixed(1) ?? '0'),
    'WR Fraco': parseFloat(losses[i]?.toFixed(1) ?? '0'),
  }));

  const scoreData = phases.map((p, i) => ({
    fase: labels[i],
    Score: p.dominanceScore,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Domínio por Fase — Vitórias vs Derrotas</CardTitle>
      </CardHeader>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="fase" tick={{ fill: '#71717a', fontSize: 11 }} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 10 }} tickLine={false} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={{ background: '#0f0f12', border: '1px solid #27272a', borderRadius: 8 }}
              labelStyle={{ color: '#a1a1aa', fontSize: 12 }}
              formatter={(v: number) => [`${v}%`, '']}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: '#71717a' }} />
            <Bar dataKey="WR Forte" fill="#22c55e" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
            <Bar dataKey="WR Fraco" fill="#ef4444" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
