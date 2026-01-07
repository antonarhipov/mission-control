# Mission Control: Agentic Development Environment

## Vision & Philosophy

**Mission Control** is a UI concept for orchestrating multi-agent AI coding workflows. It represents the evolution from traditional IDEs to "Agentic Development Environments" (ADEs) where developers maintain strategic oversight while AI agents handle implementation details.

### The Navigator Pattern

Traditional AI coding tools follow a "driver-passenger" model where AI drives and humans observe. Mission Control inverts this with the **Navigator Pattern**:

- **Human as Navigator**: Sets direction, makes architectural decisions, approves changes
- **AI as Driver(s)**: Executes implementation, follows patterns, reports progress
- **Transparency**: Full visibility into what agents are doing and why
- **Control**: Ability to pause, redirect, or override at any moment

### Core Principles

1. **Task-Centric Development**: Tasks are the central organizing unit, worktrees are implementation details
2. **Team-Based Agents**: Agents work in teams with specialized roles (Implementer, Architect, Tester, Reviewer, Docs)
3. **Pipeline Workflows**: Each task follows a defined pipeline with visible stages
4. **Cost Transparency**: Real-time cost tracking per agent, per task, per session
5. **Reasoning Visibility**: Every code change includes the agent's reasoning and alternatives considered

---

## Architecture Overview

### Data Model Hierarchy

```
Project (acme-commerce)
├── Repositories
│   ├── api-gateway (path, remote, default branch)
│   ├── order-service
│   └── frontend
│
├── Teams
│   ├── Backend Squad (agents: Implementer, Architect, Tester, Reviewer)
│   ├── Documentation (agents: Doc Writer)
│   └── Infrastructure (agents: Implementer, Reviewer, Tester)
│
└── Tasks (THE CENTRAL ENTITY)
    ├── ORD-142: "Implement Order entity"
    │   ├── Team: Backend Squad
    │   ├── Agents: [Implementer (active), Architect (active), Tester (waiting)]
    │   ├── Pipeline: Design → Implementation → Testing → Review → Docs
    │   ├── Worktrees (implementation detail, auto-created by agents):
    │   │   ├── order-service @ feature/order-service
    │   │   └── api-gateway @ feature/order-service
    │   ├── Commits: [a3f7b2c, 8e4d1a9, ...] (aggregated from all worktrees)
    │   ├── File Changes: [OrderService.java, Order.java, ...] (across repos)
    │   ├── Progress: 65%
    │   └── Cost: $4.66
    ├── ORD-145: "Write integration tests" → backlog (no worktrees yet)
    └── ...
```

### Key Entities

#### Task (CENTRAL ENTITY)
The task is the **central organizing unit**. It represents:
- A unit of work (like a Jira ticket)
- A team assignment determining which agents participate
- A pipeline defining the workflow stages
- An aggregation point for cost, progress, and file changes across all repos
- Automatic worktree creation by agents (hidden from user)

Properties:
- Status: backlog, in-progress, review, done, blocked
- Priority: critical, high, medium, low
- Tags: feature, bug, docs, etc.
- Dependencies: dependsOn (blocked by), blocks (blocking)
- Metrics: progress %, total cost, file changes, commits

#### Worktree (Implementation Detail)
Auto-created by agents within tasks:
- An isolated git worktree with a feature branch
- Belongs to a specific repository
- Contains repo-specific changes for the task
- Status: active, conflict, completed, merged
- Hidden from primary UI (shown in technical views only)

#### Agent
Individual AI workers with specialized roles:
- **Implementer**: Writes production code
- **Architect**: Reviews design, creates DTOs, ensures patterns
- **Tester**: Writes and runs tests
- **Reviewer**: Code review, quality checks
- **Docs**: Documentation, comments, OpenAPI specs

#### Team
Groups of agents that work together on tasks:
- Teams have a color and description
- Tasks are assigned to teams
- Team composition determines the pipeline

#### Repository
Connected codebases:
- Local path and remote URL
- Default branch configuration
- Connection status
- Auto-discovered when agents need to make changes

#### Pipeline
Workflow stages within a task:
- Each stage has a status: pending, active, completed, blocked
- Stages are assigned to specific agents
- Cost tracked per stage
- Progress flows through stages sequentially

---

## Functional Requirements

### FR-1: Header

**Purpose**: Global context and session status

**Components**:
- Project name display ("acme-commerce")
- Active branch indicator
- Session cost (real-time)
- Total tokens consumed
- Active worktree count
- User profile menu

**Behavior**:
- Cost updates in real-time as agents work
- Token count refreshes periodically
- Clicking project name could open project settings (future)

---

### FR-2: Tab Navigation

**Tabs** (in order):
1. **Overview** (📊) - Dashboard with task kanban and pending approvals
2. **Pipelines** (⚡) - Task pipeline status and progress, badge shows active count
3. **Diff Viewer** (📝) - Code changes with reasoning, badge shows file count
4. **Cost Analytics** (💰) - Budget tracking and cost breakdown
5. **Config** (⚙️) - Agent settings, permissions, team management, repositories
6. **Dependencies** (🔗) - Task dependency graph with critical path, badge shows blocked count with alert

**Behavior**:
- Active tab has blue underline indicator
- Badges show dynamic counts
- Alert badges (amber) indicate items needing attention
- Selected task persists across Overview, Pipelines, Dependencies, and Diff tabs

---

### FR-3: Overview Panel

**Purpose**: High-level dashboard combining task management and approval queue

**Layout**: Two-column grid (flex | 320px)

#### Main Area: Task Kanban Board
- Four columns: Backlog, In Progress, Review, Done
- Column headers with counts
- Task cards show:
  - Task ID (monospace)
  - Priority indicator (colored dot)
  - Title (2 lines max)
  - Tags (feature, bug, etc.)
  - Current pipeline stage indicator
  - Progress bar and percentage
  - Repositories count (e.g., "3 repos")
  - Cost (e.g., "$3.04")
  - Agent avatars if active
  - "View Pipeline" navigation button (when in progress)
  - "View Dependencies" button (when task has dependencies or blocks)
- "Add Task" button in header
- Responsive column sizing

#### Right Column: Pending Approvals
- Header with count badge (amber when items pending)
- Approval cards show:
  - Agent avatar and name
  - Task reference
  - Approval type (Decision, Command, Review)
  - Title and description
  - Context/rationale
  - Action buttons (primary action + alternative)
- "Approve All Safe" bulk action button

**Approval Types**:
- **Decision**: Architectural choices needing human input
- **Command**: Terminal commands requiring confirmation
- **Review**: Code or design requiring sign-off

---

### FR-4: Pipelines Panel

**Purpose**: Detailed view of task pipeline status and progress across repositories

**Layout**: Two-column grid (300px | flex)

#### Left Column: Task List Sidebar
- Filter dropdown (All, In Progress, Review, Backlog, Blocked)
- Tasks grouped by status
- Each task shows:
  - Task ID (monospace)
  - Title (truncated)
  - Progress percentage
  - Cost
- Selection highlight
- Collapsible sections for each status group

#### Right Column: Pipeline Detail View

**Header Section**:
- Task ID and full title
- Team badge (colored)
- Status badge
- Timestamps: Started, Last updated
- Total cost
- Action buttons:
  - Pause/Resume
  - Create PR (when completed)
  - Mark Complete

**Pipeline Visualization**:
- Horizontal pipeline stages
- Each stage shows:
  - Stage name (Design, Implementation, Testing, Review, Docs)
  - Status: pending (gray), active (blue with pulse), completed (green), blocked (red)
  - Agent emoji assigned to stage
  - Cost for stage
  - Completion timestamp (if done)

**Repositories Involved Section**:
- Mini cards for each repository with changes
- Each card shows:
  - Repository name
  - Status indicator (active, conflict, completed)
  - Files changed count
  - Worktree branch name (technical detail, small text)
- Conflict warning if any repo has conflicts

**Agent Contributions Section**:
- Grid of agent cards
- Each card shows:
  - Agent emoji and name
  - Active indicator (green ring when working)
  - Current stage
  - Role (primary/supporting/waiting/completed)
  - Contribution stats:
    - Commits count
    - Files changed
    - Lines added (green)
    - Lines removed (red)
    - Individual cost

**Recent Commits Section**:
- Commit list with:
  - Agent/human avatar
  - Commit message
  - SHA (truncated, blue link)
  - Repository indicator
  - Timestamp
  - Files changed count
  - Cost per commit
  - "View Diff →" button
- Distinguishes agent commits from human commits
- Shows which repository each commit belongs to

**Changed Files Section**:
- Files grouped by repository
- Each file shows:
  - Change type indicator (A/M/D colored)
  - Path and filename
  - Agent attribution
  - Addition/deletion counts
  - "View →" button to open in Diff viewer
- Conflict indicator on files with conflicts

---

### FR-5: Diff Viewer Panel

**Purpose**: Review code changes with full reasoning context

**Layout**: Three-column grid (260px | flex | 340px)

#### Header Bar
- Task selector dropdown
- Scope toggle: "All Changes" vs "By Commit"
- Commit dropdown (when "By Commit" selected)
- Team badge
- Stats: File count, +additions/-deletions, cost (for current scope)

#### Left Column: File List
- Header with total changes count
- Files grouped by change type
- Each file shows:
  - Change type indicator (A/M/D colored)
  - Filename
  - Agent emoji
  - Addition/deletion counts
- Selection highlight

#### Center Column: Diff Viewer
- File header with full path
- Hunk navigation
- Unified diff view with:
  - Line numbers
  - Context lines (gray)
  - Added lines (green background)
  - Deleted lines (red background)
  - Syntax highlighting
- Inline controls:
  - Copy hunk
  - Accept/Reject hunk (future)

#### Right Column: Reasoning Panel
- **Why These Changes** section:
  - Decision cards with:
    - Decision type badge
    - Title
    - Description
    - Rejected alternatives (if any)
  - Rationale explanations
- **References** section:
  - Documentation links
  - Related code references
  - External resources
- **Test Results** section (if available):
  - Test suite name
  - Pass/fail count with progress bar
  - Individual test status indicators

---

### FR-6: Cost Analytics Panel

**Purpose**: Budget management and cost transparency

**Layout**: Three sections (top stats, agent breakdown, session details)

#### Budget Status Section
- Three budget cards:
  - Daily Budget (with reset countdown)
  - Session Budget
  - Monthly Budget (with days remaining)
- Each shows:
  - Current spend
  - Limit
  - Progress bar (colored by utilization)
  - Percentage used

#### Agent Cost Breakdown Section
- Sortable table/cards per agent:
  - Agent avatar and name
  - Input tokens + cost
  - Output tokens + cost
  - Tool calls + cost
  - Total cost
  - Efficiency rating (Excellent/Good/Fair/Poor)
- Total row at bottom

#### Model Pricing Reference
- Quick reference for model costs
- Input/Output per 1M tokens
- Color-coded by model family

#### Session Statistics
- Total session cost
- Total tokens
- Active worktrees
- Cost per worktree breakdown

---

### FR-7: Config Panel

**Purpose**: Agent configuration and permission management

**Layout**: Sidebar navigation + detail area

#### Sidebar Navigation
- Teams section
- Agents section
- Global Defaults section
- Permissions section

#### Teams View
- Team list with member counts
- Team detail:
  - Name, description, color
  - Member list with status
  - Add/remove agent buttons
  - Team settings

#### Agent View
- Agent selection
- Agent configuration:
  - Model selection
  - Temperature slider (0.0-1.0)
  - Max output tokens
  - Extended thinking toggle
- Autonomy level slider:
  - Conservative: Ask before any action
  - Balanced: Ask for destructive actions
  - Autonomous: Act, report after
  - Full Auto: Act silently
- Behavior toggles:
  - Auto-commit changes
  - Run tests after changes
  - Max iterations per task

#### Permissions View
- Permission matrix:
  - File System: Disabled/Read-only/Allowlist/Ask/Full
  - Terminal: Same options
  - Git Operations: Same options
  - Web Access: Same options
- Per-agent permission overrides

---

### FR-8: Dependencies Panel

**Purpose**: Visualize task dependencies and identify critical path

**Layout**: Graph area + detail sidebar

**Features**:
- **Dynamic Critical Path Calculation**: Automatically computes critical path using CPM algorithm
- **Validation Warnings**: Detects circular dependencies and missing task references
- **Cross-Tab Navigation**: Navigate to Pipelines or Diff viewer from task details

#### View Modes
- **Graph**: Node-based visualization (default)
- **List**: Sortable table view
- **Timeline**: Chronological phases

#### Graph View
- Column layout by status (Done → In Progress → Review → Backlog)
- Task nodes with:
  - Task ID
  - Status dot (colored)
  - Title (truncated)
  - Repository count
  - Agent avatars
  - Progress bar
  - Critical path indicator (red badge with warning icon)
  - Focus animation (cyan pulse when navigated to from other tabs)
- Dependency arrows:
  - Normal: gray curved lines
  - Critical path: red highlighted (thicker, animated)
- Legend for status colors and critical path
- Zoom controls (50%-150%)

#### Validation Banners
**Error Banner** (dismissible):
- Red background with alert icon
- Shows circular dependency cycles
- Example: "ORD-142 → ORD-145 → ORD-146 → ORD-142"
- Prevents critical path calculation until resolved

**Warning Banner** (dismissible):
- Amber background with info icon
- Shows validation warnings (e.g., missing task references)
- Example: "Task ORD-142 blocks non-existent task ORD-146"
- Critical path still calculated, but with caveats

#### Task Detail Sidebar
- Critical path warning (if applicable):
  - Red banner
  - "This task is on the critical path. Delays will impact the overall timeline."
- Task header:
  - ID, status badge, priority badge
  - Full title
- Repository info (if task has worktrees):
  - Repositories involved count
  - File/commit counts
  - Cost
- Progress bar
- Agent team list with active indicators
- Dependencies list (depends on):
  - Status dots for each dependency
  - Truncated titles
- Blocking list (blocks):
  - Status dots for each blocked task
  - Truncated titles
- Tags
- Action buttons:
  - "View Pipeline" → Navigates to Pipelines tab
  - "Open in Diff" → Navigates to Diff tab with latest commit

#### Critical Path Algorithm
- Uses Critical Path Method (CPM) with forward/backward pass
- Duration estimation:
  - Done tasks: Actual duration from timestamps
  - In-progress: Elapsed time + projected remaining based on progress
  - Backlog: Priority-based defaults (high=12h, medium=8h, low=4h)
- Circular dependency detection via DFS
- Topological sort using Kahn's algorithm
- Identifies tasks with zero slack as critical path

---

## Shared Components

### TaskCard
**Used in**: OverviewPanel (Kanban), PipelinesPanel (Task List)

**Props**:
- `task`: TaskV2 data
- `variant`: 'kanban' | 'list'
- `highlight`: Optional highlight for in-progress
- `onNavigateToPipeline`: Navigation callback
- `onNavigateToDependencies`: Navigation callback

**Features**:
- Shows task ID, title, priority
- Pipeline stage indicator
- Progress bar
- Repository count and cost
- Active agent avatars
- Navigation buttons (contextual)

**Variants**:
- Kanban: Full card with all details
- List: Compact version for sidebar

### TaskListSidebar
**Used in**: PipelinesPanel

**Props**:
- `selectedTaskId`: Current selection
- `onSelectTask`: Selection handler
- `filterStatus`: Optional status filter

**Features**:
- Consistent 300px width
- Grouped by status
- Collapsible sections
- Filter dropdown
- Shows progress and cost

---

## UI/UX Design Tokens

### Colors (Dark Theme)
```
Background:
- bg-0: #0d1117 (base)
- bg-1: #161b22 (elevated)
- bg-2: #21262d (interactive)
- bg-3: #30363d (hover)

Text:
- text-1: #f0f6fc (primary)
- text-2: #8b949e (secondary)
- text-3: #6e7681 (muted)

Accents:
- accent-blue: #58a6ff
- accent-green: #3fb950
- accent-red: #f85149
- accent-amber: #d29922
- accent-purple: #a371f7
- accent-cyan: #39d4c4

Border:
- border-1: #30363d
- border-2: #484f58
```

### Typography
- Font family: System fonts (SF Pro, Segoe UI, etc.)
- Monospace: JetBrains Mono, Menlo, Monaco
- Base size: 14px
- Small: 12px, 11px, 10px for dense info
- Headings: Semibold (600)

### Spacing
- Base unit: 4px
- Common spacing: 8px, 12px, 16px, 20px, 24px

### Effects
- Active agent glow: `shadow-[0_0_15px_rgba(88,166,255,0.15)]`
- Selection ring: `ring-1 ring-accent-blue`
- Hover lift: `hover:-translate-y-0.5`
- Transition: `transition-all duration-200`

---

## Future Considerations

### Multi-Repository Support (Option A Architecture)
When implementing multi-repo support, the data model shifts:

```
Project (workspace)
├── Repositories: [api-gateway, order-service, frontend, shared-types]
│
└── Task: ORD-150 "Implement authentication"
    ├── Team: Fullstack Team
    └── Worktrees: (one per repo)
        ├── api-gateway @ feature/auth
        ├── order-service @ feature/auth
        ├── frontend @ feature/auth (conflict)
        └── shared-types @ feature/auth (completed)
```

**Key Changes**:
- Task becomes container for multiple worktrees
- Each worktree belongs to a single repository
- Progress, cost aggregated at task level
- Diff viewer shows repository tabs
- Conflict resolution spans repos

### Additional Future Features
- Real-time collaboration (multiple humans)
- Voice commands for approvals
- AI suggestions for task decomposition
- Learning from approval patterns
- Integration with issue trackers (Jira, Linear)
- Custom pipeline templates
- Branch protection rules
- Automated PR creation
- Notification system
- Keyboard shortcuts throughout

---

## Technical Implementation

### Stack
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom theme
- **State**: React useState (local), could scale to Zustand
- **Build**: Vite
- **Icons**: Lucide React

### Component Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── TabBar.tsx
│   ├── panels/
│   │   ├── OverviewPanel.tsx
│   │   ├── PipelinesPanel.tsx
│   │   ├── DiffPanel.tsx
│   │   ├── CostPanel.tsx
│   │   ├── ConfigPanel.tsx
│   │   └── DependenciesPanel.tsx
│   ├── diff/
│   │   ├── FileList.tsx
│   │   ├── DiffViewer.tsx
│   │   └── ReasoningPanel.tsx
│   └── shared/
│       ├── TaskCard.tsx
│       ├── TaskListSidebar.tsx (planned)
│       ├── TaskSidebar.tsx
│       └── WorktreeCard.tsx (legacy, V1 compatibility)
├── data/
│   ├── mockData.ts (V1 data, legacy)
│   └── mockDataV2.ts (V2 task-centric data)
├── types/
│   └── index.ts
├── utils/
│   └── dependencyGraph.ts (CPM algorithms)
├── hooks/
│   └── useDataModel.ts
└── App.tsx
```

### Data Flow
1. `App.tsx` manages global state:
   - `activeTab`: Current tab selection
   - `selectedTaskId`: Currently selected task (persists across tabs)
   - `selectedCommitSha`: Currently selected commit (for Diff viewer)
   - `focusedTaskId`: Task to highlight with animation (transient, 3s timeout)
2. `useDataModel()` hook provides V2 data model access:
   - Always returns V2 (task-centric) data
   - Tasks, repositories, project, teams, agents
   - Helper functions for data lookups
3. Panels receive state via props and update via callbacks:
   - `onSelectTask(taskId)`: Update selected task
   - `navigateToDiff(taskId, commitSha?)`: Navigate to Diff viewer
   - `navigateToPipeline(taskId)`: Navigate to Pipelines panel
   - `navigateToDependencies(taskId)`: Navigate to Dependencies panel
4. Mock data structure:
   - `mockDataV2.ts`: Task-centric data (current)
   - `mockData.ts`: Worktree-centric data (legacy, V1 compatibility)
5. Navigation pattern:
   - Cross-tab navigation preserves task context
   - Focus animation highlights navigated-to tasks
   - State synchronization across panels

---

## Glossary

| Term | Definition |
|------|------------|
| **ADE** | Agentic Development Environment - next-gen IDE with AI agents |
| **Task** | Central organizing unit representing work to be done (like a Jira ticket) |
| **Worktree** | Git worktree (implementation detail, auto-created by agents per repository) |
| **Repository** | Connected codebase (local path + remote URL + configuration) |
| **Pipeline** | Sequence of stages within a task (Design → Implementation → Test → Review) |
| **Agent** | AI worker with specialized role (Implementer, Architect, Tester, Reviewer, Docs) |
| **Team** | Group of agents working together on tasks |
| **Approval** | Human decision point in agent workflow |
| **Navigator Pattern** | Human guides, AI executes |
| **Critical Path** | Sequence of dependent tasks affecting delivery, calculated via CPM algorithm |
| **CPM** | Critical Path Method - algorithm for identifying critical tasks with zero slack |
| **Focus Animation** | 3-second cyan pulse highlight when navigating to a task from another tab |
| **Cross-Tab Navigation** | Ability to navigate between tabs while preserving task context |
| **TaskV2** | Task-centric data model with embedded worktrees (current implementation) |
| **V1 Compatibility** | Legacy worktree-centric data model (deprecated but still supported) |

---

*Document Version: 2.0 (Task-Centric)*
*Last Updated: January 2025*
*Project: Mission Control UI Prototype*
