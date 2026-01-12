import { useState, useCallback, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { TabBar } from '@/components/layout/TabBar';
import { WorkspaceNav } from '@/components/layout/WorkspaceNav';
import { OverviewPanel } from '@/components/panels/OverviewPanel';
import { DiffPanel } from '@/components/panels/DiffPanel';
import { PipelinesPanel } from '@/components/panels/PipelinesPanel';
import { CostPanel } from '@/components/panels/CostPanel';
import { ConfigPanel } from '@/components/panels/ConfigPanel';
import { DependenciesPanel } from '@/components/panels/DependenciesPanel';
import { CommandCenter } from '@/components/workspaces/CommandCenter';
import { MissionsWorkspace } from '@/components/workspaces/MissionsWorkspace';
import { ReviewSurface } from '@/components/workspaces/ReviewSurface';
import { InsightsWorkspace } from '@/components/workspaces/InsightsWorkspace';
import { SettingsWorkspace } from '@/components/workspaces/SettingsWorkspace';
import { useDataModel } from '@/hooks/useDataModel';
import { useV3DataModel } from '@/hooks/useV3DataModel';
import { worktrees } from '@/data/mockData';
import type { TabId, WorkspaceId } from '@/types';

function App() {
  // Check if V3 mode is enabled
  const [isV3Enabled, setIsV3Enabled] = useState(() => {
    return localStorage.getItem('v3-enabled') === 'true';
  });

  // V2 state
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const { tasks } = useDataModel();

  // V3 state
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceId>('conversations');
  const v3Data = useV3DataModel();

  // V3 mission-level navigation state
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [conversationView, setConversationView] = useState<boolean>(false);
  // Background tasks panel - not yet integrated
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_showBackgroundTasks, _setShowBackgroundTasks] = useState(false);

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

  // V3 navigation helpers
  const navigateToMission = useCallback((missionId: string) => {
    setSelectedMissionId(missionId);
    setActiveWorkspace('missions');
    setConversationView(false);
  }, []);

  const navigateToConversation = useCallback((missionId: string) => {
    setSelectedMissionId(missionId);
    setActiveWorkspace('missions');
    setConversationView(true);
  }, []);

  const navigateToReview = useCallback((missionId: string) => {
    setSelectedMissionId(missionId);
    setActiveWorkspace('review');
  }, []);

  const handleWorkspaceChange = useCallback((workspace: WorkspaceId) => {
    setActiveWorkspace(workspace);
    // Clear mission selection when leaving missions/review workspaces
    if (workspace !== 'missions' && workspace !== 'review') {
      setSelectedMissionId(null);
      setConversationView(false);
    }
  }, []);

  // Toggle V3 mode function
  const toggleV3Mode = useCallback(() => {
    const newV3State = !isV3Enabled;
    setIsV3Enabled(newV3State);
    localStorage.setItem('v3-enabled', String(newV3State));
    console.log(`V3 Mode ${newV3State ? 'enabled' : 'disabled'}`);
  }, [isV3Enabled]);

  // Keyboard shortcut to toggle V3 mode
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Press Ctrl/Cmd + Shift + V to toggle V3 mode
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'V') {
        toggleV3Mode();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleV3Mode]);

  // V2 panel rendering
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

  // V3 workspace rendering
  const renderWorkspace = () => {
    switch (activeWorkspace) {
      case 'conversations':
        return (
          <CommandCenter
            onNavigateToMission={navigateToMission}
            onNavigateToConversation={navigateToConversation}
          />
        );
      case 'missions':
        return (
          <MissionsWorkspace
            selectedMissionId={selectedMissionId}
            conversationView={conversationView}
            onSelectMission={setSelectedMissionId}
            onNavigateToReview={navigateToReview}
          />
        );
      case 'review':
        return (
          <ReviewSurface
            selectedMissionId={selectedMissionId}
            onNavigateToMission={navigateToMission}
            onNavigateToConversation={navigateToConversation}
          />
        );
      case 'insights':
        return <InsightsWorkspace />;
      case 'settings':
        return <SettingsWorkspace />;
      default:
        return (
          <CommandCenter
            onNavigateToMission={navigateToMission}
            onNavigateToConversation={navigateToConversation}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-bg-0">
      <Header isV3Enabled={isV3Enabled} onToggleV3={toggleV3Mode} />

      {isV3Enabled ? (
        <>
          {/* V3 Workspace Navigation */}
          <WorkspaceNav
            activeWorkspace={activeWorkspace}
            onWorkspaceChange={handleWorkspaceChange}
            pendingReviews={v3Data.missions.filter(m => m.status === 'planning').length}
            unacknowledgedObservations={v3Data.unacknowledgedObservations}
          />
          <main className="flex-1 overflow-hidden">
            {renderWorkspace()}
          </main>
        </>
      ) : (
        <>
          {/* V2 Tab Navigation */}
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 overflow-hidden">
            {renderPanel()}
          </main>
        </>
      )}
    </div>
  );
}

export default App;
