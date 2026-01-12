import { X, Calendar, DollarSign, GitCommit, TestTube, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { useV3DataModel } from '@/hooks/useV3DataModel';
import type { Mission, PipelineStageExecution, PipelineLogEntry, Agent, TeamPipelineStage } from '@/types';

interface StageDetailPanelProps {
  mission: Mission;
  stageExecution: PipelineStageExecution;
  stageConfig: TeamPipelineStage;
  onClose: () => void;
}

export function StageDetailPanel({
  mission,
  stageExecution,
  stageConfig,
  onClose,
}: StageDetailPanelProps) {
  const { agents } = useV3DataModel();

  // Get stage agents
  const stageAgents = stageExecution.activeAgentIds
    .map(id => agents.find(a => a.id === id))
    .filter(Boolean) as Agent[];

  // Get stage commits with full details
  const stageCommits = mission.execution
    ? stageExecution.commits
        .map(sha => mission.execution!.commits.find(c => c.sha === sha))
        .filter((c): c is NonNullable<typeof c> => c !== null && c !== undefined)
    : [];

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Calculate duration
  const calculateDuration = () => {
    if (!stageExecution.startedAt) return null;
    const start = new Date(stageExecution.startedAt);
    const end = stageExecution.completedAt ? new Date(stageExecution.completedAt) : new Date();
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  // Get severity styling
  const getSeverityStyle = (severity: PipelineLogEntry['severity']) => {
    switch (severity) {
      case 'error':
        return 'bg-accent-red/10 border-accent-red/30 text-accent-red';
      case 'warning':
        return 'bg-accent-amber/10 border-accent-amber/30 text-accent-amber';
      case 'success':
        return 'bg-accent-green/10 border-accent-green/30 text-accent-green';
      default:
        return 'bg-bg-2 border-border-1 text-text-2';
    }
  };

  // Get log type icon
  const getLogTypeIcon = (type: PipelineLogEntry['type']) => {
    switch (type) {
      case 'commit':
        return <GitCommit className="w-4 h-4" />;
      case 'test':
        return <TestTube className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      case 'decision':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'approval':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[600px] bg-bg-0 border-l border-border-1 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-text-1 mb-1">
              {stageConfig.name}
            </h2>
            <p className="text-sm text-text-3">
              {stageConfig.description || 'Pipeline stage execution details'}
            </p>
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
        <div className="flex items-center gap-4 mt-4 text-sm">
          {stageExecution.startedAt && (
            <div className="flex items-center gap-1.5 text-text-3">
              <Calendar className="w-4 h-4" />
              <span className="text-xs">{calculateDuration()}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-text-3">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs">${stageExecution.cost.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-text-3">
            <GitCommit className="w-4 h-4" />
            <span className="text-xs">{stageExecution.commits.length} commits</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Agents */}
          <section>
            <h3 className="text-sm font-semibold text-text-1 mb-3">Active Agents</h3>
            <div className="space-y-2">
              {stageAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center gap-3 p-2 bg-bg-1 rounded-lg border border-border-1"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-base"
                    style={{ backgroundColor: `${agent.color}20` }}
                  >
                    {agent.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-text-1">{agent.name}</div>
                    <div className="text-xs text-text-3">{agent.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Execution Logs */}
          {stageExecution.logs && stageExecution.logs.entries.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-text-1 mb-3">Execution Log</h3>
              <div className="space-y-3">
                {stageExecution.logs.entries.map((entry) => {
                  const agent = entry.agentId ? agents.find(a => a.id === entry.agentId) : null;

                  return (
                    <div
                      key={entry.id}
                      className={`rounded-lg p-3 border ${getSeverityStyle(entry.severity)}`}
                    >
                      {/* Log Header */}
                      <div className="flex items-start gap-2 mb-2">
                        <div className="flex-shrink-0 mt-0.5">
                          {getLogTypeIcon(entry.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium uppercase tracking-wide">
                              {entry.type.replace('_', ' ')}
                            </span>
                            {agent && (
                              <>
                                <span className="text-xs opacity-50">•</span>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs">{agent.emoji}</span>
                                  <span className="text-xs">{agent.name}</span>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="text-xs opacity-70">{formatTime(entry.timestamp)}</div>
                        </div>
                      </div>

                      {/* Log Message */}
                      <p className="text-sm mb-2">{entry.message}</p>

                      {/* Log Details */}
                      {entry.details && (
                        <div className="text-xs space-y-2 opacity-90">
                          {/* Commit Details */}
                          {entry.details.commitSha && (
                            <div className="space-y-1">
                              <div className="font-mono">{entry.details.commitSha.substring(0, 7)}</div>
                              {entry.details.commitMessage && (
                                <div className="italic">{entry.details.commitMessage}</div>
                              )}
                              {entry.details.filesChanged && entry.details.filesChanged.length > 0 && (
                                <div>Files: {entry.details.filesChanged.join(', ')}</div>
                              )}
                            </div>
                          )}

                          {/* Test Details */}
                          {entry.details.testName && (
                            <div className="space-y-1">
                              <div>Test: {entry.details.testName}</div>
                              <div>Status: {entry.details.testStatus}</div>
                              {entry.details.testOutput && (
                                <pre className="bg-bg-0 p-2 rounded overflow-x-auto max-h-32 overflow-y-auto">
                                  {entry.details.testOutput}
                                </pre>
                              )}
                            </div>
                          )}

                          {/* Error Details */}
                          {entry.details.errorType && (
                            <div className="space-y-1">
                              <div>Error: {entry.details.errorType}</div>
                              {entry.details.resolution && (
                                <div>Resolution: {entry.details.resolution}</div>
                              )}
                              {entry.details.stackTrace && (
                                <pre className="bg-bg-0 p-2 rounded overflow-x-auto text-[10px] max-h-32 overflow-y-auto">
                                  {entry.details.stackTrace}
                                </pre>
                              )}
                            </div>
                          )}

                          {/* Decision Details */}
                          {entry.details.decision && (
                            <div className="space-y-1">
                              <div>Decision: {entry.details.decision}</div>
                              {entry.details.rationale && (
                                <div>Rationale: {entry.details.rationale}</div>
                              )}
                              {entry.details.alternatives && entry.details.alternatives.length > 0 && (
                                <div>
                                  Alternatives considered: {entry.details.alternatives.join(', ')}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Approval Details */}
                          {entry.details.approver && (
                            <div className="space-y-1">
                              <div>Approver: {entry.details.approver}</div>
                              <div>Status: {entry.details.approved ? 'Approved' : 'Rejected'}</div>
                              {entry.details.feedback && (
                                <div>Feedback: {entry.details.feedback}</div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* No logs message */}
          {(!stageExecution.logs || stageExecution.logs.entries.length === 0) && (
            <div className="text-center py-8 text-text-3 text-sm">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No execution logs available for this stage</p>
            </div>
          )}

          {/* Commits */}
          {stageCommits.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-text-1 mb-3">Commits</h3>
              <div className="space-y-2">
                {stageCommits.map((commit) => (
                  <div
                    key={commit.sha}
                    className="bg-bg-1 rounded-lg p-3 border border-border-1"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-text-1 mb-1">{commit.message}</div>
                        <div className="flex items-center gap-2 text-xs text-text-3">
                          <span className="font-mono">{commit.sha.substring(0, 7)}</span>
                          <span>•</span>
                          <span>${commit.cost.totalCost.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    {commit.filesChanged > 0 && (
                      <div className="text-xs text-text-3">
                        {commit.filesChanged} file{commit.filesChanged !== 1 ? 's' : ''} changed
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
