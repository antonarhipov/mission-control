# Mission Control v2.5 Roadmap
## Port.io-Inspired Enhancements for Coding Workflows

---

## Overview

Version 2.5 adds selective features inspired by Port.io's Agentic Engineering Platform, focusing specifically on enhancements that improve multi-agent coding workflows while maintaining Mission Control's human-gated pipeline philosophy.

**Timeline**: 2-4 weeks
**Scope**: 6 new features (4 recommended, 2 optional)

---

## Feature Roadmap

### Phase A: Context & Services (Week 1-1.5)

#### Feature 1: Lightweight Context Panel ⭐⭐⭐
**Status**: Planned
**Priority**: High
**Effort**: 2-3 days

**Deliverables**:
- New `TaskContext` type definitions
- Context panel component showing:
  - Related past tasks
  - Affected services
  - Recent changes to files
  - Known issues and workarounds
  - Code patterns and team knowledge
- Integration with Pipeline and Diff views
- Mock data for 5-10 tasks with rich context

**Files to Create**:
- `/src/types/index.ts` - Add TaskContext interface
- `/src/components/shared/ContextPanel.tsx` - New component
- `/src/data/mockDataV2.ts` - Add context data

---

#### Feature 2: Service Registry ⭐⭐⭐
**Status**: Planned
**Priority**: High
**Effort**: 3-4 days

**Deliverables**:
- New `Service` type definitions
- Services panel with browser and detail view
- Service detail view showing:
  - Metadata (owner, description, tier)
  - Repository associations
  - Service dependencies (upstream/downstream)
  - Active tasks modifying the service
  - Quality metrics
- Integration with tasks (tasks link to services)
- Mock data for 8-12 services

**Files to Create**:
- `/src/types/index.ts` - Add Service interface
- `/src/components/panels/ServicesPanel.tsx` - New panel
- `/src/components/shared/ServiceDetailView.tsx` - Detail view
- `/src/components/shared/ServiceBrowser.tsx` - List view
- `/src/data/mockDataV2.ts` - Add service data
- `/src/App.tsx` - Add "Services" tab

---

### Phase B: Safety & Dependencies (Week 2-3)

#### Feature 3: Agent Permissions & Policies ⭐⭐
**Status**: Planned
**Priority**: Medium
**Effort**: 4-5 days

**Deliverables**:
- New `Policy` and `AgentPermission` types
- Guardrails section in Config panel showing:
  - Policy list with enable/disable toggles
  - Permission matrix (agents × services)
  - Blocked action log
- Integration with workflow (show policy warnings in specs)
- Mock data for 10-15 policies and permissions

**Files to Create/Modify**:
- `/src/types/index.ts` - Add Policy, AgentPermission types
- `/src/components/panels/ConfigPanel.tsx` - Add Guardrails section
- `/src/components/config/GuardrailsSection.tsx` - New component
- `/src/components/config/PolicyList.tsx` - Policy management
- `/src/components/config/PermissionMatrix.tsx` - Visual matrix
- `/src/data/mockDataV2.ts` - Add policy data

---

#### Feature 5: Enhanced Dependency Visualization ⭐⭐
**Status**: Planned
**Priority**: Medium
**Effort**: 2-3 days

**Deliverables**:
- Add service dependency mode to existing Dependencies panel
- Two graph modes:
  - Task Dependencies (existing)
  - Service Dependencies (new)
- Task-service linking visualization
- Highlight affected services when task selected
- Mock data for service dependency relationships

**Files to Modify**:
- `/src/components/panels/DependenciesPanel.tsx` - Add mode switcher
- `/src/components/shared/ServiceDependencyGraph.tsx` - New graph component (or extend existing)
- `/src/data/mockDataV2.ts` - Add service dependency data

---

### Phase C: Quality & Audit (Optional, Week 3-4)

#### Feature 4: Code Quality Scorecards ⭐
**Status**: Optional
**Priority**: Low
**Effort**: 3-4 days

**Deliverables**:
- New `QualityScorecard` type
- Scorecard display in Service and Task detail views
- Visual badges (Pass/Warn/Fail)
- Mock data for quality metrics

**Files to Create/Modify**:
- `/src/types/index.ts` - Add QualityScorecard interface
- `/src/components/shared/QualityScorecard.tsx` - Visual scorecard
- `/src/components/shared/ServiceDetailView.tsx` - Add scorecard
- `/src/components/shared/PipelineDetailView.tsx` - Add scorecard
- `/src/data/mockDataV2.ts` - Add quality data

---

#### Feature 6: Agent Action Audit Log ⭐
**Status**: Optional
**Priority**: Low
**Effort**: 2-3 days

**Deliverables**:
- New `AuditLogEntry` type
- Audit log panel with search/filter
- Integration with Config panel
- Mock data for 50-100 audit entries

**Files to Create/Modify**:
- `/src/types/index.ts` - Add AuditLogEntry interface
- `/src/components/panels/ConfigPanel.tsx` - Add Audit section
- `/src/components/config/AuditLogSection.tsx` - New component
- `/src/components/shared/AuditLogViewer.tsx` - Log viewer with filters
- `/src/data/mockDataV2.ts` - Add audit log data

---

## Timeline

| Week | Features | Deliverables |
|------|----------|--------------|
| **Week 1** | Context Panel | Types, component, integration, mock data |
| **Week 1.5** | Service Registry | Types, panels, integration, mock data |
| **Week 2** | Guardrails | Types, UI components, mock data |
| **Week 2.5** | Enhanced Dependencies | Service graph mode, integration |
| **Week 3** | Quality Scorecards (opt) | Scorecard component, integration |
| **Week 3.5** | Audit Log (opt) | Log viewer, search/filter |

---

## Success Criteria

**Phase A Complete**:
- ✅ Context panel displays relevant information in Pipeline and Diff views
- ✅ Services panel shows 8-12 services with dependencies
- ✅ Tasks link to services they modify
- ✅ Service detail view shows active tasks

**Phase B Complete**:
- ✅ Guardrails section displays policies and permissions
- ✅ Dependencies panel supports both task and service modes
- ✅ Service graph visualizes dependencies between services
- ✅ Selected task highlights affected services

**Phase C Complete** (optional):
- ✅ Quality scorecards display in service/task views
- ✅ Audit log searchable and filterable
- ✅ Full traceability of agent actions

---

## Out of Scope

The following Port.io features are explicitly **NOT** included in v2.5:

- ❌ Incident response workflows
- ❌ Infrastructure/K8s management
- ❌ Cloud resource optimization
- ❌ Real monitoring/observability integrations
- ❌ ITSM/PagerDuty/Slack integrations
- ❌ Real-time alerting
- ❌ Compliance enforcement beyond code quality
- ❌ Actual security vulnerability scanning

**Rationale**: Mission Control remains focused on multi-agent development workflows, not production operations or infrastructure management.

---

## Future Considerations (Post-v2.5)

**If stakeholders want more**:
- Integration with real Git APIs
- Integration with CI/CD pipelines
- Real security scanning (Snyk, Dependabot)
- Real code quality metrics (SonarQube, CodeClimate)
- Agent marketplace
- Custom workflow builder

**Decision point**: After v2.5 demo, evaluate whether to:
- Continue enhancing coding features (v2.6)
- Expand into operations (incidents, infrastructure)
- Partner with existing platforms (Port.io, Backstage)
