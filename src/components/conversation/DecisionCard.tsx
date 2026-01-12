import { CheckCircle2, Circle, FileCode, ExternalLink } from 'lucide-react';
import type { Decision } from '@/types';
import { useV3DataModel } from '@/hooks/useV3DataModel';

interface DecisionCardProps {
  decision: Decision;
  missionId: string;
  onNavigateToCode?: (filePath: string, lineNumber?: number) => void;
}

export function DecisionCard({ decision, onNavigateToCode }: DecisionCardProps) {
  const { agents } = useV3DataModel();

  const agent = decision.agentId
    ? agents.find(a => a.id === decision.agentId)
    : null;

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
    <div className="bg-accent-amber/5 border border-accent-amber/30 rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-accent-amber uppercase tracking-wide">
              Decision
            </span>
            {agent && (
              <span className="text-xs text-text-3">
                by {agent.emoji} {agent.name}
              </span>
            )}
            <span className="text-xs text-text-3">{formatTime(decision.timestamp)}</span>
          </div>
          <h4 className="text-base font-semibold text-text-1">{decision.title}</h4>
        </div>
      </div>

      {/* Rationale */}
      {decision.rationale && (
        <div className="space-y-1">
          <div className="text-xs font-medium text-text-2 uppercase tracking-wide">Rationale</div>
          <p className="text-sm text-text-2 leading-relaxed">{decision.rationale}</p>
        </div>
      )}

      {/* Options */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-text-2 uppercase tracking-wide">
          Options Considered
        </div>
        <div className="space-y-2">
          {decision.options.map((option, index) => {
            const isSelected = decision.chosen === option.id;
            return (
              <div
                key={index}
                className={`rounded-lg border p-3 transition-colors ${
                  isSelected
                    ? 'bg-accent-green/10 border-accent-green/50'
                    : 'bg-bg-1 border-border-1'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-accent-green" />
                    ) : (
                      <Circle className="w-5 h-5 text-text-3" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="font-medium text-text-1">{option.title}</div>

                    {option.pros && option.pros.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs text-accent-green font-medium">Pros:</div>
                        <ul className="space-y-0.5">
                          {option.pros.map((pro, i) => (
                            <li key={i} className="text-xs text-text-2 flex items-start gap-1">
                              <span className="text-accent-green">+</span>
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {option.cons && option.cons.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs text-accent-red font-medium">Cons:</div>
                        <ul className="space-y-0.5">
                          {option.cons.map((con, i) => (
                            <li key={i} className="text-xs text-text-2 flex items-start gap-1">
                              <span className="text-accent-red">−</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Code Impact */}
      {decision.codeImpact && decision.codeImpact.files.length > 0 && (
        <div className="pt-3 border-t border-accent-amber/20 space-y-2">
          <div className="text-xs font-medium text-text-2 uppercase tracking-wide">
            Code Impact
          </div>
          <div className="flex flex-wrap gap-2">
            {decision.codeImpact.files.map((file, index) => (
              <button
                key={index}
                onClick={() => onNavigateToCode?.(file)}
                className="flex items-center gap-2 px-3 py-1.5 bg-bg-1 hover:bg-bg-2 border border-border-1 rounded text-xs text-text-2 hover:text-accent-blue transition-colors"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span className="font-mono">{file.split('/').pop()}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
