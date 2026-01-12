# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mission Control UI for Agentic Development Environments - a React/TypeScript web application that visualizes and manages multi-agent development workflows. The V3 Multi-Agent Era architecture provides a conversation-first interface with 5 specialized workspaces for intent capture, mission planning, execution review, insights, and configuration.

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

### V3 Multi-Agent Era Architecture

The application uses a **conversation-first, mission-centric** architecture with 5 specialized workspaces:

#### Core Entities

- **Mission** - Central entity representing a development goal with intent, plan, conversation, and execution
- **Intent** - User's goal with parsed structure, constraints, and clarifications
- **Plan** - Agent-proposed implementation approach with tasks, risks, and alternatives
- **Conversation** - First-class artifact containing messages, decisions, and questions
- **Agent** - AI worker with persona, memory, and performance metrics
- **Observation** - Proactive agent insights and suggestions
- **Team** - Group of agents with shared memory and conventions
- **Repository** - Connected codebase with AI-powered understanding

#### Mission Lifecycle

```
Intent → Planning → Executing → Validating → Complete

1. Intent Phase:
   - User describes goal in Command Center
   - System parses intent, identifies constraints
   - Agent asks clarifying questions
   - Conversation begins

2. Planning Phase:
   - Agent proposes implementation plan
   - Shows task breakdown, dependencies, risks
   - User reviews and approves/requests changes
   - Agent casts team of specialized agents

3. Executing Phase:
   - Agents collaborate on implementation
   - Conversation continues with decisions
   - Changes tracked with confidence scores
   - Human gates progression with approvals

4. Validating Phase:
   - Tests run, quality checks performed
   - User reviews final changes
   - Agent addresses feedback

5. Complete Phase:
   - Mission archived with full history
   - Learnings captured in agent memory
```

#### The 5 Workspaces

**1. Command Center** (`/src/components/workspaces/CommandCenter.tsx`)
- Intent input with context attachment
- Active conversations panel
- Agent observations with quick actions
- Mission creation flow

**2. Missions** (`/src/components/workspaces/MissionsWorkspace.tsx`)
- Kanban pipeline (Intent → Planning → Executing → Validating → Complete)
- Mission cards with team and progress
- Plan review interface with task graph
- Conversation threading

**3. Review Surface** (`/src/components/workspaces/ReviewSurface.tsx`)
- Review queue grouped by type (Decisions, Changes, Actions)
- Change detail with confidence scores
- Agent uncertainty flags
- Batch approval workflow

**4. Insights** (`/src/components/workspaces/InsightsWorkspace.tsx`)
- Progress dashboard with velocity metrics
- Cost analytics with trends
- Agent performance comparison
- Quality signals panel
- Activity timeline

**5. Settings** (`/src/components/workspaces/SettingsWorkspace.tsx`)
- Agent memory management
- Repository understanding display
- Conventions editor
- Team memory configuration
- Budget and integration settings

#### Data Model Highlights

```typescript
Mission {
  id, title, phase, status
  intent: { description, parsed, clarifications, confidence }
  plan: { summary, approach, tasks[], risks[], alternatives[] }
  conversation: { messages: Message[], decisions: Decision[], questions: Question[] }
  execution: { tasks: ExecutingTask[], changes: Change[], approvals: Approval[] }
  team: { agents: string[], composition: TeamComposition }
  metrics: { cost, time, quality }
}

Agent {
  id, name, role, status, emoji, color
  persona: { style, specialty, preferences }
  memory: { projectUnderstanding, conventions[], pastDecisions[] }
  metrics: { tasksCompleted, approvalRate, qualityScore }
}

Observation {
  id, type, priority, agentId
  title, description, reasoning
  suggestedAction, codeReferences[]
  status: pending | acknowledged | dismissed | actioned
}
```

### Type System (`src/types/index.ts`)

All domain types are centrally defined. Key enums:
- `WorktreeStatus`: active | paused | conflict | completed | merging
- `TaskStatus`: backlog | planning | in-progress | review | done | blocked
  - **backlog**: Not started, no work done yet
  - **planning**: Specification being generated or awaiting approval
  - **in-progress**: Specification approved, implementation started
  - **review**: Implementation done, under review
  - **done**: Completed
  - **blocked**: Cannot proceed
- `AgentRole`: implementer | architect | tester | reviewer | docs
- `WorktreeAgentRole`: primary | supporting | waiting | completed

### Human-Gated Pipeline Workflow

The application implements a **human-in-the-loop** workflow where critical decisions require human approval before agents proceed:

#### 1. Task Creation & Specification Phase

```
User Creates Task
      ↓
  [Task Status: backlog]
      ↓
AI Generates Specification ──→ TaskSpecification
      ↓                         - summary
  [Task Status: planning]       - technicalApproach
      ↓                         - acceptanceCriteria[]
User Reviews Spec in            - estimatedScope
Pipeline View                   - dependencies
      ↓                         - risks
 ┌────┴─────┐
 │          │
Approve  Request Changes
 │          │
 │          └─→ AI Revises Spec ──┐
 │                                 │
 │←────────────────────────────────┘
 ↓
[Task Status: in-progress]
Agents Begin Implementation
```

**Key Components:**
- **TaskSpecification** (src/types/index.ts): AI-generated specification with approval workflow
  - `status`: draft | pending_approval | approved | changes_requested | rejected
  - `acceptanceCriteria`: Array of success criteria that define "done"
  - `implementedIn`: Links criteria to actual commits/files (traceability)
- **SpecificationViewer** (src/components/shared/SpecificationViewer.tsx): UI for reviewing/approving specs
- **SpecificationStatus** badges in Pipeline view show approval state

#### 2. Implementation & Human Review

```
Agents Implement Based on Spec
      ↓
Agents Commit to Branch
      ↓
[Human Reviews in Diff View]
      ↓
 ┌────┴──────┐
 │           │
Approve  Revise Spec
 │           │
 │           └─→ Navigate to Pipeline View
 │               Modify Specification
 │               Agents Re-implement
 ↓
Advance to Testing Stage
```

**Key Components:**
- **DiffViewer Actions** (src/components/diff/DiffViewer.tsx):
  - **"Approve" button**: Gates pipeline progression, advances task to next stage
  - **"Revise Specification" button**: Navigates to Pipeline view for spec modification
  - No "Revert" button - complex changes handled through spec revision
- **SpecificationTraceability** (src/components/shared/SpecificationTraceability.tsx):
  - Shows which acceptance criteria each file implements
  - Links from Diff view back to specification in Pipeline view
  - Enables verification that implementation matches approved spec

#### 3. Specification Traceability

Every change is traceable back to the approved specification:

```
Specification → Implementation → Verification
     (AC-1)    →   Order.java   →  Diff View
                        ↓
                 Shows "Implements AC-1"
                        ↓
              Click "View in Specification"
                        ↓
               Pipeline View (highlights AC-1)
```

**Data Model:**
```typescript
// Acceptance criteria track their implementation
AcceptanceCriterion {
  id: 'AC-1',
  description: 'Order entity persists to database...',
  implementedIn?: {
    commits: ['8e4d1a9'],
    files: ['src/.../Order.java']
  }
}

// File changes link back to criteria
TaskFileChange {
  path: 'src/.../Order.java',
  fulfillsAcceptanceCriteria: ['AC-1', 'AC-2'],
  specRationale: 'Created Order entity with JPA annotations...'
}

// Commits link to criteria
TaskCommit {
  sha: '8e4d1a9',
  fulfillsAcceptanceCriteria: ['AC-1', 'AC-2', 'AC-3']
}
```

#### 4. Workflow Philosophy

**Design Principles:**
1. **Commits are permanent** - Changes are already in version control, not pending approval
2. **Spec is the source of truth** - If implementation doesn't match expectations, revise the spec
3. **Human gates progression** - "Approve" advances pipeline stage (Implementation → Testing)
4. **Traceability is bidirectional** - Navigate from spec to code and code back to spec
5. **No code-level comments** - Feedback goes into specification revisions, not code annotations

**Rejected Patterns:**
- ❌ "Revert" button in Diff view (too complex, use git operations or spec revision)
- ❌ "Comment" on individual changes (use spec revision with feedback instead)
- ❌ Pending approval before commit (agents commit to branches, humans gate stage progression)

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
- Task-centric kanban board showing all tasks by status (5 columns)
  - **Backlog** - Tasks not yet started
  - **Planning** - Specifications being generated or awaiting approval (highlighted)
  - **In Progress** - Implementation underway
  - **Review** - Under review
  - **Done** - Completed tasks
- Shows task progress, pipeline stage, repos involved, and cost
- **"Review & Approve Specification"** button for tasks with pending spec approval
- **"View Dependencies"** button for tasks with dependencies or blocks
- Click "→ View Pipeline" to navigate to PipelinesPanel

### PipelinesPanel (replaces WorktreePanel)
- Main interface for monitoring task execution and **reviewing specifications**
- Left sidebar: Filterable task list grouped by status
- Right area: Comprehensive pipeline detail view
  - **SpecificationViewer**: Shows AI-generated specification with approval status
    - User prompt and context
    - Technical approach and design decisions
    - **Acceptance Criteria** with completion tracking and traceability
    - Scope estimation, dependencies, and risks
    - Approval workflow badges
  - Pipeline stage visualization with costs
  - Repositories involved (multi-repo support)
  - Agent contributions with roles and costs
  - Recent commits with navigation to DiffPanel
  - Changed files grouped by repository

### DiffPanel
- File-level diff viewer with **human-gated approval workflow**
- Three modes:
  - **All Changes**: Show all file changes for selected task
  - **By Commit**: Filter files by specific commit
- Three-column layout: file list | diff viewer | context panels (right sidebar)
- **Right Sidebar** (top to bottom):
  1. **Decision Context** (ReasoningPanel) - Why this change was made
     - Reasoning decisions, rationales, alternatives
     - References and test results
  2. **Specification Context** (SpecificationTraceability) - What spec this implements
     - Shows acceptance criteria fulfilled by this file
     - Links to view criterion in Pipeline view (with deep linking and highlighting)
     - Summary of criteria implemented
- **Action Buttons** in diff viewer header:
  - **"Revise Specification"**: Navigate to Pipeline view to modify spec
  - **"Approve"**: Approve implementation and advance to next pipeline stage
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
