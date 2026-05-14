import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import type { ChampionStats } from '@/types/analysis';

interface ChampionScatterProps {
  champions: ChampionStats[];
}

interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: ChampionStats & { x: number; y: number };
}

function CustomDot({ cx = 0, cy = 0, payload }: CustomDotProps) {
  if (!payload) return null;
  const color = payload.winRate >= 55
    ? '#22c55e'
    : payload.winRate >= 45
    ? '#f59e0b'
    : '#ef4444';
  const r = Math.min(14, 6 + payload.games * 1.5);

  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} fillOpacity={0.7} stroke={color} strokeWidth={1} />
      <text x={cx} y={cy - r - 3} textAnchor="middle" fill="#a1a1aa" fontSize={9}>
        {payload.championName.length > 8 ? payload.championName.substring(0, 7) + '…' : payload.championName}
      </text>
    </g>
  );
}

interface TooltipPayload {
  payload?: ChampionStats & { x: number; y: number };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length || !payload[0].payload) return null;
  const p = payload[0].payload;
  return (
    <div className="bg-[#0f0f12] border border-zinc-700 rounded-lg p-3 text-xs shadow-xl">
      <div className="font-bold text-white mb-1">{p.championName}</div>
      <div className="text-zinc-400">KDA: <span className="text-amber-400 font-medium">{p.avgKDA.toFixed(2)}</span></div>
      <div className="text-zinc-400">WinRate: <span className="text-green-400 font-medium">{p.winRate.toFixed(1)}%</span></div>
      <div className="text-zinc-400">Partidas: <span className="text-zinc-200">{p.games}</span></div>
    </div>
  );
}

export function ChampionScatter({ champions }: ChampionScatterProps) {
  const data = champions.map((c) => ({
    ...c,
    x: parseFloat(c.avgKDA.toFixed(2)),
    y: parseFloat(c.winRate.toFixed(1)),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>KDA vs WinRate por Campeão</CardTitle>
        <span className="text-xs text-zinc-500">tamanho = partidas</span>
      </CardHeader>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 16, right: 16, bottom: 20, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              type="number"
              dataKey="x"
              name="KDA"
              domain={['auto', 'auto']}
              tick={{ fill: '#71717a', fontSize: 10 }}
              tickLine={false}
            >
              <Label value="KDA Médio" offset={-10} position="insideBottom" fill="#52525b" fontSize={10} />
            </XAxis>
            <YAxis
              type="number"
              dataKey="y"
              name="WinRate"
              domain={[0, 100]}
              tick={{ fill: '#71717a', fontSize: 10 }}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3f3f46' }} />
            <Scatter data={data} shape={<CustomDot />} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
