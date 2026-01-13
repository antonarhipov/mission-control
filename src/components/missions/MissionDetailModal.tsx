import { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Users, MessageSquare, Target, CheckCircle2, CheckSquare } from 'lucide-react';
import { PipelineExecutionViewer } from './PipelineExecutionViewer';
import { PlanViewer } from './PlanViewer';
import { ConversationThread } from '@/components/conversation/ConversationThread';
import { SpecificationImpactDashboard } from '@/components/specification/SpecificationImpactDashboard';
import { FileList } from '@/components/diff/FileList';
import { DiffViewer } from '@/components/diff/DiffViewer';
import { ReasoningPanel } from '@/components/diff/ReasoningPanel';
import { SpecificationTraceability } from '@/components/shared/SpecificationTraceability';
import { ReviewQueue } from '@/components/review/ReviewQueue';
import { ChangeReviewDetail } from '@/components/review/ChangeReviewDetail';
import { SpecificationContext } from '@/components/review/SpecificationContext';
import { BatchApprovalPanel } from '@/components/review/BatchApprovalPanel';
import { useV3DataModel } from '@/hooks/useV3DataModel';
import { fileDiffs } from '@/data/mockDataV2';
import type { Mission, FileChange, Change, PlanV4 } from '@/types';

interface MissionDetailModalProps {
  mission: Mission;
  focusedCriterionId?: string | null;
  focusedFileId?: string | null;
  onClose: () => void;
  onNavigateToDiff?: (taskId: string, commitSha?: string, fileId?: string) => void;
}

type TabType = 'overview' | 'pipeline' | 'plan' | 'conversation' | 'spec-impact' | 'diff' | 'review';

export function MissionDetailModal({ mission, focusedCriterionId, focusedFileId, onClose }: MissionDetailModalProps) {
  const { agents, teams } = useV3DataModel();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedApprovalId, setSelectedApprovalId] = useState<string | null>(null);
  const [showBatchApproval, setShowBatchApproval] = useState(false);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  // V4 Phase 8: Auto-switch to Spec Impact tab if criterionId provided
  useEffect(() => {
    if (focusedCriterionId && mission.specificationImpact) {
      setActiveTab('spec-impact');
    }
  }, [focusedCriterionId, mission.specificationImpact]);

  // V3: Auto-switch to diff tab if fileId provided
  useEffect(() => {
    if (focusedFileId && mission.execution?.changes && mission.execution.changes.length > 0) {
      setActiveTab('diff');
      setSelectedFileId(focusedFileId);
    }
  }, [focusedFileId, mission.execution?.changes]);

  // Get mission team
  const team = teams.find(t => t.id === mission.teamId);

  // Get mission agents
  const missionAgents = mission.agents
    .map(ma => agents.find(a => a.id === ma.agentId))
    .filter(Boolean);

  // Status color helper
  const getStatusColor = (status: Mission['status']) => {
    switch (status) {
      case 'backlog':
        return 'bg-text-3/20 text-text-3 border-text-3/30';
      case 'planning':
        return 'bg-accent-amber/20 text-accent-amber border-accent-amber/30';
      case 'executing':
        return 'bg-accent-blue/20 text-accent-blue border-accent-blue/30';
      case 'complete':
        return 'bg-accent-green/20 text-accent-green border-accent-green/30';
      case 'blocked':
        return 'bg-accent-red/20 text-accent-red border-accent-red/30';
      default:
        return 'bg-bg-2 text-text-2 border-border-1';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return 'Not started';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate duration
  const calculateDuration = () => {
    if (!mission.startedAt) return null;
    const start = new Date(mission.startedAt);
    const end = mission.completedAt ? new Date(mission.completedAt) : new Date();
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Get files from mission changes
  const availableFiles = (mission.execution?.changes || [])
    .filter((change): change is Change => !!change && !!change.path)
    .map((change: Change) => ({
      id: change.id,
      filename: change.path.split('/').pop() || change.path,
      path: change.path,
      changeType: change.changeType,
      additions: change.additions || 0,
      deletions: change.deletions || 0,
      agentId: change.agentId,
      timestamp: change.timestamp,
      commitShas: [change.commitSha].filter(Boolean) as string[],
      reasoning: change.reasoning,
      fulfillsAcceptanceCriteria: change.fulfillsAcceptanceCriteria,
      specRationale: change.specRationale,
    }));

  const selectedFile = selectedFileId
    ? availableFiles.find(f => f.id === selectedFileId)
    : availableFiles[0];

  const fileDiff = selectedFile ? fileDiffs[selectedFile.filename] : undefined;

  // Get approvals for this mission
  const missionApprovals = mission.execution?.approvals || [];
  const pendingApprovals = missionApprovals.filter(a => a.status === 'pending');
  const selectedApproval = selectedApprovalId
    ? pendingApprovals.find(a => a.id === selectedApprovalId)
    : null;
  const highConfidenceCount = pendingApprovals.filter(a => (a.confidence || 0) >= 90).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-0 rounded-xl shadow-2xl w-full h-full overflow-hidden border border-border-1 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-1 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-text-1">{mission.title}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(mission.status)}`}>
                  {mission.status.replace('-', ' ')}
                </span>
              </div>
              <p className="text-sm text-text-3 line-clamp-2">{mission.intent.description}</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 hover:bg-bg-2 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-text-2" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-6 mt-4 text-sm">
            {/* Progress */}
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-bg-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-green rounded-full transition-all"
                  style={{ width: `${mission.progress}%` }}
                />
              </div>
              <span className="text-xs text-text-3 font-medium">{mission.progress}%</span>
            </div>

            {/* Cost */}
            <div className="flex items-center gap-1.5 text-text-3">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium">${mission.cost.toFixed(2)}</span>
            </div>

            {/* Agents */}
            <div className="flex items-center gap-1.5 text-text-3">
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium">{missionAgents.length} agents</span>
            </div>

            {/* Duration */}
            {calculateDuration() && (
              <div className="flex items-center gap-1.5 text-text-3">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium">{calculateDuration()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 py-2 border-b border-border-1 flex-shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded transition-colors ${
              activeTab === 'overview'
                ? 'bg-accent-blue/10 text-accent-blue font-medium'
                : 'text-text-2 hover:bg-bg-1'
            }`}
          >
            Overview
          </button>
          {mission.pipelineExecution && (
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-4 py-2 rounded transition-colors ${
                activeTab === 'pipeline'
                  ? 'bg-accent-blue/10 text-accent-blue font-medium'
                  : 'text-text-2 hover:bg-bg-1'
              }`}
            >
              Pipeline
            </button>
          )}
          {mission.plan && (
            <button
              onClick={() => setActiveTab('plan')}
              className={`px-4 py-2 rounded transition-colors ${
                activeTab === 'plan'
                  ? 'bg-accent-blue/10 text-accent-blue font-medium'
                  : 'text-text-2 hover:bg-bg-1'
              }`}
            >
              Plan
            </button>
          )}
          <button
            onClick={() => setActiveTab('conversation')}
            className={`px-4 py-2 rounded transition-colors ${
              activeTab === 'conversation'
                ? 'bg-accent-blue/10 text-accent-blue font-medium'
                : 'text-text-2 hover:bg-bg-1'
            }`}
          >
            Conversation
          </button>
          {mission.specificationImpact && (
            <button
              onClick={() => setActiveTab('spec-impact')}
              className={`px-4 py-2 rounded transition-colors ${
                activeTab === 'spec-impact'
                  ? 'bg-accent-blue/10 text-accent-blue font-medium'
                  : 'text-text-2 hover:bg-bg-1'
              }`}
            >
              Spec Impact
            </button>
          )}
          {/* Diff Tab */}
          {mission.execution?.changes && mission.execution.changes.length > 0 && (
            <button
              onClick={() => setActiveTab('diff')}
              className={`px-4 py-2 rounded transition-colors ${
                activeTab === 'diff'
                  ? 'bg-accent-blue/10 text-accent-blue font-medium'
                  : 'text-text-2 hover:bg-bg-1'
              }`}
            >
              Diff ({availableFiles.length})
            </button>
          )}
          {/* Review Tab */}
          {pendingApprovals.length > 0 && (
            <button
              onClick={() => setActiveTab('review')}
              className={`px-4 py-2 rounded transition-colors ${
                activeTab === 'review'
                  ? 'bg-accent-blue/10 text-accent-blue font-medium'
                  : 'text-text-2 hover:bg-bg-1'
              }`}
            >
              Review ({pendingApprovals.length})
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="p-6 space-y-6">
              {/* Intent */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-accent-blue" />
                  <h3 className="text-lg font-semibold text-text-1">Intent</h3>
                  {mission.intent.confidence !== undefined && (
                    <span className="text-xs text-text-3">
                      ({mission.intent.confidence}% confidence)
                    </span>
                  )}
                </div>
                <div className="bg-bg-1 rounded-lg p-4 border border-border-1">
                  <p className="text-sm text-text-2 mb-3">{mission.intent.description}</p>
                  {mission.intent.parsed && (
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      {mission.intent.parsed.constraints?.length > 0 && (
                        <div>
                          <div className="font-medium text-text-3 mb-1">Constraints:</div>
                          <ul className="list-disc list-inside text-text-3 space-y-0.5">
                            {mission.intent.parsed.constraints.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {mission.intent.parsed.scope?.length > 0 && (
                        <div>
                          <div className="font-medium text-text-3 mb-1">Scope:</div>
                          <ul className="list-disc list-inside text-text-3 space-y-0.5">
                            {mission.intent.parsed.scope.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>

              {/* Plan Summary */}
              {mission.plan && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-accent-green" />
                    <h3 className="text-lg font-semibold text-text-1">Plan</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      mission.plan.status === 'approved' ? 'bg-accent-green/10 text-accent-green' :
                      mission.plan.status === 'proposed' ? 'bg-accent-amber/10 text-accent-amber' :
                      'bg-text-3/10 text-text-3'
                    }`}>
                      {mission.plan.status}
                    </span>
                  </div>
                  <div className="bg-bg-1 rounded-lg p-4 border border-border-1">
                    <p className="text-sm text-text-2 mb-3">{mission.plan.summary}</p>
                    {mission.plan.tasks && (
                      <div className="text-xs text-text-3">
                        {mission.plan.tasks.length} tasks planned
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Team */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-accent-purple" />
                  <h3 className="text-lg font-semibold text-text-1">Team</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {mission.agents.map((missionAgent) => {
                    const agent = agents.find(a => a.id === missionAgent.agentId);
                    if (!agent) return null;
                    return (
                      <div
                        key={missionAgent.agentId}
                        className="bg-bg-1 rounded-lg p-3 border border-border-1"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                            style={{ backgroundColor: `${agent.color}20` }}>
                            {agent.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-text-1">{agent.name}</div>
                            <div className="text-xs text-text-3 capitalize">{missionAgent.role}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs text-text-3">
                          <div>
                            <div className="font-medium">{missionAgent.contribution.commits}</div>
                            <div>commits</div>
                          </div>
                          <div>
                            <div className="font-medium">{missionAgent.contribution.filesChanged}</div>
                            <div>files</div>
                          </div>
                          <div>
                            <div className="font-medium">${missionAgent.contribution.cost.toFixed(2)}</div>
                            <div>cost</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Conversation Summary */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-5 h-5 text-accent-cyan" />
                  <h3 className="text-lg font-semibold text-text-1">Conversation</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-bg-1 rounded-lg p-3 border border-border-1 text-center">
                    <div className="text-2xl font-bold text-text-1">
                      {mission.conversation.messages?.length || 0}
                    </div>
                    <div className="text-xs text-text-3">Messages</div>
                  </div>
                  <div className="bg-bg-1 rounded-lg p-3 border border-border-1 text-center">
                    <div className="text-2xl font-bold text-text-1">
                      {mission.conversation.decisions?.length || 0}
                    </div>
                    <div className="text-xs text-text-3">Decisions</div>
                  </div>
                  <div className="bg-bg-1 rounded-lg p-3 border border-border-1 text-center">
                    <div className="text-2xl font-bold text-text-1">
                      {mission.conversation.openQuestions?.length || 0}
                    </div>
                    <div className="text-xs text-text-3">Questions</div>
                  </div>
                </div>
              </section>

              {/* Timeline */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-accent-amber" />
                  <h3 className="text-lg font-semibold text-text-1">Timeline</h3>
                </div>
                <div className="bg-bg-1 rounded-lg p-4 border border-border-1 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-3">Started:</span>
                    <span className="text-text-2 font-medium">{formatTimestamp(mission.startedAt)}</span>
                  </div>
                  {mission.completedAt && (
                    <div className="flex justify-between">
                      <span className="text-text-3">Completed:</span>
                      <span className="text-text-2 font-medium">{formatTimestamp(mission.completedAt)}</span>
                    </div>
                  )}
                  {calculateDuration() && (
                    <div className="flex justify-between">
                      <span className="text-text-3">Duration:</span>
                      <span className="text-text-2 font-medium">{calculateDuration()}</span>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'pipeline' && mission.pipelineExecution && team && (
            <div className="p-6">
              <PipelineExecutionViewer mission={mission} team={team} />
            </div>
          )}

          {activeTab === 'plan' && mission.plan && (
            <div className="p-6">
              <PlanViewer
                mission={mission}
                onApprove={() => {}}
                onReject={() => {}}
              />
            </div>
          )}

          {activeTab === 'conversation' && (
            <div className="h-full">
              <ConversationThread
                conversation={mission.conversation}
                missionId={mission.id}
                className="h-full"
              />
            </div>
          )}

          {activeTab === 'spec-impact' && mission.specificationImpact && (
            <SpecificationImpactDashboard
              mission={mission}
              focusedCriterionId={focusedCriterionId}
              onNavigateToReview={(criterionId) => {
                // TODO: Navigate to Review workspace with filter
                console.log('Navigate to review for criterion:', criterionId);
              }}
              onNavigateToDiff={(fileId) => {
                // Switch to diff tab with file selected
                setSelectedFileId(fileId);
                setActiveTab('diff');
              }}
            />
          )}

          {/* Diff Tab Content */}
          {activeTab === 'diff' && availableFiles.length > 0 && (
            <div className="flex-1 grid grid-cols-[260px_1fr_340px] overflow-hidden">
              {/* Left: File List */}
              <div className="border-r border-border-1 bg-bg-0 overflow-y-auto">
                <FileList
                  files={availableFiles as FileChange[]}
                  selectedFile={selectedFile ? (selectedFile as FileChange) : null}
                  onSelectFile={(file: any) => setSelectedFileId(file.id)}
                />
              </div>

              {/* Middle: Diff Viewer */}
              {selectedFile ? (
                <DiffViewer
                  file={selectedFile as FileChange}
                  diff={fileDiff}
                  taskId={mission.id}
                  onNavigateToPipeline={() => setActiveTab('pipeline')}
                  onNavigateToSpecImpact={() => setActiveTab('spec-impact')}
                />
              ) : (
                <div className="flex items-center justify-center bg-bg-0">
                  <p className="text-text-3 text-sm">Select a file to view changes</p>
                </div>
              )}

              {/* Right: Context Panels */}
              <div className="bg-bg-1 border-l border-border-1 overflow-y-auto">
                {/* Reasoning Panel */}
                <ReasoningPanel diff={fileDiff} />

                {/* Specification Traceability */}
                {selectedFile && (() => {
                  const plan = mission.plan as PlanV4;
                  if (!plan?.acceptanceCriteria) return null;

                  const relevantCriteria = plan.acceptanceCriteria.filter(
                    (ac) => selectedFile.fulfillsAcceptanceCriteria?.includes(ac.id)
                  );

                  if (relevantCriteria.length === 0) return null;

                  return (
                    <SpecificationTraceability
                      acceptanceCriteria={relevantCriteria as any}
                      taskId={mission.id}
                      onNavigateToSpec={() => {
                        setActiveTab('spec-impact');
                      }}
                    />
                  );
                })()}
              </div>
            </div>
          )}

          {/* Review Tab Content */}
          {activeTab === 'review' && pendingApprovals.length > 0 && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Review Header with Stats */}
              <div className="flex-shrink-0 px-6 py-4 border-b border-border-1 bg-bg-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-text-1 mb-1">
                      {pendingApprovals.length} Pending Approvals
                    </h3>
                    <p className="text-sm text-text-3">
                      Review changes, decisions, and actions for this mission
                    </p>
                  </div>

                  {/* Batch Approve Button */}
                  {highConfidenceCount > 0 && (
                    <button
                      onClick={() => setShowBatchApproval(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-accent-green hover:bg-accent-green/80 text-white rounded-lg font-medium transition-colors"
                    >
                      <CheckSquare className="w-4 h-4" />
                      Batch Approve ({highConfidenceCount})
                    </button>
                  )}
                </div>
              </div>

              {/* Three-column layout */}
              <div className="flex-1 grid grid-cols-[320px_1fr_360px] overflow-hidden">
                {/* Left: Review Queue */}
                <ReviewQueue
                  approvals={pendingApprovals}
                  selectedApprovalId={selectedApprovalId}
                  onSelectApproval={setSelectedApprovalId}
                />

                {/* Middle: Approval Detail */}
                {selectedApproval ? (
                  <div className="border-x border-border-1">
                    <ChangeReviewDetail
                      approval={selectedApproval}
                      onApprove={(approvalId) => {
                        console.log('Approve:', approvalId);
                        // TODO: Update approval status
                        setSelectedApprovalId(null);
                      }}
                      onReject={(approvalId, reason) => {
                        console.log('Reject:', approvalId, reason);
                        // TODO: Update approval status
                        setSelectedApprovalId(null);
                      }}
                      onAnswerUncertainty={(response) => {
                        console.log('Answer uncertainty:', response);
                        // TODO: Send response to agent
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center bg-bg-0 border-x border-border-1">
                    <div className="text-center space-y-3 max-w-md px-6">
                      <CheckSquare className="w-12 h-12 mx-auto text-text-3 opacity-50" />
                      <h3 className="text-lg font-semibold text-text-2">Select an approval</h3>
                      <p className="text-sm text-text-3">
                        Choose an item from the queue to review details and take action
                      </p>
                    </div>
                  </div>
                )}

                {/* Right: Specification Context */}
                {selectedApproval && (
                  <SpecificationContext
                    approval={selectedApproval}
                    onNavigateToMission={() => {
                      // Already in mission modal, no action needed
                    }}
                    onNavigateToSpecImpact={() => {
                      // Switch to spec-impact tab
                      setActiveTab('spec-impact');
                    }}
                  />
                )}
              </div>

              {/* Batch Approval Modal */}
              {showBatchApproval && (
                <BatchApprovalPanel
                  approvals={pendingApprovals}
                  onBatchApprove={(approvalIds) => {
                    console.log('Batch approve:', approvalIds);
                    // TODO: Update approval statuses
                    setShowBatchApproval(false);
                  }}
                  onClose={() => setShowBatchApproval(false)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
