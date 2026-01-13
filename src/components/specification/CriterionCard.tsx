import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';
import { CriterionFileList } from './CriterionFileList';
import type { AcceptanceCriterionV4, CriterionCostSummary } from '@/types';
import clsx from 'clsx';

interface CriterionCardProps {
  id?: string;
  criterion: AcceptanceCriterionV4;
  summary: CriterionCostSummary;
  onNavigateToReview?: () => void;
  onNavigateToDiff?: (fileId: string) => void;
}

export function CriterionCard({ id, criterion, summary, onNavigateToReview, onNavigateToDiff }: CriterionCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Status icon and color
  const getStatusDisplay = () => {
    switch (summary.status) {
      case 'verified':
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          color: 'text-accent-green',
          label: 'Verified'
        };
      case 'completed':
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          color: 'text-accent-blue',
          label: 'Completed'
        };
      case 'in-progress':
        return {
          icon: <Clock className="w-4 h-4" />,
          color: 'text-accent-cyan',
          label: 'In Progress'
        };
      case 'blocked':
        return {
          icon: <XCircle className="w-4 h-4" />,
          color: 'text-accent-red',
          label: 'Blocked'
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          color: 'text-text-3',
          label: 'Pending'
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div
      id={id}
      className="bg-bg-1 border border-border-1 rounded-lg p-4 hover:border-border-2 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-text-3 font-semibold">
              [{criterion.id}]
            </span>
            {criterion.assignedAgents && criterion.assignedAgents.length > 0 && (
              <span className="text-xs px-1.5 py-0.5 bg-accent-purple/10 text-accent-purple rounded">
                Assigned
              </span>
            )}
          </div>
          <p className="text-sm text-text-1 leading-relaxed">
            {criterion.description}
          </p>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-shrink-0 p-1 hover:bg-bg-2 rounded transition-colors"
          title={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-text-2" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-2" />
          )}
        </button>
      </div>

      {/* Status & Metadata */}
      <div className="flex items-center flex-wrap gap-4 text-xs">
        {/* Status */}
        <div className={clsx('flex items-center gap-1.5 font-medium', statusDisplay.color)}>
          {statusDisplay.icon}
          <span>{statusDisplay.label}</span>
        </div>

        {/* Cost */}
        <div className="text-text-3">
          <span className="font-medium text-text-2">${summary.cost.toFixed(2)}</span>
        </div>

        {/* Files */}
        <div className="text-text-3">
          <span className="font-medium text-text-2">{summary.implementingFiles.length}</span>
          {' files'}
        </div>

        {/* Agents */}
        {summary.implementingAgents.length > 0 && (
          <div className="text-text-3">
            by{' '}
            <span className="font-medium text-text-2">
              {summary.implementingAgents.slice(0, 2).join(', ')}
              {summary.implementingAgents.length > 2 && ` +${summary.implementingAgents.length - 2}`}
            </span>
          </div>
        )}
      </div>

      {/* Blocked By Warning */}
      {summary.blockedBy && summary.blockedBy.length > 0 && (
        <div className="mt-2 flex items-start gap-1.5 text-xs text-accent-amber bg-accent-amber/10 border border-accent-amber/20 rounded px-2 py-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>
            Blocked by: {summary.blockedBy.join(', ')}
          </span>
        </div>
      )}

      {/* Dependencies Info */}
      {criterion.dependsOn && criterion.dependsOn.length > 0 && (
        <div className="mt-2 text-xs text-text-3">
          Depends on: <span className="font-mono">{criterion.dependsOn.join(', ')}</span>
        </div>
      )}

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-border-1 space-y-4">
          {/* Verification Status */}
          {criterion.verification.status !== 'pending' && (
            <div>
              <div className="text-xs font-medium text-text-2 mb-1.5">Verification:</div>
              <div className="text-xs text-text-3">
                Status: <span className={clsx(
                  'font-medium',
                  criterion.verification.status === 'human-verified' ? 'text-accent-green' :
                  criterion.verification.status === 'agent-verified' ? 'text-accent-blue' :
                  'text-accent-red'
                )}>
                  {criterion.verification.status}
                </span>
                {criterion.verification.verifiedBy && (
                  <span> by {criterion.verification.verifiedBy}</span>
                )}
              </div>
              {criterion.verification.testResults && criterion.verification.testResults.length > 0 && (
                <div className="mt-1 text-xs text-text-3">
                  Tests: {criterion.verification.testResults.filter(t => t.status === 'passed').length}/
                  {criterion.verification.testResults.length} passed
                </div>
              )}
            </div>
          )}

          {/* Files and Commits */}
          <div>
            <CriterionFileList
              files={criterion.implementedIn.files}
              commits={criterion.implementedIn.commits}
              onNavigateToDiff={onNavigateToDiff}
            />
          </div>

          {/* Changes in Review */}
          {criterion.implementedIn.changesInReview.length > 0 && onNavigateToReview && (
            <button
              onClick={onNavigateToReview}
              className="text-xs text-accent-blue hover:text-accent-blue/80 font-medium transition-colors"
            >
              {criterion.implementedIn.changesInReview.length} change{criterion.implementedIn.changesInReview.length > 1 ? 's' : ''} in review →
            </button>
          )}

          {/* Cost Attribution */}
          {criterion.costAttribution.totalCost > 0 && (
            <div>
              <div className="text-xs font-medium text-text-2 mb-1.5">Cost Attribution:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-text-3">By Agent:</div>
                  {Object.entries(criterion.costAttribution.byAgent).map(([agentId, cost]) => (
                    <div key={agentId} className="text-text-2 font-mono">
                      {agentId}: ${cost.toFixed(2)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-text-3">By Stage:</div>
                  {Object.entries(criterion.costAttribution.byStage).map(([stageId, cost]) => (
                    <div key={stageId} className="text-text-2">
                      {stageId}: ${cost.toFixed(2)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
