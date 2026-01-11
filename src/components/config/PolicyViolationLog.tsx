import { clsx } from 'clsx';
import { XCircle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import type { PolicyViolation } from '@/types';

interface PolicyViolationLogProps {
  violations: PolicyViolation[];
}

export function PolicyViolationLog({ violations }: PolicyViolationLogProps) {
  const getOutcomeIcon = (outcome: PolicyViolation['outcome']) => {
    switch (outcome) {
      case 'blocked':
        return <XCircle className="w-4 h-4 text-accent-red" />;
      case 'pending-approval':
        return <Clock className="w-4 h-4 text-accent-amber" />;
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-accent-green" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-accent-red" />;
    }
  };

  const getOutcomeColor = (outcome: PolicyViolation['outcome']) => {
    switch (outcome) {
      case 'blocked':
        return 'text-accent-red';
      case 'pending-approval':
        return 'text-accent-amber';
      case 'approved':
        return 'text-accent-green';
      case 'rejected':
        return 'text-accent-red';
    }
  };

  const getOutcomeLabel = (outcome: PolicyViolation['outcome']) => {
    switch (outcome) {
      case 'blocked':
        return 'Blocked';
      case 'pending-approval':
        return 'Awaiting Approval';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
    }
  };

  if (violations.length === 0) {
    return (
      <div className="p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-accent-green mx-auto mb-3 opacity-50" />
        <h3 className="text-sm font-medium text-text-1 mb-1">No Policy Violations</h3>
        <p className="text-xs text-text-3">All agent actions are compliant with policies</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {violations.map((violation) => (
        <div
          key={violation.id}
          className="p-4 bg-bg-2 rounded-md border border-border-1 hover:border-accent-red/50 transition-colors"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-start gap-3 flex-1">
              {getOutcomeIcon(violation.outcome)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-text-1">{violation.policyName}</h4>
                  <span className={clsx('text-[10px] font-medium', getOutcomeColor(violation.outcome))}>
                    {getOutcomeLabel(violation.outcome)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-text-3 mb-2">
                  <span>{violation.agentName}</span>
                  <span>•</span>
                  <span>{violation.timestamp}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="text-xs">
                    <span className="text-text-3">Action: </span>
                    <span className="text-text-1 font-medium">{violation.action}</span>
                    <span className="text-text-3"> → </span>
                    <code className="text-[11px] text-accent-blue bg-bg-3 px-1.5 py-0.5 rounded">
                      {violation.target}
                    </code>
                  </div>
                  <div className="text-xs text-text-2 leading-relaxed">
                    {violation.reasoning}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
