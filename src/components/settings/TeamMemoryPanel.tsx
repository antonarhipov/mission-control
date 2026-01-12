import { useState } from 'react';
import { Users, Plus, Trash2, Settings, UserPlus, Workflow } from 'lucide-react';
import type { Team, TeamMemory, PipelineConfiguration } from '@/types';
import { useV3DataModel } from '@/hooks/useV3DataModel';
import { PipelineVisualEditor } from './PipelineVisualEditor';
import { TeamAgentManager } from './TeamAgentManager';

interface TeamMemoryPanelProps {
  teams: Team[];
  memories: Record<string, TeamMemory>; // teamId -> memory
  onUpdateMemory: (teamId: string, memory: TeamMemory) => void;
  onUpdatePipeline?: (teamId: string, pipeline: PipelineConfiguration) => void;
  onUpdateTeam?: (team: Team) => void;
}

type TabId = 'pipeline' | 'members' | 'memory';

export function TeamMemoryPanel({
  teams,
  memories,
  onUpdateMemory,
  onUpdatePipeline,
  onUpdateTeam,
}: TeamMemoryPanelProps) {
  const { agents } = useV3DataModel();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(
    teams.length > 0 ? teams[0].id : null
  );
  const [activeTab, setActiveTab] = useState<TabId>('pipeline');

  const selectedTeam = teams.find(t => t.id === selectedTeamId);
  const memory = selectedTeamId ? memories[selectedTeamId] : null;

  const handleAddDecision = (item: string) => {
    if (!selectedTeamId || !memory || !item.trim()) return;

    const updatedMemory = { ...memory };
    updatedMemory.sharedDecisions = [...updatedMemory.sharedDecisions, item.trim()];
    onUpdateMemory(selectedTeamId, updatedMemory);
  };

  const handleRemoveDecision = (index: number) => {
    if (!selectedTeamId || !memory) return;

    const updatedMemory = { ...memory };
    updatedMemory.sharedDecisions = updatedMemory.sharedDecisions.filter((_, i) => i !== index);
    onUpdateMemory(selectedTeamId, updatedMemory);
  };

  return (
    <div className="flex h-full bg-bg-0">
      {/* Left: Team List */}
      <div className="w-64 border-r border-border-1 overflow-y-auto">
        <div className="p-4 border-b border-border-1">
          <h3 className="text-sm font-semibold text-text-1 uppercase tracking-wide">
            Teams
          </h3>
        </div>
        <div className="p-2">
          {teams.map(team => (
            <button
              key={team.id}
              onClick={() => setSelectedTeamId(team.id)}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                selectedTeamId === team.id
                  ? 'bg-accent-blue/10 text-accent-blue'
                  : 'hover:bg-bg-1 text-text-1'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{team.name}</div>
                  <div className="text-xs text-text-3">{team.agentIds.length} agents</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Team Details */}
      {selectedTeam && memory ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Team Header */}
          <div className="flex items-center gap-3 p-6 border-b border-border-1">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${selectedTeam.color}20` }}
            >
              <Users className="w-6 h-6" style={{ color: selectedTeam.color }} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-1">{selectedTeam.name}</h2>
              <div className="flex items-center gap-2 text-sm text-text-3">
                <span>{selectedTeam.agentIds.length} members</span>
                <span>•</span>
                <span>{selectedTeam.description}</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 px-6 py-2 border-b border-border-1 bg-bg-0">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded transition-colors text-sm font-medium
                ${
                  activeTab === 'pipeline'
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'text-text-2 hover:bg-bg-1 hover:text-text-1'
                }
              `}
            >
              <Workflow className="w-4 h-4" />
              <span>Pipeline</span>
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded transition-colors text-sm font-medium
                ${
                  activeTab === 'members'
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'text-text-2 hover:bg-bg-1 hover:text-text-1'
                }
              `}
            >
              <UserPlus className="w-4 h-4" />
              <span>Members</span>
            </button>
            <button
              onClick={() => setActiveTab('memory')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded transition-colors text-sm font-medium
                ${
                  activeTab === 'memory'
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'text-text-2 hover:bg-bg-1 hover:text-text-1'
                }
              `}
            >
              <Settings className="w-4 h-4" />
              <span>Memory</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {/* Pipeline Tab */}
            {activeTab === 'pipeline' && selectedTeam.pipeline && onUpdatePipeline && (
              <PipelineVisualEditor
                pipeline={selectedTeam.pipeline}
                agents={agents.filter(a => selectedTeam.agentIds.includes(a.id))}
                onChange={pipeline => onUpdatePipeline(selectedTeam.id, pipeline)}
              />
            )}

            {activeTab === 'pipeline' && !selectedTeam.pipeline && onUpdatePipeline && (
              <div className="p-6 flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <Workflow className="w-16 h-16 mx-auto mb-4 text-text-3 opacity-50" />
                  <h3 className="text-lg font-semibold text-text-1 mb-2">
                    No Pipeline Configured
                  </h3>
                  <p className="text-sm text-text-3 mb-6">
                    Create a custom pipeline to define how this team executes work.
                    You can add stages, assign agents, and configure the workflow.
                  </p>
                  <button
                    onClick={() => {
                      const stageId = `stage-${Date.now()}`;
                      const newPipeline: PipelineConfiguration = {
                        id: `pipeline-${selectedTeam.id}-${Date.now()}`,
                        name: `${selectedTeam.name} Pipeline`,
                        description: 'Custom execution workflow',
                        stages: [
                          {
                            id: stageId,
                            name: 'Start',
                            description: 'Initial stage - customize as needed',
                            assignedAgentIds: [],
                            order: 0,
                            nextStageIds: [],
                            position: { x: 400, y: 100 },
                            branchType: 'sequential',
                            color: '#388bfd',
                            requiredForCompletion: true,
                            estimatedDuration: '',
                          },
                        ],
                        entryStageIds: [stageId],
                        isValid: true,
                        validationErrors: [],
                        createdAt: new Date().toISOString(),
                      };

                      onUpdatePipeline(selectedTeam.id, newPipeline);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded font-medium transition-colors mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Pipeline</span>
                  </button>
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && onUpdateTeam && (
              <div className="p-6 overflow-y-auto">
                <TeamAgentManager
                  team={selectedTeam}
                  allAgents={agents}
                  onUpdateTeam={onUpdateTeam}
                />
              </div>
            )}

            {/* Memory Tab */}
            {activeTab === 'memory' && (
              <div className="p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Shared Decisions */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">
                      Shared Decisions
                    </h3>
                    <div className="space-y-2">
                      {memory.sharedDecisions.map((decision, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 px-3 py-2 bg-bg-1 rounded border border-border-1"
                        >
                          <span className="text-sm text-text-1 flex-1">{decision}</span>
                          <button
                            onClick={() => handleRemoveDecision(index)}
                            className="p-1 hover:bg-bg-2 rounded transition-colors"
                          >
                            <Trash2 className="w-3 h-3 text-accent-red" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const decision = prompt('Enter shared decision:');
                          if (decision) handleAddDecision(decision);
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-bg-1 hover:bg-bg-2 border border-dashed border-border-2 rounded text-sm text-text-2 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Decision</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-text-3">
          <div className="text-center">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Select a team to view memory</p>
          </div>
        </div>
      )}
    </div>
  );
}
