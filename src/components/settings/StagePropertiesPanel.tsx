import { X, Trash2 } from 'lucide-react';
import type { TeamPipelineStage, Agent } from '@/types';

interface StagePropertiesPanelProps {
  stage: TeamPipelineStage | null;
  agents: Agent[];
  onUpdate: (stage: TeamPipelineStage) => void;
  onDelete: (stageId: string) => void;
  onClose: () => void;
}

export function StagePropertiesPanel({
  stage,
  agents,
  onUpdate,
  onDelete,
  onClose,
}: StagePropertiesPanelProps) {
  if (!stage) return null;

  return (
    <div className="flex-1 p-4 bg-bg-1 rounded-lg border border-border-1 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-text-1 uppercase tracking-wide">
          Stage Properties
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm(`Delete stage "${stage.name}"?`)) {
                onDelete(stage.id);
                onClose();
              }
            }}
            className="p-1.5 hover:bg-accent-red/10 rounded transition-colors"
            title="Delete stage"
          >
            <Trash2 className="w-4 h-4 text-accent-red" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-bg-2 rounded transition-colors"
            aria-label="Close properties"
          >
            <X className="w-4 h-4 text-text-3" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-text-2 mb-1.5">
            Stage Name
          </label>
          <input
            type="text"
            value={stage.name}
            onChange={e => onUpdate({ ...stage, name: e.target.value })}
            className="w-full px-3 py-2 bg-bg-0 border border-border-1 rounded text-text-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
            placeholder="Stage name..."
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-text-2 mb-1.5">
            Description
          </label>
          <textarea
            value={stage.description || ''}
            onChange={e => onUpdate({ ...stage, description: e.target.value })}
            className="w-full px-3 py-2 bg-bg-0 border border-border-1 rounded text-text-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue resize-none"
            rows={3}
            placeholder="Stage description..."
          />
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-xs font-medium text-text-2 mb-1.5">
            Stage Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={stage.color || '#388bfd'}
              onChange={e => onUpdate({ ...stage, color: e.target.value })}
              className="w-12 h-10 rounded cursor-pointer bg-bg-0 border border-border-1"
            />
            <span className="text-xs text-text-3">{stage.color || '#388bfd'}</span>
          </div>
        </div>

        {/* Branch Type */}
        <div>
          <label className="block text-xs font-medium text-text-2 mb-1.5">
            Branch Type
          </label>
          <select
            value={stage.branchType || 'sequential'}
            onChange={e =>
              onUpdate({
                ...stage,
                branchType: e.target.value as 'sequential' | 'parallel' | 'conditional',
              })
            }
            className="w-full px-3 py-2 bg-bg-0 border border-border-1 rounded text-text-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
          >
            <option value="sequential">Sequential</option>
            <option value="parallel">Parallel</option>
            <option value="conditional">Conditional</option>
          </select>
          <p className="text-xs text-text-3 mt-1">
            {stage.branchType === 'sequential' && 'Executes stages one after another'}
            {stage.branchType === 'parallel' && 'Executes multiple stages simultaneously'}
            {stage.branchType === 'conditional' && 'Branches based on conditions'}
          </p>
        </div>

        {/* Estimated Duration */}
        <div>
          <label className="block text-xs font-medium text-text-2 mb-1.5">
            Estimated Duration
          </label>
          <input
            type="text"
            value={stage.estimatedDuration || ''}
            onChange={e => onUpdate({ ...stage, estimatedDuration: e.target.value })}
            className="w-full px-3 py-2 bg-bg-0 border border-border-1 rounded text-text-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
            placeholder="e.g., 2-4 hours, 1 day"
          />
        </div>

        {/* Agent Assignment */}
        <div>
          <label className="block text-xs font-medium text-text-2 mb-2">
            Assigned Agents ({stage.assignedAgentIds.length}/{agents.length})
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {agents.map(agent => (
              <label
                key={agent.id}
                className="flex items-center gap-2 p-2 hover:bg-bg-0 rounded cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={stage.assignedAgentIds.includes(agent.id)}
                  onChange={e => {
                    const newIds = e.target.checked
                      ? [...stage.assignedAgentIds, agent.id]
                      : stage.assignedAgentIds.filter(id => id !== agent.id);
                    onUpdate({ ...stage, assignedAgentIds: newIds });
                  }}
                  className="w-4 h-4 rounded"
                />
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
                  style={{
                    backgroundColor: `${agent.color}20`,
                    borderWidth: '2px',
                    borderColor: agent.color,
                  }}
                >
                  {agent.emoji}
                </div>
                <div className="flex-1">
                  <span className="text-sm text-text-1">{agent.name}</span>
                  <span className="text-xs text-text-3 ml-2 capitalize">
                    {agent.role}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Required Toggle */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={stage.requiredForCompletion}
              onChange={e =>
                onUpdate({ ...stage, requiredForCompletion: e.target.checked })
              }
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-text-2">Required for completion</span>
          </label>
          <p className="text-xs text-text-3 mt-1 ml-6">
            {stage.requiredForCompletion
              ? 'This stage must be completed'
              : 'This stage can be skipped'}
          </p>
        </div>
      </div>
    </div>
  );
}
