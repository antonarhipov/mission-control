import {
  missions,
  observations,
  backgroundTasks,
  agents,
  repositories,
  teams,
  project,
  agentPersonas,
  agentMetrics,
  agentMemories,
  repositoryUnderstanding,
  getMissionById,
  getObservationsByAgentId,
  getUnacknowledgedObservations,
  getBackgroundTaskByMissionId,
  getAgentPersona,
  getAgentMetrics,
  getAgentMemory,
  getRepositoryUnderstanding,
} from '@/data/mockDataV3';

/**
 * V3 Data Model Hook
 *
 * Provides access to V3 mission-centric data with conversation, observations,
 * agent personas, metrics, and repository understanding.
 *
 * Usage:
 * ```typescript
 * const { missions, observations, agents, getMission } = useV3DataModel();
 * ```
 */
export function useV3DataModel() {
  return {
    // Core data
    missions,
    observations,
    backgroundTasks,
    agents,
    repositories,
    teams,
    project,

    // Agent enhancements
    agentPersonas,
    agentMetrics,
    agentMemories,

    // Repository understanding
    repositoryUnderstanding,

    // Helper functions
    getMissionById,
    getObservationsByAgentId,
    getUnacknowledgedObservations,
    getBackgroundTaskByMissionId,
    getAgentPersona,
    getAgentMetrics,
    getAgentMemory,
    getRepositoryUnderstanding,

    // Stats
    totalMissions: missions.length,
    activeMissions: missions.filter(m => m.status !== 'complete').length,
    completedMissions: missions.filter(m => m.status === 'complete').length,
    totalObservations: observations.length,
    unacknowledgedObservations: getUnacknowledgedObservations().length,
    backgroundTasksCount: backgroundTasks.length,
  };
}

/**
 * Get missions by status
 */
export function getMissionsByStatus(status: string) {
  return missions.filter(m => m.status === status);
}

/**
 * Get active (non-complete) missions
 */
export function getActiveMissions() {
  return missions.filter(m => m.status !== 'complete');
}

/**
 * Get missions requiring review
 */
export function getMissionsAwaitingReview() {
  return missions.filter(m => m.status === 'planning');
}

/**
 * Get missions by agent ID
 */
export function getMissionsByAgentId(agentId: string) {
  return missions.filter(m =>
    m.agents.some(a => a.agentId === agentId)
  );
}

/**
 * Get total cost across all missions
 */
export function getTotalCost() {
  return missions.reduce((sum, m) => sum + m.cost, 0);
}

/**
 * Get average cost per mission
 */
export function getAverageCostPerMission() {
  if (missions.length === 0) return 0;
  return getTotalCost() / missions.length;
}
