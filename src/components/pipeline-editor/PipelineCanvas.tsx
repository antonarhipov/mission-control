import { useCallback, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { AgentNode } from './nodes/AgentNode';
import { GateNode } from './nodes/GateNode';
import { ConditionNode } from './nodes/ConditionNode';
import { ParallelNode } from './nodes/ParallelNode';
import { JoinNode } from './nodes/JoinNode';
import { Save, Download, Upload, Trash2 } from 'lucide-react';

const nodeTypes = {
  agent: AgentNode,
  gate: GateNode,
  condition: ConditionNode,
  parallel: ParallelNode,
  join: JoinNode,
};

interface PipelineCanvasProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onSave?: (nodes: Node[], edges: Edge[]) => void;
}

let nodeId = 0;
const getNodeId = () => `node_${nodeId++}`;

export function PipelineCanvas({ initialNodes = [], initialEdges = [], onSave }: PipelineCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowWrapper.current) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left - 90, // Center the node
        y: event.clientY - reactFlowBounds.top - 50,
      };

      const newNode: Node = {
        id: getNodeId(),
        type,
        position,
        data: {
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const handleSave = () => {
    if (onSave) {
      onSave(nodes, edges);
    }
    console.log('Pipeline saved:', { nodes, edges });
  };

  const handleExport = () => {
    const pipelineData = { nodes, edges };
    const blob = new Blob([JSON.stringify(pipelineData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pipeline.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.nodes && data.edges) {
            setNodes(data.nodes);
            setEdges(data.edges);
          }
        } catch (error) {
          console.error('Failed to import pipeline:', error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the entire pipeline?')) {
      setNodes([]);
      setEdges([]);
    }
  };

  return (
    <div ref={reactFlowWrapper} className="w-full h-full bg-bg-0">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        className="bg-bg-0"
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#64748b', strokeWidth: 2 },
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#334155"
        />
        <Controls className="bg-bg-1 border border-border-1 rounded-lg" />
        <MiniMap
          className="bg-bg-1 border border-border-1 rounded-lg"
          nodeColor={(node) => {
            switch (node.type) {
              case 'agent':
                return '#3b82f6'; // blue
              case 'gate':
                return '#f59e0b'; // amber
              case 'condition':
                return '#a855f7'; // purple
              case 'parallel':
                return '#06b6d4'; // cyan
              case 'join':
                return '#10b981'; // green
              default:
                return '#64748b'; // default
            }
          }}
        />

        {/* Toolbar Panel */}
        <Panel position="top-right" className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-3 py-2 bg-accent-green hover:bg-accent-green/80 text-white rounded-lg font-medium transition-colors shadow-lg"
            title="Save pipeline"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 bg-bg-1 hover:bg-bg-2 text-text-1 border border-border-1 rounded-lg font-medium transition-colors shadow-lg"
            title="Export pipeline"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={handleImport}
            className="flex items-center gap-2 px-3 py-2 bg-bg-1 hover:bg-bg-2 text-text-1 border border-border-1 rounded-lg font-medium transition-colors shadow-lg"
            title="Import pipeline"
          >
            <Upload className="w-4 h-4" />
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-3 py-2 bg-accent-red hover:bg-accent-red/80 text-white rounded-lg font-medium transition-colors shadow-lg"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </Panel>

        {/* Stats Panel */}
        <Panel position="bottom-left" className="bg-bg-1 border border-border-1 rounded-lg px-4 py-2 shadow-lg">
          <div className="flex items-center gap-4 text-xs text-text-2">
            <div>
              <span className="text-text-3">Nodes:</span>
              <span className="ml-1 font-semibold text-text-1">{nodes.length}</span>
            </div>
            <div>
              <span className="text-text-3">Connections:</span>
              <span className="ml-1 font-semibold text-text-1">{edges.length}</span>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
