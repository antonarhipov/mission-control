import { DollarSign, Clock, TrendingUp, AlertTriangle, Users } from 'lucide-react';

interface TeamEstimateProps {
  teamSize: number;
  estimatedCost: {
    min: number;
    max: number;
    average: number;
  };
  estimatedTime: {
    min: string;
    max: string;
    average: string;
  };
  confidence: number; // 0-100
  warnings?: string[];
}

export function TeamEstimate({
  teamSize,
  estimatedCost,
  estimatedTime,
  confidence,
  warnings = [],
}: TeamEstimateProps) {
  const getConfidenceColor = () => {
    if (confidence >= 80) return 'text-accent-green';
    if (confidence >= 60) return 'text-accent-amber';
    return 'text-accent-red';
  };

  const getConfidenceBarColor = () => {
    if (confidence >= 80) return 'bg-accent-green';
    if (confidence >= 60) return 'bg-accent-amber';
    return 'bg-accent-red';
  };

  return (
    <div className="bg-bg-0 rounded-lg border border-border-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-1">Team Estimate</h2>
        <TrendingUp className="w-5 h-5 text-accent-green" />
      </div>

      {/* Team Size */}
      <div className="flex items-center gap-3 px-4 py-3 bg-bg-1 rounded-lg border border-border-1">
        <Users className="w-5 h-5 text-accent-blue" />
        <div className="flex-1">
          <div className="text-xs text-text-3">Team Size</div>
          <div className="text-2xl font-bold text-text-1">{teamSize}</div>
        </div>
        <div className="text-xs text-text-3">
          agent{teamSize !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Cost Estimate */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-accent-green" />
          <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">
            Estimated Cost
          </h3>
        </div>
        <div className="bg-bg-1 rounded-lg p-4 border border-border-1">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-xs text-text-3 mb-1">Average</div>
              <div className="text-3xl font-bold text-text-1">
                ${estimatedCost.average.toFixed(2)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-text-3">Range</div>
              <div className="text-sm font-medium text-text-2">
                ${estimatedCost.min.toFixed(2)} - ${estimatedCost.max.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-3">
            <div className="flex-1 h-1 bg-bg-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-green rounded-full"
                style={{
                  width: `${((estimatedCost.average - estimatedCost.min) / (estimatedCost.max - estimatedCost.min)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Time Estimate */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-accent-blue" />
          <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">
            Estimated Time
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-bg-1 rounded-lg p-3 border border-border-1">
            <div className="text-xs text-text-3 mb-1">Min</div>
            <div className="text-lg font-bold text-text-1">{estimatedTime.min}</div>
          </div>
          <div className="bg-accent-blue/10 rounded-lg p-3 border border-accent-blue/30">
            <div className="text-xs text-text-3 mb-1">Average</div>
            <div className="text-lg font-bold text-accent-blue">{estimatedTime.average}</div>
          </div>
          <div className="bg-bg-1 rounded-lg p-3 border border-border-1">
            <div className="text-xs text-text-3 mb-1">Max</div>
            <div className="text-lg font-bold text-text-1">{estimatedTime.max}</div>
          </div>
        </div>
      </div>

      {/* Confidence */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">
            Estimate Confidence
          </h3>
          <span className={`text-sm font-semibold ${getConfidenceColor()}`}>
            {confidence}%
          </span>
        </div>
        <div className="h-2 bg-bg-2 rounded-full overflow-hidden">
          <div
            className={`h-full ${getConfidenceBarColor()} rounded-full transition-all`}
            style={{ width: `${confidence}%` }}
          />
        </div>
        <p className="text-xs text-text-3 mt-2">
          {confidence >= 80
            ? 'High confidence - similar team configurations performed well'
            : confidence >= 60
            ? 'Medium confidence - estimates may vary based on complexity'
            : 'Low confidence - limited historical data for this configuration'}
        </p>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">
            Considerations
          </h3>
          <div className="space-y-2">
            {warnings.map((warning, index) => (
              <div
                key={index}
                className="flex items-start gap-2 px-3 py-2 bg-accent-amber/10 rounded border border-accent-amber/30"
              >
                <AlertTriangle className="w-4 h-4 text-accent-amber flex-shrink-0 mt-0.5" />
                <span className="text-xs text-text-2">{warning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cost Breakdown */}
      <div className="pt-4 border-t border-border-1">
        <div className="text-xs text-text-3 space-y-1">
          <div className="flex items-center justify-between">
            <span>Based on agent historical performance</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Includes all pipeline stages</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Estimates may vary by ±20%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
