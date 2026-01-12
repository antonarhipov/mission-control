import { Handle, Position } from 'reactflow';
import { Workflow, Settings } from 'lucide-react';
import type { NodeProps } from 'reactflow';

export interface ParallelNodeData {
  label: string;
  branches?: number;
  description?: string;
}

export function ParallelNode({ data, selected }: NodeProps<ParallelNodeData>) {
  const branches = data.branches || 2;

  return (
    <div
      className={`
        bg-bg-0 rounded-lg border-2 shadow-lg min-w-[180px] transition-all
        ${selected ? 'border-accent-cyan ring-2 ring-accent-cyan/20' : 'border-accent-cyan'}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-accent-cyan border-2 border-bg-0"
      />

      {/* Header */}
      <div className={`px-3 py-2 border-b ${selected ? 'border-accent-cyan/30' : 'border-border-1'}`}>
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded ${selected ? 'bg-accent-cyan/10' : 'bg-accent-cyan/10'}`}>
            <Workflow className="w-4 h-4 text-accent-cyan" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-text-1 truncate">
              {data.label || 'Parallel'}
            </div>
            <div className="text-xs text-text-3">Fork {branches} branches</div>
          </div>
          <button className="p-1 hover:bg-bg-1 rounded transition-colors">
            <Settings className="w-3 h-3 text-text-3" />
          </button>
        </div>
      </div>

      {/* Body */}
      {data.description && (
        <div className="px-3 py-2">
          <p className="text-xs text-text-2 line-clamp-2">{data.description}</p>
        </div>
      )}

      {/* Footer */}
      <div className="px-3 py-1.5 bg-accent-cyan/10 text-xs text-accent-cyan rounded-b-lg">
        Parallel execution enabled
      </div>

      {/* Multiple output handles */}
      {Array.from({ length: branches }).map((_, i) => (
        <Handle
          key={i}
          type="source"
          position={Position.Bottom}
          id={`branch-${i}`}
          style={{ left: `${((i + 1) * 100) / (branches + 1)}%` }}
          className="w-3 h-3 !bg-accent-cyan border-2 border-bg-0"
        />
      ))}
    </div>
  );
}
