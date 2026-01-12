import type { Node, Edge } from 'reactflow';
import type { TeamPipelineStage, Agent } from '@/types';
import type { PipelineNodeData, PipelineEdgeData } from '@/types/pipeline-editor';

/**
 * Convert TeamPipelineStage[] to React Flow nodes and edges
 * @param stages - Array of pipeline stages
 * @param agents - Array of all agents (will be filtered by stage assignment)
 * @returns Object containing nodes and edges for React Flow
 */
export function stagesToGraph(
  stages: TeamPipelineStage[],
  agents: Agent[]
): { nodes: Node<PipelineNodeData>[]; edges: Edge<PipelineEdgeData>[] } {
  // Build adjacency list to detect entry/exit points
  const hasIncoming = new Set<string>();
  const hasOutgoing = new Set<string>();

  stages.forEach(stage => {
    if (stage.nextStageIds && stage.nextStageIds.length > 0) {
      hasOutgoing.add(stage.id);
      stage.nextStageIds.forEach(targetId => hasIncoming.add(targetId));
    }
  });

  // Map stages to nodes
  const nodes: Node<PipelineNodeData>[] = stages.map(stage => {
    const assignedAgents = agents.filter(a => stage.assignedAgentIds.includes(a.id));

    return {
      id: stage.id,
      type: 'agentNode',
      position: stage.position || { x: 0, y: 0 },
      data: {
        stage,
        agents: assignedAgents,
        isEntryPoint: !hasIncoming.has(stage.id),
        isExitPoint: !hasOutgoing.has(stage.id),
      },
    };
  });

  // Build edges from nextStageIds
  const edges: Edge<PipelineEdgeData>[] = [];

  stages.forEach(stage => {
    const nextIds = stage.nextStageIds || [];

    nextIds.forEach(targetId => {
      // Determine edge type and label
      let edgeType = 'default';
      let label: string | undefined;

      if (stage.branchType === 'conditional' && stage.condition) {
        edgeType = 'smoothstep';
        // Check if this edge is success or failure branch
        const isSuccess = stage.condition.branches.onSuccess.includes(targetId);
        const isFailure = stage.condition.branches.onFailure.includes(targetId);

        if (isSuccess) label = 'On Success';
        if (isFailure) label = 'On Failure';
      } else if (stage.branchType === 'parallel') {
        edgeType = 'default';
      }

      edges.push({
        id: `${stage.id}-${targetId}`,
        source: stage.id,
        target: targetId,
        type: edgeType,
        label,
        data: {
          type: stage.branchType || 'sequential',
          condition: label,
        },
      });
    });
  });

  return { nodes, edges };
}

/**
 * Convert React Flow nodes and edges back to TeamPipelineStage[]
 * @param nodes - React Flow nodes
 * @param edges - React Flow edges
 * @returns Array of pipeline stages with updated positions and connections
 */
export function graphToStages(
  nodes: Node<PipelineNodeData>[],
  edges: Edge<PipelineEdgeData>[]
): TeamPipelineStage[] {
  return nodes.map((node, index) => {
    // Find outgoing edges for this node
    const outgoingEdges = edges.filter(e => e.source === node.id);
    const nextStageIds = outgoingEdges.map(e => e.target);

    return {
      ...node.data.stage,
      position: node.position,
      nextStageIds,
      order: index, // Maintain order for backward compatibility
    };
  });
}

/**
 * Find entry stage IDs (stages with no incoming edges)
 * @param stages - Array of pipeline stages
 * @returns Array of stage IDs that are entry points
 */
export function findEntryStages(stages: TeamPipelineStage[]): string[] {
  const hasIncoming = new Set<string>();

  stages.forEach(stage => {
    const nextIds = stage.nextStageIds || [];
    nextIds.forEach(id => hasIncoming.add(id));
  });

  return stages
    .filter(stage => !hasIncoming.has(stage.id))
    .map(stage => stage.id);
}

/**
 * Find exit stage IDs (stages with no outgoing edges)
 * @param stages - Array of pipeline stages
 * @returns Array of stage IDs that are exit points
 */
export function findExitStages(stages: TeamPipelineStage[]): string[] {
  return stages
    .filter(stage => !stage.nextStageIds || stage.nextStageIds.length === 0)
    .map(stage => stage.id);
}
