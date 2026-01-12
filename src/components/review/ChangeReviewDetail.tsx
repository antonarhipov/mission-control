import { Check, X, FileCode, MessageCircle } from 'lucide-react';
import type { Approval, Change } from '@/types';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { UncertaintyFlag } from './UncertaintyFlag';
import { useV3DataModel } from '@/hooks/useV3DataModel';

interface ChangeReviewDetailProps {
  approval: Approval;
  change?: Change; // Optional change details
  onApprove: (approvalId: string) => void;
  onReject: (approvalId: string, reason?: string) => void;
  onAnswerUncertainty?: (response: 'yes' | 'no' | 'clarify') => void;
}

export function ChangeReviewDetail({
  approval,
  change,
  onApprove,
  onReject,
  onAnswerUncertainty,
}: ChangeReviewDetailProps) {
  const { agents } = useV3DataModel();
  const agent = approval.agentId ? agents.find(a => a.id === approval.agentId) : null;

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-bg-0">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-border-1">
        <div className="space-y-4">
          {/* Title and Type */}
          <div>
            <div className="flex items-center gap-2 text-xs text-text-3 mb-2">
              <span className="uppercase font-semibold">{approval.type}</span>
              {agent && (
                <>
                  <span>•</span>
                  <span>{agent.emoji} {agent.name}</span>
                </>
              )}
              <span>•</span>
              <span>{formatTime(approval.timestamp)}</span>
            </div>
            <h2 className="text-xl font-semibold text-text-1 mb-2">
              {approval.title}
            </h2>
            <p className="text-sm text-text-2 leading-relaxed">
              {approval.description}
            </p>
          </div>

          {/* Confidence Indicator */}
          {approval.confidence !== undefined && (
            <div className="pt-3 border-t border-border-1">
              <ConfidenceIndicator confidence={approval.confidence} size="lg" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Agent Uncertainty */}
        {approval.requiresInput && approval.question && onAnswerUncertainty && (
          <UncertaintyFlag
            question={approval.question}
            agentId={approval.agentId}
            onAnswer={onAnswerUncertainty}
          />
        )}

        {/* Why This Change */}
        {approval.reasoning && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">
              Why This Change
            </h3>
            <div className="bg-bg-1 p-4 rounded-lg border border-border-1">
              <p className="text-sm text-text-1 leading-relaxed">
                {approval.reasoning}
              </p>
            </div>
          </div>
        )}

        {/* Change Details (if provided) */}
        {change && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">
              Change Details
            </h3>

            {/* File Path */}
            {change.path && (
              <div className="flex items-center gap-2 text-sm">
                <FileCode className="w-4 h-4 text-text-3" />
                <span className="font-mono text-text-1">{change.path}</span>
              </div>
            )}

            {/* Change Type */}
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-text-3">Type:</span>
                <span className="ml-2 font-medium text-text-1 capitalize">
                  {change.changeType || 'modification'}
                </span>
              </div>
              {change.additions !== undefined && (
                <div className="text-accent-green">
                  +{change.additions} lines
                </div>
              )}
              {change.deletions !== undefined && (
                <div className="text-accent-red">
                  -{change.deletions} lines
                </div>
              )}
            </div>

            {/* Diff Preview */}
            {change.diff && (
              <div className="bg-bg-1 border border-border-1 rounded-lg overflow-hidden">
                <div className="px-3 py-2 bg-bg-2 border-b border-border-1 text-xs font-medium text-text-2">
                  Diff Preview
                </div>
                <pre className="p-4 text-xs text-text-1 overflow-x-auto">
                  <code>{change.diff}</code>
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Affected Files */}
        {approval.affectedFiles && approval.affectedFiles.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">
              Affected Files
            </h3>
            <div className="space-y-1">
              {approval.affectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-bg-1 rounded border border-border-1"
                >
                  <FileCode className="w-4 h-4 text-text-3" />
                  <span className="text-sm font-mono text-text-1">{file}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dependencies/Impact */}
        {approval.impact && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">
              Impact
            </h3>
            <div className="bg-accent-blue/5 p-4 rounded-lg border border-accent-blue/30">
              <p className="text-sm text-text-1 leading-relaxed">
                {approval.impact}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex-shrink-0 p-6 border-t border-border-1 bg-bg-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onApprove(approval.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-accent-green hover:bg-accent-green/80 text-white rounded-lg font-medium transition-colors"
          >
            <Check className="w-5 h-5" />
            <span>Approve</span>
          </button>
          <button
            onClick={() => onReject(approval.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-accent-red hover:bg-accent-red/80 text-white rounded-lg font-medium transition-colors"
          >
            <X className="w-5 h-5" />
            <span>Reject</span>
          </button>
          <button
            onClick={() => {/* TODO: Open feedback dialog */}}
            className="px-4 py-3 bg-bg-2 hover:bg-bg-3 text-text-1 border border-border-1 rounded-lg transition-colors"
            title="Provide feedback"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
        <p className="mt-3 text-xs text-text-3 text-center">
          {approval.confidence !== undefined && approval.confidence >= 90
            ? 'High confidence change - agent is confident about this'
            : approval.confidence !== undefined && approval.confidence < 70
            ? 'Low confidence - please review carefully'
            : 'Medium confidence - normal review recommended'}
        </p>
      </div>
    </div>
  );
}
