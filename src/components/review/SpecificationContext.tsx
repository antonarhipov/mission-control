import { AlertCircle } from 'lucide-react';
import { CriterionBadge } from './CriterionBadge';
import { useV4DataModel } from '@/hooks/useV4DataModel';
import type { Approval, PlanV4 } from '@/types';

interface SpecificationContextProps {
  approval: Approval;
  onNavigateToMission?: (missionId: string) => void;
  onNavigateToSpecImpact?: (missionId: string, criterionId: string) => void;
}

export function SpecificationContext({
  approval,
  onNavigateToMission,
  onNavigateToSpecImpact
}: SpecificationContextProps) {
  // Get mission and criteria data
  const { missions } = useV4DataModel();
  const mission = missions.find(m => m.id === approval.missionId);
  const plan = mission?.plan as PlanV4 | undefined;

  // Find criteria that this change implements
  const change = mission?.execution?.changes.find(c =>
    c.id === approval.changeId || c.path === approval.affectedFiles?.[0]
  );
  const implementedCriteria = change?.fulfillsAcceptanceCriteria || [];

  return (
    <div className="h-full overflow-y-auto bg-bg-1 border-l border-border-1">
      {/* Header */}
      <div className="p-4 border-b border-border-1">
        <h3 className="font-semibold text-text-1 mb-1">Specification Context</h3>
        <p className="text-xs text-text-3">
          Acceptance criteria implemented by this change
        </p>
      </div>

      {/* Mission Info */}
      {mission && (
        <div className="p-4 border-b border-border-1">
          <div className="text-xs text-text-3 mb-1">Mission</div>
          <div className="text-sm font-medium text-text-1">{mission.title}</div>
          <button
            onClick={() => onNavigateToMission?.(mission.id)}
            className="text-xs text-accent-blue hover:underline mt-1"
          >
            View Mission →
          </button>
        </div>
      )}

      {/* Implemented Criteria */}
      {implementedCriteria.length > 0 ? (
        <div className="p-4">
          <div className="text-xs font-semibold text-text-2 mb-3">
            Implements {implementedCriteria.length} Criteria
          </div>
          <div className="space-y-3">
            {implementedCriteria.map(criterionId => {
              const criterion = plan?.acceptanceCriteria.find(ac => ac.id === criterionId);
              if (!criterion) return null;

              const summary = mission.specificationImpact?.costByCriterion[criterionId];

              return (
                <div
                  key={criterionId}
                  className="bg-bg-0 rounded p-3 border border-border-1 hover:border-border-2 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs text-text-3 font-semibold">
                      [{criterion.id}]
                    </span>
                    <CriterionBadge status={summary?.status} />
                  </div>
                  <p className="text-xs text-text-2 leading-relaxed mb-2">
                    {criterion.description}
                  </p>

                  {/* Dependencies */}
                  {criterion.dependsOn && criterion.dependsOn.length > 0 && (
                    <div className="text-xs text-text-3 mb-2">
                      Depends on: <span className="font-mono">{criterion.dependsOn.join(', ')}</span>
                    </div>
                  )}

                  {/* Blocked By Warning */}
                  {summary?.blockedBy && summary.blockedBy.length > 0 && (
                    <div className="flex items-start gap-1.5 text-xs text-accent-amber bg-accent-amber/10 border border-accent-amber/20 rounded px-2 py-1.5 mb-2">
                      <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                      <span>Blocked by: {summary.blockedBy.join(', ')}</span>
                    </div>
                  )}

                  {/* Navigation */}
                  <button
                    onClick={() => onNavigateToSpecImpact?.(mission.id, criterion.id)}
                    className="text-xs text-accent-blue hover:underline"
                  >
                    View in Specification →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 text-center">
          <AlertCircle className="w-8 h-8 text-text-3 mx-auto mb-2" />
          <p className="text-sm text-text-3">
            No specification criteria linked to this change
          </p>
          <p className="text-xs text-text-3 mt-1">
            This may be technical debt or infrastructure work
          </p>
        </div>
      )}

      {/* Related Criteria (other criteria in same mission) */}
      {plan && implementedCriteria.length > 0 && (
        <div className="p-4 border-t border-border-1">
          <div className="text-xs font-semibold text-text-2 mb-2">
            Related Criteria
          </div>
          <div className="space-y-1">
            {plan.acceptanceCriteria
              .filter(ac => !implementedCriteria.includes(ac.id))
              .slice(0, 3)
              .map(criterion => (
                <div key={criterion.id} className="text-xs text-text-3 py-1">
                  <span className="font-mono">[{criterion.id}]</span> {criterion.description.slice(0, 60)}...
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
