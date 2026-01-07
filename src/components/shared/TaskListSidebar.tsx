import { useState } from 'react';
import { clsx } from 'clsx';
import { CheckCircle2, AlertCircle, Clock, Archive, FileText } from 'lucide-react';
import { useDataModel } from '@/hooks/useDataModel';
import type { TaskStatus, Task, TaskV2 } from '@/types';

interface TaskListSidebarProps {
  selectedTaskId: string | null;
  onSelectTask: (id: string) => void;
}

export function TaskListSidebar({ selectedTaskId, onSelectTask }: TaskListSidebarProps) {
  const { tasks } = useDataModel();
  const [filter, setFilter] = useState<'all' | TaskStatus>('all');

  // Filter tasks based on selected filter
  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(t => t.status === filter);

  // Group tasks by status for better organization
  const groupedTasks = {
    'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
    'planning': filteredTasks.filter(t => t.status === 'planning'),
    'review': filteredTasks.filter(t => t.status === 'review'),
    'backlog': filteredTasks.filter(t => t.status === 'backlog'),
    'done': filteredTasks.filter(t => t.status === 'done'),
    'blocked': filteredTasks.filter(t => t.status === 'blocked'),
  };

  const statusConfig = {
    'in-progress': { icon: Clock, color: 'text-accent-blue', label: 'In Progress' },
    'planning': { icon: FileText, color: 'text-accent-purple', label: 'Planning' },
    'review': { icon: AlertCircle, color: 'text-accent-amber', label: 'Review' },
    'backlog': { icon: Archive, color: 'text-text-3', label: 'Backlog' },
    'done': { icon: CheckCircle2, color: 'text-accent-green', label: 'Done' },
    'blocked': { icon: AlertCircle, color: 'text-accent-red', label: 'Blocked' },
  };

  return (
    <div className="w-[300px] border-r border-border-1 bg-bg-1 flex flex-col">
      {/* Header with filter */}
      <div className="px-4 py-3 border-b border-border-1 shrink-0">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-text-2 mb-2">
          Tasks
        </h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | TaskStatus)}
          className="w-full px-2 py-1.5 text-xs bg-bg-2 border border-border-1 rounded hover:bg-bg-3 transition-colors"
        >
          <option value="all">All Tasks ({tasks.length})</option>
          <option value="in-progress">In Progress ({groupedTasks['in-progress'].length})</option>
          <option value="planning">Planning ({groupedTasks['planning'].length})</option>
          <option value="review">Review ({groupedTasks['review'].length})</option>
          <option value="backlog">Backlog ({groupedTasks['backlog'].length})</option>
          <option value="done">Done ({groupedTasks['done'].length})</option>
          <option value="blocked">Blocked ({groupedTasks['blocked'].length})</option>
        </select>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto">
        {filter === 'all' ? (
          // Show grouped by status when viewing all
          Object.entries(groupedTasks).map(([status, statusTasks]) => {
            if (statusTasks.length === 0) return null;
            const config = statusConfig[status as TaskStatus];
            const Icon = config.icon;

            return (
              <TaskGroup
                key={status}
                title={config.label}
                icon={Icon}
                color={config.color}
                tasks={statusTasks}
                selectedTaskId={selectedTaskId}
                onSelectTask={onSelectTask}
              />
            );
          })
        ) : (
          // Show flat list when filtered
          <div className="p-2 space-y-1">
            {filteredTasks.map(task => (
              <TaskListItem
                key={task.id}
                task={task}
                selected={task.id === selectedTaskId}
                onSelect={() => onSelectTask(task.id)}
              />
            ))}
          </div>
        )}

        {filteredTasks.length === 0 && (
          <div className="p-4 text-center text-xs text-text-3">
            No tasks found
          </div>
        )}
      </div>
    </div>
  );
}

interface TaskGroupProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  tasks: (Task | TaskV2)[];
  selectedTaskId: string | null;
  onSelectTask: (id: string) => void;
}

function TaskGroup({ title, icon: Icon, color, tasks, selectedTaskId, onSelectTask }: TaskGroupProps) {
  return (
    <div className="border-b border-border-1">
      <div className="px-3 py-2 bg-bg-2 flex items-center gap-2">
        <Icon className={clsx('w-3.5 h-3.5', color)} />
        <span className="text-[11px] font-semibold text-text-2">{title}</span>
        <span className="text-[10px] text-text-3 ml-auto">{tasks.length}</span>
      </div>
      <div className="p-2 space-y-1">
        {tasks.map(task => (
          <TaskListItem
            key={task.id}
            task={task}
            selected={task.id === selectedTaskId}
            onSelect={() => onSelectTask(task.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface TaskListItemProps {
  task: Task | TaskV2;
  selected: boolean;
  onSelect: () => void;
}

function TaskListItem({ task, selected, onSelect }: TaskListItemProps) {
  // Type guard to check if task is TaskV2
  const isTaskV2 = (t: Task | TaskV2): t is TaskV2 => {
    return 'worktrees' in t && Array.isArray(t.worktrees);
  };

  const taskV2 = isTaskV2(task) ? task : null;

  return (
    <button
      onClick={onSelect}
      className={clsx(
        'w-full text-left px-2 py-2 rounded transition-all',
        selected
          ? 'bg-accent-blue text-white shadow-md'
          : 'bg-bg-2 hover:bg-bg-3 border border-border-1'
      )}
    >
      <div className="flex items-start justify-between mb-1">
        <span className={clsx(
          'font-mono text-[10px] font-medium',
          selected ? 'text-white/80' : 'text-text-3'
        )}>
          {task.id}
        </span>
        <div
          className={clsx(
            'w-1.5 h-1.5 rounded-sm',
            (task.priority === 'critical' || task.priority === 'high') && 'bg-accent-red',
            task.priority === 'medium' && 'bg-accent-amber',
            task.priority === 'low' && 'bg-accent-green'
          )}
        />
      </div>

      <h3 className={clsx(
        'text-xs font-medium leading-snug mb-1.5 line-clamp-2',
        selected ? 'text-white' : 'text-text-1'
      )}>
        {task.title}
      </h3>

      <div className="flex items-center justify-between text-[10px]">
        {taskV2 && (
          <span className={clsx(
            'font-medium truncate',
            selected ? 'text-white/80' : 'text-text-3'
          )}>
            {taskV2.currentStage}
          </span>
        )}
        {task.progress !== undefined && (
          <span className={clsx(
            'font-medium',
            selected ? 'text-white/90' : 'text-accent-blue',
            !taskV2 && 'ml-auto'
          )}>
            {task.progress}%
          </span>
        )}
      </div>
    </button>
  );
}
