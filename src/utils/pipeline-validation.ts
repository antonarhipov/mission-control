import type { TeamPipelineStage } from '@/types';

/**
 * ValidationResult - Result of pipeline graph validation
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate pipeline graph structure
 * Checks for cycles, orphaned nodes, entry/exit points, and agent assignments
 * @param stages - Array of pipeline stages to validate
 * @returns Validation result with errors and warnings
 */
export function validatePipelineGraph(stages: TeamPipelineStage[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (stages.length === 0) {
    errors.push('Pipeline has no stages');
    return { isValid: false, errors, warnings };
  }

  // Build adjacency list
  const adjacency = new Map<string, string[]>();
  stages.forEach(stage => {
    adjacency.set(stage.id, stage.nextStageIds || []);
  });

  // Check 1: Detect cycles using DFS
  if (hasCycle(adjacency)) {
    errors.push('Pipeline has circular dependencies - stages form a cycle');
  }

  // Check 2: Find entry points (stages with no incoming edges)
  const hasIncoming = new Set<string>();
  adjacency.forEach(targets => {
    targets.forEach(t => hasIncoming.add(t));
  });

  const entryPoints = stages.filter(s => !hasIncoming.has(s.id));
  if (entryPoints.length === 0) {
    errors.push('Pipeline has no entry point - all stages have incoming connections');
  } else if (entryPoints.length > 3) {
    warnings.push(`Pipeline has ${entryPoints.length} entry points - consider reducing complexity`);
  }

  // Check 3: Find exit points (stages with no outgoing edges)
  const exitPoints = stages.filter(s => (s.nextStageIds || []).length === 0);
  if (exitPoints.length === 0) {
    errors.push('Pipeline has no exit point - all stages have outgoing connections');
  }

  // Check 4: Detect orphaned nodes (unreachable from any entry point)
  const reachable = findReachableNodes(adjacency, entryPoints.map(s => s.id));
  const orphaned = stages.filter(s => !reachable.has(s.id));
  if (orphaned.length > 0) {
    const orphanedNames = orphaned.map(s => `"${s.name}"`).join(', ');
    errors.push(`${orphaned.length} orphaned stage(s): ${orphanedNames}`);
  }

  // Check 5: Stages with no agents (warning)
  stages.forEach(stage => {
    if (stage.assignedAgentIds.length === 0) {
      warnings.push(`Stage "${stage.name}" has no agents assigned`);
    }
  });

  // Check 6: Validate conditional branches
  stages.forEach(stage => {
    if (stage.branchType === 'conditional') {
      if (!stage.condition) {
        errors.push(`Stage "${stage.name}" is marked as conditional but has no condition defined`);
      } else {
        const { onSuccess, onFailure } = stage.condition.branches;
        const nextIds = stage.nextStageIds || [];

        // Ensure conditional branches match nextStageIds
        const allBranches = [...onSuccess, ...onFailure];
        const missingInNext = allBranches.filter(id => !nextIds.includes(id));
        const extraInNext = nextIds.filter(id => !allBranches.includes(id));

        if (missingInNext.length > 0) {
          errors.push(`Stage "${stage.name}" has condition branches not in nextStageIds`);
        }
        if (extraInNext.length > 0) {
          warnings.push(`Stage "${stage.name}" has nextStageIds not in condition branches`);
        }

        if (onSuccess.length === 0 && onFailure.length === 0) {
          errors.push(`Stage "${stage.name}" conditional has no branches defined`);
        }
      }
    }
  });

  // Check 7: Validate nextStageIds references exist
  stages.forEach(stage => {
    const nextIds = stage.nextStageIds || [];
    nextIds.forEach(id => {
      if (!adjacency.has(id)) {
        errors.push(`Stage "${stage.name}" references non-existent stage ID: ${id}`);
      }
    });
  });

  return { isValid: errors.length === 0, errors, warnings };
}

/**
 * Detect cycles in directed graph using DFS
 * @param adjacency - Adjacency list representation of graph
 * @returns true if cycle exists, false otherwise
 */
function hasCycle(adjacency: Map<string, string[]>): boolean {
  const visited = new Set<string>();
  const recStack = new Set<string>();

  const dfs = (node: string): boolean => {
    visited.add(node);
    recStack.add(node);

    const neighbors = adjacency.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recStack.has(neighbor)) {
        return true; // Cycle detected - node is in recursion stack
      }
    }

    recStack.delete(node);
    return false;
  };

  // Check all nodes (handles disconnected graphs)
  for (const node of adjacency.keys()) {
    if (!visited.has(node)) {
      if (dfs(node)) return true;
    }
  }

  return false;
}

/**
 * Find all nodes reachable from start nodes using BFS
 * @param adjacency - Adjacency list representation of graph
 * @param startNodes - Array of starting node IDs
 * @returns Set of all reachable node IDs
 */
function findReachableNodes(
  adjacency: Map<string, string[]>,
  startNodes: string[]
): Set<string> {
  const reachable = new Set<string>();
  const queue = [...startNodes];

  while (queue.length > 0) {
    const node = queue.shift()!;
    if (reachable.has(node)) continue;

    reachable.add(node);
    const neighbors = adjacency.get(node) || [];
    queue.push(...neighbors);
  }

  return reachable;
}
