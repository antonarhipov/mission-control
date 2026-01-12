import { Handle, Position } from 'reactflow';
import { Merge, Settings } from 'lucide-react';
import type { NodeProps } from 'reactflow';

export interface JoinNodeData {
  label: string;
  waitForAll?: boolean;
  description?: string;
}

export function JoinNode({ data, selected }: NodeProps<JoinNodeData>) {
  return (
    <div
      className={`
        bg-bg-0 rounded-lg border-2 shadow-lg min-w-[180px] transition-all
        ${selected ? 'border-accent-green ring-2 ring-accent-green/20' : 'border-accent-green'}
      `}
    >
      {/* Multiple input handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="input-1"
        style={{ left: '33%' }}
        className="w-3 h-3 !bg-accent-green border-2 border-bg-0"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="input-2"
        style={{ left: '50%' }}
        className="w-3 h-3 !bg-accent-green border-2 border-bg-0"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="input-3"
        style={{ left: '67%' }}
        className="w-3 h-3 !bg-accent-green border-2 border-bg-0"
      />

      {/* Header */}
      <div className={`px-3 py-2 border-b ${selected ? 'border-accent-green/30' : 'border-border-1'}`}>
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded ${selected ? 'bg-accent-green/10' : 'bg-accent-green/10'}`}>
            <Merge className="w-4 h-4 text-accent-green" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-text-1 truncate">
              {data.label || 'Join'}
            </div>
            <div className="text-xs text-text-3">Merge branches</div>
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
      <div className="px-3 py-1.5 bg-accent-green/10 text-xs text-accent-green rounded-b-lg">
        {data.waitForAll ? 'Wait for all branches' : 'Continue when any completes'}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-accent-green border-2 border-bg-0"
      />
    </div>
  );
}
