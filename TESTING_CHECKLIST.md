# V3 Multi-Agent Era - Testing Checklist

This document provides a comprehensive testing checklist for the V3 transformation. Use this to verify all workspaces, components, and workflows are functioning correctly.

## Phase 9: Visual Pipeline Editor

### Node-Graph Canvas
- [ ] Pipeline editor modal opens full-screen
- [ ] Node palette displays 5 node types (Agent, Gate, Condition, Parallel, Join)
- [ ] Drag nodes from palette to canvas
- [ ] Nodes can be connected with edges
- [ ] Nodes can be selected and moved
- [ ] Node deletion works
- [ ] Edge deletion works
- [ ] Minimap displays and updates
- [ ] Controls (zoom in/out, fit view) work
- [ ] Pipeline name can be edited
- [ ] Save button persists pipeline (to console/state)

### Node Types
- [ ] AgentNode displays with role-based colors
- [ ] GateNode displays with amber styling
- [ ] ConditionNode has two output handles (true/false)
- [ ] ParallelNode has configurable branch count
- [ ] JoinNode has configurable wait strategy
- [ ] All nodes show proper icons and labels
- [ ] Node configuration opens on settings button click

## Phase 10: Settings Workspace

### Agent Memory Panel
- [ ] Agent list displays in left sidebar
- [ ] Selecting agent shows memory details
- [ ] Project understanding can be edited inline
- [ ] Conventions can be added/removed
- [ ] Past decisions display with mission context
- [ ] Save/cancel buttons work correctly
- [ ] Empty state shows when no agents exist

### Repository Understanding Panel
- [ ] Repository list displays in left sidebar
- [ ] Selecting repository shows understanding details
- [ ] Confidence score displays with color-coding (green >80%, yellow 60-80%, red <60%)
- [ ] Key patterns display in grid
- [ ] Learned conventions show with examples
- [ ] Architecture model displays (type, layers, components)
- [ ] Statistics grid shows correct counts
- [ ] Refresh button triggers re-analysis

### Conventions Editor
- [ ] Conventions grouped by category
- [ ] Add convention form opens
- [ ] New conventions can be created
- [ ] Existing conventions can be edited
- [ ] Conventions can be deleted
- [ ] Form validation works (description required)
- [ ] Examples display in code blocks
- [ ] Empty state shows when no conventions exist

### Team Memory Panel
- [ ] Team list displays in left sidebar with colors
- [ ] Selecting team shows memory details
- [ ] Shared conventions can be added/removed
- [ ] Shared decisions can be added/removed
- [ ] Empty state shows when no teams exist

### Tab Navigation
- [ ] All 6 tabs are visible (Agents, Repositories, Conventions, Teams, Budgets, Integrations)
- [ ] Tab switching works smoothly
- [ ] Badge counts display correctly
- [ ] Active tab is highlighted
- [ ] Placeholder panels show for Budgets and Integrations

## Phase 11: Background Tasks & Async Workflow

### Mode Switcher
- [ ] Three modes display: Interactive, Background, Scheduled
- [ ] Mode can be switched
- [ ] Active mode is highlighted in blue
- [ ] Mode descriptions display
- [ ] Disabled state works when specified

### Background Task Card
- [ ] Task displays with mission name
- [ ] Mode icon and color display correctly
- [ ] Status indicator shows correct state
- [ ] Progress bar displays for in-progress tasks (0-100%)
- [ ] Blocking question displays in red-highlighted section
- [ ] "Answer Question" button appears when blocked
- [ ] "View Mission Details" button works
- [ ] Scheduled time displays for scheduled tasks
- [ ] Completed state shows green checkmark

### Background Tasks Panel
- [ ] Panel header displays with Moon icon
- [ ] Attention count badge shows when tasks need attention
- [ ] Tasks grouped by: Needs Attention, In Progress, Scheduled, Recently Completed
- [ ] Empty state shows when no background tasks
- [ ] Task cards display correctly
- [ ] Navigation to missions works
- [ ] Answer question callback triggers

### Catch-Up Summary Modal
- [ ] Modal opens on page load (when configured)
- [ ] "Welcome Back!" header displays
- [ ] Time away calculation is correct (days/hours/minutes)
- [ ] Summary stats display (Completed, Pending, Blocked)
- [ ] Items grouped by status with color-coding
- [ ] Timestamps display correctly
- [ ] Action buttons work (Resolve, Review, View)
- [ ] Modal can be dismissed
- [ ] Navigation to missions works from modal
- [ ] "Got it, let's continue" button closes modal

### Notification Badge
- [ ] Badge displays count correctly
- [ ] Badge hides when count is 0
- [ ] "99+" displays for counts over 99
- [ ] Three types display correct colors (default=blue, urgent=red, success=green)
- [ ] Pulse animation works
- [ ] Ping animation displays for urgent notifications

## Phase 12: Polish & Final Verification

### Loading States
- [ ] LoadingSpinner component displays at 3 sizes (sm, md, lg)
- [ ] Loading text displays when provided
- [ ] Full-screen loading works with backdrop blur
- [ ] Spinner animates smoothly

### Empty States
- [ ] EmptyState component displays icon correctly
- [ ] Title and description display
- [ ] Optional action button displays
- [ ] Button callback works

### Error States
- [ ] ErrorState component displays with red alert icon
- [ ] Error title and message display
- [ ] Retry button displays when callback provided
- [ ] Retry callback triggers correctly

### Animations & Transitions
- [ ] All buttons have smooth hover transitions
- [ ] Focus styles display on keyboard navigation
- [ ] Fade-in animation classes work (`.animate-fade-in`)
- [ ] Slide-in animations work (`.animate-slide-in-left`, `.animate-slide-in-right`)
- [ ] Scale-in animation works (`.animate-scale-in`)
- [ ] Hover lift effect works on cards with `.hover-lift` class
- [ ] Scrollbars styled consistently

### Accessibility
- [ ] All buttons are keyboard navigable
- [ ] Focus outlines are visible (blue, 2px offset)
- [ ] Screen reader labels present on icon-only buttons
- [ ] Color contrast meets WCAG AA standards
- [ ] Modal can be closed with Escape key

## Cross-Workspace Integration

### Navigation
- [ ] Workspace navigation bar displays 5 workspaces
- [ ] Clicking workspace switches view correctly
- [ ] Active workspace is highlighted
- [ ] Notification badges display on workspaces
- [ ] Navigation preserves state when switching

### Data Flow
- [ ] Mock data loads correctly from mockDataV3.ts
- [ ] Agents display consistently across workspaces
- [ ] Teams display consistently across workspaces
- [ ] Repositories display consistently across workspaces
- [ ] Mission data is accessible where needed

### Performance
- [ ] Initial page load is under 3 seconds
- [ ] Workspace switching is instant
- [ ] No console errors on normal operation
- [ ] No console warnings about keys or props
- [ ] Build completes without TypeScript errors
- [ ] Bundle size warning is acceptable (<600KB)

## Visual Polish

### Spacing & Layout
- [ ] Consistent padding and margins throughout
- [ ] Proper hierarchy with font sizes
- [ ] Cards have consistent border radius (rounded-lg)
- [ ] Grid layouts are responsive
- [ ] No content overflow issues

### Color System
- [ ] Background layers use bg-0 through bg-4
- [ ] Text hierarchy uses text-1, text-2, text-3
- [ ] Borders use border-1, border-2
- [ ] Accent colors consistent (blue, green, amber, red, purple, cyan)
- [ ] Dark theme is easy on the eyes

### Typography
- [ ] IBM Plex Sans font loads correctly
- [ ] Font sizes are consistent (text-xs through text-xl)
- [ ] Line heights are comfortable (1.5 default)
- [ ] Code blocks use monospace font

## Documentation

- [ ] CLAUDE.md updated with V3 architecture
- [ ] Component file locations documented
- [ ] Data model documented
- [ ] Workspace purposes documented
- [ ] README.md is up to date (if exists)

## Final Checks

- [ ] `npm run build` succeeds without errors
- [ ] `npm run lint` passes without errors
- [ ] No unused imports in components
- [ ] No TODO comments remaining
- [ ] All Phase 9-12 components are integrated
- [ ] Mock data is comprehensive (5+ missions, agents, teams, repos)
- [ ] Git status shows all new files are tracked

---

## Testing Notes

Record any issues found during testing:

**Issue Template:**
- [ ] **Component:** [Component name]
- **Issue:** [Description of the problem]
- **Steps to Reproduce:** [How to trigger the issue]
- **Expected:** [What should happen]
- **Actual:** [What actually happens]
- **Severity:** [Low / Medium / High]

---

## Sign-Off

- [ ] All checklist items completed
- [ ] All issues resolved or documented
- [ ] Ready for production deployment

**Tested by:** _______________
**Date:** _______________
**Version:** V3.0.0
