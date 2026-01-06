# Mission Control Documentation

This folder contains the specification and design documentation for the Mission Control UI project.

## Documents

### [SPECIFICATION.md](./SPECIFICATION.md)
The main specification document covering:
- Vision and philosophy (Navigator Pattern)
- Architecture overview
- Data model hierarchy
- Functional requirements for all panels
- Shared components
- UI/UX design tokens
- Technical implementation details
- Glossary

### [ROADMAP.md](./ROADMAP.md)
Roadmap and design decisions covering:
- Current state assessment
- Planned development phases (v0.2 - v0.6)
- Design decision log with rationale
- Open questions for future implementation
- Technical debt tracking
- Success metrics

## Quick Reference

### Core Concept
**Worktree-Centric Development**: Git worktrees are the central organizing unit, not files or tasks. Each worktree contains:
- A feature branch
- A linked task
- A team assignment
- A pipeline of stages
- Agent assignments with contributions
- File changes and commits
- Cost tracking

### Tab Structure
1. **Overview** - Dashboard with kanban + pending approvals
2. **Worktrees** - Detailed worktree management
3. **Diff Viewer** - Code changes with reasoning
4. **Cost Analytics** - Budget and cost tracking
5. **Config** - Agent/team configuration
6. **Dependencies** - Task dependency graph

### Key Design Decisions
- DD-001: Worktree as central entity
- DD-002: Team-based agent organization  
- DD-003: Pipeline stages for workflow
- DD-004: Reasoning embedded in diff view
- DD-005: Shared worktree selection across tabs
- DD-006: Single-repo first, multi-repo ready
- DD-007: Cost transparency at all levels
- DD-008: Dedicated approval queue

## Contributing
When making changes to the UI:
1. Update the relevant section in SPECIFICATION.md
2. Document design decisions in ROADMAP.md
3. Track any new technical debt
