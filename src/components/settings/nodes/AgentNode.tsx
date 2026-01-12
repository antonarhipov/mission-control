import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Users } from 'lucide-react';
import type { PipelineNodeData } from '@/types/pipeline-editor';

export const AgentNode = memo(({ data, selected }: NodeProps<PipelineNodeData>) => {
  const { stage, agents, isEntryPoint, isExitPoint } = data;

  return (
    <div
      className={`
        px-4 py-3 rounded-lg border-2 bg-bg-1 min-w-[200px] max-w-[240px]
        transition-all
        ${selected ? 'border-accent-blue shadow-lg scale-105' : 'border-border-1 hover:border-border-2'}
      `}
      style={{
        borderColor: selected ? '#388bfd' : stage.color || '#4B5563',
      }}
    >
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-accent-blue border-2 border-white"
        style={{ top: -6 }}
      />

      {/* Badges */}
      <div className="flex gap-1 mb-2">
        {isEntryPoint && (
          <span className="text-[10px] px-1.5 py-0.5 bg-accent-green/20 text-accent-green rounded uppercase font-semibold">
            Entry
          </span>
        )}
        {isExitPoint && (
          <span className="text-[10px] px-1.5 py-0.5 bg-accent-amber/20 text-accent-amber rounded uppercase font-semibold">
            Exit
          </span>
        )}
        {!stage.requiredForCompletion && (
          <span className="text-[10px] px-1.5 py-0.5 bg-bg-3 text-text-3 rounded uppercase font-semibold">
            Optional
          </span>
        )}
      </div>

      {/* Stage Color Indicator */}
      {stage.color && (
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: stage.color }}
          />
          <h4 className="text-sm font-semibold text-text-1 truncate flex-1">
            {stage.name}
          </h4>
        </div>
      )}

      {!stage.color && (
        <h4 className="text-sm font-semibold text-text-1 truncate mb-2">
          {stage.name}
        </h4>
      )}

      {/* Description */}
      {stage.description && (
        <p className="text-xs text-text-3 mb-2 line-clamp-2">
          {stage.description}
        </p>
      )}

      {/* Branch Type Badge */}
      {stage.branchType && stage.branchType !== 'sequential' && (
        <div className="mb-2">
          <span className="text-[10px] px-1.5 py-0.5 bg-accent-blue/10 text-accent-blue rounded font-medium">
            {stage.branchType}
          </span>
        </div>
      )}

      {/* Assigned Agents */}
      <div className="flex items-center gap-2">
        {agents.length > 0 ? (
          <>
            <div className="flex -space-x-2">
              {agents.slice(0, 4).map(agent => (
                <div
                  key={agent.id}
                  className="w-7 h-7 rounded-full bg-bg-2 border-2 border-bg-1 flex items-center justify-center text-sm"
                  title={agent.name}
                  style={{
                    backgroundColor: `${agent.color}20`,
                    borderColor: agent.color,
                  }}
                >
                  {agent.emoji}
                </div>
              ))}
              {agents.length > 4 && (
                <div
                  className="w-7 h-7 rounded-full bg-bg-3 border-2 border-bg-1 flex items-center justify-center text-xs text-text-3 font-medium"
                  title={`${agents.length - 4} more`}
                >
                  +{agents.length - 4}
                </div>
              )}
            </div>
            <span className="text-xs text-text-3">
              {agents.length} {agents.length === 1 ? 'agent' : 'agents'}
            </span>
          </>
        ) : (
          <div className="flex items-center gap-2 text-text-3">
            <Users className="w-4 h-4" />
            <span className="text-xs">No agents</span>
          </div>
        )}
      </div>

      {/* Estimated Duration */}
      {stage.estimatedDuration && (
        <div className="mt-2 text-xs text-text-3">
          Est: {stage.estimatedDuration}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-accent-blue border-2 border-white"
        style={{ bottom: -6 }}
      />
    </div>
  );
});

AgentNode.displayName = 'AgentNode';
