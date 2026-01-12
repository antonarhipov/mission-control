import { Circle, ArrowRight } from 'lucide-react';
import type { Plan, PlannedTask } from '@/types';

interface TaskGraphProps {
  plan: Plan;
}

export function TaskGraph({ plan }: TaskGraphProps) {
  if (!plan || plan.tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-3">
        <p>No tasks to display</p>
      </div>
    );
  }

  // Build dependency map
  const taskMap = new Map(plan.tasks.map(t => [t.id, t]));
  const dependents = new Map<string, string[]>(); // taskId -> tasks that depend on it

  plan.tasks.forEach(task => {
    if (task.dependsOn) {
      task.dependsOn.forEach(depId => {
        if (!dependents.has(depId)) {
          dependents.set(depId, []);
        }
        dependents.get(depId)!.push(task.id);
      });
    }
  });

  // Find root tasks (tasks with no dependencies)
  const rootTasks = plan.tasks.filter(t => !t.dependsOn || t.dependsOn.length === 0);

  // Render a task node
  const renderTask = (task: PlannedTask, level: number = 0) => {
    const childTasks = dependents.get(task.id) || [];

    return (
      <div key={task.id} className="relative">
        {/* Task Node */}
        <div
          className="flex items-center gap-3 p-3 rounded-lg border bg-bg-1 border-border-1"
          style={{ marginLeft: `${level * 24}px` }}
        >
          {/* Status Icon */}
          <Circle className="w-5 h-5 text-text-3 flex-shrink-0" />

          {/* Task Info */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-text-1">{task.title}</div>
            <div className="flex items-center gap-2 text-xs text-text-3 mt-0.5">
              {task.suggestedRole && (
                <span className="capitalize">{task.suggestedRole}</span>
              )}
              {task.estimate && (
                <span>${task.estimate.cost.toFixed(2)}</span>
              )}
              {task.parallelizable && (
                <span className="text-accent-blue">Parallel</span>
              )}
            </div>
          </div>

          {/* Dependencies indicator */}
          {childTasks.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-text-3">
              <ArrowRight className="w-3 h-3" />
              <span>{childTasks.length}</span>
            </div>
          )}
        </div>

        {/* Child Tasks */}
        {childTasks.length > 0 && (
          <div className="mt-2 space-y-2">
            {childTasks.map(childId => {
              const childTask = taskMap.get(childId);
              return childTask ? renderTask(childTask, level + 1) : null;
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-text-1 mb-2">Task Dependencies</h3>
          <p className="text-sm text-text-3">
            Visual representation of task execution flow and dependencies
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-text-3 pb-4 border-b border-border-1">
          <div className="flex items-center gap-2">
            <Circle className="w-4 h-4" />
            <span>Task</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            <span>Has dependents</span>
          </div>
        </div>

        {/* Task Tree */}
        <div className="space-y-3">
          {rootTasks.length > 0 ? (
            rootTasks.map(task => renderTask(task, 0))
          ) : (
            <div className="text-center text-text-3 py-8">
              <p>All tasks have dependencies</p>
              <p className="text-xs mt-1">Showing linear task list instead</p>
              <div className="mt-4 space-y-2">
                {plan.tasks.map(task => renderTask(task, 0))}
              </div>
            </div>
          )}
        </div>

        {/* Parallel Tasks Info */}
        {plan.tasks.some(t => t.parallelizable) && (
          <div className="mt-6 p-4 bg-accent-blue/5 border border-accent-blue/30 rounded-lg">
            <div className="text-sm font-medium text-accent-blue mb-1">
              Parallel Execution Available
            </div>
            <p className="text-xs text-text-2">
              {plan.tasks.filter(t => t.parallelizable).length} task(s) can run in parallel to reduce total execution time
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
