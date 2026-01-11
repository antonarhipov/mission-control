import type {
  Repository,
  Project,
  TaskV2,
  TaskCommit,
  TaskFileChange,
  Team,
  Agent,
  AgentCost,
  Budget,
  ModelPricing,
  AgentConfig,
  FileDiff,
  Service,
  TaskContext,
  Policy,
  AgentPermission,
  PolicyViolation,
  QualityScorecard,
  AuditLogEntry,
} from '@/types';

// =============================================================================
// REPOSITORIES - Connected codebases
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
// TEAMS - Reuse from v1 mockData
// =============================================================================

export const teams: Team[] = [
  {
    id: 'team-backend',
    name: 'Backend Squad',
    description: 'Full-stack team for backend service development',
    color: '#388bfd',
    agentIds: ['impl-1', 'arch-1', 'test-1', 'rev-1'],
  },
  {
    id: 'team-docs',
    name: 'Documentation',
    description: 'API documentation and technical writing',
    color: '#39d353',
    agentIds: ['docs-1'],
  },
  {
    id: 'team-infra',
    name: 'Infrastructure',
    description: 'Database, migrations, and DevOps',
    color: '#9e6a03',
    agentIds: ['impl-1', 'rev-1', 'test-1'],
  },
];

// =============================================================================
// AGENTS - Reuse from v1 mockData
// =============================================================================

export const agents: Agent[] = [
  {
    id: 'impl-1',
    name: 'Implementer',
    role: 'implementer',
    status: 'running',
    currentTask: 'Writing OrderService.java',
    emoji: '⚡',
    color: '#388bfd',
    teamId: 'team-backend',
  },
  {
    id: 'arch-1',
    name: 'Architect',
    role: 'architect',
    status: 'thinking',
    currentTask: 'Reviewing API design',
    emoji: '🏗️',
    color: '#8957e5',
    teamId: 'team-backend',
  },
  {
    id: 'test-1',
    name: 'Tester',
    role: 'tester',
    status: 'waiting',
    currentTask: 'Awaiting implementation',
    emoji: '🧪',
    color: '#238636',
    teamId: 'team-backend',
  },
  {
    id: 'rev-1',
    name: 'Reviewer',
    role: 'reviewer',
    status: 'running',
    currentTask: 'Reviewing migration scripts',
    emoji: '👁️',
    color: '#9e6a03',
    teamId: 'team-backend',
  },
  {
    id: 'docs-1',
    name: 'Doc Writer',
    role: 'docs',
    status: 'idle',
    emoji: '📝',
    color: '#39d353',
    teamId: 'team-docs',
  },
];

// =============================================================================
// TASKS V2 - THE CENTRAL ENTITY
// =============================================================================

export const tasksV2: TaskV2[] = [
  // Task 1: Single-repo task (order-service)
  {
    id: 'ORD-142',
    title: 'Implement Order entity with JPA mappings and audit fields',
    description: 'Create the Order aggregate root with proper JPA annotations, audit fields, and relationship mappings to Customer and LineItem entities.',

    // User's original request
    userPrompt: 'Create an Order entity for the e-commerce platform with proper JPA mappings, relationships to Customer and LineItem, and automatic audit field tracking.',
    context: 'This is part of the core domain model refactoring. The Order entity needs to support the full order lifecycle including creation, modification, and cancellation.',

    // AI-generated specification (approved)
    specification: {
      status: 'approved',
      generatedAt: '2 hours ago',

      summary: 'Implement Order aggregate root as JPA entity with Customer and LineItem relationships, using constructor injection for dependencies and proper cascade configurations.',

      technicalApproach: {
        repositories: ['repo-order-service'],
        components: [
          'Order.java (entity)',
          'OrderLineItem.java (entity)',
          'OrderService.java (service)',
          'OrderStatus.java (enum)'
        ],
        design: 'Use JPA annotations for entity mapping with LAZY fetching for Customer to avoid N+1 queries. Implement bidirectional OneToMany relationship with OrderLineItem using CascadeType.ALL. OrderService uses constructor injection and publishes domain events for order state changes.',
      },

      acceptanceCriteria: [
        {
          id: 'ac-1',
          description: 'Order entity persists to database with all fields correctly mapped',
          completed: true,
          completedAt: '45 min ago',
          verifiedBy: 'agent',
          implementedIn: {
            commits: ['8e4d1a9'],
            files: ['src/main/java/com/acme/orders/entity/Order.java'],
          },
        },
        {
          id: 'ac-2',
          description: 'Customer relationship uses LAZY fetching and works correctly',
          completed: true,
          completedAt: '38 min ago',
          verifiedBy: 'agent',
          implementedIn: {
            commits: ['8e4d1a9'],
            files: ['src/main/java/com/acme/orders/entity/Order.java'],
          },
        },
        {
          id: 'ac-3',
          description: 'LineItem cascade operations work (save, delete)',
          completed: true,
          completedAt: '30 min ago',
          verifiedBy: 'agent',
          implementedIn: {
            commits: ['8e4d1a9'],
            files: ['src/main/java/com/acme/orders/entity/Order.java', 'src/main/java/com/acme/orders/entity/OrderLineItem.java'],
          },
        },
        {
          id: 'ac-4',
          description: 'OrderService uses constructor injection (no field injection)',
          completed: true,
          completedAt: '25 min ago',
          verifiedBy: 'agent',
          implementedIn: {
            commits: ['a3f7b2c'],
            files: ['src/main/java/com/acme/orders/service/OrderService.java'],
          },
        },
        {
          id: 'ac-5',
          description: 'Domain events published for order state changes',
          completed: false,
        },
      ],

      estimatedScope: {
        files: 12,
        complexity: 'moderate',
        estimatedCost: 5.5,
      },

      dependencies: {
        blockedBy: ['ORD-138'],
        requires: ['Spring Boot 3.x', 'JPA/Hibernate', 'Lombok'],
      },

      risks: [
        'N+1 query problems if EAGER fetching used incorrectly',
        'Cascade configuration could cause unintended deletions',
      ],

      approvedAt: '2 hours ago',
      approvedBy: 'user',
    },

    status: 'in-progress',
    priority: 'high',
    tags: ['feature', 'backend'],

    teamId: 'team-backend',
    agents: [
      {
        agentId: 'impl-1',
        role: 'primary',
        stage: 'Implementation',
        isActive: true,
        contribution: {
          commits: 5,
          filesChanged: 12,
          linesAdded: 847,
          linesRemoved: 123,
          cost: 3.42,
        },
      },
      {
        agentId: 'arch-1',
        role: 'supporting',
        stage: 'Design Review',
        isActive: true,
        contribution: {
          commits: 2,
          filesChanged: 3,
          linesAdded: 45,
          linesRemoved: 12,
          cost: 1.24,
        },
      },
      {
        agentId: 'test-1',
        role: 'waiting',
        stage: 'Testing',
        isActive: false,
        contribution: {
          commits: 0,
          filesChanged: 0,
          linesAdded: 0,
          linesRemoved: 0,
          cost: 0,
        },
      },
    ],

    pipeline: [
      { id: 'design', name: 'Design', status: 'completed', agentId: 'arch-1', completedAt: '2 hours ago', cost: 0.89 },
      { id: 'impl', name: 'Implementation', status: 'active', agentId: 'impl-1', startedAt: '1 hour ago', cost: 2.53 },
      { id: 'test', name: 'Testing', status: 'pending', agentId: 'test-1', cost: 0 },
      { id: 'review', name: 'Code Review', status: 'pending', agentId: 'rev-1', cost: 0 },
    ],
    currentStage: 'Implementation',

    progress: 65,
    totalCost: 4.66,

    worktrees: [
      {
        id: 'wt-order-service',
        repositoryId: 'repo-order-service',
        branch: 'feature/order-service',
        baseBranch: 'main',
        path: '/worktrees/order-service',
        status: 'active',
        fileChanges: [],
        commits: [],
        createdAt: '2 hours ago',
        updatedAt: '12 min ago',
      },
    ],

    commits: [
      {
        id: 'commit-1',
        sha: 'a3f7b2c',
        message: 'feat(orders): add OrderService with transaction support',
        author: 'Implementer',
        authorType: 'agent',
        agentId: 'impl-1',
        repositoryId: 'repo-order-service',
        worktreeId: 'wt-order-service',
        filesChanged: 3,
        additions: 127,
        deletions: 23,
        cost: { inputTokens: 48000, outputTokens: 6200, toolCalls: 12, totalCost: 0.53 },
        fileIds: ['file-1', 'file-2', 'file-3'],
        fulfillsAcceptanceCriteria: ['ac-4'],
        timestamp: '12 min ago',
      },
      {
        id: 'commit-2',
        sha: '8e4d1a9',
        message: 'feat(entity): implement Order entity with JPA annotations',
        author: 'Implementer',
        authorType: 'agent',
        agentId: 'impl-1',
        repositoryId: 'repo-order-service',
        worktreeId: 'wt-order-service',
        filesChanged: 2,
        additions: 156,
        deletions: 0,
        cost: { inputTokens: 52000, outputTokens: 8000, toolCalls: 15, totalCost: 0.68 },
        fileIds: ['file-4', 'file-5'],
        fulfillsAcceptanceCriteria: ['ac-1', 'ac-2', 'ac-3'],
        timestamp: '24 min ago',
      },
      {
        id: 'commit-3',
        sha: 'b1c3d4e',
        message: 'feat(dto): add request/response DTOs for Order API',
        author: 'Architect',
        authorType: 'agent',
        agentId: 'arch-1',
        repositoryId: 'repo-order-service',
        worktreeId: 'wt-order-service',
        filesChanged: 2,
        additions: 83,
        deletions: 0,
        cost: { inputTokens: 28000, outputTokens: 4500, toolCalls: 8, totalCost: 0.38 },
        fileIds: ['file-6', 'file-7'],
        timestamp: '35 min ago',
      },
    ],

    fileChanges: [
      {
        id: 'file-1',
        path: 'src/main/java/com/acme/orders/service/',
        filename: 'OrderService.java',
        repositoryId: 'repo-order-service',
        worktreeId: 'wt-order-service',
        changeType: 'modified',
        additions: 127,
        deletions: 23,
        agentId: 'impl-1',
        commitShas: ['a3f7b2c'],
        fulfillsAcceptanceCriteria: ['ac-4'],
        specRationale: 'Refactored OrderService to use constructor injection instead of field injection, fulfilling AC-4 requirement for proper dependency injection patterns.',
      },
      {
        id: 'file-2',
        path: 'src/main/java/com/acme/orders/entity/',
        filename: 'Order.java',
        repositoryId: 'repo-order-service',
        worktreeId: 'wt-order-service',
        changeType: 'added',
        additions: 89,
        deletions: 0,
        agentId: 'impl-1',
        commitShas: ['8e4d1a9'],
        fulfillsAcceptanceCriteria: ['ac-1', 'ac-2', 'ac-3'],
        specRationale: 'Created Order aggregate root entity with JPA annotations for database persistence (AC-1), LAZY fetching for Customer relationship (AC-2), and cascade configuration for LineItem operations (AC-3).',
      },
      {
        id: 'file-3',
        path: 'src/main/java/com/acme/orders/entity/',
        filename: 'OrderLineItem.java',
        repositoryId: 'repo-order-service',
        worktreeId: 'wt-order-service',
        changeType: 'added',
        additions: 67,
        deletions: 0,
        agentId: 'impl-1',
        commitShas: ['8e4d1a9'],
        fulfillsAcceptanceCriteria: ['ac-3'],
        specRationale: 'Created OrderLineItem entity with bidirectional relationship to Order, enabling cascade operations for save and delete as specified in AC-3.',
      },
    ],

    dependsOn: ['ORD-138', 'ORD-139'],
    blocks: ['ORD-145', 'ORD-146'],

    affectedServices: ['svc-order'],

    createdAt: '2 hours ago',
    startedAt: '2 hours ago',
  },

  // Task 2: Multi-repo task (api-gateway + frontend + shared-types)
  {
    id: 'AUTH-101',
    title: 'Implement user authentication',
    description: 'Add JWT-based authentication system across api-gateway, frontend, and shared type definitions.',

    // User's original request
    userPrompt: 'Add JWT-based user authentication to the platform with login, logout, and token refresh functionality.',
    context: 'Critical security feature needed before public launch. Must work across all services and provide a good UX in the frontend.',
    linkedTicket: {
      url: 'https://linear.app/acme/issue/AUTH-101',
      system: 'linear',
      externalId: 'AUTH-101',
    },

    // AI-generated specification (approved)
    specification: {
      status: 'approved',
      generatedAt: '1.5 hours ago',

      summary: 'Implement JWT authentication with separate access/refresh tokens, shared type definitions across repos, Spring Security integration in gateway, and React Context-based auth state management in frontend.',

      technicalApproach: {
        repositories: ['repo-api-gateway', 'repo-frontend', 'repo-shared-types'],
        components: [
          'auth.ts (shared types)',
          'user.ts (shared types)',
          'JwtFilter.java (gateway filter)',
          'JwtTokenProvider.java (gateway service)',
          'SecurityConfig.java (gateway config)',
          'LoginForm.tsx (frontend component)',
          'useAuth.ts (frontend hook)',
        ],
        design: 'Use JWT with separate access (short-lived, 15min) and refresh tokens (long-lived, 7 days). Spring Security filter validates tokens on every request. Frontend stores tokens in localStorage and provides auth context via React Context. Shared types package ensures type consistency across services.',
      },

      acceptanceCriteria: [
        {
          id: 'ac-auth-1',
          description: 'Shared auth types defined and used in all repos',
          completed: true,
          completedAt: '50 min ago',
          verifiedBy: 'agent',
        },
        {
          id: 'ac-auth-2',
          description: 'JWT filter validates tokens and extracts user ID',
          completed: true,
          completedAt: '35 min ago',
          verifiedBy: 'agent',
        },
        {
          id: 'ac-auth-3',
          description: 'Login form accepts credentials and stores tokens',
          completed: true,
          completedAt: '18 min ago',
          verifiedBy: 'agent',
        },
        {
          id: 'ac-auth-4',
          description: 'useAuth hook provides auth context to all components',
          completed: true,
          completedAt: '15 min ago',
          verifiedBy: 'agent',
        },
        {
          id: 'ac-auth-5',
          description: 'Token refresh mechanism implemented',
          completed: false,
        },
        {
          id: 'ac-auth-6',
          description: 'Logout clears tokens and redirects to login',
          completed: false,
        },
      ],

      estimatedScope: {
        files: 8,
        complexity: 'complex',
        estimatedCost: 8.5,
      },

      dependencies: {
        requires: ['Spring Security', 'JWT library (jjwt)', 'React Context API'],
      },

      risks: [
        'Token storage in localStorage vulnerable to XSS attacks',
        'Token refresh timing could cause race conditions',
        'CORS configuration needed for cross-origin requests',
      ],

      approvedAt: '1.5 hours ago',
      approvedBy: 'user',
    },

    status: 'in-progress',
    priority: 'critical',
    tags: ['feature', 'security', 'api'],

    teamId: 'team-backend',
    agents: [
      {
        agentId: 'impl-1',
        role: 'primary',
        stage: 'Implementation',
        isActive: true,
        contribution: {
          commits: 6,
          filesChanged: 8,
          linesAdded: 423,
          linesRemoved: 45,
          cost: 2.87,
        },
      },
      {
        agentId: 'arch-1',
        role: 'supporting',
        stage: 'Design',
        isActive: false,
        contribution: {
          commits: 2,
          filesChanged: 3,
          linesAdded: 120,
          linesRemoved: 0,
          cost: 0.92,
        },
      },
    ],

    pipeline: [
      { id: 'design', name: 'Design', status: 'completed', agentId: 'arch-1', completedAt: '1 hour ago', cost: 0.92 },
      { id: 'impl', name: 'Implementation', status: 'active', agentId: 'impl-1', startedAt: '45 min ago', cost: 2.12 },
      { id: 'test', name: 'Testing', status: 'pending', agentId: 'test-1', cost: 0 },
    ],
    currentStage: 'Implementation',

    progress: 45,
    totalCost: 3.79,

    worktrees: [
      {
        id: 'wt-auth-api',
        repositoryId: 'repo-api-gateway',
        branch: 'feature/auth',
        baseBranch: 'main',
        path: '/worktrees/auth-api',
        status: 'active',
        fileChanges: [],
        commits: [],
        createdAt: '1 hour ago',
        updatedAt: '15 min ago',
      },
      {
        id: 'wt-auth-frontend',
        repositoryId: 'repo-frontend',
        branch: 'feature/auth',
        baseBranch: 'main',
        path: '/worktrees/auth-frontend',
        status: 'active',
        fileChanges: [],
        commits: [],
        createdAt: '1 hour ago',
        updatedAt: '18 min ago',
      },
      {
        id: 'wt-auth-types',
        repositoryId: 'repo-shared-types',
        branch: 'feature/auth-types',
        baseBranch: 'main',
        path: '/worktrees/auth-types',
        status: 'active',
        fileChanges: [],
        commits: [],
        createdAt: '1 hour ago',
        updatedAt: '30 min ago',
      },
    ],

    commits: [
      {
        id: 'commit-auth-1',
        sha: 'f4a5b6c',
        message: 'feat(types): add auth types and interfaces',
        author: 'Architect',
        authorType: 'agent',
        agentId: 'arch-1',
        repositoryId: 'repo-shared-types',
        worktreeId: 'wt-auth-types',
        filesChanged: 2,
        additions: 77,
        deletions: 0,
        cost: { inputTokens: 31000, outputTokens: 4200, toolCalls: 6, totalCost: 0.42 },
        fileIds: ['file-auth-1', 'file-auth-2'],
        timestamp: '50 min ago',
      },
      {
        id: 'commit-auth-2',
        sha: 'a7f8c9d',
        message: 'feat(api): add JWT filter and security config',
        author: 'Implementer',
        authorType: 'agent',
        agentId: 'impl-1',
        repositoryId: 'repo-api-gateway',
        worktreeId: 'wt-auth-api',
        filesChanged: 3,
        additions: 178,
        deletions: 8,
        cost: { inputTokens: 56000, outputTokens: 7800, toolCalls: 18, totalCost: 0.74 },
        fileIds: ['file-auth-3', 'file-auth-4', 'file-auth-5'],
        timestamp: '35 min ago',
      },
      {
        id: 'commit-auth-3',
        sha: 'e3f4a5b',
        message: 'feat(frontend): add login form and auth hook',
        author: 'Implementer',
        authorType: 'agent',
        agentId: 'impl-1',
        repositoryId: 'repo-frontend',
        worktreeId: 'wt-auth-frontend',
        filesChanged: 3,
        additions: 168,
        deletions: 37,
        cost: { inputTokens: 48000, outputTokens: 6500, toolCalls: 14, totalCost: 0.63 },
        fileIds: ['file-auth-6', 'file-auth-7', 'file-auth-8'],
        timestamp: '18 min ago',
      },
    ],

    fileChanges: [
      {
        id: 'file-auth-1',
        path: 'src/types/',
        filename: 'auth.ts',
        repositoryId: 'repo-shared-types',
        worktreeId: 'wt-auth-types',
        changeType: 'added',
        additions: 45,
        deletions: 0,
        agentId: 'arch-1',
        commitShas: ['f4a5b6c'],
      },
      {
        id: 'file-auth-2',
        path: 'src/types/',
        filename: 'user.ts',
        repositoryId: 'repo-shared-types',
        worktreeId: 'wt-auth-types',
        changeType: 'added',
        additions: 32,
        deletions: 0,
        agentId: 'arch-1',
        commitShas: ['f4a5b6c'],
      },
      {
        id: 'file-auth-3',
        path: 'src/main/java/com/acme/gateway/security/',
        filename: 'JwtFilter.java',
        repositoryId: 'repo-api-gateway',
        worktreeId: 'wt-auth-api',
        changeType: 'added',
        additions: 98,
        deletions: 0,
        agentId: 'impl-1',
        commitShas: ['a7f8c9d'],
      },
      {
        id: 'file-auth-6',
        path: 'src/components/auth/',
        filename: 'LoginForm.tsx',
        repositoryId: 'repo-frontend',
        worktreeId: 'wt-auth-frontend',
        changeType: 'added',
        additions: 120,
        deletions: 0,
        agentId: 'impl-1',
        commitShas: ['e3f4a5b'],
      },
      {
        id: 'file-auth-7',
        path: 'src/hooks/',
        filename: 'useAuth.ts',
        repositoryId: 'repo-frontend',
        worktreeId: 'wt-auth-frontend',
        changeType: 'added',
        additions: 48,
        deletions: 0,
        agentId: 'impl-1',
        commitShas: ['e3f4a5b'],
      },
    ],

    dependsOn: [],
    blocks: [],

    affectedServices: ['svc-auth', 'svc-user'],

    createdAt: '1.5 hours ago',
    startedAt: '1 hour ago',
  },

  // Task 3: Single-repo task (order-service) - in review
  {
    id: 'ORD-140',
    title: 'Review Flyway migration scripts for orders schema',
    description: 'Code review of V2 migration script for orders and line_items tables.',

    // User's original request
    userPrompt: 'Review the Flyway migration scripts for the orders schema to ensure they follow best practices and have proper indexes.',
    context: 'These migrations will run in production, so they need to be correct. Focus on data types, constraints, and index strategy.',

    // AI-generated specification (approved)
    specification: {
      status: 'approved',
      generatedAt: '1.5 hours ago',

      summary: 'Review V2 and V3 Flyway migrations for orders and line_items tables, validating schema design, data types (especially DECIMAL for money), foreign key constraints, cascade behavior, and index strategy for performance.',

      technicalApproach: {
        repositories: ['repo-order-service'],
        components: [
          'V2__add_orders_table.sql',
          'V3__add_orders_indexes.sql',
        ],
        design: 'Review SQL migration scripts for: (1) Correct data types (DECIMAL for money, not FLOAT), (2) Proper foreign key constraints with ON DELETE CASCADE, (3) NOT NULL constraints on required fields, (4) Index strategy covering foreign keys and common query patterns, (5) Composite indexes for multi-column queries.',
      },

      acceptanceCriteria: [
        {
          id: 'ac-db-1',
          description: 'DECIMAL(19,2) used for all monetary values',
          completed: true,
          completedAt: '50 min ago',
          verifiedBy: 'agent',
        },
        {
          id: 'ac-db-2',
          description: 'Foreign key constraints properly defined with cascade behavior',
          completed: true,
          completedAt: '48 min ago',
          verifiedBy: 'agent',
        },
        {
          id: 'ac-db-3',
          description: 'All foreign keys have indexes',
          completed: true,
          completedAt: '46 min ago',
          verifiedBy: 'agent',
        },
        {
          id: 'ac-db-4',
          description: 'Composite index for customer_id + status query pattern',
          completed: true,
          completedAt: '44 min ago',
          verifiedBy: 'agent',
        },
        {
          id: 'ac-db-5',
          description: 'Migration scripts are idempotent and rollback safe',
          completed: false,
        },
      ],

      estimatedScope: {
        files: 2,
        complexity: 'simple',
        estimatedCost: 2.0,
      },

      dependencies: {
        blockedBy: [],
        requires: ['Flyway', 'PostgreSQL 14+'],
      },

      risks: [
        'Missing indexes could cause slow queries in production',
        'Incorrect CASCADE behavior could lead to data loss',
      ],

      approvedAt: '1.5 hours ago',
      approvedBy: 'user',
    },

    status: 'review',
    priority: 'medium',
    tags: ['database', 'review'],

    teamId: 'team-infra',
    agents: [
      {
        agentId: 'impl-1',
        role: 'completed',
        stage: 'Implementation',
        isActive: false,
        contribution: {
          commits: 2,
          filesChanged: 2,
          linesAdded: 67,
          linesRemoved: 0,
          cost: 0.89,
        },
      },
      {
        agentId: 'rev-1',
        role: 'primary',
        stage: 'Code Review',
        isActive: true,
        contribution: {
          commits: 0,
          filesChanged: 0,
          linesAdded: 0,
          linesRemoved: 0,
          cost: 0.42,
        },
      },
    ],

    pipeline: [
      { id: 'impl', name: 'Implementation', status: 'completed', agentId: 'impl-1', completedAt: '1 hour ago', cost: 0.89 },
      { id: 'review', name: 'Code Review', status: 'active', agentId: 'rev-1', startedAt: '45 min ago', cost: 0.42 },
      { id: 'test', name: 'Migration Test', status: 'pending', agentId: 'test-1', cost: 0 },
    ],
    currentStage: 'Code Review',

    progress: 70,
    totalCost: 1.31,

    worktrees: [
      {
        id: 'wt-db-migration',
        repositoryId: 'repo-order-service',
        branch: 'feature/db-migration-v2',
        baseBranch: 'main',
        path: '/worktrees/db-migration',
        status: 'active',
        fileChanges: [],
        commits: [],
        createdAt: '1.5 hours ago',
        updatedAt: '10 min ago',
      },
    ],

    commits: [
      {
        id: 'commit-db-1',
        sha: 'f6a7b8c',
        message: 'feat(db): add V2 migration for orders and line_items tables',
        author: 'Implementer',
        authorType: 'agent',
        agentId: 'impl-1',
        repositoryId: 'repo-order-service',
        worktreeId: 'wt-db-migration',
        filesChanged: 1,
        additions: 45,
        deletions: 0,
        cost: { inputTokens: 22000, outputTokens: 3200, toolCalls: 6, totalCost: 0.29 },
        fileIds: ['file-db-1'],
        timestamp: '1 hour ago',
      },
      {
        id: 'commit-db-2',
        sha: 'a7b8c9d',
        message: 'feat(db): add V3 migration for performance indexes',
        author: 'Implementer',
        authorType: 'agent',
        agentId: 'impl-1',
        repositoryId: 'repo-order-service',
        worktreeId: 'wt-db-migration',
        filesChanged: 1,
        additions: 22,
        deletions: 0,
        cost: { inputTokens: 18000, outputTokens: 2500, toolCalls: 4, totalCost: 0.23 },
        fileIds: ['file-db-2'],
        timestamp: '55 min ago',
      },
    ],

    fileChanges: [
      {
        id: 'file-db-1',
        path: 'src/main/resources/db/migration/',
        filename: 'V2__add_orders_table.sql',
        repositoryId: 'repo-order-service',
        worktreeId: 'wt-db-migration',
        changeType: 'added',
        additions: 45,
        deletions: 0,
        agentId: 'impl-1',
        commitShas: ['f6a7b8c'],
      },
      {
        id: 'file-db-2',
        path: 'src/main/resources/db/migration/',
        filename: 'V3__add_orders_indexes.sql',
        repositoryId: 'repo-order-service',
        worktreeId: 'wt-db-migration',
        changeType: 'added',
        additions: 22,
        deletions: 0,
        agentId: 'impl-1',
        commitShas: ['a7b8c9d'],
      },
    ],

    dependsOn: [],
    blocks: [],

    affectedServices: ['svc-order', 'svc-database'],

    createdAt: '1.5 hours ago',
    startedAt: '1.5 hours ago',
  },

  // Task 4: Done task (for "Done" column)
  {
    id: 'ORD-138',
    title: 'Set up Spring Data JPA repositories for Order aggregate',
    description: 'Create OrderRepository interface extending JpaRepository with custom query methods.',

    // User's original request
    userPrompt: 'Create Spring Data JPA repositories for the Order entities with custom query methods for common use cases.',
    context: 'Need repository layer for Order and LineItem entities before we can implement the service layer.',

    // AI-generated specification (approved and completed)
    specification: {
      status: 'approved',
      generatedAt: '3 hours ago',

      summary: 'Create OrderRepository and LineItemRepository interfaces extending JpaRepository with custom query methods, including JOIN FETCH query to prevent N+1 problems and aggregate queries for calculations.',

      technicalApproach: {
        repositories: ['repo-order-service'],
        components: [
          'OrderRepository.java',
          'LineItemRepository.java',
        ],
        design: 'Use Spring Data JPA repository pattern with: (1) Method name query derivation for simple queries (findByCustomerId), (2) @Query with JOIN FETCH for eager loading related entities, (3) Aggregate functions for database-side calculations (SUM for order totals), (4) Proper use of @Param annotations for named parameters.',
      },

      acceptanceCriteria: [
        {
          id: 'ac-repo-1',
          description: 'OrderRepository extends JpaRepository',
          completed: true,
          completedAt: '2.5 hours ago',
          verifiedBy: 'agent',
        },
        {
          id: 'ac-repo-2',
          description: 'findByCustomerId query method works correctly',
          completed: true,
          completedAt: '2.3 hours ago',
          verifiedBy: 'agent',
        },
        {
          id: 'ac-repo-3',
          description: 'JOIN FETCH query prevents N+1 problem',
          completed: true,
          completedAt: '2.1 hours ago',
          verifiedBy: 'agent',
        },
        {
          id: 'ac-repo-4',
          description: 'LineItemRepository has aggregate query for totals',
          completed: true,
          completedAt: '1.8 hours ago',
          verifiedBy: 'agent',
        },
        {
          id: 'ac-repo-5',
          description: 'All tests pass',
          completed: true,
          completedAt: '1.5 hours ago',
          verifiedBy: 'agent',
        },
      ],

      estimatedScope: {
        files: 3,
        complexity: 'simple',
        estimatedCost: 2.5,
      },

      dependencies: {
        requires: ['Spring Data JPA', 'Order entity (ORD-137)'],
      },

      risks: [],

      approvedAt: '3 hours ago',
      approvedBy: 'user',
    },

    status: 'done',
    priority: 'medium',
    tags: ['feature', 'backend'],

    teamId: 'team-backend',
    agents: [
      {
        agentId: 'impl-1',
        role: 'completed',
        stage: 'Implementation',
        isActive: false,
        contribution: {
          commits: 2,
          filesChanged: 3,
          linesAdded: 123,
          linesRemoved: 12,
          cost: 1.42,
        },
      },
    ],

    pipeline: [
      { id: 'design', name: 'Design', status: 'completed', agentId: 'arch-1', completedAt: '3 hours ago', cost: 0.45 },
      { id: 'impl', name: 'Implementation', status: 'completed', agentId: 'impl-1', completedAt: '2 hours ago', cost: 0.97 },
      { id: 'test', name: 'Testing', status: 'completed', agentId: 'test-1', completedAt: '1.5 hours ago', cost: 0.58 },
      { id: 'review', name: 'Code Review', status: 'completed', agentId: 'rev-1', completedAt: '1 hour ago', cost: 0.32 },
    ],
    currentStage: 'Completed',

    progress: 100,
    totalCost: 2.32,

    worktrees: [
      {
        id: 'wt-repository-setup',
        repositoryId: 'repo-order-service',
        branch: 'feature/repository-setup',
        baseBranch: 'main',
        path: '/worktrees/repository-setup',
        status: 'merged',
        fileChanges: [],
        commits: [],
        createdAt: '3 hours ago',
        updatedAt: '1 hour ago',
      },
    ],

    commits: [
      {
        id: 'commit-repo-1',
        sha: 'f9a3b1c',
        message: 'feat(repo): add OrderRepository with custom queries',
        author: 'Implementer',
        authorType: 'agent',
        agentId: 'impl-1',
        repositoryId: 'repo-order-service',
        worktreeId: 'wt-repository-setup',
        filesChanged: 2,
        additions: 89,
        deletions: 0,
        cost: { inputTokens: 35000, outputTokens: 4800, toolCalls: 10, totalCost: 0.48 },
        fileIds: ['file-repo-1', 'file-repo-2'],
        timestamp: '2.5 hours ago',
      },
    ],

    fileChanges: [
      {
        id: 'file-repo-1',
        path: 'src/main/java/com/acme/orders/repository/',
        filename: 'OrderRepository.java',
        repositoryId: 'repo-order-service',
        worktreeId: 'wt-repository-setup',
        changeType: 'added',
        additions: 64,
        deletions: 0,
        agentId: 'impl-1',
        commitShas: ['f9a3b1c'],
      },
      {
        id: 'file-repo-2',
        path: 'src/main/java/com/acme/orders/repository/',
        filename: 'LineItemRepository.java',
        repositoryId: 'repo-order-service',
        worktreeId: 'wt-repository-setup',
        changeType: 'added',
        additions: 25,
        deletions: 0,
        agentId: 'impl-1',
        commitShas: ['f9a3b1c'],
      },
    ],

    dependsOn: [],
    blocks: [],

    affectedServices: ['svc-order', 'svc-user'],

    createdAt: '3 hours ago',
    startedAt: '3 hours ago',
    completedAt: '1 hour ago',
  },

  // Task 5: Backlog task
  {
    id: 'ORD-145',
    title: 'Write repository integration tests with Testcontainers',
    description: 'Create integration tests for OrderRepository using Testcontainers with PostgreSQL.',

    // User's original request
    userPrompt: 'Write comprehensive integration tests for OrderRepository and LineItemRepository using Testcontainers to spin up a real PostgreSQL database.',
    context: 'We need proper integration tests that run against a real database to catch issues that unit tests with mocks would miss.',

    // No specification yet - will be generated when task moves to in-progress

    status: 'backlog',
    priority: 'high',
    tags: ['testing'],

    teamId: 'team-backend',
    agents: [],

    pipeline: [
      { id: 'impl', name: 'Implementation', status: 'pending', cost: 0 },
      { id: 'review', name: 'Code Review', status: 'pending', cost: 0 },
    ],
    currentStage: 'Not Started',

    progress: 0,
    totalCost: 0,

    worktrees: [],
    commits: [],
    fileChanges: [],

    dependsOn: ['ORD-142'],
    blocks: [],

    affectedServices: ['svc-order'],

    createdAt: '1 day ago',
  },

  // Task 6: Task with specification pending approval
  {
    id: 'AUTH-102',
    title: 'Add OAuth2 social login (Google, GitHub)',
    description: 'Extend authentication system to support OAuth2 login via Google and GitHub providers.',

    // User's original request
    userPrompt: 'Add social login with Google and GitHub to make sign-up easier for users. Should integrate with our existing JWT auth system.',
    context: 'Marketing team says social login increases conversion by 40%. Needs to work seamlessly with existing auth flow from AUTH-101.',
    linkedTicket: {
      url: 'https://linear.app/acme/issue/AUTH-102',
      system: 'linear',
      externalId: 'AUTH-102',
    },

    // AI-generated specification (PENDING APPROVAL)
    specification: {
      status: 'pending_approval',
      generatedAt: '15 minutes ago',

      summary: 'Implement OAuth2 authentication flow using Spring Security OAuth2 client for backend and a unified social login component for frontend. Use JWT as the final token format after OAuth2 exchange completes.',

      technicalApproach: {
        repositories: ['repo-api-gateway', 'repo-frontend', 'repo-shared-types'],
        components: [
          'OAuth2Config.java (gateway config)',
          'OAuth2SuccessHandler.java (gateway handler)',
          'SocialLoginButton.tsx (frontend component)',
          'oauth.ts (shared types)',
        ],
        design: 'Use Spring Security OAuth2 client to handle provider redirects and token exchange. After successful OAuth2 authentication, issue our own JWT tokens to maintain consistency with existing auth. Frontend provides social login buttons that redirect to /oauth2/authorize/{provider}. Store OAuth2 user info in User table with provider field.',
      },

      acceptanceCriteria: [
        {
          id: 'ac-oauth-1',
          description: 'Google OAuth2 login works end-to-end',
          completed: false,
        },
        {
          id: 'ac-oauth-2',
          description: 'GitHub OAuth2 login works end-to-end',
          completed: false,
        },
        {
          id: 'ac-oauth-3',
          description: 'OAuth2 users receive JWT tokens after authentication',
          completed: false,
        },
        {
          id: 'ac-oauth-4',
          description: 'Existing JWT auth flow continues to work',
          completed: false,
        },
        {
          id: 'ac-oauth-5',
          description: 'User accounts linked correctly (no duplicates)',
          completed: false,
        },
      ],

      estimatedScope: {
        files: 8,
        complexity: 'complex',
        estimatedCost: 12.5,
      },

      dependencies: {
        blockedBy: ['AUTH-101'],
        requires: [
          'Spring Security OAuth2 Client',
          'Google OAuth2 credentials',
          'GitHub OAuth App credentials',
        ],
      },

      risks: [
        'OAuth2 redirect flow could conflict with existing JWT filter',
        'Account linking logic could create duplicate users',
        'Provider token expiry handling needs careful design',
        'CSRF protection required for OAuth2 callback endpoint',
      ],
    },

    status: 'planning',
    priority: 'high',
    tags: ['feature', 'security', 'api'],

    teamId: 'team-backend',
    agents: [],

    pipeline: [
      { id: 'design', name: 'Design', status: 'pending', cost: 0 },
      { id: 'impl', name: 'Implementation', status: 'pending', cost: 0 },
      { id: 'test', name: 'Testing', status: 'pending', cost: 0 },
    ],
    currentStage: 'Awaiting Spec Approval',

    progress: 0,
    totalCost: 0,

    worktrees: [],
    commits: [],
    fileChanges: [],

    dependsOn: ['AUTH-101'],
    blocks: [],

    affectedServices: ['svc-auth', 'svc-user'],

    createdAt: '30 minutes ago',
  },
];

// =============================================================================
// COST & BUDGET DATA
// =============================================================================

export const agentCosts: AgentCost[] = [
  {
    agentId: 'impl-1',
    inputTokens: 1140000,
    outputTokens: 126000,
    toolCalls: 45,
    inputCost: 3.42,
    outputCost: 1.89,
    toolCost: 0.12,
    totalCost: 5.43,
    efficiency: 'excellent',
  },
  {
    agentId: 'arch-1',
    inputTokens: 726667,
    outputTokens: 82667,
    toolCalls: 30,
    inputCost: 2.18,
    outputCost: 1.24,
    toolCost: 0.08,
    totalCost: 3.5,
    efficiency: 'good',
  },
  {
    agentId: 'test-1',
    inputTokens: 350000,
    outputTokens: 61333,
    toolCalls: 128,
    inputCost: 1.05,
    outputCost: 0.92,
    toolCost: 0.34,
    totalCost: 2.31,
    efficiency: 'fair',
  },
  {
    agentId: 'rev-1',
    inputTokens: 140000,
    outputTokens: 18667,
    toolCalls: 8,
    inputCost: 0.42,
    outputCost: 0.28,
    toolCost: 0.02,
    totalCost: 0.72,
    efficiency: 'excellent',
  },
  {
    agentId: 'docs-1',
    inputTokens: 106667,
    outputTokens: 10000,
    toolCalls: 15,
    inputCost: 0.32,
    outputCost: 0.15,
    toolCost: 0.04,
    totalCost: 0.51,
    efficiency: 'excellent',
  },
];

export const budgets: Budget[] = [
  { name: 'Daily Budget', current: 12.47, limit: 50, resetIn: '8h' },
  { name: 'Session Budget', current: 7.15, limit: 25 },
  { name: 'Monthly Budget', current: 247.82, limit: 500, daysLeft: 19 },
];

export const modelPricing: ModelPricing[] = [
  { name: 'Claude Sonnet 4', inputPer1M: 3, outputPer1M: 15, color: '#a371f7' },
  { name: 'Claude Haiku 4', inputPer1M: 0.25, outputPer1M: 1.25, color: '#58a6ff' },
  { name: 'Claude Opus 4', inputPer1M: 15, outputPer1M: 75, color: '#d29922' },
];

export const defaultAgentConfig: AgentConfig = {
  model: 'claude-sonnet-4',
  temperature: 0.2,
  maxOutputTokens: 8192,
  extendedThinking: true,
  autonomyLevel: 'balanced',
  autoCommit: true,
  runTestsAfterChanges: true,
  maxIterations: 5,
  permissions: {
    fileSystem: 'full',
    terminal: 'ask',
    git: 'allowlist',
    web: 'allowlist',
  },
};

export const sessionStats = {
  totalCost: 12.07,
  totalTokens: 2463334,
  projectName: 'acme-commerce',
  activeBranch: 'feature/order-service',
  activeWorktrees: 3,
};

// =============================================================================
// PROJECT - Top-level container
// =============================================================================

export const project: Project = {
  id: 'proj-acme',
  name: 'acme-commerce',
  description: 'E-commerce platform with microservices architecture',
  repositories,
  teams,
  agents,
  budgets,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getTaskByIdV2(id: string): TaskV2 | undefined {
  return tasksV2.find(t => t.id === id);
}

export function getRepositoryById(id: string): Repository | undefined {
  return repositories.find(r => r.id === id);
}

export function getTaskByWorktreeId(wtId: string): TaskV2 | undefined {
  return tasksV2.find(t => t.worktrees.some(w => w.id === wtId));
}

export function getAgentByIdV2(id: string): Agent | undefined {
  return agents.find(a => a.id === id);
}

export function getTeamByIdV2(id: string): Team | undefined {
  return teams.find(t => t.id === id);
}

export function getCommitsForTask(taskId: string): TaskCommit[] {
  const task = getTaskByIdV2(taskId);
  return task?.commits || [];
}

export function getFileChangesForTask(taskId: string): TaskFileChange[] {
  const task = getTaskByIdV2(taskId);
  return task?.fileChanges || [];
}

export function getActiveTasksV2(): TaskV2[] {
  return tasksV2.filter(t => t.status === 'in-progress' || t.status === 'review');
}

// =============================================================================
// VALIDATION FUNCTION
// =============================================================================

export function validateV2Data(): boolean {
  const errors: string[] = [];

  // Validate repository references
  tasksV2.forEach(task => {
    task.worktrees.forEach(wt => {
      if (!repositories.find(r => r.id === wt.repositoryId)) {
        errors.push(`Task ${task.id}: Invalid repositoryId ${wt.repositoryId} in worktree ${wt.id}`);
      }
    });

    task.commits.forEach(commit => {
      if (!repositories.find(r => r.id === commit.repositoryId)) {
        errors.push(`Task ${task.id}: Invalid repositoryId ${commit.repositoryId} in commit ${commit.sha}`);
      }
    });

    task.fileChanges.forEach(file => {
      if (!repositories.find(r => r.id === file.repositoryId)) {
        errors.push(`Task ${task.id}: Invalid repositoryId ${file.repositoryId} in file ${file.filename}`);
      }
    });
  });

  // Validate team references
  tasksV2.forEach(task => {
    if (!teams.find(t => t.id === task.teamId)) {
      errors.push(`Task ${task.id}: Invalid teamId ${task.teamId}`);
    }
  });

  // Validate agent references
  tasksV2.forEach(task => {
    task.agents.forEach(agent => {
      if (!agents.find(a => a.id === agent.agentId)) {
        errors.push(`Task ${task.id}: Invalid agentId ${agent.agentId}`);
      }
    });
  });

  // Validate commit fileIds
  tasksV2.forEach(task => {
    task.commits.forEach(commit => {
      if (!commit.fileIds || commit.fileIds.length === 0) {
        errors.push(`Task ${task.id}: Commit ${commit.sha} has no fileIds`);
      } else {
        commit.fileIds.forEach(fileId => {
          if (!task.fileChanges.find(f => f.id === fileId)) {
            errors.push(`Task ${task.id}: Commit ${commit.sha} references non-existent fileId ${fileId}`);
          }
        });
      }
    });
  });

  // Validate fileDiffs existence
  tasksV2.forEach(task => {
    task.fileChanges.forEach(file => {
      if (!fileDiffs[file.filename]) {
        errors.push(`Task ${task.id}: File ${file.filename} has no fileDiff data`);
      }
    });
  });

  // Validate fileDiffs have reasoning
  Object.entries(fileDiffs).forEach(([filename, diff]) => {
    if (!diff.reasoning || diff.reasoning.length === 0) {
      errors.push(`File ${filename} has no reasoning`);
    }
  });

  // Log results
  if (errors.length > 0) {
    console.error('❌ V2 Data Validation Failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    return false;
  }

  console.log('✅ V2 Data Validation Passed');
  console.log(`  - ${repositories.length} repositories`);
  console.log(`  - ${tasksV2.length} tasks`);
  console.log(`  - ${teams.length} teams`);
  console.log(`  - ${agents.length} agents`);
  console.log(`  - ${Object.keys(fileDiffs).length} file diffs with reasoning`);

  return true;
}

// =============================================================================
// FILE DIFFS - Diff content for all file changes
// =============================================================================

export const fileDiffs: Record<string, FileDiff> = {
  'OrderService.java': {
    fileChange: {
      path: 'src/main/java/com/acme/orders/service/',
      filename: 'OrderService.java',
      changeType: 'modified',
      additions: 127,
      deletions: 23,
      agentId: 'impl-1',
    },
    hunks: [
      {
        range: '@@ -23,6 +23,42 @@',
        context: 'class OrderService',
        lines: [
          { lineNumber: 23, type: 'context', content: '@Service' },
          { lineNumber: 24, type: 'context', content: '@Transactional' },
          { lineNumber: 25, type: 'context', content: 'public class OrderService {' },
          { lineNumber: 26, type: 'context', content: '' },
          { lineNumber: 27, type: 'add', content: '    private final OrderRepository orderRepository;' },
          { lineNumber: 28, type: 'add', content: '    private final CustomerRepository customerRepository;' },
          { lineNumber: 29, type: 'add', content: '    private final InventoryService inventoryService;' },
          { lineNumber: 30, type: 'add', content: '    private final ApplicationEventPublisher eventPublisher;' },
          { lineNumber: 31, type: 'add', content: '' },
          { lineNumber: 32, type: 'add', content: '    public OrderService(' },
          { lineNumber: 33, type: 'add', content: '            OrderRepository orderRepository,' },
          { lineNumber: 34, type: 'add', content: '            CustomerRepository customerRepository,' },
          { lineNumber: 35, type: 'add', content: '            InventoryService inventoryService,' },
          { lineNumber: 36, type: 'add', content: '            ApplicationEventPublisher eventPublisher) {' },
          { lineNumber: 37, type: 'add', content: '        this.orderRepository = orderRepository;' },
          { lineNumber: 38, type: 'add', content: '        this.customerRepository = customerRepository;' },
          { lineNumber: 39, type: 'add', content: '        this.inventoryService = inventoryService;' },
          { lineNumber: 40, type: 'add', content: '        this.eventPublisher = eventPublisher;' },
          { lineNumber: 41, type: 'add', content: '    }' },
          { lineNumber: 42, type: 'context', content: '' },
          { lineNumber: 43, type: 'del', content: '    @Autowired' },
          { lineNumber: 44, type: 'del', content: '    private OrderRepository orderRepository;' },
        ],
      },
    ],
    reasoning: [
      {
        type: 'decision',
        title: 'Use constructor injection over field injection',
        description: 'Constructor injection makes dependencies explicit and immutable, enables easier testing with mocks, and allows the class to be instantiated without Spring context.',
        rejected: {
          title: 'Using @Autowired on fields',
          reason: 'Field injection hides dependencies, makes testing harder, and allows partial initialization of objects.',
        },
      },
      {
        type: 'rationale',
        title: 'Domain event for order creation',
        description: 'Publishing domain events via ApplicationEventPublisher decouples the order service from downstream processes like inventory reservation and notification sending.',
      },
    ],
  },

  'Order.java': {
    fileChange: {
      path: 'src/main/java/com/acme/orders/entity/',
      filename: 'Order.java',
      changeType: 'added',
      additions: 89,
      deletions: 0,
      agentId: 'impl-1',
    },
    hunks: [
      {
        range: '@@ -0,0 +1,89 @@',
        context: 'new file',
        lines: [
          { lineNumber: 1, type: 'add', content: 'package com.acme.orders.entity;' },
          { lineNumber: 2, type: 'add', content: '' },
          { lineNumber: 3, type: 'add', content: 'import lombok.*;' },
          { lineNumber: 4, type: 'add', content: 'import javax.persistence.*;' },
          { lineNumber: 5, type: 'add', content: 'import java.math.BigDecimal;' },
          { lineNumber: 6, type: 'add', content: 'import java.time.Instant;' },
          { lineNumber: 7, type: 'add', content: 'import java.util.ArrayList;' },
          { lineNumber: 8, type: 'add', content: 'import java.util.List;' },
          { lineNumber: 9, type: 'add', content: '' },
          { lineNumber: 10, type: 'add', content: '@Entity' },
          { lineNumber: 11, type: 'add', content: '@Table(name = "orders")' },
          { lineNumber: 12, type: 'add', content: '@Data' },
          { lineNumber: 13, type: 'add', content: '@Builder' },
          { lineNumber: 14, type: 'add', content: '@NoArgsConstructor' },
          { lineNumber: 15, type: 'add', content: '@AllArgsConstructor' },
          { lineNumber: 16, type: 'add', content: 'public class Order {' },
          { lineNumber: 17, type: 'add', content: '' },
          { lineNumber: 18, type: 'add', content: '    @Id' },
          { lineNumber: 19, type: 'add', content: '    @GeneratedValue(strategy = GenerationType.IDENTITY)' },
          { lineNumber: 20, type: 'add', content: '    private Long id;' },
          { lineNumber: 21, type: 'add', content: '' },
          { lineNumber: 22, type: 'add', content: '    @ManyToOne(fetch = FetchType.LAZY)' },
          { lineNumber: 23, type: 'add', content: '    @JoinColumn(name = "customer_id", nullable = false)' },
          { lineNumber: 24, type: 'add', content: '    private Customer customer;' },
          { lineNumber: 25, type: 'add', content: '' },
          { lineNumber: 26, type: 'add', content: '    @Enumerated(EnumType.STRING)' },
          { lineNumber: 27, type: 'add', content: '    @Column(nullable = false)' },
          { lineNumber: 28, type: 'add', content: '    private OrderStatus status;' },
          { lineNumber: 29, type: 'add', content: '' },
          { lineNumber: 30, type: 'add', content: '    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)' },
          { lineNumber: 31, type: 'add', content: '    @Builder.Default' },
          { lineNumber: 32, type: 'add', content: '    private List<OrderLineItem> lineItems = new ArrayList<>();' },
          { lineNumber: 33, type: 'add', content: '' },
          { lineNumber: 34, type: 'add', content: '    private BigDecimal totalAmount;' },
          { lineNumber: 35, type: 'add', content: '' },
          { lineNumber: 36, type: 'add', content: '    @Column(nullable = false)' },
          { lineNumber: 37, type: 'add', content: '    private Instant createdAt;' },
          { lineNumber: 38, type: 'add', content: '}' },
        ],
      },
    ],
    reasoning: [
      {
        type: 'decision',
        title: 'Use LAZY fetching for Customer relation',
        description: 'LAZY fetch prevents N+1 query problems when loading multiple orders. Customer data is only loaded when explicitly accessed, improving query performance.',
        rejected: {
          title: 'Use EAGER fetching',
          reason: 'EAGER loading would fetch customer data even when not needed, causing unnecessary database queries and memory overhead.',
        },
      },
      {
        type: 'rationale',
        title: 'Bidirectional OneToMany with cascade',
        description: 'CascadeType.ALL on lineItems ensures that when an Order is persisted or deleted, its line items are automatically managed, maintaining referential integrity.',
      },
    ],
  },

  'OrderLineItem.java': {
    fileChange: {
      path: 'src/main/java/com/acme/orders/entity/',
      filename: 'OrderLineItem.java',
      changeType: 'added',
      additions: 45,
      deletions: 0,
      agentId: 'impl-1',
    },
    hunks: [
      {
        range: '@@ -0,0 +1,45 @@',
        context: 'new file',
        lines: [
          { lineNumber: 1, type: 'add', content: 'package com.acme.orders.entity;' },
          { lineNumber: 2, type: 'add', content: '' },
          { lineNumber: 3, type: 'add', content: 'import lombok.*;' },
          { lineNumber: 4, type: 'add', content: 'import javax.persistence.*;' },
          { lineNumber: 5, type: 'add', content: 'import java.math.BigDecimal;' },
          { lineNumber: 6, type: 'add', content: '' },
          { lineNumber: 7, type: 'add', content: '@Entity' },
          { lineNumber: 8, type: 'add', content: '@Table(name = "order_line_items")' },
          { lineNumber: 9, type: 'add', content: '@Data' },
          { lineNumber: 10, type: 'add', content: '@Builder' },
          { lineNumber: 11, type: 'add', content: '@NoArgsConstructor' },
          { lineNumber: 12, type: 'add', content: '@AllArgsConstructor' },
          { lineNumber: 13, type: 'add', content: 'public class OrderLineItem {' },
          { lineNumber: 14, type: 'add', content: '' },
          { lineNumber: 15, type: 'add', content: '    @Id' },
          { lineNumber: 16, type: 'add', content: '    @GeneratedValue(strategy = GenerationType.IDENTITY)' },
          { lineNumber: 17, type: 'add', content: '    private Long id;' },
          { lineNumber: 18, type: 'add', content: '' },
          { lineNumber: 19, type: 'add', content: '    @ManyToOne(fetch = FetchType.LAZY)' },
          { lineNumber: 20, type: 'add', content: '    @JoinColumn(name = "order_id")' },
          { lineNumber: 21, type: 'add', content: '    private Order order;' },
          { lineNumber: 22, type: 'add', content: '' },
          { lineNumber: 23, type: 'add', content: '    @Column(nullable = false)' },
          { lineNumber: 24, type: 'add', content: '    private String productId;' },
          { lineNumber: 25, type: 'add', content: '' },
          { lineNumber: 26, type: 'add', content: '    @Column(nullable = false)' },
          { lineNumber: 27, type: 'add', content: '    private Integer quantity;' },
          { lineNumber: 28, type: 'add', content: '' },
          { lineNumber: 29, type: 'add', content: '    @Column(nullable = false)' },
          { lineNumber: 30, type: 'add', content: '    private BigDecimal unitPrice;' },
          { lineNumber: 31, type: 'add', content: '' },
          { lineNumber: 32, type: 'add', content: '    @Column(nullable = false)' },
          { lineNumber: 33, type: 'add', content: '    private BigDecimal subtotal;' },
          { lineNumber: 34, type: 'add', content: '}' },
        ],
      },
    ],
    reasoning: [
      {
        type: 'rationale',
        title: 'Separate line item entity',
        description: 'Extracting line items into a separate entity enables querying and aggregating order items independently, supports normalized data, and allows for efficient updates to individual line items.',
      },
    ],
  },

  'auth.ts': {
    fileChange: {
      path: 'src/types/',
      filename: 'auth.ts',
      changeType: 'added',
      additions: 45,
      deletions: 0,
      agentId: 'arch-1',
    },
    hunks: [
      {
        range: '@@ -0,0 +1,45 @@',
        context: 'new file',
        lines: [
          { lineNumber: 1, type: 'add', content: 'export interface AuthToken {' },
          { lineNumber: 2, type: 'add', content: '  accessToken: string;' },
          { lineNumber: 3, type: 'add', content: '  refreshToken: string;' },
          { lineNumber: 4, type: 'add', content: '  expiresIn: number;' },
          { lineNumber: 5, type: 'add', content: '  tokenType: "Bearer";' },
          { lineNumber: 6, type: 'add', content: '}' },
          { lineNumber: 7, type: 'add', content: '' },
          { lineNumber: 8, type: 'add', content: 'export interface AuthCredentials {' },
          { lineNumber: 9, type: 'add', content: '  email: string;' },
          { lineNumber: 10, type: 'add', content: '  password: string;' },
          { lineNumber: 11, type: 'add', content: '}' },
          { lineNumber: 12, type: 'add', content: '' },
          { lineNumber: 13, type: 'add', content: 'export interface AuthContext {' },
          { lineNumber: 14, type: 'add', content: '  user: User | null;' },
          { lineNumber: 15, type: 'add', content: '  isAuthenticated: boolean;' },
          { lineNumber: 16, type: 'add', content: '  isLoading: boolean;' },
          { lineNumber: 17, type: 'add', content: '  login: (credentials: AuthCredentials) => Promise<void>;' },
          { lineNumber: 18, type: 'add', content: '  logout: () => void;' },
          { lineNumber: 19, type: 'add', content: '  refreshAuth: () => Promise<void>;' },
          { lineNumber: 20, type: 'add', content: '}' },
        ],
      },
    ],
    reasoning: [
      {
        type: 'decision',
        title: 'Separate access and refresh tokens',
        description: 'Using separate tokens enables short-lived access tokens for security while allowing long-lived sessions through refresh tokens. Access tokens expire quickly, limiting the window of vulnerability.',
        rejected: {
          title: 'Single long-lived token',
          reason: 'Single tokens with long expiry increase security risk if compromised and make token revocation more difficult.',
        },
      },
      {
        type: 'rationale',
        title: 'Shared auth types package',
        description: 'Centralizing auth types in shared-types package ensures consistency across frontend, gateway, and auth service, preventing type mismatches and API contract violations.',
      },
    ],
  },

  'user.ts': {
    fileChange: {
      path: 'src/types/',
      filename: 'user.ts',
      changeType: 'added',
      additions: 32,
      deletions: 0,
      agentId: 'arch-1',
    },
    hunks: [
      {
        range: '@@ -0,0 +1,32 @@',
        context: 'new file',
        lines: [
          { lineNumber: 1, type: 'add', content: 'export interface User {' },
          { lineNumber: 2, type: 'add', content: '  id: string;' },
          { lineNumber: 3, type: 'add', content: '  email: string;' },
          { lineNumber: 4, type: 'add', content: '  name: string;' },
          { lineNumber: 5, type: 'add', content: '  role: UserRole;' },
          { lineNumber: 6, type: 'add', content: '  permissions: string[];' },
          { lineNumber: 7, type: 'add', content: '  createdAt: string;' },
          { lineNumber: 8, type: 'add', content: '}' },
          { lineNumber: 9, type: 'add', content: '' },
          { lineNumber: 10, type: 'add', content: 'export enum UserRole {' },
          { lineNumber: 11, type: 'add', content: '  ADMIN = "admin",' },
          { lineNumber: 12, type: 'add', content: '  USER = "user",' },
          { lineNumber: 13, type: 'add', content: '  GUEST = "guest",' },
          { lineNumber: 14, type: 'add', content: '}' },
        ],
      },
    ],
    reasoning: [
      {
        type: 'rationale',
        title: 'Role-based access control',
        description: 'Using UserRole enum with permissions array enables flexible RBAC. Permissions provide fine-grained control while roles group common permission sets.',
      },
    ],
  },

  'JwtFilter.java': {
    fileChange: {
      path: 'src/main/java/com/acme/gateway/filter/',
      filename: 'JwtFilter.java',
      changeType: 'added',
      additions: 78,
      deletions: 0,
      agentId: 'impl-1',
    },
    hunks: [
      {
        range: '@@ -0,0 +1,78 @@',
        context: 'new file',
        lines: [
          { lineNumber: 1, type: 'add', content: 'package com.acme.gateway.filter;' },
          { lineNumber: 2, type: 'add', content: '' },
          { lineNumber: 3, type: 'add', content: 'import org.springframework.stereotype.Component;' },
          { lineNumber: 4, type: 'add', content: 'import org.springframework.web.filter.OncePerRequestFilter;' },
          { lineNumber: 5, type: 'add', content: '' },
          { lineNumber: 6, type: 'add', content: '@Component' },
          { lineNumber: 7, type: 'add', content: 'public class JwtFilter extends OncePerRequestFilter {' },
          { lineNumber: 8, type: 'add', content: '' },
          { lineNumber: 9, type: 'add', content: '    private final JwtTokenProvider tokenProvider;' },
          { lineNumber: 10, type: 'add', content: '' },
          { lineNumber: 11, type: 'add', content: '    public JwtFilter(JwtTokenProvider tokenProvider) {' },
          { lineNumber: 12, type: 'add', content: '        this.tokenProvider = tokenProvider;' },
          { lineNumber: 13, type: 'add', content: '    }' },
          { lineNumber: 14, type: 'add', content: '' },
          { lineNumber: 15, type: 'add', content: '    @Override' },
          { lineNumber: 16, type: 'add', content: '    protected void doFilterInternal(' },
          { lineNumber: 17, type: 'add', content: '            HttpServletRequest request,' },
          { lineNumber: 18, type: 'add', content: '            HttpServletResponse response,' },
          { lineNumber: 19, type: 'add', content: '            FilterChain filterChain) throws ServletException, IOException {' },
          { lineNumber: 20, type: 'add', content: '' },
          { lineNumber: 21, type: 'add', content: '        String token = extractToken(request);' },
          { lineNumber: 22, type: 'add', content: '        if (token != null && tokenProvider.validateToken(token)) {' },
          { lineNumber: 23, type: 'add', content: '            String userId = tokenProvider.getUserId(token);' },
          { lineNumber: 24, type: 'add', content: '            request.setAttribute("userId", userId);' },
          { lineNumber: 25, type: 'add', content: '        }' },
          { lineNumber: 26, type: 'add', content: '        filterChain.doFilter(request, response);' },
          { lineNumber: 27, type: 'add', content: '    }' },
          { lineNumber: 28, type: 'add', content: '}' },
        ],
      },
    ],
    reasoning: [
      {
        type: 'decision',
        title: 'Extend OncePerRequestFilter',
        description: 'OncePerRequestFilter ensures the JWT validation logic runs exactly once per request, even with request forwarding or error handling, preventing duplicate validation overhead.',
        rejected: {
          title: 'Implement Filter directly',
          reason: 'Raw Filter interface requires manual handling of filter invocation semantics and doesn\'t guarantee single execution per request.',
        },
      },
    ],
  },

  'LoginForm.tsx': {
    fileChange: {
      path: 'src/components/auth/',
      filename: 'LoginForm.tsx',
      changeType: 'added',
      additions: 67,
      deletions: 0,
      agentId: 'impl-1',
    },
    hunks: [
      {
        range: '@@ -0,0 +1,67 @@',
        context: 'new file',
        lines: [
          { lineNumber: 1, type: 'add', content: 'import { useState } from "react";' },
          { lineNumber: 2, type: 'add', content: 'import { useAuth } from "@/hooks/useAuth";' },
          { lineNumber: 3, type: 'add', content: '' },
          { lineNumber: 4, type: 'add', content: 'export function LoginForm() {' },
          { lineNumber: 5, type: 'add', content: '  const { login, isLoading } = useAuth();' },
          { lineNumber: 6, type: 'add', content: '  const [email, setEmail] = useState("");' },
          { lineNumber: 7, type: 'add', content: '  const [password, setPassword] = useState("");' },
          { lineNumber: 8, type: 'add', content: '  const [error, setError] = useState<string | null>(null);' },
          { lineNumber: 9, type: 'add', content: '' },
          { lineNumber: 10, type: 'add', content: '  const handleSubmit = async (e: React.FormEvent) => {' },
          { lineNumber: 11, type: 'add', content: '    e.preventDefault();' },
          { lineNumber: 12, type: 'add', content: '    setError(null);' },
          { lineNumber: 13, type: 'add', content: '    try {' },
          { lineNumber: 14, type: 'add', content: '      await login({ email, password });' },
          { lineNumber: 15, type: 'add', content: '    } catch (err) {' },
          { lineNumber: 16, type: 'add', content: '      setError("Invalid credentials");' },
          { lineNumber: 17, type: 'add', content: '    }' },
          { lineNumber: 18, type: 'add', content: '  };' },
          { lineNumber: 19, type: 'add', content: '' },
          { lineNumber: 20, type: 'add', content: '  return (' },
          { lineNumber: 21, type: 'add', content: '    <form onSubmit={handleSubmit}>' },
          { lineNumber: 22, type: 'add', content: '      {error && <div className="error">{error}</div>}' },
          { lineNumber: 23, type: 'add', content: '      <input' },
          { lineNumber: 24, type: 'add', content: '        type="email"' },
          { lineNumber: 25, type: 'add', content: '        value={email}' },
          { lineNumber: 26, type: 'add', content: '        onChange={(e) => setEmail(e.target.value)}' },
          { lineNumber: 27, type: 'add', content: '        placeholder="Email"' },
          { lineNumber: 28, type: 'add', content: '      />' },
          { lineNumber: 29, type: 'add', content: '      <input' },
          { lineNumber: 30, type: 'add', content: '        type="password"' },
          { lineNumber: 31, type: 'add', content: '        value={password}' },
          { lineNumber: 32, type: 'add', content: '        onChange={(e) => setPassword(e.target.value)}' },
          { lineNumber: 33, type: 'add', content: '        placeholder="Password"' },
          { lineNumber: 34, type: 'add', content: '      />' },
          { lineNumber: 35, type: 'add', content: '      <button type="submit" disabled={isLoading}>' },
          { lineNumber: 36, type: 'add', content: '        {isLoading ? "Logging in..." : "Login"}' },
          { lineNumber: 37, type: 'add', content: '      </button>' },
          { lineNumber: 38, type: 'add', content: '    </form>' },
          { lineNumber: 39, type: 'add', content: '  );' },
          { lineNumber: 40, type: 'add', content: '}' },
        ],
      },
    ],
    reasoning: [
      {
        type: 'rationale',
        title: 'Local error state for user feedback',
        description: 'Maintaining error state in the component allows displaying validation and authentication errors directly in the form, providing immediate feedback without navigating away.',
      },
    ],
  },

  'useAuth.ts': {
    fileChange: {
      path: 'src/hooks/',
      filename: 'useAuth.ts',
      changeType: 'added',
      additions: 56,
      deletions: 0,
      agentId: 'impl-1',
    },
    hunks: [
      {
        range: '@@ -0,0 +1,56 @@',
        context: 'new file',
        lines: [
          { lineNumber: 1, type: 'add', content: 'import { createContext, useContext, useState, useEffect } from "react";' },
          { lineNumber: 2, type: 'add', content: 'import type { AuthContext, AuthCredentials, User } from "@/types/auth";' },
          { lineNumber: 3, type: 'add', content: '' },
          { lineNumber: 4, type: 'add', content: 'const AuthContextInstance = createContext<AuthContext | null>(null);' },
          { lineNumber: 5, type: 'add', content: '' },
          { lineNumber: 6, type: 'add', content: 'export function useAuth(): AuthContext {' },
          { lineNumber: 7, type: 'add', content: '  const context = useContext(AuthContextInstance);' },
          { lineNumber: 8, type: 'add', content: '  if (!context) {' },
          { lineNumber: 9, type: 'add', content: '    throw new Error("useAuth must be used within AuthProvider");' },
          { lineNumber: 10, type: 'add', content: '  }' },
          { lineNumber: 11, type: 'add', content: '  return context;' },
          { lineNumber: 12, type: 'add', content: '}' },
          { lineNumber: 13, type: 'add', content: '' },
          { lineNumber: 14, type: 'add', content: 'export function AuthProvider({ children }: { children: React.ReactNode }) {' },
          { lineNumber: 15, type: 'add', content: '  const [user, setUser] = useState<User | null>(null);' },
          { lineNumber: 16, type: 'add', content: '  const [isLoading, setIsLoading] = useState(true);' },
          { lineNumber: 17, type: 'add', content: '' },
          { lineNumber: 18, type: 'add', content: '  const login = async (credentials: AuthCredentials) => {' },
          { lineNumber: 19, type: 'add', content: '    const response = await fetch("/api/auth/login", {' },
          { lineNumber: 20, type: 'add', content: '      method: "POST",' },
          { lineNumber: 21, type: 'add', content: '      body: JSON.stringify(credentials),' },
          { lineNumber: 22, type: 'add', content: '    });' },
          { lineNumber: 23, type: 'add', content: '    const data = await response.json();' },
          { lineNumber: 24, type: 'add', content: '    setUser(data.user);' },
          { lineNumber: 25, type: 'add', content: '    localStorage.setItem("accessToken", data.accessToken);' },
          { lineNumber: 26, type: 'add', content: '  };' },
          { lineNumber: 27, type: 'add', content: '' },
          { lineNumber: 28, type: 'add', content: '  const logout = () => {' },
          { lineNumber: 29, type: 'add', content: '    setUser(null);' },
          { lineNumber: 30, type: 'add', content: '    localStorage.removeItem("accessToken");' },
          { lineNumber: 31, type: 'add', content: '  };' },
          { lineNumber: 32, type: 'add', content: '' },
          { lineNumber: 33, type: 'add', content: '  return (' },
          { lineNumber: 34, type: 'add', content: '    <AuthContextInstance.Provider' },
          { lineNumber: 35, type: 'add', content: '      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}' },
          { lineNumber: 36, type: 'add', content: '    >' },
          { lineNumber: 37, type: 'add', content: '      {children}' },
          { lineNumber: 38, type: 'add', content: '    </AuthContextInstance.Provider>' },
          { lineNumber: 39, type: 'add', content: '  );' },
          { lineNumber: 40, type: 'add', content: '}' },
        ],
      },
    ],
    reasoning: [
      {
        type: 'decision',
        title: 'Context-based auth state management',
        description: 'Using React Context for auth state enables any component to access authentication status without prop drilling, centralizes auth logic, and ensures consistent state across the app.',
        rejected: {
          title: 'Component-level state',
          reason: 'Local state would require passing auth data through many component layers and maintaining duplicate state in multiple locations.',
        },
      },
    ],
  },

  'V2__add_orders_table.sql': {
    fileChange: {
      path: 'src/main/resources/db/migration/',
      filename: 'V2__add_orders_table.sql',
      changeType: 'added',
      additions: 45,
      deletions: 0,
      agentId: 'impl-1',
    },
    hunks: [
      {
        range: '@@ -0,0 +1,45 @@',
        context: 'new file',
        lines: [
          { lineNumber: 1, type: 'add', content: '-- V2: Add orders and line_items tables' },
          { lineNumber: 2, type: 'add', content: '' },
          { lineNumber: 3, type: 'add', content: 'CREATE TABLE orders (' },
          { lineNumber: 4, type: 'add', content: '    id BIGSERIAL PRIMARY KEY,' },
          { lineNumber: 5, type: 'add', content: '    customer_id BIGINT NOT NULL,' },
          { lineNumber: 6, type: 'add', content: '    status VARCHAR(50) NOT NULL,' },
          { lineNumber: 7, type: 'add', content: '    total_amount DECIMAL(19,2) NOT NULL,' },
          { lineNumber: 8, type: 'add', content: '    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,' },
          { lineNumber: 9, type: 'add', content: '    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,' },
          { lineNumber: 10, type: 'add', content: '    CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customers(id)' },
          { lineNumber: 11, type: 'add', content: ');' },
          { lineNumber: 12, type: 'add', content: '' },
          { lineNumber: 13, type: 'add', content: 'CREATE TABLE order_line_items (' },
          { lineNumber: 14, type: 'add', content: '    id BIGSERIAL PRIMARY KEY,' },
          { lineNumber: 15, type: 'add', content: '    order_id BIGINT NOT NULL,' },
          { lineNumber: 16, type: 'add', content: '    product_id VARCHAR(255) NOT NULL,' },
          { lineNumber: 17, type: 'add', content: '    quantity INTEGER NOT NULL,' },
          { lineNumber: 18, type: 'add', content: '    unit_price DECIMAL(19,2) NOT NULL,' },
          { lineNumber: 19, type: 'add', content: '    subtotal DECIMAL(19,2) NOT NULL,' },
          { lineNumber: 20, type: 'add', content: '    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE' },
          { lineNumber: 21, type: 'add', content: ');' },
        ],
      },
    ],
    reasoning: [
      {
        type: 'decision',
        title: 'Use ON DELETE CASCADE for line items',
        description: 'Cascading deletes ensure that when an order is deleted, all its line items are automatically removed, maintaining referential integrity and preventing orphaned records.',
        rejected: {
          title: 'No cascade, manual deletion',
          reason: 'Manual deletion requires application-level logic to clean up line items, increasing complexity and risk of orphaned data.',
        },
      },
      {
        type: 'rationale',
        title: 'DECIMAL type for monetary values',
        description: 'DECIMAL(19,2) prevents floating-point precision errors that could occur with FLOAT/DOUBLE, ensuring accurate financial calculations and storage of monetary amounts.',
      },
    ],
  },

  'V3__add_orders_indexes.sql': {
    fileChange: {
      path: 'src/main/resources/db/migration/',
      filename: 'V3__add_orders_indexes.sql',
      changeType: 'added',
      additions: 23,
      deletions: 0,
      agentId: 'impl-1',
    },
    hunks: [
      {
        range: '@@ -0,0 +1,23 @@',
        context: 'new file',
        lines: [
          { lineNumber: 1, type: 'add', content: '-- V3: Add indexes for orders performance' },
          { lineNumber: 2, type: 'add', content: '' },
          { lineNumber: 3, type: 'add', content: 'CREATE INDEX idx_orders_customer_id ON orders(customer_id);' },
          { lineNumber: 4, type: 'add', content: 'CREATE INDEX idx_orders_status ON orders(status);' },
          { lineNumber: 5, type: 'add', content: 'CREATE INDEX idx_orders_created_at ON orders(created_at);' },
          { lineNumber: 6, type: 'add', content: '' },
          { lineNumber: 7, type: 'add', content: 'CREATE INDEX idx_line_items_order_id ON order_line_items(order_id);' },
          { lineNumber: 8, type: 'add', content: 'CREATE INDEX idx_line_items_product_id ON order_line_items(product_id);' },
          { lineNumber: 9, type: 'add', content: '' },
          { lineNumber: 10, type: 'add', content: '-- Composite index for common query pattern' },
          { lineNumber: 11, type: 'add', content: 'CREATE INDEX idx_orders_customer_status ON orders(customer_id, status);' },
        ],
      },
    ],
    reasoning: [
      {
        type: 'rationale',
        title: 'Index on foreign keys',
        description: 'Adding indexes on customer_id and order_id foreign keys dramatically improves JOIN performance and lookup queries. Without these, queries would require full table scans.',
      },
      {
        type: 'decision',
        title: 'Composite index for customer+status',
        description: 'Common queries filter by both customer and status together (e.g., "show pending orders for customer"). Composite index enables efficient execution of these multi-column queries.',
        rejected: {
          title: 'Separate indexes only',
          reason: 'Database would need to merge results from two separate indexes, which is slower than using a single composite index.',
        },
      },
    ],
  },

  'OrderRepository.java': {
    fileChange: {
      path: 'src/main/java/com/acme/orders/repository/',
      filename: 'OrderRepository.java',
      changeType: 'added',
      additions: 64,
      deletions: 0,
      agentId: 'impl-1',
    },
    hunks: [
      {
        range: '@@ -0,0 +1,64 @@',
        context: 'new file',
        lines: [
          { lineNumber: 1, type: 'add', content: 'package com.acme.orders.repository;' },
          { lineNumber: 2, type: 'add', content: '' },
          { lineNumber: 3, type: 'add', content: 'import com.acme.orders.entity.Order;' },
          { lineNumber: 4, type: 'add', content: 'import org.springframework.data.jpa.repository.JpaRepository;' },
          { lineNumber: 5, type: 'add', content: 'import org.springframework.data.jpa.repository.Query;' },
          { lineNumber: 6, type: 'add', content: 'import org.springframework.data.repository.query.Param;' },
          { lineNumber: 7, type: 'add', content: '' },
          { lineNumber: 8, type: 'add', content: 'import java.util.List;' },
          { lineNumber: 9, type: 'add', content: 'import java.util.Optional;' },
          { lineNumber: 10, type: 'add', content: '' },
          { lineNumber: 11, type: 'add', content: 'public interface OrderRepository extends JpaRepository<Order, Long> {' },
          { lineNumber: 12, type: 'add', content: '' },
          { lineNumber: 13, type: 'add', content: '    List<Order> findByCustomerId(Long customerId);' },
          { lineNumber: 14, type: 'add', content: '' },
          { lineNumber: 15, type: 'add', content: '    List<Order> findByStatus(OrderStatus status);' },
          { lineNumber: 16, type: 'add', content: '' },
          { lineNumber: 17, type: 'add', content: '    @Query("SELECT o FROM Order o WHERE o.customer.id = :customerId AND o.status = :status")' },
          { lineNumber: 18, type: 'add', content: '    List<Order> findByCustomerIdAndStatus(' },
          { lineNumber: 19, type: 'add', content: '            @Param("customerId") Long customerId,' },
          { lineNumber: 20, type: 'add', content: '            @Param("status") OrderStatus status);' },
          { lineNumber: 21, type: 'add', content: '' },
          { lineNumber: 22, type: 'add', content: '    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.lineItems WHERE o.id = :id")' },
          { lineNumber: 23, type: 'add', content: '    Optional<Order> findByIdWithLineItems(@Param("id") Long id);' },
          { lineNumber: 24, type: 'add', content: '}' },
        ],
      },
    ],
    reasoning: [
      {
        type: 'decision',
        title: 'Custom query with JOIN FETCH',
        description: 'Using JOIN FETCH in findByIdWithLineItems eagerly loads line items in a single query, avoiding N+1 problem when order details with line items are needed.',
        rejected: {
          title: 'Let JPA lazy-load line items',
          reason: 'Lazy loading would trigger additional queries when accessing line items, causing N+1 performance issues.',
        },
      },
      {
        type: 'rationale',
        title: 'Spring Data JPA method names',
        description: 'Using Spring Data JPA query derivation (findByCustomerId) reduces boilerplate code and leverages framework conventions for common queries.',
      },
    ],
  },

  'LineItemRepository.java': {
    fileChange: {
      path: 'src/main/java/com/acme/orders/repository/',
      filename: 'LineItemRepository.java',
      changeType: 'added',
      additions: 28,
      deletions: 0,
      agentId: 'impl-1',
    },
    hunks: [
      {
        range: '@@ -0,0 +1,28 @@',
        context: 'new file',
        lines: [
          { lineNumber: 1, type: 'add', content: 'package com.acme.orders.repository;' },
          { lineNumber: 2, type: 'add', content: '' },
          { lineNumber: 3, type: 'add', content: 'import com.acme.orders.entity.OrderLineItem;' },
          { lineNumber: 4, type: 'add', content: 'import org.springframework.data.jpa.repository.JpaRepository;' },
          { lineNumber: 5, type: 'add', content: 'import org.springframework.data.jpa.repository.Query;' },
          { lineNumber: 6, type: 'add', content: '' },
          { lineNumber: 7, type: 'add', content: 'import java.util.List;' },
          { lineNumber: 8, type: 'add', content: '' },
          { lineNumber: 9, type: 'add', content: 'public interface LineItemRepository extends JpaRepository<OrderLineItem, Long> {' },
          { lineNumber: 10, type: 'add', content: '' },
          { lineNumber: 11, type: 'add', content: '    List<OrderLineItem> findByOrderId(Long orderId);' },
          { lineNumber: 12, type: 'add', content: '' },
          { lineNumber: 13, type: 'add', content: '    List<OrderLineItem> findByProductId(String productId);' },
          { lineNumber: 14, type: 'add', content: '' },
          { lineNumber: 15, type: 'add', content: '    @Query("SELECT SUM(li.subtotal) FROM OrderLineItem li WHERE li.order.id = :orderId")' },
          { lineNumber: 16, type: 'add', content: '    BigDecimal calculateOrderTotal(@Param("orderId") Long orderId);' },
          { lineNumber: 17, type: 'add', content: '}' },
        ],
      },
    ],
    reasoning: [
      {
        type: 'rationale',
        title: 'Aggregate query for order total',
        description: 'calculateOrderTotal uses database aggregation to sum line item subtotals efficiently, avoiding loading all items into memory for calculation in application code.',
      },
    ],
  },
};

// =============================================================================
// V2.5: SERVICES - Software Catalog
// =============================================================================

export const services: Service[] = [
  {
    id: 'svc-auth',
    name: 'auth-service',
    description: 'Authentication and authorization service with OAuth2 support',
    ownerTeam: 'team-backend',
    tier: 'critical',
    repositories: ['repo-api-gateway'],
    dependencies: {
      dependsOn: ['svc-user', 'svc-database'],
      usedBy: ['svc-order', 'svc-payment', 'svc-admin'],
      integrations: [
        { type: 'database', description: 'Postgres user credentials table', target: 'svc-database' },
        { type: 'cache', description: 'Redis for session tokens' },
      ],
    },
    metrics: {
      testCoverage: 78,
      openBugs: 3,
      techDebtScore: 25,
      linesOfCode: 4500,
    },
    activeTasks: ['AUTH-102'],
    recentCommits: [
      {
        sha: 'a1b2c3d',
        message: 'Add 2FA support',
        author: 'Alice',
        timestamp: '2 hours ago',
      },
    ],
    lastDeployed: '1 day ago',
  },
  {
    id: 'svc-user',
    name: 'user-service',
    description: 'User profile and account management',
    ownerTeam: 'team-backend',
    tier: 'high',
    repositories: ['repo-api-gateway'],
    dependencies: {
      dependsOn: ['svc-database'],
      usedBy: ['svc-auth', 'svc-order', 'svc-notification'],
      integrations: [
        { type: 'database', description: 'User profiles and preferences' },
        { type: 'storage', description: 'Profile images in S3' },
      ],
    },
    metrics: {
      testCoverage: 82,
      openBugs: 2,
      techDebtScore: 18,
      linesOfCode: 3200,
    },
    activeTasks: [],
    recentCommits: [
      {
        sha: 'e4f5g6h',
        message: 'Update user schema',
        author: 'Bob',
        timestamp: '5 hours ago',
      },
    ],
    lastDeployed: '2 hours ago',
  },
  {
    id: 'svc-order',
    name: 'order-service',
    description: 'Order processing and management',
    ownerTeam: 'team-backend',
    tier: 'critical',
    repositories: ['repo-order-service'],
    dependencies: {
      dependsOn: ['svc-auth', 'svc-user', 'svc-payment', 'svc-database'],
      usedBy: ['svc-notification', 'svc-analytics'],
      integrations: [
        { type: 'api', description: 'Payment processing API', target: 'svc-payment' },
        { type: 'message-queue', description: 'Order events to RabbitMQ' },
        { type: 'database', description: 'Orders and line items' },
      ],
    },
    metrics: {
      testCoverage: 75,
      openBugs: 5,
      techDebtScore: 35,
      linesOfCode: 6800,
    },
    activeTasks: ['ORD-142', 'ORD-145'],
    recentCommits: [
      {
        sha: '8e4d1a9',
        message: 'Add Order entity with JPA',
        author: 'impl-1',
        timestamp: '45 minutes ago',
      },
    ],
    lastDeployed: '3 hours ago',
  },
  {
    id: 'svc-payment',
    name: 'payment-service',
    description: 'Payment processing with Stripe integration',
    ownerTeam: 'team-backend',
    tier: 'critical',
    repositories: ['repo-api-gateway'],
    dependencies: {
      dependsOn: ['svc-auth', 'svc-database'],
      usedBy: ['svc-order'],
      integrations: [
        { type: 'api', description: 'Stripe payment gateway' },
        { type: 'database', description: 'Payment transactions log' },
      ],
    },
    metrics: {
      testCoverage: 88,
      openBugs: 1,
      techDebtScore: 12,
      linesOfCode: 2400,
    },
    activeTasks: [],
    recentCommits: [
      {
        sha: 'i7j8k9l',
        message: 'Update Stripe SDK',
        author: 'Charlie',
        timestamp: '1 day ago',
      },
    ],
    lastDeployed: '6 hours ago',
  },
  {
    id: 'svc-notification',
    name: 'notification-service',
    description: 'Email and SMS notifications',
    ownerTeam: 'team-backend',
    tier: 'medium',
    repositories: ['repo-api-gateway'],
    dependencies: {
      dependsOn: ['svc-user'],
      usedBy: [],
      integrations: [
        { type: 'api', description: 'SendGrid for email' },
        { type: 'api', description: 'Twilio for SMS' },
        { type: 'message-queue', description: 'Consumes notification events from RabbitMQ' },
      ],
    },
    metrics: {
      testCoverage: 65,
      openBugs: 4,
      techDebtScore: 42,
      linesOfCode: 1800,
    },
    activeTasks: [],
    recentCommits: [
      {
        sha: 'm0n1o2p',
        message: 'Add SMS retry logic',
        author: 'Diana',
        timestamp: '3 days ago',
      },
    ],
    lastDeployed: '1 week ago',
  },
  {
    id: 'svc-search',
    name: 'search-service',
    description: 'Product search with Elasticsearch',
    ownerTeam: 'team-backend',
    tier: 'medium',
    repositories: ['repo-api-gateway'],
    dependencies: {
      dependsOn: [],
      usedBy: [],
      integrations: [
        { type: 'database', description: 'Elasticsearch cluster' },
        { type: 'message-queue', description: 'Product index updates from Kafka' },
      ],
    },
    metrics: {
      testCoverage: 70,
      openBugs: 2,
      techDebtScore: 28,
      linesOfCode: 2100,
    },
    activeTasks: [],
    recentCommits: [],
    lastDeployed: '2 weeks ago',
  },
  {
    id: 'svc-analytics',
    name: 'analytics-service',
    description: 'Business analytics and reporting',
    ownerTeam: 'team-backend',
    tier: 'low',
    repositories: ['repo-api-gateway'],
    dependencies: {
      dependsOn: ['svc-order', 'svc-user'],
      usedBy: [],
      integrations: [
        { type: 'database', description: 'Analytics data warehouse' },
        { type: 'message-queue', description: 'Event stream from Kafka' },
      ],
    },
    metrics: {
      testCoverage: 55,
      openBugs: 8,
      techDebtScore: 58,
      linesOfCode: 3600,
    },
    activeTasks: [],
    recentCommits: [],
    lastDeployed: '1 month ago',
  },
  {
    id: 'svc-admin',
    name: 'admin-service',
    description: 'Admin dashboard and management tools',
    ownerTeam: 'team-backend',
    tier: 'medium',
    repositories: ['repo-frontend'],
    dependencies: {
      dependsOn: ['svc-auth', 'svc-user', 'svc-order'],
      usedBy: [],
      integrations: [
        { type: 'api', description: 'Calls all backend services for admin operations' },
      ],
    },
    metrics: {
      testCoverage: 68,
      openBugs: 6,
      techDebtScore: 38,
      linesOfCode: 4200,
    },
    activeTasks: [],
    recentCommits: [],
    lastDeployed: '4 days ago',
  },
  {
    id: 'svc-database',
    name: 'database-service',
    description: 'Shared PostgreSQL database cluster',
    ownerTeam: 'team-infra',
    tier: 'critical',
    repositories: [],
    dependencies: {
      dependsOn: [],
      usedBy: ['svc-auth', 'svc-user', 'svc-order', 'svc-payment'],
      integrations: [
        { type: 'database', description: 'Postgres 14 cluster with replication' },
      ],
    },
    metrics: {
      testCoverage: 0,
      openBugs: 0,
      techDebtScore: 0,
      linesOfCode: 0,
    },
    activeTasks: [],
    recentCommits: [],
  },
];

// =============================================================================
// V2.5: TASK CONTEXTS - Organizational Knowledge
// =============================================================================

export const taskContexts: Record<string, TaskContext> = {
  'ORD-142': {
    taskId: 'ORD-142',
    relatedTasks: [
      {
        id: 'ORD-138',
        title: 'Implement Customer entity',
        outcome: 'success',
        lessonsLearned: 'Used JPA lazy loading for relationships to avoid N+1 queries. Remember to add @JsonIgnoreProperties to prevent circular references in REST responses.',
        completedAt: '3 days ago',
      },
    ],
    affectedServices: [
      {
        id: 'svc-order',
        name: 'order-service',
        description: 'Order processing and management',
        owner: 'Backend Squad',
        criticalityLevel: 'critical',
      },
    ],
    recentChanges: [
      {
        file: 'src/main/java/com/acme/orders/entity/Customer.java',
        author: 'impl-1',
        timestamp: '3 days ago',
        summary: 'Added Customer entity with lazy loading',
        commitSha: '7c8d9e0',
      },
    ],
    knownIssues: [
      {
        description: 'Hibernate lazy initialization exceptions occur when accessing relationships outside transaction scope',
        workaround: 'Use @Transactional annotation on service methods or fetch join in queries',
        reportedBy: 'arch-1',
        reportedAt: '1 week ago',
      },
    ],
    codePatterns: [
      {
        pattern: 'JPA Entity Pattern',
        description: 'Use @Entity with @Table for explicit table naming. Use @GeneratedValue(strategy = GenerationType.IDENTITY) for auto-increment IDs.',
        example: '@Entity\n@Table(name = "orders")\npublic class Order { @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id; }',
        category: 'architecture',
      },
      {
        pattern: 'Lazy Loading',
        description: 'Use FetchType.LAZY for all relationships to avoid loading unnecessary data. Use fetch joins in queries when needed.',
        example: '@OneToMany(mappedBy = "order", fetch = FetchType.LAZY)',
        category: 'performance',
      },
    ],
  },
  'AUTH-102': {
    taskId: 'AUTH-102',
    relatedTasks: [
      {
        id: 'AUTH-101',
        title: 'Implement basic authentication',
        outcome: 'success',
        lessonsLearned: 'JWT tokens work well but need proper expiration and refresh token flow. Store tokens in httpOnly cookies for security.',
        completedAt: '2 weeks ago',
      },
    ],
    affectedServices: [
      {
        id: 'svc-auth',
        name: 'auth-service',
        description: 'Authentication and authorization service',
        owner: 'Backend Squad',
        criticalityLevel: 'critical',
      },
      {
        id: 'svc-user',
        name: 'user-service',
        description: 'User profile and account management',
        owner: 'Backend Squad',
        criticalityLevel: 'high',
      },
    ],
    recentChanges: [
      {
        file: 'src/main/java/com/acme/auth/controller/AuthController.java',
        author: 'impl-1',
        timestamp: '2 weeks ago',
        summary: 'Added JWT authentication endpoints',
        commitSha: 'f1a2b3c',
      },
    ],
    knownIssues: [
      {
        description: 'OAuth2 tokens from Google expire after 1 hour and need refresh',
        workaround: 'Implement refresh token rotation with secure storage in database',
        reportedBy: 'arch-1',
        reportedAt: '1 week ago',
      },
      {
        description: 'Rate limiting not implemented on auth endpoints - vulnerable to brute force',
        workaround: 'Add Redis-based rate limiter before production deployment',
        reportedBy: 'rev-1',
        reportedAt: '3 days ago',
      },
    ],
    codePatterns: [
      {
        pattern: 'Secure Password Storage',
        description: 'Always hash passwords with BCrypt (cost factor 10-12). Never store plaintext passwords.',
        example: 'BCrypt.hashpw(password, BCrypt.gensalt(12))',
        category: 'security',
      },
      {
        pattern: 'OAuth2 State Parameter',
        description: 'Use cryptographically random state parameter to prevent CSRF attacks in OAuth flow.',
        example: 'String state = UUID.randomUUID().toString();',
        category: 'security',
      },
    ],
  },
  'ORD-145': {
    taskId: 'ORD-145',
    relatedTasks: [
      {
        id: 'ORD-142',
        title: 'Implement Order entity',
        outcome: 'success',
        lessonsLearned: 'Integration tests with @SpringBootTest are slow. Use @DataJpaTest for repository tests and mock services in controller tests.',
        completedAt: 'in progress',
      },
    ],
    affectedServices: [
      {
        id: 'svc-order',
        name: 'order-service',
        description: 'Order processing and management',
        owner: 'Backend Squad',
        criticalityLevel: 'critical',
      },
    ],
    recentChanges: [],
    knownIssues: [
      {
        description: 'Test database H2 has different SQL dialect than production Postgres',
        workaround: 'Use Testcontainers with actual Postgres for integration tests',
        reportedBy: 'test-1',
        reportedAt: '1 week ago',
      },
    ],
    codePatterns: [
      {
        pattern: 'Repository Testing',
        description: 'Use @DataJpaTest for repository layer tests - it provides lightweight in-memory database and transaction rollback.',
        example: '@DataJpaTest\nclass OrderRepositoryTest { @Autowired OrderRepository repo; }',
        category: 'testing',
      },
      {
        pattern: 'Controller Testing',
        description: 'Use @WebMvcTest with @MockBean for controller tests. Mock service layer dependencies.',
        example: '@WebMvcTest(OrderController.class)\n@MockBean OrderService service;',
        category: 'testing',
      },
    ],
  },
};

// =============================================================================
// V2.5: POLICIES & PERMISSIONS - Guardrails
// =============================================================================

export const policies: Policy[] = [
  {
    id: 'pol-no-prod-changes',
    name: 'No Direct Production Changes',
    description: 'Prevent agents from making direct changes to production branches (main/master)',
    enabled: true,
    severity: 'error',
    rule: 'Agents cannot commit to main or master branches',
    action: 'block',
    appliesTo: {
      agents: [], // all agents
      filePatterns: [],
      operations: ['write', 'merge'],
    },
    createdBy: 'admin',
    createdAt: '2024-01-01',
    lastModified: '2024-01-15',
  },
  {
    id: 'pol-db-migrations-approval',
    name: 'Database Migrations Require Approval',
    description: 'Changes to database migration files must be reviewed by humans before execution',
    enabled: true,
    severity: 'warning',
    rule: 'Changes to **/migrations/** or **/*.sql files require human approval',
    action: 'require-approval',
    appliesTo: {
      filePatterns: ['**/migrations/**', '**/*.sql', '**/schema.sql'],
      operations: ['write', 'delete'],
    },
    createdBy: 'admin',
    createdAt: '2024-01-05',
    lastModified: '2024-01-20',
  },
  {
    id: 'pol-critical-services-review',
    name: 'Critical Services Need Extra Review',
    description: 'Changes to critical services (auth, payment, order) require architect review',
    enabled: true,
    severity: 'warning',
    rule: 'Changes to auth-service, payment-service, or order-service require architect approval',
    action: 'require-approval',
    appliesTo: {
      services: ['svc-auth', 'svc-payment', 'svc-order'],
      operations: ['write', 'deploy'],
    },
    createdBy: 'arch-1',
    createdAt: '2024-01-10',
    lastModified: '2024-01-25',
  },
  {
    id: 'pol-dependency-updates',
    name: 'Dependency Updates Need Validation',
    description: 'Major version upgrades of dependencies require human validation',
    enabled: true,
    severity: 'warning',
    rule: 'Changes to package.json, pom.xml, requirements.txt require approval',
    action: 'require-approval',
    appliesTo: {
      filePatterns: ['**/package.json', '**/pom.xml', '**/requirements.txt', '**/Cargo.toml'],
      operations: ['write'],
    },
    createdBy: 'admin',
    createdAt: '2024-01-08',
    lastModified: '2024-01-22',
  },
  {
    id: 'pol-no-core-deletion',
    name: 'No Deletion of Core Files',
    description: 'Core configuration and infrastructure files cannot be deleted',
    enabled: true,
    severity: 'error',
    rule: 'Cannot delete config files, docker files, or CI/CD configurations',
    action: 'block',
    appliesTo: {
      filePatterns: ['**/Dockerfile', '**/.github/**', '**/config/**', '**/.env*'],
      operations: ['delete'],
    },
    createdBy: 'admin',
    createdAt: '2024-01-03',
    lastModified: '2024-01-18',
  },
  {
    id: 'pol-schema-changes',
    name: 'Schema Changes Require Architect',
    description: 'Database schema modifications need architect approval',
    enabled: true,
    severity: 'warning',
    rule: 'Entity/model changes require architect review',
    action: 'require-approval',
    appliesTo: {
      agents: ['impl-1'], // implementers need approval
      filePatterns: ['**/entity/**', '**/models/**', '**/schema/**'],
      operations: ['write', 'delete'],
    },
    createdBy: 'arch-1',
    createdAt: '2024-01-12',
    lastModified: '2024-01-28',
  },
  {
    id: 'pol-security-files',
    name: 'Security Files Need Security Team',
    description: 'Authentication, authorization, encryption code requires security review',
    enabled: true,
    severity: 'error',
    rule: 'Security-critical files require security team approval',
    action: 'require-approval',
    appliesTo: {
      filePatterns: ['**/auth/**', '**/security/**', '**/crypto/**'],
      operations: ['write', 'delete'],
    },
    createdBy: 'admin',
    createdAt: '2024-01-14',
    lastModified: '2024-01-29',
  },
  {
    id: 'pol-prod-config',
    name: 'Production Config Changes',
    description: 'Production configuration changes require approval',
    enabled: true,
    severity: 'warning',
    rule: 'Production environment configs need approval',
    action: 'require-approval',
    appliesTo: {
      filePatterns: ['**/config/prod.yml', '**/config/production.js', '**/.env.production'],
      operations: ['write'],
    },
    createdBy: 'admin',
    createdAt: '2024-01-16',
    lastModified: '2024-01-30',
  },
  {
    id: 'pol-large-files',
    name: 'Large File Uploads',
    description: 'Notify when agents add large files (>1MB) to repository',
    enabled: true,
    severity: 'info',
    rule: 'Notify when files >1MB are added',
    action: 'notify',
    appliesTo: {
      operations: ['write'],
    },
    createdBy: 'admin',
    createdAt: '2024-01-20',
    lastModified: '2024-02-01',
  },
  {
    id: 'pol-external-api',
    name: 'External API Changes',
    description: 'Changes to public API contracts require approval',
    enabled: true,
    severity: 'warning',
    rule: 'API controller changes need review',
    action: 'require-approval',
    appliesTo: {
      filePatterns: ['**/controller/**', '**/api/**', '**/routes/**'],
      operations: ['write', 'delete'],
    },
    createdBy: 'arch-1',
    createdAt: '2024-01-22',
    lastModified: '2024-02-03',
  },
];

export const agentPermissions: AgentPermission[] = [
  {
    agentId: 'impl-1',
    globalPermissions: {
      canRead: true,
      canWrite: true,
      canDelete: false,
      canDeploy: false,
      canMergeToMain: false,
      canRollback: false,
      requiresReview: false,
    },
    servicePermissions: {
      'svc-auth': {
        canRead: true,
        canWrite: true,
        canDelete: false,
        canDeploy: false,
        canMergeToMain: false,
        canRollback: false,
        requiresReview: true, // critical service
      },
      'svc-payment': {
        canRead: true,
        canWrite: true,
        canDelete: false,
        canDeploy: false,
        canMergeToMain: false,
        canRollback: false,
        requiresReview: true, // critical service
      },
    },
  },
  {
    agentId: 'arch-1',
    globalPermissions: {
      canRead: true,
      canWrite: true,
      canDelete: false,
      canDeploy: false,
      canMergeToMain: false,
      canRollback: false,
      requiresReview: false,
    },
    servicePermissions: {},
  },
  {
    agentId: 'test-1',
    globalPermissions: {
      canRead: true,
      canWrite: true,
      canDelete: false,
      canDeploy: false,
      canMergeToMain: false,
      canRollback: false,
      requiresReview: false,
    },
    servicePermissions: {},
  },
  {
    agentId: 'rev-1',
    globalPermissions: {
      canRead: true,
      canWrite: false,
      canDelete: false,
      canDeploy: false,
      canMergeToMain: true, // reviewer can merge
      canRollback: true,
      requiresReview: false,
    },
    servicePermissions: {},
  },
  {
    agentId: 'docs-1',
    globalPermissions: {
      canRead: true,
      canWrite: true,
      canDelete: false,
      canDeploy: false,
      canMergeToMain: false,
      canRollback: false,
      requiresReview: false,
    },
    servicePermissions: {},
  },
];

export const policyViolations: PolicyViolation[] = [
  {
    id: 'viol-1',
    policyId: 'pol-no-prod-changes',
    policyName: 'No Direct Production Changes',
    agentId: 'impl-1',
    agentName: 'Implementer',
    action: 'merge to main',
    target: 'auth-service/main',
    timestamp: '2 hours ago',
    outcome: 'blocked',
    reasoning: 'Agent attempted to merge feature branch directly to main without creating a pull request for review',
  },
  {
    id: 'viol-2',
    policyId: 'pol-db-migrations-approval',
    policyName: 'Database Migrations Require Approval',
    agentId: 'impl-1',
    agentName: 'Implementer',
    action: 'write',
    target: 'order-service/migrations/001_add_orders_table.sql',
    timestamp: '45 minutes ago',
    outcome: 'pending-approval',
    reasoning: 'Agent created new database migration file to add orders table schema - awaiting human approval before execution',
  },
  {
    id: 'viol-3',
    policyId: 'pol-critical-services-review',
    policyName: 'Critical Services Need Extra Review',
    agentId: 'impl-1',
    agentName: 'Implementer',
    action: 'write',
    target: 'auth-service/src/auth/oauth.ts',
    timestamp: '1 hour ago',
    outcome: 'pending-approval',
    reasoning: 'Agent modified OAuth implementation in critical auth-service - architect review required before deployment',
  },
  {
    id: 'viol-4',
    policyId: 'pol-large-files',
    policyName: 'Large File Uploads',
    agentId: 'docs-1',
    agentName: 'Documentation',
    action: 'write',
    target: 'docs/architecture-diagram.png',
    timestamp: '3 hours ago',
    outcome: 'approved',
    reasoning: 'Agent added 2.3MB architecture diagram image - notified for review (consider using external storage for large assets)',
  },
  {
    id: 'viol-5',
    policyId: 'pol-dependency-updates',
    policyName: 'Dependency Updates Need Validation',
    agentId: 'impl-1',
    agentName: 'Implementer',
    action: 'write',
    target: 'order-service/pom.xml',
    timestamp: '30 minutes ago',
    outcome: 'pending-approval',
    reasoning: 'Agent upgraded Spring Boot from 2.7.x to 3.0.x (major version) - requires validation of breaking changes and migration path',
  },
];
