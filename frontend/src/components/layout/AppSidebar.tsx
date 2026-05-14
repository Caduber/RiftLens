import { BarChart2, Clock, List, Swords, Trophy, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SectionId = 'overview' | 'history' | 'attributes' | 'phases' | 'champions';

interface SidebarProps {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
  collapsed?: boolean;
}

const SECTIONS: { id: SectionId; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Visão Geral', icon: <BarChart2 className="w-4 h-4" /> },
  { id: 'history', label: 'Histórico', icon: <List className="w-4 h-4" /> },
  { id: 'attributes', label: 'Por Atributo', icon: <Swords className="w-4 h-4" /> },
  { id: 'phases', label: 'Fases', icon: <Clock className="w-4 h-4" /> },
  { id: 'champions', label: 'Campeões', icon: <Trophy className="w-4 h-4" /> },
];

export function AppSidebar({ activeSection, onNavigate, collapsed }: SidebarProps) {
  return (
    <nav
      className={cn(
        'flex flex-col gap-1 py-2',
        collapsed ? 'w-12' : 'w-52'
      )}
    >
      <div className={cn('px-3 mb-3', collapsed && 'hidden')}>
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Navegação</p>
      </div>
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          id={`nav-${s.id}`}
          onClick={() => onNavigate(s.id)}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left',
            activeSection === s.id
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          )}
        >
          <span className="flex-shrink-0">{s.icon}</span>
          {!collapsed && <span>{s.label}</span>}
        </button>
      ))}
    </nav>
  );
}
