import { CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';
import type { AcceptanceCriterion } from '@/types';

interface SpecificationTraceabilityProps {
  acceptanceCriteria: AcceptanceCriterion[];
  taskId: string;
  onNavigateToSpec: (taskId: string, criterionId: string) => void;
}

export function SpecificationTraceability({
  acceptanceCriteria,
  taskId,
  onNavigateToSpec
}: SpecificationTraceabilityProps) {
  if (acceptanceCriteria.length === 0) return null;

  return (
    <div className="border-t border-border-1 pt-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-1 rounded-full bg-accent-purple" />
        <h3 className="text-[11px] font-bold uppercase tracking-wide text-text-2">
          Specification Context
        </h3>
      </div>

      <div className="space-y-2">
        {acceptanceCriteria.map((criterion) => (
          <div
            key={criterion.id}
            className="p-3 bg-bg-2 border border-border-1 rounded-lg"
          >
            {/* Criterion Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {criterion.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-accent-green shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-accent-amber shrink-0" />
                )}
                <span className="font-mono text-[10px] font-semibold text-text-3">
                  [{criterion.id}]
                </span>
              </div>
              <span
                className={clsx(
                  'text-[10px] font-medium px-2 py-0.5 rounded',
                  criterion.completed
                    ? 'bg-accent-green/20 text-accent-green'
                    : 'bg-accent-amber/20 text-accent-amber'
                )}
              >
                {criterion.completed ? 'Completed' : 'In Progress'}
              </span>
            </div>

            {/* Criterion Description */}
            <p className="text-xs text-text-2 mb-3 leading-relaxed">
              {criterion.description}
            </p>

            {/* View in Specification Button */}
            <button
              onClick={() => onNavigateToSpec(taskId, criterion.id)}
              className="flex items-center gap-1.5 text-[11px] font-medium text-accent-purple hover:text-accent-purple/80 transition-colors"
            >
              View in Specification
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-3 p-2 bg-accent-purple/10 border border-accent-purple/30 rounded text-[10px] text-text-3">
        This change implements {acceptanceCriteria.length} acceptance{' '}
        {acceptanceCriteria.length === 1 ? 'criterion' : 'criteria'} from the approved specification
      </div>
    </div>
  );
}
