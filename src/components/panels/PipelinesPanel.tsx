import { TaskListSidebar } from '@/components/shared/TaskListSidebar';
import { PipelineDetailView } from '@/components/shared/PipelineDetailView';
import { useDataModel } from '@/hooks/useDataModel';
import type { TaskV2 } from '@/types';

interface PipelinesPanelProps {
  selectedTaskId: string | null;
  onSelectTask: (id: string) => void;
  onNavigateToDiff: (taskId: string, commitSha?: string) => void;
}

export function PipelinesPanel({
  selectedTaskId,
  onSelectTask,
  onNavigateToDiff,
}: PipelinesPanelProps) {
  const { tasks, isV2 } = useDataModel();

  // Type guard to check if task is TaskV2
  const isTaskV2 = (task: any): task is TaskV2 => {
    return 'worktrees' in task && Array.isArray(task.worktrees);
  };

  // Get the selected task, or default to the first task
  const selectedTask = selectedTaskId
    ? tasks.find(t => t.id === selectedTaskId)
    : tasks[0];

  // Ensure we have a selected task ID
  const actualSelectedTaskId = selectedTask?.id || null;

  // Only render if we're in V2 mode and have a valid V2 task
  const selectedTaskV2 = selectedTask && isTaskV2(selectedTask) ? selectedTask : null;

  return (
    <div className="grid grid-cols-[300px_1fr] h-full">
      <TaskListSidebar
        selectedTaskId={actualSelectedTaskId}
        onSelectTask={onSelectTask}
      />

      {selectedTaskV2 ? (
        <PipelineDetailView
          task={selectedTaskV2}
          onNavigateToDiff={onNavigateToDiff}
        />
      ) : (
        <div className="flex items-center justify-center h-full bg-bg-0">
          <div className="text-center">
            <p className="text-text-3 text-sm">No task selected</p>
            <p className="text-text-3 text-xs mt-1">
              {isV2 ? 'Select a task from the sidebar' : 'Please enable V2 mode to use this panel'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
