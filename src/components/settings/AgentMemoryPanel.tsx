import { useState } from 'react';
import { Brain, Edit, Save, X, Plus, Trash2, Code, Award } from 'lucide-react';
import type { Agent, AgentMemory, AgentSkill, AgentSkillAssignment } from '@/types';

interface AgentMemoryPanelProps {
  agents: Agent[];
  memories: Record<string, AgentMemory>; // agentId -> memory
  skills: Array<AgentSkill & { id: string }>; // Available skills catalogue
  onUpdateMemory: (agentId: string, memory: AgentMemory) => void;
}

export function AgentMemoryPanel({ agents, memories, skills, onUpdateMemory }: AgentMemoryPanelProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(
    agents.length > 0 ? agents[0].id : null
  );
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [showSkillAssignModal, setShowSkillAssignModal] = useState(false);

  const selectedAgent = agents.find(a => a.id === selectedAgentId);
  const memory = selectedAgentId ? memories[selectedAgentId] : null;

  // Get unassigned skills (skills not yet assigned to this agent)
  const assignedSkillIds = new Set(memory?.skills?.map(s => s.skillId) || []);
  const availableSkills = skills.filter(s => s.isActive && !assignedSkillIds.has(s.id));

  const handleStartEdit = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  const handleSaveEdit = () => {
    if (!selectedAgentId || !memory || !editingField) return;

    const updatedMemory = { ...memory };
    if (editingField === 'projectUnderstanding') {
      updatedMemory.projectUnderstanding = editValue;
    } else if (editingField === 'conventions') {
      updatedMemory.conventions = editValue.split('\n').filter(c => c.trim());
    }

    onUpdateMemory(selectedAgentId, updatedMemory);
    setEditingField(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleAddConvention = (item: string) => {
    if (!selectedAgentId || !memory || !item.trim()) return;

    const updatedMemory = { ...memory };
    updatedMemory.conventions = [...updatedMemory.conventions, item.trim()];
    onUpdateMemory(selectedAgentId, updatedMemory);
  };

  const handleRemoveConvention = (index: number) => {
    if (!selectedAgentId || !memory) return;

    const updatedMemory = { ...memory };
    updatedMemory.conventions = updatedMemory.conventions.filter((_, i) => i !== index);
    onUpdateMemory(selectedAgentId, updatedMemory);
  };

  const handleAssignSkill = (skillId: string) => {
    if (!selectedAgentId || !memory) return;

    const updatedMemory = { ...memory };
    const newAssignment: AgentSkillAssignment = {
      skillId,
      assignedAt: new Date().toISOString(),
      usageCount: 0,
    };

    updatedMemory.skills = [...(updatedMemory.skills || []), newAssignment];
    onUpdateMemory(selectedAgentId, updatedMemory);
    setShowSkillAssignModal(false);
  };

  const handleRemoveSkill = (skillId: string) => {
    if (!selectedAgentId || !memory) return;

    const updatedMemory = { ...memory };
    updatedMemory.skills = (updatedMemory.skills || []).filter(s => s.skillId !== skillId);
    onUpdateMemory(selectedAgentId, updatedMemory);
  };

  return (
    <div className="flex h-full bg-bg-0">
      {/* Left: Agent List */}
      <div className="w-64 border-r border-border-1 overflow-y-auto">
        <div className="p-4 border-b border-border-1">
          <h3 className="text-sm font-semibold text-text-1 uppercase tracking-wide">
            Agents
          </h3>
        </div>
        <div className="p-2">
          {agents.map(agent => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                selectedAgentId === agent.id
                  ? 'bg-accent-blue/10 text-accent-blue'
                  : 'hover:bg-bg-1 text-text-1'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{agent.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{agent.name}</div>
                  <div className="text-xs text-text-3 capitalize">{agent.role}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Memory Details */}
      {selectedAgent && memory ? (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-border-1">
              <span className="text-3xl">{selectedAgent.emoji}</span>
              <div>
                <h2 className="text-xl font-semibold text-text-1">{selectedAgent.name}</h2>
                <div className="flex items-center gap-2 text-sm text-text-3">
                  <Brain className="w-4 h-4" />
                  <span>Agent Memory & Knowledge</span>
                </div>
              </div>
            </div>

            {/* Project Understanding */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">
                  Project Understanding
                </h3>
                {editingField !== 'projectUnderstanding' && (
                  <button
                    onClick={() => handleStartEdit('projectUnderstanding', memory.projectUnderstanding)}
                    className="p-1 hover:bg-bg-1 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4 text-text-3" />
                  </button>
                )}
              </div>
              {editingField === 'projectUnderstanding' ? (
                <div className="space-y-2">
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full h-32 px-3 py-2 bg-bg-1 border border-border-1 rounded text-sm text-text-1 resize-none focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                    placeholder="Describe the agent's understanding of the project..."
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex items-center gap-1 px-3 py-1.5 bg-accent-green hover:bg-accent-green/80 text-white rounded text-sm font-medium transition-colors"
                    >
                      <Save className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1 px-3 py-1.5 bg-bg-2 hover:bg-bg-3 text-text-1 border border-border-1 rounded text-sm font-medium transition-colors"
                    >
                      <X className="w-3 h-3" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-bg-1 rounded-lg p-4 border border-border-1">
                  <p className="text-sm text-text-1 leading-relaxed whitespace-pre-wrap">
                    {memory.projectUnderstanding || 'No project understanding recorded yet.'}
                  </p>
                </div>
              )}
            </div>

            {/* Conventions */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">
                Known Conventions
              </h3>
              <div className="space-y-2">
                {memory.conventions.map((convention, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 px-3 py-2 bg-bg-1 rounded border border-border-1"
                  >
                    <span className="text-sm text-text-1 flex-1">{convention}</span>
                    <button
                      onClick={() => handleRemoveConvention(index)}
                      className="p-1 hover:bg-bg-2 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-accent-red" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const convention = prompt('Enter new convention:');
                    if (convention) handleAddConvention(convention);
                  }}
                  className="flex items-center gap-2 px-3 py-2 bg-bg-1 hover:bg-bg-2 border border-dashed border-border-2 rounded text-sm text-text-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Convention</span>
                </button>
              </div>
            </div>

            {/* Assigned Skills */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">
                  Assigned Skills
                </h3>
                <button
                  onClick={() => setShowSkillAssignModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-accent-blue hover:bg-accent-blue/80 text-white rounded text-sm font-medium transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Assign Skill</span>
                </button>
              </div>

              <div className="space-y-2">
                {(memory.skills || []).map((assignment) => {
                  const skill = skills.find(s => s.id === assignment.skillId);
                  if (!skill) return null;

                  return (
                    <div
                      key={assignment.skillId}
                      className="flex items-start gap-3 px-4 py-3 bg-bg-1 rounded-lg border border-border-1"
                    >
                      <Code className="w-5 h-5 text-accent-blue mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-text-1 mb-1">{skill.name}</h4>
                        <p className="text-xs text-text-2 mb-2">{skill.description}</p>
                        <div className="flex items-center gap-3 text-xs text-text-3">
                          <span className="capitalize">{skill.category}</span>
                          {assignment.usageCount !== undefined && assignment.usageCount > 0 && (
                            <>
                              <span>•</span>
                              <span>Used {assignment.usageCount} times</span>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveSkill(skill.id)}
                        className="p-1.5 hover:bg-bg-2 rounded transition-colors"
                        title="Remove skill"
                      >
                        <Trash2 className="w-4 h-4 text-accent-red" />
                      </button>
                    </div>
                  );
                })}

                {(memory.skills || []).length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center bg-bg-1 rounded-lg border border-dashed border-border-2">
                    <Award className="w-8 h-8 text-text-3 opacity-50 mb-2" />
                    <p className="text-sm text-text-3">No skills assigned yet</p>
                    <p className="text-xs text-text-3 mt-1">Click "Assign Skill" to add capabilities to this agent</p>
                  </div>
                )}
              </div>
            </div>

            {/* Past Decisions */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">
                Past Decisions
              </h3>
              <div className="space-y-3">
                {memory.pastDecisions.map((decision, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 bg-bg-1 rounded border border-border-1"
                  >
                    <div className="text-xs text-text-3 mb-1">Mission: {decision.missionId}</div>
                    <div className="text-sm text-text-1 mb-2">{decision.decision}</div>
                    <div className="text-xs text-text-2">
                      <span className="font-medium">Outcome:</span> {decision.outcome}
                    </div>
                  </div>
                ))}
                {memory.pastDecisions.length === 0 && (
                  <div className="text-center text-text-3 text-sm py-4">
                    No past decisions recorded yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-text-3">
          <div className="text-center">
            <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Select an agent to view memory</p>
          </div>
        </div>
      )}

      {/* Skill Assignment Modal */}
      {showSkillAssignModal && selectedAgentId && memory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-bg-0 rounded-lg border border-border-1 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-1">
              <h3 className="text-lg font-semibold text-text-1">Assign Skill to {selectedAgent?.name}</h3>
              <button
                onClick={() => setShowSkillAssignModal(false)}
                className="p-1 hover:bg-bg-1 rounded transition-colors"
              >
                <X className="w-5 h-5 text-text-3" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {availableSkills.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Code className="w-12 h-12 text-text-3 opacity-50 mb-3" />
                  <h4 className="text-lg font-semibold text-text-2 mb-2">No available skills</h4>
                  <p className="text-sm text-text-3 max-w-md">
                    All active skills have been assigned to this agent, or there are no active skills in the catalogue.
                  </p>
                  <p className="text-sm text-text-3 mt-2">
                    Go to the Skills tab to add new skills to the catalogue.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableSkills.map(skill => (
                    <div
                      key={skill.id}
                      className="p-4 bg-bg-1 rounded-lg border border-border-1 hover:border-border-2 transition-colors"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <Code className="w-5 h-5 text-accent-blue mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-text-1">{skill.name}</h4>
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-bg-2 text-text-3 capitalize">
                              {skill.category}
                            </span>
                            {skill.version && (
                              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-accent-blue/20 text-accent-blue">
                                v{skill.version}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-text-2">{skill.description}</p>
                        </div>
                      </div>

                      {/* Assign Button */}
                      <div className="flex justify-end pl-8">
                        <button
                          onClick={() => handleAssignSkill(skill.id)}
                          className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Assign Skill
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
