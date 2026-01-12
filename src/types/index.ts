// Agent types
export type AgentRole = 'implementer' | 'architect' | 'tester' | 'reviewer' | 'docs';

export type AgentStatus = 'running' | 'thinking' | 'waiting' | 'idle' | 'error';

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  status: AgentStatus;
  currentTask?: string;
  emoji: string;
  color: string;
  teamId?: string; // Which team this agent belongs to
}

// Team types
export interface Team {
  id: string;
  name: string;
  description: string;
  color: string;
  agentIds: string[]; // Agents in this team
  pipeline?: PipelineConfiguration; // Team's default execution pipeline (optional for backwards compatibility)
}

// Pipeline Configuration Types - Team-level pipeline with stages and agent assignments
/**
 * PipelineConfiguration - Defines execution workflow stages for a team
 * Supports graph-based pipelines with visual editor state
 */
export interface PipelineConfiguration {
  id: string;
  name: string; // e.g., "Standard Development Pipeline", "ML Training Pipeline"
  description?: string;
  stages: TeamPipelineStage[];

  // GRAPH METADATA
  entryStageIds?: string[]; // Stages that start the pipeline (no incoming edges)

  // VISUAL EDITOR STATE
  canvasState?: {
    zoom: number;
    centerX: number;
    centerY: number;
  };

  // VALIDATION
  isValid?: boolean; // Whether pipeline graph is valid (no cycles, has entry/exit)
  validationErrors?: string[]; // List of validation errors if invalid

  createdAt: string;
  updatedAt?: string;
}

/**
 * TeamPipelineStage - A stage in the team's execution pipeline (configuration)
 * Supports graph-based pipelines with branching and parallel execution
 */
export interface TeamPipelineStage {
  id: string;
  name: string; // e.g., "Design", "Implementation", "Testing", "Review", "Deployment"
  description?: string;
  assignedAgentIds: string[]; // Manual assignment of agents to this stage

  // GRAPH TOPOLOGY
  order: number; // Sequence in pipeline (0-indexed) - kept for backward compatibility
  nextStageIds?: string[]; // Graph edges - stages this stage connects to

  // VISUAL LAYOUT
  position?: { x: number; y: number }; // Canvas coordinates for visual editor

  // BRANCHING BEHAVIOR
  branchType?: 'sequential' | 'parallel' | 'conditional'; // Execution flow type
  condition?: {
    type: 'test-passed' | 'manual-approval' | 'custom-script';
    branches: {
      onSuccess: string[]; // Next stage IDs if condition true
      onFailure: string[]; // Next stage IDs if condition false
    };
  };

  // METADATA
  color?: string; // Visual distinction in UI
  requiredForCompletion: boolean; // Can this stage be skipped?
  estimatedDuration?: string; // e.g., "2 hours", "1 day"
}

/**
 * PipelineExecution - Tracks runtime progression through pipeline stages
 */
export interface PipelineExecution {
  pipelineId: string; // Which pipeline configuration was used
  stages: PipelineStageExecution[];
  startedAt: string;
  completedAt?: string;
  totalCost: number;
}

/**
 * PipelineStageExecution - Runtime tracking for a single stage
 */
export interface PipelineStageExecution {
  stageId: string; // Reference to TeamPipelineStage.id
  status: 'pending' | 'active' | 'completed' | 'skipped' | 'blocked';
  activeAgentIds: string[]; // Agents currently working on this stage
  startedAt?: string;
  completedAt?: string;
  commits: string[]; // Commit SHAs created during this stage
  cost: number; // Cost incurred during this stage
  notes?: string; // Why skipped or blocked
  logs?: PipelineStageExecutionLog; // Detailed execution logs for this stage
}

/**
 * PipelineStageExecutionLog - Detailed execution log for a pipeline stage
 */
export interface PipelineStageExecutionLog {
  id: string;
  stageId: string;
  entries: PipelineLogEntry[];
}

/**
 * PipelineLogEntry - Individual log entry with timestamp and context
 */
export interface PipelineLogEntry {
  id: string;
  timestamp: string;
  type: 'agent_activity' | 'commit' | 'test' | 'error' | 'decision' | 'approval' | 'system';
  severity: 'info' | 'warning' | 'error' | 'success';
  agentId?: string; // Which agent generated this log
  message: string;
  details?: {
    // For commits
    commitSha?: string;
    commitMessage?: string;
    filesChanged?: string[];

    // For tests
    testName?: string;
    testStatus?: 'passed' | 'failed' | 'skipped';
    testOutput?: string;

    // For errors
    errorType?: string;
    stackTrace?: string;
    resolution?: string;

    // For decisions
    decision?: string;
    rationale?: string;
    alternatives?: string[];

    // For approvals
    approver?: string;
    approved?: boolean;
    feedback?: string;
  };
}

// Worktree Agent Assignment - agent's role within a worktree
export type WorktreeAgentRole = 'primary' | 'supporting' | 'waiting' | 'completed';

export interface WorktreeAgent {
  agentId: string;
  role: WorktreeAgentRole;
  stage: string; // e.g., "Implementation", "Testing", "Review"
  isActive: boolean;
  contribution?: {
    commits: number;
    filesChanged: number;
    linesAdded: number;
    linesRemoved: number;
    cost: number;
  };
}

// Pipeline stage within a worktree
export type StageStatus = 'pending' | 'active' | 'completed' | 'blocked';

export interface PipelineStage {
  id: string;
  name: string;
  status: StageStatus;
  agentId?: string;
  startedAt?: string;
  completedAt?: string;
}

// File change types
export type FileChangeType = 'added' | 'modified' | 'deleted';

export interface FileChange {
  path: string;
  filename: string;
  changeType: FileChangeType;
  additions: number;
  deletions: number;
  agentId?: string; // Which agent made this change
}

export interface DiffLine {
  lineNumber: number;
  type: 'context' | 'add' | 'del';
  content: string;
}

export interface DiffHunk {
  range: string;
  context: string;
  lines: DiffLine[];
}

// Reasoning types
export interface ReasoningDecision {
  type: 'decision' | 'rationale' | 'alternative';
  title: string;
  description: string;
  rejected?: {
    title: string;
    reason: string;
  };
}

export interface Reference {
  type: 'doc' | 'code' | 'external';
  title: string;
  url?: string;
}

export interface TestResult {
  name: string;
  passed: number;
  total: number;
  tests: { name: string; passed: boolean }[];
}

// Cost types
export interface AgentCost {
  agentId: string;
  inputTokens: number;
  outputTokens: number;
  toolCalls: number;
  inputCost: number;
  outputCost: number;
  toolCost: number;
  totalCost: number;
  efficiency: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface Budget {
  name: string;
  current: number;
  limit: number;
  resetIn?: string;
  daysLeft?: number;
}

export interface ModelPricing {
  name: string;
  inputPer1M: number;
  outputPer1M: number;
  color: string;
}

// Config types
export type AutonomyLevel = 'conservative' | 'balanced' | 'autonomous' | 'full-auto';
export type PermissionLevel = 'disabled' | 'read-only' | 'allowlist' | 'ask' | 'full';

export interface AgentConfig {
  model: string;
  temperature: number;
  maxOutputTokens: number;
  extendedThinking: boolean;
  autonomyLevel: AutonomyLevel;
  autoCommit: boolean;
  runTestsAfterChanges: boolean;
  maxIterations: number;
  permissions: {
    fileSystem: PermissionLevel;
    terminal: PermissionLevel;
    git: PermissionLevel;
    web: PermissionLevel;
  };
}

// Task types
export type TaskStatus =
  | 'backlog'      // Not started, no work done yet
  | 'planning'     // Specification being generated or awaiting approval
  | 'in-progress'  // Specification approved, implementation started
  | 'review'       // Implementation done, under review
  | 'done'         // Completed
  | 'blocked';     // Cannot proceed

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  worktreeId?: string; // Link to worktree (if work has started)
  progress?: number;
  dependsOn?: string[];
  blocks?: string[];
}

// Worktree types - THE CENTRAL ENTITY
export type WorktreeStatus = 'active' | 'paused' | 'conflict' | 'completed' | 'merging';

export interface Worktree {
  id: string;
  branch: string;
  baseBranch: string;
  path: string;
  status: WorktreeStatus;
  
  // Task assignment
  taskId: string;
  
  // Team assignment
  teamId: string;
  
  // Agent team (agents from the team working on this)
  agents: WorktreeAgent[];
  
  // Pipeline
  pipeline: PipelineStage[];
  currentStage: string;
  
  // Progress & stats
  progress: number;
  
  // File changes in this worktree
  fileChanges: FileChange[];
  
  // Commits in this worktree
  commits: Commit[];
  
  // Cost tracking
  cost: number;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  
  // Conflicts (if any)
  conflicts?: ConflictInfo[];
}

export interface ConflictInfo {
  file: string;
  type: 'merge' | 'rebase';
  ourChange: string;
  theirChange: string;
}

export interface Commit {
  sha: string;
  message: string;
  author: string;
  authorType: 'agent' | 'human';
  agentId?: string;
  timestamp: string;
  filesChanged?: number;
  additions?: number;
  deletions?: number;
}

// Diff context for a specific file in a worktree
export interface FileDiff {
  fileChange: FileChange;
  hunks: DiffHunk[];
  reasoning?: ReasoningDecision[];
  references?: Reference[];
  testResults?: TestResult;
}

// Tab types
export type TabId = 'overview' | 'worktree' | 'diff' | 'cost' | 'config' | 'deps';

// =============================================================================
// V2 TYPES - Task-Centric Multi-Repository Architecture
// =============================================================================
// These types support the v2 refactor where Task becomes the central entity
// and worktrees are implementation details. Existing v1 types remain above.

// Project - Top-level container for repositories, teams, and agents
export interface Project {
  id: string;
  name: string;
  description?: string;
  repositories: Repository[];
  teams: Team[];
  agents: Agent[];
  budgets: Budget[];
}

// Repository - Represents a connected codebase
export interface Repository {
  id: string;
  name: string;
  path: string;
  remoteUrl?: string;
  defaultBranch: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSynced?: string;
}

// CommitCost - Cost attribution per commit
export interface CommitCost {
  inputTokens: number;
  outputTokens: number;
  toolCalls: number;
  totalCost: number;
}

// TaskCommit - Enhanced commit with repository reference and cost
export interface TaskCommit {
  id: string;
  sha: string;
  message: string;

  // Attribution
  agentId?: string;
  authorType: 'agent' | 'human';
  author: string;

  // Repository context
  repositoryId: string;
  worktreeId: string;

  // Changes
  filesChanged: number;
  additions: number;
  deletions: number;

  // Cost attribution
  cost: CommitCost;

  // File references (for filtering)
  fileIds: string[];

  // Specification traceability
  fulfillsAcceptanceCriteria?: string[]; // ["AC-1", "AC-2"]

  timestamp: string;
}

// TaskFileChange - Enhanced file change with repository reference
export interface TaskFileChange {
  id: string;
  path: string;
  filename: string;

  // Repository context
  repositoryId: string;
  worktreeId: string;

  // Change details
  changeType: 'added' | 'modified' | 'deleted';
  additions: number;
  deletions: number;

  // Attribution
  agentId?: string;

  // Commit references
  commitShas: string[];

  // Specification traceability
  fulfillsAcceptanceCriteria?: string[]; // ["AC-1", "AC-3"]
  specRationale?: string; // Brief explanation of why per spec
}

// TaskWorktreeV2 - Simplified worktree (embedded in Task)
export interface TaskWorktreeV2 {
  id: string;
  repositoryId: string;
  branch: string;
  baseBranch: string;
  path: string;
  status: 'active' | 'conflict' | 'completed' | 'merged';

  // Worktree-specific data
  fileChanges: FileChange[];
  commits: Commit[];
  conflicts?: ConflictInfo[];

  createdAt: string;
  updatedAt: string;
}

// TaskAgent - Agent assignment within a task (alias for WorktreeAgent)
export type TaskAgent = WorktreeAgent;

// PipelineStageV2 - Pipeline stage with cost tracking
export interface PipelineStageV2 extends PipelineStage {
  cost: number;
}

// =============================================================================
// TASK SPECIFICATION - Defines what agents should build
// =============================================================================

// AcceptanceCriterion - Individual success criterion with completion status
export interface AcceptanceCriterion {
  id: string;
  description: string;
  completed: boolean;
  completedAt?: string;
  verifiedBy?: 'agent' | 'human';

  // Traceability: What implements this criterion
  implementedIn?: {
    commits: string[];   // Commit SHAs
    files: string[];     // File paths
  };
}

// Specification approval status
export type SpecificationStatus =
  | 'draft'              // AI is still generating the spec
  | 'pending_approval'   // Spec ready, waiting for user approval
  | 'approved'           // User approved, task can proceed
  | 'changes_requested'  // User requested changes to the spec
  | 'rejected';          // User rejected the spec

// TaskSpecification - AI-generated specification (approved by human)
export interface TaskSpecification {
  // Approval workflow
  status: SpecificationStatus;
  generatedAt: string;              // When AI generated this spec

  // Summary
  summary: string;

  // Technical approach
  technicalApproach: {
    repositories: string[];        // Repository IDs that need changes
    components: string[];           // Components/files to be affected
    design: string;                 // Architecture/design decisions
  };

  // When is the task complete?
  acceptanceCriteria: AcceptanceCriterion[];

  // Scope estimation
  estimatedScope: {
    files: number;
    complexity: 'simple' | 'moderate' | 'complex';
    estimatedCost?: number;
  };

  // Dependencies
  dependencies?: {
    blockedBy?: string[];           // Other task IDs
    requires?: string[];            // External dependencies (libs, APIs)
  };

  // Potential issues
  risks?: string[];

  // Approval tracking
  approvedAt?: string;
  approvedBy?: string;                // User who approved
  rejectedAt?: string;
  rejectionReason?: string;

  // Feedback loop
  userFeedback?: string;              // User's comments/requested changes

  // Spec can be refined during implementation
  revisions?: {
    version: number;
    changedAt: string;
    changes: string;
  }[];
}

// TaskCreation - User's initial input when creating a task
export interface TaskCreation {
  prompt: string;                     // What needs to be done
  context?: string;                   // Additional context, links
  linkedTicket?: {                    // External ticket reference
    url: string;
    system: 'jira' | 'linear' | 'github' | 'other';
    externalId: string;
  };
  teamId: string;                     // Which team to assign
  priority?: 'critical' | 'high' | 'medium' | 'low';
  tags?: string[];
}

// TaskV2 - CENTRAL ENTITY for v2 architecture
export interface TaskV2 {
  // Basic info
  id: string;
  title: string;
  description?: string;

  // User's original request (what defines the task)
  userPrompt?: string;
  context?: string;
  linkedTicket?: {
    url: string;
    system: 'jira' | 'linear' | 'github' | 'other';
    externalId: string;
  };

  // AI-generated specification (approved by user)
  specification?: TaskSpecification;

  // Status
  status: TaskStatus;
  priority: 'critical' | 'high' | 'medium' | 'low';
  tags: string[];

  // Team and agents (moved from Worktree)
  teamId: string;
  agents: TaskAgent[];

  // Pipeline (moved from Worktree)
  pipeline: PipelineStageV2[];
  currentStage: string;

  // Progress and cost (aggregated)
  progress: number;
  totalCost: number;

  // Worktrees (embedded, not referenced)
  worktrees: TaskWorktreeV2[];

  // Aggregated data from all worktrees
  commits: TaskCommit[];
  fileChanges: TaskFileChange[];

  // Dependencies
  dependsOn?: string[];
  blocks?: string[];

  // Timestamps
  createdAt: string;
  startedAt?: string;
  completedAt?: string;

  // v2.5: Services affected by this task
  affectedServices?: string[]; // service IDs
}

// =============================================================================
// V2.5 TYPES - Port.io-Inspired Features
// =============================================================================

// -----------------------------------------------------------------------------
// Context & Knowledge
// -----------------------------------------------------------------------------

/**
 * TaskContext - Organizational knowledge relevant to a task
 * Provides agents and humans with historical context and patterns
 */
export interface TaskContext {
  taskId: string;

  // Related past work
  relatedTasks: RelatedTask[];

  // Services/repos affected by this task
  affectedServices: AffectedService[];

  // Recent changes to files this task will modify
  recentChanges: RecentChange[];

  // Known issues and gotchas
  knownIssues: KnownIssue[];

  // Coding patterns to follow
  codePatterns: CodePattern[];
}

export interface RelatedTask {
  id: string;
  title: string;
  outcome: 'success' | 'issues' | 'abandoned';
  lessonsLearned: string;
  completedAt: string;
}

export interface AffectedService {
  id: string;
  name: string;
  description: string;
  owner: string;
  criticalityLevel: 'critical' | 'high' | 'medium' | 'low';
}

export interface RecentChange {
  file: string;
  author: string;
  timestamp: string;
  summary: string;
  commitSha: string;
}

export interface KnownIssue {
  description: string;
  workaround: string;
  reportedBy: string;
  reportedAt: string;
}

export interface CodePattern {
  pattern: string;
  description: string;
  example: string;
  category: 'architecture' | 'testing' | 'error-handling' | 'performance' | 'security';
}

// -----------------------------------------------------------------------------
// Service Registry
// -----------------------------------------------------------------------------

/**
 * Service - Represents a microservice or application component
 * Part of the software catalog for tracking dependencies and ownership
 */
export interface Service {
  id: string;
  name: string;
  description: string;
  ownerTeam: string;
  tier: 'critical' | 'high' | 'medium' | 'low';

  // Repository associations
  repositories: string[]; // repository IDs

  // Service dependencies
  dependencies: ServiceDependencies;

  // Quality and health metrics
  metrics: ServiceMetrics;

  // Active work
  activeTasks: string[]; // task IDs currently modifying this service

  // History
  recentCommits: Array<{
    sha: string;
    message: string;
    author: string;
    timestamp: string;
  }>;

  lastDeployed?: string;
}

export interface ServiceDependencies {
  dependsOn: string[]; // upstream service IDs (services this depends on)
  usedBy: string[]; // downstream service IDs (services that depend on this)
  integrations: ServiceIntegration[];
}

export interface ServiceIntegration {
  type: 'api' | 'database' | 'message-queue' | 'cache' | 'storage';
  description: string;
  target?: string; // service ID if applicable
}

export interface ServiceMetrics {
  testCoverage: number; // percentage
  openBugs: number;
  techDebtScore: number; // 0-100 (lower is better)
  linesOfCode: number;
}

// -----------------------------------------------------------------------------
// Guardrails & Policies
// -----------------------------------------------------------------------------

/**
 * Policy - Defines guardrails for agent behavior
 * Controls what agents can do and when human approval is required
 */
export interface Policy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: 'error' | 'warning' | 'info';

  // What this policy does
  rule: string; // human-readable description
  action: 'block' | 'require-approval' | 'notify';

  // When this policy applies
  appliesTo: PolicyScope;

  // Metadata
  createdBy: string;
  createdAt: string;
  lastModified: string;
}

export interface PolicyScope {
  agents?: string[]; // specific agent IDs (empty = all agents)
  services?: string[]; // specific service IDs (empty = all services)
  operations?: PolicyOperation[]; // specific operations
  filePatterns?: string[]; // glob patterns (e.g., "**/*.sql", "**/migrations/**")
}

export type PolicyOperation = 'read' | 'write' | 'delete' | 'deploy' | 'merge' | 'rollback';

/**
 * AgentPermission - Defines what an agent is allowed to do
 * Can be defined globally or per-service
 */
export interface AgentPermission {
  agentId: string;

  // Global permissions
  globalPermissions: PermissionSet;

  // Service-specific overrides
  servicePermissions: Record<string, PermissionSet>;
}

export interface PermissionSet {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canDeploy: boolean;
  canMergeToMain: boolean;
  canRollback: boolean;
  requiresReview: boolean; // if true, all actions need human approval
}

/**
 * PolicyViolation - Recorded when an agent action violates a policy
 */
export interface PolicyViolation {
  id: string;
  policyId: string;
  policyName: string;
  agentId: string;
  agentName: string;
  action: string;
  target: string; // file, service, or resource
  timestamp: string;
  outcome: 'blocked' | 'pending-approval' | 'approved' | 'rejected';
  reasoning: string; // agent's explanation of what it was trying to do
}

// -----------------------------------------------------------------------------
// Quality & Audit
// -----------------------------------------------------------------------------

/**
 * QualityScorecard - Code quality metrics for a service or task
 */
export interface QualityScorecard {
  entityId: string; // service ID or task ID
  entityType: 'service' | 'task';

  testCoverage: QualityMetric;
  documentation: DocumentationMetric;
  security: SecurityMetric;
  codeQuality: CodeQualityMetric;

  overallScore: number; // 0-100
  lastUpdated: string;
}

export interface QualityMetric {
  current: number; // current value (e.g., 75% test coverage)
  target: number; // target value (e.g., 80% test coverage)
  status: 'pass' | 'warn' | 'fail';
  trend?: 'improving' | 'stable' | 'declining';
}

export interface DocumentationMetric {
  hasReadme: boolean;
  hasAPIDoc: boolean;
  hasRunbook: boolean;
  hasTechDesign: boolean;
  status: 'pass' | 'warn' | 'fail';
}

export interface SecurityMetric {
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  status: 'pass' | 'warn' | 'fail';
}

export interface CodeQualityMetric {
  lintErrors: number;
  codeSmells: number;
  duplicatedLines: number;
  techDebt: string; // e.g., "2 days", "1 week"
  status: 'pass' | 'warn' | 'fail';
}

/**
 * AuditLogEntry - Complete record of an agent action
 */
export interface AuditLogEntry {
  id: string;
  timestamp: string;

  // Who
  agentId: string;
  agentName: string;
  agentRole: string;

  // What
  action: AuditAction;
  target: string; // file path, service name, or resource identifier
  taskId?: string; // if action was part of a task

  // Outcome
  outcome: 'success' | 'blocked' | 'failed' | 'pending-approval';
  reasoning: string; // agent's explanation

  // Policy enforcement
  policiesChecked: string[]; // policy IDs that were evaluated
  policyViolation?: string; // policy ID if blocked

  // Approval workflow
  requiresApproval: boolean;
  approvedBy?: string;
  approvedAt?: string;

  // Additional context
  metadata: Record<string, any>;
}

export type AuditAction =
  | 'generated-specification'
  | 'created-commit'
  | 'modified-file'
  | 'deleted-file'
  | 'ran-tests'
  | 'deployed-changes'
  | 'rolled-back'
  | 'requested-approval'
  | 'merged-pr';

// =============================================================================
// V3 TYPES - Multi-Agent Era Architecture
// =============================================================================
// V3 introduces Mission-centric architecture with conversation as first-class artifact,
// agent observations, casting, and ambient awareness.

// -----------------------------------------------------------------------------
// Mission Types - Central entity replacing Task as primary orchestration unit
// -----------------------------------------------------------------------------

export type MissionStatus =
  | 'backlog'    // Not started yet
  | 'planning'   // Creating plan with agents
  | 'executing'  // Implementing (see currentPipelineStage for detail)
  | 'complete'   // Finished successfully
  | 'blocked';   // Cannot proceed

/**
 * Mission - High-level goal that spawns plans and tasks
 * Central entity in V3 architecture, contains conversation, plan, and execution
 */
export interface Mission {
  id: string;
  title: string;

  // Team ownership
  teamId: string;

  // Link to the conversation that led to this mission
  conversationId: string;

  // Simplified status
  status: MissionStatus;

  // Pipeline tracking
  currentPipelineStage?: string; // stage ID when status='executing'
  pipelineExecution?: PipelineExecution; // Execution trace

  // The original intent expressed by operator
  intent: Intent;

  // The plan (when approved)
  plan?: Plan;

  // Execution details
  execution?: Execution;

  // The conversation thread (embedded for convenience)
  conversation: Conversation;

  // Assigned agents
  agents: MissionAgent[];

  // Progress and cost
  progress: number;
  cost: number;

  // Timestamps
  startedAt?: string;
  completedAt?: string;
}

/**
 * MissionAgent - Agent assignment within a mission
 */
export interface MissionAgent {
  agentId: string;
  role: AgentRole;
  stage: string;
  isActive: boolean;
  contribution: {
    commits: number;
    filesChanged: number;
    cost: number;
  };
}

// -----------------------------------------------------------------------------
// Intent Types - Structured understanding of operator's goal
// -----------------------------------------------------------------------------

/**
 * Intent - Natural language intent with parsed structure
 */
export interface Intent {
  // Natural language description of goal
  description: string;

  // Parsed/structured understanding
  parsed: {
    goal: string;
    constraints: string[];
    preferences: string[];
    scope: string[];
    outOfScope: string[];
  };

  // Operator clarifications
  clarifications: Clarification[];

  // Confidence that intent is well understood (0-100)
  confidence: number;
}

/**
 * Clarification - Question and answer for intent refinement
 */
export interface Clarification {
  id: string;
  question: string;
  answer?: string;
  askedBy: 'operator' | 'agent';
  askedAt: string;
  answeredAt?: string;
}

// -----------------------------------------------------------------------------
// Plan Types - Detailed approach with task breakdown
// -----------------------------------------------------------------------------

/**
 * Plan - Structured approach to achieve mission
 */
export interface Plan {
  id: string;

  // Summary of approach
  summary: string;

  // Why this approach
  rationale: string;

  // Alternatives considered
  alternatives: AlternativeApproach[];

  // Breakdown into tasks
  tasks: PlannedTask[];

  // Risks identified
  risks: Risk[];

  // Estimated cost and time
  estimate: {
    cost: { min: number; max: number; expected: number };
    time: { min: string; max: string; expected: string };
  };

  // Repositories that will be touched
  repositories: string[];

  // Plan status
  status: 'draft' | 'proposed' | 'approved' | 'rejected';

  // Operator feedback
  feedback?: string;
}

/**
 * PlannedTask - Individual task within a plan
 */
export interface PlannedTask {
  id: string;
  title: string;
  description: string;

  // Which agent role should do this
  suggestedRole: AgentRole;

  // Which specific agent (if cast)
  assignedAgent?: string;

  // Dependencies
  dependsOn: string[];

  // Affected files/areas
  scope: string[];

  // Estimated effort
  estimate: {
    cost: number;
    time: string;
  };

  // Can this run in parallel?
  parallelizable: boolean;
}

/**
 * AlternativeApproach - Alternative way to solve the mission
 */
export interface AlternativeApproach {
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  rejected: boolean;
  reason?: string;
}

/**
 * Risk - Identified risk in the plan
 */
export interface Risk {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  mitigation?: string;
}

// -----------------------------------------------------------------------------
// Conversation Types - First-class conversation artifact
// -----------------------------------------------------------------------------

/**
 * Conversation - Persistent thread of intent, decisions, and context
 */
export interface Conversation {
  id: string;
  missionId: string | null; // null until conversation is submitted to a team for execution

  // Conversation metadata
  title: string;
  createdAt: string;
  updatedAt: string;

  // Specification toolkit used for refinement
  specificationToolkitId?: string;
  workflowRuns: SpecificationWorkflowRun[]; // History of toolkit executions

  // All messages in the thread
  messages: Message[];

  // Key decisions made
  decisions: Decision[];

  // Open questions
  openQuestions: Question[];
}

/**
 * Message - Individual message in conversation
 */
export interface Message {
  id: string;
  timestamp: string;

  // Who sent it
  sender: {
    type: 'operator' | 'agent' | 'system';
    id?: string; // agent ID if sender type is 'agent'
  };

  // Content
  content: string;

  // Attachments (code snippets, files, etc)
  attachments?: Attachment[];

  // If this message represents a decision
  decision?: Decision;

  // If this message asks a question
  question?: Question;
}

/**
 * Decision - Key decision with options and rationale
 */
export interface Decision {
  id: string;
  title: string;
  description: string;

  // Who made it
  madeBy: 'operator' | 'agent';
  agentId?: string;

  // The options considered
  options: Option[];

  // Which was chosen
  chosen: string; // option id

  // Why
  rationale: string;

  // Impact on code
  codeImpact?: {
    files: string[];
    commits: string[];
  };

  timestamp: string;
}

/**
 * Option - Single option in a decision
 */
export interface Option {
  id: string;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
}

/**
 * Question - Open question in conversation
 */
export interface Question {
  id: string;
  question: string;
  askedBy: 'operator' | 'agent';
  agentId?: string;
  answered: boolean;
  answer?: string;
  answeredAt?: string;
}

/**
 * Attachment - File, code, or link attached to message
 */
export interface Attachment {
  type: 'code' | 'file' | 'link' | 'image';
  content: string;
  metadata?: Record<string, any>;
}

// -----------------------------------------------------------------------------
// Execution Types - Runtime state and change management
// -----------------------------------------------------------------------------

/**
 * Execution - Runtime state of mission execution
 */
export interface Execution {
  missionId: string;
  planId: string;

  // Running tasks
  tasks: ExecutingTask[];

  // Changes made
  changes: Change[];

  // Commits created
  commits: TaskCommit[]; // Reuse TaskCommit from V2

  // Pending approvals
  approvals: Approval[];

  // Background observations
  observations: Observation[];
}

/**
 * ExecutingTask - Task being executed by agent
 */
export interface ExecutingTask {
  plannedTaskId: string;

  status: 'pending' | 'running' | 'paused' | 'blocked' | 'complete' | 'failed';

  // Assigned agent
  agentId: string;

  // What the agent is currently doing
  currentActivity: string;

  // Progress (0-100)
  progress: number;

  // Cost so far
  cost: number;

  // Time spent
  startedAt: string;
  completedAt?: string;

  // Work products
  changes: Change[];

  // Issues encountered
  issues: Issue[];
}

/**
 * Change - Individual change with status and reasoning
 */
export interface Change {
  id: string;
  taskId: string;
  agentId: string;

  // What was changed
  type: 'file' | 'config' | 'dependency' | 'test';

  // File details
  repository: string;
  path: string;
  changeType: 'added' | 'modified' | 'deleted';

  // Diff
  additions: number;
  deletions: number;
  diff: string;

  // Why this change (KEY for review surface)
  reasoning: string;

  // Agent confidence score (0-100)
  confidence?: number;

  // Status (for review workflow)
  status: 'pending-review' | 'approved' | 'rejected' | 'revised';

  // Linked commit (after approval)
  commitSha?: string;

  timestamp: string;
}

/**
 * Action - Action requiring approval
 */
export interface Action {
  id: string;
  description: string;
  type: 'deploy' | 'rollback' | 'merge' | 'delete' | 'external-api';
  risk: 'low' | 'medium' | 'high';
  reversible: boolean;
}

/**
 * Issue - Problem encountered during execution
 */
export interface Issue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  description: string;
  resolvedAt?: string;
}

// -----------------------------------------------------------------------------
// Observation Types - Agent ambient awareness
// -----------------------------------------------------------------------------

/**
 * Observation - Proactive insight from agent
 */
export interface Observation {
  id: string;
  agentId: string;
  timestamp: string;

  type:
    | 'pattern-detected'      // "I noticed a recurring pattern"
    | 'risk-identified'       // "This might cause issues"
    | 'opportunity'           // "We could improve this"
    | 'inconsistency'         // "This doesn't match the rest"
    | 'dependency-update'     // "A library has updates"
    | 'test-coverage'         // "This area lacks tests"
    | 'performance'           // "This might be slow"
    | 'security';             // "Potential security issue"

  title: string;
  description: string;

  // Confidence level (0-100)
  confidence: number;

  // Suggested action
  suggestion?: string;

  // Related code/files
  references: Reference[];

  // Operator response
  acknowledged: boolean;
  dismissed: boolean;
}

// -----------------------------------------------------------------------------
// Approval Types - Fine-grained approval workflow (Phase 6)
// -----------------------------------------------------------------------------

/**
 * Approval - Item requiring operator approval (Review Surface)
 * Flattened structure optimized for review workflow with confidence scores
 */
export interface Approval {
  id: string;
  type: 'change' | 'decision' | 'action';

  // What needs approval
  title: string;
  description: string;

  // Agent context
  agentId?: string;

  // Status
  status: 'pending' | 'approved' | 'rejected';

  // Confidence score (0-100) - for changes
  confidence?: number;

  // Priority
  priority?: 'low' | 'medium' | 'high' | 'critical';

  // Agent uncertainty (requires operator input)
  requiresInput?: boolean;
  question?: string;

  // Reasoning and impact
  reasoning?: string;
  impact?: string;

  // Affected files (for changes)
  affectedFiles?: string[];

  // Timestamp
  timestamp: string;
}

// -----------------------------------------------------------------------------
// Agent Enhancement Types - Persona, metrics, memory
// -----------------------------------------------------------------------------

/**
 * AgentPersona - Agent's personality and approach
 */
export interface AgentPersona {
  style: 'thorough' | 'fast' | 'creative' | 'conservative';
  verbosity: 'minimal' | 'balanced' | 'detailed';
  riskTolerance: 'low' | 'medium' | 'high';
  specialty?: string; // e.g., "Spring Framework", "React", "SQL"
}

/**
 * AgentMetrics - Performance metrics per agent
 */
export interface AgentMetrics {
  tasksCompleted: number;
  approvalRate: number;      // % of work approved first time
  reworkRate: number;        // % of work requiring revisions
  avgCostPerTask: number;
  avgTimePerTask: number;
  qualityScore: number;      // 0-100 composite score

  // Performance by task type
  byTaskType: Record<string, {
    count: number;
    approvalRate: number;
    avgCost: number;
  }>;
}

/**
 * AgentMemory - Agent's knowledge and past decisions
 */
export interface AgentMemory {
  projectUnderstanding: string;
  conventions: string[];
  pastDecisions: Array<{
    missionId: string;
    decision: string;
    outcome: string;
  }>;
  skills?: AgentSkillAssignment[]; // Skills assigned to this agent
  teamMemory?: TeamMemory;
}

/**
 * TeamMemory - Shared memory across team
 */
export interface TeamMemory {
  teamId: string;
  sharedDecisions: string[]; // Important team-level decisions
  // Note: sharedConventions removed - skills are now assigned directly to agents
}

// -----------------------------------------------------------------------------
// Repository Enhancement Types - Agent understanding of codebase
// -----------------------------------------------------------------------------

/**
 * RepositoryUnderstanding - Agent's knowledge of repository
 */
export interface RepositoryUnderstanding {
  // Agent-generated project summary
  summary: string;

  // Key patterns detected
  patterns: string[];

  // Architecture understanding
  architecture: ArchitectureModel;

  // Conventions learned
  conventions: Convention[];

  // Last analyzed
  analyzedAt: string;

  // Confidence score (0-100)
  confidence: number;
}

/**
 * ArchitectureModel - Understanding of codebase architecture
 */
export interface ArchitectureModel {
  type: string; // e.g., "microservices", "monolith", "serverless"
  layers: string[]; // e.g., ["controller", "service", "repository"]
  keyComponents: string[];
}

/**
 * Convention - Coding convention or pattern
 */
export interface Convention {
  category: string;
  description: string;
  example?: string;
}

// -----------------------------------------------------------------------------
// Agent Skills - Capabilities that can be assigned to agents
// -----------------------------------------------------------------------------

/**
 * AgentSkill - Modular capability that extends an agent's functionality
 * Skills package instructions, metadata, and resources into a reusable tool
 * The AI automatically uses these Skills when they are relevant to the task
 */
export interface AgentSkill {
  id: string;
  name: string;
  description: string;
  category: 'coding' | 'analysis' | 'testing' | 'documentation' | 'deployment' | 'communication' | 'security' | 'database' | 'api' | 'other';

  // Skill metadata
  version?: string;
  author?: string;
  tags?: string[];

  // Packaged resources
  instructions?: string; // Core instructions for using this skill
  prerequisites?: string[]; // skill IDs that should be available first

  // Usage information
  useCases?: string[];
  examples?: string[];
  documentation?: string;

  // Status
  isActive: boolean;
  isDeprecated?: boolean;
  deprecationMessage?: string;

  // Metadata
  createdAt: string;
  updatedAt?: string;
}

/**
 * AgentSkillAssignment - Links a skill to an agent
 */
export interface AgentSkillAssignment {
  skillId: string;
  assignedAt: string;
  lastUsedAt?: string;
  usageCount?: number;
  notes?: string;
}

// -----------------------------------------------------------------------------
// Background Task Types - Async/sync workflow management
// -----------------------------------------------------------------------------

/**
 * BackgroundTask - Mission running in background
 */
export interface BackgroundTask {
  missionId: string;
  mode: 'interactive' | 'background' | 'scheduled';
  scheduledFor?: string;
  needsAttention: boolean;
  blockingQuestion?: string;
}

// -----------------------------------------------------------------------------
// Specification Toolkit Types - Integration with spec authoring tools
// -----------------------------------------------------------------------------

/**
 * SpecificationToolkit - External tools for refining specs (OpenSPE, Agent-OS, etc.)
 */
export interface SpecificationToolkit {
  id: string;
  name: string;
  description: string;
  provider: string; // e.g., 'OpenSPE', 'Agent-OS', 'Custom'
  version: string;
  capabilities: {
    autoRefine: boolean; // Can automatically refine prompts
    interactive: boolean; // Supports back-and-forth conversation
    validation: boolean; // Can validate specifications
    templates: boolean; // Provides spec templates
  };
  config?: Record<string, any>;
  isActive: boolean;
}

/**
 * SpecificationWorkflowRun - A single execution of the toolkit workflow
 */
export interface SpecificationWorkflowRun {
  id: string;
  toolkitId: string;
  startedAt: string;
  completedAt?: string;
  status: 'running' | 'completed' | 'failed';
  input: {
    prompt: string;
    context?: Record<string, any>;
  };
  output?: {
    specification: string; // The refined specification
    confidence: number;
    suggestions?: string[];
    validationErrors?: string[];
  };
  cost?: number;
}

// -----------------------------------------------------------------------------
// Workspace Types - V3 workspace navigation
// -----------------------------------------------------------------------------

export type WorkspaceId = 'conversations' | 'missions' | 'review' | 'insights' | 'settings';
