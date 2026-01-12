import { HelpCircle, CheckCircle, Clock } from 'lucide-react';
import type { Question } from '@/types';
import { useV3DataModel } from '@/hooks/useV3DataModel';

interface QuestionCardProps {
  question: Question;
  missionId: string;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const { agents } = useV3DataModel();

  const agent = question.askedBy
    ? agents.find(a => a.id === question.askedBy)
    : null;

  const isAnswered = !!question.answer;

  return (
    <div
      className={`rounded-lg p-4 space-y-3 ${
        isAnswered
          ? 'bg-accent-green/5 border border-accent-green/30'
          : 'bg-accent-amber/5 border border-accent-amber/30'
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {isAnswered ? (
            <CheckCircle className="w-5 h-5 text-accent-green" />
          ) : (
            <HelpCircle className="w-5 h-5 text-accent-amber" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-semibold uppercase tracking-wide ${
                isAnswered ? 'text-accent-green' : 'text-accent-amber'
              }`}
            >
              {isAnswered ? 'Question (Answered)' : 'Question (Pending)'}
            </span>
            {agent && (
              <span className="text-xs text-text-3">
                by {agent.emoji} {agent.name}
              </span>
            )}
          </div>
          <p className="text-sm text-text-1 leading-relaxed">{question.question}</p>
        </div>
      </div>

      {/* Answer */}
      {isAnswered && question.answer && (
        <div className="pl-8 pt-3 border-t border-accent-green/20 space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-accent-green">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Answer</span>
          </div>
          <p className="text-sm text-text-1 leading-relaxed">{question.answer}</p>
        </div>
      )}

      {/* Pending indicator */}
      {!isAnswered && (
        <div className="pl-8 pt-2 flex items-center gap-2 text-xs text-accent-amber">
          <Clock className="w-3.5 h-3.5" />
          <span>Awaiting response...</span>
        </div>
      )}
    </div>
  );
}
