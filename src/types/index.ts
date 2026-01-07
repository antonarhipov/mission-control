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
}
