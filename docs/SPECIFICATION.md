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

1. **Worktree-Centric Development**: Git worktrees are the central organizing unit, not files or tasks
2. **Team-Based Agents**: Agents work in teams with specialized roles (Implementer, Architect, Tester, Reviewer, Docs)
3. **Pipeline Workflows**: Each worktree follows a defined pipeline with visible stages
4. **Cost Transparency**: Real-time cost tracking per agent, per worktree, per session
5. **Reasoning Visibility**: Every code change includes the agent's reasoning and alternatives considered

---

## Architecture Overview

### Data Model Hierarchy

```
Project (acme-commerce)
├── Teams
│   ├── Backend Squad (agents: Implementer, Architect, Tester, Reviewer)
│   ├── Documentation (agents: Doc Writer)
│   └── Infrastructure (agents: Implementer, Reviewer, Tester)
│
├── Tasks (Kanban items)
│   ├── ORD-142: "Implement Order entity" → linked to Worktree
│   ├── ORD-145: "Write integration tests" → backlog (no worktree yet)
│   └── ...
│
└── Worktrees (THE CENTRAL ENTITY)
    ├── wt-order-service
    │   ├── Branch: feature/order-service
    │   ├── Task: ORD-142
    │   ├── Team: Backend Squad
    │   ├── Agents: [Implementer (active), Architect (active), Tester (waiting)]
    │   ├── Pipeline: Design → Implementation → Testing → Review → Docs
    │   ├── File Changes: [OrderService.java, Order.java, ...]
    │   ├── Commits: [a3f7b2c, 8e4d1a9, ...]
    │   └── Cost: $4.66
    └── ...
```

### Key Entities

#### Worktree
The worktree is the **central organizing unit**. It represents:
- An isolated git worktree with a feature branch
- A unit of work linked to a task
- A team assignment determining which agents participate
- A pipeline defining the workflow stages
- An aggregation point for cost, progress, and file changes

#### Agent
Individual AI workers with specialized roles:
- **Implementer**: Writes production code
- **Architect**: Reviews design, creates DTOs, ensures patterns
- **Tester**: Writes and runs tests
- **Reviewer**: Code review, quality checks
- **Docs**: Documentation, comments, OpenAPI specs

#### Team
Groups of agents that work together on worktrees:
- Teams have a color and description
- Worktrees are assigned to teams
- Team composition determines the pipeline

#### Task
Represents work items (like Jira tickets):
- Has status: backlog, in-progress, review, done, blocked
- May be linked to a worktree (when work starts)
- Tracks dependencies (dependsOn, blocks)

#### Pipeline
Workflow stages within a worktree:
- Each stage has a status: pending, active, completed, blocked
- Stages are assigned to specific agents
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
2. **Worktrees** (🌳) - Detailed worktree management, badge shows active count
3. **Diff Viewer** (📝) - Code changes with reasoning, badge shows file count
4. **Cost Analytics** (💰) - Budget tracking and cost breakdown
5. **Config** (⚙️) - Agent settings, permissions, team management
6. **Dependencies** (🔗) - Task dependency graph, badge shows blocked count with alert

**Behavior**:
- Active tab has blue underline indicator
- Badges show dynamic counts
- Alert badges (amber) indicate items needing attention
- Selected worktree persists across Overview, Worktrees, and Diff tabs

---

### FR-3: Overview Panel

**Purpose**: High-level dashboard combining task management and approval queue

**Layout**: Three-column grid (340px | flex | 320px)

#### Left Column: Worktree Sidebar (Shared Component)
- Header: "Worktrees" label + "New" button
- Sections:
  - **Active** (blue): Worktrees with status active/conflict
  - **Ready to Merge** (green): Worktrees with status completed
- Each worktree card shows:
  - Branch name
  - Task ID and title
  - Team badge (colored)
  - Status indicator
  - Active agents (emoji avatars)
  - Progress bar and percentage
  - Cost
- Footer stats: Active count, Conflicts count, Ready count
- Selection state syncs across tabs

#### Center Column: Task Kanban Board
- Four columns: Backlog, In Progress, Review, Done
- Column headers with counts
- Task cards show:
  - Task ID (monospace)
  - Priority indicator (colored dot)
  - Title (truncated)
  - Tags (first 2)
  - Worktree link if assigned
  - Agent avatars if active
  - Progress bar
- "Add Task" button in header
- Filtered by selected worktree (or shows all if none selected)

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

### FR-4: Worktrees Panel

**Purpose**: Detailed view of worktree status and activity

**Layout**: Two-column grid (340px | flex)

#### Left Column: Worktree Sidebar (Shared Component)
Same as Overview panel but without "All Tasks" option

#### Right Column: Worktree Detail View

**Header Section**:
- Branch name (monospace, blue link)
- Status badge (Active/Conflict/Completed/Merging)
- Team badge (colored)
- Base branch indicator
- Action buttons:
  - Pause/Resume
  - Create PR (when completed)
  - Merge button (when ready)
- Timestamps: Created, Last updated

**Conflict Warning** (if applicable):
- Red warning banner
- List of conflicting files
- Conflict details (our change vs their change)
- "Resolve" button

**Team Pipeline Section**:
- Horizontal pipeline visualization
- Stages with status colors:
  - Pending: gray
  - Active: blue (animated pulse)
  - Completed: green
  - Blocked: red
- Agent avatar under each stage
- Stage names and completion timestamps

**Agent Contributions Section**:
- Grid of agent cards
- Each card shows:
  - Agent emoji and name
  - Active indicator (green ring when working)
  - Current stage
  - Role (primary/supporting/waiting)
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
  - Timestamp
  - Files changed indicator
- Distinguishes agent commits from human commits

**Changed Files Preview**:
- File list with change type indicators (A/M/D)
- Path and filename
- Agent attribution
- Addition/deletion counts

---

### FR-5: Diff Viewer Panel

**Purpose**: Review code changes with full reasoning context

**Layout**: Three-column grid (260px | flex | 340px)

#### Header Bar
- Worktree selector dropdown
- Team badge
- Stats: File count, +additions/-deletions, cost

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

**Purpose**: Visualize task dependencies and critical path

**Layout**: Graph area + detail sidebar

#### View Modes
- **Graph**: Node-based visualization
- **List**: Sortable table view
- **Timeline**: Chronological phases

#### Graph View
- Column layout by status (Done → In Progress → Review → Backlog)
- Task nodes with:
  - Task ID
  - Status dot (colored)
  - Title (truncated)
  - Worktree indicator
  - Agent avatars
  - Progress bar
- Dependency arrows:
  - Normal: gray curved lines
  - Critical path: red highlighted
- Legend for status colors
- Zoom controls (50%-150%)

#### Task Detail Sidebar
- Critical path warning (if applicable)
- Task header:
  - ID, status badge, priority badge
  - Full title
- Worktree info (if linked):
  - Branch name
  - File/commit counts
  - Cost
- Progress bar
- Agent team list
- Dependencies list (depends on)
- Blocking list (blocks)
- Tags

---

## Shared Components

### WorktreeSidebar
**Used in**: Overview, Worktrees panels

**Props**:
- `selectedWorktreeId`: Current selection
- `onSelectWorktree`: Selection handler
- `showAllTasksOption`: Whether to show "All Tasks" option

**Features**:
- Consistent 340px width
- Grouped sections (Active, Ready to Merge)
- Stats footer
- Synced selection state

### WorktreeCard
**Used in**: WorktreeSidebar

**Props**:
- `worktree`: Worktree data
- `variant`: 'compact' | 'full'
- `isSelected`: Selection state
- `onClick`: Click handler

**Variants**:
- Compact: Minimal info for dense lists
- Full: Complete info with all stats

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
│   │   ├── WorktreePanel.tsx
│   │   ├── DiffPanel.tsx
│   │   ├── CostPanel.tsx
│   │   ├── ConfigPanel.tsx
│   │   └── DependenciesPanel.tsx
│   ├── diff/
│   │   ├── FileList.tsx
│   │   ├── DiffViewer.tsx
│   │   └── ReasoningPanel.tsx
│   └── shared/
│       ├── WorktreeSidebar.tsx
│       └── WorktreeCard.tsx
├── data/
│   └── mockData.ts
├── types/
│   └── index.ts
└── App.tsx
```

### Data Flow
1. `App.tsx` manages global state (activeTab, selectedWorktreeId)
2. Panels receive state via props
3. Panels can update shared state via callbacks
4. Mock data simulates backend responses
5. Helper functions provide data lookups

---

## Glossary

| Term | Definition |
|------|------------|
| **ADE** | Agentic Development Environment - next-gen IDE with AI agents |
| **Worktree** | Git worktree + associated metadata (team, pipeline, cost) |
| **Pipeline** | Sequence of stages (Design → Implementation → Test → Review) |
| **Agent** | AI worker with specialized role |
| **Team** | Group of agents working together |
| **Approval** | Human decision point in agent workflow |
| **Navigator Pattern** | Human guides, AI executes |
| **Critical Path** | Sequence of dependent tasks affecting delivery |

---

*Document Version: 1.0*
*Last Updated: January 2025*
*Project: Mission Control UI Prototype*
