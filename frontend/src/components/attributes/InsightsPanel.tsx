import { useMemo } from 'react';
import type { AttributeAnalysis } from '@/types/analysis';
import { formatStat } from '@/utils/formatStat';
import { Lightbulb } from 'lucide-react';

interface InsightsPanelProps {
  attributes: AttributeAnalysis[];
  winRate: number;
}

export function InsightsPanel({ attributes, winRate }: InsightsPanelProps) {
  const insights = useMemo(() => {
    const msgs: string[] = [];
    const top = attributes.slice(0, 5);

    for (const attr of top) {
      const fmt = (v: number) => {
        const isPercent = attr.key === 'killParticipation' || attr.key === 'damageTakenOnTeamPercentage';
        const isDecimal = ['kda', 'csPerMinute', 'goldPerMinute', 'damagePerMinute'].includes(String(attr.key));
        if (isPercent) return formatStat(v, 'percent');
        if (isDecimal) return formatStat(v, 'decimal');
        return formatStat(v, 'integer');
      };

      const diff = Math.abs(attr.winRateAboveAvg - attr.winRateBelowAvg);
      if (diff < 5) continue;

      if (attr.key === 'totalTimeSpentDead') {
        const ratio = attr.lossAvg / Math.max(1, attr.winAvg);
        msgs.push(`⚰️ Seu tempo morto nas derrotas (${fmt(attr.lossAvg)}s) é ${ratio.toFixed(1)}x maior que nas vitórias (${fmt(attr.winAvg)}s). Evitar trades desfavoráveis pode ser o fator chave.`);
      } else if (attr.key === 'skillshotsHit') {
        msgs.push(`🎯 Você performa significativamente melhor quando acerta mais skillshots (${fmt(attr.playerAvg)}/jogo). Foque em posicionamento para aumentar a precisão.`);
      } else if (attr.key === 'killParticipation') {
        msgs.push(`🤝 Alta correlação com vitória quando sua participação em abates está acima de ${fmt(attr.playerAvg)}. Jogue mais perto do seu time.`);
      } else if (attr.key === 'visionScore') {
        msgs.push(`👁️ Seu vision score impacta diretamente no resultado. Média atual: ${fmt(attr.playerAvg)}. Priorize control wards e sweepers.`);
      } else if (attr.key === 'laneMinionsFirst10Minutes') {
        msgs.push(`🌾 Dominar a fase de rota (${fmt(attr.playerAvg)} CS nos primeiros 10min) aumenta seu WR em ${diff.toFixed(0)}%. Foco no farm early.`);
      } else if (attr.key === 'csPerMinute') {
        msgs.push(`📈 Cada CS a mais por minuto impacta seu resultado. Sua média é ${fmt(attr.playerAvg)} CS/min — tente chegar em ${formatStat(attr.playerAvg * 1.1, 'decimal')}.`);
      } else if (attr.key === 'soloKills') {
        msgs.push(`⚔️ Solo kills têm forte correlação com vitória no seu histórico. Você faz ${fmt(attr.winAvg)} por vitória vs ${fmt(attr.lossAvg)} por derrota.`);
      } else if (attr.key === 'turretPlatesTaken') {
        msgs.push(`🏰 Converter pressão de lane em placas de torre é altamente correlacionado com vitória no seu histórico.`);
      } else if (attr.key === 'kda') {
        if (attr.winAvg > attr.lossAvg * 1.5) {
          msgs.push(`💀 Quando você morre menos, vence mais. Seu KDA nas vitórias (${fmt(attr.winAvg)}) é muito superior ao das derrotas (${fmt(attr.lossAvg)}).`);
        }
      }
    }

    if (winRate < 45) {
      msgs.push(`📊 Seu winrate está abaixo de 50%. Foque nos top atributos acima — melhorar mesmo 1 deles pode ter impacto imediato nos resultados.`);
    } else if (winRate >= 55) {
      msgs.push(`🏆 Winrate acima de 55%! Continue mantendo os atributos destacados acima — eles são o segredo da sua consistência.`);
    }

    return msgs.slice(0, 4);
  }, [attributes, winRate]);

  if (!insights.length) return null;

  return (
    <div className="bg-gradient-to-br from-amber-500/5 to-blue-500/5 border border-amber-500/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Insights Automáticos</h3>
      </div>
      <ul className="space-y-2">
        {insights.map((msg, i) => (
          <li key={i} className="text-sm text-zinc-300 leading-relaxed pl-1 border-l-2 border-amber-500/30 ml-1 pl-3">
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
}
