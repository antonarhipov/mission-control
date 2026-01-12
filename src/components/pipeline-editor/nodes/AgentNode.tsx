import { Handle, Position } from 'reactflow';
import { User, Settings } from 'lucide-react';
import type { NodeProps } from 'reactflow';

export interface AgentNodeData {
  label: string;
  agentRole?: 'implementer' | 'architect' | 'tester' | 'reviewer' | 'docs';
  agentId?: string;
  description?: string;
}

export function AgentNode({ data, selected }: NodeProps<AgentNodeData>) {
  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'architect':
        return 'border-accent-purple';
      case 'implementer':
        return 'border-accent-blue';
      case 'tester':
        return 'border-accent-green';
      case 'reviewer':
        return 'border-accent-amber';
      case 'docs':
        return 'border-accent-cyan';
      default:
        return 'border-border-1';
    }
  };

  const getRoleIcon = () => {
    // Could map to different icons based on role in the future
    return <User className="w-4 h-4" />;
  };

  return (
    <div
      className={`
        bg-bg-0 rounded-lg border-2 shadow-lg min-w-[180px] transition-all
        ${selected ? 'border-accent-blue ring-2 ring-accent-blue/20' : getRoleColor(data.agentRole)}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-accent-blue border-2 border-bg-0"
      />

      {/* Header */}
      <div className={`px-3 py-2 border-b ${selected ? 'border-accent-blue/30' : 'border-border-1'}`}>
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded ${selected ? 'bg-accent-blue/10' : 'bg-bg-1'}`}>
            {getRoleIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-text-1 truncate">
              {data.label || 'Agent Task'}
            </div>
            {data.agentRole && (
              <div className="text-xs text-text-3 capitalize">{data.agentRole}</div>
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
      <div className="px-3 py-1.5 bg-bg-1 text-xs text-text-3 rounded-b-lg">
        {data.agentId ? `Agent: ${data.agentId}` : 'No agent assigned'}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-accent-blue border-2 border-bg-0"
      />
    </div>
  );
}
