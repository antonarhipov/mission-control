import { useState } from 'react';
import { ArrowLeft, MoreVertical, DollarSign, Clock, Users, Play, Check, RefreshCw, Sparkles, AlertCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { ConversationThread } from '@/components/conversation/ConversationThread';
import { ConversationInput } from '@/components/conversation/ConversationInput';
import { useV3DataModel } from '@/hooks/useV3DataModel';
import type { Mission, PipelineStageExecution } from '@/types';

interface ConversationViewProps {
  mission: Mission;
  onBack: () => void;
  onSendMessage: (content: string, attachments: any[]) => void;
  onStartMission?: (teamId: string) => void;
  onRerunToolkit?: () => void;
  onNavigateToMission?: (missionId: string) => void;
}

// Mock toolkit data (should match IntentInput)
const SPEC_TOOLKITS = [
  {
    id: 'openspec-v1',
    name: 'openspec',
    provider: 'openspec',
  },
  {
    id: 'agent-os-v2',
    name: 'Agent-OS Spec Builder',
    provider: 'Agent-OS',
  },
  {
    id: 'manual',
    name: 'Manual Specification',
    provider: 'Built-in',
  },
];

export function ConversationView({
  mission,
  onBack,
  onSendMessage,
  onStartMission,
  onRerunToolkit,
  onNavigateToMission,
}: ConversationViewProps) {
  const { agents, teams } = useV3DataModel();
  const [selectedTeamId, setSelectedTeamId] = useState<string>(mission.teamId || '');

  // Get the toolkit used for this conversation
  const toolkit = mission.conversation.specificationToolkitId
    ? SPEC_TOOLKITS.find(t => t.id === mission.conversation.specificationToolkitId)
    : null;

  // Get mission agents
  const missionAgents = mission.agents
    .map(ma => agents.find(a => a.id === ma.agentId))
    .filter(Boolean);

  // Get status color
  const getStatusColor = (status: Mission['status']) => {
    switch (status) {
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

  // Format time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Started recently';
    if (hours < 24) return `Started ${hours}h ago`;
    if (days < 7) return `Started ${days}d ago`;
    return `Started ${date.toLocaleDateString()}`;
  };

  return (
    <div className="flex flex-col h-full bg-bg-0">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border-1 bg-bg-1">
        <div className="p-4 space-y-3">
          {/* Top Row: Back Button, Title, Actions */}
          <div className="flex items-start gap-3">
            <button
              onClick={onBack}
              className="flex-shrink-0 p-2 hover:bg-bg-2 rounded-lg transition-colors"
              title="Back to conversations"
            >
              <ArrowLeft className="w-5 h-5 text-text-2" />
            </button>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold text-text-1 mb-1 line-clamp-2">
                {mission.title}
              </h1>
              <p className="text-sm text-text-3 line-clamp-2">
                {mission.intent.description}
              </p>
            </div>

            {/* Team Selection and Mission Status */}
            {!mission.conversation.missionId && onStartMission ? (
              // STATE 1: No mission - show team selector and start button (creates mission in planning)
              <div className="flex-shrink-0 flex items-center gap-2">
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="px-3 py-2 bg-bg-0 border border-border-1 rounded-lg text-sm text-text-1 focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                >
                  <option value="">Select team...</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.agentIds.length} agents)
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => selectedTeamId && onStartMission(selectedTeamId)}
                  disabled={!selectedTeamId}
                  className="flex items-center gap-2 px-4 py-2 bg-accent-green hover:bg-accent-green/80 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Submit conversation to team for execution"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Mission</span>
                </button>
              </div>
            ) : mission.conversation.missionId && mission.status === 'planning' && onStartMission ? (
              // STATE 2: Planning - show "Planning" badge + team selector + "Start Execution" button
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-accent-amber/10 border border-accent-amber/30 rounded-lg">
                  <Clock className="w-4 h-4 text-accent-amber" />
                  <span className="text-sm text-accent-amber font-medium">Planning</span>
                </div>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="px-3 py-2 bg-bg-0 border border-border-1 rounded-lg text-sm text-text-1 focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                >
                  <option value="">Select team...</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.agentIds.length} agents)
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => selectedTeamId && onStartMission(selectedTeamId)}
                  disabled={!selectedTeamId}
                  className="flex items-center gap-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Start mission execution with selected team"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Execution</span>
                </button>
              </div>
            ) : mission.conversation.missionId ? (
              // STATE 3, 4, 5: Mission executing/complete/blocked - show real status with navigation
              (() => {
                const isComplete = mission.status === 'complete';
                const isBlocked = mission.status === 'blocked';
                const isExecuting = mission.status === 'executing';

                // For executing missions, show current pipeline stage
                let label = '';
                let icon: React.ReactNode = null;
                let bgColor = '';
                let borderColor = '';
                let textColor = '';

                if (isComplete) {
                  label = 'Complete';
                  icon = <Check className="w-4 h-4" />;
                  bgColor = 'bg-accent-green/10';
                  borderColor = 'border-accent-green/30';
                  textColor = 'text-accent-green';
                } else if (isBlocked) {
                  label = 'Blocked';
                  icon = <AlertCircle className="w-4 h-4" />;
                  bgColor = 'bg-accent-red/10';
                  borderColor = 'border-accent-red/30';
                  textColor = 'text-accent-red';
                } else if (isExecuting) {
                  // Find current active pipeline stage
                  const activeStageExec = mission.pipelineExecution?.stages.find((s: PipelineStageExecution) => s.status === 'active');
                  // For now, just show stage ID or "Executing" - could enhance to fetch stage name from team pipeline config
                  label = activeStageExec ? `Stage: ${activeStageExec.stageId.split('-').pop()}` : 'Executing';
                  icon = <ArrowRight className="w-4 h-4" />;
                  bgColor = 'bg-accent-blue/10';
                  borderColor = 'border-accent-blue/30';
                  textColor = 'text-accent-blue';
                } else {
                  // Fallback for backlog or other statuses
                  label = mission.status.charAt(0).toUpperCase() + mission.status.slice(1);
                  icon = <Clock className="w-4 h-4" />;
                  bgColor = 'bg-text-3/10';
                  borderColor = 'border-text-3/30';
                  textColor = 'text-text-3';
                }

                return (
                  <button
                    onClick={() => onNavigateToMission?.(mission.id)}
                    disabled={!onNavigateToMission}
                    className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 ${bgColor} border ${borderColor} rounded-lg ${textColor} font-medium transition-colors hover:opacity-80 disabled:cursor-not-allowed group`}
                    title={`View mission in Missions workspace`}
                  >
                    {icon}
                    <span className="text-sm">{label}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })()
            ) : null}

            <button
              className="flex-shrink-0 p-2 hover:bg-bg-2 rounded-lg transition-colors"
              title="More options"
            >
              <MoreVertical className="w-5 h-5 text-text-2" />
            </button>
          </div>

          {/* Bottom Row: Metadata */}
          <div className="flex items-center gap-4 text-sm">
            {/* Status */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(mission.status)}`}>
              {mission.status.replace('-', ' ')}
            </span>

            {/* Progress */}
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-bg-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-green rounded-full transition-all"
                  style={{ width: `${mission.progress}%` }}
                />
              </div>
              <span className="text-xs text-text-3">{mission.progress}%</span>
            </div>

            {/* Agents */}
            {missionAgents.length > 0 && (
              <div className="flex items-center gap-1.5 text-text-3">
                <Users className="w-4 h-4" />
                <span className="text-xs">
                  {missionAgents.length} agent{missionAgents.length !== 1 ? 's' : ''}
                </span>
                <div className="flex -space-x-1.5 ml-1">
                  {missionAgents.slice(0, 5).map((agent: any) => (
                    <div
                      key={agent.id}
                      className="w-6 h-6 rounded-full border-2 border-bg-1 flex items-center justify-center text-xs"
                      style={{ backgroundColor: `${agent.color}20` }}
                      title={agent.name}
                    >
                      {agent.emoji}
                    </div>
                  ))}
                  {missionAgents.length > 5 && (
                    <div className="w-6 h-6 rounded-full border-2 border-bg-1 bg-bg-2 flex items-center justify-center text-xs text-text-3">
                      +{missionAgents.length - 5}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cost */}
            <div className="flex items-center gap-1.5 text-text-3">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs">${mission.cost.toFixed(2)}</span>
            </div>

            {/* Time */}
            {mission.startedAt && (
              <div className="flex items-center gap-1.5 text-text-3 ml-auto">
                <Clock className="w-4 h-4" />
                <span className="text-xs">{formatTime(mission.startedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Toolkit Info Bar */}
        {toolkit && toolkit.id !== 'manual' && (
          <div className="px-4 py-3 bg-bg-0 border-t border-border-1 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-purple" />
                <span className="text-sm font-medium text-text-2">Specification Toolkit:</span>
                <span className="px-2 py-1 bg-accent-purple/10 border border-accent-purple/30 rounded text-xs font-medium text-accent-purple">
                  {toolkit.name}
                </span>
              </div>
              {mission.conversation.workflowRuns && mission.conversation.workflowRuns.length > 0 && (
                <span className="text-xs text-text-3">
                  {mission.conversation.workflowRuns.length} run{mission.conversation.workflowRuns.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            {onRerunToolkit && !mission.conversation.missionId && (
              <button
                onClick={onRerunToolkit}
                className="flex items-center gap-2 px-3 py-1.5 bg-bg-1 hover:bg-bg-2 border border-border-1 rounded-lg text-sm text-text-2 hover:text-accent-purple transition-colors"
                title="Re-run specification toolkit workflow"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Re-run Toolkit</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 overflow-hidden">
        <ConversationThread
          conversation={mission.conversation}
          missionId={mission.id}
          className="h-full"
        />
      </div>

      {/* Input */}
      <div className="flex-shrink-0">
        <ConversationInput
          onSendMessage={onSendMessage}
          placeholder="Ask a question or provide feedback..."
          disabled={mission.status === 'complete' || mission.status === 'blocked'}
        />
      </div>
    </div>
  );
}
