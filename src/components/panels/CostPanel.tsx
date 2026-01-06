import { useState } from 'react';
import { clsx } from 'clsx';
import { useDataModel } from '@/hooks/useDataModel';
import { agents, agentCosts, budgets, modelPricing } from '@/data/mockData';
import { ChevronDown, TrendingUp, GitCommit, Users } from 'lucide-react';
import type { TaskV2 } from '@/types';

type Period = '1H' | '24H' | '7D' | '30D';

export function CostPanel() {
  const [period, setPeriod] = useState<Period>('24H');
  const { isV2, tasks, getAgentById } = useDataModel();

  // V2 state
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(
    isV2 && tasks.length > 0 ? tasks[0].id : null
  );
  const [isTaskDropdownOpen, setIsTaskDropdownOpen] = useState(false);

  // Type guard for TaskV2
  const isTaskV2 = (task: any): task is TaskV2 => {
    return task && 'worktrees' in task && Array.isArray(task.worktrees);
  };

  const selectedTask = isV2 && selectedTaskId
    ? tasks.find(t => t.id === selectedTaskId)
    : null;
  const taskV2 = selectedTask && isTaskV2(selectedTask) ? selectedTask : null;

  const totalCost = agentCosts.reduce((sum, c) => sum + c.totalCost, 0);
  const totalInput = agentCosts.reduce((sum, c) => sum + c.inputTokens, 0);
  const totalOutput = agentCosts.reduce((sum, c) => sum + c.outputTokens, 0);
  const costPerTask = totalCost / 8; // Mock: 8 tasks completed

  return (
    <div className="grid grid-cols-[1fr_360px] h-full">
      {/* Main content */}
      <div className="flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-bg-1 border-b border-border-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-base font-semibold">Cost Analytics</h2>

              {/* V2: Task selector */}
              {isV2 && taskV2 && (
                <div className="relative">
                  <button
                    onClick={() => setIsTaskDropdownOpen(!isTaskDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-bg-2 border border-border-1 rounded-md hover:bg-bg-3 transition-colors text-xs"
                  >
                    <span className="font-mono font-medium">{taskV2.id}</span>
                    <span className="text-text-2 max-w-[200px] truncate">{taskV2.title}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-text-3" />
                  </button>

                  {isTaskDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-[400px] bg-bg-1 border border-border-1 rounded-lg shadow-xl z-50 max-h-[400px] overflow-y-auto">
                      <div className="p-2 border-b border-border-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-text-3 px-2">
                          Select Task
                        </span>
                      </div>
                      <div className="p-1">
                        {tasks.filter(isTaskV2).map((task) => (
                          <button
                            key={task.id}
                            onClick={() => {
                              setSelectedTaskId(task.id);
                              setIsTaskDropdownOpen(false);
                            }}
                            className={clsx(
                              'w-full flex items-start gap-2 p-2 rounded-md text-left transition-colors',
                              selectedTaskId === task.id ? 'bg-bg-3' : 'hover:bg-bg-2'
                            )}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-[10px] text-text-3">{task.id}</span>
                                <span className={clsx(
                                  'text-[10px] px-1.5 py-0.5 rounded',
                                  task.status === 'in-progress' && 'bg-accent-blue/20 text-accent-blue',
                                  task.status === 'done' && 'bg-accent-green/20 text-accent-green'
                                )}>
                                  {task.status}
                                </span>
                              </div>
                              <p className="text-xs text-text-1 truncate mb-1">{task.title}</p>
                              <div className="flex items-center gap-3 text-[10px] text-text-3">
                                <span>{task.worktrees.length} repos</span>
                                <span className="font-mono text-accent-green">${task.totalCost.toFixed(2)}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-0.5 bg-bg-2 p-0.5 rounded">
              {(['1H', '24H', '7D', '30D'] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={clsx(
                    'px-3 py-1 text-[11px] rounded transition-colors',
                    period === p
                      ? 'bg-bg-3 text-text-1'
                      : 'text-text-2 hover:text-text-1'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-3">
            <SummaryCard
              label="Total Spend (24h)"
              value={`$${totalCost.toFixed(2)}`}
              change="↓ 18% vs yesterday"
              changeType="down"
            />
            <SummaryCard
              label="Input Tokens"
              value={`${(totalInput / 1000000).toFixed(1)}M`}
              change={`$${(totalInput * 3 / 1000000).toFixed(2)} @ $3/M`}
            />
            <SummaryCard
              label="Output Tokens"
              value={`${(totalOutput / 1000).toFixed(0)}K`}
              change={`$${(totalOutput * 15 / 1000000).toFixed(2)} @ $15/M`}
            />
            <SummaryCard
              label="Cost per Task"
              value={`$${costPerTask.toFixed(2)}`}
              valueColor="green"
              change="↓ 23% improved"
              changeType="down"
            />
          </div>
        </div>

        {/* Breakdown content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* V2: Task-specific breakdowns */}
          {isV2 && taskV2 ? (
            <>
              {/* Pipeline Stage Costs */}
              <div className="bg-bg-1 border border-border-1 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-bg-2 border-b border-border-1 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-text-3" />
                  <span className="text-xs font-semibold">Cost by Pipeline Stage</span>
                </div>
                <div className="p-4 space-y-2">
                  {taskV2.pipeline.map((stage) => {
                    const maxCost = Math.max(...taskV2.pipeline.map(s => s.cost));
                    const widthPercent = maxCost > 0 ? (stage.cost / maxCost) * 100 : 0;

                    return (
                      <div key={stage.id} className="flex items-center gap-3">
                        <div className="w-32 text-xs text-text-2 truncate">{stage.name}</div>
                        <div className="flex-1">
                          <div className="h-7 bg-bg-2 rounded overflow-hidden">
                            <div
                              className={clsx(
                                'h-full flex items-center px-2 text-xs font-mono font-semibold',
                                stage.status === 'completed' && 'bg-accent-green text-white',
                                stage.status === 'active' && 'bg-accent-blue text-white',
                                stage.status === 'pending' && 'bg-bg-3 text-text-3'
                              )}
                              style={{ width: `${widthPercent}%` }}
                            >
                              ${stage.cost.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Agent Contributions */}
              <div className="bg-bg-1 border border-border-1 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-bg-2 border-b border-border-1 flex items-center gap-2">
                  <Users className="w-4 h-4 text-text-3" />
                  <span className="text-xs font-semibold">Cost by Agent</span>
                </div>
                {taskV2.agents.map((taskAgent) => {
                  const agent = getAgentById(taskAgent.agentId);
                  if (!agent) return null;
                  const agentCost = taskAgent.contribution?.cost || 0;

                  return (
                    <div
                      key={taskAgent.agentId}
                      className="flex items-center justify-between px-4 py-3 text-xs border-b border-border-1 last:border-b-0 hover:bg-bg-2 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-6 h-6 rounded flex items-center justify-center text-xs"
                          style={{ backgroundColor: agent.color + '40' }}
                        >
                          {agent.emoji}
                        </div>
                        <span>{agent.name}</span>
                        <span className={clsx(
                          'text-[10px] px-1.5 py-0.5 rounded',
                          taskAgent.role === 'primary' && 'bg-accent-blue/20 text-accent-blue',
                          taskAgent.role === 'supporting' && 'bg-text-3/20 text-text-2'
                        )}>
                          {taskAgent.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-text-3">{taskAgent.contribution?.commits || 0} commits</span>
                        <span className="font-mono font-semibold text-accent-green">${agentCost.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Commit Cost Timeline */}
              <div className="bg-bg-1 border border-border-1 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-bg-2 border-b border-border-1 flex items-center gap-2">
                  <GitCommit className="w-4 h-4 text-text-3" />
                  <span className="text-xs font-semibold">Recent Commits ({taskV2.commits.length})</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {taskV2.commits.slice(0, 10).map((commit) => {
                    const agent = commit.agentId ? getAgentById(commit.agentId) : undefined;

                    return (
                      <div
                        key={commit.sha}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs border-b border-border-1 last:border-b-0 hover:bg-bg-2 transition-colors"
                      >
                        <span className="font-mono text-[10px] text-text-3 w-14">{commit.sha.slice(0, 7)}</span>
                        {agent && (
                          <span
                            className="w-5 h-5 rounded flex items-center justify-center text-[10px]"
                            style={{ backgroundColor: agent.color + '60' }}
                          >
                            {agent.emoji}
                          </span>
                        )}
                        <span className="flex-1 truncate text-text-1">{commit.message}</span>
                        <div className="flex items-center gap-3 text-[10px] text-text-3">
                          <span>{commit.filesChanged} files</span>
                          <span className="font-mono text-accent-green">${commit.cost.totalCost.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* V1: Traditional agent cost table */
            <div className="bg-bg-1 border border-border-1 rounded-lg overflow-hidden">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_100px] px-4 py-2.5 bg-bg-2 text-[10px] font-semibold uppercase tracking-wide text-text-3 border-b border-border-1">
                <span>Agent</span>
                <span>Input</span>
                <span>Output</span>
                <span>Tools</span>
                <span>Total</span>
                <span>Efficiency</span>
              </div>
              {agentCosts.map((cost) => {
                const agent = agents.find((a) => a.id === cost.agentId);
                return (
                  <div
                    key={cost.agentId}
                    className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_100px] px-4 py-3 text-xs items-center border-b border-border-1 last:border-b-0 hover:bg-bg-2 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center text-xs"
                        style={{ backgroundColor: agent?.color }}
                      >
                        {agent?.emoji}
                      </div>
                      <span>{agent?.name}</span>
                    </div>
                    <span className="font-mono text-text-2">${cost.inputCost.toFixed(2)}</span>
                    <span className="font-mono text-text-2">${cost.outputCost.toFixed(2)}</span>
                    <span className="font-mono text-text-2">${cost.toolCost.toFixed(2)}</span>
                    <span className="font-mono font-semibold">${cost.totalCost.toFixed(2)}</span>
                    <span
                      className={clsx(
                        'text-[10px] font-medium px-2 py-0.5 rounded-full w-fit',
                        cost.efficiency === 'excellent' && 'bg-accent-green/20 text-accent-green',
                        cost.efficiency === 'good' && 'bg-accent-blue/20 text-accent-blue',
                        cost.efficiency === 'fair' && 'bg-accent-amber/20 text-accent-amber',
                        cost.efficiency === 'poor' && 'bg-accent-red/20 text-accent-red'
                      )}
                    >
                      {cost.efficiency.charAt(0).toUpperCase() + cost.efficiency.slice(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="bg-bg-1 border-l border-border-1 flex flex-col">
        <div className="px-3.5 py-3 border-b border-border-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-text-2">
            Budget & Limits
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {budgets.map((budget) => (
            <BudgetCard key={budget.name} budget={budget} />
          ))}

          {/* Model pricing */}
          <div className="bg-bg-2 border border-border-1 rounded-md overflow-hidden">
            <div className="px-3.5 py-3 text-xs font-semibold border-b border-border-1">
              Model Pricing
            </div>
            {modelPricing.map((model) => (
              <div
                key={model.name}
                className="flex items-center justify-between px-3.5 py-2.5 text-[11px] border-b border-border-1 last:border-b-0"
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: model.color }}
                  />
                  {model.name}
                </span>
                <span className="flex gap-3 text-text-3 font-mono">
                  <span>${model.inputPer1M}/M in</span>
                  <span>${model.outputPer1M}/M out</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  valueColor,
  change,
  changeType,
}: {
  label: string;
  value: string;
  valueColor?: 'green' | 'amber' | 'red';
  change: string;
  changeType?: 'up' | 'down';
}) {
  return (
    <div className="bg-bg-2 border border-border-1 rounded-md p-3.5">
      <div className="text-[11px] text-text-3 mb-1">{label}</div>
      <div
        className={clsx(
          'text-2xl font-semibold font-mono',
          valueColor === 'green' && 'text-accent-green',
          valueColor === 'amber' && 'text-accent-amber',
          valueColor === 'red' && 'text-accent-red'
        )}
      >
        {value}
      </div>
      <div
        className={clsx(
          'text-[11px] mt-1',
          changeType === 'down' && 'text-accent-green',
          changeType === 'up' && 'text-accent-red',
          !changeType && 'text-text-3'
        )}
      >
        {change}
      </div>
    </div>
  );
}

function BudgetCard({ budget }: { budget: (typeof budgets)[0] }) {
  const percentage = (budget.current / budget.limit) * 100;
  const status = percentage < 50 ? 'safe' : percentage < 80 ? 'warn' : 'danger';

  return (
    <div className="bg-bg-2 border border-border-1 rounded-md p-3.5">
      <div className="flex justify-between mb-2.5">
        <span className="text-xs font-semibold">{budget.name}</span>
        <span className="text-[11px] text-text-2">
          ${budget.current.toFixed(2)} / ${budget.limit.toFixed(2)}
        </span>
      </div>
      <div className="h-2 bg-bg-3 rounded overflow-hidden mb-2">
        <div
          className={clsx(
            'h-full rounded transition-all',
            status === 'safe' && 'bg-accent-green',
            status === 'warn' && 'bg-accent-amber',
            status === 'danger' && 'bg-accent-red'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-[11px] text-text-3">
        <span>${(budget.limit - budget.current).toFixed(2)} remaining</span>
        {budget.resetIn && <span>Resets in {budget.resetIn}</span>}
        {budget.daysLeft && <span>{budget.daysLeft} days left</span>}
      </div>
    </div>
  );
}
