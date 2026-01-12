import { Users, DollarSign, Clock, AlertCircle } from 'lucide-react';
import type { Mission } from '@/types';
import { useV3DataModel } from '@/hooks/useV3DataModel';

interface MissionCardProps {
  mission: Mission;
  onSelect: (missionId: string) => void;
  onExpand?: (missionId: string) => void;
}

export function MissionCard({ mission, onSelect, onExpand }: MissionCardProps) {
  const { agents, teams } = useV3DataModel();

  // Get mission agents
  const missionAgents = mission.agents
    .map(ma => agents.find(a => a.id === ma.agentId))
    .filter(Boolean);

  // Get team and current pipeline stage
  const team = teams.find(t => t.id === mission.teamId);
  const currentStage = mission.status === 'executing' && mission.currentPipelineStage && team?.pipeline
    ? team.pipeline.stages.find(s => s.id === mission.currentPipelineStage)
    : null;

  // Get status color
  const getStatusColor = () => {
    switch (mission.status) {
      case 'backlog':
        return 'bg-text-3/20 text-text-3 border-text-3/30';
      case 'planning':
        return 'bg-accent-amber/20 text-accent-amber border-accent-amber/30';
      case 'executing':
        return 'bg-accent-blue/20 text-accent-blue border-accent-blue/30';
      case 'complete':
        return 'bg-accent-green/20 text-accent-green border-accent-green/30';
      case 'blocked':
        return 'bg-accent-red/20 text-accent-red border-accent-red/30';
      default:
        return 'bg-bg-2 text-text-2 border-border-1';
    }
  };

  // Format timestamp
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'just started';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      onClick={() => onSelect(mission.id)}
      className="w-full p-3 bg-bg-1 hover:bg-bg-2 border border-border-1 rounded-lg transition-colors cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3
          onClick={(e) => {
            if (onExpand) {
              e.stopPropagation();
              onExpand(mission.id);
            }
          }}
          className="text-sm font-semibold text-text-1 line-clamp-2 group-hover:text-accent-blue transition-colors cursor-pointer hover:underline"
        >
          {mission.title}
        </h3>
        {mission.status === 'blocked' && (
          <AlertCircle className="w-4 h-4 text-accent-red flex-shrink-0 mt-0.5" />
        )}
      </div>

      {/* Status Badge */}
      <div className="mb-3">
        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor()}`}>
          {mission.status.replace('-', ' ')}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-text-3 mb-1">
          <span>Progress</span>
          <span className="font-medium text-text-2">{mission.progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-bg-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-green rounded-full transition-all"
            style={{ width: `${mission.progress}%` }}
          />
        </div>
      </div>

      {/* Current Pipeline Stage (for executing missions) */}
      {currentStage && (
        <div className="mb-3 flex items-center gap-2 text-xs">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: currentStage.color || '#388bfd' }}
          />
          <span className="text-text-3">Current:</span>
          <span className="font-medium text-text-1">{currentStage.name}</span>
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center gap-3 text-xs text-text-3">
        {/* Team */}
        {missionAgents.length > 0 && (
          <div className="flex items-center gap-1" title="Team size">
            <Users className="w-3 h-3" />
            <span>{missionAgents.length}</span>
          </div>
        )}

        {/* Cost */}
        <div className="flex items-center gap-1" title="Cost">
          <DollarSign className="w-3 h-3" />
          <span>${mission.cost.toFixed(2)}</span>
        </div>

        {/* Time */}
        {mission.startedAt && (
          <div className="flex items-center gap-1 ml-auto" title="Started">
            <Clock className="w-3 h-3" />
            <span>{formatTime(mission.startedAt)}</span>
          </div>
        )}
      </div>

      {/* Agent Avatars */}
      {missionAgents.length > 0 && (
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border-1">
          {missionAgents.slice(0, 4).map(agent => (
            agent && (
              <div
                key={agent.id}
                className="w-6 h-6 rounded-full bg-bg-2 border border-border-1 flex items-center justify-center text-xs"
                title={agent.name}
              >
                {agent.emoji}
              </div>
            )
          ))}
          {missionAgents.length > 4 && (
            <div className="w-6 h-6 rounded-full bg-bg-2 border border-border-1 flex items-center justify-center text-xs text-text-3">
              +{missionAgents.length - 4}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
