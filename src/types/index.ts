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
export type TaskStatus = 'backlog' | 'in-progress' | 'review' | 'done' | 'blocked';

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
