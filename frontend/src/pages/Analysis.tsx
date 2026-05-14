import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, X } from 'lucide-react';
import type { PlayerProfile, MatchData } from '@/types/riot';
import { useMatchAnalysis } from '@/hooks/useMatchAnalysis';
import { PageHeader } from '@/components/layout/PageHeader';
import { AppSidebar, type SectionId } from '@/components/layout/AppSidebar';

// Section components
import { KpiCard } from '@/components/overview/KpiCard';
import { RadarChartProfile } from '@/components/overview/RadarChartProfile';
import { WinrateLine } from '@/components/overview/WinrateLine';
import { MatchCard } from '@/components/history/MatchCard';
import { AttributeRow } from '@/components/attributes/AttributeRow';
import { InsightsPanel } from '@/components/attributes/InsightsPanel';
import { PhaseCard } from '@/components/phases/PhaseCard';
import { PhaseChart } from '@/components/phases/PhaseChart';
import { ChampionCard } from '@/components/champions/ChampionCard';
import { ChampionScatter } from '@/components/champions/ChampionScatter';

import { Skeleton } from '@/components/ui/Skeleton';
import { formatStat } from '@/utils/formatStat';
import {
  Zap, Eye, Shield, Target, BarChart2, Clock, Users, TrendingUp,
} from 'lucide-react';

interface LocationState {
  player: PlayerProfile;
  matches: MatchData[];
  region: string;
}

function SectionTitle({ id, title, subtitle }: { id: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-5" id={id}>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}

export default function Analysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const player = state?.player ?? null;
  const matches = state?.matches ?? [];

  const analysis = useMatchAnalysis(matches, player?.rankedSolo?.tier ?? player?.rankedFlex?.tier);

  // Redirect if no data
  useEffect(() => {
    if (!player) navigate('/');
  }, [player, navigate]);

  if (!player || !analysis) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="text-zinc-500 text-sm">Carregando análise…</div>
      </div>
    );
  }

  const { playerStats, radarData, winrateLine, attributes, phases, champions } = analysis;

  const scrollTo = (section: SectionId) => {
    setActiveSection(section);
    document.getElementById(`section-${section}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Sparkline data per KPI
  const mkSparkline = (key: keyof MatchData) =>
    matches.slice(0, 20).map((m) => ({ value: Number(m[key]) || 0 }));

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Top nav bar */}
      <header className="sticky top-0 z-50 bg-[#09090b]/90 backdrop-blur-sm border-b border-zinc-800 px-4 py-2 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Voltar</span>
        </button>

        <div className="flex items-center gap-2 ml-2">
          <BarChart2 className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-bold text-gradient-amber">RIFT LENS</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-zinc-500 hidden sm:inline">
            {matches.length} partidas analisadas
          </span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sticky sidebar */}
        {sidebarOpen && (
          <aside className="sticky top-[49px] h-[calc(100vh-49px)] overflow-y-auto flex-shrink-0 border-r border-zinc-800 bg-[#09090b] no-scrollbar">
            <AppSidebar activeSection={activeSection} onNavigate={scrollTo} />
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-6 max-w-6xl mx-auto">
          {/* Player header */}
          <PageHeader
            player={player}
            matches={matches}
            winRate={playerStats.winRate}
            avgKDA={playerStats.avgKDA}
          />

          {/* ── SECTION 1: OVERVIEW ──────────────────────────────────── */}
          <section id="section-overview" className="mb-12 scroll-mt-16">
            <SectionTitle id="section-overview" title="Visão Geral" subtitle={`Baseado em ${matches.length} partidas ranqueadas`} />

            {/* KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <KpiCard
                label="Winrate"
                value={formatStat(playerStats.winRate, 'percent')}
                icon={<TrendingUp className="w-4 h-4" />}
                sparkline={winrateLine.map((p) => ({ value: p.winrate }))}
                color={playerStats.winRate >= 50 ? '#22c55e' : '#ef4444'}
                trend={playerStats.winRate >= 50 ? 'up' : 'down'}
              />
              <KpiCard
                label="KDA Médio"
                value={formatStat(playerStats.avgKDA, 'kda')}
                icon={<Zap className="w-4 h-4" />}
                sparkline={mkSparkline('kda')}
                color="#f59e0b"
              />
              <KpiCard
                label="Dano/min"
                value={formatStat(playerStats.avgDamagePerMinute, 'integer')}
                icon={<Target className="w-4 h-4" />}
                sparkline={mkSparkline('damagePerMinute')}
                color="#3b82f6"
              />
              <KpiCard
                label="CS/min"
                value={formatStat(playerStats.avgCSPerMinute, 'decimal')}
                icon={<Shield className="w-4 h-4" />}
                sparkline={mkSparkline('csPerMinute')}
                color="#06b6d4"
              />
              <KpiCard
                label="Ouro/min"
                value={formatStat(playerStats.avgGoldPerMinute, 'decimal')}
                icon={<BarChart2 className="w-4 h-4" />}
                sparkline={mkSparkline('goldPerMinute')}
                color="#d97706"
              />
              <KpiCard
                label="Vision Score"
                value={formatStat(playerStats.avgVisionScore, 'integer')}
                icon={<Eye className="w-4 h-4" />}
                sparkline={mkSparkline('visionScore')}
                color="#a855f7"
              />
              <KpiCard
                label="Kill Part."
                value={formatStat(playerStats.avgKillParticipation, 'percent')}
                icon={<Users className="w-4 h-4" />}
                sparkline={mkSparkline('killParticipation')}
                color="#60a5fa"
              />
              <KpiCard
                label="Tempo Morto"
                value={formatStat(playerStats.avgTimeSpentDead, 'duration')}
                icon={<Clock className="w-4 h-4" />}
                sparkline={mkSparkline('totalTimeSpentDead')}
                color="#ef4444"
                trend={playerStats.avgTimeSpentDead > 300 ? 'down' : 'up'}
              />
            </div>

            {/* Radar + Winrate line */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RadarChartProfile data={radarData} />
              <WinrateLine data={winrateLine} />
            </div>
          </section>

          {/* ── SECTION 2: HISTORY ───────────────────────────────────── */}
          <section id="section-history" className="mb-12 scroll-mt-16">
            <SectionTitle
              id="section-history"
              title="Histórico de Partidas"
              subtitle="Clique em uma partida para ver detalhes completos"
            />
            <div className="flex flex-col gap-2">
              {matches.map((match) => (
                <MatchCard key={match.matchId} match={match} />
              ))}
              {matches.length === 0 && (
                <div className="text-center py-12 text-zinc-500">Nenhuma partida ranqueada encontrada.</div>
              )}
            </div>
          </section>

          {/* ── SECTION 3: ATTRIBUTES ────────────────────────────────── */}
          <section id="section-attributes" className="mb-12 scroll-mt-16">
            <SectionTitle
              id="section-attributes"
              title="Análise por Atributo"
              subtitle="Correlação de cada métrica com vitória — ordenado por impacto"
            />
            <InsightsPanel attributes={attributes} winRate={playerStats.winRate} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
              {attributes.map((attr, idx) => (
                <AttributeRow key={String(attr.key)} attr={attr} rank={idx + 1} />
              ))}
            </div>
          </section>

          {/* ── SECTION 4: PHASES ────────────────────────────────────── */}
          <section id="section-phases" className="mb-12 scroll-mt-16">
            <SectionTitle
              id="section-phases"
              title="Fases do Jogo"
              subtitle="Em qual fase você domina — e onde você perde o jogo"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              {phases.map((phase) => (
                <PhaseCard key={phase.phase} phase={phase} />
              ))}
            </div>
            <PhaseChart phases={phases} />
          </section>

          {/* ── SECTION 5: CHAMPIONS ─────────────────────────────────── */}
          <section id="section-champions" className="mb-12 scroll-mt-16">
            <SectionTitle
              id="section-champions"
              title="Análise por Campeão"
              subtitle="Desempenho agrupado por campeão — clique para expandir"
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
              <div className="lg:col-span-2 flex flex-col gap-2">
                {champions.map((champ) => (
                  <ChampionCard key={champ.championName} champ={champ} />
                ))}
                {champions.length === 0 && (
                  <div className="text-center py-8 text-zinc-500">Sem dados por campeão.</div>
                )}
              </div>
              <div className="lg:col-span-1">
                <ChampionScatter champions={champions} />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
