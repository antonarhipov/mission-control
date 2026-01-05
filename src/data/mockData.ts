import type {
  Agent,
  Team,
  Task,
  Worktree,
  FileDiff,
  AgentCost,
  Budget,
  ModelPricing,
  AgentConfig,
} from '@/types';

// =============================================================================
// TEAMS - Groups of agents that work together
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
// AGENTS - The workers
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
// TASKS - The goals (linked to worktrees when work starts)
// =============================================================================

export const tasks: Task[] = [
  {
    id: 'ORD-142',
    title: 'Implement Order entity with JPA mappings and audit fields',
    description: 'Create the Order aggregate root with proper JPA annotations, audit fields, and relationship mappings to Customer and LineItem entities.',
    status: 'in-progress',
    priority: 'high',
    tags: ['feature', 'backend'],
    worktreeId: 'wt-order-service',
    progress: 65,
    dependsOn: ['ORD-138', 'ORD-139'],
    blocks: ['ORD-145', 'ORD-146'],
  },
  {
    id: 'ORD-145',
    title: 'Write repository integration tests with Testcontainers',
    description: 'Create integration tests for OrderRepository using Testcontainers with PostgreSQL.',
    status: 'backlog',
    priority: 'high',
    tags: ['testing'],
    dependsOn: ['ORD-142'],
    blocks: ['ORD-146'],
  },
  {
    id: 'ORD-144',
    title: 'Document REST API endpoints with OpenAPI annotations',
    description: 'Add OpenAPI/Swagger annotations to OrderController for API documentation.',
    status: 'in-progress',
    priority: 'medium',
    tags: ['docs', 'api'],
    worktreeId: 'wt-api-docs',
    progress: 80,
  },
  {
    id: 'ORD-146',
    title: 'Add pagination and sorting to order listing endpoint',
    description: 'Implement Spring Data pagination for GET /orders endpoint with sorting options.',
    status: 'blocked',
    priority: 'medium',
    tags: ['feature', 'api'],
    dependsOn: ['ORD-142', 'ORD-145'],
  },
  {
    id: 'ORD-140',
    title: 'Review Flyway migration scripts for orders schema',
    description: 'Code review of V2 migration script for orders and line_items tables.',
    status: 'review',
    priority: 'medium',
    tags: ['database', 'review'],
    worktreeId: 'wt-db-migration',
  },
  {
    id: 'ORD-139',
    title: 'Create Flyway migration V2 for orders table',
    description: 'Write Flyway migration script to create orders and line_items tables with proper indexes.',
    status: 'done',
    priority: 'high',
    tags: ['database', 'migration'],
  },
  {
    id: 'ORD-138',
    title: 'Set up Spring Data JPA repositories for Order aggregate',
    description: 'Create OrderRepository interface extending JpaRepository with custom query methods.',
    status: 'done',
    priority: 'medium',
    tags: ['feature', 'backend'],
  },
];

// =============================================================================
// WORKTREES - The central workspace entity
// =============================================================================

export const worktrees: Worktree[] = [
  {
    id: 'wt-order-service',
    branch: 'feature/order-service',
    baseBranch: 'main',
    path: '/worktrees/order-service',
    status: 'active',
    taskId: 'ORD-142',
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
      {
        agentId: 'rev-1',
        role: 'waiting',
        stage: 'Code Review',
        isActive: false,
      },
    ],
    
    pipeline: [
      { id: 'design', name: 'Design', status: 'completed', agentId: 'arch-1', completedAt: '2 hours ago' },
      { id: 'impl', name: 'Implementation', status: 'active', agentId: 'impl-1', startedAt: '1 hour ago' },
      { id: 'test', name: 'Testing', status: 'pending', agentId: 'test-1' },
      { id: 'review', name: 'Code Review', status: 'pending', agentId: 'rev-1' },
      { id: 'docs', name: 'Documentation', status: 'pending', agentId: 'docs-1' },
    ],
    currentStage: 'Implementation',
    
    progress: 65,
    
    fileChanges: [
      { path: 'src/main/java/com/acme/orders/service/', filename: 'OrderService.java', changeType: 'modified', additions: 127, deletions: 23, agentId: 'impl-1' },
      { path: 'src/main/java/com/acme/orders/entity/', filename: 'Order.java', changeType: 'added', additions: 89, deletions: 0, agentId: 'impl-1' },
      { path: 'src/main/java/com/acme/orders/entity/', filename: 'OrderLineItem.java', changeType: 'added', additions: 67, deletions: 0, agentId: 'impl-1' },
      { path: 'src/main/java/com/acme/orders/repository/', filename: 'OrderRepository.java', changeType: 'added', additions: 34, deletions: 0, agentId: 'impl-1' },
      { path: 'src/main/java/com/acme/orders/controller/', filename: 'OrderController.java', changeType: 'modified', additions: 156, deletions: 42, agentId: 'impl-1' },
      { path: 'src/main/java/com/acme/orders/dto/', filename: 'CreateOrderRequest.java', changeType: 'added', additions: 45, deletions: 0, agentId: 'arch-1' },
      { path: 'src/main/java/com/acme/orders/dto/', filename: 'OrderResponse.java', changeType: 'added', additions: 38, deletions: 0, agentId: 'arch-1' },
    ],
    
    commits: [
      { sha: 'a3f7b2c', message: 'feat(orders): add OrderService with transaction support', author: 'Implementer', authorType: 'agent', agentId: 'impl-1', timestamp: '12 min ago', filesChanged: 3, additions: 127, deletions: 23 },
      { sha: '8e4d1a9', message: 'feat(entity): implement Order entity with JPA annotations', author: 'Implementer', authorType: 'agent', agentId: 'impl-1', timestamp: '24 min ago', filesChanged: 2, additions: 156, deletions: 0 },
      { sha: 'b1c3d4e', message: 'feat(dto): add request/response DTOs for Order API', author: 'Architect', authorType: 'agent', agentId: 'arch-1', timestamp: '35 min ago', filesChanged: 2, additions: 83, deletions: 0 },
      { sha: 'c2d8e4f', message: 'chore: approve entity design approach', author: 'You', authorType: 'human', timestamp: '41 min ago' },
      { sha: 'f9a3b1c', message: 'feat(repo): add OrderRepository with custom queries', author: 'Implementer', authorType: 'agent', agentId: 'impl-1', timestamp: '52 min ago', filesChanged: 1, additions: 34, deletions: 0 },
    ],
    
    cost: 4.66,
    createdAt: '2 hours ago',
    updatedAt: '12 min ago',
  },
  
  {
    id: 'wt-api-docs',
    branch: 'docs/api-swagger',
    baseBranch: 'feature/order-service',
    path: '/worktrees/api-docs',
    status: 'active',
    taskId: 'ORD-144',
    teamId: 'team-docs',
    
    agents: [
      {
        agentId: 'docs-1',
        role: 'primary',
        stage: 'Documentation',
        isActive: true,
        contribution: {
          commits: 4,
          filesChanged: 6,
          linesAdded: 234,
          linesRemoved: 12,
          cost: 0.51,
        },
      },
    ],
    
    pipeline: [
      { id: 'analyze', name: 'API Analysis', status: 'completed', agentId: 'docs-1', completedAt: '45 min ago' },
      { id: 'document', name: 'Write Docs', status: 'active', agentId: 'docs-1', startedAt: '40 min ago' },
      { id: 'review', name: 'Review', status: 'pending' },
    ],
    currentStage: 'Write Docs',
    
    progress: 80,
    
    fileChanges: [
      { path: 'src/main/java/com/acme/orders/controller/', filename: 'OrderController.java', changeType: 'modified', additions: 89, deletions: 5, agentId: 'docs-1' },
      { path: 'src/main/resources/', filename: 'openapi.yaml', changeType: 'added', additions: 145, deletions: 0, agentId: 'docs-1' },
    ],
    
    commits: [
      { sha: 'd4e5f6a', message: 'docs: add OpenAPI annotations to OrderController', author: 'Doc Writer', authorType: 'agent', agentId: 'docs-1', timestamp: '15 min ago', filesChanged: 1, additions: 89, deletions: 5 },
      { sha: 'e5f6a7b', message: 'docs: create openapi.yaml with schema definitions', author: 'Doc Writer', authorType: 'agent', agentId: 'docs-1', timestamp: '30 min ago', filesChanged: 1, additions: 145, deletions: 0 },
    ],
    
    cost: 0.51,
    createdAt: '1 hour ago',
    updatedAt: '15 min ago',
  },
  
  {
    id: 'wt-db-migration',
    branch: 'feature/db-migration-v2',
    baseBranch: 'main',
    path: '/worktrees/db-migration',
    status: 'active',
    taskId: 'ORD-140',
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
      { id: 'impl', name: 'Implementation', status: 'completed', agentId: 'impl-1', completedAt: '1 hour ago' },
      { id: 'review', name: 'Code Review', status: 'active', agentId: 'rev-1', startedAt: '45 min ago' },
      { id: 'test', name: 'Migration Test', status: 'pending', agentId: 'test-1' },
    ],
    currentStage: 'Code Review',
    
    progress: 70,
    
    fileChanges: [
      { path: 'src/main/resources/db/migration/', filename: 'V2__add_orders_table.sql', changeType: 'added', additions: 45, deletions: 0, agentId: 'impl-1' },
      { path: 'src/main/resources/db/migration/', filename: 'V3__add_orders_indexes.sql', changeType: 'added', additions: 22, deletions: 0, agentId: 'impl-1' },
    ],
    
    commits: [
      { sha: 'f6a7b8c', message: 'feat(db): add V2 migration for orders and line_items tables', author: 'Implementer', authorType: 'agent', agentId: 'impl-1', timestamp: '1 hour ago', filesChanged: 1, additions: 45, deletions: 0 },
      { sha: 'a7b8c9d', message: 'feat(db): add V3 migration for performance indexes', author: 'Implementer', authorType: 'agent', agentId: 'impl-1', timestamp: '55 min ago', filesChanged: 1, additions: 22, deletions: 0 },
    ],
    
    cost: 1.31,
    createdAt: '1.5 hours ago',
    updatedAt: '10 min ago',
  },
  
  {
    id: 'wt-customer-fix',
    branch: 'fix/customer-validation',
    baseBranch: 'main',
    path: '/worktrees/customer-fix',
    status: 'conflict',
    taskId: 'ORD-147',
    teamId: 'team-backend',
    
    agents: [
      {
        agentId: 'impl-1',
        role: 'primary',
        stage: 'Bug Fix',
        isActive: false,
        contribution: {
          commits: 3,
          filesChanged: 5,
          linesAdded: 89,
          linesRemoved: 34,
          cost: 0.67,
        },
      },
    ],
    
    pipeline: [
      { id: 'analyze', name: 'Analysis', status: 'completed', agentId: 'impl-1', completedAt: '30 min ago' },
      { id: 'fix', name: 'Bug Fix', status: 'blocked', agentId: 'impl-1', startedAt: '25 min ago' },
      { id: 'test', name: 'Testing', status: 'pending', agentId: 'test-1' },
    ],
    currentStage: 'Bug Fix',
    
    progress: 60,
    
    fileChanges: [
      { path: 'src/main/java/com/acme/customers/service/', filename: 'CustomerService.java', changeType: 'modified', additions: 45, deletions: 12, agentId: 'impl-1' },
      { path: 'src/main/java/com/acme/customers/validation/', filename: 'CustomerValidator.java', changeType: 'added', additions: 44, deletions: 0, agentId: 'impl-1' },
    ],
    
    commits: [
      { sha: 'b8c9d0e', message: 'fix: add null check in CustomerService', author: 'Implementer', authorType: 'agent', agentId: 'impl-1', timestamp: '20 min ago', filesChanged: 1, additions: 12, deletions: 3 },
      { sha: 'c9d0e1f', message: 'feat: add CustomerValidator for input validation', author: 'Implementer', authorType: 'agent', agentId: 'impl-1', timestamp: '18 min ago', filesChanged: 1, additions: 44, deletions: 0 },
    ],
    
    cost: 0.67,
    createdAt: '35 min ago',
    updatedAt: '5 min ago',
    
    conflicts: [
      {
        file: 'src/main/java/com/acme/customers/service/CustomerService.java',
        type: 'merge',
        ourChange: 'Added validation logic in findById method',
        theirChange: 'Refactored findById to use Optional pattern',
      },
    ],
  },
];

// =============================================================================
// FILE DIFFS
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
          { lineNumber: 45, type: 'del', content: '' },
        ],
      },
      {
        range: '@@ -67,4 +103,38 @@',
        context: 'createOrder method',
        lines: [
          { lineNumber: 67, type: 'context', content: '    public Order createOrder(CreateOrderRequest request) {' },
          { lineNumber: 68, type: 'add', content: '        // Validate customer exists' },
          { lineNumber: 69, type: 'add', content: '        Customer customer = customerRepository' },
          { lineNumber: 70, type: 'add', content: '            .findById(request.getCustomerId())' },
          { lineNumber: 71, type: 'add', content: '            .orElseThrow(() -> new CustomerNotFoundException(request.getCustomerId()));' },
          { lineNumber: 72, type: 'add', content: '' },
          { lineNumber: 73, type: 'add', content: '        // Check inventory availability' },
          { lineNumber: 74, type: 'add', content: '        inventoryService.validateAvailability(request.getItems());' },
          { lineNumber: 75, type: 'add', content: '' },
          { lineNumber: 76, type: 'add', content: '        // Create order entity' },
          { lineNumber: 77, type: 'add', content: '        Order order = Order.builder()' },
          { lineNumber: 78, type: 'add', content: '            .customer(customer)' },
          { lineNumber: 79, type: 'add', content: '            .status(OrderStatus.PENDING)' },
          { lineNumber: 80, type: 'add', content: '            .createdAt(Instant.now())' },
          { lineNumber: 81, type: 'add', content: '            .build();' },
          { lineNumber: 82, type: 'add', content: '' },
          { lineNumber: 83, type: 'add', content: '        // Add line items' },
          { lineNumber: 84, type: 'add', content: '        request.getItems().forEach(item -> ' },
          { lineNumber: 85, type: 'add', content: '            order.addLineItem(item.getProductId(), item.getQuantity()));' },
          { lineNumber: 86, type: 'add', content: '' },
          { lineNumber: 87, type: 'add', content: '        Order savedOrder = orderRepository.save(order);' },
          { lineNumber: 88, type: 'add', content: '' },
          { lineNumber: 89, type: 'add', content: '        // Publish domain event' },
          { lineNumber: 90, type: 'add', content: '        eventPublisher.publishEvent(new OrderCreatedEvent(savedOrder));' },
          { lineNumber: 91, type: 'add', content: '' },
          { lineNumber: 92, type: 'add', content: '        return savedOrder;' },
          { lineNumber: 93, type: 'context', content: '    }' },
          { lineNumber: 94, type: 'context', content: '}' },
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
        description: 'Publishing `OrderCreatedEvent` via `ApplicationEventPublisher` decouples the order service from downstream processes like inventory reservation and notification sending.',
      },
      {
        type: 'rationale',
        title: 'Builder pattern for Order entity',
        description: 'Using Lombok `@Builder` provides a fluent API for creating Order instances, improves readability, and ensures all required fields are set during construction.',
      },
    ],
    references: [
      { type: 'doc', title: 'Spring Framework: Dependency Injection', url: '#' },
      { type: 'doc', title: 'Spring Data JPA: Repository Pattern', url: '#' },
      { type: 'code', title: 'CustomerService.java (similar pattern)', url: '#' },
    ],
    testResults: {
      name: 'OrderServiceTest',
      passed: 12,
      total: 12,
      tests: [
        { name: 'testCreateOrder_Success', passed: true },
        { name: 'testCreateOrder_CustomerNotFound', passed: true },
        { name: 'testCreateOrder_InsufficientInventory', passed: true },
        { name: 'testCreateOrder_PublishesEvent', passed: true },
      ],
    },
  },
};

// =============================================================================
// COST DATA
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
  totalCost: 7.15,
  totalTokens: 2463334,
  projectName: 'acme-commerce',
  activeBranch: 'feature/order-service',
  activeWorktrees: 4,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getWorktreeById(id: string): Worktree | undefined {
  return worktrees.find(w => w.id === id);
}

export function getTaskById(id: string): Task | undefined {
  return tasks.find(t => t.id === id);
}

export function getAgentById(id: string): Agent | undefined {
  return agents.find(a => a.id === id);
}

export function getTeamById(id: string): Team | undefined {
  return teams.find(t => t.id === id);
}

export function getWorktreeForTask(taskId: string): Worktree | undefined {
  return worktrees.find(w => w.taskId === taskId);
}

export function getActiveWorktrees(): Worktree[] {
  return worktrees.filter(w => w.status === 'active' || w.status === 'conflict');
}
