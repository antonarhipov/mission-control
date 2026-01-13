import { AlertCircle, Link, PlusCircle, Tag } from 'lucide-react';
import type { Change } from '@/types';

interface OrphanedChangesAlertProps {
  changes: Change[];
  onResolve: (changeId: string, resolution: 'linked' | 'new-criterion' | 'tech-debt') => void;
}

export function OrphanedChangesAlert({ changes, onResolve }: OrphanedChangesAlertProps) {
  const unresolvedChanges = changes.filter(c => !c.orphanResolution);

  if (unresolvedChanges.length === 0) {
    return null;
  }

  return (
    <div className="bg-accent-amber/10 border border-accent-amber/30 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-5 h-5 text-accent-amber" />
        <h4 className="font-semibold text-accent-amber">
          {unresolvedChanges.length} Orphaned Change{unresolvedChanges.length > 1 ? 's' : ''}
        </h4>
      </div>

      <p className="text-sm text-text-2 mb-3">
        These changes don't link to any acceptance criterion. Please resolve:
      </p>

      {/* Orphaned changes list */}
      <div className="space-y-2">
        {unresolvedChanges.map(change => (
          <div key={change.id} className="bg-bg-0 rounded-lg p-3 border border-border-1">
            {/* File info */}
            <div className="mb-2">
              <div className="text-sm font-medium text-text-1 font-mono mb-1">
                {change.path}
              </div>
              <div className="text-xs text-text-3">
                {change.reasoning}
              </div>
            </div>

            {/* Change stats */}
            <div className="flex items-center gap-3 text-xs text-text-3 mb-3">
              <span>
                <span className="text-accent-green">+{change.additions}</span>
                {' / '}
                <span className="text-accent-red">-{change.deletions}</span>
              </span>
              {change.cost && (
                <span>${change.cost.toFixed(2)}</span>
              )}
              {change.agentId && (
                <span>by {change.agentId}</span>
              )}
            </div>

            {/* Resolution buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onResolve(change.id, 'linked')}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 rounded transition-colors"
              >
                <Link className="w-3.5 h-3.5" />
                Link to Criterion
              </button>

              <button
                onClick={() => onResolve(change.id, 'new-criterion')}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-accent-green/10 text-accent-green hover:bg-accent-green/20 rounded transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Create New Criterion
              </button>

              <button
                onClick={() => onResolve(change.id, 'tech-debt')}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-text-3/10 text-text-3 hover:bg-text-3/20 rounded transition-colors"
              >
                <Tag className="w-3.5 h-3.5" />
                Mark as Tech Debt
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info footer */}
      <div className="mt-3 pt-3 border-t border-accent-amber/20">
        <div className="text-xs text-text-3">
          <strong>Tip:</strong> Orphaned changes may indicate missing requirements or scope creep.
          Linking them ensures complete traceability.
        </div>
      </div>
    </div>
  );
}
