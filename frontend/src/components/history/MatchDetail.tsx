import type { MatchData } from '@/types/riot';
import { formatStat } from '@/utils/formatStat';

interface MatchDetailProps {
  match: MatchData;
}

interface StatRowProps {
  label: string;
  value: string;
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <tr className="border-b border-zinc-800/50 last:border-0">
      <td className="py-1.5 pr-4 text-xs text-zinc-500 font-medium whitespace-nowrap">{label}</td>
      <td className="py-1.5 text-xs text-zinc-200 text-right font-mono">{value}</td>
    </tr>
  );
}

interface GroupProps {
  title: string;
  rows: StatRowProps[];
}

function StatGroup({ title, rows }: GroupProps) {
  return (
    <div className="bg-zinc-800/30 rounded-lg p-3">
      <h4 className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold mb-2">{title}</h4>
      <table className="w-full">
        <tbody>
          {rows.map((r) => <StatRow key={r.label} {...r} />)}
        </tbody>
      </table>
    </div>
  );
}

export function MatchDetail({ match }: MatchDetailProps) {
  return (
    <div className="border-t border-zinc-800 bg-[#0a0a0d] p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatGroup
          title="Combate Geral"
          rows={[
            { label: 'KDA', value: `${match.kills}/${match.deaths}/${match.assists}` },
            { label: 'KDA Ratio', value: formatStat(match.kda, 'kda') },
            { label: 'Kill Participation', value: formatStat(match.killParticipation, 'percent') },
            { label: 'Solo Kills', value: String(match.soloKills) },
            { label: 'Double/Triple/Quadra/Penta', value: `${match.doubleKills}/${match.tripleKills}/${match.quadraKills}/${match.pentaKills}` },
            { label: 'Multikills após Flash Agressivo', value: String(match.multikillsAfterAggressiveFlash) },
          ]}
        />
        <StatGroup
          title="Mecânica Avançada"
          rows={[
            { label: 'Skillshots Desviados', value: String(match.skillshotsDodged) },
            { label: 'Skillshots Acertados', value: String(match.skillshotsHit) },
            { label: 'Desvios em Janela Curta', value: String(match.dodgeSkillShotsSmallWindow) },
            { label: 'Uso de Habilidades', value: String(match.abilityUses) },
            { label: 'Tempo de CC', value: `${match.timeCCingOthers}s` },
            { label: 'Tempo Morto', value: `${match.totalTimeSpentDead}s` },
          ]}
        />
        <StatGroup
          title="Visão & Mapa"
          rows={[
            { label: 'Vision Score', value: String(match.visionScore) },
            { label: 'Wards Colocadas', value: String(match.wardsPlaced) },
            { label: 'Wards Destruídas', value: String(match.wardsKilled) },
            { label: 'Control Wards', value: String(match.visionWardsBoughtInGame) },
            { label: 'Vantagem de Visão vs Oponente', value: formatStat(match.visionScoreAdvantageLaneOpponent, 'decimal') },
          ]}
        />
        <StatGroup
          title="Objetivos"
          rows={[
            { label: 'Torres', value: String(match.turretKills) },
            { label: 'Placas de Torre', value: String(match.turretPlatesTaken) },
            { label: 'Inibidores', value: String(match.inhibitorKills) },
            { label: 'Barões', value: String(match.baronKills) },
            { label: 'Dragões', value: String(match.dragonKills) },
            { label: 'Objetivos Roubados', value: String(match.objectivesStolen) },
          ]}
        />
        <StatGroup
          title="Farm & Ouro"
          rows={[
            { label: 'CS Total', value: String(match.totalMinionsKilled + match.neutralMinionsKilled) },
            { label: 'CS por Minuto', value: formatStat(match.csPerMinute, 'decimal') },
            { label: 'Ouro Ganho', value: formatStat(match.goldEarned, 'gold') },
            { label: 'Ouro por Minuto', value: formatStat(match.goldPerMinute, 'decimal') },
          ]}
        />
        <StatGroup
          title="Fase de Lane"
          rows={[
            { label: 'Lane', value: `${match.lane} / ${match.role}` },
            { label: 'CS 10 min', value: String(match.laneMinionsFirst10Minutes) },
            { label: 'Vantagem Lane (Gold+EXP)', value: formatStat(match.laningPhaseGoldExpAdvantage, 'decimal') },
            { label: 'Abates 25min', value: String(match.takedownsFirst25Minutes) },
            { label: 'Abates com Vantagem de Nível', value: String(match.takedownsAfterGainingLevelAdvantage) },
            { label: 'Dano Mais Alto do Time', value: match.highestChampionDamage ? '✓ Sim' : '✗ Não' },
          ]}
        />
      </div>
    </div>
  );
}
