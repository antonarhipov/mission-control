import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { ChevronDown, GitBranch, GitCommit, Layers } from 'lucide-react';
import { FileList } from '@/components/diff/FileList';
import { DiffViewer } from '@/components/diff/DiffViewer';
import { ReasoningPanel } from '@/components/diff/ReasoningPanel';
import { SpecificationTraceability } from '@/components/shared/SpecificationTraceability';
import { WorktreeStatusBadge } from '@/components/shared/WorktreeCard';
import { useDataModel } from '@/hooks/useDataModel';
import { worktrees, getAgentById, getTaskById } from '@/data/mockData';
import { fileDiffs } from '@/data/mockDataV2';
import type { Worktree, FileChange, TaskV2, TaskFileChange } from '@/types';

interface DiffPanelProps {
  selectedWorktreeId: string | null;
  onSelectWorktree: (id: string | null) => void;
  // V2 props (optional for backward compatibility)
  selectedTaskId?: string | null;
  selectedCommitSha?: string | null;
  onNavigateToPipeline?: (taskId: string, criterionId?: string) => void;
}

export function DiffPanel({
  selectedWorktreeId,
  onSelectWorktree,
  selectedTaskId,
  selectedCommitSha,
  onNavigateToPipeline
}: DiffPanelProps) {
  const { isV2, tasks } = useDataModel();

  // V2 state
  const [scopeMode, setScopeMode] = useState<'all' | 'commit'>(selectedCommitSha ? 'commit' : 'all');
  const [selectedCommit, setSelectedCommit] = useState<string | null>(selectedCommitSha || null);
  const [isCommitDropdownOpen, setIsCommitDropdownOpen] = useState(false);

  // V1 state
  const selectedWorktree = worktrees.find(w => w.id === selectedWorktreeId) || worktrees[0];
  const [isWorktreeDropdownOpen, setIsWorktreeDropdownOpen] = useState(false);

  // Common state
  const [selectedFile, setSelectedFile] = useState<FileChange | null>(null);

  // Type guard for TaskV2
  const isTaskV2 = (task: any): task is TaskV2 => {
    return task && 'worktrees' in task && Array.isArray(task.worktrees);
  };

  // Get current task for V2
  const currentTask = isV2 && selectedTaskId
    ? tasks.find(t => t.id === selectedTaskId)
    : null;
  const taskV2 = currentTask && isTaskV2(currentTask) ? currentTask : null;

  // Get files based on mode
  const availableFiles = isV2 && taskV2
    ? (scopeMode === 'commit' && selectedCommit
        ? taskV2.fileChanges.filter(f => f.commitShas.includes(selectedCommit))
        : taskV2.fileChanges)
    : selectedWorktree.fileChanges;

  // Update selected file when context changes
  useEffect(() => {
    if (availableFiles.length > 0 && !selectedFile) {
      setSelectedFile(availableFiles[0] as any);
    }
  }, [isV2, taskV2?.id, scopeMode, selectedCommit, selectedWorktree.id]);

  // Update scope mode when selectedCommitSha changes from parent
  useEffect(() => {
    if (selectedCommitSha) {
      setScopeMode('commit');
      setSelectedCommit(selectedCommitSha);
    }
  }, [selectedCommitSha]);

  const fileDiff = fileDiffs[selectedFile?.filename || ''];
  const totalAdditions = availableFiles.reduce((sum, f) => sum + f.additions, 0);
  const totalDeletions = availableFiles.reduce((sum, f) => sum + f.deletions, 0);

  const handleWorktreeChange = (worktree: Worktree) => {
    onSelectWorktree(worktree.id);
    setIsWorktreeDropdownOpen(false);
  };

  const handleCommitChange = (commitSha: string) => {
    setSelectedCommit(commitSha);
    setIsCommitDropdownOpen(false);
    setSelectedFile(null); // Reset file selection
  };

  const handleScopeModeChange = (mode: 'all' | 'commit') => {
    setScopeMode(mode);
    if (mode === 'all') {
      setSelectedCommit(null);
    }
    setSelectedFile(null); // Reset file selection
  };

  const task = getTaskById(selectedWorktree.taskId);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-bg-1 border-b border-border-1 shrink-0">
        <div className="flex items-center gap-4">
          {/* V2: Task selector + Scope selector */}
          {isV2 && taskV2 ? (
            <>
              {/* Task info */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-text-3">{taskV2.id}</span>
                <span className="text-text-2">{taskV2.title}</span>
              </div>

              {/* Scope mode toggle */}
              <div className="flex items-center gap-1 px-1 py-1 bg-bg-2 border border-border-1 rounded-md">
                <button
                  onClick={() => handleScopeModeChange('all')}
                  className={clsx(
                    'flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded transition-all',
                    scopeMode === 'all'
                      ? 'bg-bg-1 text-text-1 shadow-sm'
                      : 'text-text-3 hover:text-text-2'
                  )}
                >
                  <Layers className="w-3.5 h-3.5" />
                  All Changes
                </button>
                <button
                  onClick={() => handleScopeModeChange('commit')}
                  className={clsx(
                    'flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded transition-all',
                    scopeMode === 'commit'
                      ? 'bg-bg-1 text-text-1 shadow-sm'
                      : 'text-text-3 hover:text-text-2'
                  )}
                >
                  <GitCommit className="w-3.5 h-3.5" />
                  By Commit
                </button>
              </div>

              {/* Commit selector (shown when in commit mode) */}
              {scopeMode === 'commit' && (
                <div className="relative">
                  <button
                    onClick={() => setIsCommitDropdownOpen(!isCommitDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-bg-2 border border-border-1 rounded-md hover:bg-bg-3 transition-colors text-xs"
                  >
                    <GitCommit className="w-3.5 h-3.5 text-text-3" />
                    <span className="font-mono">
                      {selectedCommit ? selectedCommit.slice(0, 7) : 'Select commit'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-text-3" />
                  </button>

                  {isCommitDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-[400px] bg-bg-1 border border-border-1 rounded-lg shadow-xl z-50 max-h-[400px] overflow-y-auto">
                      <div className="p-2 border-b border-border-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-text-3 px-2">
                          Select Commit ({taskV2.commits.length})
                        </span>
                      </div>
                      <div className="p-1">
                        {taskV2.commits.map((commit) => (
                          <button
                            key={commit.sha}
                            onClick={() => handleCommitChange(commit.sha)}
                            className={clsx(
                              'w-full flex items-start gap-2 p-2 rounded-md text-left transition-colors',
                              selectedCommit === commit.sha ? 'bg-bg-3' : 'hover:bg-bg-2'
                            )}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-[10px] text-text-3">
                                  {commit.sha.slice(0, 7)}
                                </span>
                                {commit.agentId && (
                                  <span className="text-[10px] text-text-3">
                                    {getAgentById(commit.agentId)?.name}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-text-1 truncate mb-1">{commit.message}</p>
                              <div className="flex items-center gap-3 text-[10px] text-text-3">
                                <span>{commit.filesChanged} files</span>
                                <span className="text-accent-green">+{commit.additions}</span>
                                <span className="text-accent-red">-{commit.deletions}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* V1: Worktree dropdown */
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
          )}

          {/* V1: Task info */}
          {!isV2 && task && (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-mono text-text-3">{task.id}</span>
              <span className="text-text-2 truncate max-w-[300px]">{task.title}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs">
          {isV2 && taskV2 ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-text-3">Scope:</span>
                <span className="font-medium text-accent-blue">
                  {scopeMode === 'all' ? 'All Changes' : `Commit ${selectedCommit?.slice(0, 7)}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-text-3">Files:</span>
                <span className="font-mono text-text-2">{availableFiles.length}</span>
              </div>
              <div className="font-mono text-accent-green">${taskV2.totalCost.toFixed(2)}</div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Agent team bar */}
      <div className="flex items-center gap-4 px-4 py-2 bg-bg-2/50 border-b border-border-1 text-xs shrink-0">
        <span className="text-text-3">Team:</span>
        <div className="flex items-center gap-2">
          {(isV2 && taskV2 ? taskV2.agents : selectedWorktree.agents).map((wa) => {
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
            files={availableFiles as any}
            selectedFile={selectedFile || availableFiles[0]}
            onSelectFile={setSelectedFile}
          />
        </div>

        {/* Diff viewer */}
        {selectedFile && (
          <DiffViewer
            file={selectedFile}
            diff={fileDiff}
            taskId={isV2 && taskV2 ? taskV2.id : undefined}
            onNavigateToPipeline={onNavigateToPipeline}
          />
        )}
        {!selectedFile && availableFiles.length === 0 && (
          <div className="flex items-center justify-center h-full bg-bg-0">
            <p className="text-text-3 text-sm">No files to display</p>
          </div>
        )}

        {/* Right sidebar with decision context and specification context */}
        <div className="bg-bg-1 border-l border-border-1 overflow-y-auto">
          {/* Decision Context (Reasoning) - TOP */}
          <ReasoningPanel diff={fileDiff} />

          {/* Specification Context - BELOW */}
          {isV2 && taskV2 && taskV2.specification && selectedFile && onNavigateToPipeline && (() => {
            // Cast selectedFile to TaskFileChange to access traceability fields
            const taskFileChange = selectedFile as unknown as TaskFileChange;

            // Get criteria that this file implements
            const relevantCriteria = taskV2.specification.acceptanceCriteria.filter(
              (ac) => taskFileChange.fulfillsAcceptanceCriteria?.includes(ac.id)
            );

            if (relevantCriteria.length === 0) return null;

            return (
              <SpecificationTraceability
                acceptanceCriteria={relevantCriteria}
                taskId={taskV2.id}
                onNavigateToSpec={(taskId, criterionId) => {
                  onNavigateToPipeline(taskId, criterionId);
                }}
              />
            );
          })()}
        </div>
      </div>
    </div>
  );
}
