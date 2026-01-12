import { User, Shield, GitBranch, Workflow, Merge } from 'lucide-react';

interface NodeTypeConfig {
  type: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const nodeTypes: NodeTypeConfig[] = [
  {
    type: 'agent',
    label: 'Agent Task',
    icon: <User className="w-5 h-5" />,
    color: 'bg-accent-blue',
    description: 'Assign work to an agent',
  },
  {
    type: 'gate',
    label: 'Approval Gate',
    icon: <Shield className="w-5 h-5" />,
    color: 'bg-accent-amber',
    description: 'Human approval checkpoint',
  },
  {
    type: 'condition',
    label: 'Condition',
    icon: <GitBranch className="w-5 h-5" />,
    color: 'bg-accent-purple',
    description: 'Branch based on condition',
  },
  {
    type: 'parallel',
    label: 'Parallel',
    icon: <Workflow className="w-5 h-5" />,
    color: 'bg-accent-cyan',
    description: 'Fork into parallel branches',
  },
  {
    type: 'join',
    label: 'Join',
    icon: <Merge className="w-5 h-5" />,
    color: 'bg-accent-green',
    description: 'Merge parallel branches',
  },
];

interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export function NodePalette({ onDragStart }: NodePaletteProps) {
  return (
    <div className="flex flex-col h-full bg-bg-0 border-r border-border-1">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-border-1">
        <h3 className="text-sm font-semibold text-text-1 uppercase tracking-wide">
          Node Palette
        </h3>
        <p className="text-xs text-text-3 mt-1">Drag nodes onto the canvas</p>
      </div>

      {/* Node List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {nodeTypes.map((nodeType) => (
            <div
              key={nodeType.type}
              draggable
              onDragStart={(e) => onDragStart(e, nodeType.type)}
              className="bg-bg-1 border border-border-1 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-border-2 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${nodeType.color}/10`}>
                  <div className={`${nodeType.color === 'bg-accent-blue' ? 'text-accent-blue' :
                    nodeType.color === 'bg-accent-amber' ? 'text-accent-amber' :
                    nodeType.color === 'bg-accent-purple' ? 'text-accent-purple' :
                    nodeType.color === 'bg-accent-cyan' ? 'text-accent-cyan' :
                    'text-accent-green'
                  }`}>
                    {nodeType.icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-1">{nodeType.label}</div>
                  <div className="text-xs text-text-3 mt-0.5">{nodeType.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Help */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-border-1 bg-bg-1">
        <div className="text-xs text-text-3 space-y-1">
          <p>💡 <strong>Tip:</strong> Connect nodes by dragging from output to input handles</p>
        </div>
      </div>
    </div>
  );
}
