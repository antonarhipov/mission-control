import { clsx } from 'clsx';
import { getAgentById } from '@/data/mockData';
import type { FileChange } from '@/types';

interface FileListProps {
  files: FileChange[];
  selectedFile: FileChange | null;
  onSelectFile: (file: FileChange) => void;
}

export function FileList({ files, selectedFile, onSelectFile }: FileListProps) {
  const getFileIcon = (changeType: FileChange['changeType']) => {
    switch (changeType) {
      case 'added':
        return { letter: 'A', color: 'text-accent-green' };
      case 'modified':
        return { letter: 'M', color: 'text-accent-amber' };
      case 'deleted':
        return { letter: 'D', color: 'text-accent-red' };
    }
  };

  // Filter out any null/undefined files for safety
  const validFiles = files.filter((file): file is FileChange => !!file && !!file.filename);

  return (
    <div className="flex-1 overflow-y-auto py-1.5">
      {validFiles.map((file) => {
        const icon = getFileIcon(file.changeType);
        const isSelected = selectedFile ? file.filename === selectedFile.filename : false;
        const agent = file.agentId ? getAgentById(file.agentId) : null;

        return (
          <button
            key={file.filename}
            onClick={() => onSelectFile(file)}
            className={clsx(
              'w-full flex items-center gap-2 px-3.5 py-2 text-left transition-colors',
              isSelected
                ? 'bg-bg-3 border-l-2 border-accent-blue pl-3'
                : 'hover:bg-bg-4'
            )}
          >
            <span className={clsx('text-[10px] font-semibold w-3.5 shrink-0', icon.color)}>
              {icon.letter}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[11px] truncate">{file.filename}</div>
              <div className="flex items-center gap-2 mt-0.5">
                {agent && (
                  <span className="flex items-center gap-1 text-[10px] text-text-3">
                    <span>{agent.emoji}</span>
                    <span>{agent.name}</span>
                  </span>
                )}
              </div>
            </div>
            <span className="font-mono text-[10px] flex gap-1 shrink-0">
              {file.additions > 0 && (
                <span className="text-accent-green">+{file.additions}</span>
              )}
              {file.deletions > 0 && (
                <span className="text-accent-red">-{file.deletions}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
