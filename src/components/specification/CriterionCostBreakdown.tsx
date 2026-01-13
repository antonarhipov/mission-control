import { useV4DataModel } from '@/hooks/useV4DataModel';
import { aggregateCostsByAgent } from '@/utils/costAttribution';
import type { Mission } from '@/types';

interface CriterionCostBreakdownProps {
  mission: Mission;
}

export function CriterionCostBreakdown({ mission }: CriterionCostBreakdownProps) {
  const { agents } = useV4DataModel();

  if (!mission.specificationImpact) {
    return (
      <div className="text-sm text-text-3 italic">
        No cost data available
      </div>
    );
  }

  const costsByAgent = aggregateCostsByAgent(mission.specificationImpact);
  const totalCost = mission.specificationImpact.totalCost;

  // Get agent details and sort by cost
  const agentCosts = Object.entries(costsByAgent)
    .map(([agentId, cost]) => {
      const agent = agents.find(a => a.id === agentId);
      return {
        agentId,
        agent,
        cost,
        percentage: totalCost > 0 ? (cost / totalCost) * 100 : 0
      };
    })
    .sort((a, b) => b.cost - a.cost);

  if (agentCosts.length === 0) {
    return (
      <div className="text-sm text-text-3 italic">
        No agent contributions yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {agentCosts.map(({ agentId, agent, cost, percentage }) => (
        <div key={agentId} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {agent && (
                <span className="text-lg">{agent.emoji}</span>
              )}
              <span className="font-medium text-text-1">
                {agent?.name || agentId}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-text-2 font-medium">
                ${cost.toFixed(2)}
              </span>
              <span className="text-text-3">
                ({percentage.toFixed(0)}%)
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-bg-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${percentage}%`,
                backgroundColor: agent?.color || '#388bfd'
              }}
            />
          </div>
        </div>
      ))}

      {/* Total */}
      <div className="pt-3 border-t border-border-1">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-text-1">Total</span>
          <span className="font-semibold text-text-1">
            ${totalCost.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
