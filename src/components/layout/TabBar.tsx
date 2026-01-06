import { clsx } from 'clsx';
import type { TabId } from '@/types';
import { useDataModel } from '@/hooks/useDataModel';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
  badge?: number | string;
  alert?: boolean;
}

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const { isV2, tasks, worktrees } = useDataModel();

  // Calculate badge values based on V1 or V2 mode
  const pipelineBadge = isV2
    ? tasks.filter(t => t.status === 'in-progress' || t.status === 'review').length
    : worktrees?.filter(w => w.status === 'active' || w.status === 'conflict').length || 0;

  const diffBadge = isV2
    ? tasks.reduce((sum, t) => {
        const taskV2 = 'fileChanges' in t ? t : null;
        return sum + (taskV2?.fileChanges?.length || 0);
      }, 0)
    : worktrees?.reduce((sum, w) => sum + w.fileChanges.length, 0) || 0;

  // Reordered: Overview → Pipelines/Worktrees → Diff → Cost → Config → Dependencies
  const tabs: Tab[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    {
      id: 'worktree',
      label: isV2 ? 'Pipelines' : 'Worktrees',
      icon: isV2 ? '⚡' : '🌳',
      badge: pipelineBadge
    },
    { id: 'diff', label: 'Diff Viewer', icon: '📝', badge: diffBadge },
    { id: 'cost', label: 'Cost Analytics', icon: '💰' },
    { id: 'config', label: 'Config', icon: '⚙️' },
    { id: 'deps', label: 'Dependencies', icon: '🔗', badge: 2, alert: true },
  ];

  return (
    <div className="flex gap-0.5 px-3 bg-bg-1 border-b border-border-1 h-[38px] items-end shrink-0">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={clsx(
            'flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border-b-2 -mb-px transition-all',
            activeTab === tab.id
              ? 'text-text-1 border-accent-blue'
              : 'text-text-2 border-transparent hover:text-text-1 hover:bg-bg-2'
          )}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
          {tab.badge !== undefined && (
            <span
              className={clsx(
                'text-[10px] px-1.5 py-0.5 rounded-full',
                tab.alert ? 'bg-accent-amber text-black' : 'bg-bg-3 text-text-2'
              )}
            >
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
