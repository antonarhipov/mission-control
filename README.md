# Mission Control UI

> **Visual Mission Control for Agentic Development Workflows**

A React/TypeScript web application that provides oversight and control for AI agent teams working across multiple repositories. Mission Control enables humans to supervise, approve, and guide agentic development through a human-gated pipeline workflow.

![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-6-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan)

---

## Overview

Mission Control visualizes and manages **multi-agent software development workflows** where AI agents collaborate on tasks spanning multiple repositories. It implements a **human-in-the-loop** approach where critical decisions require human approval before agents proceed to the next phase.

### Key Concepts

- **Tasks** - Units of work that may span multiple repositories (e.g., "Add OAuth2 social login")
- **Specifications** - AI-generated technical plans that define what agents will build
- **Human Gates** - Approval checkpoints where humans review and approve before agents proceed
- **Agents** - AI workers with specialized roles (implementer, architect, tester, reviewer)
- **Teams** - Groups of agents that work together on related features
- **Pipeline Stages** - Sequential phases: Design → Implementation → Testing → Review
- **Traceability** - Every code change links back to its specification requirement

---

## Human-Gated Workflow

Mission Control implements a collaborative workflow between humans and AI agents:

### 1. **Task Creation & Specification**

```
User creates task with high-level description
           ↓
   AI generates specification
  (Technical approach, acceptance
   criteria, risks, dependencies)
           ↓
    [Status: Planning]
           ↓
  Human reviews specification
     in Pipeline View
           ↓
      Approve or Request Changes
```

**Human Decision Point:** Review and approve AI-generated specification before implementation begins.

### 2. **Implementation & Review**

```
   Specification approved
           ↓
   [Status: In Progress]
           ↓
  Agents implement based on spec
    (commit to feature branches)
           ↓
   Human reviews in Diff View
           ↓
  Approve or Revise Specification
           ↓
    Advance to Testing Stage
```

**Human Decision Point:** Review implementation and approve to proceed, or revise specification if changes don't meet expectations.

### 3. **Specification Traceability**

Every code change traces back to specification requirements:

```
Diff View shows: "This implements [AC-1] Order entity with JPA"
                              ↓
                 Click "View in Specification"
                              ↓
            Pipeline View highlights the requirement
                              ↓
                   Human verifies alignment
```

---

## Features

### 📋 **Overview Board**

5-column task board showing workflow stages:
- **Backlog** - Not started
- **Planning** - Specification pending approval ⚠️
- **In Progress** - Implementation underway
- **Review** - Under review
- **Done** - Completed

Quick actions:
- **"Review & Approve Specification"** - Jump to spec approval
- **"View Dependencies"** - Navigate to dependency graph
- **"View Pipeline"** - See detailed task progress

### 🔄 **Pipeline View**

Central hub for task management:
- **Specification Viewer** with approval workflow
  - AI-generated technical plan
  - Acceptance criteria with completion tracking
  - Scope estimation and risk assessment
  - Approval status badges
- **Multi-Repository Support** - Tasks spanning multiple codebases
- **Agent Contributions** - Who did what, at what cost
- **Pipeline Stages** - Visual progress through Design → Implementation → Testing → Review
- **Recent Commits** - Navigate to diffs with one click

### 📊 **Diff View with Traceability**

Three-column layout for code review:
- **File List** (left) - Changed files across all repos
- **Diff Viewer** (center) - Side-by-side or unified diff
- **Context Panels** (right):
  1. **Decision Context** - Why this change? Reasoning and alternatives
  2. **Specification Context** - What requirement does this fulfill?

**Human Actions:**
- **"Approve"** - Advance task to next pipeline stage
- **"Revise Specification"** - Navigate to spec if changes don't meet expectations

### 💰 **Cost Tracking**

Multi-level cost attribution:
- **Per Task** - Total cost across all agents and stages
- **Per Pipeline Stage** - Design vs Implementation vs Testing costs
- **Per Agent** - Individual contributor costs and efficiency
- **Per Commit** - Token usage and API costs per commit

Budget monitoring with alerts and spending trends.

### 🔗 **Dependency Management**

Visualize task relationships:
- **Dependency Graph** - See what blocks what
- **Critical Path** - Identify tasks on the critical path
- **Three View Modes** - Graph, list, or timeline
- **Circular Dependency Detection** - Warnings for invalid dependencies

### ⚙️ **Configuration**

Manage teams, agents, and repositories:
- **Teams** - Groups of agents with complementary skills
- **Agents** - Configure roles, models, and permissions
- **Repositories** - Connect multiple codebases
  - Connection status monitoring
  - Auto-sync settings
  - Default branch configuration

---

## Workflow Philosophy

### Design Principles

1. **Specs are Source of Truth**
   - Implementation must match approved specification
   - If changes don't meet expectations, revise the spec (not the code directly)

2. **Human Gates at Critical Points**
   - Approve specification before implementation
   - Approve implementation before testing
   - No code merges without human oversight

3. **Bidirectional Traceability**
   - Navigate from spec to implementation
   - Navigate from code change back to requirement
   - Verify every change has a "why"

4. **Commits are Permanent**
   - Agents commit to feature branches (not pending approval)
   - Human approval gates stage progression (not commits)
   - Bad implementations → revise spec and re-implement

5. **No Code-Level Comments**
   - Feedback goes into specification revisions
   - Changes have reasoning context, not inline annotations

### What This Is NOT

- ❌ **Not a code review tool** - Agents commit directly; humans review implementation against spec
- ❌ **Not a git GUI** - Git operations happen outside the UI
- ❌ **Not a project management tool** - Focused on agentic workflow, not traditional PM
- ❌ **Not autonomous** - Requires human oversight at key decision points

---

## Technology Stack

- **Frontend**: React 18 + TypeScript 5.6
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 (dark theme)
- **Icons**: lucide-react
- **State**: Props-based (no external state library)
- **Data**: Mock data (V2 task-centric architecture)

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone repository
git clone <repository-url>
cd AgenticMissionControl

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 to view the application.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Development

### Project Structure

```
src/
├── components/
│   ├── layout/          # Header, TabBar
│   ├── panels/          # Main views (Overview, Pipelines, Diff, Cost, etc.)
│   ├── shared/          # Reusable components (TaskListSidebar, SpecificationViewer)
│   └── diff/            # Diff viewer components
├── data/
│   └── mockDataV2.ts    # Mock data (task-centric)
├── hooks/
│   └── useDataModel.ts  # Data access hook
└── types/
    └── index.ts         # TypeScript type definitions
```

### Key Files

- **CLAUDE.md** - Technical specification for AI assistants
- **src/types/index.ts** - Complete type system
- **src/data/mockDataV2.ts** - Example data with traceability

### Mock Data

The application uses rich mock data to demonstrate the full workflow:

- **Tasks** - Various states (backlog, planning, in-progress, review, done)
- **Specifications** - AI-generated specs with approval workflows
- **Traceability** - Links between specs, commits, and file changes
- **Multi-Repo** - Tasks spanning multiple repositories
- **Cost Data** - Token usage, API costs, and budgets

---

## Workflow Scenarios

### Scenario 1: New Feature Request

1. User creates task: "Add OAuth2 social login"
2. AI generates specification with acceptance criteria
3. Human reviews spec in Pipeline view → **Approves**
4. Agents implement across multiple repos
5. Human reviews implementation in Diff view
6. Sees "Implements [AC-1] Google OAuth works end-to-end"
7. Clicks "View in Specification" → Verifies alignment
8. Clicks **"Approve"** → Task advances to Testing

### Scenario 2: Implementation Doesn't Match Expectations

1. Human reviews implementation in Diff view
2. Sees that implementation is more complex than needed
3. Clicks **"Revise Specification"**
4. Updates spec: "Use simple email/password for MVP, defer OAuth to v2"
5. Agents re-implement based on revised spec
6. Human reviews again → Approves

### Scenario 3: Tracking Costs Across Teams

1. Navigate to Cost panel
2. Select task "Order Management Refactor"
3. View pipeline stage costs:
   - Design: $2.18 (architect-1)
   - Implementation: $5.43 (implementer-1)
   - Testing: $2.31 (tester-1)
4. Identify high-cost commits
5. Optimize agent models for future tasks

---

## Future Enhancements

- [ ] **Real Integration** - Connect to actual agent frameworks (e.g., Claude Code, AutoGPT)
- [ ] **Git Operations** - Direct integration with git workflows
- [ ] **Specification Editing** - In-app spec revision UI
- [ ] **Test Execution** - Trigger and view test results
- [ ] **Approval Workflow** - Multi-approver and role-based permissions
- [ ] **Notifications** - Alerts for pending approvals and blocked tasks
- [ ] **Time Tracking** - Duration estimates and actual time spent
- [ ] **Export Reports** - Generate reports on agent performance and costs

---

## Contributing

This is a prototype/mockup showcasing agentic development workflow concepts. Contributions welcome for:

- UI/UX improvements
- Additional workflow patterns
- Real agent framework integrations
- Documentation enhancements

---

## License

[Specify license here]

---

## Acknowledgments

Built with inspiration from:
- Multi-agent software development systems
- Human-in-the-loop AI workflows
- Modern project management UIs (Linear, Jira, GitHub Projects)
- Git worktree management tools

---

**Questions or Feedback?** Open an issue or discussion.
