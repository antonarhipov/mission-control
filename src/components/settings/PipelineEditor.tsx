import { useState } from 'react';
import { Plus, Trash2, GripVertical, Edit2 } from 'lucide-react';
import type { Team, PipelineConfiguration, TeamPipelineStage, Agent } from '@/types';

interface PipelineEditorProps {
  team: Team;
  agents: Agent[];
  onUpdatePipeline: (pipeline: PipelineConfiguration) => void;
}

export function PipelineEditor({ team, agents, onUpdatePipeline }: PipelineEditorProps) {
  const [editingStageId, setEditingStageId] = useState<string | null>(null);

  if (!team.pipeline) {
    return (
      <div className="p-6 text-center text-text-3">
        <p>No pipeline configuration found for this team</p>
      </div>
    );
  }

  const handleAddStage = () => {
    const newStage: TeamPipelineStage = {
      id: `stage-${Date.now()}`,
      name: 'New Stage',
      description: '',
      assignedAgentIds: [],
      order: team.pipeline!.stages.length,
      requiredForCompletion: true,
    };

    onUpdatePipeline({
      ...team.pipeline!,
      stages: [...team.pipeline!.stages, newStage],
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDeleteStage = (stageId: string) => {
    const updatedStages = team.pipeline!.stages
      .filter(s => s.id !== stageId)
      .map((stage, index) => ({ ...stage, order: index })); // Reindex order

    onUpdatePipeline({
      ...team.pipeline!,
      stages: updatedStages,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleUpdateStage = (stageId: string, updates: Partial<TeamPipelineStage>) => {
    onUpdatePipeline({
      ...team.pipeline!,
      stages: team.pipeline!.stages.map(s =>
        s.id === stageId ? { ...s, ...updates } : s
      ),
      updatedAt: new Date().toISOString(),
    });
  };

  // TODO: Implement drag-and-drop reordering
  // const handleReorderStages = (fromIndex: number, toIndex: number) => {
  //   const reordered = Array.from(team.pipeline!.stages);
  //   const [removed] = reordered.splice(fromIndex, 1);
  //   reordered.splice(toIndex, 0, removed);
  //
  //   // Update order values
  //   const updated = reordered.map((stage, index) => ({
  //     ...stage,
  //     order: index,
  //   }));
  //
  //   onUpdatePipeline({
  //     ...team.pipeline!,
  //     stages: updated,
  //     updatedAt: new Date().toISOString(),
  //   });
  // };

  // Filter agents that belong to this team
  const teamAgents = agents.filter(a => team.agentIds.includes(a.id));

  return (
    <div className="space-y-4">
      {/* Pipeline Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-text-1">{team.pipeline.name}</h3>
          <p className="text-sm text-text-3">{team.pipeline.description}</p>
        </div>
        <button
          onClick={handleAddStage}
          className="flex items-center gap-2 px-3 py-1.5 bg-accent-blue hover:bg-accent-blue/80 text-white rounded text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Stage</span>
        </button>
      </div>

      {/* Pipeline Stages */}
      <div className="space-y-2">
        {team.pipeline.stages
          .sort((a, b) => a.order - b.order)
          .map((stage) => (
            <div
              key={stage.id}
              className="p-4 bg-bg-1 rounded-lg border border-border-1"
            >
              <div className="flex items-start gap-3">
                {/* Drag Handle */}
                <button
                  className="mt-1 cursor-move text-text-3 hover:text-text-1"
                  title="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4" />
                </button>

                {/* Stage Content */}
                <div className="flex-1">
                  {editingStageId === stage.id ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={stage.name}
                        onChange={e => handleUpdateStage(stage.id, { name: e.target.value })}
                        className="w-full px-3 py-2 bg-bg-0 border border-border-1 rounded text-text-1 text-sm"
                        placeholder="Stage name..."
                      />
                      <textarea
                        value={stage.description || ''}
                        onChange={e => handleUpdateStage(stage.id, { description: e.target.value })}
                        className="w-full px-3 py-2 bg-bg-0 border border-border-1 rounded text-text-1 text-sm"
                        rows={2}
                        placeholder="Stage description..."
                      />

                      {/* Color Picker */}
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-text-2">Color:</label>
                        <input
                          type="color"
                          value={stage.color || '#388bfd'}
                          onChange={e => handleUpdateStage(stage.id, { color: e.target.value })}
                          className="w-12 h-8 rounded cursor-pointer"
                        />
                      </div>

                      {/* Estimated Duration */}
                      <input
                        type="text"
                        value={stage.estimatedDuration || ''}
                        onChange={e => handleUpdateStage(stage.id, { estimatedDuration: e.target.value })}
                        className="w-full px-3 py-2 bg-bg-0 border border-border-1 rounded text-text-1 text-sm"
                        placeholder="Estimated duration (e.g., 2-4 hours)..."
                      />

                      {/* Agent Assignment */}
                      <div>
                        <label className="block text-sm font-medium text-text-2 mb-2">
                          Assigned Agents
                        </label>
                        <div className="space-y-2">
                          {teamAgents.map(agent => (
                            <label key={agent.id} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={stage.assignedAgentIds.includes(agent.id)}
                                onChange={e => {
                                  const newAgents = e.target.checked
                                    ? [...stage.assignedAgentIds, agent.id]
                                    : stage.assignedAgentIds.filter(id => id !== agent.id);
                                  handleUpdateStage(stage.id, { assignedAgentIds: newAgents });
                                }}
                                className="w-4 h-4 rounded"
                              />
                              <span className="text-lg">{agent.emoji}</span>
                              <span className="text-sm text-text-1">{agent.name}</span>
                              <span className="text-xs text-text-3">({agent.role})</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2 border-t border-border-1">
                        <button
                          onClick={() => setEditingStageId(null)}
                          className="px-3 py-1.5 bg-accent-green hover:bg-accent-green/80 text-white rounded text-sm font-medium"
                        >
                          Done
                        </button>
                        <label className="flex items-center gap-2 text-sm text-text-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={stage.requiredForCompletion}
                            onChange={e => handleUpdateStage(stage.id, { requiredForCompletion: e.target.checked })}
                            className="w-4 h-4 rounded"
                          />
                          Required for completion
                        </label>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {stage.color && (
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: stage.color }}
                            />
                          )}
                          <h4 className="text-sm font-semibold text-text-1">{stage.name}</h4>
                          {!stage.requiredForCompletion && (
                            <span className="text-xs px-2 py-0.5 bg-bg-2 text-text-3 rounded">
                              Optional
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingStageId(stage.id)}
                            className="p-1.5 hover:bg-bg-2 rounded transition-colors"
                            title="Edit stage"
                          >
                            <Edit2 className="w-3 h-3 text-text-3" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete stage "${stage.name}"?`)) {
                                handleDeleteStage(stage.id);
                              }
                            }}
                            className="p-1.5 hover:bg-bg-2 rounded transition-colors"
                            title="Delete stage"
                          >
                            <Trash2 className="w-3 h-3 text-accent-red" />
                          </button>
                        </div>
                      </div>

                      {stage.description && (
                        <p className="text-xs text-text-3 mb-2">{stage.description}</p>
                      )}

                      {stage.estimatedDuration && (
                        <p className="text-xs text-text-3 mb-2">
                          Est. duration: {stage.estimatedDuration}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-xs text-text-2">
                        <span className="text-text-3">Agents:</span>
                        {stage.assignedAgentIds.length === 0 ? (
                          <span className="text-text-3">None assigned</span>
                        ) : (
                          <div className="flex items-center gap-2 flex-wrap">
                            {stage.assignedAgentIds.map(agentId => {
                              const agent = teamAgents.find(a => a.id === agentId);
                              return agent ? (
                                <span key={agentId} className="flex items-center gap-1">
                                  <span className="text-base">{agent.emoji}</span>
                                  <span>{agent.name}</span>
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
