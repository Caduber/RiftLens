import * as React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'amber' | 'blue' | 'cyan' | 'green' | 'red' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({ variant = 'default', size = 'md', className, children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
    amber: 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
    blue: 'bg-blue-500/20 text-blue-400 border border-blue-500/40',
    cyan: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40',
    green: 'bg-green-500/20 text-green-400 border border-green-500/40',
    red: 'bg-red-500/20 text-red-400 border border-red-500/40',
    outline: 'bg-transparent text-zinc-400 border border-zinc-600',
  };

  const sizes = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-0.5 text-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded font-medium',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
