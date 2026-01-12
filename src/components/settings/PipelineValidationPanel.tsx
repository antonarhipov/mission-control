import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

interface PipelineValidationPanelProps {
  errors: string[];
  warnings: string[];
}

export function PipelineValidationPanel({ errors, warnings }: PipelineValidationPanelProps) {
  const isValid = errors.length === 0;

  if (isValid && warnings.length === 0) {
    return (
      <div className="p-3 bg-accent-green/10 border border-accent-green/30 rounded-lg">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-accent-green" />
          <span className="text-sm font-medium text-accent-green">Pipeline is valid</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Errors */}
      {errors.length > 0 && (
        <div className="p-3 bg-accent-red/10 border border-accent-red/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-accent-red mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-accent-red mb-1">
                {errors.length} {errors.length === 1 ? 'Error' : 'Errors'}
              </div>
              <ul className="text-xs text-text-2 space-y-1">
                {errors.map((error, i) => (
                  <li key={i} className="leading-relaxed">
                    • {error}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="p-3 bg-accent-amber/10 border border-accent-amber/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-accent-amber mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-accent-amber mb-1">
                {warnings.length} {warnings.length === 1 ? 'Warning' : 'Warnings'}
              </div>
              <ul className="text-xs text-text-3 space-y-1">
                {warnings.map((warning, i) => (
                  <li key={i} className="leading-relaxed">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
