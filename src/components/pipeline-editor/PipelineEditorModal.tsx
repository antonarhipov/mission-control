import { useState } from 'react';
import { X, Workflow } from 'lucide-react';
import { Node, Edge } from 'reactflow';
import { NodePalette } from './NodePalette';
import { PipelineCanvas } from './PipelineCanvas';

interface PipelineEditorModalProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onClose: () => void;
  onSave: (nodes: Node[], edges: Edge[]) => void;
  pipelineName?: string;
}

export function PipelineEditorModal({
  initialNodes = [],
  initialEdges = [],
  onClose,
  onSave,
  pipelineName = 'Untitled Pipeline',
}: PipelineEditorModalProps) {
  const [name, setName] = useState(pipelineName);

  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleSave = (nodes: Node[], edges: Edge[]) => {
    onSave(nodes, edges);
    // Don't close automatically - let user decide when to close
  };

  return (
    <div className="fixed inset-0 bg-bg-0 z-50 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border-1 bg-bg-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Workflow className="w-6 h-6 text-accent-blue" />
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xl font-semibold text-text-1 bg-transparent border-none outline-none focus:ring-2 focus:ring-accent-blue/50 rounded px-2 -ml-2"
                placeholder="Pipeline Name"
              />
              <p className="text-sm text-text-3">Visual pipeline editor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-1 rounded transition-colors"
          >
            <X className="w-5 h-5 text-text-3" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden grid grid-cols-[280px_1fr]">
        {/* Left: Node Palette */}
        <div className="overflow-hidden">
          <NodePalette onDragStart={handleDragStart} />
        </div>

        {/* Right: Canvas */}
        <div className="overflow-hidden">
          <PipelineCanvas
            initialNodes={initialNodes}
            initialEdges={initialEdges}
            onSave={handleSave}
          />
        </div>
      </div>

      {/* Footer Help */}
      <div className="flex-shrink-0 px-6 py-3 border-t border-border-1 bg-bg-1">
        <div className="flex items-center justify-between text-xs text-text-3">
          <div className="flex items-center gap-6">
            <div>💡 <strong>Drag</strong> nodes from the palette to the canvas</div>
            <div>🔗 <strong>Connect</strong> nodes by dragging from output to input handles</div>
            <div>⌫ <strong>Delete</strong> nodes and edges by selecting and pressing Delete key</div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-bg-2 hover:bg-bg-3 text-text-1 border border-border-1 rounded-lg font-medium transition-colors"
          >
            Close Editor
          </button>
        </div>
      </div>
    </div>
  );
}
