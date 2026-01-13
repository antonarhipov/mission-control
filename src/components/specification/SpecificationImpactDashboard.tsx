import { Target, DollarSign, CheckCircle2, AlertTriangle } from 'lucide-react';
import { CriterionCard } from './CriterionCard';
import { CriterionCostBreakdown } from './CriterionCostBreakdown';
import { OrphanedChangesAlert } from './OrphanedChangesAlert';
import { getCompletionPercentage, getVerificationPercentage } from '@/utils/costAttribution';
import type { Mission, PlanV4 } from '@/types';

interface SpecificationImpactDashboardProps {
  mission: Mission;
  onNavigateToReview?: (criterionId: string) => void;
  onNavigateToDiff?: (fileId: string) => void;
}

export function SpecificationImpactDashboard({
  mission,
  onNavigateToReview,
  onNavigateToDiff
}: SpecificationImpactDashboardProps) {
  const impact = mission.specificationImpact;
  const plan = mission.plan as PlanV4;

  // Empty state
  if (!impact || !plan?.acceptanceCriteria) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-text-3 mb-4" />
        <h3 className="text-lg font-semibold text-text-1 mb-2">
          No Specification Impact Data
        </h3>
        <p className="text-sm text-text-3 max-w-md">
          This mission doesn't have acceptance criteria defined yet.
          Specification traceability requires a plan with acceptance criteria.
        </p>
      </div>
    );
  }

  const completionPercentage = getCompletionPercentage(impact);
  const verificationPercentage = getVerificationPercentage(impact);

  // Handler for orphan resolution (placeholder)
  const handleOrphanResolve = (changeId: string, resolution: 'linked' | 'new-criterion' | 'tech-debt') => {
    console.log('Resolve orphan:', changeId, 'as', resolution);
    // TODO: Implement resolution logic
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Overall Progress Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-accent-blue" />
            <h3 className="text-lg font-semibold text-text-1">Overall Progress</h3>
          </div>

          <div className="bg-bg-1 rounded-lg p-4 border border-border-1 space-y-4">
            {/* Completion Progress */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-text-2">Criteria Completed</span>
                <span className="font-semibold text-text-1">
                  {impact.completedCriteria} / {impact.totalCriteria} ({completionPercentage}%)
                </span>
              </div>
              <div className="h-2 bg-bg-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-green rounded-full transition-all"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Verification Progress */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-text-2">Human Verified</span>
                <span className="font-semibold text-text-1">
                  {impact.verifiedCriteria} / {impact.totalCriteria} ({verificationPercentage}%)
                </span>
              </div>
              <div className="h-2 bg-bg-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-blue rounded-full transition-all"
                  style={{ width: `${verificationPercentage}%` }}
                />
              </div>
            </div>

            {/* Total Cost */}
            <div className="pt-3 border-t border-border-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-text-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Total Cost</span>
                </div>
                <span className="text-xl font-bold text-text-1">
                  ${impact.totalCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Orphaned Changes Alert */}
        {impact.orphanedChanges.length > 0 && (
          <section>
            <OrphanedChangesAlert
              changes={impact.orphanedChanges}
              onResolve={handleOrphanResolve}
            />
          </section>
        )}

        {/* By Acceptance Criterion */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-text-1">By Acceptance Criterion</h3>
            <span className="text-sm text-text-3">
              ({plan.acceptanceCriteria.length} total)
            </span>
          </div>

          <div className="space-y-3">
            {plan.acceptanceCriteria.map(criterion => {
              const summary = impact.costByCriterion[criterion.id];
              if (!summary) return null;

              return (
                <CriterionCard
                  key={criterion.id}
                  criterion={criterion}
                  summary={summary}
                  onNavigateToReview={() => onNavigateToReview?.(criterion.id)}
                  onNavigateToDiff={onNavigateToDiff}
                />
              );
            })}
          </div>
        </section>

        {/* Cost by Agent */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-accent-amber" />
            <h3 className="text-lg font-semibold text-text-1">Cost by Agent</h3>
          </div>

          <div className="bg-bg-1 rounded-lg p-4 border border-border-1">
            <CriterionCostBreakdown mission={mission} />
          </div>
        </section>
      </div>
    </div>
  );
}
