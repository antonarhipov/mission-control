import { User, Bot, Info, Paperclip } from 'lucide-react';
import type { Message } from '@/types';
import { useV3DataModel } from '@/hooks/useV3DataModel';

interface MessageCardProps {
  message: Message;
  missionId: string;
}

export function MessageCard({ message }: MessageCardProps) {
  const { agents } = useV3DataModel();

  const isOperator = message.sender.type === 'operator';
  const isAgent = message.sender.type === 'agent';
  const isSystem = message.sender.type === 'system';

  // Get agent details if this is an agent message
  const agent = isAgent && message.sender.id
    ? agents.find(a => a.id === message.sender.id)
    : null;

  // Determine sender display name and icon
  const getSenderInfo = () => {
    if (isOperator) {
      return {
        name: 'You',
        icon: <User className="w-4 h-4" />,
        bgColor: 'bg-accent-blue/10',
        borderColor: 'border-accent-blue/30',
        textColor: 'text-accent-blue',
      };
    } else if (isAgent && agent) {
      return {
        name: agent.name,
        icon: <span className="text-base">{agent.emoji}</span>,
        bgColor: 'bg-accent-purple/10',
        borderColor: 'border-accent-purple/30',
        textColor: 'text-accent-purple',
      };
    } else if (isSystem) {
      return {
        name: 'System',
        icon: <Info className="w-4 h-4" />,
        bgColor: 'bg-text-3/10',
        borderColor: 'border-text-3/30',
        textColor: 'text-text-3',
      };
    } else {
      return {
        name: 'Unknown',
        icon: <Bot className="w-4 h-4" />,
        bgColor: 'bg-text-3/10',
        borderColor: 'border-text-3/30',
        textColor: 'text-text-3',
      };
    }
  };

  const senderInfo = getSenderInfo();

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

  return (
    <div className={`flex gap-3 ${isOperator ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full ${senderInfo.bgColor} ${senderInfo.borderColor} border flex items-center justify-center ${senderInfo.textColor}`}
      >
        {senderInfo.icon}
      </div>

      {/* Message Content */}
      <div className={`flex-1 space-y-2 ${isOperator ? 'items-end' : ''}`}>
        {/* Header */}
        <div className={`flex items-center gap-2 ${isOperator ? 'flex-row-reverse' : ''}`}>
          <span className="text-sm font-medium text-text-1">{senderInfo.name}</span>
          {isAgent && agent && (
            <span className="text-xs text-text-3">{agent.role}</span>
          )}
          <span className="text-xs text-text-3">{formatTime(message.timestamp)}</span>
        </div>

        {/* Message Body */}
        <div
          className={`rounded-lg p-4 ${
            isOperator
              ? 'bg-accent-blue/10 border border-accent-blue/30'
              : isSystem
              ? 'bg-bg-1 border border-border-1'
              : 'bg-bg-1 border border-border-1'
          }`}
        >
          <p className="text-text-1 whitespace-pre-wrap leading-relaxed">{message.content}</p>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border-1 space-y-2">
              {message.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-text-2 hover:text-accent-blue transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                  <span className="font-mono text-xs">{attachment.type}: {attachment.content.substring(0, 50)}{attachment.content.length > 50 ? '...' : ''}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
