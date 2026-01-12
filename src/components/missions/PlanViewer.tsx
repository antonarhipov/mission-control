import { Circle, AlertTriangle, DollarSign, Clock, User } from 'lucide-react';
import type { Mission } from '@/types';
import { useV3DataModel } from '@/hooks/useV3DataModel';

interface PlanViewerProps {
  mission: Mission;
  onApprove?: (missionId: string) => void;
  onReject?: (missionId: string) => void;
}

export function PlanViewer({ mission, onApprove, onReject }: PlanViewerProps) {
  const { agents } = useV3DataModel();

  const plan = mission.plan;

  if (!plan) {
    return (
      <div className="flex items-center justify-center h-full text-text-3">
        <div className="text-center space-y-2">
          <p>No plan available</p>
          <p className="text-sm">This mission is still in intent phase</p>
        </div>
      </div>
    );
  }

  // Get task count
  const totalTasks = plan.tasks.length;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-text-1 mb-2">Plan Review</h2>
        <p className="text-sm text-text-3">
          Review the proposed approach and tasks for this mission
        </p>
      </div>

      {/* Summary */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">Summary</h3>
        <p className="text-sm text-text-1 leading-relaxed">{plan.summary}</p>
      </div>

      {/* Rationale */}
      {plan.rationale && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">Rationale</h3>
          <p className="text-sm text-text-2 leading-relaxed">{plan.rationale}</p>
        </div>
      )}

      {/* Tasks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">Tasks</h3>
          <span className="text-xs text-text-3">
            {totalTasks} total
          </span>
        </div>

        <div className="space-y-2">
          {plan.tasks.map((task) => {
            const agent = task.assignedAgent ? agents.find(a => a.id === task.assignedAgent) : null;

            return (
              <div
                key={task.id}
                className="p-3 rounded-lg border bg-bg-1 border-border-1"
              >
                <div className="flex items-start gap-3">
                  {/* Status Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    <Circle className="w-5 h-5 text-text-3" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-medium text-text-1">{task.title}</div>
                        {task.description && (
                          <p className="text-xs text-text-3 mt-0.5">{task.description}</p>
                        )}
                      </div>
                      {task.estimate && (
                        <div className="flex items-center gap-2 text-xs text-text-3 flex-shrink-0">
                          <div className="flex items-center gap-0.5" title="Estimated cost">
                            <DollarSign className="w-3 h-3" />
                            <span>${task.estimate.cost.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-0.5" title="Estimated time">
                            <Clock className="w-3 h-3" />
                            <span>{task.estimate.time}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-xs">
                      {/* Agent */}
                      {agent && (
                        <div className="flex items-center gap-1 text-text-3">
                          <User className="w-3 h-3" />
                          <span>{agent.emoji} {agent.name}</span>
                        </div>
                      )}

                      {/* Role */}
                      {task.suggestedRole && !agent && (
                        <div className="flex items-center gap-1 text-text-3">
                          <User className="w-3 h-3" />
                          <span className="capitalize">{task.suggestedRole}</span>
                        </div>
                      )}

                      {/* Dependencies */}
                      {task.dependsOn && task.dependsOn.length > 0 && (
                        <span className="text-text-3">
                          Depends on: {task.dependsOn.join(', ')}
                        </span>
                      )}

                      {/* Parallelizable */}
                      {task.parallelizable && (
                        <span className="text-accent-blue">Can run in parallel</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risks */}
      {plan.risks && plan.risks.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">Risks</h3>
          <div className="space-y-2">
            {plan.risks.map((risk, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-accent-amber/5 border border-accent-amber/30 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-accent-amber flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-1">{risk.description}</div>
                  {risk.mitigation && (
                    <div className="text-xs text-text-3 mt-1">
                      <span className="font-medium">Mitigation:</span> {risk.mitigation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estimate */}
      {plan.estimate && (
        <div className="p-4 bg-bg-1 border border-border-1 rounded-lg">
          <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide mb-3">Estimate</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-text-3 mb-1">Cost Range</div>
              <div className="text-sm text-text-1">
                ${plan.estimate.cost.min.toFixed(2)} - ${plan.estimate.cost.max.toFixed(2)}
                <span className="text-text-3 ml-1">(~${plan.estimate.cost.expected.toFixed(2)})</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-text-3 mb-1">Time Range</div>
              <div className="text-sm text-text-1">
                {plan.estimate.time.min} - {plan.estimate.time.max}
                <span className="text-text-3 ml-1">(~{plan.estimate.time.expected})</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Actions */}
      {mission.status === 'planning' && mission.plan && onApprove && onReject && (
        <div className="flex items-center gap-3 pt-4 border-t border-border-1">
          <button
            onClick={() => onApprove(mission.id)}
            className="flex-1 px-4 py-2 bg-accent-green hover:bg-accent-green/80 text-white rounded-lg font-medium transition-colors"
          >
            Approve Plan
          </button>
          <button
            onClick={() => onReject(mission.id)}
            className="flex-1 px-4 py-2 bg-bg-2 hover:bg-bg-3 text-text-1 border border-border-1 rounded-lg font-medium transition-colors"
          >
            Request Changes
          </button>
        </div>
      )}
    </div>
  );
}
