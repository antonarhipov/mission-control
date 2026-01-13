import type {
  Mission,
  Change,
  PlanV4,
  AcceptanceCriterionV4,
  SpecificationImpact,
  CriterionCostSummary,
} from '@/types';

// =============================================================================
// Cost Distribution Strategies
// =============================================================================

export type CostDistributionStrategy = 'equal' | 'proportional' | 'explicit';

/**
 * Distributes a change's cost across its acceptance criteria
 *
 * @param change - The change to distribute cost for
 * @param totalCost - Total cost of the change
 * @param strategy - Distribution strategy ('equal', 'proportional', 'explicit')
 * @returns Record mapping criterion ID to cost
 */
export function distributeCost(
  change: Change,
  totalCost: number,
  strategy: CostDistributionStrategy = 'equal'
): Record<string, number> {
  const criteriaIds = change.fulfillsAcceptanceCriteria || [];

  if (criteriaIds.length === 0) return {};

  switch (strategy) {
    case 'equal':
      // Split evenly among criteria
      const perCriterion = totalCost / criteriaIds.length;
      return Object.fromEntries(criteriaIds.map(id => [id, perCriterion]));

    case 'proportional':
      // Based on lines changed per criterion
      // For now, fallback to equal (would need line counts per criterion)
      return distributeCost(change, totalCost, 'equal');

    case 'explicit':
      // Use change.costByCriterion if provided
      return change.costByCriterion || {};
  }
}

/**
 * Aggregates costs across all changes to compute total per criterion
 *
 * @param mission - Mission to aggregate costs for
 * @returns Record mapping criterion ID to total cost
 */
export function aggregateCriterionCosts(
  mission: Mission
): Record<string, number> {
  const costMap: Record<string, number> = {};

  mission.execution?.changes.forEach(change => {
    // Use explicit cost distribution if available, otherwise use equal
    const distribution = change.costByCriterion ||
      distributeCost(change, change.cost || 0, 'equal');

    Object.entries(distribution).forEach(([criterionId, cost]) => {
      costMap[criterionId] = (costMap[criterionId] || 0) + cost;
    });
  });

  return costMap;
}

// =============================================================================
// Traceability Helpers
// =============================================================================

/**
 * Gets all changes that implement a specific acceptance criterion
 *
 * @param mission - Mission to search
 * @param criterionId - ID of the acceptance criterion
 * @returns Array of changes implementing this criterion
 */
export function getChangesForCriterion(
  mission: Mission,
  criterionId: string
): Change[] {
  return mission.execution?.changes.filter(change =>
    change.fulfillsAcceptanceCriteria?.includes(criterionId)
  ) || [];
}

/**
 * Gets all acceptance criteria fulfilled by a specific change
 *
 * @param mission - Mission to search
 * @param changeId - ID of the change
 * @returns Array of acceptance criteria fulfilled by this change
 */
export function getCriteriaForChange(
  mission: Mission,
  changeId: string
): AcceptanceCriterionV4[] {
  const change = mission.execution?.changes.find(c => c.id === changeId);
  if (!change?.fulfillsAcceptanceCriteria) return [];

  const plan = mission.plan as PlanV4;
  if (!plan?.acceptanceCriteria) return [];

  return plan.acceptanceCriteria.filter(ac =>
    change.fulfillsAcceptanceCriteria!.includes(ac.id)
  );
}

/**
 * Finds all changes that don't link to any acceptance criterion
 *
 * @param mission - Mission to search
 * @returns Array of orphaned changes
 */
export function findOrphanedChanges(mission: Mission): Change[] {
  return mission.execution?.changes.filter(change =>
    !change.fulfillsAcceptanceCriteria ||
    change.fulfillsAcceptanceCriteria.length === 0 ||
    change.isOrphan === true
  ) || [];
}

/**
 * Gets all acceptance criteria that are blocked by incomplete dependencies
 *
 * @param plan - Plan to analyze
 * @returns Array of blocked criterion IDs
 */
export function getBlockedCriteria(plan: PlanV4): string[] {
  return plan.acceptanceCriteria
    .filter(ac => {
      if (!ac.dependsOn || ac.dependsOn.length === 0) return false;

      // Check if any dependencies are incomplete
      return ac.dependsOn.some(depId => {
        const dep = plan.acceptanceCriteria.find(c => c.id === depId);
        return dep && !dep.completed;
      });
    })
    .map(ac => ac.id);
}

// =============================================================================
// Specification Impact Computation
// =============================================================================

/**
 * Computes full specification impact for a mission
 * Aggregates criteria completion, costs, and identifies orphaned changes
 *
 * @param mission - Mission to compute impact for
 * @returns SpecificationImpact object with aggregated metrics
 */
export function computeSpecificationImpact(
  mission: Mission
): SpecificationImpact {
  const plan = mission.plan as PlanV4;

  // Return empty impact if no plan or criteria
  if (!plan?.acceptanceCriteria) {
    return {
      totalCriteria: 0,
      completedCriteria: 0,
      verifiedCriteria: 0,
      totalCost: 0,
      costByCriterion: {},
      orphanedChanges: []
    };
  }

  const costMap = aggregateCriterionCosts(mission);
  const costByCriterion: Record<string, CriterionCostSummary> = {};
  const blockedCriteria = getBlockedCriteria(plan);

  plan.acceptanceCriteria.forEach(ac => {
    const changes = getChangesForCriterion(mission, ac.id);
    const commits = ac.implementedIn.commits;

    // Determine status
    let status: CriterionCostSummary['status'];
    if (blockedCriteria.includes(ac.id)) {
      status = 'blocked';
    } else if (ac.completed) {
      status = ac.verification.status === 'human-verified' ? 'verified' : 'completed';
    } else if (changes.length > 0 || ac.implementedIn.files.length > 0) {
      status = 'in-progress';
    } else {
      status = 'pending';
    }

    // Compute blocked by list
    const blockedBy = ac.dependsOn?.filter(depId => {
      const dep = plan.acceptanceCriteria.find(c => c.id === depId);
      return dep && !dep.completed;
    });

    costByCriterion[ac.id] = {
      criterionId: ac.id,
      description: ac.description,
      status,
      blockedBy,
      cost: costMap[ac.id] || 0,
      implementingAgents: [...new Set(changes.map(c => c.agentId))],
      implementingFiles: ac.implementedIn.files.map(f => f.path),
      implementingCommits: commits.map(c => c.sha)
    };
  });

  return {
    totalCriteria: plan.acceptanceCriteria.length,
    completedCriteria: plan.acceptanceCriteria.filter(ac => ac.completed).length,
    verifiedCriteria: plan.acceptanceCriteria.filter(ac =>
      ac.verification.status === 'human-verified'
    ).length,
    totalCost: Object.values(costMap).reduce((sum, cost) => sum + cost, 0),
    costByCriterion,
    orphanedChanges: findOrphanedChanges(mission)
  };
}

// =============================================================================
// Cost Aggregation Helpers
// =============================================================================

/**
 * Aggregates costs by agent across all criteria
 *
 * @param impact - Specification impact to analyze
 * @returns Record mapping agent ID to total cost
 */
export function aggregateCostsByAgent(
  impact: SpecificationImpact
): Record<string, number> {
  const costsByAgent: Record<string, number> = {};

  Object.values(impact.costByCriterion).forEach(criterion => {
    criterion.implementingAgents.forEach(agentId => {
      // Distribute criterion cost equally among implementing agents
      const agentCost = criterion.cost / criterion.implementingAgents.length;
      costsByAgent[agentId] = (costsByAgent[agentId] || 0) + agentCost;
    });
  });

  return costsByAgent;
}

/**
 * Gets completion percentage for specification
 *
 * @param impact - Specification impact to analyze
 * @returns Completion percentage (0-100)
 */
export function getCompletionPercentage(impact: SpecificationImpact): number {
  if (impact.totalCriteria === 0) return 0;
  return Math.round((impact.completedCriteria / impact.totalCriteria) * 100);
}

/**
 * Gets verification percentage for specification
 *
 * @param impact - Specification impact to analyze
 * @returns Verification percentage (0-100)
 */
export function getVerificationPercentage(impact: SpecificationImpact): number {
  if (impact.totalCriteria === 0) return 0;
  return Math.round((impact.verifiedCriteria / impact.totalCriteria) * 100);
}
