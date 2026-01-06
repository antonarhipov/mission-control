import { useState } from 'react';
import { clsx } from 'clsx';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  AlertTriangle,
  ChevronRight,
  GitBranch,
  Users,
} from 'lucide-react';
import { worktrees, getAgentById } from '@/data/mockData';
import { useDataModel } from '@/hooks/useDataModel';
import type { Task, TaskV2, TaskStatus, Worktree } from '@/types';

// Extended task data with positions for the graph
interface GraphNode extends Task {
  x: number;
  y: number;
  column: number;
  row: number;
  worktree?: Worktree;
  taskV2?: TaskV2; // For V2 data
}

// Calculate node positions based on dependencies
function calculateGraphLayout(tasks: (Task | TaskV2)[], isV2: boolean): GraphNode[] {
  const nodeMap = new Map<string, GraphNode>();
  
  // Define column positions for each status
  const columnX: Record<TaskStatus, number> = {
    'done': 100,
    'in-progress': 320,
    'review': 540,
    'backlog': 760,
    'blocked': 540,
  };

  // Group tasks by status for row calculation
  const statusGroups: Record<TaskStatus, (Task | TaskV2)[]> = {
    'done': [],
    'in-progress': [],
    'review': [],
    'backlog': [],
    'blocked': [],
  };

  tasks.forEach(task => {
    statusGroups[task.status].push(task);
  });

  // Assign positions
  tasks.forEach(task => {
    const tasksInColumn = statusGroups[task.status];
    const row = tasksInColumn.indexOf(task);
    const totalInColumn = tasksInColumn.length;

    // Center vertically based on number of tasks in column
    const startY = 200 - ((totalInColumn - 1) * 60);

    // Type guard for V2
    const isTaskV2 = (t: Task | TaskV2): t is TaskV2 => {
      return 'worktrees' in t && Array.isArray(t.worktrees);
    };

    const taskV2 = isTaskV2(task) ? task : undefined;
    const worktree = !isV2 && 'worktreeId' in task && task.worktreeId
      ? worktrees.find(w => w.id === task.worktreeId)
      : undefined;

    nodeMap.set(task.id, {
      ...task as Task,
      x: columnX[task.status],
      y: startY + (row * 120),
      column: Object.keys(columnX).indexOf(task.status),
      row,
      worktree,
      taskV2,
    });
  });

  return Array.from(nodeMap.values());
}

export function DependenciesPanel() {
  const { tasks, isV2 } = useDataModel();
  const [selectedTask, setSelectedTask] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<'graph' | 'list' | 'timeline'>('graph');
  const graphNodes = calculateGraphLayout(tasks, isV2);

  // Find critical path
  const criticalPath = ['ORD-142', 'ORD-145', 'ORD-146'];

  return (
    <div className="flex flex-col h-full bg-bg-0">
      {/* Header */}
      <div className="px-5 py-4 bg-bg-1 border-b border-border-1 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-base font-semibold mb-1">Task Dependencies & Workflow</h2>
          <p className="text-xs text-text-3">
            {tasks.length} tasks • {tasks.filter(t => t.status === 'in-progress').length} in progress • 
            {tasks.filter(t => t.dependsOn?.length).length} with dependencies
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex gap-0.5 bg-bg-2 p-0.5 rounded">
            {(['graph', 'list', 'timeline'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={clsx(
                  'px-3 py-1.5 text-[11px] font-medium rounded transition-colors capitalize',
                  viewMode === mode
                    ? 'bg-bg-3 text-text-1'
                    : 'text-text-2 hover:text-text-1'
                )}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-bg-2 rounded p-0.5">
            <button
              onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
              className="p-1.5 hover:bg-bg-3 rounded transition-colors"
            >
              <ZoomOut className="w-4 h-4 text-text-2" />
            </button>
            <span className="text-[11px] text-text-3 w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
              className="p-1.5 hover:bg-bg-3 rounded transition-colors"
            >
              <ZoomIn className="w-4 h-4 text-text-2" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 hover:bg-bg-3 rounded transition-colors"
            >
              <Maximize2 className="w-4 h-4 text-text-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Graph area */}
        <div className="flex-1 overflow-auto p-5">
          {viewMode === 'graph' && (
            <DependencyGraph
              nodes={graphNodes}
              selectedTask={selectedTask}
              onSelectTask={setSelectedTask}
              zoom={zoom}
              criticalPath={criticalPath}
            />
          )}
          {viewMode === 'list' && (
            <DependencyList
              tasks={tasks}
              selectedTask={selectedTask}
              onSelectTask={(task) => setSelectedTask(graphNodes.find(n => n.id === task.id) || null)}
            />
          )}
          {viewMode === 'timeline' && (
            <DependencyTimeline
              nodes={graphNodes}
              selectedTask={selectedTask}
              onSelectTask={setSelectedTask}
            />
          )}
        </div>

        {/* Detail sidebar */}
        <TaskDetailSidebar
          task={selectedTask}
          allTasks={tasks}
          criticalPath={criticalPath}
        />
      </div>
    </div>
  );
}

function DependencyGraph({
  nodes,
  selectedTask,
  onSelectTask,
  zoom,
  criticalPath,
}: {
  nodes: GraphNode[];
  selectedTask: GraphNode | null;
  onSelectTask: (task: GraphNode) => void;
  zoom: number;
  criticalPath: string[];
}) {
  // Calculate edges
  const edges: { from: GraphNode; to: GraphNode; isCritical: boolean }[] = [];
  nodes.forEach(node => {
    if (node.blocks) {
      node.blocks.forEach(blockedId => {
        const blockedNode = nodes.find(n => n.id === blockedId);
        if (blockedNode) {
          const isCritical = criticalPath.includes(node.id) && criticalPath.includes(blockedId);
          edges.push({ from: node, to: blockedNode, isCritical });
        }
      });
    }
  });

  return (
    <div 
      className="relative min-h-[500px]"
      style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
    >
      {/* Column headers */}
      <div className="absolute top-0 left-0 right-0 flex">
        {['Done', 'In Progress', 'Review', 'Backlog'].map((label, i) => (
          <div
            key={label}
            className="text-[10px] font-semibold uppercase tracking-wide text-text-3 text-center"
            style={{ position: 'absolute', left: 100 + i * 220 - 40, width: 80 }}
          >
            {label}
          </div>
        ))}
      </div>

      <svg
        className="absolute top-8 left-0"
        width="900"
        height="450"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#6e7681" />
          </marker>
          <marker id="arrowhead-critical" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#f85149" />
          </marker>
        </defs>

        {/* Edges */}
        {edges.map((edge, i) => {
          const fromX = edge.from.x + 70;
          const fromY = edge.from.y + 35;
          const toX = edge.to.x;
          const toY = edge.to.y + 35;
          const midX = (fromX + toX) / 2;

          return (
            <path
              key={i}
              d={`M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`}
              fill="none"
              stroke={edge.isCritical ? '#f85149' : '#6e7681'}
              strokeWidth={edge.isCritical ? 2 : 1.5}
              markerEnd={edge.isCritical ? 'url(#arrowhead-critical)' : 'url(#arrowhead)'}
              style={{ opacity: edge.isCritical ? 1 : 0.6 }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => (
        <GraphNodeCard
          key={node.id}
          node={node}
          isSelected={selectedTask?.id === node.id}
          isCritical={criticalPath.includes(node.id)}
          onClick={() => onSelectTask(node)}
        />
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-bg-1 border border-border-1 rounded-lg p-3 text-[11px]">
        <div className="font-semibold mb-2 text-text-2">Legend</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-accent-green" />
            <span className="text-text-3">Done</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-accent-blue" />
            <span className="text-text-3">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-accent-amber" />
            <span className="text-text-3">Review / Backlog</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-accent-red" />
            <span className="text-text-3">Blocked</span>
          </div>
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border-1">
            <span className="w-4 h-0.5 bg-accent-red" />
            <span className="text-text-3">Critical Path</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GraphNodeCard({
  node,
  isSelected,
  isCritical,
  onClick,
}: {
  node: GraphNode;
  isSelected: boolean;
  isCritical: boolean;
  onClick: () => void;
}) {
  const statusStyles: Record<TaskStatus, { bg: string; border: string; dot: string }> = {
    done: { bg: 'bg-accent-green/10', border: 'border-accent-green/30', dot: 'bg-accent-green' },
    'in-progress': { bg: 'bg-accent-blue/10', border: 'border-accent-blue/30', dot: 'bg-accent-blue' },
    review: { bg: 'bg-accent-amber/10', border: 'border-accent-amber/30', dot: 'bg-accent-amber' },
    backlog: { bg: 'bg-bg-3', border: 'border-border-1', dot: 'bg-text-3' },
    blocked: { bg: 'bg-accent-red/10', border: 'border-accent-red/30', dot: 'bg-accent-red' },
  };

  const style = statusStyles[node.status];

  // Get agents from either V2 task or V1 worktree
  const activeAgents = node.taskV2
    ? node.taskV2.agents.filter(a => a.isActive)
    : (node.worktree?.agents.filter(a => a.isActive) || []);

  return (
    <button
      onClick={onClick}
      className={clsx(
        'absolute w-[140px] p-3 rounded-lg border text-left transition-all hover:-translate-y-0.5',
        style.bg,
        isSelected
          ? 'border-accent-blue shadow-[0_0_0_2px_rgba(88,166,255,0.3)]'
          : style.border,
        isCritical && !isSelected && 'shadow-[0_0_10px_rgba(248,81,73,0.2)]',
        node.status === 'in-progress' && 'shadow-[0_0_15px_rgba(88,166,255,0.15)]'
      )}
      style={{ left: node.x, top: node.y + 30 }}
    >
      {/* Task ID */}
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[10px] text-text-3">{node.id}</span>
        <span className={clsx('w-2 h-2 rounded-full', style.dot)} />
      </div>

      {/* Title */}
      <div className="text-[11px] font-medium leading-tight line-clamp-2 mb-2">
        {node.title.length > 40 ? node.title.slice(0, 40) + '...' : node.title}
      </div>

      {/* Worktree info */}
      {node.worktree && (
        <div className="flex items-center gap-1 mb-2 text-[9px] text-text-3">
          <GitBranch className="w-2.5 h-2.5" />
          <span className="font-mono truncate">{node.worktree.branch.split('/').pop()}</span>
        </div>
      )}

      {/* Agent team */}
      {activeAgents.length > 0 && (
        <div className="flex items-center gap-1">
          {activeAgents.slice(0, 2).map(wa => {
            const agent = getAgentById(wa.agentId);
            return agent ? (
              <span
                key={wa.agentId}
                className="w-5 h-5 rounded flex items-center justify-center text-[10px]"
                style={{ backgroundColor: agent.color + '40' }}
                title={agent.name}
              >
                {agent.emoji}
              </span>
            ) : null;
          })}
          {node.worktree && node.worktree.agents.length > 2 && (
            <span className="text-[10px] text-text-3">+{node.worktree.agents.length - 2}</span>
          )}
        </div>
      )}

      {/* Progress */}
      {node.progress !== undefined && (
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex-1 h-1 bg-bg-3 rounded overflow-hidden">
            <div
              className="h-full bg-accent-blue rounded"
              style={{ width: `${node.progress}%` }}
            />
          </div>
          <span className="text-[9px] text-text-3">{node.progress}%</span>
        </div>
      )}

      {/* Critical path indicator */}
      {isCritical && (
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent-red rounded-full flex items-center justify-center">
          <AlertTriangle className="w-2.5 h-2.5 text-white" />
        </div>
      )}
    </button>
  );
}

function DependencyList({
  tasks,
  selectedTask,
  onSelectTask,
}: {
  tasks: (Task | TaskV2)[];
  selectedTask: GraphNode | null;
  onSelectTask: (task: Task | TaskV2) => void;
}) {
  return (
    <div className="space-y-2">
      {tasks.map(task => {
        // Type guard for V2
        const isTaskV2 = (t: Task | TaskV2): t is TaskV2 => {
          return 'worktrees' in t && Array.isArray(t.worktrees);
        };
        const taskV2 = isTaskV2(task) ? task : undefined;
        const worktree = !taskV2 && 'worktreeId' in task && task.worktreeId
          ? worktrees.find(w => w.id === task.worktreeId)
          : undefined;
        const deps = task.dependsOn?.length || 0;
        const blocks = task.blocks?.length || 0;

        return (
          <button
            key={task.id}
            onClick={() => onSelectTask(task)}
            className={clsx(
              'w-full p-4 bg-bg-1 border rounded-lg text-left transition-all hover:border-border-2',
              selectedTask?.id === task.id
                ? 'border-accent-blue shadow-[0_0_0_1px_rgba(88,166,255,0.3)]'
                : 'border-border-1'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[11px] text-text-3">{task.id}</span>
                  <StatusBadge status={task.status} />
                </div>
                <h3 className="text-sm font-medium mb-2">{task.title}</h3>
                <div className="flex items-center gap-3 text-[11px] text-text-3">
                  {deps > 0 && (
                    <span className="flex items-center gap-1">
                      <ChevronRight className="w-3 h-3 rotate-180" />
                      {deps} dependencies
                    </span>
                  )}
                  {blocks > 0 && (
                    <span className="flex items-center gap-1">
                      <ChevronRight className="w-3 h-3" />
                      Blocks {blocks}
                    </span>
                  )}
                  {worktree && (
                    <span className="flex items-center gap-1">
                      <GitBranch className="w-3 h-3" />
                      {worktree.branch}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {(taskV2 || worktree) && (
                  <div className="flex -space-x-1">
                    {(taskV2
                      ? taskV2.agents.filter(a => a.isActive).slice(0, 3)
                      : worktree?.agents.filter(a => a.isActive).slice(0, 3) || []
                    ).map(wa => {
                      const agent = getAgentById(wa.agentId);
                      return agent ? (
                        <span
                          key={wa.agentId}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 border-bg-1"
                          style={{ backgroundColor: agent.color }}
                        >
                          {agent.emoji}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
                {task.progress !== undefined && (
                  <span className="text-xs font-mono text-text-2">{task.progress}%</span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function DependencyTimeline({
  nodes,
  selectedTask,
  onSelectTask,
}: {
  nodes: GraphNode[];
  selectedTask: GraphNode | null;
  onSelectTask: (task: GraphNode) => void;
}) {
  const phases = [
    { name: 'Completed', tasks: nodes.filter(n => n.status === 'done') },
    { name: 'Active', tasks: nodes.filter(n => n.status === 'in-progress' || n.status === 'review') },
    { name: 'Upcoming', tasks: nodes.filter(n => n.status === 'backlog' || n.status === 'blocked') },
  ];

  return (
    <div className="relative">
      <div className="absolute top-0 bottom-0 left-[120px] w-0.5 bg-border-1" />

      <div className="space-y-8">
        {phases.map((phase, phaseIndex) => (
          <div key={phase.name}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-[100px] text-right">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-text-3">
                  {phase.name}
                </span>
              </div>
              <div
                className={clsx(
                  'w-3 h-3 rounded-full border-2 border-bg-0 z-10',
                  phaseIndex === 0 && 'bg-accent-green',
                  phaseIndex === 1 && 'bg-accent-blue',
                  phaseIndex === 2 && 'bg-text-3'
                )}
              />
            </div>

            <div className="space-y-2 pl-[140px]">
              {phase.tasks.map(task => {
                const activeAgents = task.taskV2
                  ? task.taskV2.agents.filter(a => a.isActive)
                  : (task.worktree?.agents.filter(a => a.isActive) || []);

                return (
                  <button
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className={clsx(
                      'w-full max-w-xl p-3 bg-bg-1 border rounded-lg text-left transition-all hover:border-border-2',
                      selectedTask?.id === task.id ? 'border-accent-blue' : 'border-border-1'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-text-3">{task.id}</span>
                        <span className="text-xs font-medium">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {activeAgents.slice(0, 2).map(wa => {
                          const agent = getAgentById(wa.agentId);
                          return agent ? (
                            <span
                              key={wa.agentId}
                              className="w-5 h-5 rounded flex items-center justify-center text-[10px]"
                              style={{ backgroundColor: agent.color + '40' }}
                            >
                              {agent.emoji}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskDetailSidebar({
  task,
  allTasks,
  criticalPath,
}: {
  task: GraphNode | null;
  allTasks: (Task | TaskV2)[];
  criticalPath: string[];
}) {
  if (!task) {
    return (
      <div className="w-[340px] bg-bg-1 border-l border-border-1 flex items-center justify-center">
        <div className="text-center text-text-3">
          <div className="text-3xl mb-2">👆</div>
          <div className="text-sm">Select a task to view details</div>
        </div>
      </div>
    );
  }

  // Get agents from either V2 task or V1 worktree
  const worktreeAgents = task.taskV2
    ? task.taskV2.agents
    : (task.worktree?.agents || []);
  const dependencies = allTasks.filter(t => task.dependsOn?.includes(t.id));
  const blocking = allTasks.filter(t => task.blocks?.includes(t.id));
  const isOnCriticalPath = criticalPath.includes(task.id);

  return (
    <div className="w-[340px] bg-bg-1 border-l border-border-1 flex flex-col">
      <div className="px-4 py-3 border-b border-border-1 shrink-0">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-text-2">
          Task Details
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Critical path warning */}
        {isOnCriticalPath && (
          <div className="bg-accent-red/10 border border-accent-red/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-accent-red text-xs font-medium mb-1">
              <AlertTriangle className="w-4 h-4" />
              Critical Path
            </div>
            <p className="text-[11px] text-text-2">
              This task is on the critical path. Delays will impact the overall timeline.
            </p>
          </div>
        )}

        {/* Task header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs text-text-3">{task.id}</span>
            <StatusBadge status={task.status} />
            <span
              className={clsx(
                'text-[10px] font-medium px-1.5 py-0.5 rounded',
                task.priority === 'high' && 'bg-accent-red/20 text-accent-red',
                task.priority === 'medium' && 'bg-accent-amber/20 text-accent-amber',
                task.priority === 'low' && 'bg-accent-green/20 text-accent-green'
              )}
            >
              {task.priority}
            </span>
          </div>
          <h3 className="text-sm font-semibold">{task.title}</h3>
        </div>

        {/* Worktree info */}
        {task.worktree && (
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-text-3 mb-2 flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" />
              Worktree
            </h4>
            <div className="bg-bg-2 rounded p-3">
              <div className="font-mono text-xs mb-2">{task.worktree.branch}</div>
              <div className="flex items-center gap-3 text-[10px] text-text-3">
                <span>{task.worktree.fileChanges.length} files</span>
                <span>{task.worktree.commits.length} commits</span>
                <span className="font-mono">${task.worktree.cost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Progress */}
        {task.progress !== undefined && (
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-text-3">Progress</span>
              <span className="font-mono">{task.progress}%</span>
            </div>
            <div className="h-2 bg-bg-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full transition-all"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Agent team */}
        {worktreeAgents.length > 0 && (
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-text-3 mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Agent Team
            </h4>
            <div className="space-y-2">
              {worktreeAgents.map(wa => {
                const agent = getAgentById(wa.agentId);
                if (!agent) return null;
                return (
                  <div key={wa.agentId} className="flex items-center gap-2.5 p-2 bg-bg-2 rounded">
                    <div
                      className={clsx(
                        'w-8 h-8 rounded flex items-center justify-center text-sm',
                        wa.isActive && 'ring-2 ring-accent-green ring-offset-1 ring-offset-bg-2'
                      )}
                      style={{ backgroundColor: agent.color + '30' }}
                    >
                      {agent.emoji}
                    </div>
                    <div>
                      <div className="text-xs font-medium flex items-center gap-1.5">
                        {agent.name}
                        {wa.isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                        )}
                      </div>
                      <div className="text-[10px] text-text-3">
                        {wa.stage} • {wa.role}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dependencies */}
        {dependencies.length > 0 && (
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-text-3 mb-2">
              Depends On ({dependencies.length})
            </h4>
            <div className="space-y-1.5">
              {dependencies.map(dep => (
                <div key={dep.id} className="flex items-center gap-2 p-2 bg-bg-2 rounded text-xs">
                  <StatusDot status={dep.status} />
                  <span className="font-mono text-text-3">{dep.id}</span>
                  <span className="flex-1 truncate text-text-2">
                    {dep.title.length > 30 ? dep.title.slice(0, 30) + '...' : dep.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blocking */}
        {blocking.length > 0 && (
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-text-3 mb-2">
              Blocks ({blocking.length})
            </h4>
            <div className="space-y-1.5">
              {blocking.map(dep => (
                <div key={dep.id} className="flex items-center gap-2 p-2 bg-bg-2 rounded text-xs">
                  <StatusDot status={dep.status} />
                  <span className="font-mono text-text-3">{dep.id}</span>
                  <span className="flex-1 truncate text-text-2">
                    {dep.title.length > 30 ? dep.title.slice(0, 30) + '...' : dep.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {task.tags.length > 0 && (
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-text-3 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-1.5">
              {task.tags.map(tag => (
                <span
                  key={tag}
                  className={clsx(
                    'text-[10px] font-medium px-2 py-1 rounded',
                    tag === 'feature' && 'bg-accent-purple/20 text-accent-purple',
                    tag === 'bug' && 'bg-accent-red/20 text-accent-red',
                    tag === 'docs' && 'bg-accent-blue/20 text-accent-blue',
                    tag === 'backend' && 'bg-accent-green/20 text-accent-green',
                    tag === 'api' && 'bg-accent-amber/20 text-accent-amber',
                    tag === 'database' && 'bg-accent-purple/20 text-accent-purple',
                    tag === 'migration' && 'bg-accent-cyan/20 text-accent-cyan',
                    tag === 'testing' && 'bg-accent-green/20 text-accent-green',
                    tag === 'review' && 'bg-accent-amber/20 text-accent-amber'
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border-1 shrink-0">
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-medium bg-bg-2 border border-border-1 rounded hover:bg-bg-3 transition-colors">
            <GitBranch className="w-3.5 h-3.5" />
            View Worktree
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-medium bg-accent-blue text-white rounded hover:brightness-110 transition-all">
            Open in Diff
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: TaskStatus }) {
  const config: Record<TaskStatus, { label: string; className: string }> = {
    done: { label: 'Done', className: 'bg-accent-green/20 text-accent-green' },
    'in-progress': { label: 'In Progress', className: 'bg-accent-blue/20 text-accent-blue' },
    review: { label: 'Review', className: 'bg-accent-amber/20 text-accent-amber' },
    backlog: { label: 'Backlog', className: 'bg-bg-3 text-text-2' },
    blocked: { label: 'Blocked', className: 'bg-accent-red/20 text-accent-red' },
  };

  const { label, className } = config[status];
  return <span className={clsx('text-[10px] font-medium px-1.5 py-0.5 rounded', className)}>{label}</span>;
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    done: 'bg-accent-green',
    'in-progress': 'bg-accent-blue',
    review: 'bg-accent-amber',
    backlog: 'bg-text-3',
    blocked: 'bg-accent-red',
  };
  return <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', colors[status] || 'bg-text-3')} />;
}
