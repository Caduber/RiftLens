import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import type { WinratePoint } from '@/types/analysis';

interface WinrateLineProps {
  data: WinratePoint[];
}

export function WinrateLine({ data }: WinrateLineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução do WinRate</CardTitle>
        <span className="text-xs text-zinc-500">acumulado por partida</span>
      </CardHeader>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="game"
              tick={{ fill: '#71717a', fontSize: 10 }}
              tickLine={false}
              label={{ value: 'Partida', position: 'insideBottom', offset: -2, fill: '#52525b', fontSize: 10 }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#71717a', fontSize: 10 }}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <ReferenceLine y={50} stroke="#52525b" strokeDasharray="4 4" />
            <Tooltip
              contentStyle={{ background: '#0f0f12', border: '1px solid #27272a', borderRadius: 8 }}
              labelStyle={{ color: '#71717a', fontSize: 11 }}
              labelFormatter={(label) => `Partida ${label}`}
              formatter={(v: number) => [`${v.toFixed(1)}%`, 'WinRate']}
              itemStyle={{ color: '#f59e0b' }}
            />
            <Line
              type="monotone"
              dataKey="winrate"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload } = props;
                return (
                  <circle
                    key={`dot-${payload.game}`}
                    cx={cx}
                    cy={cy}
                    r={3}
                    fill={payload.win ? '#22c55e' : '#ef4444'}
                    stroke="none"
                  />
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
