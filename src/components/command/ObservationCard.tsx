import { Lightbulb, AlertTriangle, Sparkles, HelpCircle, Check, X, MessageCircle } from 'lucide-react';
import type { Observation } from '@/types';
import { useV3DataModel } from '@/hooks/useV3DataModel';

interface ObservationCardProps {
  observation: Observation;
  onAction: (observationId: string, action: 'yes' | 'no' | 'ask' | 'dismiss') => void;
}

export function ObservationCard({ observation, onAction }: ObservationCardProps) {
  const { agents } = useV3DataModel();

  const agent = agents.find(a => a.id === observation.agentId);

  // Get icon and colors based on observation type
  const getTypeInfo = () => {
    switch (observation.type) {
      case 'opportunity':
        return {
          icon: <Lightbulb className="w-5 h-5" />,
          bgColor: 'bg-accent-blue/10',
          borderColor: 'border-accent-blue/30',
          textColor: 'text-accent-blue',
          label: 'Opportunity',
        };
      case 'risk-identified':
      case 'security':
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          bgColor: 'bg-accent-amber/10',
          borderColor: 'border-accent-amber/30',
          textColor: 'text-accent-amber',
          label: 'Risk Identified',
        };
      case 'pattern-detected':
        return {
          icon: <Sparkles className="w-5 h-5" />,
          bgColor: 'bg-accent-purple/10',
          borderColor: 'border-accent-purple/30',
          textColor: 'text-accent-purple',
          label: 'Pattern Detected',
        };
      case 'inconsistency':
        return {
          icon: <HelpCircle className="w-5 h-5" />,
          bgColor: 'bg-accent-cyan/10',
          borderColor: 'border-accent-cyan/30',
          textColor: 'text-accent-cyan',
          label: 'Inconsistency',
        };
      case 'test-coverage':
        return {
          icon: <Sparkles className="w-5 h-5" />,
          bgColor: 'bg-accent-green/10',
          borderColor: 'border-accent-green/30',
          textColor: 'text-accent-green',
          label: 'Test Coverage',
        };
      case 'dependency-update':
        return {
          icon: <Sparkles className="w-5 h-5" />,
          bgColor: 'bg-accent-blue/10',
          borderColor: 'border-accent-blue/30',
          textColor: 'text-accent-blue',
          label: 'Dependency Update',
        };
      case 'performance':
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          bgColor: 'bg-accent-amber/10',
          borderColor: 'border-accent-amber/30',
          textColor: 'text-accent-amber',
          label: 'Performance',
        };
    }
  };

  // Get confidence badge
  const getConfidenceBadge = () => {
    const confidenceColor =
      observation.confidence >= 90
        ? 'bg-accent-green/20 text-accent-green'
        : observation.confidence >= 70
        ? 'bg-accent-amber/20 text-accent-amber'
        : 'bg-accent-red/20 text-accent-red';

    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${confidenceColor}`}>
        {observation.confidence}%
      </span>
    );
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

  const typeInfo = getTypeInfo();

  if (observation.acknowledged) {
    return null; // Don't show acknowledged observations
  }

  return (
    <div className={`rounded-lg border p-4 ${typeInfo.bgColor} ${typeInfo.borderColor}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`flex-shrink-0 mt-0.5 ${typeInfo.textColor}`}>
            {typeInfo.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-semibold uppercase tracking-wide ${typeInfo.textColor}`}>
                {typeInfo.label}
              </span>
              {agent && (
                <span className="text-xs text-text-3">
                  {agent.emoji} {agent.name}
                </span>
              )}
              <span className="text-xs text-text-3">{formatTime(observation.timestamp)}</span>
            </div>
            <h4 className="text-base font-semibold text-text-1 mb-1">{observation.title}</h4>
          </div>
        </div>
        {getConfidenceBadge()}
      </div>

      {/* Description */}
      <p className="text-sm text-text-2 leading-relaxed mb-4">{observation.description}</p>

      {/* Suggestion */}
      {observation.suggestion && (
        <div className="mb-4 space-y-2">
          <div className="text-xs font-medium text-text-2 uppercase tracking-wide">Suggestion</div>
          <p className="text-sm text-text-2">{observation.suggestion}</p>
        </div>
      )}

      {/* References */}
      {observation.references && observation.references.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-medium text-text-3 mb-1">References:</div>
          <div className="flex flex-wrap gap-1">
            {observation.references.map((ref, index) => (
              <code key={index} className="text-xs bg-bg-1 px-2 py-0.5 rounded text-text-2 border border-border-1">
                {ref.title}
              </code>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-border-1">
        <button
          onClick={() => onAction(observation.id, 'yes')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-green hover:bg-accent-green/80 text-white rounded text-sm font-medium transition-colors"
        >
          <Check className="w-4 h-4" />
          <span>Yes, Act</span>
        </button>
        <button
          onClick={() => onAction(observation.id, 'ask')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-blue hover:bg-accent-blue/80 text-white rounded text-sm font-medium transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Ask More</span>
        </button>
        <button
          onClick={() => onAction(observation.id, 'dismiss')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-2 hover:bg-bg-3 text-text-2 border border-border-1 rounded text-sm font-medium transition-colors"
        >
          <span>Dismiss</span>
        </button>
        <button
          onClick={() => onAction(observation.id, 'no')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-2 hover:bg-bg-3 text-text-2 border border-border-1 rounded text-sm font-medium transition-colors ml-auto"
        >
          <X className="w-4 h-4" />
          <span>No</span>
        </button>
      </div>
    </div>
  );
}
