import { clsx } from 'clsx';
import {
  GitBranch,
  GitCommit,
  FileCode,
  AlertCircle,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { getAgentById, getTaskById, getTeamById } from '@/data/mockData';
import type { Worktree, WorktreeStatus } from '@/types';

interface WorktreeCardProps {
  worktree: Worktree;
  isSelected: boolean;
  onClick: () => void;
  variant?: 'compact' | 'full';
}

export function WorktreeCard({ worktree, isSelected, onClick, variant = 'compact' }: WorktreeCardProps) {
  const task = getTaskById(worktree.taskId);
  const team = getTeamById(worktree.teamId);
  const activeAgents = worktree.agents.filter(a => a.isActive);
  const totalAgents = worktree.agents.length;

  if (variant === 'full') {
    return (
      <button
        onClick={onClick}
        className={clsx(
          'w-full text-left p-3 rounded-lg border transition-all',
          isSelected
            ? 'bg-bg-3 border-accent-blue shadow-[0_0_0_1px_rgba(88,166,255,0.5)]'
            : 'bg-bg-2 border-border-1 hover:border-border-2',
          worktree.status === 'conflict' && !isSelected && 'border-accent-red/50'
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <GitBranch className="w-3.5 h-3.5 text-text-3" />
            <span className="font-mono text-xs font-medium">{worktree.branch}</span>
          </div>
          <WorktreeStatusBadge status={worktree.status} />
        </div>

        {/* Task */}
        {task && (
          <div className="text-[11px] text-text-2 mb-2 line-clamp-1">
            <span className="text-text-3 font-mono">{task.id}:</span> {task.title}
          </div>
        )}

        {/* Team badge */}
        {team && (
          <div className="flex items-center gap-1.5 mb-2">
            <div
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px]"
              style={{ backgroundColor: team.color + '20', color: team.color }}
            >
              <Users className="w-3 h-3" />
              <span className="font-medium">{team.name}</span>
            </div>
          </div>
        )}

        {/* Agent team */}
        <div className="flex items-center gap-1.5 mb-2">
          {worktree.agents.slice(0, 4).map((wa) => {
            const agent = getAgentById(wa.agentId);
            if (!agent) return null;
            return (
              <span
                key={wa.agentId}
                className={clsx(
                  'w-6 h-6 rounded flex items-center justify-center text-xs',
                  wa.isActive
                    ? 'ring-2 ring-accent-green ring-offset-1 ring-offset-bg-2'
                    : wa.role === 'completed'
                    ? 'opacity-60'
                    : 'opacity-40'
                )}
                style={{ backgroundColor: agent.color + '40' }}
                title={`${agent.name} (${wa.role})`}
              >
                {agent.emoji}
              </span>
            );
          })}
          {totalAgents > 4 && (
            <span className="text-[10px] text-text-3">+{totalAgents - 4}</span>
          )}
          <span className="text-[10px] text-text-3 ml-1">
            {activeAgents.length}/{totalAgents} active
          </span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-1.5 bg-bg-3 rounded overflow-hidden">
            <div
              className={clsx(
                'h-full rounded transition-all',
                worktree.status === 'conflict' ? 'bg-accent-red' : 'bg-accent-blue'
              )}
              style={{ width: `${worktree.progress}%` }}
            />
          </div>
          <span
            className={clsx(
              'text-[11px] font-mono',
              worktree.status === 'conflict' ? 'text-accent-red' : 'text-text-2'
            )}
          >
            {worktree.progress}%
          </span>
        </div>

        {/* Stats */}
        <div className="flex gap-3 text-[10px] text-text-3">
          <span className="flex items-center gap-1">
            <GitCommit className="w-3 h-3" />
            {worktree.commits.length}
          </span>
          <span className="flex items-center gap-1">
            <FileCode className="w-3 h-3" />
            {worktree.fileChanges.length}
          </span>
          <span className="flex items-center gap-1 font-mono">
            ${worktree.cost.toFixed(2)}
          </span>
          {worktree.conflicts && (
            <span className="flex items-center gap-1 text-accent-red">
              <AlertCircle className="w-3 h-3" />
              {worktree.conflicts.length}
            </span>
          )}
        </div>
      </button>
    );
  }

  // Compact variant (for sidebar)
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex flex-col gap-2 px-4 py-3 transition-colors text-left',
        isSelected ? 'bg-bg-3 border-l-2 border-accent-blue pl-[14px]' : 'hover:bg-bg-2',
        worktree.status === 'conflict' && !isSelected && 'bg-accent-red/5'
      )}
    >
      {/* Branch name */}
      <div className="flex items-center gap-2">
        <GitBranch className="w-3.5 h-3.5 text-text-3 shrink-0" />
        <span className="font-mono text-xs font-medium truncate">{worktree.branch}</span>
        {worktree.status === 'conflict' && (
          <AlertCircle className="w-3.5 h-3.5 text-accent-red shrink-0" />
        )}
        {worktree.status === 'completed' && (
          <CheckCircle2 className="w-3.5 h-3.5 text-accent-green shrink-0" />
        )}
      </div>

      {/* Task title */}
      {task && (
        <div className="text-[11px] text-text-2 line-clamp-1 pl-5">
          <span className="text-text-3 font-mono">{task.id}</span> {task.title}
        </div>
      )}

      {/* Team & Agent info */}
      <div className="flex items-center justify-between pl-5">
        <div className="flex items-center gap-2">
          {/* Team badge */}
          {team && (
            <span
              className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: team.color + '20', color: team.color }}
            >
              {team.name}
            </span>
          )}
          {/* Active agents */}
          <div className="flex -space-x-1">
            {worktree.agents.slice(0, 3).map((wa) => {
              const agent = getAgentById(wa.agentId);
              if (!agent) return null;
              return (
                <span
                  key={wa.agentId}
                  className={clsx(
                    'w-5 h-5 rounded flex items-center justify-center text-[10px] border border-bg-1',
                    wa.isActive && 'ring-1 ring-accent-green ring-offset-1 ring-offset-bg-1'
                  )}
                  style={{ backgroundColor: agent.color + '60' }}
                  title={`${agent.name} (${wa.role})`}
                >
                  {agent.emoji}
                </span>
              );
            })}
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-1.5">
          <div className="w-10 h-1 bg-bg-3 rounded overflow-hidden">
            <div
              className={clsx(
                'h-full rounded',
                worktree.status === 'conflict' ? 'bg-accent-red' : 'bg-accent-blue'
              )}
              style={{ width: `${worktree.progress}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-text-3">{worktree.progress}%</span>
        </div>
      </div>
    </button>
  );
}

export function WorktreeStatusBadge({ status }: { status: WorktreeStatus }) {
  const config: Record<WorktreeStatus, { label: string; className: string }> = {
    active: { label: 'Active', className: 'bg-accent-green/20 text-accent-green' },
    paused: { label: 'Paused', className: 'bg-text-3/20 text-text-2' },
    conflict: { label: 'Conflict', className: 'bg-accent-red/20 text-accent-red' },
    completed: { label: 'Complete', className: 'bg-accent-blue/20 text-accent-blue' },
    merging: { label: 'Merging', className: 'bg-accent-amber/20 text-accent-amber' },
  };

  const { label, className } = config[status];

  return (
    <span className={clsx('text-[10px] font-medium px-1.5 py-0.5 rounded', className)}>
      {label}
    </span>
  );
}
