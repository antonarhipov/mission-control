# Agentic Development Environment (ADE)
## A Multi-Agent Era Interface Specification

**Version**: 3.0 Draft  
**Status**: Design Specification for Prototype Development

---

## Part I: Philosophy & Principles

### The Multi-Agent Era Paradigm Shift

The traditional IDE is built on a fundamental assumption: **the developer writes code**. Every feature—syntax highlighting, autocomplete, debugging—exists to support a human typing characters into files.

In the Multi-Agent Era, this assumption inverts. **Agents write code. Developers orchestrate, review, and decide.**

This specification describes an interface designed from first principles for this new reality.

---

### The 10 Design Principles

#### 1. Mission Control Interface

**Concept**: The operator oversees multiple concurrent agent activities, intervening strategically rather than executing directly.

**Implications**:
- Dashboard-like overview of all active work streams
- Status visibility without requiring attention
- Intervention points clearly surfaced
- "Glanceable" state representation

#### 2. Agent Specialization & Casting

**Concept**: Agents have distinct roles, personalities, and capabilities. Operators "cast" agents for tasks based on fit.

**Implications**:
- Agent profiles with visible strengths/weaknesses
- Casting recommendations based on task type
- Performance history per agent per task type
- Agent collaboration patterns

#### 3. Conversation as Codebase

**Concept**: The conversational context—intent, decisions, constraints—becomes as important as the code itself.

**Implications**:
- Conversations are first-class artifacts
- Intent threads linked to code changes
- Decision rationale searchable and browsable
- "Why" is always accessible alongside "what"

#### 4. Plan-First, Code-Second

**Concept**: Before any code is written, a plan is proposed, reviewed, and approved. Code is an implementation detail.

**Implications**:
- Planning phase is explicit and visible
- Plans are reviewable artifacts
- Approval gates before execution
- Plan-to-code traceability

#### 5. Ambient Awareness & Predictive Agents

**Concept**: Agents observe project context and proactively surface relevant information or suggest actions.

**Implications**:
- Background analysis and monitoring
- Proactive suggestions (not just reactive)
- Context-aware recommendations
- "Agent noticed..." patterns

#### 6. Spatial & Visual Programming for Agent Orchestration

**Concept**: Agent workflows are represented spatially—as graphs, flows, or canvases—not just lists.

**Implications**:
- Visual workflow representation
- Drag-and-drop orchestration
- Parallel execution visualization
- Dependency and flow clarity

#### 7. Review Surface as Primary Workspace

**Concept**: The primary workspace is not an editor—it's a review surface where the operator validates agent output.

**Implications**:
- Review UI is central, not secondary
- Code viewing optimized for review, not writing
- Inline decision-making tools
- Batch approval capabilities

#### 8. Persistent Agent Memory & Project Understanding

**Concept**: Agents maintain context across sessions. They "know" the project deeply.

**Implications**:
- Project knowledge visible to operator
- Memory management UI
- Context quality indicators
- "What does the agent know?" transparency

#### 9. Hybrid Sync/Async Workflows

**Concept**: Some work happens in real-time with operator present; other work happens in background while operator is away.

**Implications**:
- Clear sync vs async indicators
- Background task management
- Notification and catch-up flows
- "While you were away..." summaries

#### 10. The Disappearing Code Editor

**Concept**: Direct code editing becomes rare. When needed, it's inline and contextual, not the primary mode.

**Implications**:
- Code shown for review, not editing
- Inline edit capability for exceptions
- No traditional file tree as primary nav
- Intent-based navigation instead

---

### The Meta-Trend: Role Redefinition

The developer's role transforms:

| Old Role | New Role |
|----------|----------|
| Code Writer | Intent Articulator |
| Debugger | Decision Maker |
| Feature Builder | Quality Guardian |
| Solo Implementer | Team Orchestrator |

The interface must support this new role: **the developer as strategic operator of an AI development team**.

---

## Part II: Domain Model

### Core Entities

```
┌─────────────────────────────────────────────────────────────────┐
│                          PROJECT                                │
│  The container for all work - repositories, agents, goals       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   Repo   │  │   Repo   │  │   Repo   │  │   Repo   │       │
│  │ (source) │  │ (source) │  │ (source) │  │ (source) │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                        AGENTS                            │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐        │   │
│  │  │ Arch   │  │ Impl   │  │ Test   │  │ Review │        │   │
│  │  └────────┘  └────────┘  └────────┘  └────────┘        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                       MISSIONS                           │   │
│  │                                                          │   │
│  │  Mission = High-level goal that spawns Plans & Tasks     │   │
│  │                                                          │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │   │
│  │  │  Mission A  │  │  Mission B  │  │  Mission C  │      │   │
│  │  │  (active)   │  │  (active)   │  │ (planning)  │      │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    CONVERSATIONS                         │   │
│  │                                                          │   │
│  │  The persistent thread of intent, decisions, context     │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Entity Definitions

#### Project

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  
  // Connected source repositories
  repositories: Repository[];
  
  // Available agents
  agents: Agent[];
  
  // Agent team configurations
  teams: AgentTeam[];
  
  // Project-level memory
  memory: ProjectMemory;
  
  // Budget constraints
  budget: Budget;
  
  // Active and completed missions
  missions: Mission[];
}
```

#### Repository

```typescript
interface Repository {
  id: string;
  name: string;
  url: string;
  localPath: string;
  defaultBranch: string;
  
  // What the agents "know" about this repo
  understanding: RepositoryUnderstanding;
  
  status: 'connected' | 'syncing' | 'error';
}

interface RepositoryUnderstanding {
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
  
  // Confidence score
  confidence: number; // 0-100
}
```

#### Agent

```typescript
interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  
  // Personality and approach
  persona: AgentPersona;
  
  // Capabilities
  capabilities: Capability[];
  
  // Current state
  status: AgentStatus;
  currentActivity?: string;
  
  // Performance metrics
  metrics: AgentMetrics;
  
  // Memory of past work
  memory: AgentMemory;
}

type AgentRole = 
  | 'architect'    // System design, API contracts, structure
  | 'implementer'  // Write production code
  | 'tester'       // Write and run tests
  | 'reviewer'     // Code review, quality checks
  | 'documenter'   // Documentation, comments
  | 'debugger'     // Bug investigation and fixes
  | 'refactorer';  // Code improvement, tech debt

interface AgentPersona {
  style: 'thorough' | 'fast' | 'creative' | 'conservative';
  verbosity: 'minimal' | 'balanced' | 'detailed';
  riskTolerance: 'low' | 'medium' | 'high';
  specialty?: string; // e.g., "Spring Framework", "React", "SQL"
}

interface AgentMetrics {
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
```

#### Mission

```typescript
interface Mission {
  id: string;
  title: string;
  
  // The original intent expressed by operator
  intent: Intent;
  
  // Current phase
  phase: MissionPhase;
  
  // The plan (when approved)
  plan?: Plan;
  
  // Execution details
  execution?: Execution;
  
  // The conversation thread
  conversation: Conversation;
  
  // Assigned agents
  agents: MissionAgent[];
  
  // Status
  status: MissionStatus;
  
  // Metrics
  progress: number;
  cost: number;
  startedAt?: string;
  completedAt?: string;
}

type MissionPhase = 
  | 'intent'      // Operator describing what they want
  | 'planning'    // Agents creating plan
  | 'review'      // Operator reviewing plan
  | 'executing'   // Agents implementing
  | 'validating'  // Testing and verification
  | 'complete';   // Done

type MissionStatus =
  | 'draft'           // Intent being formed
  | 'planning'        // Agents working on plan
  | 'awaiting-review' // Plan ready for operator
  | 'approved'        // Plan approved, ready to execute
  | 'executing'       // Work in progress
  | 'paused'          // Operator paused work
  | 'blocked'         // Waiting on decision/input
  | 'validating'      // Agents verifying work
  | 'complete'        // Successfully done
  | 'failed';         // Could not complete
```

#### Intent & Plan

```typescript
interface Intent {
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
  
  // Confidence that intent is well understood
  confidence: number;
}

interface Plan {
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

interface PlannedTask {
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
```

#### Conversation

```typescript
interface Conversation {
  id: string;
  missionId: string;
  
  // All messages in the thread
  messages: Message[];
  
  // Key decisions made
  decisions: Decision[];
  
  // Open questions
  openQuestions: Question[];
}

interface Message {
  id: string;
  timestamp: string;
  
  // Who sent it
  sender: {
    type: 'operator' | 'agent' | 'system';
    id?: string;
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

interface Decision {
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
```

#### Execution (Runtime State)

```typescript
interface Execution {
  missionId: string;
  planId: string;
  
  // Running tasks
  tasks: ExecutingTask[];
  
  // Changes made
  changes: Change[];
  
  // Commits created
  commits: Commit[];
  
  // Pending approvals
  approvals: Approval[];
  
  // Background observations
  observations: Observation[];
}

interface ExecutingTask {
  plannedTaskId: string;
  
  status: 'pending' | 'running' | 'paused' | 'blocked' | 'complete' | 'failed';
  
  // Assigned agent
  agentId: string;
  
  // What the agent is currently doing
  currentActivity: string;
  
  // Progress
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

interface Change {
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
  
  // Why this change
  reasoning: string;
  
  // Status
  status: 'pending-review' | 'approved' | 'rejected' | 'revised';
  
  // Linked commit (after approval)
  commitSha?: string;
  
  timestamp: string;
}

interface Approval {
  id: string;
  type: 'change' | 'decision' | 'action' | 'cost';
  
  // What needs approval
  subject: string;
  description: string;
  
  // Context
  context: {
    missionId: string;
    taskId?: string;
    agentId: string;
  };
  
  // The actual item needing approval
  item: Change | Decision | Action;
  
  // Urgency
  urgency: 'low' | 'medium' | 'high' | 'blocking';
  
  // How long waiting
  createdAt: string;
  
  // Operator response
  response?: {
    action: 'approved' | 'rejected' | 'revised';
    feedback?: string;
    timestamp: string;
  };
}
```

#### Observation (Ambient Awareness)

```typescript
interface Observation {
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
  
  // Confidence level
  confidence: number;
  
  // Suggested action
  suggestion?: string;
  
  // Related code/files
  references: Reference[];
  
  // Operator response
  acknowledged: boolean;
  dismissed: boolean;
}
```

---

## Part III: Interface Structure

### Primary Workspaces

The interface is organized into **workspaces**, not tabs. Workspaces represent different modes of operation:

```
┌─────────────────────────────────────────────────────────────────┐
│  🎯 Command    📋 Missions    👁️ Review    📊 Insights    ⚙️   │
└─────────────────────────────────────────────────────────────────┘
```

| Workspace | Primary Activity | Frequency |
|-----------|------------------|-----------|
| **Command** | Give intent, start missions, real-time interaction | High |
| **Missions** | Monitor active missions, manage plans | High |
| **Review** | Review changes, approve decisions | Very High |
| **Insights** | Analyze progress, costs, agent performance | Medium |
| **Settings** | Configure project, agents, integrations | Low |

---

### Workspace 1: Command Center

**Purpose**: The operator's primary interaction point for directing agents.

**Mental Model**: "This is where I tell the agents what I want."

```
┌─────────────────────────────────────────────────────────────────┐
│  🎯 COMMAND CENTER                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │   What would you like to accomplish?                        ││
│  │                                                             ││
│  │  ┌─────────────────────────────────────────────────────┐   ││
│  │  │                                                     │   ││
│  │  │  Add user authentication with JWT tokens.           │   ││
│  │  │  Use Spring Security. Support login, logout,        │   ││
│  │  │  and token refresh. Store users in PostgreSQL.      │   ││
│  │  │                                                     │   ││
│  │  └─────────────────────────────────────────────────────┘   ││
│  │                                                             ││
│  │  [Start Mission]                          [+ Add Context]   ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ Active Conversations ──────────────────────────────────────┐│
│  │                                                             ││
│  │  ┌───────────────────────────────────────────────────────┐ ││
│  │  │ 💬 AUTH-001: User Authentication                      │ ││
│  │  │ Phase: Planning • 🏗️ Architect thinking...            │ ││
│  │  │ "I'm analyzing your existing security setup..."       │ ││
│  │  │                                    [Open →]           │ ││
│  │  └───────────────────────────────────────────────────────┘ ││
│  │                                                             ││
│  │  ┌───────────────────────────────────────────────────────┐ ││
│  │  │ 💬 ORD-142: Order Service                             │ ││
│  │  │ Phase: Executing • ⚡ Implementer working             │ ││
│  │  │ "Writing OrderRepository with pagination..."          │ ││
│  │  │                                    [Open →]           │ ││
│  │  └───────────────────────────────────────────────────────┘ ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ Agent Observations ────────────────────────────────────────┐│
│  │                                                             ││
│  │  🔍 Architect noticed:                                      ││
│  │  "The existing CustomerService uses a different             ││
│  │   validation pattern than OrderService. Should I            ││
│  │   align them?"                                              ││
│  │                              [Yes, align] [No, leave] [Ask] ││
│  │                                                             ││
│  │  🔍 Tester noticed:                                         ││
│  │  "Test coverage for OrderController is 34%.                 ││
│  │   Should I prioritize adding tests?"                        ││
│  │                              [Yes] [After current mission]  ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Command Input Features

- **Natural language intent input**
- **Context attachment** (files, previous conversations, documentation)
- **Constraint specification** ("Don't modify the User entity")
- **Agent casting** ("Have the Architect lead this")

#### Active Conversations

- Real-time status of ongoing agent work
- Latest agent message/activity
- Quick navigation to full conversation

#### Agent Observations

- Proactive insights from ambient awareness
- Quick action buttons for common responses
- Dismissible but logged

---

### Workspace 2: Missions

**Purpose**: Overview and management of all active work streams.

**Mental Model**: "This is my mission control dashboard."

```
┌─────────────────────────────────────────────────────────────────┐
│  📋 MISSIONS                                    [+ New Mission] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ Pipeline View ─────────────────────────────────────────────┐│
│  │                                                             ││
│  │   INTENT        PLANNING        EXECUTING       VALIDATING  ││
│  │   ───────       ────────        ─────────       ──────────  ││
│  │                                                             ││
│  │   ┌───────┐     ┌───────┐      ┌───────┐                   ││
│  │   │AUTH-03│────▶│       │      │ORD-142│                   ││
│  │   │ 🆕    │     │AUTH-01│      │ ⚡ 65% │                   ││
│  │   └───────┘     │ 🏗️    │      └───────┘                   ││
│  │                 └───────┘                                   ││
│  │                                 ┌───────┐      ┌───────┐   ││
│  │                                 │ORD-144│─────▶│ORD-140│   ││
│  │                                 │ 📝 80%│      │ ✓     │   ││
│  │                                 └───────┘      └───────┘   ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ Selected: AUTH-001 ────────────────────────────────────────┐│
│  │                                                             ││
│  │  User Authentication with JWT                               ││
│  │  Phase: Planning • Started 12 min ago                       ││
│  │                                                             ││
│  │  ┌─ Team ────────────────────────────────────────────────┐ ││
│  │  │  🏗️ Architect (lead)    • Planning approach            │ ││
│  │  │  ⚡ Implementer          • Waiting                      │ ││
│  │  │  🧪 Tester               • Waiting                      │ ││
│  │  └───────────────────────────────────────────────────────┘ ││
│  │                                                             ││
│  │  ┌─ Plan Preview ────────────────────────────────────────┐ ││
│  │  │                                                        │ ││
│  │  │  Architect is preparing a plan...                      │ ││
│  │  │                                                        │ ││
│  │  │  Preliminary structure:                                │ ││
│  │  │  1. Add Spring Security dependency                     │ ││
│  │  │  2. Create User entity and repository                  │ ││
│  │  │  3. Implement JWT filter                               │ ││
│  │  │  4. Create AuthController                              │ ││
│  │  │  5. Write integration tests                            │ ││
│  │  │                                                        │ ││
│  │  │  Estimated: $2.50 - $4.00 • 45-90 min                  │ ││
│  │  │                                                        │ ││
│  │  │                        [View Full Plan When Ready]     │ ││
│  │  └────────────────────────────────────────────────────────┘ ││
│  │                                                             ││
│  │  [Open Conversation]  [Pause]  [Cancel]                     ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Pipeline Visualization

- Horizontal flow: Intent → Planning → Executing → Validating → Complete
- Mission cards in each column
- Visual connections showing dependencies
- Color coding for status (active, blocked, needs attention)

#### Mission Detail Panel

- Team composition and current activities
- Plan preview (or full plan if ready)
- Progress and cost estimates
- Action buttons (Pause, Cancel, Open Conversation)

---

### Workspace 3: Review Surface

**Purpose**: The primary workspace for validating agent output.

**Mental Model**: "This is where I review and approve the work."

```
┌─────────────────────────────────────────────────────────────────┐
│  👁️ REVIEW SURFACE                      [Pending: 7] [Batch ▼] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ Review Queue ────┐  ┌─ Review Detail ──────────────────────┐│
│  │                   │  │                                      ││
│  │ ▼ Needs Decision  │  │  CHANGE REVIEW                       ││
│  │   ┌─────────────┐ │  │  ─────────────────────────────────── ││
│  │   │ 🔶 Decision │ │  │                                      ││
│  │   │ JWT impl    │ │  │  OrderService.java                   ││
│  │   │ AUTH-001    │ │  │  Modified by ⚡ Implementer           ││
│  │   └─────────────┘ │  │  Mission: ORD-142                    ││
│  │                   │  │                                      ││
│  │ ▼ Code Changes    │  │  ┌─ Why This Change ───────────────┐ ││
│  │   ┌─────────────┐ │  │  │                                 │ ││
│  │   │● OrderSvc   │ │  │  │ Adding transaction support to   │ ││
│  │   │  +127 -23   │◀┼──│  │ createOrder to ensure atomicity │ ││
│  │   └─────────────┘ │  │  │ with inventory reservation.     │ ││
│  │   ┌─────────────┐ │  │  │                                 │ ││
│  │   │○ Order.java │ │  │  │ Decision: Use constructor       │ ││
│  │   │  +89        │ │  │  │ injection over @Autowired.      │ ││
│  │   └─────────────┘ │  │  │ Rationale: Better testability.  │ ││
│  │   ┌─────────────┐ │  │  │                                 │ ││
│  │   │○ OrderRepo  │ │  │  └─────────────────────────────────┘ ││
│  │   │  +34        │ │  │                                      ││
│  │   └─────────────┘ │  │  ┌─ Diff ─────────────────────────┐  ││
│  │                   │  │  │                                │  ││
│  │ ▼ Actions         │  │  │  @@ -23,6 +23,42 @@            │  ││
│  │   ┌─────────────┐ │  │  │  @Service                      │  ││
│  │   │○ Run tests  │ │  │  │  @Transactional                │  ││
│  │   │  ORD-142    │ │  │  │  public class OrderService {   │  ││
│  │   └─────────────┘ │  │  │                                │  ││
│  │                   │  │  │ + private final OrderRepo...   │  ││
│  │                   │  │  │ + private final CustomerRepo.. │  ││
│  │                   │  │  │ + private final InventorySvc.. │  ││
│  │                   │  │  │                                │  ││
│  │                   │  │  └────────────────────────────────┘  ││
│  │                   │  │                                      ││
│  │                   │  │  ┌─ Related ──────────────────────┐  ││
│  │                   │  │  │ 📄 CustomerService.java        │  ││
│  │                   │  │  │    (similar pattern)           │  ││
│  │                   │  │  │ 📚 Spring DI Best Practices    │  ││
│  │                   │  │  └────────────────────────────────┘  ││
│  │                   │  │                                      ││
│  │                   │  │  [✓ Approve]  [✗ Reject]  [💬 Discuss]││
│  │                   │  │                                      ││
│  └───────────────────┘  └──────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Review Queue (Left)

- Grouped by type: Decisions, Code Changes, Actions
- Priority indicators
- Progress through queue
- Batch selection for bulk approval

#### Review Detail (Right)

**For Code Changes**:
- File name and change summary
- Agent attribution
- Mission context
- **"Why This Change"** prominently displayed
- Diff view (code shown for review, not editing)
- Related files/docs
- Approve/Reject/Discuss actions

**For Decisions**:
- Decision question
- Options considered with pros/cons
- Agent recommendation
- Approve recommendation or choose alternative

**For Actions**:
- What the agent wants to do
- Why
- Risk level
- Approve or modify

#### Key UX Principles

1. **Reasoning First**: Why is always visible before what
2. **Context Rich**: Related files, similar patterns, documentation linked
3. **One-Click Actions**: Approve/Reject prominent
4. **Batch Capability**: Review similar changes together
5. **Inline Feedback**: Can add comments without leaving

---

### Workspace 4: Insights

**Purpose**: Analytics, trends, and project health.

**Mental Model**: "How are we doing overall?"

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 INSIGHTS                        [Today ▼]  [All Missions ▼] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ Health & Progress ─────────────────────────────────────────┐│
│  │                                                             ││
│  │  Missions: 3 active, 1 planning, 12 complete (this sprint)  ││
│  │  Velocity: 4.2 missions/day (↑ 12% from last week)          ││
│  │                                                             ││
│  │  ┌─────────────────────────────────────────────────────┐   ││
│  │  │ Progress: ████████████████░░░░░░░░ 67% of sprint    │   ││
│  │  │           On track for Friday completion            │   ││
│  │  └─────────────────────────────────────────────────────┘   ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ Cost & Efficiency ──────────────────────────────────────────┐
│  │                                                             ││
│  │  Today: $12.47 / $50     Sprint: $47.82 / $200              ││
│  │                                                             ││
│  │  Cost per Mission (trend):                                  ││
│  │  $5 ┤       ╭─╮                                             ││
│  │  $4 ┤   ╭───╯ ╰─╮                                           ││
│  │  $3 ┤───╯       ╰───                                        ││
│  │     └───────────────────                                    ││
│  │       Mon  Tue  Wed  Thu                                    ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ Agent Performance ─────────────────────────────────────────┐│
│  │                                                             ││
│  │  Agent        Missions  Approval  Rework   Cost/M  Quality  ││
│  │  ─────────────────────────────────────────────────────────  ││
│  │  🏗️ Architect    8       95%       2%     $1.20   ████████░ ││
│  │  ⚡ Implementer  12       88%       8%     $3.40   ███████░░ ││
│  │  🧪 Tester        6       92%       4%     $1.80   ████████░ ││
│  │  👁️ Reviewer      8       97%       1%     $0.80   █████████ ││
│  │  📝 Documenter    4       94%       3%     $0.60   ████████░ ││
│  │                                                             ││
│  │  [View Detailed Agent Analytics →]                          ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ Quality Signals ───────────────────────────────────────────┐│
│  │                                                             ││
│  │  Tests: 234/240 passing (97.5%)                             ││
│  │  Coverage: 78% → 82% (↑ this sprint)                        ││
│  │  Lint: 0 errors, 3 warnings                                 ││
│  │  Security: No issues detected                               ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ Recent Activity ───────────────────────────────────────────┐│
│  │                                                             ││
│  │  10:32  ✓ AUTH-001 plan approved by you                     ││
│  │  10:28  ⚡ ORD-142 implementation 65% complete               ││
│  │  10:15  🏗️ AUTH-001 plan ready for review                   ││
│  │  09:45  ⚠️ ORD-143 blocked by failing test                  ││
│  │  09:30  ✓ 3 changes approved (batch)                        ││
│  │                                                             ││
│  │  [View Full Activity Log →]                                 ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Workspace 5: Settings

**Purpose**: Project configuration, agent management, integrations.

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚙️ SETTINGS                                                    │
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│ ▸ Project    │  REPOSITORIES                                   │
│              │                                                  │
│ ▾ Repositories│  Connected source code repositories:           │
│   api-gateway│                                                  │
│   order-svc  │  ┌──────────────────────────────────────────┐   │
│   frontend   │  │ api-gateway                  ● Synced    │   │
│              │  │ github.com/acme/api-gateway              │   │
│ ▸ Agents     │  │                                          │   │
│              │  │ Understanding: 94% confident             │   │
│ ▸ Teams      │  │ "Spring Boot 3.2 microservice with       │   │
│              │  │  REST APIs, JWT auth, PostgreSQL"        │   │
│ ▸ Budgets    │  │                                          │   │
│              │  │ Patterns detected:                       │   │
│ ▸ Integrations│  │ • Controller-Service-Repository         │   │
│              │  │ • DTO mapping with MapStruct             │   │
│              │  │ • Flyway migrations                      │   │
│              │  │                                          │   │
│              │  │ [Re-analyze] [Settings] [Disconnect]     │   │
│              │  └──────────────────────────────────────────┘   │
│              │                                                  │
│              │  [+ Connect Repository]                          │
│              │                                                  │
└──────────────┴──────────────────────────────────────────────────┘
```

---

## Part IV: Key Workflows

### Workflow 1: Starting a New Mission

```
┌─────────────────────────────────────────────────────────────────┐
│ WORKFLOW: New Mission                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. INTENT CAPTURE                                              │
│  ───────────────                                                │
│  Operator: Opens Command Center                                 │
│  Operator: Types intent in natural language                     │
│  System:   Parses intent, identifies key elements               │
│  System:   May ask clarifying questions                         │
│  Operator: Provides clarifications                              │
│  Operator: Attaches context (files, docs, constraints)          │
│  Operator: Casts agents (or accepts defaults)                   │
│  Operator: Clicks "Start Mission"                               │
│                                                                 │
│  2. PLANNING PHASE                                              │
│  ────────────────                                               │
│  System:   Creates Mission in "planning" phase                  │
│  Agent:    Architect begins planning                            │
│  Agent:    Analyzes codebase, identifies scope                  │
│  Agent:    Creates Plan with tasks, estimates, risks            │
│  Agent:    Proposes Plan to operator                            │
│  Operator: Receives notification "Plan ready for review"        │
│                                                                 │
│  3. PLAN REVIEW                                                 │
│  ────────────                                                   │
│  Operator: Opens Plan in Missions workspace                     │
│  Operator: Reviews approach, tasks, estimates                   │
│  Operator: May ask questions (via conversation)                 │
│  Operator: May request modifications                            │
│  Agent:    Revises plan if requested                            │
│  Operator: Approves plan                                        │
│                                                                 │
│  4. EXECUTION                                                   │
│  ──────────                                                     │
│  System:   Mission moves to "executing" phase                   │
│  Agents:   Begin working on tasks (may parallelize)             │
│  Agents:   Create Changes, make Decisions                       │
│  System:   Queues items for Review                              │
│  Operator: Reviews and approves/rejects in Review Surface       │
│  Agents:   Continue or revise based on feedback                 │
│                                                                 │
│  5. VALIDATION                                                  │
│  ───────────                                                    │
│  Agents:   Run tests, check quality                             │
│  Agents:   Report results                                       │
│  Operator: Reviews final state                                  │
│  Operator: Approves completion                                  │
│                                                                 │
│  6. COMPLETION                                                  │
│  ───────────                                                    │
│  System:   Mission marked complete                              │
│  System:   Updates metrics, conversation archived               │
│  System:   Changes ready for PR/merge                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Workflow 2: Reviewing Changes

```
┌─────────────────────────────────────────────────────────────────┐
│ WORKFLOW: Review Changes                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. NOTIFICATION                                                │
│  ──────────────                                                 │
│  System:   Badge on Review tab shows pending count              │
│  System:   May send push notification for high-priority items   │
│  Operator: Navigates to Review Surface                          │
│                                                                 │
│  2. QUEUE TRIAGE                                                │
│  ─────────────                                                  │
│  Operator: Scans queue, sees items grouped by type              │
│  Operator: Notes urgency indicators                             │
│  Operator: Selects item to review (or uses batch mode)          │
│                                                                 │
│  3. UNDERSTAND CONTEXT                                          │
│  ────────────────────                                           │
│  Operator: Reads "Why This Change" section                      │
│  Operator: Sees decision rationale if applicable                │
│  Operator: Reviews related files/patterns                       │
│  Operator: May check conversation for more context              │
│                                                                 │
│  4. REVIEW CODE                                                 │
│  ────────────                                                   │
│  Operator: Scans diff (not editing, just reviewing)             │
│  Operator: Checks for correctness, style, patterns              │
│  Operator: May click to see full file context                   │
│                                                                 │
│  5. TAKE ACTION                                                 │
│  ────────────                                                   │
│  Option A: Approve                                              │
│    - Click Approve                                              │
│    - Change is committed                                        │
│    - Agent continues                                            │
│                                                                 │
│  Option B: Reject                                               │
│    - Click Reject                                               │
│    - Provide feedback                                           │
│    - Agent revises approach                                     │
│                                                                 │
│  Option C: Discuss                                              │
│    - Click Discuss                                              │
│    - Opens conversation thread                                  │
│    - Ask questions, get clarification                           │
│    - Then Approve or Reject                                     │
│                                                                 │
│  6. BATCH OPERATIONS                                            │
│  ──────────────────                                             │
│  Operator: May select multiple similar changes                  │
│  Operator: Review representative sample                         │
│  Operator: Approve all selected                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Workflow 3: Async Check-In

```
┌─────────────────────────────────────────────────────────────────┐
│ WORKFLOW: Async Check-In (Returning after time away)           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. RETURN                                                      │
│  ────────                                                       │
│  Operator: Opens ADE after being away                           │
│                                                                 │
│  2. CATCH-UP SUMMARY                                            │
│  ──────────────────                                             │
│  System:   Shows "While you were away" summary:                 │
│            - Missions completed: 2                              │
│            - Changes approved automatically: 5                  │
│            - Items awaiting review: 3                           │
│            - Blockers: 1 (agent question)                       │
│            - Observations: 2                                    │
│                                                                 │
│  3. ADDRESS BLOCKERS                                            │
│  ─────────────────                                              │
│  Operator: Reviews blocking item first                          │
│  Operator: Answers agent question or makes decision             │
│  Agent:    Unblocked, continues work                            │
│                                                                 │
│  4. REVIEW QUEUE                                                │
│  ─────────────                                                  │
│  Operator: Reviews pending items                                │
│  Operator: Approves or provides feedback                        │
│                                                                 │
│  5. CHECK OBSERVATIONS                                          │
│  ────────────────────                                           │
│  Operator: Reviews agent observations                           │
│  Operator: Acknowledges or dismisses                            │
│  Operator: May spawn new missions from observations             │
│                                                                 │
│  6. RESUME NORMAL OPERATION                                     │
│  ──────────────────────────                                     │
│  Operator: Continues with new intents or monitoring             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part V: Interaction Patterns

### Pattern 1: Conversation Thread

Every Mission has a persistent Conversation that contains:
- Original intent
- All clarifications
- Agent thinking/progress updates
- Decisions made (with rationale)
- Questions asked and answered
- Links to code changes

```
┌─────────────────────────────────────────────────────────────────┐
│ CONVERSATION: AUTH-001                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ You ─────────────────────────────────────────── 10:00 AM ─┐│
│  │ Add user authentication with JWT tokens. Use Spring        ││
│  │ Security. Support login, logout, and token refresh.        ││
│  │ Store users in PostgreSQL.                                 ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ 🏗️ Architect ──────────────────────────────── 10:01 AM ─┐ │
│  │ I'll analyze your project to understand the current        │ │
│  │ setup before proposing a plan.                             │ │
│  │                                                            │ │
│  │ Quick question: Should users be able to have multiple      │ │
│  │ roles (e.g., USER, ADMIN)?                                 │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ You ─────────────────────────────────────────── 10:02 AM ─┐│
│  │ Yes, users can have multiple roles.                        ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ 🏗️ Architect ──────────────────────────────── 10:05 AM ─┐ │
│  │ I've analyzed your project. Here's what I found:           │ │
│  │                                                            │ │
│  │ • Spring Boot 3.2 with existing security dependency        │ │
│  │ • PostgreSQL with Flyway migrations                        │ │
│  │ • Existing User table but no roles column                  │ │
│  │                                                            │ │
│  │ 📋 PLAN READY FOR REVIEW                                   │ │
│  │ [View Plan]                                                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ 📋 Decision ──────────────────────────────────────────────┐│
│  │ Token Storage Strategy                                     ││
│  │                                                            ││
│  │ Options:                                                   ││
│  │ A. Stateless JWT (tokens not stored server-side)           ││
│  │ B. Stateful with Redis token store                         ││
│  │ C. Stateful with PostgreSQL token store                    ││
│  │                                                            ││
│  │ Recommendation: A (Stateless JWT)                          ││
│  │ Reason: Simpler, no additional infrastructure              ││
│  │                                                            ││
│  │ [Accept Recommendation] [Choose B] [Choose C] [Discuss]    ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Type a message...                              [Send]     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Pattern 2: Plan Visualization

```
┌─────────────────────────────────────────────────────────────────┐
│ PLAN: AUTH-001                                    [Approved ✓]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Summary                                                        │
│  ─────────────────────────────────────────────────────────────  │
│  Implement JWT-based authentication using Spring Security.      │
│  Add role-based access control with USER and ADMIN roles.       │
│                                                                 │
│  Approach                                                       │
│  ─────────────────────────────────────────────────────────────  │
│  Use stateless JWT tokens. Store user credentials in existing   │
│  PostgreSQL database. Add a roles table with many-to-many       │
│  relationship. Create AuthController for login/logout/refresh.  │
│                                                                 │
│  Tasks                                                          │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐  │
│  │ Task 1  │────▶│ Task 2  │────▶│ Task 4  │────▶│ Task 5  │  │
│  │ Schema  │     │ Entity  │     │ Auth    │     │ Tests   │  │
│  │ 🏗️ Arch │     │ ⚡ Impl │     │ ⚡ Impl │     │ 🧪 Test │  │
│  │ $0.50   │     │ $1.00   │     │ $1.20   │     │ $0.80   │  │
│  └─────────┘     └─────────┘     └─────────┘     └─────────┘  │
│                        │                                        │
│                        ▼                                        │
│                  ┌─────────┐                                    │
│                  │ Task 3  │  (parallel)                        │
│                  │ JWT Util│                                    │
│                  │ ⚡ Impl │                                    │
│                  │ $0.60   │                                    │
│                  └─────────┘                                    │
│                                                                 │
│  Estimates                                                      │
│  ─────────────────────────────────────────────────────────────  │
│  Cost: $3.20 - $4.50 (expected: $4.10)                         │
│  Time: 30 - 60 min (expected: 45 min)                          │
│                                                                 │
│  Risks                                                          │
│  ─────────────────────────────────────────────────────────────  │
│  ⚠️ Existing User table may need migration (medium risk)       │
│  ⚠️ Token refresh logic may need iteration (low risk)          │
│                                                                 │
│  Alternatives Considered                                        │
│  ─────────────────────────────────────────────────────────────  │
│  ✗ OAuth2/OIDC: Overkill for current needs                     │
│  ✗ Session-based auth: Doesn't fit stateless requirement       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Pattern 3: Agent Status Cards

```
┌─────────────────────────────────────────────────────────────────┐
│ AGENTS                                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ 🏗️ Architect ───────────────────────────────────────────┐  │
│  │                                                           │  │
│  │  Status: ● Thinking            Mission: AUTH-001          │  │
│  │                                                           │  │
│  │  "Analyzing existing security configuration to ensure     │  │
│  │   the new JWT filter integrates correctly..."             │  │
│  │                                                           │  │
│  │  Specialty: Spring Security, System Design                │  │
│  │  Style: Thorough, Conservative                            │  │
│  │                                                           │  │
│  │  Today: 3 missions │ $2.40 │ 96% approval                 │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─ ⚡ Implementer ──────────────────────────────────────────┐  │
│  │                                                           │  │
│  │  Status: ● Working             Mission: ORD-142           │  │
│  │                                                           │  │
│  │  "Writing OrderRepository with custom query methods       │  │
│  │   for pagination and filtering..."                        │  │
│  │                                                           │  │
│  │  Specialty: Java, Spring Data JPA                         │  │
│  │  Style: Fast, Balanced                                    │  │
│  │                                                           │  │
│  │  Today: 5 missions │ $4.80 │ 88% approval                 │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─ 🧪 Tester ───────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │  Status: ○ Idle                Mission: -                 │  │
│  │                                                           │  │
│  │  Waiting for implementation tasks to complete.            │  │
│  │                                                           │  │
│  │  Specialty: Integration Tests, Testcontainers             │  │
│  │  Style: Thorough, Detailed                                │  │
│  │                                                           │  │
│  │  Today: 2 missions │ $1.20 │ 94% approval                 │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part VI: Implementation Roadmap

### Phase 1: Core Framework & Data Model

```
□ P1.1: Set up new project structure (or refactor existing)
□ P1.2: Implement domain model types (Mission, Intent, Plan, etc.)
□ P1.3: Create comprehensive mock data layer
□ P1.4: Build workspace navigation shell (5 workspaces)
□ P1.5: Implement basic theme and design tokens
```

### Phase 2: Command Center Workspace

```
□ P2.1: Intent input component (natural language)
□ P2.2: Context attachment UI (files, docs)
□ P2.3: Active conversations list
□ P2.4: Agent observations panel
□ P2.5: Quick actions for observations
□ P2.6: "Start Mission" flow
```

### Phase 3: Missions Workspace

```
□ P3.1: Pipeline visualization (kanban-style columns)
□ P3.2: Mission cards with status indicators
□ P3.3: Mission detail panel
□ P3.4: Plan review interface
□ P3.5: Plan visualization (task graph)
□ P3.6: Agent team display
```

### Phase 4: Review Surface Workspace

```
□ P4.1: Review queue (grouped by type)
□ P4.2: Change review detail with reasoning
□ P4.3: Decision review with options comparison
□ P4.4: Confidence scores on changes
□ P4.5: Inline approve/reject actions
□ P4.6: Batch approval workflow
□ P4.7: Agent uncertainty flags
```

### Phase 5: Conversation System

```
□ P5.1: Conversation thread UI
□ P5.2: Decision cards within conversation
□ P5.3: Code links from decisions
□ P5.4: Searchable conversation history
□ P5.5: Conversation forking
```

### Phase 6: Insights Workspace

```
□ P6.1: Progress dashboard
□ P6.2: Cost analytics with trends
□ P6.3: Agent performance comparison table
□ P6.4: Quality signals panel
□ P6.5: Activity timeline
```

### Phase 7: Settings Workspace

```
□ P7.1: Repository configuration
□ P7.2: Repository understanding display
□ P7.3: Agent configuration
□ P7.4: Memory management UI
□ P7.5: Team management
```

### Phase 8: Agent Casting & Orchestration

```
□ P8.1: Agent roster/gallery
□ P8.2: Team composition drag-and-drop
□ P8.3: Pipeline templates
□ P8.4: Visual pipeline editor (node graph)
```

### Phase 9: Sync/Async & Advanced Patterns

```
□ P9.1: Mode switcher (interactive/background)
□ P9.2: Background tasks panel
□ P9.3: "While you were away" summary
□ P9.4: Spec mode editor
□ P9.5: Abstraction level toggle
□ P9.6: Ambient suggestions panel
```

---

## Part VI-B: Enhanced UX Patterns (From Source Trends)

### Pattern 4: Agent Casting & Team Composition

**The Casting Director Model**: Operators assemble specialized agent teams for missions.

```
┌─────────────────────────────────────────────────────────────────┐
│ CAST AGENTS FOR: AUTH-001                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ Available Agents ─────────┐  ┌─ Mission Team ─────────────┐│
│  │                            │  │                            ││
│  │  🏗️ Architect              │  │  Pipeline:                 ││
│  │     System design,         │  │                            ││
│  │     API contracts          │  │  ┌────────┐                ││
│  │                 [+ Add] ───┼──┼─▶│ 🏗️ Arch │ (lead)        ││
│  │                            │  │  └────┬───┘                ││
│  │  ⚡ Implementer            │  │       │                    ││
│  │     Production code,       │  │       ▼                    ││
│  │     Spring/React           │  │  ┌────────┐                ││
│  │                 [+ Add] ───┼──┼─▶│ ⚡ Impl │                ││
│  │                            │  │  └────┬───┘                ││
│  │  🧪 Tester                 │  │       │                    ││
│  │     Integration tests,     │  │       ▼                    ││
│  │     Testcontainers         │  │  ┌────────┐                ││
│  │                 [+ Add] ───┼──┼─▶│ 🧪 Test │                ││
│  │                            │  │  └────┬───┘                ││
│  │  👁️ Reviewer              │  │       │                    ││
│  │     Code review,           │  │       ▼                    ││
│  │     Best practices         │  │  ┌────────┐                ││
│  │                 [+ Add] ───┼──┼─▶│ 👁️ Rev  │                ││
│  │                            │  │  └────────┘                ││
│  │  🔒 Security Auditor       │  │                            ││
│  │     Vulnerability scan     │  │  [Save as Template]        ││
│  │                 [+ Add]    │  │                            ││
│  │                            │  │                            ││
│  │  📝 Doc Writer             │  │  Estimated team cost:      ││
│  │     Documentation          │  │  $3.50 - $5.00             ││
│  │                 [+ Add]    │  │                            ││
│  │                            │  │                            ││
│  └────────────────────────────┘  └────────────────────────────┘│
│                                                                 │
│  ┌─ Templates ─────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  [TDD Workflow]  [Security-First]  [Rapid Prototype]       ││
│  │  [Full Review]   [Docs-Included]   [Custom...]             ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│                              [Cancel]  [Start with This Team]   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Key Features**:
- Drag-and-drop agent selection
- Visual pipeline showing agent handoffs
- Pre-built templates for common workflows
- Estimated cost based on team composition
- Save custom team compositions as templates

---

### Pattern 5: Visual Pipeline Orchestration

**Node-Graph Editor for Complex Workflows**:

```
┌─────────────────────────────────────────────────────────────────┐
│ PIPELINE EDITOR                              [Save] [Run] [···] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │         ┌─────────┐                                         ││
│  │         │  START  │                                         ││
│  │         │  Intent │                                         ││
│  │         └────┬────┘                                         ││
│  │              │                                              ││
│  │              ▼                                              ││
│  │         ┌─────────┐                                         ││
│  │         │ 🏗️ Plan │                                         ││
│  │         │Architect│                                         ││
│  │         └────┬────┘                                         ││
│  │              │                                              ││
│  │        ┌─────┴─────┐         (parallel branches)           ││
│  │        ▼           ▼                                        ││
│  │   ┌─────────┐ ┌─────────┐                                   ││
│  │   │ ⚡ Code │ │ 🧪 Test │                                   ││
│  │   │  Impl   │ │ Stubs   │                                   ││
│  │   └────┬────┘ └────┬────┘                                   ││
│  │        │           │                                        ││
│  │        └─────┬─────┘         (join)                         ││
│  │              ▼                                              ││
│  │         ┌─────────┐                                         ││
│  │         │ 🧪 Test │                                         ││
│  │         │  Full   │                                         ││
│  │         └────┬────┘                                         ││
│  │              │                                              ││
│  │              ▼                                              ││
│  │    ┌────────────────────┐                                   ││
│  │    │ GATE: Human Review │                                   ││
│  │    └─────────┬──────────┘                                   ││
│  │              │                                              ││
│  │              ▼                                              ││
│  │         ┌─────────┐                                         ││
│  │         │ 👁️ Code │                                         ││
│  │         │ Review  │                                         ││
│  │         └────┬────┘                                         ││
│  │              │                                              ││
│  │              ▼                                              ││
│  │         ┌─────────┐                                         ││
│  │         │  MERGE  │                                         ││
│  │         └─────────┘                                         ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Nodes: [+ Agent] [+ Gate] [+ Condition] [+ Parallel] [+ Join] │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Node Types**:
- **Agent Node**: Executes a specific agent with configuration
- **Gate Node**: Requires human approval to proceed
- **Condition Node**: Branch based on result (tests pass/fail)
- **Parallel Node**: Split into concurrent branches
- **Join Node**: Wait for all parallel branches

---

### Pattern 6: Hybrid Sync/Async Mode Switching

**Seamless Transition Between Interactive and Background Work**:

```
┌─────────────────────────────────────────────────────────────────┐
│ MISSION: AUTH-001                                    ⚡ Active  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Currently: Implementation phase                                │
│  Agent: ⚡ Implementer working on JwtFilter.java                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Agent is writing code... (est. 3 min remaining)             ││
│  │ ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 35%               ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ Mode ──────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  ● Interactive    Watch agent work in real-time             ││
│  │  ○ Background     Continue in background, notify when done  ││
│  │  ○ Scheduled      Run during off-hours                      ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  [Send to Background]  [Pause]  [Cancel]                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Background Mode UI**:

```
┌─────────────────────────────────────────────────────────────────┐
│ BACKGROUND TASKS                                         [3] 🔔 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ AUTH-001 ──────────────────────────────────────────────────┐│
│  │  Status: Executing (65%)     ETA: 12 min                    ││
│  │  Current: Writing integration tests                         ││
│  │  Needs attention: No                                        ││
│  │                        [Pull to Foreground]  [View Details] ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ REFACTOR-042 ──────────────────────────────────────────────┐│
│  │  Status: Blocked (waiting for input)                    🔴  ││
│  │  Question: "Should I preserve backward compatibility?"      ││
│  │                        [Answer Now]  [Pull to Foreground]   ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ SCHEDULED: Dependency Update ──────────────────────────────┐│
│  │  Scheduled for: Tonight at 2:00 AM                          ││
│  │  Will update: 12 dependencies                               ││
│  │                        [Run Now]  [Reschedule]  [Cancel]    ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Notification Preferences**:
- Desktop notifications for completions and blockers
- Mobile push for urgent items
- Digest emails for end-of-day summaries
- Slack/Teams integration for team workflows

---

### Pattern 7: Spec Mode (The Disappearing Editor)

**For workflows where code is an implementation detail**:

```
┌─────────────────────────────────────────────────────────────────┐
│ 📋 SPEC MODE                                    [Switch to Code]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ Specification ─────────────────────────────────────────────┐│
│  │                                                             ││
│  │  # User Authentication                                      ││
│  │                                                             ││
│  │  ## Requirements                                            ││
│  │  - Users can register with email and password               ││
│  │  - Users can login and receive a JWT token                  ││
│  │  - Tokens expire after 24 hours                             ││
│  │  - Users can refresh tokens before expiry                   ││
│  │  - Users can have multiple roles (USER, ADMIN)              ││
│  │                                                             ││
│  │  ## Constraints                                             ││
│  │  - Use existing User table                                  ││
│  │  - Follow Spring Security best practices                    ││
│  │  - Don't modify CustomerService                             ││
│  │                                                             ││
│  │  ## Acceptance Criteria                                     ││
│  │  - [ ] Login returns valid JWT                              ││
│  │  - [ ] Invalid credentials return 401                       ││
│  │  - [ ] Expired tokens are rejected                          ││
│  │  - [ ] Refresh extends token lifetime                       ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ Preview ───────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  Based on this spec, the agent will:                        ││
│  │                                                             ││
│  │  📁 Create 5 new files:                                     ││
│  │     - JwtFilter.java                                        ││
│  │     - JwtUtil.java                                          ││
│  │     - AuthController.java                                   ││
│  │     - AuthService.java                                      ││
│  │     - V3__add_roles.sql                                     ││
│  │                                                             ││
│  │  📝 Modify 2 files:                                         ││
│  │     - SecurityConfig.java                                   ││
│  │     - User.java                                             ││
│  │                                                             ││
│  │  🧪 Create 3 test files                                     ││
│  │                                                             ││
│  │  [Show Detailed Plan]                                       ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│                    [Generate Implementation]                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Abstraction Levels**:
- **Spec Mode**: Write requirements, agent generates code
- **Architecture Mode**: See structure, hide implementation
- **Code Mode**: Full code access when needed

```
┌─ View Mode ─────────────────────────────────────────────────────┐
│                                                                 │
│  [📋 Spec]     [🏗️ Architecture]     [💻 Code]                  │
│     ▲                                                           │
│     └─ Currently selected                                       │
│                                                                 │
│  Spec: Write what you want                                      │
│  Architecture: See components and relationships                 │
│  Code: Full file access (collapsed by default)                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Pattern 8: Memory Management UI

**Explicit Control Over Agent Memory**:

```
┌─────────────────────────────────────────────────────────────────┐
│ AGENT MEMORY: api-gateway                            [Refresh]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ Project Understanding ─────────────────────────── 94% ─────┐│
│  │                                                             ││
│  │  "Spring Boot 3.2 microservice providing REST APIs for     ││
│  │   order management. Uses PostgreSQL, Flyway migrations,    ││
│  │   and MapStruct for DTO mapping. Follows hexagonal         ││
│  │   architecture with Controller-Service-Repository layers." ││
│  │                                                             ││
│  │                                           [Edit] [Refresh]  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ Learned Conventions ───────────────────────────────────────┐│
│  │                                                             ││
│  │  ✓ Use constructor injection, not @Autowired               ││
│  │  ✓ DTOs go in .dto package, use suffix "Request/Response"  ││
│  │  ✓ All entities extend BaseAuditEntity                     ││
│  │  ✓ Tests use Testcontainers for database                   ││
│  │  ✓ API versioning in URL: /api/v1/...                      ││
│  │                                                             ││
│  │  [+ Add Convention]                     [Edit] [Clear All]  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ Past Decisions ────────────────────────────────────────────┐│
│  │                                                             ││
│  │  AUTH-001: Chose stateless JWT over session-based auth     ││
│  │  ORD-099: Chose Flyway over Liquibase for migrations       ││
│  │  ORD-050: Established error handling pattern with...       ││
│  │                                                             ││
│  │  [View All Decisions]                                       ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ Team Shared Memory ────────────────────────────────────────┐│
│  │                                                             ││
│  │  Inherited from team "Backend Squad":                       ││
│  │  • Logging format: JSON structured logs                     ││
│  │  • Error codes: Use company error code registry             ││
│  │  • API design: Follow company API guidelines v2.1           ││
│  │                                                             ││
│  │  [View Team Memory] [Override for This Project]             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ Teach Agent ───────────────────────────────────────────────┐│
│  │                                                             ││
│  │  The agent made a mistake? Teach it to avoid in future:    ││
│  │                                                             ││
│  │  ┌─────────────────────────────────────────────────────┐   ││
│  │  │ "When creating entities, always add @Version for    │   ││
│  │  │  optimistic locking. You missed this on Order.java" │   ││
│  │  └─────────────────────────────────────────────────────┘   ││
│  │                                              [Save]         ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Memory Hierarchy**:
1. **Global**: Anthropic/model-level capabilities
2. **Team**: Shared conventions across projects
3. **Project**: Specific to this codebase
4. **Mission**: Context for current task

---

### Pattern 9: Ambient Awareness & Proactive Suggestions

**Context-Aware Agent Activation**:

```
┌─────────────────────────────────────────────────────────────────┐
│ 💡 SUGGESTIONS                                    [Dismiss All] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ Based on your recent activity ─────────────────────────────┐│
│  │                                                             ││
│  │  🔍 You opened OrderServiceTest.java but haven't run tests ││
│  │     in 20 minutes.                                          ││
│  │                                                             ││
│  │     "Did you mean to run the tests?"                        ││
│  │                                                             ││
│  │     [Run Tests]  [Run with Coverage]  [Dismiss]             ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ Detected opportunity ──────────────────────────────────────┐│
│  │                                                             ││
│  │  📝 You have 3 TODO comments in recent files that could    ││
│  │     be converted to tasks:                                  ││
│  │                                                             ││
│  │     - "TODO: Add input validation" (OrderController.java)   ││
│  │     - "TODO: Handle edge case" (OrderService.java)          ││
│  │     - "FIXME: This is slow" (OrderRepository.java)          ││
│  │                                                             ││
│  │     [Create Missions from TODOs]  [Dismiss]                 ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ Error detected ────────────────────────────────────────────┐│
│  │                                                             ││
│  │  ❌ Build failed 2 minutes ago:                             ││
│  │     "Cannot resolve symbol 'OrderStatus'"                   ││
│  │                                                             ││
│  │     I can see the issue - OrderStatus enum is missing.      ││
│  │                                                             ││
│  │     [Fix This]  [Explain Error]  [Dismiss]                  ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ Continue previous work ────────────────────────────────────┐│
│  │                                                             ││
│  │  🔄 Yesterday you were working on AUTH-001 and stopped at  ││
│  │     the JWT refresh implementation.                         ││
│  │                                                             ││
│  │     [Continue Where I Left Off]  [Start Fresh]             ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Trigger Conditions**:
- File opened → relevant agent activates
- Error detected → debugging agent offers help
- Time passed since action → reminder/suggestion
- Pattern detected → proactive recommendation
- Return from absence → context resumption

---

### Pattern 10: Review Surface with Confidence Scores

**Enhanced Review UI with Agent Certainty**:

```
┌─────────────────────────────────────────────────────────────────┐
│ REVIEW: OrderService.java                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─ Change Summary ────────────────────────────────────────────┐│
│  │                                                             ││
│  │  Agent: ⚡ Implementer                                      ││
│  │  Confidence: ████████░░ 85%                                 ││
│  │                                                             ││
│  │  "Added transaction support to createOrder method.          ││
│  │   High confidence because this follows the same pattern     ││
│  │   used in CustomerService and PaymentService."              ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ Diff with Inline Actions ──────────────────────────────────┐│
│  │                                                             ││
│  │  @@ -67,4 +67,38 @@                                         ││
│  │                                                             ││
│  │  + @Transactional  ─────────────────────┬─ 95% confident   ││
│  │    public Order createOrder(...) {      │  Standard pattern ││
│  │  +     // Validate customer             │                   ││
│  │  +     Customer c = customerRepo        │  [✓] [✗] [?]     ││
│  │  +         .findById(request.id())  ────┴──────────────────││
│  │  +         .orElseThrow(...);                               ││
│  │  +                                                          ││
│  │  +     // Check inventory ──────────────┬─ 72% confident   ││
│  │  +     inventoryService                 │  New pattern,     ││
│  │  +         .validateAvailability(...)   │  needs review     ││
│  │  +                                      │                   ││
│  │  +     // This is my best guess... ─────┤  [✓] [✗] [?]     ││
│  │  +     // Consider adding retry logic   │                   ││
│  │  +                                  ────┴──────────────────││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ Agent Uncertainty Flag ─────────────────────────────────────┐
│  │                                                             ││
│  │  ⚠️ NEEDS HUMAN INPUT                                       ││
│  │                                                             ││
│  │  "I'm unsure whether to throw InventoryException or        ││
│  │   return an error response for out-of-stock items.          ││
│  │   CustomerService throws, but PaymentService returns.       ││
│  │   Which pattern should I follow?"                           ││
│  │                                                             ││
│  │  [Throw Exception]  [Return Error]  [Let Me Decide Later]   ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─ Batch Actions ─────────────────────────────────────────────┐│
│  │                                                             ││
│  │  [✓ Approve All High-Confidence (>90%)]                     ││
│  │  [Review Low-Confidence Items Only]                         ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│                   [✓ Approve All]  [✗ Reject]  [💬 Discuss]    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part VI-C: The Role Transition

### From Individual Contributor to Team Lead of AI Agents

The interface reflects this fundamental role shift:

```
┌─────────────────────────────────────────────────────────────────┐
│                    ROLE EVOLUTION                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  YESTERDAY              TODAY                TOMORROW           │
│  ──────────────────────────────────────────────────────────     │
│                                                                 │
│  Write code        →    Prompt + review   →  Orchestrate +      │
│                                               supervise         │
│                                                                 │
│  Debug by reading  →    Debug by reading  →  Debug by adjusting │
│  code                   agent reasoning      agent behavior     │
│                                                                 │
│  Manual testing    →    Agent-assisted    →  Agents run and     │
│                         testing              fix tests          │
│                                                                 │
│  Individual        →    Human-AI pair     →  Team lead of       │
│  contributor                                 AI agents          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Skills the Interface Must Support

| New Skill | How the UI Supports It |
|-----------|------------------------|
| **Specification Writing** | Spec Mode, intent capture, constraint definition |
| **Agent Orchestration** | Visual pipeline editor, team casting, parallel management |
| **Decision Making** | Clear decision points, options comparison, rationale access |
| **Quality Assurance** | Review surface, confidence scores, batch approval |
| **Context Engineering** | Memory management, project understanding visibility |
| **Failure Mode Analysis** | Agent reasoning visibility, uncertainty flags |

---

## Part VII: Design Tokens

### Color Palette (Dark Theme)

```css
/* Backgrounds */
--bg-base: #0d1117;
--bg-surface: #161b22;
--bg-elevated: #21262d;
--bg-hover: #30363d;

/* Text */
--text-primary: #f0f6fc;
--text-secondary: #8b949e;
--text-muted: #6e7681;

/* Accents */
--accent-blue: #58a6ff;
--accent-green: #3fb950;
--accent-red: #f85149;
--accent-amber: #d29922;
--accent-purple: #a371f7;
--accent-cyan: #39d4c4;

/* Agent Colors */
--agent-architect: #a371f7;
--agent-implementer: #58a6ff;
--agent-tester: #3fb950;
--agent-reviewer: #d29922;
--agent-documenter: #39d4c4;

/* Status */
--status-active: #58a6ff;
--status-success: #3fb950;
--status-warning: #d29922;
--status-error: #f85149;
--status-idle: #6e7681;

/* Borders */
--border-default: #30363d;
--border-emphasis: #484f58;
```

### Typography

```css
/* Font Families */
--font-sans: system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font Sizes */
--text-xs: 11px;
--text-sm: 12px;
--text-base: 14px;
--text-lg: 16px;
--text-xl: 18px;
--text-2xl: 24px;

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
```

### Spacing

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
```

---

## Glossary

| Term | Definition |
|------|------------|
| **ADE** | Agentic Development Environment |
| **Mission** | A high-level goal that spawns a plan and tasks |
| **Intent** | The operator's natural language description of what they want |
| **Plan** | A structured approach to achieve the mission, with tasks and estimates |
| **Conversation** | The persistent thread of communication for a mission |
| **Review Surface** | The workspace for validating agent output |
| **Observation** | A proactive insight from an agent's ambient awareness |
| **Casting** | Selecting which agents will work on a mission |
| **Operator** | The human user who directs and oversees agents |

---

*Document Version: 3.0 Draft*  
*Status: Design Specification*  
*For: Prototype Development*
