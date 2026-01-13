import { useState, useEffect } from 'react';
import { WorkspaceShell } from './WorkspaceShell';
import { FileList } from '@/components/diff/FileList';
import { DiffViewer } from '@/components/diff/DiffViewer';
import { ReasoningPanel } from '@/components/diff/ReasoningPanel';
import { SpecificationTraceability } from '@/components/shared/SpecificationTraceability';
import { useV4DataModel } from '@/hooks/useV4DataModel';
import { fileDiffs } from '@/data/mockDataV2';
import type { FileChange, Change, PlanV4 } from '@/types';

interface DiffWorkspaceProps {
  selectedMissionId?: string | null;
  focusedFileId?: string | null;
  onNavigateToPipeline?: (missionId: string, criterionId?: string) => void;
  onNavigateToSpecImpact?: (missionId: string, criterionId?: string) => void;
}

export function DiffWorkspace({
  selectedMissionId,
  focusedFileId,
  onNavigateToPipeline,
  onNavigateToSpecImpact,
}: DiffWorkspaceProps) {
  const { missions } = useV4DataModel();
  const [selectedFile, setSelectedFile] = useState<FileChange | null>(null);

  // Get current mission
  const currentMission = selectedMissionId
    ? missions.find(m => m.id === selectedMissionId)
    : missions[0]; // Default to first mission if none selected

  // Debug logging
  useEffect(() => {
    console.log('[DiffWorkspace] Mounted with:', {
      selectedMissionId,
      focusedFileId,
      missionFound: !!currentMission,
      changesCount: currentMission?.execution?.changes?.length || 0
    });
  }, [selectedMissionId, focusedFileId, currentMission]);

  // Get files from mission execution changes
  const availableFiles: FileChange[] = (currentMission?.execution?.changes || [])
    .filter((change): change is Change => !!change && !!change.path)
    .map((change: Change) => ({
      id: change.id,
      filename: change.path.split('/').pop() || change.path,
      path: change.path,
      changeType: 'modified' as const, // Default to modified since we don't have this info in Change
      additions: change.linesAdded || 0,
      deletions: change.linesDeleted || 0,
      agentId: change.agentId,
      timestamp: change.timestamp,
      commitShas: [change.commitSha].filter(Boolean) as string[],
      reasoning: change.reasoning,
      // V4 traceability fields
      fulfillsAcceptanceCriteria: change.fulfillsAcceptanceCriteria,
      specRationale: change.specRationale,
    }));

  // Auto-select first file if none selected
  useEffect(() => {
    if (availableFiles.length > 0 && !selectedFile) {
      setSelectedFile(availableFiles[0]);
    }
  }, [currentMission?.id]);

  // V4 Phase 8: Auto-select focused file
  useEffect(() => {
    if (focusedFileId && availableFiles.length > 0) {
      const file = availableFiles.find((f: FileChange) => f.id === focusedFileId);
      if (file) {
        setSelectedFile(file);

        // Scroll to file in sidebar
        setTimeout(() => {
          const element = document.getElementById(`file-${focusedFileId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }, [focusedFileId, availableFiles]);

  const fileDiff = selectedFile ? fileDiffs[selectedFile.filename] : undefined;
  const totalAdditions = availableFiles.reduce((sum, f) => sum + f.additions, 0);
  const totalDeletions = availableFiles.reduce((sum, f) => sum + f.deletions, 0);

  return (
    <WorkspaceShell>
      <div className="flex flex-col h-full bg-bg-0">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-border-1 bg-bg-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-text-1 mb-1">Diff Viewer</h1>
              {currentMission && (
                <p className="text-sm text-text-3">
                  {currentMission.title} • {availableFiles.length} files changed
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 px-4 py-2 bg-bg-0 rounded-lg border border-border-1">
              <div className="text-center">
                <div className="text-lg font-semibold text-accent-green">+{totalAdditions}</div>
                <div className="text-xs text-text-3">Additions</div>
              </div>
              <div className="w-px h-8 bg-border-1" />
              <div className="text-center">
                <div className="text-lg font-semibold text-accent-red">-{totalDeletions}</div>
                <div className="text-xs text-text-3">Deletions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Three-column layout: File list | Diff viewer | Context panels */}
        <div className="flex-1 grid grid-cols-[260px_1fr_340px] overflow-hidden">
          {/* Left: File list */}
          <div className="border-r border-border-1 bg-bg-0 overflow-y-auto">
            <FileList
              files={availableFiles}
              selectedFile={selectedFile}
              onSelectFile={setSelectedFile}
            />
          </div>

          {/* Middle: Diff viewer */}
          {selectedFile ? (
            <DiffViewer
              file={selectedFile}
              diff={fileDiff}
              taskId={currentMission?.id}
              onNavigateToPipeline={onNavigateToPipeline}
              onNavigateToSpecImpact={onNavigateToSpecImpact}
            />
          ) : (
            <div className="flex items-center justify-center bg-bg-0">
              <p className="text-text-3 text-sm">
                {availableFiles.length === 0 ? 'No files to display' : 'Select a file to view changes'}
              </p>
            </div>
          )}

          {/* Right: Context panels */}
          <div className="bg-bg-1 border-l border-border-1 overflow-y-auto">
            {/* Reasoning Panel - TOP */}
            <ReasoningPanel diff={fileDiff} />

            {/* Specification Context - BELOW */}
            {currentMission && selectedFile && onNavigateToPipeline && (() => {
              const plan = currentMission.plan as PlanV4;
              if (!plan?.acceptanceCriteria) return null;

              // Get criteria that this file implements
              const relevantCriteria = plan.acceptanceCriteria.filter(
                (ac) => selectedFile.fulfillsAcceptanceCriteria?.includes(ac.id)
              );

              if (relevantCriteria.length === 0) return null;

              return (
                <SpecificationTraceability
                  acceptanceCriteria={relevantCriteria}
                  taskId={currentMission.id}
                  onNavigateToSpec={(missionId, criterionId) => {
                    onNavigateToPipeline(missionId, criterionId);
                  }}
                />
              );
            })()}
          </div>
        </div>
      </div>
    </WorkspaceShell>
  );
}
