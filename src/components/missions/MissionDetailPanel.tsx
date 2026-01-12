import { useState } from 'react';
import { X, Users, DollarSign, Clock, MessageSquare, FileText, TrendingUp, GitBranch, Maximize2 } from 'lucide-react';
import type { Mission } from '@/types';
import { useV3DataModel } from '@/hooks/useV3DataModel';
import { PipelineExecutionViewer } from './PipelineExecutionViewer';

interface MissionDetailPanelProps {
  mission: Mission;
  onClose: () => void;
  onExpand?: () => void;
}

type TabId = 'summary' | 'pipeline';

export function MissionDetailPanel({ mission, onClose, onExpand }: MissionDetailPanelProps) {
  const { agents, teams } = useV3DataModel();
  const [activeTab, setActiveTab] = useState<TabId>('summary');

  // Get mission team
  const team = teams.find(t => t.id === mission.teamId);

  // Get mission agents
  const missionAgents = mission.agents
    .map(ma => {
      const agent = agents.find(a => a.id === ma.agentId);
      return agent ? { ...agent, role: ma.role, contribution: ma.contribution } : null;
    })
    .filter(Boolean);

  // Format timestamp
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return 'Not started';
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get status color
  const getStatusColor = () => {
    switch (mission.status) {
      case 'backlog':
        return 'text-text-3';
      case 'planning':
        return 'text-accent-amber';
      case 'executing':
        return 'text-accent-blue';
      case 'complete':
        return 'text-accent-green';
      case 'blocked':
        return 'text-accent-red';
      default:
        return 'text-text-3';
    }
  };

  return (
    <div className="h-full flex flex-col bg-bg-0 border-l border-border-1">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-text-1 mb-1 line-clamp-2">
              {mission.title}
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <span className={`font-semibold capitalize ${getStatusColor()}`}>
                {mission.status}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-1">
            {onExpand && (
              <button
                onClick={onExpand}
                className="p-1.5 hover:bg-bg-1 rounded transition-colors"
                aria-label="Expand details"
                title="Expand details"
              >
                <Maximize2 className="w-5 h-5 text-text-3" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-bg-1 rounded transition-colors"
              aria-label="Close panel"
            >
              <X className="w-5 h-5 text-text-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex-shrink-0 flex items-center gap-1 px-4 py-2 border-b border-border-1 bg-bg-0">
        <button
          onClick={() => setActiveTab('summary')}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors
            ${activeTab === 'summary'
              ? 'bg-accent-blue/10 text-accent-blue'
              : 'text-text-2 hover:bg-bg-1 hover:text-text-1'
            }
          `}
        >
          <FileText className="w-4 h-4" />
          <span>Summary</span>
        </button>
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors
            ${activeTab === 'pipeline'
              ? 'bg-accent-blue/10 text-accent-blue'
              : 'text-text-2 hover:bg-bg-1 hover:text-text-1'
            }
          `}
        >
          <GitBranch className="w-4 h-4" />
          <span>Pipeline</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'summary' && (
          <div className="p-4 space-y-6">
        {/* Progress */}
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-text-2 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span>Progress</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-3">Overall</span>
              <span className="font-medium text-text-1">{mission.progress}%</span>
            </div>
            <div className="w-full h-2 bg-bg-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-green rounded-full transition-all"
                style={{ width: `${mission.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Intent */}
        {mission.intent && (
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-text-2 mb-2">
              <FileText className="w-4 h-4" />
              <span>Intent</span>
            </div>
            <p className="text-sm text-text-1 leading-relaxed bg-bg-1 p-3 rounded-lg border border-border-1">
              {mission.intent.description}
            </p>
            {mission.intent.confidence !== undefined && (
              <div className="mt-2 text-xs text-text-3">
                Confidence: <span className="font-medium text-text-2">{mission.intent.confidence}%</span>
              </div>
            )}
          </div>
        )}

        {/* Plan Summary */}
        {mission.plan && (
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-text-2 mb-2">
              <FileText className="w-4 h-4" />
              <span>Plan</span>
            </div>
            <div className="bg-bg-1 p-3 rounded-lg border border-border-1 space-y-2">
              <p className="text-sm text-text-1">{mission.plan.summary}</p>
              <div className="flex items-center gap-4 text-xs text-text-3 pt-2 border-t border-border-1">
                <span>{mission.plan.tasks.length} tasks</span>
              </div>
            </div>
          </div>
        )}

        {/* Team */}
        {missionAgents.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-text-2 mb-2">
              <Users className="w-4 h-4" />
              <span>Team</span>
            </div>
            <div className="space-y-2">
              {missionAgents.map(agent => (
                agent && (
                  <div
                    key={agent.id}
                    className="flex items-start gap-3 p-2 bg-bg-1 rounded-lg border border-border-1"
                  >
                    <div className="w-8 h-8 rounded-full bg-bg-2 border border-border-1 flex items-center justify-center text-base flex-shrink-0">
                      {agent.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-text-1">{agent.name}</div>
                      <div className="text-xs text-text-3 capitalize">{agent.role}</div>
                      {agent.contribution && (
                        <div className="text-xs text-text-3 mt-1">
                          ${agent.contribution.cost.toFixed(2)} • {agent.contribution.commits} commits
                        </div>
                      )}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Conversation */}
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-text-2 mb-2">
            <MessageSquare className="w-4 h-4" />
            <span>Conversation</span>
          </div>
          <div className="bg-bg-1 p-3 rounded-lg border border-border-1 space-y-2">
            <div className="text-sm text-text-1">
              {mission.conversation.messages.length} messages
            </div>
            <div className="flex items-center gap-4 text-xs text-text-3">
              <span>{mission.conversation.decisions.length} decisions</span>
              <span>•</span>
              <span>{mission.conversation.openQuestions.length} questions</span>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div>
          <div className="text-sm font-medium text-text-2 mb-2">Metadata</div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-text-3" />
              <span className="text-text-3">Cost:</span>
              <span className="font-medium text-accent-green">${mission.cost.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-text-3" />
              <span className="text-text-3">Started:</span>
              <span className="text-text-2">{formatTime(mission.startedAt)}</span>
            </div>
            {mission.completedAt && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-text-3" />
                <span className="text-text-3">Completed:</span>
                <span className="text-text-2">{formatTime(mission.completedAt)}</span>
              </div>
            )}
          </div>
        </div>
          </div>
        )}

        {/* Pipeline Tab */}
        {activeTab === 'pipeline' && team && (
          <PipelineExecutionViewer mission={mission} team={team} />
        )}

        {activeTab === 'pipeline' && !team && (
          <div className="p-6 text-center text-text-3">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Team information not found</p>
          </div>
        )}
      </div>
    </div>
  );
}
