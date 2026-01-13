import { clsx } from 'clsx';
import { FileEdit, Check, Target } from 'lucide-react';
import { getAgentById } from '@/data/mockData';
import type { FileChange, FileDiff, TaskFileChange } from '@/types';

interface DiffViewerProps {
  file: FileChange;
  diff?: FileDiff;
  taskId?: string;
  onNavigateToPipeline?: (taskId: string) => void;
  onNavigateToSpecImpact?: (missionId: string, criterionId?: string) => void;
}

export function DiffViewer({ file, diff, taskId, onNavigateToPipeline, onNavigateToSpecImpact }: DiffViewerProps) {
  const agent = file.agentId ? getAgentById(file.agentId) : null;

  const handleReviseSpec = () => {
    if (taskId && onNavigateToPipeline) {
      onNavigateToPipeline(taskId);
    }
  };

  const handleViewSpecification = () => {
    if (taskId && onNavigateToSpecImpact) {
      // Get first criterion from this file's traceability
      const taskFileChange = file as unknown as TaskFileChange;
      const criterionId = taskFileChange.fulfillsAcceptanceCriteria?.[0];
      onNavigateToSpecImpact(taskId, criterionId);
    }
  };

  const handleApprove = () => {
    // TODO: Implement approval logic
    // This should:
    // 1. Mark the implementation stage as approved
    // 2. Advance the task to the next pipeline stage (e.g., Testing)
    // 3. Update task status accordingly
    console.log('Approve implementation for task:', taskId);
  };

  return (
    <div className="flex flex-col bg-bg-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-bg-1 border-b border-border-1 shrink-0">
        <div className="flex items-center gap-3">
          <div className="font-mono text-xs">
            <span className="text-text-3">{file.path}</span>
            <span className="text-text-1 font-medium">{file.filename}</span>
          </div>
          {agent && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-bg-2 text-[10px]">
              <span>{agent.emoji}</span>
              <span className="text-text-2">by {agent.name}</span>
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {/* Revise Specification Button */}
          {taskId && onNavigateToPipeline && (
            <button
              onClick={handleReviseSpec}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium bg-bg-2 border border-border-1 rounded text-text-2 hover:bg-bg-3 hover:text-accent-purple hover:border-accent-purple/30 transition-colors"
              title="Navigate to Pipeline view to revise the specification"
            >
              <FileEdit className="w-3.5 h-3.5" />
              Revise Specification
            </button>
          )}

          {/* View Specification Button - V4 Phase 8 */}
          {taskId && onNavigateToSpecImpact && (
            <button
              onClick={handleViewSpecification}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium bg-bg-2 border border-border-1 rounded text-text-2 hover:bg-bg-3 hover:text-accent-cyan hover:border-accent-cyan/30 transition-colors"
              title="View specification impact for this change"
            >
              <Target className="w-3.5 h-3.5" />
              View Specification
            </button>
          )}

          {/* Approve Button */}
          <button
            onClick={handleApprove}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium bg-accent-green border-accent-green rounded text-black hover:brightness-110 transition-all"
            title="Approve implementation and proceed to next stage"
          >
            <Check className="w-3.5 h-3.5" />
            Approve
          </button>
        </div>
      </div>

      {/* Diff content */}
      <div className="flex-1 overflow-auto font-mono text-xs leading-[1.65]">
        {diff?.hunks ? (
          diff.hunks.map((hunk, hunkIndex) => (
            <div key={hunkIndex}>
              {/* Hunk header */}
              <div className="flex items-center gap-3 px-4 py-2 bg-bg-2 text-[11px] text-text-3 border-y border-border-1">
                <span className="text-accent-purple">{hunk.range}</span>
                <span>{hunk.context}</span>
              </div>

              {/* Lines */}
              {hunk.lines.map((line, lineIndex) => (
                <div
                  key={lineIndex}
                  className={clsx(
                    'flex min-h-[22px] hover:bg-accent-blue/10',
                    line.type === 'add' && 'diff-line-add',
                    line.type === 'del' && 'diff-line-del'
                  )}
                >
                  <span className="line-num w-[50px] px-2 text-right text-text-3 bg-black/20 flex items-center justify-end text-[11px]">
                    {line.lineNumber}
                  </span>
                  <span
                    className={clsx(
                      'w-5 text-center font-semibold',
                      line.type === 'add' && 'text-accent-green',
                      line.type === 'del' && 'text-accent-red'
                    )}
                  >
                    {line.type === 'add' && '+'}
                    {line.type === 'del' && '-'}
                  </span>
                  <span className="flex-1 px-2 whitespace-pre overflow-x-auto">
                    {line.content}
                  </span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-text-3">
            <div className="text-center">
              <div className="text-2xl mb-2">📄</div>
              <div className="text-sm">No detailed diff available for this file</div>
              <div className="text-xs text-text-3 mt-1">
                +{file.additions} / -{file.deletions} lines changed
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
