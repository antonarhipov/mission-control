import { Handle, Position } from 'reactflow';
import { Shield, Settings } from 'lucide-react';
import type { NodeProps } from 'reactflow';

export interface GateNodeData {
  label: string;
  gateType?: 'approval' | 'review' | 'decision';
  description?: string;
  autoApprove?: boolean;
}

export function GateNode({ data, selected }: NodeProps<GateNodeData>) {
  return (
    <div
      className={`
        bg-bg-0 rounded-lg border-2 shadow-lg min-w-[180px] transition-all
        ${selected ? 'border-accent-amber ring-2 ring-accent-amber/20' : 'border-accent-amber'}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-accent-amber border-2 border-bg-0"
      />

      {/* Header */}
      <div className={`px-3 py-2 border-b ${selected ? 'border-accent-amber/30' : 'border-border-1'}`}>
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded ${selected ? 'bg-accent-amber/10' : 'bg-accent-amber/10'}`}>
            <Shield className="w-4 h-4 text-accent-amber" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-text-1 truncate">
              {data.label || 'Approval Gate'}
            </div>
            {data.gateType && (
              <div className="text-xs text-text-3 capitalize">{data.gateType}</div>
            )}
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
      <div className="px-3 py-1.5 bg-accent-amber/10 text-xs text-accent-amber rounded-b-lg">
        {data.autoApprove ? '⚡ Auto-approve enabled' : '👤 Requires human approval'}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-accent-amber border-2 border-bg-0"
      />
    </div>
  );
}
