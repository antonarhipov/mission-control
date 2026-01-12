import { HelpCircle, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import { useV3DataModel } from '@/hooks/useV3DataModel';

interface UncertaintyFlagProps {
  question: string;
  agentId?: string;
  onAnswer: (response: 'yes' | 'no' | 'clarify') => void;
  className?: string;
}

export function UncertaintyFlag({
  question,
  agentId,
  onAnswer,
  className = '',
}: UncertaintyFlagProps) {
  const { agents } = useV3DataModel();
  const agent = agentId ? agents.find(a => a.id === agentId) : null;

  return (
    <div className={`bg-accent-amber/10 border-l-4 border-accent-amber p-4 rounded-r-lg ${className}`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <HelpCircle className="w-6 h-6 text-accent-amber" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-accent-amber">
                Agent Needs Your Input
              </span>
              {agent && (
                <span className="text-xs text-text-3">
                  {agent.emoji} {agent.name}
                </span>
              )}
            </div>
            <p className="text-sm text-text-1 leading-relaxed">
              {question}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAnswer('yes')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-green hover:bg-accent-green/80 text-white rounded text-sm font-medium transition-colors"
              title="Approve this approach"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Yes, Proceed</span>
            </button>
            <button
              onClick={() => onAnswer('no')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-red hover:bg-accent-red/80 text-white rounded text-sm font-medium transition-colors"
              title="Choose a different approach"
            >
              <ThumbsDown className="w-4 h-4" />
              <span>No, Revise</span>
            </button>
            <button
              onClick={() => onAnswer('clarify')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-blue hover:bg-accent-blue/80 text-white rounded text-sm font-medium transition-colors"
              title="Provide more context"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Need to Clarify</span>
            </button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-text-3">
            The agent is uncertain about this approach and needs your guidance before proceeding.
          </p>
        </div>
      </div>
    </div>
  );
}
