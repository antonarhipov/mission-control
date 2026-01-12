import type { Node, Edge } from 'reactflow';
import type { TeamPipelineStage, Agent } from './index';

/**
 * PipelineNodeData - Data stored in React Flow nodes
 * Contains stage configuration and assigned agents
 */
export interface PipelineNodeData {
  stage: TeamPipelineStage;
  agents: Agent[]; // Agents assigned to this stage
  isEntryPoint?: boolean; // Is this a pipeline entry point?
  isExitPoint?: boolean; // Is this a pipeline exit point?
  validationError?: string; // Validation error for this stage (if any)
}

/**
 * PipelineEdgeData - Data stored in React Flow edges
 * Contains connection type and conditional information
 */
export interface PipelineEdgeData {
  condition?: string; // Label for conditional branches (e.g., "On Success")
  type: 'sequential' | 'parallel' | 'conditional'; // Connection type
}

/**
 * PipelineNode - Type alias for React Flow node with pipeline data
 */
export type PipelineNode = Node<PipelineNodeData>;

/**
 * PipelineEdge - Type alias for React Flow edge with pipeline data
 */
export type PipelineEdge = Edge<PipelineEdgeData>;
