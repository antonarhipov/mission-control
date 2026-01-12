import { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Plus, Maximize2 } from 'lucide-react';

import type { PipelineConfiguration, Agent, TeamPipelineStage } from '@/types';
import { stagesToGraph, graphToStages, findEntryStages } from '@/utils/pipeline-graph';
import { validatePipelineGraph } from '@/utils/pipeline-validation';
import { autoLayoutGraph } from '@/utils/pipeline-layout';
import { AgentNode } from './nodes/AgentNode';
import { StagePropertiesPanel } from './StagePropertiesPanel';
import { PipelineValidationPanel } from './PipelineValidationPanel';

const nodeTypes = {
  agentNode: AgentNode,
};

interface PipelineVisualEditorProps {
  pipeline: PipelineConfiguration;
  agents: Agent[];
  onChange: (pipeline: PipelineConfiguration) => void;
  mode?: 'edit' | 'view';
}

export function PipelineVisualEditor({
  pipeline,
  agents,
  onChange,
  mode = 'edit',
}: PipelineVisualEditorProps) {
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [needsSync, setNeedsSync] = useState(false);

  // Initialize React Flow state from pipeline
  const { nodes: initialNodes, edges: initialEdges } = stagesToGraph(
    pipeline.stages,
    agents
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Wrapped change handlers to trigger sync
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);

    // Check if this is a position change (after drag) or deletion
    const hasPositionChange = changes.some(c => c.type === 'position' && !(c as any).dragging);
    const hasDeletion = changes.some(c => c.type === 'remove');

    if (hasPositionChange || hasDeletion) {
      // Debounce to batch multiple rapid changes
      setNeedsSync(true);
    }
  }, [onNodesChange]);

  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    onEdgesChange(changes);

    // Edge deletions or additions need sync
    const needsSyncLocal = changes.some(c => c.type === 'remove' || c.type === 'add');
    if (needsSyncLocal) {
      setNeedsSync(true);
    }
  }, [onEdgesChange]);

  // Sync nodes/edges when pipeline changes externally
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = stagesToGraph(pipeline.stages, agents);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [pipeline.stages, agents, setNodes, setEdges]);

  // Validate and sync back to pipeline
  const syncToPipeline = useCallback(() => {
    const updatedStages = graphToStages(nodes, edges);
    const validation = validatePipelineGraph(updatedStages);

    // Find entry stage IDs
    const entryStageIds = findEntryStages(updatedStages);

    onChange({
      ...pipeline,
      stages: updatedStages,
      entryStageIds,
      isValid: validation.isValid,
      validationErrors: validation.errors,
      updatedAt: new Date().toISOString(),
    });
  }, [nodes, edges, pipeline, onChange]);

  // Debounced sync effect
  useEffect(() => {
    if (!needsSync) return;

    const timer = setTimeout(() => {
      syncToPipeline();
      setNeedsSync(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [needsSync, syncToPipeline]);

  // Add new stage
  const handleAddStage = useCallback(() => {
    const newStage: TeamPipelineStage = {
      id: `stage-${Date.now()}`,
      name: 'New Stage',
      description: '',
      assignedAgentIds: [],
      order: nodes.length,
      nextStageIds: [],
      position: { x: 400, y: nodes.length * 150 },
      branchType: 'sequential',
      color: '#388bfd',
      requiredForCompletion: true,
    };

    const newNode = {
      id: newStage.id,
      type: 'agentNode',
      position: newStage.position!,
      data: {
        stage: newStage,
        agents: [],
        isEntryPoint: nodes.length === 0, // First stage is entry point
        isExitPoint: true, // New stages have no outgoing edges
      },
    };

    setNodes(nds => [...nds, newNode]);

    // Trigger sync after state update
    setNeedsSync(true);
  }, [nodes, setNodes]);

  // Auto-layout
  const handleAutoLayout = useCallback(() => {
    const layouted = autoLayoutGraph(nodes, edges);
    setNodes(layouted);

    // Trigger sync after layout
    setNeedsSync(true);
  }, [nodes, edges, setNodes]);

  // Delete stage
  const handleDeleteStage = useCallback((stageId: string) => {
    const stageName = nodes.find(n => n.id === stageId)?.data.stage.name;

    if (!confirm(`Delete stage "${stageName}"?\n\nThis will remove all connections to this stage.`)) {
      return;
    }

    // Remove node
    setNodes(nds => nds.filter(n => n.id !== stageId));

    // Remove all edges connected to this node
    setEdges(eds => eds.filter(e => e.source !== stageId && e.target !== stageId));

    // Clear selection if deleted
    if (selectedStageId === stageId) {
      setSelectedStageId(null);
    }

    // Sync immediately
    setNeedsSync(true);
  }, [nodes, setNodes, setEdges, selectedStageId]);

  // Keyboard shortcuts for deletion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedStageId) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        handleDeleteStage(selectedStageId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedStageId, handleDeleteStage]);

  // Connect stages
  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;

      const newEdge = {
        id: `${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        type: 'default',
        data: { type: 'sequential' as const },
      };

      setEdges(eds => addEdge(newEdge, eds));

      // Trigger sync after connection
      setNeedsSync(true);
    },
    [setEdges]
  );

  // Node click handler
  const onNodeClick = useCallback((_event: any, node: any) => {
    setSelectedStageId(node.id);
  }, []);

  // Update stage from properties panel
  const handleUpdateStage = useCallback(
    (updated: TeamPipelineStage) => {
      setNodes(nds =>
        nds.map(n =>
          n.id === updated.id
            ? {
                ...n,
                data: {
                  ...n.data,
                  stage: updated,
                  agents: agents.filter(a => updated.assignedAgentIds.includes(a.id)),
                },
              }
            : n
        )
      );

      // Trigger sync after update
      setNeedsSync(true);
    },
    [setNodes, agents]
  );

  const selectedStage = nodes.find(n => n.id === selectedStageId)?.data.stage || null;

  return (
    <div className="h-full flex gap-4 bg-bg-0 p-4">
      {/* Main Canvas */}
      <div className="flex-1 relative border border-border-1 rounded-lg overflow-hidden bg-bg-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}

          // Enable editing capabilities
          edgesUpdatable={mode === 'edit'}
          edgesFocusable={mode === 'edit'}
          nodesDraggable={mode === 'edit'}
          nodesConnectable={mode === 'edit'}
          nodesFocusable={mode === 'edit'}
          elementsSelectable={mode === 'edit'}

          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          maxZoom={2}
        >
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <MiniMap
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
            }}
            maskColor="rgba(0, 0, 0, 0.3)"
          />
        </ReactFlow>

        {/* Toolbar */}
        {mode === 'edit' && (
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <button
              onClick={handleAddStage}
              className="flex items-center gap-2 px-3 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded text-sm font-medium transition-colors shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stage</span>
            </button>
            <button
              onClick={handleAutoLayout}
              className="flex items-center gap-2 px-3 py-2 bg-bg-2 hover:bg-bg-3 text-text-1 rounded text-sm font-medium transition-colors shadow-lg border border-border-1"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Auto Layout</span>
            </button>
          </div>
        )}
      </div>

      {/* Side Panels */}
      <div className="w-80 space-y-4 flex flex-col">
        <PipelineValidationPanel
          errors={pipeline.validationErrors || []}
          warnings={[]} // Warnings would come from validation if needed
        />

        {selectedStage && mode === 'edit' && (
          <StagePropertiesPanel
            stage={selectedStage}
            agents={agents}
            onUpdate={handleUpdateStage}
            onDelete={handleDeleteStage}
            onClose={() => setSelectedStageId(null)}
          />
        )}
      </div>
    </div>
  );
}
