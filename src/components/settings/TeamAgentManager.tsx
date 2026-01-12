import { Plus, Trash2 } from 'lucide-react';
import type { Team, Agent } from '@/types';

interface TeamAgentManagerProps {
  team: Team;
  allAgents: Agent[];
  onUpdateTeam: (team: Team) => void;
}

export function TeamAgentManager({ team, allAgents, onUpdateTeam }: TeamAgentManagerProps) {
  const teamAgents = allAgents.filter(a => team.agentIds.includes(a.id));
  const availableAgents = allAgents.filter(a => !team.agentIds.includes(a.id));

  const handleAddAgent = (agentId: string) => {
    onUpdateTeam({
      ...team,
      agentIds: [...team.agentIds, agentId],
    });
  };

  const handleRemoveAgent = (agentId: string) => {
    // Check if agent is used in pipeline stages
    const isUsedInPipeline = team.pipeline?.stages.some(stage =>
      stage.assignedAgentIds.includes(agentId)
    );

    if (isUsedInPipeline) {
      const agent = allAgents.find(a => a.id === agentId);
      alert(
        `Cannot remove ${agent?.name}: agent is assigned to pipeline stages.\n\nPlease remove the agent from all pipeline stages first.`
      );
      return;
    }

    onUpdateTeam({
      ...team,
      agentIds: team.agentIds.filter(id => id !== agentId),
    });
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Current Team Members */}
      <div>
        <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide mb-3">
          Team Members ({teamAgents.length})
        </h3>

        {teamAgents.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-border-1 rounded-lg">
            <p className="text-sm text-text-3">No agents in this team</p>
            <p className="text-xs text-text-3 mt-1">Add agents from the available list</p>
          </div>
        ) : (
          <div className="space-y-2">
            {teamAgents.map(agent => {
              const isUsedInPipeline = team.pipeline?.stages.some(stage =>
                stage.assignedAgentIds.includes(agent.id)
              );

              return (
                <div
                  key={agent.id}
                  className="flex items-center gap-3 p-3 bg-bg-1 rounded-lg border border-border-1 hover:bg-bg-2 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{
                      backgroundColor: `${agent.color}20`,
                      borderWidth: '2px',
                      borderColor: agent.color,
                    }}
                  >
                    {agent.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-text-1">{agent.name}</div>
                    <div className="text-xs text-text-3 capitalize">{agent.role}</div>
                    {isUsedInPipeline && (
                      <div className="text-xs text-accent-blue mt-0.5">
                        • Assigned to pipeline stages
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveAgent(agent.id)}
                    className={`p-2 rounded transition-colors ${
                      isUsedInPipeline
                        ? 'text-text-3 cursor-not-allowed opacity-50'
                        : 'hover:bg-bg-3 text-accent-red'
                    }`}
                    title={
                      isUsedInPipeline
                        ? 'Remove from pipeline stages first'
                        : 'Remove from team'
                    }
                    disabled={isUsedInPipeline}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Agents */}
      <div>
        <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide mb-3">
          Available Agents ({availableAgents.length})
        </h3>

        {availableAgents.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-border-1 rounded-lg">
            <p className="text-sm text-text-3">All agents are already in this team</p>
          </div>
        ) : (
          <div className="space-y-2">
            {availableAgents.map(agent => (
              <div
                key={agent.id}
                className="flex items-center gap-3 p-3 bg-bg-1 rounded-lg border border-border-1 hover:bg-bg-2 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{
                    backgroundColor: `${agent.color}20`,
                    borderWidth: '2px',
                    borderColor: agent.color,
                  }}
                >
                  {agent.emoji}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-text-1">{agent.name}</div>
                  <div className="text-xs text-text-3 capitalize">{agent.role}</div>
                </div>
                <button
                  onClick={() => handleAddAgent(agent.id)}
                  className="p-2 hover:bg-bg-3 rounded transition-colors"
                  title="Add to team"
                >
                  <Plus className="w-4 h-4 text-accent-blue" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
