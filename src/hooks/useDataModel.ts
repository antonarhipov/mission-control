import * as mockDataV2 from '@/data/mockDataV2';
import type { Worktree } from '@/types';

/**
 * Hook to access V2 (task-centric) data model
 * Always returns V2 data - V1 mode has been removed
 */
export function useDataModel() {
  // Always use V2 data model
  return {
    isV2: true,

    // V2 entities
    tasks: mockDataV2.tasksV2,
    repositories: mockDataV2.repositories,
    project: mockDataV2.project,

    // V1 entities (empty - no longer supported)
    worktrees: [] as Worktree[],

    // Shared entities
    teams: mockDataV2.teams,
    agents: mockDataV2.agents,
    agentCosts: mockDataV2.agentCosts,
    budgets: mockDataV2.budgets,
    modelPricing: mockDataV2.modelPricing,
    defaultAgentConfig: mockDataV2.defaultAgentConfig,
    sessionStats: mockDataV2.sessionStats,

    // Helper functions
    getTaskById: mockDataV2.getTaskByIdV2,
    getRepositoryById: mockDataV2.getRepositoryById,
    getAgentById: mockDataV2.getAgentByIdV2,
    getTeamById: mockDataV2.getTeamByIdV2,
  };
}

// Type for the return value
export type DataModel = ReturnType<typeof useDataModel>;
