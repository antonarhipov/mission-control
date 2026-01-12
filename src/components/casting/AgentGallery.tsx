import { useState } from 'react';
import { Users, Filter } from 'lucide-react';
import { AgentCard } from './AgentCard';
import type { Agent, AgentRole, AgentPersona, AgentMetrics } from '@/types';

interface AgentWithDetails extends Agent {
  persona?: AgentPersona;
  metrics?: AgentMetrics;
}

interface AgentGalleryProps {
  agents: AgentWithDetails[];
  selectedAgents?: string[];
  onSelectAgent?: (agentId: string) => void;
  onDragStart?: (event: React.DragEvent, agentId: string) => void;
  draggable?: boolean;
}

export function AgentGallery({
  agents,
  selectedAgents = [],
  onSelectAgent,
  onDragStart,
  draggable = false,
}: AgentGalleryProps) {
  const [filterRole, setFilterRole] = useState<AgentRole | 'all'>('all');
  const [filterStyle, setFilterStyle] = useState<'all' | 'thorough' | 'fast' | 'creative' | 'conservative'>('all');

  // Filter agents
  const filteredAgents = agents.filter(agent => {
    if (filterRole !== 'all' && agent.role !== filterRole) return false;
    if (filterStyle !== 'all' && agent.persona?.style !== filterStyle) return false;
    return true;
  });

  // Get unique roles
  const roles: AgentRole[] = ['implementer', 'architect', 'tester', 'reviewer', 'docs'];

  return (
    <div className="flex flex-col h-full bg-bg-0">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-accent-purple" />
            <h2 className="text-lg font-semibold text-text-1">Agent Roster</h2>
          </div>
          <div className="text-sm text-text-3">{filteredAgents.length} available</div>
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-text-3" />
            <span className="text-xs font-medium text-text-3 uppercase">Role:</span>
            <div className="flex items-center gap-1 flex-wrap">
              <button
                onClick={() => setFilterRole('all')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  filterRole === 'all'
                    ? 'bg-accent-blue text-white'
                    : 'bg-bg-2 text-text-2 hover:bg-bg-3'
                }`}
              >
                All
              </button>
              {roles.map(role => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`px-2 py-1 rounded text-xs font-medium capitalize transition-colors ${
                    filterRole === role
                      ? 'bg-accent-blue text-white'
                      : 'bg-bg-2 text-text-2 hover:bg-bg-3'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-text-3" />
            <span className="text-xs font-medium text-text-3 uppercase">Style:</span>
            <div className="flex items-center gap-1 flex-wrap">
              <button
                onClick={() => setFilterStyle('all')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  filterStyle === 'all'
                    ? 'bg-accent-blue text-white'
                    : 'bg-bg-2 text-text-2 hover:bg-bg-3'
                }`}
              >
                All
              </button>
              {(['thorough', 'fast', 'creative', 'conservative'] as const).map(style => (
                <button
                  key={style}
                  onClick={() => setFilterStyle(style)}
                  className={`px-2 py-1 rounded text-xs font-medium capitalize transition-colors ${
                    filterStyle === style
                      ? 'bg-accent-blue text-white'
                      : 'bg-bg-2 text-text-2 hover:bg-bg-3'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredAgents.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-3">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No agents match the filters</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredAgents.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                persona={agent.persona}
                metrics={agent.metrics}
                selected={selectedAgents.includes(agent.id)}
                draggable={draggable}
                onSelect={onSelectAgent}
                onDragStart={onDragStart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Help Text */}
      {draggable && (
        <div className="flex-shrink-0 px-4 py-3 border-t border-border-1 bg-bg-1">
          <p className="text-xs text-text-3 text-center">
            💡 Drag agents to pipeline stages to build your team
          </p>
        </div>
      )}
    </div>
  );
}
