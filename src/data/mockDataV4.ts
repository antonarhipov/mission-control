import type {
  Mission,
  PlanV4,
  AcceptanceCriterionV4,
  CommitReference,
  FileReference,
  SpecificationImpact,
  CriterionCostSummary,
  Change,
} from '@/types';
import { missions as v3Missions } from './mockDataV3';

// =============================================================================
// V4 MOCK DATA - Specification Traceability Layer
// =============================================================================
// Extends V3 missions with full specification traceability:
// - AcceptanceCriteria with cost attribution
// - Change → Criteria linking
// - Orphaned change detection
// - Criterion dependencies and blocking

// =============================================================================
// MISSION: AUTH-001 - User Authentication with Full Traceability
// =============================================================================

const authMissionV4Enhancements = {
  plan: {
    id: 'plan-auth-001',
    summary: 'Implement JWT-based authentication with Spring Security',
    rationale: 'Stateless authentication supports horizontal scaling and microservices architecture',
    alternatives: [
      {
        id: 'alt-1',
        title: 'Session-based authentication',
        description: 'Traditional session cookies with Redis backend',
        rejected: true,
        rejectionReason: 'Requires sticky sessions or shared session store, complicates horizontal scaling'
      },
      {
        id: 'alt-2',
        title: 'OAuth2/OIDC',
        description: 'Delegate to external identity provider',
        rejected: true,
        rejectionReason: 'Overkill for MVP, adds external dependency'
      }
    ],
    tasks: [
      {
        id: 'task-1',
        title: 'User entity and database schema',
        description: 'Create User entity with JPA, implement password hashing',
        status: 'completed',
        assignedAgentIds: ['impl-1'],
        estimatedCost: { min: 1.0, max: 2.0, expected: 1.5 }
      },
      {
        id: 'task-2',
        title: 'JWT token service',
        description: 'Token generation, validation, and refresh logic',
        status: 'completed',
        assignedAgentIds: ['impl-1'],
        estimatedCost: { min: 2.0, max: 3.5, expected: 2.5 }
      },
      {
        id: 'task-3',
        title: 'Authentication endpoints',
        description: 'Login, logout, token refresh REST APIs',
        status: 'in-progress',
        assignedAgentIds: ['impl-1'],
        estimatedCost: { min: 1.5, max: 2.5, expected: 2.0 }
      }
    ],
    risks: [
      {
        id: 'risk-1',
        description: 'Token expiration configuration mismatch',
        likelihood: 'medium',
        impact: 'low',
        mitigation: 'Comprehensive integration tests for token lifecycle'
      }
    ],
    estimate: {
      cost: { min: 4.5, max: 8.0, expected: 6.0 },
      time: { min: '2h', max: '4h', expected: '3h' }
    },
    repositories: ['repo-order-service'],
    status: 'approved',

    // V4 FIELDS
    acceptanceCriteria: [
      {
        id: 'AC-1',
        description: 'User entity persists to database with BCrypt password hashing',
        completed: true,
        completedAt: '2025-01-10T10:08:30Z',
        costAttribution: {
          totalCost: 2.15,
          byAgent: { 'impl-1': 1.85, 'architect-1': 0.30 },
          byStage: { 'stage-design': 0.30, 'stage-implementation': 1.85 }
        },
        implementedIn: {
          commits: [
            {
              sha: 'c1a2b3c',
              message: 'Add User entity with roles and credentials',
              agentId: 'impl-1',
              cost: 1.85,
              timestamp: '2025-01-10T10:08:30Z'
            }
          ],
          files: [
            {
              id: 'f-user-entity',
              path: 'src/main/java/com/auth/entity/User.java',
              filename: 'User.java',
              changeType: 'added',
              additions: 124,
              deletions: 0,
              rationale: 'Created User entity with JPA annotations, roles, and BCrypt password encoding per AC-1'
            }
          ],
          changesInReview: []
        },
        verification: {
          status: 'human-verified',
          verifiedBy: 'operator-1',
          verifiedAt: '2025-01-10T10:10:00Z',
          testResults: [
            {
              testId: 'test-user-persistence',
              name: 'UserEntityPersistenceTest',
              status: 'passed',
              runAt: '2025-01-10T10:10:15Z'
            }
          ]
        }
      },
      {
        id: 'AC-2',
        description: 'JWT tokens are generated with RS256 algorithm',
        completed: true,
        completedAt: '2025-01-10T10:12:00Z',
        dependsOn: ['AC-1'],
        costAttribution: {
          totalCost: 1.20,
          byAgent: { 'impl-1': 1.20 },
          byStage: { 'stage-implementation': 1.20 }
        },
        implementedIn: {
          commits: [
            {
              sha: 'd4e5f6g',
              message: 'Add JwtTokenService for token generation and validation',
              agentId: 'impl-1',
              cost: 1.20,
              timestamp: '2025-01-10T10:12:00Z'
            }
          ],
          files: [
            {
              id: 'f-jwt-service',
              path: 'src/main/java/com/auth/service/JwtTokenService.java',
              filename: 'JwtTokenService.java',
              changeType: 'added',
              additions: 87,
              deletions: 0,
              rationale: 'Implemented JWT token generation with RS256 signature algorithm per AC-2'
            }
          ],
          changesInReview: []
        },
        verification: {
          status: 'agent-verified',
          testResults: [
            {
              testId: 'test-jwt-generation',
              name: 'JwtTokenServiceTest',
              status: 'passed',
              runAt: '2025-01-10T10:13:00Z'
            }
          ]
        }
      },
      {
        id: 'AC-3',
        description: 'Login endpoint returns access token and refresh token',
        completed: false,
        assignedAgents: ['impl-1'],
        costAttribution: {
          totalCost: 0.85,
          byAgent: { 'impl-1': 0.85 },
          byStage: { 'stage-implementation': 0.85 }
        },
        implementedIn: {
          commits: [],
          files: [
            {
              id: 'f-auth-controller',
              path: 'src/main/java/com/auth/controller/AuthController.java',
              filename: 'AuthController.java',
              changeType: 'added',
              additions: 156,
              deletions: 0,
              rationale: 'Implementing login endpoint with token pair response per AC-3'
            }
          ],
          changesInReview: ['change-auth-103']
        },
        verification: {
          status: 'pending'
        }
      },
      {
        id: 'AC-4',
        description: 'Refresh token endpoint validates and issues new access token',
        completed: false,
        dependsOn: ['AC-3'],
        costAttribution: {
          totalCost: 0,
          byAgent: {},
          byStage: {}
        },
        implementedIn: {
          commits: [],
          files: [],
          changesInReview: []
        },
        verification: {
          status: 'pending'
        }
      },
      {
        id: 'AC-5',
        description: 'Spring Security filter chain validates JWT on protected endpoints',
        completed: false,
        dependsOn: ['AC-2'],
        costAttribution: {
          totalCost: 1.42,
          byAgent: { 'impl-1': 1.42 },
          byStage: { 'stage-implementation': 1.42 }
        },
        implementedIn: {
          commits: [
            {
              sha: 'l0m1n2o',
              message: 'Add SecurityConfig with JWT authentication filter',
              agentId: 'impl-1',
              cost: 1.42,
              timestamp: '2025-01-10T10:19:00Z'
            }
          ],
          files: [
            {
              id: 'f-security-config',
              path: 'src/main/java/com/auth/config/SecurityConfig.java',
              filename: 'SecurityConfig.java',
              changeType: 'added',
              additions: 92,
              deletions: 0,
              rationale: 'Configured Spring Security with JWT filter chain per AC-5'
            },
            {
              id: 'f-jwt-filter',
              path: 'src/main/java/com/auth/filter/JwtAuthenticationFilter.java',
              filename: 'JwtAuthenticationFilter.java',
              changeType: 'added',
              additions: 78,
              deletions: 0,
              rationale: 'Implemented JWT authentication filter for request interception per AC-5'
            }
          ],
          changesInReview: []
        },
        verification: {
          status: 'pending'
        }
      },
      {
        id: 'AC-6',
        description: 'Unauthorized requests return 401 with error details',
        completed: false,
        dependsOn: ['AC-5'],
        costAttribution: {
          totalCost: 0,
          byAgent: {},
          byStage: {}
        },
        implementedIn: {
          commits: [],
          files: [],
          changesInReview: []
        },
        verification: {
          status: 'pending'
        }
      },
      {
        id: 'AC-7',
        description: 'Password reset endpoint sends secure reset token via email',
        completed: false,
        costAttribution: {
          totalCost: 0,
          byAgent: {},
          byStage: {}
        },
        implementedIn: {
          commits: [],
          files: [],
          changesInReview: []
        },
        verification: {
          status: 'pending'
        }
      },
      {
        id: 'AC-8',
        description: 'User roles are encoded in JWT claims and enforced on endpoints',
        completed: false,
        dependsOn: ['AC-1', 'AC-2'],
        costAttribution: {
          totalCost: 0,
          byAgent: {},
          byStage: {}
        },
        implementedIn: {
          commits: [],
          files: [],
          changesInReview: []
        },
        verification: {
          status: 'pending'
        }
      }
    ],
    taskCriteriaMapping: [
      { taskId: 'task-1', criteriaIds: ['AC-1'] },
      { taskId: 'task-2', criteriaIds: ['AC-2', 'AC-4'] },
      { taskId: 'task-3', criteriaIds: ['AC-3', 'AC-5', 'AC-6', 'AC-7', 'AC-8'] }
    ],
    specificationStatus: 'approved' as const,
    approvedAt: '2025-01-10T10:04:00Z',
    approvedBy: 'operator-1'
  } as PlanV4,

  execution: {
    startedAt: '2025-01-10T10:07:00Z',
    currentTask: 'task-3',
    completedTasks: ['task-1', 'task-2'],
    changes: [
      {
        id: 'change-auth-101',
        taskId: 'task-1',
        agentId: 'impl-1',
        type: 'file' as const,
        repository: 'repo-order-service',
        path: 'src/main/java/com/auth/entity/User.java',
        changeType: 'added' as const,
        additions: 124,
        deletions: 0,
        diff: '// Diff content here',
        reasoning: 'Created User entity with JPA annotations for database persistence',
        status: 'approved' as const,
        commitSha: 'c1a2b3c',
        timestamp: '2025-01-10T10:08:30Z',
        fulfillsAcceptanceCriteria: ['AC-1'],
        specRationale: 'Implements User entity with BCrypt password hashing as required by AC-1',
        costByCriterion: { 'AC-1': 1.85 },
        isOrphan: false
      },
      {
        id: 'change-auth-102',
        taskId: 'task-2',
        agentId: 'impl-1',
        type: 'file' as const,
        repository: 'repo-order-service',
        path: 'src/main/java/com/auth/service/JwtTokenService.java',
        changeType: 'added' as const,
        additions: 87,
        deletions: 0,
        diff: '// Diff content here',
        reasoning: 'Implemented JWT token generation and validation service',
        status: 'approved' as const,
        commitSha: 'd4e5f6g',
        timestamp: '2025-01-10T10:12:00Z',
        fulfillsAcceptanceCriteria: ['AC-2'],
        specRationale: 'Implements RS256 JWT token generation as required by AC-2',
        costByCriterion: { 'AC-2': 1.20 },
        isOrphan: false
      },
      {
        id: 'change-auth-103',
        taskId: 'task-3',
        agentId: 'impl-1',
        type: 'file' as const,
        repository: 'repo-order-service',
        path: 'src/main/java/com/auth/controller/AuthController.java',
        changeType: 'added' as const,
        additions: 156,
        deletions: 0,
        diff: '// Diff content here',
        reasoning: 'Implemented authentication REST endpoints',
        status: 'pending-review' as const,
        timestamp: '2025-01-10T10:15:45Z',
        fulfillsAcceptanceCriteria: ['AC-3'],
        specRationale: 'Implements login endpoint returning access and refresh tokens per AC-3',
        costByCriterion: { 'AC-3': 0.85 },
        isOrphan: false
      },
      {
        id: 'change-auth-104',
        taskId: 'task-3',
        agentId: 'impl-1',
        type: 'file' as const,
        repository: 'repo-order-service',
        path: 'src/main/java/com/auth/config/SecurityConfig.java',
        changeType: 'added' as const,
        additions: 92,
        deletions: 0,
        diff: '// Diff content here',
        reasoning: 'Configured Spring Security with JWT authentication',
        status: 'approved' as const,
        commitSha: 'l0m1n2o',
        timestamp: '2025-01-10T10:19:00Z',
        fulfillsAcceptanceCriteria: ['AC-5'],
        specRationale: 'Implements Spring Security filter chain for JWT validation per AC-5',
        costByCriterion: { 'AC-5': 0.71 },
        isOrphan: false
      },
      {
        id: 'change-auth-105',
        taskId: 'task-3',
        agentId: 'impl-1',
        type: 'file' as const,
        repository: 'repo-order-service',
        path: 'src/main/java/com/auth/filter/JwtAuthenticationFilter.java',
        changeType: 'added' as const,
        additions: 78,
        deletions: 0,
        diff: '// Diff content here',
        reasoning: 'Implemented JWT request filter for token extraction and validation',
        status: 'approved' as const,
        commitSha: 'l0m1n2o',
        timestamp: '2025-01-10T10:19:00Z',
        fulfillsAcceptanceCriteria: ['AC-5'],
        specRationale: 'Implements JWT filter for request interception per AC-5',
        costByCriterion: { 'AC-5': 0.71 },
        isOrphan: false
      },
      {
        id: 'change-auth-orphan-1',
        taskId: 'task-2',
        agentId: 'impl-1',
        type: 'file' as const,
        repository: 'repo-order-service',
        path: 'src/main/java/com/auth/util/DateUtils.java',
        changeType: 'added' as const,
        additions: 42,
        deletions: 0,
        diff: '// Diff content here',
        reasoning: 'Added date utility for token expiration calculations',
        status: 'approved' as const,
        commitSha: 'd4e5f6g',
        timestamp: '2025-01-10T10:11:00Z',
        isOrphan: true,
        orphanResolution: undefined
      }
    ]
  },

  // V4 COMPUTED IMPACT
  specificationImpact: {
    totalCriteria: 8,
    completedCriteria: 2,
    verifiedCriteria: 1,
    totalCost: 5.62,
    costByCriterion: {
      'AC-1': {
        criterionId: 'AC-1',
        description: 'User entity persists to database with BCrypt password hashing',
        status: 'verified' as const,
        cost: 2.15,
        implementingAgents: ['impl-1', 'architect-1'],
        implementingFiles: ['src/main/java/com/auth/entity/User.java'],
        implementingCommits: ['c1a2b3c']
      },
      'AC-2': {
        criterionId: 'AC-2',
        description: 'JWT tokens are generated with RS256 algorithm',
        status: 'completed' as const,
        cost: 1.20,
        implementingAgents: ['impl-1'],
        implementingFiles: ['src/main/java/com/auth/service/JwtTokenService.java'],
        implementingCommits: ['d4e5f6g']
      },
      'AC-3': {
        criterionId: 'AC-3',
        description: 'Login endpoint returns access token and refresh token',
        status: 'in-progress' as const,
        blockedBy: [],
        cost: 0.85,
        implementingAgents: ['impl-1'],
        implementingFiles: ['src/main/java/com/auth/controller/AuthController.java'],
        implementingCommits: []
      },
      'AC-4': {
        criterionId: 'AC-4',
        description: 'Refresh token endpoint validates and issues new access token',
        status: 'blocked' as const,
        blockedBy: ['AC-3'],
        cost: 0,
        implementingAgents: [],
        implementingFiles: [],
        implementingCommits: []
      },
      'AC-5': {
        criterionId: 'AC-5',
        description: 'Spring Security filter chain validates JWT on protected endpoints',
        status: 'in-progress' as const,
        blockedBy: [],
        cost: 1.42,
        implementingAgents: ['impl-1'],
        implementingFiles: [
          'src/main/java/com/auth/config/SecurityConfig.java',
          'src/main/java/com/auth/filter/JwtAuthenticationFilter.java'
        ],
        implementingCommits: ['l0m1n2o']
      },
      'AC-6': {
        criterionId: 'AC-6',
        description: 'Unauthorized requests return 401 with error details',
        status: 'blocked' as const,
        blockedBy: ['AC-5'],
        cost: 0,
        implementingAgents: [],
        implementingFiles: [],
        implementingCommits: []
      },
      'AC-7': {
        criterionId: 'AC-7',
        description: 'Password reset endpoint sends secure reset token via email',
        status: 'pending' as const,
        cost: 0,
        implementingAgents: [],
        implementingFiles: [],
        implementingCommits: []
      },
      'AC-8': {
        criterionId: 'AC-8',
        description: 'User roles are encoded in JWT claims and enforced on endpoints',
        status: 'pending' as const,
        cost: 0,
        implementingAgents: [],
        implementingFiles: [],
        implementingCommits: []
      }
    },
    orphanedChanges: [
      {
        id: 'change-auth-orphan-1',
        taskId: 'task-2',
        agentId: 'impl-1',
        type: 'file' as const,
        repository: 'repo-order-service',
        path: 'src/main/java/com/auth/util/DateUtils.java',
        changeType: 'added' as const,
        additions: 42,
        deletions: 0,
        diff: '// Diff content here',
        reasoning: 'Added date utility for token expiration calculations',
        status: 'approved' as const,
        commitSha: 'd4e5f6g',
        timestamp: '2025-01-10T10:11:00Z',
        isOrphan: true,
        orphanResolution: undefined
      }
    ]
  }
};

// =============================================================================
// EXPORT V4-ENHANCED MISSIONS
// =============================================================================

export function getMissionsV4(): Mission[] {
  const missions = [...v3Missions];

  // Find and enhance auth mission
  const authMissionIndex = missions.findIndex(m => m.id === 'mission-auth-101');
  if (authMissionIndex !== -1) {
    missions[authMissionIndex] = {
      ...missions[authMissionIndex],
      plan: authMissionV4Enhancements.plan,
      execution: authMissionV4Enhancements.execution as any,
      specificationImpact: authMissionV4Enhancements.specificationImpact
    };
  }

  return missions;
}

// Export individual enhanced mission for testing
export const missionAuthV4 = authMissionV4Enhancements;
