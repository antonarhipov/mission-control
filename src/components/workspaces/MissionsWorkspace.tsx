import { useState, useEffect } from 'react';
import { WorkspaceShell } from './WorkspaceShell';
import { MissionCard } from '@/components/missions/MissionCard';
import { MissionDetailPanel } from '@/components/missions/MissionDetailPanel';
import { MissionDetailModal } from '@/components/missions/MissionDetailModal';
import { useV4DataModel } from '@/hooks/useV4DataModel';
import type { Mission, MissionStatus } from '@/types';

interface MissionsWorkspaceProps {
  selectedMissionId?: string | null;
  conversationView?: boolean;
  focusedCriterionId?: string | null;
  focusedFileId?: string | null;
  showSpecImpactModal?: boolean;
  onCloseSpecImpactModal?: () => void;
  onSelectMission?: (missionId: string) => void;
  onNavigateToReview?: (missionId: string) => void;
  onNavigateToDiff?: (taskId: string, commitSha?: string, fileId?: string) => void;
}

export function MissionsWorkspace({
  selectedMissionId: propSelectedMissionId,
  conversationView: _conversationView = false, // Reserved for future use
  focusedCriterionId,
  focusedFileId,
  showSpecImpactModal: _showSpecImpactModal, // Reserved for future use
  onCloseSpecImpactModal: _onCloseSpecImpactModal, // Reserved for future use
  onSelectMission,
  onNavigateToReview: _onNavigateToReview, // Reserved for future use
  onNavigateToDiff,
}: MissionsWorkspaceProps) {
  const { missions } = useV4DataModel();
  const [localSelectedMissionId, setLocalSelectedMissionId] = useState<string | null>(null);
  const [expandedMissionId, setExpandedMissionId] = useState<string | null>(null);

  // Close modal when component unmounts (e.g., navigating away from workspace)
  useEffect(() => {
    return () => {
      setExpandedMissionId(null);
    };
  }, []);

  // Sync with prop selectedMissionId
  const selectedMissionId = propSelectedMissionId !== undefined ? propSelectedMissionId : localSelectedMissionId;
  const handleSelectMission = (missionId: string) => {
    setLocalSelectedMissionId(missionId);
    onSelectMission?.(missionId);
  };

  const handleExpandMission = (missionId: string) => {
    setExpandedMissionId(missionId);
  };

  const selectedMission = selectedMissionId
    ? missions.find(m => m.id === selectedMissionId) || null
    : null;

  // Group missions by status
  const missionsByStatus: Record<MissionStatus, Mission[]> = {
    backlog: [],
    planning: [],
    executing: [],
    complete: [],
    blocked: [],
  };

  missions.forEach(mission => {
    missionsByStatus[mission.status].push(mission);
  });

  const columns: { id: MissionStatus; label: string; color: string }[] = [
    { id: 'backlog', label: 'Backlog', color: 'border-text-3' },
    { id: 'planning', label: 'Planning', color: 'border-accent-amber' },
    { id: 'executing', label: 'Executing', color: 'border-accent-blue' },
    { id: 'complete', label: 'Complete', color: 'border-accent-green' },
  ];

  return (
    <WorkspaceShell>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-border-1">
          <div className="mb-3">
            <h1 className="text-xl font-semibold text-text-1 mb-1">Missions</h1>
            <p className="text-sm text-text-3">
              Mission control dashboard showing pipeline view and progress
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-text-3">Total:</span>
              <span className="ml-2 font-semibold text-text-1">{missions.length}</span>
            </div>
            <div>
              <span className="text-text-3">Active:</span>
              <span className="ml-2 font-semibold text-accent-green">
                {missions.filter(m => m.status !== 'complete').length}
              </span>
            </div>
            <div>
              <span className="text-text-3">Planning:</span>
              <span className="ml-2 font-semibold text-accent-amber">
                {missions.filter(m => m.status === 'planning').length}
              </span>
            </div>
            <div>
              <span className="text-text-3">Completed:</span>
              <span className="ml-2 font-semibold text-accent-green">
                {missions.filter(m => m.status === 'complete').length}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Kanban Board */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-x-auto overflow-y-hidden">
              <div className="flex gap-4 p-4 h-full min-w-max">
                {columns.map(column => (
                  <div key={column.id} className="w-80 flex flex-col">
                    {/* Column Header */}
                    <div className={`flex-shrink-0 pb-3 mb-3 border-b-2 ${column.color}`}>
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-text-1">{column.label}</h2>
                        <span className="text-xs font-medium text-text-3 bg-bg-2 px-2 py-0.5 rounded">
                          {missionsByStatus[column.id].length}
                        </span>
                      </div>
                    </div>

                    {/* Mission Cards */}
                    <div className="flex-1 overflow-y-auto space-y-3">
                      {missionsByStatus[column.id].length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-text-3 text-sm">
                          No missions
                        </div>
                      ) : (
                        missionsByStatus[column.id].map(mission => (
                          <MissionCard
                            key={mission.id}
                            mission={mission}
                            onSelect={handleSelectMission}
                            onExpand={handleExpandMission}
                          />
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Mission Detail */}
          {selectedMission && (
            <div className="w-80 flex-shrink-0">
              <MissionDetailPanel
                mission={selectedMission}
                onClose={() => {
                  setLocalSelectedMissionId(null);
                  onSelectMission?.(null as any);
                }}
                onExpand={() => setExpandedMissionId(selectedMission.id)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mission Detail Modal */}
      {expandedMissionId && (() => {
        const expandedMission = missions.find(m => m.id === expandedMissionId);
        return expandedMission ? (
          <MissionDetailModal
            mission={expandedMission}
            focusedCriterionId={focusedCriterionId}
            focusedFileId={focusedFileId}
            onClose={() => setExpandedMissionId(null)}
            onNavigateToDiff={onNavigateToDiff}
          />
        ) : null;
      })()}
    </WorkspaceShell>
  );
}
