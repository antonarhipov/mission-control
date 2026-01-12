import { MessageSquare, LayoutDashboard, Eye, BarChart3, Settings } from 'lucide-react';
import { WorkspaceId } from '@/types';
import clsx from 'clsx';

interface WorkspaceNavProps {
  activeWorkspace: WorkspaceId;
  onWorkspaceChange: (workspace: WorkspaceId) => void;
  // Optional notification badges
  pendingReviews?: number;
  unacknowledgedObservations?: number;
}

interface WorkspaceButton {
  id: WorkspaceId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const workspaces: WorkspaceButton[] = [
  {
    id: 'conversations',
    label: 'Conversations',
    icon: MessageSquare,
    description: 'Prepare specs, start missions with agent teams',
  },
  {
    id: 'missions',
    label: 'Missions',
    icon: LayoutDashboard,
    description: 'Monitor active missions, review plans',
  },
  {
    id: 'review',
    label: 'Review',
    icon: Eye,
    description: 'Review changes, approve decisions',
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: BarChart3,
    description: 'Progress, costs, agent performance',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    description: 'Configure agents, repositories, teams',
  },
];

export function WorkspaceNav({
  activeWorkspace,
  onWorkspaceChange,
  pendingReviews = 0,
  unacknowledgedObservations = 0,
}: WorkspaceNavProps) {
  return (
    <nav className="flex items-center gap-1 px-4 py-2 bg-bg-0 border-b border-border-1">
      {workspaces.map((workspace) => {
        const Icon = workspace.icon;
        const isActive = activeWorkspace === workspace.id;

        // Notification badge count
        let badgeCount = 0;
        if (workspace.id === 'review' && pendingReviews > 0) {
          badgeCount = pendingReviews;
        }

        return (
          <button
            key={workspace.id}
            onClick={() => onWorkspaceChange(workspace.id)}
            className={clsx(
              'group relative flex items-center gap-2 px-4 py-2 rounded-md transition-all',
              'hover:bg-bg-2',
              isActive
                ? 'bg-bg-2 text-text-1'
                : 'text-text-2 hover:text-text-1'
            )}
            title={workspace.description}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{workspace.label}</span>

            {/* Active indicator */}
            {isActive && (
              <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent-blue rounded-full" />
            )}

            {/* Notification badge */}
            {badgeCount > 0 && (
              <div className={clsx(
                "flex items-center justify-center min-w-[18px] h-[18px] px-1 text-white text-xs font-semibold rounded-full",
                workspace.id === 'review' ? 'bg-accent-amber' : 'bg-accent-red'
              )}>
                {badgeCount > 99 ? '99+' : badgeCount}
              </div>
            )}
          </button>
        );
      })}

      {/* Right-aligned info (optional) */}
      <div className="ml-auto flex items-center gap-4 text-xs text-text-3">
        <span>Multi-Agent Era v3.0</span>
      </div>
    </nav>
  );
}
