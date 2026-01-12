import dagre from 'dagre';
import type { Node } from 'reactflow';

/**
 * Auto-layout pipeline graph using Dagre hierarchical layout algorithm
 * @param nodes - React Flow nodes to layout
 * @param edges - React Flow edges (for connection information)
 * @param direction - Layout direction ('TB' = top-to-bottom, 'LR' = left-to-right)
 * @returns New array of nodes with updated positions
 */
export function autoLayoutGraph<T>(
  nodes: Node<T>[],
  edges: { source: string; target: string }[],
  direction: 'TB' | 'LR' = 'TB'
): Node<T>[] {
  // Create a new directed graph
  const g = new dagre.graphlib.Graph();

  // Set graph options
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: direction, // Top-to-bottom or left-to-right
    nodesep: 100, // Horizontal spacing between nodes
    ranksep: 120, // Vertical spacing between ranks
    marginx: 50,
    marginy: 50,
  });

  // Add nodes with dimensions
  nodes.forEach(node => {
    g.setNode(node.id, {
      width: 220, // Node width
      height: 120, // Node height
    });
  });

  // Add edges
  edges.forEach(edge => {
    g.setEdge(edge.source, edge.target);
  });

  // Run layout algorithm
  dagre.layout(g);

  // Update node positions
  return nodes.map(node => {
    const position = g.node(node.id);

    return {
      ...node,
      position: {
        // Center the node on the computed position
        x: position.x - 110, // width / 2
        y: position.y - 60, // height / 2
      },
    };
  });
}

/**
 * Calculate bounding box of all nodes
 * Useful for centering the canvas view
 * @param nodes - Array of nodes
 * @returns Bounding box with min/max x/y coordinates
 */
export function calculateBoundingBox<T>(nodes: Node<T>[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach(node => {
    const { x, y } = node.position;
    const width = 220; // Node width
    const height = 120; // Node height

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  });

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
