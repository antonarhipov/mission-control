# SPEC-V4: Unified Specification Traceability

**Version:** 4
**Status:** Draft
**Last Updated:** January 2025

---

## 1. Problem Statement

### Current Limitations

**V2 (Task-Centric):**
- Strong specification traceability (AcceptanceCriteria, fulfillsAcceptanceCriteria, specRationale)
- Good diff views with reasoning panels
- Limited pipeline model
- No conversation persistence
- No specification toolkit integration

**V3 (Mission-Centric):**
- Excellent mission/conversation model
- Strong pipeline execution with logs
- Good team/agent structure
- Specification toolkit integration (openspec, agent-os)
- **Missing:** Bidirectional spec ↔ code traceability
- **Missing:** Diff views with reasoning context
- **Missing:** Cost attribution at criterion level

### Market Differentiation Problem

Competitors like Vibe-Kanban and Capy lack:
- Integration with specification toolkits (openspec, spek-kit, agent-os)
- Full traceability from specification to implementation
- Transparent cost breakdown per requirement
- Human-gated workflows with specification context

---

## 2. Goals

### Primary Goals

1. **Complete Traceability Chain**
   - Intent → Specification (via toolkit) → Acceptance Criteria → Implementation → Verification
   - Every file change links to acceptance criteria
   - Every criterion shows implementing files, commits, and agents

2. **Specification Impact Visibility**
   - Dashboard showing criterion completion status
   - Cost breakdown per criterion
   - Agent contribution per criterion
   - Progress visualization

3. **Integrated Review Experience**
   - Diff view with specification context
   - Reasoning panel showing decision rationale
   - "Revise Specification" workflow
   - Human-gated approval at criterion level

4. **Cost Attribution Transparency**
   - Track costs at criterion level
   - Handle multi-criterion changes fairly
   - Aggregate costs up the hierarchy (criterion → stage → mission)

### Non-Goals

- Real-time collaboration (future version)
- External tool integrations beyond spec toolkits
- Mobile-responsive design
- Multi-tenancy / user authentication
- Spec authoring/negotiation UI (users bring their own specs)
- Criterion versioning (specs treated as immutable once approved)
- Spec health signals beyond completion status

### Scope Clarification

This specification focuses on **implementation tracking**: "Given a spec, track how well it's being implemented." Users are expected to bring their specifications from external tools (openspec, manual authoring, etc.). The full spec lifecycle (authoring, negotiation, versioning) is deferred to a future version.

---

## 3. User Stories

### Operator Stories

**US-1: View Specification Impact**
> As an operator, I want to see which acceptance criteria have been implemented, at what cost, and by which agents, so I can track progress against the specification.

**US-2: Trace Code to Specification**
> As an operator reviewing a code change, I want to see which acceptance criteria it implements and why, so I can verify it matches the approved specification.

**US-3: Trace Specification to Code**
> As an operator viewing an acceptance criterion, I want to see all files and commits that implement it, so I can verify completeness.

**US-4: Review with Context**
> As an operator, I want to see the agent's reasoning and specification context alongside the diff, so I can make informed approval decisions.

**US-5: Revise Specification During Review**
> As an operator, when implementation doesn't match expectations, I want to navigate to the specification to revise acceptance criteria, triggering re-implementation.

**US-6: Understand Costs**
> As an operator, I want to know how much implementing each acceptance criterion costs, so I can make informed decisions about scope.

**US-7: Handle Orphaned Changes**
> As an operator, when code changes don't link to any acceptance criterion, I want to be alerted and prompted to either link them to existing criteria, create a new criterion, or mark as tech debt.

---

## 4. Architecture Overview

### Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           V4 DATA FLOW                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  User Intent                                                            │
│       │                                                                 │
│       ▼                                                                 │
│  ┌─────────────┐     ┌─────────────────────┐                           │
│  │ Spec Toolkit│────▶│ AcceptanceCriteria  │                           │
│  │ (openspec)  │     │ (V4)                │                           │
│  └─────────────┘     └──────────┬──────────┘                           │
│                                 │                                       │
│                    ┌────────────┼────────────┐                         │
│                    │            │            │                         │
│                    ▼            ▼            ▼                         │
│              ┌─────────┐  ┌─────────┐  ┌─────────┐                     │
│              │  File   │  │ Commit  │  │  Cost   │                     │
│              │ Changes │  │         │  │ Attrib  │                     │
│              └────┬────┘  └────┬────┘  └────┬────┘                     │
│                   │            │            │                          │
│                   └────────────┼────────────┘                          │
│                                │                                       │
│                                ▼                                       │
│                    ┌───────────────────────┐                           │
│                    │ Specification Impact  │                           │
│                    │     Dashboard         │                           │
│                    └───────────────────────┘                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
src/
├── types/
│   └── index.ts                      # Add V4 types
├── data/
│   └── mockDataV4.ts                 # V4 mock data (NEW)
├── hooks/
│   └── useV4DataModel.ts             # V4 data access (NEW)
├── utils/
│   └── costAttribution.ts            # Cost distribution logic (NEW)
├── components/
│   ├── specification/                # NEW DIRECTORY
│   │   ├── SpecificationImpactDashboard.tsx
│   │   ├── CriterionCard.tsx
│   │   ├── CriterionCostBreakdown.tsx
│   │   └── CriterionFileList.tsx
│   ├── review/
│   │   ├── TraceabilityPanel.tsx     # NEW
│   │   └── CriterionBadge.tsx        # NEW
│   └── missions/
│       └── MissionDetailModal.tsx    # Add "Spec Impact" tab
```

---

## 5. Data Model

### 5.1 AcceptanceCriterionV4

```typescript
interface AcceptanceCriterionV4 {
  id: string;                        // "AC-1", "AC-2", etc.
  description: string;               // What success looks like
  completed: boolean;
  completedAt?: string;

  // Dependencies & Assignment
  dependsOn?: string[];              // ["AC-1", "AC-2"] - criteria that must complete first
  assignedAgents?: string[];         // Agents currently working on this criterion

  // Cost Attribution
  costAttribution: {
    totalCost: number;
    byAgent: Record<string, number>;   // agentId -> cost contribution
    byStage: Record<string, number>;   // stageId -> cost contribution
  };

  // Traceability - What implements this criterion
  implementedIn: {
    commits: CommitReference[];        // Commits implementing this
    files: FileReference[];            // Files implementing this
    changesInReview: string[];         // Change IDs pending approval
  };

  // Verification Status
  verification: {
    status: 'pending' | 'agent-verified' | 'human-verified' | 'failed';
    verifiedBy?: string;
    verifiedAt?: string;
    testResults?: TestReference[];
  };
}

interface CommitReference {
  sha: string;
  message: string;
  agentId?: string;
  cost: number;
  timestamp: string;
}

interface FileReference {
  id: string;
  path: string;
  filename: string;
  changeType: 'added' | 'modified' | 'deleted';
  additions: number;
  deletions: number;
  rationale: string;                   // Why this file implements the criterion
}

interface TestReference {
  testId: string;
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  runAt: string;
}
```

### 5.2 PlanV4

```typescript
interface PlanV4 extends Plan {
  // Bridge to V2 traceability
  acceptanceCriteria: AcceptanceCriterionV4[];

  // Specification approval workflow
  specificationStatus: 'draft' | 'pending_approval' | 'approved' | 'changes_requested' | 'rejected';
  approvedAt?: string;
  approvedBy?: string;

  // Map tasks to criteria
  taskCriteriaMapping: {
    taskId: string;
    criteriaIds: string[];
  }[];
}
```

### 5.3 ChangeV4

```typescript
interface ChangeV4 extends Change {
  // Specification Traceability
  fulfillsAcceptanceCriteria: string[];  // ["AC-1", "AC-3"]
  specRationale: string;                  // Why this change per spec

  // Cost Attribution
  costByCriterion: Record<string, number>; // How cost distributes to criteria

  // Review Status
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'needs-revision';
  reviewedAt?: string;
  reviewedBy?: string;
  reviewFeedback?: string;

  // Reasoning Context (from V2)
  reasoning?: {
    decisions: {
      type: 'decision' | 'rationale' | 'alternative';
      title: string;
      description: string;
      rejected?: boolean;
      rejectionReason?: string;
    }[];
    references: {
      type: 'doc' | 'code' | 'external';
      title: string;
      url?: string;
    }[];
    verification?: {
      testsRun: number;
      testsPassed: number;
      testNames?: string[];
    };
  };

  // Orphan Detection
  isOrphan?: boolean;                    // True if no criteria linked
  orphanResolution?: 'linked' | 'new-criterion' | 'tech-debt';  // How orphan was resolved
}
```

### 5.4 MissionV4

```typescript
interface MissionV4 extends Mission {
  plan?: PlanV4;
  execution?: ExecutionV4;

  // Computed Specification Impact
  specificationImpact?: {
    totalCriteria: number;
    completedCriteria: number;
    verifiedCriteria: number;
    totalCost: number;
    costByCriterion: Record<string, CriterionCostSummary>;
  };
}

interface CriterionCostSummary {
  criterionId: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'verified' | 'blocked';
  blockedBy?: string[];                 // Criteria IDs blocking this one
  cost: number;
  implementingAgents: string[];
  implementingFiles: string[];
  implementingCommits: string[];
}
```

---

## 6. UI Specifications

### 6.1 Specification Impact Dashboard

**Location:** Mission Detail Modal → "Spec Impact" tab

**Layout:**
```
┌────────────────────────────────────────────────────────────────────┐
│  SPECIFICATION IMPACT                        Mission: AUTH-001     │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌─ Overall Progress ────────────────────────────────────────────┐│
│  │  Criteria: ██████████████░░░░░░░░░░ 5/8 (62.5%)              ││
│  │  Verified: ████████░░░░░░░░░░░░░░░░ 3/8 (37.5%)              ││
│  │  Total Cost: $12.47                                          ││
│  └───────────────────────────────────────────────────────────────┘│
│                                                                    │
│  ┌─ By Acceptance Criterion ─────────────────────────────────────┐│
│  │                                                               ││
│  │  [AC-1] Order entity persists to database                    ││
│  │  ✓ Completed • $2.15 • 3 files • by Impl                     ││
│  │  └─ Order.java, OrderLineItem.java                           ││
│  │     commit: 8e4d1a9                                          ││
│  │                                                               ││
│  │  [AC-2] Customer LAZY fetching works correctly               ││
│  │  ✓ Completed • $1.20 • 2 files • by Impl                     ││
│  │                                                               ││
│  │  [AC-3] LineItem cascade operations work                     ││
│  │  ○ In Review • $0.85 • 2 files                               ││
│  │  └─ OrderService.java < Click to review                      ││
│  │                                                               ││
│  │  [AC-4] Constructor injection (no field injection)           ││
│  │  ... In Progress • $2.53 • 1 file                            ││
│  │                                                               ││
│  │  [AC-5] Domain events for order state changes                ││
│  │  ○ Pending • $0.00 • 0 files                                 ││
│  │                                                               ││
│  └───────────────────────────────────────────────────────────────┘│
│                                                                    │
│  ┌─ Cost by Agent ───────────────────────────────────────────────┐│
│  │  Implementer  ████████████████████████████  $8.42 (67%)      ││
│  │  Architect    ██████████                     $2.85 (23%)      ││
│  │  Tester       ████                           $1.20 (10%)      ││
│  └───────────────────────────────────────────────────────────────┘│
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Interactions:**
- Click criterion → Navigate to Review Surface filtered by that criterion
- Click file → Navigate to diff view for that file
- Click commit → Navigate to diff view filtered by that commit
- Expand/collapse criterion details

### 6.2 Enhanced Review Surface

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────┐
│  REVIEW SURFACE                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ ┌─ Review Queue ───┐ ┌─ Change Detail ─────────────────────────────┐│
│ │                  │ │                                             ││
│ │ Group by:        │ │ File: OrderService.java                    ││
│ │ ○ Criterion      │ │ Agent: Implementer                         ││
│ │ ○ File           │ │ Implements: [AC-1] [AC-3]                  ││
│ │ ○ Agent          │ │                                             ││
│ │                  │ │ ┌─────────────────────────────────────────┐ ││
│ │ ▼ [AC-1] 3 files │ │ │ @@ -23,6 +23,42 @@                     │ ││
│ │   ✓ Order.java   │ │ │ @Service                                │ ││
│ │   ✓ LineItem.java│ │ │ +@Transactional                         │ ││
│ │   ○ Repo.java    │ │ │ public class OrderService {             │ ││
│ │                  │ │ │   ...                                   │ ││
│ │ ▼ [AC-3] 2 files │ │ └─────────────────────────────────────────┘ ││
│ │   ○ Service.java │ │                                             ││
│ │   ○ Test.java    │ │ ┌─ Reasoning ───────────────────────────┐  ││
│ │                  │ │ │ Decision: Added @Transactional        │  ││
│ │                  │ │ │ Rationale: Atomicity for inventory    │  ││
│ │                  │ │ │ Alternative: Manual rollback X        │  ││
│ │                  │ │ │ Tests: 5/5 passed                     │  ││
│ │                  │ │ └───────────────────────────────────────┘  ││
│ │                  │ │                                             ││
│ │                  │ │ ┌─ Spec Traceability ───────────────────┐  ││
│ │                  │ │ │ Implements:                           │  ││
│ │                  │ │ │ • AC-1: Order entity persists...      │  ││
│ │                  │ │ │ • AC-3: LineItem cascade ops...       │  ││
│ │                  │ │ │                                       │  ││
│ │                  │ │ │ Rationale: Refactored to use          │  ││
│ │                  │ │ │ constructor injection for better      │  ││
│ │                  │ │ │ testability per AC-1 requirement.     │  ││
│ │                  │ │ │                                       │  ││
│ │                  │ │ │ [View in Specification]               │  ││
│ │                  │ │ └───────────────────────────────────────┘  ││
│ │                  │ │                                             ││
│ │                  │ │ [Revise Specification]     [✓ Approve]     ││
│ └──────────────────┘ └─────────────────────────────────────────────┘│
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Interactions:**
- Toggle grouping mode (criterion/file/agent)
- Select change to view in detail panel
- "View in Specification" → Navigate to Spec Impact Dashboard with criterion highlighted
- "Revise Specification" → Navigate to Plan editor for criterion modification
- "Approve" → Mark change as approved, update criterion progress

### 6.3 Bidirectional Navigation

**Spec → Code:**
1. User views criterion in Spec Impact Dashboard
2. Clicks criterion card or "View Changes" button
3. Navigates to Review Surface with filter: `criterionId=AC-1`
4. Review queue shows only changes implementing AC-1

**Code → Spec:**
1. User viewing change in Review Surface
2. Sees `fulfillsAcceptanceCriteria: ["AC-1", "AC-3"]` in Traceability Panel
3. Clicks "View in Specification"
4. Navigates to Spec Impact Dashboard with AC-1 highlighted (scroll + pulse animation)

---

## 7. Cost Attribution

### 7.1 Distribution Strategies

```typescript
type CostDistributionStrategy = 'equal' | 'proportional' | 'explicit';

// EQUAL: Split evenly among criteria
// Change costs $3.00, implements AC-1 and AC-3
// Result: AC-1 = $1.50, AC-3 = $1.50

// PROPORTIONAL: Based on lines changed per criterion
// Change costs $3.00, AC-1 has 80 lines, AC-3 has 40 lines
// Result: AC-1 = $2.00, AC-3 = $1.00

// EXPLICIT: Agent specifies breakdown
// Change has costByCriterion: { "AC-1": 2.50, "AC-3": 0.50 }
// Result: AC-1 = $2.50, AC-3 = $0.50
```

### 7.2 Aggregation Hierarchy

```
Mission.specificationImpact.totalCost
    │
    ├── PipelineStage.cost
    │       │
    │       ├── AcceptanceCriterion.costAttribution.totalCost
    │       │       │
    │       │       ├── Agent contribution
    │       │       │
    │       │       └── Commit/File cost
    │       │
    │       └── (other criteria in this stage)
    │
    └── (other stages)
```

---

## 8. Human-Gated Workflow

### 8.1 Approval Gates

```
1. PLAN APPROVAL
   ├─ Plan proposed with AcceptanceCriteria
   ├─ Operator reviews criteria
   └─ GATE: Must approve before execution starts

2. CHANGE APPROVAL
   ├─ Agent creates change linked to criteria
   ├─ Change appears in Review Surface
   ├─ Operator reviews with spec context
   └─ GATE: Must approve/reject each change
       ├─ Approve → Update criterion progress
       ├─ Reject → Agent revises
       └─ Revise Spec → Modify criteria, re-implement

3. CRITERION VERIFICATION
   ├─ All changes for criterion approved
   ├─ Tests pass
   └─ GATE: Human verifies criterion complete
       └─ Status: 'human-verified'

4. STAGE ADVANCEMENT
   ├─ All criteria for stage complete
   └─ GATE: Approve moving to next pipeline stage
```

### 8.2 "Revise Specification" Flow

```
User in Review Surface
    │
    ├─ Sees change that doesn't match expectations
    │
    ├─ Clicks "Revise Specification"
    │
    ├─ Navigates to Plan/Spec editor
    │   └─ Criterion pre-selected
    │
    ├─ Modifies criterion description
    │
    ├─ Saves changes
    │
    └─ System triggers:
        ├─ Invalidate affected changes (needs re-review)
        └─ Notify agent to re-implement
```

---

## 9. Files to Create/Modify

### New Files

| File | Purpose |
|------|---------|
| `docs/SPEC-V4-UNIFIED-TRACEABILITY.md` | This specification document |
| `src/data/mockDataV4.ts` | V4 mock data with full traceability |
| `src/hooks/useV4DataModel.ts` | V4 data access hook |
| `src/utils/costAttribution.ts` | Cost distribution utilities |
| `src/components/specification/SpecificationImpactDashboard.tsx` | Main impact view |
| `src/components/specification/CriterionCard.tsx` | Individual criterion display |
| `src/components/specification/CriterionCostBreakdown.tsx` | Cost visualization |
| `src/components/specification/CriterionFileList.tsx` | Files for criterion |
| `src/components/specification/OrphanedChangesAlert.tsx` | Alert for unlinked changes |
| `src/components/review/TraceabilityPanel.tsx` | Spec context in review |
| `src/components/review/CriterionBadge.tsx` | Reusable criterion badge |

### Modified Files

| File | Changes |
|------|---------|
| `src/types/index.ts` | Add V4 types |
| `src/components/missions/MissionDetailModal.tsx` | Add "Spec Impact" tab |
| `src/components/workspaces/ReviewSurface.tsx` | Add criterion grouping, traceability |
| `src/components/shared/SpecificationTraceability.tsx` | Enhance for V4 |

---

## 10. Success Criteria

- [ ] Every file change links to acceptance criteria (`fulfillsAcceptanceCriteria`)
- [ ] Every file change has specification rationale (`specRationale`)
- [ ] Every commit links to acceptance criteria
- [ ] Cost attributable at criterion level
- [ ] Specification Impact Dashboard displays all criteria with status, cost, files
- [ ] Review Surface shows spec context for each change
- [ ] Bidirectional navigation works (spec ↔ code)
- [ ] "View in Specification" navigates with criterion highlight
- [ ] "Revise Specification" workflow functional
- [ ] Human gates control pipeline progression
- [ ] Cost aggregation sums correctly at all levels
- [ ] Criterion dependencies visualized (blocked vs. actionable)
- [ ] Current agent assignments visible per criterion
- [ ] Orphaned changes (no linked criteria) are flagged with resolution options

---

## 11. Future Considerations (Out of Scope)

- Real-time criterion progress updates via WebSocket
- Criterion-level rollback
- Automated criterion verification via test results
- Criterion templates for common patterns
- Export specification impact report
- Integration with external issue trackers

---

## 12. Implementation Order

1. **Phase 1: Types** - Add V4 types to `src/types/index.ts`
2. **Phase 2: Mock Data** - Create `src/data/mockDataV4.ts`
3. **Phase 3: Spec Impact Dashboard** - New components in `src/components/specification/`
4. **Phase 4: Review Enhancement** - Add traceability to Review Surface
5. **Phase 5: Navigation** - Bidirectional spec ↔ code navigation
