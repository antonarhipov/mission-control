import { FileCode, GitCommit } from 'lucide-react';
import type { FileReference, CommitReference } from '@/types';

interface CriterionFileListProps {
  files: FileReference[];
  commits: CommitReference[];
  onNavigateToDiff?: (fileId: string) => void;
}

export function CriterionFileList({ files, commits, onNavigateToDiff }: CriterionFileListProps) {
  if (files.length === 0 && commits.length === 0) {
    return (
      <div className="text-xs text-text-3 italic">
        No files or commits yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Files */}
      {files.length > 0 && (
        <div>
          <div className="text-xs font-medium text-text-2 mb-1.5">Files:</div>
          <div className="space-y-1">
            {files.map(file => (
              <button
                key={file.id}
                onClick={() => onNavigateToDiff?.(file.id)}
                className="w-full flex items-start gap-2 p-2 bg-bg-0 hover:bg-bg-2 rounded text-left transition-colors group"
              >
                <FileCode className="w-3 h-3 text-text-3 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono text-text-1 group-hover:text-accent-blue truncate">
                    {file.filename}
                  </div>
                  <div className="text-xs text-text-3 truncate">
                    {file.path}
                  </div>
                  <div className="text-xs text-text-3 mt-0.5">
                    <span className="text-accent-green">+{file.additions}</span>
                    {file.deletions > 0 && (
                      <>
                        {' '}
                        <span className="text-accent-red">-{file.deletions}</span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Commits */}
      {commits.length > 0 && (
        <div>
          <div className="text-xs font-medium text-text-2 mb-1.5">Commits:</div>
          <div className="space-y-1">
            {commits.map(commit => (
              <div
                key={commit.sha}
                className="flex items-start gap-2 p-2 bg-bg-0 rounded"
              >
                <GitCommit className="w-3 h-3 text-text-3 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono text-accent-blue">
                    {commit.sha.substring(0, 7)}
                  </div>
                  <div className="text-xs text-text-2">{commit.message}</div>
                  <div className="text-xs text-text-3 mt-0.5">
                    ${commit.cost.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
