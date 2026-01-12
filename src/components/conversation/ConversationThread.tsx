import { useRef, useEffect } from 'react';
import { MessageCard } from './MessageCard';
import { DecisionCard } from './DecisionCard';
import type { Conversation } from '@/types';

interface ConversationThreadProps {
  conversation: Conversation;
  missionId: string;
  onNavigateToCode?: (filePath: string, lineNumber?: number) => void;
  className?: string;
}

export function ConversationThread({
  conversation,
  missionId,
  onNavigateToCode,
  className = '',
}: ConversationThreadProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages.length]);

  // Build a timeline of messages and decisions sorted by timestamp
  // Note: Questions are embedded within messages via message.question field
  const timeline = [
    ...conversation.messages.map(msg => ({ type: 'message' as const, data: msg, timestamp: msg.timestamp })),
    ...conversation.decisions.map(decision => ({ type: 'decision' as const, data: decision, timestamp: decision.timestamp })),
  ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <div
      ref={scrollContainerRef}
      className={`flex flex-col overflow-y-auto scroll-smooth ${className}`}
    >
      <div className="flex-1 space-y-4 p-6">
        {timeline.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-3">
            <div className="text-center space-y-2">
              <p className="text-lg">No messages yet</p>
              <p className="text-sm">Start a conversation to see it here.</p>
            </div>
          </div>
        ) : (
          timeline.map((item, index) => {
            if (item.type === 'message') {
              return (
                <MessageCard
                  key={`msg-${item.data.id}-${index}`}
                  message={item.data}
                  missionId={missionId}
                />
              );
            } else if (item.type === 'decision') {
              return (
                <DecisionCard
                  key={`decision-${item.data.id}-${index}`}
                  decision={item.data}
                  missionId={missionId}
                  onNavigateToCode={onNavigateToCode}
                />
              );
            }
            return null;
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
