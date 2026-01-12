import { Moon, Clock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import type { BackgroundTask } from '@/types';

interface BackgroundTaskCardProps {
  task: BackgroundTask;
  missionName: string;
  progress?: number; // 0-100
  onViewMission: (missionId: string) => void;
  onAnswerQuestion?: (missionId: string) => void;
}

export function BackgroundTaskCard({
  task,
  missionName,
  progress = 0,
  onViewMission,
  onAnswerQuestion,
}: BackgroundTaskCardProps) {
  const getModeIcon = () => {
    switch (task.mode) {
      case 'background':
        return Moon;
      case 'scheduled':
        return Clock;
      case 'interactive':
        return Loader2;
    }
  };

  const getModeColor = () => {
    switch (task.mode) {
      case 'background':
        return 'text-accent-purple';
      case 'scheduled':
        return 'text-accent-amber';
      case 'interactive':
        return 'text-accent-blue';
    }
  };

  const getStatusDisplay = () => {
    if (task.needsAttention && task.blockingQuestion) {
      return {
        icon: AlertCircle,
        text: 'Needs Your Input',
        color: 'text-accent-red',
      };
    }

    if (progress >= 100) {
      return {
        icon: CheckCircle2,
        text: 'Completed',
        color: 'text-accent-green',
      };
    }

    if (task.mode === 'scheduled' && task.scheduledFor) {
      const scheduledTime = new Date(task.scheduledFor);
      const now = new Date();

      if (scheduledTime > now) {
        return {
          icon: Clock,
          text: `Starts ${scheduledTime.toLocaleTimeString()}`,
          color: 'text-accent-amber',
        };
      }
    }

    return {
      icon: Loader2,
      text: 'In Progress',
      color: 'text-accent-blue',
    };
  };

  const ModeIcon = getModeIcon();
  const status = getStatusDisplay();
  const StatusIcon = status.icon;

  return (
    <div
      className={`
        bg-bg-1 rounded-lg border transition-all
        ${task.needsAttention
          ? 'border-accent-red shadow-lg shadow-accent-red/20'
          : 'border-border-1 hover:border-border-2'
        }
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-border-1">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-text-1 truncate mb-1">
              {missionName}
            </h3>
            <div className="flex items-center gap-2 text-xs text-text-3">
              <ModeIcon className={`w-3 h-3 ${getModeColor()}`} />
              <span className="capitalize">{task.mode} Mode</span>
            </div>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${status.color} bg-bg-0`}>
            <StatusIcon className={`w-3 h-3 ${status.icon === Loader2 ? 'animate-spin' : ''}`} />
            <span>{status.text}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {progress > 0 && progress < 100 && (
        <div className="px-4 py-3 border-b border-border-1">
          <div className="flex items-center justify-between text-xs text-text-3 mb-2">
            <span>Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="h-2 bg-bg-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-blue rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Blocking Question */}
      {task.needsAttention && task.blockingQuestion && (
        <div className="px-4 py-3 bg-accent-red/5 border-b border-accent-red/20">
          <div className="text-xs font-medium text-accent-red mb-2">
            Blocking Question:
          </div>
          <p className="text-sm text-text-1 mb-3 leading-relaxed">
            {task.blockingQuestion}
          </p>
          <button
            onClick={() => onAnswerQuestion?.(task.missionId)}
            className="w-full px-3 py-2 bg-accent-red hover:bg-accent-red/80 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Answer Question
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="p-3">
        <button
          onClick={() => onViewMission(task.missionId)}
          className="w-full px-3 py-2 bg-bg-2 hover:bg-bg-3 text-text-1 border border-border-1 rounded-lg text-sm font-medium transition-colors"
        >
          View Mission Details
        </button>
      </div>
    </div>
  );
}
