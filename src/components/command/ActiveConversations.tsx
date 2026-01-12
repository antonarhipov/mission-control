import { MessageSquare, Clock, Users, DollarSign, Plus } from 'lucide-react';
import { useV3DataModel } from '@/hooks/useV3DataModel';
import type { Mission } from '@/types';

interface ActiveConversationsProps {
  selectedMissionId: string | null;
  onSelectMission: (missionId: string) => void;
  onNewMission: () => void;
}

export function ActiveConversations({
  selectedMissionId,
  onSelectMission,
  onNewMission,
}: ActiveConversationsProps) {
  const { missions, agents } = useV3DataModel();

  // Filter to active missions only (not complete)
  const activeMissions = missions.filter(m => m.status !== 'complete');

  // Sort by most recent activity
  const sortedMissions = [...activeMissions].sort((a, b) => {
    const aTime = a.conversation.messages[a.conversation.messages.length - 1]?.timestamp || a.startedAt || '';
    const bTime = b.conversation.messages[b.conversation.messages.length - 1]?.timestamp || b.startedAt || '';
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

  // Get status badge color
  const getStatusColor = (status: Mission['status']) => {
    switch (status) {
      case 'backlog':
        return 'bg-text-3/20 text-text-3';
      case 'planning':
        return 'bg-accent-amber/20 text-accent-amber';
      case 'executing':
        return 'bg-accent-blue/20 text-accent-blue';
      case 'complete':
        return 'bg-accent-green/20 text-accent-green';
      case 'blocked':
        return 'bg-accent-red/20 text-accent-red';
      default:
        return 'bg-bg-2 text-text-2';
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Get last message
  const getLastMessage = (mission: Mission) => {
    const messages = mission.conversation.messages;
    if (messages.length === 0) return 'No messages yet';

    const lastMessage = messages[messages.length - 1];
    const preview = lastMessage.content.length > 60
      ? lastMessage.content.substring(0, 60) + '...'
      : lastMessage.content;

    return preview;
  };

  return (
    <div className="flex flex-col h-full bg-bg-0">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border-1 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-1">Conversations</h2>
          <div className="flex items-center gap-1.5 text-text-3">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">{sortedMissions.length}</span>
          </div>
        </div>
        <button
          onClick={onNewMission}
          className={`w-full px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            selectedMissionId === null
              ? 'bg-accent-blue text-white'
              : 'bg-bg-1 border border-border-1 text-text-2 hover:bg-bg-2 hover:text-accent-blue'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>New Mission</span>
        </button>
      </div>

      {/* Missions List */}
      <div className="flex-1 overflow-y-auto">
        {sortedMissions.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3 p-8">
              <MessageSquare className="w-16 h-16 mx-auto text-text-3 opacity-50" />
              <div>
                <p className="text-lg font-medium text-text-2">No active missions</p>
                <p className="text-sm text-text-3 mt-1">
                  Start a new mission to begin your first conversation
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border-1">
            {sortedMissions.map(mission => {
              const lastMessageTime = mission.conversation.messages[mission.conversation.messages.length - 1]?.timestamp || mission.startedAt;
              const missionAgents = mission.agents.map(ma => agents.find(a => a.id === ma.agentId)).filter(Boolean);

              const isSelected = mission.id === selectedMissionId;

              return (
                <button
                  key={mission.id}
                  onClick={() => onSelectMission(mission.id)}
                  className={`w-full p-3 transition-colors text-left border-l-2 ${
                    isSelected
                      ? 'bg-accent-blue/10 border-accent-blue'
                      : 'border-transparent hover:bg-bg-1'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Title and Status */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-sm font-medium line-clamp-1 ${
                        isSelected ? 'text-accent-blue' : 'text-text-1'
                      }`}>
                        {mission.title}
                      </h3>
                      <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-xs font-medium ${getStatusColor(mission.status)}`}>
                        {mission.status.replace('-', ' ')}
                      </span>
                    </div>

                    {/* Last Message */}
                    <p className="text-xs text-text-3 line-clamp-2">
                      {getLastMessage(mission)}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-xs text-text-3">
                      {/* Progress */}
                      <div className="flex items-center gap-1">
                        <div className="w-12 h-1 bg-bg-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent-green rounded-full transition-all"
                            style={{ width: `${mission.progress}%` }}
                          />
                        </div>
                        <span>{mission.progress}%</span>
                      </div>

                      {/* Team */}
                      {missionAgents.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{missionAgents.length}</span>
                        </div>
                      )}

                      {/* Cost */}
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        <span>${mission.cost.toFixed(2)}</span>
                      </div>

                      {/* Time */}
                      {lastMessageTime && (
                        <div className="flex items-center gap-1 ml-auto">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(lastMessageTime)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
