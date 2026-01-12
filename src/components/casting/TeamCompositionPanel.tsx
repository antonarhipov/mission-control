import { useState } from 'react';
import { GitBranch, Plus, X } from 'lucide-react';
import { AgentCard } from './AgentCard';
import type { Agent, AgentPersona, AgentMetrics } from '@/types';

interface AgentWithDetails extends Agent {
  persona?: AgentPersona;
  metrics?: AgentMetrics;
}

interface PipelineStage {
  id: string;
  name: string;
  description: string;
  agents: AgentWithDetails[];
  color: string;
}

interface TeamCompositionPanelProps {
  stages: PipelineStage[];
  allAgents: AgentWithDetails[];
  onAddAgent: (stageId: string, agentId: string) => void;
  onRemoveAgent: (stageId: string, agentId: string) => void;
}

export function TeamCompositionPanel({
  stages,
  allAgents,
  onAddAgent,
  onRemoveAgent,
}: TeamCompositionPanelProps) {
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  const handleDragOver = (event: React.DragEvent, stageId: string) => {
    event.preventDefault();
    setDragOverStage(stageId);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (event: React.DragEvent, stageId: string) => {
    event.preventDefault();
    setDragOverStage(null);

    const agentId = event.dataTransfer.getData('agentId');
    if (agentId) {
      onAddAgent(stageId, agentId);
    }
  };

  const getAgentById = (agentId: string): AgentWithDetails | undefined => {
    return allAgents.find(a => a.id === agentId);
  };

  return (
    <div className="flex flex-col h-full bg-bg-0">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border-1">
        <div className="flex items-center gap-2 mb-1">
          <GitBranch className="w-5 h-5 text-accent-green" />
          <h2 className="text-lg font-semibold text-text-1">Team Composition</h2>
        </div>
        <p className="text-sm text-text-3">
          Assign agents to pipeline stages
        </p>
      </div>

      {/* Pipeline Stages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {stages.map(stage => (
            <div key={stage.id} className="bg-bg-0 rounded-lg border border-border-1">
              {/* Stage Header */}
              <div className={`px-4 py-3 border-b border-border-1 bg-bg-1`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                    <h3 className="text-sm font-semibold text-text-1">{stage.name}</h3>
                    <span className="text-xs text-text-3">
                      ({stage.agents.length} agent{stage.agents.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                </div>
                <p className="text-xs text-text-3 mt-1">{stage.description}</p>
              </div>

              {/* Drop Zone */}
              <div
                onDragOver={(e) => handleDragOver(e, stage.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage.id)}
                className={`p-4 min-h-[120px] transition-all ${
                  dragOverStage === stage.id
                    ? 'bg-accent-blue/5 border-2 border-dashed border-accent-blue'
                    : 'bg-bg-0'
                }`}
              >
                {stage.agents.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-text-3">
                    <div className="text-center">
                      <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">
                        {dragOverStage === stage.id
                          ? 'Drop agent here'
                          : 'Drag agents here or click to add'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {stage.agents.map(agent => {
                      const agentDetails = getAgentById(agent.id);
                      return (
                        <div key={agent.id} className="relative">
                          <AgentCard
                            agent={agent}
                            persona={agentDetails?.persona}
                            metrics={agentDetails?.metrics}
                            compact={true}
                          />
                          <button
                            onClick={() => onRemoveAgent(stage.id, agent.id)}
                            className="absolute -top-2 -right-2 p-1 bg-accent-red hover:bg-accent-red/80 text-white rounded-full shadow-lg transition-colors"
                            title="Remove agent"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-border-1 bg-bg-1">
        <div className="flex items-center justify-between text-xs text-text-3">
          <span>Total agents assigned:</span>
          <span className="font-semibold text-text-1">
            {stages.reduce((sum, stage) => sum + stage.agents.length, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
