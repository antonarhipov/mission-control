import { TrendingUp, TrendingDown, Minus, DollarSign, Zap, Target } from 'lucide-react';
import type { Agent, AgentPersona, AgentMetrics } from '@/types';

interface AgentCardProps {
  agent: Agent;
  persona?: AgentPersona;
  metrics?: AgentMetrics;
  selected?: boolean;
  draggable?: boolean;
  onSelect?: (agentId: string) => void;
  onDragStart?: (event: React.DragEvent, agentId: string) => void;
  compact?: boolean;
}

export function AgentCard({
  agent,
  persona,
  metrics,
  selected = false,
  draggable = false,
  onSelect,
  onDragStart,
  compact = false,
}: AgentCardProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(agent.id);
    }
  };

  const handleDragStart = (event: React.DragEvent) => {
    if (onDragStart) {
      onDragStart(event, agent.id);
    }
  };

  // Get style icon based on persona
  const getStyleIcon = () => {
    if (!persona) return null;
    switch (persona.style) {
      case 'thorough':
        return <Target className="w-3 h-3 text-accent-blue" />;
      case 'fast':
        return <Zap className="w-3 h-3 text-accent-amber" />;
      case 'creative':
        return <TrendingUp className="w-3 h-3 text-accent-purple" />;
      case 'conservative':
        return <Minus className="w-3 h-3 text-accent-cyan" />;
    }
  };

  // Get performance indicator based on approval rate
  const getPerformanceIndicator = () => {
    if (!metrics) {
      return <Minus className="w-3 h-3 text-text-3" />;
    }
    if (metrics.approvalRate >= 90) {
      return <TrendingUp className="w-3 h-3 text-accent-green" />;
    } else if (metrics.approvalRate >= 75) {
      return <Minus className="w-3 h-3 text-text-3" />;
    } else {
      return <TrendingDown className="w-3 h-3 text-accent-red" />;
    }
  };

  if (compact) {
    return (
      <div
        draggable={draggable}
        onDragStart={handleDragStart}
        onClick={handleClick}
        className={`
          flex items-center gap-2 px-3 py-2 rounded border transition-all cursor-pointer
          ${selected
            ? 'bg-accent-blue/10 border-accent-blue'
            : 'bg-bg-1 border-border-1 hover:border-border-2'
          }
          ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}
        `}
      >
        <span className="text-xl">{agent.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-text-1 truncate">{agent.name}</div>
          <div className="text-xs text-text-3 capitalize">{agent.role}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      draggable={draggable}
      onDragStart={handleDragStart}
      onClick={handleClick}
      className={`
        bg-bg-0 rounded-lg border p-4 transition-all
        ${selected
          ? 'border-accent-blue shadow-lg ring-2 ring-accent-blue/20'
          : 'border-border-1 hover:border-border-2 hover:shadow-md'
        }
        ${draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{agent.emoji}</span>
          <div>
            <div className="text-base font-semibold text-text-1">{agent.name}</div>
            <div className="text-xs text-text-3 capitalize">{agent.role}</div>
          </div>
        </div>
        {metrics && (
          <div className="flex items-center gap-1 px-2 py-1 bg-bg-1 rounded">
            {getPerformanceIndicator()}
            <span className="text-xs font-medium text-text-2">
              {metrics.approvalRate}%
            </span>
          </div>
        )}
      </div>

      {/* Persona */}
      {persona && (
        <div className="space-y-2 mb-3 pb-3 border-b border-border-1">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              {getStyleIcon()}
              <span className="text-text-3">Style:</span>
              <span className="text-text-1 capitalize font-medium">{persona.style}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-text-3">Risk:</span>
              <span className="text-text-1 capitalize font-medium">{persona.riskTolerance}</span>
            </div>
          </div>
          {persona.specialty && (
            <div className="text-xs">
              <span className="text-text-3">Specialty:</span>
              <span className="text-text-1 ml-1 font-medium">{persona.specialty}</span>
            </div>
          )}
        </div>
      )}

      {/* Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-bg-1 rounded p-2">
            <div className="text-xs text-text-3 mb-1">Tasks</div>
            <div className="text-lg font-bold text-text-1">{metrics.tasksCompleted}</div>
          </div>
          <div className="bg-bg-1 rounded p-2">
            <div className="flex items-center gap-1 text-xs text-text-3 mb-1">
              <DollarSign className="w-3 h-3" />
              <span>Avg Cost</span>
            </div>
            <div className="text-lg font-bold text-text-1">${metrics.avgCostPerTask.toFixed(2)}</div>
          </div>
        </div>
      )}

      {/* Selection indicator */}
      {selected && (
        <div className="mt-3 flex items-center justify-center gap-1 text-xs font-medium text-accent-blue">
          <div className="w-1.5 h-1.5 bg-accent-blue rounded-full animate-pulse" />
          <span>Selected</span>
        </div>
      )}
    </div>
  );
}
