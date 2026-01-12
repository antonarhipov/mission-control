import { Moon, AlertCircle } from 'lucide-react';
import { BackgroundTaskCard } from './BackgroundTaskCard';
import type { BackgroundTask } from '@/types';

interface BackgroundTaskWithDetails extends BackgroundTask {
  missionName: string;
  progress?: number;
}

interface BackgroundTasksPanelProps {
  tasks: BackgroundTaskWithDetails[];
  onViewMission: (missionId: string) => void;
  onAnswerQuestion?: (missionId: string) => void;
}

export function BackgroundTasksPanel({
  tasks,
  onViewMission,
  onAnswerQuestion,
}: BackgroundTasksPanelProps) {
  const needsAttentionCount = tasks.filter(t => t.needsAttention).length;

  // Group tasks by status
  const needsAttention = tasks.filter(t => t.needsAttention);
  const inProgress = tasks.filter(t => !t.needsAttention && (t.progress || 0) < 100);
  const completed = tasks.filter(t => (t.progress || 0) >= 100);
  const scheduled = tasks.filter(t => t.mode === 'scheduled' && t.scheduledFor && new Date(t.scheduledFor) > new Date());

  return (
    <div className="flex flex-col h-full bg-bg-0">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-purple/10 rounded-lg">
              <Moon className="w-6 h-6 text-accent-purple" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-1">Background Tasks</h2>
              <p className="text-sm text-text-3">
                Missions running without your active attention
              </p>
            </div>
          </div>
          {needsAttentionCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-accent-red/10 border border-accent-red/30 rounded-lg">
              <AlertCircle className="w-4 h-4 text-accent-red" />
              <span className="text-sm font-medium text-accent-red">
                {needsAttentionCount} {needsAttentionCount === 1 ? 'needs' : 'need'} attention
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-text-3">
              <Moon className="w-12 h-12 mb-2 opacity-50" />
              <p className="text-center">
                No background tasks running
                <br />
                <span className="text-xs">
                  Switch a mission to background mode to work asynchronously
                </span>
              </p>
            </div>
          ) : (
            <>
              {/* Needs Attention Section */}
              {needsAttention.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-accent-red" />
                    Needs Your Attention
                  </h3>
                  <div className="space-y-3">
                    {needsAttention.map(task => (
                      <BackgroundTaskCard
                        key={task.missionId}
                        task={task}
                        missionName={task.missionName}
                        progress={task.progress}
                        onViewMission={onViewMission}
                        onAnswerQuestion={onAnswerQuestion}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* In Progress Section */}
              {inProgress.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">
                    In Progress
                  </h3>
                  <div className="space-y-3">
                    {inProgress.map(task => (
                      <BackgroundTaskCard
                        key={task.missionId}
                        task={task}
                        missionName={task.missionName}
                        progress={task.progress}
                        onViewMission={onViewMission}
                        onAnswerQuestion={onAnswerQuestion}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Scheduled Section */}
              {scheduled.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">
                    Scheduled
                  </h3>
                  <div className="space-y-3">
                    {scheduled.map(task => (
                      <BackgroundTaskCard
                        key={task.missionId}
                        task={task}
                        missionName={task.missionName}
                        progress={task.progress}
                        onViewMission={onViewMission}
                        onAnswerQuestion={onAnswerQuestion}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Section */}
              {completed.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-text-2 uppercase tracking-wide">
                    Recently Completed
                  </h3>
                  <div className="space-y-3">
                    {completed.map(task => (
                      <BackgroundTaskCard
                        key={task.missionId}
                        task={task}
                        missionName={task.missionName}
                        progress={task.progress}
                        onViewMission={onViewMission}
                        onAnswerQuestion={onAnswerQuestion}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
