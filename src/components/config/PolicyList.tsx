import { clsx } from 'clsx';
import { Shield } from 'lucide-react';
import type { Policy } from '@/types';

interface PolicyListProps {
  policies: Policy[];
  onTogglePolicy: (policyId: string) => void;
}

export function PolicyList({ policies, onTogglePolicy }: PolicyListProps) {
  const getActionColor = (action: Policy['action']) => {
    switch (action) {
      case 'block':
        return 'text-accent-red';
      case 'require-approval':
        return 'text-accent-amber';
      case 'notify':
        return 'text-accent-blue';
    }
  };

  const getSeverityColor = (severity: Policy['severity']) => {
    switch (severity) {
      case 'error':
        return 'bg-accent-red/10 text-accent-red border-accent-red/30';
      case 'warning':
        return 'bg-accent-amber/10 text-accent-amber border-accent-amber/30';
      case 'info':
        return 'bg-accent-blue/10 text-accent-blue border-accent-blue/30';
    }
  };

  return (
    <div className="space-y-2">
      {policies.map((policy) => (
        <div
          key={policy.id}
          className={clsx(
            'p-4 rounded-md border transition-all',
            policy.enabled
              ? 'bg-bg-2 border-border-1'
              : 'bg-bg-1 border-border-1 opacity-60'
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Shield className={clsx('w-4 h-4', policy.enabled ? 'text-text-1' : 'text-text-3')} />
                <h4 className={clsx('text-sm font-medium', policy.enabled ? 'text-text-1' : 'text-text-3')}>
                  {policy.name}
                </h4>
                <span
                  className={clsx(
                    'px-2 py-0.5 text-[10px] font-medium rounded border',
                    getSeverityColor(policy.severity)
                  )}
                >
                  {policy.severity}
                </span>
              </div>
              <p className="text-xs text-text-2 mb-2">{policy.description}</p>
              <div className="flex items-center gap-3 text-[11px]">
                <span className={clsx('font-medium', getActionColor(policy.action))}>
                  Action: {policy.action.replace('-', ' ')}
                </span>
                <span className="text-text-3">
                  Created by {policy.createdBy} • {policy.createdAt}
                </span>
              </div>
            </div>
            <button
              onClick={() => onTogglePolicy(policy.id)}
              className={clsx(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                policy.enabled ? 'bg-accent-green' : 'bg-bg-3'
              )}
            >
              <span
                className={clsx(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  policy.enabled ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>

          {/* Policy Rule */}
          <div className="mt-3 p-2 bg-bg-3 rounded border border-border-1">
            <span className="text-[10px] font-medium text-text-3 uppercase tracking-wide">Rule:</span>
            <p className="text-xs text-text-1 mt-1">{policy.rule}</p>
          </div>

          {/* Scope */}
          {(policy.appliesTo.agents?.length || policy.appliesTo.services?.length || policy.appliesTo.operations?.length) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {policy.appliesTo.operations && policy.appliesTo.operations.length > 0 && (
                <div className="flex items-center gap-1 text-[10px]">
                  <span className="text-text-3">Operations:</span>
                  <span className="text-text-2">{policy.appliesTo.operations.join(', ')}</span>
                </div>
              )}
              {policy.appliesTo.services && policy.appliesTo.services.length > 0 && (
                <div className="flex items-center gap-1 text-[10px]">
                  <span className="text-text-3">Services:</span>
                  <span className="text-text-2">{policy.appliesTo.services.join(', ')}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
