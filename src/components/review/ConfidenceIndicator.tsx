import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ConfidenceIndicatorProps {
  confidence: number; // 0-100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ConfidenceIndicator({
  confidence,
  showLabel = true,
  size = 'md',
  className = '',
}: ConfidenceIndicatorProps) {
  // Clamp confidence to 0-100
  const clampedConfidence = Math.max(0, Math.min(100, confidence));

  // Determine color based on confidence level
  const getColor = () => {
    if (clampedConfidence >= 90) {
      return {
        bg: 'bg-accent-green',
        text: 'text-accent-green',
        border: 'border-accent-green',
        label: 'High Confidence',
        icon: <TrendingUp className="w-4 h-4" />,
      };
    } else if (clampedConfidence >= 70) {
      return {
        bg: 'bg-accent-amber',
        text: 'text-accent-amber',
        border: 'border-accent-amber',
        label: 'Medium Confidence',
        icon: <Minus className="w-4 h-4" />,
      };
    } else {
      return {
        bg: 'bg-accent-red',
        text: 'text-accent-red',
        border: 'border-accent-red',
        label: 'Low Confidence',
        icon: <TrendingDown className="w-4 h-4" />,
      };
    }
  };

  const color = getColor();

  // Determine size classes
  const sizeClasses = {
    sm: {
      bar: 'h-1.5',
      text: 'text-xs',
      container: 'gap-2',
    },
    md: {
      bar: 'h-2',
      text: 'text-sm',
      container: 'gap-3',
    },
    lg: {
      bar: 'h-3',
      text: 'text-base',
      container: 'gap-4',
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div className={`flex items-center ${sizes.container} ${className}`}>
      {/* Icon */}
      {showLabel && (
        <div className={color.text}>
          {color.icon}
        </div>
      )}

      {/* Progress Bar */}
      <div className="flex-1 min-w-0">
        <div className={`w-full ${sizes.bar} bg-bg-2 rounded-full overflow-hidden`}>
          <div
            className={`${sizes.bar} ${color.bg} rounded-full transition-all duration-500`}
            style={{ width: `${clampedConfidence}%` }}
          />
        </div>
      </div>

      {/* Percentage and Label */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`${sizes.text} font-semibold ${color.text}`}>
          {clampedConfidence}%
        </span>
        {showLabel && (
          <span className={`${sizes.text} text-text-3 hidden sm:inline`}>
            {color.label}
          </span>
        )}
      </div>
    </div>
  );
}
