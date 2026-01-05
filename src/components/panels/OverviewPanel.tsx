import { clsx } from 'clsx';
import {
  Plus,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Terminal,
  GitCommit,
} from 'lucide-react';
import { WorktreeSidebar } from '@/components/shared/WorktreeSidebar';
import { tasks, worktrees, getAgentById } from '@/data/mockData';
import type { Task, Worktree } from '@/types';

interface OverviewPanelProps {
  selectedWorktreeId: string | null;
  onSelectWorktree: (id: string | null) => void;
}

export function OverviewPanel({ selectedWorktreeId, onSelectWorktree }: OverviewPanelProps) {
  const selectedWorktree = worktrees.find(w => w.id === selectedWorktreeId);

  return (
    <div className="grid grid-cols-[340px_1fr_320px] h-full">
      {/* Left sidebar - Worktrees (shared component) */}
      <WorktreeSidebar
        selectedWorktreeId={selectedWorktreeId}
        onSelectWorktree={onSelectWorktree}
        showAllTasksOption={true}
      />

      {/* Main content - Task board filtered by worktree */}
      <MainContent selectedWorktree={selectedWorktree} />

      {/* Right sidebar - Pending approvals only */}
      <ApprovalsPanel />
    </div>
  );
}

function MainContent({ selectedWorktree }: { selectedWorktree: Worktree | undefined }) {
  const getFilteredTasks = () => {
    if (!selectedWorktree) {
      return tasks;
    }

    const worktreeTask = tasks.find(t => t.id === selectedWorktree.taskId);
    if (!worktreeTask) return [];

    const relatedIds = new Set<string>([worktreeTask.id]);
    worktreeTask.dependsOn?.forEach(id => relatedIds.add(id));
    worktreeTask.blocks?.forEach(id => relatedIds.add(id));

    return tasks.filter(t => relatedIds.has(t.id));
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="flex flex-col overflow-hidden bg-bg-0">
      <div className="px-5 py-3 border-b border-border-1 bg-bg-1 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            {selectedWorktree ? (
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold">{selectedWorktree.branch}</h2>
                <span className="text-xs text-text-3">
                  Task and related dependencies
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold">All Tasks</h2>
                <span className="text-xs text-text-3">
                  {tasks.length} tasks across {worktrees.length} worktrees
                </span>
              </div>
            )}
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
        <div className="grid grid-cols-4 gap-4 min-w-[800px]">
          <TaskColumn
            title="Backlog"
            icon="📋"
            tasks={filteredTasks.filter((t) => t.status === 'backlog')}
            emptyMessage={selectedWorktree ? "No backlog tasks" : undefined}
          />
          <TaskColumn
            title="In Progress"
            icon="🔄"
            tasks={filteredTasks.filter((t) => t.status === 'in-progress')}
            highlight
            emptyMessage={selectedWorktree ? "No active tasks" : undefined}
          />
          <TaskColumn
            title="Review"
            icon="👁️"
            tasks={filteredTasks.filter((t) => t.status === 'review')}
            emptyMessage={selectedWorktree ? "Nothing in review" : undefined}
          />
          <TaskColumn
            title="Done"
            icon="✅"
            tasks={filteredTasks.filter((t) => t.status === 'done')}
            emptyMessage={selectedWorktree ? "Nothing completed yet" : undefined}
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
  emptyMessage,
}: {
  title: string;
  icon: string;
  tasks: Task[];
  highlight?: boolean;
  emptyMessage?: string;
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
        {tasks.length === 0 && emptyMessage && (
          <div className="text-[11px] text-text-3 text-center py-4">
            {emptyMessage}
          </div>
        )}
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} highlight={highlight} />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, highlight }: { task: Task; highlight?: boolean }) {
  const worktree = task.worktreeId ? worktrees.find(w => w.id === task.worktreeId) : null;
  const worktreeAgents = worktree?.agents || [];

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
            task.priority === 'high' && 'bg-accent-red',
            task.priority === 'medium' && 'bg-accent-amber',
            task.priority === 'low' && 'bg-accent-green'
          )}
        />
      </div>

      <h3 className="text-xs font-medium leading-relaxed mb-2.5">{task.title}</h3>

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

        {task.status === 'review' && worktree && (
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
  agent: ReturnType<typeof getAgentById>;
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
