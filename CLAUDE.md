# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mission Control UI for Agentic Development Environments - a React/TypeScript web application that visualizes and manages agentic development workflows using worktrees, tasks, teams, and agents.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (Vite)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint TypeScript files
npm run lint
```

## Architecture

### Core Domain Model (V2 - Task-Centric)

The application uses a **task-centric** architecture where tasks are the central entity for multi-repository agentic development:

- **Tasks** - Central entity representing a unit of work that may span multiple repositories
- **Repositories** - Git repositories that can be involved in task implementation
- **Worktrees** - Git worktrees within repositories (now implementation details of tasks)
- **Agents** - AI workers with specific roles assigned to tasks (implementer, architect, tester, reviewer, docs)
- **Teams** - Groups of agents that work together on related features
- **Pipeline Stages** - Sequential steps in task execution (Design → Implementation → Testing → Review → Documentation)

### Key Relationships

```
Task (central entity)
  ├── worktrees: TaskWorktreeV2[] - Can span multiple repositories
  ├── agents: TaskAgent[] - Team assigned to this task
  ├── pipeline: PipelineStageV2[] - Execution stages with cost tracking
  ├── commits: TaskCommit[] - All commits across repositories
  ├── fileChanges: TaskFileChange[] - All file changes with commit references
  └── totalCost: number - Aggregated cost across all agents/stages

Repository
  ├── name, path, remoteUrl - Repository metadata
  ├── status: connected | disconnected | error
  └── defaultBranch - Main branch for this repo

Each Agent on Task has:
  - agentId, role, stage, isActive
  - contribution: { commits, filesChanged, cost }
```

### Type System (`src/types/index.ts`)

All domain types are centrally defined. Key enums:
- `WorktreeStatus`: active | paused | conflict | completed | merging
- `TaskStatus`: backlog | in-progress | review | done | blocked
- `AgentRole`: implementer | architect | tester | reviewer | docs
- `WorktreeAgentRole`: primary | supporting | waiting | completed

### Component Structure

```
src/
├── components/
│   ├── layout/          # Header, TabBar
│   ├── panels/          # Major views (Overview, Pipelines, Diff, Cost, Config, Dependencies)
│   ├── shared/          # Reusable components (TaskListSidebar, PipelineDetailView, WorktreeCard)
│   └── diff/            # Diff viewer components (FileList, DiffViewer, ReasoningPanel)
├── data/
│   ├── mockData.ts      # V1 mock data (legacy, for backward compatibility)
│   └── mockDataV2.ts    # V2 task-centric mock data (primary)
├── hooks/
│   └── useDataModel.ts  # Feature flag hook for V1/V2 data switching
└── types/
    └── index.ts         # All TypeScript types (Task, TaskV2, Repository, etc.)
```

### State Management

- No external state management library
- State lifted to `App.tsx` and passed down via props
- Primary state: `selectedTaskId` and `selectedCommitSha` for task-centric navigation
- Legacy state: `selectedWorktreeId` (kept for DiffPanel backward compatibility)
- Feature flag via `useDataModel()` hook toggles between V1 and V2 data
- Mock data: V2 from `src/data/mockDataV2.ts`, V1 from `src/data/mockData.ts`

### Styling

- **Tailwind CSS** for all styling (see `tailwind.config.js`)
- Custom color system using semantic tokens:
  - `bg-0` through `bg-4` - Background layers
  - `text-1` through `text-3` - Text hierarchy
  - `border-1`, `border-2` - Border colors
  - `accent-*` - Colored accents (blue, green, amber, red, purple, cyan)
- Dark theme by default (design follows VS Code/GitHub dark aesthetics)
- **lucide-react** for icons

### Path Aliases

TypeScript and Vite configured with `@/*` alias mapping to `src/*`:
```typescript
import { WorktreeSidebar } from '@/components/shared/WorktreeSidebar';
import type { Task, Worktree } from '@/types';
```

## Working with Mock Data

### V2 Data (Primary - `src/data/mockDataV2.ts`)
- `tasksV2: TaskV2[]` - Task-centric data with embedded worktrees, agents, commits, files
- `repositories: Repository[]` - Repository metadata and connection status
- `project: Project` - Top-level project container with all data
- Helper functions: `getTaskByIdV2`, `getRepositoryById`, `getTaskByWorktreeId`

### V1 Data (Legacy - `src/data/mockData.ts`)
- `worktrees`, `tasks`, `agents`, `teams` - Worktree-centric entities
- `fileDiffs` - File diff data with hunks, reasoning, references
- `agentCosts`, `budgets`, `modelPricing` - Cost tracking data
- Helper functions: `getWorktreeById`, `getTaskById`, `getAgentById`

### Feature Flag
Use `useDataModel()` hook to access data:
```typescript
const { tasks, repositories, isV2 } = useDataModel();
// tasks: (Task | TaskV2)[] - automatically returns V1 or V2 data
// isV2: boolean - true if V2 mode enabled (via localStorage)
```

Toggle V2 mode: `localStorage.setItem('v2-enabled', 'true')` and reload.

When adding features, extend `mockDataV2.ts` for V2 architecture.

## Component Conventions

1. **Panel components** (`src/components/panels/`) receive task-centric props:
   - `selectedTaskId: string | null`
   - `onSelectTask: (id: string) => void`
   - Optional: `onNavigateToDiff`, `onNavigateToPipeline` for cross-panel navigation

2. **Shared components** are reusable across panels:
   - `TaskListSidebar` - Shows filterable list of tasks with status grouping
   - `PipelineDetailView` - Displays comprehensive task pipeline and progress
   - `WorktreeCard` - Legacy component (WorktreeStatusBadge still used in DiffPanel)

3. **Type guards** for V1/V2 compatibility:
   ```typescript
   const isTaskV2 = (task: Task | TaskV2): task is TaskV2 => {
     return 'worktrees' in task && Array.isArray(task.worktrees);
   };
   ```

4. Use `clsx` for conditional className composition

5. Icons come from `lucide-react` - import explicitly:
   ```typescript
   import { GitBranch, CheckCircle2, AlertCircle, Folder } from 'lucide-react';
   ```

## Design Patterns

### Three-Column Layout Pattern
Many panels use: `[Sidebar | Main Content | Right Panel]`
```tsx
// PipelinesPanel: Task list + detail view
<div className="grid grid-cols-[300px_1fr] h-full">

// DiffPanel: File list + diff viewer + reasoning
<div className="grid grid-cols-[260px_1fr_340px] h-full">
```

### Task-Centric Navigation
Cross-panel navigation flows:
```typescript
// Navigate to pipeline view
navigateToPipeline(taskId: string)

// Navigate to diff view (optionally scoped to commit)
navigateToDiff(taskId: string, commitSha?: string)

// Navigate back to overview
navigateToOverview(taskId: string)
```

### Multi-Repository Support
Tasks can span multiple repositories:
```typescript
// Group task data by repository
const repoData = new Map<string, { repo: Repository, files: FileChange[] }>();
taskV2.fileChanges.forEach(file => {
  const repo = getRepositoryById(file.repositoryId);
  // ... group by repo
});
```

### Agent Display
When displaying agents, fetch from mock data and show emoji + color:
```typescript
const agent = getAgentById(agentId);
// Display with: agent.emoji, agent.color, agent.name

// For V2 tasks, agents are on task itself
taskV2.agents.map(taskAgent => {
  const agent = getAgentById(taskAgent.agentId);
  // Show with role, contribution, active status
});
```

### Cost Attribution
V2 tracks cost at multiple levels:
```typescript
// Task level
taskV2.totalCost  // Total across all agents/stages

// Pipeline stage level
taskV2.pipeline.forEach(stage => {
  console.log(stage.name, stage.cost);
});

// Agent contribution level
taskV2.agents.forEach(agent => {
  console.log(agent.contribution.cost);
});

// Commit level
taskV2.commits.forEach(commit => {
  console.log(commit.cost.totalCost);
});
```

## TypeScript Configuration

- Strict mode enabled
- No unused locals/parameters allowed
- Path aliases via `baseUrl: "."` and `paths: { "@/*": ["src/*"] }`
- JSX mode: `react-jsx` (no need to import React)

## Panel Descriptions

### OverviewPanel
- Task-centric kanban board showing all tasks by status
- Two-column layout (removed WorktreeSidebar in V2)
- Shows task progress, pipeline stage, repos involved, and cost
- Click "→ View Pipeline" to navigate to PipelinesPanel

### PipelinesPanel (replaces WorktreePanel)
- Main interface for monitoring task execution
- Left sidebar: Filterable task list grouped by status
- Right area: Comprehensive pipeline detail view
  - Pipeline stage visualization with costs
  - Repositories involved (multi-repo support)
  - Agent contributions with roles and costs
  - Recent commits with navigation to DiffPanel
  - Changed files grouped by repository

### DiffPanel
- File-level diff viewer with three modes:
  - **All Changes**: Show all file changes for selected task
  - **By Commit**: Filter files by specific commit
- Three-column layout: file list | diff viewer | reasoning panel
- Shows task context and commit info in header
- Supports both V1 (worktree) and V2 (task) data models

### CostPanel
- V2 features:
  - Task selector dropdown
  - Pipeline stage cost breakdown (horizontal bar chart)
  - Agent contributions by role with cost
  - Commit cost timeline
- V1 features:
  - Traditional agent cost table
  - Budget tracking and alerts

### ConfigPanel
- Teams and agents configuration
- V2 addition: **Repositories** section
  - Repository list with connection status
  - Repository details (path, remote URL, default branch)
  - Repository settings (auto-sync, sync interval, force push)
  - Connection status indicators
  - Disconnect/remove repository actions

### DependenciesPanel
- Task dependency graph visualization
- Three view modes: graph | list | timeline
- Critical path highlighting
- Supports both V1 and V2 data models
- Shows task relationships, blocking, and progress

## Adding New Features

1. **Define types** in `src/types/index.ts` if needed (use V2 types)
2. **Add mock data** in `src/data/mockDataV2.ts`
3. **Create component** in appropriate directory (panels/ or shared/)
4. **Use useDataModel()** hook to access V1/V2 data consistently
5. **Add type guards** if component needs to support both V1 and V2
6. **Wire up routing** in `App.tsx` if adding a new panel/tab
7. **Update TabBar** in `src/components/layout/TabBar.tsx` if adding new tab

## Known Patterns

- **Cost tracking**: Multi-level cost attribution (task, stage, agent, commit)
- **Pipeline visualization**: Use status badges (pending/active/completed/blocked)
- **Multi-repository**: Tasks can span multiple repos, group data by repositoryId
- **Git integration**: Show branches, commits, file changes per repository
- **Navigation**: Cross-panel navigation maintains task and commit context
- **Feature flag**: Use `useDataModel()` for V1/V2 compatibility
