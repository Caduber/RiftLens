import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import type { SparklinePoint } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  sparkline?: SparklinePoint[];
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

export function KpiCard({ label, value, icon, sparkline, color = '#f59e0b', trend, loading }: KpiCardProps) {
  if (loading) {
    return (
      <Card className="flex flex-col gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-full" />
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-2 group cursor-default">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{label}</span>
        <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors">{icon}</span>
      </div>

      <div className={cn('text-2xl font-bold', trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-white')}>
        {value}
      </div>

      {sparkline && sparkline.length > 1 && (
        <div className="h-12 w-full -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkline}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={1.5}
                dot={false}
                strokeOpacity={0.8}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
