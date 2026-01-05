import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { TabBar } from '@/components/layout/TabBar';
import { OverviewPanel } from '@/components/panels/OverviewPanel';
import { DiffPanel } from '@/components/panels/DiffPanel';
import { WorktreePanel } from '@/components/panels/WorktreePanel';
import { CostPanel } from '@/components/panels/CostPanel';
import { ConfigPanel } from '@/components/panels/ConfigPanel';
import { DependenciesPanel } from '@/components/panels/DependenciesPanel';
import { worktrees } from '@/data/mockData';
import type { TabId } from '@/types';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  // Shared selected worktree state across tabs
  const [selectedWorktreeId, setSelectedWorktreeId] = useState<string | null>(worktrees[0]?.id || null);

  const renderPanel = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewPanel
            selectedWorktreeId={selectedWorktreeId}
            onSelectWorktree={setSelectedWorktreeId}
          />
        );
      case 'worktree':
        return (
          <WorktreePanel
            selectedWorktreeId={selectedWorktreeId}
            onSelectWorktree={setSelectedWorktreeId}
          />
        );
      case 'diff':
        return (
          <DiffPanel
            selectedWorktreeId={selectedWorktreeId}
            onSelectWorktree={setSelectedWorktreeId}
          />
        );
      case 'cost':
        return <CostPanel />;
      case 'config':
        return <ConfigPanel />;
      case 'deps':
        return <DependenciesPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-bg-0">
      <Header />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-hidden">
        {renderPanel()}
      </main>
    </div>
  );
}

export default App;
