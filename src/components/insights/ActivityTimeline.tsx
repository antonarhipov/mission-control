import {
  CheckCircle2,
  GitCommit,
  MessageCircle,
  AlertCircle,
  Zap,
  FileCode,
  User,
  Clock,
} from 'lucide-react';

interface ActivityEvent {
  id: string;
  type: 'mission-completed' | 'commit' | 'decision' | 'approval-rejected' | 'agent-action' | 'file-changed' | 'error';
  title: string;
  description?: string;
  agentId?: string;
  agentName?: string;
  agentEmoji?: string;
  missionTitle?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface ActivityTimelineProps {
  events: ActivityEvent[];
  limit?: number;
}

export function ActivityTimeline({ events, limit = 20 }: ActivityTimelineProps) {
  const displayEvents = limit ? events.slice(0, limit) : events;

  const getEventIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'mission-completed':
        return <CheckCircle2 className="w-4 h-4 text-accent-green" />;
      case 'commit':
        return <GitCommit className="w-4 h-4 text-accent-blue" />;
      case 'decision':
        return <MessageCircle className="w-4 h-4 text-accent-purple" />;
      case 'approval-rejected':
        return <AlertCircle className="w-4 h-4 text-accent-red" />;
      case 'agent-action':
        return <Zap className="w-4 h-4 text-accent-amber" />;
      case 'file-changed':
        return <FileCode className="w-4 h-4 text-accent-cyan" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-accent-red" />;
      default:
        return <Clock className="w-4 h-4 text-text-3" />;
    }
  };

  const getEventColor = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'mission-completed':
        return 'bg-accent-green/10 border-accent-green/30';
      case 'commit':
        return 'bg-accent-blue/10 border-accent-blue/30';
      case 'decision':
        return 'bg-accent-purple/10 border-accent-purple/30';
      case 'approval-rejected':
        return 'bg-accent-red/10 border-accent-red/30';
      case 'agent-action':
        return 'bg-accent-amber/10 border-accent-amber/30';
      case 'file-changed':
        return 'bg-accent-cyan/10 border-accent-cyan/30';
      case 'error':
        return 'bg-accent-red/10 border-accent-red/30';
      default:
        return 'bg-bg-1 border-border-1';
    }
  };

  const formatTimestamp = (timestamp: string) => {
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

  return (
    <div className="bg-bg-0 rounded-lg border border-border-1">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border-1">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-accent-amber" />
          <h2 className="text-lg font-semibold text-text-1">Recent Activity</h2>
        </div>
        <div className="text-sm text-text-3">{events.length} events</div>
      </div>

      {/* Timeline */}
      <div className="p-6">
        {displayEvents.length === 0 ? (
          <div className="text-center py-8 text-text-3">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayEvents.map((event, index) => (
              <div key={event.id} className="flex gap-4">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center ${getEventColor(event.type)}`}>
                    {getEventIcon(event.type)}
                  </div>
                  {index < displayEvents.length - 1 && (
                    <div className="w-px h-full bg-border-1 mt-2" />
                  )}
                </div>

                {/* Event content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-text-1">{event.title}</h3>
                      {event.description && (
                        <p className="text-xs text-text-3 mt-1">{event.description}</p>
                      )}
                    </div>
                    <span className="text-xs text-text-3 whitespace-nowrap">
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-3 mt-2">
                    {event.agentName && (
                      <div className="flex items-center gap-1.5 text-xs text-text-3">
                        {event.agentEmoji ? (
                          <span>{event.agentEmoji}</span>
                        ) : (
                          <User className="w-3 h-3" />
                        )}
                        <span>{event.agentName}</span>
                      </div>
                    )}
                    {event.missionTitle && (
                      <>
                        {event.agentName && <span className="text-xs text-text-3">•</span>}
                        <div className="text-xs text-text-3">
                          {event.missionTitle}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {limit && events.length > limit && (
        <div className="px-6 py-3 border-t border-border-1 bg-bg-1">
          <button className="text-xs text-accent-blue hover:text-accent-blue/80 font-medium transition-colors">
            View all {events.length} events →
          </button>
        </div>
      )}
    </div>
  );
}
