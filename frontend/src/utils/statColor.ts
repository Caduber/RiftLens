/**
 * Returns Tailwind CSS color classes based on stat comparison to average.
 * higherIsBetter=true → above avg = green, below = red
 * higherIsBetter=false → above avg = red, below = green (e.g. totalTimeSpentDead)
 */
export function statColor(
  value: number,
  average: number,
  higherIsBetter: boolean = true,
  threshold: number = 0.05 // 5% threshold to be "neutral"
): string {
  if (average === 0) return 'text-zinc-400';
  const ratio = (value - average) / Math.abs(average);

  if (Math.abs(ratio) < threshold) return 'text-zinc-400';

  const isAbove = value > average;
  const isGood = higherIsBetter ? isAbove : !isAbove;

  return isGood ? 'text-green-400' : 'text-red-400';
}

/**
 * Returns background color classes for badges/bars
 */
export function statBgColor(
  value: number,
  average: number,
  higherIsBetter: boolean = true
): string {
  if (average === 0) return 'bg-zinc-700';
  const isAbove = value > average;
  const isGood = higherIsBetter ? isAbove : !isAbove;
  return isGood ? 'bg-green-500/20 text-green-400 border-green-500/30'
                : 'bg-red-500/20 text-red-400 border-red-500/30';
}

/**
 * Returns a simple hex color for recharts or inline styles
 */
export function statHexColor(
  value: number,
  average: number,
  higherIsBetter: boolean = true
): string {
  if (average === 0) return '#71717a';
  const isAbove = value > average;
  const isGood = higherIsBetter ? isAbove : !isAbove;
  return isGood ? '#22c55e' : '#ef4444';
}
