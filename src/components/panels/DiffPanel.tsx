import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { ChevronDown, GitBranch } from 'lucide-react';
import { FileList } from '@/components/diff/FileList';
import { DiffViewer } from '@/components/diff/DiffViewer';
import { ReasoningPanel } from '@/components/diff/ReasoningPanel';
import { WorktreeStatusBadge } from '@/components/shared/WorktreeCard';
import { worktrees, fileDiffs, getAgentById, getTaskById } from '@/data/mockData';
import type { Worktree, FileChange } from '@/types';

interface DiffPanelProps {
  selectedWorktreeId: string | null;
  onSelectWorktree: (id: string | null) => void;
}

export function DiffPanel({ selectedWorktreeId, onSelectWorktree }: DiffPanelProps) {
  const selectedWorktree = worktrees.find(w => w.id === selectedWorktreeId) || worktrees[0];
  const [selectedFile, setSelectedFile] = useState<FileChange>(selectedWorktree.fileChanges[0]);
  const [isWorktreeDropdownOpen, setIsWorktreeDropdownOpen] = useState(false);

  // Update selected file when worktree changes
  useEffect(() => {
    if (selectedWorktree.fileChanges.length > 0) {
      setSelectedFile(selectedWorktree.fileChanges[0]);
    }
  }, [selectedWorktree.id]);

  const task = getTaskById(selectedWorktree.taskId);
  const fileDiff = fileDiffs[selectedFile?.filename];
  
  const totalAdditions = selectedWorktree.fileChanges.reduce((sum, f) => sum + f.additions, 0);
  const totalDeletions = selectedWorktree.fileChanges.reduce((sum, f) => sum + f.deletions, 0);

  const handleWorktreeChange = (worktree: Worktree) => {
    onSelectWorktree(worktree.id);
    setIsWorktreeDropdownOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Worktree selector header */}
      <div className="flex items-center justify-between px-4 py-3 bg-bg-1 border-b border-border-1 shrink-0">
        <div className="flex items-center gap-4">
          {/* Worktree dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsWorktreeDropdownOpen(!isWorktreeDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-bg-2 border border-border-1 rounded-md hover:bg-bg-3 transition-colors"
            >
              <GitBranch className="w-4 h-4 text-text-3" />
              <span className="font-mono text-sm font-medium">{selectedWorktree.branch}</span>
              <WorktreeStatusBadge status={selectedWorktree.status} />
              <ChevronDown className="w-4 h-4 text-text-3" />
            </button>

            {isWorktreeDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-[340px] bg-bg-1 border border-border-1 rounded-lg shadow-xl z-50">
                <div className="p-2 border-b border-border-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-text-3 px-2">
                    Select Worktree
                  </span>
                </div>
                <div className="max-h-[300px] overflow-y-auto p-1">
                  {worktrees.map((wt) => {
                    const wtTask = getTaskById(wt.taskId);
                    return (
                      <button
                        key={wt.id}
                        onClick={() => handleWorktreeChange(wt)}
                        className={clsx(
                          'w-full flex items-start gap-3 p-2.5 rounded-md text-left transition-colors',
                          selectedWorktree.id === wt.id ? 'bg-bg-3' : 'hover:bg-bg-2'
                        )}
                      >
                        <GitBranch className="w-4 h-4 text-text-3 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-mono text-xs font-medium truncate">
                              {wt.branch}
                            </span>
                            <WorktreeStatusBadge status={wt.status} />
                          </div>
                          {wtTask && (
                            <div className="text-[11px] text-text-3 truncate">
                              {wtTask.id}: {wtTask.title}
                            </div>
                          )}
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-text-3">
                            <span>{wt.fileChanges.length} files</span>
                            <span>{wt.commits.length} commits</span>
                            <span className="font-mono">${wt.cost.toFixed(2)}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Task info */}
          {task && (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-text-3">{task.id}</span>
              <span className="text-text-2 truncate max-w-[300px]">{task.title}</span>
            </div>
          )}
        </div>

        {/* Worktree stats */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-text-3">Stage:</span>
            <span className="font-medium text-accent-blue">{selectedWorktree.currentStage}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-text-3">Progress:</span>
            <div className="w-16 h-1.5 bg-bg-3 rounded overflow-hidden">
              <div
                className="h-full bg-accent-blue rounded"
                style={{ width: `${selectedWorktree.progress}%` }}
              />
            </div>
            <span className="font-mono text-text-2">{selectedWorktree.progress}%</span>
          </div>
          <div className="font-mono text-accent-green">${selectedWorktree.cost.toFixed(2)}</div>
        </div>
      </div>

      {/* Agent team bar */}
      <div className="flex items-center gap-4 px-4 py-2 bg-bg-2/50 border-b border-border-1 text-xs shrink-0">
        <span className="text-text-3">Team:</span>
        <div className="flex items-center gap-2">
          {selectedWorktree.agents.map((wa) => {
            const agent = getAgentById(wa.agentId);
            if (!agent) return null;
            return (
              <div
                key={wa.agentId}
                className={clsx(
                  'flex items-center gap-1.5 px-2 py-1 rounded-full border',
                  wa.isActive
                    ? 'bg-accent-blue/10 border-accent-blue/30'
                    : wa.role === 'completed'
                    ? 'bg-accent-green/10 border-accent-green/30'
                    : 'bg-bg-3 border-border-1'
                )}
              >
                <span className="text-sm">{agent.emoji}</span>
                <span className={clsx(
                  'text-[11px]',
                  wa.isActive ? 'text-accent-blue font-medium' : 'text-text-2'
                )}>
                  {agent.name}
                </span>
                {wa.isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                )}
                {wa.role === 'completed' && (
                  <span className="text-[10px] text-accent-green">✓</span>
                )}
                {wa.role === 'waiting' && (
                  <span className="text-[10px] text-text-3">waiting</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 grid grid-cols-[260px_1fr_340px] overflow-hidden">
        {/* File sidebar */}
        <div className="bg-bg-1 border-r border-border-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-3.5 py-3 border-b border-border-1 shrink-0">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-text-2">
              Changed Files
            </span>
            <span className="text-[11px] font-mono">
              <span className="text-accent-green">+{totalAdditions}</span>{' '}
              <span className="text-accent-red">-{totalDeletions}</span>
            </span>
          </div>
          <FileList
            files={selectedWorktree.fileChanges}
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
          />
        </div>

        {/* Diff viewer */}
        <DiffViewer file={selectedFile} diff={fileDiff} />

        {/* Reasoning panel */}
        <ReasoningPanel diff={fileDiff} />
      </div>
    </div>
  );
}
