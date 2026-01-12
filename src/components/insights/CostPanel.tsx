import { DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

interface CostPanelProps {
  budget: {
    total: number;
    spent: number;
    remaining: number;
  };
  costByPeriod: {
    date: string; // e.g., "Week 1", "Jan 2025"
    cost: number;
  }[];
  burnRate: {
    current: number; // dollars per day
    projected: number;
    daysUntilBudgetExhausted?: number;
  };
}

export function CostPanel({ budget, costByPeriod, burnRate }: CostPanelProps) {
  const budgetUsedPercent = budget.total > 0
    ? Math.round((budget.spent / budget.total) * 100)
    : 0;

  const getBudgetColor = () => {
    if (budgetUsedPercent >= 90) return 'text-accent-red';
    if (budgetUsedPercent >= 75) return 'text-accent-amber';
    return 'text-accent-green';
  };

  const getBudgetBarColor = () => {
    if (budgetUsedPercent >= 90) return 'bg-accent-red';
    if (budgetUsedPercent >= 75) return 'bg-accent-amber';
    return 'bg-accent-green';
  };

  const maxCost = Math.max(...costByPeriod.map(p => p.cost), 1);

  return (
    <div className="bg-bg-0 rounded-lg border border-border-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-1">Cost Analytics</h2>
        <DollarSign className="w-5 h-5 text-accent-green" />
      </div>

      {/* Budget Overview */}
      <div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-bg-1 rounded-lg p-4 border border-border-1">
            <div className="text-xs text-text-3 mb-1">Total Budget</div>
            <div className="text-xl font-bold text-text-1">${budget.total.toFixed(2)}</div>
          </div>
          <div className="bg-bg-1 rounded-lg p-4 border border-accent-red/30">
            <div className="text-xs text-text-3 mb-1">Spent</div>
            <div className="text-xl font-bold text-accent-red">${budget.spent.toFixed(2)}</div>
          </div>
          <div className="bg-bg-1 rounded-lg p-4 border border-accent-green/30">
            <div className="text-xs text-text-3 mb-1">Remaining</div>
            <div className="text-xl font-bold text-accent-green">${budget.remaining.toFixed(2)}</div>
          </div>
        </div>

        {/* Budget Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-2">Budget Usage</span>
            <span className={`text-sm font-semibold ${getBudgetColor()}`}>
              {budgetUsedPercent}%
            </span>
          </div>
          <div className="w-full h-3 bg-bg-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${getBudgetBarColor()} rounded-full transition-all duration-500`}
              style={{ width: `${budgetUsedPercent}%` }}
            />
          </div>
          {budgetUsedPercent >= 75 && (
            <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-accent-amber/10 rounded border border-accent-amber/30">
              <AlertTriangle className="w-4 h-4 text-accent-amber" />
              <span className="text-xs text-accent-amber font-medium">
                {budgetUsedPercent >= 90
                  ? 'Budget nearly exhausted - consider allocating more funds'
                  : 'Approaching budget limit - monitor closely'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Burn Rate */}
      <div className="pt-4 border-t border-border-1">
        <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide mb-4">
          Burn Rate
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="bg-bg-1 rounded-lg p-4 border border-border-1">
            <div className="text-xs text-text-3 mb-1">Current Rate</div>
            <div className="text-xl font-bold text-text-1">${burnRate.current.toFixed(2)}</div>
            <div className="text-xs text-text-3 mt-1">per day</div>
          </div>
          <div className="bg-bg-1 rounded-lg p-4 border border-border-1">
            <div className="text-xs text-text-3 mb-1">Projected</div>
            <div className="text-xl font-bold text-text-2">${burnRate.projected.toFixed(2)}</div>
            <div className="text-xs text-text-3 mt-1">per day</div>
          </div>
        </div>
        {burnRate.daysUntilBudgetExhausted !== undefined && (
          <div className="flex items-center gap-2 px-3 py-2 bg-bg-1 rounded border border-border-1">
            <TrendingUp className="w-4 h-4 text-text-3" />
            <span className="text-xs text-text-2">
              Budget will be exhausted in approximately{' '}
              <span className="font-semibold text-text-1">
                {burnRate.daysUntilBudgetExhausted} days
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Cost Trend Chart */}
      <div className="pt-4 border-t border-border-1">
        <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide mb-4">
          Cost Trend
        </h3>
        <div className="space-y-2">
          {costByPeriod.map((period, index) => {
            const barWidth = (period.cost / maxCost) * 100;
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="w-20 text-xs text-text-3 text-right">{period.date}</div>
                <div className="flex-1 h-8 bg-bg-2 rounded overflow-hidden relative">
                  <div
                    className="h-full bg-accent-blue rounded transition-all duration-500"
                    style={{ width: `${barWidth}%` }}
                  />
                  <div className="absolute inset-0 flex items-center px-3">
                    <span className="text-xs font-medium text-text-1">
                      ${period.cost.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cost Breakdown Summary */}
      <div className="pt-4 border-t border-border-1">
        <div className="flex items-center justify-between text-xs text-text-3">
          <span>Average cost per period</span>
          <span className="font-semibold text-text-1">
            ${(costByPeriod.reduce((sum, p) => sum + p.cost, 0) / costByPeriod.length).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
