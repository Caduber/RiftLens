import {
  RadarChart as RechartsRadar,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import type { RadarData } from '@/types/analysis';

interface RadarChartProfileProps {
  data: RadarData;
}

export function RadarChartProfile({ data }: RadarChartProfileProps) {
  const chartData = [
    { subject: 'Combate', value: data.combat, fullMark: 100 },
    { subject: 'Mecânica', value: data.mechanics, fullMark: 100 },
    { subject: 'Visão', value: data.vision, fullMark: 100 },
    { subject: 'Farm', value: data.farm, fullMark: 100 },
    { subject: 'Objetivos', value: data.objectives, fullMark: 100 },
    { subject: 'Teamfight', value: data.teamfight, fullMark: 100 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil do Jogador</CardTitle>
      </CardHeader>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadar data={chartData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="#27272a" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#a1a1aa', fontSize: 11 }}
            />
            <Radar
              dataKey="value"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.18}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{ background: '#0f0f12', border: '1px solid #27272a', borderRadius: 8 }}
              labelStyle={{ color: '#a1a1aa', fontSize: 12 }}
              itemStyle={{ color: '#f59e0b', fontSize: 12 }}
              formatter={(v: number) => [`${v}/100`, 'Score']}
            />
          </RechartsRadar>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
