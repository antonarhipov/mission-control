import type {
  Mission,
  Observation,
  BackgroundTask,
  AgentPersona,
  AgentMetrics,
  AgentMemory,
  RepositoryUnderstanding,
  Agent,
  Repository,
  Team,
  Project,
  PipelineConfiguration,
} from '@/types';

// =============================================================================
// V3 MOCK DATA - Multi-Agent Era Architecture
// =============================================================================
// Comprehensive mock data for V3 workspaces with full conversation histories,
// agent observations, personas, metrics, and repository understanding.

// =============================================================================
// REPOSITORIES (Reuse from V2 but enhance with understanding)
// =============================================================================

export const repositories: Repository[] = [
  {
    id: 'repo-api-gateway',
    name: 'api-gateway',
    path: '/workspace/api-gateway',
    remoteUrl: 'github.com/acme/api-gateway',
    defaultBranch: 'main',
    status: 'connected',
    lastSynced: '2 minutes ago',
  },
  {
    id: 'repo-order-service',
    name: 'order-service',
    path: '/workspace/order-service',
    remoteUrl: 'github.com/acme/order-service',
    defaultBranch: 'main',
    status: 'connected',
    lastSynced: '5 minutes ago',
  },
  {
    id: 'repo-frontend',
    name: 'frontend',
    path: '/workspace/frontend',
    remoteUrl: 'github.com/acme/frontend',
    defaultBranch: 'main',
    status: 'connected',
    lastSynced: '3 minutes ago',
  },
  {
    id: 'repo-shared-types',
    name: 'shared-types',
    path: '/workspace/shared-types',
    remoteUrl: 'github.com/acme/shared-types',
    defaultBranch: 'main',
    status: 'connected',
    lastSynced: '10 minutes ago',
  },
];

// =============================================================================
// REPOSITORY UNDERSTANDING - Agent knowledge of codebases
// =============================================================================

export const repositoryUnderstanding: Record<string, RepositoryUnderstanding> = {
  'repo-api-gateway': {
    summary: 'Spring Boot 3.2 microservice providing REST APIs for order management. Uses PostgreSQL for persistence, Flyway for migrations, and MapStruct for DTO mapping. Follows hexagonal architecture with clear separation between controller, service, and repository layers.',
    patterns: [
      'Controller-Service-Repository architecture',
      'DTO mapping with MapStruct',
      'Constructor injection over @Autowired',
      'Flyway migrations for schema changes',
      'API versioning in URL (/api/v1/...)',
      'Global exception handling with @ControllerAdvice',
    ],
    architecture: {
      type: 'microservices',
      layers: ['controller', 'service', 'repository', 'dto'],
      keyComponents: ['OrderController', 'OrderService', 'OrderRepository', 'SecurityConfig'],
    },
    conventions: [
      {
        category: 'dependency-injection',
        description: 'Use constructor injection, not @Autowired field injection',
        example: 'public OrderService(OrderRepository orderRepo, CustomerService customerService) {...}',
      },
      {
        category: 'dto',
        description: 'DTOs go in .dto package with Request/Response suffix',
        example: 'CreateOrderRequest, OrderResponse',
      },
      {
        category: 'entity',
        description: 'All entities extend BaseAuditEntity for created/updated timestamps',
      },
      {
        category: 'testing',
        description: 'Integration tests use Testcontainers for database',
      },
    ],
    analyzedAt: '2025-01-10T08:00:00Z',
    confidence: 94,
  },
  'repo-frontend': {
    summary: 'React 18 application with TypeScript, using Vite for bundling. State management with Zustand, routing with React Router v6. Component library based on Tailwind CSS with custom design system. API communication via React Query.',
    patterns: [
      'Functional components with hooks',
      'Custom hooks for shared logic',
      'Zustand stores for global state',
      'React Query for server state',
      'Tailwind CSS utility classes',
      'Path aliases (@/components, @/hooks)',
    ],
    architecture: {
      type: 'spa',
      layers: ['pages', 'components', 'hooks', 'stores', 'services'],
      keyComponents: ['OrderPage', 'useOrders hook', 'orderStore', 'orderService'],
    },
    conventions: [
      {
        category: 'components',
        description: 'Use named exports, not default exports',
        example: 'export function OrderCard() {...}',
      },
      {
        category: 'hooks',
        description: 'Custom hooks start with "use" prefix',
        example: 'useOrdersQuery, useAuth',
      },
      {
        category: 'styling',
        description: 'Use Tailwind classes, avoid inline styles',
      },
    ],
    analyzedAt: '2025-01-10T08:15:00Z',
    confidence: 91,
  },
};

// =============================================================================
// PIPELINE CONFIGURATION - Default team pipeline
// =============================================================================

// Default pipeline configuration used by most teams
export const defaultPipeline: PipelineConfiguration = {
  id: 'pipeline-default',
  name: 'Standard Development Pipeline',
  description: 'Industry-standard software development workflow',
  stages: [
    {
      id: 'stage-design',
      name: 'Design',
      description: 'Architecture design and technical planning',
      assignedAgentIds: ['arch-1'], // Atlas (Architect)
      order: 0,
      color: '#388bfd',
      requiredForCompletion: true,
      estimatedDuration: '2-4 hours',
    },
    {
      id: 'stage-implementation',
      name: 'Implementation',
      description: 'Code development and integration',
      assignedAgentIds: ['impl-1', 'impl-2'], // Nova and Pixel (Implementers)
      order: 1,
      color: '#39d353',
      requiredForCompletion: true,
      estimatedDuration: '1-2 days',
    },
    {
      id: 'stage-testing',
      name: 'Testing',
      description: 'Unit, integration, and E2E testing',
      assignedAgentIds: ['test-1'], // Sentinel (Tester)
      order: 2,
      color: '#ffbd2e',
      requiredForCompletion: true,
      estimatedDuration: '4-8 hours',
    },
    {
      id: 'stage-review',
      name: 'Code Review',
      description: 'Peer review and quality assurance',
      assignedAgentIds: ['rev-1'], // Sage (Reviewer)
      order: 3,
      color: '#ff6b6b',
      requiredForCompletion: true,
      estimatedDuration: '1-2 hours',
    },
    {
      id: 'stage-documentation',
      name: 'Documentation',
      description: 'API docs, README updates, and guides',
      assignedAgentIds: ['docs-1'], // Scribe (Docs)
      order: 4,
      color: '#a78bfa',
      requiredForCompletion: false, // Optional stage
      estimatedDuration: '1-2 hours',
    },
  ],
  createdAt: '2024-01-01T00:00:00Z',
};

// =============================================================================
// TEAMS
// =============================================================================

export const teams: Team[] = [
  // Example 1: Simple Linear Pipeline (2 stages)
  {
    id: 'team-docs',
    name: 'Docs Squad',
    description: 'Documentation and content team',
    color: '#a78bfa',
    agentIds: ['docs-1', 'rev-1'],
    pipeline: {
      id: 'pipeline-docs',
      name: 'Documentation Pipeline',
      description: 'Simple linear workflow for docs',
      stages: [
        {
          id: 'stage-write',
          name: 'Write Content',
          description: 'Create or update documentation',
          assignedAgentIds: ['docs-1'],
          order: 0,
          nextStageIds: ['stage-review'],
          position: { x: 400, y: 100 },
          branchType: 'sequential',
          color: '#a78bfa',
          requiredForCompletion: true,
          estimatedDuration: '2-3 hours',
        },
        {
          id: 'stage-review',
          name: 'Review & Publish',
          description: 'Review content and publish',
          assignedAgentIds: ['rev-1'],
          order: 1,
          nextStageIds: [],
          position: { x: 400, y: 240 },
          branchType: 'sequential',
          color: '#ff6b6b',
          requiredForCompletion: true,
          estimatedDuration: '1 hour',
        },
      ],
      entryStageIds: ['stage-write'],
      isValid: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
  },

  // Example 2: Complex Parallel Pipeline (6 stages with branching)
  {
    id: 'team-fullstack',
    name: 'Full Stack Squad',
    description: 'End-to-end feature development with parallel streams',
    color: '#10b981',
    agentIds: ['impl-1', 'impl-2', 'arch-1', 'test-1', 'rev-1', 'docs-1'],
    pipeline: {
      id: 'pipeline-fullstack',
      name: 'Parallel Development Pipeline',
      description: 'Branching workflow with parallel backend/frontend/docs',
      stages: [
        {
          id: 'stage-design',
          name: 'Architecture Design',
          description: 'System design and API contracts',
          assignedAgentIds: ['arch-1'],
          order: 0,
          nextStageIds: ['stage-backend', 'stage-frontend', 'stage-docs'],
          position: { x: 400, y: 50 },
          branchType: 'parallel',
          color: '#388bfd',
          requiredForCompletion: true,
          estimatedDuration: '3-4 hours',
        },
        {
          id: 'stage-backend',
          name: 'Backend API',
          description: 'Build REST endpoints and business logic',
          assignedAgentIds: ['impl-1'],
          order: 1,
          nextStageIds: ['stage-integration'],
          position: { x: 200, y: 200 },
          branchType: 'sequential',
          color: '#39d353',
          requiredForCompletion: true,
          estimatedDuration: '1-2 days',
        },
        {
          id: 'stage-frontend',
          name: 'Frontend UI',
          description: 'Build React components and UI',
          assignedAgentIds: ['impl-2'],
          order: 2,
          nextStageIds: ['stage-integration'],
          position: { x: 400, y: 200 },
          branchType: 'sequential',
          color: '#39d353',
          requiredForCompletion: true,
          estimatedDuration: '1-2 days',
        },
        {
          id: 'stage-docs',
          name: 'Documentation',
          description: 'API docs and user guides',
          assignedAgentIds: ['docs-1'],
          order: 3,
          nextStageIds: ['stage-integration'],
          position: { x: 600, y: 200 },
          branchType: 'sequential',
          color: '#a78bfa',
          requiredForCompletion: false,
          estimatedDuration: '4-6 hours',
        },
        {
          id: 'stage-integration',
          name: 'Integration Testing',
          description: 'Test end-to-end workflows',
          assignedAgentIds: ['test-1'],
          order: 4,
          nextStageIds: ['stage-review'],
          position: { x: 400, y: 350 },
          branchType: 'sequential',
          color: '#ffbd2e',
          requiredForCompletion: true,
          estimatedDuration: '4-8 hours',
        },
        {
          id: 'stage-review',
          name: 'Final Review',
          description: 'Code review and quality check',
          assignedAgentIds: ['rev-1'],
          order: 5,
          nextStageIds: [],
          position: { x: 400, y: 500 },
          branchType: 'sequential',
          color: '#ff6b6b',
          requiredForCompletion: true,
          estimatedDuration: '1-2 hours',
        },
      ],
      entryStageIds: ['stage-design'],
      isValid: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
  },

  // Example 3: Conditional Pipeline (4 stages with loop)
  {
    id: 'team-ml',
    name: 'ML Research Squad',
    description: 'Machine learning model training and deployment',
    color: '#06b6d4',
    agentIds: ['impl-1', 'test-1', 'arch-1'],
    pipeline: {
      id: 'pipeline-ml',
      name: 'ML Training Pipeline',
      description: 'Conditional workflow with model evaluation branching',
      stages: [
        {
          id: 'stage-train',
          name: 'Train Model',
          description: 'Train ML model with datasets',
          assignedAgentIds: ['impl-1'],
          order: 0,
          nextStageIds: ['stage-eval'],
          position: { x: 400, y: 50 },
          branchType: 'sequential',
          color: '#39d353',
          requiredForCompletion: true,
          estimatedDuration: '1-3 days',
        },
        {
          id: 'stage-eval',
          name: 'Evaluate Performance',
          description: 'Test model accuracy and metrics',
          assignedAgentIds: ['test-1'],
          order: 1,
          nextStageIds: ['stage-deploy', 'stage-retrain'],
          position: { x: 400, y: 200 },
          branchType: 'conditional',
          condition: {
            type: 'test-passed',
            branches: {
              onSuccess: ['stage-deploy'],
              onFailure: ['stage-retrain'],
            },
          },
          color: '#ffbd2e',
          requiredForCompletion: true,
          estimatedDuration: '2-4 hours',
        },
        {
          id: 'stage-deploy',
          name: 'Deploy to Production',
          description: 'Deploy model to production',
          assignedAgentIds: ['arch-1'],
          order: 2,
          nextStageIds: [],
          position: { x: 600, y: 350 },
          branchType: 'sequential',
          color: '#10b981',
          requiredForCompletion: true,
          estimatedDuration: '1-2 hours',
        },
        {
          id: 'stage-retrain',
          name: 'Retrain with Adjustments',
          description: 'Adjust hyperparameters and retrain',
          assignedAgentIds: ['impl-1'],
          order: 3,
          nextStageIds: ['stage-eval'],
          position: { x: 200, y: 350 },
          branchType: 'sequential',
          color: '#ff6b6b',
          requiredForCompletion: true,
          estimatedDuration: '1 day',
        },
      ],
      entryStageIds: ['stage-train'],
      isValid: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
  },

  // Legacy teams without pipelines (users can create from scratch)
  {
    id: 'team-backend',
    name: 'Backend Squad',
    description: 'Backend service development',
    color: '#388bfd',
    agentIds: ['impl-1', 'arch-1', 'test-1', 'rev-1'],
    pipeline: {
      id: 'pipeline-backend',
      name: 'Backend Development Pipeline',
      description: 'Standard backend service development workflow',
      stages: [
        {
          id: 'stage-design',
          name: 'Design',
          description: 'Create technical design and architecture',
          assignedAgentIds: ['arch-1'],
          order: 0,
          nextStageIds: ['stage-implementation'],
          position: { x: 400, y: 100 },
          branchType: 'sequential',
          color: '#a78bfa',
          requiredForCompletion: true,
          estimatedDuration: '2-4 hours',
        },
        {
          id: 'stage-implementation',
          name: 'Implementation',
          description: 'Implement features and write code',
          assignedAgentIds: ['impl-1'],
          order: 1,
          nextStageIds: ['stage-testing'],
          position: { x: 400, y: 240 },
          branchType: 'sequential',
          color: '#3b82f6',
          requiredForCompletion: true,
          estimatedDuration: '4-8 hours',
        },
        {
          id: 'stage-testing',
          name: 'Testing',
          description: 'Write and run tests',
          assignedAgentIds: ['test-1'],
          order: 2,
          nextStageIds: ['stage-review'],
          position: { x: 400, y: 380 },
          branchType: 'sequential',
          color: '#10b981',
          requiredForCompletion: true,
          estimatedDuration: '2-3 hours',
        },
        {
          id: 'stage-review',
          name: 'Review',
          description: 'Code review and quality checks',
          assignedAgentIds: ['rev-1'],
          order: 3,
          nextStageIds: ['stage-documentation'],
          position: { x: 400, y: 520 },
          branchType: 'sequential',
          color: '#f59e0b',
          requiredForCompletion: true,
          estimatedDuration: '1-2 hours',
        },
        {
          id: 'stage-documentation',
          name: 'Documentation',
          description: 'Update documentation and API docs',
          assignedAgentIds: ['impl-1'],
          order: 4,
          nextStageIds: [],
          position: { x: 400, y: 660 },
          branchType: 'sequential',
          color: '#8b5cf6',
          requiredForCompletion: false,
          estimatedDuration: '1 hour',
        },
      ],
      entryStageIds: ['stage-design'],
      isValid: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
  },
  {
    id: 'team-frontend',
    name: 'Frontend Team',
    description: 'React UI development',
    color: '#39d353',
    agentIds: ['impl-2', 'arch-1', 'test-1'],
    pipeline: {
      id: 'pipeline-frontend',
      name: 'Frontend Development Pipeline',
      description: 'React UI development workflow',
      stages: [
        {
          id: 'stage-design',
          name: 'Design',
          description: 'Create UI/UX design and component architecture',
          assignedAgentIds: ['arch-1'],
          order: 0,
          nextStageIds: ['stage-implementation'],
          position: { x: 400, y: 100 },
          branchType: 'sequential',
          color: '#a78bfa',
          requiredForCompletion: true,
          estimatedDuration: '2-4 hours',
        },
        {
          id: 'stage-implementation',
          name: 'Implementation',
          description: 'Implement React components and features',
          assignedAgentIds: ['impl-2'],
          order: 1,
          nextStageIds: ['stage-testing'],
          position: { x: 400, y: 240 },
          branchType: 'sequential',
          color: '#10b981',
          requiredForCompletion: true,
          estimatedDuration: '4-8 hours',
        },
        {
          id: 'stage-testing',
          name: 'Testing',
          description: 'Write unit and integration tests',
          assignedAgentIds: ['test-1'],
          order: 2,
          nextStageIds: ['stage-review'],
          position: { x: 400, y: 380 },
          branchType: 'sequential',
          color: '#3b82f6',
          requiredForCompletion: true,
          estimatedDuration: '2-3 hours',
        },
        {
          id: 'stage-review',
          name: 'Review',
          description: 'Code review and accessibility checks',
          assignedAgentIds: ['arch-1'],
          order: 3,
          nextStageIds: ['stage-documentation'],
          position: { x: 400, y: 520 },
          branchType: 'sequential',
          color: '#f59e0b',
          requiredForCompletion: true,
          estimatedDuration: '1-2 hours',
        },
        {
          id: 'stage-documentation',
          name: 'Documentation',
          description: 'Update Storybook and component docs',
          assignedAgentIds: ['impl-2'],
          order: 4,
          nextStageIds: [],
          position: { x: 400, y: 660 },
          branchType: 'sequential',
          color: '#8b5cf6',
          requiredForCompletion: false,
          estimatedDuration: '1 hour',
        },
      ],
      entryStageIds: ['stage-design'],
      isValid: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
  },
];

// =============================================================================
// AGENTS
// =============================================================================

export const agents: Agent[] = [
  {
    id: 'impl-1',
    name: 'Nova',
    role: 'implementer',
    status: 'running',
    currentTask: 'mission-auth-101',
    emoji: '⚡',
    color: '#3b82f6',
    teamId: 'team-backend',
  },
  {
    id: 'arch-1',
    name: 'Atlas',
    role: 'architect',
    status: 'thinking',
    currentTask: 'mission-payment-202',
    emoji: '🏗️',
    color: '#8b5cf6',
    teamId: 'team-backend',
  },
  {
    id: 'test-1',
    name: 'Sentinel',
    role: 'tester',
    status: 'running',
    emoji: '🧪',
    color: '#10b981',
    teamId: 'team-backend',
  },
  {
    id: 'rev-1',
    name: 'Sage',
    role: 'reviewer',
    status: 'idle',
    emoji: '👁️',
    color: '#f59e0b',
    teamId: 'team-backend',
  },
  {
    id: 'impl-2',
    name: 'Pixel',
    role: 'implementer',
    status: 'idle',
    emoji: '💻',
    color: '#ec4899',
    teamId: 'team-frontend',
  },
  {
    id: 'docs-1',
    name: 'Scribe',
    role: 'docs',
    status: 'idle',
    emoji: '📝',
    color: '#06b6d4',
  },
];

// =============================================================================
// AGENT PERSONAS - Personality and approach
// =============================================================================

export const agentPersonas: Record<string, AgentPersona> = {
  'impl-1': {
    style: 'fast',
    verbosity: 'balanced',
    riskTolerance: 'medium',
    specialty: 'Spring Boot, JPA',
  },
  'arch-1': {
    style: 'thorough',
    verbosity: 'detailed',
    riskTolerance: 'low',
    specialty: 'System Design, API Contracts',
  },
  'test-1': {
    style: 'thorough',
    verbosity: 'minimal',
    riskTolerance: 'low',
    specialty: 'Integration Testing, Testcontainers',
  },
  'rev-1': {
    style: 'conservative',
    verbosity: 'balanced',
    riskTolerance: 'low',
    specialty: 'Code Review, Best Practices',
  },
  'impl-2': {
    style: 'creative',
    verbosity: 'balanced',
    riskTolerance: 'medium',
    specialty: 'React, TypeScript',
  },
  'docs-1': {
    style: 'thorough',
    verbosity: 'detailed',
    riskTolerance: 'low',
    specialty: 'Technical Writing, API Documentation',
  },
};

// =============================================================================
// AGENT METRICS - Performance data
// =============================================================================

export const agentMetrics: Record<string, AgentMetrics> = {
  'impl-1': {
    tasksCompleted: 47,
    approvalRate: 88,
    reworkRate: 8,
    avgCostPerTask: 3.42,
    avgTimePerTask: 35,
    qualityScore: 87,
    byTaskType: {
      'feature': { count: 28, approvalRate: 89, avgCost: 4.10 },
      'bugfix': { count: 12, approvalRate: 92, avgCost: 2.15 },
      'refactor': { count: 7, approvalRate: 79, avgCost: 3.80 },
    },
  },
  'arch-1': {
    tasksCompleted: 23,
    approvalRate: 95,
    reworkRate: 2,
    avgCostPerTask: 1.85,
    avgTimePerTask: 25,
    qualityScore: 96,
    byTaskType: {
      'design': { count: 18, approvalRate: 96, avgCost: 1.90 },
      'review': { count: 5, approvalRate: 92, avgCost: 1.65 },
    },
  },
  'test-1': {
    tasksCompleted: 56,
    approvalRate: 92,
    reworkRate: 4,
    avgCostPerTask: 1.95,
    avgTimePerTask: 20,
    qualityScore: 93,
    byTaskType: {
      'unit-tests': { count: 34, approvalRate: 94, avgCost: 1.40 },
      'integration-tests': { count: 22, approvalRate: 89, avgCost: 2.80 },
    },
  },
  'rev-1': {
    tasksCompleted: 41,
    approvalRate: 97,
    reworkRate: 1,
    avgCostPerTask: 0.95,
    avgTimePerTask: 15,
    qualityScore: 98,
    byTaskType: {
      'code-review': { count: 41, approvalRate: 97, avgCost: 0.95 },
    },
  },
};

// =============================================================================
// AGENT MEMORIES - Project understanding and past decisions
// =============================================================================

export const agentMemories: Record<string, AgentMemory> = {
  'impl-1': {
    projectUnderstanding: 'E-commerce microservices platform with order, payment, and inventory services. Spring Boot backend with React frontend. PostgreSQL database with Flyway migrations. Following hexagonal architecture patterns.',
    conventions: [
      'Always use constructor injection for dependencies',
      'DTOs must have Request/Response suffix',
      'All entities extend BaseAuditEntity',
      'Integration tests use Testcontainers',
      'API endpoints follow /api/v1/{resource} pattern',
    ],
    pastDecisions: [
      {
        missionId: 'mission-ord-142',
        decision: 'Use @Transactional on service methods for data consistency',
        outcome: 'Approved - prevents partial order creation on failures',
      },
      {
        missionId: 'mission-auth-100',
        decision: 'Chose stateless JWT over session-based auth',
        outcome: 'Approved - better for horizontal scaling',
      },
    ],
  },
  'arch-1': {
    projectUnderstanding: 'Designing for horizontal scalability and service independence. Each microservice owns its data. Communication via REST APIs with potential future migration to event-driven architecture.',
    conventions: [
      'Services should not share databases',
      'Use API versioning for backward compatibility',
      'Design for eventual consistency in distributed transactions',
      'Always document API contracts with OpenAPI',
    ],
    pastDecisions: [
      {
        missionId: 'mission-pay-200',
        decision: 'Use Saga pattern for distributed transactions across order and payment services',
        outcome: 'Approved - handles failure scenarios gracefully',
      },
    ],
  },
};

// =============================================================================
// MISSIONS - Core V3 entity with conversations, plans, and execution
// =============================================================================

export const missions: Mission[] = [
  // Mission 1: User Authentication (EXECUTING status)
  {
    id: 'mission-auth-101',
    title: 'User Authentication with JWT',
    teamId: 'team-backend',
    status: 'executing',
    currentPipelineStage: 'stage-implementation',
    pipelineExecution: {
      pipelineId: 'pipeline-default',
      stages: [
        {
          stageId: 'stage-design',
          status: 'completed',
          activeAgentIds: [],
          startedAt: '2025-01-10T10:05:00Z',
          completedAt: '2025-01-10T10:07:00Z',
          commits: [],
          cost: 0.65,
          logs: {
            id: 'log-auth-design',
            stageId: 'stage-design',
            entries: [
              {
                id: 'log-1',
                timestamp: '2025-01-10T10:05:00Z',
                type: 'agent_activity',
                severity: 'info',
                agentId: 'architect-1',
                message: 'Started analyzing JWT authentication requirements',
              },
              {
                id: 'log-2',
                timestamp: '2025-01-10T10:05:30Z',
                type: 'decision',
                severity: 'success',
                agentId: 'architect-1',
                message: 'Decided to use Spring Security with JWT for authentication',
                details: {
                  decision: 'Spring Security + JWT tokens',
                  rationale: 'Provides robust security framework with industry-standard JWT implementation. Stateless design supports horizontal scaling.',
                  alternatives: ['Session-based auth', 'OAuth2/OIDC', 'Custom token implementation'],
                },
              },
              {
                id: 'log-3',
                timestamp: '2025-01-10T10:06:15Z',
                type: 'agent_activity',
                severity: 'info',
                agentId: 'architect-1',
                message: 'Designed database schema for User entity with roles and credentials',
              },
              {
                id: 'log-4',
                timestamp: '2025-01-10T10:07:00Z',
                type: 'approval',
                severity: 'success',
                agentId: 'architect-1',
                message: 'Design approved - proceeding to implementation',
                details: {
                  approver: 'Tech Lead',
                  approved: true,
                  feedback: 'Architecture looks solid. JWT approach is appropriate for our microservices setup.',
                },
              },
            ],
          },
        },
        {
          stageId: 'stage-implementation',
          status: 'active',
          activeAgentIds: ['impl-1'],
          startedAt: '2025-01-10T10:07:00Z',
          commits: ['c1a2b3c', 'd4e5f6g', 'h7i8j9k', 'l0m1n2o'],
          cost: 2.85,
          logs: {
            id: 'log-auth-implementation',
            stageId: 'stage-implementation',
            entries: [
              {
                id: 'log-5',
                timestamp: '2025-01-10T10:07:00Z',
                type: 'agent_activity',
                severity: 'info',
                agentId: 'impl-1',
                message: 'Started implementing JWT authentication service',
              },
              {
                id: 'log-6',
                timestamp: '2025-01-10T10:08:30Z',
                type: 'commit',
                severity: 'success',
                agentId: 'impl-1',
                message: 'Created User entity with JPA annotations',
                details: {
                  commitSha: 'c1a2b3c',
                  commitMessage: 'Add User entity with roles and credentials',
                  filesChanged: ['src/main/java/com/auth/entity/User.java'],
                },
              },
              {
                id: 'log-7',
                timestamp: '2025-01-10T10:10:15Z',
                type: 'test',
                severity: 'success',
                agentId: 'impl-1',
                message: 'User entity persistence test passed',
                details: {
                  testName: 'UserEntityPersistenceTest',
                  testStatus: 'passed',
                  testOutput: 'All assertions passed. User entity saved to database successfully with roles.',
                },
              },
              {
                id: 'log-8',
                timestamp: '2025-01-10T10:12:00Z',
                type: 'commit',
                severity: 'success',
                agentId: 'impl-1',
                message: 'Implemented JWT token service',
                details: {
                  commitSha: 'd4e5f6g',
                  commitMessage: 'Add JwtTokenService for token generation and validation',
                  filesChanged: ['src/main/java/com/auth/service/JwtTokenService.java'],
                },
              },
              {
                id: 'log-9',
                timestamp: '2025-01-10T10:13:30Z',
                type: 'error',
                severity: 'error',
                agentId: 'impl-1',
                message: 'Token validation test failed - signature mismatch',
                details: {
                  errorType: 'SignatureVerificationException',
                  stackTrace: 'io.jsonwebtoken.security.SignatureException: JWT signature does not match locally computed signature...',
                  resolution: 'Fixed secret key encoding in token service configuration',
                },
              },
              {
                id: 'log-10',
                timestamp: '2025-01-10T10:15:45Z',
                type: 'commit',
                severity: 'success',
                agentId: 'impl-1',
                message: 'Implemented authentication endpoints',
                details: {
                  commitSha: 'h7i8j9k',
                  commitMessage: 'Add login, logout, and refresh token endpoints',
                  filesChanged: ['src/main/java/com/auth/controller/AuthController.java'],
                },
              },
              {
                id: 'log-11',
                timestamp: '2025-01-10T10:17:20Z',
                type: 'test',
                severity: 'warning',
                agentId: 'impl-1',
                message: 'Token refresh integration test partially failed',
                details: {
                  testName: 'TokenRefreshIntegrationTest',
                  testStatus: 'failed',
                  testOutput: 'Expected 200 OK, got 401 Unauthorized. Refresh token expired after 1 hour instead of 7 days. Need to fix token expiration configuration.',
                },
              },
              {
                id: 'log-12',
                timestamp: '2025-01-10T10:19:00Z',
                type: 'commit',
                severity: 'success',
                agentId: 'impl-1',
                message: 'Configured Spring Security with JWT filter',
                details: {
                  commitSha: 'l0m1n2o',
                  commitMessage: 'Add SecurityConfig with JWT authentication filter',
                  filesChanged: ['src/main/java/com/auth/config/SecurityConfig.java', 'src/main/java/com/auth/filter/JwtAuthenticationFilter.java'],
                },
              },
            ],
          },
        },
        {
          stageId: 'stage-testing',
          status: 'pending',
          activeAgentIds: [],
          commits: [],
          cost: 0,
        },
        {
          stageId: 'stage-review',
          status: 'pending',
          activeAgentIds: [],
          commits: [],
          cost: 0,
        },
        {
          stageId: 'stage-documentation',
          status: 'pending',
          activeAgentIds: [],
          commits: [],
          cost: 0,
        },
      ],
      startedAt: '2025-01-10T10:05:00Z',
      totalCost: 3.50,
    },

    intent: {
      description: 'Add user authentication with JWT tokens. Use Spring Security. Support login, logout, and token refresh. Store users in PostgreSQL.',
      parsed: {
        goal: 'Implement JWT-based authentication system',
        constraints: [
          'Use Spring Security framework',
          'Store users in PostgreSQL',
          'Must support token refresh',
        ],
        preferences: [
          'Stateless JWT approach',
          'Role-based access control (USER, ADMIN)',
        ],
        scope: [
          'Authentication endpoints (login, logout, refresh)',
          'JWT token generation and validation',
          'User entity and repository',
          'Security configuration',
        ],
        outOfScope: [
          'OAuth2 integration',
          'Two-factor authentication',
          'Password reset flow',
        ],
      },
      clarifications: [
        {
          id: 'clarif-1',
          question: 'Should users be able to have multiple roles (e.g., USER, ADMIN)?',
          answer: 'Yes, users can have multiple roles.',
          askedBy: 'agent',
          askedAt: '2025-01-10T10:01:00Z',
          answeredAt: '2025-01-10T10:02:00Z',
        },
      ],
      confidence: 92,
    },

    plan: {
      id: 'plan-auth-101',
      summary: 'Implement JWT-based authentication using Spring Security with role-based access control.',
      rationale: 'Stateless JWT tokens are ideal for horizontal scaling and microservices architecture. Spring Security provides robust authentication framework with minimal custom code.',

      alternatives: [
        {
          title: 'OAuth2/OIDC',
          description: 'Use OAuth2 with external identity provider',
          pros: ['Industry standard', 'Offload user management'],
          cons: ['More complex setup', 'External dependency', 'Overkill for current needs'],
          rejected: true,
          reason: 'Too complex for initial authentication needs',
        },
        {
          title: 'Session-based auth',
          description: 'Traditional session cookies with server-side state',
          pros: ['Simpler to implement', 'Well understood'],
          cons: ['Requires sticky sessions or session replication', 'Not ideal for microservices'],
          rejected: true,
          reason: 'Doesn\'t fit stateless architecture requirement',
        },
      ],

      tasks: [
        {
          id: 'task-1',
          title: 'Add Spring Security dependency and create User entity',
          description: 'Add Spring Security starter to pom.xml, create User entity with roles',
          suggestedRole: 'architect',
          assignedAgent: 'arch-1',
          dependsOn: [],
          scope: ['pom.xml', 'User.java', 'Role.java'],
          estimate: { cost: 0.50, time: '10 min' },
          parallelizable: false,
        },
        {
          id: 'task-2',
          title: 'Create JWT utility classes',
          description: 'Implement JWT token generation and validation',
          suggestedRole: 'implementer',
          assignedAgent: 'impl-1',
          dependsOn: ['task-1'],
          scope: ['JwtTokenUtil.java', 'JwtTokenFilter.java'],
          estimate: { cost: 1.20, time: '25 min' },
          parallelizable: false,
        },
        {
          id: 'task-3',
          title: 'Create UserRepository and UserDetailsService',
          description: 'Implement database access and Spring Security integration',
          suggestedRole: 'implementer',
          assignedAgent: 'impl-1',
          dependsOn: ['task-1'],
          scope: ['UserRepository.java', 'CustomUserDetailsService.java'],
          estimate: { cost: 0.80, time: '15 min' },
          parallelizable: true,
        },
        {
          id: 'task-4',
          title: 'Create AuthController with login/logout endpoints',
          description: 'REST endpoints for authentication operations',
          suggestedRole: 'implementer',
          assignedAgent: 'impl-1',
          dependsOn: ['task-2', 'task-3'],
          scope: ['AuthController.java', 'LoginRequest.java', 'AuthResponse.java'],
          estimate: { cost: 1.00, time: '20 min' },
          parallelizable: false,
        },
        {
          id: 'task-5',
          title: 'Write integration tests',
          description: 'Test authentication flows with Testcontainers',
          suggestedRole: 'tester',
          assignedAgent: 'test-1',
          dependsOn: ['task-4'],
          scope: ['AuthControllerTest.java'],
          estimate: { cost: 0.90, time: '20 min' },
          parallelizable: false,
        },
      ],

      risks: [
        {
          id: 'risk-1',
          description: 'Existing User table may need schema migration',
          severity: 'medium',
          mitigation: 'Create Flyway migration to add roles column',
        },
        {
          id: 'risk-2',
          description: 'Token refresh logic may need iteration based on UX feedback',
          severity: 'low',
        },
      ],

      estimate: {
        cost: { min: 3.20, max: 4.50, expected: 4.10 },
        time: { min: '60 min', max: '90 min', expected: '75 min' },
      },

      repositories: ['repo-api-gateway'],
      status: 'approved',
    },

    conversationId: 'conv-auth-101',

    conversation: {
      id: 'conv-auth-101',
      missionId: 'mission-auth-101',
      title: 'User Authentication with JWT',
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
      workflowRuns: [],

      messages: [
        {
          id: 'msg-1',
          timestamp: '2025-01-10T10:00:00Z',
          sender: { type: 'operator' },
          content: 'Add user authentication with JWT tokens. Use Spring Security. Support login, logout, and token refresh. Store users in PostgreSQL.',
        },
        {
          id: 'msg-2',
          timestamp: '2025-01-10T10:01:00Z',
          sender: { type: 'agent', id: 'arch-1' },
          content: 'I\'ll analyze your project to understand the current setup before proposing a plan.\n\nQuick question: Should users be able to have multiple roles (e.g., USER, ADMIN)?',
        },
        {
          id: 'msg-3',
          timestamp: '2025-01-10T10:02:00Z',
          sender: { type: 'operator' },
          content: 'Yes, users can have multiple roles.',
        },
        {
          id: 'msg-4',
          timestamp: '2025-01-10T10:05:00Z',
          sender: { type: 'agent', id: 'arch-1' },
          content: 'I\'ve analyzed your project. Here\'s what I found:\n\n• Spring Boot 3.2 with existing security dependency\n• PostgreSQL with Flyway migrations\n• Existing User table but no roles column\n\n📋 PLAN READY FOR REVIEW',
        },
        {
          id: 'msg-5',
          timestamp: '2025-01-10T10:06:00Z',
          sender: { type: 'operator' },
          content: 'Plan looks good. Approved!',
        },
        {
          id: 'msg-6',
          timestamp: '2025-01-10T10:07:00Z',
          sender: { type: 'system' },
          content: 'Mission approved and moved to executing phase. Nova (Implementer) is starting work.',
        },
        {
          id: 'msg-7',
          timestamp: '2025-01-10T10:15:00Z',
          sender: { type: 'agent', id: 'impl-1' },
          content: 'I\'ve created the JWT utility classes. Now implementing the token filter for request authentication.',
        },
        {
          id: 'msg-8',
          timestamp: '2025-01-10T10:25:00Z',
          sender: { type: 'agent', id: 'impl-1' },
          content: 'AuthController is complete with login and refresh endpoints. Running tests now.',
          decision: {
            id: 'dec-1',
            title: 'Token Storage Strategy',
            description: 'Where should JWT tokens be stored on the client side?',
            madeBy: 'agent',
            agentId: 'impl-1',
            options: [
              {
                id: 'opt-1',
                title: 'HttpOnly Cookie',
                description: 'Store JWT in HttpOnly cookie, protected from XSS',
                pros: ['Protected from XSS attacks', 'Automatic transmission'],
                cons: ['Requires CORS configuration', 'CSRF protection needed'],
              },
              {
                id: 'opt-2',
                title: 'LocalStorage',
                description: 'Store JWT in browser localStorage',
                pros: ['Simple implementation', 'Works across domains'],
                cons: ['Vulnerable to XSS attacks', 'Manual header management'],
              },
            ],
            chosen: 'opt-1',
            rationale: 'HttpOnly cookies provide better security against XSS attacks, which is critical for authentication tokens. CSRF protection can be handled with SameSite attribute.',
            codeImpact: {
              files: ['AuthController.java', 'SecurityConfig.java'],
              commits: [],
            },
            timestamp: '2025-01-10T10:25:00Z',
          },
        },
      ],

      decisions: [
        {
          id: 'dec-1',
          title: 'Token Storage Strategy',
          description: 'Where should JWT tokens be stored on the client side?',
          madeBy: 'agent',
          agentId: 'impl-1',
          options: [
            {
              id: 'opt-1',
              title: 'HttpOnly Cookie',
              description: 'Store JWT in HttpOnly cookie',
              pros: ['Protected from XSS', 'Automatic transmission'],
              cons: ['Requires CORS config', 'CSRF protection needed'],
            },
            {
              id: 'opt-2',
              title: 'LocalStorage',
              description: 'Store JWT in localStorage',
              pros: ['Simple', 'Cross-domain'],
              cons: ['XSS vulnerable', 'Manual headers'],
            },
          ],
          chosen: 'opt-1',
          rationale: 'HttpOnly cookies provide better security. CSRF handled with SameSite attribute.',
          codeImpact: {
            files: ['AuthController.java', 'SecurityConfig.java'],
            commits: [],
          },
          timestamp: '2025-01-10T10:25:00Z',
        },
      ],

      openQuestions: [],
    },

    agents: [
      {
        agentId: 'arch-1',
        role: 'architect',
        stage: 'Planning',
        isActive: false,
        contribution: { commits: 0, filesChanged: 0, cost: 0.65 },
      },
      {
        agentId: 'impl-1',
        role: 'implementer',
        stage: 'Implementation',
        isActive: true,
        contribution: { commits: 4, filesChanged: 8, cost: 2.85 },
      },
      {
        agentId: 'test-1',
        role: 'tester',
        stage: 'Testing',
        isActive: false,
        contribution: { commits: 0, filesChanged: 0, cost: 0 },
      },
    ],

    progress: 65,
    cost: 3.50,
    startedAt: '2025-01-10T10:00:00Z',
  },

  // Mission 2: Payment Integration (PLANNING status)
  {
    id: 'mission-payment-202',
    title: 'Payment Service Integration',
    teamId: 'team-backend',
    status: 'planning',

    intent: {
      description: 'Integrate Stripe payment processing into the order service. Support credit card payments, refunds, and webhook handling for async payment confirmations.',
      parsed: {
        goal: 'Integrate Stripe payment gateway',
        constraints: [
          'Use Stripe Java SDK',
          'Must handle webhooks securely',
          'Support refund operations',
        ],
        preferences: [
          'Separate payment service',
          'Idempotent payment operations',
        ],
        scope: [
          'Stripe SDK integration',
          'Payment entity and repository',
          'Webhook endpoint',
          'Refund endpoint',
        ],
        outOfScope: [
          'PayPal integration',
          'Crypto payments',
          'Subscription billing',
        ],
      },
      clarifications: [],
      confidence: 85,
    },

    conversationId: 'conv-payment-202',

    conversation: {
      id: 'conv-payment-202',
      missionId: 'mission-payment-202',
      title: 'Payment Service Integration',
      createdAt: '2024-01-16T10:00:00Z',
      updatedAt: '2024-01-16T11:45:00Z',
      workflowRuns: [],

      messages: [
        {
          id: 'msg-p1',
          timestamp: '2025-01-10T11:00:00Z',
          sender: { type: 'operator' },
          content: 'Integrate Stripe payment processing into the order service. Support credit card payments, refunds, and webhook handling.',
        },
        {
          id: 'msg-p2',
          timestamp: '2025-01-10T11:02:00Z',
          sender: { type: 'agent', id: 'arch-1' },
          content: 'I\'m analyzing your current order service architecture to design the payment integration.\n\nKey considerations:\n• Should we create a separate payment service or integrate into order service?\n• How should we handle payment failures and retries?\n• What\'s the expected transaction volume?',
        },
        {
          id: 'msg-p3',
          timestamp: '2025-01-10T11:05:00Z',
          sender: { type: 'operator' },
          content: 'Start with integration into order service. We can extract it later if needed. Transaction volume is low initially (< 100/day), but design for scalability.',
        },
        {
          id: 'msg-p4',
          timestamp: '2025-01-10T11:10:00Z',
          sender: { type: 'agent', id: 'arch-1' },
          content: 'Working on the plan. I\'m considering using the Saga pattern to handle distributed transactions between order and payment operations. This will ensure we can rollback orders if payments fail.',
        },
      ],

      decisions: [],
      openQuestions: [
        {
          id: 'q-1',
          question: 'Should we store full payment details or just Stripe payment intent IDs?',
          askedBy: 'agent',
          agentId: 'arch-1',
          answered: false,
        },
      ],
    },

    agents: [
      {
        agentId: 'arch-1',
        role: 'architect',
        stage: 'Planning',
        isActive: true,
        contribution: { commits: 0, filesChanged: 0, cost: 0.45 },
      },
    ],

    progress: 15,
    cost: 0.45,
    startedAt: '2025-01-10T11:00:00Z',
  },

  // Mission 3: Order List UI (COMPLETE status)
  {
    id: 'mission-ui-303',
    title: 'Order List UI with Filtering',
    teamId: 'team-frontend',
    status: 'complete',
    pipelineExecution: {
      pipelineId: 'pipeline-frontend',
      stages: [
        {
          stageId: 'stage-design',
          status: 'completed',
          activeAgentIds: [],
          startedAt: '2025-01-09T14:00:00Z',
          completedAt: '2025-01-09T15:45:00Z',
          commits: ['abc123'],
          cost: 0.35,
        },
        {
          stageId: 'stage-implementation',
          status: 'completed',
          activeAgentIds: [],
          startedAt: '2025-01-09T15:45:00Z',
          completedAt: '2025-01-09T18:30:00Z',
          commits: ['def456', 'ghi789'],
          cost: 1.45,
        },
        {
          stageId: 'stage-testing',
          status: 'completed',
          activeAgentIds: [],
          startedAt: '2025-01-09T18:30:00Z',
          completedAt: '2025-01-09T19:45:00Z',
          commits: ['jkl012'],
          cost: 0.45,
        },
        {
          stageId: 'stage-visual-review',
          status: 'completed',
          activeAgentIds: [],
          startedAt: '2025-01-09T19:45:00Z',
          completedAt: '2025-01-09T20:15:00Z',
          commits: [],
          cost: 0.20,
        },
      ],
      startedAt: '2025-01-09T14:00:00Z',
      completedAt: '2025-01-09T20:15:00Z',
      totalCost: 2.45,
    },

    intent: {
      description: 'Create order list page in React frontend with filtering by status, date range, and customer. Use React Query for data fetching and Zustand for filter state.',
      parsed: {
        goal: 'Build order list page with filters',
        constraints: [
          'Use React Query for API calls',
          'Use Zustand for filter state',
          'Follow existing design system',
        ],
        preferences: [
          'Server-side pagination',
          'URL state for filters (shareable links)',
        ],
        scope: [
          'OrderListPage component',
          'Filter components',
          'API integration',
          'Pagination',
        ],
        outOfScope: [
          'Order creation',
          'Order editing',
          'Export functionality',
        ],
      },
      clarifications: [],
      confidence: 95,
    },

    plan: {
      id: 'plan-ui-303',
      summary: 'Build order list page with filters using React Query and Zustand.',
      rationale: 'React Query handles caching and refetching. Zustand provides lightweight state management. URL state enables shareable filter links.',
      alternatives: [],
      tasks: [
        {
          id: 'task-ui-1',
          title: 'Create OrderListPage component',
          description: 'Main page component with layout',
          suggestedRole: 'implementer',
          assignedAgent: 'impl-2',
          dependsOn: [],
          scope: ['OrderListPage.tsx'],
          estimate: { cost: 0.60, time: '15 min' },
          parallelizable: false,
        },
        {
          id: 'task-ui-2',
          title: 'Create filter components',
          description: 'Status filter, date range picker, customer search',
          suggestedRole: 'implementer',
          assignedAgent: 'impl-2',
          dependsOn: ['task-ui-1'],
          scope: ['OrderFilters.tsx', 'StatusFilter.tsx', 'DateRangePicker.tsx'],
          estimate: { cost: 1.20, time: '30 min' },
          parallelizable: false,
        },
        {
          id: 'task-ui-3',
          title: 'Integrate with API using React Query',
          description: 'Fetch orders with filters, handle loading/error states',
          suggestedRole: 'implementer',
          assignedAgent: 'impl-2',
          dependsOn: ['task-ui-2'],
          scope: ['useOrdersQuery.ts', 'orderService.ts'],
          estimate: { cost: 0.80, time: '20 min' },
          parallelizable: false,
        },
      ],
      risks: [],
      estimate: {
        cost: { min: 2.20, max: 3.00, expected: 2.60 },
        time: { min: '55 min', max: '75 min', expected: '65 min' },
      },
      repositories: ['repo-frontend'],
      status: 'approved',
    },

    conversationId: 'conv-ui-303',

    conversation: {
      id: 'conv-ui-303',
      missionId: 'mission-ui-303',
      title: 'Order List UI with Filtering',
      createdAt: '2024-01-17T09:00:00Z',
      updatedAt: '2024-01-17T10:30:00Z',
      workflowRuns: [],
      messages: [
        {
          id: 'msg-u1',
          timestamp: '2025-01-09T14:00:00Z',
          sender: { type: 'operator' },
          content: 'Create order list page with filtering by status, date range, and customer.',
        },
        {
          id: 'msg-u2',
          timestamp: '2025-01-09T14:05:00Z',
          sender: { type: 'agent', id: 'impl-2' },
          content: 'Plan is ready! I\'ll create a responsive order list with filters. Estimated 65 minutes.',
        },
        {
          id: 'msg-u3',
          timestamp: '2025-01-09T14:06:00Z',
          sender: { type: 'operator' },
          content: 'Approved.',
        },
        {
          id: 'msg-u4',
          timestamp: '2025-01-09T15:15:00Z',
          sender: { type: 'agent', id: 'impl-2' },
          content: 'Order list page is complete and tested. All filters working correctly with URL state synchronization.',
        },
        {
          id: 'msg-u5',
          timestamp: '2025-01-09T15:16:00Z',
          sender: { type: 'system' },
          content: 'Mission completed successfully. Total cost: $2.45',
        },
      ],
      decisions: [],
      openQuestions: [],
    },

    agents: [
      {
        agentId: 'impl-2',
        role: 'implementer',
        stage: 'Implementation',
        isActive: false,
        contribution: { commits: 6, filesChanged: 9, cost: 2.45 },
      },
    ],

    progress: 100,
    cost: 2.45,
    startedAt: '2025-01-09T14:00:00Z',
    completedAt: '2025-01-09T15:15:00Z',
  },

  // Mission 4: Database Indexing (EXECUTING status - Testing stage)
  {
    id: 'mission-db-404',
    title: 'Optimize Database Queries with Indexes',
    teamId: 'team-backend',
    status: 'executing',
    currentPipelineStage: 'stage-testing',
    pipelineExecution: {
      pipelineId: 'pipeline-default',
      stages: [
        {
          stageId: 'stage-design',
          status: 'completed',
          activeAgentIds: [],
          startedAt: '2025-01-08T09:00:00Z',
          completedAt: '2025-01-08T09:20:00Z',
          commits: [],
          cost: 0.25,
        },
        {
          stageId: 'stage-implementation',
          status: 'completed',
          activeAgentIds: [],
          startedAt: '2025-01-08T09:20:00Z',
          completedAt: '2025-01-08T10:00:00Z',
          commits: ['xyz123', 'uvw456'],
          cost: 0.65,
        },
        {
          stageId: 'stage-testing',
          status: 'active',
          activeAgentIds: ['test-1'],
          startedAt: '2025-01-08T10:00:00Z',
          commits: [],
          cost: 0.35,
        },
        {
          stageId: 'stage-review',
          status: 'pending',
          activeAgentIds: [],
          commits: [],
          cost: 0,
        },
        {
          stageId: 'stage-documentation',
          status: 'pending',
          activeAgentIds: [],
          commits: [],
          cost: 0,
        },
      ],
      startedAt: '2025-01-08T09:00:00Z',
      totalCost: 1.25,
    },

    intent: {
      description: 'Add database indexes to improve query performance on orders table. Focus on frequently queried columns: customer_id, status, created_at.',
      parsed: {
        goal: 'Optimize database query performance',
        constraints: [
          'Use Flyway migrations',
          'Test performance impact',
          'No breaking schema changes',
        ],
        preferences: [
          'Composite indexes where beneficial',
          'Measure before/after performance',
        ],
        scope: [
          'Create indexes on orders table',
          'Performance testing',
          'Migration scripts',
        ],
        outOfScope: [
          'Query rewriting',
          'Database server configuration',
          'Caching layer',
        ],
      },
      clarifications: [],
      confidence: 90,
    },

    plan: {
      id: 'plan-db-404',
      summary: 'Add strategic indexes to orders table based on query patterns.',
      rationale: 'Analysis shows 80% of queries filter by customer_id or status. Composite index on (customer_id, created_at) will cover common query patterns.',
      alternatives: [],
      tasks: [
        {
          id: 'task-db-1',
          title: 'Analyze query patterns',
          description: 'Review slow query logs and identify optimization opportunities',
          suggestedRole: 'architect',
          assignedAgent: 'arch-1',
          dependsOn: [],
          scope: [],
          estimate: { cost: 0.30, time: '10 min' },
          parallelizable: false,
        },
        {
          id: 'task-db-2',
          title: 'Create Flyway migration with indexes',
          description: 'Add indexes: orders(customer_id, created_at), orders(status)',
          suggestedRole: 'implementer',
          assignedAgent: 'impl-1',
          dependsOn: ['task-db-1'],
          scope: ['V5__add_orders_indexes.sql'],
          estimate: { cost: 0.40, time: '10 min' },
          parallelizable: false,
        },
        {
          id: 'task-db-3',
          title: 'Performance testing',
          description: 'Measure query performance before/after indexes',
          suggestedRole: 'tester',
          assignedAgent: 'test-1',
          dependsOn: ['task-db-2'],
          scope: ['OrderQueryPerformanceTest.java'],
          estimate: { cost: 0.70, time: '20 min' },
          parallelizable: false,
        },
      ],
      risks: [
        {
          id: 'risk-db-1',
          description: 'Index creation may temporarily lock table',
          severity: 'low',
          mitigation: 'Use CREATE INDEX CONCURRENTLY (PostgreSQL)',
        },
      ],
      estimate: {
        cost: { min: 1.20, max: 1.60, expected: 1.40 },
        time: { min: '35 min', max: '50 min', expected: '40 min' },
      },
      repositories: ['repo-api-gateway'],
      status: 'approved',
    },

    conversationId: 'conv-db-404',

    conversation: {
      id: 'conv-db-404',
      missionId: 'mission-db-404',
      title: 'Optimize Database Queries with Indexes',
      createdAt: '2024-01-18T08:00:00Z',
      updatedAt: '2024-01-18T09:15:00Z',
      workflowRuns: [],
      messages: [
        {
          id: 'msg-d1',
          timestamp: '2025-01-10T09:00:00Z',
          sender: { type: 'operator' },
          content: 'Add database indexes to improve query performance. Focus on orders table.',
        },
        {
          id: 'msg-d2',
          timestamp: '2025-01-10T09:20:00Z',
          sender: { type: 'agent', id: 'arch-1' },
          content: 'Analysis complete. I recommend composite index (customer_id, created_at) and single index on status. This will speed up 80% of order queries by 4-10x.',
        },
        {
          id: 'msg-d3',
          timestamp: '2025-01-10T09:21:00Z',
          sender: { type: 'operator' },
          content: 'Sounds good. Proceed.',
        },
        {
          id: 'msg-d4',
          timestamp: '2025-01-10T09:35:00Z',
          sender: { type: 'agent', id: 'impl-1' },
          content: 'Migration created and applied. Indexes are live.',
        },
        {
          id: 'msg-d5',
          timestamp: '2025-01-10T09:40:00Z',
          sender: { type: 'agent', id: 'test-1' },
          content: 'Running performance tests now to validate improvements...',
        },
      ],
      decisions: [],
      openQuestions: [],
    },

    agents: [
      {
        agentId: 'arch-1',
        role: 'architect',
        stage: 'Analysis',
        isActive: false,
        contribution: { commits: 0, filesChanged: 0, cost: 0.30 },
      },
      {
        agentId: 'impl-1',
        role: 'implementer',
        stage: 'Implementation',
        isActive: false,
        contribution: { commits: 1, filesChanged: 1, cost: 0.40 },
      },
      {
        agentId: 'test-1',
        role: 'tester',
        stage: 'Validation',
        isActive: true,
        contribution: { commits: 1, filesChanged: 1, cost: 0.55 },
      },
    ],

    progress: 90,
    cost: 1.25,
    startedAt: '2025-01-10T09:00:00Z',
  },

  // Mission 5: Error Handling Refactor (PLANNING status - awaiting approval)
  {
    id: 'mission-refactor-505',
    title: 'Standardize Error Handling',
    teamId: 'team-backend',
    status: 'planning',

    intent: {
      description: 'Refactor error handling across all controllers to use consistent exception structure and proper HTTP status codes. Create global exception handler.',
      parsed: {
        goal: 'Standardize error responses and exception handling',
        constraints: [
          'Don\'t break existing API contracts',
          'Use Spring @ControllerAdvice',
          'Include error codes for client handling',
        ],
        preferences: [
          'RFC 7807 Problem Details format',
          'Consistent error response structure',
        ],
        scope: [
          'GlobalExceptionHandler',
          'Custom exception classes',
          'Update all controllers',
        ],
        outOfScope: [
          'Frontend error handling changes',
          'Logging improvements',
        ],
      },
      clarifications: [],
      confidence: 88,
    },

    plan: {
      id: 'plan-refactor-505',
      summary: 'Create global exception handler using @ControllerAdvice with RFC 7807 Problem Details format.',
      rationale: 'Current error handling is inconsistent across controllers. Centralizing with @ControllerAdvice provides single source of truth and ensures consistent API responses.',
      alternatives: [],
      tasks: [
        {
          id: 'task-ref-1',
          title: 'Create custom exception hierarchy',
          description: 'Base exceptions for different error types (business, validation, not found)',
          suggestedRole: 'implementer',
          assignedAgent: 'impl-1',
          dependsOn: [],
          scope: ['BusinessException.java', 'ValidationException.java', 'ResourceNotFoundException.java'],
          estimate: { cost: 0.50, time: '15 min' },
          parallelizable: false,
        },
        {
          id: 'task-ref-2',
          title: 'Implement GlobalExceptionHandler',
          description: '@ControllerAdvice class handling all exception types',
          suggestedRole: 'implementer',
          assignedAgent: 'impl-1',
          dependsOn: ['task-ref-1'],
          scope: ['GlobalExceptionHandler.java', 'ErrorResponse.java'],
          estimate: { cost: 0.80, time: '20 min' },
          parallelizable: false,
        },
        {
          id: 'task-ref-3',
          title: 'Refactor controllers to use new exceptions',
          description: 'Update OrderController, CustomerController to use custom exceptions',
          suggestedRole: 'implementer',
          assignedAgent: 'impl-1',
          dependsOn: ['task-ref-2'],
          scope: ['OrderController.java', 'CustomerController.java'],
          estimate: { cost: 1.10, time: '25 min' },
          parallelizable: false,
        },
      ],
      risks: [],
      estimate: {
        cost: { min: 2.20, max: 2.80, expected: 2.40 },
        time: { min: '55 min', max: '70 min', expected: '60 min' },
      },
      repositories: ['repo-api-gateway'],
      status: 'approved',
    },

    conversationId: 'conv-refactor-505',

    conversation: {
      id: 'conv-refactor-505',
      missionId: 'mission-refactor-505',
      title: 'Standardize Error Handling',
      createdAt: '2024-01-19T07:00:00Z',
      updatedAt: '2024-01-19T08:00:00Z',
      workflowRuns: [],
      messages: [
        {
          id: 'msg-r1',
          timestamp: '2025-01-10T08:00:00Z',
          sender: { type: 'operator' },
          content: 'Refactor error handling to be consistent across all controllers. Use RFC 7807 format.',
        },
        {
          id: 'msg-r2',
          timestamp: '2025-01-10T08:15:00Z',
          sender: { type: 'agent', id: 'impl-1' },
          content: 'Plan ready. I\'ll create a GlobalExceptionHandler with custom exception hierarchy. All controllers will use consistent error responses.',
        },
        {
          id: 'msg-r3',
          timestamp: '2025-01-10T08:16:00Z',
          sender: { type: 'operator' },
          content: 'Approved.',
        },
        {
          id: 'msg-r4',
          timestamp: '2025-01-10T09:05:00Z',
          sender: { type: 'agent', id: 'impl-1' },
          content: 'Refactoring complete. All controllers now use the new exception handling. Ready for review.',
        },
        {
          id: 'msg-r5',
          timestamp: '2025-01-10T09:06:00Z',
          sender: { type: 'system' },
          content: '6 changes pending review in Review Surface.',
        },
      ],
      decisions: [],
      openQuestions: [],
    },

    agents: [
      {
        agentId: 'impl-1',
        role: 'implementer',
        stage: 'Implementation',
        isActive: false,
        contribution: { commits: 5, filesChanged: 7, cost: 2.35 },
      },
    ],

    progress: 95,
    cost: 2.35,
    startedAt: '2025-01-10T08:00:00Z',
  },
];

// =============================================================================
// OBSERVATIONS - Agent ambient awareness insights
// =============================================================================

export const observations: Observation[] = [
  {
    id: 'obs-1',
    agentId: 'arch-1',
    timestamp: '2025-01-10T10:30:00Z',
    type: 'inconsistency',
    title: 'Inconsistent validation patterns',
    description: 'The existing CustomerService uses a different validation pattern than OrderService. CustomerService validates in the controller, while OrderService validates in the service layer.',
    confidence: 87,
    suggestion: 'Standardize on service-layer validation for all services',
    references: [
      { type: 'code', title: 'CustomerService.java', url: '/repo/order-service/CustomerService.java' },
      { type: 'code', title: 'OrderService.java', url: '/repo/order-service/OrderService.java' },
    ],
    acknowledged: false,
    dismissed: false,
  },
  {
    id: 'obs-2',
    agentId: 'test-1',
    timestamp: '2025-01-10T09:15:00Z',
    type: 'test-coverage',
    title: 'Low test coverage on OrderController',
    description: 'Test coverage for OrderController is 34%. Critical endpoints like createOrder and cancelOrder lack integration tests.',
    confidence: 95,
    suggestion: 'Prioritize adding integration tests for order creation and cancellation flows',
    references: [
      { type: 'code', title: 'OrderController.java', url: '/repo/order-service/OrderController.java' },
    ],
    acknowledged: false,
    dismissed: false,
  },
  {
    id: 'obs-3',
    agentId: 'impl-1',
    timestamp: '2025-01-10T11:20:00Z',
    type: 'dependency-update',
    title: 'Spring Boot 3.2.1 available',
    description: 'Spring Boot 3.2.1 is available with security patches. Currently on 3.2.0.',
    confidence: 100,
    suggestion: 'Update to 3.2.1 for security fixes',
    references: [
      { type: 'external', title: 'Spring Boot Release Notes', url: 'https://github.com/spring-projects/spring-boot/releases/tag/v3.2.1' },
    ],
    acknowledged: false,
    dismissed: false,
  },
  {
    id: 'obs-4',
    agentId: 'rev-1',
    timestamp: '2025-01-10T08:45:00Z',
    type: 'pattern-detected',
    title: 'Repeated null checks can use Optional',
    description: 'Multiple methods in OrderService have verbose null checking that could be simplified using Java Optional pattern.',
    confidence: 78,
    suggestion: 'Refactor null checks to use Optional.ofNullable() and Optional.orElseThrow()',
    references: [
      { type: 'code', title: 'OrderService.java', url: '/repo/order-service/OrderService.java' },
    ],
    acknowledged: false,
    dismissed: false,
  },
  {
    id: 'obs-5',
    agentId: 'arch-1',
    timestamp: '2025-01-09T16:20:00Z',
    type: 'performance',
    title: 'N+1 query problem in OrderController.getOrders()',
    description: 'The getOrders() endpoint loads customers individually for each order, causing N+1 queries. With 100 orders, this creates 101 database queries.',
    confidence: 92,
    suggestion: 'Add @EntityGraph or JOIN FETCH to load customers in single query',
    references: [
      { type: 'code', title: 'OrderController.java:42', url: '/repo/order-service/OrderController.java#L42' },
      { type: 'doc', title: 'JPA EntityGraph Guide', url: 'https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.entity-graph' },
    ],
    acknowledged: true,
    dismissed: false,
  },
];

// =============================================================================
// BACKGROUND TASKS - Missions running in background
// =============================================================================

export const backgroundTasks: BackgroundTask[] = [
  {
    missionId: 'mission-db-404',
    mode: 'background',
    needsAttention: false,
    blockingQuestion: undefined,
  },
  {
    missionId: 'mission-refactor-505',
    mode: 'background',
    needsAttention: true,
    blockingQuestion: 'Implementation complete. Ready for your review in Review Surface.',
  },
];

// =============================================================================
// PROJECT - Top-level container
// =============================================================================

export const project: Project = {
  id: 'proj-1',
  name: 'E-Commerce Platform',
  description: 'Microservices-based e-commerce platform with order, payment, and inventory services',
  repositories,
  teams,
  agents,
  budgets: [
    {
      name: 'Development Budget',
      current: 47.82,
      limit: 200,
      resetIn: '23 days',
      daysLeft: 23,
    },
  ],
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getMissionById(id: string): Mission | undefined {
  return missions.find(m => m.id === id);
}

export function getObservationsByAgentId(agentId: string): Observation[] {
  return observations.filter(o => o.agentId === agentId);
}

export function getUnacknowledgedObservations(): Observation[] {
  return observations.filter(o => !o.acknowledged && !o.dismissed);
}

export function getBackgroundTaskByMissionId(missionId: string): BackgroundTask | undefined {
  return backgroundTasks.find(t => t.missionId === missionId);
}

export function getAgentPersona(agentId: string): AgentPersona | undefined {
  return agentPersonas[agentId];
}

export function getAgentMetrics(agentId: string): AgentMetrics | undefined {
  return agentMetrics[agentId];
}

export function getAgentMemory(agentId: string): AgentMemory | undefined {
  return agentMemories[agentId];
}

export function getRepositoryUnderstanding(repoId: string): RepositoryUnderstanding | undefined {
  return repositoryUnderstanding[repoId];
}
