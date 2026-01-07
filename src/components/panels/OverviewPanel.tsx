import { clsx } from 'clsx';
import {
  Plus,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Terminal,
  GitCommit,
  Folder,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { useDataModel } from '@/hooks/useDataModel';
import type { Task, TaskV2, Agent } from '@/types';

interface OverviewPanelProps {
  selectedWorktreeId: string | null;
  onSelectWorktree: (id: string | null) => void;
  onNavigateToPipeline?: (taskId: string) => void;
  onNavigateToDependencies?: (taskId: string) => void;
}

export function OverviewPanel({ selectedWorktreeId: _selectedWorktreeId, onSelectWorktree: _onSelectWorktree, onNavigateToPipeline, onNavigateToDependencies }: OverviewPanelProps) {
  // Note: Props kept for backward compatibility but unused in V2

  return (
    <div className="grid grid-cols-[1fr_320px] h-full">
      {/* Main content - Task board (full width in V2, no sidebar) */}
      <MainContent onNavigateToPipeline={onNavigateToPipeline} onNavigateToDependencies={onNavigateToDependencies} />

      {/* Right sidebar - Pending approvals only */}
      <ApprovalsPanel />
    </div>
  );
}

function MainContent({ onNavigateToPipeline, onNavigateToDependencies }: {
  onNavigateToPipeline?: (taskId: string) => void;
  onNavigateToDependencies?: (taskId: string) => void;
}) {
  const { tasks, isV2, repositories } = useDataModel();

  return (
    <div className="flex flex-col overflow-hidden bg-bg-0">
      <div className="px-5 py-3 border-b border-border-1 bg-bg-1 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold">All Tasks</h2>
              <span className="text-xs text-text-3">
                {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                {isV2 && repositories && repositories.length > 0 && ` across ${repositories.length} ${repositories.length === 1 ? 'repository' : 'repositories'}`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium bg-bg-2 border border-border-1 rounded hover:bg-bg-3 transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Add Task
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-5">
        <div className="grid grid-cols-5 gap-4 min-w-[1000px]">
          <TaskColumn
            title="Backlog"
            icon="📋"
            tasks={tasks.filter((t) => t.status === 'backlog')}
            onNavigateToPipeline={onNavigateToPipeline}
            onNavigateToDependencies={onNavigateToDependencies}
          />
          <TaskColumn
            title="Planning"
            icon="📝"
            tasks={tasks.filter((t) => t.status === 'planning')}
            highlight
            onNavigateToPipeline={onNavigateToPipeline}
            onNavigateToDependencies={onNavigateToDependencies}
          />
          <TaskColumn
            title="In Progress"
            icon="🔄"
            tasks={tasks.filter((t) => t.status === 'in-progress')}
            highlight
            onNavigateToPipeline={onNavigateToPipeline}
            onNavigateToDependencies={onNavigateToDependencies}
          />
          <TaskColumn
            title="Review"
            icon="👁️"
            tasks={tasks.filter((t) => t.status === 'review')}
            onNavigateToPipeline={onNavigateToDependencies}
            onNavigateToDependencies={onNavigateToDependencies}
          />
          <TaskColumn
            title="Done"
            icon="✅"
            tasks={tasks.filter((t) => t.status === 'done')}
            onNavigateToPipeline={onNavigateToPipeline}
            onNavigateToDependencies={onNavigateToDependencies}
          />
        </div>
      </div>
    </div>
  );
}

function TaskColumn({
  title,
  icon,
  tasks,
  highlight,
  onNavigateToPipeline,
  onNavigateToDependencies,
}: {
  title: string;
  icon: string;
  tasks: (Task | TaskV2)[];
  highlight?: boolean;
  onNavigateToPipeline?: (taskId: string) => void;
  onNavigateToDependencies?: (taskId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-3 py-2 bg-bg-2 rounded-md border border-border-1">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span>{icon}</span>
          <span>{title}</span>
        </div>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-bg-3 text-text-2">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-2 min-h-[100px]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            highlight={highlight}
            onNavigateToPipeline={onNavigateToPipeline}
            onNavigateToDependencies={onNavigateToDependencies}
          />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, highlight, onNavigateToPipeline, onNavigateToDependencies }: {
  task: Task | TaskV2;
  highlight?: boolean;
  onNavigateToPipeline?: (taskId: string) => void;
  onNavigateToDependencies?: (taskId: string) => void;
}) {
  const { getAgentById, worktrees } = useDataModel();

  // Type guard to check if task is TaskV2
  const isTaskV2 = (t: Task | TaskV2): t is TaskV2 => {
    return 'worktrees' in t && Array.isArray(t.worktrees);
  };

  const taskV2 = isTaskV2(task) ? task : null;
  const taskV1 = !isTaskV2(task) ? task : null;

  // V1: Get worktree and agents
  const worktree = taskV1?.worktreeId ? worktrees?.find(w => w.id === taskV1.worktreeId) : null;
  const worktreeAgents = worktree?.agents || [];

  // V2: Get agents directly from task
  const taskAgents = taskV2?.agents || [];

  return (
    <div
      className={clsx(
        'bg-bg-1 border rounded-lg p-3 cursor-pointer transition-all hover:border-border-2 hover:-translate-y-0.5 hover:shadow-lg',
        highlight && task.progress && task.progress > 50
          ? 'border-accent-blue shadow-[0_0_15px_rgba(88,166,255,0.15)]'
          : 'border-border-1'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="font-mono text-[10px] text-text-3">{task.id}</span>
        <div
          className={clsx(
            'w-2 h-2 rounded-sm',
            (task.priority === 'high' || task.priority === 'critical') && 'bg-accent-red',
            task.priority === 'medium' && 'bg-accent-amber',
            task.priority === 'low' && 'bg-accent-green'
          )}
        />
      </div>

      <h3 className="text-xs font-medium leading-relaxed mb-2.5">{task.title}</h3>

      {/* Specification indicator */}
      {taskV2?.specification && (
        <div className="flex items-center gap-1.5 mb-2 text-[10px]">
          {taskV2.specification.status === 'pending_approval' ? (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-accent-amber/10 border border-accent-amber/30 rounded animate-pulse">
              <AlertCircle className="w-3 h-3 text-accent-amber" />
              <span className="text-accent-amber font-medium">Needs Approval</span>
            </div>
          ) : taskV2.specification.status === 'approved' ? (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-accent-green/10 border border-accent-green/30 rounded">
              <CheckCircle2 className="w-3 h-3 text-accent-green" />
              <span className="text-accent-green font-medium">Spec</span>
            </div>
          ) : taskV2.specification.status === 'draft' ? (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-text-3/10 border border-text-3/30 rounded">
              <span className="text-text-3 font-medium">Drafting...</span>
            </div>
          ) : null}
          {taskV2.specification.status === 'approved' && taskV2.specification.acceptanceCriteria.length > 0 && (
            <span className="text-text-3">
              {taskV2.specification.acceptanceCriteria.filter(ac => ac.completed).length}/{taskV2.specification.acceptanceCriteria.length} criteria
            </span>
          )}
        </div>
      )}

      {/* Review Specification CTA (for pending approval) */}
      {taskV2?.specification?.status === 'pending_approval' && onNavigateToPipeline && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigateToPipeline(task.id);
          }}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 mb-2 text-[11px] font-semibold bg-accent-amber text-white rounded hover:brightness-110 transition-all"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Review & Approve Specification
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}

      <div className="flex flex-wrap gap-1 mb-3">
        {task.tags.map((tag) => (
          <span
            key={tag}
            className={clsx(
              'text-[10px] font-medium px-1.5 py-0.5 rounded',
              tag === 'feature' && 'bg-accent-purple/20 text-accent-purple',
              tag === 'bug' && 'bg-accent-red/20 text-accent-red',
              tag === 'refactor' && 'bg-accent-cyan/20 text-accent-cyan',
              tag === 'docs' && 'bg-accent-blue/20 text-accent-blue',
              tag === 'build' && 'bg-text-3/20 text-text-2',
              tag === 'backend' && 'bg-accent-green/20 text-accent-green',
              tag === 'api' && 'bg-accent-amber/20 text-accent-amber',
              tag === 'database' && 'bg-accent-purple/20 text-accent-purple',
              tag === 'migration' && 'bg-accent-cyan/20 text-accent-cyan',
              tag === 'testing' && 'bg-accent-green/20 text-accent-green',
              tag === 'review' && 'bg-accent-amber/20 text-accent-amber'
            )}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* V2: Current stage and metadata */}
      {taskV2 && (
        <div className="space-y-2 mb-2">
          {/* Current pipeline stage */}
          <div className="flex items-center gap-2 text-[10px] px-2 py-1.5 bg-bg-2 rounded">
            <span className="text-text-3">Stage:</span>
            <span className="font-medium text-text-1 flex-1 truncate">
              {taskV2.currentStage}
            </span>
          </div>

          {/* Repositories and cost */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[10px] px-2 py-1 bg-bg-2 rounded flex-1">
              <Folder className="w-3 h-3 text-text-3" />
              <span className="text-text-2">
                {taskV2.worktrees.length} {taskV2.worktrees.length === 1 ? 'repo' : 'repos'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] px-2 py-1 bg-bg-2 rounded">
              <DollarSign className="w-3 h-3 text-accent-green" />
              <span className="text-text-2 font-medium">
                {taskV2.totalCost.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Agents */}
          {taskAgents.length > 0 && (
            <div className="flex items-center gap-2 px-2 py-1.5 bg-bg-2 rounded">
              <div className="flex -space-x-1 flex-1">
                {taskAgents.slice(0, 3).map((ta) => {
                  const agent = getAgentById(ta.agentId);
                  if (!agent) return null;
                  return (
                    <span
                      key={ta.agentId}
                      className={clsx(
                        'w-4 h-4 rounded flex items-center justify-center text-[8px]',
                        ta.isActive && 'ring-1 ring-accent-green'
                      )}
                      style={{ backgroundColor: agent.color + '60' }}
                    >
                      {agent.emoji}
                    </span>
                  );
                })}
              </div>
              {onNavigateToPipeline && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToPipeline(task.id);
                  }}
                  className="flex items-center gap-0.5 text-[10px] text-accent-blue hover:text-accent-blue/80 font-medium"
                >
                  View Pipeline
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* View Dependencies button */}
          {onNavigateToDependencies && (task.dependsOn?.length || task.blocks?.length) && (
            <div className="flex items-center justify-end px-2 py-1.5 bg-bg-2 rounded">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToDependencies(task.id);
                }}
                className="flex items-center gap-0.5 text-[10px] text-accent-purple hover:text-accent-purple/80 font-medium"
              >
                View Dependencies
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* V1: Worktree info */}
      {worktree && (
        <div className="flex items-center gap-2 mb-2 text-[10px] px-2 py-1.5 bg-bg-2 rounded">
          <GitBranch className="w-3 h-3 text-text-3" />
          <span className="font-mono text-text-2 truncate flex-1">
            {worktree.branch.split('/').pop()}
          </span>
          <div className="flex -space-x-1">
            {worktreeAgents.slice(0, 3).map((wa) => {
              const agent = getAgentById(wa.agentId);
              if (!agent) return null;
              return (
                <span
                  key={wa.agentId}
                  className={clsx(
                    'w-4 h-4 rounded flex items-center justify-center text-[8px]',
                    wa.isActive && 'ring-1 ring-accent-green'
                  )}
                  style={{ backgroundColor: agent.color + '60' }}
                >
                  {agent.emoji}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Progress bar and status */}
      <div className="flex items-center justify-between">
        {task.progress !== undefined && (
          <div className="flex items-center gap-2 text-[11px] text-text-3">
            <div className="w-12 h-1 bg-bg-3 rounded overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-blue to-accent-cyan rounded"
                style={{ width: `${task.progress}%` }}
              />
            </div>
            <span>{task.progress}%</span>
          </div>
        )}

        {task.status === 'done' && (
          <span className="text-[11px] text-accent-green flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Merged
          </span>
        )}

        {task.status === 'review' && taskV2 && (
          <span className="text-[11px] text-text-3">
            In {taskV2.currentStage}
          </span>
        )}

        {task.status === 'review' && worktree && !taskV2 && (
          <span className="text-[11px] text-text-3">
            {worktree.currentStage}
          </span>
        )}

        {task.status === 'blocked' && (
          <span className="text-[11px] text-accent-red flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Blocked
          </span>
        )}
      </div>
    </div>
  );
}

function ApprovalsPanel() {
  const { getAgentById } = useDataModel();

  const approvals = [
    {
      id: '1',
      worktreeId: 'wt-order-service',
      worktreeBranch: 'feature/order-service',
      agentId: 'arch-1',
      type: 'decision' as const,
      title: 'Fetch type for Customer relation',
      description: 'Order entity uses @ManyToOne for Customer. Use LAZY or EAGER fetch type?',
      options: ['Use LAZY', 'Use EAGER'],
      context: 'LAZY avoids N+1 but requires open session; EAGER loads always.',
    },
    {
      id: '2',
      worktreeId: 'wt-db-migration',
      worktreeBranch: 'feature/db-migration-v2',
      agentId: 'impl-1',
      type: 'command' as const,
      title: 'Run database migration',
      description: 'Execute ./gradlew flywayMigrate to apply V2 and V3 migrations?',
      options: ['Run', 'Skip'],
      context: 'This will modify the database schema.',
    },
    {
      id: '3',
      worktreeId: 'wt-order-service',
      worktreeBranch: 'feature/order-service',
      agentId: 'impl-1',
      type: 'review' as const,
      title: 'Review constructor injection pattern',
      description: 'Replaced field injection with constructor injection in OrderService. Approve this pattern for remaining services?',
      options: ['Approve', 'Discuss'],
    },
  ];

  return (
    <div className="bg-bg-1 border-l border-border-1 flex flex-col">
      <div className="px-4 py-3 border-b border-border-1 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-text-2">
            Pending Approvals
          </span>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-accent-amber text-black">
            {approvals.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {approvals.map((approval) => {
          const agent = getAgentById(approval.agentId);
          return (
            <ApprovalCard
              key={approval.id}
              approval={approval}
              agent={agent}
            />
          );
        })}
      </div>

      <div className="p-3 border-t border-border-1 shrink-0">
        <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-medium bg-bg-2 border border-border-1 rounded hover:bg-bg-3 transition-colors">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Approve All Safe
        </button>
      </div>
    </div>
  );
}

function ApprovalCard({
  approval,
  agent,
}: {
  approval: {
    id: string;
    worktreeId: string;
    worktreeBranch: string;
    agentId: string;
    type: 'decision' | 'command' | 'review';
    title: string;
    description: string;
    options: string[];
    context?: string;
  };
  agent: Agent | undefined;
}) {
  const typeConfig = {
    decision: { icon: MessageSquare, label: 'Decision', color: 'text-accent-amber bg-accent-amber/20' },
    command: { icon: Terminal, label: 'Command', color: 'text-accent-purple bg-accent-purple/20' },
    review: { icon: GitCommit, label: 'Review', color: 'text-accent-blue bg-accent-blue/20' },
  };

  const config = typeConfig[approval.type];
  const Icon = config.icon;

  return (
    <div className="bg-bg-2 rounded-lg p-3 border border-border-1">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {agent && (
            <span
              className="w-6 h-6 rounded flex items-center justify-center text-xs"
              style={{ backgroundColor: agent.color + '40' }}
            >
              {agent.emoji}
            </span>
          )}
          <span className="text-[11px] text-text-2">{agent?.name}</span>
        </div>
        <span className={clsx('text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1', config.color)}>
          <Icon className="w-3 h-3" />
          {config.label}
        </span>
      </div>

      <div className="flex items-center gap-1.5 mb-2 text-[10px] text-text-3">
        <GitBranch className="w-3 h-3" />
        <span className="font-mono truncate">{approval.worktreeBranch}</span>
      </div>

      <h4 className="text-xs font-medium mb-1">{approval.title}</h4>
      <p className="text-[11px] text-text-2 mb-2 leading-relaxed">{approval.description}</p>
      
      {approval.context && (
        <p className="text-[10px] text-text-3 mb-3 italic">{approval.context}</p>
      )}

      <div className="flex gap-2">
        {approval.options.map((option, index) => (
          <button
            key={option}
            className={clsx(
              'flex-1 px-2 py-1.5 text-[10px] font-medium rounded transition-colors',
              index === 0
                ? 'bg-accent-green text-white hover:brightness-110'
                : 'bg-bg-3 text-text-2 hover:bg-bg-4'
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
