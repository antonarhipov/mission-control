# Mission Control: Roadmap & Design Decisions

## Current State (v0.1 - Prototype)

### Implemented Features
- ✅ Header with session stats
- ✅ Tab navigation (6 tabs)
- ✅ Overview panel with kanban + approvals
- ✅ Worktrees panel with detail view
- ✅ Diff viewer with reasoning context
- ✅ Cost analytics panel
- ✅ Config panel with teams
- ✅ Dependencies graph view
- ✅ Shared worktree selection state
- ✅ Team assignment to worktrees
- ✅ Agent contribution tracking
- ✅ Pipeline visualization

### Data Model Status
- ✅ Single repository model
- ✅ Worktree-centric architecture
- ✅ Team ↔ Agent relationships
- ✅ Task ↔ Worktree linking
- ✅ Pipeline stages
- ✅ File changes with agent attribution
- ✅ Commits with authorship

---

## Planned Phases

### Phase 1: Backend Integration (v0.2)

**Goal**: Connect UI to real agent orchestration

**Features**:
- [ ] WebSocket connection for real-time updates
- [ ] REST API for CRUD operations
- [ ] Authentication/authorization
- [ ] Persistent storage (PostgreSQL)
- [ ] Git worktree operations (create, switch, delete)

**Data Model Changes**:
```typescript
// Add API layer
interface ApiWorktree {
  // ... existing fields
  repositoryPath: string;
  gitStatus: GitStatus;
}

interface GitStatus {
  ahead: number;
  behind: number;
  staged: string[];
  unstaged: string[];
  untracked: string[];
}
```

### Phase 2: Multi-Repository Support (v0.3)

**Goal**: Support projects spanning multiple repositories

**Features**:
- [ ] Repository management (add/remove repos)
- [ ] Task-centric worktree grouping
- [ ] Cross-repo diff viewer with repo tabs
- [ ] Aggregated metrics per task
- [ ] Repository selector/filter

**Data Model Changes**:
```typescript
interface Repository {
  id: string;
  name: string;
  path: string;
  url: string;
  defaultBranch: string;
}

interface Task {
  // ... existing fields
  worktreeIds: string[]; // Multiple worktrees
}

interface Worktree {
  // ... existing fields
  repositoryId: string; // Which repo
}
```

**UI Changes**:
- Repository tabs in diff viewer
- Repository filter in worktree sidebar
- Task detail shows repos involved
- Aggregated progress across repos

### Phase 3: Real-Time Collaboration (v0.4)

**Goal**: Multiple humans observing/controlling agents

**Features**:
- [ ] Presence indicators (who's watching)
- [ ] Collaborative approvals
- [ ] Lock/claim mechanism for decisions
- [ ] Activity feed
- [ ] Chat between humans

**UI Changes**:
- User avatars in header
- "Others viewing" indicator
- Claim button on approvals
- Activity sidebar option

### Phase 4: Learning & Automation (v0.5)

**Goal**: System learns from human decisions

**Features**:
- [ ] Approval pattern recognition
- [ ] Auto-approve suggestions
- [ ] Risk scoring for decisions
- [ ] Historical decision replay
- [ ] Decision explanation export

**UI Changes**:
- Confidence indicators
- "Usually approved" badges
- Risk level warnings
- Decision history panel

### Phase 5: Advanced Workflows (v0.6)

**Goal**: Complex multi-agent orchestration

**Features**:
- [ ] Custom pipeline templates
- [ ] Conditional stages
- [ ] Parallel agent execution
- [ ] Agent handoff protocols
- [ ] Retry/rollback mechanisms

**UI Changes**:
- Pipeline editor
- Stage dependency visualization
- Parallel execution indicators
- Rollback controls

---

## Design Decisions Log

### DD-001: Worktree as Central Entity
**Date**: January 2025  
**Decision**: Make git worktree the central organizing concept  
**Rationale**:
- Worktrees are concrete, observable artifacts
- Maps 1:1 with git feature branches
- Natural container for agent work
- Clear start/end boundaries
- Easy to pause/resume

**Alternatives Considered**:
- Task-centric: Too abstract, doesn't map to code
- File-centric: Too granular, loses context
- Agent-centric: Confusing when agents switch tasks

### DD-002: Team-Based Agent Organization
**Date**: January 2025  
**Decision**: Organize agents into teams, assign teams to worktrees  
**Rationale**:
- Mirrors real development teams
- Enables specialized workflows
- Simplifies permission management
- Supports different team compositions

**Alternatives Considered**:
- Flat agent pool: Hard to manage at scale
- Per-worktree agent assignment: Too much configuration

### DD-003: Pipeline Stages
**Date**: January 2025  
**Decision**: Each worktree follows a pipeline with named stages  
**Rationale**:
- Clear progress indication
- Natural approval points
- Enables stage-specific agents
- Familiar workflow metaphor

**Alternatives Considered**:
- Free-form execution: No visibility into progress
- Fixed global pipeline: Doesn't fit all work types

### DD-004: Reasoning in Diff View
**Date**: January 2025  
**Decision**: Show agent reasoning alongside code diffs  
**Rationale**:
- Key differentiator from traditional diffs
- Enables meaningful code review
- Builds trust in agent decisions
- Educational for reviewers

**Alternatives Considered**:
- Separate reasoning panel: Loses context
- Inline comments only: Not enough detail

### DD-005: Shared Worktree Selection
**Date**: January 2025  
**Decision**: Selected worktree persists across Overview, Worktrees, Diff tabs  
**Rationale**:
- Reduces clicks when drilling down
- Maintains context during navigation
- Feels like examining one thing from different angles

**Alternatives Considered**:
- Independent selections per tab: Confusing
- No persistent selection: Extra clicks

### DD-006: Single Repository First
**Date**: January 2025  
**Decision**: Build for single-repo, design for multi-repo  
**Rationale**:
- Simpler initial implementation
- Most common use case
- Multi-repo is clear extension path
- Avoids premature abstraction

**Multi-Repo Extension Path**:
- Task becomes container for worktrees
- Add repositoryId to Worktree
- Add Repository entity
- Diff viewer gets repo tabs

### DD-007: Cost Transparency
**Date**: January 2025  
**Decision**: Show real-time cost at multiple levels  
**Rationale**:
- Critical for production use
- Enables budget management
- Identifies inefficient agents
- Builds trust through transparency

**Cost Levels**:
- Session total (header)
- Per worktree
- Per agent
- Per agent per worktree

### DD-008: Approval Queue
**Date**: January 2025  
**Decision**: Dedicated approval panel in Overview  
**Rationale**:
- High priority items visible
- Grouped by type
- Quick action buttons
- Prevents blocking agents

**Approval Types**:
- Decision: Architecture/design choices
- Command: Terminal/system commands  
- Review: Code requiring sign-off

---

## Open Questions

### OQ-001: Persistence Model
When implementing backend:
- Store full worktree state or derive from git?
- How to handle git worktree deletion?
- Conflict between UI state and git state?

### OQ-002: Agent Execution Model
- Long-running processes vs request/response?
- How to handle agent crashes mid-task?
- Checkpoint/resume semantics?

### OQ-003: Multi-User Conflict
- What if two humans approve conflicting things?
- Lock granularity (worktree? task? stage?)
- Offline/reconnect scenarios?

### OQ-004: Scale Concerns
- Max concurrent worktrees?
- File change limit per worktree?
- Cost calculation frequency?

### OQ-005: Security Model
- Agent permission enforcement?
- Sandboxing agent actions?
- Audit logging requirements?

---

## Technical Debt

### TD-001: Mock Data
- All data is hardcoded
- No persistence
- Need API layer

### TD-002: Type Safety
- Some any types in components
- Could benefit from stricter typing
- API response types needed

### TD-003: State Management
- Using useState at app level
- May need Zustand/Redux at scale
- Server state vs UI state separation

### TD-004: Testing
- No unit tests
- No integration tests
- No E2E tests

### TD-005: Accessibility
- Limited keyboard navigation
- No ARIA labels
- No screen reader testing

---

## Metrics for Success

### User Experience
- Time to first approval decision
- Click count for common workflows
- Cognitive load survey scores

### Operational
- Agent utilization rate
- Cost per completed task
- Approval queue wait time

### Quality
- Agent work acceptance rate
- Rework frequency
- Human override rate

---

*Document Version: 1.0*  
*Last Updated: January 2025*
