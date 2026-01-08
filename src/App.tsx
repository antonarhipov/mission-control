import { useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { TabBar } from '@/components/layout/TabBar';
import { OverviewPanel } from '@/components/panels/OverviewPanel';
import { DiffPanel } from '@/components/panels/DiffPanel';
import { PipelinesPanel } from '@/components/panels/PipelinesPanel';
import { CostPanel } from '@/components/panels/CostPanel';
import { ConfigPanel } from '@/components/panels/ConfigPanel';
import { DependenciesPanel } from '@/components/panels/DependenciesPanel';
import { useDataModel } from '@/hooks/useDataModel';
import { worktrees } from '@/data/mockData';
import type { TabId } from '@/types';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const { tasks } = useDataModel();

  // V1 state (kept for DiffPanel backward compatibility)
  const [selectedWorktreeId, setSelectedWorktreeId] = useState<string | null>(worktrees[0]?.id || null);

  // Task-centric state
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(tasks[0]?.id || null);
  const [selectedCommitSha, setSelectedCommitSha] = useState<string | null>(null);
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);
  const [focusedCriterionId, setFocusedCriterionId] = useState<string | null>(null);

  // Navigation helpers
  const navigateToDiff = useCallback((taskId: string, commitSha?: string) => {
    setSelectedTaskId(taskId);
    setSelectedCommitSha(commitSha || null);
    setActiveTab('diff');
  }, []);

  const navigateToPipeline = useCallback((taskId: string, criterionId?: string) => {
    setSelectedTaskId(taskId);
    setSelectedCommitSha(null); // Clear commit context
    setActiveTab('worktree'); // Navigate to pipelines tab

    // Set focused criterion for deep linking
    if (criterionId) {
      setFocusedCriterionId(criterionId);
      // Clear focus after animation completes
      setTimeout(() => setFocusedCriterionId(null), 3000);
    }
  }, []);

  const navigateToDependencies = useCallback((taskId: string) => {
    setSelectedTaskId(taskId);
    setFocusedTaskId(taskId);
    setActiveTab('deps');

    // Clear focus after animation completes
    setTimeout(() => setFocusedTaskId(null), 3000);
  }, []);

  const renderPanel = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewPanel
            selectedWorktreeId={selectedWorktreeId}
            onSelectWorktree={setSelectedWorktreeId}
            onNavigateToPipeline={navigateToPipeline}
            onNavigateToDependencies={navigateToDependencies}
          />
        );
      case 'worktree':
        return (
          <PipelinesPanel
            selectedTaskId={selectedTaskId}
            onSelectTask={setSelectedTaskId}
            onNavigateToDiff={navigateToDiff}
            focusedCriterionId={focusedCriterionId || undefined}
          />
        );
      case 'diff':
        return (
          <DiffPanel
            selectedWorktreeId={selectedWorktreeId}
            onSelectWorktree={setSelectedWorktreeId}
            selectedTaskId={selectedTaskId}
            selectedCommitSha={selectedCommitSha}
            onNavigateToPipeline={navigateToPipeline}
          />
        );
      case 'cost':
        return <CostPanel />;
      case 'config':
        return <ConfigPanel />;
      case 'deps':
        return (
          <DependenciesPanel
            selectedTaskId={selectedTaskId}
            focusedTaskId={focusedTaskId}
            onSelectTask={setSelectedTaskId}
            onNavigateToDiff={navigateToDiff}
            onNavigateToPipeline={navigateToPipeline}
          />
        );
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
