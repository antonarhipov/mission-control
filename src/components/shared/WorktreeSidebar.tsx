import { clsx } from 'clsx';
import { Plus } from 'lucide-react';
import { WorktreeCard } from '@/components/shared/WorktreeCard';
import { worktrees, tasks } from '@/data/mockData';

interface WorktreeSidebarProps {
  selectedWorktreeId: string | null;
  onSelectWorktree: (id: string | null) => void;
  showAllTasksOption?: boolean;
}

export function WorktreeSidebar({
  selectedWorktreeId,
  onSelectWorktree,
  showAllTasksOption = false,
}: WorktreeSidebarProps) {
  const activeWorktrees = worktrees.filter(w => w.status === 'active' || w.status === 'conflict');
  const completedWorktrees = worktrees.filter(w => w.status === 'completed');

  return (
    <div className="bg-bg-1 border-r border-border-1 flex flex-col">
      <div className="px-4 py-3 border-b border-border-1 flex items-center justify-between shrink-0">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-text-2">
          Worktrees
        </span>
        <button className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium bg-bg-2 border border-border-1 rounded hover:bg-bg-3 transition-colors">
          <Plus className="w-3 h-3" />
          New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {/* All tasks option (only in Overview) */}
        {showAllTasksOption && (
          <button
            onClick={() => onSelectWorktree(null)}
            className={clsx(
              'w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors text-left text-xs',
              selectedWorktreeId === null
                ? 'bg-bg-3 border border-accent-blue/50'
                : 'bg-bg-2 border border-border-1 hover:border-border-2'
            )}
          >
            <span className="text-base">📋</span>
            <span className="font-medium flex-1">All Tasks</span>
            <span className="text-[10px] text-text-3 bg-bg-3 px-1.5 py-0.5 rounded">
              {tasks.length}
            </span>
          </button>
        )}

        {/* Active worktrees */}
        {activeWorktrees.length > 0 && (
          <div className="px-2 py-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-text-3">
              Active ({activeWorktrees.length})
            </span>
          </div>
        )}
        {activeWorktrees.map((wt) => (
          <WorktreeCard
            key={wt.id}
            worktree={wt}
            isSelected={selectedWorktreeId === wt.id}
            onClick={() => onSelectWorktree(wt.id)}
            variant="full"
          />
        ))}

        {/* Completed worktrees */}
        {completedWorktrees.length > 0 && (
          <>
            <div className="px-2 py-1.5 mt-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-text-3">
                Ready to Merge ({completedWorktrees.length})
              </span>
            </div>
            {completedWorktrees.map((wt) => (
              <WorktreeCard
                key={wt.id}
                worktree={wt}
                isSelected={selectedWorktreeId === wt.id}
                onClick={() => onSelectWorktree(wt.id)}
                variant="full"
              />
            ))}
          </>
        )}
      </div>

      {/* Summary stats */}
      <div className="p-4 border-t border-border-1 bg-bg-2 shrink-0">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-semibold text-accent-green">
              {worktrees.filter((w) => w.status === 'active').length}
            </div>
            <div className="text-[10px] text-text-3">Active</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-accent-red">
              {worktrees.filter((w) => w.status === 'conflict').length}
            </div>
            <div className="text-[10px] text-text-3">Conflicts</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-accent-blue">
              {worktrees.filter((w) => w.status === 'completed').length}
            </div>
            <div className="text-[10px] text-text-3">Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
}
