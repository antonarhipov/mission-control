import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { CriterionCostSummary } from '@/types';

interface CriterionBadgeProps {
  status?: CriterionCostSummary['status'];
  size?: 'sm' | 'md';
}

export function CriterionBadge({ status = 'pending', size = 'sm' }: CriterionBadgeProps) {
  const getStatusDisplay = () => {
    switch (status) {
      case 'verified':
        return {
          icon: <CheckCircle2 className="w-3 h-3" />,
          className: 'bg-accent-green/10 text-accent-green border-accent-green/30',
          label: 'Verified'
        };
      case 'completed':
        return {
          icon: <CheckCircle2 className="w-3 h-3" />,
          className: 'bg-accent-blue/10 text-accent-blue border-accent-blue/30',
          label: 'Completed'
        };
      case 'in-progress':
        return {
          icon: <Clock className="w-3 h-3" />,
          className: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30',
          label: 'In Progress'
        };
      case 'blocked':
        return {
          icon: <XCircle className="w-3 h-3" />,
          className: 'bg-accent-red/10 text-accent-red border-accent-red/30',
          label: 'Blocked'
        };
      default:
        return {
          icon: <Clock className="w-3 h-3" />,
          className: 'bg-text-3/10 text-text-3 border-border-1',
          label: 'Pending'
        };
    }
  };

  const display = getStatusDisplay();
  const sizeClasses = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1';

  return (
    <span className={`inline-flex items-center gap-1 rounded border font-medium ${display.className} ${sizeClasses}`}>
      {display.icon}
      {display.label}
    </span>
  );
}
