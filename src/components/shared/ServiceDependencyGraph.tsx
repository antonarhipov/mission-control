import { useState } from 'react';
import { clsx } from 'clsx';
import { ZoomIn, ZoomOut, Maximize2, Server } from 'lucide-react';
import type { Service } from '@/types';

interface ServiceGraphNode extends Service {
  x: number;
  y: number;
  layer: number;
}

// Calculate graph layout for services (layered by dependencies)
function calculateServiceLayout(services: Service[]): ServiceGraphNode[] {
  const nodeMap = new Map<string, ServiceGraphNode>();
  const visited = new Set<string>();
  const layers = new Map<string, number>();

  // Calculate layers (depth in dependency tree)
  function calculateLayer(serviceId: string, currentLayer: number = 0): number {
    if (layers.has(serviceId)) {
      return layers.get(serviceId)!;
    }

    visited.add(serviceId);
    const service = services.find(s => s.id === serviceId);
    if (!service) return currentLayer;

    let maxLayer = currentLayer;
    for (const depId of service.dependencies.dependsOn) {
      if (!visited.has(depId)) {
        const depLayer = calculateLayer(depId, currentLayer + 1);
        maxLayer = Math.max(maxLayer, depLayer);
      }
    }

    layers.set(serviceId, maxLayer);
    visited.delete(serviceId);
    return maxLayer;
  }

  // Calculate layers for all services
  services.forEach(service => {
    if (!layers.has(service.id)) {
      calculateLayer(service.id);
    }
  });

  // Group by layer
  const layerGroups: Record<number, Service[]> = {};
  services.forEach(service => {
    const layer = layers.get(service.id) || 0;
    if (!layerGroups[layer]) layerGroups[layer] = [];
    layerGroups[layer].push(service);
  });

  // Assign positions
  const layerWidth = 220;
  const nodeHeight = 100;
  const startX = 100;

  services.forEach(service => {
    const layer = layers.get(service.id) || 0;
    const servicesInLayer = layerGroups[layer];
    const indexInLayer = servicesInLayer.indexOf(service);
    const totalInLayer = servicesInLayer.length;

    // Center vertically
    const startY = 250 - ((totalInLayer - 1) * nodeHeight) / 2;

    nodeMap.set(service.id, {
      ...service,
      x: startX + (layer * layerWidth),
      y: startY + (indexInLayer * nodeHeight),
      layer,
    });
  });

  return Array.from(nodeMap.values());
}

interface ServiceDependencyGraphProps {
  services: Service[];
}

export function ServiceDependencyGraph({
  services,
}: ServiceDependencyGraphProps) {
  const [zoom, setZoom] = useState(1);
  const [selectedService, setSelectedService] = useState<ServiceGraphNode | null>(null);
  const graphNodes = calculateServiceLayout(services);

  const handleServiceClick = (node: ServiceGraphNode) => {
    setSelectedService(node);
  };

  const getTierColor = (tier: Service['tier']) => {
    switch (tier) {
      case 'critical':
        return 'border-accent-red bg-accent-red/10';
      case 'high':
        return 'border-accent-amber bg-accent-amber/10';
      case 'medium':
        return 'border-accent-blue bg-accent-blue/10';
      case 'low':
        return 'border-text-3 bg-bg-2';
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-1 bg-bg-1 shrink-0">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-text-3" />
          <span className="text-sm font-medium text-text-1">Service Dependencies</span>
          <span className="text-xs text-text-3">({services.length} services)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="p-1.5 hover:bg-bg-2 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-text-2" />
          </button>
          <span className="text-xs text-text-3 font-mono w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="p-1.5 hover:bg-bg-2 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 text-text-2" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1.5 hover:bg-bg-2 rounded transition-colors"
            title="Reset Zoom"
          >
            <Maximize2 className="w-4 h-4 text-text-2" />
          </button>
        </div>
      </div>

      {/* Graph Canvas */}
      <div className="flex-1 overflow-auto relative">
        <svg
          width="1200"
          height="600"
          className="min-w-full min-h-full"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
        >
          {/* Draw edges (dependencies) */}
          {graphNodes.map((node) =>
            node.dependencies.dependsOn.map((depId) => {
              const depNode = graphNodes.find((n) => n.id === depId);
              if (!depNode) return null;

              const isSelected =
                selectedService?.id === node.id || selectedService?.id === depId;

              return (
                <g key={`${node.id}-${depId}`}>
                  <line
                    x1={depNode.x + 100}
                    y1={depNode.y + 40}
                    x2={node.x}
                    y2={node.y + 40}
                    stroke={isSelected ? 'rgb(96, 165, 250)' : 'rgb(75, 85, 99)'}
                    strokeWidth={isSelected ? 2 : 1}
                    strokeDasharray="4,4"
                    markerEnd="url(#arrowhead)"
                  />
                </g>
              );
            })
          )}

          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
              fill="rgb(96, 165, 250)"
            >
              <polygon points="0 0, 10 3, 0 6" />
            </marker>
          </defs>

          {/* Draw nodes (services) */}
          {graphNodes.map((node) => {
            const isSelected = selectedService?.id === node.id;
            const isRelated =
              selectedService &&
              (node.dependencies.dependsOn.includes(selectedService.id) ||
                node.dependencies.usedBy.includes(selectedService.id));

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => handleServiceClick(node)}
                className="cursor-pointer"
              >
                {/* Node background */}
                <rect
                  width="100"
                  height="80"
                  rx="4"
                  className={clsx(
                    'transition-all border-2',
                    getTierColor(node.tier),
                    isSelected && 'ring-2 ring-accent-blue ring-offset-2',
                    isRelated && 'opacity-80'
                  )}
                  strokeWidth={isSelected ? 3 : 2}
                />

                {/* Service name */}
                <text
                  x="50"
                  y="25"
                  textAnchor="middle"
                  className="text-xs font-medium fill-text-1"
                  style={{ fontSize: '11px' }}
                >
                  {node.name.length > 14
                    ? node.name.substring(0, 12) + '...'
                    : node.name}
                </text>

                {/* Tier badge */}
                <text
                  x="50"
                  y="42"
                  textAnchor="middle"
                  className="text-[10px] fill-text-3"
                  style={{ fontSize: '9px' }}
                >
                  {node.tier}
                </text>

                {/* Metrics */}
                <text
                  x="50"
                  y="58"
                  textAnchor="middle"
                  className={clsx(
                    'text-[10px]',
                    node.metrics.testCoverage >= 80
                      ? 'fill-accent-green'
                      : node.metrics.testCoverage >= 60
                      ? 'fill-accent-amber'
                      : 'fill-accent-red'
                  )}
                  style={{ fontSize: '9px' }}
                >
                  {node.metrics.testCoverage}% coverage
                </text>

                {/* Active tasks badge */}
                {node.activeTasks.length > 0 && (
                  <circle
                    cx="90"
                    cy="10"
                    r="8"
                    className="fill-accent-blue"
                  />
                )}
                {node.activeTasks.length > 0 && (
                  <text
                    x="90"
                    y="14"
                    textAnchor="middle"
                    className="text-[10px] fill-white font-medium"
                    style={{ fontSize: '9px' }}
                  >
                    {node.activeTasks.length}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-border-1 bg-bg-1 shrink-0">
        <div className="flex items-center gap-4 text-xs text-text-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-2 border-accent-red bg-accent-red/10" />
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-2 border-accent-amber bg-accent-amber/10" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-2 border-accent-blue bg-accent-blue/10" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-2 border-text-3 bg-bg-2" />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-3 h-3 rounded-full bg-accent-blue" />
            <span>Active tasks</span>
          </div>
        </div>
      </div>

      {/* Selected service detail (overlay) */}
      {selectedService && (
        <div className="absolute bottom-4 right-4 w-80 bg-bg-1 border border-border-1 rounded-lg shadow-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-text-1">{selectedService.name}</h3>
              <p className="text-xs text-text-3 mt-0.5">{selectedService.ownerTeam}</p>
            </div>
            <button
              onClick={() => setSelectedService(null)}
              className="p-1 hover:bg-bg-2 rounded transition-colors"
            >
              <span className="text-text-3">×</span>
            </button>
          </div>
          <p className="text-xs text-text-2 mb-3">{selectedService.description}</p>
          <div className="space-y-2 text-xs">
            {selectedService.dependencies.dependsOn.length > 0 && (
              <div>
                <span className="text-text-3">Depends on: </span>
                <span className="text-accent-blue">
                  {selectedService.dependencies.dependsOn.length} service(s)
                </span>
              </div>
            )}
            {selectedService.dependencies.usedBy.length > 0 && (
              <div>
                <span className="text-text-3">Used by: </span>
                <span className="text-accent-green">
                  {selectedService.dependencies.usedBy.length} service(s)
                </span>
              </div>
            )}
            {selectedService.activeTasks.length > 0 && (
              <div>
                <span className="text-text-3">Active tasks: </span>
                <span className="text-accent-amber">{selectedService.activeTasks.length}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
