import { useState } from 'react';
import { X, Users } from 'lucide-react';
import { AgentGallery } from './AgentGallery';
import { TeamCompositionPanel } from './TeamCompositionPanel';
import { PipelineTemplates, defaultTemplates } from './PipelineTemplates';
import { TeamEstimate } from './TeamEstimate';
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

interface AgentCastingModalProps {
  agents: AgentWithDetails[];
  onClose: () => void;
  onConfirm: (stages: PipelineStage[]) => void;
}

export function AgentCastingModal({ agents, onClose, onConfirm }: AgentCastingModalProps) {
  const [view, setView] = useState<'templates' | 'custom'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(undefined);
  const [stages, setStages] = useState<PipelineStage[]>([
    {
      id: 'design',
      name: 'Design',
      description: 'Architecture and technical planning',
      agents: [],
      color: 'bg-accent-purple',
    },
    {
      id: 'implementation',
      name: 'Implementation',
      description: 'Code development and feature building',
      agents: [],
      color: 'bg-accent-blue',
    },
    {
      id: 'testing',
      name: 'Testing',
      description: 'Test development and validation',
      agents: [],
      color: 'bg-accent-green',
    },
    {
      id: 'review',
      name: 'Review',
      description: 'Code review and quality checks',
      agents: [],
      color: 'bg-accent-amber',
    },
    {
      id: 'documentation',
      name: 'Documentation',
      description: 'API docs and user guides',
      agents: [],
      color: 'bg-accent-cyan',
    },
  ]);

  const handleDragStart = (event: React.DragEvent, agentId: string) => {
    event.dataTransfer.setData('agentId', agentId);
    event.dataTransfer.effectAllowed = 'copy';
  };

  const handleAddAgent = (stageId: string, agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    // Check if agent already exists in this stage
    const stage = stages.find(s => s.id === stageId);
    if (stage?.agents.some(a => a.id === agentId)) return;

    setStages(prev =>
      prev.map(s =>
        s.id === stageId
          ? { ...s, agents: [...s.agents, agent] }
          : s
      )
    );
  };

  const handleRemoveAgent = (stageId: string, agentId: string) => {
    setStages(prev =>
      prev.map(s =>
        s.id === stageId
          ? { ...s, agents: s.agents.filter(a => a.id !== agentId) }
          : s
      )
    );
  };

  const handleApplyTemplate = (templateId: string) => {
    const template = defaultTemplates.find(t => t.id === templateId);
    if (!template) return;

    // Create stages from template
    const newStages: PipelineStage[] = template.stages.map((tStage, index) => ({
      id: tStage.id,
      name: tStage.name,
      description: '',
      agents: [],
      color: ['bg-accent-purple', 'bg-accent-blue', 'bg-accent-green', 'bg-accent-amber', 'bg-accent-cyan', 'bg-accent-red'][index % 6],
    }));

    setStages(newStages);
    setView('custom');
  };

  // Calculate estimates
  const totalAgents = stages.reduce((sum, stage) => sum + stage.agents.length, 0);
  const assignedAgents = stages.flatMap(s => s.agents);
  const avgCostForTeam = assignedAgents.reduce((sum, a) => sum + (a.metrics?.avgCostPerTask || 3.5), 0) / Math.max(assignedAgents.length, 1);

  const estimates = {
    teamSize: totalAgents,
    estimatedCost: {
      min: avgCostForTeam * 0.8 * stages.length * 0.5,
      max: avgCostForTeam * 1.2 * stages.length * 1.5,
      average: avgCostForTeam * stages.length,
    },
    estimatedTime: {
      min: `${Math.max(1, Math.floor(stages.length * 0.3))} days`,
      max: `${Math.ceil(stages.length * 1.2)} days`,
      average: `${Math.round(stages.length * 0.7 * 10) / 10} days`,
    },
    confidence: totalAgents > 0 ? Math.min(95, 60 + totalAgents * 5) : 50,
    warnings: [
      ...(totalAgents === 0 ? ['No agents assigned yet - add agents to get accurate estimates'] : []),
      ...(totalAgents > 10 ? ['Large team may have coordination overhead'] : []),
      ...(stages.some(s => s.agents.length === 0) ? ['Some stages have no agents assigned'] : []),
    ],
  };

  const handleConfirm = () => {
    if (totalAgents > 0) {
      onConfirm(stages);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-0 rounded-lg border border-border-1 max-w-[1600px] w-full h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-border-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-accent-purple" />
              <div>
                <h1 className="text-xl font-semibold text-text-1">Agent Casting</h1>
                <p className="text-sm text-text-3">Build your team and configure the pipeline</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-bg-1 rounded transition-colors"
            >
              <X className="w-5 h-5 text-text-3" />
            </button>
          </div>

          {/* View Tabs */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setView('templates')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'templates'
                  ? 'bg-accent-blue text-white'
                  : 'bg-bg-1 text-text-2 hover:bg-bg-2'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setView('custom')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === 'custom'
                  ? 'bg-accent-blue text-white'
                  : 'bg-bg-1 text-text-2 hover:bg-bg-2'
              }`}
            >
              Custom Team
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {view === 'templates' ? (
            <div className="h-full">
              <PipelineTemplates
                templates={defaultTemplates}
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
                onApplyTemplate={handleApplyTemplate}
              />
            </div>
          ) : (
            <div className="grid grid-cols-[400px_1fr_350px] h-full">
              {/* Left: Agent Gallery */}
              <div className="border-r border-border-1 overflow-hidden">
                <AgentGallery
                  agents={agents}
                  draggable={true}
                  onDragStart={handleDragStart}
                />
              </div>

              {/* Center: Team Composition */}
              <div className="border-r border-border-1 overflow-hidden">
                <TeamCompositionPanel
                  stages={stages}
                  allAgents={agents}
                  onAddAgent={handleAddAgent}
                  onRemoveAgent={handleRemoveAgent}
                />
              </div>

              {/* Right: Estimate */}
              <div className="overflow-y-auto p-4">
                <TeamEstimate
                  teamSize={estimates.teamSize}
                  estimatedCost={estimates.estimatedCost}
                  estimatedTime={estimates.estimatedTime}
                  confidence={estimates.confidence}
                  warnings={estimates.warnings}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-border-1 bg-bg-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-3">
              {totalAgents} agent{totalAgents !== 1 ? 's' : ''} assigned across {stages.length} stages
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-bg-2 hover:bg-bg-3 text-text-1 border border-border-1 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={totalAgents === 0}
                className="px-4 py-2 bg-accent-green hover:bg-accent-green/80 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
