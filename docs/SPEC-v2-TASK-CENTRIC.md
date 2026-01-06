# Mission Control v2: Task-Centric Multi-Repo Architecture

## Philosophy Shift

### From Worktree-Centric to Task-Centric

**Previous Model (v1)**:
- Worktree was the central entity
- Users managed worktrees directly
- Tasks were secondary metadata

**New Model (v2)**:
- **Task is the central entity** - what the user cares about
- Worktrees are **implementation details** - created automatically by agents
- Repositories are **project configuration** - set up once, then forgotten

### User Mental Model

```
"I want to implement user authentication"
     ↓
Task: AUTH-101
     ↓
Agents automatically create worktrees in relevant repos
     ↓
User monitors pipeline progress, reviews changes, approves decisions
     ↓
Task complete → PRs created → merged
```

The user thinks in terms of:
- **What** needs to be done (Tasks)
- **Who** is doing it (Agent Teams)
- **How** it's progressing (Pipeline)
- **What** it costs (Cost breakdown)

The user does NOT think in terms of:
- Git worktrees (technical detail)
- Which repo needs changes (agents figure this out)
- Branch management (automated)

---

## Data Model v2

### Project

```typescript
interface Project {
  id: string;
  name: string;
  description?: string;
  
  // Connected repositories
  repositories: Repository[];
  
  // Configured teams
  teams: Team[];
  
  // Available agents
  agents: Agent[];
  
  // Budget settings
  budgets: Budget[];
}
```

### Repository

```typescript
interface Repository {
  id: string;
  name: string;                    // e.g., "order-service"
  path: string;                    // Local path
  remoteUrl?: string;              // GitHub/GitLab URL
  defaultBranch: string;           // e.g., "main"
  
  // Connection status
  status: 'connected' | 'disconnected' | 'error';
  lastSynced?: string;
}
```

### Task (CENTRAL ENTITY)

```typescript
interface Task {
  id: string;                      // e.g., "AUTH-101"
  title: string;
  description?: string;
  
  // Status in kanban
  status: 'backlog' | 'in-progress' | 'review' | 'done' | 'blocked';
  priority: 'critical' | 'high' | 'medium' | 'low';
  tags: string[];
  
  // Team assignment
  teamId: string;
  
  // Pipeline (workflow stages)
  pipeline: PipelineStage[];
  currentStage: string;
  
  // Agent assignments within this task
  agents: TaskAgent[];
  
  // Aggregated metrics (computed from worktrees)
  progress: number;                // 0-100
  totalCost: number;               // Sum of all agent costs
  
  // Technical details (hidden from primary view)
  worktrees: TaskWorktree[];       // Auto-created by agents
  
  // All commits across all worktrees
  commits: TaskCommit[];
  
  // All file changes across all worktrees
  fileChanges: TaskFileChange[];
  
  // Dependencies
  dependsOn?: string[];
  blocks?: string[];
  
  // Timestamps
  createdAt: string;
  startedAt?: string;              // When moved to in-progress
  completedAt?: string;
}
```

### TaskWorktree (Implementation Detail)

```typescript
interface TaskWorktree {
  id: string;
  repositoryId: string;            // Which repo
  branch: string;                  // Feature branch name
  baseBranch: string;              // e.g., "main"
  path: string;                    // Local worktree path
  
  status: 'active' | 'conflict' | 'completed' | 'merged';
  
  // Worktree-specific changes
  fileChanges: FileChange[];
  commits: Commit[];
  
  // Conflict info if any
  conflicts?: ConflictInfo[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}
```

### TaskCommit (Enhanced with Cost)

```typescript
interface TaskCommit {
  id: string;
  sha: string;
  message: string;
  
  // Attribution
  agentId?: string;
  authorType: 'agent' | 'human';
  
  // Which repo/worktree
  repositoryId: string;
  worktreeId: string;
  
  // Changes in this commit
  filesChanged: number;
  additions: number;
  deletions: number;
  
  // Cost attribution
  cost: CommitCost;
  
  timestamp: string;
}

interface CommitCost {
  inputTokens: number;
  outputTokens: number;
  toolCalls: number;
  totalCost: number;
}
```

### TaskFileChange (Enhanced)

```typescript
interface TaskFileChange {
  id: string;
  path: string;
  filename: string;
  
  // Which repo
  repositoryId: string;
  worktreeId: string;
  
  // Change details
  changeType: 'added' | 'modified' | 'deleted';
  additions: number;
  deletions: number;
  
  // Attribution
  agentId?: string;
  
  // Which commits include this file
  commitShas: string[];
}
```

### Pipeline & Agents

```typescript
interface PipelineStage {
  id: string;
  name: string;                    // e.g., "Design", "Implementation"
  status: 'pending' | 'active' | 'completed' | 'blocked';
  
  // Assigned agent
  agentId?: string;
  
  // Cost for this stage
  cost: number;
  
  // Timing
  startedAt?: string;
  completedAt?: string;
}

interface TaskAgent {
  agentId: string;
  role: 'primary' | 'supporting' | 'waiting' | 'completed';
  currentStage: string;
  isActive: boolean;
  
  // Agent's contribution to this task
  contribution: {
    commits: number;
    filesChanged: number;
    linesAdded: number;
    linesRemoved: number;
    cost: number;
  };
}
```

---

## UI Structure v2

### Tab Navigation (Updated)

| Tab | Icon | Purpose |
|-----|------|---------|
| Overview | 📊 | Kanban board + Pending approvals |
| Pipelines | ⚡ | Task list + Pipeline detail view |
| Diff Viewer | 📝 | Code changes (task or commit scope) |
| Cost Analytics | 💰 | Budget tracking + Cost breakdown |
| Config | ⚙️ | Repos, Teams, Agents, Permissions |
| Dependencies | 🔗 | Task dependency graph |

---

## FR-1: Overview Panel (Revised)

### Layout: Two columns (flex | 320px)

**NO left worktree sidebar** - removed entirely

#### Main Area: Kanban Board

```
┌─────────────────────────────────────────────────────────────────┐
│ Overview                                           [+ Add Task] │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ Backlog ──┐ ┌─ In Progress ─┐ ┌─ Review ────┐ ┌─ Done ────┐│
│  │    (3)     │ │      (2)      │ │    (1)      │ │   (4)     ││
│  ├────────────┤ ├───────────────┤ ├─────────────┤ ├───────────┤│
│  │            │ │               │ │             │ │           ││
│  │ ┌────────┐ │ │ ┌───────────┐ │ │ ┌─────────┐ │ │ ┌───────┐ ││
│  │ │AUTH-102│ │ │ │ AUTH-101  │ │ │ │ORD-140 │ │ │ │ORD-138│ ││
│  │ │        │ │ │ │ ⚡ → View │ │ │ │         │ │ │ │       │ ││
│  │ └────────┘ │ │ └───────────┘ │ │ └─────────┘ │ │ └───────┘ ││
│  │            │ │               │ │             │ │           ││
│  └────────────┘ └───────────────┘ └─────────────┘ └───────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Task Card (Enhanced)

```
┌─────────────────────────────┐
│ AUTH-101          ● high   │  ← ID + Priority dot
├─────────────────────────────┤
│ Implement user              │  ← Title (2 lines max)
│ authentication              │
├─────────────────────────────┤
│ 🏷️ feature  security       │  ← Tags
├─────────────────────────────┤
│ 👥 Backend Squad            │  ← Team badge
├─────────────────────────────┤
│ ⚡ Implementation           │  ← Current pipeline stage
│ ████████░░░░░░░░░░░ 45%    │  ← Progress bar
├─────────────────────────────┤
│ 📁 3 repos │ $3.04         │  ← Repos involved + Cost
├─────────────────────────────┤
│        [→ View Pipeline]    │  ← Navigation to Pipelines tab
└─────────────────────────────┘
```

#### Right Column: Pending Approvals
Same as v1, but with Task reference more prominent

---

## FR-2: Pipelines Panel (Renamed from Worktrees)

### Layout: Two columns (300px | flex)

#### Left Column: Task List

```
┌─────────────────────────────┐
│ Tasks              [Filter ▼]│  ← Filter by status
├─────────────────────────────┤
│ ┌─ In Progress ───────────┐ │
│ │                         │ │
│ │ ● AUTH-101              │ │  ← Selected task
│ │   User authentication   │ │
│ │   45% │ $3.04           │ │
│ │                         │ │
│ │ ○ ORD-142               │ │
│ │   Order entity          │ │
│ │   65% │ $4.66           │ │
│ │                         │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─ Review ────────────────┐ │
│ │                         │ │
│ │ ○ ORD-140               │ │
│ │   Migration review      │ │
│ │   70% │ $1.31           │ │
│ │                         │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─ Backlog ───────────────┐ │
│ │ (collapsed)        [+]  │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

Filter options:
- All
- In Progress
- Review
- Backlog
- Blocked
- Done (hidden by default)

#### Right Column: Pipeline Detail View

```
┌─────────────────────────────────────────────────────────────────┐
│ AUTH-101: Implement user authentication                         │
│ Team: Backend Squad │ Started: 45 min ago │ Cost: $3.04         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─ Pipeline ───────────────────────────────────────────────────┐│
│ │  ┌────────┐   ┌────────────┐   ┌────────┐   ┌────────┐      ││
│ │  │ Design │ → │ Implement  │ → │ Test   │ → │ Review │      ││
│ │  │   ✓    │   │  ● active  │   │ waiting│   │ waiting│      ││
│ │  │ 🏗️     │   │ ⚡         │   │ 🧪     │   │ 👁️     │      ││
│ │  │ $0.89  │   │ $2.15      │   │ -      │   │ -      │      ││
│ │  └────────┘   └────────────┘   └────────┘   └────────┘      ││
│ └───────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─ Repositories Involved ──────────────────────────────────────┐│
│ │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          ││
│ │  │ api-gateway │  │order-service│  │  frontend   │          ││
│ │  │ ● active    │  │ ● active    │  │ ⚠ conflict  │          ││
│ │  │ 2 files     │  │ 1 file      │  │ 3 files     │          ││
│ │  └─────────────┘  └─────────────┘  └─────────────┘          ││
│ └───────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─ Agent Contributions ────────────────────────────────────────┐│
│ │  ⚡ Implementer (active)     │ 3 commits │ +348 │ $2.15     ││
│ │  🏗️ Architect   (completed)  │ 1 commit  │ +77  │ $0.89     ││
│ │  🧪 Tester      (waiting)    │ -         │ -    │ -         ││
│ └───────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─ Recent Commits ──────────────────────────── [View All Diffs]┐│
│ │                                                              ││
│ │  ⚡ a3f7b2c  feat(auth): add JWT filter       12 min  $0.45 ││
│ │     └─ api-gateway │ 2 files │ +78 -0        [View Diff →]  ││
│ │                                                              ││
│ │  ⚡ d2e3f4a  feat(security): add UserContext  18 min  $0.32 ││
│ │     └─ order-service │ 1 file │ +45 -0       [View Diff →]  ││
│ │                                                              ││
│ │  🏗️ f4a5b6c  feat(types): add auth types      30 min  $0.89 ││
│ │     └─ shared-types │ 2 files │ +43 -0       [View Diff →]  ││
│ │                                                              ││
│ └───────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─ Changed Files ──────────────────────────────────────────────┐│
│ │  api-gateway/                                                ││
│ │    A  src/.../JwtFilter.java          ⚡  +78    [View →]   ││
│ │    M  src/.../SecurityConfig.java     🏗️  +34 -8 [View →]   ││
│ │  order-service/                                              ││
│ │    A  src/.../UserContext.java        ⚡  +45    [View →]   ││
│ │  frontend/                                                   ││
│ │    A  src/.../LoginForm.tsx           ⚡  +120   [View →]   ││
│ │    A  src/.../useAuth.ts       ⚠      ⚡  +65    [Resolve]  ││
│ └───────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## FR-3: Diff Viewer (Enhanced)

### Diff Scopes

The diff viewer supports two scopes:

1. **Task Scope**: All changes in the task (default)
2. **Commit Scope**: Changes in a specific commit

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Diff Viewer                                                     │
├─────────────────────────────────────────────────────────────────┤
│ Task: [AUTH-101 ▼]  │  Scope: [● All Changes ○ By Commit]      │
├─────────────────────────────────────────────────────────────────┤
│  (when "By Commit" selected)                                    │
│  Commit: [a3f7b2c - feat(auth): add JWT filter           ▼]    │
├──────────┬────────────────────────────────────┬─────────────────┤
│ Files    │ Diff                               │ Reasoning       │
│          │                                    │                 │
│ ┌──────┐ │                                    │                 │
│ │Repo: │ │                                    │                 │
│ │[All▼]│ │                                    │                 │
│ └──────┘ │                                    │                 │
│          │                                    │                 │
│ api-gw   │                                    │                 │
│  A Jwt.. │                                    │                 │
│  M Sec.. │                                    │                 │
│          │                                    │                 │
│ order-s  │                                    │                 │
│  A Use.. │                                    │                 │
│          │                                    │                 │
└──────────┴────────────────────────────────────┴─────────────────┘
```

### Diff Scope Behaviors

**All Changes (Task Scope)**:
- Shows cumulative diff (all commits combined)
- Files grouped by repository
- Agent attribution on each file
- Total cost for the task

**By Commit (Commit Scope)**:
- Dropdown to select specific commit
- Shows only files in that commit
- Commit-level cost shown
- Reasoning specific to that commit

---

## FR-4: Cost Analytics (Enhanced)

### Cost Questions Answered

1. **How much did it cost to implement the task?**
    - Task-level cost summary
    - Breakdown by pipeline stage
    - Breakdown by agent

2. **How much did it cost per commit?**
    - Commit list with individual costs
    - Cost trend over time

3. **What's the cost breakdown by agent/stage?**
    - Agent efficiency metrics
    - Stage cost comparison
    - Cost per line of code

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Cost Analytics                                                  │
├─────────────────────────────────────────────────────────────────┤
│ ┌─ Budget Status ──────────────────────────────────────────────┐│
│ │  Daily: $12.47 / $50  │  Session: $7.15 / $25  │  Monthly... ││
│ └───────────────────────────────────────────────────────────────┘│
│                                                                 │
│ ┌─ Task Cost Breakdown ─────────────────────────────────────────┐
│ │                                                               │
│ │  Task: [AUTH-101 ▼]                    Total: $3.04          │
│ │                                                               │
│ │  By Pipeline Stage:                                           │
│ │  ┌─────────┬─────────┬─────────┬─────────┐                   │
│ │  │ Design  │ Impl    │ Test    │ Review  │                   │
│ │  │ $0.89   │ $2.15   │ -       │ -       │                   │
│ │  │ ████    │ ███████ │         │         │                   │
│ │  └─────────┴─────────┴─────────┴─────────┘                   │
│ │                                                               │
│ │  By Agent:                                                    │
│ │  ⚡ Implementer    $2.15  ████████████████░░░░  71%          │
│ │  🏗️ Architect      $0.89  ██████░░░░░░░░░░░░░░  29%          │
│ │  🧪 Tester         $0.00  ░░░░░░░░░░░░░░░░░░░░   0%          │
│ │                                                               │
│ └───────────────────────────────────────────────────────────────┘
│                                                                 │
│ ┌─ Commit Cost History ─────────────────────────────────────────┐
│ │                                                               │
│ │  Time →                                                       │
│ │  $0.50 ┤           ╭─╮                                       │
│ │  $0.40 ┤     ╭─╮   │ │                                       │
│ │  $0.30 ┤ ╭─╮ │ │   │ │ ╭─╮                                   │
│ │  $0.20 ┤ │ │ │ │   │ │ │ │                                   │
│ │  $0.10 ┤ │ │ │ │   │ │ │ │                                   │
│ │        └─┴─┴─┴─┴───┴─┴─┴─┴─────                              │
│ │          c1  c2    c3  c4                                     │
│ │                                                               │
│ │  Commits:                                                     │
│ │  c1: a3f7b2c  feat(auth): add JWT filter        $0.45        │
│ │  c2: d2e3f4a  feat(security): add UserContext   $0.32        │
│ │  c3: f4a5b6c  feat(types): add auth types       $0.89        │
│ │  c4: e3f4a5b  feat(auth): add LoginForm         $0.38        │
│ │                                                               │
│ └───────────────────────────────────────────────────────────────┘
│                                                                 │
│ ┌─ Agent Efficiency ────────────────────────────────────────────┐
│ │  Agent       │ Tokens    │ Cost   │ Lines │ $/Line │ Rating  │
│ │  ⚡ Impl     │ 1.2M      │ $5.43  │ 847   │ $0.006 │ ⭐⭐⭐⭐   │
│ │  🏗️ Arch    │ 726K      │ $3.50  │ 125   │ $0.028 │ ⭐⭐⭐    │
│ │  🧪 Test    │ 350K      │ $2.31  │ 234   │ $0.010 │ ⭐⭐⭐    │
│ └───────────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────────┘
```

---

## FR-5: Config Panel (Enhanced with Repos)

### Sidebar Sections

1. **Repositories** (NEW)
2. **Teams**
3. **Agents**
4. **Defaults**
5. **Permissions**

### Repository Configuration

```
┌─────────────────────────────────────────────────────────────────┐
│ Config                                                          │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│ Repositories │  Connected Repositories                          │
│ ────────────│                                                  │
│ ● api-gw    │  ┌────────────────────────────────────────────┐  │
│ ● order-svc │  │ api-gateway                    ● Connected │  │
│ ● frontend  │  │                                            │  │
│ ● shared    │  │ Path: /workspace/api-gateway               │  │
│              │  │ Remote: github.com/acme/api-gateway        │  │
│ Teams       │  │ Default branch: main                       │  │
│ ────────────│  │ Last sync: 2 minutes ago                   │  │
│ Backend     │  │                                            │  │
│ Docs        │  │ [Sync Now]  [Settings]  [Disconnect]       │  │
│              │  └────────────────────────────────────────────┘  │
│ Agents      │                                                  │
│ ────────────│  ┌────────────────────────────────────────────┐  │
│ ⚡ Impl     │  │ order-service                  ● Connected │  │
│ 🏗️ Arch    │  │ ...                                        │  │
│ 🧪 Test    │  └────────────────────────────────────────────┘  │
│ 👁️ Rev     │                                                  │
│ 📝 Docs    │  [+ Add Repository]                              │
│              │                                                  │
└──────────────┴──────────────────────────────────────────────────┘
```

---

## Navigation Flows

### Flow 1: Overview → Pipeline Detail

1. User sees task card in Kanban
2. Clicks "→ View Pipeline" button
3. App switches to Pipelines tab with task selected

### Flow 2: Pipeline → Diff (Task Scope)

1. User views pipeline detail
2. Clicks "View All Diffs" button
3. App switches to Diff tab with task selected, "All Changes" scope

### Flow 3: Pipeline → Diff (Commit Scope)

1. User views pipeline detail
2. Clicks "View Diff →" on specific commit
3. App switches to Diff tab with task selected, commit selected

### Flow 4: Pipeline → Diff (File)

1. User views pipeline detail
2. Clicks "View →" on specific file
3. App switches to Diff tab with task selected, file selected

---

## Implementation Tasks

### Phase 1: Data Model Updates

```
□ T1.1: Update types/index.ts
  - Add Repository interface
  - Add Project interface  
  - Update Task to be central entity
  - Add TaskWorktree (replaces Worktree as central)
  - Add TaskCommit with cost
  - Add TaskFileChange with repo reference
  - Add CommitCost interface
  - Update PipelineStage with cost

□ T1.2: Update mockData.ts
  - Add repositories array
  - Add project object
  - Restructure tasks with full data
  - Embed worktrees inside tasks
  - Add cost data to commits
  - Add cost data to pipeline stages
```

### Phase 2: Overview Panel Refactor

```
□ T2.1: Remove WorktreeSidebar from Overview
  - Delete left column entirely
  - Expand Kanban to full width (minus approvals)

□ T2.2: Update Task Card component
  - Add current pipeline stage indicator
  - Add repos involved count
  - Add cost display
  - Add "→ View Pipeline" navigation button
  - Remove worktree-specific info

□ T2.3: Update Kanban layout
  - Full width minus approvals column
  - Responsive column sizing
```

### Phase 3: Pipelines Panel (New)

```
□ T3.1: Rename WorktreePanel → PipelinesPanel
  - Update file name
  - Update imports in App.tsx
  - Update TabBar label and icon

□ T3.2: Create TaskListSidebar component
  - Filter dropdown (status-based)
  - Task list grouped by status
  - Show: ID, title, progress, cost
  - Selection state

□ T3.3: Create PipelineDetailView component
  - Task header (title, team, timing, cost)
  - Pipeline stage visualization with costs
  - Repositories involved section (mini cards)
  - Agent contributions with costs
  - Commits list with costs and diff links
  - Changed files list grouped by repo

□ T3.4: Add navigation handlers
  - "View All Diffs" → Diff tab (task scope)
  - "View Diff →" on commit → Diff tab (commit scope)
  - "View →" on file → Diff tab (file selected)
```

### Phase 4: Diff Viewer Updates

```
□ T4.1: Add scope selector
  - "All Changes" vs "By Commit" toggle
  - Commit dropdown (when commit scope)

□ T4.2: Update file list
  - Group by repository
  - Repository filter dropdown
  - Show cost per file (if available)

□ T4.3: Update diff header
  - Show task reference
  - Show scope indicator
  - Show commit info (when commit scope)
  - Show total cost for scope

□ T4.4: Handle navigation from Pipelines
  - Accept taskId and optional commitSha
  - Accept optional fileId for initial selection
```

### Phase 5: Cost Analytics Updates

```
□ T5.1: Add task cost breakdown section
  - Task selector dropdown
  - Cost by pipeline stage (bar chart)
  - Cost by agent (horizontal bars)

□ T5.2: Add commit cost history
  - Timeline/chart of costs
  - Commit list with individual costs

□ T5.3: Update agent efficiency
  - Add cost per line metric
  - Add cost trend
```

### Phase 6: Config Panel Updates

```
□ T6.1: Add Repositories section
  - Repository list in sidebar
  - Repository detail view
  - Connection status indicators
  - Add/remove repository actions

□ T6.2: Repository detail component
  - Path, remote URL, branch info
  - Sync status and actions
  - Settings (branch patterns, etc.)
```

### Phase 7: TabBar Updates

```
□ T7.1: Rename "Worktrees" → "Pipelines"
  - Update tab label
  - Update icon (🌳 → ⚡)
  - Update TabId type
```

### Phase 8: App-Level State

```
□ T8.1: Update App.tsx state
  - Change selectedWorktreeId → selectedTaskId
  - Add selectedCommitSha for diff scope
  - Add navigation helper functions

□ T8.2: Cross-tab navigation
  - Implement navigateToPipeline(taskId)
  - Implement navigateToDiff(taskId, commitSha?, fileId?)
```

### Phase 9: Cleanup

```
□ T9.1: Remove deprecated components
  - Delete WorktreeSidebar (if not used)
  - Delete WorktreeCard (if not used)
  - Clean up unused imports

□ T9.2: Update documentation
  - Update SPECIFICATION.md
  - Update ROADMAP.md
```

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `src/types/index.ts` | Modify | New data model |
| `src/data/mockData.ts` | Modify | Restructured mock data |
| `src/App.tsx` | Modify | State changes, navigation |
| `src/components/layout/TabBar.tsx` | Modify | Rename tab |
| `src/components/panels/OverviewPanel.tsx` | Modify | Remove sidebar, update kanban |
| `src/components/panels/WorktreePanel.tsx` | Rename → `PipelinesPanel.tsx` | Full rewrite |
| `src/components/panels/DiffPanel.tsx` | Modify | Add scope selector |
| `src/components/panels/CostPanel.tsx` | Modify | Add task breakdown |
| `src/components/panels/ConfigPanel.tsx` | Modify | Add repos section |
| `src/components/shared/TaskListSidebar.tsx` | Create | New component |
| `src/components/shared/PipelineDetailView.tsx` | Create | New component |

---

## Acceptance Criteria

### AC-1: Overview Panel
- [ ] No worktree sidebar visible
- [ ] Kanban fills available space
- [ ] Task cards show pipeline stage, repos count, cost
- [ ] "View Pipeline" button navigates correctly

### AC-2: Pipelines Panel
- [ ] Left sidebar shows task list
- [ ] Filter by status works
- [ ] Selecting task shows pipeline detail
- [ ] Pipeline shows stage costs
- [ ] Commits show individual costs
- [ ] Navigation to diff viewer works

### AC-3: Diff Viewer
- [ ] Task selector works
- [ ] Scope toggle (All/By Commit) works
- [ ] Commit dropdown appears in commit scope
- [ ] Files grouped by repository
- [ ] Repository filter works

### AC-4: Cost Analytics
- [ ] Task cost breakdown visible
- [ ] By-stage visualization works
- [ ] By-agent visualization works
- [ ] Commit cost history shows

### AC-5: Config
- [ ] Repositories section visible
- [ ] Repository list and detail work
- [ ] Add/remove repository (mock)

---

*Document Version: 2.0*
*Last Updated: January 2025*