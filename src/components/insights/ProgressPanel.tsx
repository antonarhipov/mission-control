import { TrendingUp, Target, Clock, CheckCircle2 } from 'lucide-react';

interface ProgressPanelProps {
  missions: {
    total: number;
    completed: number;
    inProgress: number;
    blocked: number;
  };
  velocity: {
    current: number; // missions per week
    average: number;
    trend: 'up' | 'down' | 'stable';
  };
  sprint?: {
    name: string;
    progress: number; // 0-100
    daysRemaining: number;
    completedStories: number;
    totalStories: number;
  };
}

export function ProgressPanel({ missions, velocity, sprint }: ProgressPanelProps) {
  const completionRate = missions.total > 0
    ? Math.round((missions.completed / missions.total) * 100)
    : 0;

  const getTrendIcon = () => {
    if (velocity.trend === 'up') return <TrendingUp className="w-4 h-4 text-accent-green" />;
    if (velocity.trend === 'down') return <TrendingUp className="w-4 h-4 text-accent-red rotate-180" />;
    return <TrendingUp className="w-4 h-4 text-text-3 rotate-90" />;
  };

  const getTrendColor = () => {
    if (velocity.trend === 'up') return 'text-accent-green';
    if (velocity.trend === 'down') return 'text-accent-red';
    return 'text-text-3';
  };

  return (
    <div className="bg-bg-0 rounded-lg border border-border-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-1">Progress & Velocity</h2>
        <Target className="w-5 h-5 text-accent-blue" />
      </div>

      {/* Mission Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-bg-1 rounded-lg p-4 border border-border-1">
          <div className="text-2xl font-bold text-text-1">{missions.total}</div>
          <div className="text-xs text-text-3 mt-1">Total Missions</div>
        </div>
        <div className="bg-bg-1 rounded-lg p-4 border border-accent-green/30">
          <div className="text-2xl font-bold text-accent-green">{missions.completed}</div>
          <div className="text-xs text-text-3 mt-1">Completed</div>
        </div>
        <div className="bg-bg-1 rounded-lg p-4 border border-accent-blue/30">
          <div className="text-2xl font-bold text-accent-blue">{missions.inProgress}</div>
          <div className="text-xs text-text-3 mt-1">In Progress</div>
        </div>
        <div className="bg-bg-1 rounded-lg p-4 border border-accent-amber/30">
          <div className="text-2xl font-bold text-accent-amber">{missions.blocked}</div>
          <div className="text-xs text-text-3 mt-1">Blocked</div>
        </div>
      </div>

      {/* Completion Rate Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-2">Overall Completion Rate</span>
          <span className="text-sm font-semibold text-accent-green">{completionRate}%</span>
        </div>
        <div className="w-full h-2 bg-bg-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-green rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Velocity Section */}
      <div className="pt-4 border-t border-border-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">
            Mission Velocity
          </h3>
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className={`text-xs font-medium ${getTrendColor()}`}>
              {velocity.trend === 'up' ? '+' : velocity.trend === 'down' ? '-' : ''}
              {Math.abs(velocity.current - velocity.average).toFixed(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-bg-1 rounded-lg p-4 border border-border-1">
            <div className="text-xs text-text-3 mb-1">Current Week</div>
            <div className="text-xl font-bold text-text-1">{velocity.current}</div>
            <div className="text-xs text-text-3 mt-1">missions/week</div>
          </div>
          <div className="bg-bg-1 rounded-lg p-4 border border-border-1">
            <div className="text-xs text-text-3 mb-1">Average</div>
            <div className="text-xl font-bold text-text-2">{velocity.average}</div>
            <div className="text-xs text-text-3 mt-1">missions/week</div>
          </div>
        </div>
      </div>

      {/* Sprint Progress (if available) */}
      {sprint && (
        <div className="pt-4 border-t border-border-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent-blue" />
              <h3 className="text-sm font-semibold text-text-2">
                {sprint.name}
              </h3>
            </div>
            <div className="text-xs text-text-3">
              {sprint.daysRemaining} days remaining
            </div>
          </div>

          {/* Sprint Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-3">
                {sprint.completedStories} of {sprint.totalStories} stories
              </span>
              <span className="text-xs font-semibold text-accent-blue">{sprint.progress}%</span>
            </div>
            <div className="w-full h-2 bg-bg-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-blue rounded-full transition-all duration-500"
                style={{ width: `${sprint.progress}%` }}
              />
            </div>
          </div>

          {/* Sprint Status */}
          <div className="flex items-center gap-2 px-3 py-2 bg-bg-1 rounded border border-border-1">
            <CheckCircle2 className="w-4 h-4 text-accent-green" />
            <span className="text-xs text-text-2">
              {sprint.progress >= 100 ? 'Sprint completed!' :
               sprint.progress >= 75 ? 'On track to complete' :
               sprint.progress >= 50 ? 'Making good progress' :
               'Need to accelerate'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
