import { useState } from 'react';
import { Check, Circle, Clock, SkipForward, AlertCircle, ChevronRight } from 'lucide-react';
import type { Mission, Team, PipelineStageExecution } from '@/types';
import { useV3DataModel } from '@/hooks/useV3DataModel';
import { StageDetailPanel } from './StageDetailPanel';

interface PipelineExecutionViewerProps {
  mission: Mission;
  team: Team;
}

export function PipelineExecutionViewer({ mission, team }: PipelineExecutionViewerProps) {
  const { agents } = useV3DataModel();
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [showStageDetail, setShowStageDetail] = useState(false);

  if (!mission.pipelineExecution) {
    return (
      <div className="p-6 text-center text-text-3">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Pipeline execution not started</p>
      </div>
    );
  }

  if (!team.pipeline) {
    return (
      <div className="p-6 text-center text-text-3">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No pipeline configuration found for this team</p>
      </div>
    );
  }

  const { pipelineExecution } = mission;

  const selectedStageExec = selectedStageId
    ? pipelineExecution.stages.find(s => s.stageId === selectedStageId)
    : null;

  const selectedStageConfig = selectedStageId
    ? team.pipeline.stages.find(s => s.id === selectedStageId)
    : null;

  return (
    <div className="p-6 space-y-6">
      {/* Pipeline Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-1">{team.pipeline.name}</h3>
          <p className="text-sm text-text-3">{team.pipeline.description}</p>
        </div>
        <div className="text-right text-sm">
          <div className="text-text-3">Total Cost</div>
          <div className="text-lg font-semibold text-text-1">
            ${pipelineExecution.totalCost.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Pipeline Flow Visualization */}
      <div className="relative">
        {pipelineExecution.stages.map((stageExec, index) => {
          const stageConfig = team.pipeline!.stages.find(s => s.id === stageExec.stageId);
          if (!stageConfig) return null;

          const icon = getStageIcon(stageExec.status);
          const isLast = index === pipelineExecution.stages.length - 1;

          return (
            <div key={stageExec.stageId} className="relative">
              {/* Stage Card */}
              <button
                onClick={() => {
                  setSelectedStageId(stageExec.stageId);
                  setShowStageDetail(true);
                }}
                className={`
                  w-full text-left p-4 rounded-lg border-2 mb-4 transition-all hover:shadow-md
                  ${stageExec.status === 'active' ? 'border-accent-blue bg-accent-blue/5 hover:bg-accent-blue/10' : ''}
                  ${stageExec.status === 'completed' ? 'border-accent-green bg-bg-1 hover:bg-bg-2' : ''}
                  ${stageExec.status === 'pending' ? 'border-border-1 bg-bg-1 opacity-60 hover:opacity-70' : ''}
                  ${stageExec.status === 'skipped' ? 'border-border-1 bg-bg-1 opacity-40 hover:opacity-50' : ''}
                  ${stageExec.status === 'blocked' ? 'border-accent-red bg-accent-red/5 hover:bg-accent-red/10' : ''}
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Status Icon */}
                  <div className={`
                    p-2 rounded-lg flex-shrink-0
                    ${stageExec.status === 'active' ? 'bg-accent-blue text-white' : ''}
                    ${stageExec.status === 'completed' ? 'bg-accent-green text-white' : ''}
                    ${stageExec.status === 'pending' ? 'bg-bg-2 text-text-3' : ''}
                    ${stageExec.status === 'skipped' ? 'bg-bg-2 text-text-3' : ''}
                    ${stageExec.status === 'blocked' ? 'bg-accent-red text-white' : ''}
                  `}>
                    {icon}
                  </div>

                  {/* Stage Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-semibold text-text-1">
                        {stageConfig.name}
                      </h4>
                      <span className={`
                        text-xs px-2 py-0.5 rounded font-medium
                        ${stageExec.status === 'active' ? 'bg-accent-blue/20 text-accent-blue' : ''}
                        ${stageExec.status === 'completed' ? 'bg-accent-green/20 text-accent-green' : ''}
                        ${stageExec.status === 'pending' ? 'bg-bg-2 text-text-3' : ''}
                        ${stageExec.status === 'skipped' ? 'bg-bg-2 text-text-3' : ''}
                        ${stageExec.status === 'blocked' ? 'bg-accent-red/20 text-accent-red' : ''}
                      `}>
                        {stageExec.status}
                      </span>
                    </div>

                    {stageConfig.description && (
                      <p className="text-xs text-text-3 mb-3">{stageConfig.description}</p>
                    )}

                    {/* Stage Metrics */}
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <div className="text-text-3 mb-0.5">Duration</div>
                        <div className="font-medium text-text-1">
                          {stageExec.completedAt && stageExec.startedAt
                            ? formatDuration(stageExec.startedAt, stageExec.completedAt)
                            : stageExec.startedAt
                            ? formatDuration(stageExec.startedAt, new Date().toISOString())
                            : '-'}
                        </div>
                      </div>
                      <div>
                        <div className="text-text-3 mb-0.5">Commits</div>
                        <div className="font-medium text-text-1">{stageExec.commits.length}</div>
                      </div>
                      <div>
                        <div className="text-text-3 mb-0.5">Cost</div>
                        <div className="font-medium text-text-1">${stageExec.cost.toFixed(2)}</div>
                      </div>
                    </div>

                    {/* Active Agents */}
                    {stageExec.activeAgentIds.length > 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs text-text-3">Active:</span>
                        <div className="flex -space-x-2">
                          {stageExec.activeAgentIds.map(agentId => {
                            const agent = agents.find(a => a.id === agentId);
                            return agent ? (
                              <div
                                key={agentId}
                                className="w-6 h-6 rounded-full bg-bg-2 border-2 border-bg-0 flex items-center justify-center"
                                title={agent.name}
                              >
                                <span className="text-xs">{agent.emoji}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Notes for skipped/blocked */}
                    {stageExec.notes && (
                      <div className="mt-2 p-2 bg-bg-2 rounded text-xs text-text-2">
                        {stageExec.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Click Indicator */}
                <div className="mt-3 pt-3 border-t border-border-1 flex items-center justify-between text-xs text-text-3">
                  <span>Click to view execution logs</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* Connector Line */}
              {!isLast && (
                <div className="absolute left-8 top-full w-0.5 h-4 -mt-4 bg-border-1" />
              )}
            </div>
          );
        })}
      </div>

      {/* Stage Detail Panel */}
      {showStageDetail && selectedStageExec && selectedStageConfig && (
        <StageDetailPanel
          mission={mission}
          stageExecution={selectedStageExec}
          stageConfig={selectedStageConfig}
          onClose={() => {
            setShowStageDetail(false);
            setSelectedStageId(null);
          }}
        />
      )}
    </div>
  );
}

function getStageIcon(status: PipelineStageExecution['status']) {
  switch (status) {
    case 'completed':
      return <Check className="w-4 h-4" />;
    case 'active':
      return <Clock className="w-4 h-4 animate-pulse" />;
    case 'pending':
      return <Circle className="w-4 h-4" />;
    case 'skipped':
      return <SkipForward className="w-4 h-4" />;
    case 'blocked':
      return <AlertCircle className="w-4 h-4" />;
  }
}

function formatDuration(start: string, end: string): string {
  const diff = new Date(end).getTime() - new Date(start).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
