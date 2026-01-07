import type { TaskV2 } from '@/types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface DependencyNode {
  taskId: string;
  dependsOn: string[];
  blocks: string[];
  duration: number;
  earliestStart: number;
  earliestFinish: number;
  latestStart: number;
  latestFinish: number;
  slack: number;
}

export interface CriticalPathResult {
  path: string[];
  totalDuration: number;
  nodes: Map<string, DependencyNode>;
}

export interface CircularDependencyError {
  cycle: string[];
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: CircularDependencyError[];
  warnings: string[];
}

// ============================================================================
// DURATION CALCULATION
// ============================================================================

function parseTimestamp(timestamp: string): number {
  const now = Date.now();
  const match = timestamp.match(/(\d+)\s*(hour|day|min)s?\s*ago/i);

  if (!match) return now;

  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 'min': return now - (value * 60 * 1000);
    case 'hour': return now - (value * 60 * 60 * 1000);
    case 'day': return now - (value * 24 * 60 * 60 * 1000);
    default: return now;
  }
}

export function calculateTaskDuration(task: TaskV2): number {
  if (task.status === 'done' && task.startedAt && task.completedAt) {
    const start = parseTimestamp(task.startedAt);
    const end = parseTimestamp(task.completedAt);
    return Math.max(1, (end - start) / (1000 * 60 * 60));
  }

  if (task.status === 'in-progress' && task.startedAt) {
    const start = parseTimestamp(task.startedAt);
    const now = Date.now();
    const elapsed = (now - start) / (1000 * 60 * 60);

    if (task.progress > 0) {
      const projected = (elapsed / task.progress) * 100;
      return Math.max(elapsed, projected);
    }
    return elapsed + 8;
  }

  // Default estimates by priority
  switch (task.priority) {
    case 'critical': return 16;
    case 'high': return 12;
    case 'medium': return 8;
    case 'low': return 4;
    default: return 8;
  }
}

// ============================================================================
// GRAPH CONSTRUCTION
// ============================================================================

export function buildDependencyGraph(tasks: TaskV2[]): Map<string, string[]> {
  const graph = new Map<string, string[]>();

  tasks.forEach(task => {
    graph.set(task.id, task.dependsOn || []);
  });

  return graph;
}

// ============================================================================
// CIRCULAR DEPENDENCY DETECTION
// ============================================================================

export function detectCircularDependencies(
  graph: Map<string, string[]>
): CircularDependencyError[] {
  const errors: CircularDependencyError[] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const pathStack: string[] = [];

  function dfs(nodeId: string): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    pathStack.push(nodeId);

    const dependencies = graph.get(nodeId) || [];

    for (const depId of dependencies) {
      if (!visited.has(depId)) {
        if (dfs(depId)) return true;
      } else if (recursionStack.has(depId)) {
        const cycleStart = pathStack.indexOf(depId);
        const cycle = [...pathStack.slice(cycleStart), depId];
        errors.push({
          cycle,
          message: `Circular dependency detected: ${cycle.join(' → ')}`
        });
        return true;
      }
    }

    recursionStack.delete(nodeId);
    pathStack.pop();
    return false;
  }

  for (const nodeId of graph.keys()) {
    if (!visited.has(nodeId)) {
      dfs(nodeId);
    }
  }

  return errors;
}

// ============================================================================
// TOPOLOGICAL SORT
// ============================================================================

export function topologicalSort(graph: Map<string, string[]>): string[] | null {
  const inDegree = new Map<string, number>();
  const result: string[] = [];

  graph.forEach((_, nodeId) => inDegree.set(nodeId, 0));

  graph.forEach(deps => {
    deps.forEach(depId => {
      if (graph.has(depId)) {
        inDegree.set(depId, (inDegree.get(depId) || 0) + 1);
      }
    });
  });

  const queue: string[] = [];
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) queue.push(nodeId);
  });

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    result.push(nodeId);

    const deps = graph.get(nodeId) || [];
    deps.forEach(depId => {
      if (graph.has(depId)) {
        const newDegree = (inDegree.get(depId) || 0) - 1;
        inDegree.set(depId, newDegree);
        if (newDegree === 0) {
          queue.push(depId);
        }
      }
    });
  }

  return result.length === graph.size ? result : null;
}

// ============================================================================
// CRITICAL PATH METHOD
// ============================================================================

export function calculateCriticalPath(tasks: TaskV2[]): CriticalPathResult | null {
  const graph = buildDependencyGraph(tasks);

  const cycles = detectCircularDependencies(graph);
  if (cycles.length > 0) {
    console.error('Cannot calculate critical path: circular dependencies exist');
    return null;
  }

  const sorted = topologicalSort(graph);
  if (!sorted) return null;

  const nodes = new Map<string, DependencyNode>();
  tasks.forEach(task => {
    nodes.set(task.id, {
      taskId: task.id,
      dependsOn: task.dependsOn || [],
      blocks: task.blocks || [],
      duration: calculateTaskDuration(task),
      earliestStart: 0,
      earliestFinish: 0,
      latestStart: Infinity,
      latestFinish: Infinity,
      slack: 0,
    });
  });

  // FORWARD PASS
  sorted.forEach(taskId => {
    const node = nodes.get(taskId)!;

    if (node.dependsOn.length === 0) {
      node.earliestStart = 0;
    } else {
      node.earliestStart = Math.max(
        ...node.dependsOn.map(depId => {
          const dep = nodes.get(depId);
          return dep ? dep.earliestFinish : 0;
        })
      );
    }

    node.earliestFinish = node.earliestStart + node.duration;
  });

  const projectEndTime = Math.max(...Array.from(nodes.values()).map(n => n.earliestFinish));

  // BACKWARD PASS
  sorted.reverse().forEach(taskId => {
    const node = nodes.get(taskId)!;

    const dependents = tasks.filter(t => (t.dependsOn || []).includes(taskId));
    if (dependents.length === 0) {
      node.latestFinish = projectEndTime;
    } else {
      node.latestFinish = Math.min(
        ...dependents.map(dep => {
          const depNode = nodes.get(dep.id);
          return depNode ? depNode.latestStart : Infinity;
        })
      );
    }

    node.latestStart = node.latestFinish - node.duration;
    node.slack = node.latestStart - node.earliestStart;
  });

  const criticalTasks = Array.from(nodes.values())
    .filter(node => Math.abs(node.slack) < 0.01)
    .map(node => node.taskId);

  const criticalPath = sorted.filter(id => criticalTasks.includes(id));

  return {
    path: criticalPath,
    totalDuration: projectEndTime,
    nodes,
  };
}

// ============================================================================
// VALIDATION
// ============================================================================

export function validateDependencies(tasks: TaskV2[]): ValidationResult {
  const errors: CircularDependencyError[] = [];
  const warnings: string[] = [];

  const graph = buildDependencyGraph(tasks);
  const taskIds = new Set(tasks.map(t => t.id));

  const cycles = detectCircularDependencies(graph);
  errors.push(...cycles);

  tasks.forEach(task => {
    (task.dependsOn || []).forEach(depId => {
      if (!taskIds.has(depId)) {
        warnings.push(`Task ${task.id} depends on non-existent task ${depId}`);
      }
    });

    (task.blocks || []).forEach(blockId => {
      if (!taskIds.has(blockId)) {
        warnings.push(`Task ${task.id} blocks non-existent task ${blockId}`);
      }
    });
  });

  tasks.forEach(task => {
    (task.blocks || []).forEach(blockedId => {
      const blockedTask = tasks.find(t => t.id === blockedId);
      if (blockedTask && !(blockedTask.dependsOn || []).includes(task.id)) {
        warnings.push(
          `Inconsistent dependency: ${task.id} blocks ${blockedId}, ` +
          `but ${blockedId} doesn't depend on ${task.id}`
        );
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
