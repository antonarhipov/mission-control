import { Handle, Position } from 'reactflow';
import { GitBranch, Settings } from 'lucide-react';
import type { NodeProps } from 'reactflow';

export interface ConditionNodeData {
  label: string;
  condition?: string;
  description?: string;
}

export function ConditionNode({ data, selected }: NodeProps<ConditionNodeData>) {
  return (
    <div
      className={`
        bg-bg-0 rounded-lg border-2 shadow-lg min-w-[180px] transition-all
        ${selected ? 'border-accent-purple ring-2 ring-accent-purple/20' : 'border-accent-purple'}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-accent-purple border-2 border-bg-0"
      />

      {/* Header */}
      <div className={`px-3 py-2 border-b ${selected ? 'border-accent-purple/30' : 'border-border-1'}`}>
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded ${selected ? 'bg-accent-purple/10' : 'bg-accent-purple/10'}`}>
            <GitBranch className="w-4 h-4 text-accent-purple" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-text-1 truncate">
              {data.label || 'Condition'}
            </div>
            <div className="text-xs text-text-3">Branch</div>
          </div>
          <button className="p-1 hover:bg-bg-1 rounded transition-colors">
            <Settings className="w-3 h-3 text-text-3" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-3 py-2">
        {data.condition ? (
          <div className="bg-bg-1 rounded px-2 py-1 mb-2">
            <code className="text-xs text-accent-purple font-mono">{data.condition}</code>
          </div>
        ) : (
          <div className="text-xs text-text-3 italic">No condition set</div>
        )}
        {data.description && (
          <p className="text-xs text-text-2 line-clamp-2">{data.description}</p>
        )}
      </div>

      {/* True/False handles */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-bg-1 rounded-b-lg">
        <div className="text-xs text-accent-green font-medium">True →</div>
        <div className="text-xs text-accent-red font-medium">False →</div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{ left: '30%' }}
        className="w-3 h-3 !bg-accent-green border-2 border-bg-0"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ left: '70%' }}
        className="w-3 h-3 !bg-accent-red border-2 border-bg-0"
      />
    </div>
  );
}
